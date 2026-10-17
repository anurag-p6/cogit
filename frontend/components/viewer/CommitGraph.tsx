"use client";

import { useState } from "react";
import type { GraphModel } from "@/lib/graph";
import { timeAgo } from "@/lib/format";
import type { CommitEntry } from "@/lib/types";

interface Tip {
  x: number;
  y: number;
  text: string;
}

interface Props {
  graph: GraphModel;
  commits: CommitEntry[];
  selectedId: string | null;
  dimCommits: Set<string>;
  dimBranches: Set<string>;
  nowSeconds: number;
  onSelect: (id: string) => void;
}

function NodeShape({
  kind,
  x,
  y,
  className,
  stroke,
  data,
  title,
}: {
  kind: string;
  x: number;
  y: number;
  className: string;
  stroke: string;
  data: string;
  title: string;
}) {
  if (kind === "note") {
    return (
      <circle cx={x} cy={y} r={6.5} className={className} stroke={stroke} data-commit={data}>
        <title>{title}</title>
      </circle>
    );
  }
  if (kind === "scratch") {
    return (
      <rect
        x={x - 5.5}
        y={y - 5.5}
        width={11}
        height={11}
        rx={2.5}
        className={className}
        stroke={stroke}
        data-commit={data}
      >
        <title>{title}</title>
      </rect>
    );
  }
  if (kind === "decision") {
    return (
      <path
        d={`M ${x} ${y - 8} L ${x + 8} ${y} L ${x} ${y + 8} L ${x - 8} ${y} Z`}
        className={className}
        stroke={stroke}
        data-commit={data}
      >
        <title>{title}</title>
      </path>
    );
  }
  return (
    <g className={className} data-commit={data}>
      <title>{title}</title>
      <circle cx={x} cy={y} r={6.5} stroke={stroke} />
      <circle cx={x} cy={y} r={10.5} className="g-ring" fill="none" stroke={stroke} />
    </g>
  );
}

export default function CommitGraph({
  graph,
  commits,
  selectedId,
  dimCommits,
  dimBranches,
  nowSeconds,
  onSelect,
}: Props) {
  const [tip, setTip] = useState<Tip | null>(null);
  const byId = new Map(commits.map((c) => [c.envelope.commitHash, c]));

  const dimLane = (branch: string): boolean => dimBranches.has(branch);

  return (
    <div className="graph">
      <svg
        viewBox={`0 0 ${graph.width} ${graph.height}`}
        role="img"
        aria-label="Commit graph across branches"
        preserveAspectRatio="xMidYMin meet"
        className="graph-svg"
      >
        {graph.ticks.map((tick) => (
          <g key={`t${tick.y}${tick.label}`}>
            <line x1={52} y1={tick.y} x2={588} y2={tick.y} className="g-tick" />
            <text x={10} y={tick.y + 3} className="g-tick-label">
              {tick.label}
            </text>
          </g>
        ))}

        {graph.lanes.map((lane) => (
          <line
            key={`l${lane.branch}`}
            x1={lane.x}
            y1={lane.y1}
            x2={lane.x}
            y2={lane.y2}
            className={`g-lane${dimLane(lane.branch) ? " is-dim" : ""}`}
            stroke={lane.color}
            data-branch={lane.branch}
          />
        ))}

        {graph.forks.map((fork, index) => (
          <path key={`f${index}`} d={fork.d} className="g-fork" stroke={fork.color} fill="none" />
        ))}

        {graph.nodes.map((node) => {
          const commit = byId.get(node.id);
          const dim = dimCommits.has(node.id);
          const sel = node.id === selectedId;
          const stroke = node.invalid ? "#B4483F" : node.color;
          const className = `g-node n-${node.kind}${node.invalid ? " n-invalid" : ""}${
            dim ? " is-dim" : ""
          }${sel ? " is-sel" : ""}`;
          const title =
            commit?.body?.summary ??
            (node.invalid
              ? "Body sealed — verification failed"
              : "Body sealed — group key required");
          return (
            <g key={node.id}>
              {sel ? (
                <circle className="g-halo" cx={node.x} cy={node.y} r={node.kind === "milestone" ? 15 : 13} />
              ) : null}
              <g
                onClick={() => onSelect(node.id)}
                onMouseEnter={(event) => {
                  setTip({
                    x: event.clientX,
                    y: event.clientY,
                    text: `${node.kind} · ${timeAgo(node.ts, nowSeconds)} — ${title}`,
                  });
                }}
                onMouseMove={(event) => {
                  setTip((current) =>
                    current === null
                      ? null
                      : { ...current, x: event.clientX, y: event.clientY },
                  );
                }}
                onMouseLeave={() => setTip(null)}
              >
                <NodeShape
                  kind={node.kind}
                  x={node.x}
                  y={node.y}
                  className={className}
                  stroke={stroke}
                  data={node.id}
                  title={title}
                />
              </g>
            </g>
          );
        })}

        {graph.head !== null ? (
          <text x={graph.head.x} y={graph.head.y} className="g-head-label">
            HEAD · {graph.head.branch}
          </text>
        ) : null}
      </svg>
      {tip !== null ? (
        <div className="g-tooltip" style={{ left: tip.x, top: tip.y }}>
          {tip.text}
        </div>
      ) : null}
    </div>
  );
}
