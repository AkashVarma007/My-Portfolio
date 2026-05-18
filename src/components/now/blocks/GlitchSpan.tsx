// src/components/now/blocks/GlitchSpan.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export function GlitchSpan({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timeoutId: number | null = null;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActive(true);
            timeoutId = window.setTimeout(() => setActive(false), 1200);
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timeoutId !== null) window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <span ref={ref} className="now-glitch" data-active={active ? "true" : "false"}>
      {children}
    </span>
  );
}
