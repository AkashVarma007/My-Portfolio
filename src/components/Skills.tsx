"use client";

import { useCallback, useRef, useState } from "react";
import { useHunt } from "@/context/HuntContext";

// ─────────────────────────────────────────────────────────────────────────────
// Skill categories — no percentages, just confident groupings
// ─────────────────────────────────────────────────────────────────────────────
const categories = [
  {
    num: "01",
    title: "Languages",
    tags: ["TypeScript", "JavaScript", "Python", "SQL", "DSL Design"],
    emphasis: ["TypeScript", "DSL Design"],
  },
  {
    num: "02",
    title: "Frontend",
    tags: ["React", "Next.js", "React Native", "Tailwind CSS"],
    emphasis: ["React", "React Native"],
  },
  {
    num: "03",
    title: "Backend & APIs",
    tags: ["Node.js", "Express.js", "Prisma ORM", "REST APIs", "gRPC"],
    emphasis: ["Node.js"],
  },
  {
    num: "04",
    title: "IoT & Protocols",
    tags: ["MQTT", "WebSockets", "OCPP 1.6", "HTTP", "Event-Driven", "Embedded Systems"],
    emphasis: ["MQTT", "OCPP 1.6", "WebSockets"],
  },
  {
    num: "05",
    title: "Infrastructure",
    tags: ["Docker", "Kubernetes", "Redis", "PostgreSQL", "CI/CD", "Linux", "AWS"],
    emphasis: ["Redis", "Kubernetes"],
  },
  {
    num: "06",
    title: "Architecture",
    tags: ["System Design", "DSL Engines", "Microservices", "Distributed Systems", "Event Sourcing"],
    emphasis: ["DSL Engines", "Distributed Systems"],
  },
];

// ── Tag pill with spring hover ────────────────────────────────────────────────
function TagPill({ tag, isEmphasis }: { tag: string; isEmphasis: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: isEmphasis ? "var(--font-display)" : "var(--font-code)",
        fontWeight: isEmphasis ? 700 : 400,
        fontSize: isEmphasis ? "0.85rem" : "0.65rem",
        letterSpacing: isEmphasis ? "-0.2px" : "1px",
        textTransform: isEmphasis ? "none" : "uppercase",
        padding: isEmphasis ? "6px 14px" : "5px 12px",
        borderRadius: "100px",
        background: isEmphasis
          ? hovered ? "rgba(10,10,10,0.88)" : "var(--section-light-text)"
          : hovered ? "rgba(0,0,0,0.07)" : "transparent",
        color: isEmphasis ? "var(--section-light-bg)" : "var(--section-light-text-dim)",
        border: isEmphasis ? "none" : `1px solid ${hovered ? "rgba(0,0,0,0.28)" : "rgba(0,0,0,0.15)"}`,
        transform: hovered ? "scale(1.06) translateY(-1px)" : "scale(1) translateY(0)",
        boxShadow: isEmphasis && hovered
          ? "0 6px 20px rgba(0,0,0,0.22)"
          : !isEmphasis && hovered
          ? "0 2px 10px rgba(0,0,0,0.1)"
          : "none",
        transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
        cursor: "default",
        display: "inline-block",
      }}
    >
      {tag}
    </span>
  );
}

// Hunt: clicking all category numbers unlocks a clue
function CategoryCard({
  cat,
  clue8Found,
  onNumClick,
}: {
  cat: typeof categories[0];
  index?: number;
  clue8Found?: boolean;
  onNumClick?: () => void;
}) {
  return (
    <div
      className="gsap-skill-card"
      style={{
        borderBottom: "1px solid rgba(0,0,0,0.1)",
        paddingBottom: "28px",
        marginBottom: "28px",
      }}
    >
      {/* Category row */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        {/* Category number — hidden hunt trigger */}
        <span
          onClick={clue8Found && onNumClick ? onNumClick : undefined}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: "0.75rem",
            color: "rgba(0,0,0,0.2)",
            letterSpacing: "-0.5px",
            cursor: clue8Found ? "pointer" : "default",
            userSelect: "none",
          }}
        >
          {cat.num}
        </span>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "1.05rem",
            color: "var(--section-light-text)",
            letterSpacing: "-0.3px",
          }}
        >
          {cat.title}
        </h3>
      </div>

      {/* Tags — emphasis tags are larger + filled, rest are outlined */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {cat.tags.map((tag) => (
          <TagPill key={tag} tag={tag} isEmphasis={cat.emphasis.includes(tag)} />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────
export function Skills() {
  const { isClueFound, canAttemptClue, unlockClue } = useHunt();
  const clue8Found = isClueFound(8);
  const clickedCategories = useRef(new Set<number>());

  const handleNumClick = useCallback((index: number) => {
    if (!canAttemptClue(9)) return;
    clickedCategories.current.add(index);
    if (clickedCategories.current.size >= categories.length) {
      unlockClue(9);
      clickedCategories.current.clear();
    }
  }, [canAttemptClue, unlockClue]);

  return (
    <section
      id="skills"
      className="section-light relative overflow-hidden"
      style={{ padding: "clamp(80px, 10vw, 140px) 0" }}
    >
      {/* Noise texture */}
      <div
        aria-hidden
        className="noise-overlay absolute inset-0 pointer-events-none"
        style={{ opacity: 0.025, mixBlendMode: "multiply" }}
      />

      {/* Giant background "04" */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "-5%", left: "-2%",
          fontFamily: "var(--font-display)",
          fontWeight: 900,
          fontSize: "clamp(10rem, 28vw, 26rem)",
          lineHeight: 0.85,
          letterSpacing: "-8px",
          color: "transparent",
          WebkitTextStroke: "1px rgba(0,0,0,0.05)",
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 0,
        }}
      >
        04
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
                color: "rgba(0,0,0,0.15)",
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
                color: "var(--section-light-text)",
                lineHeight: 0.85,
                letterSpacing: "-4px",
              }}
            >
              04
            </span>
            <span
              style={{
                fontFamily: "var(--font-code)",
                fontSize: "0.55rem",
                letterSpacing: "4px",
                textTransform: "uppercase",
                color: "var(--section-light-text-muted)",
                alignSelf: "center",
              }}
            >
              Skills
            </span>
          </div>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "clamp(2.4rem, 7vw, 6.5rem)",
              color: "var(--section-light-text)",
              lineHeight: 0.9,
              letterSpacing: "-3px",
            }}
          >
            Tools of the{" "}
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 300,
                letterSpacing: "-2px",
              }}
            >
              trade
            </span>
          </h2>
        </div>

        {/* Two-column grid of categories */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gsap-fade-up"
          style={{ "--delay": "0.1s" } as React.CSSProperties}
        >
          {categories.map((cat, i) => (
            <CategoryCard
              key={cat.num}
              cat={cat}
              index={i}
              clue8Found={clue8Found}
              onNumClick={() => handleNumClick(i)}
            />
          ))}
        </div>

        {/* Bottom rule */}
        <div
          style={{
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.1) 70%, transparent)",
            marginTop: "8px",
          }}
        />
      </div>
    </section>
  );
}
