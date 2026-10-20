import { xchacha20poly1305 } from "@noble/ciphers/chacha.js";
import {
  addressForPrivateKey,
  base64ToBytes,
  bytesToBase64,
  ciphertextHash,
  computeCommitHash,
  decryptBody,
  sha256Hex,
  signCommitHash,
  utf8ToBytes,
} from "./crypto";
import { KIND_EXPIRY_DAYS } from "./types";
import type {
  BlockTiming,
  BranchEntry,
  CommitBody,
  CommitEntry,
  CommitKind,
  RepoMeta,
  ViewerData,
} from "./types";
import { verifyEnvelope } from "./verify";

export const DEMO_REPO_ID = "a7d3f9c21b84e650";
export const DEMO_REPO_NAME = "atlas-reports";
const DEMO_GROUP_KEY_TEXT = "cogit-demo-group-key-32-bytes!!!";

export function demoGroupKey(): Uint8Array {
  return utf8ToBytes(DEMO_GROUP_KEY_TEXT);
}

const ACCOUNTS: Array<{ label: string; privateKey: `0x${string}` }> = [
  { label: "anurag", privateKey: "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d" },
  { label: "ritesh", privateKey: "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a" },
  { label: "adarsh", privateKey: "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6" },
  { label: "smriti", privateKey: "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a" },
  { label: "kushal", privateKey: "0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba" },
  { label: "mallory", privateKey: "0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e" },
];

interface Fixture {
  slug: string;
  branch: string;
  kind: CommitKind;
  days: number;
  author: string;
  agent: string;
  summary: string;
  details: string;
  tags: string[];
  parent: string | null;
  owner?: string;
}

