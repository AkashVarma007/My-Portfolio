"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useHunt } from "@/context/HuntContext";

const AMBER = "#f5c418";
const AMBER_DIM = "rgba(245,196,24,0.55)";
const CHARCOAL = "#111110";

const timeline = [
  {
    year: "Y1",
    phase: "The Foundation",
    role: "Software Engineer @ Varsun eTechnologies",
    period: "2022 – 2023",
    text: "Pivoted from ASP.NET to React & Node.js. Built an EV charger platform with OCPP 1.6 — real-time monitoring, dashboards, and analytics. Delivered a full client product from scratch.",
    stack: ["React", "Node.js", "OCPP 1.6", "EV Infra"],
    accentColor: "rgba(245,196,24,0.7)",
    glowColor: "rgba(245,196,24,0.12)",
    borderColor: "rgba(245,196,24,0.18)",
  },
  {
    year: "Y2",
    phase: "The Architect",
    role: "Platform Engineer @ WaveFuel Solutions",
    period: "2023 – 2024",
    text: "Designed the IoT platform from scratch. Created FUS Script — a custom DSL. Built distributed WebSocket handling with Redis. Shipped a React Native app to both stores.",
    stack: ["DSL Design", "Redis", "WebSockets", "React Native"],
    accentColor: AMBER,
    glowColor: "rgba(245,196,24,0.18)",
    borderColor: "rgba(245,196,24,0.28)",
  },
  {
    year: "Y3",
    phase: "The Leader",
    role: "Platform Engineer @ WaveFuel Solutions",
    period: "2024 – Present",
    text: "Built form builders, MCP tools for AI chatbots, and a digital twin engine for 10K+ devices. Now mentoring 3 engineers and leading enterprise deployments worth ₹40L+.",
    stack: ["Digital Twins", "AI / MCP", "Mentorship", "Enterprise"],
    accentColor: AMBER,
    glowColor: "rgba(245,196,24,0.24)",
    borderColor: "rgba(245,196,24,0.35)",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Journey card — charcoal world
// ─────────────────────────────────────────────────────────────────────────────
function JourneyCard({ item, index, side }: { item: typeof timeline[0]; index: number; side: "left" | "right" }) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let tid: ReturnType<typeof setTimeout>;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        tid = setTimeout(() => setVisible(true), index * 150);
        io.disconnect();
      }
    }, { threshold: 0.2 });
    io.observe(el);
    return () => { clearTimeout(tid); io.disconnect(); };
  }, [index]);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : side === "left" ? "translateX(-32px)" : "translateX(32px)",
        transition: "opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Card */}
      <div
        style={{
          background: hovered ? "rgba(245,196,24,0.05)" : "rgba(255,255,255,0.03)",
          border: `1px solid ${hovered ? "rgba(245,196,24,0.3)" : "rgba(255,255,255,0.06)"}`,
          borderRadius: "16px",
          padding: "24px 26px",
          position: "relative",
          overflow: "hidden",
          transition: "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
          boxShadow: hovered ? "0 0 40px rgba(245,196,24,0.1)" : "none",
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0, left: "16px", right: "16px",
            height: "1px",
            background: `linear-gradient(90deg, transparent, ${item.accentColor}, transparent)`,
            opacity: hovered ? 1 : 0.4,
            transition: "opacity 0.3s ease",
          }}
        />

        {/* Large faint year in bg */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: "-12px", right: "12px",
            fontFamily: "var(--font-display)",
            fontSize: "6rem",
            fontWeight: 900,
            color: "rgba(245,196,24,0.07)",
            lineHeight: 1,
            pointerEvents: "none",
            userSelect: "none",
            letterSpacing: "-4px",
          }}
        >
          {item.year}
        </div>

        {/* Phase */}
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.1rem",
            fontWeight: 800,
            color: "var(--section-journey-text)",
            marginBottom: "4px",
            letterSpacing: "-0.3px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {item.phase}
        </div>

        {/* Role + period */}
        <div
          style={{
            fontFamily: "var(--font-code)",
            fontSize: "0.6rem",
            letterSpacing: "0.8px",
            color: item.accentColor,
            marginBottom: "14px",
            opacity: 0.85,
            position: "relative",
            zIndex: 1,
          }}
        >
          {item.role} &nbsp;·&nbsp; {item.period}
        </div>

        {/* Text */}
        <p
          style={{
            fontSize: "0.82rem",
            color: "rgba(245,240,232,0.6)",
            lineHeight: 1.8,
            marginBottom: "18px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {item.text}
        </p>

        {/* Stack tags */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.05)",
            paddingTop: "14px",
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {item.stack.map((tech) => (
            <span
              key={tech}
              style={{
                fontFamily: "var(--font-code)",
                fontSize: "0.55rem",
                padding: "3px 10px",
                borderRadius: "100px",
                border: `1px solid ${item.borderColor}`,
                color: item.accentColor,
                background: item.glowColor,
                letterSpacing: "0.5px",
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// Year badge
function YearBadge({ item, onClick, clue7Found }: { item: typeof timeline[0]; onClick?: () => void; clue7Found?: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={clue7Found && onClick ? onClick : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "52px", height: "52px",
        borderRadius: "50%",
        background: hovered ? "rgba(245,196,24,0.1)" : CHARCOAL,
        border: `2px solid ${AMBER}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: hovered
          ? `0 0 40px rgba(245,196,24,0.55), 0 0 0 8px rgba(245,196,24,0.08)`
          : `0 0 20px rgba(245,196,24,0.2), 0 0 0 4px rgba(255,255,255,0.02)`,
        position: "relative",
        zIndex: 2,
        cursor: clue7Found ? "pointer" : "default",
        transform: hovered ? "scale(1.12)" : "scale(1)",
        transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "0.72rem",
          fontWeight: 800,
          color: AMBER,
          letterSpacing: "0.5px",
          transform: hovered ? "scale(1.15)" : "scale(1)",
          transition: "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
          display: "inline-block",
        }}
      >
        {item.year}
      </span>
      {/* Outer ring */}
      <div
        style={{
          position: "absolute",
          inset: "-6px",
          borderRadius: "50%",
          border: `1px solid ${AMBER}`,
          opacity: 0.2,
        }}
      />
    </div>
  );
}

// Floating pulse dots on the spine
function FloatingDots() {
  return (
    <>
      {[15, 35, 55, 72, 88].map((top) => (
        <div
          key={top}
          style={{
            position: "absolute",
            top: `${top}%`,
            left: "50%",
            transform: "translateX(-50%)",
            width: "3px", height: "3px",
            borderRadius: "50%",
            background: "rgba(245,196,24,0.3)",
            animationDelay: `${top * 0.04}s`,
          }}
        />
      ))}
    </>
  );
}

// Desktop: alternating left/right
function DesktopTimeline({ clue7Found, onYearClick }: { clue7Found?: boolean; onYearClick?: (year: string) => void }) {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    let cleanup: (() => void) | undefined;
    (async () => {
      try {
        const { default: gsap } = await import("gsap");
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        if (!mounted) return;
        gsap.registerPlugin(ScrollTrigger);
        const line = lineRef.current;
        if (!line) return;
        const tween = gsap.fromTo(line, { scaleY: 0 }, {
          scaleY: 1, ease: "none",
          scrollTrigger: { trigger: line, start: "top 80%", end: "bottom 20%", scrub: 0.5 },
        });
        cleanup = () => { tween.kill(); tween.scrollTrigger?.kill(); };
      } catch {
        if (lineRef.current) lineRef.current.style.transform = "scaleY(1)";
      }
    })();
    return () => { mounted = false; cleanup?.(); };
  }, []);

  return (
    <div style={{ position: "relative" }}>
      {/* Spine */}
      <div
        style={{
          position: "absolute",
          left: "50%", top: 0, bottom: 0,
          width: "2px",
          transform: "translateX(-50%)",
          background: "rgba(255,255,255,0.04)",
          zIndex: 0,
        }}
      >
        <div
          ref={lineRef}
          style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(180deg, ${AMBER}88 0%, ${AMBER} 100%)`,
            transformOrigin: "top center",
            transform: "scaleY(0)",
            borderRadius: "2px",
          }}
        />
        <FloatingDots />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "64px", paddingBottom: "32px" }}>
        {timeline.map((item, i) => {
          const side = i % 2 === 0 ? "left" : "right";
          return (
            <div
              key={item.year}
              style={{ display: "grid", gridTemplateColumns: "1fr 64px 1fr", alignItems: "center" }}
            >
              <div style={{ paddingRight: "32px" }}>
                {side === "left" ? (
                  <JourneyCard item={item} index={i} side="left" />
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                    <div style={{ height: "1px", width: "100%", background: `linear-gradient(90deg, transparent, ${AMBER}30)` }} />
                  </div>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
                <YearBadge item={item} clue7Found={clue7Found} onClick={() => onYearClick?.(item.year)} />
              </div>
              <div style={{ paddingLeft: "32px" }}>
                {side === "right" ? (
                  <JourneyCard item={item} index={i} side="right" />
                ) : (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ height: "1px", width: "100%", background: `linear-gradient(90deg, ${AMBER}30, transparent)` }} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Mobile: left-aligned
function MobileTimeline({ clue7Found, onYearClick }: { clue7Found?: boolean; onYearClick?: (year: string) => void }) {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    let cleanup: (() => void) | undefined;
    (async () => {
      try {
        const { default: gsap } = await import("gsap");
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        if (!mounted) return;
        gsap.registerPlugin(ScrollTrigger);
        const line = lineRef.current;
        if (!line) return;
        const tween = gsap.fromTo(line, { scaleY: 0 }, {
          scaleY: 1, ease: "none",
          scrollTrigger: { trigger: line, start: "top 85%", end: "bottom 30%", scrub: 0.5 },
        });
        cleanup = () => { tween.kill(); tween.scrollTrigger?.kill(); };
      } catch {
        if (lineRef.current) lineRef.current.style.transform = "scaleY(1)";
      }
    })();
    return () => { mounted = false; cleanup?.(); };
  }, []);

  return (
    <div style={{ position: "relative", paddingLeft: "36px" }}>
      <div style={{ position: "absolute", left: "10px", top: 0, bottom: 0, width: "2px", background: "rgba(255,255,255,0.04)" }}>
        <div
          ref={lineRef}
          style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(180deg, ${AMBER}88 0%, ${AMBER} 100%)`,
            transformOrigin: "top center",
            transform: "scaleY(0)",
            borderRadius: "2px",
          }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
        {timeline.map((item, i) => (
          <div key={item.year} style={{ position: "relative" }}>
            <div
              onClick={clue7Found && onYearClick ? () => onYearClick(item.year) : undefined}
              style={{
                position: "absolute",
                left: "-43px", top: "20px",
                width: "26px", height: "26px",
                borderRadius: "50%",
                background: CHARCOAL,
                border: `2px solid ${AMBER}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 0 12px rgba(245,196,24,0.2)`,
                zIndex: 2,
                cursor: clue7Found ? "pointer" : "default",
              }}
            >
              <span style={{ fontFamily: "var(--font-display)", fontSize: "0.5rem", fontWeight: 800, color: AMBER }}>
                {item.year}
              </span>
            </div>
            <JourneyCard item={item} index={i} side="right" />
          </div>
        ))}
      </div>
    </div>
  );
}

const CLUE7_SEQUENCE = ["Y3", "Y1", "Y2"];

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────
export function Journey() {
  const { isClueFound, canAttemptClue, unlockClue } = useHunt();
  const clue7Found = isClueFound(7);
  const yearSeqRef = useRef<string[]>([]);

  const handleYearClick = useCallback((year: string) => {
    if (!canAttemptClue(8)) return;
    const seq = yearSeqRef.current;
    seq.push(year);
    if (seq.length > 3) seq.splice(0, seq.length - 3);
    const last3 = seq.slice(-3);
    if (last3.length === 3 && last3.every((y, idx) => y === CLUE7_SEQUENCE[idx])) {
      unlockClue(8);
      yearSeqRef.current = [];
    } else if (seq.length === 3 && !last3.every((y, idx) => y === CLUE7_SEQUENCE[idx])) {
      yearSeqRef.current = [];
    }
  }, [canAttemptClue, unlockClue]);

  return (
    <section
      id="journey"
      className="section-journey relative overflow-hidden"
      style={{ padding: "clamp(80px, 10vw, 140px) 0" }}
    >
      {/* Noise texture */}
      <div
        aria-hidden
        className="noise-overlay absolute inset-0 pointer-events-none"
        style={{ opacity: 0.03 }}
      />

      {/* Amber radial glow centre */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "40%", left: "50%",
          transform: "translateX(-50%)",
          width: "800px", height: "600px",
          background: "radial-gradient(ellipse at center, rgba(245,196,24,0.04) 0%, transparent 65%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Giant faint "03" background number */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "5%", right: "-2%",
          fontFamily: "var(--font-display)",
          fontWeight: 900,
          fontSize: "clamp(8rem, 22vw, 20rem)",
          lineHeight: 0.85,
          letterSpacing: "-8px",
          color: "transparent",
          WebkitTextStroke: `1px ${AMBER}18`,
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 0,
        }}
      >
        03
      </div>

      <div
        className="max-w-[1300px] mx-auto relative"
        style={{ padding: "0 clamp(24px, 5vw, 64px)", zIndex: 1 }}
      >
        {/* Section header */}
        <div className="mb-16 gsap-fade-up">
          <div className="flex items-baseline gap-4 mb-4">
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: "clamp(2rem, 5vw, 4.5rem)",
                fontWeight: 300,
                color: `${AMBER}30`,
                lineHeight: 1,
              }}
            >
              /
            </span>
            <span
              className="gsap-section-num"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "clamp(2rem, 5vw, 4.5rem)",
                color: AMBER,
                lineHeight: 0.85,
                letterSpacing: "-4px",
              }}
            >
              03
            </span>
            <span
              style={{
                fontFamily: "var(--font-code)",
                fontSize: "0.55rem",
                letterSpacing: "4px",
                textTransform: "uppercase",
                color: AMBER_DIM,
                alignSelf: "center",
              }}
            >
              Journey
            </span>
          </div>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "clamp(2.4rem, 7vw, 6.5rem)",
              color: "var(--section-journey-text)",
              lineHeight: 0.9,
              letterSpacing: "-3px",
            }}
          >
            The{" "}
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 300,
                letterSpacing: "-2px",
                color: AMBER,
              }}
            >
              evolution
            </span>
          </h2>
        </div>

        {/* Desktop */}
        <div className="hidden md:block">
          <DesktopTimeline clue7Found={clue7Found} onYearClick={handleYearClick} />
        </div>

        {/* Mobile */}
        <div className="block md:hidden">
          <MobileTimeline clue7Found={clue7Found} onYearClick={handleYearClick} />
        </div>
      </div>
    </section>
  );
}
