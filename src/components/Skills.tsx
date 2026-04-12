"use client";

import { useCallback, useRef, useState } from "react";
import { FadeUp } from "./RevealText";
import { useHunt } from "@/context/HuntContext";

type StackGroup = {
  title: string;
  items: string[];
  accent: string;
  usedIn: string[]; // case study titles
};

const STACK: StackGroup[] = [
  {
    title: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "SQL"],
    accent: "#c4f751",
    usedIn: ["FUS Script + IoT Platform", "EV Charging (OCPP)", "Digital Twin Engine", "Mobile SDK"],
  },
  {
    title: "Backend",
    items: ["Node.js", "Express.js", "Next.js"],
    accent: "#c4f751",
    usedIn: ["FUS Script + IoT Platform", "EV Charging (OCPP)", "Digital Twin Engine"],
  },
  {
    title: "Databases",
    items: ["PostgreSQL", "Redis", "Prisma ORM"],
    accent: "#818cf8",
    usedIn: ["FUS Script + IoT Platform", "EV Charging (OCPP)"],
  },
  {
    title: "Protocols",
    items: ["MQTT", "WebSockets", "HTTP", "OCPP 1.6J"],
    accent: "#c4f751",
    usedIn: ["FUS Script + IoT Platform", "EV Charging (OCPP)", "Digital Twin Engine"],
  },
  {
    title: "Infrastructure",
    items: ["Docker", "Kubernetes", "Linux", "GitHub Actions"],
    accent: "#fb923c",
    usedIn: ["FUS Script + IoT Platform", "EV Charging (OCPP)"],
  },
  {
    title: "Observability",
    items: ["Grafana", "Prometheus", "Elastic APM", "Kibana"],
    accent: "#fb923c",
    usedIn: ["FUS Script + IoT Platform"],
  },
  {
    title: "Mobile",
    items: ["React Native"],
    accent: "#818cf8",
    usedIn: ["Mobile SDK"],
  },
  {
    title: "Frontend",
    items: ["React", "Next.js"],
    accent: "#818cf8",
    usedIn: ["EV Charging (OCPP)", "Mobile SDK"],
  },
  {
    title: "Patterns",
    items: ["Event-driven architecture", "DSL design", "Distributed systems"],
    accent: "#c4f751",
    usedIn: ["FUS Script + IoT Platform", "Digital Twin Engine"],
  },
];

export function Skills() {
  const { isClueFound, canAttemptClue, unlockClue } = useHunt();
  const clue8Found = isClueFound(8);
  const clicked = useRef(new Set<string>());
  const [activeGroup, setActiveGroup] = useState<StackGroup | null>(null);

  const handleGroupClick = useCallback(
    (group: StackGroup) => {
      // Toggle the filter panel
      setActiveGroup((prev) => (prev?.title === group.title ? null : group));

      // Hunt clue attribution
      if (clue8Found && canAttemptClue(9)) {
        clicked.current.add(group.title);
        if (clicked.current.size >= STACK.length) {
          unlockClue(9);
          clicked.current.clear();
        }
      }
    },
    [clue8Found, canAttemptClue, unlockClue]
  );

  return (
    <section id="skills" className="py-24 md:py-36 relative z-[1]">
      {/* Diagonal line background pattern */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 40px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div className="max-w-[1300px] mx-auto px-6 md:px-12 relative" style={{ zIndex: 1 }}>
        <FadeUp>
          <span className="font-code text-[0.55rem] tracking-[6px] uppercase text-text-muted block mb-4">
            04 / Technical Stack
          </span>
        </FadeUp>
        <FadeUp delay={0.08}>
          <h2 className="font-display text-[clamp(1.6rem,4vw,3.2rem)] font-extrabold tracking-[-2px] leading-[1.1] mb-4">
            What I reach for,{" "}
            <span className="serif-italic font-normal">grouped honestly</span>.
          </h2>
        </FadeUp>
        <FadeUp delay={0.14}>
          <p className="text-[0.9rem] text-text-muted leading-[1.75] max-w-2xl mb-14">
            Not a popularity list — this is what actually shows up in my day-to-day
            work. <span className="text-accent">Click a group</span> to see which case studies used it.
          </p>
        </FadeUp>

        {/* 9-group stack grid */}
        <div
          className="grid gap-3 md:gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          }}
        >
          {STACK.map((group) => {
            const isActive = activeGroup?.title === group.title;
            const dim = activeGroup !== null && !isActive;
            return (
              <FadeUp key={group.title} delay={0.03}>
                <div
                  className="gsap-skill-card group relative rounded-2xl transition-all duration-300 h-full"
                  onClick={() => handleGroupClick(group)}
                  style={{
                    background: isActive
                      ? `${group.accent}14`
                      : "rgba(14,14,20,0.55)",
                    border: `1px solid ${isActive ? group.accent + "66" : group.accent + "1a"}`,
                    padding: "22px 24px",
                    cursor: "pointer",
                    opacity: dim ? 0.35 : 1,
                    boxShadow: isActive ? `0 0 40px ${group.accent}22` : "none",
                    transform: isActive ? "translateY(-2px)" : "translateY(0)",
                  }}
                >
                  {/* Top accent line */}
                  <div
                    className="absolute top-0 left-6 right-6 h-px transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${group.accent}, transparent)`,
                      opacity: isActive ? 1 : 0.4,
                    }}
                  />

                  {/* Title */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="font-code text-[0.55rem] tracking-[3px] uppercase"
                      style={{ color: group.accent, opacity: isActive ? 1 : 0.75 }}
                    >
                      {group.title}
                    </span>
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: group.accent, opacity: isActive ? 1 : 0.6 }}
                    />
                  </div>

                  {/* Items */}
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="font-code text-[0.68rem] px-2.5 py-1 rounded-md transition-colors duration-200"
                        style={{
                          color: isActive ? group.accent : "#d7d4e0",
                          background: isActive ? `${group.accent}10` : "rgba(255,255,255,0.03)",
                          border: `1px solid ${isActive ? group.accent + "33" : "rgba(255,255,255,0.05)"}`,
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeUp>
            );
          })}
        </div>

        {/* Reveal panel — shows which case studies used the active group */}
        <div
          className="mt-8 transition-all duration-500 overflow-hidden"
          style={{
            maxHeight: activeGroup ? 400 : 0,
            opacity: activeGroup ? 1 : 0,
          }}
        >
          {activeGroup && (
            <div
              className="rounded-2xl p-6 md:p-8"
              style={{
                background: `${activeGroup.accent}08`,
                border: `1px solid ${activeGroup.accent}33`,
              }}
            >
              <div className="flex items-baseline gap-3 mb-4">
                <span
                  className="font-code text-[0.55rem] tracking-[3px] uppercase"
                  style={{ color: activeGroup.accent }}
                >
                  {activeGroup.title} shows up in
                </span>
                <div className="h-px flex-1" style={{ background: `${activeGroup.accent}33` }} />
                <span className="font-code text-[0.55rem] tracking-[2px] uppercase text-text-muted">
                  {activeGroup.usedIn.length} {activeGroup.usedIn.length === 1 ? "project" : "projects"}
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {activeGroup.usedIn.map((name) => (
                  <a
                    key={name}
                    href="#work"
                    className="font-display font-semibold text-[0.9rem] px-4 py-2 rounded-lg transition-all duration-200 hover:scale-[1.03]"
                    style={{
                      color: activeGroup.accent,
                      background: `${activeGroup.accent}14`,
                      border: `1px solid ${activeGroup.accent}44`,
                    }}
                  >
                    ↗ {name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
