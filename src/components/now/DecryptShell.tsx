// src/components/now/DecryptShell.tsx
"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";

const KEY = "akash_now_decrypted";

function readDecrypted(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((n) => typeof n === "number") : [];
  } catch {
    return [];
  }
}

function writeDecrypted(ids: number[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}

type Props = {
  logId: number;
  children: ReactNode;
};

export function DecryptShell({ logId, children }: Props) {
  const [decrypted, setDecrypted] = useState<boolean | null>(null);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setDecrypted(readDecrypted().includes(logId));
  }, [logId]);

  if (decrypted === null) return null;

  if (decrypted) {
    return <>{children}</>;
  }

  function handleDecrypt() {
    setAnimating(true);
    window.setTimeout(() => {
      const list = readDecrypted();
      if (!list.includes(logId)) list.push(logId);
      writeDecrypted(list);
      setDecrypted(true);
    }, 1500);
  }

  return (
    <div className="relative">
      <div aria-hidden={animating ? "false" : "true"} className="opacity-40 blur-sm pointer-events-none select-none">
        {children}
      </div>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
        <div className="now-scan-card max-w-md w-full p-6 md:p-8 font-[var(--font-mono)] text-center">
          <div className="now-priority-classified text-sm tracking-wider">
            TRANSMISSION ENCRYPTED
          </div>
          <p className="mt-5 text-[color:var(--now-fg)]/85 text-sm md:text-base">
            This log is classified. Press DECRYPT to access the broadcast.
          </p>
          <button
            type="button"
            onClick={handleDecrypt}
            disabled={animating}
            className="mt-7 px-4 py-2 border border-[color:var(--now-accent)] text-[color:var(--now-accent)] hover:bg-[color:var(--now-accent)]/10 transition-colors disabled:opacity-60"
          >
            {animating ? "DECRYPTING…" : "[ DECRYPT TRANSMISSION ]"}
          </button>
        </div>
      </div>
    </div>
  );
}
