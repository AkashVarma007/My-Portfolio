"use client";

import { useEffect, useRef, useState } from "react";
import { useHunt } from "@/context/HuntContext";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const RED = "#ff2d55";

// Text lines — null = empty space
const TEXT_LINES: (string | null)[] = [
  "You scrolled this far.",
  "Most people stopped at the footer.",
  "Some found the arcade.",
  "You kept going.",
  "Good.",
  null,
  "There are 16 fragments hidden across this site.",
  "In the code. In the games.",
  "In places you haven't looked yet.",
  null,
  "Each fragment is a piece of a cipher.",
  "Decode them all, and you'll find something",
  "meant for very few people.",
  null,
  "Here is your next fragment.",
];

// ---------------------------------------------------------------------------
// ScrollLine — single text line that fades in on scroll
// ---------------------------------------------------------------------------

interface ScrollLineProps {
  text: string | null;
  onVisible?: () => void;
}

function ScrollLine({ text, onVisible }: ScrollLineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          onVisible?.();
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [onVisible]);

  const isGood = text === "Good.";

  return (
    <div
      ref={ref}
      style={{
        minHeight: text === null ? "80px" : "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {text !== null && (
        <p
          style={{
            margin: 0,
            fontFamily: isGood
              ? "var(--font-orbitron), monospace"
              : "var(--font-rajdhani), sans-serif",
            fontSize: isGood ? "24px" : "18px",
            fontWeight: isGood ? 700 : 400,
            letterSpacing: isGood ? "4px" : "1px",
            color: visible ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0)",
            transition: "color 1s ease",
            textAlign: "center",
          }}
        >
          {text}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// VoidSection
// ---------------------------------------------------------------------------

export function VoidSection() {
  const { unlockClue, isClueFound, canAttemptClue } = useHunt();

  const clue2Found = isClueFound(2);
  const clue3Found = isClueFound(3);
  const canAttemptClue3 = canAttemptClue(3);

  const [clue2ButtonVisible, setClue2ButtonVisible] = useState(false);
  const [clue3Decoded, setClue3Decoded] = useState(false);

  const clue1Ref = useRef<HTMLDivElement>(null);

  // Observe when last text line becomes visible to show clue 2 button
  useEffect(() => {
    const el = clue1Ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setClue2ButtonVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function handleClue2Click() {
    unlockClue(2);
  }

  function handleClue3Click() {
    if (!clue3Found) {
      unlockClue(3);
      setClue3Decoded(true);
    } else {
      setClue3Decoded((prev) => !prev);
    }
  }

  return (
    <section
      style={{
        background: "#000000",
        minHeight: "150vh",
        paddingTop: "200px",
        paddingBottom: "200px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Keyframe styles */}
      <style>{`
        @keyframes flicker {
          0%, 90%, 100% { opacity: 0.08; }
          92% { opacity: 0.4; }
          94% { opacity: 0.05; }
          96% { opacity: 0.35; }
        }
        @keyframes void-btn-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,45,85,0); }
          50% { box-shadow: 0 0 12px 2px rgba(255,45,85,0.25); }
        }
      `}</style>

      {/* Top gradient: arcade bg → black */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "200px",
          background: "linear-gradient(to bottom, #06060a, #000000)",
          pointerEvents: "none",
        }}
      />

      {/* Content container */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "600px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* Scroll-triggered text lines */}
        {TEXT_LINES.map((line, i) => (
          <ScrollLine key={i} text={line} />
        ))}

        {/* Clue 1 trigger sentinel — becomes visible after last line */}
        <div ref={clue1Ref} style={{ minHeight: "60px" }} />

        {/* Clue 2 button */}
        <div
          style={{
            minHeight: "120px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: clue2ButtonVisible ? 1 : 0,
            transition: "opacity 1.2s ease",
          }}
        >
          {clue2Found ? (
            <div
              style={{
                fontFamily: "var(--font-orbitron), monospace",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "3px",
                color: "rgba(255,45,85,0.7)",
                textTransform: "uppercase" as const,
                textAlign: "center",
              }}
            >
              FRAGMENT #2 COLLECTED
            </div>
          ) : (
            <button
              onClick={handleClue2Click}
              style={{
                background: "transparent",
                border: `1px solid ${RED}`,
                color: RED,
                fontFamily: "var(--font-orbitron), monospace",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "3px",
                padding: "14px 28px",
                cursor: "pointer",
                textTransform: "uppercase" as const,
                outline: "none",
                animation: "void-btn-pulse 2s ease-in-out infinite",
                transition: "background 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.background = "rgba(255,45,85,0.1)";
              }}
              onMouseLeave={(e) => {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.background = "transparent";
              }}
            >
              ◆ COLLECT FRAGMENT #2
            </button>
          )}
        </div>

        {/* Clue 3 — only visible after clue 2 is collected */}
        {canAttemptClue3 && (
          <div
            style={{
              minHeight: "160px",
              display: "flex",
              flexDirection: "column" as const,
              alignItems: "center",
              justifyContent: "center",
              gap: "24px",
              marginTop: "80px",
            }}
          >
            {/* Flickering clue text */}
            <button
              onClick={handleClue3Click}
              aria-label="Decode the flickering message"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                outline: "none",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontFamily: "var(--font-rajdhani), sans-serif",
                  fontSize: "15px",
                  letterSpacing: "2px",
                  color: "#ffffff",
                  opacity: 0.08,
                  animation: "flicker 4s ease-in-out infinite",
                  textAlign: "center",
                  userSelect: "none",
                }}
              >
                th̷e ico̵ns r̶emem̸ber the̵ or̷der: RDTK
              </p>
            </button>

            {/* Decoded message — shown after clue 3 is clicked */}
            {(clue3Found || clue3Decoded) && (
              <div
                style={{
                  maxWidth: "400px",
                  padding: "16px 20px",
                  border: "1px solid rgba(255,45,85,0.2)",
                  background: "rgba(255,45,85,0.05)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-orbitron), monospace",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "2px",
                    color: "rgba(255,45,85,0.6)",
                    marginBottom: "10px",
                    textTransform: "uppercase" as const,
                  }}
                >
                  DECODED
                </div>
                <p
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-rajdhani), sans-serif",
                    fontSize: "14px",
                    color: "rgba(255,255,255,0.55)",
                    lineHeight: 1.65,
                    letterSpacing: "0.5px",
                  }}
                >
                  RDTK — find the orbiting icons in the hero. Click them in this order.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
