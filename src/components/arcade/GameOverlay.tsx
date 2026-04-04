"use client";

import { useEffect, useCallback } from "react";
import { SnakeGame } from "@/components/games/SnakeGame";
import { InvadersGame } from "@/components/games/InvadersGame";
import { BreakoutGame } from "@/components/games/BreakoutGame";
import { PongGame } from "@/components/games/PongGame";
import { SecretGame } from "@/components/games/SecretGame";

const RED = "#ff2d55";

interface GameOverlayProps {
  gameId: string;
  gameName: string;
  onClose: () => void;
}

function GameContent({ gameId }: { gameId: string }) {
  switch (gameId) {
    case "snake":
      return <SnakeGame />;
    case "invaders":
      return <InvadersGame />;
    case "breakout":
      return <BreakoutGame />;
    case "pong":
      return <PongGame />;
    case "secret":
      return <SecretGame />;
    default:
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            fontFamily: "var(--font-orbitron), monospace",
            fontSize: 18,
            color: "rgba(255,255,255,0.3)",
          }}
        >
          GAME NOT FOUND
        </div>
      );
  }
}

export function GameOverlay({ gameId, gameName, onClose }: GameOverlayProps) {
  // Lock body scroll on mount
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // ESC key to close
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9000,
        background: "#06060a",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          height: 52,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-orbitron), monospace",
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: 3,
            color: "#ffffff",
            textTransform: "uppercase",
          }}
        >
          {gameName}
        </span>

        <button
          onClick={onClose}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 6,
            padding: "6px 14px",
            cursor: "pointer",
            fontFamily: "var(--font-rajdhani), sans-serif",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 2,
            color: "rgba(255,255,255,0.4)",
            outline: "none",
            transition: "color 0.2s, border-color 0.2s",
          }}
          onMouseEnter={(e) => {
            const btn = e.currentTarget as HTMLButtonElement;
            btn.style.color = RED;
            btn.style.borderColor = "rgba(255,45,85,0.3)";
          }}
          onMouseLeave={(e) => {
            const btn = e.currentTarget as HTMLButtonElement;
            btn.style.color = "rgba(255,255,255,0.4)";
            btn.style.borderColor = "rgba(255,255,255,0.08)";
          }}
        >
          <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 10, opacity: 0.6 }}>ESC</span>
          <span>— EXIT</span>
        </button>
      </div>

      {/* Game content area — fill remaining viewport */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "stretch",
          justifyContent: "stretch",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <GameContent gameId={gameId} />
      </div>
    </div>
  );
}
