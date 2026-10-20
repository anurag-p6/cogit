# Cogit

**Encrypted, wallet-signed team context on [Arkiv](https://arkiv.network) — shared memory your coding agents can actually trust.**

![tests](https://img.shields.io/badge/tests-35%20passing-brightgreen)
![node](https://img.shields.io/badge/node-%E2%89%A522-339933?logo=node.js&logoColor=white)
![rust](https://img.shields.io/badge/also%20in-rust-orange?logo=rust&logoColor=white)
![MCP](https://img.shields.io/badge/MCP-stdio-blueviolet)
![Arkiv](https://img.shields.io/badge/Arkiv-tiramisu%20testnet-6E56CF)
![pnpm](https://img.shields.io/badge/monorepo-pnpm-F69220?logo=pnpm&logoColor=white)

## The problem

Every coding session ends, and so does everything the agent learned. Teammates re-explain the same decisions, agents re-derive the same schema, and "why did we do this?" reaches back into a chat log nobody reads. Git records *what* changed, not the reasoning behind it — and `user.email` is a claim, not a proof.

## The solution

Cogit is one durable place for the context a team produces, written and read by agents:

- **Commit context.** An agent (or human) records a short, encrypted, wallet-signed entry on its branch. It lives on Arkiv with an expiry that matches its importance.
- **Pull it live.** A teammate's agent pulls a branch before starting related work — every entry verified, decrypted, and followed, without asking anyone.
- **See and verify it.** One web page (or CLI) draws branches as a graph, lists commits, and shows decrypted context with a four-step verification result — in the browser, against chain state.

## Why not just git?

| | git | Cogit |
|---|---|---|
| identity | `user.email` — self-declared, forgeable | **wallet address — proven by signature** |
| authorship proof | optional GPG, manual key distribution | **four ordered checks against chain state** |
| storage | a repo its owner must host | **Arkiv entities, queryable by attribute, self-expiring** |
| read access | whoever can clone | **whoever holds the repo's group key** |
| expiry / GC | forever | **per-kind TTL — scratch dies in days, milestones live a year** |
| agent interface | — | **MCP server: `context_commit` / `context_pull` / `context_log`** |

## How it works

```mermaid
flowchart LR
  subgraph PA["Anurag's project"]
    A["Agent / CLI"]
  end
  subgraph PB["Ritesh's project"]
    B["Agent / CLI"]
  end
  V["Viewer (M4)"]
  K[("Arkiv — Tiramisu testnet")]

  A -- "signed + encrypted commits" --> K
  B -- "pull · verify · decrypt" --> K
  V -- "read · verify" --> K
```

A commit's life, from one teammate's agent to the other's:

```mermaid
sequenceDiagram
  autonumber
  participant A as Anurag's agent
  participant K as Arkiv
  participant B as Ritesh's agent

  A->>A: encrypt body (XChaCha20-Poly1305, group key)
  A->>A: commitHash = sha256(canonical fields)
  A->>A: sig = wallet signMessage(commitHash)
  A->>K: write Commit entity + update Branch head
  Note over B: later, with no hints
  B->>K: pull branch "anurag"
  K-->>B: commit entities (public attributes only)
  B->>B: run the four verification checks
  B->>B: decrypt verified only, follow the decision
```

### Verification pipeline

Order matters — the first failure wins, and **invalid entries are never decrypted and never handed to an agent**:

```mermaid
flowchart TD
  C["commit entity"] --> H{"recomputed hash == commitHash?"}
  H -- no --> E1["BAD_HASH"]
  H -- yes --> S{"sig recovers to author?"}
  S -- no --> E2["BAD_SIGNATURE"]
  S -- yes --> O{"entity owner == author?"}
  O -- no --> E3["OWNER_MISMATCH"]
  O -- yes --> M{"author in repo members?"}
  M -- no --> E4["NOT_MEMBER"]
  M -- yes --> OK["verified → decrypt → hand to agent"]
```

`OWNER_MISMATCH` is the check git cannot make: it compares the envelope's author against the wallet that actually paid for the transaction on Arkiv — so a copied commit re-posted by someone else is rejected even with a valid signature.

### Crypto in one paragraph

The repo body is encrypted with XChaCha20-Poly1305 under a 32-byte **group key** generated at `init`. The `commitHash` is `sha256` over canonical JSON (`{v, repoId, branch, parent, author, kind, ts, nonce, ciphertextHash}` — sorted keys, no whitespace), and `sig` is the author's wallet signature over that hash. The group key proves *you may read*; the wallet key proves *you wrote*. They are deliberately separate.

## Data model (all attributes are public)

| Entity | Attributes | Payload | Expiry |
|---|---|---|---|
| **Repo** | `type=repo`, `repo_id`, `owner` | `{name, members: [address]}` | 365d |
| **Branch** | `type=branch`, `repo_id`, `name`, `owner`, `head`, `forked_from` | — | 365d (refreshed on update) |
| **Commit** | `type=commit`, `repo_id`, `branch`, `kind`, `author`, `ts`, `commit_hash`, `parent` | `CommitEnvelope` JSON | by kind |

Expiry by kind: `scratch` 3d · `note` 14d · `decision` 90d · `milestone` 365d.

```json
{
  "v": 1, "repoId": "5b7281f9534ac69f", "branch": "anurag",
  "parent": "0x03e7…", "author": "0x225F…", "agent": "opencode",
  "kind": "decision", "ts": 1760700000,
  "nonce": "b64…", "ciphertext": "b64…",
  "commitHash": "0x0a4d…", "sig": "0x…"
}
```

## Quickstart

### Install the CLI (Linux x64)

```bash
curl -fsSL https://github.com/anurag-p6/cogit/releases/latest/download/install.sh | bash
cogit --version
```

Installs `cogit` and `cogit-mcp` (the MCP server) to `~/.cogit/bin` and puts them on `$PATH`. A Debian package and a tarball ship on the [release page](https://github.com/anurag-p6/cogit/releases/latest).

### A team in six commands

```bash
mkdir team-brain && cd team-brain
cogit init team-brain                              # repo + main branch + group key
cogit commit -m "Postgres + JSONB for reports" --kind decision --tag db
cogit invite 0xTeammateAddress…                    # prints cogit1:<repoId>:<groupKey>

# teammate — own machine, own wallet:
cogit join 'cogit1:…'
cogit branch ritesh && cogit use ritesh
cogit commit -m "Live updates over SSE" --kind decision --tag frontend

# back on either side:
cogit log           # every commit, verified or INVALID:<reason>
cogit pull ritesh   # verified markdown, decrypted locally
```

`cogit commit` writes to Arkiv immediately — `--details-file` is optional long-form markdown, and the MCP `context_commit` tool is the same write with the agent's own summary as the body.

```
cogit init <name>          create a repo and write .cogit/config.json
cogit invite <address>     add a member and print the invite string
cogit join <invite>        join a repo from an invite
cogit branch <name>        fork a branch from the current head
cogit use <branch>         switch branches
cogit commit …             encrypted, wallet-signed entry (kinds: scratch/note/decision/milestone)
cogit pull <branch>        verified markdown, oldest first
cogit log [--branch]       commits with verification status
```

## For agents (MCP)

`cogit-mcp` is a stdio MCP server (native Rust binary; the TypeScript reference implementation lives in `packages/mcp`) exposing three tools whose descriptions tell agents *when* to use them:

| Tool | Input | When the agent calls it |
|---|---|---|
| `context_commit` | `summary`, `details?`, `kind?`, `tags?` | immediately after making or learning a decision |
| `context_pull` | `branch`, `kind?`, `tag?` | before work a teammate may have specified |
| `context_log` | `branch?`, `n?` | to survey activity or confirm a commit landed |

```json
{
  "mcp": {
    "cogit": {
      "type": "local",
      "command": ["cogit-mcp"]
    }
  }
}
```

Copy-paste configs for Claude Code, Cursor, and opencode — plus the `CLAUDE.md` / `AGENTS.md` snippet — live in [docs/MCP_SETUP.md](docs/MCP_SETUP.md).

### Verified with two real agents

Agent A (wallet 1) committed a decision via MCP. Agent B (wallet 2, separate project), asked only *"write the DB schema for the reports page"*, called `context_pull("anurag")`, produced a schema matching the decision, and recorded its own entry on its branch. Both commits verified cross-wallet via `cogit log`.

## Install from source (TypeScript bundle)

The reference CLI builds to a single dependency-free file and can be installed like any tool:

```bash
pnpm build
cd packages/cli && pnpm pack --pack-destination /tmp   # cogit-cli-0.1.0.tgz (~200 KB)
npm install -g /tmp/cogit-cli-0.1.0.tgz
cogit          # first run prints the welcome screen
cogit --version
```

Running `cogit` with no arguments prints a welcome banner — logo, one-liner, and quick start. npm backgrounds install scripts by default; to see the install-time note live, use `npm install -g --foreground-scripts …`.

## Native Rust CLI

The same CLI is also a native Rust binary — same protocol, same on-chain data, same output (byte-identical `welcome` and `log`), verified cross-stack on Tiramisu: a Rust-written commit pulls clean in the TS CLI and vice versa. Install it with one line:

```bash
curl -fsSL https://github.com/anurag-p6/cogit/releases/latest/download/install.sh | bash
```

Installs `cogit` and `cogit-mcp` (the MCP server) to `~/.cogit/bin` and wires up `$PATH` (options: `--version 0.1.0`, `--binary <path>`, `--no-modify-path`; downloads are SHA256-verified). Prefer a package? `cogit_0.1.0-1_amd64.deb` and `cogit-linux-x64.tar.gz` ship on the [release page](https://github.com/anurag-p6/cogit/releases/latest) — both contain both binaries.

The port needed a raw `execute((uint8,bytes)[])` encoder because the upstream SDK write path currently mines transactions that emit no entities — all fifteen findings, each reproducible, are in [docs/FRICTION_LOG_RUST.md](docs/FRICTION_LOG_RUST.md).

## Viewer

`frontend/` is a Next.js viewer whose data path runs fully client-side: open `/viewer`, or deep-link a repo with `/viewer?repo=<repo-id>` (keyless links show metadata and seal bodies). Paste a `cogit1:` invite (or a repo id + group key) in **Live · Arkiv** and it reads the repo straight from the chain, re-verifies every commit (hash, wallet signature, entity owner, membership) and decrypts bodies with the key: in memory, never sent anywhere. Opt-in share links keep the key in the URL fragment, never the query or the server. Links also carry `commit`, `branch`, `kind`, and `q`, so a filtered view is reproducible. Demo mode renders a seeded fixture with no network. Live mode needs an RPC URL for the browser (the public endpoint's anonymous budget is small):

```bash
# frontend/.env.local: NEXT_PUBLIC_ARKIV_RPC_URL=https://rpc.tiramisu.db-chain.testnet.arkiv.network/<key>
pnpm build:frontend
pnpm viewer            # http://localhost:4173/viewer
```

Deploy on Vercel with Root Directory `frontend`, Node 22, and `NEXT_PUBLIC_ARKIV_RPC_URL` set for Production and Preview. The legacy `/?repo=<repo-id>` link redirects to `/viewer`.

## Repository layout

```
arkiv/      public schema + friction log (served at /arkiv/schema.md and /arkiv/friction.md)
frontend/   Next.js site — demo dataset + live Arkiv viewer
packages/
  core/     protocol: crypto, envelope, verification, Arkiv wrapper, ops, branch graph
  cli/      `cogit` — the 8 commands above
  mcp/      TS reference MCP server
rust/
  crates/cogit-core/   protocol port: raw tx encoder, crypto, verification
  crates/cogit-cli/    native `cogit` binary
  crates/cogit-mcp/    native `cogit-mcp` MCP server (stdio)
  scripts/mcp-e2e.mjs  both-servers parity E2E over the TS MCP SDK client
  install.sh           one-liner installer (release assets)
docs/
  ARKIV_NOTES.md    spike-proven API names, units, limits
  FRICTION_LOG.md   8 logged surprises (each reproducible)
  FRICTION_LOG_RUST.md  15 findings from the Rust port (incl. MCP parity)
  MCP_SETUP.md      per-client agent setup
scripts/
  spike.ts          M0 on-chain self-test (7 checks)
  build.mjs         bundles cli + mcp
```

## Why Arkiv

| Feature used | Why it matters here |
|---|---|
| attribute queries (`type`, `repo_id`, `branch`) | pull a branch or list commits without any indexer of our own |
| per-kind expiry | context self-expires: scratch disappears in days, milestones last a year — no GC cron |
| entity ownership | the chain itself attests which wallet wrote an entity → the `OWNER_MISMATCH` check |
| `patchEntity` on branch head | git-style `head` pointer that the owner advances on each commit |
| repo `members` in payload | verifiers enforce `NOT_MEMBER` fully offline |

## Trust model

**Public:** repo/branch names, commit kinds, author addresses, timestamps, hashes, tags’ existence — never contents. **Private:** summaries, details, tags, code snippets (encrypted), and the group key. Inviting someone shares read access; there is no way to grant write access to a branch you own other than handing over the wallet — branch heads are single-writer by construction (see [F-8](docs/FRICTION_LOG.md)).

## Limits worth knowing

- Arkiv entity cap is **128 KiB including attributes**; `details` is truncated at 96 KiB with a marker.
- Attribute names must be **lowercase** (`repo_id`, `commit_hash`), values ≤ 128 bytes.
- Expiry granularity is one block (2s); writes return before mining — receipts are awaited where it matters.
- The public RPC's anonymous query budget is small and shared; on `429 ANON_COST_LIMITED`, get a free key at [hub.arkiv.network](https://hub.arkiv.network/access-keys) and append it to the URL in `.env`: `ARKIV_RPC_URL=https://rpc.tiramisu.db-chain.testnet.arkiv.network/<key>` (works for both the TS and Rust stacks).
- `.cogit/config.json` holds the group key (mode 600) and is gitignored; the viewer takes the key in memory only.

## Status

| Milestone | Scope | State | Proof |
|---|---|---|---|
| M0 | Arkiv spike | **done** | 7/7 checks PASS in `pnpm spike` |
| M1 | `core` | **done** | `pnpm test` — 35 tests (hash, sign, crypto, every failure reason) |
| M2 | `cli` | **done** | 2 wallets: commit on A, verified pull on B |
| M3 | `mcp` | **done** | 2 real agents: commit → pull → follow |
| M4 | `viewer` | **done** | live repo, 2 wallets / 3 verified commits: in-browser verify + decrypt, branch graph, 5 s refresh |
| M5 | docs + demo fixtures | **done** | public `arkiv/schema.md` + `arkiv/friction.md`, seeded demo dataset in the viewer |
| M6 | Rust port (core + CLI) | **done** | 6 unit tests · bidirectional cross-tool E2E · signed release + `curl \| bash` installer |
| M7 | Rust MCP server | **done** | 40/40 parity checks vs TS server (byte-equal schemas, results, errors) · live Tiramisu commits via MCP SDK client |

## License

Everything outside `rust/` — the TypeScript packages, the frontend, and the docs — is **MIT**; see [LICENSE](LICENSE).

The Rust workspace (`rust/`) is **GPL-3.0-or-later** because it links the GPL-3.0-or-later `arkiv-sdk` crate; the full text is in [`rust/LICENSE-RUST`](rust/LICENSE-RUST). Prebuilt `cogit` / `cogit-mcp` binaries from the releases page are therefore distributed under GPL-3.0-or-later.

## Documentation

- [SPEC.md](SPEC.md) — scope, data model, milestones
- [docs/ARKIV_NOTES.md](docs/ARKIV_NOTES.md) — spike-proven API surface
- [arkiv/friction.md](arkiv/friction.md) — consolidated public friction log (served at `/arkiv/friction.md`)
- [docs/FRICTION_LOG.md](docs/FRICTION_LOG.md) — TypeScript sprint findings, chronological
- [docs/FRICTION_LOG_RUST.md](docs/FRICTION_LOG_RUST.md) — Rust port findings, chronological
- [arkiv/schema.md](arkiv/schema.md) — complete on-chain entity schema (served at `/arkiv/schema.md`)
- [docs/MCP_SETUP.md](docs/MCP_SETUP.md) — agent setup, verified scenario

## Development

```bash
pnpm test          # vitest, 35 tests
pnpm build         # esbuild bundles → packages/*/dist
pnpm spike         # live on-chain self-test against Tiramisu
pnpm cogit <cmd>   # run the CLI from source via tsx
```
