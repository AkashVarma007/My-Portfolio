"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatPayload } from "@/lib/lobby/realtime/types";

export type ChatPanelProps = {
  messages: ChatPayload[];
  onSend: (text: string) => Promise<void>;
  selfUsername: string;
};

const PANEL_BG = "#0E1A3A";
const PANEL_BORDER = "#FFE9A8";
const ACCENT = "#FF6B6B";

export function ChatPanel({ messages, onSend, selfUsername }: ChatPanelProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Enter" && !open && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
    setError(null);
    setSending(true);
    try {
      await onSend(draft);
      setDraft("");
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send");
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      style={{
        position: "absolute",
        right: 16,
        bottom: 16,
        width: 280,
        zIndex: 30,
        fontFamily: "var(--font-vt323)",
      }}
    >
      <div
        ref={listRef}
        style={{
          background: PANEL_BG,
          border: `2px solid ${PANEL_BORDER}`,
          color: "#F4F1E8",
          padding: 8,
          maxHeight: 200,
          overflowY: "auto",
          fontSize: 14,
          lineHeight: 1.4,
        }}
      >
        {messages.length === 0 ? (
          <div style={{ color: "#8A93B0" }}>No transmissions yet.</div>
        ) : (
          messages.map((m, i) => (
            <div key={`${m.timestamp}-${i}`} style={{ marginBottom: 2 }}>
              <span
                style={{
                  color: m.from === selfUsername ? ACCENT : m.isGuest ? "#9BA8C7" : PANEL_BORDER,
                  marginRight: 6,
                }}
              >
                {m.from}{m.isGuest ? "*" : ""}:
              </span>
              <span>{m.text}</span>
            </div>
          ))
        )}
      </div>
      {open ? (
        <form
          onSubmit={handleSubmit}
          style={{
            marginTop: 4,
            display: "flex",
            gap: 4,
            background: PANEL_BG,
            border: `2px solid ${PANEL_BORDER}`,
            padding: 4,
          }}
        >
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={120}
            placeholder="say something"
            style={{
              flex: 1,
              background: "transparent",
              color: PANEL_BORDER,
              border: "none",
              outline: "none",
              fontFamily: "var(--font-vt323)",
              fontSize: 14,
            }}
          />
          <button
            type="submit"
            disabled={sending || draft.trim().length === 0}
            style={{
              background: ACCENT,
              color: PANEL_BG,
              border: "none",
              padding: "2px 8px",
              fontFamily: "var(--font-press-start)",
              fontSize: 8,
              cursor: "pointer",
            }}
          >
            send
          </button>
        </form>
      ) : (
        <button
          onClick={() => setOpen(true)}
          style={{
            marginTop: 4,
            width: "100%",
            background: PANEL_BG,
            color: PANEL_BORDER,
            border: `2px solid ${PANEL_BORDER}`,
            padding: "4px 8px",
            fontFamily: "var(--font-press-start)",
            fontSize: 9,
            cursor: "pointer",
          }}
        >
          [Enter] to chat
        </button>
      )}
      {error && (
        <div
          style={{
            marginTop: 4,
            color: ACCENT,
            fontFamily: "var(--font-vt323)",
            fontSize: 12,
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
