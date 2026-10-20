import type { CommitKind } from "./types";

export const VIEWER_KINDS: readonly CommitKind[] = ["scratch", "note", "decision", "milestone"];

export type ViewerKindFilter = "all" | CommitKind;

export interface ViewerSearchState {
  repo: string | null;
  commit: string | null;
  branch: string | null;
  kind: ViewerKindFilter;
  q: string | null;
}

const REPO_RE = /^[0-9A-Za-z:_-]{2,160}$/;
const COMMIT_RE = /^0x[0-9a-fA-F]{64}$/;

export function parseViewerParams(params: URLSearchParams): ViewerSearchState {
  const repoRaw = (params.get("repo") ?? "").trim();
  const commitRaw = (params.get("commit") ?? "").trim();
  const branchRaw = (params.get("branch") ?? "").trim();
  const kindRaw = (params.get("kind") ?? "").trim();
  const qRaw = (params.get("q") ?? "").trim();

  return {
    repo: REPO_RE.test(repoRaw) ? repoRaw : null,
    commit: COMMIT_RE.test(commitRaw) ? commitRaw : null,
    branch: branchRaw !== "" && branchRaw.length <= 80 ? branchRaw : null,
    kind: (VIEWER_KINDS as readonly string[]).includes(kindRaw)
      ? (kindRaw as CommitKind)
      : "all",
    q: qRaw !== "" && qRaw.length <= 120 ? qRaw : null,
  };
}

export function parseViewerSearch(search: string): ViewerSearchState {
  return parseViewerParams(new URLSearchParams(search.startsWith("?") ? search.slice(1) : search));
}

export function buildViewerSearch(state: ViewerSearchState): string {
  const params = new URLSearchParams();
  if (state.repo !== null && state.repo !== "") {
    params.set("repo", state.repo);
  }
  if (state.commit !== null) {
    params.set("commit", state.commit);
  }
  if (state.branch !== null && state.branch !== "" && state.branch !== "all") {
    params.set("branch", state.branch);
  }
  if (state.kind !== "all") {
    params.set("kind", state.kind);
  }
  const query = state.q?.trim() ?? "";
  if (query !== "") {
    params.set("q", query);
  }
  return params.toString();
}

export function viewerHref(state: ViewerSearchState): string {
  const search = buildViewerSearch(state);
  return search === "" ? "/viewer" : `/viewer?${search}`;
}

export function parseViewerHashInvite(hash: string): string | null {
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  if (raw === "") {
    return null;
  }
  const params = new URLSearchParams(raw);
  const value = (params.get("invite") ?? "").trim();
  const invite = value !== "" ? value : raw.startsWith("cogit1:") ? safeDecode(raw) : "";
  if (!invite.startsWith("cogit1:") || invite.length > 512) {
    return null;
  }
  return invite;
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
