import { describe, it, expect } from "vitest";
import {
  canThrow,
  computeSpawnPosition,
  SNOWBALL_COOLDOWN_MS,
} from "@/lib/lobby/phaser/snowball";

describe("canThrow", () => {
  it("returns true when never thrown", () => {
    expect(canThrow(null, 1000)).toBe(true);
  });
  it("returns false within cooldown window", () => {
    expect(canThrow(1000, 1000 + SNOWBALL_COOLDOWN_MS - 50)).toBe(false);
  });
  it("returns true after cooldown elapsed", () => {
    expect(canThrow(1000, 1000 + SNOWBALL_COOLDOWN_MS + 1)).toBe(true);
  });
});

describe("computeSpawnPosition", () => {
  it("spawns one tile ahead of the player based on facing", () => {
    expect(computeSpawnPosition({ x: 100, y: 100 }, "right", 16)).toEqual({
      x: 116,
      y: 100,
    });
    expect(computeSpawnPosition({ x: 100, y: 100 }, "left", 16)).toEqual({
      x: 84,
      y: 100,
    });
    expect(computeSpawnPosition({ x: 100, y: 100 }, "up", 16)).toEqual({
      x: 100,
      y: 84,
    });
    expect(computeSpawnPosition({ x: 100, y: 100 }, "down", 16)).toEqual({
      x: 100,
      y: 116,
    });
  });
});
