// src/components/now/BootSequence.tsx
"use client";

import { useEffect, useState, useRef } from "react";

const KEY = "akash_now_booted";

const LINES = [
  "> connecting to NOW.akash",
  "> resolving handshake...",
  "> signal stable",
  "> ACCESS GRANTED",
];

const PER_LINE_MS = 380;
const FADE_MS = 400;
const TOTAL_MS = LINES.length * PER_LINE_MS + 500;

export function BootSequence() {
  const [active, setActive] = useState<null | boolean>(null);
  const [shownLines, setShownLines] = useState(0);
  const [fading, setFading] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const booted =
      typeof window !== "undefined" && window.localStorage.getItem(KEY) === "1";
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only localStorage read after hydration
    setActive(!booted);
  }, []);

  useEffect(() => {
    if (active !== true) return;
    const ts = timers.current;
    LINES.forEach((_, i) => {
      const t = window.setTimeout(() => setShownLines(i + 1), i * PER_LINE_MS);
      ts.push(t);
    });
    const fadeT = window.setTimeout(() => setFading(true), TOTAL_MS);
    ts.push(fadeT);
    const endT = window.setTimeout(() => {
      window.localStorage.setItem(KEY, "1");
      setActive(false);
    }, TOTAL_MS + FADE_MS);
    ts.push(endT);

    function skip() {
      ts.forEach((t) => window.clearTimeout(t));
      window.localStorage.setItem(KEY, "1");
      setActive(false);
    }
    window.addEventListener("keydown", skip, { once: true });
    window.addEventListener("touchstart", skip, { once: true });
    window.addEventListener("pointerdown", skip, { once: true });

    return () => {
      ts.forEach((t) => window.clearTimeout(t));
      window.removeEventListener("keydown", skip);
      window.removeEventListener("touchstart", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, [active]);

  if (active !== true) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[60] bg-[color:var(--now-bg)] flex items-center justify-center transition-opacity"
      style={{ opacity: fading ? 0 : 1, transitionDuration: `${FADE_MS}ms` }}
    >
      <div className="font-[var(--font-mono)] text-sm md:text-base text-[color:var(--now-accent)] px-6 max-w-md">
        {LINES.slice(0, shownLines).map((line, i) => (
          <div key={line} className="my-1">
            {line}
            {i === shownLines - 1 && !fading ? (
              <span className="now-cursor" aria-hidden="true" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
