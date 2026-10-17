import { branchColor } from "./format";
import type { CommitEntry, CommitKind } from "./types";

export interface GraphLane {
  branch: string;
  x: number;
  y1: number;
  y2: number;
  color: string;
}

export interface GraphFork {
  d: string;
  color: string;
}

export interface GraphTick {
  y: number;
  label: string;
}

export interface GraphNode {
  id: string;
  branch: string;
  kind: CommitKind;
  invalid: boolean;
  summary: string;
  ts: number;
  x: number;
  y: number;
  row: number;
  color: string;
}

export interface GraphHead {
  x: number;
  y: number;
  branch: string;
}

export interface GraphModel {
  width: number;
  height: number;
  lanes: GraphLane[];
  forks: GraphFork[];
  ticks: GraphTick[];
  nodes: GraphNode[];
  head: GraphHead | null;
}

const ROW_H = 44;
const TOP = 40;
const LANE_X0 = 80;
const LANE_DX = 88;
const WIDTH = 600;
const DAY_SECONDS = 86400;

const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

export function orderBranches(commits: CommitEntry[]): string[] {
  const oldest = new Map<string, number>();
  for (const commit of commits) {
    const ts = commit.envelope.ts;
    const current = oldest.get(commit.envelope.branch);
    if (current === undefined || ts < current) {
      oldest.set(commit.envelope.branch, ts);
    }
  }
  return [...oldest.entries()].sort((a, b) => a[1] - b[1]).map(([branch]) => branch);
}

export function branchColorMap(branches: string[]): Map<string, string> {
  const map = new Map<string, string>();
  branches.forEach((branch, index) => {
    map.set(branch, branchColor(index));
  });
  return map;
}

export function buildGraph(
  commits: CommitEntry[],
  branchOrder: string[],
  nowSeconds: number,
): GraphModel {
  const colors = branchColorMap(branchOrder);
  const sorted = [...commits].sort((a, b) => b.envelope.ts - a.envelope.ts);
  const rows = new Map<string, number>();
  sorted.forEach((commit, row) => {
    rows.set(commit.envelope.commitHash, row);
  });

  const height = TOP + sorted.length * ROW_H + 8;
  const yOf = (hash: string): number => TOP + (rows.get(hash) ?? 0) * ROW_H + 18;

  if (sorted.length === 0) {
    return { width: WIDTH, height: TOP + 8, lanes: [], forks: [], ticks: [], nodes: [], head: null };
  }

  const laneX = new Map(branchOrder.map((branch, index) => [branch, LANE_X0 + index * LANE_DX]));

  const lanes: GraphLane[] = [];
  for (const branch of branchOrder) {
    const laneNodes = sorted.filter((c) => c.envelope.branch === branch);
    if (laneNodes.length === 0) {
      continue;
    }
    const first = laneNodes[0] as CommitEntry;
    const last = laneNodes[laneNodes.length - 1] as CommitEntry;
    lanes.push({
      branch,
      x: laneX.get(branch) ?? LANE_X0,
      y1: yOf(first.envelope.commitHash) - 22,
      y2: yOf(last.envelope.commitHash) + 22,
      color: colors.get(branch) ?? "#57564F",
    });
  }

  const byHash = new Map(sorted.map((c) => [c.envelope.commitHash, c]));
  const forks: GraphFork[] = [];
  for (const commit of sorted) {
    const parentHash = commit.envelope.parent;
    if (parentHash === null) {
      continue;
    }
    const parent = byHash.get(parentHash);
    if (parent === undefined || parent.envelope.branch === commit.envelope.branch) {
      continue;
    }
    const x1 = laneX.get(parent.envelope.branch) ?? LANE_X0;
    const y1 = yOf(parentHash);
    const x2 = laneX.get(commit.envelope.branch) ?? LANE_X0;
    const y2 = yOf(commit.envelope.commitHash);
    const c = (y1 - y2) * 0.45;
    forks.push({
      d: `M ${x1} ${y1} C ${x1} ${(y1 - c).toFixed(1)}, ${x2} ${(y2 + c).toFixed(1)}, ${x2} ${y2}`,
      color: colors.get(commit.envelope.branch) ?? "#57564F",
    });
  }

  const minTs = Math.min(...sorted.map((c) => c.envelope.ts));
  const maxTs = Math.max(nowSeconds, ...sorted.map((c) => c.envelope.ts));
  const spanDays = Math.max((maxTs - minTs) / DAY_SECONDS, 0.5);

  const ticks: GraphTick[] = [];
  const firstDay = new Date(minTs * 1000);
  let cursor =
    Date.UTC(firstDay.getUTCFullYear(), firstDay.getUTCMonth(), firstDay.getUTCDate()) / 1000 +
    DAY_SECONDS;
  while (cursor <= maxTs + DAY_SECONDS) {
    const y = TOP + (((maxTs - cursor) / DAY_SECONDS) * (height - TOP - 24)) / spanDays + 2;
    if (y > TOP - 6 && y < height - 10) {
      const d = new Date(cursor * 1000);
      const label = `${String(d.getUTCDate()).padStart(2, "0")} ${MONTHS[d.getUTCMonth()]}`;
      ticks.push({ y: Number(y.toFixed(1)), label });
    }
    cursor += DAY_SECONDS;
  }

  const nodes: GraphNode[] = sorted.map((commit, row) => ({
    id: commit.envelope.commitHash,
    branch: commit.envelope.branch,
    kind: commit.envelope.kind,
    invalid: commit.status === "invalid",
    summary: commit.body?.summary ?? `${commit.envelope.kind} commit`,
    ts: commit.envelope.ts,
    x: laneX.get(commit.envelope.branch) ?? LANE_X0,
    y: yOf(commit.envelope.commitHash),
    row,
    color: colors.get(commit.envelope.branch) ?? "#57564F",
  }));

  const headCommit = sorted[0] as CommitEntry;
  const head: GraphHead = {
    x: (laneX.get(headCommit.envelope.branch) ?? LANE_X0) + 16,
    y: yOf(headCommit.envelope.commitHash) + 3,
    branch: headCommit.envelope.branch,
  };

  return { width: WIDTH, height, lanes, forks, ticks, nodes, head };
}
