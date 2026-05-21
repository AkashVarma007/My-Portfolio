"use client";

export type InteractPromptProps = {
  visible: boolean;
  label: string;
};

export function InteractPrompt({ visible, label }: InteractPromptProps) {
  if (!visible) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        bottom: 120,
        transform: "translateX(-50%)",
        background: "#0E1A3A",
        border: "2px solid #FFE9A8",
        padding: "6px 10px",
        color: "#FFE9A8",
        fontFamily: "var(--font-press-start)",
        fontSize: 9,
        letterSpacing: 1,
        zIndex: 25,
        pointerEvents: "none",
      }}
    >
      [Z] {label}
    </div>
  );
}
