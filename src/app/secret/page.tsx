"use client";

import { useEffect, useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface HuntState {
  cluesFound: number[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const STORAGE_KEY = "akash_hunt";

function loadHuntState(): HuntState {
  if (typeof window === "undefined") return { cluesFound: [] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { cluesFound: [] };
    const parsed = JSON.parse(raw) as Partial<HuntState>;
    return {
      cluesFound: Array.isArray(parsed.cluesFound) ? parsed.cluesFound : [],
    };
  } catch {
    return { cluesFound: [] };
  }
}

function saveHuntState(state: HuntState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore write errors
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function SecretPage() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const state = loadHuntState();
    // If clue 14 is done, visiting /secret grants clue 15.
    if (state.cluesFound.includes(14) && !state.cluesFound.includes(15)) {
      const next = { ...state, cluesFound: [...state.cluesFound, 15] };
      saveHuntState(next);
      setAuthorized(true);
      return;
    }
    setAuthorized(state.cluesFound.includes(15));
  }, []);

  // Hydration guard — show nothing until we've read localStorage
  if (authorized === null) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />
    );
  }

  // ------------------------------------------------------------------
  // Locked view
  // ------------------------------------------------------------------

  if (!authorized) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#000",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          fontFamily: "Georgia, 'Times New Roman', serif",
          color: "rgba(255,255,255,0.35)",
          textAlign: "center",
          padding: "0 24px",
        }}
      >
        <span style={{ fontSize: 48, lineHeight: 1 }}>🔒</span>
        <p style={{ fontSize: 18, margin: 0, color: "rgba(255,255,255,0.5)" }}>
          This page is not for you.
        </p>
        <p style={{ fontSize: 14, margin: 0 }}>Not yet, anyway.</p>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // Authorized view
  // ------------------------------------------------------------------

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 24px",
        fontFamily: "Georgia, 'Times New Roman', serif",
        color: "#fff",
        textAlign: "center",
      }}
    >
      {/* Badge */}
      <div
        style={{
          fontFamily: "'JetBrains Mono', 'Courier New', monospace",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 6,
          color: "#ff2d55",
          textTransform: "uppercase" as const,
          marginBottom: 28,
        }}
      >
        ALL 15 FRAGMENTS FOUND
      </div>

      {/* Title */}
      <h1
        style={{
          fontSize: 36,
          fontWeight: 400,
          margin: "0 0 40px",
          lineHeight: 1.2,
        }}
      >
        You found it.
      </h1>

      {/* Poetic content */}
      <div
        style={{
          maxWidth: 480,
          fontSize: 16,
          lineHeight: 2,
          color: "rgba(255,255,255,0.7)",
          marginBottom: 56,
        }}
      >
        <p style={{ margin: "0 0 4px" }}>Most people scroll. You decoded.</p>
        <p style={{ margin: "0 0 4px" }}>Most people click. You investigated.</p>
        <p style={{ margin: "0 0 4px" }}>Most people give up. You solved.</p>
        <p style={{ margin: "0", color: "rgba(255,255,255,0.9)", fontStyle: "italic" }}>
          That tells me something about you.
        </p>
      </div>

      {/* Direct line box */}
      <div
        style={{
          maxWidth: 480,
          width: "100%",
          border: "1px solid rgba(255,45,85,0.35)",
          borderRadius: 8,
          padding: "28px 32px",
          background: "rgba(255,45,85,0.05)",
          marginBottom: 64,
          textAlign: "left",
        }}
      >
        <div
          style={{
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 4,
            color: "#ff2d55",
            textTransform: "uppercase" as const,
            marginBottom: 16,
          }}
        >
          DIRECT LINE
        </div>
        <p
          style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.65)",
            lineHeight: 1.75,
            margin: "0 0 20px",
          }}
        >
          You have earned a direct line to Akash. If you want to work together,
          collaborate, or just say you cracked it — reach out.
        </p>
        <a
          href="mailto:akash@secret.contact"
          style={{
            display: "inline-block",
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
            fontSize: 13,
            color: "#ff2d55",
            textDecoration: "none",
            letterSpacing: 1,
            borderBottom: "1px solid rgba(255,45,85,0.4)",
            paddingBottom: 2,
          }}
        >
          akash@secret.contact
        </a>
        <p
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.35)",
            margin: "16px 0 0",
          }}
        >
          Mention{" "}
          <span
            style={{
              fontFamily: "'JetBrains Mono', 'Courier New', monospace",
              color: "rgba(255,45,85,0.7)",
            }}
          >
            Fragment 15
          </span>{" "}
          so Akash knows you made it here.
        </p>
      </div>

      {/* Footer */}
      <p
        style={{
          fontSize: 12,
          color: "rgba(255,255,255,0.2)",
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          margin: 0,
        }}
      >
        Built with curiosity. Solved with persistence.
      </p>
    </div>
  );
}
