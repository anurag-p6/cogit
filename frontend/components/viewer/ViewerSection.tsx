"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BranchRail from "./BranchRail";
import CommitGraph from "./CommitGraph";
import CommitList from "./CommitList";
import ConnectBar from "./ConnectBar";
import DetailPanel from "./DetailPanel";
import CopyButton from "../CopyButton";
import Icon from "../Icon";
import { buildDemoData, DEMO_REPO_ID, demoGroupKey } from "@/lib/demo";
import { fetchLiveData, RepoNotFoundError } from "@/lib/live";
import { bytesToBase64, parseGroupKey, parseInvite } from "@/lib/crypto";
import { buildGraph, orderBranches, branchColorMap } from "@/lib/graph";
import { absDate } from "@/lib/format";
import type { CommitEntry, CommitKind, ViewerData } from "@/lib/types";

function demoInvite(): string {
  const b64 = bytesToBase64(demoGroupKey()).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return `cogit1:${DEMO_REPO_ID}:${b64}`;
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

export default function ViewerSection() {
  const [mode, setMode] = useState<"demo" | "live">("demo");
  const [repoInput, setRepoInput] = useState(DEMO_REPO_ID);
  const [keyInput, setKeyInput] = useState(() => demoInvite());
  const [data, setData] = useState<ViewerData | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [branchFilter, setBranchFilter] = useState("all");
  const [kindFilter, setKindFilter] = useState<"all" | CommitKind>("all");
  const [query, setQuery] = useState("");
  const [lastRefreshed, setLastRefreshed] = useState(() => Date.now());
  const [enterIds, setEnterIds] = useState<Set<string>>(new Set());

  const anchorRef = useRef(Math.floor(Date.now() / 1000));
  const knownIdsRef = useRef<Set<string>>(new Set());
  const busyRef = useRef(false);
  const modeRef = useRef(mode);
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
        if (typeof window !== "undefined" && window.location.search !== `?repo=${repoId}`) {
          window.history.replaceState(null, "", `?repo=${encodeURIComponent(repoId)}#viewer`);
        }
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
    void load(false);
  }, [load]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      void load(true);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [load]);

  const invite = useMemo(() => {
    const parsed = parseInvite(keyInput);
    return parsed !== null ? parsed.repoId : null;
  }, [keyInput]);

  useEffect(() => {
    if (invite !== null && invite !== repoInput) {
      setRepoInput(invite);
    }
  }, [invite, repoInput]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const repo = new URLSearchParams(window.location.search).get("repo");
    if (repo !== null && repo !== "") {
      setRepoInput(repo);
    }
  }, []);

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
  const createdLabel = repo === null || timing === null ? "—" : absDate(timing.currentBlockTime - (timing.currentBlock - repo.createdAtBlock) * timing.blockDuration);

  const status =
    mode === "demo"
      ? "reading a seeded demo repo · auto-refresh 5 s"
      : `reading tiramisu rpc from your browser · auto-refresh 5 s`;

  return (
    <section className="section viewer" id="viewer">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <div>
            <p className="eyebrow">01 — Viewer</p>
            <h2 className="h2">Branches, not Slack threads.</h2>
          </div>
          <p className="section-note">
            Reads Arkiv directly from this page, decrypts commit bodies in the browser, and
            re-checks every signature. The group key stays in memory for the tab&apos;s lifetime —
            it is never sent anywhere.
          </p>
        </div>

        <ConnectBar
          mode={mode}
          onMode={(nextMode) => {
            setMode(nextMode);
            setError(null);
            if (nextMode === "demo") {
              setRepoInput(DEMO_REPO_ID);
              setKeyInput(demoInvite());
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
              <span className="wb-name">{repo?.name ?? "—"}</span>
              <span className="wb-sep">/</span>
              <span className="wb-path mono">history</span>
              <CopyButton text={repo?.id ?? repoInput} label="Copy repo id" />
              <span className="mono wb-id">{repo?.id ?? repoInput}</span>
            </div>
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
                block {timing === null ? "—" : timing.currentBlock.toLocaleString("en-US").replace(/,/g, " ")}
              </span>
              <span className="wb-dot" />
              <span className="wb-meta-txt">
                <Icon name="i-refresh" className="ic ic-inline" />
                refreshed {refreshedAgo <= 1 ? "just now" : `${refreshedAgo} s ago`}
              </span>
            </div>
          </div>

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

        <p className="viewer-foot mono" data-reveal>
          new commit appears ≤ 5 s after the write · invalid entries render red with the reason
          and are never decrypted
        </p>
      </div>
    </section>
  );
}
