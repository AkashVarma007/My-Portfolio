import type Phaser from "phaser";

export function buildGameConfig(
  parent: HTMLElement,
  Scene: new () => Phaser.Scene
): Phaser.Types.Core.GameConfig {
  return {
    type: 0, // Phaser.AUTO — referenced as 0 to avoid importing Phaser at module top-level
    parent,
    backgroundColor: "#0E1A3A",
    pixelArt: true,
    scale: {
      mode: 3, // Phaser.Scale.FIT
      autoCenter: 1, // Phaser.Scale.CENTER_BOTH
      width: 960,
      height: 640,
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
    scene: Scene,
  };
}
