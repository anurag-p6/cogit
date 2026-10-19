#!/usr/bin/env node
// E2E: TypeScript MCP SDK client <-> Rust cogit-mcp server, with the TS
// cogit-mcp server alongside as the parity oracle. Live Tiramisu testnet.
//
// Prerequisites:
//   - rust/scripts/mcp-e2e-setup.sh has been run (builds debug binaries,
//     creates a fresh repo in $COGIT_E2E_DIR, copies the funded .env)
//   - pnpm build once, for the TS oracle (packages/mcp/dist/index.js)
// Every check must pass for the Rust server to be considered in parity.
import { fileURLToPath, pathToFileURL } from "node:url";

const REPO_ROOT = fileURLToPath(new URL("../../", import.meta.url));
const SDK_DIR = `${REPO_ROOT}packages/mcp/node_modules/@modelcontextprotocol/sdk/dist/esm/client`;
const { Client } = await import(pathToFileURL(`${SDK_DIR}/index.js`).href);
const { StdioClientTransport } = await import(pathToFileURL(`${SDK_DIR}/stdio.js`).href);

const RUST_BIN = process.env.COGIT_MCP_BIN ?? `${REPO_ROOT}rust/target/debug/cogit-mcp`;
const TS_SERVER = ["node", `${REPO_ROOT}packages/mcp/dist/index.js`];
const E2E_DIR = process.env.COGIT_E2E_DIR ?? "/tmp/cogit-mcp-e2e";
const NO_CONFIG_DIR = `${E2E_DIR}-noconfig`;

let passed = 0;
let failed = 0;
const failures = [];

function check(name, cond, detail = "") {
  if (cond) {
    passed++;
    console.log(`  ok  ${name}`);
  } else {
    failed++;
    failures.push(name);
    console.log(`FAIL  ${name}${detail ? `\n      ${detail}` : ""}`);
  }
}

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") {
    const out = {};
    for (const key of Object.keys(value).sort()) {
      if (key === "$schema") continue;
      out[key] = canonical(value[key]);
    }
    return out;
  }
  return value;
}

function normalizePull(text) {
  return text.replace(/_pulled [^\n]+_/, "_pulled <TS>_");
}

async function connect(command, args, cwd, name) {
  const transport = new StdioClientTransport({ command, args, cwd, stderr: "pipe" });
  const client = new Client({ name, version: "9.9.9" });
  await client.connect(transport);
  return client;
}

console.log("== init: rust server ==");
const rust = await connect(RUST_BIN, [], E2E_DIR, "claude-code");
const ri = rust.getServerVersion();
check("rust serverInfo.name == cogit", ri?.name === "cogit", JSON.stringify(ri));
check("rust serverInfo.version == 0.1.0", ri?.version === "0.1.0", JSON.stringify(ri));

console.log("== init: ts server ==");
const ts = await connect(TS_SERVER[0], TS_SERVER.slice(1), E2E_DIR, "claude-code");
const ti = ts.getServerVersion();
check("ts serverInfo.name == cogit", ti?.name === "cogit", JSON.stringify(ti));
check("ts serverInfo.version == 0.1.0", ti?.version === "0.1.0", JSON.stringify(ti));

console.log("== tools/list parity ==");
const [rt, tt] = [await rust.listTools(), await ts.listTools()];
const rTools = Object.fromEntries(rt.tools.map((t) => [t.name, t]));
const tTools = Object.fromEntries(tt.tools.map((t) => [t.name, t]));
check("same tool count", rt.tools.length === tt.tools.length, `${rt.tools.length} vs ${tt.tools.length}`);
check(
  "same tool names",
  JSON.stringify(Object.keys(rTools).sort()) === JSON.stringify(Object.keys(tTools).sort()),
  JSON.stringify(Object.keys(rTools)),
);
for (const name of Object.keys(tTools)) {
  const r = rTools[name];
  const t = tTools[name];
  check(`${name}: title`, r?.title === t.title, `${r?.title} vs ${t.title}`);
  check(`${name}: description`, r?.description === t.description);
  check(
    `${name}: inputSchema`,
    JSON.stringify(canonical(r?.inputSchema)) === JSON.stringify(canonical(t.inputSchema)),
    `\n      rust: ${JSON.stringify(canonical(r?.inputSchema))}\n      ts:   ${JSON.stringify(canonical(t.inputSchema))}`,
  );
}

