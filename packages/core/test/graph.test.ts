import { describe, expect, it } from "vitest";
import { buildGraph, type GraphNode } from "../src/graph.js";

const nodes: GraphNode[] = [
  { commitHash: "h1", parent: null, branch: "adarsh", kind: "note", ts: 10 },
  { commitHash: "h4", parent: "h3", branch: "ritesh", kind: "decision", ts: 40 },
  { commitHash: "h2", parent: "h1", branch: "adarsh", kind: "decision", ts: 20 },
  { commitHash: "h3", parent: "h1", branch: "ritesh", kind: "note", ts: 30 },
];

describe("buildGraph", () => {
  it("groups commits into lanes ordered by first commit", () => {
    const graph = buildGraph(nodes);
    expect(graph.lanes.map((l) => l.branch)).toEqual(["adarsh", "ritesh"]);
    expect(graph.lanes[0]?.nodes.map((n) => n.commitHash)).toEqual(["h1", "h2"]);
    expect(graph.lanes[1]?.nodes.map((n) => n.commitHash)).toEqual(["h3", "h4"]);
  });

  it("detects fork points shared by multiple branches", () => {
    const graph = buildGraph(nodes);
    expect(graph.forks).toEqual([{ parent: "h1", branches: ["adarsh", "ritesh"] }]);
  });

  it("has no forks for a linear history", () => {
    const linear: GraphNode[] = [
      { commitHash: "a", parent: null, branch: "adarsh", kind: "note", ts: 1 },
      { commitHash: "b", parent: "a", branch: "adarsh", kind: "note", ts: 2 },
    ];
    expect(buildGraph(linear).forks).toEqual([]);
  });
});
