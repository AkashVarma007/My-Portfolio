"use client";

import { useEffect } from "react";
import { useHunt } from "@/context/HuntContext";
import { CLUES } from "@/data/clues";

export function ClueToast() {
  const { clueJustFound, dismissClueToast, totalFound, totalClues } = useHunt();

  useEffect(() => {
    if (clueJustFound !== null) {
      const timer = setTimeout(dismissClueToast, 4000);
      return () => clearTimeout(timer);
    }
  }, [clueJustFound, dismissClueToast]);

  if (clueJustFound === null) return null;

  const clue = CLUES.find((c) => c.id === clueJustFound);
  if (!clue) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 80,
        left: 24,
        zIndex: 10000,
        background: "rgba(255,45,85,0.12)",
        border: "1px solid rgba(255,45,85,0.3)",
        backdropFilter: "blur(12px)",
        borderRadius: 6,
        padding: "12px 18px",
        maxWidth: 300,
        animation: "toast-in 0.4s ease-out",
        fontFamily: "var(--font-rajdhani), sans-serif",
      }}
    >
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#ff2d55", textTransform: "uppercase" as const, marginBottom: 4 }}>
        Fragment Found
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 2 }}>
        {clue.title}
      </div>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
        {totalFound} of {totalClues} fragments collected
      </div>
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(12px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
