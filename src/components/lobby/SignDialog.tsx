"use client";

import { useEffect } from "react";

export type SignDialogProps = {
  open: boolean;
  title: string;
  body: string;
  onClose: () => void;
};

export function SignDialog({ open, title, body, onClose }: SignDialogProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " " || e.key === "z" || e.key === "Z") {
        e.preventDefault();
        onClose();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 45,
        background: "rgba(14,26,58,0.65)",
        display: "grid",
        placeItems: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#0E1A3A",
          border: "2px solid #FFE9A8",
          padding: 16,
          maxWidth: 360,
          width: "90%",
          fontFamily: "var(--font-vt323)",
          color: "#F4F1E8",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -4,
            left: -4,
            width: 10,
            height: 10,
            background: "#FF6B6B",
          }}
        />
        <div
          style={{
            color: "#FFE9A8",
            fontFamily: "var(--font-press-start)",
            fontSize: 9,
            letterSpacing: 1,
            marginBottom: 10,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 16, lineHeight: 1.45, whiteSpace: "pre-wrap" }}>{body}</div>
        <div
          style={{
            marginTop: 12,
            color: "#9BA8C7",
            fontFamily: "var(--font-press-start)",
            fontSize: 7,
            textAlign: "right",
          }}
        >
          [Z / ESC] close
        </div>
      </div>
    </div>
  );
}
