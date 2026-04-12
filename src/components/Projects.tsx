"use client";

import { useCallback, useRef, useState } from "react";
import { FadeUp } from "./RevealText";
import { FusScriptDemo } from "./FusScriptDemo";

type CaseStudy = {
  num: string;
  title: string;
  tagline: string;
  role: string;
  year: string;
  stack: string[];
  paragraphs: { heading: string; body: string }[];
  accent: string;
  github?: string;
  demo?: string;
  private?: boolean;
  playground?: boolean;
  architecture?: boolean;
  aside?: string;
};

const caseStudies: CaseStudy[] = [
  {
    num: "01",
    title: "FUS Script + Device-Agnostic IoT Platform",
    tagline: "Onboard any device. Any protocol. Without a redeploy.",
    role: "Platform Engineer · WaveFuel Solutions",
    year: "2024 — present",
    stack: ["TypeScript", "Node.js", "PostgreSQL", "Redis", "MQTT", "WebSockets", "Docker", "Kubernetes"],
    paragraphs: [
      {
        heading: "The problem",
        body: "Every new client came with a different device, a different protocol, and a different data contract. Onboarding each one meant days of custom code and a redeploy. The platform didn't scale with the pipeline.",
      },
      {
        heading: "What I built",
        body: "I designed FUS Script — a custom domain-specific language and runtime parser that lets us define device protocols and data transformations at runtime. Adding a new device type means writing a FUS Script definition, not shipping code. The parser handles field-level data mapping and runtime operations like RSA encryption on specific outbound fields. Around it I built the ingest and messaging layer — a Redis-backed routing system that handles cross-instance WebSocket delivery in a clustered load-balanced environment, so a message sent by the user reaches the right device regardless of which backend instance holds the connection.",
      },
      {
        heading: "What was hard",
        body: "Two things. First, making the DSL flexible yet rigid — flexible enough to cover arbitrary device protocols, rigid enough that the parser rejects bad definitions at parse time, not runtime. Second, the cross-instance routing: a load-balanced cluster means a device and its user can be on different server instances, and messages have to find the device without broadcasting. Redis holds the device-to-instance map; the messaging layer reads it before dispatch.",
      },
    ],
    accent: "#c4f751",
    private: true,
    playground: true,
    architecture: true,
  },
  {
    num: "02",
    title: "EV Charging Infrastructure (OCPP 1.6J)",
    tagline: "Production EV charging, end-to-end.",
    role: "Software Engineer · Varsun eTechnologies (consultant for WaveFuel)",
    year: "2022 — 2024",
    stack: ["TypeScript", "Node.js", "React", "OCPP 1.6J", "WebSockets"],
    paragraphs: [
      {
        heading: "The problem",
        body: "Deliver a full EV charging platform from scratch on the OCPP 1.6J protocol — onboarding, monitoring, control, per-site dashboards. The first real production system I owned end-to-end.",
      },
      {
        heading: "What I built",
        body: "A multi-site EV charger management platform. Clients can onboard OCPP-compatible chargers, assign them to sites, monitor live telemetry, trigger remote commands, and see analytics dashboards for utilization and power consumption. Full-stack: backend message handling against OCPP, frontend dashboard and site admin, and the telemetry pipeline feeding the analytics layer.",
      },
      {
        heading: "What was hard",
        body: "OCPP 1.6J is a chatty, strict protocol. Sub-second telemetry requires careful WebSocket handling and efficient session state so the platform can hold thousands of charger sessions without drifting. I spent real time on the session layer — specifically on how to cleanly recover a charger's state after a dropped connection without replaying the whole session.",
      },
    ],
    accent: "#818cf8",
    private: true,
  },
  {
    num: "03",
    title: "Digital Twin Simulation Engine",
    tagline: "A reusable simulator for any industry's IoT devices.",
    role: "Platform Engineer · WaveFuel Solutions",
    year: "2024",
    stack: ["TypeScript", "Node.js", "Event-Driven", "MQTT"],
    paragraphs: [
      {
        heading: "The problem",
        body: "Load tests, client demos, and architecture reviews all required physical IoT devices. Physical devices are slow to procure, expensive, and don't scale past tens. We needed a way to simulate thousands of realistic devices without hardware.",
      },
      {
        heading: "What I built",
        body: "A plug-and-play simulation engine. The first implementation modeled the dairy industry — I researched end-to-end data flows, the sensors and actuators involved, the alerting patterns. That research became a reusable simulation base: the same engine can simulate a different industry by swapping in new device definitions. It feeds our real IoT platform, so the devices look and behave like real ones from the server's perspective.",
      },
      {
        heading: "What was hard",
        body: "Making the engine generic without making it toothless. I wanted 'define a new industry in a config, get a working simulator' — not 'build a new engine per industry.' The hard part was designing the device abstraction so the dairy-specific work didn't leak into the base. Stress-tested with 10,000+ concurrent simulated devices across multiple industries, with no physical hardware.",
      },
    ],
    accent: "#c4f751",
    private: true,
  },
  {
    num: "04",
    title: "IoT Mobile SDK + Consumer App",
    tagline: "Shipped to both stores. Mobile sync is where joy goes to die.",
    role: "Software Engineer · Varsun eTechnologies",
    year: "2023 — 2024",
    stack: ["React Native", "TypeScript", "BLE", "Wi-Fi Provisioning"],
    paragraphs: [
      {
        heading: "The problem",
        body: "A client needed a consumer-facing mobile app where end-users could onboard the client's IoT devices, share access with family members, create automation scenes and routines, and see usage analytics. Had to ship cross-platform.",
      },
      {
        heading: "What I built",
        body: "A React Native app and the cross-platform SDK underneath it. The SDK abstracts device onboarding — BLE pairing, Wi-Fi provisioning, handshake with the server, ownership assignment — so the app code doesn't have to know about any of it. The app wraps the SDK with user-facing flows: adding a device, inviting a household member, building a scene, viewing analytics. Shipped to both Google Play and the iOS App Store.",
      },
      {
        heading: "The honest note",
        body: "This is also the project that taught me how much pain there is in cross-platform mobile state sync. Between BLE reconnect storms, OS-level background restrictions, and the two platforms disagreeing on how to handle provisioning, most of the work was making the SDK feel reliable even when the underlying conditions aren't.",
      },
    ],
    accent: "#fb923c",
    private: true,
    aside: "Mobile sync is where joy goes to die.",
  },
];

