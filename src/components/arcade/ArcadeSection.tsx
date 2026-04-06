"use client";

import React, { useState } from "react";
import { useHunt } from "@/context/HuntContext";
import { ArcadeNav } from "./ArcadeNav";
import { ArcadeFeatured } from "./ArcadeFeatured";
import { ArcadeGameCard } from "./ArcadeGameCard";
import { ArcadeAchievements } from "./ArcadeAchievements";
import { ArcadeLeaderboard } from "./ArcadeLeaderboard";
import { GameOverlay } from "./GameOverlay";

const RED    = "#ff2d55";
const ORANGE = "#ff6b2d";

type Tab = "games" | "achievements" | "leaderboard";

interface GameDef {
  id: string;
  name: string;
  icon: string;
  category: string;
  categoryColor: string;
  bg: string;
}

const GAMES: GameDef[] = [
  {
    id: "invaders",
    name: "Space Invaders",
    icon: "👾",
    category: "Shooter",
    categoryColor: "#00d4ff",
    bg: "linear-gradient(135deg, #06080f 0%, #0a1020 100%)",
  },
  {
    id: "snake",
    name: "Snake",
    icon: "🐍",
    category: "Arcade",
    categoryColor: "#00ff88",
    bg: "linear-gradient(135deg, #06100a 0%, #0a1810 100%)",
  },
  {
    id: "breakout",
    name: "Breakout",
    icon: "🧱",
    category: "Breaker",
    categoryColor: "#ffaa00",
    bg: "linear-gradient(135deg, #140c00 0%, #1e1200 100%)",
  },
  {
    id: "pong",
    name: "Pong",
    icon: "🏓",
    category: "Sports",
    categoryColor: "#cc44ff",
    bg: "linear-gradient(135deg, #0e0818 0%, #160e22 100%)",
  },
];

const SECRET_GAME: GameDef = {
  id: "secret",
  name: "???",
  icon: "🔮",
  category: "Unknown",
  categoryColor: RED,
  bg: `linear-gradient(135deg, #140006 0%, #1e000a 100%)`,
};

const ALL_GAMES = [...GAMES, SECRET_GAME];

