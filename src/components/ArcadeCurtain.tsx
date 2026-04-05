"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const RED = "#ff2d55";
const ORANGE = "#ff6b2d";
const RING_SIZE = 42;
const STROKE = 2.5;
const RADIUS = (RING_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Scroll-momentum progress ring + cinematic curtain drop transition.
 *
 * Flow: overscroll at bottom → ring fills → curtain drops from top (bounce) →
 * impact shockwave + sparks → rich ARCADE reveal scene → navigate to /arcade →
 * arcade page lifts curtain.
 */
const ARCADE_EVENT = "trigger-arcade-curtain";

/** Called by the Footer button — dispatches a CustomEvent so the
 *  ArcadeCurtain component picks it up without a global mutable. */
export function triggerArcade() {
  window.dispatchEvent(new CustomEvent(ARCADE_EVENT));
}

export function ArcadeCurtain() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<
    "idle" | "dropping" | "impact" | "scene" | "navigating"
  >("idle");
  const progressRef = useRef(0);
  const triggered = useRef(false);

  // Listen for the intentional footer button trigger
  useEffect(() => {
    function handleTrigger() {
      if (!triggered.current) {
        triggered.current = true;
        setPhase("dropping");
      }
    }
    window.addEventListener(ARCADE_EVENT, handleTrigger);
    return () => window.removeEventListener(ARCADE_EVENT, handleTrigger);
  }, []);
  const lastWheelTime = useRef(0);
  const [sceneStep, setSceneStep] = useState(0); // 0=nothing, 1=grid+emblem, 2=text, 3=subtitle+bar

  // ── Wheel handler ──
  const handleWheel = useCallback((e: WheelEvent) => {
    if (triggered.current || e.deltaY <= 0) return;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (window.scrollY < maxScroll - 2) return;

    lastWheelTime.current = Date.now();
    // Reduced bump so it takes deliberate sustained scrolling (not accidental)
    const bump = Math.min(2.5, Math.max(0.6, Math.abs(e.deltaY) / 60));
    progressRef.current = Math.min(100, progressRef.current + bump);
    setProgress(progressRef.current);

    if (progressRef.current >= 100 && !triggered.current) {
      triggered.current = true;
      setPhase("dropping");
    }
  }, []);

  // ── Decay loop ──
  useEffect(() => {
    let rafId: number;
    let running = true;
    const tick = () => {
      if (!running) return;
      if (!triggered.current && progressRef.current > 0) {
        const idle = Date.now() - lastWheelTime.current;
        if (idle > 150) {
          const rate = 1.8 + (progressRef.current / 100) * 1.2;
          progressRef.current = Math.max(0, progressRef.current - rate);
          setProgress(progressRef.current);
        }
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => { running = false; cancelAnimationFrame(rafId); };
  }, []);

  // ── Wheel listener ──
  useEffect(() => {
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  // ── Phase sequence ──
  useEffect(() => {
    if (phase === "dropping") {
      document.body.style.overflow = "hidden";
      const t = setTimeout(() => setPhase("impact"), 950);
      return () => clearTimeout(t);
    }
    if (phase === "impact") {
      // Start scene build-up sequence
      setSceneStep(1);
      const t1 = setTimeout(() => setSceneStep(2), 400);
      const t2 = setTimeout(() => setSceneStep(3), 800);
      const t3 = setTimeout(() => setPhase("scene"), 500);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
    if (phase === "scene") {
      const t = setTimeout(() => {
        sessionStorage.setItem("arcade_curtain", "1");
        setPhase("navigating");
      }, 1800);
      return () => clearTimeout(t);
    }
    if (phase === "navigating") {
      router.push("/arcade");
    }
  }, [phase, router]);

  // ── Cleanup ──
  useEffect(() => {
    return () => { document.body.style.overflow = ""; };
  }, []);

  const showRing = progress > 0 && phase === "idle";
  const strokeOffset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;

  return (
    <>
      {/* ── Progress ring ── */}
      {showRing && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 9000,
            width: RING_SIZE,
            height: RING_SIZE,
            opacity: Math.min(1, progress / 10),
            transition: "opacity 0.4s ease",
            filter: progress > 70
              ? `drop-shadow(0 0 ${4 + (progress - 70) * 0.3}px rgba(255,45,85,0.5))`
              : "none",
          }}
        >
          <svg width={RING_SIZE} height={RING_SIZE} style={{ transform: "rotate(-90deg)" }}>
            <circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RADIUS} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={STROKE} />
            <circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RADIUS} fill="none" stroke="url(#arcade-ring-grad)" strokeWidth={STROKE} strokeLinecap="round" strokeDasharray={CIRCUMFERENCE} strokeDashoffset={strokeOffset} style={{ transition: "stroke-dashoffset 0.15s ease-out" }} />
            <defs>
              <linearGradient id="arcade-ring-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={RED} />
                <stop offset="100%" stopColor={ORANGE} />
              </linearGradient>
            </defs>
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 8, height: 8, background: progress > 50 ? `linear-gradient(135deg, ${RED}, ${ORANGE})` : "rgba(255,255,255,0.2)", clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)", transition: "background 0.3s ease" }} />
          </div>
        </div>
      )}

      {/* ══════════ CURTAIN ══════════ */}
      {phase !== "idle" && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99500 }}>
          {/* The curtain panel — drops from top */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "#050508",
              animation: "curtain-drop 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards",
              overflow: "hidden",
            }}
          >
            {/* ── Background layers ── */}

            {/* Perspective grid floor */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: "-20%",
                right: "-20%",
                height: "55%",
                background: `
                  linear-gradient(rgba(255,45,85,0.05) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,45,85,0.05) 1px, transparent 1px)
                `,
                backgroundSize: "60px 60px",
                transform: "perspective(500px) rotateX(55deg)",
                transformOrigin: "bottom center",
                opacity: 0,
                animation: sceneStep >= 1 ? "grid-fade-in 1s ease forwards" : undefined,
              }}
            />

            {/* Radial glow at center-bottom */}
            <div
              style={{
                position: "absolute",
                bottom: "10%",
                left: "50%",
                width: "80vw",
                height: "40vh",
                transform: "translateX(-50%)",
                background: `radial-gradient(ellipse 50% 60% at 50% 80%, rgba(255,45,85,0.12) 0%, transparent 70%)`,
                opacity: 0,
                animation: sceneStep >= 1 ? "glow-pulse 2s ease-in-out infinite" : undefined,
                animationDelay: "0.3s",
              }}
            />

            {/* Scanlines */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(255,45,85,0.01) 3px, rgba(255,45,85,0.01) 4px)",
                pointerEvents: "none",
              }}
            />

            {/* Diagonal accent streaks */}
            <div style={{ position: "absolute", top: "15%", left: "8%", width: 1, height: "35%", background: `linear-gradient(to bottom, transparent, rgba(255,45,85,0.08), transparent)`, transform: "skewX(-20deg)", opacity: 0, animation: sceneStep >= 1 ? "streak-in 0.8s ease forwards 0.2s" : undefined }} />
            <div style={{ position: "absolute", top: "20%", right: "12%", width: 1, height: "30%", background: `linear-gradient(to bottom, transparent, rgba(255,107,45,0.06), transparent)`, transform: "skewX(15deg)", opacity: 0, animation: sceneStep >= 1 ? "streak-in 0.8s ease forwards 0.35s" : undefined }} />
            <div style={{ position: "absolute", top: "10%", left: "35%", width: 1, height: "25%", background: `linear-gradient(to bottom, transparent, rgba(255,45,85,0.04), transparent)`, transform: "skewX(-8deg)", opacity: 0, animation: sceneStep >= 1 ? "streak-in 0.8s ease forwards 0.5s" : undefined }} />
            <div style={{ position: "absolute", top: "25%", right: "30%", width: 1, height: "20%", background: `linear-gradient(to bottom, transparent, rgba(255,107,45,0.05), transparent)`, transform: "skewX(12deg)", opacity: 0, animation: sceneStep >= 1 ? "streak-in 0.8s ease forwards 0.4s" : undefined }} />

            {/* Bottom edge glow */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 3,
                background: `linear-gradient(90deg, transparent 5%, ${RED}, ${ORANGE}, ${RED}, transparent 95%)`,
                boxShadow: `0 0 20px 4px rgba(255,45,85,0.4), 0 0 60px 8px rgba(255,45,85,0.15)`,
              }}
            />

            {/* ── Impact effects ── */}
            {(phase === "impact" || phase === "scene" || phase === "navigating") && (
              <>
                {/* Shockwave line */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${RED}, ${ORANGE}, ${RED}, transparent)`, animation: "shockwave-line 0.7s ease-out forwards", zIndex: 2 }} />
                {/* Radial blast */}
                <div style={{ position: "absolute", bottom: -60, left: "50%", width: 120, height: 120, transform: "translateX(-50%)", borderRadius: "50%", background: `radial-gradient(circle, rgba(255,45,85,0.35) 0%, transparent 70%)`, animation: "shockwave-radial 1s ease-out forwards", zIndex: 2 }} />
                {/* Sparks */}
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: `${5 + (i * 90) / 16}%`,
                      width: i % 3 === 0 ? 3 : 2,
                      height: i % 3 === 0 ? 3 : 2,
                      borderRadius: "50%",
                      background: i % 2 === 0 ? RED : ORANGE,
                      animation: `spark-up-${i % 4} ${0.5 + (i % 5) * 0.12}s ease-out forwards`,
                      animationDelay: `${(i % 7) * 0.03}s`,
                      opacity: 0,
                      zIndex: 3,
                    }}
                  />
                ))}
              </>
            )}

            {/* ── Center content: emblem + text ── */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
              }}
            >
              {/* Hexagonal emblem */}
              {sceneStep >= 1 && (
                <div
                  style={{
                    width: 80,
                    height: 80,
                    marginBottom: 28,
                    position: "relative",
                    animation: "emblem-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                  }}
                >
                  {/* Outer hex ring */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
                      background: `linear-gradient(135deg, rgba(255,45,85,0.2), rgba(255,107,45,0.1))`,
                      animation: "hex-rotate 6s linear infinite",
                    }}
                  />
                  {/* Inner hex */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 8,
                      clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
                      background: `linear-gradient(135deg, rgba(255,45,85,0.08), rgba(255,107,45,0.04))`,
                    }}
                  />
                  {/* Center diamond */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        background: `linear-gradient(135deg, ${RED}, ${ORANGE})`,
                        clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                        filter: "drop-shadow(0 0 10px rgba(255,45,85,0.6))",
                        animation: "diamond-pulse 1.5s ease-in-out infinite",
                      }}
                    />
                  </div>
                </div>
              )}

              {/* ARCADE text with glitch effect */}
              {sceneStep >= 2 && (
                <div style={{ position: "relative", marginBottom: 12 }}>
                  {/* Glitch layers */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      fontFamily: "var(--font-orbitron, monospace)",
                      fontSize: "clamp(28px, 6vw, 52px)",
                      fontWeight: 900,
                      letterSpacing: 16,
                      color: "rgba(255,45,85,0.4)",
                      animation: "glitch-1 0.3s ease-in-out 2",
                      clipPath: "inset(0 0 65% 0)",
                    }}
                  >
                    ARCADE
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      fontFamily: "var(--font-orbitron, monospace)",
                      fontSize: "clamp(28px, 6vw, 52px)",
                      fontWeight: 900,
                      letterSpacing: 16,
                      color: "rgba(255,107,45,0.3)",
                      animation: "glitch-2 0.3s ease-in-out 2",
                      clipPath: "inset(65% 0 0 0)",
                    }}
                  >
                    ARCADE
                  </div>
                  {/* Main text */}
                  <div
                    style={{
                      fontFamily: "var(--font-orbitron, monospace)",
                      fontSize: "clamp(28px, 6vw, 52px)",
                      fontWeight: 900,
                      letterSpacing: 16,
                      background: `linear-gradient(135deg, ${RED}, ${ORANGE})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      filter: "drop-shadow(0 0 24px rgba(255,45,85,0.3))",
                      animation: "text-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                    }}
                  >
                    ARCADE
                  </div>
                </div>
              )}

              {/* Accent lines + subtitle */}
              {sceneStep >= 2 && (
                <div style={{ width: 80, height: 1, background: `linear-gradient(90deg, transparent, ${RED}, ${ORANGE}, transparent)`, animation: "line-expand 0.6s ease-out forwards", marginBottom: 16 }} />
              )}

              {sceneStep >= 3 && (
                <>
                  <div
                    style={{
                      fontFamily: "var(--font-rajdhani, sans-serif)",
                      fontSize: 13,
                      fontWeight: 600,
                      letterSpacing: 6,
                      color: "rgba(255,255,255,0.3)",
                      textTransform: "uppercase",
                      animation: "subtitle-in 0.5s ease forwards",
                      marginBottom: 24,
                    }}
                  >
                    Entering the Grid
                  </div>

                  {/* Loading bar */}
                  <div
                    style={{
                      width: 160,
                      height: 2,
                      borderRadius: 1,
                      background: "rgba(255,255,255,0.06)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        borderRadius: 1,
                        background: `linear-gradient(90deg, ${RED}, ${ORANGE})`,
                        animation: "load-bar 1.2s ease-in-out forwards",
                        boxShadow: `0 0 8px rgba(255,45,85,0.4)`,
                      }}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Corner accents */}
            {sceneStep >= 1 && (
              <>
                {/* Top-left */}
                <div style={{ position: "absolute", top: 24, left: 24, opacity: 0, animation: "corner-in 0.5s ease forwards 0.3s" }}>
                  <div style={{ width: 24, height: 1, background: `rgba(255,45,85,0.3)` }} />
                  <div style={{ width: 1, height: 24, background: `rgba(255,45,85,0.3)` }} />
                </div>
                {/* Top-right */}
                <div style={{ position: "absolute", top: 24, right: 24, opacity: 0, animation: "corner-in 0.5s ease forwards 0.4s", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                  <div style={{ width: 24, height: 1, background: `rgba(255,107,45,0.3)` }} />
                  <div style={{ width: 1, height: 24, background: `rgba(255,107,45,0.3)`, alignSelf: "flex-end" }} />
                </div>
                {/* Bottom-left */}
                <div style={{ position: "absolute", bottom: 24, left: 24, opacity: 0, animation: "corner-in 0.5s ease forwards 0.5s", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                  <div style={{ width: 1, height: 24, background: `rgba(255,107,45,0.3)` }} />
                  <div style={{ width: 24, height: 1, background: `rgba(255,107,45,0.3)` }} />
                </div>
                {/* Bottom-right */}
                <div style={{ position: "absolute", bottom: 24, right: 24, opacity: 0, animation: "corner-in 0.5s ease forwards 0.6s", display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "flex-end" }}>
                  <div style={{ width: 1, height: 24, background: `rgba(255,45,85,0.3)`, alignSelf: "flex-end" }} />
                  <div style={{ width: 24, height: 1, background: `rgba(255,45,85,0.3)` }} />
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes curtain-drop {
          0%   { transform: translateY(-100%); }
          60%  { transform: translateY(2.5%); }
          78%  { transform: translateY(-1.2%); }
          90%  { transform: translateY(0.4%); }
          100% { transform: translateY(0%); }
        }

        @keyframes shockwave-line {
          0%   { opacity: 1; height: 3px; box-shadow: 0 0 30px 8px rgba(255,45,85,0.7); }
          100% { opacity: 0; height: 1px; box-shadow: 0 0 60px 16px rgba(255,45,85,0); }
        }

        @keyframes shockwave-radial {
          0%   { transform: translateX(-50%) scale(1); opacity: 1; }
          100% { transform: translateX(-50%) scale(10); opacity: 0; }
        }

        @keyframes spark-up-0 { 0% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(-60px) translateX(-8px); opacity: 0; } }
        @keyframes spark-up-1 { 0% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(-45px) translateX(5px); opacity: 0; } }
        @keyframes spark-up-2 { 0% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(-70px) translateX(-3px); opacity: 0; } }
        @keyframes spark-up-3 { 0% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(-50px) translateX(10px); opacity: 0; } }

        @keyframes grid-fade-in {
          from { opacity: 0; }
          to   { opacity: 0.7; }
        }

        @keyframes glow-pulse {
          0%, 100% { opacity: 0.5; }
          50%      { opacity: 1; }
        }

        @keyframes streak-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        @keyframes emblem-in {
          from { opacity: 0; transform: scale(0.6); }
          to   { opacity: 1; transform: scale(1); }
        }

        @keyframes hex-rotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        @keyframes diamond-pulse {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(255,45,85,0.6)); }
          50%      { transform: scale(1.15); filter: drop-shadow(0 0 16px rgba(255,45,85,0.9)); }
        }

        @keyframes text-in {
          from { opacity: 0; transform: scale(0.85) translateY(6px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes glitch-1 {
          0%  { transform: translate(0); }
          25% { transform: translate(-3px, -1px); }
          50% { transform: translate(2px, 1px); }
          75% { transform: translate(-1px, 0px); }
          100%{ transform: translate(0); }
        }

        @keyframes glitch-2 {
          0%  { transform: translate(0); }
          25% { transform: translate(2px, 1px); }
          50% { transform: translate(-3px, -1px); }
          75% { transform: translate(1px, 0px); }
          100%{ transform: translate(0); }
        }

        @keyframes line-expand {
          from { width: 0; opacity: 0; }
          to   { width: 80px; opacity: 1; }
        }

        @keyframes subtitle-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes load-bar {
          0%   { width: 0%; }
          100% { width: 100%; }
        }

        @keyframes corner-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </>
  );
}
