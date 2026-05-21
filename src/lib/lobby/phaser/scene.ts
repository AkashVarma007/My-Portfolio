import Phaser from "phaser";
import { LOBBY_MAPS, LOBBY_SPRITES } from "@/lib/lobby/assets";
import { LOBBY_AUDIO, LobbyAudio } from "@/lib/lobby/phaser/audio";
import {
  Snowball,
  SNOWBALL_LIFETIME_MS,
  canThrow,
  computeSpawnPosition,
} from "@/lib/lobby/phaser/snowball";
import { canPunch, findPunchTarget } from "@/lib/lobby/phaser/combat";
import { EMOTES, getEmote } from "@/lib/lobby/phaser/emotes";
import { TouchInput } from "@/lib/lobby/phaser/touch-input";
import {
  findFacingTrigger,
  loadTriggersFromMap,
  type Trigger,
} from "@/lib/lobby/phaser/interactables";
import { RemotePlayer } from "@/lib/lobby/phaser/remote-player";
import type { PresenceTracker } from "@/lib/lobby/realtime/presence";
import type { EventsClient } from "@/lib/lobby/realtime/events";
import {
  publishEmote,
  publishPunch,
  publishSnowball,
  publishSnowballHit,
} from "@/lib/lobby/realtime/events";
import type {
  Direction,
  EmoteId,
  EventPayload,
  PresencePayload,
} from "@/lib/lobby/realtime/types";

const TILE_PX = 16;
const CHAR_FRAME_WIDTH = 96;
const CHAR_FRAME_HEIGHT = 64;
const CHAR_WALK_FRAMES = 8;
const PRESENCE_PUBLISH_MS = 200;
const SPAWN_X = 248;
const SPAWN_Y = 248;
const MOVE_SPEED = 64;
const AUDIO_PREF_KEY = "lobby:audio-pref";

type AudioPref = { sfxMuted: boolean; bgmMuted: boolean };

export type SignDialogPayload = { title: string; body: string };

export type SceneInit = {
  username: string;
  variant: string;
  isGuest: boolean;
  sessionId: string;
  presence: PresenceTracker;
  events: EventsClient;
  onPeersChanged?: (peers: PresencePayload[]) => void;
  onLocalEmoteRequest?: () => void;
  onInteractSign?: (sign: SignDialogPayload) => void;
  onInteractArcade?: () => void;
  onInteractPromptChange?: (trigger: Trigger | null) => void;
};

