"use client";

import { FadeUp } from "./RevealText";

const projects = [
  {
    num: "01",
    title: "Device-Agnostic IoT Platform",
    desc: "Device-agnostic IoT telemetry core — HTTP + MQTT + WebSocket ingress with a custom DSL (FUS Script) for runtime-parseable device message schemas and field-level transformations including RSA encryption. Redis-routed messaging tracks connected devices across clustered WebSocket instances so horizontal scaling doesn't break cross-instance routing.",
    tags: ["TypeScript", "FUS Script DSL", "Redis", "MQTT", "WebSockets", "PostgreSQL"],
    highlights: [
      { label: "Ingress", value: "HTTP + MQTT + WS" },
      { label: "DSL", value: "Runtime Parser" },
      { label: "Crypto", value: "RSA Field-Level" },
    ],
    accent: "#c4f751",
    featured: true,
    github: "",
    demo: "",
  },
  {
    num: "02",
    title: "EV Charging Infrastructure",
    desc: "Client-side OCPP 1.6J integration for EV chargers under a multi-site EV management dashboard. Onboarding across sites, real-time utilization and power-consumption monitoring, analytics surfaced to operators. Built as Varsun's delivery to WaveFuel's core product.",
    tags: ["React", "Node.js", "OCPP 1.6J", "WebSockets"],
    accent: "#818cf8",
    featured: false,
    github: "",
    demo: "",
  },
  {
    num: "03",
    title: "IoT Mobile App",
    desc: "React Native companion app for end-customers of the IoT platform. Device onboarding, usage analytics, user invitations, scene/routine automation, in-app guides. Shipped to both Play Store and App Store.",
    tags: ["React Native", "TypeScript", "REST", "WebSockets"],
    accent: "#fb923c",
    featured: false,
    github: "",
    demo: "",
  },
  {
    num: "04",
    title: "Digital Twin Engine",
    desc: "Reusable digital twin simulation engine. Initial vertical: dairy industry — researched end-to-end device flows, built a flexible multi-device simulator, established a pattern extensible to other industrial verticals. Enables client demos and load-testing of the IoT platform without physical hardware.",
    tags: ["Node.js", "TypeScript", "Simulation"],
    accent: "#c4f751",
    featured: false,
    github: "",
    demo: "",
  },
  {
    num: "05",
    title: "Autonomous Job Manager",
    desc: "Personal exploration project. Deterministic orchestration engine in Go for sandboxed execution of AI task pipelines — queues jobs, isolates runtime in Docker containers, surfaces structured results with automatic error recovery. Pattern-level proof of wrapping non-deterministic LLM calls in deterministic infrastructure.",
    tags: ["Go", "Docker", "Personal Project"],
    accent: "#818cf8",
    featured: false,
    github: "",
    demo: "",
  },
  {
    num: "06",
    title: "Sonar Analysis Platform",
    desc: "Sonar-based audio analysis tool for object identification. Python signal-processing pipeline feeding a Next.js UI that renders real-time heatmap visualizations from audio streams.",
    tags: ["Python", "NumPy/SciPy", "Next.js"],
    accent: "#fb923c",
    featured: false,
    github: "",
    demo: "",
  },
];

// Tag dot colors cycle
const tagDotColors = ["#c4f751", "#818cf8", "#fb923c", "#38bdf8", "#f472b6"];

// Static highlight block — pairs a short value with an uppercase label.
function Highlight({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span
        className="font-display font-bold text-lg md:text-xl tracking-tight"
        style={{ color: "#c4f751" }}
      >
        {value}
      </span>
      <span className="font-code text-[0.5rem] uppercase tracking-[3px] text-[#56526a]">
        {label}
      </span>
    </div>
  );
}

// Static circuit SVG decoration for featured card
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
      {/* Horizontal rails */}
      <line x1="0" y1="80" x2="420" y2="80" stroke="#c4f751" strokeWidth="1" strokeDasharray="8 6" />
      <line x1="0" y1="200" x2="420" y2="200" stroke="#c4f751" strokeWidth="1" strokeDasharray="12 8" />
      <line x1="0" y1="320" x2="420" y2="320" stroke="#c4f751" strokeWidth="1" strokeDasharray="8 6" />
      {/* Vertical rails */}
      <line x1="100" y1="0" x2="100" y2="420" stroke="#c4f751" strokeWidth="1" strokeDasharray="12 8" />
      <line x1="240" y1="0" x2="240" y2="420" stroke="#c4f751" strokeWidth="1" strokeDasharray="8 6" />
      <line x1="360" y1="0" x2="360" y2="420" stroke="#c4f751" strokeWidth="1" strokeDasharray="12 8" />
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

// Non-featured project card — CSS-only hover, no JS mouse tracking
function ProjectCard({ project }: { project: typeof projects[number] }) {
  return (
    <div
      className="gsap-project-card project-card h-full bg-[#111118] rounded-2xl relative overflow-hidden flex flex-col justify-between group"
      style={{
        border: "1px solid rgba(255,255,255,0.05)",
        transition: "border-color 0.35s ease, transform 0.35s ease, box-shadow 0.35s ease",
        ["--card-accent" as string]: project.accent,
      }}
    >
      {/* Accent top border — visible on hover via group */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-400"
        style={{
          background: `linear-gradient(90deg, transparent, ${project.accent}, transparent)`,
        }}
      />

      <div className="relative z-[1] p-6 md:p-7 flex flex-col h-full">
        {/* Number + accent dot row */}
        <div className="flex items-start justify-between mb-5">
          <span
            className="font-display font-black text-[3.5rem] leading-none tracking-[-4px] select-none opacity-[0.07] group-hover:opacity-[0.18] transition-opacity duration-400"
            style={{ color: project.accent }}
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

        {/* Description */}
        <p className="text-[0.8rem] leading-[1.75] flex-1" style={{ color: "#9b97a8" }}>
          {project.desc}
        </p>

        {/* Tags + links row */}
        <div className="flex items-end justify-between gap-2 mt-5 pt-4 border-t border-[rgba(255,255,255,0.05)]">
          <div className="flex flex-wrap gap-2">
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
          {/* External links */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {project.github ? (
              <a href={project.github} target="_blank" rel="noopener noreferrer"
                className="text-[#56526a] hover:text-text transition-colors duration-200"
                onClick={(e) => e.stopPropagation()} title="GitHub">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            ) : (
              <span className="font-code text-[0.48rem] tracking-[1px] text-[#3a3847]">private</span>
            )}
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer"
                className="text-[#56526a] hover:text-text transition-colors duration-200"
                onClick={(e) => e.stopPropagation()} title="Live demo">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
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

              {/* Bottom row: highlights + tags */}
              <div className="flex flex-wrap items-end justify-between gap-8">
                {/* Highlights */}
                <div className="flex flex-wrap gap-8 md:gap-12">
                  {featured.highlights!.map((h) => (
                    <Highlight key={h.label} value={h.value} label={h.label} />
                  ))}
                </div>

                {/* Tags + links */}
                <div className="flex flex-wrap items-center gap-2">
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
                  {/* Show "private" badge for featured since it's proprietary */}
                  <span
                    className="font-code text-[0.5rem] tracking-[2px] uppercase px-3 py-1 rounded-full"
                    style={{ color: "rgba(196,247,81,0.3)", border: "1px solid rgba(196,247,81,0.1)" }}
                  >
                    Private
                  </span>
                </div>
              </div>
            </div>
          </div>
        </FadeUp>

        {/* ── 2-COLUMN GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {rest.map((project, i) => (
            <FadeUp key={project.num} delay={0.06 * (i + 1)}>
              <ProjectCard project={project} />
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
