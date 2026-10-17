"use client";

import type { Dispatch, SetStateAction } from "react";

interface Props {
  mode: "demo" | "live";
  onMode: (mode: "demo" | "live") => void;
  repoInput: string;
  setRepoInput: Dispatch<SetStateAction<string>>;
  keyInput: string;
  setKeyInput: Dispatch<SetStateAction<string>>;
  onConnect: () => void;
  busy: boolean;
  status: string;
  error: string | null;
}

export default function ConnectBar({
  mode,
  onMode,
  repoInput,
  setRepoInput,
  keyInput,
  setKeyInput,
  onConnect,
  busy,
  status,
  error,
}: Props) {
  return (
    <div className="connect card" data-reveal>
      <div>
        <div className="connect-fields">
          <label className="field">
            <span className="field-label">Repo id</span>
            <input
              className="input mono"
              type="text"
              value={repoInput}
              spellCheck={false}
              autoComplete="off"
              onChange={(event) => setRepoInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  onConnect();
                }
              }}
            />
          </label>
          <label className="field field-wide">
            <span className="field-label">Group key or invite</span>
            <input
              className="input mono"
              type="password"
              value={keyInput}
              spellCheck={false}
              autoComplete="off"
              onChange={(event) => setKeyInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  onConnect();
                }
              }}
            />
            <span className="field-hint">kept in memory only</span>
          </label>
          <button className="btn btn-ink connect-btn" type="button" onClick={onConnect} disabled={busy}>
            {busy ? "Reading…" : mode === "demo" ? "Rebuild" : "Connect"}
          </button>
        </div>
        {error !== null ? (
          <p className="notice notice-bad" style={{ marginTop: 14 }}>
            {error}
          </p>
        ) : null}
      </div>
      <div className="connect-side">
        <div className="seg" role="group" aria-label="Data source">
          <button
            className={`seg-opt${mode === "demo" ? " is-on" : ""}`}
            type="button"
            onClick={() => onMode("demo")}
          >
            Demo dataset
          </button>
          <button
            className={`seg-opt${mode === "live" ? " is-on" : ""}`}
            type="button"
            onClick={() => onMode("live")}
          >
            Live · Arkiv
          </button>
        </div>
        <p className="connect-status">
          <span className="pulse-dot" />
          {status}
        </p>
      </div>
    </div>
  );
}
