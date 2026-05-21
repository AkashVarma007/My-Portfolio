import Phaser from "phaser";
import type { Direction } from "@/lib/lobby/realtime/types";

export const SNOWBALL_COOLDOWN_MS = 1000;
export const SNOWBALL_SPEED_PX_PER_SEC = 128;
export const SNOWBALL_MAX_TRAVEL_PX = 96;
export const SNOWBALL_LIFETIME_MS =
  (SNOWBALL_MAX_TRAVEL_PX / SNOWBALL_SPEED_PX_PER_SEC) * 1000;

export function canThrow(lastThrownAt: number | null, now: number): boolean {
  if (lastThrownAt == null) return true;
  return now - lastThrownAt >= SNOWBALL_COOLDOWN_MS;
}

export function computeSpawnPosition(
  origin: { x: number; y: number },
  facing: Direction,
  tilePx: number
): { x: number; y: number } {
  switch (facing) {
    case "up":
      return { x: origin.x, y: origin.y - tilePx };
    case "down":
      return { x: origin.x, y: origin.y + tilePx };
    case "left":
      return { x: origin.x - tilePx, y: origin.y };
    case "right":
      return { x: origin.x + tilePx, y: origin.y };
  }
}

function velocityFor(direction: Direction): { vx: number; vy: number } {
  switch (direction) {
    case "up":
      return { vx: 0, vy: -SNOWBALL_SPEED_PX_PER_SEC };
    case "down":
      return { vx: 0, vy: SNOWBALL_SPEED_PX_PER_SEC };
    case "left":
      return { vx: -SNOWBALL_SPEED_PX_PER_SEC, vy: 0 };
    case "right":
      return { vx: SNOWBALL_SPEED_PX_PER_SEC, vy: 0 };
  }
}

export class Snowball {
  readonly sprite: Phaser.Physics.Arcade.Sprite;
  private readonly spawnedAt: number;
  readonly throwerSessionId: string;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    direction: Direction,
    throwerSessionId: string
  ) {
    this.throwerSessionId = throwerSessionId;
    this.sprite = scene.physics.add.sprite(x, y, "snowball");
    this.sprite.setData("throwerSessionId", throwerSessionId);
    const { vx, vy } = velocityFor(direction);
    this.sprite.setVelocity(vx, vy);
    this.spawnedAt = scene.time.now;
    scene.time.delayedCall(SNOWBALL_LIFETIME_MS, () => this.destroy());
  }

  isExpired(now: number): boolean {
    return now - this.spawnedAt >= SNOWBALL_LIFETIME_MS;
  }

  destroy(): void {
    if (this.sprite.active) this.sprite.destroy();
  }
}
