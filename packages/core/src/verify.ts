import { ciphertextHash, computeCommitHash, recoverAuthor } from "./crypto.js";
import type { CommitEnvelope } from "./types.js";

export type VerifyFailureReason = "BAD_HASH" | "BAD_SIGNATURE" | "OWNER_MISMATCH" | "NOT_MEMBER";

export interface VerifyContext {
  owner?: string;
  members?: string[];
}

export type VerifyResult =
  | { ok: true }
  | { ok: false; reason: VerifyFailureReason; detail: string };

const norm = (address: string): string => address.toLowerCase();

export async function verifyEnvelope(
  envelope: CommitEnvelope,
  ctx: VerifyContext = {},
): Promise<VerifyResult> {
  const recomputed = computeCommitHash({
    v: 1,
    repoId: envelope.repoId,
    branch: envelope.branch,
    parent: envelope.parent,
    author: envelope.author,
    kind: envelope.kind,
    ts: envelope.ts,
    nonce: envelope.nonce,
    ciphertextHash: ciphertextHash(envelope.ciphertext),
  });
  if (norm(recomputed) !== norm(envelope.commitHash)) {
    return {
      ok: false,
      reason: "BAD_HASH",
      detail: `recomputed ${recomputed} != envelope ${envelope.commitHash}`,
    };
  }

  let recovered: string;
  try {
    recovered = await recoverAuthor(envelope.commitHash, envelope.sig);
  } catch (err) {
    return {
      ok: false,
      reason: "BAD_SIGNATURE",
      detail: `signature unrecoverable: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
  if (norm(recovered) !== norm(envelope.author)) {
    return {
      ok: false,
      reason: "BAD_SIGNATURE",
      detail: `signature recovers ${recovered}, envelope says ${envelope.author}`,
    };
  }

  if (ctx.owner !== undefined && norm(ctx.owner) !== norm(envelope.author)) {
    return {
      ok: false,
      reason: "OWNER_MISMATCH",
      detail: `entity owner ${ctx.owner} != author ${envelope.author}`,
    };
  }

  if (ctx.members !== undefined && !ctx.members.some((m) => norm(m) === norm(envelope.author))) {
    return {
      ok: false,
      reason: "NOT_MEMBER",
      detail: `author ${envelope.author} not in members [${ctx.members.join(", ")}]`,
    };
  }

  return { ok: true };
}
