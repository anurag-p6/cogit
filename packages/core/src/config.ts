import { ExpirationTime, type Expiry } from "@arkiv-network/sdk";
import type { CommitKind } from "./types.js";

export const KIND_EXPIRY_DAYS: Record<CommitKind, number> = {
  scratch: 3,
  note: 14,
  decision: 90,
  milestone: 365,
};

export function expiryForKind(kind: CommitKind): Expiry {
  return ExpirationTime.fromDays(KIND_EXPIRY_DAYS[kind]);
}

export const COGIT_DIR = ".cogit";
export const CONFIG_FILE = "config.json";
export const CONTEXT_DIR = "context";

export function encodeInvite(repoId: string, groupKey: Uint8Array): string {
  return `cogit1:${repoId}:${Buffer.from(groupKey).toString("base64url")}`;
}

export function decodeInvite(invite: string): { repoId: string; groupKey: Uint8Array } {
  const parts = invite.split(":");
  const prefix = parts[0];
  const repoId = parts[1];
  const key = parts[2];
  if (parts.length !== 3 || prefix !== "cogit1" || repoId === undefined || key === undefined) {
    throw new Error(`invalid invite string: ${invite}`);
  }
  const groupKey = new Uint8Array(Buffer.from(key, "base64url"));
  if (groupKey.length !== 32) {
    throw new Error(`invite group key must be 32 bytes, got ${groupKey.length}`);
  }
  return { repoId, groupKey };
}

type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

function sortValue(value: Json): Json {
  if (Array.isArray(value)) {
    return value.map(sortValue);
  }
  if (value !== null && typeof value === "object") {
    const out: { [key: string]: Json } = {};
    for (const key of Object.keys(value).sort()) {
      out[key] = sortValue(value[key] as Json);
    }
    return out;
  }
  return value;
}

export function canonicalJson(value: unknown): string {
  return JSON.stringify(sortValue(value as Json));
}
