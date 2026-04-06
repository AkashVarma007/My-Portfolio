"use client";

import { useState } from "react";

const RED = "#ff2d55";

interface Game {
  id: string;
  name: string;
  icon: string;
  category: string;
  categoryColor: string;
  bg: string;
}

interface ArcadeGameCardProps {
  game: Game;
  isFeatured?: boolean;
  locked?: boolean;
  onClick: () => void;
  onPlay: () => void;
}

// Game-specific CSS background pattern per card
function cardPattern(id: string, color: string): string {
  switch (id) {
    case "invaders":
      return `radial-gradient(circle 1px at 25% 30%, ${color}44 1px, transparent 0),
              radial-gradient(circle 1px at 75% 20%, ${color}33 1px, transparent 0),
              radial-gradient(circle 1px at 50% 60%, ${color}22 1px, transparent 0),
              radial-gradient(circle 1px at 15% 70%, ${color}33 1px, transparent 0),
              radial-gradient(circle 1px at 85% 75%, ${color}44 1px, transparent 0)`;
    case "snake":
      return `linear-gradient(${color}14 1px, transparent 1px), linear-gradient(90deg, ${color}14 1px, transparent 1px)`;
    case "breakout":
      return `repeating-linear-gradient(0deg, transparent 0px, transparent 14px, ${color}12 14px, ${color}12 16px),
              repeating-linear-gradient(90deg, transparent 0px, transparent 24px, ${color}08 24px, ${color}08 26px)`;
    case "pong":
      return `repeating-linear-gradient(90deg, transparent 0px, transparent 48%, ${color}14 49%, ${color}14 51%, transparent 52%)`;
    default:
      return `radial-gradient(circle at 50% 40%, ${color}12 0%, transparent 60%)`;
  }
}

function cardPatternSize(id: string): string {
  switch (id) {
    case "snake":    return "28px 28px";
    case "breakout": return "26px 16px";
    default:         return "auto";
  }
}

