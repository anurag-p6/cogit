import { ciphertextHash, computeCommitHash, recoverAuthor } from "./crypto";
import type { CommitEnvelope, VerifyResult } from "./types";

export interface VerifyContext {
  owner?: string;
  members?: string[];
}

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

  const hashOk = norm(recomputed) === norm(envelope.commitHash);

  let recovered: string | null = null;
  try {
    recovered = await recoverAuthor(envelope.commitHash, envelope.sig);
  } catch {
    recovered = null;
  }
  const sigOk = recovered !== null && norm(recovered) === norm(envelope.author);

  const ownerOk = ctx.owner === undefined ? null : norm(ctx.owner) === norm(envelope.author);
  const memberOk =
    ctx.members === undefined ? null : ctx.members.some((m) => norm(m) === norm(envelope.author));

  const checks = { hash: hashOk, sig: sigOk, owner: ownerOk, member: memberOk };

  if (!hashOk) {
    return {
      ok: false,
      reason: "BAD_HASH",
      detail: `recomputed ${recomputed} != envelope ${envelope.commitHash}`,
      checks,
    };
  }

  if (!sigOk) {
    return {
      ok: false,
      reason: "BAD_SIGNATURE",
      detail:
        recovered === null
          ? "signature could not be recovered to an address"
          : `signature recovers ${recovered}, envelope says ${envelope.author}`,
      checks,
    };
  }

  if (ownerOk === false) {
    return {
      ok: false,
      reason: "OWNER_MISMATCH",
      detail: `entity owner ${ctx.owner} != author ${envelope.author}`,
      checks,
    };
  }

  if (memberOk === false) {
    return {
      ok: false,
      reason: "NOT_MEMBER",
      detail: `author ${envelope.author} is not in the repo member list`,
      checks,
    };
  }

  return { ok: true, checks };
}
