"use client";

import { useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Magnetic morphing cursor
//
// Idle     → tight 18×18 circle that follows mouse with spring physics
// Hover    → ring snaps to element's center and physically morphs its width,
//            height and border-radius to wrap the exact element being hovered
//
// No big rings. No comet trails. The morphing IS the wow factor.
// ─────────────────────────────────────────────────────────────────────────────

const INTERACTIVE = "a, button, [role='button'], [data-cursor]";

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function spring(vel: number, cur: number, target: number, k: number, d: number) {
  return ((vel + (target - cur) * k) * d);
}

export function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotRef    = useRef<HTMLDivElement>(null);
  const ringRef   = useRef<HTMLDivElement>(null);
  const labelRef  = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const canvas = canvasRef.current!;
    const dot    = dotRef.current!;
    const ring   = ringRef.current!;
    const label  = labelRef.current!;
    if (!canvas || !dot || !ring || !label) return;

    const ctx = canvas.getContext("2d")!;
    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize();
    window.addEventListener("resize", resize);
    document.body.style.cursor = "none";

    // ── Mouse ─────────────────────────────────────────────────────────────
    let mX = -500, mY = -500;
    let ready = false;

    // ── Ring position spring ───────────────────────────────────────────────
    let rX = -500, rY = -500, rVX = 0, rVY = 0;

    // ── Ring size/shape springs ────────────────────────────────────────────
    let rW = 18,  rWV = 0;
    let rH = 18,  rHV = 0;
    let rBR = 9,  rBRV = 0; // border-radius px

    // ── Targets ────────────────────────────────────────────────────────────
    let tX = -500, tY = -500;
    let tW = 18, tH = 18, tBR = 9;

    // ── Lerped visuals ─────────────────────────────────────────────────────
    let borderAlpha = 0.50;
    let bgAlpha     = 0;
    let dotAlpha    = 0;
    let lblAlpha    = 0;
    let haloIntens  = 0;
    let isHover     = false;
    let rafId: number;

    // ── Helpers ────────────────────────────────────────────────────────────
    function getLabel(el: Element) {
      const dc = el.closest("[data-cursor]");
      return dc ? (dc.getAttribute("data-cursor") ?? "") : "";
    }

    function readElement(el: Element) {
      const rect   = el.getBoundingClientRect();
      const styles = getComputedStyle(el);
      // Parse border-radius — use first value, clamp sensibly
      const rawBR  = parseFloat(styles.borderRadius) || 0;
      const br     = Math.min(Math.max(rawBR, 4), 999);
      const pad    = 10;
      return {
        cx:  rect.left + rect.width  / 2,
        cy:  rect.top  + rect.height / 2,
        w:   Math.min(rect.width  + pad, 260),
        h:   Math.min(rect.height + pad,  80),
        br,
      };
    }

    // ── Events ─────────────────────────────────────────────────────────────
    function onFirstMove(e: MouseEvent) {
      mX = e.clientX; mY = e.clientY;
      rX = mX; rY = mY; tX = mX; tY = mY;
      ready = true;
      window.removeEventListener("mousemove", onFirstMove);
    }
    function onMouseMove(e: MouseEvent) { mX = e.clientX; mY = e.clientY; }

    function onMouseOver(e: MouseEvent) {
      const target = (e.target as Element).closest(INTERACTIVE);
      if (!target) return;
      const { cx, cy, w, h, br } = readElement(target);
      isHover = true;
      tX = cx; tY = cy;
      tW = w;  tH = h; tBR = br;
      const lbl = getLabel(target);
      label.textContent = lbl;
    }

    function onMouseOut(e: MouseEvent) {
      if (!(e.target as Element).closest(INTERACTIVE)) return;
      isHover = false;
      tW = 18; tH = 18; tBR = 9;
    }

    // ── rAF loop ───────────────────────────────────────────────────────────
    function animate() {
      if (!ready) { rafId = requestAnimationFrame(animate); return; }

      // Position target: element centre when hovering, mouse when idle
      if (!isHover) { tX = mX; tY = mY; }

      // Position spring — faster snap when hovering (element centre is fixed)
      const posK = isHover ? 0.28 : 0.18;
      const posD = isHover ? 0.68 : 0.74;
      rVX = spring(rVX, rX, tX, posK, posD); rX += rVX;
      rVY = spring(rVY, rY, tY, posK, posD); rY += rVY;

      // Size springs
      rWV  = spring(rWV,  rW,  tW,  0.24, 0.68); rW  += rWV;
      rHV  = spring(rHV,  rH,  tH,  0.24, 0.68); rH  += rHV;
      rBRV = spring(rBRV, rBR, tBR, 0.22, 0.70); rBR += rBRV;

      // Idle: border-radius tracks half the current height (keeps it circular)
      if (!isHover) {
        const circleR = rH / 2;
        rBRV = spring(rBRV, rBR, circleR, 0.22, 0.70); rBR += rBRV;
      }

      // Lerp visuals
      borderAlpha = lerp(borderAlpha, isHover ? 0.85 : 0.50, 0.12);
      bgAlpha     = lerp(bgAlpha,     isHover ? 0.07 : 0.00, 0.12);
      dotAlpha    = lerp(dotAlpha,    isHover ? 0.00 : 1.00, 0.14);
      lblAlpha    = lerp(lblAlpha,    (isHover && label.textContent) ? 1 : 0, 0.15);
      haloIntens  = lerp(haloIntens,  isHover ? 0.12 : 0.05, 0.04);

      // Velocity-based squash/stretch (idle only, on primary axis)
      let sX = 1, sY = 1;
      if (!isHover) {
        const speed   = Math.sqrt(rVX * rVX + rVY * rVY);
        const angle   = Math.atan2(rVY, rVX);
        const str     = Math.min(speed * 0.022, 0.45);
        sX = 1 + str;
        sY = Math.max(1 - str * 0.50, 0.62);

        // Apply via rotate-scale-rotate trick inline
        const cosA = Math.cos(angle), sinA = Math.sin(angle);
        const hw = rW / 2, hh = rH / 2;
        ring.style.transform = [
          `translate(${rX - hw}px, ${rY - hh}px)`,
          `rotate(${angle}rad)`,
          `scale(${sX.toFixed(4)},${sY.toFixed(4)})`,
          `rotate(${-angle}rad)`,
        ].join(" ");
        void cosA; void sinA; // silence unused
      } else {
        ring.style.transform = `translate(${rX - rW / 2}px, ${rY - rH / 2}px)`;
      }

      ring.style.width        = `${rW}px`;
      ring.style.height       = `${rH}px`;
      ring.style.borderRadius = `${rBR}px`;
      ring.style.borderColor  = `rgba(196,247,81,${borderAlpha.toFixed(3)})`;
      ring.style.backgroundColor = `rgba(196,247,81,${bgAlpha.toFixed(3)})`;

      // Glow
      if (isHover) {
        ring.style.boxShadow = `0 0 0 1px rgba(196,247,81,0.08), 0 0 16px rgba(196,247,81,0.18)`;
      } else {
        const spd = Math.sqrt(rVX * rVX + rVY * rVY);
        ring.style.boxShadow = spd > 1.5
          ? `0 0 8px rgba(196,247,81,${Math.min(spd * 0.012, 0.12).toFixed(3)})`
          : "none";
      }

      // Label
      label.style.opacity  = lblAlpha.toFixed(3);
      label.style.fontSize = rH > 30 ? "11px" : "9px";

      // Dot
      dot.style.transform = `translate(${mX - 3}px, ${mY - 3}px)`;
      dot.style.opacity   = dotAlpha.toFixed(3);

      // Canvas: ambient halo at ring position
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const hR   = isHover ? 90 : 140;
      const grad = ctx.createRadialGradient(rX, rY, 0, rX, rY, hR);
      grad.addColorStop(0,   `rgba(196,247,81,${haloIntens.toFixed(3)})`);
      grad.addColorStop(0.5, `rgba(196,247,81,${(haloIntens * 0.35).toFixed(3)})`);
      grad.addColorStop(1,   "rgba(196,247,81,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      rafId = requestAnimationFrame(animate);
    }

    // ── Bind ──────────────────────────────────────────────────────────────
    window.addEventListener("mousemove",  onFirstMove);
    window.addEventListener("mousemove",  onMouseMove);
    window.addEventListener("mouseover",  onMouseOver);
    window.addEventListener("mouseout",   onMouseOut);
    rafId = requestAnimationFrame(animate);

    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("resize",    resize);
      window.removeEventListener("mousemove", onFirstMove);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("mouseout",  onMouseOut);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Ambient halo */}
      <canvas
        ref={canvasRef}
        aria-hidden
        style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 99980 }}
      />

      {/* Precise dot — exact mouse, disappears on hover */}
      <div
        ref={dotRef}
        aria-hidden
        style={{
          position: "fixed", top: 0, left: 0,
          width: 6, height: 6, borderRadius: "50%",
          background: "#c4f751", opacity: 0,
          pointerEvents: "none", zIndex: 99999,
          willChange: "transform, opacity",
          boxShadow: "0 0 8px rgba(196,247,81,0.95), 0 0 3px #c4f751",
        }}
      />

      {/* Morphing ring */}
      <div
        ref={ringRef}
        aria-hidden
        style={{
          position: "fixed", top: 0, left: 0,
          width: 18, height: 18, borderRadius: 9,
          border: "1.5px solid rgba(196,247,81,0.50)",
          backgroundColor: "transparent",
          pointerEvents: "none", zIndex: 99990,
          willChange: "transform, width, height, border-radius, border-color, background-color, box-shadow",
          boxSizing: "border-box",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <span
          ref={labelRef}
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.5px",
            color: "#c4f751",
            opacity: 0, pointerEvents: "none", userSelect: "none",
            lineHeight: 1, whiteSpace: "nowrap",
          }}
        />
      </div>
    </>
  );
}
