# cogit — on-chain schema (Arkiv)

This document is the complete, reproducible description of what cogit stores on Arkiv. If you can query the chain, you can rebuild the viewer from this file alone.

**Network:** Arkiv **Tiramisu** testnet — chain id `7738577`, Arkiv precompile `0x4400000000000000000000000000000000000044`, 2-second blocks (43,200/day).
**SDKs in use:** `@arkiv-network/sdk@0.8.1` (TypeScript) and a Rust port verified against it (raw `execute` encoder + raw `arkiv_query`). Both implementations produce byte-identical entities and verify each other's output.

## 1. Three entity types, one repo per team

| Entity | `type` attribute | Role | Expiry |
|---|---|---|---|
| **Repo** | `repo` | the team: name + member list; exists once per repo | 1 year |
| **Branch** | `branch` | a per-wallet append-only commit log; holds the current head | 1 year, refreshed on every update |
| **Commit** | `commit` | one encrypted, wallet-signed Agent Memory entry | by kind: 3 / 14 / 90 / 365 days |

Every entity carries the attributes below. Names are lowercase-only, ≤ 32 bytes, `[a-z][a-z0-9._-]*` on the live chain. `str` values are ≤ 128 bytes. `$payload` and `$contentType` are system cells (bytes / str) that count toward Arkiv's attribute limit — see [§8](#8-limits-and-encodings).

## 2. Repo entity

Attributes:

| Attribute | Arkiv type | Meaning | Example |
|---|---|---|---|
| `type` | str | discriminator | `repo` |
| `repo_id` | str | 8 random bytes, hex (16 chars) — public team pointer | `507ac01a0bd47573` |
| `owner` | addr | wallet that created the repo (also the only wallet that can invite) | `0x225Fd0b9…` |
| `$payload` | bytes | JSON below | — |
| `$contentType` | str | | `application/json` |

Payload (public):

```json
{ "name": "atlas-reports",
  "members": ["0x225Fd0b9D011C8BBffd0f0c6f854Cd23b99B6aF7",
              "0x1F3305F4d20F49c3505B5175d76A6619E4d00B38"] }
```

