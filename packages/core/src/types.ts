export type CommitKind = "scratch" | "note" | "decision" | "milestone";

export type AuthorAgent = "claude-code" | "cursor" | "human" | (string & {});

export type VerifyFailureReason = "BAD_HASH" | "BAD_SIGNATURE" | "OWNER_MISMATCH" | "NOT_MEMBER";

export interface LogRow {
  commitHash: string;
  ts: number;
  kind: CommitKind;
  branch: string;
  author: string;
  agent: string;
  parent: string | null;
  status: "verified" | "invalid";
  reason?: VerifyFailureReason;
  detail?: string;
  summary?: string;
  tags?: string[];
}

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
  agent: AuthorAgent;
  kind: CommitKind;
  ts: number;
  nonce: string;
  ciphertext: string;
  commitHash: string;
  sig: string;
}

export interface RepoConfig {
  repoId: string;
  name: string;
  branch: string;
  groupKey: string;
}
