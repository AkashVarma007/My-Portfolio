"use client";

import { useHunt } from "@/context/HuntContext";

const RED = "#ff2d55";
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
  onLaunch: () => void;
}

interface GameDescription {
  description: string;
  stats: { label: string; value: string }[];
}

const GAME_DESCRIPTIONS: Record<string, GameDescription> = {
  invaders: {
    description:
      "Classic space shooter reimagined. Blast waves of alien invaders before they reach the bottom. Watch for patterns — wave 10 hides a secret.",
    stats: [
      { label: "Genre", value: "Shooter" },
      { label: "Difficulty", value: "Hard" },
    ],
  },
  snake: {
    description:
      "Guide the serpent through the grid. Eat, grow, survive. The answer to everything is 42 — reach it and unlock something hidden.",
    stats: [
      { label: "Genre", value: "Arcade" },
      { label: "Difficulty", value: "Medium" },
    ],
  },
  breakout: {
    description:
      "Shatter every brick. The color code on the final wall tells a colorful story — pay attention to the order they fall.",
    stats: [
      { label: "Genre", value: "Breaker" },
      { label: "Difficulty", value: "Medium" },
    ],
  },
  pong: {
    description:
      "The original game. Beat the machine in a clean match. Simple rules, ruthless opponent.",
    stats: [
      { label: "Genre", value: "Sports" },
      { label: "Difficulty", value: "Easy" },
    ],
  },
  secret: {
    description:
      "You found the hidden passage. This game exists beyond the visible library. Enter if you dare.",
    stats: [
      { label: "Genre", value: "Unknown" },
      { label: "Difficulty", value: "???" },
    ],
  },
};

export function ArcadeFeatured({ game, onLaunch }: ArcadeFeaturedProps) {
  const { gameScores } = useHunt();
  const highScore = (gameScores as unknown as Record<string, number>)[game.id] ?? 0;
  const desc = GAME_DESCRIPTIONS[game.id] ?? {
    description: "A mysterious game awaits.",
    stats: [{ label: "Genre", value: "Unknown" }, { label: "Difficulty", value: "???" }],
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: 320,
        overflow: "hidden",
        background: game.bg,
      }}
    >
      {/* Subtle grid behind the icon area */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            linear-gradient(rgba(255,45,85,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,45,85,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
          opacity: 0.5,
          pointerEvents: "none",
        }}
      />

      {/* Large icon backdrop on the right */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: "10%",
          transform: "translateY(-50%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Glow behind icon */}
        <div
          style={{
            position: "absolute",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${game.categoryColor}22 0%, ${game.categoryColor}08 50%, transparent 70%)`,
            filter: "blur(20px)",
            pointerEvents: "none",
          }}
        />
        <span
          style={{
            fontSize: 96,
            lineHeight: 1,
            filter: `drop-shadow(0 0 30px ${game.categoryColor}44) drop-shadow(0 0 60px rgba(255,45,85,0.2))`,
            position: "relative",
            zIndex: 1,
          }}
        >
          {game.icon}
        </span>
      </div>

      {/* Corner bracket decorations - top-right */}
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          width: 24,
          height: 24,
          borderTop: `2px solid ${RED}44`,
          borderRight: `2px solid ${RED}44`,
          pointerEvents: "none",
        }}
      />
      {/* Corner bracket - bottom-right */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          width: 24,
          height: 24,
          borderBottom: `2px solid ${RED}44`,
          borderRight: `2px solid ${RED}44`,
          pointerEvents: "none",
        }}
      />
      {/* Corner bracket - top-left */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          width: 24,
          height: 24,
          borderTop: `2px solid ${RED}44`,
          borderLeft: `2px solid ${RED}44`,
          pointerEvents: "none",
        }}
      />
      {/* Corner bracket - bottom-left */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          width: 24,
          height: 24,
          borderBottom: `2px solid ${RED}44`,
          borderLeft: `2px solid ${RED}44`,
          pointerEvents: "none",
        }}
      />

      {/* Left-to-right gradient overlay for text readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(90deg, rgba(6,6,10,0.92) 0%, rgba(6,6,10,0.75) 35%, rgba(6,6,10,0.3) 60%, transparent 80%)`,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Text content overlaid on the left */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "32px 40px",
          maxWidth: "55%",
        }}
      >
        {/* Featured tag */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              width: 20,
              height: 2,
              background: RED,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-rajdhani), sans-serif",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 3,
              color: RED,
              textTransform: "uppercase",
            }}
          >
            Featured Game
          </span>
        </div>

        {/* Game title */}
        <h2
          style={{
            margin: "0 0 10px 0",
            fontFamily: "var(--font-orbitron), monospace",
            fontSize: 32,
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.15,
            letterSpacing: 1,
          }}
        >
          {game.name}
        </h2>

        {/* Description */}
        <p
          style={{
            margin: "0 0 18px 0",
            fontFamily: "var(--font-rajdhani), sans-serif",
            fontSize: 15,
            color: "rgba(255,255,255,0.55)",
            lineHeight: 1.6,
          }}
        >
          {desc.description}
        </p>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: 20,
            marginBottom: 22,
          }}
        >
          {/* High score stat */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: 2,
                color: "rgba(255,255,255,0.25)",
                fontFamily: "var(--font-orbitron), monospace",
                textTransform: "uppercase",
              }}
            >
              High Score
            </span>
            <span
              style={{
                fontFamily: "var(--font-orbitron), monospace",
                fontSize: 18,
                fontWeight: 700,
                background: `linear-gradient(90deg, ${RED}, ${ORANGE})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {highScore > 0 ? highScore.toLocaleString() : "---"}
            </span>
          </div>

          {/* Static stats */}
          {desc.stats.map((stat) => (
            <div
              key={stat.label}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: 2,
                  color: "rgba(255,255,255,0.25)",
                  fontFamily: "var(--font-orbitron), monospace",
                  textTransform: "uppercase",
                }}
              >
                {stat.label}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-rajdhani), sans-serif",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.75)",
                }}
              >
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        {/* Launch button — bigger and more prominent */}
        <button
          onClick={onLaunch}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 32px",
            background: `linear-gradient(90deg, ${RED}, ${ORANGE})`,
            border: "none",
            cursor: "pointer",
            clipPath: "polygon(0% 0%, calc(100% - 14px) 0%, 100% 50%, calc(100% - 14px) 100%, 0% 100%)",
            fontFamily: "var(--font-orbitron), monospace",
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: 3,
            color: "#ffffff",
            outline: "none",
            alignSelf: "flex-start",
            transition: "opacity 0.2s, filter 0.2s",
            filter: "drop-shadow(0 0 12px rgba(255,45,85,0.4))",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.opacity = "0.9";
            (e.currentTarget as HTMLButtonElement).style.filter = "drop-shadow(0 0 20px rgba(255,45,85,0.6))";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.opacity = "1";
            (e.currentTarget as HTMLButtonElement).style.filter = "drop-shadow(0 0 12px rgba(255,45,85,0.4))";
          }}
        >
          LAUNCH GAME
          <span style={{ fontSize: 16 }}>▶</span>
        </button>
      </div>

      {/* Bottom accent line */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 1,
          background: `linear-gradient(90deg, ${RED}44, ${ORANGE}22, transparent)`,
          zIndex: 2,
        }}
      />
    </div>
  );
}
