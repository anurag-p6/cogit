import type { LocalAccount } from "viem";
import {
  ciphertextHash,
  computeCommitHash,
  encryptBody,
  signCommitHash,
} from "./crypto.js";
import type { AuthorAgent, CommitBody, CommitEnvelope, CommitKind } from "./types.js";

export interface BuildEnvelopeInput {
  repoId: string;
  branch: string;
  parent: string | null;
  account: LocalAccount;
  agent: AuthorAgent;
  kind: CommitKind;
  body: CommitBody;
  groupKey: Uint8Array;
  ts?: number;
}

export async function buildCommitEnvelope(input: BuildEnvelopeInput): Promise<CommitEnvelope> {
  const ts = input.ts ?? Math.floor(Date.now() / 1000);
  const { nonce, ciphertext } = encryptBody(input.body, input.groupKey);
  const hashFields = {
    v: 1 as const,
    repoId: input.repoId,
    branch: input.branch,
    parent: input.parent,
    author: input.account.address,
    kind: input.kind,
    ts,
    nonce,
    ciphertextHash: ciphertextHash(ciphertext),
  };
  const commitHash = computeCommitHash(hashFields);
  const sig = await signCommitHash(input.account, commitHash);
  return { ...hashFields, agent: input.agent, ciphertext, commitHash, sig };
}

const KINDS: readonly CommitKind[] = ["scratch", "note", "decision", "milestone"];
const AGENTS: readonly AuthorAgent[] = ["claude-code", "cursor", "human"];

export function parseCommitEnvelope(payload: string): CommitEnvelope {
  let raw: unknown;
  try {
    raw = JSON.parse(payload);
  } catch {
    throw new Error("commit payload is not valid JSON");
  }
  if (typeof raw !== "object" || raw === null) {
    throw new Error("commit payload is not an object");
  }
  const e = raw as Record<string, unknown>;
  if (e.v !== 1) {
    throw new Error(`unsupported commit envelope version: ${String(e.v)}`);
  }
  for (const key of ["repoId", "branch", "author", "kind", "nonce", "ciphertext", "commitHash", "sig"] as const) {
    if (typeof e[key] !== "string") {
      throw new Error(`commit envelope field ${key} must be a string`);
    }
  }
  if (typeof e.ts !== "number" || !Number.isFinite(e.ts)) {
    throw new Error("commit envelope field ts must be a finite number");
  }
  if (e.parent !== null && typeof e.parent !== "string") {
    throw new Error("commit envelope field parent must be a string or null");
  }
  if (!KINDS.includes(e.kind as CommitKind)) {
    throw new Error(`unknown commit kind: ${String(e.kind)}`);
  }
  if (!AGENTS.includes(e.agent as AuthorAgent)) {
    throw new Error(`unknown agent: ${String(e.agent)}`);
  }
  return e as unknown as CommitEnvelope;
}
