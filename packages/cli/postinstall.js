const colored = Boolean(process.stdout.isTTY) && process.env.NO_COLOR === undefined;
const style = (code, text) => (colored ? `\x1b[${code}m${text}\x1b[0m` : text);

try {
  console.log("");
  console.log(`  ${style("96;1", "cogit")} — encrypted, wallet-signed team context on Arkiv.`);
  console.log(
    `  ${style("2", "Record a decision:")} cogit commit -m "…"   ${style("2", "·")}   ${style("2", "Agents:")} cogit-mcp   ${style("2", "·")}   ${style("2", "Run")} ${style("1", "cogit")} ${style("2", "to begin")}`,
  );
  console.log("");
} catch {
  /* never fail the install because of a banner */
}
