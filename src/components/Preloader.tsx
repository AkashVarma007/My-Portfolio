"use client";

import { useEffect, useRef, useState } from "react";

interface PreloaderProps {
  onComplete: () => void;
}

const NAME = "AKASH VARMA";

export function Preloader({ onComplete }: PreloaderProps) {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);
  const counterRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Animate counter 0 → 100 over ~1.8s
    const duration = 1800;
    const steps = 100;
    const interval = duration / steps;
    let step = 0;

    counterRef.current = setInterval(() => {
      step++;
      // Ease-in-out feel: slow start, fast middle, slow end
      const progress = step / steps;
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      setCount(Math.round(eased * 100));

      if (step >= steps) {
        if (counterRef.current) clearInterval(counterRef.current);
        // Start exit animation
        setTimeout(() => {
          setExiting(true);
          // Wait for slide-up animation to finish, then unmount
          setTimeout(() => {
            setVisible(false);
            onComplete();
          }, 600);
        }, 200);
      }
    }, interval);

    return () => {
      if (counterRef.current) clearInterval(counterRef.current);
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-bg flex flex-col items-center justify-center"
      style={{
        animation: exiting ? "preloader-slide-up 0.6s cubic-bezier(0.22,1,0.36,1) forwards" : undefined,
      }}
    >
      {/* Counter */}
      <div
        className="font-display font-extrabold text-[clamp(4rem,14vw,10rem)] leading-none tracking-[-4px] text-text-muted select-none mb-6"
        style={{ fontVariantNumeric: "tabular-nums" }}
        aria-hidden
      >
        {String(count).padStart(2, "0")}
        <span className="text-accent">%</span>
      </div>

      {/* Name — letter-by-letter reveal */}
      <div className="flex overflow-hidden gap-[0.05em] mb-10">
        {NAME.split("").map((char, i) => (
          <span
            key={i}
            className="font-display font-extrabold tracking-[-1px] text-text inline-block"
            style={{
              fontSize: "clamp(1.5rem, 4vw, 2.8rem)",
              opacity: 0,
              animation: `preloader-letter 0.5s cubic-bezier(0.22,1,0.36,1) ${0.1 + i * 0.055}s forwards`,
              display: char === " " ? "inline-block" : undefined,
              width: char === " " ? "0.4em" : undefined,
            }}
          >
            {char}
          </span>
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-48 md:w-64 h-[2px] bg-border-light rounded-full overflow-hidden relative">
        <div
          className="absolute inset-y-0 left-0 bg-accent rounded-full transition-none"
          style={{
            width: `${count}%`,
            boxShadow: "0 0 8px rgba(196,247,81,0.6)",
            transition: "width 0.05s linear",
          }}
        />
      </div>

      {/* Tagline */}
      <p
        className="font-code text-[0.6rem] tracking-[5px] uppercase text-text-muted mt-6"
        style={{
          opacity: 0,
          animation: "preloader-letter 0.6s ease 0.9s forwards",
        }}
      >
        Systems &amp; Platform Engineering
      </p>

      <style>{`
        @keyframes preloader-letter {
          from { opacity: 0; transform: translateY(100%); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes preloader-slide-up {
          from { transform: translateY(0); }
          to   { transform: translateY(-100%); }
        }
      `}</style>
    </div>
  );
}
