"use client";

import CopyButton from "../CopyButton";
import Icon from "../Icon";
import Markdown from "./Markdown";
import { absTime, checksSummary, countdown, formatBlock, reasonLabel, shortAddress, shortHex } from "@/lib/format";
import type { BlockTiming, CommitEntry, RepoMeta } from "@/lib/types";

interface Props {
  commit: CommitEntry | null;
  repo: RepoMeta | null;
  labels: Record<string, string>;
  timing: BlockTiming | null;
}

export default function DetailPanel({ commit, repo, labels, timing }: Props) {
  if (commit === null) {
    return (
      <aside className="detail">
        <div className="detail-head">
          <span className="badge badge-locked">no selection</span>
        </div>
        <h3 className="detail-title">Select a commit</h3>
        <p className="detail-time mono">
          click a node in the graph or a row in the list to inspect it
        </p>
      </aside>
    );
  }

  const envelope = commit.envelope;
  const invalid = commit.status === "invalid";
  const locked = commit.locked;
  const authorLabel = labels[envelope.author.toLowerCase()] ?? null;
  const authorDisplay = `${authorLabel !== null ? `${authorLabel} · ` : ""}${shortAddress(envelope.author)}`;
  const ownerLabel = labels[commit.owner.toLowerCase()] ?? null;
  const ownerDisplay = `${ownerLabel !== null ? `${ownerLabel} · ` : ""}${shortAddress(commit.owner)}`;

  const remainingSeconds =
    timing === null ? 0 : (commit.expiresAtBlock - timing.currentBlock) * timing.blockDuration;
  const expiresAbs =
    timing === null ? null : new Date((timing.currentBlockTime + remainingSeconds) * 1000);

  const badge = invalid ? (
    <span className="badge badge-invalid">invalid · {reasonLabel(commit.reason)}</span>
  ) : locked ? (
    <span className="badge badge-locked">
      <Icon name="i-lock" className="ic ic-check" />
      sealed
    </span>
  ) : (
    <span className="badge badge-verified">
      <Icon name="i-check" className="ic ic-check" />
      verified
    </span>
  );

  return (
    <aside className="detail">
      <div className="detail-head">
        {badge}
        <span className="detail-checks mono">{checksSummary(commit.checks)}</span>
      </div>

      <div className="detail-title-row">
        <span className={`tag kind-${envelope.kind}`}>{envelope.kind}</span>
        <span className="detail-branch mono">
          {envelope.branch}
          {authorLabel !== null ? ` · ${authorLabel}` : ""}
        </span>
      </div>

      <h3 className="detail-title">
        {commit.body !== null
          ? commit.body.summary
          : invalid
            ? "Body sealed — verification failed"
            : "Body sealed — group key required"}
      </h3>
      <p className="detail-time mono">
        {absTime(envelope.ts)}
      </p>

      <dl className="kv kv-detail">
        <div className="kv-row">
          <dt>Author</dt>
          <dd className="mono">{authorDisplay}</dd>
        </div>
        <div className="kv-row">
          <dt>Agent</dt>
          <dd className="mono">{envelope.agent}</dd>
        </div>
        {invalid ? (
          <div className="kv-row">
            <dt>Entity owner</dt>
            <dd className="mono">{ownerDisplay}</dd>
          </div>
        ) : null}
        <div className="kv-row">
          <dt>Block</dt>
          <dd className="mono">{formatBlock(commit.createdAtBlock)}</dd>
        </div>
        <div className="kv-row">
          <dt>Expires</dt>
          <dd className="mono">
            <Icon name="i-clock" className="ic ic-inline" />
            {countdown(remainingSeconds)}
            {expiresAbs !== null
              ? ` · ${expiresAbs.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  timeZone: "UTC",
                })}`
              : ""}
          </dd>
        </div>
      </dl>

      {commit.body !== null && commit.body.tags.length > 0 ? (
        <div className="detail-tags">
          {commit.body.tags.map((tag) => (
            <span className="chip chip-sm" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      {invalid ? (
        <p className="notice notice-bad">
          {reasonLabel(commit.reason)} — {commit.detail ?? "verification failed"}. The body was
          never decrypted.
        </p>
      ) : null}

      {locked && !invalid ? (
        <p className="notice">
          Every signature checks out, but the body stays sealed until a group key is provided.
          Add the invite key above to decrypt.
        </p>
      ) : null}

      <div className="proof">
        <p className="proof-label">Proof</p>
        <div className="proof-row">
          <span className="proof-key">commit hash</span>
          <span className="proof-val mono">{shortHex(envelope.commitHash, 10, 8)}</span>
          <CopyButton text={envelope.commitHash} label="Copy commit hash" />
        </div>
        <div className="proof-row">
          <span className="proof-key">parent</span>
          <span className="proof-val mono">
            {envelope.parent === null ? "— root" : shortHex(envelope.parent, 10, 8)}
          </span>
          {envelope.parent !== null ? (
            <CopyButton text={envelope.parent} label="Copy parent hash" />
          ) : null}
        </div>
        <div className="proof-row">
          <span className="proof-key">entity key</span>
          <span className="proof-val mono">{shortHex(commit.entityKey, 8, 8)}</span>
          <CopyButton text={commit.entityKey} label="Copy entity key" />
        </div>
        <div className="proof-row">
          <span className="proof-key">signature</span>
          <span className="proof-val mono">{shortHex(envelope.sig, 8, 6)}</span>
          <CopyButton text={envelope.sig} label="Copy signature" />
        </div>
      </div>

      {commit.body !== null ? (
        <div className="detail-body">
          <p className="proof-label">Details</p>
          <Markdown text={commit.body.details} />
        </div>
      ) : null}
    </aside>
  );
}
