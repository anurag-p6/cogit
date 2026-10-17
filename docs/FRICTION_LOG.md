# FRICTION_LOG.md

> Log every surprise, bug, or doc mismatch the moment it happens. Target 5–8 entries.

```
### F-<number>: <short title>
- Expected: what the docs or SDK implied
- Happened: what occurred (exact error text)
- Versions: SDK version, Node version, network name, date
- Steps to reproduce: numbered, minimal script or commands
- Workaround: what we did instead, or "none"
```

## Entries

### F-1: pnpm 10 ignores esbuild build script, warning on every install
- Expected: `pnpm install` is warning-free; tsx runs.
- Happened: `Ignored build scripts: esbuild@0.28.2.` warning from pnpm.
- Versions: @arkiv-network/sdk 0.8.1, Node 22.22.2, pnpm 10.28.1, 2026-10-17
- Steps to reproduce: 1. fresh clone 2. `pnpm install` 3. observe warning.
- Workaround: none needed — esbuild ships a prebuilt binary; `pnpm exec tsx --version` works. (Optional: `pnpm approve-builds`.)

### F-2: Attribute count limit: SDK's 32 includes the 2 system cells — real user cap is 30
- Expected: ARKIV_NOTES said "docs: up to 30 typed pairs" while SDK exports `MAX_ATTRIBUTES = 32` — looked like a contradiction.
- Happened: empirically 30 user attrs OK; 31 → `An entity may carry at most 32 attributes, got 33.` The engine counts `$contentType` + `$payload` (2 system cells) toward the 32. Also undocumented in SPEC.md: `MAX_STRING_BYTES = 128`, `MAX_NAME_BYTES = 32`.
- Versions: @arkiv-network/sdk 0.8.1, Node 22.22.2, tiramisu, 2026-10-17
- Steps to reproduce: 1. create entities with 30/31 user attributes over WS (the temporary `scripts/ws-probe.ts --attrs N` pattern) 2. observe rejection at 31.
- Workaround: cap at 30 user attributes; `str` values ≤128 bytes; attr names ≤32 bytes, lowercase (see F-6).

### F-3: PowerShell 5.1 mangles quotes when invoking `wsl bash -c`
- Expected: `wsl -d Ubuntu bash -c "...$var... 2>/dev/null"` runs the command verbatim.
- Happened: nested quotes/redirects corrupted — `Could not find a part of the path '\\wsl.localhost\...\dev\null'`, or bash receives garbled text (`%sn ... syntax error`).
- Versions: Windows PowerShell 5.1, WSL2 Ubuntu, 2026-10-17
- Steps to reproduce: `wsl -d Ubuntu bash -lc 'for p in a b; do printf "%-5s %s\n" "$p" "$(npm view "$p" version 2>/dev/null)"; done'` from PowerShell.
- Workaround: write the command to a `.sh` file and run `wsl -d Ubuntu -- bash /tmp/script.sh`.

### F-4: `git` on the repo over the `\\wsl.localhost` UNC path refuses with "dubious ownership"
- Expected: plain `git status` works from Windows against the WSL-hosted repo.
- Happened: `fatal: detected dubious ownership in repository at '//wsl.localhost/Ubuntu/home/anurag/cogit'`.
- Versions: git for Windows, WSL2 Ubuntu, 2026-10-17
- Steps to reproduce: 1. `wsl -d Ubuntu bash -c "cd ~/cogit && git status"` works 2. from PowerShell: `git -C \\wsl.localhost\Ubuntu\home\anurag\cogit status` fails.
- Workaround: prefix `git -c safe.directory='//wsl.localhost/Ubuntu/home/anurag/cogit'` per command (or `git config --global --add safe.directory <path>`).

