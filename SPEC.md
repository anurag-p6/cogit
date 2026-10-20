# Cogit — Build Spec (3 features only)

> Coding agent: read this file fully, then build milestone by milestone.
> Scope = F1 + F2 + F3 only. Nothing else.

## Linked docs

- [docs/ARKIV_NOTES.md](docs/ARKIV_NOTES.md) — M0 spike proof (API names, units, limits).
- [docs/FRICTION_LOG.md](docs/FRICTION_LOG.md) — every surprise/bug/doc-mismatch, logged immediately.
- [docs/MCP_SETUP.md](docs/MCP_SETUP.md) — M3 agent setup (Claude Code + Cursor + snippet).

## Rules

1. One milestone at a time. Run its acceptance check, then `git commit` as `M<n>: <title>`.
2. Never guess Arkiv API names, units, or limits. Prove with spike script, record in `docs/ARKIV_NOTES.md`.
3. Never commit secrets. Keys in `.env` (gitignored); provide `.env.example`.

## The 3 features

- **F1. Upload context to Arkiv.** Commit a short, encrypted, wallet-signed context entry to your branch. Stored as an Arkiv entity with expiry.
- **F2. Teammate pulls it and uses it live.** Another branch's context is pulled into your own project and acted on, live in demo.
- **F3. Website showing branches + history.** Page draws branches as graph, lists commits, shows decrypted context + verification status.

## Stack (TypeScript everywhere, Node 22+, pnpm monorepo — use latest versions)

| Package | Version (latest, Oct 2026) | Use for |
|---|---|---|
| `@arkiv-network/sdk` | `0.8.1` | entities, queries, expiry |
| `viem` | `2.57.7` | wallet + `signMessage` / recover |
| `@noble/ciphers` | `2.4.0` | XChaCha20-Poly1305 |
| `@noble/hashes` | `2.4.0` | sha256 |
| `commander` | `15.0.0` | `cogit` CLI |
| `@modelcontextprotocol/sdk` | `1.32.1` | MCP server (stdio) |
| `react` | `19.3.1` | viewer |
| `vite` | `8.3.4` | viewer build |
| `vitest` | `5.0.5` | tests |
| `typescript` | `7.0.2` | everywhere |

Install with exact versions, e.g. `pnpm add @arkiv-network/sdk@0.8.1 viem@2.57.7`. Re-check with `npm view <pkg> version` before scaffolding.

Arkiv network: Tiramisu testnet (chain ID `7738577`, RPC `https://rpc.tiramisu.db-chain.testnet.arkiv.network`, 2s blocks).

```
cogit/
  SPEC.md  README.md  .env.example
  docs/  ARKIV_NOTES.md  FRICTION_LOG.md  MCP_SETUP.md
  packages/
    core/     # schema, crypto, arkiv wrapper, verify, graph
    cli/      # `cogit`
    mcp/      # MCP server
    viewer/   # website
  scripts/  spike.ts  seed.ts
```

## Data model (Arkiv entities, attributes are public)

- **Repo:** `type=repo`, `repoId` (8-byte hex), `owner` → payload JSON `{name, members:[address]}`, expiry 365d.
- **Branch:** `type=branch`, `repoId`, `name`, `owner`, `head` (commit hash), `forkedFrom` (hash or empty) → no payload, refreshed on update.
- **Commit:** `type=commit`, `repoId`, `branch`, `kind`, `author`, `ts`, `commitHash`, `parent` → payload = `CommitEnvelope` JSON, expiry by kind.

Expiry by kind (`core/config.ts`): `scratch` 3d, `note` 14d, `decision` 90d, `milestone` 365d. One parent per commit. New branch forks from `main` head → `forkedFrom`.

## F1 — Commit format + crypto

Body: `{summary, details (markdown), tags[]}`. Envelope payload:

```json
{"v":1,"repoId":"hex","branch":"str","parent":"hash|null","author":"0x…","agent":"claude-code|cursor|human","kind":"scratch|note|decision|milestone","ts":1760000000,"nonce":"b64","ciphertext":"b64","commitHash":"hex","sig":"0x…"}
```

