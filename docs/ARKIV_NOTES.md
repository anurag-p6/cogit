# ARKIV_NOTES.md — M0 spike proof

> Written in M0. Never guess API names, units, or limits — prove here.

## SDK

- `@arkiv-network/sdk@0.8.1`, `viem@2.57.7`, chain `tiramisu` from `@arkiv-network/sdk/chains`.
- Clients: `createPublicClient({chain: tiramisu, transport: http()})`, `createWalletClient({chain, transport: http(), account})`; both also work with viem's `webSocket()` transport.
- Writes (`createEntity`, `patchEntity`) do **not** wait for inclusion — call `waitForTransactionReceipt({hash: txHash})` before reading back.
- Writes estimate gas first; oversize requests die at that estimate call, before a tx is sent.
- Query operators + builder live in `@arkiv-network/sdk/query`: `client.select({...}).where(and(eq("a", "b"), ...)).fetch()` → `{entities, cursor, blockNumber}`.

## Spike results (2026-10-17, blocks ~701031–701278)

| Check | Call used | Result |
|---|---|---|
| connect | `getBlockNumber()` | PASS — head 701031, ~2s blocks |
| create entity w/ attrs+expiry | `createEntity({payload, contentType, attributes, expires})` | PASS — returns `{entityKey, txHash, expiresAt}`; `fromHours(6)` → expiresAt = createBlock + 10800 blocks |
| query by attributes | `select({...}).where(and(eq(...), eq(...))).fetch()` | PASS — our entity found, page + `blockNumber` returned |
| owner update | `patchEntity({entityKey, set})` | PASS — attrs updated, `updatedAt` advanced 701033→701035, `createdAt`/`expiresAt` unchanged |
| owner address + block number | `getEntity(key)` | PASS — `owner`, `createdAt`, `updatedAt`, `expiresAt` (block numbers), `contentType` all present |
| non-owner update error | `patchEntity()` from a second wallet | PASS — reverts with `NotOwner(bytes32 entityKey, address caller, address owner)`; SDK text: `entity 0xb2a7…4ce076 is owned by 0x225F…6aF7, not 0x1F33…0B38` |
| payload size limit | binary search on `createEntity` | 129568 B accepted / 129569 B rejected (HTTP `Status: 413`; WS `WebSocket request failed`) — see limits |

Gate (create / query / update): **PASS**.

## Units / limits (empirically verified)

- **Expiry unit**: blocks, 2s each. `ExpirationTime.fromHours(6)` → `expiresAt = createBlock + 10800`. Builders: `fromSeconds/Minutes/Hours/Days/Weeks/Months(30d)/Years(365d)/Blocks`, `atBlock`, `atDate` (+ optional `{atLeast}` guard).
- **Entity size cap**: 131072 bytes total — payload + attribute cells together. Minimal attrs (3 user cells, a few system) → payload 129568 accepted; the same payload with 20 padding attrs rejected. Budget ~1.5 KB for a minimal envelope, less as attrs grow.
- **Attribute count**: 32 cells total, counting the 2 system cells (`$contentType`, `$payload`) → **max 30 user attributes**. 30 OK, 31 → `An entity may carry at most 32 attributes, got 33.`
- **Transport caps**: HTTP request body ≈256 KiB (hex doubles bytes) → `Status: 413` before the engine sees it; WS transport fails at the same payload sizes with `WebSocket request failed`.
- **Attribute names**: actually lowercase-only — chain reverts `Ident32InvalidByte` on any uppercase, even though the SDK regex (`/^[A-Za-z][A-Za-z0-9._-]*$/`) and the revert message both claim `A-Z` is allowed (see F-6). ≤32 bytes, no `--`, no reserved words (`str`, `not`, …), no `$` prefix.
- **Attribute values**: `str` ≤128 bytes. Tags: `bool i32 u64 u256 dec bytes32 str addr key`.
- **Planning number for M2**: truncate commit payload at ~120 KiB (attr + envelope headroom inside the 128 KiB entity cap).

## Data-model renames (from F-6)

Chain-visible attribute names must be lowercase: `repoId` → `repo_id`, `forkedFrom` → `forked_from`, `commitHash` → `commit_hash`. M1+ uses these.
