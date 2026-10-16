# ARKIV_NOTES.md — M0 spike proof

> Written in M0. Never guess API names, units, or limits — prove here.

## SDK

- `@arkiv-network/sdk@0.8.1`, `viem@2.57.7`, chain `tiramisu` from `@arkiv-network/sdk/chains`.
- Clients: `createPublicClient({chain: tiramisu, transport: http()})`, `createWalletClient({chain, transport: http(), account})`.

## Spike results (fill in M0, one PASS line each)

| Check | Call used | Result |
|---|---|---|
| connect | `getBlockNumber()` | TODO |
| create entity w/ attrs+expiry | `createEntity({payload, contentType, attributes, expires})` | TODO |
| query by attributes | `select().where(eq(...)).fetch()` | TODO |
| owner update | `patchEntity()` | TODO |
| owner address + block number | `getEntity(key)` → `owner, createdAt, expiresAt` | TODO |
| non-owner update error | `patchEntity()` as non-owner → exact error text | TODO |
| payload size limit | binary search → bytes | TODO |

## Units / limits

- Expiry unit: blocks (2s/block). Builder: `ExpirationTime.fromDays/fromHours/fromBlocks/atBlock/atDate`.
- Payload limit: TODO bytes (verify in spike; docs imply 128 KiB).
- Attr limit: TODO (docs: up to 30 typed pairs).
