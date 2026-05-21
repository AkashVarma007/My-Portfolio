"use client";

import { useEffect } from "react";
import { EMOTES } from "@/lib/lobby/phaser/emotes";
import type { EmoteId } from "@/lib/lobby/realtime/types";

export type EmoteWheelProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (id: EmoteId) => void;
};

const EMOTE_ORDER: EmoteId[] = ["wave", "sit", "dance", "point", "laugh", "heart"];
const KEY_MAP: Record<string, EmoteId> = {
  "1": "wave",
  "2": "sit",
  "3": "dance",
  "4": "point",
  "5": "laugh",
  "6": "heart",
};

export function EmoteWheel({ open, onClose, onSelect }: EmoteWheelProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      const id = KEY_MAP[e.key];
      if (id) {
        e.preventDefault();
        onSelect(id);
        onClose();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, onSelect]);

  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 40,
        background: "rgba(14,26,58,0.55)",
        display: "grid",
        placeItems: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 8,
          background: "#0E1A3A",
          border: "2px solid #FFE9A8",
          padding: 12,
          fontFamily: "var(--font-press-start)",
        }}
      >
        {EMOTE_ORDER.map((id, i) => {
          const meta = EMOTES[id];
          return (
            <button
              key={id}
              onClick={() => {
                onSelect(id);
                onClose();
              }}
              style={{
                background: "#1B2A52",
                color: "#FFE9A8",
                border: "2px solid #FFE9A8",
                padding: "10px 12px",
                cursor: "pointer",
                fontFamily: "var(--font-press-start)",
                fontSize: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                minWidth: 80,
              }}
            >
              <span style={{ fontSize: 22 }}>{meta.glyph}</span>
              <span>{meta.label}</span>
              <span style={{ color: "#9BA8C7", fontSize: 7 }}>[{i + 1}]</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
