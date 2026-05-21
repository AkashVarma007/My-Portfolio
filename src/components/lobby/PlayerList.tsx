"use client";

import type { PresencePayload } from "@/lib/lobby/realtime/types";

export type PlayerListProps = {
  peers: PresencePayload[];
  selfId: string;
};

export function PlayerList({ peers, selfId }: PlayerListProps) {
  const sorted = [...peers].sort((a, b) => a.joinedAt - b.joinedAt);
  return (
    <div
      style={{
        position: "absolute",
        top: 16,
        right: 16,
        background: "#0E1A3A",
        border: "2px solid #FFE9A8",
        padding: "6px 8px",
        color: "#F4F1E8",
        fontFamily: "var(--font-vt323)",
        fontSize: 14,
        minWidth: 140,
        zIndex: 30,
      }}
    >
      <div
        style={{
          color: "#FFE9A8",
          fontFamily: "var(--font-press-start)",
          fontSize: 8,
          marginBottom: 4,
          letterSpacing: 1,
        }}
      >
        ONLINE · {sorted.length}
      </div>
      {sorted.length === 0 ? (
        <div style={{ color: "#8A93B0" }}>— quiet —</div>
      ) : (
        sorted.map((p) => (
          <div
            key={p.id}
            style={{
              color: p.id === selfId ? "#FF6B6B" : p.isGuest ? "#9BA8C7" : "#F4F1E8",
              lineHeight: 1.3,
            }}
          >
            {p.name}
            {p.isGuest && <span style={{ color: "#9BA8C7" }}>*</span>}
            {p.id === selfId && " (you)"}
          </div>
        ))
      )}
    </div>
  );
}
