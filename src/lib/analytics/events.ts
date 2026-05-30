import posthog from "posthog-js";

export const Events = {
  ArcadeCurtainTriggered: "arcade_curtain_triggered",
  ArcadeGameStarted: "arcade_game_started",
  ArcadeGameScore: "arcade_game_score",
  HuntClueUnlocked: "hunt_clue_unlocked",
  HuntCompleted: "hunt_completed",
  ContactFormSubmitted: "contact_form_submitted",
  ProjectCardClicked: "project_card_clicked",
  NowLogViewed: "now_log_viewed",
  NowDecryptPressed: "now_decrypt_pressed",
  WebVital: "web_vital",
} as const;

export type GameKey = "snake" | "breakout" | "pong" | "invaders" | "secret";

export type EventPayloads = {
  arcade_curtain_triggered: { device: "desktop" | "mobile" };
  arcade_game_started: { game: GameKey };
  arcade_game_score: { game: GameKey; score: number };
  hunt_clue_unlocked: { clue_id: number; tier: number };
  hunt_completed: { total_clues: number; duration_ms: number };
  contact_form_submitted: { success: boolean };
  project_card_clicked: { project_id: string };
  now_log_viewed: { slug: string; priority: "classified" | "normal" };
  now_decrypt_pressed: { slug: string };
  web_vital: { name: "LCP" | "CLS" | "INP" | "FCP" | "TTFB"; value: number; rating: string };
};

type EventName = keyof EventPayloads;

export function track<E extends EventName>(event: E, props: EventPayloads[E]): void {
  try {
    posthog.capture(event, props as Record<string, unknown>);
  } catch {
    // PostHog not loaded yet, or blocked by adblock. Silent no-op.
  }
}
