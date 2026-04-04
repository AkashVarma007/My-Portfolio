"use client";

import { useRef, useEffect, useState } from "react";
import { FadeUp } from "./RevealText";
import { TiltCard } from "./TiltCard";

const projects = [
  {
    num: "01",
    title: "Device-Agnostic IoT Platform",
    desc: "A platform that onboards any device, any protocol — without new code. Powered by FUS Script, a custom DSL I designed for runtime protocol definitions and data transformations. Distributed Redis-based messaging handles thousands of concurrent connections.",
    tags: ["TypeScript", "DSL", "Redis", "MQTT", "WebSockets"],
    metrics: [
      { value: "40%", label: "Faster Integration" },
      { value: "10K+", label: "Concurrent Devices" },
      { value: "₹40L+", label: "Project Value" },
    ],
    accent: "#c4f751",
    featured: true,
  },
  {
    num: "02",
    title: "EV Charging Infrastructure",
    desc: "End-to-end platform with OCPP 1.6J. Real-time monitoring, analytics dashboards, sub-second telemetry, ~99% uptime.",
    tags: ["Node.js", "OCPP 1.6", "React"],
    accent: "#818cf8",
    featured: false,
  },
  {
    num: "03",
    title: "IoT Mobile App",
    desc: "Cross-platform app for device onboarding, analytics, team management, and automation. Shipped to Play Store & App Store.",
    tags: ["React Native", "IoT", "Cross-Platform"],
    accent: "#fb923c",
    featured: false,
  },
  {
    num: "04",
    title: "Digital Twin Engine",
    desc: "Plug-and-play simulation engine for 10K+ virtual IoT devices across industries.",
    tags: ["Simulation", "Event-Driven"],
    accent: "#c4f751",
    featured: false,
  },
  {
    num: "05",
    title: "Autonomous Job Manager",
    desc: "AI-driven orchestration in isolated Docker containers with automated error recovery.",
    tags: ["AI", "Docker", "Async"],
    accent: "#818cf8",
    featured: false,
  },
  {
    num: "06",
    title: "Sonar Analysis Platform",
    desc: "Audio-based sonar data → heatmaps and charts. Python processing, Next.js visualization.",
    tags: ["Python", "Next.js"],
    accent: "#fb923c",
    featured: false,
  },
];

// Tag dot colors cycle
const tagDotColors = ["#c4f751", "#818cf8", "#fb923c", "#38bdf8", "#f472b6"];

// Animated metric counter
function MetricCounter({ value, label }: { value: string; label: string }) {
  const [displayed, setDisplayed] = useState("0");
  const ref = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          // Extract numeric part and suffix
          const match = value.match(/^([₹]?)(\d+(?:\.\d+)?)([KL%+]*)?$/);
          if (!match) {
            setDisplayed(value);
            return;
          }
          const prefix = match[1] || "";
          const num = parseFloat(match[2]);
          const suffix = match[3] || "";
          const duration = 1200;
          const start = performance.now();

          function tick(now: number) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * num);
            setDisplayed(`${prefix}${current}${suffix}`);
            if (progress < 1) requestAnimationFrame(tick);
            else setDisplayed(value);
          }

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="flex flex-col gap-1">
      <span
        className="font-display font-black text-3xl md:text-4xl tracking-tight"
        style={{ color: "#c4f751" }}
      >
        {displayed}
      </span>
      <span className="font-code text-[0.5rem] uppercase tracking-[3px] text-[#56526a]">
        {label}
      </span>
    </div>
  );
}

