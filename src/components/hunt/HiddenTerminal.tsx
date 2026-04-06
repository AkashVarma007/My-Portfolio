"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useHunt } from "@/context/HuntContext";

// ---------------------------------------------------------------------------
// Konami code sequence
// ---------------------------------------------------------------------------

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface HistoryEntry {
  type: "input" | "output" | "system";
  text: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function HiddenTerminal() {
  const { totalFound, totalClues, isClueFound, canAttemptClue, unlockClue } =
    useHunt();

  // Stable refs so keydown effect never restarts due to context re-renders
  const huntRef = useRef({ canAttemptClue, unlockClue, isClueFound });
  useEffect(() => {
    huntRef.current = { canAttemptClue, unlockClue, isClueFound };
  }, [canAttemptClue, unlockClue, isClueFound]);

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([
    { type: "system", text: "TERMINAL v1.0 — Type 'help' for available commands." },
  ]);

  const konamiProgress = useRef<number>(0);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ------------------------------------------------------------------
  // Scroll to bottom on history change
  // ------------------------------------------------------------------

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  // ------------------------------------------------------------------
  // Lock body scroll when open
  // ------------------------------------------------------------------

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // ------------------------------------------------------------------
  // Konami code listener
  // ------------------------------------------------------------------

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const key = e.key;
      if (key === KONAMI[konamiProgress.current]) {
        konamiProgress.current += 1;
        if (konamiProgress.current === KONAMI.length) {
          konamiProgress.current = 0;
          setOpen(true);
          if (huntRef.current.canAttemptClue(14)) {
            huntRef.current.unlockClue(14);
          }
        }
      } else {
        konamiProgress.current = key === KONAMI[0] ? 1 : 0;
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // hunt callbacks accessed via huntRef

  // ------------------------------------------------------------------
  // External open trigger (AchievementWidget button)
  // ------------------------------------------------------------------
  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener("open-terminal", handleOpen);
    return () => window.removeEventListener("open-terminal", handleOpen);
  }, []);

  // ------------------------------------------------------------------
  // Command processor
  // ------------------------------------------------------------------

  const pushOutput = useCallback((text: string, type: HistoryEntry["type"] = "output") => {
    setHistory((prev) => [...prev, { type, text }]);
  }, []);

  const processCommand = useCallback(
    (raw: string) => {
      const cmd = raw.trim().toLowerCase();

      // echo input
      setHistory((prev) => [...prev, { type: "input", text: raw }]);

      switch (cmd) {
        case "help":
          pushOutput("Commands: help, status, clues, hint, clear, exit");
          break;

        case "status":
          pushOutput(
            `Fragments found: ${totalFound} / ${totalClues}`
          );
          break;

        case "clues": {
          const line1 = `Fragments collected: ${totalFound}`;
          pushOutput(line1);
          if (isClueFound(15)) {
            pushOutput(
              "Passphrase acquired. The door awaits at /secret."
            );
          } else {
            pushOutput(
              "Keep searching. The passphrase is hidden in the fragments."
            );
          }
          break;
        }

        case "hint":
          pushOutput(
            "The itch that opens every door."
          );
          break;

        case "clear":
          setHistory([
            { type: "system", text: "TERMINAL v1.0 — Type 'help' for available commands." },
          ]);
          break;

        case "exit":
          setOpen(false);
          break;

        case "curiosity":
          if (canAttemptClue(15)) {
            const unlocked = unlockClue(15);
            if (unlocked || isClueFound(15)) {
              pushOutput(
                "ACCESS GRANTED. The path is open. Navigate to /secret to claim your reward.",
                "system"
              );
            } else {
              pushOutput("You already possess this knowledge.");
            }
          } else {
            pushOutput(
              `Unknown command: "${raw}". Type "help" for available commands.`
            );
          }
          break;

        case "/secret":
          if (isClueFound(15)) {
            const unlocked = unlockClue(16);
            if (unlocked || isClueFound(16)) {
              pushOutput(
                "Fragment #16 collected. Open /secret in your browser.",
                "system"
              );
            } else {
              pushOutput("Fragment #16 already collected. Open /secret.");
            }
          } else {
            pushOutput(
              `Unknown command: "${raw}". Type "help" for available commands.`
            );
          }
          break;

        default:
          pushOutput(
            `Unknown command: "${raw}". Type "help" for available commands.`
          );
      }
    },
    [
      totalFound,
      totalClues,
      isClueFound,
      canAttemptClue,
      unlockClue,
      pushOutput,
    ]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim()) return;
      processCommand(input);
      setInput("");
    },
    [input, processCommand]
  );

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------

  if (!open) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      {/* Terminal window */}
      <div
        style={{
          width: 600,
          maxWidth: "calc(100vw - 32px)",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          background: "#0a0a0f",
          border: "1px solid rgba(255,45,85,0.3)",
          borderRadius: 8,
          overflow: "hidden",
          boxShadow: "0 0 40px rgba(255,45,85,0.15), 0 24px 64px rgba(0,0,0,0.7)",
          fontFamily: "var(--font-mono), 'JetBrains Mono', 'Courier New', monospace",
        }}
      >
        {/* Title bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 16px",
            background: "rgba(255,45,85,0.08)",
            borderBottom: "1px solid rgba(255,45,85,0.2)",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 4,
              color: "#ff2d55",
              textTransform: "uppercase" as const,
            }}
          >
            TERMINAL
          </span>
          <button
            onClick={() => setOpen(false)}
            style={{
              background: "none",
              border: "1px solid rgba(255,45,85,0.3)",
              borderRadius: 4,
              color: "#ff2d55",
              cursor: "pointer",
              fontSize: 12,
              padding: "2px 8px",
              fontFamily: "inherit",
              lineHeight: 1.4,
            }}
          >
            ✕
          </button>
        </div>

        {/* Output area */}
        <div
          ref={outputRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            fontSize: 13,
            lineHeight: 1.6,
          }}
        >
          {history.map((entry, i) => (
            <div
              key={i}
              style={{
                color:
                  entry.type === "input"
                    ? "#fff"
                    : entry.type === "system"
                    ? "#ff2d55"
                    : "rgba(255,255,255,0.65)",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {entry.type === "input" ? (
                <span>
                  <span style={{ color: "#ff2d55" }}>$ </span>
                  {entry.text}
                </span>
              ) : (
                entry.text
              )}
            </div>
          ))}
        </div>

        {/* Input area */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 16px",
            borderTop: "1px solid rgba(255,45,85,0.15)",
            background: "rgba(255,45,85,0.04)",
            flexShrink: 0,
            gap: 8,
          }}
        >
          <span style={{ color: "#ff2d55", fontSize: 14, fontWeight: 700 }}>$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              color: "#fff",
              fontSize: 13,
              fontFamily: "inherit",
              caretColor: "#ff2d55",
            }}
          />
        </form>
      </div>
    </div>
  );
}
