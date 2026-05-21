"use client";

import Link from "next/link";
import { DialogueFrame } from "./DialogueFrame";

export function MobileWarning() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <DialogueFrame style={{ width: "min(360px, 92vw)" }}>
        <h2
          style={{
            fontFamily: "var(--font-press-start)",
            fontSize: 12,
            color: "#FFE9A8",
            textAlign: "center",
            marginBottom: 12,
          }}
        >
          Desktop only
        </h2>
        <p
          style={{
            fontFamily: "VT323, monospace",
            fontSize: 18,
            color: "#FFFFFF",
            lineHeight: 1.4,
            textAlign: "center",
          }}
        >
          The Lobby v0 needs a keyboard. Mobile touch controls land in the next
          drop. Come back on desktop — bring snowballs.
        </p>
        <Link
          href="/"
          style={{
            display: "block",
            marginTop: 16,
            fontFamily: "var(--font-press-start)",
            fontSize: 9,
            color: "#FF6B6B",
            textAlign: "center",
          }}
        >
          ← back home
        </Link>
      </DialogueFrame>
    </div>
  );
}
