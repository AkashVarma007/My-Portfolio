import type Phaser from "phaser";
import type { Direction } from "@/lib/lobby/realtime/types";

export type TriggerKind = "bench" | "sign" | "arcade";

export type Trigger = {
  name: string;
  kind: TriggerKind;
  x: number;
  y: number;
  width: number;
  height: number;
  data: Record<string, string>;
};

const KNOWN: TriggerKind[] = ["bench", "sign", "arcade"];
const INTERACT_RANGE_PX = 20;

type TiledObjectLike = {
  name?: string;
  type?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  properties?: Array<{ name: string; value: unknown }>;
};

export function loadTriggersFromMap(map: Phaser.Tilemaps.Tilemap): Trigger[] {
  const layer = map.getObjectLayer("triggers");
  if (!layer) return [];
  const out: Trigger[] = [];
  for (const objRaw of layer.objects) {
    const obj = objRaw as TiledObjectLike;
    const kindStr = obj.type ?? "";
    if (!KNOWN.includes(kindStr as TriggerKind)) continue;
    const data: Record<string, string> = {};
    for (const p of obj.properties ?? []) {
      data[p.name] = String(p.value);
    }
    out.push({
      name: obj.name ?? "",
      kind: kindStr as TriggerKind,
      x: obj.x ?? 0,
      y: obj.y ?? 0,
      width: obj.width ?? 16,
      height: obj.height ?? 16,
      data,
    });
  }
  return out;
}

export function findFacingTrigger(
  player: { x: number; y: number },
  facing: Direction,
  triggers: Trigger[]
): Trigger | null {
  const probeOffset = 14;
  let px = player.x;
  let py = player.y;
  switch (facing) {
    case "right":
      px += probeOffset;
      break;
    case "left":
      px -= probeOffset;
      break;
    case "down":
      py += probeOffset;
      break;
    case "up":
      py -= probeOffset;
      break;
  }
  for (const t of triggers) {
    const inX = px >= t.x - 2 && px <= t.x + t.width + 2;
    const inY = py >= t.y - 2 && py <= t.y + t.height + 2;
    if (inX && inY) return t;
  }
  let best: { t: Trigger; d: number } | null = null;
  for (const t of triggers) {
    const cx = t.x + t.width / 2;
    const cy = t.y + t.height / 2;
    const d = Math.hypot(cx - px, cy - py);
    if (d <= INTERACT_RANGE_PX && (!best || d < best.d)) best = { t, d };
  }
  return best?.t ?? null;
}
