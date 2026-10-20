# Arkiv friction log — cogit

**Project:** [cogit](https://github.com/anurag-p6/cogit) — end-to-end-encrypted, wallet-signed commit context that lives on Arkiv instead of a server. A team forms around one on-chain repo entity; only the group key (shared privately in an invite code) can decrypt memory.

**Network:** Arkiv **Tiramisu** testnet — chain id `7738577`, Arkiv precompile `0x4400000000000000000000000000000000000044`, ~2 s blocks (43,200/day).

**Method:** every finding below was hit live and re-verified against Tiramisu with funded keys — nothing is inferred from docs. Each entry has a minimal reproduction. This file merges and supersedes `docs/FRICTION_LOG.md` (8 TypeScript-sprint findings) and `docs/FRICTION_LOG_RUST.md` (15 Rust-port findings), plus two later viewer/operations findings.

**Stacks:** TypeScript `@arkiv-network/sdk@0.8.1` + `viem@2.57.7` (Node 22.22.2, pnpm 10.28.1, TypeScript 7.0.2) · Rust `arkiv-sdk` git `9375276` ("0.5.0") + `alloy 1.8.3` + `rmcp 3.5.1` · browser viewer Next.js 16.4.2 · MCP servers `@modelcontextprotocol/sdk@1.32.1` vs `rmcp 3.5.1`.

**Status:** the shipped CLI is Rust and does **not** use the broken Rust-SDK write path (F-RS-01) — it uses a ~260-line raw `alloy` encoder, after which bidirectional Rust↔TS E2E passes on Tiramisu. A 40-check MCP parity suite (byte-identical schemas, results and errors vs the TS server) also passes.

---

## Summary

| ID | Area | Finding | Severity |
|---|---|---|---|
| [F-RS-01](#f-rs-01) | Rust SDK | Write path mines transactions that create no entities | blocker |
| [F-RS-02](#f-rs-02) | Rust SDK | crates.io release lags the network; must pin a git rev | major |
| [F-RS-03](#f-rs-03) | Rust SDK | License lineage hidden; GPL forces workspace license | major |
| [F-RS-04](#f-rs-04) | Rust SDK | Crate does not compile without `node-bindings` | major |
| [F-RS-05](#f-rs-05) | Rust SDK | `QueryOpts` serializes to a shape the RPC rejects | blocker |
| [F-RS-06](#f-rs-06) | Engine | Attribute encoding contract (order, type ids, padding) undocumented | major |
| [F-RS-07](#f-rs-07) | Engine | `$payload`/`$contentType` are ordinary attribute cells at ABI level | major |
| [F-RS-08](#f-rs-08) | Rust SDK | Engine event ABI undocumented — cannot decode created key | major |
| [F-RS-09](#f-rs-09) | Engine | Query DSL string form and escaping undocumented | minor |
| [F-RS-10](#f-rs-10) | Toolchain | rustc ICE while rendering diagnostics | minor |
| [F-RS-11](#f-rs-11) | Engine | Lifetimes are blocks, not seconds; helpers hide it | major |
| [F-RS-12](#f-rs-12) | alloy | `sol!` rejects named tuple components in function params | minor |
| [F-RS-13](#f-rs-13) | MCP | schemars `with` + `serde(default)` silently diverge from zod | major |
| [F-RS-14](#f-rs-14) | MCP | rmcp and the TS MCP SDK disagree on what an error is | major |
| [F-RS-15](#f-rs-15) | MCP | zod's exact validation wording only exists in zod | minor |
| [F-1](#f-1) | TS SDK | pnpm 10 ignores esbuild build script (warn only) | minor |
| [F-2](#f-2) | Engine | 32-attribute cap includes 2 system cells; more limits undocumented | major |
| [F-3](#f-3) | Tooling | PowerShell 5.1 mangles quotes for `wsl bash -c` | minor |
| [F-4](#f-4) | Tooling | git over `\\wsl.localhost` fails with "dubious ownership" | minor |
| [F-5](#f-5) | TS SDK | Types use viem's `Hex` but do not re-export it | minor |
| [F-6](#f-6) | Engine | Uppercase attribute names rejected although docs/error text allow `A-Z` | major |
| [F-7](#f-7) | Transport | HTTP/WS caps reject payloads below the 128 KiB engine limit | major |
| [F-8](#f-8) | Ownership | Branch heads are single-writer; a teammate's commit leaves dangling entities | major |
| [F-WEB-1](#f-web-1) | Browser | SDK bundle requires stubs for Node-only `node:zlib`/`brotli-wasm` | minor |
| [F-OPS-1](#f-ops-1) | RPC | Anonymous query budget exhausts fast; 429 with `ANON_COST_LIMITED` | major |

Severity: **blocker** = stops the integration; **major** = silently wrong behavior or a day lost; **minor** = papercut with a known workaround.

---

## Engine, entity model and limits

### F-2

**32-attribute cap includes the 2 system cells; other limits undocumented.** · Engine · major · observed 2026-10-17

- **Expected:** docs said "up to 30 typed pairs"; the SDK exports `MAX_ATTRIBUTES = 32` — looked contradictory.
- **Happened:** 30 user attributes succeed; 31 revert with `An entity may carry at most 32 attributes, got 33.` The engine counts `$contentType` + `$payload` (2 system cells) toward the 32. Also absent from the spec: `str` values are capped at 128 bytes and attribute names at 32 bytes.
- **Reproduce:** create entities with 30 and 31 user attributes over `http()` (our `scripts/ws-probe.ts --attrs N` pattern); the 31st user attribute trips the revert.
- **Workaround:** budget 30 user attributes; keep `str` values ≤ 128 bytes and names ≤ 32 bytes, lowercase (see F-6).

### F-6

**Uppercase attribute names are rejected although the SDK regex and the revert message both allow `A-Z`.** · Engine · major · observed 2026-10-17

- **Expected:** the SDK's grammar is `/^[A-Za-z][A-Za-z0-9._-]*$/`, and the chain's own revert text lists `"A"-"Z"` in the charset — so `repoId` should be valid.
- **Happened:** `createEntity` with attribute `repoId` reverted:

  ```
  Transaction failed: an attribute name holds "I" (0x49) at byte 4, which is outside
  the name charset ("A"-"Z", "a"-"z", "0"-"9", ".", "-" and "_", with a letter first)
  ```

  Probes: `repoX` and `RepoId` rejected too; `repoid`, `repo_id`, `repo1` accepted. The on-chain grammar is lowercase-only.
- **Reproduce:** create an entity with an attribute named `repoX` (our `scripts/name-probe.ts` pattern) and read the revert.
- **Workaround:** lowercase all names — our data model uses `repo_id`, `forked_from`, `commit_hash`. Names are `bytes32`, UTF-8, NUL-padded (see F-RS-06).

### F-7

**Transport caps reject payloads below the 128 KiB engine limit.** · Transport · major · observed 2026-10-17

- **Expected:** `MAX_PAYLOAD_BYTES = 131072`, so a payload just under it should be writable.
- **Happened:** a 131072-byte payload dies at gas estimation: `Execution error without revert data | HTTP request failed. Status: 413`. Binary search over HTTP: 129568 B accepted, 129569 B → 413. Over WebSocket the same boundary fails as `WebSocket request failed`. With 20 extra attributes, even 129568 B is rejected — the 131072-byte entity cap counts payload **and** attribute cells.
- **Reproduce:** `createEntity` with `new Uint8Array(131072)` (the payload-limit stage of `pnpm spike`), then bisect; repeat over `webSocket()`.
- **Workaround:** keep payloads well under the cap — we truncate commit details to leave envelope/attribute headroom.

### F-RS-06

**Attribute encoding contract is undocumented.** · Engine · major · observed 2026-10-18

- **Expected:** the Rust SDK would encode attributes the way the live engine expects.
- **Happened:** the contract exists only in the TS SDK source and engine behavior: type ids (`bool=1, i32=2, u64=3, u256=4, dec=5, bytes32=6, bytes=7, str=8, addr=9, key=10`), attributes **strictly sorted ascending by the 32-byte `Ident32` name**, `str` values as raw UTF-8 bytes, `Ident32` names as UTF-8 left-aligned NUL-padded to 32 bytes, `u64` values as ABI words. One mistake yields either a revert or a silently unqueryable attribute.
- **Reproduce:** write with any raw path (F-RS-01 forces this) and vary one dimension at a time; query the entity back.
- **Workaround:** mirrored the TS SDK's encoder exactly in `rust/crates/cogit-core/src/arkiv_tx.rs`, verified bidirectionally (TS reads Rust-written repos and vice versa).

### F-RS-07

**System cells leak through the low level.** · Engine · major · observed 2026-10-18

- **Expected:** payload and content type would be first-class parameters of the write call.
- **Happened:** at ABI level there is no payload parameter — `$payload` (bytes) and `$contentType` (str) are ordinary attribute cells. The builder API hides this; any raw path must know it, and payload bounds are not stated in the Rust SDK at all.
- **Reproduce:** decode the calldata of any TS-SDK `createEntity`.
- **Workaround:** encode `$payload`/`$contentType` as attribute cells with type ids 7/8; cap committed details under the 128 KiB entity budget.

### F-RS-11

**Lifetimes are blocks, not seconds.** · Engine · major · observed 2026-10-18

- **Expected:** parts of the Rust SDK surface read as seconds/durations.
- **Happened:** entity lifetimes are **blocks** on the live chain (2-second blocks; 43,200/day). The TS `ExpirationTime` helpers are block-based (`minLifetime` = days × 43,200). Mixing units silently shortens or lengthens expiry with no error.
- **Reproduce:** create with `fromHours(6)` on the TS SDK — `expiresAt = createBlock + 10,800`.
- **Workaround:** `cogit-core` passes blocks everywhere and names the parameter `min_lifetime`.

### F-RS-09

**Query DSL string form and escaping are undocumented.** · Engine · minor · observed 2026-10-18

- **Expected:** a documented, typed query API in the Rust SDK.
- **Happened:** encrypted-context filtering required the string form `type = str('repo') AND repo_id = str('…')`. Escaping is SQL-style single-quote doubling (`''`), no backslash escapes. The Rust SDK has no equivalent of the TS `and()`/`or()` builders.
- **Reproduce:** filter by a value containing `'` without doubling it.
- **Workaround:** build the DSL string ourselves with doubled quotes.

---

## Ownership and multi-writer behavior

### F-8

**Branch heads are single-writer by construction — a teammate's commit leaves dangling entities.** · Ownership · major · observed 2026-10-17

- **Expected:** with the teammate wallet added to the repo's `members`, committing to a shared branch would just work (the member model reads as shared write access).
- **Happened:** the teammate's commit entity is created, then the Branch `head` patch fails:

  ```
  Transaction failed: entity 0x1bccd466…5775d6 is owned by 0x225Fd0b9…, not 0x1F3305F4…
  ```

  Arkiv enforces raw entity ownership (`NotOwner`) on patches; membership does not matter. Only the wallet that created the Branch can advance its head. Result: a dangling Commit entity that `pull` later surfaces with no Branch head referencing it.
- **Reproduce:** `cogit init` as wallet A → `cogit invite <B>` → `cogit join` as B → as B, `cogit commit -m x` on the default branch. The tx reverts, but the commit entity is already on chain.
- **Workaround:** one branch per person (B runs `cogit branch <name> && cogit use <name>`); `commitContext` now checks `branch.owner ≠ caller` **before** writing anything and returns a corrective message. Design takeaway: think of a branch as a per-wallet append-only log, not a shared mutex-guarded ref.

---

## Rust SDK

### F-RS-01

**Write path sends calldata the live engine ignores.** · Rust SDK · blocker · observed 2026-10-18

- **Expected:** `provider.create_entities(…)` / `provider.update_entities(…)` write to Tiramisu.
- **Happened:** transactions mine successfully but contain **no entities**. Receipt decoding fails with `no entity created in receipt`; there is no `EntityCreated` event on chain. Reproduced with fresh keys.
- **Root cause:** the SDK emits **brotli-compressed RLP** calldata, while the live engine expects a plain ABI-encoded call to

  ```
  execute((uint8 operation, bytes operationData)[])
  ```

  with operations 1 create / 2 patch / 3 extend-expiry / 4 transfer-ownership / 5 delete, matching the TS SDK 0.8.1 (which works). `CreateOpData { uint128 salt; uint64 expiresAt; uint64 minLifetime; uint8 creationFlags; Attribute[] attributes }`; the entity key derives from the random 128-bit salt.
- **Reproduce:** `create_entities` against Tiramisu with any funded key; wait for the receipt; look for `EntityCreated` — zero. (The only failure signal is a missing entity in the receipt, easily misread as an RPC decoding bug.)
- **Workaround:** wrote the encoder ourselves — `rust/crates/cogit-core/src/arkiv_tx.rs`, ~260 lines with `alloy::sol!`; verified bidirectionally (TS pulls/verifies Rust-written repos and vice versa).
- **Upstream:** either emit the ABI calldata above, or decode engine events so callers can detect that nothing was written.

### F-RS-02

**crates.io release lags the network; pin a git revision.** · Rust SDK · major · observed 2026-10-18

- **Expected:** `cargo add arkiv-sdk` gives a crate matching the live entity model.
- **Happened:** the published crates.io version predates the current model; we had to pin `rev = "93752767222e11926529b9b771d6cade7e0d9774"` to get anything that works against Tiramisu. It is not obvious from crate docs which engine/network a version targets.
- **Reproduce:** build against the crates.io version and try a write (see F-RS-01/F-RS-05).
- **Workaround:** git pin, documented in `rust/Cargo.toml`.

### F-RS-03

**License lineage is invisible until you dig.** · Rust SDK · major · observed 2026-10-18

- **Expected:** license visible in README/crate metadata.
- **Happened:** the crate's GPL-3.0-or-later lineage is not surfaced where a consumer will see it; the workspace had to declare `license = "GPL-3.0-or-later"` and reference `LICENSE-RUST`. For a project that wants to ship MIT, this is a real constraint discovered late — evaluate license before adopting.
- **Reproduce:** inspect the dependency tree's license metadata.
- **Workaround:** keep the Rust workspace + `LICENSE-RUST` GPL and flag it in docs; choose the dependency consciously.

### F-RS-04

**Crate does not compile without `node-bindings`.** · Rust SDK · major · observed 2026-10-18

- **Expected:** `default-features = false` builds a headless CLI.
- **Happened:** `src/utils.rs` uses `reqwest` (in `generate_fee_history`) unconditionally, but `reqwest` is optional and gated behind `node-bindings`. The crate fails to compile.
- **Reproduce:** depend on the crate with `default-features = false` and `cargo check`.
- **Workaround:** enable `features = ["node-bindings", "pubsub"]`, dragging WASM/node binding deps into a plain CLI. Upstream fix is one `#[cfg(feature = "node-bindings")]` on that function.

### F-RS-05

**`QueryOpts` serializes to a shape the RPC rejects.** · Rust SDK · blocker · observed 2026-10-18

- **Expected:** `provider.query(…)` works like the TS `select().fetch()`.
- **Happened:** the SDK serializes snake_case (`at_block`, `results_per_page`); the RPC replies `-32602 invalid params`. The working shape (what the TS SDK sends) is camelCase with **hex** quantities:

  ```json
  { "select": { "key": true, "payload": true, "attributes": true },
    "limit": "0xc8", "cursor": "…", "atBlock": "0x…" }
  ```

  `limit` is a hex string (max 200), not a number. Responses use key `"data"` (not `"entities"`), entities carry a top-level hex `payload`, and `attributes` come back as `[{name, type, value}]` rather than a decoded map.
- **Reproduce:** call the SDK `query` helper against Tiramisu; observe `-32602`.
- **Workaround:** all reads go through `provider.client().request("arkiv_query", (filter, options))` with the camelCase shape (in `rust/crates/cogit-core/src/arkiv.rs`).

### F-RS-08

**Engine event ABI is undocumented in the Rust SDK.** · Rust SDK · major · observed 2026-10-18

- **Expected:** the SDK receipt type gives the created entity key.
- **Happened:** with the SDK write path broken (F-RS-01) the receipt type is unusable; extracting the key requires decoding `EntityCreated(bytes32 indexed entityKey, address indexed owner, uint64 expiresAt, uint8 creationFlags)` — signatures only findable in the TS SDK/contracts. `EntityPatched`, `ExpiryExtended`, `OwnershipTransferred`, `EntityDeleted` are likewise undocumented.
- **Reproduce:** attempt to get the entity key from an SDK receipt.
- **Workaround:** declare the events in `alloy::sol!` and decode with `SolEvent::decode_log`.

### F-RS-12

**`alloy::sol!` rejects named tuple components in function params.** · alloy 1.8.3 · minor · observed 2026-10-18

- **Expected:** `function execute((uint8 operation, bytes operationData)[] ops)` parses.
- **Happened:** `sol!` fails with `expected ,`.
- **Reproduce:** paste that signature into `sol!`.
- **Workaround:** declare a struct and use it as the tuple element (`struct OperationStruct { uint8 operation; bytes operationData; }` → `function execute(OperationStruct[] ops)`) — identical ABI and selector. Also needed `use alloy::network::TransactionBuilder` for `.with_to()/.with_input()` and `alloy::sol_types::SolEvent` for `decode_log`.

### F-RS-10

**rustc ICE while rendering diagnostics.** · Toolchain · minor · observed 2026-10-18

- **Expected:** compile errors render normally.
- **Happened:** the pinned toolchain hit an internal compiler error while rendering certain diagnostics, masking real errors.
- **Reproduce:** compile the crate with the exact pinned toolchain.
- **Workaround:** `cargo check --message-format short`; worth reporting upstream to the toolchain.

---

## MCP parity

### F-RS-13

**schemars `with` + `serde(default)` silently diverge from the zod schema.** · MCP · major · observed 2026-10-19

- **Expected:** derive JSON Schemas with schemars 1.2 that are byte-identical to the zod-authored `tools/list` schema.
- **Happened:** two compounding effects. `with = "u64"` adds `"format": "uint64"` (zod has no such key), and bare `#[serde(default)]` injects `"default": null` into every optional field. More subtly, `schemars(with = …)`/`schema_with` replace the field type for schema generation, resetting required-vs-optional inference — without `serde(default)` the fields become `required`.
- **Reproduce:** derive both and diff the tool list.
- **Workaround:** keep `serde(default)` for the `required` list and add a last-stage transform to delete the extra keys:

  ```rust
  fn ts_schema_cleanup(schema: &mut schemars::Schema) {
      if let Some(obj) = schema.as_object_mut() {
          obj.remove("default");
          obj.remove("format");
      }
  }
  ```

### F-RS-14

**rmcp and the TS MCP SDK disagree on what an error is.** · MCP · major · observed 2026-10-19

- **Expected:** same client, same behaviour across servers.
- **Happened:** `@modelcontextprotocol/sdk@1.32.1` servers resolve **all** tool-call failures — validation, unknown tool, thrown exceptions — as `isError: true` results whose text is `MCP error -32602: …`. `rmcp 3.5.1` only converts argument-deserialization failures (`failed to deserialize parameters:` + `INVALID_PARAMS`) into results; everything else is a JSON-RPC protocol error. Identical input gives different client-visible behaviour.
- **Reproduce:** call both servers with an unknown tool name and compare frames.
- **Workaround:** override `ServerHandler::call_tool`, delegate to the generated router, and translate `Err(ErrorData)` into `CallToolResult::error` with `MCP error {code}: …` text (and reword rmcp's deserialization prefix / `tool not found` → `Tool {tool} not found`). Verified by a 40-check parity suite over the TS client (`rust/scripts/mcp-e2e.mjs`).

### F-RS-15

**zod's exact validation wording only exists in zod.** · MCP · minor · observed 2026-10-19

- **Expected:** byte-equal error text across servers.
- **Happened:** matching required mirroring zod's constraint strings by hand (`Too small: expected string to have >=1 characters at summary`). Missing-required or type-mismatched fields still say serde's `missing field \`branch\``; only the outer `MCP error …: Input validation error: Invalid arguments for tool …` envelope is normalized.
- **Reproduce:** send a missing required field to both servers.
- **Workaround:** accept the seam; document it. If a client ever parses these strings, that is where it breaks.

---

## TypeScript SDK

### F-1

**pnpm 10 ignores the esbuild build script (warning only).** · TS SDK · minor · observed 2026-10-17

- **Happened:** every install prints `Ignored build scripts: esbuild@0.28.2.`
- **Reproduce:** fresh clone → `pnpm install`.
- **Workaround:** none needed — esbuild ships a prebuilt binary; `pnpm exec tsx --version` works. Optional `pnpm approve-builds`.

### F-5

**Types use viem's `Hex` but do not re-export it.** · TS SDK · minor · observed 2026-10-17

- **Happened:** `error TS2459: Module '"@arkiv-network/sdk"' declares 'Hex' locally, but it is not exported.`
- **Reproduce:** `import type { Hex } from "@arkiv-network/sdk"` then `tsc --noEmit`.
- **Workaround:** `import type { Hex } from "viem"`.

---

## Browser viewer

### F-WEB-1

**SDK bundle requires stubs for Node-only modules in a static export.** · Browser · minor · observed 2026-10-19

- **Expected:** `next build` of a fully client-side viewer that imports the SDK just works.
- **Happened:** the SDK's module graph references `node:zlib` and `brotli-wasm`, which do not exist in the browser; a static export needs explicit aliases to empty modules (we alias both in `frontend/next.config.ts` for webpack and turbopack; the browser path never uses them). Related: `NEXT_PUBLIC_*` env vars are baked at build time, so the RPC URL (with its access key) must be present when `next build` runs, not at serve time.
- **Reproduce:** build a client-only app that imports the SDK without those aliases.
- **Workaround:** aliases in `next.config.ts`; keyed RPC supplied via `NEXT_PUBLIC_ARKIV_RPC_URL` at build (testnet key, visible in the bundle by design).

---

## RPC and operations

### F-OPS-1

**Anonymous query budget exhausts fast; 429 with `ANON_COST_LIMITED`.** · RPC · major · observed 2026-10-19

- **Expected:** the public Tiramisu endpoint keeps serving anonymous reads during development.
- **Happened:** after a burst of tests, every call returned HTTP 429 with

  ```json
  {"error":"ANON_COST_LIMITED","message":"unauthenticated query budget exhausted; get an API key at https://hub.arkiv.network for a monthly quota"}
  ```

  Our 40-check parity suite alone makes hundreds of reads, so the anonymous budget is easy to exhaust in one afternoon. The error text points at the right place, but nothing in the SDK docs warns that anonymous reads are metered.
- **Reproduce:** hammer `arkiv_query`/`eth_call` anonymously until 429.
- **Workaround:** create a key at `https://hub.arkiv.network` and append it to the RPC URL path (`https://rpc.tiramisu.db-chain.testnet.arkiv.network/ark_…`). Neither SDK needs code changes; the browser build bakes the URL through `NEXT_PUBLIC_ARKIV_RPC_URL`.

---

## Developer environment (Windows/WSL)

### F-3

**PowerShell 5.1 mangles quotes for `wsl bash -c`.** · Tooling · minor · observed 2026-10-17

- **Happened:** nested quotes/redirects corrupt — `Could not find a part of the path '\\wsl.localhost\…\dev\null'`, or bash receives garbled input. Workaround used throughout this project: stage every nontrivial command in a `.sh` file and run `wsl -d Ubuntu -- bash /tmp/x.sh`. Also: non-interactive WSL shells need `PATH="$HOME/.cargo/bin:$PATH"`.

### F-4

**git over the `\\wsl.localhost` UNC path refuses with "dubious ownership".** · Tooling · minor · observed 2026-10-17

- **Happened:** `fatal: detected dubious ownership in repository at '//wsl.localhost/Ubuntu/home/anurag/cogit'`.
- **Reproduce:** `git -C \\wsl.localhost\Ubuntu\home\anurag\cogit status` from PowerShell.
- **Workaround:** run git inside WSL, or `git -c safe.directory='//wsl.localhost/Ubuntu/home/anurag/cogit' …`.

---

## What worked well

- Public API shapes are ergonomic: `ProviderBuilder`/`DynProvider`/`PrivateKeySigner` in Rust and the fluent `select().where().fetch()` in TS; signing and transaction plumbing worked first try once wired.
- `provider.client().request(…)` is a real escape hatch — the raw `arkiv_query` read path and the raw `execute` write path (F-RS-01 workaround) both fit through it without forking the crate.
- Read semantics match across implementations: keys, owners, attribute decoding and block timing line up closely enough that **Rust verifies TS-written repos and TS verifies Rust-written ones unchanged** (hash → signature → entity owner → repo membership), and the browser viewer re-verifies and decrypts every commit client-side with the same rules.
- 2-second blocks make the whole demo loop (commit → viewer refresh ≤ 5 s) feel instant.

## Recommendations to the Arkiv team

1. Fix or document the Rust SDK write path (F-RS-01) and `QueryOpts` (F-RS-05); these two are blockers for any Rust integration.
2. Document the attribute ABI contract (F-RS-06/07) and the real name grammar (F-6): lowercase-only, 32-byte `Ident32` names, sorted ascending, type ids, padding.
3. Publish per-network support in the crate README and on crates.io (F-RS-02), and surface the license (F-RS-03).
4. Make the node-bindings feature actually optional (F-RS-04).
5. Document lifetime units and the payload/attribute accounting (F-RS-11, F-2, F-7).
6. Align MCP error semantics across SDKs (F-RS-14), or document the difference.
7. State that anonymous RPC reads are metered and link the quota flow next to the endpoint URL (F-OPS-1).

## Reproducing all of this

```bash
git clone https://github.com/anurag-p6/cogit && cd cogit
pnpm install
# funded keys + keyed RPC URL in .env (PRIVATE_KEY, PRIVATE_KEY_2, ARKIV_RPC_URL)
rust/scripts/mcp-e2e-setup.sh && node rust/scripts/mcp-e2e.mjs   # 40-check TS↔Rust MCP parity
```

Each entry above also gives its own minimal reproduction. Internal, longer-form logs: [`docs/FRICTION_LOG.md`](https://github.com/anurag-p6/cogit/blob/main/docs/FRICTION_LOG.md) and [`docs/FRICTION_LOG_RUST.md`](https://github.com/anurag-p6/cogit/blob/main/docs/FRICTION_LOG_RUST.md).
