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
      onDoubleClick={locked ? undefined : (e) => {
        e.preventDefault();
        onPlay();
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        width: 180,
        height: 220,
        flexShrink: 0,
        borderRadius: 8,
        overflow: "hidden",
        cursor: locked ? "default" : "pointer",
        opacity: locked ? 0.35 : 1,
        border: `1px solid ${hovered && !locked ? game.categoryColor + "88" : isFeatured ? "rgba(255,45,85,0.4)" : "rgba(255,255,255,0.07)"}`,
        transition: "border-color 0.25s, transform 0.25s, box-shadow 0.25s",
        transform: hovered && !locked ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered && !locked
          ? `0 0 20px ${game.categoryColor}22, 0 8px 24px rgba(0,0,0,0.4)`
          : "0 2px 8px rgba(0,0,0,0.2)",
        background: game.bg,
      }}
    >
      {/* Background art / gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: game.bg,
        }}
      />

      {/* Hover glow overlay */}
      {hovered && !locked && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at 50% 40%, ${game.categoryColor}12 0%, transparent 70%)`,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      )}

      {/* Center icon */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 50,
          zIndex: 2,
        }}
      >
        <span
          style={{
            fontSize: 40,
            lineHeight: 1,
            filter: locked ? "grayscale(1)" : hovered ? `drop-shadow(0 0 12px ${game.categoryColor}66)` : "none",
            transition: "filter 0.25s, transform 0.25s",
            transform: hovered && !locked ? "scale(1.1)" : "scale(1)",
          }}
        >
          {game.icon}
        </span>
      </div>

      {/* Bottom gradient overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 90,
          background: "linear-gradient(transparent, rgba(6,6,10,0.95))",
          pointerEvents: "none",
          zIndex: 3,
        }}
      />

      {/* Bottom info */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "0 12px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 3,
          zIndex: 4,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-orbitron), monospace",
            fontSize: 12,
            fontWeight: 700,
            color: "rgba(255,255,255,0.9)",
            letterSpacing: 0.5,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {game.name}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: game.categoryColor,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-rajdhani), sans-serif",
              fontSize: 10,
              fontWeight: 600,
              color: "rgba(255,255,255,0.4)",
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            {game.category}
          </span>
        </div>
      </div>

      {/* Bottom accent line in category color */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, ${game.categoryColor}66, ${game.categoryColor}22)`,
          zIndex: 5,
        }}
      />

      {/* SELECTED diagonal ribbon */}
      {isFeatured && !locked && (
        <div
          style={{
            position: "absolute",
            top: 16,
            right: -18,
            width: 76,
            background: RED,
            padding: "3px 0",
            textAlign: "center",
            transform: "rotate(45deg)",
            fontFamily: "var(--font-orbitron), monospace",
            fontSize: 7,
            fontWeight: 700,
            letterSpacing: 1,
            color: "#fff",
            zIndex: 6,
          }}
        >
          SELECTED
        </div>
      )}

      {/* Locked overlay */}
      {locked && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            background: "rgba(6,6,10,0.5)",
            zIndex: 7,
          }}
        >
          <span style={{ fontSize: 24 }}>🔒</span>
          <span
            style={{
              fontFamily: "var(--font-rajdhani), sans-serif",
              fontSize: 10,
              fontWeight: 600,
              color: "rgba(255,255,255,0.4)",
              textAlign: "center",
              padding: "0 8px",
              lineHeight: 1.3,
            }}
          >
            Find 5 clues to unlock
          </span>
        </div>
      )}

      {/* Play button on hover — centered and bigger */}
      {hovered && !locked && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPlay();
          }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${RED}, #ff6b2d)`,
            border: "2px solid rgba(255,255,255,0.15)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            color: "#fff",
            outline: "none",
            zIndex: 8,
            boxShadow: `0 0 20px ${RED}44, 0 4px 12px rgba(0,0,0,0.4)`,
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translate(-50%, -50%) scale(1.1)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 28px ${RED}66, 0 4px 16px rgba(0,0,0,0.5)`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translate(-50%, -50%) scale(1)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 20px ${RED}44, 0 4px 12px rgba(0,0,0,0.4)`;
          }}
        >
          ▶
        </button>
      )}
    </div>
  );
}
