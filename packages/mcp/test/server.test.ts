import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const repoRoot = fileURLToPath(new URL("../../..", import.meta.url));

let client: Client;
let home: string;

beforeAll(async () => {
  home = mkdtempSync(join(tmpdir(), "cogit-mcp-"));
  client = new Client({ name: "smoke-test", version: "0.0.0" });
  const transport = new StdioClientTransport({
    command: "pnpm",
    args: ["--silent", "exec", "tsx", "packages/mcp/src/index.ts"],
    cwd: repoRoot,
    env: { ...process.env, COGIT_HOME: home } as Record<string, string>,
    stderr: "ignore",
  });
  await client.connect(transport);
}, 30000);

afterAll(async () => {
  await client.close();
});

describe("cogit mcp server", () => {
  it("exposes exactly the three context tools with usage-guiding descriptions", async () => {
    const { tools } = await client.listTools();
    expect(tools.map((t) => t.name).sort()).toEqual(["context_commit", "context_log", "context_pull"]);
    for (const tool of tools) {
      expect((tool.description ?? "").length).toBeGreaterThan(60);
      expect(tool.inputSchema).toBeDefined();
    }
    const pull = tools.find((t) => t.name === "context_pull");
    expect(pull?.description ?? "").toMatch(/before starting/i);
  }, 30000);

  it("returns a clear error when run outside a cogit project", async () => {
    const result = await client.callTool({ name: "context_log", arguments: {} });
    expect(result.isError).toBe(true);
    const text = (result.content as { type: string; text?: string }[])
      .map((c) => c.text ?? "")
      .join("\n");
    expect(text).toContain(".cogit");
  }, 30000);
});
