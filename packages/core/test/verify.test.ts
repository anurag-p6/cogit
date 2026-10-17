import { beforeAll, describe, expect, it } from "vitest";
import { generatePrivateKey, privateKeyToAccount, type PrivateKeyAccount } from "viem/accounts";
import { buildCommitEnvelope, parseCommitEnvelope } from "../src/envelope.js";
import { decryptBody, newGroupKey, signCommitHash } from "../src/crypto.js";
import { verifyEnvelope } from "../src/verify.js";
import type { CommitBody, CommitEnvelope } from "../src/types.js";

const body: CommitBody = { summary: "wallet-signature auth", details: "sign commitHash", tags: ["auth"] };

let account: PrivateKeyAccount;
let other: PrivateKeyAccount;
let groupKey: Uint8Array;
let valid: CommitEnvelope;

beforeAll(async () => {
  account = privateKeyToAccount(generatePrivateKey());
  other = privateKeyToAccount(generatePrivateKey());
  groupKey = newGroupKey();
  valid = await buildCommitEnvelope({
    repoId: "a1b2c3d4e5f60708",
    branch: "adarsh",
    parent: null,
    account,
    agent: "claude-code",
    kind: "decision",
    body,
    groupKey,
    ts: 1760000000,
  });
});

describe("parseCommitEnvelope", () => {
  it("roundtrips a built envelope through JSON", () => {
    expect(parseCommitEnvelope(JSON.stringify(valid))).toEqual(valid);
  });

  it("rejects nonsensical payloads", () => {
    expect(() => parseCommitEnvelope("not json")).toThrow(/valid JSON/);
    expect(() => parseCommitEnvelope('{"v":2}')).toThrow(/version/);
    expect(() => parseCommitEnvelope(JSON.stringify({ ...valid, ts: "123" }))).toThrow(/ts/);
  });
});

describe("verifyEnvelope", () => {
  it("passes a valid envelope with owner and members", async () => {
    const result = await verifyEnvelope(valid, {
      owner: account.address,
      members: [account.address, other.address],
    });
    expect(result).toEqual({ ok: true });
  });

  it("fails BAD_HASH when commitHash is altered", async () => {
    const tampered = { ...valid, commitHash: `0x${"12".repeat(32)}` };
    const result = await verifyEnvelope(tampered, { owner: account.address, members: [account.address] });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe("BAD_HASH");
    }
  });

  it("fails BAD_HASH when ciphertext is altered", async () => {
    const tampered = { ...valid, ciphertext: valid.ciphertext.slice(0, -2) + "AA" };
    const result = await verifyEnvelope(tampered, { owner: account.address, members: [account.address] });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe("BAD_HASH");
    }
  });

  it("fails BAD_SIGNATURE when the signature is from another key", async () => {
    const sig = await signCommitHash(other, valid.commitHash);
    const tampered = { ...valid, sig };
    const result = await verifyEnvelope(tampered, { owner: account.address, members: [account.address] });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe("BAD_SIGNATURE");
    }
  });

  it("fails OWNER_MISMATCH when the on-chain owner differs from author", async () => {
    const result = await verifyEnvelope(valid, { owner: other.address, members: [account.address] });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe("OWNER_MISMATCH");
    }
  });

  it("fails NOT_MEMBER when author is not in the member list", async () => {
    const result = await verifyEnvelope(valid, { owner: account.address, members: [other.address] });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe("NOT_MEMBER");
    }
  });

  it("reports BAD_HASH before later checks (reason order)", async () => {
    const tampered = { ...valid, commitHash: `0x${"34".repeat(32)}` };
    const result = await verifyEnvelope(tampered, { owner: other.address, members: [other.address] });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe("BAD_HASH");
    }
  });

  it("decrypts only after a passing verification", async () => {
    const result = await verifyEnvelope(valid, { owner: account.address, members: [account.address] });
    expect(result.ok).toBe(true);
    expect(decryptBody(valid.nonce, valid.ciphertext, groupKey)).toEqual(body);
  });

  it("leaves a tampered ciphertext undecryptable", async () => {
    const tampered = { ...valid, ciphertext: valid.ciphertext.slice(0, -2) + "AA" };
    const result = await verifyEnvelope(tampered, { owner: account.address, members: [account.address] });
    expect(result.ok).toBe(false);
    expect(() => decryptBody(tampered.nonce, tampered.ciphertext, groupKey)).toThrow();
  });
});
