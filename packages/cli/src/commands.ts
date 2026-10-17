import { randomBytes } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { jsonToPayload } from "@arkiv-network/sdk";
import type { Hex } from "viem";
import {
  commitContext,
  createBranch,
  createRepo,
  decodeInvite,
  encodeInvite,
  findBranch,
  findRepo,
  fromBase64,
  logContext,
  newGroupKey,
  publicClient,
  pullContext,
  readConfig,
  renderLogLine,
  shortHex,
  toBase64,
  walletContext,
  writeConfig,
  writeContextFile,
} from "@cogit/core";

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
  const { wallet, pub, address, account } = walletContext();
  const details = opts.detailsFile !== undefined ? readFileSync(opts.detailsFile, "utf8") : "";
  const result = await commitContext({
    wallet,
    pub,
    account,
    address,
    config,
    input: { message: opts.message, details, kind: opts.kind, tags: opts.tags, agent: "human" },
  });
  console.log(`committed ${shortHex(result.commitHash, 12)} to ${result.branch} (${result.kind})`);
}

export interface PullOptions {
  out?: string | undefined;
  kind?: string | undefined;
  tag?: string | undefined;
}

export async function runPull(branchName: string, opts: PullOptions): Promise<void> {
  const config = readConfig();
  const pub = publicClient();
  const result = await pullContext({ pub, config, branch: branchName, kind: opts.kind, tag: opts.tag });
  if (!result.membersChecked) {
    console.warn(`warning: repo ${config.repoId} not found on chain — skipping membership check`);
  }
  const outPath = opts.out ?? writeContextFile(branchName, result.markdown);
  if (opts.out !== undefined) {
    writeFileSync(outPath, result.markdown);
  }
  console.log(result.markdown);
  console.error(`(${result.verified} verified commit(s) → ${outPath})`);
}

export interface LogOptions {
  branch?: string | undefined;
}

export async function runLog(opts: LogOptions): Promise<void> {
  const config = readConfig();
  const pub = publicClient();
  const rows = await logContext({ pub, config, branch: opts.branch });
  if (rows.length === 0) {
    console.log("no commits found");
    return;
  }
  for (const row of rows) {
    console.log(renderLogLine(row));
  }
}