### F-5: SDK types use viem's `Hex` but don't re-export it
- Expected: `import { Hex } from "@arkiv-network/sdk"` works, as the SDK's signatures are full of `Hex`.
- Happened: `error TS2459: Module '"@arkiv-network/sdk"' declares 'Hex' locally, but it is not exported.`
- Versions: @arkiv-network/sdk 0.8.1, TypeScript 7.0.2, 2026-10-17
- Steps to reproduce: `import type { Hex } from "@arkiv-network/sdk"` → `pnpm exec tsc --noEmit`.
- Workaround: `import type { Hex } from "viem"`.

### F-6: Chain rejects uppercase attribute names though its own error message allows "A"-"Z"
- Expected: SDK grammar `NAME_RE = /^[A-Za-z][A-Za-z0-9._-]*$/` accepts `repoId`; the revert message also lists `"A"-"Z"` in the charset.
- Happened: `createEntity` with attribute `repoId` reverted: `Transaction failed: an attribute name holds "I" (0x49) at byte 4, which is outside the name charset ("A"-"Z", "a"-"z", "0"-"9", ".", "-" and "_", with a letter first)`. Probes: `repoX` and `RepoId` rejected too; `repoid`, `repo_id`, `repo1` accepted. Actual on-chain grammar is lowercase-only.
- Versions: @arkiv-network/sdk 0.8.1, viem 2.57.7, Node 22.22.2, tiramisu, 2026-10-17
- Steps to reproduce: 1. create an entity with attribute name `repoX` (scripts/name-probe.ts pattern) 2. observe `Ident32InvalidByte` revert for any uppercase letter.
- Workaround: lowercase attribute names only — data model attrs become `repo_id`, `forked_from`, `commit_hash` in M1.

### F-7: Transport caps reject large payloads before the 128 KiB engine limit (HTTP 413)
- Expected: `MAX_PAYLOAD_BYTES = 131072`; a payload just under it should be writable.
- Happened: HTTP: 131072-byte payload → `Execution error without revert data | HTTP request failed. Status: 413` on `eth_estimateGas`. Binary search: 129568 B accepted, 129569 B → 413. WS: same boundary, errors `WebSocket request failed` / `Execution error without revert data`. With 20 extra attrs, the engine rejected 129568 too — the 131072 cap covers payload + attrs together.
- Versions: @arkiv-network/sdk 0.8.1, viem 2.57.7, Node 22.22.2, tiramisu, 2026-10-17
- Steps to reproduce: 1. `createEntity` with `new Uint8Array(131072)` payload (payload-limit stage of `pnpm spike`) 2. observe 413 at estimateGas; 3. repeat over `webSocket()` transport → `WebSocket request failed`.
- Workaround: keep commit payload ≤ ~120 KiB (leaves headroom for attrs inside the 128 KiB entity cap); M1 truncates `details` accordingly.

### F-8: Branch heads are single-writer by construction — a teammate's commit to your branch fails after the commit entity is already written
- Expected: with the teammate wallet added to Repo `members`, commit → update Branch `head` just works (SPEC's member model suggests shared write access to branches).
- Happened: teammate's agent committed to branch `main` (created by the inviter): `createEntity` for the Commit succeeded, then `patchEntity` on the Branch failed: `Transaction failed: entity 0x1bccd466…5775d6 is owned by 0x225Fd0b9…, not 0x1F3305F4…`. Membership gates nothing here — Arkiv enforces raw entity ownership (`NotOwner`) on patches, so only the wallet that created the Branch can advance its `head`. Result: two dangling Commit entities on chain (created before the failing head update) that `pull main` then surfaces but no Branch head references.
- Versions: @arkiv-network/sdk 0.8.1, Node 22.22.2, tiramisu, 2026-10-17
- Steps to reproduce: 1. `cogit init` as wallet A 2. `cogit invite` B's address; `cogit join` as B 3. as B: `cogit commit -m "x"` (still on default branch `main`) → tx reverts with `NotOwner`…, but a commit entity for "x" is already on chain.
- Workaround: one branch per person (as the seed does): B runs `cogit branch <name> && cogit use <name>` before committing; `commitContext` now checks `branch.owner ≠ caller` *before* writing anything and throws a corrective message; MCP `context_commit` points agents at this fix.
