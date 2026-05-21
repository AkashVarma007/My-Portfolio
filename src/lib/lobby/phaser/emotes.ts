import type { EmoteId } from "@/lib/lobby/realtime/types";

export type EmoteMeta = {
  label: string;
  glyph: string;
  durationMs: number;
  blocksMovement: boolean;
  loops: boolean;
};

export const EMOTES: Record<EmoteId, EmoteMeta> = {
  wave: { label: "Wave", glyph: "👋", durationMs: 1500, blocksMovement: false, loops: false },
  sit: { label: "Sit", glyph: "💤", durationMs: 60_000, blocksMovement: true, loops: true },
  dance: { label: "Dance", glyph: "💃", durationMs: 60_000, blocksMovement: false, loops: true },
  point: { label: "Point", glyph: "👉", durationMs: 1500, blocksMovement: false, loops: false },
  laugh: { label: "Laugh", glyph: "😂", durationMs: 1500, blocksMovement: false, loops: false },
  heart: { label: "Heart", glyph: "❤️", durationMs: 2000, blocksMovement: false, loops: false },
};

const EMOTE_IDS = new Set(Object.keys(EMOTES));

export function isEmoteId(value: string): value is EmoteId {
  return EMOTE_IDS.has(value);
}

export function getEmote(id: EmoteId): EmoteMeta {
  return EMOTES[id];
}
