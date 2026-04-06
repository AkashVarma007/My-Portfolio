"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { useHunt } from "@/context/HuntContext";

// ─── Constants ────────────────────────────────────────────────────────────────

const W = 500;
const H = 500;
const PADDLE_W = 80;
const PADDLE_H = 12;
const PADDLE_Y = H - 40;
const PADDLE_SPEED = 5;
const BALL_RADIUS = 6;
const BRICK_ROWS = 6;
const BRICK_COLS = 10;
const BRICK_W = 46;
const BRICK_H = 16;
const BRICK_PAD = 3;
const BRICK_OFFSET_X =
  (W - (BRICK_COLS * BRICK_W + (BRICK_COLS - 1) * BRICK_PAD)) / 2;
const BRICK_OFFSET_Y = 50;
const BRICK_COLORS = [
  "#ff2d55",
  "#ff4d3d",
  "#ff6b2d",
  "#ff8c1a",
  "#ffaa00",
  "#ffc800",
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface Brick {
  x: number;
  y: number;
  alive: boolean;
  color: string;
}

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface GameState {
  phase: "idle" | "playing" | "dead" | "win";
  paddleX: number;
  ball: Ball;
  bricks: Brick[][];
  score: number;
  keys: Set<string>;
  clue10Unlocked: boolean;
}

function buildBricks(): Brick[][] {
  const grid: Brick[][] = [];
  for (let r = 0; r < BRICK_ROWS; r++) {
    const row: Brick[] = [];
    for (let c = 0; c < BRICK_COLS; c++) {
      const x = BRICK_OFFSET_X + c * (BRICK_W + BRICK_PAD);
      const y = BRICK_OFFSET_Y + r * (BRICK_H + BRICK_PAD);
      row.push({ x, y, alive: true, color: BRICK_COLORS[r] });
    }
    grid.push(row);
  }
  return grid;
}

function makeBall(): Ball {
  const angle = (Math.random() * 60 + 60) * (Math.PI / 180); // 60°–120° upward
  const speed = 4;
  return {
    x: W / 2,
    y: PADDLE_Y - BALL_RADIUS - 2,
    vx: Math.cos(angle) * speed * (Math.random() < 0.5 ? 1 : -1),
    vy: -Math.abs(Math.sin(angle) * speed),
  };
}

function makeInitialState(): GameState {
  return {
    phase: "playing",
    paddleX: W / 2 - PADDLE_W / 2,
    ball: makeBall(),
    bricks: buildBricks(),
    score: 0,
    keys: new Set(),
    clue10Unlocked: false,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function BreakoutGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState | null>(null);
  const rafRef = useRef<number>(0);
  const { updateGameScore, unlockClue, canAttemptClue } = useHunt();

  const [displayScore, setDisplayScore] = useState(0);
  const [phase, setPhase] = useState<"idle" | "playing" | "dead" | "win">("idle");

  // ── Input ──────────────────────────────────────────────────────────────────
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const s = stateRef.current;
    if (!s) return;
    if (["ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault();
    s.keys.add(e.key);

    if (e.key === " ") {
      if (s.phase === "idle" || s.phase === "dead" || s.phase === "win") {
        const ns = makeInitialState();
        stateRef.current = ns;
        setPhase("playing");
        setDisplayScore(0);
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
      // Paddle movement
      if (s.keys.has("ArrowLeft"))
        s.paddleX = Math.max(0, s.paddleX - PADDLE_SPEED);
      if (s.keys.has("ArrowRight"))
        s.paddleX = Math.min(W - PADDLE_W, s.paddleX + PADDLE_SPEED);

      // Ball movement
      const b = s.ball;
      b.x += b.vx;
      b.y += b.vy;

      // Wall bounces
      if (b.x - BALL_RADIUS <= 0) {
        b.x = BALL_RADIUS;
        b.vx = Math.abs(b.vx);
      }
      if (b.x + BALL_RADIUS >= W) {
        b.x = W - BALL_RADIUS;
        b.vx = -Math.abs(b.vx);
      }
      if (b.y - BALL_RADIUS <= 0) {
        b.y = BALL_RADIUS;
        b.vy = Math.abs(b.vy);
      }

      // Ball fell below paddle → dead
      if (b.y - BALL_RADIUS > H) {
        s.phase = "dead";
        setPhase("dead");
      }

      // Paddle collision
      if (
        b.vy > 0 &&
        b.y + BALL_RADIUS >= PADDLE_Y &&
        b.y + BALL_RADIUS <= PADDLE_Y + PADDLE_H &&
        b.x >= s.paddleX - BALL_RADIUS &&
        b.x <= s.paddleX + PADDLE_W + BALL_RADIUS
      ) {
        // Where on paddle was hit (−1 = left edge, +1 = right edge)
        const hitPos = (b.x - (s.paddleX + PADDLE_W / 2)) / (PADDLE_W / 2);
        const maxAngle = 70 * (Math.PI / 180);
        const angle = hitPos * maxAngle;
        const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
        b.vx = Math.sin(angle) * speed;
        b.vy = -Math.cos(angle) * speed;
        b.y = PADDLE_Y - BALL_RADIUS;
      }

      // Brick collision
      for (const row of s.bricks) {
        for (const brick of row) {
          if (!brick.alive) continue;
          const closestX = Math.max(brick.x, Math.min(b.x, brick.x + BRICK_W));
          const closestY = Math.max(brick.y, Math.min(b.y, brick.y + BRICK_H));
          const dx = b.x - closestX;
          const dy = b.y - closestY;
          if (dx * dx + dy * dy < BALL_RADIUS * BALL_RADIUS) {
            brick.alive = false;
            s.score += 50;
            setDisplayScore(s.score);
            updateGameScore("breakout", s.score);
            // Determine bounce direction
            const overlapX = BALL_RADIUS - Math.abs(dx);
            const overlapY = BALL_RADIUS - Math.abs(dy);
            if (overlapX < overlapY) {
              b.vx = dx > 0 ? Math.abs(b.vx) : -Math.abs(b.vx);
            } else {
              b.vy = dy > 0 ? Math.abs(b.vy) : -Math.abs(b.vy);
            }
          }
        }
      }

      // Check win
      const anyAlive = s.bricks.some((row) => row.some((br) => br.alive));
      if (!anyAlive) {
        s.phase = "win";
        setPhase("win");

        // Clue 9 trigger on win
        if (!s.clue10Unlocked && canAttemptClue(10)) {
          const unlocked = unlockClue(10);
          if (unlocked) s.clue10Unlocked = true;
        }
      }
    }

    // ── Draw ────────────────────────────────────────────────────────────────
    ctx.fillStyle = "#0a0a12";
    ctx.fillRect(0, 0, W, H);

    if (!s || s.phase === "idle") {
      ctx.save();
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#ff6b2d";
      ctx.fillStyle = "#ff6b2d";
      ctx.font = "bold 40px 'Orbitron', monospace";
      ctx.textAlign = "center";
      ctx.fillText("BREAKOUT", W / 2, H / 2 - 60);
      ctx.restore();

      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.font = "16px 'Rajdhani', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Arrow keys to move paddle", W / 2, H / 2 - 10);
      ctx.fillText("Destroy all bricks to unlock a clue", W / 2, H / 2 + 18);

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

    if (s.phase === "win") {
      ctx.save();
      ctx.shadowBlur = 24;
      ctx.shadowColor = "#00ffaa";
      ctx.fillStyle = "#00ffaa";
      ctx.font = "bold 36px 'Orbitron', monospace";
      ctx.textAlign = "center";
      ctx.fillText("YOU WIN!", W / 2, H / 2 - 50);
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

    // ── Draw playing state ──────────────────────────────────────────────────

    // Bricks
    for (const row of s.bricks) {
      for (const brick of row) {
        if (!brick.alive) continue;
        ctx.save();
        ctx.shadowBlur = 8;
        ctx.shadowColor = brick.color;
        ctx.fillStyle = brick.color;
        ctx.fillRect(brick.x, brick.y, BRICK_W, BRICK_H);
        // Sheen
        ctx.fillStyle = "rgba(255,255,255,0.15)";
        ctx.fillRect(brick.x, brick.y, BRICK_W, BRICK_H / 2);
        ctx.restore();
      }
    }

    // Paddle
    ctx.save();
    ctx.shadowBlur = 14;
    ctx.shadowColor = "#ff6b2d";
    const grad = ctx.createLinearGradient(s.paddleX, 0, s.paddleX + PADDLE_W, 0);
    grad.addColorStop(0, "#ff2d55");
    grad.addColorStop(0.5, "#ff6b2d");
    grad.addColorStop(1, "#ff2d55");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(s.paddleX, PADDLE_Y, PADDLE_W, PADDLE_H, 6);
    ctx.fill();
    ctx.restore();

    // Ball
    ctx.save();
    ctx.shadowBlur = 16;
    ctx.shadowColor = "#ffffff";
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(s.ball.x, s.ball.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Scanlines
    ctx.fillStyle = "rgba(0,0,0,0.04)";
    for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 2);
  }, [updateGameScore, unlockClue, canAttemptClue]);

  // ── RAF loop ────────────────────────────────────────────────────────────────
  useEffect(() => {
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
          justifyContent: "flex-start",
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
