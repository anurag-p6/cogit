# Friction log — porting cogit's write/read path from `@arkiv-network/sdk` (TS 0.8.1) to `arkiv-sdk-rust` (git `9375276`, "0.5.0")

Sprint scope: port the cogit CLI (TypeScript) to Rust with full byte-level parity
against the live Arkiv **Tiramisu testnet** engine (chain id 7738577,
`0x4400000000000000000000000000000000000044`). Every finding below was observed
against the live network with a funded key, not inferred from docs.

Result: **read path works via a raw `arkiv_query` escape hatch; the SDK's write
path does not work at all against the live engine and was replaced with a
~260-line raw `alloy` encoder (`rust/crates/cogit-core/src/arkiv_tx.rs`).**
After that, Rust↔TS bidirectional E2E passes (init/commit/log/pull/invite/join).

---

## F-RS-01 (blocker) — write path sends calldata the live engine ignores

`provider.create_entities(...)` / `provider.update_entities(...)` mine a
successful transaction, but the receipt contains **no entities**: the SDK's
receipt decoder then fails with `no entity created in receipt`, and on-chain
there is no `EntityCreated` event. Reproduced repeatedly with fresh keys.

Root cause: the SDK builds a **brotli-compressed RLP calldata** for the Arkiv
precompile, while the live engine expects a plain ABI-encoded call to
`execute((uint8 operation, bytes operationData)[])` (operations 1 create /
2 patch / 3 extend-expiry / 4 transfer-ownership / 5 delete). The TS SDK 0.8.1
(which does work against the live engine) encodes `abi.encode` of tagged op
structs, with:

- `CreateOpData { uint128 salt; uint64 expiresAt; uint64 minLifetime; uint8 creationFlags; Attribute[] attributes }`
- `Attribute { bytes32 name; uint8 typeId; bytes value }` — **strictly sorted
  ascending by `name`**, `$payload` (bytes) and `$contentType` (str) are
  ordinary attribute cells in this encoding
- type ids: bool=1, i32=2, u64=3, u256=4, dec=5, bytes32=6, bytes=7, str=8,
  addr=9, key=10; u64 values are ABI words, str values raw UTF-8 bytes,
  `Ident32` names are UTF-8 left-aligned NUL-padded to 32 bytes
- entity key = derived from the random 128-bit salt

Resolution: wrote the encoder ourselves (`arkiv_tx.rs`) with `alloy::sol!`
definitions mirroring the TS SDK, and verified it: TS CLI pulls and verifies
Rust-written repos, and Rust verifies/pulls TS-written repos.

Recommendation: either fix the SDK's calldata to match the engine
(`execute((uint8,bytes)[])` via ABI, no brotli/RLP), or ship the ABI decoding
of engine events so apps can at least detect that nothing was written. Today
the only failure signal is a missing entity in the receipt, which is easily
misread as an RPC/receipt decoding bug.

## F-RS-02 — crates.io release is not the thing you want

The published crates.io version lags the git branch that actually supports the
current entity model. We had to pin a git revision
(`rev = "93752767222e11926529b9b771d6cade7e0d9774"`) to get anything matching
the live network. Version discoverability was a recurring time sink: it is not
obvious from the crate docs which engine/network any version targets.

## F-RS-03 — licensing is invisible until you dig

The crate's license situation (GPL-3.0-or-later lineage) is not surfaced in the
README or crate metadata in a way a consumer can act on. The workspace had to
declare `license = "GPL-3.0-or-later"` and a `LICENSE-RUST` file was referenced
by Debian packaging that did not exist yet. `cargo-license`-style metadata is
missing/ambiguous; evaluators will flag this.

## F-RS-04 — the crate does not compile without `node-bindings`

`src/utils.rs` references `reqwest` (in `generate_fee_history`) **unconditionally**,
but `reqwest` is an optional dependency gated behind the `node-bindings`
feature. With `default-features = false` the crate fails to compile. Our
workaround: `.features = ["node-bindings", "pubsub"]`, which drags in the
wasm/node binding deps just to build a CLI. Upstream fix is a one-liner:
`#[cfg(feature = "node-bindings")]` on that function (it is only used by the
wasm surface).

