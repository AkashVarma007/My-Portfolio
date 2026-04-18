"use client";

import { useCallback, useRef, useState } from "react";
import { FadeUp } from "./RevealText";
import { useHunt } from "@/context/HuntContext";

const skills = [
  {
    title: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "SQL", "DSL Design"],
    tier: "Daily Driver",
    color: "var(--color-accent)",
    glow: "rgba(196,247,81,0.35)",
  },
  {
    title: "Frontend",
    items: ["React", "Next.js", "React Native"],
    tier: "Daily Driver",
    color: "var(--color-accent-2)",
    glow: "rgba(129,140,248,0.35)",
  },
  {
    title: "Backend",
    items: ["Node.js", "Express.js", "Prisma ORM", "REST APIs"],
    tier: "Daily Driver",
    color: "var(--color-accent)",
    glow: "rgba(196,247,81,0.35)",
  },
  {
    title: "DevOps",
    items: ["Docker", "Redis", "PostgreSQL", "GitHub Actions", "Linux / Bash"],
    tier: "Comfortable",
    color: "var(--color-accent-3)",
    glow: "rgba(251,146,60,0.35)",
  },
  {
    title: "IoT & Protocols",
    items: ["MQTT", "WebSockets", "OCPP 1.6J", "HTTP", "Event-Driven"],
    tier: "Daily Driver",
    color: "var(--color-accent)",
    glow: "rgba(196,247,81,0.35)",
  },
  {
    title: "Domain",
    items: ["FUS Script DSL", "RSA Encryption", "Digital Twin", "MCP Tools", "Audio DSP"],
    tier: "Domain",
    color: "var(--color-accent-2)",
    glow: "rgba(129,140,248,0.35)",
  },
  {
    title: "Exploring",
    items: ["Go (job-manager)", "C# / ASP.NET", "Distributed Systems depth"],
    tier: "Working Knowledge",
    color: "var(--color-accent-3)",
    glow: "rgba(251,146,60,0.35)",
  },
];

const sizeMap: Record<number, { fontSize: string; fontWeight: number; opacity: number }> = {
  5: { fontSize: "1.15rem", fontWeight: 700, opacity: 1 },
  4: { fontSize: "0.95rem", fontWeight: 600, opacity: 0.9 },
  3: { fontSize: "0.82rem", fontWeight: 500, opacity: 0.75 },
  2: { fontSize: "0.72rem", fontWeight: 400, opacity: 0.55 },
  1: { fontSize: "0.64rem", fontWeight: 400, opacity: 0.4 },
};

// Tech cloud: all techs with a weight for sizing
const techCloud = [
  { name: "TypeScript", weight: 5 },
  { name: "React", weight: 5 },
  { name: "Node.js", weight: 5 },
  { name: "Next.js", weight: 4 },
  { name: "WebSockets", weight: 4 },
  { name: "OCPP 1.6J", weight: 4 },
  { name: "Docker", weight: 4 },
  { name: "Redis", weight: 4 },
  { name: "FUS Script DSL", weight: 4 },
  { name: "PostgreSQL", weight: 3 },
  { name: "Python", weight: 3 },
  { name: "React Native", weight: 3 },
  { name: "Prisma ORM", weight: 3 },
  { name: "MCP Tools", weight: 3 },
  { name: "MQTT", weight: 3 },
  { name: "GitHub Actions", weight: 2 },
  { name: "JavaScript", weight: 2 },
  { name: "SQL", weight: 2 },
  { name: "Linux / Bash", weight: 2 },
  { name: "REST APIs", weight: 2 },
  { name: "Express.js", weight: 2 },
  { name: "Distributed Systems", weight: 2 },
  { name: "RSA Encryption", weight: 2 },
  { name: "Digital Twin", weight: 2 },
  { name: "HTTP", weight: 1 },
  { name: "Event-Driven", weight: 1 },
  { name: "Go", weight: 1 },
  { name: "C# / ASP.NET", weight: 1 },
];