`members` is the on-chain membership gate. `cogit invite <address>` appends to it (owner-only patch); verification rejects commits whose author is not in this list (`NOT_MEMBER`). The group key is **not** stored on chain — see [§5](#5-group-key-and-invite).

Query:

```
type = str('repo') AND repo_id = str('507ac01a0bd47573')
```

## 3. Branch entity

Attributes:

| Attribute | Arkiv type | Meaning | Example |
|---|---|---|---|
| `type` | str | discriminator | `branch` |
| `repo_id` | str | repo pointer | `507ac01a0bd47573` |
| `name` | str | branch name | `ritesh` |
| `owner` | addr | wallet that created the branch — **the only wallet allowed to advance it** | `0x1F3305F4…` |
| `head` | str | current head commit hash (`0x` + 64 hex); absent/empty at creation | `0x8cb7b86f…` |
| `forked_from` | str, optional | commit hash the branch forked from; absent for `main` | `0x439fe005…` |
| `$payload` | bytes | empty | — |
| `$contentType` | str | | `application/octet-stream` |

Advancing the head is one atomic batch: patch `head` + extend expiry by 1 year. Arkiv enforces **entity-owner-only** patches, so a branch is single-writer by construction: teammates commit to their own branch (forked from `main`), never to someone else's. See [F-8](friction.md#f-8) for the failure mode this avoids.

Queries:

```
type = str('branch') AND repo_id = str('507ac01a0bd47573')
type = str('branch') AND repo_id = str('507ac01a0bd47573') AND name = str('main')
```

## 4. Commit entity

Attributes:

| Attribute | Arkiv type | Meaning | Example |
|---|---|---|---|
| `type` | str | discriminator | `commit` |
| `repo_id` | str | repo pointer | `507ac01a0bd47573` |
| `branch` | str | branch name | `main` |
| `kind` | str | one of `scratch`, `note`, `decision`, `milestone` | `decision` |
| `author` | addr | wallet that signed the commit | `0x225Fd0b9…` |
| `commit_hash` | str | `0x` + sha256 of the canonical preimage | `0x439fe00593…` |
| `parent` | str, optional | previous commit hash on this branch | `0xc1264cea…` |
| `ts` | u64 | unix seconds (author clock; not block time) | `1792447380` |
| `$payload` | bytes | `CommitEnvelope` JSON below | — |
| `$contentType` | str | | `application/json` |

Expiry is set from `kind` at write time (blocks, 2 s each):

| kind | days | blocks |
|---|---|---|
| `scratch` | 3 | 129,600 |
| `note` | 14 | 604,800 |
| `decision` | 90 | 3,888,000 |
| `milestone` | 365 | 15,768,000 |

### 4.1 Envelope (payload JSON)

```json
{ "v": 1,
  "repoId": "507ac01a0bd47573",
  "branch": "main",
  "parent": null,
  "author": "0x225Fd0b9D011C8BBffd0f0c6f854Cd23b99B6aF7",
  "kind": "decision",
  "ts": 1792447380,
  "nonce": "base64(24 random bytes)",
  "ciphertextHash": "hex sha256 of the decoded ciphertext, no 0x",
  "agent": "claude-code",
  "ciphertext": "base64(XChaCha20-Poly1305 seal of the body JSON)",
  "commitHash": "0x…",
  "sig": "0x…" }
```

Field notes:

- `agent` — short non-empty string ≤ 32 chars; the CLI writes `human` unless invoked through MCP, where it maps `claude` → `claude-code`, `cursor`, `opencode` (see `docs/MCP_SETUP.md`).
- `nonce` / `ciphertext` — standard base64 (not URL-safe). The nonce is 24 bytes; the AEAD tag is included in `ciphertext`.
- `ciphertextHash` binds the ciphertext into the hash preimage (the ciphertext itself is not hashed directly in the preimage).

The **body** is encrypted; the plaintext is:

```json
{ "summary": "Postgres + JSONB for reports table",
  "details": "markdown …",
  "tags": ["db", "schema"] }
```

`details` is capped at 96 KiB and truncated with a visible marker to stay inside the entity-size budget. If a verified commit cannot be decrypted (wrong group key), the CLI/viewer show it as verified-but-locked rather than invalid.

### 4.2 Commit hash and signature

`commitHash` = `"0x"` + hex(sha256(canonical JSON of the preimage fields)):

```json
{ "author": "0x…", "branch": "main", "ciphertextHash": "…", "kind": "decision",
  "nonce": "…", "parent": null, "repoId": "…", "ts": 1792447380, "v": 1 }
```

- Canonical JSON: object keys sorted recursively, no whitespace, integers unquoted, `null` for no parent. Cross-stack byte parity (TS `JSON.stringify` vs Rust) is pinned by interop tests.
- `sig` is an **EIP-191 `personal_sign` over the ASCII commitHash string** — exactly viem's `signMessage({ message: commitHash })` / alloy's `sign_message`. It recovers to `author`.

### 4.3 Verification (strict order)

Every reader (CLI, MCP, browser viewer) applies the same four checks and stops at the first failure:

1. `BAD_HASH` — recompute the hash from the envelope; mismatch ⇒ invalid.
2. `BAD_SIGNATURE` — recover the signer from `sig`; must equal `author`.
3. `OWNER_MISMATCH` — the entity's on-chain `owner` must equal `author` (you cannot publish someone else's signed commit).
4. `NOT_MEMBER` — `author` must be in the repo `members` list (when the repo entity is available).

Invalid ⇒ never decrypted, never rendered as memory. The viewer paints it red with the reason; `cogit log` prints `invalid` + reason. This is why member removal is a revocation mechanism: old entities remain on chain, but every compliant reader rejects them.

### 4.4 Query

```
type = str('commit') AND repo_id = str('507ac01a0bd47573')
type = str('commit') AND repo_id = str('507ac01a0bd47573') AND branch = str('ritesh')
type = str('commit') AND repo_id = str('507ac01a0bd47573') AND commit_hash = str('0x…')
```

String literals use SQL-style escaping: `'` becomes `''` (no backslash escapes). Results are sorted by `ts` for display; the chain returns pages (limit max 200 per request, hex quantity, cursor-paginated).

## 5. Group key and invite

