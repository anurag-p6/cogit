import CopyButton from "./CopyButton";
import Icon from "./Icon";

const SNIPPET = `## Cogit — team context memory
This project uses Cogit (MCP server \`cogit\`) as shared team memory on Arkiv.
- After every decision, call context_commit (kind "decision" for real decisions).
- Before starting work that a teammate may have specified or decided on,
  call context_pull for their branch and follow it.
- Never rely on unverified context.`;

const TOOLS = [
  { name: "context_commit", when: "right after making a decision, to the agent's own branch" },
  { name: "context_pull", when: "before work that a teammate may have specified" },
  { name: "context_log", when: "to scan recent verified commits and pick what matters" },
];

export default function Agents() {
  return (
    <section className="section agents" id="agents">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <div>
            <p className="eyebrow">05 — Agents</p>
            <h2 className="h2">Give your agent the tool.</h2>
          </div>
          <p className="section-note">
            The MCP server exposes three tools over stdio. Tool descriptions tell the agent when to
            use them — commit after decisions, pull before dependent work.
          </p>
        </div>

        <div className="agents-grid">
          <div className="agents-left" data-reveal>
            <table className="tool-table">
              <thead>
                <tr>
                  <th>Tool</th>
                  <th>When the agent calls it</th>
                </tr>
              </thead>
              <tbody>
                {TOOLS.map((tool) => (
                  <tr key={tool.name}>
                    <td className="mono">{tool.name}</td>
                    <td>{tool.when}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="snippet card">
              <div className="snippet-head">
                <span className="mono">CLAUDE.md / AGENTS.md</span>
                <CopyButton text={SNIPPET} label="Copy snippet" />
              </div>
              <pre>
                <code>{SNIPPET}</code>
              </pre>
            </div>
          </div>

          <div className="agent-run card" data-reveal>
            <p className="proof-label">One real session, replayed</p>
            <div className="run">
              <div className="run-row">
                <span className="run-who mono">you</span>
                <div className="run-msg">write the DB schema for the reports page</div>
              </div>
              <div className="run-row">
                <span className="run-who mono">agent</span>
                <div className="run-msg run-call">
                  context_log <span className="run-dim">{"{ }"}</span>
                </div>
              </div>
              <div className="run-row">
                <span className="run-who mono">cogit</span>
                <div className="run-msg run-dim">
                  12 commits · 5 branches · 1 invalid skipped
                </div>
              </div>
              <div className="run-row">
                <span className="run-who mono">agent</span>
                <div className="run-msg run-call">
                  context_pull <span className="run-dim">{'{ "branch": "anurag" }'}</span>
                </div>
              </div>
              <div className="run-row">
                <span className="run-who mono">cogit</span>
                <div className="run-msg run-ok">
                  <Icon name="i-check" className="ic ic-check" />
                  6 commits · every signature verified
                </div>
              </div>
              <div className="run-row">
                <span className="run-who mono">cogit</span>
                <div className="run-msg run-dim">
                  decision · Postgres + JSONB for the reports table; wallet-signature auth
                </div>
              </div>
              <div className="run-row">
                <span className="run-who mono">agent</span>
                <div className="run-msg">
                  wrote <span className="mono">db/migrations/0001_create_reports.sql</span> —
                  matching the decision, no hints needed
                </div>
              </div>
            </div>
            <p className="agent-run-foot mono">verified end-to-end with two real agents on tiramisu</p>
          </div>
        </div>
      </div>
    </section>
  );
}
