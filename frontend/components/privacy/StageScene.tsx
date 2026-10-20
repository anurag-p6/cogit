import type { CSSProperties } from "react";

import Icon from "../Icon";
import { formatBlock } from "@/lib/format";
import { useCipherText } from "@/lib/scramble";

export type PrivacyMode = "on" | "off";
export type PrivacyPhase = "idle" | "write" | "cross" | "pull" | "count" | "expired" | "read";

const AGENTS = ["claude-code", "cursor", "opencode"];
const SUMMARY = "Postgres + JSONB for the reports table";
const SHARDS = 14;

interface StageSceneProps {
  privacy: PrivacyMode;
  phase: PrivacyPhase;
  daysLeft: number;
}

export default function StageScene({ privacy, phase, daysLeft }: StageSceneProps) {
  const sealed =
    privacy === "on" &&
    (phase === "cross" || phase === "pull" || phase === "count" || phase === "expired");
  const body = useCipherText(SUMMARY, sealed);
  const pulled = privacy === "on" && (phase === "pull" || phase === "count" || phase === "expired");
  const readOff = privacy === "off" && (phase === "cross" || phase === "read");
  const expired = phase === "expired";
  const blocks = formatBlock(Math.max(0, daysLeft) * 43200);

  return (
    <div className="pstage-scene">
      <div className="pzone pzone-team">
        <p className="pzone-label mono">your side · key holders</p>
        <div className="pnode">
          <span className="avatar av-anu mono">AN</span>
          <span className="pnode-copy">
            <span className="pnode-name">you · anurag</span>
            <span className="pnode-sub mono">wallet 0x7099…79C8</span>
          </span>
        </div>
        <div className="pkey">
          <Icon name="i-key" className="ic ic-inline" />
          <span className="mono">a7d3f9… · group key</span>
        </div>
      </div>

      <div className="pboundary" aria-hidden="true">
        <span className="pboundary-line" />
        <span className="pboundary-label mono">
          {privacy === "on" ? "the key never crosses this line" : "no boundary here"}
        </span>
      </div>

      <div className="pzone pzone-agents">
        <p className="pzone-label mono">
          {privacy === "on" ? "agent side · ciphertext only" : "agent side · full plaintext"}
        </p>
        <div className="pagent-chips">
          {AGENTS.map((agent) => (
            <span className="pagent" key={agent}>
              <span className="pulse-dot" />
              <span className="mono">{agent}</span>
            </span>
          ))}
        </div>
        <div className="pagent-status" aria-hidden="true">
          {pulled ? (
            <p className="pagent-ok mono">
              <Icon name="i-check" className="ic ic-check" />
              3 agents pulled · every signature verified
            </p>
          ) : readOff ? (
            <div className="pread">
              <p className="pread-line">wallet-signature auth · session TTLs · API keys</p>
              <p className="pread-forever mono">∞ readable by any tool on any machine, forever</p>
            </div>
          ) : (
            <p className="pagent-idle mono">context_pull {'{ "branch": "anurag" }'}</p>
          )}
        </div>
      </div>

      <div className="pnote">
        <div className="pnote-head">
          <span className="tag kind-decision">decision</span>
          <span className="pnote-who mono">anurag · main</span>
        </div>
        <p className={sealed ? "pnote-body is-cipher" : "pnote-body"}>{body}</p>
        <div className="pnote-meta mono">
          {expired ? (
            <span className="pnote-gone">expired · dropped by the network</span>
          ) : privacy === "on" ? (
            <>
              <Icon name="i-clock" className="ic ic-inline" />
              <span>
                in {daysLeft} d · {blocks} blocks
              </span>
              <svg className="pring" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="pring-track" cx="12" cy="12" r="9" />
                <circle className="pring-fill" cx="12" cy="12" r="9" />
              </svg>
            </>
          ) : (
            <span className="pnote-forever">∞ no expiry, no seal</span>
          )}
        </div>
        {expired && (
          <span className="pburst" aria-hidden="true">
            {Array.from({ length: SHARDS }, (_, index) => {
              const angle = (index / SHARDS) * Math.PI * 2;
              const radius = 26 + (index % 5) * 10;
              const style = {
                "--tx": `${Math.round(Math.cos(angle) * radius)}px`,
                "--ty": `${Math.round(Math.sin(angle) * radius) - 14}px`,
                "--d": `${index * 22}ms`,
              } as CSSProperties;
              return <i key={index} style={style} />;
            })}
          </span>
        )}
        {expired && <span className="pnote-stamp mono">expired</span>}
      </div>
    </div>
  );
}
