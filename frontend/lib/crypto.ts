import { xchacha20poly1305 } from "@noble/ciphers/chacha.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { recoverMessageAddress } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import type { CommitBody, CommitKind } from "./types";

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
  }
  return btoa(binary);
}

export function base64ToBytes(text: string): Uint8Array {
  const normalized = text.trim().replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function bytesToHex(bytes: Uint8Array): string {
  let hex = "";
  for (const byte of bytes) {
    hex += byte.toString(16).padStart(2, "0");
  }
  return hex;
}

export function sha256Hex(data: Uint8Array | string): string {
  const bytes = typeof data === "string" ? textEncoder.encode(data) : data;
  return bytesToHex(sha256(bytes));
}

export function utf8ToBytes(text: string): Uint8Array {
  return textEncoder.encode(text);
}

export function bytesToUtf8(bytes: Uint8Array): string {
  return textDecoder.decode(bytes);
}

type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

function sortValue(value: JsonValue): JsonValue {
  if (Array.isArray(value)) {
    return value.map(sortValue);
  }
  if (value !== null && typeof value === "object") {
    const out: { [key: string]: JsonValue } = {};
    for (const key of Object.keys(value).sort()) {
      out[key] = sortValue(value[key] as JsonValue);
    }
    return out;
  }
  return value;
}

export function canonicalJson(value: unknown): string {
  return JSON.stringify(sortValue(value as JsonValue));
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

export function ciphertextHash(ciphertextBase64: string): string {
  return sha256Hex(base64ToBytes(ciphertextBase64));
}

export function newNonce(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(24));
}

export function randomGroupKey(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(32));
}

export function encryptBody(
  body: CommitBody,
  groupKey: Uint8Array,
): { nonce: string; ciphertext: string } {
  const nonce = newNonce();
  const sealed = xchacha20poly1305(groupKey, nonce).encrypt(
    textEncoder.encode(JSON.stringify(body)),
  );
  return { nonce: bytesToBase64(nonce), ciphertext: bytesToBase64(sealed) };
}

export function decryptBody(
  nonceBase64: string,
  ciphertextBase64: string,
  groupKey: Uint8Array,
): CommitBody {
  const opened = xchacha20poly1305(groupKey, base64ToBytes(nonceBase64)).decrypt(
    base64ToBytes(ciphertextBase64),
  );
  const parsed = JSON.parse(bytesToUtf8(opened)) as Partial<CommitBody>;
  return {
    summary: typeof parsed.summary === "string" ? parsed.summary : "",
    details: typeof parsed.details === "string" ? parsed.details : "",
    tags: Array.isArray(parsed.tags) ? parsed.tags.filter((t) => typeof t === "string") : [],
  };
}

export async function signCommitHash(privateKey: `0x${string}`, commitHash: string): Promise<string> {
  const account = privateKeyToAccount(privateKey);
  return account.signMessage({ message: commitHash });
}

export async function recoverAuthor(commitHash: string, sig: string): Promise<string> {
  return recoverMessageAddress({ message: commitHash, signature: sig as `0x${string}` });
}

export async function addressForPrivateKey(privateKey: `0x${string}`): Promise<string> {
  return privateKeyToAccount(privateKey).address;
}

export interface ParsedInvite {
  repoId: string;
  groupKeyBase64: string;
}

export function parseInvite(text: string): ParsedInvite | null {
  const parts = text.trim().split(":");
  if (parts.length !== 3 || parts[0] !== "cogit1") {
    return null;
  }
  const repoId = parts[1];
  const key = parts[2];
  if (!repoId || !key) {
    return null;
  }
  try {
    const bytes = base64ToBytes(key);
    if (bytes.length !== 32) {
      return null;
    }
  } catch {
    return null;
  }
  return { repoId, groupKeyBase64: key };
}

export function parseGroupKey(text: string): Uint8Array | null {
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return null;
  }
  try {
    const bytes = base64ToBytes(trimmed);
    if (bytes.length !== 32) {
      return null;
    }
    return bytes;
  } catch {
    return null;
  }
}