console.log("== context_log parity: empty repo ==");
const emptyRust = await rust.callTool({ name: "context_log", arguments: {} });
const emptyTs = await ts.callTool({ name: "context_log", arguments: {} });
check("empty log: rust says no commits found", emptyRust.content[0].text === "no commits found", emptyRust.content[0].text);
check("empty log: identical", emptyRust.content[0].text === emptyTs.content[0].text);

console.log("== context_commit via rust server (client claude-code) ==");
const commitResult = await rust.callTool({
  name: "context_commit",
  arguments: {
    summary: "MCP e2e: XChaCha20-Poly1305 for commit envelopes",
    details: "Chosen for performance and a clean Rust implementation via `chacha20poly1305`.",
    kind: "decision",
    tags: ["mcp-e2e", "crypto"],
  },
});
check("commit: not an error", commitResult.isError !== true, JSON.stringify(commitResult));
const commitText = commitResult.content[0].text;
check(
  "commit: output format",
  /^committed 0x[0-9a-f]{12}… to branch "main" \(decision; stored for ~90 days on Arkiv\)$/.test(commitText),
  commitText,
);

console.log("== context_log parity: one commit ==");
const logRust1 = await rust.callTool({ name: "context_log", arguments: {} });
const logTs1 = await ts.callTool({ name: "context_log", arguments: {} });
check("log: identical after rust commit", logRust1.content[0].text === logTs1.content[0].text,
  `\n      rust: ${logRust1.content[0].text}\n      ts:   ${logTs1.content[0].text}`);
check("log: shows summary", logRust1.content[0].text.includes("XChaCha20-Poly1305"));

console.log("== context_pull parity ==");
const pullRust1 = await rust.callTool({ name: "context_pull", arguments: { branch: "main" } });
const pullTs1 = await ts.callTool({ name: "context_pull", arguments: { branch: "main" } });
check(
  "pull: identical (normalized timestamp)",
  normalizePull(pullRust1.content[0].text) === normalizePull(pullTs1.content[0].text),
  `\n      rust: ${pullRust1.content[0].text}\n      ts:   ${pullTs1.content[0].text}`,
);
check("pull: agent recorded as claude-code", pullRust1.content[0].text.includes("claude-code"),
  pullRust1.content[0].text.split("\n")[5]);
check("pull: summary present", pullRust1.content[0].text.includes("XChaCha20-Poly1305"));
check("pull: tag present", pullRust1.content[0].text.includes("`mcp-e2e`"));

console.log("== context_commit via ts server (client cursor) ==");
const tsCommit = await ts.callTool({
  name: "context_commit",
  arguments: { summary: "MCP e2e: cursor wrote this note", kind: "note", tags: ["mcp-e2e"] },
});
check("ts commit: not an error", tsCommit.isError !== true, JSON.stringify(tsCommit));

console.log("== context_log parity: two commits ==");
const logRust2 = await rust.callTool({ name: "context_log", arguments: { branch: "main", n: 5 } });
const logTs2 = await ts.callTool({ name: "context_log", arguments: { branch: "main", n: 5 } });
check("log(n=5): identical", logRust2.content[0].text === logTs2.content[0].text,
  `\n      rust: ${logRust2.content[0].text}\n      ts:   ${logTs2.content[0].text}`);
check("log: two lines", logRust2.content[0].text.trim().split("\n").length === 2);

console.log("== pull with kind filter parity ==");
const kindPullRust = await rust.callTool({ name: "context_pull", arguments: { branch: "main", kind: "note" } });
const kindPullTs = await ts.callTool({ name: "context_pull", arguments: { branch: "main", kind: "note" } });
check("pull(kind=note): identical", normalizePull(kindPullRust.content[0].text) === normalizePull(kindPullTs.content[0].text),
  `\n      rust: ${kindPullRust.content[0].text}\n      ts:   ${kindPullTs.content[0].text}`);

