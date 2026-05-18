"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "About",   href: "#about"   },
  { label: "Work",    href: "#work"    },
  { label: "Journey", href: "#journey" },
  { label: "Skills",  href: "#skills"  },
  { label: "Contact", href: "#contact" },
];

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const [active, setActive]         = useState("");
  const pathname = usePathname();
  const onHome = pathname === "/";

  // Backdrop blur once scrolled past hero
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active section tracking via IntersectionObserver (home only)
  useEffect(() => {
    if (!onHome) { setActive(""); return; }
    const sectionIds = links.map((l) => l.href.replace("#", ""));
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(`#${id}`); },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [onHome]);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[100] px-6 md:px-10 py-5 flex items-center justify-between transition-all duration-500"
        style={{
          background: scrolled
            ? "rgba(8,8,12,0.82)"
            : "transparent",
          backdropFilter: scrolled ? "blur(16px) saturate(180%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(16px) saturate(180%)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "1px solid transparent",
        }}
      >
        {onHome ? (
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="font-display text-lg font-extrabold tracking-tight text-text"
          >
            akash varma
          </a>
        ) : (
          <Link
            href="/"
            className="font-display text-lg font-extrabold tracking-tight text-text"
          >
            akash varma
          </Link>
        )}

        <div className="hidden md:flex gap-10">
          {links.map((link) =>
            onHome ? (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                className="relative text-[0.7rem] font-medium tracking-[2px] uppercase transition-colors duration-300"
                style={{ color: active === link.href ? "var(--color-text)" : "var(--color-text-dim)" }}
              >
                {link.label}
                {active === link.href && (
                  <span
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent"
                    style={{ boxShadow: "0 0 6px rgba(196,247,81,0.8)" }}
                  />
                )}
              </a>
            ) : (
              <a
                key={link.href}
                href={`/${link.href}`}
                className="relative text-[0.7rem] font-medium tracking-[2px] uppercase transition-colors duration-300"
                style={{ color: "var(--color-text-dim)" }}
              >
                {link.label}
              </a>
            )
          )}
          <Link
            href="/now"
            className="relative text-[0.7rem] font-medium tracking-[2px] uppercase transition-colors duration-300"
            style={{ color: pathname?.startsWith("/now") ? "var(--color-text)" : "var(--color-text-dim)" }}
          >
            Now
            {pathname?.startsWith("/now") && (
              <span
                className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent"
                style={{ boxShadow: "0 0 6px rgba(196,247,81,0.8)" }}
              />
            )}
          </Link>
        </div>

        <button
          className="md:hidden relative w-7 h-5"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className={`absolute left-0 w-full h-[1.5px] bg-text transition-all duration-300 ${mobileOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"}`} />
          <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1.5px] bg-text transition-opacity duration-300 ${mobileOpen ? "opacity-0" : "opacity-100"}`} />
          <span className={`absolute left-0 w-full h-[1.5px] bg-text transition-all duration-300 ${mobileOpen ? "bottom-1/2 translate-y-1/2 -rotate-45" : "bottom-0"}`} />
        </button>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[99] flex flex-col items-center justify-center gap-6"
          style={{ background: "rgba(8,8,12,0.97)", backdropFilter: "blur(20px)" }}
          onClick={() => setMobileOpen(false)}
        >
          {links.map((link) =>
            onHome ? (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                className="font-display text-4xl font-bold transition-colors duration-300"
                style={{ color: active === link.href ? "var(--color-accent)" : "var(--color-text-dim)" }}
              >
                {link.label}
              </a>
            ) : (
              <a
                key={link.href}
                href={`/${link.href}`}
                onClick={() => setMobileOpen(false)}
                className="font-display text-4xl font-bold transition-colors duration-300"
                style={{ color: "var(--color-text-dim)" }}
              >
                {link.label}
              </a>
            )
          )}
          <Link
            href="/now"
            className="font-display text-4xl font-bold transition-colors duration-300"
            style={{ color: pathname?.startsWith("/now") ? "var(--color-accent)" : "var(--color-text-dim)" }}
            onClick={() => setMobileOpen(false)}
          >
            Now
          </Link>
        </div>
      )}
    </>
  );
}
