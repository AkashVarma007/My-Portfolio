import Phaser from "phaser";
import type { Direction, EmoteId, PresencePayload } from "@/lib/lobby/realtime/types";

export class RemotePlayer {
  private sprite: Phaser.Physics.Arcade.Sprite;
  private label: Phaser.GameObjects.Text;
  private targetX: number;
  private targetY: number;
  private lastFacing: Direction = "down";
  private payload: PresencePayload;

  constructor(scene: Phaser.Scene, payload: PresencePayload) {
    this.payload = payload;
    this.sprite = scene.physics.add.sprite(payload.x, payload.y, "sunnyside-chars", 0);
    this.sprite.setImmovable(true);
    this.targetX = payload.x;
    this.targetY = payload.y;
    this.label = scene.add
      .text(payload.x, payload.y - 14, payload.name, {
        fontFamily: "VT323, monospace",
        fontSize: "10px",
        color: payload.isGuest ? "#AAAAAA" : "#FFFFFF",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5, 1);
  }

  get id(): string {
    return this.payload.id;
  }

  get x(): number {
    return this.sprite.x;
  }

  get y(): number {
    return this.sprite.y;
  }

  update(dt: number): void {
    const lerp = Math.min(1, dt / 80);
    const x = Phaser.Math.Linear(this.sprite.x, this.targetX, lerp);
    const y = Phaser.Math.Linear(this.sprite.y, this.targetY, lerp);
    this.sprite.setPosition(x, y);
    this.label.setPosition(x, y - 14);
    if (this.lastFacing === "left") this.sprite.setFlipX(true);
    else if (this.lastFacing === "right") this.sprite.setFlipX(false);
    const moving =
      Math.abs(x - this.targetX) > 0.5 || Math.abs(y - this.targetY) > 0.5;
    if (moving) {
      this.sprite.anims.play(`walk-${this.lastFacing}`, true);
    } else {
      this.sprite.anims.stop();
    }
  }

  applyPayload(p: PresencePayload): void {
    this.payload = p;
    this.targetX = p.x;
    this.targetY = p.y;
    this.lastFacing = p.facing;
  }

  tintSprite(color: number, durationMs: number): void {
    this.sprite.setTint(color);
    setTimeout(() => this.sprite.clearTint(), durationMs);
  }

  playEmote(emote: EmoteId): void {
    const key = `emote-${emote}`;
    if (this.sprite.anims.animationManager.exists(key)) {
      this.sprite.anims.play(key, true);
    }
  }

  destroy(): void {
    this.sprite.destroy();
    this.label.destroy();
  }
}
