"use client";

import { triggerArcade } from "@/components/ArcadeCurtain";

export function Footer() {
  return (
    <footer className="border-t border-border px-6 md:px-12 py-8 relative z-[1]">
      <div className="max-w-[1300px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="font-code text-[0.55rem] text-text-muted tracking-[3px]">
          AKASH VARMA &copy; {new Date().getFullYear()}
        </span>

        <span className="text-[0.7rem] text-text-muted">
          Systems that scale. Code that lasts.
        </span>

        {/* Intentional arcade entry — prevents accidental scroll-trigger */}
        <button
          onClick={triggerArcade}
          className="group flex items-center gap-2 font-code text-[0.55rem] tracking-[3px] uppercase text-text-muted hover:text-[#ff2d55] transition-colors duration-300"
        >
          <span
            className="w-1.5 h-1.5 rounded-full bg-[#ff2d55] opacity-40 group-hover:opacity-100 transition-opacity duration-300"
            style={{ boxShadow: "0 0 6px rgba(255,45,85,0.5)" }}
          />
          Enter Arcade
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </button>
      </div>
    </footer>
  );
}
