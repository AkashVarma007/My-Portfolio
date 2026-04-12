"use client";

import { useEffect, useRef, useState } from "react";
import { FadeUp } from "./RevealText";
import { useHunt } from "@/context/HuntContext";

// Terminal lines data — kept tight, honest, no lifestyle stats
const TERMINAL_LINES: Array<{
  type: "command" | "blank" | "brace-open" | "brace-close" | "field";
  content?: string;
  k?: string;
  v?: string;
}> = [
  { type: "command" },
  { type: "blank" },
  { type: "brace-open" },
  { type: "field", k: "name",       v: "Akash Varma" },
  { type: "field", k: "location",   v: "Hyderabad, India" },
  { type: "field", k: "role",       v: "Platform Engineer" },
  { type: "field", k: "company",    v: "WaveFuel Solutions" },
  { type: "field", k: "stack",      v: "TypeScript / Node / Redis / K8s" },
  { type: "field", k: "mentoring",  v: "2 juniors + 1 intern" },
  { type: "field", k: "open_to",    v: "opportunities" },
  { type: "brace-close" },
];

// Two tone variants for the WOW 3 toggle
const ABOUT_COPY = {
  technical: [
    "I'm a fullstack developer in Hyderabad, 3+ years into building production IoT infrastructure at WaveFuel Solutions.",
    "Recent work has been platform-shaped — device-agnostic onboarding, a runtime DSL parser, and Redis-backed distributed messaging across a clustered instance topology.",
    "Before WaveFuel, I shipped an end-to-end EV charging platform on OCPP 1.6J and a cross-platform React Native SDK to both app stores. On the side, I mentor two junior engineers and an intern.",
  ],
  casual: [
    "I'm a fullstack dev in Hyderabad, three years in. The title on my resume says Platform Engineer; the honest version is that I keep getting handed infrastructure problems and not giving them back.",
    "Most of my work lately is platform-shaped: how do you onboard a device nobody at the company has seen before, without shipping new code? How do you route a message to the right instance in a load-balanced cluster without broadcasting? Designing a DSL for the first one, Redis for the second.",
    "Outside work I read too many Chinese web novels and change what I'm eating every weeknight. I also mentor two junior engineers and an intern on the platform team.",
  ],
} as const;

type Tone = keyof typeof ABOUT_COPY;

export function About() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const { isClueFound, canAttemptClue, unlockClue } = useHunt();
  const [tone, setTone] = useState<Tone>("technical");

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
            03 / About
          </span>
        </FadeUp>
        <FadeUp delay={0.08}>
          <h2 className="font-display text-[clamp(1.6rem,4vw,3.2rem)] font-extrabold tracking-[-2px] leading-[1.1] mb-14">
            The person behind
            <br />
            the <span className="serif-italic font-normal">systems</span>.
          </h2>
        </FadeUp>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20">
          {/* Text + tone toggle */}
          <div className="flex flex-col gap-5">
            {/* Tone toggle */}
            <div className="flex items-center gap-3 mb-2">
              <span className="font-code text-[0.55rem] tracking-[3px] uppercase text-text-muted">
                tone
              </span>
              <div
                className="inline-flex rounded-full p-1 gap-1"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {(Object.keys(ABOUT_COPY) as Tone[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className="font-code text-[0.55rem] tracking-[2px] uppercase px-3 py-1 rounded-full transition-all duration-200"
                    style={{
                      color: tone === t ? "#0a0a12" : "#9b97a8",
                      background: tone === t ? "#c4f751" : "transparent",
                      cursor: "pointer",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {ABOUT_COPY[tone].map((para, i) => (
              <p
                key={`${tone}-${i}`}
                className="text-[0.95rem] text-text-dim leading-[1.9] gsap-about-text"
                style={{
                  animation: "fade-swap 0.45s ease forwards",
                  animationDelay: `${i * 0.05}s`,
                }}
              >
                {para}
              </p>
            ))}
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
          to   { opacity: 1; transform: translateX(0);    }
        }
        @keyframes fade-swap {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
      `}</style>
    </section>
  );
}
