# Rust port friction log

**Scope:** Findings from porting cogit's read and write paths from `@arkiv-network/sdk@0.8.1` (TypeScript) to `arkiv-sdk` at git revision `93752767222e11926529b9b771d6cade7e0d9774` ("0.5.0"), targeting the Arkiv Tiramisu testnet (`7738577`, precompile `0x4400000000000000000000000000000000000044`).

**Method:** Each entry was reproduced against the live network with a funded key. Exact error text is quoted where available. The consolidated and normalized report is [arkiv/friction.md](../arkiv/friction.md); this file preserves the chronological port record.

**Result:** Reads work through the raw `arkiv_query` method. The SDK write path did not work against the live engine and was replaced with a raw encoder in `rust/crates/cogit-core/src/arkiv_tx.rs` (approximately 260 lines, using `alloy::sol!`). With these replacements, bidirectional end-to-end tests pass: Rust and TypeScript each initialize, commit, log, pull, invite and join against repositories written by the other.

**Versions:** `arkiv-sdk` git `9375276`, `alloy 1.8.3`, `rmcp 3.5.1`, `schemars 1.2.3`.

---

## F-RS-01: Write path submits calldata the live engine does not execute

**Severity:** blocker · **Status:** replaced with a raw encoder · 2026-10-18

- **Expected:** `provider.create_entities(...)` and `provider.update_entities(...)` create entities on Tiramisu.
- **Observed:** Transactions mine successfully but contain no entities. Receipt decoding fails with `no entity created in receipt`, and the receipt contains no `EntityCreated` event. Reproduced repeatedly with fresh keys.
- **Cause:** The SDK emits brotli-compressed RLP calldata. The live engine expects a plain ABI-encoded call to:

  ```
  execute((uint8 operation, bytes operationData)[])
  ```

  Operation ids: 1 create, 2 patch, 3 extend expiry, 4 transfer ownership, 5 delete. The TypeScript SDK 0.8.1 encodes this call successfully and was used as the reference. The create payload is:

  ```
  CreateOpData { uint128 salt; uint64 expiresAt; uint64 minLifetime; uint8 creationFlags; Attribute[] attributes }
  ```

  The entity key is derived from the random 128-bit salt.
- **Reproduction:** Call `create_entities` against Tiramisu with a funded key, wait for the receipt, and check for `EntityCreated`. The only observable failure is the missing entity in the receipt, which can be mistaken for an RPC or receipt-decoding problem.
- **Workaround:** Implement the call directly. The encoder in `arkiv_tx.rs` mirrors the TypeScript implementation and was verified in both directions.
- **Recommendation:** Emit the ABI calldata described above, or decode and expose engine events so callers can detect that no entity was written.

## F-RS-02: Published crates.io version does not target the live network

**Severity:** major · **Status:** git revision pinned · 2026-10-18

- **Expected:** `cargo add arkiv-sdk` provides a crate compatible with the live entity model.
- **Observed:** The published crates.io version predates the current model. A working build required pinning revision `93752767222e11926529b9b771d6cade7e0d9774`. The crate metadata does not state which engine or network version a release targets.
- **Reproduction:** Build against the crates.io version and attempt a write; the behavior matches F-RS-01 and F-RS-05.
- **Workaround:** Pin the git revision in `rust/Cargo.toml`.

## F-RS-03: The crate is GPL-3.0-or-later; the license is not evident from its metadata

**Severity:** major · **Status:** accepted; Rust workspace is GPL · 2026-10-18

- **Expected:** The license is visible in the crate metadata or README before adoption.
- **Observed:** The crate's GPL-3.0-or-later lineage is not surfaced where a consumer checks first. Linking it requires the dependent Rust workspace to be distributed under GPL-3.0-or-later. Cogit therefore declares that license for `rust/` and includes `LICENSE-RUST`; Debian packaging referenced the file before it was added.
- **Reproduction:** Inspect the dependency tree's license metadata.
- **Workaround:** License the Rust workspace under GPL-3.0-or-later and document the boundary. The TypeScript packages, frontend and documentation remain MIT.

## F-RS-04: The crate does not compile with `default-features = false`

**Severity:** major · **Status:** workaround · 2026-10-18

- **Expected:** `default-features = false` builds a headless CLI.
- **Observed:** `src/utils.rs` calls `reqwest` in `generate_fee_history` unconditionally, while `reqwest` is optional and enabled only by the `node-bindings` feature. The crate fails to compile without that feature.
- **Reproduction:** Depend on the crate with `default-features = false` and run `cargo check`.
- **Workaround:** Enable `features = ["node-bindings", "pubsub"]`. This adds WASM and Node binding dependencies to a plain CLI build.
- **Recommendation:** Gate the function with `#[cfg(feature = "node-bindings")]`; it is only used by the WASM surface.

## F-RS-05: `QueryOpts` serializes to a shape the RPC rejects

**Severity:** blocker · **Status:** replaced with a raw query call · 2026-10-18

