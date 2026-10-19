const LOGO: [&str; 6] = [
    " ██████╗ ██████╗  ██████╗ ██╗████████╗",
    "██╔════╝ ██╔═══██╗██╔════╝ ██║╚══██╔══╝",
    "██║      ██║   ██║██║  ███╗██║   ██║   ",
    "██║      ██║   ██║██║   ██║██║   ██║   ",
    "╚██████╗ ╚██████╔╝╚██████╔╝██║   ██║   ",
    " ╚═════╝  ╚═════╝  ╚═════╝ ╚═╝   ╚═╝   ",
];

const TAGLINE: &str = "Encrypted, wallet-signed team context on Arkiv — any agent, on any machine, pulls verified context and follows it.";

fn should_color() -> bool {
    use std::io::IsTerminal;
    std::io::stdout().is_terminal() && std::env::var_os("NO_COLOR").is_none()
}

fn wrap(text: &str, width: usize) -> Vec<String> {
    let mut lines: Vec<String> = Vec::new();
    let mut current = String::new();
    for word in text.split(' ') {
        if current.is_empty() {
            current = word.to_string();
        } else if format!("{current} {word}").chars().count() <= width {
            current = format!("{current} {word}");
        } else {
            lines.push(current.clone());
            current = word.to_string();
        }
    }
    if !current.is_empty() {
        lines.push(current);
    }
    lines
}

fn style(colors: bool, code: &str, text: &str) -> String {
    if colors {
        format!("\x1b[{code}m{text}\x1b[0m")
    } else {
        text.to_string()
    }
}

pub fn render_welcome() -> String {
    let colors = should_color();
    let cyan = |t: &str| style(colors, "96;1", t);
    let magenta = |t: &str| style(colors, "95;1", t);
    let bright = |t: &str| style(colors, "1", t);
    let dim = |t: &str| style(colors, "2", t);

    let commands: [(&str, &str); 6] = [
        ("cogit init <name>", "create a repo + group key"),
        ("cogit invite <addr>", "add a teammate"),
        ("cogit join <invite>", "join a repo"),
        ("cogit commit -m \"…\"", "record encrypted context"),
        ("cogit pull <branch>", "verified context for agents"),
        ("cogit --help", "all 8 commands"),
    ];
    let cmd_width = commands
        .iter()
        .map(|(cmd, _)| cmd.chars().count())
        .max()
        .unwrap_or(0);
    let tagline_lines = wrap(TAGLINE, 56);
    let agent_line =
        "for agents:  cogit-mcp — MCP server (context_commit / context_pull / context_log)";

    let content_width = LOGO
        .iter()
        .map(|line| line.chars().count())
        .chain(tagline_lines.iter().map(|line| line.chars().count()))
        .chain(std::iter::once(
            cmd_width
                + 2
                + commands
                    .iter()
                    .map(|(_, desc)| desc.len())
                    .max()
                    .unwrap_or(0),
        ))
        .chain(std::iter::once(agent_line.chars().count()))
        .max()
        .unwrap_or(0);

    let mut rows: Vec<(String, String)> = Vec::new();
    for line in LOGO {
        let lead = (content_width - line.chars().count()) / 2;
        let pad = " ".repeat(lead);
        rows.push((format!("{pad}{line}"), format!("{pad}{}", cyan(line))));
    }
    rows.push((String::new(), String::new()));
    for line in &tagline_lines {
        let lead = (content_width - line.chars().count()) / 2;
        let pad = " ".repeat(lead);
        rows.push((format!("{pad}{line}"), format!("{pad}{}", bright(line))));
    }
    rows.push((String::new(), String::new()));
    for (cmd, desc) in commands {
        let padded = format!("{cmd:<cmd_width$}");
        rows.push((
            format!("{padded}  {desc}"),
            format!("{}  {}", magenta(&padded), dim(desc)),
        ));
    }
    rows.push((String::new(), String::new()));
    rows.push((
        agent_line.to_string(),
        format!(
            "{}  {}",
            bright("for agents:"),
            dim("cogit-mcp — MCP server (context_commit / context_pull / context_log)")
        ),
    ));

    let top = format!("╭{}╮", "─".repeat(content_width + 4));
    let bottom = format!("╰{}╯", "─".repeat(content_width + 4));
    let mut out: Vec<String> = vec![String::new(), top];
    for (plain, render) in rows {
        let pad = " ".repeat(content_width - plain.chars().count());
        out.push(format!("│  {render}{pad}  │"));
    }
    out.push(bottom);
    out.push(String::new());
    out.join("\n")
}
