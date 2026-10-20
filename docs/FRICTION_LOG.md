# TypeScript sprint friction log

**Scope:** Findings from the first implementation sprint of cogit, written in TypeScript against `@arkiv-network/sdk@0.8.1` on the Arkiv Tiramisu testnet (`7738577`).

**Method:** Each entry was reproduced on the live network with funded wallets or locally where noted. Exact error text is quoted. The consolidated and normalized report is [arkiv/friction.md](../arkiv/friction.md); this file preserves the chronological sprint record.

**Versions:** `@arkiv-network/sdk@0.8.1`, `viem@2.57.7`, Node 22.22.2, pnpm 10.28.1, TypeScript 7.0.2.

---

### F-1: pnpm 10 skips the esbuild build script and warns on install
- **Observed:** Every install prints `Ignored build scripts: esbuild@0.28.2.`
- **Expected:** `pnpm install` completes without warnings, and `tsx` runs.
- **Reproduction:** Clone the repository and run `pnpm install`.
- **Workaround:** None required. esbuild ships a prebuilt binary and `pnpm exec tsx --version` works. Optional: `pnpm approve-builds`.
- **Version/date:** pnpm 10.28.1, 2026-10-17.

### F-2: The 32-attribute cap includes two system cells; the user limit is 30
- **Expected:** Documentation states a limit of 30 typed attributes, while the SDK exports `MAX_ATTRIBUTES = 32`. The values appeared inconsistent.
- **Observed:** 30 user attributes are accepted. A 31st user attribute reverts with `An entity may carry at most 32 attributes, got 33.` The engine counts `$contentType` and `$payload` toward the limit. The SDK also enforces `str` values of at most 128 UTF-8 bytes and attribute names of at most 32 bytes.
- **Reproduction:** Create entities with 30 and 31 user attributes; the 31st attempt reverts.
- **Workaround:** Cap user attributes at 30; keep `str` values at or below 128 bytes and names at or below 32 bytes.
- **Version/date:** SDK 0.8.1, Node 22.22.2, Tiramisu, 2026-10-17.

### F-3: PowerShell 5.1 corrupts quoting for `wsl bash -c`
- **Expected:** `wsl -d Ubuntu bash -c "..."` receives the command unchanged.
- **Observed:** Nested quotes and redirects are corrupted. Examples: `Could not find a part of the path '\\wsl.localhost\...\dev\null'`, and bash syntax errors caused by altered quoting.
- **Reproduction:** Run a command with nested quotes or `2>/dev/null` from Windows PowerShell 5.1 through `wsl bash -c`.
- **Workaround:** Write the command to a `.sh` file and run `wsl -d Ubuntu -- bash /tmp/script.sh`.
- **Version/date:** Windows PowerShell 5.1, WSL2 Ubuntu, 2026-10-17.

### F-4: git over the `\\wsl.localhost` path reports "dubious ownership"
- **Expected:** `git status` works from Windows against the WSL-hosted repository.
- **Observed:** `fatal: detected dubious ownership in repository at '//wsl.localhost/Ubuntu/home/anurag/cogit'`.
- **Reproduction:** Run `git -C \\wsl.localhost\Ubuntu\home\anurag\cogit status` from PowerShell. Running git inside WSL succeeds.
- **Workaround:** Run git inside WSL, or pass `git -c safe.directory='//wsl.localhost/Ubuntu/home/anurag/cogit'` on each command.
- **Version/date:** Git for Windows, WSL2 Ubuntu, 2026-10-17.

### F-5: The SDK uses viem's `Hex` type but does not re-export it
- **Expected:** `import { Hex } from "@arkiv-network/sdk"` works, because the SDK's signatures use `Hex`.
- **Observed:** `error TS2459: Module '"@arkiv-network/sdk"' declares 'Hex' locally, but it is not exported.`
- **Reproduction:** Add `import type { Hex } from "@arkiv-network/sdk"` and run `pnpm exec tsc --noEmit`.
- **Workaround:** Import `Hex` from `viem`.
- **Version/date:** SDK 0.8.1, TypeScript 7.0.2, 2026-10-17.

### F-6: Uppercase attribute names are rejected although the error text allows `A-Z`
- **Expected:** The SDK accepts names matching `/^[A-Za-z][A-Za-z0-9._-]*$/`, and the revert message lists `"A"`–`"Z"` in the allowed character set.
- **Observed:** Creating an entity with the attribute `repoId` reverts:

  ```
  Transaction failed: an attribute name holds "I" (0x49) at byte 4, which is outside
  the name charset ("A"-"Z", "a"-"z", "0"-"9", ".", "-" and "_", with a letter first)
  ```

  `repoX` and `RepoId` are also rejected; `repoid`, `repo_id` and `repo1` are accepted. The effective grammar is lowercase-only.
- **Reproduction:** Create an entity with the attribute name `repoX` and read the revert.
- **Workaround:** Use lowercase attribute names: `repo_id`, `forked_from`, `commit_hash`.
- **Version/date:** SDK 0.8.1, viem 2.57.7, Node 22.22.2, Tiramisu, 2026-10-17.

### F-7: Transport limits reject payloads below the 128 KiB engine limit
- **Expected:** `MAX_PAYLOAD_BYTES = 131072`, so a payload just below that size should be writable.
- **Observed:** A 131072-byte payload fails during gas estimation with `Execution error without revert data | HTTP request failed. Status: 413`. A binary search accepted 129568 bytes and rejected 129569 bytes with the same error. Over WebSocket, the same boundary produced `WebSocket request failed`. With 20 additional attributes, 129568 bytes was also rejected, indicating that the 131072-byte limit covers the payload and attribute cells together.
- **Reproduction:** Run the payload-limit stage of `pnpm spike` (binary search); repeat with the WebSocket transport.
- **Workaround:** Keep the payload below the cap with headroom. Cogit truncates commit details at 96 KiB (`MAX_DETAILS_BYTES`).
- **Version/date:** SDK 0.8.1, viem 2.57.7, Node 22.22.2, Tiramisu, 2026-10-17.

### F-8: Branch heads are single-writer; a failed head update leaves the commit on chain
- **Expected:** Adding a wallet to the repo's `members` allows that wallet to commit to a shared branch; the member model reads as shared write access.
- **Observed:** The teammate's commit entity is created, then the branch head update fails: `Transaction failed: entity 0x1bccd466…5775d6 is owned by 0x225Fd0b9…, not 0x1F3305F4…`. Arkiv enforces entity ownership on patch operations; membership does not grant patch rights to another wallet's entity. The commit remains on chain but is not referenced by the branch head.
- **Reproduction:** Initialize a repo as wallet A, invite wallet B, join as B, and commit as B on the default `main` branch. The transaction reverts after the commit entity has been written.
- **Workaround:** Use one branch per wallet (`cogit branch <name> && cogit use <name>`). Commit paths now check `branch.owner != caller` before writing and return a corrective message.
- **Version/date:** SDK 0.8.1, Node 22.22.2, Tiramisu, 2026-10-17.
