import { cpSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "..", "..", "arkiv");
const destination = join(here, "..", "public", "arkiv");

rmSync(destination, { recursive: true, force: true });
mkdirSync(destination, { recursive: true });
for (const file of ["friction.md", "schema.md"]) {
  cpSync(join(source, file), join(destination, file));
}
