const FAQ = [
  {
    q: "Who can read a commit?",
    a: (
      <>
        Anyone can <em>find</em> the entity — its attributes (repo, branch, kind, author,
        timestamp) are public on Arkiv. The body is XChaCha20-Poly1305 ciphertext; only holders of
        the repo group key can read it. Managers share the key with{" "}
        <span className="mono">cogit invite</span> / <span className="mono">cogit join</span>.
      </>
    ),
  },
  {
    q: "Can a teammate rewrite my branch?",
    a: (
      <>
        No. A branch head is a patched entity attribute, and Arkiv only accepts patches signed by
        the entity&apos;s owner. A forged commit shows up as{" "}
        <span className="mono">OWNER_MISMATCH</span> — red in the viewer, skipped by pull.
      </>
    ),
  },
  {
    q: "Why do commits expire?",
    a: (
      <>
        Agent context loses value fast. Scratch notes last 3 days, notes 14, decisions 90,
        milestones a year — expiry is set per kind at write time and enforced by the network.
        Active branches extend their head&apos;s expiry on every update.
      </>
    ),
  },
  {
    q: "Where does the group key live?",
    a: (
      <>
        On disk it sits in <span className="mono">.cogit/config.json</span> (mode 600), delivered
        once via an invite string. In this viewer it lives in memory for the lifetime of the tab
        and is never sent to a server — decryption happens in your browser.
      </>
    ),
  },
  {
    q: "What exactly does the green badge prove?",
    a: (
      <>
        Four checks, in order: the hash recomputes, the signature recovers the stated author, the
        Arkiv entity owner equals that author, and the author is in the repo&apos;s member list.
        All four pass before you or your agent ever see plaintext.
      </>
    ),
  },
  {
    q: "Is there a server in the loop?",
    a: (
      <>
        None. The CLI and the MCP server talk to the Arkiv RPC; this page reads the same RPC from
        your browser. There is no cogit backend to deploy, and no telemetry.
      </>
    ),
  },
];

export default function Faq() {
  return (
    <section className="section faq" id="faq">
      <div className="wrap wrap-narrow">
        <div className="section-head section-head-stack" data-reveal>
          <p className="eyebrow">07 — Questions</p>
          <h2 className="h2">Asked often, answered plainly.</h2>
        </div>

        <div className="faq-list" data-reveal>
          {FAQ.map((item) => (
            <details className="faq-item" key={item.q}>
              <summary>
                <span>{item.q}</span>
                <span className="fx" aria-hidden="true" />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
