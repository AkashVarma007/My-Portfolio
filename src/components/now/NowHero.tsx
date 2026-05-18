"use client";

import { useEffect, useState } from "react";

type Props = {
  logCount: number;
  latestPublishedAt: string | null;
};

function formatRelative(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = Math.max(0, now - then);

  const min = Math.floor(diff / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;

  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;

  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;

  const wk = Math.floor(day / 7);
  if (wk < 5) return `${wk}w ago`;

  const mo = Math.floor(day / 30);
  if (mo < 12) return `${mo}mo ago`;

  const yr = Math.floor(day / 365);
  return `${yr}y ago`;
}

function paddedCount(n: number): string {
  return String(n).padStart(3, "0");
}

export function NowHero({ logCount, latestPublishedAt }: Props) {
  const [relative, setRelative] = useState(() =>
    latestPublishedAt ? formatRelative(latestPublishedAt) : null
  );

  useEffect(() => {
    if (!latestPublishedAt) return;
    const tick = () => setRelative(formatRelative(latestPublishedAt));
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [latestPublishedAt]);

  return (
    <header className="now-hero">
      <div className="now-hero__eyebrow">
        <span>akash varma / now</span>
        {logCount > 0 && (
          <span className="now-latest">
            <span className="now-latest__dot" aria-hidden="true" />
            latest
          </span>
        )}
      </div>

      <h1 className="now-hero__lead">
        a personal channel — what i&apos;m{" "}
        <em>building, reading, learning</em>. updated when it changes,
        not when it&apos;s scheduled.
      </h1>

      <p className="now-hero__meta">
        {relative ? (
          <>
            last updated <span className="now-mono">{relative}</span>
            <span aria-hidden="true"> · </span>
          </>
        ) : null}
        <span className="now-mono">{paddedCount(logCount)} entries</span>
      </p>

      <div className="now-hero__rule" aria-hidden="true" />
    </header>
  );
}
