"use client";

import { useRef, useEffect, useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Project definitions — each with its own color world
// ─────────────────────────────────────────────────────────────────────────────
const projects = [
  {
    num: "01",
    title: "Device-Agnostic",
    titleLine2: "IoT Platform",
    type: "DSL + BACKEND + INFRA",
    desc: "A platform that onboards any device, any protocol — without new code. Powered by FUS Script, a custom DSL I designed for runtime protocol definitions and data transformations.",
    tags: ["TypeScript", "DSL", "Redis", "MQTT", "WebSockets"],
    metrics: [
      { value: "40%", label: "Faster Integration" },
      { value: "10K+", label: "Concurrent Devices" },
      { value: "₹40L+", label: "Project Value" },
    ],
    bg: "#0018cc",
    bg2: "#000ea0",
    textColor: "#ffffff",
    dimColor: "rgba(255,255,255,0.55)",
    tagBg: "rgba(255,255,255,0.1)",
    tagBorder: "rgba(255,255,255,0.2)",
    tagText: "#ffffff",
    visual: "iot",
  },
  {
    num: "02",
    title: "EV Charging",
    titleLine2: "Infrastructure",
    type: "REAL-TIME + PLATFORM",
    desc: "End-to-end platform with OCPP 1.6J. Real-time monitoring, analytics dashboards, sub-second telemetry, ~99% uptime across distributed charging stations.",
    tags: ["Node.js", "OCPP 1.6", "React", "WebSockets"],
    metrics: [
      { value: "99%", label: "Uptime" },
      { value: "<1s", label: "Telemetry latency" },
      { value: "Full", label: "OCPP 1.6J compliant" },
    ],
    bg: "#0b3d2e",
    bg2: "#071f17",
    textColor: "#a8f5d4",
    dimColor: "rgba(168,245,212,0.5)",
    tagBg: "rgba(168,245,212,0.08)",
    tagBorder: "rgba(168,245,212,0.2)",
    tagText: "#a8f5d4",
    visual: "ev",
  },
  {
    num: "03",
    title: "IoT Mobile App",
    titleLine2: "— Both Stores",
    type: "MOBILE + CROSS-PLATFORM",
    desc: "Cross-platform app for device onboarding, analytics, team management, and automation. Shipped to Play Store & App Store. Built with React Native.",
    tags: ["React Native", "IoT", "TypeScript"],
    metrics: [
      { value: "2", label: "App stores shipped" },
      { value: "Live", label: "Play Store & App Store" },
    ],
    bg: "#d63c00",
    bg2: "#a82d00",
    textColor: "#fff5f0",
    dimColor: "rgba(255,245,240,0.6)",
    tagBg: "rgba(255,245,240,0.1)",
    tagBorder: "rgba(255,245,240,0.25)",
    tagText: "#fff5f0",
    visual: "mobile",
  },
  {
    num: "04",
    title: "Digital Twin",
    titleLine2: "Engine",
    type: "SIMULATION + EVENT-DRIVEN",
    desc: "Plug-and-play simulation engine for 10K+ virtual IoT devices across industries. Stress-tests infrastructure before physical deployment.",
    tags: ["TypeScript", "Simulation", "Event-Driven"],
    metrics: [
      { value: "10K+", label: "Virtual devices" },
      { value: "Any", label: "Industry vertical" },
    ],
    bg: "#1e0058",
    bg2: "#0d0030",
    textColor: "#d4b8ff",
    dimColor: "rgba(212,184,255,0.5)",
    tagBg: "rgba(212,184,255,0.08)",
    tagBorder: "rgba(212,184,255,0.2)",
    tagText: "#d4b8ff",
    visual: "twin",
  },
  {
    num: "05",
    title: "Autonomous Job",
    titleLine2: "Manager",
    type: "AI + ORCHESTRATION",
    desc: "AI-driven job orchestration in isolated Docker containers with automated error recovery, retry logic, and real-time status monitoring.",
    tags: ["AI", "Docker", "Node.js", "Async"],
    metrics: [
      { value: "Auto", label: "Error recovery" },
      { value: "Isolated", label: "Container execution" },
    ],
    bg: "#161616",
    bg2: "#0a0a0a",
    textColor: "#e0e0e0",
    dimColor: "rgba(224,224,224,0.45)",
    tagBg: "rgba(255,255,255,0.05)",
    tagBorder: "rgba(255,255,255,0.12)",
    tagText: "#e0e0e0",
    visual: "jobs",
  },
  {
    num: "06",
    title: "Sonar Analysis",
    titleLine2: "Platform",
    type: "DATA + VISUALISATION",
    desc: "Audio-based sonar data processing → interactive heatmaps and charts. Python processing pipeline, Next.js visualization layer.",
    tags: ["Python", "Next.js", "Data Viz"],
    metrics: [
      { value: "Audio", label: "Sonar data input" },
      { value: "Live", label: "Heatmap output" },
    ],
    bg: "#0d2233",
    bg2: "#071525",
    textColor: "#7dd4f8",
    dimColor: "rgba(125,212,248,0.45)",
    tagBg: "rgba(125,212,248,0.07)",
    tagBorder: "rgba(125,212,248,0.18)",
    tagText: "#7dd4f8",
    visual: "sonar",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Custom SVG architecture diagrams per project — visual evidence
// ─────────────────────────────────────────────────────────────────────────────
function IoTDiagram({ textColor }: { textColor: string; dimColor?: string }) {
  return (
    <svg viewBox="0 0 480 260" fill="none" className="w-full h-full" aria-hidden="true">
      <style>{`
        @keyframes flow-right { to { stroke-dashoffset: -32; } }
        @keyframes flow-left  { to { stroke-dashoffset: 32; } }
        @keyframes node-pulse { 0%,100%{opacity:.7} 50%{opacity:1} }
        .flow-r { animation: flow-right 1.6s linear infinite; stroke-dasharray: 8 6; }
        .flow-l { animation: flow-left 1.6s linear infinite; stroke-dasharray: 8 6; }
        .pulse  { animation: node-pulse 2.5s ease-in-out infinite; }
      `}</style>

      {/* DSL Engine — centre hero box */}
      <rect x="170" y="90" width="140" height="60" rx="8" fill={textColor} fillOpacity=".06" stroke={textColor} strokeOpacity=".4" strokeWidth="1.5"/>
      <text x="240" y="116" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={textColor} opacity=".9" fontWeight="700">FUS SCRIPT</text>
      <text x="240" y="130" textAnchor="middle" fontFamily="monospace" fontSize="7.5" fill={textColor} opacity=".5">DSL Engine</text>

      {/* Devices left */}
      {[30, 80, 130].map((y, i) => (
        <g key={i} className="pulse" style={{ animationDelay: `${i * 0.4}s` }}>
          <rect x="14" y={y} width="68" height="28" rx="5" fill={textColor} fillOpacity=".05" stroke={textColor} strokeOpacity=".25" strokeWidth="1"/>
          <text x="48" y={y + 18} textAnchor="middle" fontFamily="monospace" fontSize="7" fill={textColor} opacity=".7">
            {["MQTT", "WebSocket", "HTTP"][i]}
          </text>
        </g>
      ))}
      {/* Connectors: devices → DSL */}
      {[44, 94, 144].map((y, i) => (
        <line key={i} className="flow-r" x1="84" y1={y} x2="170" y2={120} stroke={textColor} strokeOpacity=".3" strokeWidth="1"/>
      ))}

      {/* Redis right */}
      <rect x="366" y="55" width="100" height="32" rx="6" fill={textColor} fillOpacity=".05" stroke={textColor} strokeOpacity=".25" strokeWidth="1"/>
      <text x="416" y="75" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={textColor} opacity=".7" fontWeight="600">REDIS PUB/SUB</text>

      {/* Connectors: DSL → Redis / Dashboard */}
      <line className="flow-r" x1="310" y1="110" x2="366" y2="72" stroke={textColor} strokeOpacity=".35" strokeWidth="1"/>

      {/* Dashboard */}
      <rect x="366" y="115" width="100" height="32" rx="6" fill={textColor} fillOpacity=".05" stroke={textColor} strokeOpacity=".25" strokeWidth="1"/>
      <text x="416" y="135" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={textColor} opacity=".7" fontWeight="600">DASHBOARD</text>
      <line className="flow-r" x1="310" y1="125" x2="366" y2="131" stroke={textColor} strokeOpacity=".35" strokeWidth="1"/>

      {/* DB */}
      <rect x="366" y="175" width="100" height="32" rx="6" fill={textColor} fillOpacity=".05" stroke={textColor} strokeOpacity=".25" strokeWidth="1"/>
      <text x="416" y="195" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={textColor} opacity=".7" fontWeight="600">POSTGRESQL</text>
      <line className="flow-r" x1="310" y1="140" x2="366" y2="191" stroke={textColor} strokeOpacity=".35" strokeWidth="1"/>

      {/* Label */}
      <text x="14" y="210" fontFamily="monospace" fontSize="7" fill={textColor} opacity=".3">Any device. Any protocol.</text>
    </svg>
  );
}

function EVDiagram({ textColor }: { textColor: string }) {
  return (
    <svg viewBox="0 0 480 240" fill="none" className="w-full h-full" aria-hidden="true">
      <style>{`
        @keyframes charge-pulse { 0%,100%{opacity:.5;transform:scaleY(1)} 50%{opacity:1;transform:scaleY(1.06)} }
        .charger { animation: charge-pulse 2s ease-in-out infinite; transform-origin: center; }
      `}</style>

      {/* Central platform */}
      <rect x="155" y="80" width="170" height="70" rx="10" fill={textColor} fillOpacity=".05" stroke={textColor} strokeOpacity=".35" strokeWidth="1.5"/>
      <text x="240" y="111" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={textColor} opacity=".9" fontWeight="700">OCPP 1.6J</text>
      <text x="240" y="126" textAnchor="middle" fontFamily="monospace" fontSize="7.5" fill={textColor} opacity=".5">Platform Core</text>
      <text x="240" y="140" textAnchor="middle" fontFamily="monospace" fontSize="7" fill={textColor} opacity=".35">99% uptime</text>

      {/* Chargers left */}
      {[40, 100, 160].map((y, i) => (
        <g key={i} className="charger" style={{ animationDelay: `${i * 0.6}s` }}>
          <rect x="10" y={y} width="70" height="36" rx="6" fill={textColor} fillOpacity=".04" stroke={textColor} strokeOpacity=".2" strokeWidth="1"/>
          <text x="45" y={y + 14} textAnchor="middle" fontFamily="monospace" fontSize="7" fill={textColor} opacity=".6">Charger</text>
          <text x="45" y={y + 26} textAnchor="middle" fontFamily="monospace" fontSize="6.5" fill={textColor} opacity=".4">{`Station ${i + 1}`}</text>
          <line x1="82" y1={y + 18} x2="155" y2="115" stroke={textColor} strokeOpacity=".22" strokeWidth="1" strokeDasharray="5 4"/>
        </g>
      ))}

      {/* Right outputs */}
      {[
        { label: "Real-time Monitor", y: 55 },
        { label: "Analytics", y: 100 },
        { label: "Sub-second Telemetry", y: 145 },
        { label: "Alerts & Billing", y: 190 },
      ].map(({ label, y }) => (
        <g key={label}>
          <rect x="380" y={y} width="92" height="28" rx="5" fill={textColor} fillOpacity=".04" stroke={textColor} strokeOpacity=".2" strokeWidth="1"/>
          <text x="426" y={y + 18} textAnchor="middle" fontFamily="monospace" fontSize="7" fill={textColor} opacity=".6">{label}</text>
          <line x1="325" y1="115" x2="380" y2={y + 14} stroke={textColor} strokeOpacity=".2" strokeWidth="1" strokeDasharray="5 4"/>
        </g>
      ))}
    </svg>
  );
}

function MobileDiagram({ textColor }: { textColor: string }) {
  return (
    <svg viewBox="0 0 480 260" fill="none" className="w-full h-full" aria-hidden="true">
      {/* Phone outline */}
      <rect x="170" y="20" width="140" height="220" rx="18" fill={textColor} fillOpacity=".04" stroke={textColor} strokeOpacity=".3" strokeWidth="1.5"/>
      <rect x="200" y="34" width="80" height="12" rx="6" fill={textColor} fillOpacity=".08"/>
      {/* Screens inside */}
      <rect x="180" y="56" width="120" height="64" rx="6" fill={textColor} fillOpacity=".06" stroke={textColor} strokeOpacity=".15" strokeWidth="1"/>
      <text x="240" y="82" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={textColor} opacity=".7" fontWeight="600">Device Onboarding</text>
      <text x="240" y="96" textAnchor="middle" fontFamily="monospace" fontSize="7" fill={textColor} opacity=".4">QR scan → connect</text>
      <rect x="180" y="130" width="56" height="48" rx="5" fill={textColor} fillOpacity=".06" stroke={textColor} strokeOpacity=".12" strokeWidth="1"/>
      <text x="208" y="152" textAnchor="middle" fontFamily="monospace" fontSize="7" fill={textColor} opacity=".6">Analytics</text>
      <rect x="244" y="130" width="56" height="48" rx="5" fill={textColor} fillOpacity=".06" stroke={textColor} strokeOpacity=".12" strokeWidth="1"/>
      <text x="272" y="152" textAnchor="middle" fontFamily="monospace" fontSize="7" fill={textColor} opacity=".6">Alerts</text>
      {/* Stores */}
      <rect x="20" y="90" width="110" height="32" rx="6" fill={textColor} fillOpacity=".05" stroke={textColor} strokeOpacity=".2" strokeWidth="1"/>
      <text x="75" y="110" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={textColor} opacity=".7">▲ Play Store</text>
      <rect x="20" y="140" width="110" height="32" rx="6" fill={textColor} fillOpacity=".05" stroke={textColor} strokeOpacity=".2" strokeWidth="1"/>
      <text x="75" y="160" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={textColor} opacity=".7"> App Store</text>
      <line x1="130" y1="106" x2="170" y2="106" stroke={textColor} strokeOpacity=".2" strokeWidth="1" strokeDasharray="4 3"/>
      <line x1="130" y1="156" x2="170" y2="156" stroke={textColor} strokeOpacity=".2" strokeWidth="1" strokeDasharray="4 3"/>
      {/* React Native badge */}
      <rect x="350" y="100" width="108" height="32" rx="6" fill={textColor} fillOpacity=".05" stroke={textColor} strokeOpacity=".2" strokeWidth="1"/>
      <text x="404" y="120" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={textColor} opacity=".7">React Native</text>
      <line x1="310" y1="116" x2="350" y2="116" stroke={textColor} strokeOpacity=".2" strokeWidth="1" strokeDasharray="4 3"/>
    </svg>
  );
}

function TwinDiagram({ textColor }: { textColor: string }) {
  return (
    <svg viewBox="0 0 480 240" fill="none" className="w-full h-full" aria-hidden="true">
      <style>{`
        @keyframes twin-blink { 0%,100%{opacity:.4} 50%{opacity:.9} }
        .twin-dot { animation: twin-blink 1.8s ease-in-out infinite; }
      `}</style>
      {/* Grid of virtual devices */}
      {Array.from({ length: 25 }).map((_, i) => {
        const col = i % 5;
        const row = Math.floor(i / 5);
        const x = 20 + col * 54;
        const y = 20 + row * 44;
        return (
          <g key={i} className="twin-dot" style={{ animationDelay: `${(i * 0.12) % 2}s` }}>
            <rect x={x} y={y} width="42" height="30" rx="4" fill={textColor} fillOpacity=".05" stroke={textColor} strokeOpacity=".18" strokeWidth="1"/>
            <text x={x + 21} y={y + 19} textAnchor="middle" fontFamily="monospace" fontSize="6.5" fill={textColor} opacity=".55">
              {`DEV-${String(i + 1).padStart(2, "0")}`}
            </text>
          </g>
        );
      })}
      {/* Arrow to engine */}
      <line x1="296" y1="110" x2="370" y2="110" stroke={textColor} strokeOpacity=".3" strokeWidth="1.5" strokeDasharray="6 4"/>
      {/* Sim engine */}
      <rect x="370" y="82" width="100" height="56" rx="8" fill={textColor} fillOpacity=".06" stroke={textColor} strokeOpacity=".4" strokeWidth="1.5"/>
      <text x="420" y="107" textAnchor="middle" fontFamily="monospace" fontSize="8.5" fill={textColor} opacity=".9" fontWeight="700">SIM ENGINE</text>
      <text x="420" y="122" textAnchor="middle" fontFamily="monospace" fontSize="7" fill={textColor} opacity=".4">10K+ devices</text>
      {/* Label */}
      <text x="20" y="230" fontFamily="monospace" fontSize="7" fill={textColor} opacity=".3">Stress-test before physical deployment.</text>
    </svg>
  );
}

function JobsDiagram({ textColor }: { textColor: string }) {
  return (
    <svg viewBox="0 0 480 220" fill="none" className="w-full h-full" aria-hidden="true">
      <style>{`
        @keyframes job-spin { to { stroke-dashoffset: -40; } }
        .job-flow { animation: job-spin 2s linear infinite; stroke-dasharray: 10 6; }
      `}</style>
      {/* Orchestrator */}
      <rect x="170" y="80" width="140" height="56" rx="8" fill={textColor} fillOpacity=".07" stroke={textColor} strokeOpacity=".4" strokeWidth="1.5"/>
      <text x="240" y="106" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={textColor} opacity=".9" fontWeight="700">AI Orchestrator</text>
      <text x="240" y="122" textAnchor="middle" fontFamily="monospace" fontSize="7.5" fill={textColor} opacity=".45">Job scheduler</text>
      {/* Containers */}
      {[30, 100, 170].map((y, i) => (
        <g key={i}>
          <rect x="370" y={y} width="96" height="32" rx="6" fill={textColor} fillOpacity=".04" stroke={textColor} strokeOpacity=".2" strokeWidth="1"/>
          <text x="418" y={y + 14} textAnchor="middle" fontFamily="monospace" fontSize="7.5" fill={textColor} opacity=".6" fontWeight="600">Container</text>
          <text x="418" y={y + 25} textAnchor="middle" fontFamily="monospace" fontSize="6.5" fill={textColor} opacity=".38">{`Job ${i + 1}`}</text>
          <line className="job-flow" x1="310" y1="108" x2="370" y2={y + 16} stroke={textColor} strokeOpacity=".3" strokeWidth="1"/>
        </g>
      ))}
      {/* Input */}
      <rect x="14" y="86" width="110" height="42" rx="6" fill={textColor} fillOpacity=".04" stroke={textColor} strokeOpacity=".2" strokeWidth="1"/>
      <text x="69" y="106" textAnchor="middle" fontFamily="monospace" fontSize="7.5" fill={textColor} opacity=".6" fontWeight="600">Job Queue</text>
      <text x="69" y="120" textAnchor="middle" fontFamily="monospace" fontSize="6.5" fill={textColor} opacity=".38">+ Error recovery</text>
      <line className="job-flow" x1="124" y1="108" x2="170" y2="108" stroke={textColor} strokeOpacity=".3" strokeWidth="1.5"/>
    </svg>
  );
}

function SonarDiagram({ textColor }: { textColor: string }) {
  return (
    <svg viewBox="0 0 480 220" fill="none" className="w-full h-full" aria-hidden="true">
      {/* Sonar rings */}
      {[60, 100, 140].map((r, i) => (
        <circle key={i} cx="120" cy="110" r={r} stroke={textColor} strokeOpacity={0.15 - i * 0.04} strokeWidth="1" strokeDasharray="6 4"/>
      ))}
      <circle cx="120" cy="110" r="18" fill={textColor} fillOpacity=".08" stroke={textColor} strokeOpacity=".4" strokeWidth="1.5"/>
      <text x="120" y="114" textAnchor="middle" fontFamily="monospace" fontSize="7" fill={textColor} opacity=".7">SONAR</text>
      {/* Processing pipeline */}
      <line x1="260" y1="110" x2="220" y2="110" stroke={textColor} strokeOpacity=".3" strokeWidth="1.5" strokeDasharray="6 4"/>
      <rect x="260" y="80" width="100" height="60" rx="8" fill={textColor} fillOpacity=".05" stroke={textColor} strokeOpacity=".3" strokeWidth="1.5"/>
      <text x="310" y="107" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={textColor} opacity=".8" fontWeight="700">Python</text>
      <text x="310" y="121" textAnchor="middle" fontFamily="monospace" fontSize="7" fill={textColor} opacity=".45">Processing</text>
      {/* Output */}
      <line x1="360" y1="110" x2="400" y2="110" stroke={textColor} strokeOpacity=".3" strokeWidth="1.5" strokeDasharray="6 4"/>
      <rect x="400" y="80" width="72" height="60" rx="8" fill={textColor} fillOpacity=".05" stroke={textColor} strokeOpacity=".3" strokeWidth="1.5"/>
      <text x="436" y="107" textAnchor="middle" fontFamily="monospace" fontSize="7.5" fill={textColor} opacity=".8" fontWeight="700">Heat</text>
      <text x="436" y="119" textAnchor="middle" fontFamily="monospace" fontSize="7.5" fill={textColor} opacity=".8" fontWeight="700">maps</text>
    </svg>
  );
}

function ProjectVisual({ type, textColor, dimColor }: { type: string; textColor: string; dimColor: string }) {
  const style = { width: "100%", height: "100%", maxHeight: "220px" };
  switch (type) {
    case "iot":    return <div style={style}><IoTDiagram textColor={textColor} dimColor={dimColor} /></div>;
    case "ev":     return <div style={style}><EVDiagram textColor={textColor} /></div>;
    case "mobile": return <div style={style}><MobileDiagram textColor={textColor} /></div>;
    case "twin":   return <div style={style}><TwinDiagram textColor={textColor} /></div>;
    case "jobs":   return <div style={style}><JobsDiagram textColor={textColor} /></div>;
    case "sonar":  return <div style={style}><SonarDiagram textColor={textColor} /></div>;
    default:       return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Animated metric counter
// ─────────────────────────────────────────────────────────────────────────────
function MetricVal({ value, color }: { value: string; color: string }) {
  const [displayed, setDisplayed] = useState("–");
  const ref = useRef<HTMLDivElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true;
        const match = value.match(/^([₹<]?)(\d+(?:\.\d+)?)([KL%+s]*)$/);
        if (!match) { setDisplayed(value); return; }
        const [, pre, num, suf] = match;
        const n = parseFloat(num);
        const dur = 1000;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - (1 - p) ** 3;
          setDisplayed(`${pre}${Math.floor(eased * n)}${suf}`);
          if (p < 1) requestAnimationFrame(tick);
          else setDisplayed(value);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <div ref={ref} style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", lineHeight: 1, color, letterSpacing: "-1px" }}>
      {displayed}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Single project section — full bleed color world
// ─────────────────────────────────────────────────────────────────────────────
// ── Per-project tag pill with spring hover ────────────────────────────────────
function ProjectTag({
  tag,
  tagBg, tagBorder, tagText, textColor,
}: {
  tag: string;
  tagBg: string; tagBorder: string; tagText: string; textColor: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "var(--font-code)",
        fontSize: "0.55rem",
        letterSpacing: "1.5px",
        textTransform: "uppercase",
        padding: "5px 12px",
        borderRadius: "100px",
        background: hovered ? `${textColor}18` : tagBg,
        border: `1px solid ${hovered ? `${textColor}40` : tagBorder}`,
        color: hovered ? textColor : tagText,
        transform: hovered ? "scale(1.06) translateY(-1px)" : "scale(1) translateY(0)",
        transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
        display: "inline-block",
        cursor: "default",
      }}
    >
      {tag}
    </span>
  );
}

function ProjectSection({ project, index }: { project: typeof projects[number]; index: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); io.disconnect(); }
    }, { threshold: 0.08 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Visual panel tilt on hover — direct DOM mutation, zero re-renders
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    function onMove(e: MouseEvent) {
      const r = panel!.getBoundingClientRect();
      const ox = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const oy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      panel!.style.transform = `perspective(800px) rotateX(${oy * -4}deg) rotateY(${ox * 4}deg) scale(1.02)`;
    }
    function onLeave() {
      panel!.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";
    }
    panel.addEventListener("mousemove", onMove);
    panel.addEventListener("mouseleave", onLeave);
    return () => {
      panel.removeEventListener("mousemove", onMove);
      panel.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const { bg, bg2, textColor, dimColor, tagBg, tagBorder, tagText } = project;

  return (
    <div
      ref={ref}
      style={{
        background: `linear-gradient(135deg, ${bg} 0%, ${bg2} 100%)`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: "opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1)",
        transitionDelay: `${index * 0.05}s`,
      }}
    >
      <div
        className="max-w-[1300px] mx-auto"
        style={{ padding: "clamp(56px, 8vw, 100px) clamp(24px, 5vw, 64px)" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-16 items-center">

          {/* Left: text content */}
          <div>
            {/* Number + type tag row — Milkshake style */}
            <div className="flex items-center gap-4 mb-6">
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  fontSize: "clamp(3rem, 8vw, 6rem)",
                  lineHeight: 0.85,
                  color: textColor,
                  opacity: 0.12,
                  letterSpacing: "-3px",
                }}
              >
                {project.num}
              </span>
              <div
                style={{
                  height: "1px",
                  flex: 1,
                  background: `linear-gradient(90deg, ${textColor}40, transparent)`,
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-code)",
                  fontSize: "0.5rem",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  color: textColor,
                  opacity: 0.5,
                  whiteSpace: "nowrap",
                }}
              >
                {project.type}
              </span>
            </div>

            {/* Title — filled line 1, outlined line 2 (Milkshake dual-layer technique) */}
            <div className="mb-6">
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  fontSize: "clamp(2rem, 5vw, 4.2rem)",
                  lineHeight: 0.9,
                  letterSpacing: "-2px",
                  color: textColor,
                  display: "block",
                }}
              >
                {project.title}
              </h3>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  fontSize: "clamp(2rem, 5vw, 4.2rem)",
                  lineHeight: 0.9,
                  letterSpacing: "-2px",
                  color: "transparent",
                  WebkitTextStroke: `1.5px ${textColor}`,
                  WebkitTextFillColor: "transparent",
                  display: "block",
                  marginTop: "0.04em",
                }}
              >
                {project.titleLine2}
              </h3>
            </div>

            {/* Description */}
            <p
              style={{
                fontSize: "0.95rem",
                lineHeight: 1.8,
                color: dimColor,
                marginBottom: "24px",
                maxWidth: "500px",
              }}
            >
              {project.desc}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags.map((tag) => (
                <ProjectTag
                  key={tag}
                  tag={tag}
                  tagBg={tagBg}
                  tagBorder={tagBorder}
                  tagText={tagText}
                  textColor={textColor}
                />
              ))}
              <span
                style={{
                  fontFamily: "var(--font-code)",
                  fontSize: "0.5rem",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  padding: "5px 12px",
                  borderRadius: "100px",
                  background: "transparent",
                  border: `1px solid ${textColor}20`,
                  color: `${textColor}40`,
                }}
              >
                Proprietary
              </span>
            </div>

            {/* Metrics */}
            {project.metrics && (
              <div className="flex flex-wrap gap-8">
                {project.metrics.map((m) => (
                  <div key={m.label}>
                    <MetricVal value={m.value} color={textColor} />
                    <div
                      style={{
                        fontFamily: "var(--font-code)",
                        fontSize: "0.55rem",
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                        color: dimColor,
                        marginTop: "4px",
                      }}
                    >
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: architecture diagram */}
          <div
            ref={panelRef}
            style={{
              background: `${textColor}05`,
              border: `1px solid ${textColor}15`,
              borderRadius: "16px",
              padding: "24px",
              minHeight: "220px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              willChange: "transform",
              transition: "transform 0.18s cubic-bezier(0.23, 1, 0.32, 1)",
              cursor: "default",
            }}
          >
            <ProjectVisual type={project.visual} textColor={textColor} dimColor={dimColor} />
          </div>

        </div>
      </div>

      {/* Bottom rule between sections */}
      <div style={{ height: "1px", background: `${textColor}10` }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────
export function Projects() {
  return (
    <section id="work" className="relative z-[1]">

      {/* Section header — dark bg before the color worlds begin */}
      <div
        style={{
          background: "var(--color-bg)",
          padding: "clamp(80px, 10vw, 130px) clamp(24px, 5vw, 64px) clamp(56px, 7vw, 90px)",
        }}
      >
        <div className="max-w-[1300px] mx-auto">
          <div className="gsap-fade-up flex items-baseline gap-4 mb-4">
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: "clamp(2rem, 5vw, 4.5rem)",
                fontWeight: 300,
                color: "rgba(255,255,255,0.15)",
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
                color: "var(--color-text)",
                lineHeight: 0.85,
                letterSpacing: "-4px",
              }}
            >
              02
            </span>
            <span className="font-code uppercase tracking-[4px] text-[0.55rem] text-text-muted" style={{ alignSelf: "center" }}>
              Work
            </span>
          </div>

          <h2
            className="font-display font-extrabold tracking-[-3px] leading-[0.9] gsap-fade-up"
            style={{ fontSize: "clamp(2.4rem, 7vw, 6.5rem)", color: "var(--color-text)" }}
            data-delay="0.08"
          >
            Selected{" "}
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 300,
                letterSpacing: "-2px",
                color: "var(--color-text-dim)",
              }}
            >
              projects
            </span>
          </h2>

          <p
            className="gsap-fade-up"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.9rem",
              color: "var(--color-text-muted)",
              marginTop: "20px",
              maxWidth: "460px",
              lineHeight: 1.75,
            }}
            data-delay="0.14"
          >
            Six production systems — all proprietary, all documented below with architecture diagrams.
          </p>
        </div>
      </div>

      {/* Per-project color world sections */}
      {projects.map((project, i) => (
        <ProjectSection key={project.num} project={project} index={i} />
      ))}
    </section>
  );
}