function SkillBar({ skill, clue8Found, onTierClick }: { skill: typeof skills[0]; clue8Found?: boolean; onTierClick?: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="gsap-skill-card group relative"
      style={{
        background: hovered
          ? "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))"
          : "var(--color-bg-card)",
        border: `1px solid ${hovered ? `rgba(255,255,255,0.12)` : "rgba(255,255,255,0.05)"}`,
        borderRadius: "14px",
        padding: "20px 22px",
        transition: "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
        boxShadow: hovered ? `0 0 28px ${skill.glow}` : "none",
        cursor: "default",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top accent line on hover */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "12px",
          right: "12px",
          height: "1px",
          background: `linear-gradient(90deg, transparent, ${skill.color}, transparent)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s ease",
          borderRadius: "1px",
        }}
      />

      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px", gap: "10px" }}>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.8rem",
            fontWeight: 700,
            letterSpacing: "-0.2px",
            color: hovered ? skill.color : "var(--color-text)",
            transition: "color 0.3s ease",
          }}
        >
          {skill.title}
        </span>
        <span
          onClick={clue8Found && onTierClick ? onTierClick : undefined}
          style={{
            fontFamily: "var(--font-code)",
            fontSize: "0.52rem",
            letterSpacing: "1.6px",
            textTransform: "uppercase",
            padding: "3px 9px",
            borderRadius: "100px",
            color: skill.color,
            border: `1px solid ${skill.color}40`,
            background: `${skill.color}10`,
            transition: "color 0.3s ease, border-color 0.3s ease, background 0.3s ease",
            cursor: clue8Found ? "pointer" : "default",
            whiteSpace: "nowrap",
          }}
        >
          {skill.tier}
        </span>
      </div>

      {/* Skill pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {skill.items.map((item) => (
          <span
            key={item}
            style={{
              fontFamily: "var(--font-code)",
              fontSize: "0.57rem",
              padding: "3px 9px",
              borderRadius: "6px",
              border: `1px solid ${hovered ? `${skill.color}30` : "rgba(255,255,255,0.08)"}`,
              color: hovered ? skill.color : "var(--color-text-dim)",
              background: hovered ? `${skill.color}08` : "transparent",
              transition: "all 0.25s ease",
              letterSpacing: "0.3px",
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function TechCloud() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "10px 16px",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 24px",
        background: "var(--color-bg-elevated)",
        border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: "16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow blob */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: "300px",
          height: "200px",
          background: "radial-gradient(ellipse, rgba(196,247,81,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      {techCloud.map(({ name, weight }) => {
        const style = sizeMap[weight] ?? sizeMap[1];
        const isActive = active === name;
        const isDimmed = active !== null && !isActive;
        return (
          <span
            key={name}
            onMouseEnter={() => setActive(name)}
            onMouseLeave={() => setActive(null)}
            style={{
              fontFamily: weight >= 4 ? "var(--font-display)" : "var(--font-code)",
              fontSize: style.fontSize,
              fontWeight: style.fontWeight,
              color: isActive
                ? "var(--color-accent)"
                : isDimmed
                ? "var(--color-text-muted)"
                : "var(--color-text-dim)",
              opacity: isDimmed ? 0.3 : style.opacity,
              transition: "all 0.2s ease",
              cursor: "default",
              letterSpacing: weight >= 4 ? "-0.3px" : "0.5px",
              textShadow: isActive ? "0 0 16px rgba(196,247,81,0.6)" : "none",
              transform: isActive ? "scale(1.12) translateY(-1px)" : "scale(1)",
              display: "inline-block",
            }}
          >
            {name}
          </span>
        );
      })}
    </div>
  );
}

export function Skills() {
  const { isClueFound, canAttemptClue, unlockClue } = useHunt();
  const clue8Found = isClueFound(8);
  const clickedTiers = useRef(new Set<number>());

  const handleTierClick = useCallback((index: number) => {
    if (!canAttemptClue(9)) return;
    clickedTiers.current.add(index);
    if (clickedTiers.current.size >= skills.length) {
      unlockClue(9);
      clickedTiers.current.clear();
    }
  }, [canAttemptClue, unlockClue]);

  return (
    <section id="skills" className="py-24 md:py-36 relative z-[1]">
      {/* Diagonal line background pattern */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 40px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Decorative large faint "STACK" text */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "50%",
          right: "-2%",
          transform: "translateY(-50%)",
          fontFamily: "var(--font-display)",
          fontSize: "clamp(6rem, 18vw, 16rem)",
          fontWeight: 900,
          letterSpacing: "-6px",
          color: "transparent",
          WebkitTextStroke: "1px rgba(255,255,255,0.03)",
          pointerEvents: "none",
          userSelect: "none",
          lineHeight: 1,
          zIndex: 0,
        }}
      >
        STACK
      </div>

      <div className="max-w-[1300px] mx-auto px-6 md:px-12 relative" style={{ zIndex: 1 }}>
        <FadeUp>
          <span className="font-code text-[0.55rem] tracking-[6px] uppercase text-text-muted block mb-4">
            04 / Skills
          </span>
        </FadeUp>
        <FadeUp delay={0.08}>
          <h2 className="font-display text-[clamp(1.6rem,4vw,3.2rem)] font-extrabold tracking-[-2px] leading-[1.1] mb-4">
            Tools of the{" "}
            <span className="serif-italic font-normal">trade</span>
          </h2>
        </FadeUp>

        <FadeUp delay={0.14}>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.85rem",
              color: "var(--color-text-muted)",
              marginBottom: "48px",
              maxWidth: "480px",
              lineHeight: 1.7,
            }}
          >
            A living stack — hover each category to explore it.
          </p>
        </FadeUp>

        {/* Skill bars grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          {skills.map((skill, i) => (
            <SkillBar key={skill.title} skill={skill} clue8Found={clue8Found} onTierClick={() => handleTierClick(i)} />
          ))}
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 20%, rgba(196,247,81,0.12) 50%, rgba(255,255,255,0.06) 80%, transparent)",
            margin: "36px 0",
          }}
        />

        {/* Tech cloud label */}
        <FadeUp delay={0.1}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-code)",
                fontSize: "0.55rem",
                letterSpacing: "4px",
                textTransform: "uppercase",
                color: "var(--color-text-muted)",
              }}
            >
              Tech Cloud
            </span>
            <div
              style={{
                flex: 1,
                height: "1px",
                background: "rgba(255,255,255,0.05)",
              }}
            />
          </div>
        </FadeUp>

        <FadeUp delay={0.16}>
          <TechCloud />
        </FadeUp>
      </div>
    </section>
  );
}