const alsoShipped = [
  {
    title: "Autonomous Job Manager",
    year: "2023",
    desc: "AI-driven async task orchestration in isolated Docker containers with automated error recovery.",
    stack: "Node.js · Docker",
  },
  {
    title: "Form Builder",
    year: "2024",
    desc: "Drag-and-drop grid form builder used by a client to generate iframe-embeddable forms for their website.",
    stack: "React · Next.js",
  },
  {
    title: "Sonar Audio Analysis Tool",
    year: "2023",
    desc: "Audio signal processing pipeline generating heatmaps from sonar recordings for object identification.",
    stack: "Python · Next.js",
  },
  {
    title: "AI Chatbot MCP Tool Server",
    year: "2025",
    desc: "Designed and documented the MCP tool surface so an AI chatbot could perform every operation the IoT platform supports.",
    stack: "TypeScript · MCP",
  },
];

/**
 * Drag-to-reveal overlay for the flagship case study's architecture diagram.
 * Pure CSS + pointer events — no GSAP needed. Tracks pointer while dragging
 * and eats away the overlay using a radial-gradient mask.
 */
function DragToRevealArchitecture() {
  const ref = useRef<HTMLDivElement>(null);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [dragging, setDragging] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const addPoint = useCallback((clientX: number, clientY: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    setPoints((prev) => {
      const next = [...prev, { x, y }];
      if (next.length > 60) next.splice(0, next.length - 60);
      if (next.length >= 20) setRevealed(true);
      return next;
    });
  }, []);

  const maskImage = points.length
    ? points
        .map((p) => `radial-gradient(circle 70px at ${p.x}% ${p.y}%, transparent 0%, transparent 40%, black 100%)`)
        .join(", ")
    : undefined;

  return (
    <div
      ref={ref}
      className="relative rounded-2xl overflow-hidden select-none touch-none"
      style={{
        background: "rgba(10,10,14,0.7)",
        border: "1px solid rgba(196,247,81,0.15)",
        aspectRatio: "16 / 7",
      }}
      onPointerDown={(e) => {
        (e.target as Element).setPointerCapture?.(e.pointerId);
        setDragging(true);
        addPoint(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => {
        if (dragging) addPoint(e.clientX, e.clientY);
      }}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
    >
      {/* Architecture diagram (the thing being revealed) */}
      <div className="absolute inset-0 p-6 md:p-8 flex items-center justify-between gap-4 font-code text-[0.6rem] md:text-[0.7rem] tracking-[1.5px] uppercase">
        {[
          { label: "Device", sub: "MQTT / TCP" },
          { label: "FUS Parser", sub: "DSL runtime" },
          { label: "Redis Router", sub: "instance map" },
          { label: "WS Gateway", sub: "cluster-aware" },
          { label: "User", sub: "browser / app" },
        ].map((node, i, arr) => (
          <div key={node.label} className="flex items-center flex-1">
            <div
              className="flex-1 flex flex-col items-center gap-1 rounded-md px-2 py-3"
              style={{
                border: "1px solid rgba(196,247,81,0.3)",
                background: "rgba(196,247,81,0.04)",
                color: "#c4f751",
              }}
            >
              <span className="font-bold text-[0.7rem] md:text-[0.8rem] normal-case tracking-normal">
                {node.label}
              </span>
              <span className="text-[0.55rem] opacity-60">{node.sub}</span>
            </div>
            {i < arr.length - 1 && (
              <div
                className="h-px w-3 md:w-5 flex-shrink-0"
                style={{ background: "rgba(196,247,81,0.4)" }}
              />
            )}
          </div>
        ))}
      </div>

      {/* The overlay that erases on drag */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
        style={{
          background:
            "linear-gradient(135deg, rgba(196,247,81,0.08), rgba(0,0,0,0.95))",
          maskImage,
          WebkitMaskImage: maskImage,
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
          opacity: revealed ? 0 : 1,
          pointerEvents: revealed ? "none" : "auto",
        }}
      >
        <div className="flex flex-col items-center gap-2 text-center pointer-events-none">
          <span
            className="font-code text-[0.65rem] tracking-[4px] uppercase"
            style={{ color: "#c4f751" }}
          >
            drag to reveal architecture
          </span>
          <span
            className="font-code text-[0.55rem] tracking-[2px] uppercase"
            style={{ color: "#9b97a8" }}
          >
            ↓ ↓ ↓
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * CaseStudyCard — the full-depth card used for all 4 featured case studies.
 * Supports the multi-paragraph format, a stack rail, optional FUS playground,
 * and the drag-to-reveal architecture for the flagship.
 */
function CaseStudyCard({ cs }: { cs: CaseStudy }) {
  const isFeatured = cs.num === "01";

  return (
    <div
      className="gsap-project-card relative overflow-hidden rounded-3xl"
      style={{
        background: isFeatured
          ? "linear-gradient(135deg, #0e1a06 0%, #0e0e14 40%, #0a0a12 100%)"
          : "rgba(14,14,20,0.6)",
        border: `1px solid ${cs.accent}1f`,
      }}
    >
      {/* Radial glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: 0,
          background: `radial-gradient(ellipse 55% 70% at 0% 100%, ${cs.accent}15 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-[1] p-7 md:p-10 lg:p-12">
        {/* Top row: num + separator + featured badge */}
        <div className="flex items-center gap-4 mb-8">
          <span
            className="font-display font-black leading-none tracking-[-4px] select-none"
            style={{
              fontSize: "clamp(3rem, 6vw, 5.5rem)",
              color: cs.accent,
              opacity: 0.14,
            }}
          >
            {cs.num}
          </span>
          <div
            className="h-px flex-1"
            style={{ background: `linear-gradient(90deg, ${cs.accent}40, transparent)` }}
          />
          <span
            className="font-code text-[0.5rem] tracking-[3px] uppercase"
            style={{ color: cs.accent, opacity: 0.7 }}
          >
            {cs.year}
          </span>
        </div>

        {/* Title + tagline */}
        <h3
          className="font-display font-extrabold tracking-[-1px] leading-[1.08] mb-3"
          style={{
            fontSize: "clamp(1.6rem, 3.2vw, 2.6rem)",
            color: "#f5f5f7",
          }}
        >
          {cs.title}
        </h3>
        <p
          className="text-[0.85rem] md:text-[0.95rem] leading-[1.6] mb-2 serif-italic"
          style={{ color: cs.accent, opacity: 0.85 }}
        >
          {cs.tagline}
        </p>
        <p
          className="font-code text-[0.6rem] tracking-[2px] uppercase mb-8"
          style={{ color: "#56526a" }}
        >
          {cs.role}
        </p>

        {/* Paragraphs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8">
          {cs.paragraphs.map((p) => (
            <div key={p.heading} className="flex flex-col gap-2">
              <span
                className="font-code text-[0.55rem] tracking-[2.5px] uppercase"
                style={{ color: cs.accent, opacity: 0.75 }}
              >
                {p.heading}
              </span>
              <p
                className="text-[0.78rem] md:text-[0.82rem] leading-[1.75]"
                style={{ color: "#9b97a8" }}
              >
                {p.body}
              </p>
            </div>
          ))}
        </div>

        {cs.aside && (
          <p
            className="serif-italic text-[0.85rem] leading-relaxed mb-8"
            style={{ color: "#d7d4e0", opacity: 0.7 }}
          >
            “{cs.aside}”
          </p>
        )}

        {/* Architecture reveal (flagship only) */}
        {cs.architecture && (
          <div className="mb-8">
            <DragToRevealArchitecture />
          </div>
        )}

        {/* FUS Script playground (flagship only) */}
        {cs.playground && (
          <div className="mb-8">
            <div
              className="font-code text-[0.55rem] tracking-[3px] uppercase mb-3"
              style={{ color: "#56526a" }}
            >
              ↓ play with a sample fus script definition
            </div>
            <FusScriptDemo />
          </div>
        )}

        {/* Stack rail */}
        <div className="flex flex-wrap items-center gap-2 pt-6 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          {cs.stack.map((tech) => (
            <span
              key={tech}
              className="font-code text-[0.55rem] uppercase tracking-[1.5px] px-2.5 py-1 rounded-full"
              style={{
                color: cs.accent,
                background: `${cs.accent}0d`,
                border: `1px solid ${cs.accent}22`,
              }}
            >
              {tech}
            </span>
          ))}
          {cs.private && (
            <span
              className="font-code text-[0.5rem] tracking-[2px] uppercase px-2.5 py-1 rounded-full ml-auto"
              style={{ color: "#56526a", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              private · client work
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function Projects() {
  return (
    <section id="work" className="py-24 md:py-36 relative z-[1]">
      <div className="max-w-[1300px] mx-auto px-6 md:px-12">
        {/* Section label */}
        <FadeUp>
          <span className="font-code text-[0.55rem] tracking-[6px] uppercase text-[#56526a] block mb-4">
            02 / Selected Work
          </span>
        </FadeUp>
        <FadeUp delay={0.08}>
          <h2 className="font-display text-[clamp(1.6rem,4vw,3.2rem)] font-extrabold tracking-[-2px] leading-[1.1] mb-4">
            Four things I&apos;ve built{" "}
            <span className="serif-italic font-normal" style={{ color: "#f5f5f7" }}>
              end to end
            </span>
            .
          </h2>
        </FadeUp>
        <FadeUp delay={0.14}>
          <p className="text-[0.9rem] text-[#9b97a8] leading-[1.75] max-w-2xl mb-14">
            Each of these shipped to production and has real clients on the other side.
            I&apos;ve kept the specifics vague where they belong to an employer; the technical
            shape is honest.
          </p>
        </FadeUp>

        {/* Case study cards — stacked vertically for multi-paragraph depth */}
        <div className="flex flex-col gap-6 md:gap-8">
          {caseStudies.map((cs, i) => (
            <FadeUp key={cs.num} delay={0.06 * (i + 1)}>
              <CaseStudyCard cs={cs} />
            </FadeUp>
          ))}
        </div>

        {/* Also shipped strip */}
        <FadeUp delay={0.1}>
          <div className="mt-20 md:mt-28">
            <div className="flex items-center gap-4 mb-8">
              <span
                className="font-code text-[0.55rem] tracking-[4px] uppercase"
                style={{ color: "#56526a" }}
              >
                also shipped
              </span>
              <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
              {alsoShipped.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-4 py-3 border-b"
                  style={{ borderColor: "rgba(255,255,255,0.05)" }}
                >
                  <span
                    className="font-code text-[0.55rem] tracking-[2px] uppercase pt-1 flex-shrink-0"
                    style={{ color: "#56526a" }}
                  >
                    {item.year}
                  </span>
                  <div className="flex-1">
                    <div
                      className="font-display text-[0.95rem] font-semibold mb-1"
                      style={{ color: "#f5f5f7" }}
                    >
                      {item.title}
                    </div>
                    <p className="text-[0.78rem] leading-[1.65]" style={{ color: "#9b97a8" }}>
                      {item.desc}
                    </p>
                    <div
                      className="font-code text-[0.55rem] tracking-[1.5px] uppercase mt-2"
                      style={{ color: "#56526a" }}
                    >
                      {item.stack}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>

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
