"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BranchRail from "./BranchRail";
import CommitGraph from "./CommitGraph";
import CommitList from "./CommitList";
import ConnectBar from "./ConnectBar";
import DetailPanel from "./DetailPanel";
import ShareMenu from "./ShareMenu";
import CopyButton from "../CopyButton";
import Icon from "../Icon";
import { buildDemoData, DEMO_REPO_ID, demoGroupKey } from "@/lib/demo";
import { fetchLiveData, RepoNotFoundError } from "@/lib/live";
import { bytesToBase64, parseGroupKey, parseInvite } from "@/lib/crypto";
import { buildGraph, orderBranches, branchColorMap } from "@/lib/graph";
import { absDate } from "@/lib/format";
import {
  buildViewerSearch,
  parseViewerHashInvite,
  parseViewerSearch,
  viewerHref,
  type ViewerSearchState,
} from "@/lib/viewerUrl";
import type { CommitEntry, CommitKind, ViewerData } from "@/lib/types";

function demoInvite(): string {
  const b64 = bytesToBase64(demoGroupKey()).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return `cogit1:${DEMO_REPO_ID}:${b64}`;
}

function encodeInvite(repoId: string, key: Uint8Array): string {
  const b64 = bytesToBase64(key).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return `cogit1:${repoId}:${b64}`;
}

function useNow(intervalMs: number): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(timer);
  }, [intervalMs]);
  return now;
}

const KINDS: Array<"all" | CommitKind> = ["all", "scratch", "note", "decision", "milestone"];

export interface ViewerInitialState {
  repo: string | null;
  commit: string | null;
  branch: string | null;
  kind: "all" | CommitKind;
  q: string | null;
}

const NO_INITIAL: ViewerInitialState = {
  repo: null,
  commit: null,
  branch: null,
  kind: "all",
  q: null,
};

interface Props {
  variant?: "embedded" | "page";
  initial?: ViewerInitialState;
}

