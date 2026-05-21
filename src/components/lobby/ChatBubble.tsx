"use client";

import { useEffect, useState } from "react";

export type ChatBubbleProps = {
  text: string;
  durationMs?: number;
};

export function ChatBubble({ text, durationMs = 4000 }: ChatBubbleProps) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = window.setTimeout(() => setVisible(false), durationMs);
    return () => window.clearTimeout(t);
  }, [durationMs]);
  if (!visible) return null;
  return (
    <div
      style={{
        background: "#0E1A3A",
        color: "#FFE9A8",
        border: "2px solid #FFE9A8",
        padding: "4px 8px",
        fontFamily: "var(--font-press-start)",
        fontSize: 9,
        lineHeight: 1.4,
        maxWidth: 180,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        pointerEvents: "none",
      }}
    >
      {text}
    </div>
  );
}
