"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { useHunt } from "@/context/HuntContext";

// ─── Constants ───────────────────────────────────────────────────────────────

const W = 500;
const H = 500;
const PLAYER_SPEED = 5;
const PLAYER_BULLET_SPEED = 8;
const ENEMY_BULLET_SPEED = 3;
const INV_W = 32;
const INV_H = 22;
const INV_PAD_X = 12;
const INV_PAD_Y = 10;
const INV_COLORS = ["#ff2d55", "#ff6b2d", "#ffaa00"];

// ─── Types ────────────────────────────────────────────────────────────────────

interface Player {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Invader {
  x: number;
  y: number;
  alive: boolean;
  row: number;
  col: number;
}

interface Bullet {
  x: number;
  y: number;
  active: boolean;
}

interface GameState {
  phase: "idle" | "playing" | "dead" | "wave_clear";
  player: Player;
  invaders: Invader[][];
  playerBullets: Bullet[];
  enemyBullets: Bullet[];
  score: number;
  wave: number;
  moveDir: 1 | -1;
  moveTimer: number;
  moveInterval: number;
  shootTimer: number;
  shootInterval: number;
  keys: Set<string>;
  spaceHeld: boolean;
  playerShootCooldown: number;
  clue12Unlocked: boolean;
  clue12ToastUntil: number;
}

function buildInvaders(wave: number): Invader[][] {
  const rows = Math.min(3 + Math.floor(wave / 3), 4);
  const cols = Math.min(7 + Math.floor(wave / 2), 10);
  const totalW = cols * (INV_W + INV_PAD_X) - INV_PAD_X;
  const startX = (W - totalW) / 2;
  const startY = 60;
  const grid: Invader[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: Invader[] = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        x: startX + c * (INV_W + INV_PAD_X),
        y: startY + r * (INV_H + INV_PAD_Y),
        alive: true,
        row: r,
        col: c,
      });
    }
    grid.push(row);
  }
  return grid;
}

