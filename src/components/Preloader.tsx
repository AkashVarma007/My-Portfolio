"use client";

import { useEffect, useRef, useState } from "react";

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);
  const counterRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const duration = 1800;
    const steps = 100;
    const interval = duration / steps;
    let step = 0;

    counterRef.current = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      setCount(Math.round(eased * 100));

      if (step >= steps) {
        if (counterRef.current) clearInterval(counterRef.current);
        setTimeout(() => {
          setExiting(true);
          setTimeout(() => {
            setVisible(false);
            onComplete();
          }, 700);
        }, 250);
      }
    }, interval);

    return () => {
      if (counterRef.current) clearInterval(counterRef.current);
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "var(--color-bg, #050508)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        animation: exiting
          ? "pl-exit 0.7s cubic-bezier(0.76, 0, 0.24, 1) forwards"
          : undefined,
      }}
    >
      {/* ── Decorative ghost text behind everything ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily: "var(--font-bricolage), var(--font-display), sans-serif",
          fontSize: "clamp(10rem, 30vw, 26rem)",
          fontWeight: 900,
          letterSpacing: "-8px",
          color: "transparent",
          WebkitTextStroke: "1px rgba(255,255,255,0.04)",
          whiteSpace: "nowrap",
          userSelect: "none",
          pointerEvents: "none",
          lineHeight: 1,
          opacity: 0,
          animation: "pl-ghost-in 1.2s ease 0.1s forwards",
        }}
      >
        AV
      </div>

      {/* ── Ambient orb — top right ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "45vw",
          height: "45vw",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(196,247,81,0.055) 0%, transparent 65%)",
          pointerEvents: "none",
          opacity: 0,
          animation: "pl-ghost-in 1.4s ease 0.2s forwards",
        }}
      />

      {/* ── Ambient orb — bottom left ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "-10%",
          left: "-5%",
          width: "35vw",
          height: "35vw",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(196,247,81,0.03) 0%, transparent 65%)",
          pointerEvents: "none",
          opacity: 0,
          animation: "pl-ghost-in 1.4s ease 0.3s forwards",
        }}
      />

      {/* ── Centre content ── */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          padding: "0 clamp(24px, 6vw, 80px)",
          width: "100%",
          maxWidth: 900,
        }}
      >
        {/* Label row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: "clamp(16px, 2.5vw, 28px)",
            overflow: "hidden",
          }}
        >
          <span
            style={{
              display: "block",
              width: 24,
              height: 1,
              background: "var(--color-accent, #c4f751)",
              opacity: 0,
              animation: "pl-line-in 0.5s ease 0.15s forwards",
            }}
          />
          <span
            style={{
              display: "block",
              fontFamily: "var(--font-mono), monospace",
              fontSize: "clamp(0.45rem, 1vw, 0.58rem)",
              letterSpacing: "5px",
              textTransform: "uppercase" as const,
              color: "rgba(255,255,255,0.35)",
              opacity: 0,
              animation: "pl-line-in 0.5s ease 0.25s forwards",
            }}
          >
            Portfolio
          </span>
        </div>

        {/* Name — AKASH */}
        <div style={{ overflow: "hidden", lineHeight: 0.9 }}>
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--font-bricolage), var(--font-display), sans-serif",
              fontSize: "clamp(3.5rem, 10vw, 8.5rem)",
              fontWeight: 900,
              letterSpacing: "-3px",
              color: "#fff",
              clipPath: "inset(0 100% 0 0)",
              animation:
                "pl-clip-reveal 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.25s forwards",
            }}
          >
            AKASH
          </h1>
        </div>

        {/* Name — VARMA with serif italic treatment */}
        <div style={{ overflow: "hidden", lineHeight: 0.9, marginBottom: "clamp(28px, 4vw, 48px)" }}>
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--font-bricolage), var(--font-display), sans-serif",
              fontSize: "clamp(3.5rem, 10vw, 8.5rem)",
              fontWeight: 900,
              letterSpacing: "-3px",
              color: "transparent",
              WebkitTextStroke: "1.5px rgba(255,255,255,0.5)",
              clipPath: "inset(0 100% 0 0)",
              animation:
                "pl-clip-reveal 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.38s forwards",
            }}
          >
            VARMA
            <span
              style={{
                fontFamily: "var(--font-serif), Georgia, serif",
                fontStyle: "italic",
                fontWeight: 400,
                WebkitTextStroke: "1px rgba(196,247,81,0.7)",
                fontSize: "0.6em",
                letterSpacing: "0px",
                verticalAlign: "middle",
                marginLeft: "0.15em",
              }}
            >
              .
            </span>
          </h1>
        </div>

        {/* Divider line + counter row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            width: "100%",
            marginBottom: "clamp(14px, 2vw, 20px)",
          }}
        >
          {/* Growing accent line */}
          <div
            style={{
              flex: 1,
              height: 1,
              background: "rgba(255,255,255,0.08)",
              position: "relative",
              overflow: "hidden",
              opacity: 0,
              animation: "pl-ghost-in 0.3s ease 0.5s forwards",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: "0 auto 0 0",
                width: `${count}%`,
                background: "var(--color-accent, #c4f751)",
                boxShadow: "0 0 8px rgba(196,247,81,0.5)",
                transition: "width 0.06s linear",
              }}
            />
          </div>

          {/* Counter */}
          <span
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: "clamp(0.65rem, 1.4vw, 0.85rem)",
              letterSpacing: "2px",
              color: "rgba(255,255,255,0.35)",
              flexShrink: 0,
              fontVariantNumeric: "tabular-nums",
              opacity: 0,
              animation: "pl-ghost-in 0.3s ease 0.55s forwards",
            }}
          >
            {String(count).padStart(2, "0")}
            <span style={{ color: "var(--color-accent, #c4f751)" }}>%</span>
          </span>
        </div>

        {/* Tagline */}
        <p
          style={{
            margin: 0,
            fontFamily: "var(--font-mono), monospace",
            fontSize: "clamp(0.45rem, 1vw, 0.58rem)",
            letterSpacing: "5px",
            textTransform: "uppercase" as const,
            color: "rgba(255,255,255,0.18)",
            opacity: 0,
            animation: "pl-ghost-in 0.5s ease 0.7s forwards",
          }}
        >
          Systems &amp; Platform Engineering
        </p>
      </div>

      <style>{`
        @keyframes pl-clip-reveal {
          from { clip-path: inset(0 100% 0 0); }
          to   { clip-path: inset(0 0% 0 0); }
        }
        @keyframes pl-ghost-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes pl-line-in {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes pl-exit {
          0%   { transform: translateY(0);     opacity: 1; }
          100% { transform: translateY(-100%); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
