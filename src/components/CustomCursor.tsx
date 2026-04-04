"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only activate on non-touch / pointer-fine devices
    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;

    const dot = dotRef.current as HTMLDivElement;
    const ring = ringRef.current as HTMLDivElement;
    if (!dot || !ring) return;

    // Hide native cursor
    document.body.style.cursor = "none";

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let rafId: number;
    let isScaled = false;

    // Instantly snap dot to pointer position
    function onMouseMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`;
    }

    // Scale ring on interactive elements
    const INTERACTIVE = "a, button, [role='button'], input, textarea, select, label, [data-cursor-expand]";

    function onMouseOver(e: MouseEvent) {
      if ((e.target as Element).closest(INTERACTIVE)) {
        if (!isScaled) {
          isScaled = true;
          ring.style.transform = `translate(${ringX - 14}px, ${ringY - 14}px) scale(1.5)`;
          ring.style.opacity = "0.6";
          ring.style.borderColor = "rgba(196,247,81,0.9)";
          ring.style.backgroundColor = "rgba(196,247,81,0.06)";
        }
      }
    }

    function onMouseOut(e: MouseEvent) {
      if ((e.target as Element).closest(INTERACTIVE)) {
        if (isScaled) {
          isScaled = false;
          ring.style.transform = `translate(${ringX - 14}px, ${ringY - 14}px) scale(1)`;
          ring.style.opacity = "1";
          ring.style.borderColor = "rgba(196,247,81,0.55)";
          ring.style.backgroundColor = "transparent";
        }
      }
    }

    // Smooth ring follow via rAF lerp
    function animate() {
      const ease = 0.12;
      ringX += (mouseX - ringX) * ease;
      ringY += (mouseY - ringY) * ease;

      const scale = isScaled ? 1.5 : 1;
      ring.style.transform = `translate(${ringX - 14}px, ${ringY - 14}px) scale(${scale})`;

      rafId = requestAnimationFrame(animate);
    }

    // Show cursors once we have a position
    function onFirstMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      ringX = mouseX;
      ringY = mouseY;
      dot.style.opacity = "1";
      ring.style.opacity = "1";
      window.removeEventListener("mousemove", onFirstMove);
    }

    window.addEventListener("mousemove", onFirstMove);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);
    window.addEventListener("mouseout", onMouseOut);

    rafId = requestAnimationFrame(animate);

    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onFirstMove);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("mouseout", onMouseOut);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Dot — snaps exactly to cursor */}
      <div
        ref={dotRef}
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: "#c4f751",
          opacity: 0,
          pointerEvents: "none",
          zIndex: 99999,
          willChange: "transform",
          boxShadow: "0 0 6px rgba(196,247,81,0.8)",
        }}
      />

      {/* Ring — follows with lag */}
      <div
        ref={ringRef}
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          border: "1.5px solid rgba(196,247,81,0.55)",
          opacity: 0,
          pointerEvents: "none",
          zIndex: 99998,
          willChange: "transform",
          transition: "opacity 0.3s ease, border-color 0.3s ease, background-color 0.3s ease",
        }}
      />
    </>
  );
}
