export type CommitKind = "scratch" | "note" | "decision" | "milestone";

export type VerifyFailureReason =
  | "BAD_HASH"
  | "BAD_SIGNATURE"
  | "OWNER_MISMATCH"
  | "NOT_MEMBER";

export interface CommitBody {
  summary: string;
  details: string;
  tags: string[];
}

export interface CommitEnvelope {
  v: 1;
  repoId: string;
  branch: string;
  parent: string | null;
  author: string;
  agent: string;
  kind: CommitKind;
  ts: number;
  nonce: string;
  ciphertext: string;
  commitHash: string;
  sig: string;
}

export interface VerifyChecks {
  hash: boolean;
  sig: boolean;
  owner: boolean | null;
  member: boolean | null;
}

export interface VerifyResult {
  ok: boolean;
  reason?: VerifyFailureReason;
  detail?: string;
  checks: VerifyChecks;
}

export interface CommitEntry {
  id: string;
  entityKey: string;
  owner: string;
  envelope: CommitEnvelope;
  body: CommitBody | null;
  locked: boolean;
  status: "verified" | "invalid";
  reason?: VerifyFailureReason;
  detail?: string;
  checks: VerifyChecks;
  createdAtBlock: number;
  expiresAtBlock: number;
}

export interface BranchEntry {
  key: string;
  name: string;
  owner: string;
  head: string;
  forkedFrom: string | null;
  createdAtBlock: number;
  expiresAtBlock: number;
}

export interface RepoMeta {
  id: string;
  name: string;
  owner: string;
  members: string[];
  entityKey: string;
  createdAtBlock: number;
  expiresAtBlock: number;
}

export interface BlockTiming {
  currentBlock: number;
  currentBlockTime: number;
  blockDuration: number;
}

export interface ViewerData {
  source: "demo" | "live";
  repo: RepoMeta | null;
  branches: BranchEntry[];
  commits: CommitEntry[];
  blockTiming: BlockTiming;
  labels: Record<string, string>;
}

export const COMMIT_KINDS: readonly CommitKind[] = [
  "scratch",
  "note",
  "decision",
  "milestone",
];

export const KIND_EXPIRY_DAYS: Record<CommitKind, number> = {
  scratch: 3,
  note: 14,
  decision: 90,
  milestone: 365,
};
