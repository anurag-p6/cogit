const COMMANDS: Array<{ cmd: string; desc: React.ReactNode }> = [
  {
    cmd: "cogit init <name>",
    desc: (
      <>
        create a repo and <span className="mono">main</span>, write{" "}
        <span className="mono">.cogit/config.json</span>
      </>
    ),
  },
  {
    cmd: "cogit invite <addr>",
    desc: (
      <>
        add a member, print a <span className="mono">cogit1:</span> invite carrying the group key
      </>
    ),
  },
  {
    cmd: "cogit join <invite>",
    desc: <>save the invite to config, mode 600</>,
  },
  {
    cmd: "cogit branch <name>",
    desc: <>fork from the current head — every writer gets a branch</>,
  },
  {
    cmd: "cogit use <branch>",
    desc: <>switch the current branch</>,
  },
  {
    cmd: 'cogit commit -m "…"',
    desc: (
      <>
        encrypt, sign, write the entity, advance the head{" "}
        <span className="kbd-row">
          <kbd>--kind</kbd>
          <kbd>--tag</kbd>
          <kbd>--details-file</kbd>
        </span>
      </>
    ),
  },
  {
    cmd: "cogit pull <branch>",
    desc: (
      <>
        verified markdown, oldest first → stdout and <span className="mono">.cogit/context/</span>
      </>
    ),
  },
  {
    cmd: "cogit log",
    desc: (
      <>
        commits with verified / invalid status <kbd>--branch</kbd>
      </>
    ),
  },
];

export default function CliSection() {
  return (
    <section className="section cli" id="cli">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <div>
            <p className="eyebrow">06 — CLI</p>
            <h2 className="h2">The whole CLI.</h2>
          </div>
          <p className="section-note">
            Eight commands, one per concept: repo, member, branch, commit, pull, log. Node 22+, no
            runtime dependencies.
          </p>
        </div>

        <div className="cli-grid">
          <div className="cli-table" data-reveal>
            {COMMANDS.map((row) => (
              <div className="cli-row" key={row.cmd}>
                <code className="cli-cmd">{row.cmd}</code>
                <span className="cli-desc">{row.desc}</span>
              </div>
            ))}
          </div>

          <div className="term cli-term" data-reveal>
            <div className="term-bar">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
              <span className="term-title">two shells, one repo</span>
            </div>
            <div className="term-body">
              <p className="t-shell">shell A · anurag</p>
              <p>
                <span className="t-prompt">$</span>{" "}
                <span className="t-cmd">
                  cogit commit -m <span className="t-str">&quot;Postgres + JSONB for reports&quot;</span> --kind
                  decision
                </span>
              </p>
              <p>
                <span className="t-ok">→ committed 0x7c9e…a4d2 on main</span>{" "}
                <span className="t-dim">· expires in 90 d</span>
              </p>
              <p className="t-gap t-shell">
                shell B · ritesh — different machine, different wallet
              </p>
              <p>
                <span className="t-prompt">$</span> <span className="t-cmd">cogit pull main</span>
              </p>
              <p>
                <span className="t-ok">6 commits · 6 verified · 0 invalid</span>{" "}
                <span className="t-dim">→ .cogit/context/main.md</span>
              </p>
              <p className="t-gap">
                <span className="t-key">##</span> 2026-10-11T21:36Z ·{" "}
                <span className="t-str">decision</span> · anurag
              </p>
              <p className="t-key">Postgres + JSONB for the reports table; wallet-signature auth.</p>
              <p className="t-dim">single reports table, jsonb payload, auth via signed nonce…</p>
              <p className="t-cursor-line">
                <span className="cursor" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
