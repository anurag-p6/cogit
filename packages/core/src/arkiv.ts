import {
  ExpirationTime,
  addr,
  jsonToPayload,
  u64,
  type AttributeInputs,
  type Entity,
  type FullEntity,
  type PublicArkivClient,
  type WalletArkivClient,
} from "@arkiv-network/sdk";
import { and, eq } from "@arkiv-network/sdk/query";
import type { Address, Hex } from "viem";
import { expiryForKind } from "./config.js";
import { parseCommitEnvelope } from "./envelope.js";
import type { CommitEnvelope } from "./types.js";

export interface RepoRecord {
  key: string;
  owner: string;
  name: string;
  members: string[];
}

export interface BranchRecord {
  key: string;
  name: string;
  owner: string;
  head: string;
  forkedFrom: string | null;
}

export interface CommitRecord {
  key: string;
  owner: string;
  envelope: CommitEnvelope;
}

function attrValue(entity: Entity, name: string): unknown {
  const value = entity.attributes?.[name];
  if (value !== undefined && typeof value === "object" && "value" in value) {
    return (value as { value: unknown }).value;
  }
  return undefined;
}

export async function createRepo(
  wallet: WalletArkivClient,
  input: { repoId: string; name: string; owner: string; members: string[] },
): Promise<string> {
  const { entityKey } = await wallet.createEntity({
    payload: jsonToPayload({ name: input.name, members: input.members }),
    contentType: "application/json",
    attributes: { type: "repo", repo_id: input.repoId, owner: addr(input.owner as Address) },
    expires: ExpirationTime.fromDays(365),
  });
  return entityKey;
}

export async function createBranch(
  wallet: WalletArkivClient,
  input: { repoId: string; name: string; owner: string; head: string; forkedFrom?: string | null },
): Promise<string> {
  const attributes: AttributeInputs = {
    type: "branch",
    repo_id: input.repoId,
    name: input.name,
    owner: addr(input.owner as Address),
    ...(input.head ? { head: input.head } : {}),
    ...(input.forkedFrom ? { forked_from: input.forkedFrom } : {}),
  };
  const { entityKey } = await wallet.createEntity({
    payload: new Uint8Array(),
    contentType: "application/octet-stream",
    attributes,
    expires: ExpirationTime.fromDays(365),
  });
  return entityKey;
}

export async function updateBranchHead(
  wallet: WalletArkivClient,
  branchKey: string,
  head: string,
): Promise<void> {
  await wallet.patchEntity({ entityKey: branchKey as Hex, set: { head } });
  await wallet.extendEntity({ entityKey: branchKey as Hex, expires: ExpirationTime.fromDays(365) });
}

export async function createCommit(wallet: WalletArkivClient, envelope: CommitEnvelope): Promise<string> {
  const attributes: AttributeInputs = {
    type: "commit",
    repo_id: envelope.repoId,
    branch: envelope.branch,
    kind: envelope.kind,
    author: addr(envelope.author as Address),
    ts: u64(BigInt(envelope.ts)),
    commit_hash: envelope.commitHash,
    ...(envelope.parent !== null ? { parent: envelope.parent } : {}),
  };
  const { entityKey } = await wallet.createEntity({
    payload: jsonToPayload(envelope),
    contentType: "application/json",
    attributes,
    expires: expiryForKind(envelope.kind),
  });
  return entityKey;
}

export async function findRepo(pub: PublicArkivClient, repoId: string): Promise<RepoRecord | null> {
  const page = await pub
    .select("*")
    .where(and(eq("type", "repo"), eq("repo_id", repoId)))
    .limit(1)
    .fetch();
  const entity = page.entities[0];
  if (entity === undefined) {
    return null;
  }
  const json = entity.toJson() as { name?: string; members?: string[] };
  return {
    key: entity.key,
    owner: entity.owner,
    name: typeof json.name === "string" ? json.name : "",
    members: Array.isArray(json.members) ? json.members : [],
  };
}

export async function findBranch(
  pub: PublicArkivClient,
  repoId: string,
  name: string,
): Promise<BranchRecord | null> {
  const page = await pub
    .select("*")
    .where(and(eq("type", "branch"), eq("repo_id", repoId), eq("name", name)))
    .limit(1)
    .fetch();
  const entity = page.entities[0];
  if (entity === undefined) {
    return null;
  }
  const forkedFrom = attrValue(entity, "forked_from");
  const head = attrValue(entity, "head");
  return {
    key: entity.key,
    name: String(attrValue(entity, "name")),
    owner: String(attrValue(entity, "owner")),
    head: typeof head === "string" ? head : "",
    forkedFrom: typeof forkedFrom === "string" ? forkedFrom : null,
  };
}

function toCommitRecord(entity: FullEntity): CommitRecord {
  return {
    key: entity.key,
    owner: entity.owner,
    envelope: parseCommitEnvelope(entity.toText()),
  };
}

export async function listCommits(
  pub: PublicArkivClient,
  repoId: string,
  branch?: string,
): Promise<CommitRecord[]> {
  const filter =
    branch === undefined
      ? and(eq("type", "commit"), eq("repo_id", repoId))
      : and(eq("type", "commit"), eq("repo_id", repoId), eq("branch", branch));
  const records: CommitRecord[] = [];
  for await (const entity of pub.select("*").where(filter)) {
    records.push(toCommitRecord(entity));
  }
  records.sort((a, b) => a.envelope.ts - b.envelope.ts);
  return records;
}

export async function findCommitByHash(
  pub: PublicArkivClient,
  repoId: string,
  commitHash: string,
): Promise<CommitRecord | null> {
  const page = await pub
    .select("*")
    .where(and(eq("type", "commit"), eq("repo_id", repoId), eq("commit_hash", commitHash)))
    .limit(1)
    .fetch();
  const entity = page.entities[0];
  return entity === undefined ? null : toCommitRecord(entity);
}
