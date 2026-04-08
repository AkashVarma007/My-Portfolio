"use client";

import { useEffect, useRef, useState } from "react";
import { useHunt } from "@/context/HuntContext";

const ROLES = [
  "Systems Engineer",
  "Platform Architect",
  "DSL Designer",
  "IoT Specialist",
];

const TECH_ICONS = [
  { label: "React",      icon: "⚛",  color: "#61dafb" },
  { label: "Node",       icon: "⬡",  color: "#68a063" },
  { label: "Docker",     icon: "🐳", color: "#2496ed" },
  { label: "Redis",      icon: "⬡",  color: "#dc382d" },
  { label: "TypeScript", icon: "TS", color: "#3178c6" },
  { label: "K8s",        icon: "☸",  color: "#326ce5" },
  { label: "MQTT",       icon: "⚡", color: "#c4f751" },
  { label: "Postgres",   icon: "🐘", color: "#4169e1" },
];

// More personality-driven stats — inspired by Milkshake's "173 pizza slices"
const STATS = [
  { value: 10000, suffix: "+", label: "Devices handled concurrently" },
  { value: 6,     suffix: "",  label: "Production systems shipped" },
  { value: 99,    suffix: "%", label: "Uptime on EV infrastructure" },
  { value: 3,     suffix: "",  label: "Engineers levelled up" },
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
  const [displayOverride, setDisplayOverride] = useState<string | null>(null);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  const scrambleTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1600;
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

  function handleMouseEnter() {
    if (scrambleTimer.current) clearInterval(scrambleTimer.current);
    const CHARS = "0123456789";
    const original = count.toLocaleString() + suffix;
    let elapsed = 0;
    const DURATION = 500;
    const INTERVAL = 40;
    scrambleTimer.current = setInterval(() => {
      elapsed += INTERVAL;
      if (elapsed >= DURATION) {
        clearInterval(scrambleTimer.current!);
        scrambleTimer.current = null;
        setDisplayOverride(null);
        return;
      }
      const scrambled = original.split("").map((ch) =>
        /[0-9]/.test(ch) ? CHARS[Math.floor(Math.random() * CHARS.length)] : ch
      ).join("");
      setDisplayOverride(scrambled);
    }, INTERVAL);
  }

  return (
    <span ref={ref} onMouseEnter={handleMouseEnter} style={{ cursor: "default" }}>
      {displayOverride ?? (count.toLocaleString() + suffix)}
    </span>
  );
}

// ── Magnetic button wrapper ───────────────────────────────────────────────────
function MagneticWrap({ children }: { children: React.ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    el.style.setProperty("--mx", `${dx * 9}px`);
    el.style.setProperty("--my", `${dy * 5}px`);
  }

  function onMouseLeave() {
    const el = wrapRef.current;
    if (!el) return;
    el.style.setProperty("--mx", "0px");
    el.style.setProperty("--my", "0px");
  }

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        display: "inline-flex",
        transform: "translate(var(--mx, 0px), var(--my, 0px))",
        transition: "transform 0.18s cubic-bezier(0.23, 1, 0.32, 1)",
      }}
    >
      {children}
    </div>
  );
}

const ICON_LETTER: Record<string, string> = {
  React: "R", Node: "N", Docker: "D", Redis: "E",
  TypeScript: "T", K8s: "K", MQTT: "M", Postgres: "P",
};
const CLUE3_SEQUENCE = ["R", "D", "T", "K"];

