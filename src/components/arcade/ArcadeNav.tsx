"use client";

import { useHunt } from "@/context/HuntContext";

const RED = "#ff2d55";
const ORANGE = "#ff6b2d";

type Tab = "games" | "achievements" | "leaderboard";

interface ArcadeNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

function getRankName(totalFound: number): string {
  if (totalFound >= 15) return "LEGEND";
  if (totalFound >= 10) return "HUNTER";
  if (totalFound >= 5) return "SEEKER";
  if (totalFound >= 1) return "SCOUT";
  return "ROOKIE";
}

export function ArcadeNav({ activeTab, onTabChange }: ArcadeNavProps) {
  const { totalFound, totalClues } = useHunt();
  const xpPct = totalClues > 0 ? (totalFound / totalClues) * 100 : 0;
  const rankName = getRankName(totalFound);

  const tabs: { id: Tab; label: string }[] = [
    { id: "games", label: "GAMES" },
    { id: "achievements", label: "ACHIEVEMENTS" },
    { id: "leaderboard", label: "LEADERBOARD" },
  ];

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        gap: 0,
        padding: "0 24px",
        height: 56,
        background: "rgba(6,6,10,0.82)",
        backdropFilter: "blur(24px) saturate(1.4)",
        WebkitBackdropFilter: "blur(24px) saturate(1.4)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
      }}
    >
      {/* Logo */}
      <span
        style={{
          fontFamily: "var(--font-orbitron), monospace",
          fontSize: 18,
          fontWeight: 900,
          letterSpacing: 3,
          background: `linear-gradient(90deg, ${RED}, ${ORANGE})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          flexShrink: 0,
        }}
      >
        ARCADE
      </span>

      {/* Divider */}
      <div
        style={{
          width: 1,
          height: 22,
          background: "rgba(255,255,255,0.1)",
          margin: "0 20px",
          flexShrink: 0,
        }}
      />

      {/* Tab buttons */}
      <div style={{ display: "flex", gap: 4, flex: 1 }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "6px 14px",
                fontFamily: "var(--font-rajdhani), sans-serif",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 2,
                color: isActive ? RED : "rgba(255,255,255,0.35)",
                borderBottom: isActive ? `3px solid ${RED}` : "3px solid transparent",
                textShadow: isActive ? `0 0 12px ${RED}66` : "none",
                transition: "color 0.2s, border-color 0.2s",
                outline: "none",
              }}
              onMouseEnter={(e) => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.7)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.35)";
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Right side: XP + profile */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexShrink: 0,
        }}
      >
        {/* XP progress bar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "flex-end" }}>
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: 1.5,
              color: "rgba(255,255,255,0.3)",
              fontFamily: "var(--font-orbitron), monospace",
            }}
          >
            {totalFound}/{totalClues} XP
          </span>
          <div
            style={{
              width: 60,
              height: 4,
              borderRadius: 2,
              background: "rgba(255,255,255,0.08)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${xpPct}%`,
                background: `linear-gradient(90deg, ${RED}, ${ORANGE})`,
                borderRadius: 2,
                transition: "width 0.5s ease",
              }}
            />
          </div>
        </div>

        {/* Player profile pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "4px 10px 4px 4px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20,
          }}
        >
          {/* Angled avatar */}
          <div
            style={{
              width: 26,
              height: 26,
              background: `linear-gradient(135deg, ${RED}, ${ORANGE})`,
              clipPath: "polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 11 }}>★</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <span
              style={{
                fontFamily: "var(--font-orbitron), monospace",
                fontSize: 9,
                fontWeight: 700,
                color: "rgba(255,255,255,0.85)",
                letterSpacing: 1,
              }}
            >
              PLAYER ONE
            </span>
            <span
              style={{
                fontFamily: "var(--font-rajdhani), sans-serif",
                fontSize: 10,
                fontWeight: 600,
                color: RED,
                letterSpacing: 1,
              }}
            >
              {rankName}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
