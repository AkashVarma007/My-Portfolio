"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useHunt } from "@/context/HuntContext";

type Props = {
  isClue?: boolean;
  payload?: string;
  clueId?: number;
  children: ReactNode;
};

const SCRAMBLE_CHARS = "█▓▒░@#%&*+=<>?/\\";

function randomString(len: number): string {
  let s = "";
  for (let i = 0; i < len; i++) {
    s += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
  }
  return s;
}

export function RedactedSpan({ isClue, payload, clueId, children }: Props) {
  const [revealed, setRevealed] = useState(false);
  const [display, setDisplay] = useState<string>("");
  const animRef = useRef<number | null>(null);
  const hunt = useHunt();

  const target = payload ?? (typeof children === "string" ? children : "");

  useEffect(() => {
    return () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    };
  }, []);

  function handleClick() {
    if (revealed) return;
    if (isClue && clueId !== undefined) {
      hunt.unlockClue(clueId);
    }
    setRevealed(true);
    if (!target) return;
    const start = performance.now();
    const duration = 700;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const lockedCount = Math.floor(t * target.length);
      const scrambled =
        target.slice(0, lockedCount) + randomString(target.length - lockedCount);
      setDisplay(scrambled);
      if (t < 1) animRef.current = requestAnimationFrame(tick);
      else setDisplay(target);
    };
    animRef.current = requestAnimationFrame(tick);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  }

  return (
    <span
      role="button"
      tabIndex={0}
      aria-pressed={revealed}
      onClick={handleClick}
      onKeyDown={handleKey}
      className="now-redact"
      data-revealed={revealed ? "true" : "false"}
      data-is-clue={isClue ? "true" : "false"}
    >
      {revealed ? display || target || children : children}
    </span>
  );
}
