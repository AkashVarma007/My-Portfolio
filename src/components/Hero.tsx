"use client";

import { useEffect, useRef, useState } from "react";
import { useHunt } from "@/context/HuntContext";

const ROLES = [
  "Platform Engineer",
  "Fullstack Developer",
  "IoT Builder",
];

const TECH_ICONS = [
  { label: "React",      icon: "⚛",  color: "#61dafb", fact: "the frontend default for every project I've shipped" },
  { label: "Node",       icon: "⬡",  color: "#68a063", fact: "my backend workhorse since I left ASP.NET" },
  { label: "Docker",     icon: "🐳", color: "#2496ed", fact: "everything I ship runs inside a container" },
  { label: "Redis",      icon: "⬡",  color: "#dc382d", fact: "holds the device-to-instance map for cross-cluster routing" },
  { label: "TypeScript", icon: "TS", color: "#3178c6", fact: "non-negotiable for anything longer than a weekend" },
  { label: "K8s",        icon: "☸",  color: "#326ce5", fact: "how our IoT platform scales horizontally" },
  { label: "MQTT",       icon: "⚡", color: "#c4f751", fact: "the protocol that every device on my platform speaks" },
  { label: "Postgres",   icon: "🐘", color: "#4169e1", fact: "my default for anything that needs to outlive a restart" },
];

const STATS = [
  { value: 3,     suffix: "+",  label: "Years Building" },
  { value: 6,     suffix: "",   label: "Production Systems" },
  { value: 2,     suffix: "",   label: "App Stores Shipped" },
  { value: 3,     suffix: "",   label: "Engineers Mentored" },
];

