"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { useHunt } from "@/context/HuntContext";

// ─── Constants ────────────────────────────────────────────────────────────────

const W = 500;
const H = 400;
const PADDLE_W = 10;
const PADDLE_H = 70;
const PADDLE_SPEED = 5;
const AI_SPEED = 3;
const BALL_RADIUS = 6;
const BALL_START_SPEED = 4;
const SPEED_MULTIPLIER = 1.05;
const WIN_SCORE = 11;
const PLAYER_X = 20;
const AI_X = W - 20 - PADDLE_W;

// ─── Types ────────────────────────────────────────────────────────────────────

interface Paddle {
  y: number;
}

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface GameState {
  phase: "idle" | "playing" | "win" | "lose";
  player: Paddle;
  ai: Paddle;
  ball: Ball;
  playerScore: number;
  aiScore: number;
  keys: Set<string>;
}

function randomBall(): Ball {
  const angle = (Math.random() * 40 + 20) * (Math.PI / 180);
  const dirX = Math.random() < 0.5 ? 1 : -1;
  const dirY = Math.random() < 0.5 ? 1 : -1;
  return {
    x: W / 2,
    y: H / 2,
    vx: Math.cos(angle) * BALL_START_SPEED * dirX,
    vy: Math.sin(angle) * BALL_START_SPEED * dirY,
  };
}

