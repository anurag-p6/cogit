const LOGO = [
  " ██████╗ ██████╗  ██████╗ ██╗████████╗",
  "██╔════╝ ██╔═══██╗██╔════╝ ██║╚══██╔══╝",
  "██║      ██║   ██║██║  ███╗██║   ██║   ",
  "██║      ██║   ██║██║   ██║██║   ██║   ",
  "╚██████╗ ╚██████╔╝╚██████╔╝██║   ██║   ",
  " ╚═════╝  ╚═════╝  ╚═════╝ ╚═╝   ╚═╝   ",
];

const TAGLINE =
  "Encrypted, wallet-signed team context on Arkiv — any agent, on any machine, pulls verified context and follows it.";

function shouldColor(): boolean {
  return Boolean(process.stdout.isTTY) && process.env.NO_COLOR === undefined;
}

function wrap(text: string, width: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if (current === "") {
      current = word;
    } else if (`${current} ${word}`.length <= width) {
      current = `${current} ${word}`;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current !== "") {
    lines.push(current);
  }
  return lines;
}

export function renderWelcome(): string {
  const colors = shouldColor();
  const style = (code: string, text: string): string => (colors ? `\x1b[${code}m${text}\x1b[0m` : text);
  const cyan = (t: string): string => style("96;1", t);
  const magenta = (t: string): string => style("95;1", t);
  const bright = (t: string): string => style("1", t);
  const dim = (t: string): string => style("2", t);

  const commands: [string, string][] = [
    ["cogit init <name>", "create a repo + group key"],
    ["cogit invite <addr>", "add a teammate"],
    ["cogit join <invite>", "join a repo"],
    ["cogit commit -m \"…\"", "record encrypted context"],
    ["cogit pull <branch>", "verified context for agents"],
    ["cogit --help", "all 8 commands"],
  ];
  const cmdWidth = Math.max(...commands.map(([cmd]) => cmd.length));
  const taglineLines = wrap(TAGLINE, 56);
  const agentLine = "for agents:  cogit-mcp — MCP server (context_commit / context_pull / context_log)";

  const contentWidth = Math.max(
    ...LOGO.map((line) => line.length),
    ...taglineLines.map((line) => line.length),
    cmdWidth + 2 + Math.max(...commands.map(([, desc]) => desc.length)),
    agentLine.length,
  );

  const rows: { plain: string; render: string }[] = [];
  for (const line of LOGO) {
    const lead = Math.floor((contentWidth - line.length) / 2);
    rows.push({ plain: " ".repeat(lead) + line, render: " ".repeat(lead) + cyan(line) });
  }
  rows.push({ plain: "", render: "" });
  for (const line of taglineLines) {
    const lead = Math.floor((contentWidth - line.length) / 2);
    rows.push({ plain: " ".repeat(lead) + line, render: " ".repeat(lead) + bright(line) });
  }
  rows.push({ plain: "", render: "" });
  for (const [cmd, desc] of commands) {
    rows.push({
      plain: `${cmd.padEnd(cmdWidth)}  ${desc}`,
      render: `${magenta(cmd.padEnd(cmdWidth))}  ${dim(desc)}`,
    });
  }
  rows.push({ plain: "", render: "" });
  rows.push({
    plain: agentLine,
    render: `${bright("for agents:")}  ${dim("cogit-mcp — MCP server (context_commit / context_pull / context_log)")}`,
  });

  const top = "╭" + "─".repeat(contentWidth + 4) + "╮";
  const bottom = "╰" + "─".repeat(contentWidth + 4) + "╯";
  const out: string[] = ["", top];
  for (const row of rows) {
    out.push(`│  ${row.render}${" ".repeat(contentWidth - row.plain.length)}  │`);
  }
  out.push(bottom, "");
  return out.join("\n");
}
