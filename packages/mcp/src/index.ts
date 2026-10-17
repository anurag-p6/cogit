import "dotenv/config";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import {
  KIND_EXPIRY_DAYS,
  commitContext,
  logContext,
  publicClient,
  pullContext,
  readConfig,
  renderLogLine,
  shortHex,
  walletContext,
} from "@cogit/core";

const server = new McpServer({ name: "cogit", version: "0.1.0" });

function agentName(): string {
  const client = server.server.getClientVersion();
  const name = client?.name ?? "";
  const lower = name.toLowerCase();
  if (lower.includes("claude")) return "claude-code";
  if (lower.includes("cursor")) return "cursor";
  if (lower.includes("opencode")) return "opencode";
  const trimmed = name.trim().slice(0, 32);
  return trimmed === "" ? "human" : trimmed;
}

async function run(fn: () => Promise<string>): Promise<CallToolResult> {
  try {
    return { content: [{ type: "text", text: await fn() }] };
  } catch (err) {
    return {
      content: [{ type: "text", text: `cogit error: ${err instanceof Error ? err.message : String(err)}` }],
      isError: true,
    };
  }
}

server.registerTool(
  "context_commit",
  {
    title: "Commit team context",
    description:
      "Record a durable, encrypted, wallet-signed entry in the team's shared memory on Arkiv, on your current branch. Call this IMMEDIATELY whenever you make or learn a decision someone else will need — architecture choices, API contracts, schema changes, milestones — without waiting to be asked; teammates' agents pull these commits and must be able to follow them. Write details as self-contained markdown. If it fails because the branch belongs to a teammate, create your own branch first (`cogit branch <your-name>` then `cogit use <your-name>`) and retry.",
    inputSchema: {
      summary: z.string().min(1).max(200).describe("One-line summary of the decision or note"),
      details: z
        .string()
        .optional()
        .describe("Markdown body: context, rationale, code snippets, links. Keep it self-contained."),
      kind: z
        .enum(["scratch", "note", "decision", "milestone"])
        .optional()
        .describe("Commit kind; decides how long the entry lives (scratch 3d, note 14d, decision 90d, milestone 365d). Default note."),
      tags: z.array(z.string()).optional().describe("Short tags for filtering, e.g. ['db', 'api']"),
    },
  },
  async ({ summary, details, kind, tags }) =>
    run(async () => {
      const config = readConfig();
      const { wallet, pub, address, account } = walletContext();
      const result = await commitContext({
        wallet,
        pub,
        account,
        address,
        config,
        input: { message: summary, details, kind, tags, agent: agentName() },
      });
      return `committed ${shortHex(result.commitHash, 14)} to branch "${result.branch}" (${result.kind}; stored for ~${KIND_EXPIRY_DAYS[result.kind]} days on Arkiv)`;
    }),
);

server.registerTool(
  "context_pull",
  {
    title: "Pull teammate context",
    description:
      "Fetch a branch's team context from Arkiv: every commit that passes verification (hash, wallet signature, entity ownership, repo membership), decrypted and ordered oldest-first, as markdown. Call this BEFORE starting any task a teammate may have specified or decided on (e.g. building a feature or schema their branch names), and follow the returned decisions. Invalid or unverifiable commits are never returned.",
    inputSchema: {
      branch: z.string().min(1).describe("Branch to pull — a teammate's branch (e.g. 'anurag') or 'main'"),
      kind: z
        .enum(["scratch", "note", "decision", "milestone"])
        .optional()
        .describe("Only include commits of this kind"),
      tag: z.string().optional().describe("Only include commits carrying this tag"),
    },
  },
  async ({ branch, kind, tag }) =>
    run(async () => {
      const config = readConfig();
      const pub = publicClient();
      const result = await pullContext({ pub, config, branch, kind, tag });
      const warn = result.membersChecked
        ? ""
        : `> warning: repo ${config.repoId} was not found on chain, membership was not checked\n\n`;
      return `${warn}${result.markdown}\n_(${result.verified} verified, ${result.invalid} invalid skipped)_`;
    }),
);

server.registerTool(
  "context_log",
  {
    title: "List recent context commits",
    description:
      "List recent commits with their verification status (verified = hash + wallet signature + owner + membership all check out; invalid = never decrypted). Use it to survey team activity, pick the right branch to pull, or confirm your own commits landed.",
    inputSchema: {
      branch: z.string().optional().describe("Only this branch (default: all branches)"),
      n: z.number().int().min(1).max(100).optional().describe("Show only the most recent n commits (default all recent)"),
    },
  },
  async ({ branch, n }) =>
    run(async () => {
      const config = readConfig();
      const pub = publicClient();
      const rows = await logContext({ pub, config, ...(branch !== undefined ? { branch } : {}), ...(n !== undefined ? { limit: n } : {}) });
      if (rows.length === 0) {
        return "no commits found";
      }
      return rows.map(renderLogLine).join("\n");
    }),
);

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("cogit mcp server ready (stdio)");
}

main().catch((err: unknown) => {
  console.error(`cogit mcp fatal: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