- Encrypt with XChaCha20-Poly1305, 24-byte nonce, repo group key (32 random bytes at `init`).
- `commitHash = sha256(canonicalJSON({v,repoId,branch,parent,author,kind,ts,nonce,ciphertextHash}))`, canonical = sorted keys, no whitespace.
- `sig` = wallet `signMessage(commitHash)`.
- Flow: build → encrypt → hash → sign → write Commit entity → update Branch `head`.
- Key sharing: `cogit invite <addr>` prints an invite string `cogit1:<repoId>:<base64url(groupKey)>` and adds the address to the Repo members list; `cogit join <invite>` saves it to `.cogit/config.json` (mode 600). Keep bodies small (payload ≤128 KiB); truncate `details` with marker if needed.

## Verify (F2 + F3 use this)

Order: `BAD_HASH` (recomputed ≠ envelope) → `BAD_SIGNATURE` (recovers ≠ author) → `OWNER_MISMATCH` (entity owner ≠ author) → `NOT_MEMBER` (author ∉ members). Invalid = never decrypt, never hand to agent; viewer shows red + reason.

## F2 — CLI + MCP

```
cogit init <name> | invite <addr> | join <invite> | branch <name> | use <branch>
cogit commit -m "<summary>" [--details-file f] [--kind decision] [--tag t]...
cogit pull <branch> [--out file]   # verified markdown → .cogit/context/<branch>.md + stdout, oldest first
cogit log [--branch b]             # commits + verified/invalid status
```

MCP tools (stdio): `context_commit(summary,details?,kind?,tags?)`, `context_pull(branch,kind?,tag?)`, `context_log(branch?,n?)`. Descriptions must say when to use them. Setup + `CLAUDE.md` snippet in [docs/MCP_SETUP.md](docs/MCP_SETUP.md).

Demo scenario: Anurag's agent commits "Postgres + JSONB for reports table; wallet-signature auth". Ritesh's agent, asked "write the DB schema for the reports page" with no hints, calls `context_pull(anurag)` and follows it.

## F3 — Website

Next.js viewer (SSR shell, client-side data), `/viewer?repo=<repoId>&commit=&branch=&kind=&q=`, keyless share links plus opt-in key-in-fragment invites, group-key field (memory only), reads Arkiv directly, decrypts in browser, 5s auto-refresh. Header (name, members, network) → left rail (branch, owner, count, head, color) → center SVG graph (lane/branch, time order, fork line, kind shape, red = invalid, animate-in) → list + detail panel (markdown, kind/author/agent/time/block/expiry countdown/badge/explorer link). Clean, high-contrast, projector-readable.

## Seed

`scripts/seed.ts`: 1 repo, branches `adarsh, ritesh, anurag, smriti, kushal`, ~15 realistic commits incl. demo decision (live run creates a fresh one on stage). Uses 5 funded wallets from `.env`.

## Milestones

| # | Work | Acceptance |
|---|---|---|
| M0 | Spike: connect; create entity w/ attrs+expiry; query by attrs; owner update; read owner+block; non-owner update error; payload limit | `pnpm spike` PASS per item; [ARKIV_NOTES](docs/ARKIV_NOTES.md) written; friction logged. Gate: if create/query/update fails, stop + report. |
| M1 | `core`: config, wrappers, crypto, commit build, verify, graph | `pnpm test` green (hash, sign, encrypt/decrypt, each failure reason). |
| M2 | `cli`: all 8 commands | 2 shells / 2 wallets: commit on A, pull on B shows verified markdown. |
| M3 | `mcp`: 3 tools + setup doc + snippet, real-agent test | Agent A commits decision; agent B elsewhere pulls + follows it. See [MCP_SETUP](docs/MCP_SETUP.md). |
| M4 | `viewer`: rail, graph, list, detail, badges, refresh | Seeded repo renders; new CLI commit appears ≤10s. |
| M5 | Seed script, README (<10min reproduce), finalize friction log | Fresh clone runs demo; `pnpm test` passes; video recorded. |

## Out of scope

Merge, time-travel, past-block queries, tamper demo, paid pull/escrow, marketplace, per-commit keys, ML-KEM, accounts, backend server, LLM calls from CLI, real funds.

## Done when

F1+F2+F3 live twice in a row on testnet; fresh clone + README demos in <10min; `pnpm test` green; README states Arkiv features used + why (expiry-by-kind, attribute queries, ownership authorship, branch-head update); friction log ≥5 reproducible entries; backup video recorded.
