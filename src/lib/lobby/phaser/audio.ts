import type Phaser from "phaser";

export const LOBBY_AUDIO = {
  snowballThrow: "/lobby/audio/snowball-throw.wav",
  snowballHit: "/lobby/audio/snowball-hit.wav",
  punchHit: "/lobby/audio/punch-hit.wav",
  footstep: "/lobby/audio/footstep.wav",
  chatPing: "/lobby/audio/chat-ping.wav",
  emoteChime: "/lobby/audio/emote-chime.wav",
  bgmLoop: "/lobby/audio/bgm-loop.ogg",
} as const;

type SfxKey =
  | "snowballThrow"
  | "snowballHit"
  | "punchHit"
  | "footstep"
  | "chatPing"
  | "emoteChime";

export class LobbyAudio {
  private bgm: HTMLAudioElement | null = null;
  private sfxMuted = false;

  constructor(private readonly scene: Phaser.Scene) {}

  preload(): void {
    (Object.entries(LOBBY_AUDIO) as Array<[keyof typeof LOBBY_AUDIO, string]>)
      .filter(([k]) => k !== "bgmLoop")
      .forEach(([k, url]) => {
        this.scene.load.audio(`sfx-${k}`, url);
      });
  }

  initBgm(): void {
    if (typeof window === "undefined") return;
    this.bgm = new Audio(LOBBY_AUDIO.bgmLoop);
    this.bgm.loop = true;
    this.bgm.volume = 0.35;
    this.bgm.addEventListener("error", () => {
      this.bgm = null;
    });
    void this.bgm.play().catch(() => {
      const start = () => {
        this.bgm?.play().catch(() => {});
        window.removeEventListener("pointerdown", start);
        window.removeEventListener("keydown", start);
      };
      window.addEventListener("pointerdown", start, { once: true });
      window.addEventListener("keydown", start, { once: true });
    });
  }

  playSfx(key: SfxKey, volume = 0.6): void {
    if (this.sfxMuted) return;
    if (!this.scene.cache.audio.exists(`sfx-${key}`)) return;
    this.scene.sound.play(`sfx-${key}`, { volume });
  }

  setSfxMuted(muted: boolean): void {
    this.sfxMuted = muted;
  }

  setBgmMuted(muted: boolean): void {
    if (this.bgm) this.bgm.muted = muted;
  }

  destroy(): void {
    this.bgm?.pause();
    this.bgm = null;
  }
}
