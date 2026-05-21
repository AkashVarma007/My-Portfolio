import type { Direction } from "@/lib/lobby/realtime/types";

export const PUNCH_COOLDOWN_MS = 1000;
export const PUNCH_RANGE_TILES = 1;

export function canPunch(lastPunchAt: number | null, now: number): boolean {
  if (lastPunchAt == null) return true;
  return now - lastPunchAt >= PUNCH_COOLDOWN_MS;
}

export type Peer = { sessionId: string; x: number; y: number };

export function findPunchTarget(
  attacker: { x: number; y: number },
  facing: Direction,
  tilePx: number,
  peers: Peer[]
): Peer | null {
  const rangePx = tilePx * PUNCH_RANGE_TILES;
  const halfBand = tilePx * 0.75;
  const slack = 4;

  const eligible = peers.filter((p) => {
    const dx = p.x - attacker.x;
    const dy = p.y - attacker.y;
    switch (facing) {
      case "right":
        return dx > 0 && dx <= rangePx + slack && Math.abs(dy) <= halfBand;
      case "left":
        return dx < 0 && -dx <= rangePx + slack && Math.abs(dy) <= halfBand;
      case "down":
        return dy > 0 && dy <= rangePx + slack && Math.abs(dx) <= halfBand;
      case "up":
        return dy < 0 && -dy <= rangePx + slack && Math.abs(dx) <= halfBand;
    }
  });
  if (eligible.length === 0) return null;
  eligible.sort((a, b) => {
    const da = (a.x - attacker.x) ** 2 + (a.y - attacker.y) ** 2;
    const db = (b.x - attacker.x) ** 2 + (b.y - attacker.y) ** 2;
    return da - db;
  });
  return eligible[0];
}
