import { describe, it, expect } from "vitest";
import { EMOTES, isEmoteId, getEmote } from "@/lib/lobby/phaser/emotes";

describe("emote registry", () => {
  it("exposes exactly the six emotes from the spec", () => {
    expect(Object.keys(EMOTES).sort()).toEqual(
      ["dance", "heart", "laugh", "point", "sit", "wave"].sort()
    );
  });

  it("isEmoteId narrows correctly", () => {
    expect(isEmoteId("wave")).toBe(true);
    expect(isEmoteId("nope")).toBe(false);
  });

  it("getEmote returns metadata", () => {
    const e = getEmote("dance");
    expect(e.label).toBeTruthy();
    expect(e.glyph).toBeTruthy();
    expect(e.durationMs).toBeGreaterThan(0);
  });
});