function makeInitialState(): GameState {
  return {
    phase: "playing",
    player: { y: H / 2 - PADDLE_H / 2 },
    ai: { y: H / 2 - PADDLE_H / 2 },
    ball: randomBall(),
    playerScore: 0,
    aiScore: 0,
    keys: new Set(),
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PongGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState | null>(null);
  const rafRef = useRef<number>(0);
  const { updateGameScore } = useHunt();

  const [displayPlayerScore, setDisplayPlayerScore] = useState(0);
  const [displayAiScore, setDisplayAiScore] = useState(0);
  const [phase, setPhase] = useState<"idle" | "playing" | "win" | "lose">("idle");

  // ── Input ──────────────────────────────────────────────────────────────────
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const s = stateRef.current;
    if (!s) return;
    if (["ArrowUp", "ArrowDown", "w", "s", "W", "S", " "].includes(e.key)) {
      e.preventDefault();
    }
    s.keys.add(e.key);

    if (e.key === " ") {
      if (s.phase === "idle" || s.phase === "win" || s.phase === "lose") {
        const ns = makeInitialState();
        stateRef.current = ns;
        setPhase("playing");
        setDisplayPlayerScore(0);
        setDisplayAiScore(0);
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
      // Player paddle
      if (s.keys.has("ArrowUp") || s.keys.has("w") || s.keys.has("W")) {
        s.player.y = Math.max(0, s.player.y - PADDLE_SPEED);
      }
      if (s.keys.has("ArrowDown") || s.keys.has("s") || s.keys.has("S")) {
        s.player.y = Math.min(H - PADDLE_H, s.player.y + PADDLE_SPEED);
      }

      // AI paddle — follow ball Y with capped speed
      const aiCenter = s.ai.y + PADDLE_H / 2;
      if (aiCenter < s.ball.y - 4) {
        s.ai.y = Math.min(H - PADDLE_H, s.ai.y + AI_SPEED);
      } else if (aiCenter > s.ball.y + 4) {
        s.ai.y = Math.max(0, s.ai.y - AI_SPEED);
      }

      // Ball movement
      const b = s.ball;
      b.x += b.vx;
      b.y += b.vy;

      // Top / bottom wall bounce
      if (b.y - BALL_RADIUS <= 0) {
        b.y = BALL_RADIUS;
        b.vy = Math.abs(b.vy);
      }
      if (b.y + BALL_RADIUS >= H) {
        b.y = H - BALL_RADIUS;
        b.vy = -Math.abs(b.vy);
      }

      // Player paddle collision (left side)
      if (
        b.vx < 0 &&
        b.x - BALL_RADIUS <= PLAYER_X + PADDLE_W &&
        b.x - BALL_RADIUS >= PLAYER_X &&
        b.y >= s.player.y &&
        b.y <= s.player.y + PADDLE_H
      ) {
        b.x = PLAYER_X + PADDLE_W + BALL_RADIUS;
        b.vx = Math.abs(b.vx) * SPEED_MULTIPLIER;
        b.vy *= SPEED_MULTIPLIER;
      }

      // AI paddle collision (right side)
      if (
        b.vx > 0 &&
        b.x + BALL_RADIUS >= AI_X &&
        b.x + BALL_RADIUS <= AI_X + PADDLE_W &&
        b.y >= s.ai.y &&
        b.y <= s.ai.y + PADDLE_H
      ) {
        b.x = AI_X - BALL_RADIUS;
        b.vx = -Math.abs(b.vx) * SPEED_MULTIPLIER;
        b.vy *= SPEED_MULTIPLIER;
      }

      // Ball out of bounds — scoring
      if (b.x < 0) {
        // AI scores
        s.aiScore++;
        setDisplayAiScore(s.aiScore);
        if (s.aiScore >= WIN_SCORE) {
          s.phase = "lose";
          setPhase("lose");
        } else {
          s.ball = randomBall();
        }
      } else if (b.x > W) {
        // Player scores
        s.playerScore++;
        setDisplayPlayerScore(s.playerScore);
        updateGameScore("pong", s.playerScore * 100);
        if (s.playerScore >= WIN_SCORE) {
          s.phase = "win";
          setPhase("win");
        } else {
          s.ball = randomBall();
        }
      }
    }

    // ── Draw ────────────────────────────────────────────────────────────────
    ctx.fillStyle = "#0a0a12";
    ctx.fillRect(0, 0, W, H);

    if (!s || s.phase === "idle") {
      ctx.save();
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#00ff88";
      ctx.fillStyle = "#00ff88";
      ctx.font = "bold 40px 'Orbitron', monospace";
      ctx.textAlign = "center";
      ctx.fillText("PONG", W / 2, H / 2 - 60);
      ctx.restore();

      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.font = "16px 'Rajdhani', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Arrow keys or W/S to move", W / 2, H / 2 - 10);
      ctx.fillText(`First to ${WIN_SCORE} wins`, W / 2, H / 2 + 18);

      ctx.fillStyle = "#00ffaa";
      ctx.font = "bold 20px 'Orbitron', monospace";
      ctx.fillText("PRESS SPACE TO START", W / 2, H / 2 + 65);
      return;
    }

    if (s.phase === "win") {
      ctx.save();
      ctx.shadowBlur = 24;
      ctx.shadowColor = "#00ff88";
      ctx.fillStyle = "#00ff88";
      ctx.font = "bold 38px 'Orbitron', monospace";
      ctx.textAlign = "center";
      ctx.fillText("YOU WIN!", W / 2, H / 2 - 40);
      ctx.restore();

      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.font = "16px 'Rajdhani', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("PRESS SPACE TO PLAY AGAIN", W / 2, H / 2 + 30);
      return;
    }

    if (s.phase === "lose") {
      ctx.save();
      ctx.shadowBlur = 24;
      ctx.shadowColor = "#ff2d55";
      ctx.fillStyle = "#ff2d55";
      ctx.font = "bold 38px 'Orbitron', monospace";
      ctx.textAlign = "center";
      ctx.fillText("YOU LOSE", W / 2, H / 2 - 40);
      ctx.restore();

      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.font = "16px 'Rajdhani', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("PRESS SPACE TO PLAY AGAIN", W / 2, H / 2 + 30);
      return;
    }

    // ── Draw playing state ──────────────────────────────────────────────────

    // Center dashed line
    ctx.save();
    ctx.setLineDash([8, 8]);
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(W / 2, 0);
    ctx.lineTo(W / 2, H);
    ctx.stroke();
    ctx.restore();

    // Player paddle (left, green)
    ctx.save();
    ctx.shadowBlur = 16;
    ctx.shadowColor = "#00ff88";
    ctx.fillStyle = "#00ff88";
    ctx.beginPath();
    ctx.roundRect(PLAYER_X, s.player.y, PADDLE_W, PADDLE_H, 3);
    ctx.fill();
    ctx.restore();

    // AI paddle (right, red)
    ctx.save();
    ctx.shadowBlur = 16;
    ctx.shadowColor = "#ff2d55";
    ctx.fillStyle = "#ff2d55";
    ctx.beginPath();
    ctx.roundRect(AI_X, s.ai.y, PADDLE_W, PADDLE_H, 3);
    ctx.fill();
    ctx.restore();

    // Ball
    ctx.save();
    ctx.shadowBlur = 18;
    ctx.shadowColor = "#ffffff";
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(s.ball.x, s.ball.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Scanlines
    ctx.fillStyle = "rgba(0,0,0,0.04)";
    for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 2);
  }, [updateGameScore]);

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
      {/* Score HUD */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 32,
          padding: "6px 24px",
          fontFamily: "'Orbitron', monospace",
          fontSize: 28,
          fontWeight: 900,
          letterSpacing: 4,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            color: "#00ff88",
            textShadow: "0 0 12px #00ff88",
            minWidth: 60,
            textAlign: "center",
          }}
        >
          {displayPlayerScore}
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 3,
            color: "rgba(255,255,255,0.3)",
          }}
        >
          VS
        </span>
        <span
          style={{
            color: "#ff2d55",
            textShadow: "0 0 12px #ff2d55",
            minWidth: 60,
            textAlign: "center",
          }}
        >
          {displayAiScore}
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
