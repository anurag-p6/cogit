#!/usr/bin/env bash
# Builds the Rust debug binaries and creates a fresh repo + no-config dir for
# rust/scripts/mcp-e2e.mjs. Run this, then: node rust/scripts/mcp-e2e.mjs
#
# Requires a funded .env at the repo root (PRIVATE_KEY) — the E2E creates a
# real repo on Tiramisu on every run.
set -e
export PATH="$HOME/.cargo/bin:$PATH"

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
ROOT=$(cd "$SCRIPT_DIR/../.." && pwd)
E2E_DIR=${COGIT_E2E_DIR:-/tmp/cogit-mcp-e2e}

echo "=== build debug binaries ==="
cd "$ROOT/rust"
cargo build -p cogit-mcp -p cogit-cli 2>&1 | tail -2

echo "=== fresh test repo ==="
rm -rf "$E2E_DIR" "${E2E_DIR}-noconfig"
mkdir -p "$E2E_DIR" "${E2E_DIR}-noconfig"
cp "$ROOT/.env" "$E2E_DIR/.env"
cd "$E2E_DIR"
"$ROOT/rust/target/debug/cogit" init cogit-mcp-e2e

echo "=== binaries ==="
ls -la "$ROOT/rust/target/debug/cogit-mcp"
echo
echo "Now run: node $SCRIPT_DIR/mcp-e2e.mjs"
