import type { CommitKind } from "./types.js";

export interface GraphNode {
  commitHash: string;
  parent: string | null;
  branch: string;
  kind: CommitKind;
  ts: number;
}

export interface GraphLane {
  branch: string;
  nodes: GraphNode[];
}

export interface ForkPoint {
  parent: string;
  branches: string[];
}

export interface BranchGraph {
  lanes: GraphLane[];
  forks: ForkPoint[];
}

export function buildGraph(nodes: GraphNode[]): BranchGraph {
  const byBranch = new Map<string, GraphNode[]>();
  for (const node of nodes) {
    const list = byBranch.get(node.branch) ?? [];
    list.push(node);
    byBranch.set(node.branch, list);
  }
  const lanes: GraphLane[] = [...byBranch.entries()]
    .map(([branch, list]) => ({ branch, nodes: [...list].sort((a, b) => a.ts - b.ts) }))
    .sort((a, b) => (a.nodes[0]?.ts ?? 0) - (b.nodes[0]?.ts ?? 0));

  const children = new Map<string, Set<string>>();
  for (const node of nodes) {
    if (node.parent === null) {
      continue;
    }
    const set = children.get(node.parent) ?? new Set<string>();
    set.add(node.branch);
    children.set(node.parent, set);
  }
  const forks: ForkPoint[] = [...children.entries()]
    .filter(([, branches]) => branches.size > 1)
    .map(([parent, branches]) => ({ parent, branches: [...branches].sort() }));

  return { lanes, forks };
}
