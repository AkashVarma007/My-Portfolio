"use client";

import React from "react";
import { useHunt } from "@/context/HuntContext";

const RED    = "#ff2d55";
const ORANGE = "#ff6b2d";

interface Game {
  id: string;
  name: string;
  icon: string;
  category: string;
  categoryColor: string;
  bg: string;
}

interface ArcadeFeaturedProps {
  game: Game;
  gameIndex: number; // 0-based index among all games
  totalGames: number;
  onLaunch: () => void;
}

const GAME_DESCRIPTIONS: Record<string, { tagline: string; description: string; stats: { label: string; value: string }[] }> = {
  invaders: {
    tagline: "DEFEND EARTH",
    description: "Classic space shooter reimagined. Blast waves of alien invaders before they reach the bottom. Watch for patterns — wave 10 hides a secret.",
    stats: [
      { label: "Genre",      value: "Shooter" },
      { label: "Difficulty", value: "Hard"    },
      { label: "Players",    value: "1"       },
    ],
  },
  snake: {
    tagline: "GROW OR DIE",
    description: "Guide the serpent through the grid. Eat, grow, survive. The answer to everything is 42 — reach it and unlock something hidden.",
    stats: [
      { label: "Genre",      value: "Arcade"  },
      { label: "Difficulty", value: "Medium"  },
      { label: "Players",    value: "1"       },
    ],
  },
  breakout: {
    tagline: "BREAK THE WALL",
    description: "Shatter every brick. The color code on the final wall tells a story — pay attention to the order they fall.",
    stats: [
      { label: "Genre",      value: "Breaker" },
      { label: "Difficulty", value: "Medium"  },
      { label: "Players",    value: "1"       },
    ],
  },
  pong: {
    tagline: "ORIGINAL GAME",
    description: "The game that started it all. Beat the machine in a clean match. Simple rules, ruthless opponent.",
    stats: [
      { label: "Genre",      value: "Sports"  },
      { label: "Difficulty", value: "Easy"    },
      { label: "Players",    value: "1v1"     },
    ],
  },
  secret: {
    tagline: "YOU FOUND IT",
    description: "You found the hidden passage. This game exists beyond the visible library. Enter if you dare.",
    stats: [
      { label: "Genre",      value: "Unknown" },
      { label: "Difficulty", value: "???"     },
      { label: "Players",    value: "???"     },
    ],
  },
};

// Unique background pattern per game
function GameAtmosphere({ id, color }: { id: string; color: string }) {
  const c = color;
  switch (id) {
    case "invaders":
      // Starfield dots
      return (
        <div
          aria-hidden
          style={{
            position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none",
            backgroundImage: `radial-gradient(circle 1px at 10% 15%, ${c}55 1px, transparent 0),
              radial-gradient(circle 1px at 85% 25%, ${c}44 1px, transparent 0),
              radial-gradient(circle 1px at 40% 70%, ${c}33 1px, transparent 0),
              radial-gradient(circle 1px at 70% 60%, ${c}44 1px, transparent 0),
              radial-gradient(circle 1px at 20% 45%, ${c}22 1px, transparent 0),
              radial-gradient(circle 1px at 55% 35%, ${c}55 1px, transparent 0),
              radial-gradient(circle 1px at 90% 80%, ${c}33 1px, transparent 0),
              radial-gradient(circle 1px at 30% 85%, ${c}22 1px, transparent 0)`,
            backgroundSize: "300px 300px",
          }}
        />
      );
    case "snake":
      // Grid pattern
      return (
        <div
          aria-hidden
          style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: `linear-gradient(${c}12 1px, transparent 1px), linear-gradient(90deg, ${c}12 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      );
    case "breakout":
      // Brick pattern
      return (
        <div
          aria-hidden
          style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent 0px, transparent 18px, ${c}10 18px, ${c}10 20px),
              repeating-linear-gradient(90deg, transparent 0px, transparent 36px, ${c}08 36px, ${c}08 38px)
            `,
          }}
        />
      );
    case "pong":
      // Court center line
      return (
        <div
          aria-hidden
          style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: `repeating-linear-gradient(90deg, transparent 0px, transparent 48%, ${c}12 49%, ${c}12 51%, transparent 52%)`,
          }}
        />
      );
    default:
      return null;
  }
}

