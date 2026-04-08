"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function AnimationProvider() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // All standalone tweens (no ScrollTrigger) tracked here for cleanup
    const tweens: gsap.core.Tween[] = [];
    const scrambleTimers: ReturnType<typeof setInterval>[] = [];

    // ── Scroll progress bar ───────────────────────────────────────────
    const progressBar = document.querySelector<HTMLElement>(".scroll-progress");
    if (progressBar) {
      tweens.push(
        gsap.to(progressBar, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 0,
            onUpdate: (self) => {
              progressBar.style.width = `${self.progress * 100}%`;
            },
          },
        })
      );
    }

    // ── Generic fade-up elements ──────────────────────────────────────
    const fadeUpEls = document.querySelectorAll<HTMLElement>(".gsap-fade-up");
    fadeUpEls.forEach((el) => {
      const delay = parseFloat(el.dataset.delay ?? "0");
      gsap.set(el, { opacity: 0, y: 45 });
      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        toggleActions: "play none none none",
        onEnter: () => {
          gsap.to(el, { opacity: 1, y: 0, duration: 0.85, delay, ease: "power3.out" });
        },
      });
    });

    // Generic fade-in elements
    const fadeInEls = document.querySelectorAll<HTMLElement>(".gsap-fade-in");
    fadeInEls.forEach((el) => {
      const delay = parseFloat(el.dataset.delay ?? "0");
      gsap.set(el, { opacity: 0 });
      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        toggleActions: "play none none none",
        onEnter: () => {
          gsap.to(el, { opacity: 1, duration: 0.7, delay, ease: "power2.out" });
        },
      });
    });

    // ── Section heading clip-path reveals ────────────────────────────
    const headings = document.querySelectorAll<HTMLElement>("h2");
    headings.forEach((h) => {
      // Skip h2s inside #contact — animated by the contact section stagger
      if (h.closest("#contact")) return;
      gsap.set(h, { clipPath: "inset(0 100% 0 0)", opacity: 0 });
      ScrollTrigger.create({
        trigger: h,
        start: "top 85%",
        toggleActions: "play none none none",
        onEnter: () => {
          gsap.to(h, { clipPath: "inset(0 0% 0 0)", opacity: 1, duration: 1, ease: "power4.out" });
        },
      });
    });

    // ── Gradient orb parallax ─────────────────────────────────────────
    const orbs = document.querySelectorAll<HTMLElement>(".gsap-orb");
    orbs.forEach((orb, i) => {
      const dir = i % 2 === 0 ? -1 : 1;
      tweens.push(
        gsap.to(orb, {
          y: `${dir * 120}px`,
          ease: "none",
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 2,
          },
        })
      );
    });

    // ── Project cards staggered 3D tilt entry ─────────────────────────
    const projectCards = document.querySelectorAll<HTMLElement>(".gsap-project-card");
    if (projectCards.length > 0) {
      gsap.set(projectCards, { opacity: 0, y: 60, rotateX: 15, transformPerspective: 900 });
      ScrollTrigger.create({
        trigger: projectCards[0].closest("section") ?? projectCards[0],
        start: "top 80%",
        toggleActions: "play none none none",
        onEnter: () => {
          gsap.to(projectCards, { opacity: 1, y: 0, rotateX: 0, duration: 0.9, stagger: 0.1, ease: "power3.out" });
        },
      });
    }

    // ── Journey cards slide in from alternating sides ─────────────────
    const journeyCards = document.querySelectorAll<HTMLElement>(".gsap-journey-card");
    journeyCards.forEach((card, i) => {
      const fromX = i % 2 === 0 ? -80 : 80;
      gsap.set(card, { opacity: 0, x: fromX });
      ScrollTrigger.create({
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none none",
        onEnter: () => {
          gsap.to(card, { opacity: 1, x: 0, duration: 0.9, delay: i * 0.12, ease: "power3.out" });
        },
      });
    });

    // ── Skill cards scale-up staggered ───────────────────────────────
    const skillCards = document.querySelectorAll<HTMLElement>(".gsap-skill-card");
    if (skillCards.length > 0) {
      gsap.set(skillCards, { opacity: 0, scale: 0.82, y: 30 });
      ScrollTrigger.create({
        trigger: skillCards[0].closest("section") ?? skillCards[0],
        start: "top 82%",
        toggleActions: "play none none none",
        onEnter: () => {
          gsap.to(skillCards, { opacity: 1, scale: 1, y: 0, duration: 0.75, stagger: 0.08, ease: "back.out(1.4)" });
        },
      });
    }

    // ── Hero lines dramatic stagger on load ───────────────────────────
    const heroLines = document.querySelectorAll<HTMLElement>(".gsap-hero-line");
    if (heroLines.length > 0) {
      gsap.set(heroLines, { opacity: 0, y: 60, rotateZ: -1.5 });
      tweens.push(
        gsap.to(heroLines, { opacity: 1, y: 0, rotateZ: 0, duration: 1, stagger: 0.12, delay: 0.3, ease: "power4.out" })
      );
    }

    // Hero bottom fade up
    const heroBottom = document.querySelector<HTMLElement>(".gsap-hero-bottom");
    if (heroBottom) {
      gsap.set(heroBottom, { opacity: 0, y: 30 });
      tweens.push(
        gsap.to(heroBottom, { opacity: 1, y: 0, duration: 1, delay: 0.9, ease: "power3.out" })
      );
    }


    // ── About text paragraphs stagger ────────────────────────────────
    const aboutTexts = document.querySelectorAll<HTMLElement>(".gsap-about-text");
    aboutTexts.forEach((p, i) => {
      gsap.set(p, { opacity: 0, x: -30 });
      ScrollTrigger.create({
        trigger: p,
        start: "top 87%",
        toggleActions: "play none none none",
        onEnter: () => {
          gsap.to(p, { opacity: 1, x: 0, duration: 0.75, delay: i * 0.1, ease: "power3.out" });
        },
      });
    });


    // ── Section number text scramble ─────────────────────────────────
    const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const sectionNums = document.querySelectorAll<HTMLElement>(".gsap-section-num");
    sectionNums.forEach((el) => {
      const original = el.textContent ?? "";
      let triggered = false;
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        toggleActions: "play none none none",
        onEnter: () => {
          if (triggered) return;
          triggered = true;
          let elapsed = 0;
          const DURATION = 700;
          const INTERVAL = 35;
          const timer = setInterval(() => {
            elapsed += INTERVAL;
            if (elapsed >= DURATION) {
              clearInterval(timer);
              el.textContent = original;
              return;
            }
            el.textContent = original
              .split("")
              .map((ch) =>
                ch === " " ? " " : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
              )
              .join("");
          }, INTERVAL);
          scrambleTimers.push(timer);
        },
      });
    });

    // ── Refresh after setup ───────────────────────────────────────────
    ScrollTrigger.refresh();

    return () => {
      tweens.forEach((t) => t.kill());
      scrambleTimers.forEach((t) => clearInterval(t));
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return null;
}