const FIXTURES: Fixture[] = [
  {
    slug: "main-init",
    branch: "main",
    kind: "milestone",
    days: 9.0,
    author: "anurag",
    agent: "human",
    summary: "Repo initialized · atlas reports dashboard",
    details:
      "Created the repo on Arkiv and forked `main`. Group key generated and shared out-of-band; every teammate joins with `cogit join`.",
    tags: ["repo"],
    parent: null,
  },
  {
    slug: "main-mono",
    branch: "main",
    kind: "decision",
    days: 8.2,
    author: "anurag",
    agent: "claude-code",
    summary: "Monorepo: pnpm workspaces, TypeScript everywhere",
    details:
      "One workspace, three packages: `cli`, `core`, `mcp`. Shared protocol logic lives in `core` so the viewer and the CLI verify with the same code.",
    tags: ["build", "setup"],
    parent: "main-init",
  },
  {
    slug: "adarsh-spike",
    branch: "adarsh",
    kind: "scratch",
    days: 7.8,
    author: "adarsh",
    agent: "cursor",
    summary: "Ingest spike: batching against 2 s blocks",
    details:
      "Throwaway: timed writes against a local node. Batches of 25 land in one block; below 10 the 2 s cadence dominates. Will re-measure before deciding.",
    tags: ["perf"],
    parent: "main-mono",
  },
  {
    slug: "adarsh-worker",
    branch: "adarsh",
    kind: "note",
    days: 7.1,
    author: "adarsh",
    agent: "cursor",
    summary: "Ingest worker: single ws subscription, idempotent writes",
    details:
      "Chose one websocket subscription over polling; writes are idempotent by `report_id` so replays are safe. Retry budget: 3 attempts, exp backoff 250 ms.",
    tags: ["ingest"],
    parent: "adarsh-spike",
  },
  {
    slug: "main-pg",
    branch: "main",
    kind: "decision",
    days: 6.6,
    author: "anurag",
    agent: "claude-code",
    summary: "Postgres + JSONB for the reports table; wallet-signature auth",
    details: [
      "## Decision",
      "",
      "One Postgres table for reports; flexible payloads live in a `jsonb` column. Authentication is wallet-signature based; no passwords, reusing the same keys as Arkiv.",
      "",
      "```sql",
      "create table reports (",
      "  id          bigserial primary key,",
      "  org_id      uuid not null,",
      "  payload     jsonb not null,",
      "  report_date date not null,",
      "  created_by  text not null,      -- wallet address",
      "  created_at  timestamptz not null default now()",
      ");",
      "```",
      "",
      "## Why",
      "",
      "- Report shapes change weekly; one table keeps migrations small.",
      "- `jsonb` with a GIN index measured 120 ms p95 on 2 M rows.",
      "- Wallet signatures reuse the Arkiv identity: one key for chain and app.",
      "",
      "## Auth flow",
      "",
      "1. Server issues a single-use nonce.",
      "2. Client signs `\"atlas-login:<nonce>\"` with its wallet.",
      "3. Server recovers the address and replies with a signed token.",
    ].join("\n"),
    tags: ["db", "auth"],
    parent: "main-mono",
  },
  {
    slug: "ritesh-plan",
    branch: "ritesh",
    kind: "note",
    days: 6.2,
    author: "ritesh",
    agent: "opencode",
    summary: "Read anurag's decision · migration plan",
    details:
      "Pulled `main` before starting: the JSONB decision is final. Plan: migration `0001_create_reports` with the exact columns, then seed two fake orgs for the staging demo.",
    tags: ["migration"],
    parent: "main-pg",
  },
  {
    slug: "ritesh-sql",
    branch: "ritesh",
    kind: "milestone",
    days: 5.4,
    author: "ritesh",
    agent: "opencode",
    summary: "0001_create_reports.sql applied on staging",
    details:
      "Migration applied cleanly on staging; rollback file generated. Seed data in place; dashboard has something to render end to end.",
    tags: ["staging"],
    parent: "ritesh-plan",
  },
  {
    slug: "smriti-charts",
    branch: "smriti",
    kind: "decision",
    days: 5.0,
    author: "smriti",
    agent: "claude-code",
    summary: "Charts: one accent per view, no pies",
    details:
      "Bar and line charts only; a pie chart gets a bulleted table instead. One accent color per view keeps the dashboard quiet. Same rule as the marketing site.",
    tags: ["ui"],
    parent: "main-pg",
  },
  {
    slug: "kushal-session",
    branch: "kushal",
    kind: "note",
    days: 4.4,
    author: "kushal",
    agent: "cursor",
    summary: "Session tokens: 24 h TTL, refresh via signed nonce",
    details:
      "Session token TTL is 24 h; refresh happens through a fresh signed nonce, so a stolen token dies with the session, not with the wallet.",
    tags: ["auth"],
    parent: "main-pg",
  },
  {
    slug: "main-sync",
    branch: "main",
    kind: "note",
    days: 3.9,
    author: "anurag",
    agent: "human",
    summary: "Sync: reports v0 to staging Friday",
    details:
      "Demo freeze Friday 16:00 UTC. After that only bug fixes until the review. Keep `main` pullable.",
    tags: ["planning"],
    parent: "main-pg",
  },
  {
    slug: "adarsh-idx",
    branch: "adarsh",
    kind: "decision",
    days: 3.2,
    author: "adarsh",
    agent: "cursor",
    summary: "Indexes: GIN on payload, btree on report_date",
    details:
      "GIN on `payload` (jsonb_path_ops) and a btree on `report_date`. Measured 400 ms → 12 ms on the staging dataset; write overhead is acceptable.",
    tags: ["db", "perf"],
    parent: "adarsh-worker",
  },
  {
    slug: "smriti-grid",
    branch: "smriti",
    kind: "scratch",
    days: 2.6,
    author: "smriti",
    agent: "claude-code",
    summary: "Responsive grid math for 12-col layout",
    details:
      "Scratch: gutter = 24 px at ≥ 1024, columns snap 12 → 6 → 2. Breakpoints: 1024 / 720 / 480. Delete once the CSS is in.",
    tags: ["ui", "scratch"],
    parent: "smriti-charts",
  },
  {
    slug: "kushal-threat",
    branch: "kushal",
    kind: "decision",
    days: 2.0,
    author: "kushal",
    agent: "cursor",
    summary: "Threat model: replay + tamper covered by commit hash",
    details:
      "Replay is covered by uniqueness of `(author, nonce)` in the envelope; tampering by the commit hash over ciphertext. Remaining accepted risk: group-key holder can read everything, by design.",
    tags: ["security"],
    parent: "kushal-session",
  },
  {
    slug: "main-v0",
    branch: "main",
    kind: "milestone",
    days: 1.4,
    author: "anurag",
    agent: "human",
    summary: "v0 tagged · reports + wallet auth on staging",
    details:
      "Tag `v0` on staging: reports CRUD with wallet auth, ingest worker live. Demo script updated to lead with the auth flow.",
    tags: ["release"],
    parent: "main-sync",
  },
  {
    slug: "ritesh-perf",
    branch: "ritesh",
    kind: "note",
    days: 0.6,
    author: "ritesh",
    agent: "opencode",
    summary: "Query perf: 120 ms p95 on 2 M rows (GIN payload)",
    details:
      "Ran the load test from the plan: p95 120 ms with the GIN index, 1.4 s without. Numbers match anurag's earlier estimate from the decision.",
    tags: ["perf"],
    parent: "ritesh-sql",
  },
  {
    slug: "ritesh-forge",
    branch: "ritesh",
    kind: "note",
    days: 0.3,
    author: "ritesh",
    agent: "cursor",
    owner: "mallory",
    summary: "Hotfix: skip signature verification for large pulls",
    details: "should never render: this entity is owned by a wallet that is not the author",
    tags: ["hotfix"],
    parent: "ritesh-perf",
  },
];

