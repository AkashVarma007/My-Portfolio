import { describe, it, expect } from "vitest";
import {
  canPunch,
  findPunchTarget,
  PUNCH_COOLDOWN_MS,
} from "@/lib/lobby/phaser/combat";

describe("canPunch", () => {
  it("returns true when never punched", () => {
    expect(canPunch(null, 1000)).toBe(true);
  });
  it("returns false within cooldown", () => {
    expect(canPunch(1000, 1000 + PUNCH_COOLDOWN_MS - 50)).toBe(false);
  });
});

describe("findPunchTarget", () => {
  const tilePx = 16;
  const attacker = { x: 100, y: 100 };

  it("returns null when no peers", () => {
    expect(findPunchTarget(attacker, "right", tilePx, [])).toBeNull();
  });

  it("returns peer one tile to the right", () => {
    const peers = [{ sessionId: "p1", x: 116, y: 100 }];
    expect(findPunchTarget(attacker, "right", tilePx, peers)?.sessionId).toBe("p1");
  });

  it("ignores peers out of range", () => {
    const peers = [{ sessionId: "p1", x: 200, y: 100 }];
    expect(findPunchTarget(attacker, "right", tilePx, peers)).toBeNull();
  });

  it("ignores peer on wrong side", () => {
    const peers = [{ sessionId: "p1", x: 84, y: 100 }];
    expect(findPunchTarget(attacker, "right", tilePx, peers)).toBeNull();
  });

  it("returns closest when multiple in range", () => {
    const peers = [
      { sessionId: "far", x: 130, y: 100 },
      { sessionId: "close", x: 110, y: 102 },
    ];
    expect(findPunchTarget(attacker, "right", tilePx, peers)?.sessionId).toBe(
      "close"
    );
  });
});
