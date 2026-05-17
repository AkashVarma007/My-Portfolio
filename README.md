<div align="center">

<pre>
 █████   ██   ██   █████   ██████  ██   ██
██   ██  ██  ██   ██   ██  ██      ██   ██
███████  █████    ███████  ██████  ███████
██   ██  ██  ██   ██   ██      ██  ██   ██
██   ██  ██   ██  ██   ██  ██████  ██   ██
</pre>

**⚡ Full-Stack → Platform Engineer · Personal Portfolio ⚡**

<p align="center">
  <a href="https://nextjs.org"><img alt="Next.js" src="https://img.shields.io/badge/Next.js-16.2-000000?style=flat-square&logo=next.js&logoColor=white"></a>
  <a href="https://react.dev"><img alt="React" src="https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=black"></a>
  <a href="https://www.typescriptlang.org"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white"></a>
  <a href="https://tailwindcss.com"><img alt="Tailwind" src="https://img.shields.io/badge/Tailwind-4-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white"></a>
  <a href="https://gsap.com"><img alt="GSAP" src="https://img.shields.io/badge/GSAP-3.14-88ce02?style=flat-square&logo=greensock&logoColor=white"></a>
  <a href="https://lenis.darkroom.engineering"><img alt="Lenis" src="https://img.shields.io/badge/Lenis-1.3-f5f5f5?style=flat-square&logoColor=black"></a>
  <a href="LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-blue?style=flat-square"></a>
</p>

</div>

> 🎮 Not just another portfolio. A single-page experience built with cinematic scroll choreography, a hidden 15-clue scavenger hunt threaded through every section, and a full retro arcade with four playable games — Snake, Breakout, Pong, Space Invaders. Every section earns its scroll. Every interaction has a secret. 🚀

<div align="center">

