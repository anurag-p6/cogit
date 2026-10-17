# MCP_SETUP.md — M3 agent setup

> `@modelcontextprotocol/sdk@1.32.1`, stdio transport.

## Tools

| Tool | Input | When to use |
|---|---|---|
| `context_commit` | `summary`, `details?`, `kind?`, `tags?` | commit a decision right after you make it, to the current branch |
| `context_pull` | `branch`, `kind?`, `tag?` | pull the relevant teammate branch before starting work that depends on it |
| `context_log` | `branch?`, `n?` | list recent commits with verified/invalid status |

## Claude Code config

```json
{
  "mcpServers": {
    "cogit": { "command": "node", "args": ["<repo>/packages/mcp/dist/index.js"], "cwd": "<your-project>" }
  }
}
```

## Cursor config

Settings → MCP → Add server → `cogit`, command `node <repo>/packages/mcp/dist/index.js`.

## Agent snippet (paste into `CLAUDE.md` / agent rules)

```
You have Cogit memory. After every decision, call context_commit.
Before work depending on a teammate, call context_pull for their branch and follow it.
Never use unverified context.
```

_Full working config verified in M3._
