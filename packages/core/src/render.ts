import type { CommitBody, CommitEnvelope, LogRow } from "./types.js";

export function shortHex(hex: string, chars = 10): string {
  return hex.length <= chars + 2 ? hex : `${hex.slice(0, chars)}…`;
}

export function formatTs(ts: number): string {
  return new Date(ts * 1000).toISOString().slice(0, 16).replace("T", " ") + " UTC";
}

export function renderCommitSection(envelope: CommitEnvelope, body: CommitBody): string {
  const lines: string[] = [];
  lines.push(`## [${envelope.kind}] ${body.summary}`);
  lines.push("");
  lines.push(
    `_${formatTs(envelope.ts)} · ${envelope.agent} · ${shortHex(envelope.author, 8)} · ${shortHex(envelope.commitHash)}_`,
  );
  lines.push("");
  if (body.details.trim() !== "") {
    lines.push(body.details.trim());
    lines.push("");
  }
  if (body.tags.length > 0) {
    lines.push(`tags: ${body.tags.map((t) => `\`${t}\``).join(" ")}`);
    lines.push("");
  }
  lines.push("---");
  lines.push("");
  return lines.join("\n");
}

export function renderPullMarkdown(
  repoName: string,
  branch: string,
  sections: string[],
  invalidCount: number,
): string {
  const lines: string[] = [];
  lines.push(`# ${repoName} — ${branch} context`);
  lines.push("");
  lines.push(`_pulled ${formatTs(Math.floor(Date.now() / 1000))} · ${sections.length} verified commit(s)_`);
  if (invalidCount > 0) {
    lines.push("");
    lines.push(`> ⚠ ${invalidCount} invalid commit(s) skipped — run \`cogit log\` for reasons`);
  }
  lines.push("");
  if (sections.length === 0) {
    lines.push("_no verified commits yet_");
    lines.push("");
  }
  return lines.concat(sections).join("\n");
}

export function renderLogLine(row: LogRow): string {
  const status = row.status === "verified" ? "verified" : `INVALID:${row.reason ?? "UNKNOWN"}`;
  const summary = row.summary ?? "";
  const detail = row.status === "verified" ? "" : ` (${row.detail ?? ""})`;
  return `${status.padEnd(22)} ${shortHex(row.commitHash, 12).padEnd(14)} ${formatTs(row.ts)}  [${row.kind}] ${row.branch} ${shortHex(row.author, 8).padEnd(10)} ${summary}${detail}`.trimEnd();
}
