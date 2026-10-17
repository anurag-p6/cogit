import { randomBytes } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { jsonToPayload } from "@arkiv-network/sdk";
import type { Hex } from "viem";
import {
  KIND_EXPIRY_DAYS,
  buildCommitEnvelope,
  createBranch,
  createCommit,
  createRepo,
  decodeInvite,
  decryptBody,
  encodeInvite,
  findBranch,
  findRepo,
  fromBase64,
  listCommits,
  newGroupKey,
  toBase64,
  updateBranchHead,
  verifyEnvelope,
  type CommitBody,
  type CommitKind,
} from "@cogit/core";
import { publicClient, walletContext } from "./clients.js";
import { renderCommitSection, renderLogLine, renderPullMarkdown, shortHex } from "./render.js";
import { readConfig, writeConfig, writeContextFile } from "./store.js";

const KINDS = Object.keys(KIND_EXPIRY_DAYS) as CommitKind[];
const MAX_DETAILS_BYTES = 96 * 1024;

function assertKind(kind: string): CommitKind {
  if (!(KINDS as string[]).includes(kind)) {
    throw new Error(`invalid kind "${kind}" — one of: ${KINDS.join(", ")}`);
  }
  return kind as CommitKind;
}

function capDetails(details: string): string {
  if (Buffer.byteLength(details, "utf8") <= MAX_DETAILS_BYTES) {
    return details;
  }
  const truncated = Buffer.from(details, "utf8").subarray(0, MAX_DETAILS_BYTES).toString("utf8");
  return `${truncated}\n\n... [truncated by cogit to fit Arkiv's payload limit]`;
}

export async function runInit(name: string): Promise<void> {
  const { wallet, address } = walletContext();
  const repoId = randomBytes(8).toString("hex");
  const groupKey = newGroupKey();
  await createRepo(wallet, { repoId, name, owner: address, members: [address] });
  await createBranch(wallet, { repoId, name: "main", owner: address, head: "" });
  const path = writeConfig({ repoId, name, branch: "main", groupKey: toBase64(groupKey) });
  console.log(`initialized repo "${name}" (${repoId}) owned by ${shortHex(address, 10)}`);
  console.log(`config written to ${path}`);
}

export async function runInvite(address: string): Promise<void> {
  const config = readConfig();
  const { pub, wallet } = walletContext();
  const repo = await findRepo(pub, config.repoId);
  if (repo === null) {
    throw new Error(`repo ${config.repoId} not found on chain — are you on the right network?`);
  }
  if (!repo.members.some((m) => m.toLowerCase() === address.toLowerCase())) {
    await wallet.patchEntity({
      entityKey: repo.key as Hex,
      payload: jsonToPayload({ name: repo.name, members: [...repo.members, address] }),
    });
    console.log(`added ${address} to repo members`);
  } else {
    console.log(`${address} is already a member`);
  }
  console.log("invite (send privately — it contains the group key):");
  console.log(`  ${encodeInvite(config.repoId, fromBase64(config.groupKey))}`);
}

export async function runJoin(invite: string): Promise<void> {
  const { repoId, groupKey } = decodeInvite(invite);
  const pub = publicClient();
  const repo = await findRepo(pub, repoId);
  if (repo === null) {
    throw new Error(`repo ${repoId} not found on chain — wrong network or invite?`);
  }
  const path = writeConfig({ repoId, name: repo.name, branch: "main", groupKey: toBase64(groupKey) });
  console.log(`joined repo "${repo.name}" (${repoId}) with ${repo.members.length} member(s)`);
  console.log(`config written to ${path}`);
}

export async function runBranch(name: string): Promise<void> {
  const config = readConfig();
  const { pub, wallet, address } = walletContext();
  if ((await findBranch(pub, config.repoId, name)) !== null) {
    throw new Error(`branch "${name}" already exists`);
  }
  const current = await findBranch(pub, config.repoId, config.branch);
  await createBranch(wallet, {
    repoId: config.repoId,
    name,
    owner: address,
    head: "",
    forkedFrom: current?.head ? current.head : null,
  });
  const origin = current?.head
    ? `forked from ${config.branch} @ ${shortHex(current.head)}`
    : `(${config.branch} has no commits yet)`;
  console.log(`created branch "${name}" ${origin}`);
}

