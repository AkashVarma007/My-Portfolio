"use client";

import { useHunt } from "@/context/HuntContext";
import { CLUES, TIER_NAMES } from "@/data/clues";

const RED = "#ff2d55";
const ORANGE = "#ff6b2d";

interface GameMilestone {
  id: string;
  game: string;
  gameIcon: string;
  label: string;
  description: string;
  threshold: number;
  scoreKey: keyof { snake: number; invaders: number; breakout: number; pong: number };
}

const GAME_MILESTONES: GameMilestone[] = [
  {
    id: "snake_50",
    game: "Snake",
    gameIcon: "🐍",
    label: "Half Century",
    description: "Reach a score of 50 in Snake",
    threshold: 50,
    scoreKey: "snake",
  },
  {
    id: "snake_100",
    game: "Snake",
    gameIcon: "🐍",
    label: "Centipede",
    description: "Reach a score of 100 in Snake",
    threshold: 100,
    scoreKey: "snake",
  },
  {
    id: "invaders_10k",
    game: "Invaders",
    gameIcon: "👾",
    label: "First Contact",
    description: "Score 10,000 points in Invaders",
    threshold: 10000,
    scoreKey: "invaders",
  },
  {
    id: "invaders_50k",
    game: "Invaders",
    gameIcon: "👾",
    label: "Exterminator",
    description: "Score 50,000 points in Invaders",
    threshold: 50000,
    scoreKey: "invaders",
  },
  {
    id: "breakout_5k",
    game: "Breakout",
    gameIcon: "🧱",
    label: "Demolisher",
    description: "Score 5,000 points in Breakout",
    threshold: 5000,
    scoreKey: "breakout",
  },
  {
    id: "pong_win",
    game: "Pong",
    gameIcon: "🏓",
    label: "First Win",
    description: "Win a match against the machine in Pong",
    threshold: 1,
    scoreKey: "pong",
  },
];

const TIERS = [1, 2, 3, 4] as const;

export function ArcadeAchievements() {
  const { isClueFound, gameScores } = useHunt();

  return (
    <div
      style={{
        padding: "32px 32px 48px",
        maxWidth: 900,
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
        ACHIEVEMENTS
      </h2>

      {/* Cipher Fragments section */}
      <section style={{ marginBottom: 40 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 16,
          }}
        >
          <div style={{ width: 3, height: 18, background: `linear-gradient(180deg, ${RED}, ${ORANGE})` }} />
          <h3
            style={{
              margin: 0,
              fontFamily: "var(--font-orbitron), monospace",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 3,
              color: "rgba(255,255,255,0.6)",
              textTransform: "uppercase",
            }}
          >
            Cipher Fragments
          </h3>
          <span
            style={{
              fontFamily: "var(--font-orbitron), monospace",
              fontSize: 11,
              color: "rgba(255,255,255,0.25)",
            }}
          >
            ({CLUES.filter((c) => isClueFound(c.id)).length}/{CLUES.length})
          </span>
        </div>

        {/* Tier groups */}
        {TIERS.map((tier) => {
          const tierClues = CLUES.filter((c) => c.tier === tier);
          return (
            <div key={tier} style={{ marginBottom: 20 }}>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: 2.5,
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.2)",
                  fontFamily: "var(--font-orbitron), monospace",
                  marginBottom: 8,
                }}
              >
                Tier {tier} — {TIER_NAMES[tier]}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: 8,
                }}
              >
                {tierClues.map((clue) => {
                  const found = isClueFound(clue.id);
                  return (
                    <div
                      key={clue.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 12px",
                        borderRadius: 6,
                        background: found
                          ? "rgba(255,45,85,0.06)"
                          : "rgba(255,255,255,0.02)",
                        border: `1px solid ${found ? "rgba(255,45,85,0.18)" : "rgba(255,255,255,0.05)"}`,
                      }}
                    >
                      {/* Diamond */}
                      <span
                        style={{
                          display: "block",
                          width: 10,
                          height: 10,
                          flexShrink: 0,
                          background: found
                            ? `linear-gradient(135deg, ${RED}, ${ORANGE})`
                            : "rgba(255,255,255,0.1)",
                          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: found ? 600 : 500,
                            color: found ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.2)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {found ? clue.title : `Fragment #${clue.id}`}
                        </div>
                        <div
                          style={{
                            fontSize: 10,
                            color: "rgba(255,255,255,0.2)",
                            fontFamily: "var(--font-orbitron), monospace",
                            letterSpacing: 1,
                            marginTop: 1,
                          }}
                        >
                          {TIER_NAMES[tier]}
                        </div>
                      </div>
                      {found && (
                        <span style={{ fontSize: 12, color: RED, fontWeight: 700, flexShrink: 0 }}>
                          ✓
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>

      {/* Game Milestones section */}
      <section>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 16,
          }}
        >
          <div style={{ width: 3, height: 18, background: `linear-gradient(180deg, ${RED}, ${ORANGE})` }} />
          <h3
            style={{
              margin: 0,
              fontFamily: "var(--font-orbitron), monospace",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 3,
              color: "rgba(255,255,255,0.6)",
              textTransform: "uppercase",
            }}
          >
            Game Milestones
          </h3>
          <span
            style={{
              fontFamily: "var(--font-orbitron), monospace",
              fontSize: 11,
              color: "rgba(255,255,255,0.25)",
            }}
          >
            ({GAME_MILESTONES.filter((m) => gameScores[m.scoreKey] >= m.threshold).length}/{GAME_MILESTONES.length})
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 10,
          }}
        >
          {GAME_MILESTONES.map((milestone) => {
            const unlocked = gameScores[milestone.scoreKey] >= milestone.threshold;
            return (
              <div
                key={milestone.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 16px",
                  borderRadius: 8,
                  background: unlocked
                    ? "rgba(255,45,85,0.06)"
                    : "rgba(255,255,255,0.02)",
                  border: `1px solid ${unlocked ? "rgba(255,45,85,0.18)" : "rgba(255,255,255,0.05)"}`,
                  opacity: unlocked ? 1 : 0.55,
                }}
              >
                {/* Icon circle */}
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: unlocked
                      ? `linear-gradient(135deg, rgba(255,45,85,0.2), rgba(255,107,45,0.1))`
                      : "rgba(255,255,255,0.04)",
                    border: `1px solid ${unlocked ? "rgba(255,45,85,0.25)" : "rgba(255,255,255,0.06)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    flexShrink: 0,
                    filter: unlocked ? "none" : "grayscale(1)",
                  }}
                >
                  {milestone.gameIcon}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-orbitron), monospace",
                      fontSize: 11,
                      fontWeight: 700,
                      color: unlocked ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)",
                      letterSpacing: 0.5,
                      marginBottom: 3,
                    }}
                  >
                    {milestone.label}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.35)",
                      lineHeight: 1.3,
                    }}
                  >
                    {milestone.description}
                  </div>
                </div>

                {/* Status */}
                {unlocked ? (
                  <span
                    style={{
                      fontSize: 16,
                      color: RED,
                      flexShrink: 0,
                    }}
                  >
                    ✓
                  </span>
                ) : (
                  <span
                    style={{
                      fontSize: 14,
                      color: "rgba(255,255,255,0.12)",
                      flexShrink: 0,
                    }}
                  >
                    🔒
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