## F-RS-05 — `QueryOpts` serializes to a shape the RPC rejects

`provider.query(...)` (SDK helper) serializes `QueryOpts` as snake_case
(`at_block`, `results_per_page`), and the live RPC responds `-32602 invalid
params`. The working shape (used by the TS SDK) is camelCase and hex lengths:

```json
{ "select": { "key": true, "payload": true, "attributes": true, ... },
  "limit": "0xc8", "cursor": "...", "atBlock": "0x..." }
```

Also, with `limit` omitted from the projection ambiguity: `limit` is a **hex
quantity string** ("0xc8" = 200, max 200), not a number. The response uses key
`"data"` (not `"entities"`), entities carry a top-level hex `payload` field,
and `attributes` come back as an **array of `{name, type, value}`** rather than
the SDK's decoded map. Resolution: all reads in cogit-core go through
`provider.client().request("arkiv_query", (filter, options))` with the
camelCase shape.

## F-RS-06 — attribute encoding contract is undocumented

Type ids, the ascending-by-`Ident32`-name requirement, utf-8/NUL padding rules,
and per-type value layouts exist only in the TS SDK source and engine behavior.
No Rust-side docs; getting one of these wrong produces a revert or a silently
unqueryable attribute. (Discovered from TS SDK `entity/attribute/*` and live
probes.)

## F-RS-07 — system cells (`$payload`, `$contentType`) leak through the low level

At the ABI level there are no "payload"/"content type" parameters — they are
attribute cells named `$payload`/`$contentType` with type ids 7/8. The SDK's
builder API hides this, but any raw path (which F-RS-01 forces you onto) needs
the semantics documented. Payload size is bounded (we cap details at 96 KiB in
cogit), which is also not stated anywhere in the Rust SDK.

## F-RS-08 — engine event ABI undocumented in the Rust SDK

Extracting the created entity key from a receipt requires decoding
`EntityCreated(bytes32 indexed entityKey, address indexed owner, uint64 expiresAt,
uint8 creationFlags)` (and `EntityPatched`, `ExpiryExtended`,
`OwnershipTransferred`, `EntityDeleted`) — signatures only available from the TS
SDK / contracts. With the SDK's own write path broken (F-RS-01) the SDK's
receipt type could not be used at all.

## F-RS-09 — query language surface

Encrypted-context filtering required the query DSL string form
(`type = str('repo') AND repo_id = str('…')`). Escaping is SQL-style single-quote
doubling (`''`) with no backslash escapes — easy to get wrong, undocumented in
the Rust crate. The Rust SDK's query options have no equivalent of the TS
`and()`/`or()` combinators either.

## F-RS-10 — rustc ICE while rendering diagnostics

With rustc from the pinned toolchain, certain diagnostics triggered an internal
compiler error during rendering. Workaround for the sprint:
`cargo check --message-format short`. Not directly an arkiv-sdk issue, but it
masked real errors for a while and is worth reporting upstream to the toolchain.

## F-RS-11 — `BlocksToLive` unit confusion

Entity lifetimes are expressed in **blocks** on the live chain (2-second blocks
on Tiramisu, 43 200/day), but parts of the Rust SDK surface/docs read as
seconds/durations. The TS SDK's `ExpirationTime` helpers are block-based
(`minLifetime` = days × 43200). Mixing the two silently shortens or lengthens
expiry. cogit-core therefore passes blocks everywhere and names the parameter
`min_lifetime` explicitly.

## F-RS-12 — `alloy::sol!` rejects named tuple components in function params

Alloy 1.8.3's `sol!` fails to parse
`function execute((uint8 operation, bytes operationData)[] ops) external ...`
with `expected ,`. Workaround: declare a struct and use it as the tuple element
(`struct OperationStruct { uint8 operation; bytes operationData; }`,
`function execute(OperationStruct[] ops)`), which produces the identical ABI
(and selector). Also required: importing `alloy::network::TransactionBuilder`
for `.with_to()/.with_input()` and `alloy::sol_types::SolEvent` for
`decode_log`. Minor DX issues, all cost debugging time.

