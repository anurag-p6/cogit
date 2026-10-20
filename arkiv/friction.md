# Arkiv integration friction log

**Project:** [cogit](https://github.com/anurag-p6/cogit) — encrypted, wallet-signed team context stored on Arkiv. A team forms around one on-chain repo entity; the group key is shared privately in an invite and is required to decrypt commit bodies.

**Network:** Arkiv Tiramisu testnet — chain id `7738577`, Arkiv precompile `0x4400000000000000000000000000000000000044`, approximately 2-second blocks (43,200 blocks per day).

**Observation period:** 2026-10-17 to 2026-10-20.

**Stacks:** TypeScript `@arkiv-network/sdk@0.8.1` with `viem@2.57.7` (Node 22.22.2, pnpm 10.28.1, TypeScript 7.0.2); Rust `arkiv-sdk` at git revision `9375276`, `alloy 1.8.3`, `rmcp 3.5.1`; browser viewer on Next.js 16.4.2; MCP servers built with `@modelcontextprotocol/sdk@1.32.1` and `rmcp 3.5.1`.

**Method:** On-chain findings were reproduced against Tiramisu with funded wallets. Tooling findings were reproduced locally. Exact error text is quoted where available; versions are those pinned in the repository at the time of observation. Documentation is cited only where it conflicted with observed behavior.

**Scope:** 25 findings. Eight are from the TypeScript sprint (`F-1`–`F-8`), fifteen from the Rust port (`F-RS-01`–`F-RS-15`), and two from viewer and operations work (`F-WEB-1`, `F-OPS-1`).

**Integration status:** The shipped CLI is written in Rust and does not use the SDK write path affected by `F-RS-01`; it uses a raw `alloy` encoder in `rust/crates/cogit-core/src/arkiv_tx.rs`. Reads use the raw `arkiv_query` method described in `F-RS-05`. With those replacements, Rust and TypeScript implementations read and verify each other's commits on Tiramisu. A 40-assertion MCP parity suite (`rust/scripts/mcp-e2e.mjs`) passes against the TypeScript server.

---

## Summary

| ID | Area | Finding | Severity |
|---|---|---|---|
| [F-2](#f-2) | Engine | 32-attribute cap includes 2 system cells; other limits not documented | major |
| [F-6](#f-6) | Engine | Uppercase attribute names rejected although the SDK and revert text allow `A-Z` | major |
| [F-7](#f-7) | Transport | Transport limits reject payloads below the 128 KiB engine limit | major |
| [F-RS-06](#f-rs-06) | Engine | Attribute encoding contract is undocumented | major |
| [F-RS-07](#f-rs-07) | Engine | `$payload` and `$contentType` are ordinary attribute cells at ABI level | major |
| [F-RS-11](#f-rs-11) | Engine | Entity lifetimes are measured in blocks, not seconds | major |
| [F-RS-09](#f-rs-09) | Engine | Query DSL string form and escaping are undocumented | minor |
| [F-8](#f-8) | Ownership | Branch heads are single-writer; a failed head update leaves a commit entity on chain | major |
| [F-RS-01](#f-rs-01) | Rust SDK | Write path submits calldata the live engine does not execute | blocker |
| [F-RS-02](#f-rs-02) | Rust SDK | Published crates.io version does not target the live network; a git revision is required | major |
| [F-RS-03](#f-rs-03) | Rust SDK | Crate is GPL-3.0-or-later; the license is not evident from its metadata | major |
| [F-RS-04](#f-rs-04) | Rust SDK | Crate does not compile with `default-features = false` | major |
| [F-RS-05](#f-rs-05) | Rust SDK | `QueryOpts` serializes to a shape the RPC rejects | blocker |
| [F-RS-08](#f-rs-08) | Rust SDK | Engine event ABI is not documented in the SDK | major |
| [F-RS-12](#f-rs-12) | alloy | `sol!` rejects named tuple components in function parameters | minor |
| [F-RS-10](#f-rs-10) | Toolchain | rustc internal compiler error while rendering diagnostics | minor |
| [F-RS-13](#f-rs-13) | MCP | schemars output diverges from the zod-authored schema | major |
| [F-RS-14](#f-rs-14) | MCP | `rmcp` and the TypeScript MCP SDK use different error semantics | major |
| [F-RS-15](#f-rs-15) | MCP | Exact zod validation messages cannot be reproduced with serde/rmcp | minor |
| [F-1](#f-1) | TypeScript SDK | pnpm 10 skips the esbuild build script (warning only) | minor |
| [F-5](#f-5) | TypeScript SDK | The SDK uses viem's `Hex` type but does not re-export it | minor |
| [F-WEB-1](#f-web-1) | Browser | Browser bundles require aliases for Node-only modules | minor |
| [F-OPS-1](#f-ops-1) | RPC | Anonymous query budget is metered; requests return 429 when exhausted | major |
| [F-3](#f-3) | Tooling | PowerShell 5.1 corrupts quoting for `wsl bash -c` | minor |
| [F-4](#f-4) | Tooling | git over the `\\wsl.localhost` path reports "dubious ownership" | minor |

**Severity definitions**

- **blocker** — the documented or expected path cannot be used; integration requires replacing or bypassing the component.
- **major** — integration is possible only with a workaround, or default behavior is incorrect in a way that affects correctness or interoperability.
- **minor** — localized developer-experience issue with a documented workaround; no correctness impact.

## Key findings

1. **The Rust SDK's write and query paths did not work against the live network.** Writes mined transactions that created no entities (`F-RS-01`); the query helper serialized parameters the RPC rejected (`F-RS-05`). Both paths were replaced with direct calls through the provider's request interface.
2. **Several engine contracts are not documented for SDK consumers.** These include the attribute ABI (`F-RS-06`, `F-RS-07`), the effective attribute-name grammar (`F-6`), entity and transport limits (`F-2`, `F-7`), lifetime units (`F-RS-11`), and the engine event ABI (`F-RS-08`).
3. **Arkiv enforces entity ownership on writes.** Membership in the repo entity does not grant write access to another wallet's branch. A shared branch produces a successful commit write followed by a failed head update (`F-8`). Cogit uses one branch per wallet and checks branch ownership before writing.
4. **MCP error semantics differ between SDKs.** With the same client, the TypeScript server returns tool errors as `isError` results while `rmcp` raises protocol errors. Matching behavior required a translation layer and a parity suite (`F-RS-13`, `F-RS-14`, `F-RS-15`).

---

## Engine, entity model and transport

### F-2

**Attribute cap: 30 user attributes; the two system cells count toward the 32-attribute limit.** · Engine · major · handled in cogit · observed 2026-10-17

- **Expected:** The documented cap is 30 typed attributes, while the SDK exports `MAX_ATTRIBUTES = 32`. The two values appeared inconsistent.
- **Observed:** An entity with 30 user attributes is accepted. A 31st user attribute reverts with:

  ```
  An entity may carry at most 32 attributes, got 33.
  ```

  The engine counts `$contentType` and `$payload` (two system cells) toward the limit. The SDK also enforces `str` values of at most 128 UTF-8 bytes and attribute names of at most 32 bytes; these limits were not part of the documentation used.
- **Reproduction:** Create entities with 30 and 31 user attributes; the 31st attempt reverts.
- **Workaround:** Budget 30 user attributes. Keep `str` values at or below 128 bytes and names at or below 32 bytes.

### F-6

**Uppercase attribute names are rejected although the SDK grammar and the revert message both allow `A-Z`.** · Engine · major · handled by convention · observed 2026-10-17

- **Expected:** The SDK validates names with `/^[A-Za-z][A-Za-z0-9._-]*$/`, and the chain's revert text lists `"A"`–`"Z"` in the allowed character set. `repoId` should therefore be valid.
- **Observed:** Creating an entity with the attribute name `repoId` reverts:

  ```
  Transaction failed: an attribute name holds "I" (0x49) at byte 4, which is outside
  the name charset ("A"-"Z", "a"-"z", "0"-"9", ".", "-" and "_", with a letter first)
  ```

  Additional probes: `repoX` and `RepoId` are rejected; `repoid`, `repo_id` and `repo1` are accepted. The effective on-chain grammar is lowercase-only.
- **Reproduction:** Create an entity with an attribute named `repoX` and read the revert.
- **Workaround:** Use lowercase attribute names. Cogit's data model uses `repo_id`, `forked_from` and `commit_hash`. Names are encoded as 32-byte, UTF-8, NUL-padded values (`F-RS-06`).

### F-7

**Transport limits reject payloads below the documented 128 KiB engine limit.** · Transport · major · handled by truncation · observed 2026-10-17

- **Expected:** `MAX_PAYLOAD_BYTES = 131072`; a payload just below that size should be writable.
- **Observed:** A 131072-byte payload fails during gas estimation:

  ```
  Execution error without revert data | HTTP request failed. Status: 413
  ```

  A binary search over HTTP accepted 129568 bytes and rejected 129569 bytes with the same 413. Over WebSocket, the same boundary produced `WebSocket request failed`. With 20 additional attributes, 129568 bytes was also rejected, which indicates that the 131072-byte entity limit accounts for the payload and attribute cells together.
- **Reproduction:** Run the payload-limit stage of `pnpm spike`, which performs the binary search; repeat with the WebSocket transport.
- **Workaround:** Keep payloads below the cap with headroom. Cogit truncates commit details at 96 KiB (`MAX_DETAILS_BYTES` in `rust/crates/cogit-core/src/ops.rs`) to leave space for the envelope and attributes.

### F-RS-06

**Attribute encoding contract is undocumented in the Rust SDK.** · Engine · major · mirrored from the TypeScript SDK · observed 2026-10-18

- **Expected:** The Rust SDK would encode attributes in the form the live engine accepts.
- **Observed:** The contract is defined by the TypeScript SDK implementation and engine behavior, not by the Rust SDK documentation. It includes:
  - type ids: `bool=1`, `i32=2`, `u64=3`, `u256=4`, `dec=5`, `bytes32=6`, `bytes=7`, `str=8`, `addr=9`, `key=10`;
  - attributes sorted strictly ascending by the 32-byte `Ident32` name;
  - names encoded as UTF-8, left-aligned and NUL-padded to 32 bytes;
  - `str` values encoded as raw UTF-8 bytes and `u64` values as ABI words.

  An incorrect encoding produces either a revert or an attribute that is written but cannot be queried.
- **Reproduction:** Write through a raw path and vary one encoding dimension at a time; query the entity back.
- **Workaround:** The encoder in `rust/crates/cogit-core/src/arkiv_tx.rs` mirrors the TypeScript implementation. It was verified in both directions: each implementation reads and verifies repositories written by the other.

### F-RS-07

**`$payload` and `$contentType` are ordinary attribute cells at the ABI level.** · Engine · major · handled by encoder · observed 2026-10-18

- **Expected:** Payload and content type would be first-class parameters of the write call.
- **Observed:** The write call has no payload parameter. `$payload` (bytes) and `$contentType` (str) are attribute cells with type ids 7 and 8. The builder API hides this, but any raw call path must encode both cells. Payload size bounds are not stated in the Rust SDK.
- **Reproduction:** Decode the calldata of an entity created by the TypeScript SDK.
- **Workaround:** Encode `$payload` and `$contentType` as attribute cells and keep committed details within the entity budget described in `F-7`.

### F-RS-11

**Entity lifetimes are measured in blocks, not seconds.** · Engine · major · handled in cogit-core · observed 2026-10-18

- **Expected:** Parts of the Rust SDK surface read as durations in seconds.
- **Observed:** On the live chain, lifetimes are expressed in blocks. Tiramisu produces approximately 2-second blocks (43,200 per day). The TypeScript `ExpirationTime` helpers are block-based as well: for example, `fromHours(6)` sets `expiresAt` to `createBlock + 10,800`. Mixing seconds and blocks changes expiry without an error.
- **Reproduction:** Create an entity with `fromHours(6)` through the TypeScript SDK and inspect the resulting expiry relative to the creation block.
- **Workaround:** `cogit-core` passes blocks in every layer and names the parameter `min_lifetime`.

### F-RS-09

**Query DSL string form and escaping are undocumented in the Rust SDK.** · Engine · minor · handled in cogit-core · observed 2026-10-18

- **Expected:** A typed query API equivalent to the TypeScript builders.
- **Observed:** Filtering encrypted context required the string form:

  ```
  type = str('repo') AND repo_id = str('…')
  ```

  String escaping uses SQL-style single-quote doubling (`''`); backslash escapes are not supported. The Rust SDK has no equivalent of the TypeScript `and()` and `or()` combinators.
- **Reproduction:** Filter by a value containing a single quote without doubling it.
- **Workaround:** Build the query string explicitly and double embedded quotes.

---

## Ownership and multi-writer behavior

### F-8

**Branch heads are single-writer; a failed head update leaves the commit entity on chain.** · Ownership · major · fixed in cogit · observed 2026-10-17

- **Expected:** Adding a wallet to the repo's `members` list would allow that wallet to commit to a shared branch. The member model reads as shared write access.
- **Observed:** The teammate's commit entity is created, then the branch head update fails:

  ```
  Transaction failed: entity 0x1bccd466…5775d6 is owned by 0x225Fd0b9…, not 0x1F3305F4…
  ```

  Arkiv enforces entity ownership on patch operations; membership does not grant patch rights to another wallet's entity. Only the wallet that created the branch can advance its `head`. The commit entity remains on chain but is not referenced by the branch head.
- **Reproduction:** Initialize a repo as wallet A, invite wallet B, join as B, and commit as B on the default `main` branch. The transaction reverts, but the commit entity has already been written.
- **Workaround:** Use one branch per wallet (`cogit branch <name>` then `cogit use <name>`). Commit paths now check `branch.owner != caller` before writing and return a corrective message. Design implication: a branch is a per-wallet append-only log, not a shared mutable ref.

---

## Rust SDK

### F-RS-01

**Write path submits calldata the live engine does not execute.** · Rust SDK · blocker · replaced with a raw encoder · observed 2026-10-18

- **Expected:** `provider.create_entities(…)` and `provider.update_entities(…)` would create entities on Tiramisu.
- **Observed:** Transactions mine successfully but contain no entities. Receipt decoding fails with `no entity created in receipt`, and there is no `EntityCreated` event in the receipt. The behavior was reproduced with fresh keys.
- **Cause:** The SDK emits brotli-compressed RLP calldata. The live engine expects a plain ABI-encoded call to:

  ```
  execute((uint8 operation, bytes operationData)[])
  ```

  The operation ids are 1 create, 2 patch, 3 extend expiry, 4 transfer ownership and 5 delete. The TypeScript SDK 0.8.1 encodes this call successfully. The create payload is:

  ```
  CreateOpData { uint128 salt; uint64 expiresAt; uint64 minLifetime; uint8 creationFlags; Attribute[] attributes }
  ```

  The entity key is derived from the random 128-bit salt.
- **Reproduction:** Call `create_entities` against Tiramisu with a funded key, wait for the receipt, and check for `EntityCreated`. The only observable failure is the missing entity in the receipt, which can be mistaken for an RPC or receipt-decoding problem.
- **Workaround:** A raw encoder in `rust/crates/cogit-core/src/arkiv_tx.rs` (~260 lines, using `alloy::sol!`) implements the call. It was verified in both directions with the TypeScript implementation.
- **Recommendation:** Emit the ABI calldata described above, or decode and expose engine events so callers can detect that no entity was written.

### F-RS-02

**Published crates.io version does not target the live network; a git revision is required.** · Rust SDK · major · pinned revision · observed 2026-10-18

- **Expected:** `cargo add arkiv-sdk` would provide a crate compatible with the live entity model.
- **Observed:** The published crates.io version predates the current model. A working build required pinning the git revision `93752767222e11926529b9b771d6cade7e0d9774`. The crate metadata does not state which engine or network version a release targets.
- **Reproduction:** Build against the crates.io version and attempt a write; the behavior matches `F-RS-01` and `F-RS-05`.
- **Workaround:** Pin the git revision in `rust/Cargo.toml`.

### F-RS-03

**The crate is GPL-3.0-or-later; the license is not evident from its metadata.** · Rust SDK · major · accepted · observed 2026-10-18

- **Expected:** The license would be visible in the crate metadata or README before adoption.
- **Observed:** The crate's GPL-3.0-or-later lineage is not surfaced in the places a consumer checks first. Linking it requires the dependent Rust workspace to be distributed under GPL-3.0-or-later; cogit therefore declares that license for `rust/` and includes `LICENSE-RUST`. This constrains projects that intend to remain MIT-licensed.
- **Reproduction:** Inspect the dependency tree's license metadata.
- **Workaround:** License the Rust workspace under GPL-3.0-or-later and document the boundary. The rest of cogit remains MIT.

### F-RS-04

**The crate does not compile with `default-features = false`.** · Rust SDK · major · workaround · observed 2026-10-18

- **Expected:** `default-features = false` would build a headless CLI.
- **Observed:** `src/utils.rs` calls `reqwest` in `generate_fee_history` unconditionally, while `reqwest` is optional and enabled only by the `node-bindings` feature. The crate fails to compile without that feature.
- **Reproduction:** Depend on the crate with `default-features = false` and run `cargo check`.
- **Workaround:** Enable `features = ["node-bindings", "pubsub"]`, which adds WASM and Node binding dependencies to a plain CLI build.
- **Recommendation:** Gate the function with `#[cfg(feature = "node-bindings")]`.

### F-RS-05

**`QueryOpts` serializes to a shape the RPC rejects.** · Rust SDK · blocker · replaced with a raw query call · observed 2026-10-18

- **Expected:** `provider.query(…)` would behave like the TypeScript `select().fetch()`.
- **Observed:** The SDK serializes snake_case fields such as `at_block` and `results_per_page`; the RPC responds `-32602 invalid params`. The TypeScript SDK sends camelCase with hexadecimal quantities:

  ```json
  {
    "select": { "key": true, "payload": true, "attributes": true },
    "limit": "0xc8",
    "cursor": "…",
    "atBlock": "0x…"
  }
  ```

  `limit` is a hex string with a maximum of 200. Responses use the key `data` rather than `entities`; entities include a top-level hex `payload`; attributes are returned as `[{name, type, value}]` rather than a decoded map.
- **Reproduction:** Call the SDK `query` helper against Tiramisu and observe the `-32602` response.
- **Workaround:** All reads use `provider.client().request("arkiv_query", (filter, options))` with the camelCase shape (`rust/crates/cogit-core/src/arkiv.rs`).

### F-RS-08

**Engine event ABI is not documented in the Rust SDK.** · Rust SDK · major · workaround · observed 2026-10-18

- **Expected:** The SDK receipt type would provide the created entity key.
- **Observed:** With the SDK write path unusable (`F-RS-01`), extracting the key requires decoding:

  ```
  EntityCreated(bytes32 indexed entityKey, address indexed owner, uint64 expiresAt, uint8 creationFlags)
  ```

  `EntityPatched`, `ExpiryExtended`, `OwnershipTransferred` and `EntityDeleted` are similarly undocumented. The signatures are available only in the TypeScript SDK and contracts.
- **Reproduction:** Attempt to obtain the entity key from an SDK receipt.
- **Workaround:** Declare the events with `alloy::sol!` and decode them with `SolEvent::decode_log`.

### F-RS-12

**`alloy::sol!` rejects named tuple components in function parameters.** · alloy 1.8.3 · minor · workaround · observed 2026-10-18

- **Expected:** `function execute((uint8 operation, bytes operationData)[] ops)` would parse.
- **Observed:** `sol!` fails with `expected ,`.
- **Reproduction:** Paste the signature into `sol!`.
- **Workaround:** Declare a struct and use it as the tuple element:

  ```rust
  struct OperationStruct { uint8 operation; bytes operationData; }
  function execute(OperationStruct[] ops);
  ```

  This produces the same ABI and selector. The implementation also imports `alloy::network::TransactionBuilder` for `.with_to()` and `.with_input()`, and `alloy::sol_types::SolEvent` for `decode_log`.

### F-RS-10

**rustc internal compiler error while rendering diagnostics.** · Toolchain · minor · workaround · observed 2026-10-18

- **Expected:** Compile errors render normally.
- **Observed:** The pinned toolchain produced an internal compiler error while rendering certain diagnostics, which obscured the underlying compile error. The exact ICE text was not retained.
- **Reproduction:** Compile the crate with the pinned toolchain.
- **Workaround:** `cargo check --message-format short` bypasses the failing rendering path.

---

## MCP parity

### F-RS-13

**schemars output diverges from the zod-authored schema.** · MCP · major · transform layer · observed 2026-10-19

- **Expected:** JSON Schemas derived with schemars 1.2.3 would match the zod-authored `tools/list` schema byte for byte.
- **Observed:** Three factors prevented this. `with = "u64"` adds `"format": "uint64"`, which zod does not emit, and a bare `#[serde(default)]` injects `"default": null` into every optional field. In addition, `schemars(with = …)` and `schema_with` replace the field type used for schema generation, which changes required-versus-optional inference: without `serde(default)`, the fields become `required`.
- **Reproduction:** Derive both schemas and diff the `tools/list` output.
- **Workaround:** Keep `serde(default)` to preserve the `required` list and remove the extra keys in a final schema transform:

  ```rust
  fn ts_schema_cleanup(schema: &mut schemars::Schema) {
      if let Some(obj) = schema.as_object_mut() {
          obj.remove("default");
          obj.remove("format");
      }
  }
  ```

### F-RS-14

**`rmcp` and the TypeScript MCP SDK use different error semantics.** · MCP · major · translation layer · observed 2026-10-19

- **Expected:** The same MCP client would observe the same behavior from both servers.
- **Observed:** In our tests, `@modelcontextprotocol/sdk@1.32.1` resolves every tool-call failure — validation errors, unknown tools and thrown exceptions — as an `isError: true` result whose text is `MCP error -32602: …`. `rmcp 3.5.1` converts only argument-deserialization failures (`failed to deserialize parameters:` with `INVALID_PARAMS`) into results; all other failures are JSON-RPC protocol errors. Identical input therefore produces different client-visible behavior.
- **Reproduction:** Call both servers with an unknown tool name and compare the responses.
- **Workaround:** Override `ServerHandler::call_tool`, delegate to the generated router, and translate `Err(ErrorData)` into `CallToolResult::error` with `MCP error {code}: …` text. The implementation also aligns the deserialization prefix and the `tool not found` wording. The 40-assertion parity suite in `rust/scripts/mcp-e2e.mjs` verifies the result over the TypeScript client.

### F-RS-15

**Exact zod validation messages cannot be reproduced with serde/rmcp.** · MCP · minor · documented limitation · observed 2026-10-19

- **Expected:** Byte-identical error text across servers.
- **Observed:** Constraint messages were mirrored manually (for example, `Too small: expected string to have >=1 characters at summary`). Missing-required and type-mismatched fields still produce serde wording such as the missing-field message for `branch`; only the outer `MCP error …: Input validation error: Invalid arguments for tool …` envelope is normalized.
- **Reproduction:** Send a request with a missing required field to both servers and compare the text.
- **Workaround:** None required for current clients. The difference is documented because error text is not portable across servers.

---

## TypeScript SDK

### F-1

**pnpm 10 skips the esbuild build script and prints a warning on every install.** · TypeScript SDK · minor · no action · observed 2026-10-17

- **Expected:** `pnpm install` completes without warnings, and `tsx` runs.
- **Observed:** `Ignored build scripts: esbuild@0.28.2.`
- **Reproduction:** Fresh clone, then `pnpm install`.
- **Workaround:** None needed. esbuild ships a prebuilt binary and `pnpm exec tsx --version` works. `pnpm approve-builds` removes the warning.

### F-5

**The SDK uses viem's `Hex` type but does not re-export it.** · TypeScript SDK · minor · workaround · observed 2026-10-17

- **Expected:** `import type { Hex } from "@arkiv-network/sdk"` would work, because the SDK's public signatures use `Hex`.
- **Observed:** `error TS2459: Module '"@arkiv-network/sdk"' declares 'Hex' locally, but it is not exported.`
- **Reproduction:** Add `import type { Hex } from "@arkiv-network/sdk"` and run `tsc --noEmit`.
- **Workaround:** Import `Hex` from `viem`.

---

## Browser viewer

### F-WEB-1

**Browser bundles require aliases for Node-only modules.** · Browser · minor · workaround · observed 2026-10-19

- **Expected:** A client-side bundle that imports the SDK would build without configuration.
- **Observed:** The SDK's module graph references `node:zlib` and `brotli-wasm`, which are unavailable in browsers. The viewer maps both to an empty module in the webpack configuration and disables them in the Turbopack configuration (`frontend/next.config.ts`); the browser execution path does not use them. Separately, `NEXT_PUBLIC_*` variables are inlined at build time, so the RPC URL must be present when `next build` runs.
- **Reproduction:** Build a client-side application that imports the SDK without the aliases.
- **Workaround:** Add the aliases. The viewer supplies `NEXT_PUBLIC_ARKIV_RPC_URL` at build time; the key is a testnet access key and is visible in the client bundle by design.

---

## RPC and operations

### F-OPS-1

**Anonymous query budget is metered; requests return 429 when exhausted.** · RPC · major · mitigated with an API key · observed 2026-10-19

- **Expected:** The public Tiramisu endpoint would continue serving anonymous reads during development.
- **Observed:** After a period of testing, every request returned HTTP 429:

  ```json
  {"error":"ANON_COST_LIMITED","message":"unauthenticated query budget exhausted; get an API key at https://hub.arkiv.network for a monthly quota"}
  ```

  Our test runs exhausted the anonymous budget during a single development session. The error message points to the correct action, but the SDK documentation did not state that anonymous reads are metered.
- **Reproduction:** Issue anonymous `arkiv_query` or `eth_call` requests until the endpoint returns 429.
- **Workaround:** Create a key at `https://hub.arkiv.network` and append it to the RPC URL path (`https://rpc.tiramisu.db-chain.testnet.arkiv.network/ark_…`). No SDK changes are required; the viewer receives the URL through `NEXT_PUBLIC_ARKIV_RPC_URL`.

---

## Developer environment (Windows/WSL)

### F-3

**PowerShell 5.1 corrupts quoting for `wsl bash -c`.** · Tooling · minor · workaround · observed 2026-10-17

- **Expected:** `wsl -d Ubuntu bash -c "…"` would receive the command verbatim.
- **Observed:** Nested quotes and redirects were corrupted. Examples include `Could not find a part of the path '\\wsl.localhost\…\dev\null'` and bash syntax errors caused by altered quoting.
- **Reproduction:** Run a command with nested quotes or `2>/dev/null` from PowerShell 5.1 through `wsl bash -c`.
- **Workaround:** Put nontrivial commands in a `.sh` file and run `wsl -d Ubuntu -- bash /tmp/script.sh`. Non-interactive WSL shells also require `PATH="$HOME/.cargo/bin:$PATH"`.

### F-4

**git over the `\\wsl.localhost` path reports "dubious ownership".** · Tooling · minor · workaround · observed 2026-10-17

- **Expected:** `git status` would work from Windows against the WSL-hosted repository.
- **Observed:** `fatal: detected dubious ownership in repository at '//wsl.localhost/Ubuntu/home/anurag/cogit'`.
- **Reproduction:** Run `git -C \\wsl.localhost\Ubuntu\home\anurag\cogit status` from PowerShell.
- **Workaround:** Run git inside WSL, or pass `git -c safe.directory='//wsl.localhost/Ubuntu/home/anurag/cogit' …`.

---

## What worked well

- The provider request escape hatch (`provider.client().request(…)`) made it possible to implement the raw `arkiv_query` read path and the raw `execute` write path without forking the SDK.
- Entity read semantics (keys, ownership, attribute decoding and block timing) are consistent across the TypeScript and Rust implementations. Cross-implementation verification of hashes, signatures, entity ownership and repo membership passed without changes.
- Approximately 2-second blocks keep the commit-to-viewer loop short; observed refreshes completed within about 5 seconds.

## Recommendations to the Arkiv team

1. Fix or document the Rust SDK write path (`F-RS-01`) and query options (`F-RS-05`). Without a bypass, each prevents a working Rust integration.
2. Document the attribute ABI (`F-RS-06`, `F-RS-07`), including type ids, ordering, padding and the `$payload`/`$contentType` cells.
3. Document the effective attribute-name grammar (`F-6`), including the lowercase constraint that contradicts the SDK regex and revert text.
4. State per-network compatibility for crate releases (`F-RS-02`) and surface the license in crate metadata (`F-RS-03`).
5. Make `node-bindings` genuinely optional (`F-RS-04`).
6. Document lifetime units, and how payload and attribute sizes count toward the entity limit (`F-RS-11`, `F-2`, `F-7`).
7. Align MCP error semantics across SDKs or document the difference (`F-RS-14`).
8. Document that anonymous RPC reads are metered and link the quota flow from the endpoint documentation (`F-OPS-1`).

## Reproducing this work

```bash
git clone https://github.com/anurag-p6/cogit && cd cogit
pnpm install
cp .env.example .env          # PRIVATE_KEY, PRIVATE_KEY_2, ARKIV_RPC_URL
pnpm test
pnpm spike                    # live network self-test, including the payload boundary
rust/scripts/mcp-e2e-setup.sh && node rust/scripts/mcp-e2e.mjs   # MCP parity
```

Each finding includes its own minimal reproduction. The chronological source logs are [docs/FRICTION_LOG.md](../docs/FRICTION_LOG.md) (TypeScript sprint) and [docs/FRICTION_LOG_RUST.md](../docs/FRICTION_LOG_RUST.md) (Rust port).
