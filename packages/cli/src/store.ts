import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { COGIT_DIR, CONFIG_FILE, CONTEXT_DIR, type RepoConfig } from "@cogit/core";

export function projectDir(): string {
  return process.env.COGIT_HOME ?? process.cwd();
}

export function configPath(): string {
  return join(projectDir(), COGIT_DIR, CONFIG_FILE);
}

export function readConfig(): RepoConfig {
  const path = configPath();
  if (!existsSync(path)) {
    throw new Error(`no ${COGIT_DIR}/${CONFIG_FILE} here — run \`cogit init <name>\` or \`cogit join <invite>\` first`);
  }
  return JSON.parse(readFileSync(path, "utf8")) as RepoConfig;
}

export function writeConfig(config: RepoConfig): string {
  const dir = join(projectDir(), COGIT_DIR);
  mkdirSync(dir, { recursive: true });
  const path = join(dir, CONFIG_FILE);
  writeFileSync(path, `${JSON.stringify(config, null, 2)}\n`, { mode: 0o600 });
  return path;
}

export function writeContextFile(branch: string, content: string): string {
  const dir = join(projectDir(), COGIT_DIR, CONTEXT_DIR);
  mkdirSync(dir, { recursive: true });
  const path = join(dir, `${branch}.md`);
  writeFileSync(path, content);
  return path;
}
