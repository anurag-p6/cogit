import { xchacha20poly1305 } from "@noble/ciphers/chacha.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { randomBytes } from "node:crypto";
import { recoverMessageAddress, type LocalAccount } from "viem";
import { canonicalJson } from "./config.js";
import type { CommitBody, CommitKind } from "./types.js";

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export function toBase64(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("base64");
}

export function fromBase64(text: string): Uint8Array {
  return new Uint8Array(Buffer.from(text, "base64"));
}

export function newGroupKey(): Uint8Array {
  return new Uint8Array(randomBytes(32));
}

export function sha256Hex(data: Uint8Array | string): string {
  const bytes = typeof data === "string" ? textEncoder.encode(data) : data;
  return Buffer.from(sha256(bytes)).toString("hex");
}

export function encryptBody(body: CommitBody, groupKey: Uint8Array): { nonce: string; ciphertext: string } {
  const nonce = new Uint8Array(randomBytes(24));
  const sealed = xchacha20poly1305(groupKey, nonce).encrypt(textEncoder.encode(JSON.stringify(body)));
  return { nonce: toBase64(nonce), ciphertext: toBase64(sealed) };
}

export function decryptBody(nonceBase64: string, ciphertextBase64: string, groupKey: Uint8Array): CommitBody {
  const opened = xchacha20poly1305(groupKey, fromBase64(nonceBase64)).decrypt(fromBase64(ciphertextBase64));
  return JSON.parse(textDecoder.decode(opened)) as CommitBody;
}

export function ciphertextHash(ciphertextBase64: string): string {
  return sha256Hex(fromBase64(ciphertextBase64));
}

export interface CommitHashFields {
  v: 1;
  repoId: string;
  branch: string;
  parent: string | null;
  author: string;
  kind: CommitKind;
  ts: number;
  nonce: string;
  ciphertextHash: string;
}

export function computeCommitHash(fields: CommitHashFields): string {
  return `0x${sha256Hex(canonicalJson(fields))}`;
}

export async function signCommitHash(account: LocalAccount, commitHash: string): Promise<string> {
  return account.signMessage({ message: commitHash });
}

export async function recoverAuthor(commitHash: string, signature: string): Promise<string> {
  return recoverMessageAddress({ message: commitHash, signature: signature as `0x${string}` });
}