export async function runUse(name: string): Promise<void> {
  const config = readConfig();
  const pub = publicClient();
  if ((await findBranch(pub, config.repoId, name)) === null) {
    console.warn(`note: branch "${name}" does not exist on chain yet — your first commit will create it`);
  }
  writeConfig({ ...config, branch: name });
  console.log(`now on branch "${name}"`);
}

export interface CommitOptions {
  message: string;
  detailsFile?: string | undefined;
  kind: string;
  tags: string[];
}

export async function runCommit(opts: CommitOptions): Promise<void> {
  const config = readConfig();
  const { pub, wallet, address, account } = walletContext();
  const kind = assertKind(opts.kind);
  let branch = await findBranch(pub, config.repoId, config.branch);
  if (branch === null) {
    await createBranch(wallet, { repoId: config.repoId, name: config.branch, owner: address, head: "" });
    branch = await findBranch(pub, config.repoId, config.branch);
    if (branch === null) {
      throw new Error(`could not create branch "${config.branch}"`);
    }
  }
  const details = opts.detailsFile !== undefined ? readFileSync(opts.detailsFile, "utf8") : "";
  const body: CommitBody = { summary: opts.message, details: capDetails(details), tags: opts.tags };
  const envelope = await buildCommitEnvelope({
    repoId: config.repoId,
    branch: branch.name,
    parent: branch.head === "" ? null : branch.head,
    account,
    agent: "human",
    kind,
    body,
    groupKey: fromBase64(config.groupKey),
  });
  await createCommit(wallet, envelope);
  await updateBranchHead(wallet, branch.key, envelope.commitHash);
  console.log(`committed ${shortHex(envelope.commitHash, 12)} to ${branch.name} (${kind})`);
}

export interface PullOptions {
  out?: string | undefined;
  kind?: string | undefined;
  tag?: string | undefined;
}

export async function runPull(branchName: string, opts: PullOptions): Promise<void> {
  const config = readConfig();
  const pub = publicClient();
  const repo = await findRepo(pub, config.repoId);
  if (repo === null) {
    console.warn(`warning: repo ${config.repoId} not found on chain — skipping membership check`);
  }
  const members = repo === null ? undefined : repo.members;
  const kind = opts.kind === undefined ? undefined : assertKind(opts.kind);
  const groupKey = fromBase64(config.groupKey);
  const records = await listCommits(pub, config.repoId, branchName);
  const sections: string[] = [];
  let invalid = 0;
  for (const record of records) {
    const result = await verifyEnvelope(record.envelope, { owner: record.owner, members });
    if (!result.ok) {
      invalid += 1;
      continue;
    }
    if (kind !== undefined && record.envelope.kind !== kind) {
      continue;
    }
    const body = decryptBody(record.envelope.nonce, record.envelope.ciphertext, groupKey);
    if (opts.tag !== undefined && !body.tags.includes(opts.tag)) {
      continue;
    }
    sections.push(renderCommitSection(record.envelope, body));
  }
  const markdown = renderPullMarkdown(config.name, branchName, sections, invalid);
  const outPath = opts.out ?? writeContextFile(branchName, markdown);
  if (opts.out !== undefined) {
    writeFileSync(outPath, markdown);
  }
  console.log(markdown);
  console.error(`(${sections.length} verified commit(s) → ${outPath})`);
}

export interface LogOptions {
  branch?: string | undefined;
}

export async function runLog(opts: LogOptions): Promise<void> {
  const config = readConfig();
  const pub = publicClient();
  const repo = await findRepo(pub, config.repoId);
  const members = repo === null ? undefined : repo.members;
  const groupKey = fromBase64(config.groupKey);
  const records = await listCommits(pub, config.repoId, opts.branch);
  if (records.length === 0) {
    console.log("no commits found");
    return;
  }
  for (const record of records) {
    const result = await verifyEnvelope(record.envelope, { owner: record.owner, members });
    let body: CommitBody | undefined;
    if (result.ok) {
      try {
        body = decryptBody(record.envelope.nonce, record.envelope.ciphertext, groupKey);
      } catch {
        body = undefined;
      }
    }
    console.log(renderLogLine(record, result, body));
  }
}
