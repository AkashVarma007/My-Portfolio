"use client";

import { useState } from "react";
import { useHunt } from "@/context/HuntContext";
import { CLUES, TIER_NAMES } from "@/data/clues";

const RED = "#ff2d55";
const ORANGE = "#ff6b2d";

const GAME_LABELS: Record<string, string> = {
  snake: "Snake",
  invaders: "Invaders",
  breakout: "Breakout",
  pong: "Pong",
};

export function AchievementWidget() {
  const [expanded, setExpanded] = useState(false);
  const { totalFound, totalClues, isClueFound, gameScores, currentTier } = useHunt();

  const progressPct = totalClues > 0 ? (totalFound / totalClues) * 100 : 0;

  // Group clues by tier
  const tiers = [1, 2, 3, 4] as const;

  // Find next hint: first clue that is not yet found (in order)
  const nextClue = CLUES.find((c) => !isClueFound(c.id));
  let nextHint = nextClue ? nextClue.hint : "You've found all fragments. The end awaits.";

  // Subtle nudge into the terminal once clue 12 is found and 13 isn't.
  if (isClueFound(12) && !isClueFound(13)) {
    nextHint = "The console is listening.";
  }

  // If the next clue is terminal-based, avoid revealing the passphrase here.
  if (nextClue?.id === 14) {
    nextHint = "The console awaits. Feed it the itch.";
  }

  // Game scores — only show if any > 0
  const scores = gameScores;
  const hasAnyScore = Object.values(scores).some((v) => v > 0);

  return (
    <>
      <style>{`
        @keyframes widget-in {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes badge-pop {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.35); }
          100% { transform: scale(1); }
        }
      `}</style>

      {/* Collapsed toggle button */}
      {!expanded && (
        <button
          onClick={() => setExpanded(true)}
          aria-label="Open fragment tracker"
          style={{
            position: "fixed",
            bottom: 24,
            left: 24,
            zIndex: 9000,
            width: 44,
            height: 44,
            borderRadius: 8,
            background: "rgba(10,10,16,0.85)",
            border: `1px solid ${totalFound > 0 ? "rgba(255,45,85,0.45)" : "rgba(255,255,255,0.08)"}`,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: totalFound > 0
              ? `0 0 12px 2px rgba(255,45,85,0.25), 0 2px 8px rgba(0,0,0,0.5)`
              : "0 2px 8px rgba(0,0,0,0.5)",
            transition: "box-shadow 0.3s ease, border-color 0.3s ease",
            padding: 0,
            outline: "none",
          }}
        >
          {/* Diamond icon */}
          <span
            style={{
              display: "block",
              width: 16,
              height: 16,
              background: totalFound > 0
                ? `linear-gradient(135deg, ${RED}, ${ORANGE})`
                : "rgba(255,255,255,0.25)",
              clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
              flexShrink: 0,
            }}
          />
          {/* Count badge */}
          {totalFound > 0 && (
            <span
              style={{
                position: "absolute",
                top: -6,
                right: -6,
                minWidth: 18,
                height: 18,
                borderRadius: 9,
                background: RED,
                color: "#fff",
                fontSize: 10,
                fontWeight: 700,
                fontFamily: "var(--font-orbitron), monospace",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 4px",
                lineHeight: 1,
                animation: "badge-pop 0.3s ease",
                border: "2px solid #08080c",
              }}
            >
              {totalFound}
            </span>
          )}
        </button>
      )}

      {/* Expanded panel */}
      {expanded && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: 24,
            zIndex: 9000,
            width: 320,
            maxHeight: "calc(100vh - 48px)",
            overflowY: "auto",
            background: "rgba(8,8,14,0.92)",
            border: "1px solid rgba(255,45,85,0.2)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderRadius: 10,
            boxShadow: `0 0 24px 4px rgba(255,45,85,0.12), 0 4px 32px rgba(0,0,0,0.7)`,
            animation: "widget-in 0.35s ease-out",
            fontFamily: "var(--font-rajdhani), sans-serif",
          }}
        >
          {/* ── Header ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px 10px",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-orbitron), monospace",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase" as const,
                color: "rgba(255,255,255,0.5)",
              }}
            >
              Fragments
            </span>
            <span
              style={{
                fontFamily: "var(--font-orbitron), monospace",
                fontSize: 18,
                fontWeight: 900,
                background: `linear-gradient(90deg, ${RED}, ${ORANGE})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {totalFound} / {totalClues}
            </span>
            <button
              onClick={() => setExpanded(false)}
              aria-label="Close fragment tracker"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "rgba(255,255,255,0.3)",
                fontSize: 18,
                lineHeight: 1,
                padding: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "color 0.2s",
                outline: "none",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.8)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.3)"; }}
            >
              ✕
            </button>
          </div>

          {/* ── Progress bar ── */}
          <div style={{ padding: "10px 16px 0" }}>
            <div
              style={{
                width: "100%",
                height: 4,
                borderRadius: 2,
                background: "rgba(255,255,255,0.06)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progressPct}%`,
                  background: `linear-gradient(90deg, ${RED}, ${ORANGE})`,
                  borderRadius: 2,
                  transition: "width 0.5s ease",
                }}
              />
            </div>
          </div>

          {/* ── Clue list grouped by tier ── */}
          <div style={{ padding: "12px 16px 0" }}>
            {tiers.map((tier) => {
              const tierClues = CLUES.filter((c) => c.tier === tier);
              return (
                <div key={tier} style={{ marginBottom: 14 }}>
                  {/* Tier label */}
                  <div
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: 2.5,
                      textTransform: "uppercase" as const,
                      color: "rgba(255,255,255,0.22)",
                      fontFamily: "var(--font-orbitron), monospace",
                      marginBottom: 6,
                    }}
                  >
                    {TIER_NAMES[tier]}
                  </div>
                  {/* Clues */}
                  <div style={{ display: "flex", flexDirection: "column" as const, gap: 4 }}>
                    {tierClues.map((clue) => {
                      const found = isClueFound(clue.id);
                      return (
                        <div
                          key={clue.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "5px 8px",
                            borderRadius: 5,
                            background: found
                              ? "rgba(255,45,85,0.07)"
                              : "rgba(255,255,255,0.02)",
                            border: `1px solid ${found ? "rgba(255,45,85,0.15)" : "rgba(255,255,255,0.04)"}`,
                          }}
                        >
                          {/* Diamond marker */}
                          <span
                            style={{
                              display: "block",
                              width: 8,
                              height: 8,
                              flexShrink: 0,
                              background: found
                                ? `linear-gradient(135deg, ${RED}, ${ORANGE})`
                                : "rgba(255,255,255,0.12)",
                              clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                            }}
                          />
                          {/* Title */}
                          <span
                            style={{
                              flex: 1,
                              fontSize: 12,
                              fontWeight: found ? 600 : 500,
                              color: found ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.2)",
                              letterSpacing: 0.3,
                            }}
                          >
                            {found ? clue.title : "???"}
                          </span>
                          {/* Checkmark */}
                          {found && (
                            <span
                              style={{
                                fontSize: 11,
                                color: RED,
                                fontWeight: 700,
                                flexShrink: 0,
                              }}
                            >
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
          </div>

          {/* ── Next hint ── */}
          <div
            style={{
              margin: "4px 16px 0",
              padding: "10px 12px",
              borderRadius: 6,
              background: "rgba(255,107,45,0.06)",
              border: "1px solid rgba(255,107,45,0.12)",
            }}
          >
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase" as const,
                color: "rgba(255,107,45,0.55)",
                fontFamily: "var(--font-orbitron), monospace",
                marginBottom: 5,
              }}
            >
              Next Clue
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 12,
                fontStyle: "italic",
                color: "rgba(255,255,255,0.45)",
                lineHeight: 1.55,
              }}
            >
              {nextHint}
            </p>
          </div>

          {/* ── Game scores ── */}
          {hasAnyScore && (
            <div style={{ padding: "12px 16px 16px" }}>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: 2.5,
                  textTransform: "uppercase" as const,
                  color: "rgba(255,255,255,0.22)",
                  fontFamily: "var(--font-orbitron), monospace",
                  marginBottom: 8,
                }}
              >
                High Scores
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 6,
                }}
              >
                {(Object.entries(scores) as [string, number][]).map(([game, score]) => {
                  if (score === 0) return null;
                  return (
                    <div
                      key={game}
                      style={{
                        padding: "7px 10px",
                        borderRadius: 5,
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        display: "flex",
                        flexDirection: "column" as const,
                        gap: 2,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 600,
                          letterSpacing: 1.5,
                          textTransform: "uppercase" as const,
                          color: "rgba(255,255,255,0.3)",
                        }}
                      >
                        {GAME_LABELS[game] ?? game}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-orbitron), monospace",
                          fontSize: 16,
                          fontWeight: 700,
                          background: `linear-gradient(90deg, ${RED}, ${ORANGE})`,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        {score.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Console shortcut ── */}
          {isClueFound(13) && (
            <div style={{ padding: "0 16px 16px" }}>
              <button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent("open-terminal"));
                  }
                }}
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 6,
                  padding: "8px 10px",
                  fontFamily: "var(--font-rajdhani), sans-serif",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 1.8,
                  color: "rgba(255,255,255,0.7)",
                  cursor: "pointer",
                  textTransform: "uppercase" as const,
                  transition: "color 0.2s, border-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  const btn = e.currentTarget as HTMLButtonElement;
                  btn.style.color = "#ff6b2d";
                  btn.style.borderColor = "rgba(255,107,45,0.4)";
                }}
                onMouseLeave={(e) => {
                  const btn = e.currentTarget as HTMLButtonElement;
                  btn.style.color = "rgba(255,255,255,0.7)";
                  btn.style.borderColor = "rgba(255,255,255,0.12)";
                }}
              >
                Open Console
              </button>
              <div
                style={{
                  marginTop: 8,
                  fontSize: 10,
                  letterSpacing: 1.8,
                  textTransform: "uppercase" as const,
                  color: "rgba(255,255,255,0.35)",
                  fontFamily: "var(--font-orbitron), monospace",
                  textAlign: "center",
                }}
              >
                Shortcut: ↑↑↓↓←→←→BA
              </div>
            </div>
          )}

          {/* Bottom padding when no scores section */}
          {!hasAnyScore && <div style={{ height: 16 }} />}
        </div>
      )}
    </>
  );
}