export function ArcadeSection() {
  const { totalFound } = useHunt();
  const [activeTab, setActiveTab]       = useState<Tab>("games");
  const [featuredGame, setFeaturedGame] = useState<GameDef>(GAMES[0]);
  const [activeGame, setActiveGame]     = useState<GameDef | null>(null);

  const secretUnlocked  = totalFound >= 5;
  const featuredIdx     = ALL_GAMES.findIndex((g) => g.id === featuredGame.id);
  const visibleTotal    = secretUnlocked ? ALL_GAMES.length : GAMES.length;

  return (
    <div
      id="arcade"
      style={{
        background: "#06060a",
        minHeight: "100vh",
        fontFamily: "var(--font-rajdhani), sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Full-page CRT scan lines ─────────────────────────────────────── */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0,
          backgroundImage: "repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)",
          pointerEvents: "none",
          zIndex: 5,
        }}
      />

      {/* ── Tron-style perspective grid floor ────────────────────────────── */}
      <div
        aria-hidden
        style={{
          position: "absolute", left: 0, right: 0, bottom: 0, height: "55%",
          backgroundImage: `linear-gradient(rgba(255,45,85,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,45,85,0.06) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          transform: "perspective(350px) rotateX(58deg)",
          transformOrigin: "bottom center",
          maskImage: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.8) 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.8) 100%)",
          pointerEvents: "none", zIndex: 0,
        }}
      />

      {/* ── Radial glow — top centre ─────────────────────────────────────── */}
      <div
        aria-hidden
        style={{
          position: "absolute", top: -100, left: "50%",
          transform: "translateX(-50%)",
          width: "140%", height: 600,
          background: "radial-gradient(ellipse 55% 55% at 50% 0%, rgba(255,45,85,0.10) 0%, rgba(255,107,45,0.04) 45%, transparent 70%)",
          pointerEvents: "none", zIndex: 0,
        }}
      />

      {/* ── Side ambient glows ───────────────────────────────────────────── */}
      <div
        aria-hidden
        style={{
          position: "absolute", top: "20%", left: "-5%",
          width: 400, height: 600, borderRadius: "50%",
          background: `radial-gradient(ellipse, rgba(255,45,85,0.04) 0%, transparent 70%)`,
          filter: "blur(40px)", pointerEvents: "none", zIndex: 0,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute", top: "30%", right: "-5%",
          width: 400, height: 600, borderRadius: "50%",
          background: `radial-gradient(ellipse, rgba(255,107,45,0.04) 0%, transparent 70%)`,
          filter: "blur(40px)", pointerEvents: "none", zIndex: 0,
        }}
      />

      {/* ── Full-page corner brackets ────────────────────────────────────── */}
      {(
        [
          { pos: { top: 0,    left: 0  } as React.CSSProperties, bt: true,  bl: true,  br: false, bb: false },
          { pos: { top: 0,    right: 0 } as React.CSSProperties, bt: true,  bl: false, br: true,  bb: false },
          { pos: { bottom: 0, left: 0  } as React.CSSProperties, bt: false, bl: true,  br: false, bb: true  },
          { pos: { bottom: 0, right: 0 } as React.CSSProperties, bt: false, bl: false, br: true,  bb: true  },
        ]
      ).map((c, i) => (
        <div
          key={i}
          aria-hidden
          style={{
            position: "absolute", width: 20, height: 20, zIndex: 5, pointerEvents: "none",
            ...c.pos,
            borderTop:    c.bt ? "1px solid rgba(255,45,85,0.35)" : undefined,
            borderLeft:   c.bl ? "1px solid rgba(255,45,85,0.35)" : undefined,
            borderRight:  c.br ? "1px solid rgba(255,45,85,0.35)" : undefined,
            borderBottom: c.bb ? "1px solid rgba(255,45,85,0.35)" : undefined,
          }}
        />
      ))}

      {/* ── Top accent line ──────────────────────────────────────────────── */}
      <div
        style={{
          height: 2,
          background: `linear-gradient(90deg, transparent, ${RED}, ${ORANGE}, ${RED}, transparent)`,
          width: "100%", position: "relative", zIndex: 1,
          boxShadow: `0 0 12px rgba(255,45,85,0.4)`,
        }}
      />

      {/* ── Navigation ───────────────────────────────────────────────────── */}
      <div style={{ position: "relative", zIndex: 10 }}>
        <ArcadeNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* ── Tab content ──────────────────────────────────────────────────── */}
      {activeTab === "games" && (
        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Full-viewport hero */}
          <ArcadeFeatured
            game={featuredGame}
            gameIndex={featuredIdx >= 0 ? featuredIdx : 0}
            totalGames={visibleTotal}
            onLaunch={() => setActiveGame(featuredGame)}
          />

          {/* ── Game library strip ─────────────────────────────────────── */}
          <div
            style={{
              display: "flex", alignItems: "stretch", gap: 0,
              padding: "28px 28px 52px",
              borderTop: "1px solid rgba(255,255,255,0.05)",
              background: "rgba(0,0,0,0.15)",
              backdropFilter: "blur(8px)",
            }}
          >
            {/* Vertical "Library" label */}
            <div
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                writingMode: "vertical-rl", textOrientation: "mixed",
                transform: "rotate(180deg)",
                paddingRight: 18, paddingLeft: 4, flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-orbitron), monospace",
                  fontSize: 8, fontWeight: 700, letterSpacing: 4,
                  color: "rgba(255,255,255,0.12)", textTransform: "uppercase",
                }}
              >
                Library
              </span>
            </div>

            {/* Card row */}
            <div
              style={{
                display: "flex", gap: 14, flex: 1,
                overflowX: "auto", paddingBottom: 4,
              }}
            >
              {GAMES.map((game) => (
                <ArcadeGameCard
                  key={game.id}
                  game={game}
                  isFeatured={featuredGame.id === game.id}
                  locked={false}
                  onClick={() => setFeaturedGame(game)}
                  onPlay={() => setActiveGame(game)}
                />
              ))}

              {/* Secret card */}
              <ArcadeGameCard
                game={SECRET_GAME}
                isFeatured={featuredGame.id === SECRET_GAME.id}
                locked={!secretUnlocked}
                onClick={() => { if (secretUnlocked) setFeaturedGame(SECRET_GAME); }}
                onPlay={() => { if (secretUnlocked) setActiveGame(SECRET_GAME); }}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === "achievements" && (
        <div style={{ position: "relative", zIndex: 1 }}>
          <ArcadeAchievements />
        </div>
      )}
      {activeTab === "leaderboard" && (
        <div style={{ position: "relative", zIndex: 1 }}>
          <ArcadeLeaderboard />
        </div>
      )}

      {/* ── Game overlay ─────────────────────────────────────────────────── */}
      {activeGame && (
        <GameOverlay
          gameId={activeGame.id}
          gameName={activeGame.name}
          onClose={() => setActiveGame(null)}
        />
      )}

      <style>{`
        @keyframes arc-grid-drift {
          from { background-position: 0 0; }
          to   { background-position: 0 60px; }
        }
      `}</style>
    </div>
  );
}
