import Icon from "./Icon";

const KINDS = [
  { kind: "scratch", covers: "throwaway notes and spikes", days: "3 d" },
  { kind: "note", covers: "working notes teammates may need", days: "14 d" },
  { kind: "decision", covers: "choices that bind future work", days: "90 d" },
  { kind: "milestone", covers: "shipped checkpoints", days: "365 d" },
];

const WHY = [
  {
    key: "expiry",
    body: (
      <>
        Entities carry an on-chain expiry in blocks. Context decay is enforced by the network, not
        a cron job.
      </>
    ),
  },
  {
    key: "queries",
    body: (
      <>
        Attributes are public and queryable — find a repo&apos;s commits by{" "}
        <span className="mono">type, repo_id, branch, kind</span> without an indexer.
      </>
    ),
  },
  {
    key: "ownership",
    body: (
      <>
        An entity&apos;s owner is its writer&apos;s wallet. Authorship is a protocol fact, checked
        in the verify chain.
      </>
    ),
  },
  {
    key: "branch heads",
    body: (
      <>
        Heads are patched attributes. Single-writer by construction: only the owner&apos;s wallet
        can advance them.
      </>
    ),
  },
];

export default function Features() {
  return (
    <section className="section features" id="features">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <div>
            <p className="eyebrow">04 — Features</p>
            <h2 className="h2">Three features, nothing else.</h2>
          </div>
          <p className="section-note">
            The whole build is scoped to upload, pull, and show — so the demo stays honest and the
            tool stays small.
          </p>
        </div>

        <div className="bento">
          <article className="fcard card span-7 tall" data-reveal>
            <div className="fcard-head">
              <span className="fcard-tag mono">F1 · commit</span>
              <Icon name="i-lock" className="ic fcard-ic" />
            </div>
            <h3 className="fcard-title display-sm">Commit context from anywhere.</h3>
            <p className="fcard-body">
              One command seals the body, signs the hash, and writes the entity. Expiry is chosen
              by kind, so scratch pads fade and milestones stay a year.
            </p>
            <div className="term term-tight">
              <div className="term-body term-light">
                <p>
                  <span className="t-prompt">$</span> cogit commit -m{" "}
                  <span className="t-str">&quot;Reports: Postgres + JSONB&quot;</span> --kind
                  decision
                </p>
                <p>
                  <span className="t-dim">→</span> entity 0xb2a7…4ce0 ·{" "}
                  <span className="t-warn">expires in 90 d</span>
                </p>
              </div>
            </div>
            <table className="kind-table">
              <thead>
                <tr>
                  <th>Kind</th>
                  <th>Covers</th>
                  <th className="ta-r">Expiry</th>
                </tr>
              </thead>
              <tbody>
                {KINDS.map((row) => (
                  <tr key={row.kind}>
                    <td>
                      <span className={`tag kind-${row.kind}`}>{row.kind}</span>
                    </td>
                    <td>{row.covers}</td>
                    <td className="mono ta-r">{row.days}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>

          <article className="fcard card span-5" data-reveal>
            <div className="fcard-head">
              <span className="fcard-tag mono">F2 · pull</span>
              <Icon name="i-branch" className="ic fcard-ic" />
            </div>
            <h3 className="fcard-title display-sm">Teammates pull it verified.</h3>
            <p className="fcard-body">
              Pull renders a branch&apos;s history as markdown, oldest first — invalid entries are
              counted and skipped, never handed on.
            </p>
            <div className="term term-tight">
              <div className="term-body term-light">
                <p>
                  <span className="t-prompt">$</span> cogit pull adarsh
                </p>
                <p>
                  <span className="t-ok">3 commits · 3 verified · 0 invalid</span> →
                  .cogit/context/adarsh.md
                </p>
              </div>
            </div>
            <p className="fcard-note">
              Agents do the same over MCP: <span className="mono">context_pull(branch)</span>{" "}
              before starting work.
            </p>
          </article>

          <article className="fcard card span-5" data-reveal>
            <div className="fcard-head">
              <span className="fcard-tag mono">F3 · view</span>
              <Icon name="i-node" className="ic fcard-ic" />
            </div>
            <h3 className="fcard-title display-sm">The whole history, one page.</h3>
            <p className="fcard-body">
              Rail of branches, graph in time order, commit list, and a proof panel per commit.
              The group key never leaves the tab.
            </p>
            <svg className="mini-graph" viewBox="0 0 240 120" aria-hidden="true">
              <line x1="36" y1="12" x2="36" y2="108" className="g-lane" stroke="#57564F" />
              <line x1="96" y1="34" x2="96" y2="86" className="g-lane" stroke="#1F6C9F" />
              <line x1="156" y1="24" x2="156" y2="66" className="g-lane" stroke="#9F2F2D" />
              <path
                d="M 36 92 C 36 74, 96 68, 96 52"
                className="g-fork"
                stroke="#1F6C9F"
                fill="none"
              />
              <path
                d="M 36 72 C 36 56, 156 52, 156 40"
                className="g-fork"
                stroke="#9F2F2D"
                fill="none"
              />
              <circle cx="36" cy="96" r="6" className="g-node n-note" stroke="#57564F" />
              <path
                d="M 36 68 L 43 75 L 36 82 L 29 75 Z"
                className="g-node n-decision"
                stroke="#57564F"
              />
              <circle cx="36" cy="20" r="6" className="g-node n-milestone" stroke="#57564F" />
              <circle cx="96" cy="44" r="6" className="g-node n-note" stroke="#1F6C9F" />
              <circle cx="96" cy="80" r="6" className="g-node n-note" stroke="#1F6C9F" />
              <path
                d="M 156 32 L 163 39 L 156 46 L 149 39 Z"
                className="g-node n-decision"
                stroke="#9F2F2D"
              />
              <rect
                x="210.5"
                y="54.5"
                width="11"
                height="11"
                rx="2.5"
                className="g-node n-scratch"
                stroke="#956400"
              />
              <line x1="156" y1="60" x2="204" y2="60" className="g-fork" stroke="#956400" />
            </svg>
            <p className="fcard-note">
              Re-verifies every envelope client-side each refresh cycle.
            </p>
          </article>

          <article className="fcard card span-7" data-reveal>
            <div className="fcard-head">
              <span className="fcard-tag mono">Why Arkiv</span>
              <Icon name="i-shield" className="ic fcard-ic" />
            </div>
            <h3 className="fcard-title display-sm">
              A ledger, not a database you have to trust.
            </h3>
            <ul className="why-list">
              {WHY.map((item) => (
                <li key={item.key}>
                  <span className="why-key mono">{item.key}</span>
                  <span>{item.body}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
