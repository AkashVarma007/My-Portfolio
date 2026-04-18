"use client";

import { useEffect, useRef } from "react";
import { FadeUp } from "./RevealText";
import { useHunt } from "@/context/HuntContext";

// Terminal lines data
const TERMINAL_LINES: Array<{ type: "command" | "blank" | "brace-open" | "brace-close" | "field"; content?: string; k?: string; v?: string; special?: boolean }> = [
  { type: "command" },
  { type: "blank" },
  { type: "brace-open" },
  { type: "field", k: "name",       v: "Akash Varma" },
  { type: "field", k: "location",   v: "Hyderabad, India" },
  { type: "field", k: "role",       v: "Full Stack Developer" },
  { type: "field", k: "company",    v: "WaveFuel Solutions" },
  { type: "field", k: "focus",      v: "Platform-level IoT & distributed systems" },
  { type: "field", k: "superpower", v: "Making devices talk" },
  { type: "field", k: "mentoring",  v: "2 juniors + 1 intern", special: true },
  { type: "field", k: "coffee",     v: "critical", special: false },
  { type: "brace-close" },
];

export function About() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const { isClueFound, canAttemptClue, unlockClue } = useHunt();

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
    <section id="about" className="py-24 md:py-36 relative z-[1]">
      <div className="max-w-[1300px] mx-auto px-6 md:px-12">
        <FadeUp>
          <span className="font-code text-[0.55rem] tracking-[6px] uppercase text-text-muted block mb-4">
            01 / About
          </span>
        </FadeUp>
        <FadeUp delay={0.08}>
          <h2 className="font-display text-[clamp(1.6rem,4vw,3.2rem)] font-extrabold tracking-[-2px] leading-[1.1] mb-14">
            The story behind
            <br />
            the <span className="serif-italic font-normal">systems</span>
          </h2>
        </FadeUp>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20">
          {/* Text */}
          <div className="space-y-5">
            <p className="text-[0.95rem] text-text-dim leading-[1.9] gsap-about-text">
              Full-Stack Developer (~4 years) shipping production systems
              end-to-end at a 5-person startup. Built the core of a
              device-agnostic IoT platform — HTTP + MQTT + WebSocket ingress, a
              custom DSL called{" "}
              <strong className="text-text font-semibold">FUS Script</strong>{" "}
              with a runtime parser for defining device schemas and field-level
              transformations (including{" "}
              <span className="text-accent font-medium">RSA encryption</span> on
              selected fields), and a{" "}
              <span className="text-accent font-medium">Redis-routed</span>{" "}
              distributed WebSocket layer that keeps connected-device state
              consistent across clustered server instances.
            </p>
            <p className="text-[0.95rem] text-text-dim leading-[1.9] gsap-about-text">
              On top of that core, I&rsquo;ve delivered{" "}
              <span className="text-accent font-medium">OCPP 1.6J</span>{" "}
              integrations for EV chargers, a React Native companion app
              shipped to Play Store and App Store, a reusable digital twin
              simulator (initial vertical: dairy industry), an{" "}
              <span className="text-accent font-medium">MCP toolchain</span>{" "}
              exposing platform actions to LLM agents, and a Sonar-based audio
              analysis tool (Python signal-processing + Next.js heatmap UI).
            </p>
            <p className="text-[0.95rem] text-text-dim leading-[1.9] gsap-about-text">
              Currently mentoring{" "}
              <strong className="text-text font-semibold">
                2 junior engineers and 1 intern
              </strong>{" "}
              as the team scaled from 5 to 8+. Expanding into distributed-systems
              depth and AI infrastructure patterns on the side — most recently{" "}
              <span className="text-accent font-medium">
                job-manager
              </span>
              , a personal Go project exploring deterministic orchestration
              around sandboxed LLM task pipelines.
            </p>
            <p className="text-[0.95rem] text-text-dim leading-[1.9] gsap-about-text">
              Open to remote roles globally (B2B contractor via Deel / Remote /
              Oyster) and on-site / hybrid in Hyderabad.{" "}
              <strong className="text-text font-semibold">
                I build systems that scale.
              </strong>
            </p>
          </div>

          {/* Terminal */}
          <FadeUp delay={0.15}>
            <div className="lg:sticky lg:top-28">
              <div className="bg-bg-elevated border border-border-light rounded-xl overflow-hidden shadow-2xl shadow-black/40">
                {/* Title bar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                  <span className="ml-auto font-code text-[0.55rem] text-text-muted tracking-wider">
                    akash@systems ~
                  </span>
                </div>

                {/* Body with typing animation */}
                <div
                  ref={terminalRef}
                  className="p-5 font-code text-[0.75rem] leading-[2.1] text-text-dim terminal-body"
                >
                  {TERMINAL_LINES.map((line, i) => {
                    const delay = `${i * 0.09}s`;
                    const cls = "terminal-line";

                    if (line.type === "command") {
                      return (
                        <div key={i} className={cls} style={{ "--td": delay } as React.CSSProperties}>
                          <span className="text-accent">$</span>{" "}
                          <span className="text-text">cat profile.json</span>
                        </div>
                      );
                    }
                    if (line.type === "blank") {
                      return (
                        <div key={i} className={cls} style={{ "--td": delay } as React.CSSProperties}>
                          &nbsp;
                        </div>
                      );
                    }
                    if (line.type === "brace-open") {
                      return (
                        <div key={i} className={cls} style={{ "--td": delay } as React.CSSProperties}>
                          <span className="text-text-muted">{"{"}</span>
                        </div>
                      );
                    }
                    if (line.type === "brace-close") {
                      return (
                        <div key={i} className={cls} style={{ "--td": delay } as React.CSSProperties}>
                          <span className="text-text-muted">{"}"}</span>
                        </div>
                      );
                    }
                    // field
                    if (line.k === "coffee") {
                      return (
                        <div key={i} className={cls} style={{ "--td": delay } as React.CSSProperties}>
                          &nbsp;&nbsp;
                          <span className="text-accent-2">&quot;coffee&quot;</span>
                          :{" "}
                          <span className="text-accent">&quot;critical&quot;</span>
                        </div>
                      );
                    }
                    return (
                      <div key={i} className={cls} style={{ "--td": delay } as React.CSSProperties}>
                        &nbsp;&nbsp;
                        <span className="text-accent-2">&quot;{line.k}&quot;</span>
                        :{" "}
                        <span className="text-accent">&quot;{line.v}&quot;</span>,
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
                      onClick={() => {
                        if (canAttemptClue(5)) unlockClue(5);
                      }}
                    >
                      &nbsp;&nbsp;
                      <span style={{ color: "rgba(196,247,81,0.45)", fontStyle: "italic" }}>
                        &quot;secret&quot;
                      </span>
                      :{" "}
                      <span style={{ color: "rgba(196,247,81,0.45)", fontStyle: "italic" }}>
                        &quot;the marquee whispers&quot;
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>

      <style>{`
        /* Each line starts invisible */
        .terminal-line {
          opacity: 0;
          transform: translateX(-6px);
        }

        /* When the terminal container gets .terminal-visible,
           stagger each child line in */
        .terminal-visible .terminal-line {
          animation: terminal-type-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          animation-delay: var(--td, 0s);
        }

        @keyframes terminal-type-in {
          from {
            opacity: 0;
            transform: translateX(-6px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </section>
  );
}
