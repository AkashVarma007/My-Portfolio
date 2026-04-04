"use client";

import { useState } from "react";
import { useHunt } from "@/context/HuntContext";
import { ArcadeNav } from "./ArcadeNav";
import { ArcadeFeatured } from "./ArcadeFeatured";
import { ArcadeGameCard } from "./ArcadeGameCard";
import { ArcadeAchievements } from "./ArcadeAchievements";
import { ArcadeLeaderboard } from "./ArcadeLeaderboard";
import { GameOverlay } from "./GameOverlay";

const RED = "#ff2d55";
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
    bg: "linear-gradient(135deg, #0a0a1a 0%, #0d1a2e 100%)",
  },
  {
    id: "snake",
    name: "Snake",
    icon: "🐍",
    category: "Arcade",
    categoryColor: "#00ff88",
    bg: "linear-gradient(135deg, #060f06 0%, #0a1a0a 100%)",
  },
  {
    id: "breakout",
    name: "Breakout",
    icon: "🧱",
    category: "Breaker",
    categoryColor: "#ffaa00",
    bg: "linear-gradient(135deg, #140a00 0%, #1e1000 100%)",
  },
  {
    id: "pong",
    name: "Pong",
    icon: "🏓",
    category: "Sports",
    categoryColor: "#cc44ff",
    bg: "linear-gradient(135deg, #0e0a14 0%, #160e1e 100%)",
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

export function ArcadeSection() {
  const { totalFound } = useHunt();
  const [activeTab, setActiveTab] = useState<Tab>("games");
  const [featuredGame, setFeaturedGame] = useState<GameDef>(GAMES[0]);
  const [activeGame, setActiveGame] = useState<GameDef | null>(null);

  // Secret game unlocks at 5+ clues found
  const secretUnlocked = totalFound >= 5;

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
      {/* Tron-style perspective grid floor */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "60%",
          background: `
            linear-gradient(rgba(255,45,85,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,45,85,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          transform: "perspective(400px) rotateX(55deg)",
          transformOrigin: "bottom center",
          maskImage: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 100%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Radial glow from top-center */}
      <div
        style={{
          position: "absolute",
          top: -80,
          left: "50%",
          transform: "translateX(-50%)",
          width: "120%",
          height: 500,
          background: `radial-gradient(ellipse 50% 60% at 50% 0%, rgba(255,45,85,0.08) 0%, rgba(255,107,45,0.03) 40%, transparent 70%)`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Top accent line */}
      <div
        style={{
          height: 2,
          background: `linear-gradient(90deg, ${RED}, ${ORANGE})`,
          width: "100%",
          position: "relative",
          zIndex: 1,
        }}
      />

      {/* Navigation */}
      <div style={{ position: "relative", zIndex: 10 }}>
        <ArcadeNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Tab content */}
      {activeTab === "games" && (
        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Featured hero */}
          <ArcadeFeatured
            game={featuredGame}
            onLaunch={() => setActiveGame(featuredGame)}
          />

          {/* Spacer between featured and library */}
          <div style={{ height: 32 }} />

          {/* Game library strip */}
          <div
            style={{
              display: "flex",
              alignItems: "stretch",
              gap: 0,
              padding: "24px 28px 48px",
              borderTop: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            {/* Vertical "Library" label */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                writingMode: "vertical-rl",
                textOrientation: "mixed",
                transform: "rotate(180deg)",
                paddingRight: 16,
                paddingLeft: 4,
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-orbitron), monospace",
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: 3,
                  color: "rgba(255,255,255,0.15)",
                  textTransform: "uppercase",
                }}
              >
                Library
              </span>
            </div>

            {/* Card row */}
            <div
              style={{
                display: "flex",
                gap: 16,
                flex: 1,
                overflowX: "auto",
                paddingBottom: 4,
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
                onClick={() => {
                  if (secretUnlocked) setFeaturedGame(SECRET_GAME);
                }}
                onPlay={() => {
                  if (secretUnlocked) setActiveGame(SECRET_GAME);
                }}
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

      {/* Game overlay */}
      {activeGame && (
        <GameOverlay
          gameId={activeGame.id}
          gameName={activeGame.name}
          onClose={() => setActiveGame(null)}
        />
      )}
    </div>
  );
}
