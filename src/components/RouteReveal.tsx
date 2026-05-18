"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Preloader } from "./Preloader";
import { getLenis } from "@/lib/lenis";

/** Shared route entry overlay.
 *
 *  Plays the existing Preloader, gates children opacity until done, then
 *  jumps to the URL hash if present (e.g. /#skills arriving from /now).
 *  Next's default hash-scroll fires before content is laid out behind the
 *  preloader, and Lenis can swallow a plain scrollIntoView — so once the
 *  reveal completes we drive the Lenis instance directly when available
 *  and fall back to native scroll otherwise. */
export function RouteReveal({ children }: { children: ReactNode }) {
  const [done, setDone] = useState(false);
  const handleComplete = useCallback(() => setDone(true), []);

  useEffect(() => {
    if (!done) return;
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Two rAFs so the opacity transition has begun and layout/Lenis are settled
    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (!el) return;
        const lenis = getLenis();
        if (lenis) {
          lenis.scrollTo(el, { immediate: true });
        } else {
          const top = el.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top });
        }
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [done]);

  return (
    <>
      <Preloader onComplete={handleComplete} />
      <div
        style={{
          opacity: done ? 1 : 0,
          transition: "opacity 0.5s ease",
          pointerEvents: done ? "auto" : "none",
        }}
      >
        {children}
      </div>
    </>
  );
}
