"use client";

import { useState } from "react";

const STORAGE_KEY = "lobby:audio-pref";

type AudioPref = { sfxMuted: boolean; bgmMuted: boolean };

function readPref(): AudioPref {
  if (typeof window === "undefined") return { sfxMuted: false, bgmMuted: false };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { sfxMuted: false, bgmMuted: false };
    const parsed = JSON.parse(raw) as Partial<AudioPref>;
    return {
      sfxMuted: Boolean(parsed.sfxMuted),
      bgmMuted: Boolean(parsed.bgmMuted),
    };
  } catch {
    return { sfxMuted: false, bgmMuted: false };
  }
}

function writePref(pref: AudioPref) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(pref));
  window.dispatchEvent(new CustomEvent(STORAGE_KEY, { detail: pref }));
}

export function AudioToggle() {
  const [pref, setPref] = useState<AudioPref>(() => readPref());

  function set(next: AudioPref) {
    setPref(next);
    writePref(next);
  }

  return (
    <div
      style={{
        position: "absolute",
        top: 16,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: 6,
        zIndex: 30,
      }}
    >
      <button
        onClick={() => set({ ...pref, bgmMuted: !pref.bgmMuted })}
        style={{
          background: "#0E1A3A",
          color: pref.bgmMuted ? "#9BA8C7" : "#FFE9A8",
          border: "2px solid #FFE9A8",
          fontFamily: "var(--font-press-start)",
          fontSize: 8,
          padding: "4px 8px",
          cursor: "pointer",
        }}
      >
        BGM {pref.bgmMuted ? "OFF" : "ON"}
      </button>
      <button
        onClick={() => set({ ...pref, sfxMuted: !pref.sfxMuted })}
        style={{
          background: "#0E1A3A",
          color: pref.sfxMuted ? "#9BA8C7" : "#FFE9A8",
          border: "2px solid #FFE9A8",
          fontFamily: "var(--font-press-start)",
          fontSize: 8,
          padding: "4px 8px",
          cursor: "pointer",
        }}
      >
        SFX {pref.sfxMuted ? "OFF" : "ON"}
      </button>
    </div>
  );
}
