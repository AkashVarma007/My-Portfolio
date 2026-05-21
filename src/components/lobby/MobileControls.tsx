"use client";

import { useEffect, useRef } from "react";
import { TouchInput, type TouchAxis } from "@/lib/lobby/phaser/touch-input";

const BTN_BG = "#0E1A3A";
const BTN_BORDER = "#FFE9A8";
const ACCENT = "#FF6B6B";

export function MobileControls() {
  const padRef = useRef<HTMLDivElement | null>(null);
  const activeAxis = useRef<{ dx: TouchAxis; dy: TouchAxis }>({ dx: 0, dy: 0 });

  useEffect(() => {
    return () => TouchInput.setAxis(0, 0);
  }, []);

  function handlePadTouch(clientX: number, clientY: number) {
    const pad = padRef.current;
    if (!pad) return;
    const rect = pad.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    const threshold = rect.width * 0.18;
    let ax: TouchAxis = 0;
    let ay: TouchAxis = 0;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > threshold) ax = 1;
      else if (dx < -threshold) ax = -1;
    } else {
      if (dy > threshold) ay = 1;
      else if (dy < -threshold) ay = -1;
    }
    activeAxis.current = { dx: ax, dy: ay };
    TouchInput.setAxis(ax, ay);
  }

  function resetPad() {
    activeAxis.current = { dx: 0, dy: 0 };
    TouchInput.setAxis(0, 0);
  }

  const padButton = (
    label: string,
    dx: TouchAxis,
    dy: TouchAxis,
    style: React.CSSProperties
  ) => (
    <button
      onTouchStart={(e) => {
        e.preventDefault();
        TouchInput.setAxis(dx, dy);
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        TouchInput.setAxis(0, 0);
      }}
      onPointerDown={() => TouchInput.setAxis(dx, dy)}
      onPointerUp={() => TouchInput.setAxis(0, 0)}
      onPointerLeave={() => TouchInput.setAxis(0, 0)}
      style={{
        background: BTN_BG,
        color: BTN_BORDER,
        border: `2px solid ${BTN_BORDER}`,
        fontFamily: "var(--font-press-start)",
        fontSize: 10,
        width: 48,
        height: 48,
        touchAction: "none",
        ...style,
      }}
    >
      {label}
    </button>
  );

  const actionButton = (label: string, action: "throw" | "punch" | "emote" | "interact" | "chat") => (
    <button
      onTouchStart={(e) => {
        e.preventDefault();
        TouchInput.press(action);
      }}
      onPointerDown={() => TouchInput.press(action)}
      style={{
        background: action === "throw" ? ACCENT : BTN_BG,
        color: action === "throw" ? BTN_BG : BTN_BORDER,
        border: `2px solid ${BTN_BORDER}`,
        fontFamily: "var(--font-press-start)",
        fontSize: 8,
        width: 56,
        height: 56,
        borderRadius: "50%",
        touchAction: "none",
      }}
    >
      {label}
    </button>
  );

  return (
    <>
      <div
        ref={padRef}
        onTouchStart={(e) => {
          e.preventDefault();
          const t = e.touches[0];
          if (t) handlePadTouch(t.clientX, t.clientY);
        }}
        onTouchMove={(e) => {
          e.preventDefault();
          const t = e.touches[0];
          if (t) handlePadTouch(t.clientX, t.clientY);
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          resetPad();
        }}
        style={{
          position: "absolute",
          left: 24,
          bottom: 24,
          width: 144,
          height: 144,
          display: "grid",
          gridTemplateColumns: "repeat(3, 48px)",
          gridTemplateRows: "repeat(3, 48px)",
          touchAction: "none",
          zIndex: 35,
        }}
      >
        <div />
        {padButton("↑", 0, -1, {})}
        <div />
        {padButton("←", -1, 0, {})}
        <div />
        {padButton("→", 1, 0, {})}
        <div />
        {padButton("↓", 0, 1, {})}
        <div />
      </div>
      <div
        style={{
          position: "absolute",
          right: 24,
          bottom: 24,
          display: "grid",
          gridTemplateColumns: "repeat(2, 56px)",
          gap: 10,
          zIndex: 35,
        }}
      >
        {actionButton("THROW", "throw")}
        {actionButton("PUNCH", "punch")}
        {actionButton("EMOTE", "emote")}
        {actionButton("USE", "interact")}
      </div>
    </>
  );
}
