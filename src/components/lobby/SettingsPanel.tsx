"use client";

import { useState } from "react";
import { DialogueFrame } from "./DialogueFrame";
import type { LobbySession } from "./LoginGate";
import { getSupabaseBrowser } from "@/lib/lobby/supabase-browser";

const VARIANTS = ["default", "scholar", "tinkerer", "nomad"];
const NAME_COLORS = ["#ffffff", "#FFE9A8", "#FF6B6B", "#9EE493", "#A6C8FF"];

type Props = {
  session: LobbySession;
  open: boolean;
  onClose: () => void;
  onProfileUpdated: (session: LobbySession) => void;
};

export function SettingsPanel({ session, open, onClose, onProfileUpdated }: Props) {
  const isAccount = session.kind === "account";
  const initialVariant = isAccount ? session.profile.variant : session.variant;
  const initialColor = isAccount ? session.profile.name_color : "#ffffff";

  const [variant, setVariant] = useState(initialVariant);
  const [color, setColor] = useState(initialColor);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function save() {
    setError(null);
    if (session.kind !== "account") {
      onProfileUpdated({ ...session, variant });
      onClose();
      return;
    }
    setBusy(true);
    const supabase = getSupabaseBrowser();
    const { data, error: dbError } = await supabase
      .from("lobby_profiles")
      .update({ variant, name_color: color })
      .eq("id", session.profile.id)
      .select()
      .single();
    setBusy(false);
    if (dbError || !data) {
      setError(dbError?.message ?? "Save failed");
      return;
    }
    onProfileUpdated({
      kind: "account",
      profile: {
        ...session.profile,
        variant,
        name_color: color,
      },
    });
    onClose();
  }

  return (
    <div
      className="absolute inset-0 z-40 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <DialogueFrame style={{ width: "min(360px, 92vw)" }}>
          <h2
            style={{
              fontFamily: "var(--font-press-start)",
              fontSize: 12,
              color: "#FFE9A8",
              marginBottom: 12,
            }}
          >
            Settings
          </h2>

          <p
            style={{
              fontFamily: "var(--font-press-start)",
              fontSize: 9,
              color: "#FFE9A8",
              marginBottom: 4,
            }}
          >
            Character
          </p>
          <div className="flex gap-2 mb-4">
            {VARIANTS.map((v) => (
              <button
                key={v}
                onClick={() => setVariant(v)}
                className="flex-1 py-1 capitalize"
                style={{
                  background: variant === v ? "#FFE9A8" : "#1A2550",
                  color: variant === v ? "#0E1A3A" : "#FFFFFF",
                  border: "2px solid #FFE9A8",
                  fontFamily: "VT323, monospace",
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                {v}
              </button>
            ))}
          </div>

          {isAccount && (
            <>
              <p
                style={{
                  fontFamily: "var(--font-press-start)",
                  fontSize: 9,
                  color: "#FFE9A8",
                  marginBottom: 4,
                }}
              >
                Name color
              </p>
              <div className="flex gap-2 mb-4">
                {NAME_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    aria-label={c}
                    style={{
                      width: 32,
                      height: 32,
                      background: c,
                      border:
                        color === c ? "3px solid #FF6B6B" : "2px solid #FFE9A8",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            </>
          )}

          {error && (
            <p
              style={{
                color: "#FF6B6B",
                fontFamily: "VT323, monospace",
                fontSize: 14,
                marginBottom: 8,
              }}
            >
              {error}
            </p>
          )}

          <div className="flex gap-2">
            <button
              onClick={save}
              disabled={busy}
              className="flex-1 py-2"
              style={{
                background: "#FFE9A8",
                color: "#0E1A3A",
                border: "2px solid #FF6B6B",
                fontFamily: "var(--font-press-start)",
                fontSize: 9,
                cursor: busy ? "not-allowed" : "pointer",
              }}
            >
              {busy ? "..." : "Save"}
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2"
              style={{
                background: "#0E1A3A",
                color: "#FFE9A8",
                border: "2px solid #FFE9A8",
                fontFamily: "var(--font-press-start)",
                fontSize: 9,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </DialogueFrame>
      </div>
    </div>
  );
}
