import { describe, expect, it } from "vitest";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { canonicalJson } from "../src/config.js";
import {
  ciphertextHash,
  computeCommitHash,
  decryptBody,
  encryptBody,
  fromBase64,
  newGroupKey,
  recoverAuthor,
  sha256Hex,
  signCommitHash,
  toBase64,
} from "../src/crypto.js";
import type { CommitBody, CommitKind } from "../src/types.js";

const body: CommitBody = { summary: "use postgres", details: "# why\njsonb", tags: ["db", "reports"] };

function hashFields(ciphertext: string) {
  return {
    v: 1 as const,
    repoId: "a1b2c3d4e5f60708",
    branch: "adarsh",
    parent: null as string | null,
    author: "0x1111111111111111111111111111111111111111",
    kind: "decision" as CommitKind,
    ts: 1760000000,
    nonce: "bm9uY2U=",
    ciphertextHash: ciphertextHash(ciphertext),
  };
}

describe("sha256", () => {
  it("matches the known vector for abc", () => {
    expect(sha256Hex("abc")).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  });
});

describe("canonicalJson", () => {
  it("sorts keys recursively with no whitespace", () => {
    expect(canonicalJson({ b: 1, a: { d: 2, c: [3, { f: 4, e: 5 }] } })).toBe(
      '{"a":{"c":[3,{"e":5,"f":4}],"d":2},"b":1}',
    );
  });

  it("handles null and primitives", () => {
    expect(canonicalJson({ z: null, a: true })).toBe('{"a":true,"z":null}');
  });
});

describe("base64 helpers", () => {
  it("roundtrip", () => {
    const key = newGroupKey();
    expect([...fromBase64(toBase64(key))]).toEqual([...key]);
  });
});

describe("encrypt / decrypt", () => {
  it("roundtrips the body", () => {
    const key = newGroupKey();
    const { nonce, ciphertext } = encryptBody(body, key);
    expect(decryptBody(nonce, ciphertext, key)).toEqual(body);
  });

  it("produces a fresh nonce per call", () => {
    const key = newGroupKey();
    expect(encryptBody(body, key).nonce).not.toBe(encryptBody(body, key).nonce);
  });

  it("fails with the wrong key", () => {
    const { nonce, ciphertext } = encryptBody(body, newGroupKey());
    expect(() => decryptBody(nonce, ciphertext, newGroupKey())).toThrow();
  });

  it("fails on tampered ciphertext", () => {
    const key = newGroupKey();
    const { nonce, ciphertext } = encryptBody(body, key);
    const bytes = fromBase64(ciphertext);
    bytes[0] = (bytes[0] ?? 0) ^ 0x01;
    expect(() => decryptBody(nonce, toBase64(bytes), key)).toThrow();
  });
});

describe("commit hash", () => {
  it("is stable regardless of field insertion order", () => {
    const fields = hashFields("AAAA");
    const reordered = {
      ciphertextHash: fields.ciphertextHash,
      nonce: fields.nonce,
      ts: fields.ts,
      kind: fields.kind,
      author: fields.author,
      parent: fields.parent,
      branch: fields.branch,
      repoId: fields.repoId,
      v: fields.v,
    };
    expect(computeCommitHash(fields)).toBe(computeCommitHash(reordered));
  });

  it("changes when the ciphertext changes", () => {
    expect(computeCommitHash(hashFields("AAAA"))).not.toBe(computeCommitHash(hashFields("BBBB")));
  });

  it("is 0x-prefixed sha256 hex", () => {
    expect(computeCommitHash(hashFields("AAAA"))).toMatch(/^0x[0-9a-f]{64}$/);
  });
});

describe("sign / recover", () => {
  it("recovers the signing account", async () => {
    const account = privateKeyToAccount(generatePrivateKey());
    const hash = computeCommitHash(hashFields("AAAA"));
    const sig = await signCommitHash(account, hash);
    expect((await recoverAuthor(hash, sig)).toLowerCase()).toBe(account.address.toLowerCase());
  });

  it("recovers a different account for a different message", async () => {
    const account = privateKeyToAccount(generatePrivateKey());
    const hash = computeCommitHash(hashFields("AAAA"));
    const sig = await signCommitHash(account, hash);
    const other = await recoverAuthor(computeCommitHash(hashFields("BBBB")), sig);
    expect(other.toLowerCase()).not.toBe(account.address.toLowerCase());
  });
});
