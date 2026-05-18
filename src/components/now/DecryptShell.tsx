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
  if (decrypted) return <>{children}</>;

  function handleDecrypt() {
    setAnimating(true);
    window.setTimeout(() => {
      const list = readDecrypted();
      if (!list.includes(logId)) list.push(logId);
      writeDecrypted(list);
      setDecrypted(true);
    }, 900);
  }

  return (
    <section className="now-decrypt">
      <div className="now-decrypt__eyebrow">classified</div>
      <h1 className="now-decrypt__title">
        this entry is locked. press decrypt to read.
      </h1>
      <p className="now-decrypt__body">
        marked classified to keep it out of the open feed. nothing dangerous —
        just kept quiet on purpose.
      </p>
      <button
        type="button"
        onClick={handleDecrypt}
        disabled={animating}
        className="now-decrypt__btn"
      >
        {animating ? "decrypting…" : "decrypt"}
        <span aria-hidden="true">→</span>
      </button>
    </section>
  );
}
