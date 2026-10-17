"use client";

import Icon from "../Icon";
import { reasonLabel, shortAddress, timeAgo } from "@/lib/format";
import type { CommitEntry } from "@/lib/types";

interface Props {
  commits: CommitEntry[];
  total: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
  colors: Map<string, string>;
  labels: Record<string, string>;
  nowSeconds: number;
  enterIds: Set<string>;
}

export default function CommitList({
  commits,
  total,
  selectedId,
  onSelect,
  colors,
  labels,
  nowSeconds,
  enterIds,
}: Props) {
  return (
    <div className="list">
      <div className="list-head">
        <span className="list-title mono">Commits</span>
        <span className="list-count mono">
          {commits.length}
          {commits.length === total ? "" : ` / ${total}`} · newest first
        </span>
      </div>

      {commits.map((commit) => {
        const branch = commit.envelope.branch;
        const color = colors.get(branch) ?? "#57564F";
        const authorLabel = labels[commit.envelope.author.toLowerCase()] ?? null;
        const invalid = commit.status === "invalid";
        const locked = commit.locked;
        const summary = commit.body?.summary ?? null;
        const badge = invalid ? (
          <span className="badge badge-invalid">invalid · {reasonLabel(commit.reason)}</span>
        ) : locked ? (
          <span className="badge badge-locked">sealed</span>
        ) : (
          <span className="badge badge-verified">
            <Icon name="i-check" className="ic ic-check" />
            verified
          </span>
        );
        return (
          <button
            key={commit.id}
            className={`crow${invalid ? " is-invalid" : ""}${locked ? " is-locked" : ""}${
              selectedId === commit.id ? " is-on" : ""
            }${enterIds.has(commit.id) ? " enter" : ""}`}
            type="button"
            onClick={() => onSelect(commit.id)}
          >
            <span className="crow-gutter" style={{ "--c": color } as React.CSSProperties}>
              <span className="crow-dot" />
            </span>
            <span className="crow-main">
              <span className="crow-line1">
                <span className={`tag kind-${commit.envelope.kind}`}>{commit.envelope.kind}</span>
                <span className="crow-branch mono">{branch}</span>
                <span className="crow-spacer" />
                <span className="crow-time mono">{timeAgo(commit.envelope.ts, nowSeconds)}</span>
              </span>
              <span className="crow-summary">
                {summary ??
                  (invalid
                    ? "Body sealed — verification failed"
                    : "Body sealed — group key required")}
              </span>
              <span className="crow-line3 mono">
                {authorLabel !== null ? `${authorLabel} · ` : ""}
                {shortAddress(commit.envelope.author)}
                <span className="crow-agent">via {commit.envelope.agent}</span>
              </span>
            </span>
            <span className="crow-badge">{badge}</span>
          </button>
        );
      })}
    </div>
  );
}
