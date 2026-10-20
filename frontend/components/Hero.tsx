import CopyButton from "./CopyButton";
import Icon from "./Icon";

export default function Hero() {
  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div className="hero-copy" data-reveal>
          <p className="eyebrow">Encrypted team context · Arkiv Tiramisu testnet</p>
          <h1 className="display">
            Team memory for coding&nbsp;agents, kept like source&nbsp;history.
          </h1>
          <p className="lede">
            Cogit commits short, encrypted context entries to Arkiv: from the CLI or straight out
            of your agent&apos;s tool loop. Teammates pull them verified, and stale notes expire on
            their own.
          </p>
          <div className="hero-actions">
            <a className="btn btn-ink" href="#viewer">
              Open the viewer
              <Icon name="i-arrow" />
            </a>
            <a className="btn btn-ghost" href="#pipeline">
              How a commit moves
            </a>
          </div>
          <div className="cmd-chip">
            <code>
              <span className="cmd-dim">$</span> cogit pull anurag
            </code>
            <CopyButton text="cogit pull anurag" label="Copy command" />
          </div>
        </div>

        <div className="hero-term" data-reveal>
          <div className="term term-dark">
            <div className="term-bar">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
              <span className="term-title">anurag@atlas · cogit</span>
            </div>
            <div className="term-body">
              <p>
                <span className="t-prompt">$</span>{" "}
                <span className="t-cmd">
                  cogit commit -m <span className="t-str">&quot;Postgres + JSONB for the reports table&quot;</span> --kind
                  decision
                </span>
              </p>
              <p>
                <span className="t-key">build</span> envelope v1 · kind decision · agent claude-code
              </p>
              <p>
                <span className="t-key">seal</span> xchacha20-poly1305 · 24-byte nonce · 412 B
                ciphertext
              </p>
              <p>
                <span className="t-key">hash</span> 0x7c9e1f…f5b8a4d2 <span className="t-dim">sha256 · canonical json</span>
              </p>
              <p>
                <span className="t-key">sign</span> wallet 0x225f…6af7{" "}
                <span className="t-dim">signMessage(commitHash)</span>
              </p>
              <p>
                <span className="t-key">write</span> entity 0xb2a7…4ce0 ·{" "}
                <span className="t-warn">expires in 90 d</span>{" "}
                <span className="t-dim">kind decision</span>
              </p>
              <p>
                <span className="t-key">head</span> branch main → 0x7c9e…a4d2
              </p>
              <p className="t-gap">
                <span className="t-prompt">$</span> <span className="t-cmd">cogit pull ritesh</span>
              </p>
              <p>
                <span className="t-ok">4 commits · 4 verified · 0 invalid</span> →
                .cogit/context/ritesh.md
              </p>
              <p className="t-cursor-line">
                <span className="cursor" />
              </p>
            </div>
          </div>
          <p className="hero-term-note">
            Every write is wallet-signed, encrypted, and given an expiry by kind. Shown verbatim
            from a seeded <span className="mono">atlas-reports</span> run.
          </p>
        </div>
      </div>

      <div className="wrap">
        <dl className="meta-strip" data-reveal>
          <div className="meta-cell">
            <dt>Chain</dt>
            <dd>tiramisu · 7738577</dd>
          </div>
          <div className="meta-cell">
            <dt>Block time</dt>
            <dd>2 s · expiry in blocks</dd>
          </div>
          <div className="meta-cell">
            <dt>Cipher</dt>
            <dd>XChaCha20-Poly1305</dd>
          </div>
          <div className="meta-cell">
            <dt>Entity budget</dt>
            <dd>128 KiB · 30 attrs</dd>
          </div>
          <div className="meta-cell">
            <dt>Expiry by kind</dt>
            <dd>3 · 14 · 90 · 365 d</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