export function Hero() {
  const role = useTypingEffect(ROLES);
  const { unlockClue, canAttemptClue } = useHunt();
  const clickSeqRef = useRef<string[]>([]);
  const [lastPressed, setLastPressed] = useState<string | null>(null);

  // Mouse parallax refs — direct DOM mutation, zero re-renders
  const sectionRef = useRef<HTMLElement>(null);
  const akashRef = useRef<HTMLSpanElement>(null);
  const varmaRef = useRef<HTMLSpanElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    function onMouseMove(e: MouseEvent) {
      const ox = (e.clientX / window.innerWidth - 0.5) * 2;  // -1 to 1
      const oy = (e.clientY / window.innerHeight - 0.5) * 2;
      if (akashRef.current)
        akashRef.current.style.transform = `translate(${-ox * 20}px, ${-oy * 10}px)`;
      if (varmaRef.current)
        varmaRef.current.style.transform = `translate(${ox * 12}px, ${oy * 6}px)`;
      if (heroContentRef.current)
        heroContentRef.current.style.transform =
          `perspective(1200px) rotateX(${oy * -1.2}deg) rotateY(${ox * 1.2}deg)`;
      if (spotlightRef.current && section) {
        const rect = section.getBoundingClientRect();
        spotlightRef.current.style.left = `${e.clientX - rect.left - 300}px`;
        spotlightRef.current.style.top = `${e.clientY - rect.top - 300}px`;
        spotlightRef.current.style.opacity = "1";
      }
    }

    function onMouseLeave() {
      if (akashRef.current) akashRef.current.style.transform = "";
      if (varmaRef.current) varmaRef.current.style.transform = "";
      if (heroContentRef.current) heroContentRef.current.style.transform = "";
      if (spotlightRef.current) spotlightRef.current.style.opacity = "0";
    }

    section.addEventListener("mousemove", onMouseMove);
    section.addEventListener("mouseleave", onMouseLeave);
    return () => {
      section.removeEventListener("mousemove", onMouseMove);
      section.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero-section"
      className="min-h-screen relative z-[1] flex flex-col justify-end pb-12 md:pb-16 px-6 md:px-12 overflow-hidden"
    >
      {/* Mouse spotlight glow — DOM-direct, zero re-renders */}
      <div
        ref={spotlightRef}
        aria-hidden
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(196,247,81,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
          opacity: 0,
          transition: "opacity 0.4s ease",
          zIndex: 1,
          willChange: "left, top",
        }}
      />

      {/* Orbiting tech icons */}
      <div
        aria-hidden
        className="absolute right-0 top-0 w-[640px] h-[640px] select-none"
        style={{ opacity: 0.16, zIndex: 2 }}
      >
        {TECH_ICONS.map((tech, i) => {
          const angle = (i / TECH_ICONS.length) * 360;
          const radius = 230 + (i % 2) * 70;
          const delay = i * 1.1;
          const duration = 26 + (i % 3) * 6;
          const letter = ICON_LETTER[tech.label];
          const isPressed = lastPressed === tech.label;
          return (
            <div
              key={tech.label}
              className="absolute"
              style={{
                top: "50%", left: "50%",
                width: 64, height: 64,
                marginTop: -32, marginLeft: -32,
                animation: `hero-orbit-${i % 2 === 0 ? "cw" : "ccw"} ${duration}s linear ${delay}s infinite`,
                transformOrigin: `${-radius}px 0px`,
                transform: `rotate(${angle}deg) translateX(${radius}px)`,
                cursor: "pointer", pointerEvents: "auto", touchAction: "manipulation",
              }}
              onClick={() => {
                if (!letter) return;
                setLastPressed(tech.label);
                const seq = clickSeqRef.current;
                seq.push(letter);
                if (seq.length > 4) seq.splice(0, seq.length - 4);
                const last4 = seq.slice(-4);
                if (last4.length === 4 && last4.every((l, idx) => l === CLUE3_SEQUENCE[idx]) && canAttemptClue(4)) {
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
                  transform: isPressed ? "scale(1.08)" : "scale(1)",
                  boxShadow: isPressed ? `0 0 22px ${tech.color}55` : `0 0 12px ${tech.color}22`,
                  transition: "transform 160ms ease, box-shadow 200ms ease",
                }}
              >
                {tech.icon}
              </div>
            </div>
          );
        })}
      </div>

      <div ref={heroContentRef} className="w-full max-w-[1300px] mx-auto relative z-[3]" style={{ willChange: "transform", transition: "transform 0.1s linear" }}>

        {/* ── EDITORIAL NAME TREATMENT — filled + outlined stacked ── */}
        <div className="mb-2 overflow-hidden gsap-hero-line">
          <div
            className="font-display font-black leading-[0.82] tracking-[-3px] select-none"
            style={{ fontSize: "clamp(4.5rem, 13vw, 13rem)" }}
          >
            {/* Outlined AKASH — moves opposite at deeper parallax layer */}
            <span
              ref={akashRef}
              className="block"
              style={{
                WebkitTextStroke: "1.5px rgba(255,255,255,0.25)",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-4px",
                willChange: "transform",
                transition: "transform 0.08s linear",
                display: "block",
              }}
            >
              AKASH
            </span>
            {/* Filled VARMA — moves at shallower depth, opposite direction */}
            <span
              ref={varmaRef}
              className="block text-text"
              style={{
                letterSpacing: "-4px",
                marginTop: "-0.05em",
                willChange: "transform",
                transition: "transform 0.08s linear",
                display: "block",
              }}
            >
              VARMA
            </span>
          </div>
        </div>

        {/* Role tag */}
        <div className="font-code text-[0.6rem] tracking-[5px] uppercase text-accent mb-8 flex items-center gap-3 gsap-hero-line">
          <span className="w-6 h-px bg-accent" />
          <span>
            {role}
            <span className="inline-block w-[2px] h-[0.75em] bg-accent ml-[2px] align-middle animate-blink" />
          </span>
        </div>

        {/* Tagline headline — the actual hero copy */}
        <h1 className="font-display font-extrabold leading-[0.92] tracking-[-2px] mb-10 gsap-hero-line" style={{ fontSize: "clamp(1.5rem, 3.6vw, 3.2rem)" }}>
          Building the{" "}
          <span
            className="serif-italic font-normal"
            style={{ color: "var(--color-text-dim)" }}
          >
            infrastructure
          </span>
          <br />
          that powers the future
          <span className="text-accent">.</span>
        </h1>

        {/* Description + CTAs */}
        <div className="gsap-hero-bottom">
          <p className="max-w-lg text-[0.95rem] text-text-dim leading-[1.8] mb-10">
            I architect device-agnostic IoT ecosystems, design custom DSL engines,
            and build distributed systems handling{" "}
            <span className="text-accent font-medium">10,000+</span> concurrent
            devices.{" "}
            <span className="text-text-muted">Based in Hyderabad, India.</span>
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-14">
            <MagneticWrap>
              <button
                onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}
                className="group relative inline-flex items-center gap-2 px-7 py-3 bg-accent text-bg font-display font-bold text-[0.85rem] tracking-wide rounded-full overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_28px_rgba(196,247,81,0.4)]"
              >
                View My Work
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>
            </MagneticWrap>
            <MagneticWrap>
              <button
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center gap-2 px-7 py-3 border border-border-light text-text font-display font-semibold text-[0.85rem] tracking-wide rounded-full transition-all duration-300 hover:border-accent hover:text-accent hover:shadow-[0_0_18px_rgba(196,247,81,0.12)]"
              >
                Get In Touch
              </button>
            </MagneticWrap>
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

          {/* Stats row — personality-driven numbers like Milkshake */}
          <div className="flex flex-wrap gap-px border-t border-border-light pt-8">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex-1 min-w-[140px] px-5 first:pl-0 last:pr-0 border-r border-border-light last:border-r-0"
              >
                <div className="font-display font-extrabold text-[clamp(1.6rem,3.2vw,2.4rem)] text-accent leading-none mb-1 tabular-nums">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="font-code text-[0.55rem] tracking-[2.5px] uppercase text-text-muted leading-snug">
                  {stat.label}
                </div>
              </div>
            ))}
            <div className="flex-1 min-w-[100px] px-5 last:pr-0 flex items-center justify-end gap-3">
              <div className="w-8 h-[2px] bg-accent rounded-full animate-pulse-scale" />
              <span className="font-code text-[0.55rem] tracking-[4px] uppercase text-text-muted">
                Scroll
              </span>
            </div>
          </div>
        </div>
      </div>

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
        .animate-blink { animation: blink 1s step-start infinite; }
      `}</style>
    </section>
  );
}