- **Expected:** `provider.query(...)` behaves like the TypeScript `select().fetch()`.
- **Observed:** The SDK serializes snake_case fields such as `at_block` and `results_per_page`; the RPC responds `-32602 invalid params`. The TypeScript SDK sends camelCase with hexadecimal quantities:

  ```json
  {
    "select": { "key": true, "payload": true, "attributes": true },
    "limit": "0xc8",
    "cursor": "...",
    "atBlock": "0x..."
  }
  ```

  `limit` is a hex string with a maximum of 200. Responses use the key `data` rather than `entities`; entities include a top-level hex `payload`; attributes are returned as an array of `{name, type, value}` rather than a decoded map.
- **Reproduction:** Call the SDK `query` helper against Tiramisu and observe the `-32602` response.
- **Workaround:** Route reads through `provider.client().request("arkiv_query", (filter, options))` with the camelCase shape (`rust/crates/cogit-core/src/arkiv.rs`).

## F-RS-06: Attribute encoding contract is undocumented

**Severity:** major · **Status:** mirrored from the TypeScript SDK · 2026-10-18

- **Expected:** The Rust SDK documents the attribute encoding used by the live engine.
- **Observed:** Type ids, ordering and padding rules exist only in the TypeScript SDK source and engine behavior. The contract includes:
  - type ids: `bool=1`, `i32=2`, `u64=3`, `u256=4`, `dec=5`, `bytes32=6`, `bytes=7`, `str=8`, `addr=9`, `key=10`;
  - attributes sorted strictly ascending by the 32-byte `Ident32` name;
  - names encoded as UTF-8, left-aligned and NUL-padded to 32 bytes;
  - `str` values encoded as raw UTF-8 bytes and `u64` values as ABI words.

  An incorrect encoding produces either a revert or an attribute that is written but cannot be queried.
- **Reproduction:** Write through a raw path and vary one encoding dimension at a time; query the entity back.
- **Workaround:** The encoder in `arkiv_tx.rs` mirrors the TypeScript implementation and was verified in both directions.

## F-RS-07: `$payload` and `$contentType` are ordinary attribute cells at ABI level

**Severity:** major · **Status:** handled by the encoder · 2026-10-18

- **Expected:** Payload and content type are first-class parameters of the write call.
- **Observed:** The write call has no payload parameter. `$payload` (bytes) and `$contentType` (str) are attribute cells with type ids 7 and 8. The builder API hides this, but any raw call path must encode both cells. Payload size bounds are not stated in the Rust SDK.
- **Reproduction:** Decode the calldata of an entity created by the TypeScript SDK.
- **Workaround:** Encode both system cells and cap committed details at 96 KiB (`MAX_DETAILS_BYTES`), leaving room for the envelope and attributes within the 128 KiB entity limit.

## F-RS-08: Engine event ABI is not documented in the SDK

**Severity:** major · **Status:** workaround · 2026-10-18

- **Expected:** The SDK receipt type provides the created entity key.
- **Observed:** With the SDK write path unusable (F-RS-01), extracting the key requires decoding:

  ```
  EntityCreated(bytes32 indexed entityKey, address indexed owner, uint64 expiresAt, uint8 creationFlags)
  ```

  `EntityPatched`, `ExpiryExtended`, `OwnershipTransferred` and `EntityDeleted` are similarly undocumented. The signatures are available only in the TypeScript SDK and contracts.
- **Reproduction:** Attempt to obtain the entity key from an SDK receipt.
- **Workaround:** Declare the events with `alloy::sol!` and decode them with `SolEvent::decode_log`.

## F-RS-09: Query DSL string syntax and escaping are undocumented

**Severity:** minor · **Status:** handled in cogit-core · 2026-10-18

- **Expected:** A typed query API equivalent to the TypeScript builders.
- **Observed:** Filtering encrypted context required the string form `type = str('repo') AND repo_id = str('...')`. String escaping uses SQL-style single-quote doubling (`''`); backslash escapes are not supported. The Rust SDK has no equivalent of the TypeScript `and()` and `or()` combinators.
- **Reproduction:** Filter by a value containing a single quote without doubling it.
- **Workaround:** Build the query string explicitly and double embedded quotes.

## F-RS-10: rustc internal compiler error while rendering diagnostics

**Severity:** minor · **Status:** workaround · 2026-10-18

- **Expected:** Compile errors render normally.
- **Observed:** The pinned toolchain produced an internal compiler error while rendering certain diagnostics, which obscured the underlying compile error. The exact ICE text was not retained.
- **Reproduction:** Compile the crate with the pinned toolchain.
- **Workaround:** `cargo check --message-format short` bypasses the failing rendering path. The toolchain issue is independent of `arkiv-sdk`.

## F-RS-11: Entity lifetimes are measured in blocks, not seconds

**Severity:** major · **Status:** handled in cogit-core · 2026-10-18

