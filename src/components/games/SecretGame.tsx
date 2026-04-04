"use client";

export function SecretGame() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 14,
        fontFamily: "var(--font-orbitron), monospace",
        color: "rgba(255,255,255,0.7)",
      }}
    >
      <div
        style={{
          fontSize: 12,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.35)",
        }}
      >
        Mystery Game
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, color: "#ff2d55" }}>
        Coming Soon
      </div>
      <div
        style={{
          fontFamily: "var(--font-rajdhani), sans-serif",
          fontSize: 13,
          maxWidth: 360,
          textAlign: "center",
          color: "rgba(255,255,255,0.45)",
          lineHeight: 1.6,
        }}
      >
        You unlocked the door. The game itself is still being built.
      </div>
    </div>
  );
}
