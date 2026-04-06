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
  { type: "field", k: "role",       v: "Platform Engineer" },
  { type: "field", k: "company",    v: "WaveFuel Solutions" },
  { type: "field", k: "passion",    v: "Distributed Systems" },
  { type: "field", k: "superpower", v: "Making devices talk" },
  { type: "field", k: "mentoring",  v: "3",    special: true },
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
              Three years ago, I was writing boring ASP.NET code at a
              five-person startup. I taught myself{" "}
              <span className="text-accent font-medium">React</span> and{" "}
              <span className="text-accent font-medium">Node.js</span>, and
              never looked back.
            </p>
            <p className="text-[0.95rem] text-text-dim leading-[1.9] gsap-about-text">
              What started as front-end curiosity quickly evolved into
              architecting full-scale distributed systems. I went from building
              simple UIs to designing a{" "}
              <strong className="text-text font-semibold">
                custom domain-specific language
              </strong>{" "}
              that became the backbone of an entire IoT platform — one that can
              onboard any device, speaking any protocol, without a single line
              of new code.
            </p>
            <p className="text-[0.95rem] text-text-dim leading-[1.9] gsap-about-text">
              I&rsquo;ve built EV charging infrastructure with{" "}
              <span className="text-accent font-medium">99% uptime</span>,
              engineered Redis-based messaging layers handling thousands of
              concurrent connections, shipped mobile apps to both app stores,
              and created digital twin simulators that stress-test{" "}
              <span className="text-accent font-medium">
                10,000+ virtual devices
              </span>
              .
            </p>
            <p className="text-[0.95rem] text-text-dim leading-[1.9] gsap-about-text">
              All of this in a startup where I wore every hat — developer,
              architect, client-facing analyst, and mentor. I don&rsquo;t just
              write code.{" "}
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
                    if (line.k === "mentoring") {
                      return (
                        <div key={i} className={cls} style={{ "--td": delay } as React.CSSProperties}>
                          &nbsp;&nbsp;
                          <span className="text-accent-2">&quot;mentoring&quot;</span>
                          :{" "}
                          <span className="text-accent-3">3</span>,
                        </div>
                      );
                    }
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
