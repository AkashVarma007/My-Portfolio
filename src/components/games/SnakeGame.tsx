"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useHunt } from "@/context/HuntContext";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const GRID_SIZE = 25;
const CELL_SIZE = 20;
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE; // 500px
const TICK_MS = 100;

type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Point = { x: number; y: number };

const OPPOSITE: Record<Dir, Dir> = {
  UP: "DOWN",
  DOWN: "UP",
  LEFT: "RIGHT",
  RIGHT: "LEFT",
};

const KEY_TO_DIR: Record<string, Dir> = {
  ArrowUp: "UP",
  ArrowDown: "DOWN",
  ArrowLeft: "LEFT",
  ArrowRight: "RIGHT",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function randomFood(snake: Point[]): Point {
  let pos: Point;
  do {
    pos = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
  return pos;
}

function pointsEqual(a: Point, b: Point): boolean {
  return a.x === b.x && a.y === b.y;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SnakeGame() {
  const { updateGameScore, unlockClue, canAttemptClue } = useHunt();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mutable game state — kept in refs to avoid stale closures inside loops
  const snakeRef = useRef<Point[]>([{ x: 12, y: 12 }]);
  const dirRef = useRef<Dir>("RIGHT");
  const nextDirRef = useRef<Dir>("RIGHT");
  const foodRef = useRef<Point>(randomFood([{ x: 12, y: 12 }]));
  const scoreRef = useRef<number>(0);
  const gameOverRef = useRef<boolean>(false);
  const startedRef = useRef<boolean>(false);
  const clue6TriggeredRef = useRef<boolean>(false);

  // React state — for rendering overlays
  const [displayScore, setDisplayScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const rafRef = useRef<number | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ---------------------------------------------------------------------------
  // Draw
  // ---------------------------------------------------------------------------

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const snake = snakeRef.current;
    const food = foodRef.current;

    // Background
    ctx.fillStyle = "#0a0a12";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Grid lines
    ctx.strokeStyle = "rgba(255,45,85,0.04)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, CANVAS_SIZE);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(CANVAS_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }

    // Food
    ctx.shadowColor = "#ff2d55";
    ctx.shadowBlur = 8;
    ctx.fillStyle = "#ff2d55";
    ctx.fillRect(
      food.x * CELL_SIZE + 2,
      food.y * CELL_SIZE + 2,
      CELL_SIZE - 4,
      CELL_SIZE - 4
    );
    ctx.shadowBlur = 0;

    // Snake
    snake.forEach((seg, i) => {
      const alpha = Math.max(0.3, 1 - i * 0.02);
      if (i === 0) {
        ctx.fillStyle = `rgba(255,107,45,${alpha})`;
      } else {
        ctx.fillStyle = `rgba(255,45,85,${alpha})`;
      }
      ctx.fillRect(
        seg.x * CELL_SIZE + 1,
        seg.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2
      );
    });
  }, []);

  // ---------------------------------------------------------------------------
  // Game tick
  // ---------------------------------------------------------------------------

  const tick = useCallback(() => {
    if (gameOverRef.current || !startedRef.current) return;

    // Commit buffered direction
    dirRef.current = nextDirRef.current;

    const snake = snakeRef.current;
    const dir = dirRef.current;
    const head = snake[0];

    let nx = head.x;
    let ny = head.y;
    if (dir === "UP") ny -= 1;
    else if (dir === "DOWN") ny += 1;
    else if (dir === "LEFT") nx -= 1;
    else if (dir === "RIGHT") nx += 1;

    // Wall collision
    if (nx < 0 || nx >= GRID_SIZE || ny < 0 || ny >= GRID_SIZE) {
      gameOverRef.current = true;
      updateGameScore("snake", scoreRef.current);
      setIsGameOver(true);
      return;
    }

    const newHead: Point = { x: nx, y: ny };

    // Self collision
    if (snake.some((s) => pointsEqual(s, newHead))) {
      gameOverRef.current = true;
      updateGameScore("snake", scoreRef.current);
      setIsGameOver(true);
      return;
    }

    const ateFood = pointsEqual(newHead, foodRef.current);

    const newSnake = [newHead, ...snake];
    if (!ateFood) {
      newSnake.pop();
    }

    snakeRef.current = newSnake;

    if (ateFood) {
      scoreRef.current += 1;
      setDisplayScore(scoreRef.current);
      foodRef.current = randomFood(newSnake);

      // Clue 7 trigger at exactly score 42
      if (
        scoreRef.current === 42 &&
        !clue6TriggeredRef.current &&
        canAttemptClue(7)
      ) {
        clue6TriggeredRef.current = true;
        unlockClue(7);
      }
    }
  }, [updateGameScore, unlockClue, canAttemptClue]);

  // ---------------------------------------------------------------------------
  // Render loop
  // ---------------------------------------------------------------------------

  const renderLoop = useCallback(() => {
    draw();
    rafRef.current = requestAnimationFrame(renderLoop);
  }, [draw]);

  // ---------------------------------------------------------------------------
  // Start / Restart
  // ---------------------------------------------------------------------------

  const startGame = useCallback(() => {
    // Reset state
    snakeRef.current = [{ x: 12, y: 12 }];
    dirRef.current = "RIGHT";
    nextDirRef.current = "RIGHT";
    foodRef.current = randomFood([{ x: 12, y: 12 }]);
    scoreRef.current = 0;
    gameOverRef.current = false;
    startedRef.current = true;
    clue6TriggeredRef.current = false;

    setDisplayScore(0);
    setIsGameOver(false);
    setIsStarted(true);

    // Clear any existing tick
    if (tickRef.current !== null) {
      clearInterval(tickRef.current);
    }
    tickRef.current = setInterval(tick, TICK_MS);
  }, [tick]);

  // ---------------------------------------------------------------------------
  // Input handling
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        if (!startedRef.current || gameOverRef.current) {
          startGame();
        }
        return;
      }

      const newDir = KEY_TO_DIR[e.key];
      if (!newDir) return;
      e.preventDefault();

      // Prevent reversing
      if (newDir !== OPPOSITE[dirRef.current]) {
        nextDirRef.current = newDir;
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [startGame]);

  // ---------------------------------------------------------------------------
  // RAF render loop lifecycle
  // ---------------------------------------------------------------------------

  useEffect(() => {
    rafRef.current = requestAnimationFrame(renderLoop);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      if (tickRef.current !== null) clearInterval(tickRef.current);
    };
  }, [renderLoop]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-orbitron), 'Orbitron', monospace",
        background: "#0a0a12",
      }}
    >
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
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

      {/* Score HUD */}
      {isStarted && !isGameOver && (
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 12,
            color: "#ff2d55",
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: 2,
            textShadow: "0 0 8px rgba(255,45,85,0.6)",
            pointerEvents: "none",
          }}
        >
          {displayScore}
        </div>
      )}

      {/* Start screen */}
      {!isStarted && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(10,10,18,0.82)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 4,
              color: "#ff2d55",
              textTransform: "uppercase",
              textShadow: "0 0 12px rgba(255,45,85,0.8)",
              animation: "snake-pulse 1.4s ease-in-out infinite",
            }}
          >
            PRESS SPACE TO START
          </div>
          <div
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.4)",
              letterSpacing: 2,
            }}
          >
            Arrow keys to move
          </div>
        </div>
      )}

      {/* Game over screen */}
      {isGameOver && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(10,10,18,0.88)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 900,
              letterSpacing: 6,
              color: "#ff2d55",
              textShadow: "0 0 16px rgba(255,45,85,0.9)",
            }}
          >
            GAME OVER
          </div>
          <div
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.7)",
              letterSpacing: 2,
            }}
          >
            Score: {displayScore}
          </div>
          <div
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.35)",
              letterSpacing: 2,
              marginTop: 6,
              animation: "snake-pulse 1.4s ease-in-out infinite",
            }}
          >
            SPACE to restart
          </div>
        </div>
      )}

      <style>{`
        @keyframes snake-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
      `}</style>
    </div>
  );
}
