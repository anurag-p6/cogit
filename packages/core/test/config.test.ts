import { describe, expect, it } from "vitest";
import { canonicalJson, decodeInvite, encodeInvite, expiryForKind, KIND_EXPIRY_DAYS } from "../src/config.js";
import { newGroupKey } from "../src/crypto.js";

const BLOCKS_PER_DAY = 43200n;

describe("expiryForKind", () => {
  it("matches the spec durations in blocks (2s each)", () => {
    expect(expiryForKind("scratch").minLifetime).toBe(3n * BLOCKS_PER_DAY);
    expect(expiryForKind("note").minLifetime).toBe(14n * BLOCKS_PER_DAY);
    expect(expiryForKind("decision").minLifetime).toBe(90n * BLOCKS_PER_DAY);
    expect(expiryForKind("milestone").minLifetime).toBe(365n * BLOCKS_PER_DAY);
  });

  it("is a pure duration (expiresAt unset)", () => {
    expect(expiryForKind("note").expiresAt).toBe(0n);
  });

  it("keeps the documented day mapping", () => {
    expect(KIND_EXPIRY_DAYS).toEqual({ scratch: 3, note: 14, decision: 90, milestone: 365 });
  });
});

describe("invite strings", () => {
  it("roundtrips repoId and group key", () => {
    const key = newGroupKey();
    const invite = encodeInvite("a1b2c3d4e5f60708", key);
    expect(invite.startsWith("cogit1:a1b2c3d4e5f60708:")).toBe(true);
    const decoded = decodeInvite(invite);
    expect(decoded.repoId).toBe("a1b2c3d4e5f60708");
    expect([...decoded.groupKey]).toEqual([...key]);
  });

  it("rejects malformed invites", () => {
    expect(() => decodeInvite("nope")).toThrow();
    expect(() => decodeInvite("cogit1:abc:AAAA")).toThrow(/32 bytes/);
  });
});

describe("canonicalJson", () => {
  it("serializes the commit-hash preimage deterministically", () => {
    const a = canonicalJson({ v: 1, repoId: "x", branch: "b", parent: null, author: "0x0", kind: "note", ts: 1, nonce: "n", ciphertextHash: "h" });
    const b = canonicalJson({ ciphertextHash: "h", nonce: "n", ts: 1, kind: "note", author: "0x0", parent: null, branch: "b", repoId: "x", v: 1 });
    expect(a).toBe(b);
  });
});
