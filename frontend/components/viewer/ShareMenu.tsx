"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "../Icon";
import { buildViewerSearch, type ViewerSearchState } from "@/lib/viewerUrl";

interface Props {
  state: ViewerSearchState;
  invite: string | null;
}

function shareUrl(state: ViewerSearchState, invite: string | null): string {
  const search = buildViewerSearch(state);
  const base = `${window.location.origin}/viewer${search === "" ? "" : `?${search}`}`;
  return invite === null ? base : `${base}#invite=${encodeURIComponent(invite)}`;
}

export default function ShareMenu({ state, invite }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<"link" | "key" | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onPointer = (event: PointerEvent) => {
      if (rootRef.current !== null && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    return () => {
      if (timer.current !== null) {
        window.clearTimeout(timer.current);
      }
    };
  }, []);

  const copy = async (withKey: boolean) => {
    try {
      await navigator.clipboard.writeText(shareUrl(state, withKey ? invite : null));
      setCopied(withKey ? "key" : "link");
      if (timer.current !== null) {
        window.clearTimeout(timer.current);
      }
      timer.current = window.setTimeout(() => setCopied(null), 1600);
      setOpen(false);
    } catch {
      setCopied(null);
    }
  };

  return (
    <div className="share" ref={rootRef}>
      <button
        className="btn btn-ghost btn-sm share-btn"
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((current) => !current)}
      >
        <Icon name="i-link" />
        {copied === null ? "Share" : "Copied"}
      </button>
      {open ? (
        <div className="share-pop" role="dialog" aria-label="Share viewer link">
          <button className="share-opt" type="button" onClick={() => void copy(false)}>
            <span className="share-opt-title">Copy link</span>
            <span className="share-opt-sub">Bodies stay sealed without the group key.</span>
          </button>
          <button
            className="share-opt"
            type="button"
            disabled={invite === null}
            onClick={() => void copy(true)}
          >
            <span className="share-opt-title">Copy link and key</span>
            <span className="share-opt-sub">
              {invite === null
                ? "Add an invite to share a decrypting link."
                : "Anyone with this link can decrypt this repo. The key stays in the URL fragment."}
            </span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
