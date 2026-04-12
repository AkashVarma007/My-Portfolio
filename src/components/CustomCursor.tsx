"use client";

import { useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Minimal custom cursor
//
// Idle  → small 8px filled dot, follows mouse with slight lerp
// Hover → expands to a 32px ring (border-only), dot shrinks inside
//
// No canvas, no spring physics, no labels, no squash-stretch.
// Just a dot → ring transition via CSS, position via one lightweight RAF.
// ─────────────────────────────────────────────────────────────────────────────

const INTERACTIVE = "a, button, [role='button'], input, textarea, select";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    if (!dot || !ring) return;

    // Hide native cursor globally
    const cursorStyle = document.createElement("style");
    cursorStyle.textContent = "*, *::before, *::after { cursor: none !important; }";
    document.head.appendChild(cursorStyle);

    let mX = -100, mY = -100;
    let dX = -100, dY = -100;
    let rX = -100, rY = -100;
    let visible = false;
    let hovering = false;
    let rafId: number;

    function show(x: number, y: number) {
      if (visible) return;
      visible = true;
      mX = x; mY = y;
      dX = x; dY = y;
      rX = x; rY = y;
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    }

    function onMouseMove(e: MouseEvent) {
      mX = e.clientX;
      mY = e.clientY;
      if (!visible) show(mX, mY);
    }

    function onMouseOver(e: MouseEvent) {
      if ((e.target as Element)?.closest(INTERACTIVE)) {
        hovering = true;
        ring.classList.add("cursor-hover");
        dot.classList.add("cursor-hover");
      }
    }

    function onMouseOut(e: MouseEvent) {
      if ((e.target as Element)?.closest(INTERACTIVE)) {
        hovering = false;
        ring.classList.remove("cursor-hover");
        dot.classList.remove("cursor-hover");
      }
    }

    function onMouseLeave() {
      visible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    }

    function tick() {
      dX += (mX - dX) * 0.35;
      dY += (mY - dY) * 0.35;
      rX += (mX - rX) * 0.18;
      rY += (mY - rY) * 0.18;

      dot.style.transform = `translate(${dX}px, ${dY}px)`;
      ring.style.transform = `translate(${rX}px, ${rY}px) scale(${hovering ? 1 : 0.5})`;

      rafId = requestAnimationFrame(tick);
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    document.addEventListener("mouseleave", onMouseLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      cursorStyle.remove();
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      document.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        aria-hidden
        className="custom-cursor-dot"
        style={{
          position: "fixed",
          top: -4,
          left: -4,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#c4f751",
          pointerEvents: "none",
          zIndex: 99999,
          willChange: "transform",
          transition: "width 0.25s ease, height 0.25s ease, background 0.25s ease, top 0.25s ease, left 0.25s ease",
          opacity: 0,
        }}
      />

      {/* Ring */}
      <div
        ref={ringRef}
        aria-hidden
        className="custom-cursor-ring"
        style={{
          position: "fixed",
          top: -16,
          left: -16,
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "1.5px solid rgba(196,247,81,0.45)",
          pointerEvents: "none",
          zIndex: 99998,
          willChange: "transform",
          transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1), border-color 0.25s ease, opacity 0.25s ease",
          opacity: 0,
        }}
      />

      <style>{`
        .custom-cursor-dot.cursor-hover {
          width: 4px !important;
          height: 4px !important;
          top: -2px !important;
          left: -2px !important;
          background: #fff !important;
        }
        .custom-cursor-ring.cursor-hover {
          border-color: rgba(196,247,81,0.7) !important;
        }
      `}</style>
    </>
  );
}
