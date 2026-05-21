"use client";

import type { CSSProperties, ReactNode } from "react";

type Variant = "default" | "compact";

type Props = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  style?: CSSProperties;
};

const BG = "#0E1A3A";
const BORDER = "#FFE9A8";
const CORNER = "#FF6B6B";

export function DialogueFrame({ children, variant = "default", className = "", style }: Props) {
  const padding = variant === "compact" ? "px-3 py-2" : "px-4 py-3";
  return (
    <div
      className={`relative border-[3px] ${padding} ${className}`}
      style={{
        background: BG,
        borderColor: BORDER,
        color: "#FFFFFF",
        fontFamily: "VT323, monospace",
        ...style,
      }}
    >
      <Corner top left />
      <Corner top right />
      <Corner bottom left />
      <Corner bottom right />
      <div className="relative">{children}</div>
    </div>
  );
}

function Corner({
  top,
  bottom,
  left,
  right,
}: {
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
}) {
  return (
    <span
      aria-hidden
      className="absolute w-2 h-2"
      style={{
        background: CORNER,
        top: top ? -2 : undefined,
        bottom: bottom ? -2 : undefined,
        left: left ? -2 : undefined,
        right: right ? -2 : undefined,
      }}
    />
  );
}
