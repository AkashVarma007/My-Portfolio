"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FadeUp } from "./RevealText";
import { useHunt } from "@/context/HuntContext";

const timeline = [
  {
    year: "Y1",
    phase: "The Foundation",
    role: "Dotnet Developer @ Varsun eTechnologies",
    period: "2022 – 2023",
    text: "Joined as an ASP.NET developer; pivoted within months to React + Node.js after being deployed to Varsun's client WaveFuel for their core EV charging product. Led client-side OCPP 1.6J integration for chargers. Designed a multi-site EV management dashboard (backend + frontend) with real-time utilization and power-consumption analytics.",
    stack: ["React", "Node.js", "OCPP 1.6J", "ASP.NET"],
    accentColor: "var(--color-accent-3)",
    glowColor: "rgba(251,146,60,0.18)",
    borderColor: "rgba(251,146,60,0.18)",
    numberColor: "rgba(251,146,60,0.15)",
  },
  {
    year: "Y2",
    phase: "The Architect",
    role: "Dotnet Developer @ Varsun eTechnologies (consulted to WaveFuel)",
    period: "2023 – 2024",
    text: "Continued on Varsun payroll, consulting to WaveFuel's core product. Architected FUS Script — a custom DSL with runtime parser — as the extensibility layer of a device-agnostic IoT platform (HTTP + MQTT + WebSocket), enabling runtime-defined device schemas and field-level transformations including RSA encryption. Built a Redis-routed distributed WebSocket layer resolving cross-instance routing under load-balanced scaling. Shipped the React Native companion app. Delivered a Sonar-based audio analysis tool (Python + Next.js heatmap UI).",
    stack: ["FUS Script DSL", "Redis", "MQTT", "WebSockets", "React Native"],
    accentColor: "var(--color-accent-2)",
    glowColor: "rgba(129,140,248,0.18)",
    borderColor: "rgba(129,140,248,0.18)",
    numberColor: "rgba(129,140,248,0.12)",
  },
  {
    year: "Y3",
    phase: "The Builder",
    role: "Full Stack Developer @ WaveFuel Solutions",
    period: "2024 – Present",
    text: "Converted to WaveFuel FTE. Built a drag-and-drop form builder with embeddable iframe output. Shipped the IoT companion app (React Native) to Play Store and App Store. Designed MCP (Model Context Protocol) tools exposing platform actions to LLM agents for natural-language device control. Built a reusable digital twin simulation engine (initial vertical: dairy industry). Mentoring 2 junior engineers and 1 intern as the team scaled from 5 to 8+.",
    stack: ["Form Builder", "MCP Tools", "Digital Twin", "Mentorship"],
    accentColor: "var(--color-accent)",
    glowColor: "rgba(196,247,81,0.18)",
    borderColor: "rgba(196,247,81,0.18)",
    numberColor: "rgba(196,247,81,0.1)",
  },
];