function useTypingEffect(words: string[], typingSpeed = 80, pauseMs = 1800) {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [phase, setPhase] = useState<"typing" | "pausing" | "erasing">("typing");
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (charIdx < words[wordIdx].length) {
        timeout = setTimeout(() => {
          setDisplay(words[wordIdx].slice(0, charIdx + 1));
          setCharIdx((c) => c + 1);
        }, typingSpeed);
      } else {
        timeout = setTimeout(() => setPhase("pausing"), pauseMs);
      }
    } else if (phase === "pausing") {
      timeout = setTimeout(() => setPhase("erasing"), 200);
    } else {
      if (charIdx > 0) {
        timeout = setTimeout(() => {
          setDisplay(words[wordIdx].slice(0, charIdx - 1));
          setCharIdx((c) => c - 1);
        }, typingSpeed / 2);
      } else {
        setWordIdx((w) => (w + 1) % words.length);
        setPhase("typing");
      }
    }

    return () => clearTimeout(timeout);
  }, [phase, charIdx, wordIdx, words, typingSpeed, pauseMs]);

  return display;
}

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1400;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          let step = 0;

          const timer = setInterval(() => {
            step++;
            current = Math.min(Math.round(increment * step), target);
            setCount(current);
            if (current >= target) clearInterval(timer);
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  const display = String(count);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

// Map each icon label to a letter for the sequence puzzle
const ICON_LETTER: Record<string, string> = {
  React: "R",
  Node: "N",
  Docker: "D",
  Redis: "E",
  TypeScript: "T",
  K8s: "K",
  MQTT: "M",
  Postgres: "P",
};
const CLUE3_SEQUENCE = ["R", "D", "T", "K"];

export function Hero() {
  const role = useTypingEffect(ROLES);
  const { unlockClue, canAttemptClue } = useHunt();
  const clickSeqRef = useRef<string[]>([]);
  const [lastPressed, setLastPressed] = useState<string | null>(null);
  const [pressTick, setPressTick] = useState(0);
  const [hoveredTech, setHoveredTech] = useState<typeof TECH_ICONS[number] | null>(null);

  return (
    <section id="hero-section" className="min-h-screen relative z-[1] flex flex-col justify-end pb-12 md:pb-16 px-6 md:px-12 overflow-hidden">
      {/* Orbiting tech icons — decorative background layer */}
      <div
        className="absolute right-0 top-0 w-[640px] h-[640px] select-none"
        style={{ opacity: 0.55, zIndex: 2 }}
      >
        {TECH_ICONS.map((tech, i) => {
          const angle = (i / TECH_ICONS.length) * 360;
          const radius = 230 + (i % 2) * 70;
          const letter = ICON_LETTER[tech.label];
          const isPressed = lastPressed === tech.label;

          return (
            <div
              key={tech.label}
              className="absolute"
              style={{
                top: "50%",
                left: "50%",
                width: 64,
                height: 64,
                marginTop: -32,
                marginLeft: -32,
                transformOrigin: `${-radius}px 0px`,
                transform: `rotate(${angle}deg) translateX(${radius}px)`,
                cursor: "pointer",
                pointerEvents: "auto",
                touchAction: "manipulation",
              }}
              onMouseEnter={() => setHoveredTech(tech)}
              onMouseLeave={() => setHoveredTech((h) => (h?.label === tech.label ? null : h))}
              onClick={() => {
                if (!letter) return;
                setLastPressed(tech.label);
                setPressTick((t) => t + 1);
                const seq = clickSeqRef.current;
                seq.push(letter);
                // Keep only last 4
                if (seq.length > 4) seq.splice(0, seq.length - 4);
                const last4 = seq.slice(-4);
                if (
                  last4.length === 4 &&
                  last4.every((l, idx) => l === CLUE3_SEQUENCE[idx]) &&
                  canAttemptClue(4)
                ) {
                  unlockClue(4);
                  clickSeqRef.current = [];
                }
              }}
            >
              <div
                className="w-[48px] h-[48px] rounded-xl border flex items-center justify-center font-code font-bold mx-auto my-auto"
                style={{
                  borderColor: tech.color + "55",
                  color: tech.color,
                  background: tech.color + "11",
                  fontSize: tech.icon.length > 1 ? "17px" : "28px",
                  lineHeight: 1,
                  transform: isPressed ? "scale(1.06)" : "scale(1)",
                  boxShadow: isPressed
                    ? `0 0 22px ${tech.color}55, 0 0 8px ${tech.color}44 inset`
                    : `0 0 12px ${tech.color}22`,
                  transition: "transform 160ms ease, box-shadow 200ms ease",
                }}
              >
                {tech.icon}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tech fact tooltip — fixed top-right, fades in on icon hover */}
      <div
        className="hidden md:block absolute top-6 right-6 z-[5] pointer-events-none transition-all duration-300"
        style={{
          opacity: hoveredTech ? 1 : 0,
          transform: hoveredTech ? "translateY(0)" : "translateY(-8px)",
          maxWidth: 320,
        }}
      >
        {hoveredTech && (
          <div
            className="rounded-xl p-4 backdrop-blur-md"
            style={{
              background: "rgba(8,8,12,0.85)",
              border: `1px solid ${hoveredTech.color}55`,
              boxShadow: `0 0 40px ${hoveredTech.color}22`,
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center font-code font-bold"
                style={{
                  background: `${hoveredTech.color}1a`,
                  border: `1px solid ${hoveredTech.color}55`,
                  color: hoveredTech.color,
                  fontSize: hoveredTech.icon.length > 1 ? "11px" : "16px",
                  lineHeight: 1,
                }}
              >
                {hoveredTech.icon}
              </div>
              <span
                className="font-display font-bold text-[0.85rem]"
                style={{ color: hoveredTech.color }}
              >
                {hoveredTech.label}
              </span>
            </div>
            <p className="font-code text-[0.65rem] leading-[1.65] text-text-dim">
              {hoveredTech.fact}
            </p>
          </div>
        )}
      </div>

      <div className="w-full max-w-[1300px] mx-auto relative">
        {/* Tag with role cycling */}
        <div
          className="font-code text-[0.6rem] tracking-[5px] uppercase text-accent mb-8 flex items-center gap-3 gsap-hero-line"
        >
          <span className="w-6 h-px bg-accent" />
          <span>
            {role}
            <span className="inline-block w-[2px] h-[0.75em] bg-accent ml-[2px] align-middle animate-blink" />
          </span>
        </div>

        {/* Name + headline */}
        <h1 className="font-display font-extrabold leading-[0.9] tracking-[-2px] mb-6">
          <div className="text-[clamp(1rem,2.2vw,1.4rem)] font-normal tracking-[6px] uppercase text-text-dim font-code mb-3 gsap-hero-line">
            akash varma
          </div>
          <div className="text-[clamp(2.8rem,7.5vw,6.8rem)] gsap-hero-line">
            Building the
          </div>
          <div className="text-[clamp(2.8rem,7.5vw,6.8rem)] gsap-hero-line">
            <span className="serif-italic font-normal tracking-[-1px]">infrastructure</span>
          </div>
          <div className="text-[clamp(2.8rem,7.5vw,6.8rem)] gsap-hero-line">
            that powers the future
            <span className="text-accent">.</span>
          </div>
        </h1>

        {/* Description + CTAs + Stats — all revealed together */}
        <div className="gsap-hero-bottom">
          {/* One-liner description */}
          <p className="max-w-lg text-[0.95rem] text-text-dim leading-[1.8] mb-10">
            I architect device-agnostic IoT ecosystems, design custom DSL engines,
            and build distributed systems handling{" "}
            <span className="text-accent font-medium">10,000+</span> concurrent
            devices.{" "}
            <span className="text-text-muted">Based in Hyderabad, India.</span>
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center gap-4 mb-14">
            <button
              onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}
              className="group relative inline-flex items-center gap-2 px-7 py-3 bg-accent text-bg font-display font-bold text-[0.85rem] tracking-wide rounded-full overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_28px_rgba(196,247,81,0.4)]"
            >
              View My Work
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
            <button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-2 px-7 py-3 border border-border-light text-text font-display font-semibold text-[0.85rem] tracking-wide rounded-full transition-all duration-300 hover:border-accent hover:text-accent hover:shadow-[0_0_18px_rgba(196,247,81,0.12)]"
            >
              Get In Touch
            </button>
            <a
              href="/resume.pdf"
              download="Akash_Varma_Resume.pdf"
              className="group inline-flex items-center gap-2 px-5 py-3 font-code text-[0.7rem] tracking-[2px] uppercase text-text-muted hover:text-text transition-colors duration-300"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform duration-300 group-hover:translate-y-0.5">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Resume
            </a>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-px border-t border-border-light pt-8">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex-1 min-w-[120px] px-6 first:pl-0 last:pr-0 border-r border-border-light last:border-r-0"
              >
                <div className="font-display font-extrabold text-[clamp(2rem,4vw,3rem)] text-accent leading-none mb-1">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="font-code text-[0.6rem] tracking-[3px] uppercase text-text-muted">
                  {stat.label}
                </div>
              </div>
            ))}

            <div className="flex-1 min-w-[120px] px-6 last:pr-0 flex items-center justify-end gap-4">
              <div className="w-10 h-[2px] bg-accent rounded-full animate-pulse-scale" />
              <span className="font-code text-[0.55rem] tracking-[4px] uppercase text-text-muted">
                Scroll
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Inline keyframes for orbiting icons + cursor blink */}
      <style>{`
        @keyframes icon-press-pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        @keyframes hero-orbit-cw {
          from { transform: rotate(var(--start-angle, 0deg)) translateX(var(--r, 190px)); }
          to   { transform: rotate(calc(var(--start-angle, 0deg) + 360deg)) translateX(var(--r, 190px)); }
        }
        @keyframes hero-orbit-ccw {
          from { transform: rotate(var(--start-angle, 0deg)) translateX(var(--r, 230px)); }
          to   { transform: rotate(calc(var(--start-angle, 0deg) - 360deg)) translateX(var(--r, 230px)); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s step-start infinite;
        }
      `}</style>
    </section>
  );
}