export default function ViewerSection({ variant = "embedded", initial = NO_INITIAL }: Props) {
  const isPage = variant === "page";
  const initialLive = initial.repo !== null;
  const [mode, setMode] = useState<"demo" | "live">(initialLive ? "live" : "demo");
  const [repoInput, setRepoInput] = useState(initial.repo ?? DEMO_REPO_ID);
  const [keyInput, setKeyInput] = useState(() => (initialLive ? "" : demoInvite()));
  const [data, setData] = useState<ViewerData | null>(null);
  const [loadedRepo, setLoadedRepo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(initial.commit);
  const [branchFilter, setBranchFilter] = useState(initial.branch ?? "all");
  const [kindFilter, setKindFilter] = useState<"all" | CommitKind>(initial.kind);
  const [query, setQuery] = useState(initial.q ?? "");
  const [lastRefreshed, setLastRefreshed] = useState(() => Date.now());
  const [enterIds, setEnterIds] = useState<Set<string>>(new Set());
  const [fragmentReady, setFragmentReady] = useState(!isPage);

  const anchorRef = useRef(Math.floor(Date.now() / 1000));
  const knownIdsRef = useRef<Set<string>>(new Set());
  const busyRef = useRef(false);
  const modeRef = useRef(mode);
  const lastUrlRef = useRef("");
  modeRef.current = mode;
  const now = useNow(1000);

  const load = useCallback(async (silent: boolean): Promise<void> => {
    if (busyRef.current) {
      return;
    }
    busyRef.current = true;
    if (!silent) {
      setBusy(true);
      setError(null);
    }
    try {
      const currentMode = modeRef.current;
      let next: ViewerData;
      if (currentMode === "demo") {
        const invite = parseInvite(keyInput);
        const key = invite !== null ? parseGroupKey(invite.groupKeyBase64) : parseGroupKey(keyInput);
        next = await buildDemoData(anchorRef.current);
        if (key === null) {
          next = {
            ...next,
            commits: next.commits.map((commit) => ({
              ...commit,
              body: null,
              locked: commit.status === "verified",
            })),
          };
        }
        setLoadedRepo(null);
      } else {
        const invite = parseInvite(keyInput);
        const repoId = (invite !== null ? invite.repoId : repoInput).trim();
        const key = invite !== null ? parseGroupKey(invite.groupKeyBase64) : parseGroupKey(keyInput);
        if (invite !== null && invite.repoId !== repoInput) {
          setRepoInput(invite.repoId);
        }
        if (repoId === "") {
          throw new Error("enter a repo id or paste a cogit1: invite");
        }
        next = await fetchLiveData(repoId, key);
        setLoadedRepo(repoId);
      }

      const fresh = new Set<string>();
      for (const commit of next.commits) {
        if (!knownIdsRef.current.has(commit.id)) {
          fresh.add(commit.id);
        }
      }
      knownIdsRef.current = new Set(next.commits.map((c) => c.id));
      setEnterIds(fresh);
      setData(next);
      setLastRefreshed(Date.now());
      setSelectedId((current) => {
        if (current !== null && next.commits.some((c) => c.id === current)) {
          return current;
        }
        return next.commits[0]?.id ?? null;
      });
    } catch (err) {
      if (!silent) {
        setLoadedRepo(null);
        if (err instanceof RepoNotFoundError) {
          setError(
            "No repo entity with that id on tiramisu. Check the id, or paste a cogit1: invite from cogit invite.",
          );
        } else {
          setError(err instanceof Error ? err.message : "could not read from Arkiv");
        }
      }
    } finally {
      busyRef.current = false;
      if (!silent) {
        setBusy(false);
      }
    }
  }, [keyInput, repoInput]);

  useEffect(() => {
    if (!fragmentReady) {
      return;
    }
    void load(false);
  }, [load, fragmentReady]);

  useEffect(() => {
    if (!fragmentReady) {
      return;
    }
    const timer = window.setInterval(() => {
      void load(true);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [load, fragmentReady]);

  useEffect(() => {
    if (!isPage) {
      return;
    }
    const invite = parseViewerHashInvite(window.location.hash);
    if (invite !== null) {
      setKeyInput(invite);
      setMode("live");
      const parsed = parseInvite(invite);
      if (parsed !== null) {
        setRepoInput(parsed.repoId);
      }
    }
    setFragmentReady(true);
  }, [isPage]);

  useEffect(() => {
    if (!isPage) {
      return;
    }
    const onHash = () => {
      const next = parseViewerHashInvite(window.location.hash);
      if (next === null) {
        return;
      }
      setKeyInput(next);
      setMode("live");
      const parsed = parseInvite(next);
      if (parsed !== null) {
        setRepoInput(parsed.repoId);
      }
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [isPage]);

  useEffect(() => {
    if (isPage || typeof window === "undefined") {
      return;
    }
    const params = new URLSearchParams(window.location.search);
    if (!params.has("repo")) {
      return;
    }
    const next = parseViewerSearch(window.location.search);
    if (next.repo !== null) {
      window.location.replace(viewerHref(next));
    }
  }, [isPage]);

  useEffect(() => {
    if (!isPage) {
      return;
    }
    const onPop = () => {
      lastUrlRef.current = window.location.pathname + window.location.search + window.location.hash;
      const next = parseViewerSearch(window.location.search);
      if (next.repo === null) {
        setMode("demo");
        setRepoInput(DEMO_REPO_ID);
        setKeyInput(demoInvite());
      } else {
        setMode("live");
        setRepoInput(next.repo);
      }
      setBranchFilter(next.branch ?? "all");
      setKindFilter(next.kind);
      setQuery(next.q ?? "");
      setSelectedId(next.commit);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [isPage]);

  useEffect(() => {
    if (!isPage || mode !== "demo" || typeof window === "undefined") {
      return;
    }
    if (window.location.search !== "") {
      const next = window.location.pathname + window.location.hash;
      window.history.replaceState(null, "", next);
      lastUrlRef.current = next;
    }
  }, [isPage, mode]);

  useEffect(() => {
    if (!isPage || mode !== "live" || loadedRepo === null) {
      return;
    }
    if (loadedRepo !== repoInput.trim()) {
      return;
    }
    const state: ViewerSearchState = {
      repo: loadedRepo,
      commit: selectedId,
      branch: branchFilter === "all" ? null : branchFilter,
      kind: kindFilter,
      q: query.trim() === "" ? null : query.trim(),
    };
    const search = buildViewerSearch(state);
    const next = `${window.location.pathname}${search === "" ? "" : `?${search}`}${window.location.hash}`;
    if (next === lastUrlRef.current) {
      return;
    }
    const previous = lastUrlRef.current;
    lastUrlRef.current = next;
    const previousParams = new URLSearchParams(previous.split("#")[0].split("?")[1] ?? "");
    const push = previous !== "" && selectedId !== null && previousParams.get("commit") !== selectedId;
    window.history[push ? "pushState" : "replaceState"](null, "", next);
  }, [isPage, mode, loadedRepo, repoInput, selectedId, branchFilter, kindFilter, query]);

  useEffect(() => {
    if (data === null || selectedId === null) {
      return;
    }
    if (!data.commits.some((commit) => commit.id === selectedId)) {
      setSelectedId(data.commits[0]?.id ?? null);
    }
  }, [data, selectedId]);

  const invite = useMemo(() => {
    const parsed = parseInvite(keyInput);
    return parsed !== null ? parsed.repoId : null;
  }, [keyInput]);

  useEffect(() => {
    if (invite !== null && invite !== repoInput) {
      setRepoInput(invite);
    }
  }, [invite, repoInput]);

  const branchOrder = useMemo(() => {
    if (data === null) {
      return [];
    }
    const fromEntities = [...data.branches].sort((a, b) => a.createdAtBlock - b.createdAtBlock);
    const entityOrder = fromEntities.map((b) => b.name);
    const commitOrder = orderBranches(data.commits);
    const seen = new Set<string>();
    const merged: string[] = [];
    for (const name of entityOrder) {
      if (!seen.has(name)) {
        seen.add(name);
        merged.push(name);
      }
    }
    for (const name of commitOrder) {
      if (!seen.has(name)) {
        seen.add(name);
        merged.push(name);
      }
    }
    return merged;
  }, [data]);

  useEffect(() => {
    if (data === null || branchOrder.length === 0 || branchFilter === "all") {
      return;
    }
    if (!branchOrder.includes(branchFilter)) {
      setBranchFilter("all");
    }
  }, [data, branchOrder, branchFilter]);

  const colors = useMemo(() => branchColorMap(branchOrder), [branchOrder]);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    if (data !== null) {
      for (const commit of data.commits) {
        const branch = commit.envelope.branch;
        map.set(branch, (map.get(branch) ?? 0) + 1);
      }
    }
    return map;
  }, [data]);

  const matches = useCallback(
    (commit: CommitEntry): boolean => {
      if (branchFilter !== "all" && commit.envelope.branch !== branchFilter) {
        return false;
      }
      if (kindFilter !== "all" && commit.envelope.kind !== kindFilter) {
        return false;
      }
      if (query.trim() !== "") {
        const q = query.trim().toLowerCase();
        const hay = `${commit.body?.summary ?? ""} ${commit.body?.details ?? ""} ${
          commit.envelope.commitHash
        } ${commit.envelope.branch} ${commit.envelope.agent}`.toLowerCase();
        if (!hay.includes(q)) {
          return false;
        }
      }
      return true;
    },
    [branchFilter, kindFilter, query],
  );

  const filtered = useMemo(() => {
    if (data === null) {
      return [];
    }
    return data.commits.filter(matches);
  }, [data, matches]);

  const dimCommits = useMemo(() => {
    const set = new Set<string>();
    if (data !== null) {
      for (const commit of data.commits) {
        if (!matches(commit)) {
          set.add(commit.id);
        }
      }
    }
    return set;
  }, [data, matches]);

  const dimBranches = useMemo(() => {
    const active = new Set(filtered.map((c) => c.envelope.branch));
    const dim = new Set<string>();
    for (const branch of branchOrder) {
      if (!active.has(branch)) {
        dim.add(branch);
      }
    }
    return dim;
  }, [filtered, branchOrder]);

  const graph = useMemo(() => {
    if (data === null) {
      return null;
    }
    return buildGraph(data.commits, branchOrder, Math.floor(now / 1000));
  }, [data, branchOrder, now]);

  const selected = useMemo(() => {
    if (data === null || selectedId === null) {
      return null;
    }
    return data.commits.find((c) => c.id === selectedId) ?? null;
  }, [data, selectedId]);

  const repo = data?.repo ?? null;
  const timing = data?.blockTiming ?? null;
  const members = repo?.members ?? [];
  const refreshedAgo = Math.max(0, Math.floor((now - lastRefreshed) / 1000));
  const createdLabel = repo === null || timing === null ? "n/a" : absDate(timing.currentBlockTime - (timing.currentBlock - repo.createdAtBlock) * timing.blockDuration);

  const key = useMemo(() => {
    const parsed = parseInvite(keyInput);
    return parsed !== null ? parseGroupKey(parsed.groupKeyBase64) : parseGroupKey(keyInput);
  }, [keyInput]);

  const shareState = useMemo<ViewerSearchState>(
    () => ({
      repo: mode === "live" ? (repo?.id ?? loadedRepo) : null,
      commit: selectedId,
      branch: branchFilter === "all" ? null : branchFilter,
      kind: kindFilter,
      q: query.trim() === "" ? null : query.trim(),
    }),
    [mode, repo?.id, loadedRepo, selectedId, branchFilter, kindFilter, query],
  );

  const shareInvite = useMemo(() => {
    if (key === null) {
      return null;
    }
    const parsed = parseInvite(keyInput);
    if (parsed !== null) {
      return keyInput.trim();
    }
    const repoId = repo?.id ?? loadedRepo;
    return repoId === null ? null : encodeInvite(repoId, key);
  }, [key, keyInput, repo?.id, loadedRepo]);

  const fullViewHref = viewerHref({
    repo: mode === "live" ? (repo?.id ?? null) : null,
    commit: null,
    branch: null,
    kind: "all",
    q: null,
  });

  const status =
    mode === "demo"
      ? "reading a seeded demo repo · auto-refresh 5 s"
      : `reading tiramisu rpc from your browser · auto-refresh 5 s`;

  return (
    <section
      className={isPage ? "section viewer viewer-page-section" : "section viewer"}
      id={isPage ? undefined : "viewer"}
    >
      <div className="wrap">
        {!isPage ? (
          <div className="section-head" data-reveal>
            <div>
              <p className="eyebrow">02 · Viewer</p>
              <h2 className="h2">Branches, not Slack threads.</h2>
            </div>
            <p className="section-note">
              Reads Arkiv directly from this page, decrypts commit bodies in the browser, and
              re-checks every signature. The group key stays in memory for the tab&apos;s lifetime.
              It is never sent anywhere.
            </p>
          </div>
        ) : null}

        <ConnectBar
          mode={mode}
          onMode={(nextMode) => {
            setMode(nextMode);
            setError(null);
            if (nextMode === "demo") {
              setRepoInput(DEMO_REPO_ID);
              setKeyInput(demoInvite());
              setSelectedId(null);
              if (isPage && typeof window !== "undefined") {
                const next = window.location.pathname;
                window.history.replaceState(null, "", next);
                lastUrlRef.current = next;
              }
            }
          }}
          repoInput={repoInput}
          setRepoInput={setRepoInput}
          keyInput={keyInput}
          setKeyInput={setKeyInput}
          onConnect={() => {
            void load(false);
          }}
          busy={busy}
          status={status}
          error={error}
        />

        <div className="workbench card" data-reveal>
          <div className="wb-bar">
            <div className="wb-crumbs">
              <Icon name="i-branch" />
              <span className="wb-name">{repo?.name ?? "n/a"}</span>
              <span className="wb-sep">/</span>
              <span className="wb-path mono">history</span>
              <CopyButton text={repo?.id ?? repoInput} label="Copy repo id" />
              <span className="mono wb-id">{repo?.id ?? repoInput}</span>
            </div>
            <div className="wb-right">
              <div className="wb-meta">
                <div className="avatar-stack" aria-label={`${members.length} members`}>
                  {members.slice(0, 5).map((address, index) => {
                    const label = data?.labels[address.toLowerCase()];
                    const initials =
                      label !== undefined
                        ? label.slice(0, 2).toUpperCase()
                        : address.slice(2, 4).toUpperCase();
                    const cls = ["av-anu", "av-ada", "av-rit", "av-smi", "av-kus"][index % 5];
                    return (
                      <span className={`avatar ${cls}`} key={address} title={label ?? address}>
                        {initials}
                      </span>
                    );
                  })}
                </div>
                <span className="wb-meta-txt">{members.length} members</span>
                <span className="wb-dot" />
                <span className="wb-meta-txt">
                  block {timing === null ? "n/a" : timing.currentBlock.toLocaleString("en-US").replace(/,/g, " ")}
                </span>
                <span className="wb-dot" />
                <span className="wb-meta-txt">
                  <Icon name="i-refresh" className="ic ic-inline" />
                  refreshed {refreshedAgo <= 1 ? "just now" : `${refreshedAgo} s ago`}
                </span>
              </div>
              {isPage && mode === "live" && shareState.repo !== null ? (
                <ShareMenu state={shareState} invite={shareInvite} />
              ) : null}
            </div>
          </div>

          {mode === "live" && key === null ? (
            <p className="wb-sealed mono">
              <Icon name="i-lock" className="ic ic-inline" />
              bodies sealed · paste an invite to decrypt
            </p>
          ) : null}

          <div className="wb-grid">
            <BranchRail
              branches={data?.branches ?? []}
              colors={colors}
              counts={counts}
              total={data?.commits.length ?? 0}
              filter={branchFilter}
              onFilter={setBranchFilter}
              repo={repo}
              labels={data?.labels ?? {}}
              currentBlock={timing?.currentBlock ?? 0}
              blockDuration={timing?.blockDuration ?? 2}
              createdLabel={createdLabel}
            />

            <div className="center">
              <div className="center-toolbar">
                <div className="filters" role="group" aria-label="Filter by kind">
                  {KINDS.map((kind) => (
                    <button
                      key={kind}
                      className={`chip${kindFilter === kind ? " is-on" : ""}`}
                      type="button"
                      onClick={() => setKindFilter(kind)}
                    >
                      {kind === "all" ? "All" : kind}
                    </button>
                  ))}
                </div>
                <label className="search">
                  <Icon name="i-search" />
                  <input
                    type="text"
                    placeholder="Filter commits"
                    spellCheck={false}
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </label>
              </div>

              {graph !== null ? (
                <CommitGraph
                  graph={graph}
                  commits={data?.commits ?? []}
                  selectedId={selectedId}
                  dimCommits={dimCommits}
                  dimBranches={dimBranches}
                  nowSeconds={Math.floor(now / 1000)}
                  onSelect={setSelectedId}
                />
              ) : (
                <div className="graph" />
              )}

              <CommitList
                commits={filtered}
                total={data?.commits.length ?? 0}
                selectedId={selectedId}
                onSelect={setSelectedId}
                colors={colors}
                labels={data?.labels ?? {}}
                nowSeconds={Math.floor(now / 1000)}
                enterIds={enterIds}
              />
            </div>

            <DetailPanel commit={selected} repo={repo} labels={data?.labels ?? {}} timing={timing} />
          </div>
        </div>

        {!isPage ? (
          <p className="viewer-foot mono" data-reveal>
            new commit appears ≤ 5 s after the write · invalid entries render red with the reason
            and are never decrypted ·{" "}
            <a className="viewer-full-link" href={fullViewHref}>
              open full viewer
            </a>
          </p>
        ) : null}
      </div>
    </section>
  );
}
