"use client";

import { useRef, useState } from "react";

export default function CopyButton({
  text,
  label,
  className,
}: {
  text: string;
  label: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (timer.current !== null) {
        window.clearTimeout(timer.current);
      }
      timer.current = window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      className={`copy-btn${copied ? " copied" : ""}${className ? ` ${className}` : ""}`}
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : label}
    >
      <svg className="ic" aria-hidden="true">
        <use href={copied ? "#i-check" : "#i-copy"} />
      </svg>
    </button>
  );
}
