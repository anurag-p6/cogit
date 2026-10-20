import { createPublicClient, type PublicArkivClient } from "@arkiv-network/sdk";
import { tiramisu } from "@arkiv-network/sdk/chains";
import { and, eq } from "@arkiv-network/sdk/query";
import { http } from "viem";
import { decryptBody } from "./crypto";
import type {
  BlockTiming,
  BranchEntry,
  CommitBody,
  CommitEnvelope,
  CommitEntry,
  CommitKind,
  RepoMeta,
  ViewerData,
} from "./types";
import { verifyEnvelope } from "./verify";

const KINDS: readonly CommitKind[] = ["scratch", "note", "decision", "milestone"];

interface RawEntity {
  key: string;
  owner: string;
  createdAt?: bigint | number;
  expiresAt?: bigint | number;
  attributes?: Record<string, unknown>;
  toText: () => string;
  toJson: () => unknown;
}

let client: PublicArkivClient | null = null;

function getClient(): PublicArkivClient {
  if (client === null) {
    client = createPublicClient({
      chain: tiramisu,
      transport: http(process.env.NEXT_PUBLIC_ARKIV_RPC_URL),
    }) as PublicArkivClient;
  }
  return client;
}

function toNumber(value: bigint | number | undefined): number {
  if (value === undefined) {
    return 0;
  }
  return typeof value === "bigint" ? Number(value) : value;
}

function attrValue(entity: RawEntity, name: string): unknown {
  const value = entity.attributes?.[name];
  if (value !== undefined && typeof value === "object" && value !== null && "value" in value) {
    return (value as { value: unknown }).value;
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "bigint") {
    return value;
  }
  return undefined;
}

function parseEnvelope(payload: string): CommitEnvelope {
  const raw = JSON.parse(payload) as Record<string, unknown>;
  if (raw.v !== 1) {
    throw new Error(`unsupported envelope version: ${String(raw.v)}`);
  }
  for (const key of [
    "repoId",
    "branch",
    "author",
    "kind",
    "nonce",
    "ciphertext",
    "commitHash",
    "sig",
  ] as const) {
    if (typeof raw[key] !== "string") {
      throw new Error(`envelope field ${key} must be a string`);
    }
  }
  if (typeof raw.ts !== "number" || !Number.isFinite(raw.ts)) {
    throw new Error("envelope field ts must be a finite number");
  }
  if (raw.parent !== null && typeof raw.parent !== "string") {
    throw new Error("envelope field parent must be a string or null");
  }
  if (!KINDS.includes(raw.kind as CommitKind)) {
    throw new Error(`unknown commit kind: ${String(raw.kind)}`);
  }
  if (typeof raw.agent !== "string" || raw.agent === "") {
    throw new Error("envelope field agent must be a non-empty string");
  }
  return raw as unknown as CommitEnvelope;
}

export class RepoNotFoundError extends Error {
  constructor(repoId: string) {
    super(`no repo entity found for id ${repoId}`);
    this.name = "RepoNotFoundError";
  }
}

export async function fetchLiveData(
  repoId: string,
  groupKey: Uint8Array | null,
): Promise<ViewerData> {
  const pub = getClient();

  const timing = await pub.getBlockTiming();
  const blockTiming: BlockTiming = {
    currentBlock: toNumber(timing.currentBlock),
    currentBlockTime: timing.currentBlockTime,
    blockDuration: timing.blockDuration,
  };

  const repoPage = await pub
    .select("*")
    .where(and(eq("type", "repo"), eq("repo_id", repoId)))
    .limit(1)
    .fetch();
  const repoEntity = repoPage.entities[0] as unknown as RawEntity | undefined;
  if (repoEntity === undefined) {
    throw new RepoNotFoundError(repoId);
  }
  const repoJson = repoEntity.toJson() as { name?: unknown; members?: unknown };
  const repo: RepoMeta = {
    id: repoId,
    name: typeof repoJson.name === "string" ? repoJson.name : repoId,
    owner: repoEntity.owner,
    members: Array.isArray(repoJson.members)
      ? repoJson.members.filter((m): m is string => typeof m === "string")
      : [],
    entityKey: repoEntity.key,
    createdAtBlock: toNumber(repoEntity.createdAt),
    expiresAtBlock: toNumber(repoEntity.expiresAt),
  };

  const branches: BranchEntry[] = [];
  for await (const entity of pub
    .select("*")
    .where(and(eq("type", "branch"), eq("repo_id", repoId)))) {
    const raw = entity as unknown as RawEntity;
    const name = attrValue(raw, "name");
    const head = attrValue(raw, "head");
    const forkedFrom = attrValue(raw, "forked_from");
    const owner = attrValue(raw, "owner");
    branches.push({
      key: raw.key,
      name: typeof name === "string" ? name : "",
      owner: typeof owner === "string" ? owner : raw.owner,
      head: typeof head === "string" ? head : "",
      forkedFrom: typeof forkedFrom === "string" ? forkedFrom : null,
      createdAtBlock: toNumber(raw.createdAt),
      expiresAtBlock: toNumber(raw.expiresAt),
    });
  }
  branches.sort((a, b) => a.createdAtBlock - b.createdAtBlock);

  const commits: CommitEntry[] = [];
  for await (const entity of pub
    .select("*")
    .where(and(eq("type", "commit"), eq("repo_id", repoId)))) {
    const raw = entity as unknown as RawEntity;
    let envelope: CommitEnvelope;
    try {
      envelope = parseEnvelope(raw.toText());
    } catch {
      continue;
    }
    const verified = await verifyEnvelope(envelope, {
      owner: raw.owner,
      members: repo.members,
    });
    let body: CommitBody | null = null;
    let locked = false;
    if (verified.ok) {
      if (groupKey !== null) {
        try {
          body = decryptBody(envelope.nonce, envelope.ciphertext, groupKey);
        } catch {
          locked = true;
        }
      } else {
        locked = true;
      }
    }
    commits.push({
      id: envelope.commitHash,
      entityKey: raw.key,
      owner: raw.owner,
      envelope,
      body,
      locked,
      status: verified.ok ? "verified" : "invalid",
      reason: verified.reason,
      detail: verified.detail,
      checks: verified.checks,
      createdAtBlock: toNumber(raw.createdAt),
      expiresAtBlock: toNumber(raw.expiresAt),
    });
  }
  commits.sort((a, b) => b.envelope.ts - a.envelope.ts);

  return { source: "live", repo, branches, commits, blockTiming, labels: {} };
}
