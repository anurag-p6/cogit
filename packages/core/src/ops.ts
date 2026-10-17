import type { PublicArkivClient, WalletArkivClient } from "@arkiv-network/sdk";
import type { LocalAccount } from "viem";
import {
  createBranch,
  createCommit,
  findBranch,
  findRepo,
  listCommits,
  updateBranchHead,
} from "./arkiv.js";
import { KIND_EXPIRY_DAYS } from "./config.js";
import { decryptBody, fromBase64 } from "./crypto.js";
import { buildCommitEnvelope } from "./envelope.js";
import { renderCommitSection, renderPullMarkdown } from "./render.js";
import type { CommitBody, CommitKind, LogRow, RepoConfig } from "./types.js";
import { verifyEnvelope } from "./verify.js";

export const MAX_DETAILS_BYTES = 96 * 1024;

export function capDetails(details: string): string {
  if (Buffer.byteLength(details, "utf8") <= MAX_DETAILS_BYTES) {
    return details;
  }
  const truncated = Buffer.from(details, "utf8").subarray(0, MAX_DETAILS_BYTES).toString("utf8");
  return `${truncated}\n\n... [truncated by cogit to fit Arkiv's payload limit]`;
}

export function assertKind(kind: string): CommitKind {
  const kinds = Object.keys(KIND_EXPIRY_DAYS) as CommitKind[];
  if (!(kinds as string[]).includes(kind)) {
    throw new Error(`invalid kind "${kind}" — one of: ${kinds.join(", ")}`);
  }
  return kind as CommitKind;
}

export interface CommitInput {
  message: string;
  details?: string;
  kind?: string;
  tags?: string[];
  agent?: string;
}

export interface CommitContextArgs {
  wallet: WalletArkivClient;
  pub: PublicArkivClient;
  account: LocalAccount;
  address: string;
  config: RepoConfig;
  input: CommitInput;
}

export interface CommitContextResult {
  commitHash: string;
  branch: string;
  kind: CommitKind;
  parent: string | null;
  ts: number;
  entityKey: string;
}

export async function commitContext(args: CommitContextArgs): Promise<CommitContextResult> {
  const { wallet, pub, account, address, config, input } = args;
  const kind = assertKind(input.kind ?? "note");
  let branch = await findBranch(pub, config.repoId, config.branch);
  if (branch === null) {
    await createBranch(wallet, { repoId: config.repoId, name: config.branch, owner: address, head: "" });
    branch = await findBranch(pub, config.repoId, config.branch);
    if (branch === null) {
      throw new Error(`could not create branch "${config.branch}"`);
    }
  } else if (branch.owner.toLowerCase() !== address.toLowerCase()) {
    throw new Error(
      `branch "${branch.name}" is owned by ${branch.owner} — Arkiv branch heads can only be advanced by the branch owner's wallet. ` +
        `Commit to your own branch instead: \`cogit branch <your-name>\` then \`cogit use <your-name>\`.`,
    );
  }
  const body: CommitBody = {
    summary: input.message,
    details: capDetails(input.details ?? ""),
    tags: input.tags ?? [],
  };
  const envelope = await buildCommitEnvelope({
    repoId: config.repoId,
    branch: branch.name,
    parent: branch.head === "" ? null : branch.head,
    account,
    agent: input.agent ?? "human",
    kind,
    body,
    groupKey: fromBase64(config.groupKey),
  });
  const entityKey = await createCommit(wallet, envelope);
  await updateBranchHead(wallet, branch.key, envelope.commitHash);
  return {
    commitHash: envelope.commitHash,
    branch: branch.name,
    kind,
    parent: envelope.parent,
    ts: envelope.ts,
    entityKey,
  };
}

export interface PullContextArgs {
  pub: PublicArkivClient;
  config: RepoConfig;
  branch: string;
  kind?: string;
  tag?: string;
}

export interface PullContextResult {
  markdown: string;
  verified: number;
  invalid: number;
  membersChecked: boolean;
}

export async function pullContext(args: PullContextArgs): Promise<PullContextResult> {
  const { pub, config, branch, kind: kindArg, tag } = args;
  const repo = await findRepo(pub, config.repoId);
  const members = repo === null ? undefined : repo.members;
  const kind = kindArg === undefined ? undefined : assertKind(kindArg);
  const groupKey = fromBase64(config.groupKey);
  const records = await listCommits(pub, config.repoId, branch);
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
    if (tag !== undefined && !body.tags.includes(tag)) {
      continue;
    }
    sections.push(renderCommitSection(record.envelope, body));
  }
  return {
    markdown: renderPullMarkdown(config.name, branch, sections, invalid),
    verified: sections.length,
    invalid,
    membersChecked: repo !== null,
  };
}

export interface LogContextArgs {
  pub: PublicArkivClient;
  config: RepoConfig;
  branch?: string;
  limit?: number;
}

export async function logContext(args: LogContextArgs): Promise<LogRow[]> {
  const { pub, config, branch, limit } = args;
  const repo = await findRepo(pub, config.repoId);
  const members = repo === null ? undefined : repo.members;
  const groupKey = fromBase64(config.groupKey);
  const records = await listCommits(pub, config.repoId, branch);
  const rows: LogRow[] = [];
  for (const record of records) {
    const env = record.envelope;
    const result = await verifyEnvelope(env, { owner: record.owner, members });
    if (result.ok) {
      const row: LogRow = {
        commitHash: env.commitHash,
        ts: env.ts,
        kind: env.kind,
        branch: env.branch,
        author: env.author,
        agent: env.agent,
        parent: env.parent,
        status: "verified",
      };
      try {
        const body = decryptBody(env.nonce, env.ciphertext, groupKey);
        row.summary = body.summary;
        row.tags = body.tags;
      } catch {
        row.detail = "verified, but body could not be decrypted with the current group key";
      }
      rows.push(row);
    } else {
      rows.push({
        commitHash: env.commitHash,
        ts: env.ts,
        kind: env.kind,
        branch: env.branch,
        author: env.author,
        agent: env.agent,
        parent: env.parent,
        status: "invalid",
        reason: result.reason,
        detail: result.detail,
      });
    }
  }
  return limit !== undefined ? rows.slice(-limit) : rows;
}