function JourneyCard({
  item,
  index,
  side,
}: {
  item: typeof timeline[0];
  index: number;
  side: "left" | "right";
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timeoutId: ReturnType<typeof setTimeout>;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timeoutId = setTimeout(() => setVisible(true), index * 150);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [index]);

  return (
    <div
      ref={ref}
      className="gsap-journey-card"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateX(0) translateY(0)"
          : side === "left"
          ? "translateX(-32px) translateY(10px)"
          : "translateX(32px) translateY(10px)",
        transition: "opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1)",
        position: "relative",
      }}
    >
      {/* Glow behind card */}
      <div
        style={{
          position: "absolute",
          inset: "-20px",
          background: `radial-gradient(ellipse at center, ${item.glowColor} 0%, transparent 70%)`,
          pointerEvents: "none",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.8s ease 0.3s",
          borderRadius: "24px",
        }}
      />

      {/* The card */}
      <div
        style={{
          background: "var(--color-bg-card)",
          border: `1px solid ${item.borderColor}`,
          borderRadius: "16px",
          padding: "24px 26px",
          position: "relative",
          overflow: "hidden",
          transition: "box-shadow 0.3s ease, border-color 0.3s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 40px ${item.glowColor}`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
        }}
      >
        {/* Large faint year number in background */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: "-12px",
            right: "12px",
            fontFamily: "var(--font-display)",
            fontSize: "6rem",
            fontWeight: 900,
            color: item.numberColor,
            lineHeight: 1,
            pointerEvents: "none",
            userSelect: "none",
            letterSpacing: "-4px",
          }}
        >
          {item.year}
        </div>

        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "16px",
            right: "16px",
            height: "1px",
            background: `linear-gradient(90deg, transparent, ${item.accentColor}, transparent)`,
            opacity: 0.6,
          }}
        />

        {/* Phase */}
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.15rem",
            fontWeight: 800,
            letterSpacing: "-0.5px",
            color: "var(--color-text)",
            marginBottom: "4px",
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
          }}
        >
          {item.role} &nbsp;·&nbsp; {item.period}
        </div>

        {/* Text */}
        <p
          style={{
            fontSize: "0.82rem",
            color: "var(--color-text-dim)",
            lineHeight: 1.8,
            marginBottom: "18px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {item.text}
        </p>

        {/* Stack */}
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
                padding: "3px 9px",
                borderRadius: "100px",
                border: `1px solid ${item.borderColor}`,
                color: item.accentColor,
                background: `${item.accentColor}10`,
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

// Floating decorative dots along the timeline
function FloatingDots() {
  const dots = [15, 35, 55, 72, 88];
  return (
    <>
      {dots.map((top) => (
        <div
          key={top}
          style={{
            position: "absolute",
            top: `${top}%`,
            left: "50%",
            transform: "translateX(-50%)",
            width: "3px",
            height: "3px",
            borderRadius: "50%",
            background: "rgba(196,247,81,0.2)",
            animation: `timeline-dot-pulse 3s ease-in-out infinite`,
            animationDelay: `${top * 0.04}s`,
          }}
        />
      ))}
    </>
  );
}

const CLUE7_SEQUENCE = ["Y3", "Y1", "Y2"];

// Desktop: alternating left/right timeline
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
        const tween = gsap.fromTo(
          line,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: line,
              start: "top 80%",
              end: "bottom 20%",
              scrub: 0.5,
            },
          }
        );
        cleanup = () => { tween.kill(); tween.scrollTrigger?.kill(); };
      } catch {
        if (lineRef.current) lineRef.current.style.transform = "scaleY(1)";
      }
    })();
    return () => { mounted = false; cleanup?.(); };
  }, []);

  return (
    <div style={{ position: "relative" }}>
      {/* Center timeline spine */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          bottom: 0,
          width: "2px",
          transform: "translateX(-50%)",
          background: "rgba(255,255,255,0.05)",
          zIndex: 0,
        }}
      >
        {/* The animated fill line */}
        <div
          ref={lineRef}
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, var(--color-accent-3) 0%, var(--color-accent-2) 50%, var(--color-accent) 100%)",
            transformOrigin: "top center",
            transform: "scaleY(0)",
            borderRadius: "2px",
          }}
        />
        <FloatingDots />
      </div>

      {/* Timeline items */}
      <div style={{ display: "flex", flexDirection: "column", gap: "64px", paddingBottom: "32px" }}>
        {timeline.map((item, i) => {
          const side = i % 2 === 0 ? "left" : "right";
          return (
            <div
              key={item.year}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 64px 1fr",
                alignItems: "center",
                gap: "0",
              }}
            >
              {/* Left slot */}
              <div style={{ paddingRight: "32px", paddingLeft: "0" }}>
                {side === "left" ? (
                  <JourneyCard item={item} index={i} side="left" />
                ) : (
                  // Connector line from right card to spine
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                    <div
                      style={{
                        height: "1px",
                        width: "100%",
                        background: `linear-gradient(90deg, transparent, ${item.borderColor})`,
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Center badge */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
                <YearBadge item={item} clue7Found={clue7Found} onClick={() => onYearClick?.(item.year)} />
              </div>

              {/* Right slot */}
              <div style={{ paddingLeft: "32px", paddingRight: "0" }}>
                {side === "right" ? (
                  <JourneyCard item={item} index={i} side="right" />
                ) : (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        height: "1px",
                        width: "100%",
                        background: `linear-gradient(90deg, ${item.borderColor}, transparent)`,
                      }}
                    />
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

function YearBadge({ item, onClick, clue7Found }: { item: typeof timeline[0]; onClick?: () => void; clue7Found?: boolean }) {
  return (
    <div
      onClick={clue7Found && onClick ? onClick : undefined}
      style={{
        width: "52px",
        height: "52px",
        borderRadius: "50%",
        background: "var(--color-bg-elevated)",
        border: `2px solid ${item.accentColor}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 0 20px ${item.glowColor}, 0 0 0 4px rgba(255,255,255,0.03)`,
        position: "relative",
        zIndex: 2,
        animation: "badge-pulse 2.5s ease-in-out infinite",
        cursor: clue7Found ? "pointer" : "default",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "0.72rem",
          fontWeight: 800,
          color: item.accentColor,
          letterSpacing: "0.5px",
        }}
      >
        {item.year}
      </span>
      {/* Outer pulse ring */}
      <div
        style={{
          position: "absolute",
          inset: "-6px",
          borderRadius: "50%",
          border: `1px solid ${item.accentColor}`,
          opacity: 0.2,
          animation: "ring-pulse 2.5s ease-in-out infinite",
        }}
      />
    </div>
  );
}

// Mobile: left-aligned vertical layout
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
        const tween = gsap.fromTo(
          line,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: line,
              start: "top 85%",
              end: "bottom 30%",
              scrub: 0.5,
            },
          }
        );
        cleanup = () => { tween.kill(); tween.scrollTrigger?.kill(); };
      } catch {
        if (lineRef.current) lineRef.current.style.transform = "scaleY(1)";
      }
    })();
    return () => { mounted = false; cleanup?.(); };
  }, []);

  return (
    <div style={{ position: "relative", paddingLeft: "36px" }}>
      {/* Left spine */}
      <div
        style={{
          position: "absolute",
          left: "10px",
          top: 0,
          bottom: 0,
          width: "2px",
          background: "rgba(255,255,255,0.05)",
        }}
      >
        <div
          ref={lineRef}
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, var(--color-accent-3) 0%, var(--color-accent-2) 50%, var(--color-accent) 100%)",
            transformOrigin: "top center",
            transform: "scaleY(0)",
            borderRadius: "2px",
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
        {timeline.map((item, i) => (
          <div key={item.year} style={{ position: "relative" }}>
            {/* Badge on the line */}
            <div
              onClick={clue7Found && onYearClick ? () => onYearClick(item.year) : undefined}
              style={{
                position: "absolute",
                left: "-43px",
                top: "20px",
                width: "26px",
                height: "26px",
                borderRadius: "50%",
                background: "var(--color-bg-elevated)",
                border: `2px solid ${item.accentColor}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 0 12px ${item.glowColor}`,
                zIndex: 2,
                cursor: clue7Found ? "pointer" : "default",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.5rem",
                  fontWeight: 800,
                  color: item.accentColor,
                }}
              >
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
    <section id="journey" className="py-24 md:py-36 relative z-[1]">
      {/* CSS keyframes injected via style tag */}
      <style>{`
        @keyframes badge-pulse {
          0%, 100% { box-shadow: 0 0 20px var(--pulse-glow, rgba(196,247,81,0.18)), 0 0 0 4px rgba(255,255,255,0.03); }
          50% { box-shadow: 0 0 32px var(--pulse-glow, rgba(196,247,81,0.28)), 0 0 0 6px rgba(255,255,255,0.05); }
        }
        @keyframes ring-pulse {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.15); opacity: 0.08; }
        }
        @keyframes timeline-dot-pulse {
          0%, 100% { opacity: 0.15; transform: translateX(-50%) scale(1); }
          50% { opacity: 0.5; transform: translateX(-50%) scale(1.6); }
        }
      `}</style>

      {/* Subtle radial bg */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "700px",
          height: "500px",
          background: "radial-gradient(ellipse at center, rgba(196,247,81,0.025) 0%, transparent 65%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Decorative large "03" in background */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "8%",
          left: "-2%",
          fontFamily: "var(--font-display)",
          fontSize: "clamp(6rem,20vw,18rem)",
          fontWeight: 900,
          letterSpacing: "-8px",
          color: "transparent",
          WebkitTextStroke: "1px rgba(255,255,255,0.025)",
          pointerEvents: "none",
          userSelect: "none",
          lineHeight: 1,
          zIndex: 0,
        }}
      >
        03
      </div>

      <div className="max-w-[1300px] mx-auto px-6 md:px-12 relative" style={{ zIndex: 1 }}>
        <FadeUp>
          <span className="font-code text-[0.55rem] tracking-[6px] uppercase text-text-muted block mb-4">
            03 / Journey
          </span>
        </FadeUp>
        <FadeUp delay={0.08}>
          <h2 className="font-display text-[clamp(1.6rem,4vw,3.2rem)] font-extrabold tracking-[-2px] leading-[1.1] mb-14">
            The <span className="serif-italic font-normal">evolution</span>
          </h2>
        </FadeUp>

        {/* Desktop layout */}
        <div className="hidden md:block">
          <DesktopTimeline clue7Found={clue7Found} onYearClick={handleYearClick} />
        </div>

        {/* Mobile layout */}
        <div className="block md:hidden">
          <MobileTimeline clue7Found={clue7Found} onYearClick={handleYearClick} />
        </div>
      </div>
    </section>
  );
}