// Animated circuit SVG decoration for featured card
function CircuitDecoration() {
  return (
    <svg
      className="absolute right-0 top-0 opacity-[0.07] pointer-events-none select-none"
      width="420"
      height="420"
      viewBox="0 0 420 420"
      fill="none"
      aria-hidden="true"
    >
      <style>{`
        @keyframes dash-flow {
          to { stroke-dashoffset: -200; }
        }
        .circuit-line { animation: dash-flow 4s linear infinite; stroke-dasharray: 8 6; }
        .circuit-line-slow { animation: dash-flow 7s linear infinite; stroke-dasharray: 12 8; }
      `}</style>
      {/* Horizontal rails */}
      <line className="circuit-line" x1="0" y1="80" x2="420" y2="80" stroke="#c4f751" strokeWidth="1" />
      <line className="circuit-line-slow" x1="0" y1="200" x2="420" y2="200" stroke="#c4f751" strokeWidth="1" />
      <line className="circuit-line" x1="0" y1="320" x2="420" y2="320" stroke="#c4f751" strokeWidth="1" />
      {/* Vertical rails */}
      <line className="circuit-line-slow" x1="100" y1="0" x2="100" y2="420" stroke="#c4f751" strokeWidth="1" />
      <line className="circuit-line" x1="240" y1="0" x2="240" y2="420" stroke="#c4f751" strokeWidth="1" />
      <line className="circuit-line-slow" x1="360" y1="0" x2="360" y2="420" stroke="#c4f751" strokeWidth="1" />
      {/* Nodes */}
      {[
        [100, 80], [240, 80], [360, 80],
        [100, 200], [240, 200], [360, 200],
        [100, 320], [240, 320], [360, 320],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="4" fill="#c4f751" />
      ))}
      {/* Small decorative squares at some nodes */}
      {[
        [100, 80], [240, 200], [360, 320],
      ].map(([cx, cy], i) => (
        <rect key={i} x={cx - 8} y={cy - 8} width="16" height="16" rx="2" stroke="#c4f751" strokeWidth="1" fill="none" />
      ))}
    </svg>
  );
}

