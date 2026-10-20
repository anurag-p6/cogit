import Icon from "./Icon";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <a className="brand" href="#top">
            <Icon name="i-mark" className="ic brand-mark" />
            <span className="brand-word">cogit</span>
          </a>
          <p className="footer-line">
            Encrypted, wallet-signed team context on Arkiv. Built for the Arkiv hackathon on the
            Tiramisu testnet.
          </p>
        </div>
        <nav className="footer-nav" aria-label="Footer">
          <a href="#privacy">Privacy</a>
          <a href="#viewer">Viewer</a>
          <a href="#pipeline">Pipeline</a>
          <a href="#features">Features</a>
          <a href="#agents">Agents</a>
          <a href="#cli">CLI</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div className="footer-meta mono">
          <p>chain 7738577 · 2 s blocks</p>
          <p>sha256 · xchacha20-poly1305</p>
          <p>expiry 3 / 14 / 90 / 365 d</p>
        </div>
      </div>
      <div className="wrap footer-base">
        <span className="mono">
          contents above render from a seeded demo repo; connect a live repo id to read the real
          chain
        </span>
      </div>
    </footer>
  );
}
