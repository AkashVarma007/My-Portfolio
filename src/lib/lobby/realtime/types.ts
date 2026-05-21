export type Direction = "up" | "down" | "left" | "right";

export type EmoteId = "wave" | "sit" | "dance" | "point" | "laugh" | "heart";

export type PresencePayload = {
  id: string;
  name: string;
  variant: string;
  isGuest: boolean;
  x: number;
  y: number;
  facing: Direction;
  joinedAt: number;
};

export type ChatPayload = {
  from: string;
  isGuest: boolean;
  text: string;
  timestamp: number;
};

export type EventPayload =
  | {
      type: "snowball";
      from: string;
      fromName: string;
      x: number;
      y: number;
      direction: Direction;
      thrownAt: number;
    }
  | { type: "snowball-hit"; from: string; targetSessionId: string }
  | { type: "punch"; from: string; targetSessionId: string | null }
  | { type: "emote"; from: string; emote: EmoteId };
