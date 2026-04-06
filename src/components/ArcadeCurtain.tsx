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
        <div style={{ position: "fixed", inset: 0, zIndex: 200000 }}>
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

            {/* Perspective grid floor — bigger, more visible */}
            <div
              style={{
                position: "absolute",
                bottom: 0, left: "-25%", right: "-25%",
                height: "52%",
                backgroundImage: `linear-gradient(rgba(255,45,85,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(255,45,85,0.09) 1px, transparent 1px)`,
                backgroundSize: "55px 55px",
                transform: "perspective(450px) rotateX(58deg)",
                transformOrigin: "bottom center",
                opacity: 0,
                animation: sceneStep >= 1 ? "grid-fade-in 1s ease forwards" : undefined,
              }}
            />

            {/* Center vertical light pillar */}
            <div
              style={{
                position: "absolute",
                top: 0, bottom: 0,
                left: "50%", width: 1,
                transform: "translateX(-50%)",
                background: `linear-gradient(to bottom, transparent 0%, rgba(255,45,85,0.12) 30%, rgba(255,107,45,0.18) 60%, transparent 100%)`,
                pointerEvents: "none",
                opacity: 0,
                animation: sceneStep >= 1 ? "streak-in 1.2s ease forwards 0.15s" : undefined,
              }}
            />

            {/* Radial glow — center-bottom, bigger */}
            <div
              style={{
                position: "absolute",
                bottom: 0, left: "50%",
                width: "100vw", height: "55vh",
                transform: "translateX(-50%)",
                background: `radial-gradient(ellipse 55% 65% at 50% 90%, rgba(255,45,85,0.18) 0%, rgba(255,107,45,0.06) 45%, transparent 70%)`,
                opacity: 0,
                animation: sceneStep >= 1 ? "glow-pulse 2.5s ease-in-out infinite" : undefined,
                animationDelay: "0.2s",
              }}
            />

            {/* Top ambient glow */}
            <div
              style={{
                position: "absolute",
                top: 0, left: "50%",
                width: "80vw", height: "30vh",
                transform: "translateX(-50%)",
                background: `radial-gradient(ellipse 60% 70% at 50% 0%, rgba(255,45,85,0.07) 0%, transparent 70%)`,
                pointerEvents: "none",
              }}
            />

            {/* Scanlines — more visible */}
            <div
              style={{
                position: "absolute", inset: 0,
                backgroundImage: "repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(0,0,0,0.12) 3px, rgba(0,0,0,0.12) 4px)",
                pointerEvents: "none",
              }}
            />

            {/* Diagonal accent streaks — more of them */}
            {[
              { top: "12%", left:  "5%",  h: "40%", skew: "-22deg", delay: "0.10s", alpha: "0.10" },
              { top: "18%", right: "7%",  h: "32%", skew:  "18deg", delay: "0.20s", alpha: "0.08" },
              { top:  "8%", left: "28%",  h: "28%", skew:  "-8deg", delay: "0.30s", alpha: "0.06" },
              { top: "22%", right:"25%",  h: "22%", skew:  "12deg", delay: "0.15s", alpha: "0.07" },
              { top: "30%", left: "15%",  h: "18%", skew: "-14deg", delay: "0.25s", alpha: "0.05" },
              { top: "15%", right:"40%",  h: "26%", skew:   "6deg", delay: "0.35s", alpha: "0.05" },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: s.top, left: "left" in s ? s.left : undefined, right: "right" in s ? s.right : undefined,
                  width: 1, height: s.h,
                  background: `linear-gradient(to bottom, transparent, rgba(255,${i % 2 === 0 ? "45,85" : "107,45"},${s.alpha}), transparent)`,
                  transform: `skewX(${s.skew})`,
                  opacity: 0,
                  animation: sceneStep >= 1 ? `streak-in 0.9s ease forwards ${s.delay}` : undefined,
                }}
              />
            ))}

            {/* Bottom edge glow — stronger */}
            <div
              style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                height: 3,
                background: `linear-gradient(90deg, transparent 2%, ${RED}, ${ORANGE}, ${RED}, transparent 98%)`,
                boxShadow: `0 0 30px 6px rgba(255,45,85,0.5), 0 0 80px 12px rgba(255,45,85,0.15)`,
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

            {/* ── Center content: neon marquee ── */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
                padding: "0 5vw",
              }}
            >
              {/* Top marquee bar */}
              {sceneStep >= 1 && (
                <div
                  style={{
                    display: "flex", alignItems: "center", gap: 16,
                    width: "100%", maxWidth: 820, marginBottom: 24,
                    opacity: 0,
                    animation: "emblem-in 0.5s ease forwards 0.1s",
                  }}
                >
                  <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${RED})` }} />
                  <div style={{ display: "flex", gap: 8 }}>
                    {[RED, ORANGE, RED].map((c, i) => (
                      <div key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: c, boxShadow: `0 0 6px ${c}, 0 0 12px ${c}` }} />
                    ))}
                  </div>
                  <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${ORANGE}, transparent)` }} />
                </div>
              )}

              {/* PLAYER 1 label */}
              {sceneStep >= 1 && (
                <div
                  style={{
                    fontFamily: "var(--font-orbitron, monospace)",
                    fontSize: "clamp(9px, 1.1vw, 13px)",
                    fontWeight: 700,
                    letterSpacing: "0.55em",
                    color: ORANGE,
                    textTransform: "uppercase",
                    marginBottom: 18,
                    opacity: 0,
                    animation: "emblem-in 0.5s ease forwards 0.2s",
                    textShadow: `0 0 12px ${ORANGE}88`,
                  }}
                >
                  ▶ &nbsp; PLAYER 1 &nbsp; ◀
                </div>
              )}

              {/* ARCADE neon title */}
              {sceneStep >= 2 && (
                <div style={{ position: "relative", lineHeight: 1 }}>
                  {/* Glitch layer 1 */}
                  <div
                    aria-hidden
                    style={{
                      position: "absolute", inset: 0,
                      fontFamily: "var(--font-orbitron, monospace)",
                      fontSize: "clamp(80px, 14vw, 148px)",
                      fontWeight: 900,
                      letterSpacing: "0.06em",
                      color: RED,
                      animation: "glitch-1 0.35s ease-in-out 2",
                      clipPath: "inset(0 0 60% 0)",
                      whiteSpace: "nowrap",
                      opacity: 0.5,
                    }}
                  >ARCADE</div>
                  {/* Glitch layer 2 */}
                  <div
                    aria-hidden
                    style={{
                      position: "absolute", inset: 0,
                      fontFamily: "var(--font-orbitron, monospace)",
                      fontSize: "clamp(80px, 14vw, 148px)",
                      fontWeight: 900,
                      letterSpacing: "0.06em",
                      color: ORANGE,
                      animation: "glitch-2 0.35s ease-in-out 2",
                      clipPath: "inset(60% 0 0 0)",
                      whiteSpace: "nowrap",
                      opacity: 0.4,
                    }}
                  >ARCADE</div>
                  {/* Main neon text */}
                  <div
                    style={{
                      fontFamily: "var(--font-orbitron, monospace)",
                      fontSize: "clamp(80px, 14vw, 148px)",
                      fontWeight: 900,
                      letterSpacing: "0.06em",
                      whiteSpace: "nowrap",
                      color: "#fff",
                      textShadow: `
                        0 0 7px #fff,
                        0 0 10px #fff,
                        0 0 21px #fff,
                        0 0 42px ${RED},
                        0 0 82px ${RED},
                        0 0 92px ${RED},
                        0 0 102px ${RED}
                      `,
                      animation: "neon-flicker 0.5s ease forwards, neon-steady 3s ease-in-out infinite 0.6s",
                    }}
                  >ARCADE</div>
                </div>
              )}

              {/* Bottom marquee bar */}
              {sceneStep >= 2 && (
                <div
                  style={{
                    display: "flex", alignItems: "center", gap: 16,
                    width: "100%", maxWidth: 820, marginTop: 28,
                    animation: "subtitle-in 0.5s ease forwards",
                  }}
                >
                  <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.12))` }} />
                  <span style={{
                    fontFamily: "var(--font-rajdhani, sans-serif)",
                    fontSize: "clamp(9px, 1.1vw, 13px)",
                    fontWeight: 700,
                    letterSpacing: "0.5em",
                    color: "rgba(255,255,255,0.22)",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}>
                    AKASH · VARMA
                  </span>
                  <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, rgba(255,255,255,0.12), transparent)` }} />
                </div>
              )}

              {/* Loading + INSERT COIN */}
              {sceneStep >= 3 && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, marginTop: 32, animation: "subtitle-in 0.5s ease forwards" }}>
                  {/* Progress bar */}
                  <div
                    style={{
                      width: "min(280px, 45vw)",
                      height: 3,
                      background: "rgba(255,255,255,0.07)",
                      borderRadius: 2,
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        background: `linear-gradient(90deg, ${RED}, ${ORANGE}, #fff)`,
                        animation: "load-bar 1.3s cubic-bezier(0.4, 0, 0.2, 1) forwards",
                        boxShadow: `0 0 10px ${RED}88`,
                        borderRadius: 2,
                      }}
                    />
                  </div>

                  {/* INSERT COIN */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 20, height: 1, background: `rgba(255,45,85,0.3)` }} />
                    <span
                      style={{
                        fontFamily: "var(--font-orbitron, monospace)",
                        fontSize: "clamp(8px, 1vw, 11px)",
                        fontWeight: 700,
                        letterSpacing: "0.45em",
                        color: RED,
                        textTransform: "uppercase",
                        animation: "curtain-blink 0.85s ease-in-out infinite",
                        textShadow: `0 0 10px ${RED}`,
                      }}
                    >
                      INSERT COIN
                    </span>
                    <div style={{ width: 20, height: 1, background: `rgba(255,45,85,0.3)` }} />
                  </div>
                </div>
              )}
            </div>

            {/* ── Corner brackets ── */}
            {sceneStep >= 1 && (
              <>
                {[
                  { top: 20, left: 20, bt: true, bl: true },
                  { top: 20, right: 20, bt: true, br: true },
                  { bottom: 20, left: 20, bb: true, bl: true },
                  { bottom: 20, right: 20, bb: true, br: true },
                ].map((c, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      width: 36, height: 36,
                      top: "top" in c ? c.top : undefined,
                      bottom: "bottom" in c ? c.bottom : undefined,
                      left: "left" in c ? c.left : undefined,
                      right: "right" in c ? c.right : undefined,
                      borderTop: "bt" in c && c.bt ? `2px solid rgba(255,45,85,0.55)` : undefined,
                      borderBottom: "bb" in c && c.bb ? `2px solid rgba(255,45,85,0.55)` : undefined,
                      borderLeft: "bl" in c && c.bl ? `2px solid rgba(255,45,85,0.55)` : undefined,
                      borderRight: "br" in c && c.br ? `2px solid rgba(255,45,85,0.55)` : undefined,
                      opacity: 0,
                      animation: `corner-in 0.5s ease forwards ${0.25 + i * 0.08}s`,
                      boxShadow: i % 2 === 0
                        ? `inset 2px 2px 6px rgba(255,45,85,0.15)`
                        : `inset -2px 2px 6px rgba(255,107,45,0.15)`,
                    }}
                  />
                ))}
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
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes curtain-blink {
          0%, 45%  { opacity: 1; }
          50%      { opacity: 0.05; }
          55%, 100%{ opacity: 1; }
        }

        @keyframes diamond-pulse {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(255,45,85,0.6)); }
          50%      { transform: scale(1.15); filter: drop-shadow(0 0 16px rgba(255,45,85,0.9)); }
        }

        @keyframes neon-flicker {
          0%   { opacity: 0; }
          10%  { opacity: 1; }
          11%  { opacity: 0.4; }
          14%  { opacity: 1; }
          15%  { opacity: 0.6; }
          18%  { opacity: 1; }
          100% { opacity: 1; }
        }

        @keyframes neon-steady {
          0%, 100% { text-shadow: 0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, 0 0 42px #ff2d55, 0 0 82px #ff2d55, 0 0 92px #ff2d55, 0 0 102px #ff2d55; }
          50%      { text-shadow: 0 0 4px #fff, 0 0 7px #fff, 0 0 13px #fff, 0 0 30px #ff2d55, 0 0 60px #ff2d55, 0 0 70px #ff2d55, 0 0 80px #ff2d55; }
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
          to   { width: 100%; opacity: 1; }
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