- At `cogit init`, a **32-byte group key** is generated locally. It is never written on chain; only the ciphertexts are public.
- Encryption: **XChaCha20-Poly1305** with the group key directly (24-byte nonce, standard base64).
- Invite format (what `cogit invite` prints and `cogit join` accepts):

  ```
  cogit1:<repo_id>:<base64url-no-pad(group_key)>
  ```

  Example (test keys only): `cogit1:507ac01a0bd47573:ckYwcU_b6OcwmLNW7lSRcDmYoZ4kDIZlAIYQrBuneMY`.
- The invite is both the **pointer** (repo id) and the **secret** (group key). Share it privately. The viewer takes it in memory only; the CLI stores it in `.cogit/config.json` (mode 600, gitignored).

## 6. What is public vs private

| Public on chain | Private (encrypted in `$payload`) |
|---|---|
| repo id + name, member list | commit summary, details, tags |
| branch names, branch owners/heads, fork points | the group key (never on chain) |
| commit kind, author, agent label, timestamp, parent links, hashes, signature | — |
| verification status (anyone can recompute it) | — |

A teammate with the invite can decrypt bodies and verify authorship; anyone else sees only metadata and cannot read memory.

## 7. Write path constraints (things your client must respect)

1. **Entity keys are random**, derived by the engine from a 128-bit salt — they are not content hashes and not derived from `repo_id`.
2. **Patches are owner-only**: `head` updates and member-list updates must be signed by the entity owner's wallet. Membership does not grant write access to someone else's branch or repo payload.
3. **One branch per wallet** is the intended pattern; `main` belongs to the repo creator. Fork from the head you saw, commit on your own branch, let teammates pull it.
4. **Writes estimate gas first**; oversize requests fail before a transaction is sent.
5. **Two transactions can be batched** (`patch head` + `extend expiry`) — the Rust CLI does this atomically; the TS path sends them separately with the same on-chain result.

## 8. Limits and encodings

| Limit | Value | Notes |
|---|---|---|
| Entity size | 131,072 bytes | payload + attribute cells combined; observed transport ceiling ≈ 129,568 B over HTTP with minimal attrs (`413` above that) |
| Attribute cells | 32 total | includes `$payload` + `$contentType` ⇒ **30 user attributes max** |
| Attribute name | ≤ 32 bytes | lowercase `[a-z][a-z0-9._-]*` on the live chain (uppercase is rejected despite the SDK regex) |
| `str` value | ≤ 128 bytes | branch/name/hash fields fit; long text goes in the encrypted payload |
| Commit `details` | 96 KiB | capped by cogit with a truncation marker |
| Query page | 200 | hex quantity; cursor pagination |
| Block time | 2 s | expiry/lifetime units are **blocks** (43,200/day) |

## 9. Minimal end-to-end example

```bash
cogit init atlas-reports            # repo entity, repo_id, group key
cogit commit -m "Postgres + JSONB" --kind decision --tag db schema
cogit branch ritesh && cogit use ritesh
cogit invite 0x1F33…                # adds member + prints cogit1:…
# teammate:
cogit join 'cogit1:…'               # repo_id + group key
cogit branch work && cogit use work
cogit commit -m "SSE for live updates" --kind decision
# anyone:
cogit pull work                     # verified + decrypted markdown
```

A working instance of this schema (2 members, 2 branches, verified commits) is what the viewer at `/viewer?repo=507ac01a0bd47573` renders in **Live · Arkiv** mode.

## 10. Implementation references

| Concern | TypeScript | Rust |
|---|---|---|
| entity encode/write | `packages/core/src/arkiv.ts`, `ops.ts` | `rust/crates/cogit-core/src/arkiv_tx.rs`, `arkiv.rs` |
| envelope + crypto | `packages/core/src/envelope.ts`, `crypto.ts` | `rust/crates/cogit-core/src/envelope.rs`, `crypto.rs` |
| verification | `packages/core/src/verify.ts` | `rust/crates/cogit-core/src/verify.rs` |
| browser reader | `frontend/lib/live.ts`, `verify.ts`, `crypto.ts` | — |

Friction encountered while building this schema — and the exact workarounds — is in [`friction.md`](friction.md) (served at `/arkiv/friction.md`).
