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

> The `dev` script intentionally passes `--webpack`. Running `next dev` directly (without the flag) will not work in this Next.js 16 setup — use the npm script.

## Stack

- **Next.js 16.2.2** · **React 19** · **TypeScript** · **Tailwind CSS v4**
- **GSAP + ScrollTrigger** for all scroll-driven animations
- **Lenis** for smooth scrolling, piped through GSAP's ticker (one RAF loop — see `SmoothScroll.tsx`)
- **Web3Forms** for the contact form (endpoint key via env, honeypot field for bot prevention — see `Contact.tsx`)
- All fonts are self-hosted via `@fontsource` packages — no Google Fonts network requests

## Path alias

TypeScript path alias `@/*` maps to `./src/*` (see `tsconfig.json`). All internal imports use it — match this style.

## Architecture

This is a single-page portfolio (`src/app/page.tsx`) with two additional routes: `/arcade` and `/secret`.

### Directory layout

```
src/
├── app/                         routes — page.tsx, arcade/, secret/, globals.css
├── components/                  section + UI components
│   ├── arcade/                  arcade page UI (nav, featured, cards, overlay, leaderboard)
│   ├── games/                   canvas game engines (Snake, Breakout, Pong, Invaders, Secret)
│   ├── hunt/                    clue toast, achievement widget, hidden terminal
│   └── void/                    post-arcade narrative section
├── context/HuntContext.tsx      15-clue state machine + localStorage persistence
├── data/clues.ts                clue chain + prerequisite graph
└── hooks/useMediaQuery.ts       SSR-safe responsive hook (uses `useSyncExternalStore`)
```

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

`ArcadeCurtain` listens for sustained scroll momentum past the footer and triggers a curtain transition to `/arcade`. Both wheel and touch input are wired through the same momentum math, so mobile swipe-at-footer behaves identically to desktop wheel. Flicks bounce off intentionally — the trigger demands deliberate, sustained input. The arcade page contains Snake, Breakout, Pong, and Invaders, plus a fifth `SecretGame` unlocked after collecting enough clues. Game high scores live in `HuntContext` alongside clue progress.

### `/now` channel (`src/app/now/` + Sanity)

`/now` is a sci-fi devlog channel backed by Sanity CMS. Two routes:

- `/now` — signal-intercept card feed of all log entries.
- `/now/[slug]` — detail page with metadata strip, body, footer nav.

Both routes are `force-static` and pre-render at build time via `generateStaticParams`. ISR is nodejs-only in Next 16 (incompatible with edge), and this app uses webhook-based invalidation only — no timed revalidate. Posts are authored in the embedded Studio at `/studio` and publish without a redeploy via a Sanity webhook to `/api/revalidate`, which calls `revalidateTag("logs", "max")` + `revalidatePath`. Log bodies use Portable Text with custom blocks: `redacted` (clickable, optional hunt-clue trigger via `unlockClue`), `glitch`, `terminalBlock`, `asciiBlock`, `transmissionBlock`, `signalChip`, `codeBlock`, `imageBlock`. CLASSIFIED priority logs are gated behind `DecryptShell` until the user presses DECRYPT (state stored in `akash_now_decrypted` localStorage key).

First-time visitors see a one-time boot sequence overlay (flag: `akash_now_booted`). Any key, touch, or pointerdown skips it.

Required env vars (see `.env.local.example`): `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`, `SANITY_API_READ_TOKEN`, `SANITY_WEBHOOK_SECRET`.

### Fonts

Font CSS variables exposed on `<html>`:
- `--font-outfit` (body default)
- `--font-bricolage` (display/headings)
- `--font-serif` (Instrument Serif)
- `--font-mono` (JetBrains Mono)
- `--font-orbitron` (arcade/tech display)
- `--font-rajdhani` (labels/badges)