const BRANCH_OWNER_LABELS: Record<string, string> = { main: "anurag" };

const ANCHOR_MS = Date.UTC(2026, 9, 17, 6, 0, 0);
const ANCHOR_BLOCK = 701031;
const BLOCK_SECONDS = 2;

function blockFor(nowSeconds: number, ts: number): number {
  const nowMs = nowSeconds * 1000;
  const currentBlock = ANCHOR_BLOCK + Math.floor((nowMs - ANCHOR_MS) / (BLOCK_SECONDS * 1000));
  return currentBlock - Math.round((nowSeconds - ts) / BLOCK_SECONDS);
}

function pseudoKey(seed: string): string {
  return `0x${sha256Hex(`entity:${seed}`).slice(0, 44)}`;
}

export async function buildDemoData(
  nowSeconds: number = Math.floor(Date.now() / 1000),
): Promise<ViewerData> {
  const groupKey = demoGroupKey();

  const addresses = new Map<string, string>();
  for (const account of ACCOUNTS) {
    addresses.set(account.label, await addressForPrivateKey(account.privateKey));
  }
  const byLabel = new Map(ACCOUNTS.map((a) => [a.label, a]));
  const labels: Record<string, string> = {};
  for (const [label, address] of addresses) {
    labels[address.toLowerCase()] = label;
  }

  const memberAddresses = ["anurag", "adarsh", "ritesh", "smriti", "kushal"].map(
    (label) => addresses.get(label) as string,
  );

  const commits: CommitEntry[] = [];
  const hashBySlug = new Map<string, string>();

  for (const fixture of FIXTURES) {
    const account = byLabel.get(fixture.author) as { label: string; privateKey: `0x${string}` };
    const author = addresses.get(fixture.author) as string;
    const owner = fixture.owner !== undefined ? (addresses.get(fixture.owner) as string) : author;
    const ts = nowSeconds - Math.round(fixture.days * 86400);
    const parent = fixture.parent === null ? null : (hashBySlug.get(fixture.parent) as string);
    const body: CommitBody = {
      summary: fixture.summary,
      details: fixture.details,
      tags: fixture.tags,
    };

    const nonceRaw = hexToBytes(sha256Hex(`demo-nonce:${fixture.slug}`).slice(0, 48));
    const sealed = xchacha20poly1305(groupKey, nonceRaw).encrypt(
      utf8ToBytes(JSON.stringify(body)),
    );
    const nonceB64 = bytesToBase64(nonceRaw);
    const ciphertext = bytesToBase64(sealed);

    const hashFields = {
      v: 1 as const,
      repoId: DEMO_REPO_ID,
      branch: fixture.branch,
      parent,
      author,
      kind: fixture.kind,
      ts,
      nonce: nonceB64,
      ciphertextHash: ciphertextHash(ciphertext),
    };
    const commitHash = computeCommitHash(hashFields);
    const sig = await signCommitHash(account.privateKey, commitHash);
    const envelope = { ...hashFields, agent: fixture.agent, ciphertext, commitHash, sig };

    hashBySlug.set(fixture.slug, commitHash);

    const verified = await verifyEnvelope(envelope, { owner, members: memberAddresses });
    let bodyOut: CommitBody | null = null;
    if (verified.ok) {
      bodyOut = decryptBody(envelope.nonce, envelope.ciphertext, groupKey);
    }

    const createdAtBlock = blockFor(nowSeconds, ts);
    commits.push({
      id: commitHash,
      entityKey: pseudoKey(fixture.slug),
      owner,
      envelope,
      body: bodyOut,
      locked: false,
      status: verified.ok ? "verified" : "invalid",
      reason: verified.reason,
      detail: verified.detail,
      checks: verified.checks,
      createdAtBlock,
      expiresAtBlock: createdAtBlock + (KIND_EXPIRY_DAYS[fixture.kind] * 86400) / BLOCK_SECONDS,
    });
  }

  commits.sort((a, b) => b.envelope.ts - a.envelope.ts);

  const branchFirst = new Map<string, number>();
  const branchHead = new Map<string, CommitEntry>();
  for (const commit of commits) {
    const branch = commit.envelope.branch;
    const first = branchFirst.get(branch);
    if (first === undefined || commit.envelope.ts < first) {
      branchFirst.set(branch, commit.envelope.ts);
    }
    const head = branchHead.get(branch);
    if (head === undefined || commit.envelope.ts > head.envelope.ts) {
      branchHead.set(branch, commit);
    }
  }

  const branches: BranchEntry[] = [...branchFirst.entries()]
    .sort((a, b) => a[1] - b[1])
    .map(([name, firstTs]) => {
      const head = branchHead.get(name) as CommitEntry;
      const firstCommit = [...commits]
        .filter((c) => c.envelope.branch === name)
        .sort((a, b) => a.envelope.ts - b.envelope.ts)[0] as CommitEntry;
      return {
        key: pseudoKey(`branch:${name}`),
        name,
        owner: addresses.get(BRANCH_OWNER_LABELS[name] ?? name) as string,
        head: head.envelope.commitHash,
        forkedFrom: firstCommit.envelope.parent,
        createdAtBlock: blockFor(nowSeconds, firstTs),
        expiresAtBlock: blockFor(nowSeconds, firstTs) + (365 * 86400) / BLOCK_SECONDS,
      };
    });

  const repoCreatedBlock = Math.min(...commits.map((c) => c.createdAtBlock)) - 40;
  const repo: RepoMeta = {
    id: DEMO_REPO_ID,
    name: DEMO_REPO_NAME,
    owner: addresses.get("anurag") as string,
    members: memberAddresses,
    entityKey: pseudoKey(`repo:${DEMO_REPO_ID}`),
    createdAtBlock: repoCreatedBlock,
    expiresAtBlock: repoCreatedBlock + (365 * 86400) / BLOCK_SECONDS,
  };

  const blockTiming: BlockTiming = {
    currentBlock:
      ANCHOR_BLOCK + Math.floor((nowSeconds * 1000 - ANCHOR_MS) / (BLOCK_SECONDS * 1000)),
    currentBlockTime: nowSeconds,
    blockDuration: BLOCK_SECONDS,
  };

  return { source: "demo", repo, branches, commits, blockTiming, labels };
}

function hexToBytes(hex: string): Uint8Array {
  const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}