[Features](#-features) &nbsp;•&nbsp; [Architecture](#%EF%B8%8F-architecture) &nbsp;•&nbsp; [Quick Start](#-quick-start) &nbsp;•&nbsp; [Animation System](#-animation-system) &nbsp;•&nbsp; [Scavenger Hunt](#-scavenger-hunt) &nbsp;•&nbsp; [Stack](#-stack) &nbsp;•&nbsp; [Troubleshooting](#-troubleshooting)

</div>

---

## ✨ Features

| | |
|---|---|
| 🎬 **GSAP-driven scroll choreography** | Class-based animation registry — fade-ups, parallax orbs, 3D tilt cards, alternating timeline reveals, marquee speed modulation |
| 🕹️ **Hidden retro arcade** | Snake · Breakout · Pong · Space Invaders, plus a fifth game unlocked after collecting 5 clues |
| 🔍 **15-clue scavenger hunt** | Four tiers of clues woven through sections, games, and the DOM. State persists to `localStorage` |
| 🎞️ **Cinematic curtain transition** | Scroll-momentum ring at the footer triggers a glitch-neon ARCADE curtain drop into `/arcade` |
| 🪶 **One RAF loop** | Lenis smooth scroll piped through GSAP's ticker — no fighting requestAnimationFrame hooks |
| 📱 **Touch + wheel parity** | Mobile users trigger arcade via swipe at the footer; same momentum math as desktop wheel |
| 🎨 **Self-hosted fonts** | Outfit · Bricolage Grotesque · Instrument Serif · JetBrains Mono · Orbitron · Rajdhani — zero Google Fonts requests |
| 🤫 **Hidden terminal + `/secret`** | Konami-style discoveries reward curious devtools poking and clue chain completion |

## 🗺️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  src/app/                                                    │
│  ├─ page.tsx          ──► single-page portfolio (Hero…Footer)│
│  ├─ arcade/page.tsx   ──► /arcade — games + VoidSection      │
│  └─ secret/page.tsx   ──► /secret — final-clue terminal      │
│                                                              │
│  src/components/                                             │
│  ├─ AnimationProvider ──► registers ALL GSAP tweens globally │
│  ├─ SmoothScroll      ──► Lenis ↔ GSAP ticker bridge         │
│  ├─ ArcadeCurtain     ──► wheel + touch momentum trigger     │
│  ├─ Hero / About / Journey / Projects / Skills / Contact     │
│  ├─ arcade/           ──► nav · featured · cards · overlay   │
│  ├─ games/            ──► canvas-rendered game engines       │
│  ├─ hunt/             ──► clue toast · achievement widget    │
│  └─ void/             ──► post-arcade narrative section      │
│                                                              │
│  src/context/HuntContext  ──► 15-clue state + persistence    │
│  src/data/clues.ts        ──► clue chain + prerequisites     │
│  src/hooks/useMediaQuery  ──► SSR-safe responsive hook       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

The site is structurally a single Next.js App Router page (`/`) with two side routes (`/arcade`, `/secret`). Animations are declared via CSS classes on JSX elements; `AnimationProvider` queries them once on mount and binds GSAP timelines globally.

## 🚀 Quick Start

> 🧰 **You will need:** Node.js **20+** · npm **10+**

### 1️⃣  Clone and install

```bash
git clone https://github.com/AkashVarma007/My-Portfolio.git
cd My-Portfolio
npm install
```

✅ **Verify:** `node_modules/` appears at the repo root.

### 2️⃣  Run the dev server

```bash
npm run dev
```

✅ **Verify:** Terminal prints `Ready in <Xms>` and `http://localhost:3000` renders the hero.

> ⚠️ The `dev` script intentionally uses `next dev --webpack`. The webpack flag is required by this Next.js 16 build — see `package.json`.

### 3️⃣  Production build

```bash
npm run build
npm run start
# or in one shot:
npm run preview
```

✅ **Verify:** Build completes with no type errors; production server serves at `:3000`.

### 4️⃣  Find the first clue

Scroll to the footer. Hover the faint **"every end is a beginning"** line. Then keep scrolling.

✅ **Verify:** A red progress ring appears in the bottom-right corner and fills as you scroll. Sustained scroll wins — flicks bounce off. 🎮

## 🎬 Animation System

`AnimationProvider` is a renderless component mounted once. It queries CSS class selectors on mount and binds GSAP + ScrollTrigger tweens. Components opt in by adding a class:

| Class | Effect |
|-------|--------|
| `.gsap-fade-up` | Fade + translate-up on scroll enter |
| `.gsap-fade-in` | Opacity fade on scroll enter |
| `.gsap-orb` | Parallax vertical drift (alternating direction by index) |
| `.gsap-project-card` | Staggered 3D tilt entry |
| `.gsap-journey-card` | Alternating slide-in from left / right |
| `.gsap-skill-card` | Scale-up stagger with `back.out(1.4)` ease |
| `.gsap-hero-line` | Dramatic stagger on initial load |
| `.gsap-marquee-row` | Horizontal speed modulation tied to scroll velocity |

All `<h2>` elements get a clip-path reveal automatically — no class needed. Use `data-delay="0.2"` on fade-up / fade-in elements to stagger within a group.

## 🔍 Scavenger Hunt

15 clues across 4 tiers. Each clue unlocks the next via a prerequisite chain. State persists to `localStorage` under the key `akash_hunt`. Rewards include the secret fifth arcade game and the `/secret` route.

```text
Tier 1  ──►  Discover the arcade           (cryptic footer line + scroll momentum)
Tier 2  ──►  Decode VoidSection fragments  (cipher + ordered icon clicks)
Tier 3  ──►  Game-embedded secrets         (Snake = 42 · Invaders wave 10 · …)
Tier 4  ──►  Compose the final cipher      (unlocks /secret)
```

- 🎯 The clue chain lives in `src/data/clues.ts`
- 💾 Persistence handled by `HuntContext` (custom React context + localStorage)
- 🔔 Toast notifications fire globally from `<ClueToast />`
- 🏆 Progress badge lives in `<AchievementWidget />`

## 🧱 Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Next.js 16** | App Router, RSC, edge-ready |
| Runtime | **React 19** | Latest concurrent features (`useSyncExternalStore` for the media query hook) |
| Styling | **Tailwind v4** | New Oxide engine, CSS-first config |
| Animation | **GSAP 3.14 + ScrollTrigger** | Predictable timeline control, single source of truth |
| Smooth scroll | **Lenis 1.3** | Piped through GSAP's ticker — one RAF loop |
| Type system | **TypeScript 5** | Strict mode across the codebase |
| Fonts | **`@fontsource`** | Self-hosted, zero Google Fonts requests |
| Forms | **Web3Forms** | Static-friendly contact form with honeypot |

## 📂 Project Layout

```
src/
├── app/              Next.js routes (page, arcade, secret) + globals.css
├── components/       Section components, animations, arcade UI, games, hunt UI
├── context/          HuntContext.tsx — clue state machine
├── data/             clues.ts — 15-clue chain definition
└── hooks/            useMediaQuery / useIsMobile (SSR-safe)
```

## 🩹 Troubleshooting

<details>
<summary><b>Dev server fails or behaves oddly</b></summary>

Next.js 16 in this project requires the `--webpack` flag explicitly. The npm script already includes it — run `npm run dev`, not `next dev` directly.
</details>

<details>
<summary><b>Arcade curtain won't trigger on mobile</b></summary>

You need to be at the bottom of the page. Swipe up repeatedly while at the footer — a red progress ring appears in the corner and fills with each sustained swipe. Idle for ~150ms and the ring decays. Flicks bounce off intentionally; the trigger demands deliberate, sustained input.
</details>

<details>
<summary><b>Clue toast didn't appear after an action</b></summary>

Hunt state persists to `localStorage` under `akash_hunt`. Open devtools → Application → Local Storage and inspect the key. Clue prerequisites form a chain — earlier clues must be collected before later ones can be attempted. Check `canAttemptClue(n)` in `HuntContext` for the gating logic.
</details>

<details>
<summary><b>Resetting the hunt</b></summary>

```js
localStorage.removeItem('akash_hunt');
location.reload();
```
</details>

<details>
<summary><b>Animations not firing</b></summary>

`AnimationProvider` queries classes once on mount. If you add a new element dynamically after mount, the tween won't auto-bind. Either register it manually with GSAP/ScrollTrigger or wrap the element with one of the existing class hooks (`gsap-fade-up`, `gsap-fade-in`, etc.).
</details>

## 📄 License

[MIT](LICENSE)

<div align="center">

**Built with ⚡ GSAP, ☕ caffeine, and an unreasonable number of easter eggs.**

<sub>⭐ Star it if you found at least one clue.</sub>

</div>
