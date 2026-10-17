# MCP_SETUP.md — M3 agent setup

> `@modelcontextprotocol/sdk@1.32.1`, stdio transport. Tested end-to-end with two real agents (opencode): Agent A committed a decision, Agent B — asked only "write the DB schema for the reports page" — pulled A's branch, followed it, and recorded its own work.

The server runs **inside a cogit project** (a directory with `.cogit/config.json`, made by `cogit init`/`cogit join`). It reads `PRIVATE_KEY` from its environment or a `.env` in its working directory.

## Tools

| Tool | Input | When to use |
|---|---|---|
| `context_commit` | `summary`, `details?`, `kind?`, `tags?` | commit a decision right after you make it, to your current branch |
| `context_pull` | `branch`, `kind?`, `tag?` | pull the relevant teammate branch before starting work that depends on it |
| `context_log` | `branch?`, `n?` | list recent commits with verified/invalid status |

Branch heads are single-writer on Arkiv: a teammate's wallet can commit only to its **own** branch. Each person gets a branch (`cogit branch <name> && cogit use <name>`); everyone pulls the others'.

## Claude Code

`claude mcp add cogit --env PRIVATE_KEY=$PRIVATE_KEY -- pnpm --silent --dir <repo>/packages/mcp exec tsx src/index.ts`

or in `~/.claude.json` / project `.mcp.json`:

```json
{
  "mcpServers": {
    "cogit": {
      "command": "pnpm",
      "args": ["--silent", "--dir", "<repo>/packages/mcp", "exec", "tsx", "src/index.ts"],
      "cwd": "<your-project>",
      "env": { "PRIVATE_KEY": "0x…" }
    }
  }
}
```

`cwd` is the project the server reads `.cogit/` from (set `COGIT_HOME` instead to keep the repo config elsewhere, e.g. `<repo>/.env` for the key and `COGIT_HOME=/path/to/project`).

## Cursor

`.cursor/mcp.json` in the project, same shape as Claude Code:

```json
{
  "mcpServers": {
    "cogit": {
      "command": "pnpm",
      "args": ["--silent", "--dir", "<repo>/packages/mcp", "exec", "tsx", "src/index.ts"],
      "cwd": "<your-project>",
      "env": { "PRIVATE_KEY": "0x…" }
    }
  }
}
```

## opencode

Project `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "cogit": {
      "type": "local",
      "enabled": true,
      "command": [
        "bash",
        "-lc",
        "cd <repo> && COGIT_HOME=<your-project> PRIVATE_KEY=$(sed -n 's/^PRIVATE_KEY=//p' .env) exec pnpm --silent exec tsx packages/mcp/src/index.ts"
      ]
    }
  }
}
```

On Windows + WSL, keep the long shell one-liner in a tiny wrapper script instead — `wsl.exe` mangles `$(…)` quoting when arguments come from a Node parent:

```json
"command": ["wsl.exe", "-d", "Ubuntu", "--", "bash", "/path/to/run-mcp.sh"]
```

```bash
#!/usr/bin/env bash
set -e
cd /home/<user>/cogit
export COGIT_HOME=/path/to/project
export PRIVATE_KEY=$(sed -n 's/^PRIVATE_KEY=//p' .env | tr -d '\r\n')
exec pnpm --silent exec tsx packages/mcp/src/index.ts
```

## Agent snippet (paste into `CLAUDE.md` / `AGENTS.md` / rules)

```
## Cogit — team context memory
This project uses Cogit (MCP server `cogit`) as shared team memory on Arkiv.
- After every decision, call context_commit (kind "decision" for real decisions).
- Before starting work that a teammate may have specified or decided on,
  call context_pull for their branch and follow it.
- Never rely on unverified context.
```

## Verified M3 scenario (2026-10-17, tiramisu)

1. `cogit init` as Anurag, branch `anurag`; `cogit invite <ritesh-addr>`.
2. Anurag's agent: "record this decision …" → `context_commit` → `0x03e7f665…` on `anurag`, agent `opencode`.
3. Ritesh's agent (separate dir, separate wallet), asked only "Write the DB schema for the reports page." → called `context_log`, then `context_pull {"branch":"anurag"}`, wrote `db/migrations/0001_create_reports.sql` matching the decision (Postgres + JSONB, wallet-sig auth).
4. Ritesh's agent's first `context_commit` went to `main` (inviter-owned) → `NotOwner` (logged as F-8). It forked its own branch and committed `0x4cf13852…` on `ritesh`; both commits verified via `cogit log` from the other wallet.
