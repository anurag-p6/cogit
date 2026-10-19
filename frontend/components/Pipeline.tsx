import Icon from "./Icon";

const STEPS = [
  {
    title: "Build",
    body: (
      <>
        The body <span className="mono">{"{summary, details, tags}"}</span> is wrapped in a
        versioned envelope with the branch, parent hash, author, kind, and timestamp.
      </>
    ),
    chip: "envelope v1 · kind decision · agent claude-code",
  },
  {
    title: "Encrypt",
    body: (
      <>
        The body is sealed with XChaCha20-Poly1305 using the repo&apos;s 32-byte group key and a
        fresh 24-byte nonce. Only key holders can read it.
      </>
    ),
    chip: "xchacha20-poly1305 · repo group key",
  },
  {
    title: "Hash",
    body: (
      <>
        sha256 over the canonical JSON of the hash fields — sorted keys, no whitespace. Change one
        byte of ciphertext and the hash moves.
      </>
    ),
    chip: "sha256(canonicalJson(payload))",
  },
  {
    title: "Sign",
    body: (
      <>
        The wallet signs the commit hash with <span className="mono">signMessage</span>. The
        signature travels inside the envelope; anyone can recover the signer.
      </>
    ),
    chip: "sig = signMessage(commitHash)",
  },
  {
    title: "Write",
    body: (
      <>
        One Arkiv entity — payload plus public attributes — with an expiry set by kind. The branch
        head is patched to the new hash in the same breath.
      </>
    ),
    chip: "entity + attrs · patch branch head",
  },
];

export default function Pipeline() {
  return (
    <section className="section pipeline" id="pipeline">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <div>
            <p className="eyebrow">03 — Pipeline</p>
            <h2 className="h2">How a commit moves.</h2>
          </div>
          <p className="section-note">
            Five steps from a one-line note to an entity any member can pull — the same code path
            runs in the CLI, the MCP server, and this page.
          </p>
        </div>

        <div className="pipe-grid">
          <ol className="pipe-steps" data-reveal>
            {STEPS.map((step, index) => (
              <li className="pipe-step" key={step.title}>
                <span className="pipe-idx mono">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="pipe-title">{step.title}</h3>
                  <p className="pipe-body">{step.body}</p>
                  <span className="pipe-chip mono">{step.chip}</span>
                </div>
              </li>
            ))}
          </ol>

          <div className="pipe-side">
            <div className="verify-card card" data-reveal>
              <p className="raillabel-ish eyebrow">Verification, in order</p>
              <ul className="verify-list">
                <li>
                  <span className="gate mono">BAD_HASH</span>
                  <span className="gate-body">recomputed hash ≠ envelope hash</span>
                </li>
                <li>
                  <span className="gate mono">BAD_SIGNATURE</span>
                  <span className="gate-body">recovered address ≠ envelope author</span>
                </li>
                <li>
                  <span className="gate mono">OWNER_MISMATCH</span>
                  <span className="gate-body">
                    entity owner ≠ author — someone else&apos;s key wrote it
                  </span>
                </li>
                <li>
                  <span className="gate mono">NOT_MEMBER</span>
                  <span className="gate-body">author not in the repo member list</span>
                </li>
              </ul>
              <div className="verify-out">
                <div className="verify-out-row ok">
                  <Icon name="i-check" /> passes all four → decrypt, show, hand to agents
                </div>
                <div className="verify-out-row bad">
                  <span className="x-mark mono">×</span> fails any → red badge, reason shown,
                  never decrypted
                </div>
              </div>
            </div>

            <div className="term" data-reveal>
              <div className="term-bar">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
                <span className="term-title">verify — 4 checks</span>
              </div>
              <div className="term-body term-light">
                <p>
                  <span className="t-ok">✓</span> hash     0x7c9e1f…a4d2{" "}
                  <span className="t-dim">matches recomputation</span>
                </p>
                <p>
                  <span className="t-ok">✓</span> signature recovers 0x225f…6af7{" "}
                  <span className="t-dim">= author</span>
                </p>
                <p>
                  <span className="t-ok">✓</span> owner     0x225f…6af7{" "}
                  <span className="t-dim">= author</span>
                </p>
                <p>
                  <span className="t-ok">✓</span> member    anurag ∈ [anurag, adarsh, ritesh,
                  smriti, kushal]
                </p>
                <p className="t-gap">
                  <span className="t-warn">×</span> revoked?  commit 0xd41b…f0c9 fails owner check{" "}
                  <span className="t-dim">— shown red, not decrypted</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