- **Expected:** Parts of the Rust SDK surface read as durations in seconds.
- **Observed:** On the live chain, lifetimes are expressed in blocks. Tiramisu produces approximately 2-second blocks (43,200 per day). The TypeScript `ExpirationTime` helpers are block-based: `fromHours(6)` sets `expiresAt` to `createBlock + 10,800`. Mixing seconds and blocks changes expiry without an error.
- **Reproduction:** Create an entity with `fromHours(6)` through the TypeScript SDK and inspect the resulting expiry relative to the creation block.
- **Workaround:** `cogit-core` passes blocks in every layer and names the parameter `min_lifetime`.

## F-RS-12: `alloy::sol!` rejects named tuple components in function parameters

**Severity:** minor · **Status:** workaround · 2026-10-18

- **Expected:** `function execute((uint8 operation, bytes operationData)[] ops)` parses.
- **Observed:** `sol!` fails with `expected ,`.
- **Reproduction:** Paste the signature into `sol!`.
- **Workaround:** Declare a struct and use it as the tuple element:

  ```rust
  struct OperationStruct { uint8 operation; bytes operationData; }
  function execute(OperationStruct[] ops);
  ```

  This produces the same ABI and selector. The implementation also imports `alloy::network::TransactionBuilder` for `.with_to()` and `.with_input()`, and `alloy::sol_types::SolEvent` for `decode_log`.

## F-RS-13: schemars output diverges from the zod-authored schema

**Severity:** major · **Status:** transform layer · 2026-10-19

- **Expected:** JSON Schemas derived with schemars 1.2.3 match the zod-authored `tools/list` schema byte for byte.
- **Observed:** Three factors prevented this. `with = "u64"` adds `"format": "uint64"`, which zod does not emit, and a bare `#[serde(default)]` injects `"default": null` into every optional field. In addition, `schemars(with = ...)` and `schema_with` replace the field type used for schema generation, which changes required-versus-optional inference: without `serde(default)`, the fields become `required`.
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

## F-RS-14: `rmcp` and the TypeScript MCP SDK use different error semantics

**Severity:** major · **Status:** translation layer · 2026-10-19

- **Expected:** The same MCP client observes the same behavior from both servers.
- **Observed:** In our tests, `@modelcontextprotocol/sdk@1.32.1` resolves every tool-call failure — validation errors, unknown tools and thrown exceptions — as an `isError: true` result whose text is `MCP error -32602: ...`. `rmcp 3.5.1` converts only argument-deserialization failures (`failed to deserialize parameters:` with `INVALID_PARAMS`) into results; all other failures are JSON-RPC protocol errors. Identical input produces different client-visible behavior.
- **Reproduction:** Call both servers with an unknown tool name and compare the responses.
- **Workaround:** Override `ServerHandler::call_tool`, delegate to the generated router, and translate `Err(ErrorData)` into `CallToolResult::error` with `MCP error {code}: ...` text. The implementation also aligns the deserialization prefix and the `tool not found` wording. The 40-assertion parity suite in `rust/scripts/mcp-e2e.mjs` verifies the result over the TypeScript client.

## F-RS-15: Exact zod validation messages cannot be reproduced with serde/rmcp

**Severity:** minor · **Status:** documented limitation · 2026-10-19

- **Expected:** Byte-identical error text across servers.
- **Observed:** Constraint messages were mirrored manually (for example, `Too small: expected string to have >=1 characters at summary`). Missing-required and type-mismatched fields still produce serde wording such as the missing-field message for `branch`; only the outer `MCP error ...: Input validation error: Invalid arguments for tool ...` envelope is normalized.
- **Reproduction:** Send a request with a missing required field to both servers and compare the text.
- **Workaround:** None required for current clients. The difference is documented because error text is not portable across servers.

---

## Environment notes

- Driving a WSL Ubuntu toolchain from Windows PowerShell 5.1 corrupts inline quoting. Nontrivial commands were staged in `/tmp/*.sh` files and run as `wsl -d Ubuntu -- bash /tmp/x.sh`.
- Non-interactive WSL shells require `PATH="$HOME/.cargo/bin:$PATH"`.

## What worked well

- The provider request interface (`provider.client().request(...)`) allowed the raw `arkiv_query` read path and the raw `execute` write path without forking the crate.
- Entity read semantics (keys, ownership, attribute decoding and block timing) match the TypeScript SDK closely enough that cross-implementation verification passed unchanged in both directions.
- Transaction signing and submission worked once the calldata was correct.

## Final status

- **Reads:** raw `arkiv_query` path, verified in both directions.
- **Writes:** raw `execute` encoder in `arkiv_tx.rs`, verified in both directions (repository and branch creation, commit creation, branch head updates, expiry extension and member updates for invites).
- **CLI parity:** `cogit` welcome and log output are byte-identical to the TypeScript CLI. Bidirectional end-to-end tests (Rust init/commit to TypeScript log/pull/join, and the reverse) passed on Tiramisu.