export class LobbyScene extends Phaser.Scene {
  protected init_!: SceneInit;
  protected map?: Phaser.Tilemaps.Tilemap;
  protected player!: Phaser.Physics.Arcade.Sprite;
  protected nameLabel!: Phaser.GameObjects.Text;
  protected emoteIcon?: Phaser.GameObjects.Text;
  protected cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  protected keys!: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
    space: Phaser.Input.Keyboard.Key;
    punch: Phaser.Input.Keyboard.Key;
    emote: Phaser.Input.Keyboard.Key;
    interact: Phaser.Input.Keyboard.Key;
  };
  protected lastFacing: Direction = "down";
  protected sessionId!: string;
  protected lastPresencePublishAt = 0;
  protected lastPublishedX = Number.NaN;
  protected lastPublishedY = Number.NaN;
  protected lastPublishedFacing: Direction | null = null;
  protected lastThrowAt: number | null = null;
  protected lastPunchAt: number | null = null;
  protected localEmoteUntil = 0;
  protected emoteBlocksMovement = false;
  protected snowballs: Snowball[] = [];
  protected remotes = new Map<string, RemotePlayer>();
  protected triggers: Trigger[] = [];
  protected currentTrigger: Trigger | null = null;
  protected audio?: LobbyAudio;
  protected audioPrefHandler?: (e: Event) => void;

  constructor() {
    super({ key: "LobbyScene" });
  }

  init(data: SceneInit) {
    this.init_ = data;
    this.sessionId = data.sessionId;
  }

  preload() {
    this.load.tilemapTiledJSON("lobby", LOBBY_MAPS.lobby);
    this.load.image("lobby-tiles", LOBBY_SPRITES.tileset);
    this.load.image("snowball", LOBBY_SPRITES.snowball);
    this.load.spritesheet("sunnyside-chars", LOBBY_SPRITES.charsAtlas, {
      frameWidth: CHAR_FRAME_WIDTH,
      frameHeight: CHAR_FRAME_HEIGHT,
    });
    this.audio = new LobbyAudio(this);
    this.audio.preload();
    this.load.on("loaderror", (file: Phaser.Loader.File) => {
      console.warn("[LobbyScene] asset failed", file.key, file.src);
    });
  }

  create() {
    this.buildMap();
    this.buildPlayer();
    this.buildAnimations();
    this.buildInput();
    this.buildCamera();
    this.buildAudio();
    this.wireEvents();
    this.wirePresence();
  }

  protected buildMap() {
    const cached = this.cache.tilemap.get("lobby");
    if (cached) {
      this.map = this.make.tilemap({ key: "lobby" });
      const tileset = this.map.addTilesetImage("lobby", "lobby-tiles", TILE_PX, TILE_PX);
      if (tileset) {
        this.map.createLayer("ground", tileset, 0, 0);
        this.map.createLayer("decor", tileset, 0, 0);
        const collisionLayer = this.map.createLayer("collision", tileset, 0, 0);
        if (collisionLayer) {
          collisionLayer.setCollisionByExclusion([-1]);
          collisionLayer.setVisible(false);
        }
      }
      this.triggers = loadTriggersFromMap(this.map);
    } else {
      this.cameras.main.setBackgroundColor("#234B6E");
    }
  }

  protected buildPlayer() {
    this.player = this.physics.add.sprite(SPAWN_X, SPAWN_Y, "sunnyside-chars", 0);
    this.player.setCollideWorldBounds(true);
    // Sunnyside frame is 96x64 but visible character occupies the centered ~16x24 region.
    // Shrink physics body to a 12x12 hitbox centered roughly under the feet.
    const body = this.player.body as Phaser.Physics.Arcade.Body | null;
    if (body) {
      body.setSize(12, 12);
      body.setOffset((CHAR_FRAME_WIDTH - 12) / 2, CHAR_FRAME_HEIGHT - 16);
    }
    if (this.map) {
      const collisionLayer = this.map.getLayer("collision")?.tilemapLayer;
      if (collisionLayer) this.physics.add.collider(this.player, collisionLayer);
    }

    this.nameLabel = this.add
      .text(this.player.x, this.player.y - 14, this.init_.username, {
        fontFamily: "VT323, monospace",
        fontSize: "10px",
        color: this.init_.isGuest ? "#AAAAAA" : "#FFFFFF",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5, 1);
  }

  protected buildAnimations() {
    // Sunnyside ships single side-view walk strip (8 frames, one row).
    // All four directional anim keys share the same frames; left/right uses sprite flip.
    const dirs: Direction[] = ["down", "up", "left", "right"];
    for (const dir of dirs) {
      if (!this.anims.exists(`walk-${dir}`)) {
        this.anims.create({
          key: `walk-${dir}`,
          frames: this.anims.generateFrameNumbers("sunnyside-chars", {
            start: 0,
            end: CHAR_WALK_FRAMES - 1,
          }),
          frameRate: 10,
          repeat: -1,
        });
      }
    }
    // Punch + emote anims intentionally not created — Sunnyside ships separate strips
    // (ATTACK, CASTING, etc) not yet loaded. Verbs still fire (tint, Realtime, audio);
    // anims.play calls are guarded via anims.exists checks below.
  }

  protected buildInput() {
    const kb = this.input.keyboard!;
    this.cursors = kb.createCursorKeys();
    this.keys = {
      up: kb.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: kb.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: kb.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: kb.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      space: kb.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
      punch: kb.addKey(Phaser.Input.Keyboard.KeyCodes.F),
      emote: kb.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      interact: kb.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
    };
  }

  protected buildCamera() {
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setZoom(2);
  }

  protected buildAudio() {
    if (!this.audio) return;
    this.audio.initBgm();
    const pref = this.readAudioPref();
    this.audio.setSfxMuted(pref.sfxMuted);
    this.audio.setBgmMuted(pref.bgmMuted);
    if (typeof window !== "undefined") {
      this.audioPrefHandler = (e: Event) => {
        const detail = (e as CustomEvent<AudioPref>).detail;
        this.audio?.setSfxMuted(detail.sfxMuted);
        this.audio?.setBgmMuted(detail.bgmMuted);
      };
      window.addEventListener(AUDIO_PREF_KEY, this.audioPrefHandler);
    }
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      if (typeof window !== "undefined" && this.audioPrefHandler) {
        window.removeEventListener(AUDIO_PREF_KEY, this.audioPrefHandler);
      }
      this.audio?.destroy();
    });
  }

  protected readAudioPref(): AudioPref {
    if (typeof window === "undefined") return { sfxMuted: false, bgmMuted: false };
    try {
      const raw = window.localStorage.getItem(AUDIO_PREF_KEY);
      if (!raw) return { sfxMuted: false, bgmMuted: false };
      const parsed = JSON.parse(raw) as Partial<AudioPref>;
      return {
        sfxMuted: Boolean(parsed.sfxMuted),
        bgmMuted: Boolean(parsed.bgmMuted),
      };
    } catch {
      return { sfxMuted: false, bgmMuted: false };
    }
  }

  protected wireEvents() {
    this.init_.events.onEvent((payload) => this.handleRemoteEvent(payload));
  }

  protected wirePresence() {
    const { presence } = this.init_;
    presence.onJoin((peer) => this.addRemote(peer));
    presence.onLeave((peerId) => this.removeRemote(peerId));
    presence.onUpdate((peer) => this.updateRemote(peer));
    for (const peer of presence.peers()) this.addRemote(peer);
    this.notifyPeersChanged();
  }

  protected addRemote(peer: PresencePayload) {
    if (peer.id === this.sessionId) return;
    if (this.remotes.has(peer.id)) {
      this.updateRemote(peer);
      return;
    }
    const remote = new RemotePlayer(this, peer);
    this.remotes.set(peer.id, remote);
    this.notifyPeersChanged();
  }

  protected updateRemote(peer: PresencePayload) {
    if (peer.id === this.sessionId) return;
    const remote = this.remotes.get(peer.id);
    if (!remote) {
      this.addRemote(peer);
      return;
    }
    remote.applyPayload(peer);
  }

  protected removeRemote(peerId: string) {
    const remote = this.remotes.get(peerId);
    if (!remote) return;
    remote.destroy();
    this.remotes.delete(peerId);
    this.notifyPeersChanged();
  }

  protected notifyPeersChanged() {
    this.init_.onPeersChanged?.(this.init_.presence.peers());
  }

  protected handleRemoteEvent(payload: EventPayload) {
    if (payload.type === "snowball") {
      if (payload.from === this.sessionId) return;
      const ball = new Snowball(
        this,
        payload.x,
        payload.y,
        payload.direction,
        payload.from
      );
      this.snowballs.push(ball);
      this.physics.add.overlap(ball.sprite, this.player, () => {
        if (ball.throwerSessionId === this.sessionId) return;
        ball.destroy();
        this.audio?.playSfx("snowballHit");
        this.player.setTint(0x9bd6ff);
        this.time.delayedCall(200, () => this.player.clearTint());
        void publishSnowballHit(this.init_.events, {
          sessionId: this.sessionId,
          targetSessionId: this.sessionId,
        });
      });
      // Overlap against remote players (visual only — authoritative hit announced by victim).
      for (const remote of this.remotes.values()) {
        // Remote sprite is owned by RemotePlayer — no easy handle. Skip cross-peer overlap.
        void remote;
      }
      this.audio?.playSfx("snowballThrow", 0.4);
    } else if (payload.type === "snowball-hit") {
      const remote = this.remotes.get(payload.targetSessionId);
      if (remote) {
        remote.tintSprite(0x9bd6ff, 200);
        this.audio?.playSfx("snowballHit");
      }
    } else if (payload.type === "punch") {
      if (payload.targetSessionId === this.sessionId) {
        this.player.setTint(0xff8a8a);
        this.time.delayedCall(180, () => this.player.clearTint());
        this.audio?.playSfx("punchHit");
      } else if (payload.targetSessionId) {
        const remote = this.remotes.get(payload.targetSessionId);
        if (remote) {
          remote.tintSprite(0xff8a8a, 180);
          this.audio?.playSfx("punchHit");
        }
      }
    } else if (payload.type === "emote") {
      if (payload.from === this.sessionId) return;
      const remote = this.remotes.get(payload.from);
      if (remote) remote.playEmote(payload.emote);
    }
  }

  update(_time: number, delta: number) {
    if (this.lastFacing && this.localEmoteUntil > 0 && this.scene.systems.game.getTime() >= this.localEmoteUntil) {
      this.clearLocalEmote();
    }
    this.handleMovement();
    this.handleActions();
    this.maybePublishPresence();
    this.updateRemotes(delta);
    this.cleanupSnowballs();
    this.updateInteractPrompt();
  }

  protected handleMovement() {
    if (this.emoteBlocksMovement && this.localEmoteUntil > 0) {
      this.player.setVelocity(0, 0);
      return;
    }
    const touch = TouchInput.read();
    const leftDown = this.cursors.left?.isDown || this.keys.left.isDown || touch.dx === -1;
    const rightDown = this.cursors.right?.isDown || this.keys.right.isDown || touch.dx === 1;
    const upDown = this.cursors.up?.isDown || this.keys.up.isDown || touch.dy === -1;
    const downDown = this.cursors.down?.isDown || this.keys.down.isDown || touch.dy === 1;

    let vx = 0;
    let vy = 0;
    if (leftDown) {
      vx = -MOVE_SPEED;
      this.lastFacing = "left";
    } else if (rightDown) {
      vx = MOVE_SPEED;
      this.lastFacing = "right";
    }
    if (upDown) {
      vy = -MOVE_SPEED;
      this.lastFacing = "up";
    } else if (downDown) {
      vy = MOVE_SPEED;
      this.lastFacing = "down";
    }
    this.player.setVelocity(vx, vy);

    if (this.lastFacing === "left") this.player.setFlipX(true);
    else if (this.lastFacing === "right") this.player.setFlipX(false);

    const moving = vx !== 0 || vy !== 0;
    if (moving && this.localEmoteUntil === 0) {
      this.player.anims.play(`walk-${this.lastFacing}`, true);
    } else if (this.localEmoteUntil === 0) {
      this.player.anims.stop();
    }

    this.nameLabel.setPosition(this.player.x, this.player.y - 14);
    if (this.emoteIcon) this.emoteIcon.setPosition(this.player.x, this.player.y - 28);
  }

  protected handleActions() {
    const touch = TouchInput.read();
    const now = this.scene.systems.game.getTime();

    if (Phaser.Input.Keyboard.JustDown(this.keys.space) || touch.throwQueued) {
      this.tryThrowSnowball(now);
    }
    if (Phaser.Input.Keyboard.JustDown(this.keys.punch) || touch.punchQueued) {
      this.tryPunch(now);
    }
    if (Phaser.Input.Keyboard.JustDown(this.keys.emote) || touch.emoteQueued) {
      this.init_.onLocalEmoteRequest?.();
    }
    if (Phaser.Input.Keyboard.JustDown(this.keys.interact) || touch.interactQueued) {
      this.tryInteract();
    }
    TouchInput.consumeActions();
  }

  protected tryThrowSnowball(now: number) {
    if (!canThrow(this.lastThrowAt, now)) return;
    const spawn = computeSpawnPosition(
      { x: this.player.x, y: this.player.y },
      this.lastFacing,
      TILE_PX
    );
    const ball = new Snowball(this, spawn.x, spawn.y, this.lastFacing, this.sessionId);
    this.snowballs.push(ball);
    this.lastThrowAt = now;
    this.audio?.playSfx("snowballThrow");

    for (const remote of this.remotes.values()) {
      const remoteSprite = (remote as unknown as { sprite: Phaser.Physics.Arcade.Sprite })
        .sprite;
      if (!remoteSprite) continue;
      this.physics.add.overlap(ball.sprite, remoteSprite, () => {
        ball.destroy();
        remote.tintSprite(0x9bd6ff, 200);
        void publishSnowballHit(this.init_.events, {
          sessionId: this.sessionId,
          targetSessionId: remote.id,
        });
      });
    }

    void publishSnowball(this.init_.events, {
      sessionId: this.sessionId,
      fromName: this.init_.username,
      x: spawn.x,
      y: spawn.y,
      direction: this.lastFacing,
    });
  }

  protected tryPunch(now: number) {
    if (!canPunch(this.lastPunchAt, now)) return;
    this.lastPunchAt = now;
    if (this.anims.exists(`punch-${this.lastFacing}`)) {
      this.player.anims.play(`punch-${this.lastFacing}`, true);
    }
    const peers = Array.from(this.remotes.values()).map((r) => ({
      sessionId: r.id,
      x: r.x,
      y: r.y,
    }));
    const target = findPunchTarget(
      { x: this.player.x, y: this.player.y },
      this.lastFacing,
      TILE_PX,
      peers
    );
    if (target) {
      const remote = this.remotes.get(target.sessionId);
      remote?.tintSprite(0xff8a8a, 180);
      this.audio?.playSfx("punchHit");
    }
    void publishPunch(this.init_.events, {
      sessionId: this.sessionId,
      targetSessionId: target?.sessionId ?? null,
    });
  }

  playLocalEmote(emote: EmoteId) {
    const meta = getEmote(emote);
    this.localEmoteUntil = this.scene.systems.game.getTime() + meta.durationMs;
    this.emoteBlocksMovement = meta.blocksMovement;
    if (this.anims.exists(`emote-${emote}`)) {
      this.player.anims.play(`emote-${emote}`, true);
    }
    this.showEmoteGlyph(meta.glyph, meta.durationMs);
    this.audio?.playSfx("emoteChime", 0.4);
    void publishEmote(this.init_.events, { sessionId: this.sessionId, emote });
  }

  protected showEmoteGlyph(glyph: string, durationMs: number) {
    this.emoteIcon?.destroy();
    this.emoteIcon = this.add
      .text(this.player.x, this.player.y - 28, glyph, { fontSize: "14px" })
      .setOrigin(0.5, 1);
    this.time.delayedCall(durationMs, () => {
      this.emoteIcon?.destroy();
      this.emoteIcon = undefined;
    });
  }

  protected clearLocalEmote() {
    this.localEmoteUntil = 0;
    this.emoteBlocksMovement = false;
    this.player.anims.stop();
  }

  protected tryInteract() {
    const trigger = findFacingTrigger(
      { x: this.player.x, y: this.player.y },
      this.lastFacing,
      this.triggers
    );
    if (!trigger) return;
    if (trigger.kind === "bench") {
      this.playLocalEmote("sit");
    } else if (trigger.kind === "sign") {
      this.init_.onInteractSign?.({
        title: trigger.data.title ?? trigger.name ?? "Sign",
        body: trigger.data.body ?? "",
      });
    } else if (trigger.kind === "arcade") {
      this.init_.onInteractArcade?.();
    }
  }

  protected updateInteractPrompt() {
    const trigger = findFacingTrigger(
      { x: this.player.x, y: this.player.y },
      this.lastFacing,
      this.triggers
    );
    if (trigger !== this.currentTrigger) {
      this.currentTrigger = trigger;
      this.init_.onInteractPromptChange?.(trigger);
    }
  }

  protected maybePublishPresence() {
    const now = Date.now();
    if (now - this.lastPresencePublishAt < PRESENCE_PUBLISH_MS) return;
    const x = Math.round(this.player.x);
    const y = Math.round(this.player.y);
    if (
      x === this.lastPublishedX &&
      y === this.lastPublishedY &&
      this.lastFacing === this.lastPublishedFacing
    ) {
      return;
    }
    this.lastPresencePublishAt = now;
    this.lastPublishedX = x;
    this.lastPublishedY = y;
    this.lastPublishedFacing = this.lastFacing;
    this.init_.presence.publish({
      x,
      y,
      facing: this.lastFacing,
    });
  }

  protected updateRemotes(delta: number) {
    for (const remote of this.remotes.values()) remote.update(delta);
  }

  protected cleanupSnowballs() {
    const now = this.scene.systems.game.getTime();
    this.snowballs = this.snowballs.filter((s) => {
      if (s.isExpired(now)) {
        s.destroy();
        return false;
      }
      return true;
    });
    // safety: prune destroyed sprites
    this.snowballs = this.snowballs.filter((s) => s.sprite.active);
    // SNOWBALL_LIFETIME_MS imported to keep symbol referenced
    void SNOWBALL_LIFETIME_MS;
  }

  get id(): string {
    return this.sessionId;
  }
}

// Re-export so callers can build the emote list without importing emotes module.
export const SCENE_EMOTES = EMOTES;
export const SCENE_AUDIO = LOBBY_AUDIO;
