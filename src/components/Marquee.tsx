"use client";

import { useCallback, useRef } from "react";
import { useHunt } from "@/context/HuntContext";

const ROW_1 = [
  "TypeScript", "React", "Node.js", "Next.js", "React Native",
  "Redis", "Docker", "Kubernetes", "PostgreSQL", "MQTT",
  "WebSockets", "Python", "Distributed Systems", "DSL Design",
];

const ROW_2 = [
  "IoT Platforms", "Edge Computing", "CI/CD", "Terraform", "Linux",
  "gRPC", "REST APIs", "Event Sourcing", "Microservices", "Rust",
  "Prometheus", "Grafana", "AWS", "Embedded Systems",
];

// Six marquee items rendered slightly brighter after clue 4 is found.
// Clicking all 6 (in any order) unlocks clue 5.
const BRIGHT_ITEMS = new Set([
  "Docker",          // ROW_1
  "MQTT",            // ROW_1
  "Python",          // ROW_1
  "Edge Computing",  // ROW_2
  "Linux",           // ROW_2
  "Prometheus",      // ROW_2
]);

interface MarqueeRowProps {
  items: string[];
  direction?: "left" | "right";
  speed?: number;
  clue4Found?: boolean;
  onBrightClick?: (item: string) => void;
}

function MarqueeRow({ items, direction = "left", speed = 32, clue4Found, onBrightClick }: MarqueeRowProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const doubled = [...items, ...items];
  const animName = direction === "left" ? "marquee-left" : "marquee-right";

  const handleMouseEnter = () => {
    if (trackRef.current) {
      trackRef.current.style.animationPlayState = "paused";
    }
  };

  const handleMouseLeave = () => {
    if (trackRef.current) {
      trackRef.current.style.animationPlayState = "running";
    }
  };

  return (
    <div
      className="overflow-hidden relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={trackRef}
        className="flex w-max"
        style={{
          animation: `${animName} ${speed}s linear infinite`,
        }}
      >
        {doubled.map((item, i) => {
          const isBright = clue4Found && BRIGHT_ITEMS.has(item);
          return (
            <span
              key={i}
              className="marquee-item font-code text-[0.8rem] px-7 whitespace-nowrap flex items-center gap-6 select-none transition-colors duration-200"
              style={{
                color: isBright ? "rgba(230,230,238,0.95)" : "rgba(178,175,187,0.75)",
                cursor: isBright ? "pointer" : "default",
                fontWeight: isBright ? 550 : 500,
              }}
              onClick={isBright && onBrightClick ? () => onBrightClick(item) : undefined}
            >
              {item}
              <span
                className="w-1.5 h-1.5 rounded-full bg-accent transition-opacity duration-200 marquee-dot"
                style={{
                  opacity: isBright ? 0.55 : 0.35,
                }}
              />
            </span>
          );
        })}
      </div>
    </div>
  );
}

export function Marquee() {
  const { isClueFound, canAttemptClue, unlockClue } = useHunt();
  const clue4Found = isClueFound(4);
  const clickedBright = useRef(new Set<string>());

  const handleBrightClick = useCallback((item: string) => {
    if (!canAttemptClue(5)) return;
    clickedBright.current.add(item);
    if (clickedBright.current.size >= BRIGHT_ITEMS.size) {
      unlockClue(5);
      clickedBright.current.clear();
    }
  }, [canAttemptClue, unlockClue]);

  return (
    <div className="border-y border-border py-0 relative z-[1] overflow-hidden">
      {/* Row 1 — left */}
      <div className="gsap-marquee-row py-3 border-b border-border">
        <MarqueeRow items={ROW_1} direction="left" speed={34} clue4Found={clue4Found} onBrightClick={handleBrightClick} />
      </div>

      {/* Row 2 — right (opposite direction) */}
      <div className="gsap-marquee-row py-3">
        <MarqueeRow items={ROW_2} direction="right" speed={28} clue4Found={clue4Found} onBrightClick={handleBrightClick} />
      </div>

      <style>{`
        @keyframes marquee-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .marquee-item:hover {
          color: var(--color-text);
        }
        .marquee-item:hover .marquee-dot {
          opacity: 1;
          box-shadow: 0 0 8px rgba(196, 247, 81, 0.7);
        }
        .marquee-item:hover {
          text-shadow: 0 0 16px rgba(196, 247, 81, 0.25);
        }
      `}</style>
    </div>
  );
}