function makeInitialState(wave: number): GameState {
  return {
    phase: "playing",
    player: { x: W / 2 - 15, y: H - 50, w: 30, h: 24 },
    invaders: buildInvaders(wave),
    playerBullets: [],
    enemyBullets: [],
    score: 0,
    wave,
    moveDir: 1,
    moveTimer: 0,
    moveInterval: Math.max(28 - wave * 1.5, 10),
    shootTimer: 0,
    shootInterval: Math.max(120 - wave * 6, 45),
    keys: new Set(),
    spaceHeld: false,
    playerShootCooldown: 0,
    clue12Unlocked: false,
    clue12ToastUntil: 0,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function InvadersGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState | null>(null);
  const rafRef = useRef<number>(0);
  const { updateGameScore, unlockClue, canAttemptClue } = useHunt();

  const [displayScore, setDisplayScore] = useState(0);
  const [displayWave, setDisplayWave] = useState(1);
  const [phase, setPhase] = useState<"idle" | "playing" | "dead" | "wave_clear">("idle");

  // ── Input handlers ──────────────────────────────────────────────────────────
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const s = stateRef.current;
    if (!s) return;
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(e.key)) {
      e.preventDefault();
    }
    s.keys.add(e.key);
    if (e.key === " ") {
      if (s.phase === "idle" || s.phase === "dead" || s.phase === "wave_clear") {
        if (s.phase === "idle" || s.phase === "dead") {
          const fresh = makeInitialState(1);
          stateRef.current = fresh;
          setPhase("playing");
          setDisplayScore(0);
          setDisplayWave(1);
        } else if (s.phase === "wave_clear") {
          const nextWave = s.wave + 1;
          const ns = makeInitialState(nextWave);
          ns.score = s.score;
          ns.clue12Unlocked = s.clue12Unlocked;
          stateRef.current = ns;
          setPhase("playing");
          setDisplayWave(nextWave);
        }
      }
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const s = stateRef.current;
    if (!s) return;
    s.keys.delete(e.key);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // ── Game loop ───────────────────────────────────────────────────────────────
  const tick = useCallback(() => {
    const s = stateRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ── Update ──────────────────────────────────────────────────────────────
    if (s && s.phase === "playing") {
      // Player movement
      if (s.keys.has("ArrowLeft")) s.player.x = Math.max(0, s.player.x - PLAYER_SPEED);
      if (s.keys.has("ArrowRight")) s.player.x = Math.min(W - s.player.w, s.player.x + PLAYER_SPEED);

      // Player shooting
      if (s.playerShootCooldown > 0) s.playerShootCooldown--;
      if (s.keys.has(" ") && s.playerShootCooldown === 0) {
        s.playerBullets.push({
          x: s.player.x + s.player.w / 2,
          y: s.player.y,
          active: true,
        });
        s.playerShootCooldown = 15;
      }

      // Move player bullets
      for (const b of s.playerBullets) {
        if (b.active) b.y -= PLAYER_BULLET_SPEED;
        if (b.y < 0) b.active = false;
      }
      s.playerBullets = s.playerBullets.filter((b) => b.active);

      // Move invaders
      s.moveTimer++;
      if (s.moveTimer >= s.moveInterval) {
        s.moveTimer = 0;
        let hitEdge = false;
        for (const row of s.invaders) {
          for (const inv of row) {
            if (!inv.alive) continue;
            inv.x += s.moveDir * 10;
            if (inv.x <= 0 || inv.x + INV_W >= W) hitEdge = true;
          }
        }
        if (hitEdge) {
          s.moveDir = (s.moveDir === 1 ? -1 : 1) as 1 | -1;
          for (const row of s.invaders) {
            for (const inv of row) {
              if (inv.alive) inv.y += 16;
            }
          }
        }
      }

      // Check invader reached bottom or hits player
      for (const row of s.invaders) {
        for (const inv of row) {
          if (inv.alive && inv.y + INV_H >= H - 20) {
            s.phase = "dead";
            setPhase("dead");
          }
        }
      }

      // Enemy shooting
      s.shootTimer++;
      if (s.shootTimer >= s.shootInterval) {
        s.shootTimer = 0;
        const alive: Invader[] = [];
        for (const row of s.invaders) {
          for (const inv of row) {
            if (inv.alive) alive.push(inv);
          }
        }
        if (alive.length > 0) {
          const shooter = alive[Math.floor(Math.random() * alive.length)];
          s.enemyBullets.push({
            x: shooter.x + INV_W / 2,
            y: shooter.y + INV_H,
            active: true,
          });
        }
      }

      // Move enemy bullets
      for (const b of s.enemyBullets) {
        if (b.active) b.y += ENEMY_BULLET_SPEED;
        if (b.y > H) b.active = false;
      }
      s.enemyBullets = s.enemyBullets.filter((b) => b.active);

      // Collision: player bullets vs invaders
      for (const pb of s.playerBullets) {
        if (!pb.active) continue;
        for (const row of s.invaders) {
          for (const inv of row) {
            if (!inv.alive) continue;
            if (
              pb.x >= inv.x &&
              pb.x <= inv.x + INV_W &&
              pb.y >= inv.y &&
              pb.y <= inv.y + INV_H
            ) {
              inv.alive = false;
              pb.active = false;
              s.score += 100;
              setDisplayScore(s.score);
              updateGameScore("invaders", s.score);
            }
          }
        }
      }
      s.playerBullets = s.playerBullets.filter((b) => b.active);

      // Collision: enemy bullets vs player
      for (const eb of s.enemyBullets) {
        if (!eb.active) continue;
        const px = s.player.x;
        const py = s.player.y;
        const pw = s.player.w;
        const ph = s.player.h;
        if (eb.x >= px && eb.x <= px + pw && eb.y >= py && eb.y <= py + ph) {
          s.phase = "dead";
          setPhase("dead");
          break;
        }
      }

      // Check wave clear
      const anyAlive = s.invaders.some((row) => row.some((inv) => inv.alive));
      if (!anyAlive) {
        s.phase = "wave_clear";
        setPhase("wave_clear");

        // Clue 12 trigger at wave 10
        if (s.wave >= 10 && !s.clue12Unlocked && canAttemptClue(12)) {
          const unlocked = unlockClue(12);
          if (unlocked) {
            s.clue12Unlocked = true;
            s.clue12ToastUntil = performance.now() + 2500;
          }
        }
      }
    }

    // ── Draw ────────────────────────────────────────────────────────────────
    ctx.fillStyle = "#0a0a12";
    ctx.fillRect(0, 0, W, H);

    if (!s || s.phase === "idle") {
      // Start screen
      ctx.save();
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#ff2d55";
      ctx.fillStyle = "#ff2d55";
      ctx.font = "bold 36px 'Orbitron', monospace";
      ctx.textAlign = "center";
      ctx.fillText("SPACE INVADERS", W / 2, H / 2 - 60);
      ctx.restore();

      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.font = "16px 'Rajdhani', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Arrow keys to move · Space to shoot", W / 2, H / 2 - 10);
      ctx.fillText("Survive 10 waves to unlock a clue", W / 2, H / 2 + 18);

      ctx.fillStyle = "#00ffaa";
      ctx.font = "bold 20px 'Orbitron', monospace";
      ctx.fillText("PRESS SPACE TO START", W / 2, H / 2 + 70);
      return;
    }

    if (s.phase === "dead") {
      ctx.save();
      ctx.shadowBlur = 24;
      ctx.shadowColor = "#ff2d55";
      ctx.fillStyle = "#ff2d55";
      ctx.font = "bold 40px 'Orbitron', monospace";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", W / 2, H / 2 - 50);
      ctx.restore();

      ctx.fillStyle = "#ffaa00";
      ctx.font = "22px 'Orbitron', monospace";
      ctx.textAlign = "center";
      ctx.fillText(`SCORE: ${s.score}`, W / 2, H / 2 + 10);

      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.font = "16px 'Rajdhani', sans-serif";
      ctx.fillText("PRESS SPACE TO PLAY AGAIN", W / 2, H / 2 + 60);
      return;
    }

    if (s.phase === "wave_clear") {
      ctx.save();
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#00ffaa";
      ctx.fillStyle = "#00ffaa";
      ctx.font = "bold 32px 'Orbitron', monospace";
      ctx.textAlign = "center";
      ctx.fillText(`WAVE ${s.wave} CLEAR!`, W / 2, H / 2 - 40);
      ctx.restore();

      ctx.fillStyle = "#ffaa00";
      ctx.font = "20px 'Orbitron', monospace";
      ctx.textAlign = "center";
      ctx.fillText(`SCORE: ${s.score}`, W / 2, H / 2 + 10);

      if (s.clue12ToastUntil && performance.now() < s.clue12ToastUntil) {
        ctx.save();
        ctx.shadowBlur = 18;
        ctx.shadowColor = "#00ffaa";
        ctx.fillStyle = "#00ffaa";
        ctx.font = "bold 18px 'Orbitron', monospace";
        ctx.textAlign = "center";
        ctx.fillText("CLUE 12 UNLOCKED", W / 2, H / 2 + 34);
        ctx.restore();
      }

      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.font = "16px 'Rajdhani', sans-serif";
      ctx.fillText("PRESS SPACE FOR NEXT WAVE", W / 2, H / 2 + 55);
      return;
    }

    // Clue unlock confirmation
    if (s.clue12ToastUntil && performance.now() < s.clue12ToastUntil) {
      ctx.save();
      ctx.shadowBlur = 18;
      ctx.shadowColor = "#00ffaa";
      ctx.fillStyle = "#00ffaa";
      ctx.font = "bold 18px 'Orbitron', monospace";
      ctx.textAlign = "center";
      ctx.fillText("CLUE 12 UNLOCKED", W / 2, 32);
      ctx.restore();
    }

    // ── Draw playing state ──────────────────────────────────────────────────

    // Draw invaders
    for (const row of s.invaders) {
      for (const inv of row) {
        if (!inv.alive) continue;
        const color = INV_COLORS[Math.min(inv.row, INV_COLORS.length - 1)];
        ctx.save();
        ctx.shadowBlur = 8;
        ctx.shadowColor = color;
        ctx.fillStyle = color;
        // Body
        ctx.fillRect(inv.x + 4, inv.y + 6, INV_W - 8, INV_H - 10);
        // Head
        ctx.fillRect(inv.x + 8, inv.y + 2, INV_W - 16, 6);
        // Eyes
        ctx.fillStyle = "#0a0a12";
        ctx.fillRect(inv.x + 8, inv.y + 8, 5, 5);
        ctx.fillRect(inv.x + INV_W - 13, inv.y + 8, 5, 5);
        // Legs
        ctx.fillStyle = color;
        ctx.fillRect(inv.x + 4, inv.y + INV_H - 4, 5, 4);
        ctx.fillRect(inv.x + INV_W - 9, inv.y + INV_H - 4, 5, 4);
        ctx.restore();
      }
    }

    // Draw player bullets
    for (const b of s.playerBullets) {
      ctx.save();
      ctx.shadowBlur = 12;
      ctx.shadowColor = "#00ffaa";
      ctx.fillStyle = "#00ffaa";
      ctx.fillRect(b.x - 2, b.y, 4, 12);
      ctx.restore();
    }

    // Draw enemy bullets
    for (const b of s.enemyBullets) {
      ctx.save();
      ctx.shadowBlur = 12;
      ctx.shadowColor = "#ff2d55";
      ctx.fillStyle = "#ff2d55";
      ctx.fillRect(b.x - 2, b.y, 4, 10);
      ctx.restore();
    }

    // Draw player (triangle ship)
    const px = s.player.x;
    const py = s.player.y;
    const pw = s.player.w;
    const ph = s.player.h;
    ctx.save();
    ctx.shadowBlur = 16;
    ctx.shadowColor = "#00ffaa";
    ctx.fillStyle = "#00ffaa";
    ctx.beginPath();
    ctx.moveTo(px + pw / 2, py);
    ctx.lineTo(px, py + ph);
    ctx.lineTo(px + pw, py + ph);
    ctx.closePath();
    ctx.fill();
    // Cockpit glow
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(px + pw / 2, py + ph * 0.55, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Scanline overlay
    ctx.fillStyle = "rgba(0,0,0,0.04)";
    for (let y = 0; y < H; y += 4) {
      ctx.fillRect(0, y, W, 2);
    }
  }, [updateGameScore, unlockClue, canAttemptClue]);

  // ── RAF loop ────────────────────────────────────────────────────────────────
  useEffect(() => {
    // Initialise idle state with a valid keys Set so keydown handlers don't crash
    if (!stateRef.current) {
      stateRef.current = { phase: "idle", keys: new Set() } as GameState;
    }

    let running = true;
    const loop = () => {
      if (!running) return;
      tick();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [tick]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        userSelect: "none",
        background: "#0a0a12",
      }}
    >
      {/* HUD */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "6px 24px",
          fontFamily: "'Orbitron', monospace",
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: 2,
          color: "rgba(255,255,255,0.85)",
          flexShrink: 0,
        }}
      >
        <span style={{ color: "#ff6b2d" }}>
          SCORE: <span style={{ color: "#ffffff" }}>{displayScore}</span>
        </span>
        <span style={{ color: "#ff2d55" }}>
          WAVE: <span style={{ color: "#ffffff" }}>{displayWave}</span>
        </span>
      </div>

      {/* Canvas — fills remaining space */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          style={{
            display: "block",
            maxWidth: "100%",
            maxHeight: "100%",
            width: "auto",
            height: "100%",
            objectFit: "contain",
            imageRendering: "pixelated",
          }}
        />
      </div>
    </div>
  );
}
