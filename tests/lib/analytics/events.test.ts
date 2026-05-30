import { describe, it, expect, vi, beforeEach } from "vitest";
import { Events, track } from "@/lib/analytics/events";

const captureMock = vi.fn();

vi.mock("posthog-js", () => ({
  default: { capture: (...args: unknown[]) => captureMock(...args) },
}));

describe("Events catalog", () => {
  it("exposes stable event name constants", () => {
    expect(Events.ArcadeGameStarted).toBe("arcade_game_started");
    expect(Events.HuntClueUnlocked).toBe("hunt_clue_unlocked");
    expect(Events.WebVital).toBe("web_vital");
  });
});

describe("track()", () => {
  beforeEach(() => captureMock.mockReset());

  it("forwards event + props to posthog.capture", () => {
    track(Events.ArcadeGameStarted, { game: "snake" });
    expect(captureMock).toHaveBeenCalledWith("arcade_game_started", { game: "snake" });
  });

  it("is a no-op when posthog is not loaded (no throw)", () => {
    captureMock.mockImplementationOnce(() => {
      throw new Error("not loaded");
    });
    expect(() => track(Events.HuntCompleted, { total_clues: 15, duration_ms: 1 })).not.toThrow();
  });
});
