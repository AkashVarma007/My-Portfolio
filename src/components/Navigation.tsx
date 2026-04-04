"use client";

import { useState } from "react";

const links = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Journey", href: "#journey" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] px-6 md:px-10 py-5 flex items-center justify-between">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="font-display text-lg font-extrabold tracking-tight text-text"
        >
          akash varma
        </a>

        <div className="hidden md:flex gap-10">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(link.href);
              }}
              className="text-[0.7rem] font-medium tracking-[2px] uppercase text-text-dim hover:text-text transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
        </div>

        <button
          className="md:hidden relative w-7 h-5"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`absolute left-0 w-full h-[1.5px] bg-text transition-all duration-300 ${
              mobileOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
            }`}
          />
          <span
            className={`absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1.5px] bg-text transition-opacity duration-300 ${
              mobileOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute left-0 w-full h-[1.5px] bg-text transition-all duration-300 ${
              mobileOpen ? "bottom-1/2 translate-y-1/2 -rotate-45" : "bottom-0"
            }`}
          />
        </button>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-[99] bg-bg flex flex-col items-center justify-center gap-6">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(link.href);
              }}
              className="font-display text-4xl font-bold text-text-dim hover:text-text transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
