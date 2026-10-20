import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import ViewerSection from "@/components/viewer/ViewerSection";
import { parseViewerParams } from "@/lib/viewerUrl";

export const metadata: Metadata = {
  title: "Viewer · Cogit",
  description:
    "Read a cogit repo straight from Arkiv: branch graph, verified commits, sealed bodies, five second refresh.",
};

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ViewerPage({ searchParams }: Props) {
  const raw = await searchParams;
  const params = new URLSearchParams();
  for (const key of ["repo", "commit", "branch", "kind", "q"]) {
    const value = raw[key];
    if (typeof value === "string") {
      params.set(key, value);
    }
  }
  const initial = parseViewerParams(params);

  return (
    <div className="viewer-page">
      <header className="nav">
        <div className="wrap nav-in">
          <Link className="brand" href="/">
            <Icon name="i-mark" className="ic brand-mark" />
            <span className="brand-word">cogit</span>
            <span className="brand-sub">viewer</span>
          </Link>
          <div className="nav-actions">
            <span className="net-chip" title="Arkiv testnet">
              <span className="pulse-dot" />
              tiramisu
              <span className="net-chip-id">7738577</span>
            </span>
            <Link className="btn btn-ghost btn-sm" href="/">
              Back to site
            </Link>
          </div>
        </div>
      </header>
      <main>
        <ViewerSection variant="page" initial={initial} />
      </main>
    </div>
  );
}