export function ArcadeGameCard({
  game,
  isFeatured = false,
  locked = false,
  onClick,
  onPlay,
}: ArcadeGameCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={locked ? undefined : onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        width: 190,
        height: 250,
        flexShrink: 0,
        borderRadius: 6,
        overflow: "hidden",
        cursor: locked ? "default" : "pointer",
        opacity: locked ? 0.3 : 1,
        border: `1px solid ${
          hovered && !locked
            ? `${game.categoryColor}70`
            : isFeatured
            ? "rgba(255,45,85,0.45)"
            : "rgba(255,255,255,0.07)"
        }`,
        transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s, opacity 0.2s",
        transform: hovered && !locked ? "translateY(-6px) scale(1.01)" : "translateY(0) scale(1)",
        boxShadow: hovered && !locked
          ? `0 0 28px ${game.categoryColor}30, 0 16px 40px rgba(0,0,0,0.5)`
          : isFeatured
          ? `0 0 12px rgba(255,45,85,0.15), 0 4px 12px rgba(0,0,0,0.3)`
          : "0 2px 10px rgba(0,0,0,0.25)",
        background: game.bg,
      }}
    >
      {/* Game-specific background pattern */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: cardPattern(game.id, game.categoryColor),
          backgroundSize: cardPatternSize(game.id),
          opacity: hovered ? 0.8 : 0.5,
          transition: "opacity 0.2s",
        }}
      />

      {/* Top vignette */}
      <div
        aria-hidden
        style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "50%",
          background: "linear-gradient(rgba(0,0,0,0.15), transparent)",
          pointerEvents: "none", zIndex: 1,
        }}
      />

      {/* Bottom gradient */}
      <div
        aria-hidden
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 100,
          background: "linear-gradient(transparent, rgba(6,6,10,0.97))",
          pointerEvents: "none", zIndex: 3,
        }}
      />

      {/* Hover glow overlay */}
      {hovered && !locked && (
        <div
          aria-hidden
          style={{
            position: "absolute", inset: 0,
            background: `radial-gradient(ellipse at 50% 35%, ${game.categoryColor}18 0%, transparent 65%)`,
            pointerEvents: "none", zIndex: 2,
          }}
        />
      )}

      {/* Icon */}
      <div
        style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          paddingBottom: 52, zIndex: 2,
        }}
      >
        <span
          style={{
            fontSize: 52,
            lineHeight: 1,
            filter: locked
              ? "grayscale(1)"
              : hovered
              ? `drop-shadow(0 0 16px ${game.categoryColor}88) drop-shadow(0 0 6px ${game.categoryColor}55)`
              : `drop-shadow(0 0 6px ${game.categoryColor}44)`,
            transition: "filter 0.2s, transform 0.2s",
            transform: hovered && !locked ? "scale(1.12)" : "scale(1)",
          }}
        >
          {game.icon}
        </span>
      </div>

      {/* Bottom info */}
      <div
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "0 14px 14px", zIndex: 4,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-orbitron), monospace",
            fontSize: 11, fontWeight: 700,
            color: "rgba(255,255,255,0.88)",
            letterSpacing: 0.5,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            marginBottom: 5,
          }}
        >
          {game.name}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div
            style={{
              width: 5, height: 5, borderRadius: "50%",
              background: game.categoryColor, flexShrink: 0,
              boxShadow: `0 0 6px ${game.categoryColor}`,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-rajdhani), sans-serif",
              fontSize: 9, fontWeight: 700,
              color: "rgba(255,255,255,0.35)",
              letterSpacing: 1.5, textTransform: "uppercase",
            }}
          >
            {game.category}
          </span>
        </div>
      </div>

      {/* Bottom accent line in category color */}
      <div
        aria-hidden
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, ${game.categoryColor}80, ${game.categoryColor}22, transparent)`,
          zIndex: 5,
          boxShadow: hovered ? `0 0 8px ${game.categoryColor}66` : "none",
          transition: "box-shadow 0.2s",
        }}
      />

      {/* SELECTED ribbon */}
      {isFeatured && !locked && (
        <div
          style={{
            position: "absolute", top: 14, right: -20,
            width: 80, background: RED,
            padding: "3px 0", textAlign: "center",
            transform: "rotate(45deg)",
            fontFamily: "var(--font-orbitron), monospace",
            fontSize: 7, fontWeight: 700, letterSpacing: 1,
            color: "#fff", zIndex: 6,
            boxShadow: `0 0 8px rgba(255,45,85,0.5)`,
          }}
        >
          SELECTED
        </div>
      )}

      {/* Locked overlay */}
      {locked && (
        <div
          style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 8,
            background: "rgba(6,6,10,0.65)", zIndex: 7,
          }}
        >
          <span style={{ fontSize: 22, filter: "grayscale(1)" }}>🔒</span>
          <span
            style={{
              fontFamily: "var(--font-orbitron), monospace",
              fontSize: 8, fontWeight: 700,
              color: "rgba(255,255,255,0.30)",
              textAlign: "center", padding: "0 10px",
              lineHeight: 1.5, letterSpacing: 1, textTransform: "uppercase",
            }}
          >
            Find 5 clues to unlock
          </span>
        </div>
      )}

      {/* Play button on hover */}
      {hovered && !locked && (
        <button
          onClick={(e) => { e.stopPropagation(); onPlay(); }}
          style={{
            position: "absolute", top: "38%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: 48, height: 48, borderRadius: "50%",
            background: `linear-gradient(135deg, ${RED}, #ff6b2d)`,
            border: "2px solid rgba(255,255,255,0.18)",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 15, color: "#fff", outline: "none", zIndex: 8,
            boxShadow: `0 0 24px ${RED}55, 0 4px 14px rgba(0,0,0,0.5)`,
            transition: "transform 0.15s, box-shadow 0.15s",
            fontFamily: "monospace",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translate(-50%, -50%) scale(1.12)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 32px ${RED}77, 0 4px 18px rgba(0,0,0,0.6)`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translate(-50%, -50%) scale(1)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 24px ${RED}55, 0 4px 14px rgba(0,0,0,0.5)`;
          }}
        >
          ▶
        </button>
      )}
    </div>
  );
}
