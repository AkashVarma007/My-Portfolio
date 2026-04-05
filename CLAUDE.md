# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev        # dev server (uses --webpack flag — required)
npm run build      # production build
npm run start      # serve production build
npm run preview    # build + start in one step
npm run lint       # ESLint
```

No test suite is configured.

## Stack

- **Next.js 16.2.2** · **React 19** · **TypeScript** · **Tailwind CSS v4**
- **GSAP + ScrollTrigger** for all scroll-driven animations
- **Lenis** for smooth scrolling, piped through GSAP's ticker (one RAF loop — see `SmoothScroll.tsx`)
- All fonts are self-hosted via `@fontsource` packages — no Google Fonts network requests

## Architecture

This is a single-page portfolio (`src/app/page.tsx`) with two additional routes: `/arcade` and `/secret`.

### Animation system (`AnimationProvider.tsx`)

`AnimationProvider` is a renderless component that registers all GSAP + ScrollTrigger animations globally by querying CSS class selectors on mount. Components add these classes to their elements; `AnimationProvider` wires up the tweens. Key classes:

| Class | Effect |
|---|---|
| `.gsap-fade-up` | Fade + translate-up on scroll enter |
| `.gsap-fade-in` | Opacity fade on scroll enter |
| `.gsap-orb` | Parallax vertical drift |
| `.gsap-project-card` | Staggered 3D tilt entry |
| `.gsap-journey-card` | Alternating slide-in from left/right |
| `.gsap-skill-card` | Scale-up stagger |
| `.gsap-hero-line` | Dramatic stagger on load |
| `.gsap-marquee-row` | Horizontal speed modulation on scroll |

Use `data-delay="0.2"` on `.gsap-fade-up` / `.gsap-fade-in` elements to stagger within a group.

`h2` elements get a clip-path reveal automatically — no extra class needed.

### Scavenger hunt (`HuntContext.tsx` + `src/data/clues.ts`)

`HuntProvider` wraps the entire page and manages a 15-clue easter egg hunt across 4 tiers. State is persisted to `localStorage` under the key `akash_hunt`. Clues have a prerequisite chain (each unlocks the next). Hunt UI components: `AchievementWidget`, `ClueToast`, `HiddenTerminal`.

### Arcade flow

`ArcadeCurtain` listens for scroll past the footer and triggers a curtain transition to `/arcade`. The arcade page contains Snake, Breakout, Pong, and Invaders games. Game high scores are tracked in `HuntContext` alongside clue progress.

### Fonts

Font CSS variables exposed on `<html>`:
- `--font-outfit` (body default)
- `--font-bricolage` (display/headings)
- `--font-serif` (Instrument Serif)
- `--font-mono` (JetBrains Mono)
- `--font-orbitron` (arcade/tech display)
- `--font-rajdhani` (labels/badges)