console.log("== errors: invalid summary (isError result, identical text) ==");
const emptyErrRust = await rust.callTool({ name: "context_commit", arguments: { summary: "" } });
const emptyErrTs = await ts.callTool({ name: "context_commit", arguments: { summary: "" } });
check("empty summary: both isError", emptyErrRust.isError === true && emptyErrTs.isError === true,
  `\n      rust: ${JSON.stringify(emptyErrRust)}\n      ts:   ${JSON.stringify(emptyErrTs)}`);
check("empty summary: identical text", emptyErrRust.content[0].text === emptyErrTs.content[0].text,
  `\n      rust: ${emptyErrRust.content[0].text}\n      ts:   ${emptyErrTs.content[0].text}`);

console.log("== errors: n out of range (isError result, identical text) ==");
const nRust = await rust.callTool({ name: "context_log", arguments: { n: 500 } });
const nTs = await ts.callTool({ name: "context_log", arguments: { n: 500 } });
check("n=500: both isError", nRust.isError === true && nTs.isError === true,
  `\n      rust: ${JSON.stringify(nRust)}\n      ts:   ${JSON.stringify(nTs)}`);
check("n=500: identical text", nRust.content[0].text === nTs.content[0].text,
  `\n      rust: ${nRust.content[0].text}\n      ts:   ${nTs.content[0].text}`);

console.log("== errors: unknown tool (isError result, identical text) ==");
const unkRust = await rust.callTool({ name: "nope", arguments: {} });
const unkTs = await ts.callTool({ name: "nope", arguments: {} });
check("unknown tool: both isError", unkRust.isError === true && unkTs.isError === true,
  `\n      rust: ${JSON.stringify(unkRust)}\n      ts:   ${JSON.stringify(unkTs)}`);
check("unknown tool: identical text", unkRust.content[0].text === unkTs.content[0].text,
  `\n      rust: ${unkRust.content[0].text}\n      ts:   ${unkTs.content[0].text}`);

console.log("== errors: missing required arg (isError result both) ==");
const missingRust = await rust.callTool({ name: "context_pull", arguments: {} });
const missingTs = await ts.callTool({ name: "context_pull", arguments: {} });
check("missing branch: both isError", missingRust.isError === true && missingTs.isError === true,
  `\n      rust: ${JSON.stringify(missingRust)}\n      ts:   ${JSON.stringify(missingTs)}`);
check("missing branch: both mention branch", /\bbranch\b/.test(String(missingRust.content[0].text)) && /\bbranch\b/.test(String(missingTs.content[0].text)),
  `\n      rust: ${missingRust.content[0].text}\n      ts:   ${missingTs.content[0].text}`);

console.log("== errors: no .cogit config (tool-level error both) ==");
const rustNoCfg = await connect(RUST_BIN, [], NO_CONFIG_DIR, "probe");
const tsNoCfg = await connect(TS_SERVER[0], TS_SERVER.slice(1), NO_CONFIG_DIR, "probe");
const rustNoCfgLog = await rustNoCfg.callTool({ name: "context_log", arguments: {} });
const tsNoCfgLog = await tsNoCfg.callTool({ name: "context_log", arguments: {} });
check("no config: rust isError", rustNoCfgLog.isError === true, JSON.stringify(rustNoCfgLog));
check("no config: ts isError", tsNoCfgLog.isError === true, JSON.stringify(tsNoCfgLog));
check(
  "no config: both prefix 'cogit error: '",
  String(rustNoCfgLog.content[0].text).startsWith("cogit error: ") &&
    String(tsNoCfgLog.content[0].text).startsWith("cogit error: "),
  `\n      rust: ${rustNoCfgLog.content[0].text}\n      ts:   ${tsNoCfgLog.content[0].text}`,
);
await rustNoCfg.close();
await tsNoCfg.close();

await rust.close();
await ts.close();

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.log("failed checks: " + failures.join(", "));
  process.exit(1);
}
process.exit(0);
