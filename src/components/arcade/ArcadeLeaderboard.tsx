"use client";

import { useHunt } from "@/context/HuntContext";

const RED = "#ff2d55";
const ORANGE = "#ff6b2d";

interface GameEntry {
  key: "invaders" | "snake" | "breakout" | "pong";
  name: string;
  icon: string;
}

const GAME_ENTRIES: GameEntry[] = [
  { key: "invaders", name: "Space Invaders", icon: "👾" },
  { key: "snake", name: "Snake", icon: "🐍" },
  { key: "breakout", name: "Breakout", icon: "🧱" },
  { key: "pong", name: "Pong", icon: "🏓" },
];

function getRankName(total: number): string {
  if (total >= 5000 * 4) return "LEGEND";
  if (total >= 5000 * 2) return "VETERAN";
  if (total >= 5000) return "SKILLED";
  if (total >= 1000) return "RISING";
  return "ROOKIE";
}

export function ArcadeLeaderboard() {
  const { gameScores } = useHunt();
  const scores = gameScores;

  const totalScore = Object.values(scores).reduce((sum, v) => sum + v, 0);
  const rankName = getRankName(totalScore);

  // Sort games by score descending for ranking
  const sortedGames = [...GAME_ENTRIES].sort((a, b) => scores[b.key] - scores[a.key]);

  return (
    <div
      style={{
        padding: "32px 32px 48px",
        maxWidth: 700,
        margin: "0 auto",
        fontFamily: "var(--font-rajdhani), sans-serif",
      }}
    >
      {/* Title */}
      <h2
        style={{
          fontFamily: "var(--font-orbitron), monospace",
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: 4,
          color: "#ffffff",
          margin: "0 0 32px 0",
          textTransform: "uppercase",
        }}
      >
        LEADERBOARD
      </h2>

      {/* Combined score card */}
      <div
        style={{
          padding: "28px 32px",
          borderRadius: 10,
          background: "rgba(255,45,85,0.05)",
          border: "1px solid rgba(255,45,85,0.18)",
          marginBottom: 32,
          display: "flex",
          alignItems: "center",
          gap: 28,
        }}
      >
        {/* Rank badge */}
        <div
          style={{
            width: 64,
            height: 64,
            clipPath: "polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)",
            background: `linear-gradient(135deg, ${RED}, ${ORANGE})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-orbitron), monospace",
              fontSize: 10,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: 0.5,
              textAlign: "center",
            }}
          >
            #1
          </span>
        </div>

        {/* Score info */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 2.5,
              color: "rgba(255,255,255,0.3)",
              fontFamily: "var(--font-orbitron), monospace",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            Combined Score
          </div>
          <div
            style={{
              fontFamily: "var(--font-orbitron), monospace",
              fontSize: 36,
              fontWeight: 900,
              background: `linear-gradient(90deg, ${RED}, ${ORANGE})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: 1.1,
            }}
          >
            {totalScore.toLocaleString()}
          </div>
          <div
            style={{
              marginTop: 4,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 2,
              color: "rgba(255,255,255,0.4)",
            }}
          >
            PLAYER ONE
          </div>
        </div>

        {/* Rank name */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 4,
          }}
        >
          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: 2,
              color: "rgba(255,255,255,0.25)",
              fontFamily: "var(--font-orbitron), monospace",
              textTransform: "uppercase",
            }}
          >
            Rank
          </div>
          <div
            style={{
              fontFamily: "var(--font-orbitron), monospace",
              fontSize: 18,
              fontWeight: 700,
              color: RED,
              letterSpacing: 2,
            }}
          >
            {rankName}
          </div>
        </div>
      </div>

      {/* Per-game score list */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {sortedGames.map((game, index) => {
          const score = scores[game.key];
          const rank = index + 1;
          return (
            <div
              key={game.key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "14px 20px",
                borderRadius: 8,
                background:
                  rank === 1 && score > 0
                    ? "rgba(255,45,85,0.05)"
                    : "rgba(255,255,255,0.02)",
                border: `1px solid ${rank === 1 && score > 0 ? "rgba(255,45,85,0.15)" : "rgba(255,255,255,0.05)"}`,
              }}
            >
              {/* Rank number */}
              <span
                style={{
                  fontFamily: "var(--font-orbitron), monospace",
                  fontSize: 14,
                  fontWeight: 700,
                  color:
                    rank === 1 && score > 0
                      ? RED
                      : rank === 2 && score > 0
                      ? "rgba(255,107,45,0.7)"
                      : "rgba(255,255,255,0.2)",
                  width: 24,
                  textAlign: "center",
                  flexShrink: 0,
                }}
              >
                #{rank}
              </span>

              {/* Emoji */}
              <span style={{ fontSize: 22, flexShrink: 0 }}>{game.icon}</span>

              {/* Game name */}
              <span
                style={{
                  flex: 1,
                  fontFamily: "var(--font-rajdhani), sans-serif",
                  fontSize: 15,
                  fontWeight: 600,
                  color: score > 0 ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.25)",
                  letterSpacing: 0.5,
                }}
              >
                {game.name}
              </span>

              {/* Score */}
              <span
                style={{
                  fontFamily: "var(--font-orbitron), monospace",
                  fontSize: score > 0 ? 18 : 14,
                  fontWeight: 700,
                  color: score > 0 ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.15)",
                }}
              >
                {score > 0 ? score.toLocaleString() : "---"}
              </span>
            </div>
          );
        })}
      </div>

      {/* Rank scale */}
      <div
        style={{
          marginTop: 28,
          padding: "16px 20px",
          borderRadius: 8,
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: 2.5,
            color: "rgba(255,255,255,0.2)",
            fontFamily: "var(--font-orbitron), monospace",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          Rank Scale
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          {[
            { name: "ROOKIE", min: 0 },
            { name: "RISING", min: 1000 },
            { name: "SKILLED", min: 5000 },
            { name: "VETERAN", min: 10000 },
            { name: "LEGEND", min: 20000 },
          ].map(({ name, min }) => {
            const isActive = getRankName(totalScore) === name;
            return (
              <div
                key={name}
                style={{
                  padding: "4px 10px",
                  borderRadius: 4,
                  background: isActive ? `linear-gradient(90deg, ${RED}, ${ORANGE})` : "rgba(255,255,255,0.03)",
                  border: `1px solid ${isActive ? "transparent" : "rgba(255,255,255,0.06)"}`,
                  fontFamily: "var(--font-orbitron), monospace",
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  color: isActive ? "#fff" : "rgba(255,255,255,0.2)",
                }}
              >
                {name}
                <span
                  style={{
                    marginLeft: 4,
                    opacity: 0.6,
                    fontSize: 8,
                  }}
                >
                  {min > 0 ? `${(min / 1000).toFixed(0)}k+` : "0"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
