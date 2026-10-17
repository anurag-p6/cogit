export type CommitKind = "scratch" | "note" | "decision" | "milestone";

export type AuthorAgent = "claude-code" | "cursor" | "human";

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