## F-RS-13 — schemars `with` + `serde(default)` silently diverge from the zod schema

Two compounding effects when deriving tool schemas with schemars 1.2 and trying
to match a zod-authored schema byte-for-byte:

- `with = "u64"` adds `"format": "uint64"` (zod has no such key), and bare
  `#[serde(default)]` injects `"default": null` into every optional field.
- More subtly, `schemars(with = …)` / `schema_with` **replace the field's type
  for schema generation**, which resets required-vs-optional inference: without
  `serde(default)` the fields become `required`.

Fix that worked: keep `serde(default)` for the `required` list, and add
`#[schemars(transform = fn)]` — transforms run as the last post-mutator — to
delete `default`/`format` from the finished field schema:

```rust
fn ts_schema_cleanup(schema: &mut schemars::Schema) {
    if let Some(obj) = schema.as_object_mut() {
        obj.remove("default");
        obj.remove("format");
    }
}
```

## F-RS-14 — rmcp and the TS MCP server disagree on what an error *is*

TypeScript SDK 1.32 servers resolve **all** tool-call failures — zod
validation, unknown tool, thrown exceptions — as `isError: true` results whose
text is `MCP error -32602: …`. rmcp 3.5.1 converts only argument
deserialization failures (`failed to deserialize parameters:` + code
`INVALID_PARAMS`) into results; everything else is a JSON-RPC protocol error.
With the same TS client, the TS server "succeeds with isError" where the Rust
server throws — different client-visible behavior for identical inputs.

Fix: override `ServerHandler::call_tool`, delegate to the generated router,
and translate `Err(ErrorData)` into `CallToolResult::error` with
`MCP error {code}: …` text (plus rewording rmcp's deserialization prefix and
`tool not found` to the TS SDK's strings). Tools that are never called with bad
input won't notice — but parity tests will.

## F-RS-15 — zod's exact validation wording only exists in zod

To get byte-equal `tools/list` schemas and error text, the Rust side had to
mirror zod's constraint messages manually
(`Too small: expected string to have >=1 characters at summary`). Anything
missing-required or type-mismatched still says serde's `missing field \`branch\``
(only the outer `MCP error …: Input validation error: Invalid arguments for tool …`
envelope was normalized) — so agents see the same *shape* everywhere, but
wording beyond the declared constraints differs. If a client ever parses these
strings, that's the seam.

---

## Environment friction (not SDK bugs, but real)

- Driving a WSL Ubuntu toolchain from a Windows PowerShell host mangles inline
  quoting; every nontrivial command had to be staged into `/tmp/*.sh` files and
  run as `wsl -d Ubuntu -- bash /tmp/x.sh`. Recommend documenting this pattern
  (or using a proper devcontainer) for anyone porting on Windows.
- `PATH="$HOME/.cargo/bin:$PATH"` is required in non-interactive WSL shells.

## What worked well

- Public API shape (`ProviderBuilder`, `DynProvider`, `PrivateKeySigner`) is
  ergonomic; signing/transaction plumbing worked first try once wired.
- `provider.client().request(...)` escape hatch made the raw `arkiv_query` path
  possible without forking the crate.
- Read path semantics (entity keys, owners, attribute decode helpers) match the
  TS SDK closely enough that cross-tool verification of commit signatures,
  membership and hashes passed unchanged in both directions.

## Current status

- Reads: `arkiv_query` raw path — verified in both directions.
- Writes: raw `execute` encoder (`arkiv_tx.rs`) — verified in both directions
  (create repo/branch/commit, patch branch head + extend expiry, patch repo
  members for invites).
- CLI parity: `cogit` welcome/log output is byte-identical to the TS CLI; full
  bidirectional E2E (Rust init/commit → TS log/pull/join, TS init/commit →
  Rust log/pull/join) passed on Tiramisu.
