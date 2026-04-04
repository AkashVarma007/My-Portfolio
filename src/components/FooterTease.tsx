"use client";

export function FooterTease() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 0 20px",
        opacity: 0.15,
        transition: "opacity 0.5s ease",
        cursor: "default",
        userSelect: "none",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.opacity = "0.35";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.opacity = "0.15";
      }}
    >
      <div style={{ fontSize: 10, letterSpacing: 4, color: "rgba(255,255,255,0.5)", textTransform: "uppercase" as const, fontFamily: "var(--font-mono)", marginBottom: 12 }}>
        keep scrolling
      </div>
      <div style={{ width: 1, height: 30, background: "linear-gradient(180deg, rgba(255,255,255,0.2), transparent)" }} />
      <div style={{ animation: "tease-bounce 2s ease-in-out infinite", fontSize: 14, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>
        ↓
      </div>
      <style>{`
        @keyframes tease-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
      `}</style>
    </div>
  );
}