export function ArcadeFeatured({ game, gameIndex, totalGames, onLaunch }: ArcadeFeaturedProps) {
  const { gameScores } = useHunt();
  const highScore = (gameScores as unknown as Record<string, number>)[game.id] ?? 0;
  const desc      = GAME_DESCRIPTIONS[game.id] ?? {
    tagline: "UNKNOWN",
    description: "A mysterious game awaits.",
    stats: [{ label: "Genre", value: "Unknown" }, { label: "Difficulty", value: "???" }, { label: "Players", value: "1" }],
  };

  const padded = String(gameIndex + 1).padStart(2, "0");
  const total  = String(totalGames).padStart(2, "0");

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "calc(100vh - 56px)",
        minHeight: 500,
        overflow: "hidden",
        background: game.bg,
      }}
    >
      {/* Game-specific background pattern */}
      <GameAtmosphere id={game.id} color={game.categoryColor} />

      {/* Left-to-right gradient for text legibility */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: `linear-gradient(90deg,
            rgba(6,6,10,0.97) 0%,
            rgba(6,6,10,0.82) 40%,
            rgba(6,6,10,0.40) 65%,
            transparent 100%)`,
          zIndex: 1,
        }}
      />

      {/* Bottom fade */}
      <div
        aria-hidden
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 180,
          background: "linear-gradient(transparent, rgba(6,6,10,0.95))",
          zIndex: 1, pointerEvents: "none",
        }}
      />

      {/* Watermark — huge blurred game name */}
      <div
        aria-hidden
        style={{
          position: "absolute", right: "-2%", bottom: "10%",
          fontFamily: "var(--font-orbitron), monospace",
          fontSize: "clamp(80px, 18vw, 200px)",
          fontWeight: 900,
          letterSpacing: "-4px",
          color: "transparent",
          WebkitTextStroke: `1px ${game.categoryColor}1a`,
          whiteSpace: "nowrap",
          userSelect: "none", pointerEvents: "none",
          zIndex: 0,
          lineHeight: 1,
        }}
      >
        {game.name.toUpperCase()}
      </div>

      {/* ── Corner brackets ── */}
      {(
        [
          { pos: { top: 24,    left: 24  } as React.CSSProperties, bt: true,  bl: true,  br: false, bb: false },
          { pos: { top: 24,    right: 24 } as React.CSSProperties, bt: true,  bl: false, br: true,  bb: false },
          { pos: { bottom: 24, left: 24  } as React.CSSProperties, bt: false, bl: true,  br: false, bb: true  },
          { pos: { bottom: 24, right: 24 } as React.CSSProperties, bt: false, bl: false, br: true,  bb: true  },
        ]
      ).map((c, i) => (
        <div
          key={i}
          aria-hidden
          style={{
            position: "absolute", width: 32, height: 32, pointerEvents: "none", zIndex: 3,
            ...c.pos,
            borderTop:    c.bt ? "2px solid rgba(255,45,85,0.3)" : undefined,
            borderLeft:   c.bl ? "2px solid rgba(255,45,85,0.3)" : undefined,
            borderRight:  c.br ? "2px solid rgba(255,45,85,0.3)" : undefined,
            borderBottom: c.bb ? "2px solid rgba(255,45,85,0.3)" : undefined,
          }}
        />
      ))}

      {/* ── Right: Animated icon panel ── */}
      <div
        style={{
          position: "absolute",
          top: 0, right: 0, bottom: 0,
          width: "48%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
        }}
      >
        {/* Pulse rings */}
        <div style={{ position: "relative", width: 280, height: 280, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* Outer pulse ring A */}
          <div
            aria-hidden
            style={{
              position: "absolute", width: 260, height: 260, borderRadius: "50%",
              border: `1px solid ${game.categoryColor}25`,
              animation: "arc-pulse 3s ease-out infinite",
            }}
          />
          {/* Outer pulse ring B — offset */}
          <div
            aria-hidden
            style={{
              position: "absolute", width: 260, height: 260, borderRadius: "50%",
              border: `1px solid ${game.categoryColor}20`,
              animation: "arc-pulse 3s ease-out infinite 1.5s",
            }}
          />
          {/* Static ring */}
          <div
            aria-hidden
            style={{
              position: "absolute", width: 190, height: 190, borderRadius: "50%",
              border: `1px solid ${game.categoryColor}35`,
            }}
          />
          {/* Inner static ring */}
          <div
            aria-hidden
            style={{
              position: "absolute", width: 150, height: 150, borderRadius: "50%",
              border: `1px dashed ${game.categoryColor}22`,
              animation: "arc-spin 18s linear infinite",
            }}
          />
          {/* Glow */}
          <div
            aria-hidden
            style={{
              position: "absolute", width: 200, height: 200, borderRadius: "50%",
              background: `radial-gradient(circle, ${game.categoryColor}14 0%, transparent 70%)`,
              filter: "blur(20px)",
            }}
          />
          {/* Icon */}
          <span
            style={{
              fontSize: 120,
              lineHeight: 1,
              position: "relative", zIndex: 1,
              filter: `drop-shadow(0 0 30px ${game.categoryColor}55) drop-shadow(0 0 70px rgba(255,45,85,0.2))`,
              animation: "arc-float 4s ease-in-out infinite",
            }}
          >
            {game.icon}
          </span>

          {/* Category badge */}
          <div
            style={{
              position: "absolute", bottom: 12, left: "50%",
              transform: "translateX(-50%)",
              padding: "4px 14px",
              background: `${game.categoryColor}20`,
              border: `1px solid ${game.categoryColor}40`,
              borderRadius: 2,
              fontFamily: "var(--font-orbitron), monospace",
              fontSize: 9, fontWeight: 700,
              letterSpacing: 3, textTransform: "uppercase" as const,
              color: game.categoryColor,
              whiteSpace: "nowrap" as const,
            }}
          >
            {game.category}
          </div>
        </div>
      </div>

      {/* ── Left: Text content ── */}
      <div
        style={{
          position: "relative", zIndex: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 48px",
          maxWidth: "54%",
        }}
      >
        {/* Game counter */}
        <div
          style={{
            display: "flex", alignItems: "center", gap: 10, marginBottom: 28,
          }}
        >
          <div style={{ width: 28, height: 2, background: `linear-gradient(90deg, ${RED}, ${ORANGE})` }} />
          <span
            style={{
              fontFamily: "var(--font-orbitron), monospace",
              fontSize: 10, fontWeight: 700, letterSpacing: 4,
              color: RED,
            }}
          >
            {padded}
          </span>
          <span
            style={{
              fontFamily: "var(--font-orbitron), monospace",
              fontSize: 10, color: "rgba(255,255,255,0.2)", letterSpacing: 2,
            }}
          >
            / {total}
          </span>
          <span
            style={{
              marginLeft: 8,
              fontFamily: "var(--font-rajdhani), sans-serif",
              fontSize: 10, fontWeight: 700,
              letterSpacing: 3, textTransform: "uppercase" as const,
              color: "rgba(255,255,255,0.25)",
            }}
          >
            {desc.tagline}
          </span>
        </div>

        {/* Game title */}
        <h1
          style={{
            margin: "0 0 20px",
            fontFamily: "var(--font-orbitron), monospace",
            fontSize: "clamp(36px, 5vw, 68px)",
            fontWeight: 900,
            color: "#ffffff",
            lineHeight: 1.05,
            letterSpacing: -1,
          }}
        >
          {game.name}
        </h1>

        {/* Description */}
        <p
          style={{
            margin: "0 0 32px",
            fontFamily: "var(--font-rajdhani), sans-serif",
            fontSize: 16,
            color: "rgba(255,255,255,0.50)",
            lineHeight: 1.65,
            maxWidth: 480,
          }}
        >
          {desc.description}
        </p>

        {/* Stats row */}
        <div
          style={{
            display: "flex", gap: 0, marginBottom: 36,
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 4,
            overflow: "hidden",
            alignSelf: "flex-start",
          }}
        >
          {/* High score */}
          <div
            style={{
              padding: "12px 20px",
              borderRight: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              style={{
                fontSize: 8, fontWeight: 700, letterSpacing: 2,
                color: "rgba(255,255,255,0.22)",
                fontFamily: "var(--font-orbitron), monospace",
                textTransform: "uppercase" as const,
                marginBottom: 6,
              }}
            >
              Best Score
            </div>
            <div
              style={{
                fontFamily: "var(--font-orbitron), monospace",
                fontSize: 20, fontWeight: 700,
                background: highScore > 0 ? `linear-gradient(90deg, ${RED}, ${ORANGE})` : undefined,
                color: highScore > 0 ? undefined : "rgba(255,255,255,0.18)",
                WebkitBackgroundClip: highScore > 0 ? "text" : undefined,
                WebkitTextFillColor: highScore > 0 ? "transparent" : undefined,
                backgroundClip: highScore > 0 ? "text" : undefined,
              }}
            >
              {highScore > 0 ? highScore.toLocaleString() : "---"}
            </div>
          </div>

          {/* Other stats */}
          {desc.stats.map((stat, i) => (
            <div
              key={stat.label}
              style={{
                padding: "12px 20px",
                borderRight: i < desc.stats.length - 1 ? "1px solid rgba(255,255,255,0.06)" : undefined,
              }}
            >
              <div
                style={{
                  fontSize: 8, fontWeight: 700, letterSpacing: 2,
                  color: "rgba(255,255,255,0.22)",
                  fontFamily: "var(--font-orbitron), monospace",
                  textTransform: "uppercase" as const,
                  marginBottom: 6,
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-rajdhani), sans-serif",
                  fontSize: 17, fontWeight: 700,
                  color: "rgba(255,255,255,0.70)",
                  letterSpacing: 0.5,
                }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Launch button */}
        <button
          onClick={onLaunch}
          style={{
            display: "inline-flex", alignItems: "center", gap: 14,
            padding: "16px 38px",
            background: `linear-gradient(90deg, ${RED}, ${ORANGE})`,
            border: "none",
            cursor: "pointer",
            clipPath: "polygon(0% 0%, calc(100% - 16px) 0%, 100% 50%, calc(100% - 16px) 100%, 0% 100%)",
            fontFamily: "var(--font-orbitron), monospace",
            fontSize: 15, fontWeight: 700, letterSpacing: 4,
            color: "#ffffff",
            outline: "none",
            alignSelf: "flex-start",
            filter: "drop-shadow(0 0 16px rgba(255,45,85,0.45))",
            transition: "filter 0.2s, opacity 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.filter = "drop-shadow(0 0 28px rgba(255,45,85,0.7)) brightness(1.05)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.filter = "drop-shadow(0 0 16px rgba(255,45,85,0.45))";
          }}
        >
          <span style={{ fontSize: 18 }}>▶</span>
          LAUNCH GAME
        </button>
      </div>

      {/* Bottom accent line */}
      <div
        aria-hidden
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
          background: `linear-gradient(90deg, ${RED}55, ${ORANGE}33, transparent)`,
          zIndex: 3,
        }}
      />

      <style>{`
        @keyframes arc-pulse {
          0%   { transform: scale(0.82); opacity: 0.8; }
          100% { transform: scale(1.35); opacity: 0; }
        }
        @keyframes arc-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes arc-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
