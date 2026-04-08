"use client";

import { useEffect, useRef, useCallback } from "react";
import { useHunt } from "@/context/HuntContext";

const TERMINAL_LINES: Array<{
  type: "command" | "blank" | "brace-open" | "brace-close" | "field";
  k?: string; v?: string;
}> = [
  { type: "command" },
  { type: "blank" },
  { type: "brace-open" },
  { type: "field", k: "name",       v: "Akash Varma" },
  { type: "field", k: "location",   v: "Hyderabad, India" },
  { type: "field", k: "role",       v: "Platform Engineer" },
  { type: "field", k: "company",    v: "WaveFuel Solutions" },
  { type: "field", k: "passion",    v: "Distributed Systems" },
  { type: "field", k: "superpower", v: "Making devices talk" },
  { type: "field", k: "mentoring",  v: "3" },
  { type: "field", k: "coffee",     v: "critical" },
  { type: "brace-close" },
];

export function About() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const { isClueFound, canAttemptClue, unlockClue } = useHunt();

  const onCardMove = useCallback((e: MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const r = card.getBoundingClientRect();
    const ox = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const oy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    card.style.transform = `perspective(900px) rotateX(${oy * -5}deg) rotateY(${ox * 5}deg) scale(1.02)`;
  }, []);

  const onCardLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";
  }, []);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    card.addEventListener("mousemove", onCardMove);
    card.addEventListener("mouseleave", onCardLeave);
    return () => {
      card.removeEventListener("mousemove", onCardMove);
      card.removeEventListener("mouseleave", onCardLeave);
    };
  }, [onCardMove, onCardLeave]);

  useEffect(() => {
    const terminal = terminalRef.current;
    if (!terminal) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          terminal.classList.add("terminal-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(terminal);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      className="section-light relative overflow-hidden"
      style={{ padding: "clamp(80px, 10vw, 140px) 0" }}
    >
      {/* Noise texture overlay for the linen feel */}
      <div
        aria-hidden
        className="noise-overlay absolute inset-0 pointer-events-none"
        style={{ opacity: 0.025, mixBlendMode: "multiply" }}
      />

      {/* Giant faint section number — Milkshake-style background numerals */}
      <div
        aria-hidden
        className="absolute select-none pointer-events-none"
        style={{
          top: "-8%",
          right: "-2%",
          fontFamily: "var(--font-display)",
          fontWeight: 900,
          fontSize: "clamp(10rem, 28vw, 26rem)",
          lineHeight: 0.85,
          letterSpacing: "-8px",
          color: "transparent",
          WebkitTextStroke: "1px rgba(0,0,0,0.06)",
          userSelect: "none",
          zIndex: 0,
        }}
      >
        01
      </div>

      <div
        className="max-w-[1300px] mx-auto relative"
        style={{ padding: "0 clamp(24px, 5vw, 64px)", zIndex: 1 }}
      >
        {/* ── SECTION HEADER ── */}
        <div className="mb-16 gsap-fade-up">
          {/* /01 marker — inspired directly by Milkshake's section number treatment */}
          <div className="flex items-baseline gap-4 mb-4">
            <span
              className="section-slash"
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: "clamp(2rem, 5vw, 4.5rem)",
                fontWeight: 300,
                color: "rgba(0,0,0,0.18)",
                lineHeight: 1,
              }}
            >
              /
            </span>
            <span
              className="section-num gsap-section-num"
              style={{
                fontSize: "clamp(2rem, 5vw, 4.5rem)",
                color: "var(--section-light-text)",
              }}
            >
              01
            </span>
            <span
              className="font-code uppercase tracking-[4px] text-[0.55rem]"
              style={{ color: "var(--section-light-text-muted)", alignSelf: "center" }}
            >
              About
            </span>
          </div>

          {/* Big editorial headline — mixed roman + italic like Milkshake */}
          <h2
            className="font-display font-extrabold leading-[0.9] tracking-[-3px]"
            style={{
              fontSize: "clamp(2.4rem, 7vw, 6.5rem)",
              color: "var(--section-light-text)",
            }}
          >
            The story behind
            <br />
            the{" "}
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 300,
                letterSpacing: "-2px",
              }}
            >
              systems
            </span>
          </h2>
        </div>

        {/* ── TWO-COLUMN BODY — exactly like Milkshake's editorial layout ── */}
        <div
          className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20 mb-20 gsap-fade-up"
          style={{ "--delay": "0.1s" } as React.CSSProperties}
        >
          {/* Left: body copy */}
          <div className="space-y-6">
            <p
              style={{
                fontSize: "1rem",
                lineHeight: 1.85,
                color: "var(--section-light-text-dim)",
              }}
            >
              Three years ago, I was writing boring ASP.NET code at a
              five-person startup. I taught myself{" "}
              <strong style={{ color: "var(--section-light-text)", fontWeight: 700 }}>
                React
              </strong>{" "}
              and{" "}
              <strong style={{ color: "var(--section-light-text)", fontWeight: 700 }}>
                Node.js
              </strong>
              , and never looked back.
            </p>
            <p
              style={{
                fontSize: "1rem",
                lineHeight: 1.85,
                color: "var(--section-light-text-dim)",
              }}
            >
              What started as front-end curiosity evolved into architecting
              full-scale distributed systems. I went from building simple UIs
              to designing a{" "}
              <strong style={{ color: "var(--section-light-text)", fontWeight: 700 }}>
                custom domain-specific language
              </strong>{" "}
              that became the backbone of an entire IoT platform — one that
              can onboard any device, speaking any protocol, without a single
              line of new code.
            </p>
            <p
              style={{
                fontSize: "1rem",
                lineHeight: 1.85,
                color: "var(--section-light-text-dim)",
              }}
            >
              I&rsquo;ve built EV charging infrastructure with{" "}
              <strong style={{ color: "var(--section-light-text)", fontWeight: 700 }}>
                99% uptime
              </strong>
              , engineered Redis-based messaging handling thousands of
              concurrent connections, shipped mobile apps to both app stores,
              and created digital twin simulators that stress-test{" "}
              <strong style={{ color: "var(--section-light-text)", fontWeight: 700 }}>
                10,000+ virtual devices
              </strong>
              .
            </p>
            <p
              style={{
                fontSize: "1rem",
                lineHeight: 1.85,
                color: "var(--section-light-text-dim)",
              }}
            >
              All of this in a startup where I wore every hat — developer,
              architect, client-facing analyst, and mentor.{" "}
              <strong style={{ color: "var(--section-light-text)", fontWeight: 700 }}>
                I don&rsquo;t just write code. I build systems that scale.
              </strong>
            </p>
          </div>

          {/* Right: terminal card — restyled for the cream world */}
          <div className="lg:sticky lg:top-28 self-start">
            <div
              ref={cardRef}
              style={{
                background: "var(--section-light-text)",
                borderRadius: "14px",
                overflow: "hidden",
                boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
                willChange: "transform",
                transition: "transform 0.18s cubic-bezier(0.23, 1, 0.32, 1)",
                cursor: "default",
              }}
            >
              {/* Title bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 16px",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.06)",
                }}
              >
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
                <span
                  style={{
                    marginLeft: "auto",
                    fontFamily: "var(--font-code)",
                    fontSize: "0.55rem",
                    color: "rgba(255,255,255,0.3)",
                    letterSpacing: "1px",
                  }}
                >
                  akash@systems ~
                </span>
              </div>

              {/* Terminal body */}
              <div
                ref={terminalRef}
                className="terminal-body"
                style={{
                  padding: "20px 22px",
                  fontFamily: "var(--font-code)",
                  fontSize: "0.78rem",
                  lineHeight: 2.0,
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                {TERMINAL_LINES.map((line, i) => {
                  const delay = `${i * 0.09}s`;
                  const cls = "terminal-line";

                  if (line.type === "command") return (
                    <div key={i} className={cls} style={{ "--td": delay } as React.CSSProperties}>
                      <span style={{ color: "#c4f751" }}>$</span>{" "}
                      <span style={{ color: "#fff" }}>cat profile.json</span>
                    </div>
                  );
                  if (line.type === "blank") return (
                    <div key={i} className={cls} style={{ "--td": delay } as React.CSSProperties}>&nbsp;</div>
                  );
                  if (line.type === "brace-open") return (
                    <div key={i} className={cls} style={{ "--td": delay } as React.CSSProperties}>
                      <span style={{ color: "rgba(255,255,255,0.3)" }}>{"{"}</span>
                    </div>
                  );
                  if (line.type === "brace-close") return (
                    <div key={i} className={cls} style={{ "--td": delay } as React.CSSProperties}>
                      <span style={{ color: "rgba(255,255,255,0.3)" }}>{"}"}</span>
                    </div>
                  );

                  // field
                  const keyColor = "#818cf8";
                  const valColor = line.k === "coffee" ? "#c4f751"
                    : line.k === "mentoring" ? "#fb923c"
                    : "#c4f751";
                  return (
                    <div key={i} className={cls} style={{ "--td": delay } as React.CSSProperties}>
                      &nbsp;&nbsp;
                      <span style={{ color: keyColor }}>&quot;{line.k}&quot;</span>
                      {": "}
                      <span style={{ color: valColor }}>&quot;{line.v}&quot;</span>
                      {i < TERMINAL_LINES.length - 2 ? "," : ""}
                    </div>
                  );
                })}

                {isClueFound(4) && (
                  <div
                    className="terminal-line"
                    style={{
                      "--td": `${TERMINAL_LINES.length * 0.09 + 0.18}s`,
                      cursor: "pointer",
                      opacity: 0,
                    } as React.CSSProperties}
                    onClick={() => { if (canAttemptClue(5)) unlockClue(5); }}
                  >
                    &nbsp;&nbsp;
                    <span style={{ color: "rgba(196,247,81,0.45)", fontStyle: "italic" }}>&quot;secret&quot;</span>
                    {": "}
                    <span style={{ color: "rgba(196,247,81,0.45)", fontStyle: "italic" }}>&quot;the marquee whispers&quot;</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── DIVIDER — horizontal rule before the next section ── */}
        <div
          style={{
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.12) 30%, rgba(0,0,0,0.12) 70%, transparent)",
          }}
        />
      </div>

      <style>{`
        .terminal-line {
          opacity: 0;
          transform: translateX(-6px);
        }
        .terminal-visible .terminal-line {
          animation: terminal-type-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          animation-delay: var(--td, 0s);
        }
        @keyframes terminal-type-in {
          from { opacity: 0; transform: translateX(-6px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}
