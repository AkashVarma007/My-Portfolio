"use client";

import { useState } from "react";

/**
 * MetaCorner — WOW 5
 *
 * Tiny fixed-position self-referential chrome showing live stats about
 * the site itself. The tiny 0-React-Native punchline is the 5% personality,
 * tucked into the corner, invisible until hovered.
 */

const META = [
  { label: "built",        value: "2026"          },
  { label: "loc",          value: "~4k"           },
  { label: "dsl",          value: "1"             },
  { label: "react native", value: "0"             },
];

export function MetaCorner() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="fixed bottom-5 right-5 z-[50] font-code select-none pointer-events-auto"
      style={{
        opacity: hovered ? 0.95 : 0.35,
        transition: "opacity 0.4s ease, transform 0.4s ease",
        transform: hovered ? "translateY(0)" : "translateY(2px)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="site metadata"
    >
      <div
        className="rounded-lg px-3 py-2 text-[0.55rem] tracking-[1.5px] uppercase leading-[1.7]"
        style={{
          background: "rgba(8,8,12,0.75)",
          border: "1px solid rgba(196,247,81,0.1)",
          color: "#9b97a8",
          backdropFilter: "blur(6px)",
        }}
      >
        <div
          className="text-[0.5rem] tracking-[2px] uppercase mb-1"
          style={{ color: "#c4f751", opacity: 0.8 }}
        >
          portfolio.meta
        </div>
        {META.map((row) => (
          <div key={row.label} className="flex justify-between gap-5">
            <span>{row.label}</span>
            <span style={{ color: "#d7d4e0" }}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
