import type { CommitKind, VerifyChecks, VerifyFailureReason } from "./types";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const BRANCH_COLORS = ["#57564F", "#1F6C9F", "#9F2F2D", "#346538", "#956400", "#6B5E8C"];

export function branchColor(index: number): string {
  return BRANCH_COLORS[index % BRANCH_COLORS.length] as string;
}

export function shortHex(value: string, lead = 8, tail = 6): string {
  if (value.length <= lead + tail + 2) {
    return value;
  }
  return `${value.slice(0, lead)}…${value.slice(-tail)}`;
}

export function shortAddress(value: string): string {
  return shortHex(value, 6, 4);
}

export function absTime(tsSeconds: number): string {
  const d = new Date(tsSeconds * 1000);
  const date = `${String(d.getUTCDate()).padStart(2, "0")} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
  const time = `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")} UTC`;
  return `${date} · ${time}`;
}

export function absDate(tsSeconds: number): string {
  const d = new Date(tsSeconds * 1000);
  return `${String(d.getUTCDate()).padStart(2, "0")} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function timeAgo(tsSeconds: number, nowSeconds: number): string {
  const delta = nowSeconds - tsSeconds;
  if (delta < 45) {
    return "just now";
  }
  return `${duration(delta)} ago`;
}

export function countdown(secondsRemaining: number): string {
  if (secondsRemaining <= 0) {
    return "expired";
  }
  return `in ${duration(secondsRemaining)}`;
}

function duration(totalSeconds: number): string {
  if (totalSeconds < 90) {
    return `${Math.max(1, Math.round(totalSeconds))} s`;
  }
  const minutes = totalSeconds / 60;
  if (minutes < 90) {
    return `${Math.round(minutes)} m`;
  }
  const hours = minutes / 60;
  if (hours < 36) {
    return `${Math.round(hours)} h`;
  }
  const days = hours / 24;
  if (days < 60) {
    return `${Math.round(days)} d`;
  }
  const months = days / 30;
  if (months < 24) {
    return `${Math.round(months)} mo`;
  }
  return `${Math.round(days / 365)} y`;
}

export function formatBlock(block: number): string {
  return Math.round(block).toLocaleString("en-US").replace(/,/g, " ");
}

export function initialsFor(label: string | undefined, address: string): string {
  if (label) {
    return label.slice(0, 2).toUpperCase();
  }
  return address.slice(2, 4).toUpperCase();
}

export function kindLabel(kind: CommitKind): string {
  return kind;
}

const REASON_LABELS: Record<VerifyFailureReason, string> = {
  BAD_HASH: "bad hash",
  BAD_SIGNATURE: "bad signature",
  OWNER_MISMATCH: "owner mismatch",
  NOT_MEMBER: "not a member",
};

export function reasonLabel(reason: VerifyFailureReason | undefined): string {
  if (reason === undefined) {
    return "unverified";
  }
  return REASON_LABELS[reason];
}

function checkMark(value: boolean | null): string {
  if (value === true) {
    return "✓";
  }
  if (value === false) {
    return "×";
  }
  return "–";
}

export function checksSummary(checks: VerifyChecks): string {
  return `hash ${checkMark(checks.hash)} · sig ${checkMark(checks.sig)} · owner ${checkMark(checks.owner)} · member ${checkMark(checks.member)}`;
}

export function initialsForLabel(label: string | undefined, address: string): string {
  return initialsFor(label, address);
}
