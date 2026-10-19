import Icon from "./Icon";

export default function Nav() {
  return (
    <header className="nav" id="top">
      <div className="wrap nav-in">
        <a className="brand" href="#top">
          <Icon name="i-mark" className="ic brand-mark" />
          <span className="brand-word">cogit</span>
          <span className="brand-sub">on arkiv</span>
        </a>
        <nav className="nav-links" aria-label="Sections">
          <a href="#privacy">Privacy</a>
          <a href="#viewer">Viewer</a>
          <a href="#pipeline">Pipeline</a>
          <a href="#features">Features</a>
          <a href="#agents">Agents</a>
          <a href="#cli">CLI</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div className="nav-actions">
          <span className="net-chip" title="Arkiv testnet">
            <span className="pulse-dot" />
            tiramisu
            <span className="net-chip-id">7738577</span>
          </span>
          <a className="btn btn-ink btn-sm" href="#viewer">
            Open viewer
          </a>
        </div>
      </div>
    </header>
  );
}