// Non-featured project card
function ProjectCard({ project, index }: { project: typeof projects[number]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="gsap-project-card h-full cursor-default"
      style={{
        borderRadius: "1rem",
        border: `1px solid ${hovered ? `${project.accent}30` : "rgba(255,255,255,0.05)"}`,
        boxShadow: hovered
          ? `0 0 40px ${project.accent}18, 0 8px 40px rgba(0,0,0,0.4)`
          : "0 2px 20px rgba(0,0,0,0.3)",
        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
    <TiltCard
      className={`h-full bg-[#111118] rounded-2xl relative overflow-hidden flex flex-col justify-between group`}
    >
      {/* Accent top border animated on hover */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: `linear-gradient(90deg, transparent, ${project.accent}, transparent)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      />

      {/* Subtle hover gradient wash */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 30% 20%, ${project.accent}08 0%, transparent 65%)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.5s ease",
          pointerEvents: "none",
        }}
      />

      <div className="relative z-[1] p-6 md:p-7 flex flex-col h-full">
        {/* Number + accent dot row */}
        <div className="flex items-start justify-between mb-5">
          <span
            className="font-display font-black text-[3.5rem] leading-none tracking-[-4px] select-none"
            style={{
              color: project.accent,
              opacity: hovered ? 0.18 : 0.07,
              transition: "opacity 0.4s ease",
            }}
          >
            {project.num}
          </span>
          <span
            className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
            style={{ background: project.accent, opacity: 0.6 }}
          />
        </div>

        {/* Title */}
        <h3
          className="font-display text-base md:text-lg font-bold tracking-[-0.3px] mb-3 leading-snug"
          style={{ color: "#f5f5f7" }}
        >
          {project.title}
        </h3>

        {/* Description — expands slightly on hover */}
        <p
          className="text-[0.8rem] leading-[1.75] flex-1"
          style={{
            color: "#9b97a8",
            transition: "color 0.3s ease",
          }}
        >
          {project.desc}
        </p>

        {/* Tags with colored dots */}
        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-[rgba(255,255,255,0.05)]">
          {project.tags.map((tag, ti) => (
            <span key={tag} className="flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: tagDotColors[ti % tagDotColors.length] }}
              />
              <span
                className="font-code text-[0.55rem] uppercase tracking-[1.5px]"
                style={{ color: "#56526a" }}
              >
                {tag}
              </span>
            </span>
          ))}
        </div>
      </div>
    </TiltCard>
    </div>
  );
}

export function Projects() {
  const featured = projects[0];
  const rest = projects.slice(1);

  return (
    <section id="work" className="py-24 md:py-36 relative z-[1]">
      <div className="max-w-[1300px] mx-auto px-6 md:px-12">

        {/* Section label */}
        <FadeUp>
          <span className="font-code text-[0.55rem] tracking-[6px] uppercase text-[#56526a] block mb-4">
            02 / Work
          </span>
        </FadeUp>
        <FadeUp delay={0.08}>
          <h2 className="font-display text-[clamp(1.6rem,4vw,3.2rem)] font-extrabold tracking-[-2px] leading-[1.1] mb-14">
            Selected{" "}
            <span className="serif-italic font-normal" style={{ color: "#f5f5f7" }}>
              projects
            </span>
          </h2>
        </FadeUp>

        {/* ── FEATURED CARD ── */}
        <FadeUp delay={0.12}>
          <div
            className="gsap-project-card relative overflow-hidden rounded-3xl mb-5 group"
            style={{
              background:
                "linear-gradient(135deg, #0e1a06 0%, #0e0e14 40%, #0a0a12 100%)",
              border: "1px solid rgba(196,247,81,0.12)",
              minHeight: "clamp(340px, 40vw, 480px)",
            }}
          >
            {/* Radial glow from bottom-left */}
            <div
              className="absolute pointer-events-none"
              style={{
                inset: 0,
                background:
                  "radial-gradient(ellipse 55% 70% at 0% 110%, rgba(196,247,81,0.12) 0%, transparent 70%)",
              }}
            />

            {/* Animated circuit decoration */}
            <CircuitDecoration />

            {/* Content */}
            <div className="relative z-[1] p-8 md:p-12 lg:p-16 h-full flex flex-col justify-between">
              {/* Top row */}
              <div className="flex items-center gap-4 mb-8">
                <span
                  className="font-display font-black text-[5rem] md:text-[7rem] leading-none tracking-[-6px] select-none"
                  style={{ color: "#c4f751", opacity: 0.12 }}
                >
                  01
                </span>
                <div
                  className="h-px flex-1"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(196,247,81,0.3), transparent)",
                  }}
                />
                <span
                  className="font-code text-[0.5rem] tracking-[4px] uppercase px-3 py-1 rounded-full border"
                  style={{
                    color: "#c4f751",
                    borderColor: "rgba(196,247,81,0.25)",
                    background: "rgba(196,247,81,0.05)",
                  }}
                >
                  Featured
                </span>
              </div>

              {/* Title */}
              <div className="mb-6">
                <h3
                  className="font-display font-extrabold tracking-[-1.5px] leading-[1.08] mb-4"
                  style={{
                    fontSize: "clamp(1.8rem, 4vw, 3.2rem)",
                    color: "#f5f5f7",
                  }}
                >
                  {featured.title}
                </h3>
                <p
                  className="text-[0.9rem] md:text-[1rem] leading-[1.8] max-w-2xl"
                  style={{ color: "#9b97a8" }}
                >
                  {featured.desc}
                </p>
              </div>

              {/* Bottom row: metrics + tags */}
              <div className="flex flex-wrap items-end justify-between gap-8">
                {/* Metrics */}
                <div className="flex flex-wrap gap-8 md:gap-12">
                  {featured.metrics!.map((m) => (
                    <MetricCounter key={m.label} value={m.value} label={m.label} />
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {featured.tags.map((tag, ti) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1.5 font-code text-[0.55rem] uppercase tracking-[1.5px] px-3 py-1 rounded-full"
                      style={{
                        color: "#c4f751",
                        background: "rgba(196,247,81,0.07)",
                        border: "1px solid rgba(196,247,81,0.18)",
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: tagDotColors[ti % tagDotColors.length] }}
                      />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </FadeUp>

        {/* ── 2-COLUMN GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {rest.map((project, i) => (
            <FadeUp key={project.num} delay={0.06 * (i + 1)}>
              <ProjectCard project={project} index={i} />
            </FadeUp>
          ))}
        </div>

        {/* Decorative "WORK" watermark */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-display font-black leading-none pointer-events-none select-none -z-[1]"
          style={{
            fontSize: "clamp(8rem, 18vw, 22rem)",
            color: "rgba(255,255,255,0.012)",
            letterSpacing: "-8px",
            whiteSpace: "nowrap",
          }}
          aria-hidden="true"
        >
          WORK
        </div>
      </div>
    </section>
  );
}
