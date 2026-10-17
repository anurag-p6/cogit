import { build } from "esbuild";

const banner = [
  "#!/usr/bin/env node",
  "import { createRequire as __createRequire } from 'node:module';",
  "const require = __createRequire(import.meta.url);",
].join("\n");

const targets = [
  { name: "cogit-cli", entry: "packages/cli/src/index.ts", out: "packages/cli/dist/index.js" },
  { name: "cogit-mcp", entry: "packages/mcp/src/index.ts", out: "packages/mcp/dist/index.js" },
];

for (const target of targets) {
  const result = await build({
    entryPoints: [target.entry],
    bundle: true,
    platform: "node",
    format: "esm",
    target: "node22",
    banner: { js: banner },
    outfile: target.out,
    metafile: true,
    logLevel: "warning",
  });
  const bytes = Object.values(result.metafile.outputs)[0]?.bytes ?? 0;
  console.log(`${target.name}: ${target.out} (${(bytes / 1024).toFixed(0)} KiB)`);
}
