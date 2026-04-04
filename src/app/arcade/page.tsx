"use client";

import { useState, useEffect } from "react";
import { HuntProvider } from "@/context/HuntContext";
import { ArcadeSection } from "@/components/arcade/ArcadeSection";
import { VoidSection } from "@/components/void/VoidSection";
import { AchievementWidget } from "@/components/hunt/AchievementWidget";
import { ClueToast } from "@/components/hunt/ClueToast";
import { HiddenTerminal } from "@/components/hunt/HiddenTerminal";

const RED = "#ff2d55";
const ORANGE = "#ff6b2d";

/**
 * Arcade page — if arriving via curtain transition, plays curtain-lift reveal.
 * Uses synchronous initial state check to prevent flash.
 */
export default function ArcadePage() {
  // Check sessionStorage synchronously to prevent flash of content
  const [reveal, setReveal] = useState<"curtain" | "lifting" | "done">(() => {
    if (typeof window !== "undefined") {
      const flag = sessionStorage.getItem("arcade_curtain");
      if (flag) {
        sessionStorage.removeItem("arcade_curtain");
        return "curtain";
      }
    }
    return "done";
  });

  useEffect(() => {
    if (reveal === "curtain") {
      // Brief pause to ensure page content is rendered behind the curtain
      const t1 = setTimeout(() => setReveal("lifting"), 200);
      const t2 = setTimeout(() => setReveal("done"), 1400);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [reveal]);

  return (
    <HuntProvider>
      <ArcadeSection />
      <VoidSection />
      <AchievementWidget />
      <ClueToast />
      <HiddenTerminal />

      {/* ── Curtain reveal overlay ── */}
      {reveal !== "done" && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99500,
            pointerEvents: reveal === "curtain" ? "all" : "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "#050508",
              animation:
                reveal === "lifting"
                  ? "curtain-lift 1.1s cubic-bezier(0.77, 0, 0.175, 1) forwards"
                  : undefined,
              overflow: "hidden",
            }}
          >
            {/* Scanlines */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(255,45,85,0.01) 3px, rgba(255,45,85,0.01) 4px)",
                pointerEvents: "none",
              }}
            />

            {/* Bottom edge glow — visible as the curtain lifts */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 3,
                background: `linear-gradient(90deg, transparent 5%, ${RED}, ${ORANGE}, ${RED}, transparent 95%)`,
                boxShadow: `0 0 20px 4px rgba(255,45,85,0.4), 0 0 60px 8px rgba(255,45,85,0.15)`,
              }}
            />

            {/* Perspective grid — fades out as curtain lifts */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: "-20%",
                right: "-20%",
                height: "55%",
                background: `
                  linear-gradient(rgba(255,45,85,0.05) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,45,85,0.05) 1px, transparent 1px)
                `,
                backgroundSize: "60px 60px",
                transform: "perspective(500px) rotateX(55deg)",
                transformOrigin: "bottom center",
                opacity: 0.5,
              }}
            />
          </div>
        </div>
      )}

      <style>{`
        @keyframes curtain-lift {
          0%   { transform: translateY(0%); }
          100% { transform: translateY(-100%); }
        }
      `}</style>
    </HuntProvider>
  );
}
