"use client";

import { shortAddress, shortHex } from "@/lib/format";
import type { BranchEntry, RepoMeta } from "@/lib/types";

interface Props {
  branches: BranchEntry[];
  colors: Map<string, string>;
  counts: Map<string, number>;
  total: number;
  filter: string;
  onFilter: (branch: string) => void;
  repo: RepoMeta | null;
  labels: Record<string, string>;
  currentBlock: number;
  blockDuration: number;
  createdLabel: string;
}

export default function BranchRail({
  branches,
  colors,
  counts,
  total,
  filter,
  onFilter,
  repo,
  labels,
  currentBlock,
  blockDuration,
  createdLabel,
}: Props) {
  const expiry =
    repo === null
      ? null
      : Math.max(0, Math.round((repo.expiresAtBlock - currentBlock) * blockDuration));
  const expiryLabel =
    expiry === null
      ? "n/a"
      : expiry > 86400
        ? `in ${Math.round(expiry / 86400)} d`
        : `in ${Math.round(expiry / 3600)} h`;

  return (
    <aside className="rail">
      <p className="rail-label">
        Branches <span className="rail-count">{branches.length}</span>
      </p>
      <div className="rail-list">
        <button
          className={`rail-row${filter === "all" ? " is-on" : ""}`}
          type="button"
          onClick={() => onFilter("all")}
        >
          <span className="rail-dot rail-dot-all" />
          <span className="rail-main">
            <span className="rail-name">All branches</span>
            <span className="rail-meta">{total} commits</span>
          </span>
        </button>
        {branches.map((branch) => {
          const color = colors.get(branch.name) ?? "#57564F";
          const count = counts.get(branch.name) ?? 0;
          const ownerLabel = labels[branch.owner.toLowerCase()] ?? shortAddress(branch.owner);
          return (
            <button
              key={branch.key}
              className={`rail-row${filter === branch.name ? " is-on" : ""}`}
              type="button"
              onClick={() => onFilter(branch.name)}
            >
              <span className="rail-dot" style={{ "--c": color } as React.CSSProperties} />
              <span className="rail-main">
                <span className="rail-name">{branch.name}</span>
                <span className="rail-meta">
                  {count} commit{count === 1 ? "" : "s"} ·{" "}
                  {branch.head === "" ? "no head" : `head ${shortHex(branch.head)}`}
                </span>
              </span>
              <span className="rail-owner mono">{ownerLabel}</span>
            </button>
          );
        })}
      </div>

      <div className="rail-rule" />
      <p className="rail-label">Repo</p>
      <dl className="kv">
        <div className="kv-row">
          <dt>Owner</dt>
          <dd className="mono">
            {repo === null
              ? "n/a"
              : `${labels[repo.owner.toLowerCase()] ?? shortAddress(repo.owner)} · ${shortAddress(repo.owner)}`}
          </dd>
        </div>
        <div className="kv-row">
          <dt>Created</dt>
          <dd className="mono">{createdLabel}</dd>
        </div>
        <div className="kv-row">
          <dt>Expires</dt>
          <dd className="mono">{expiryLabel}</dd>
        </div>
        <div className="kv-row">
          <dt>Entity</dt>
          <dd className="mono">{repo === null ? "n/a" : shortHex(repo.entityKey, 6, 4)}</dd>
        </div>
      </dl>
      <p className="rail-note">
        Branch heads are single-writer: only the owner&apos;s wallet can advance them.
      </p>
    </aside>
  );
}
