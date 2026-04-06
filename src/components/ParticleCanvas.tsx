"use client";

import { useEffect, useRef } from "react";
import { useHunt } from "@/context/HuntContext";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { canAttemptClue, unlockClue, isClueFound } = useHunt();

  // Keep latest hunt callbacks in a ref so the canvas effect never restarts
  // just because HuntContext re-renders with new function references
  const huntRef = useRef({ canAttemptClue, unlockClue, isClueFound });
  useEffect(() => {
    huntRef.current = { canAttemptClue, unlockClue, isClueFound };
  }, [canAttemptClue, unlockClue, isClueFound]);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    const canvas: HTMLCanvasElement = canvasEl;
    const ctxRaw = canvas.getContext("2d");
    if (!ctxRaw) return;
    const ctx: CanvasRenderingContext2D = ctxRaw;

    let animFrameId: number;
    let particles: Particle[] = [];
    let mouse = { x: -9999, y: -9999 };
    let messageVisible = false;
    let messageUntil = 0;
    let nextMessageAt = performance.now() + 20000;
    let textPoints: Array<{ x: number; y: number }> = [];
    const TEXT = "ORDER";
    const TEXT_PARTICLE_RATIO = 0.22;

    const CONNECT_DIST = 150;
    const MOUSE_RADIUS = 200;
    const MOUSE_FORCE = 0.6;

    function getParticleCount() {
      return window.innerWidth < 768 ? 40 : 70;
    }

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      buildTextPoints();
    }

    function buildTextPoints() {
      const off = document.createElement("canvas");
      const octx = off.getContext("2d");
      if (!octx) return;
      off.width = canvas.width;
      off.height = canvas.height;

      const fontSize = Math.max(64, Math.min(140, Math.floor(canvas.width / 8)));
      octx.clearRect(0, 0, off.width, off.height);
      octx.fillStyle = "#fff";
      octx.font = `700 ${fontSize}px 'Orbitron', sans-serif`;
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      octx.fillText(TEXT, off.width / 2, off.height / 2);

      const img = octx.getImageData(0, 0, off.width, off.height);
      const points: Array<{ x: number; y: number }> = [];
      const step = 6;
      for (let y = 0; y < off.height; y += step) {
        for (let x = 0; x < off.width; x += step) {
          const idx = (y * off.width + x) * 4 + 3;
          if (img.data[idx] > 10) points.push({ x, y });
        }
      }
      textPoints = points;
    }

    function initParticles() {
      const count = getParticleCount();
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          radius: Math.random() * 1.5 + 0.8,
        });
      }
    }

    function draw() {
      const now = performance.now();
      const { canAttemptClue, isClueFound, unlockClue } = huntRef.current;
      const clue11Active = canAttemptClue(12) && !isClueFound(12);
      if (clue11Active) {
        if (!messageVisible && now >= nextMessageAt) {
          messageVisible = true;
          messageUntil = now + 3000;
        }
        if (messageVisible && now >= messageUntil) {
          messageVisible = false;
          nextMessageAt = now + 24000;
        }
      } else if (messageVisible) {
        messageVisible = false;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Mouse repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = ((MOUSE_RADIUS - dist) / MOUSE_RADIUS) * MOUSE_FORCE;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Dampen velocity slightly, but keep a subtle drift alive
        p.vx *= 0.997;
        p.vy *= 0.997;
        p.vx += (Math.random() - 0.5) * 0.01;
        p.vy += (Math.random() - 0.5) * 0.01;

        // If message is visible, gently steer some particles to text points
        if (messageVisible && textPoints.length > 0 && i < particles.length * TEXT_PARTICLE_RATIO) {
          const target = textPoints[i % textPoints.length];
          const tx = target.x;
          const ty = target.y;
          p.vx += (tx - p.x) * 0.0014;
          p.vy += (ty - p.y) * 0.0014;
        }

        // Clamp speed
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const maxSpeed = 1.8;
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < -10) p.x = canvas.width + 10;
        else if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        else if (p.y > canvas.height + 10) p.y = -10;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(196, 247, 81, 0.3)";
        ctx.fill();
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECT_DIST) {
            const alpha = ((CONNECT_DIST - dist) / CONNECT_DIST) * 0.11;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(196, 247, 81, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animFrameId = requestAnimationFrame(draw);
    }

    function onMouseMove(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }

    function onMouseLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    function onResize() {
      resize();
      initParticles();
    }

    function onClick() {
      if (!messageVisible) return;
      const { canAttemptClue, isClueFound, unlockClue } = huntRef.current;
      if (canAttemptClue(12) && !isClueFound(12)) {
        unlockClue(12);
        messageVisible = false;
        nextMessageAt = performance.now() + 20000;
      }
    }

    resize();
    initParticles();
    draw();

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("resize", onResize);
    window.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("click", onClick);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // hunt callbacks accessed via huntRef — no re-init on context changes

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
}
