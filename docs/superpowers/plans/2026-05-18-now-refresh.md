# /now Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `/now` UI with a Live Signal HUD aesthetic — live waveform hero, intercept-card grid, refreshed detail page, and a signal-interception curtain on nav from the main site. Keep Sanity schema/data flow/hunt integration untouched. Use only the existing `/now` color palette.

**Architecture:** Pure UI layer rewrite. New atomic component (`SignalWaveform`) feeds new page-level components (`SignalHero`, `SignalCard`, `SignalGrid`, `SignalMetaStrip`, `SignalNavRail`) which replace the existing hero/card/header/footer pieces. A global `NowCurtain` listens for a CustomEvent fired by the main nav's "Now" link and plays a 4-phase reveal sequence (interception → lock → handoff). All colors come from existing CSS variables in `now.css`.

**Tech Stack:** Next.js 16 (App Router, `force-static`), React 19, TypeScript, Tailwind v4, SVG (waveform), `@fontsource` mono/display fonts, existing `useMediaQuery` hook.

**Project conventions:**
- Path alias `@/*` → `src/*`
- Dev: `npm run dev` (`--webpack` flag wired in the script)
- Lint: `npm run lint`
- Build: `npm run build`
- No test suite — every component is verified by manual visual check + lint + build
- Commits: project follows mixed conventional/sentence style. Use lowercase `feat:` / `refactor:` / `chore:` prefix. Each commit ends with the Claude Code co-author line.

**User policy on commits:** the user's global CLAUDE.md requires explicit confirmation before any `git commit`. Before each commit step in this plan, ask: *"OK to commit task N: '<message>'?"* and wait for approval. Do not skip this. (Plan still includes the commit step so the executor knows the boundary; the executor's job is to ask, then run.)

**Spec reference:** `docs/superpowers/specs/2026-05-18-now-refresh-design.md`

**Palette tokens (no new colors):**
- `--now-bg`, `--now-fg`, `--now-dim`
- `--now-accent` (cyan #62e8ff)
- `--now-accent-warm` (warm orange #ff8a3d)
- `--now-classified` (red #ff3b5c)
- `--now-line` (rgba(98,232,255,0.18))

---

## File map

### New files

| Path | Type |
|---|---|
| `src/components/now/SignalWaveform.tsx` | client |
| `src/components/now/SignalCard.tsx` | server |
| `src/components/now/SignalGrid.tsx` | server |
| `src/components/now/SignalHero.tsx` | client |
| `src/components/now/SignalMetaStrip.tsx` | server |
| `src/components/now/SignalNavRail.tsx` | server |
| `src/components/now/NowCurtain.tsx` | client |

### Modified files

| Path | Change |
|---|---|
| `src/app/now/now.css` | Add card / frame / corner / rail / hud-corner classes + curtain animations. No new vars. |
| `src/app/now/page.tsx` | Swap to `SignalHero` + `SignalGrid`. |
| `src/app/now/[slug]/page.tsx` | Replace `LogHeader` + `LogTitle` + `FooterNav` with waveform strip + title block + `SignalMetaStrip` + `SignalNavRail`. |
| `src/app/layout.tsx` | Mount `<NowCurtain />` at root. |
| `src/components/Navigation.tsx` | Intercept "Now" link click → dispatch `trigger-now-curtain` CustomEvent. |

### Removed files

| Path | Reason |
|---|---|
| `src/components/now/HeroBanner.tsx` | superseded by `SignalHero` |
| `src/components/now/LogCard.tsx` | superseded by `SignalCard` |
| `src/components/now/EmptyState.tsx` | folded into `SignalGrid` empty branch |
| `src/components/now/LogHeader.tsx` | folded into detail page header |
| `src/components/now/LogTitle.tsx` | folded into detail page header |
| `src/components/now/FooterNav.tsx` | superseded by `SignalNavRail` |

---

## Task 1: Add new CSS classes to `now.css`

**Files:**
- Modify: `src/app/now/now.css` (append after line 154)

- [ ] **Step 1.1: Append the new class block**

Append this block to the end of `src/app/now/now.css`. Do NOT remove or modify existing classes — only add at the bottom.

```css

/* ===== /now refresh: HUD elements ===== */

.signal-card {
  position: relative;
  border: 1px solid var(--now-line);
  background: linear-gradient(180deg, rgba(98, 232, 255, 0.02), transparent);
  padding: 1.25rem 1.25rem 1.5rem;
  transition: transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
}
.signal-card:hover {
  transform: translateY(-4px);
  border-color: rgba(98, 232, 255, 0.35);
  box-shadow: 0 12px 30px -16px rgba(98, 232, 255, 0.25);
}
.signal-card--featured {
  border-color: rgba(255, 138, 61, 0.45);
}
.signal-card--featured:hover {
  border-color: rgba(255, 138, 61, 0.75);
  box-shadow: 0 12px 30px -16px rgba(255, 138, 61, 0.3);
}
.signal-card--classified {
  border-color: rgba(255, 59, 92, 0.45);
}
.signal-card--classified:hover {
  border-color: rgba(255, 59, 92, 0.75);
  box-shadow: 0 12px 30px -16px rgba(255, 59, 92, 0.3);
}

.signal-frame {
  position: relative;
  border: 1px solid var(--now-line);
  padding: 2rem 1.5rem;
}
@media (min-width: 768px) {
  .signal-frame {
    padding: 2.5rem 2.5rem;
  }
}

.signal-corner {
  position: absolute;
  width: 12px;
  height: 12px;
  border: 1px solid var(--now-accent);
  pointer-events: none;
}
.signal-corner--tl { top: -1px; left: -1px; border-right: 0; border-bottom: 0; }
.signal-corner--tr { top: -1px; right: -1px; border-left: 0; border-bottom: 0; }
.signal-corner--bl { bottom: -1px; left: -1px; border-right: 0; border-top: 0; }
.signal-corner--br { bottom: -1px; right: -1px; border-left: 0; border-top: 0; }

.signal-rail {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  padding: 1rem;
  border: 1px solid var(--now-line);
  transition: border-color 200ms ease, transform 200ms ease;
}
.signal-rail:hover {
  border-color: rgba(98, 232, 255, 0.4);
  transform: translateY(-2px);
}

.hud-corner {
  position: absolute;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.hud-corner--bl { bottom: 1.25rem; left: 1.25rem; color: var(--now-accent-warm); }
.hud-corner--br { bottom: 1.25rem; right: 1.25rem; color: var(--now-accent); }

@keyframes signal-pulse {
  0%, 100% { opacity: 0.45; }
  50% { opacity: 1; }
}
.signal-pulse-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--now-accent);
  box-shadow: 0 0 8px rgba(98, 232, 255, 0.7);
  margin-right: 0.5rem;
  animation: signal-pulse 1.4s ease-in-out infinite;
}

@keyframes signal-scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}
.now-curtain__scanlines {
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    to bottom,
    rgba(98, 232, 255, 0.08) 0,
    rgba(98, 232, 255, 0.08) 1px,
    transparent 1px,
    transparent 3px
  );
  pointer-events: none;
}
.now-curtain__sweep {
  position: absolute;
  inset: -10vh 0 auto 0;
  height: 4px;
  background: linear-gradient(to bottom, transparent, var(--now-classified), transparent);
  box-shadow: 0 0 24px rgba(255, 59, 92, 0.6);
  animation: signal-scanline 0.6s linear forwards;
}

@media (prefers-reduced-motion: reduce) {
  .signal-card { transition: none; }
  .signal-card:hover { transform: none; }
  .signal-rail { transition: none; }
  .signal-rail:hover { transform: none; }
  .signal-pulse-dot { animation: none; opacity: 1; }
}
```

- [ ] **Step 1.2: Run lint**

Run: `npm run lint`
Expected: clean (lint does not validate CSS — this just confirms no JS broke).

- [ ] **Step 1.3: Ask for commit approval, then commit**

Ask user: "OK to commit Task 1: 'feat(now): add HUD CSS primitives for /now refresh'?"

After approval:
```bash
git add src/app/now/now.css
git commit -m "$(cat <<'EOF'
feat(now): add HUD CSS primitives for /now refresh

Adds signal-card / signal-frame / signal-corner / signal-rail / hud-corner classes
plus pulse-dot + curtain scanline keyframes. All styling uses existing palette
tokens — no new color vars.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: `SignalWaveform` component

**Files:**
- Create: `src/components/now/SignalWaveform.tsx`

The atomic primitive everything else depends on. Deterministic SVG path from a seed string. Optional live animation via rAF, throttled to 30fps. Respects `prefers-reduced-motion`.

- [ ] **Step 2.1: Create the file**

Create `src/components/now/SignalWaveform.tsx`:

```tsx
// src/components/now/SignalWaveform.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const COLOR_MAP = {
  cyan: "var(--now-accent)",
  warm: "var(--now-accent-warm)",
  red: "var(--now-classified)",
} as const;

export type SignalWaveColor = keyof typeof COLOR_MAP;

type SignalWaveformProps = {
  seed: string;
  live?: boolean;
  color?: SignalWaveColor;
  height?: number;
  amplitude?: number;
  jitter?: boolean;
  className?: string;
};

const POINTS = 60;
const VIEW_W = 800;
const FRAME_MS = 1000 / 30;
const PHASE_STEP = 0.06;

function hashSeed(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildPath(
  seedHash: number,
  phase: number,
  amplitude: number,
  jitter: boolean,
  height: number
): string {
  const rand = mulberry32(seedHash);
  const mid = height / 2;
  const ampPx = height * 0.4;
  const harmonicPx = height * 0.15;
  const noisePx = jitter ? height * 0.6 : height * 0.08;

  const segments: string[] = [];
  for (let i = 0; i < POINTS; i++) {
    const x = i / (POINTS - 1);
    const sine = Math.sin(x * Math.PI * 6 + phase) * amplitude * ampPx;
    const sine2 = Math.sin(x * Math.PI * 13 + phase * 1.7) * amplitude * harmonicPx;
    const noise = (rand() - 0.5) * noisePx;
    const y = mid + sine + sine2 + noise;
    segments.push(`${i === 0 ? "M" : "L"}${(x * VIEW_W).toFixed(2)},${y.toFixed(2)}`);
  }
  return segments.join(" ");
}

export function SignalWaveform({
  seed,
  live = false,
  color = "cyan",
  height = 60,
  amplitude = 0.6,
  jitter = false,
  className,
}: SignalWaveformProps) {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const seedHash = hashSeed(seed);
  const [d, setD] = useState(() =>
    buildPath(seedHash, 0, amplitude, jitter, height)
  );
  const phaseRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!live || reducedMotion) return;

    let last = performance.now();

    const loop = (now: number) => {
      if (typeof document !== "undefined" && document.hidden) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }
      if (now - last >= FRAME_MS) {
        phaseRef.current += PHASE_STEP;
        setD(buildPath(seedHash, phaseRef.current, amplitude, jitter, height));
        last = now;
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [live, reducedMotion, seedHash, amplitude, jitter, height]);

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${height}`}
      preserveAspectRatio="none"
      className={className}
      style={{ width: "100%", height, display: "block" }}
      aria-hidden="true"
    >
      <path
        d={d}
        fill="none"
        stroke={COLOR_MAP[color]}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
```

- [ ] **Step 2.2: Run lint**

Run: `npm run lint`
Expected: clean, no warnings/errors mentioning `SignalWaveform.tsx`.

- [ ] **Step 2.3: Manual smoke check (optional but recommended)**

Briefly drop `<SignalWaveform seed="test" live color="cyan" height={120} />` into `src/app/now/page.tsx` above the existing hero. Run `npm run dev` and open http://localhost:3000/now. Confirm the waveform draws and animates. Then revert that test render — do not commit it.

- [ ] **Step 2.4: Ask for commit approval, then commit**

Ask user: "OK to commit Task 2: 'feat(now): add SignalWaveform component'?"

After approval:
```bash
git add src/components/now/SignalWaveform.tsx
git commit -m "$(cat <<'EOF'
feat(now): add SignalWaveform component

Deterministic SVG waveform driven by seed hash + mulberry32 PRNG.
Optional rAF-driven live mode throttled to 30fps; pauses when document.hidden;
respects prefers-reduced-motion.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: `SignalCard` component

**Files:**
- Create: `src/components/now/SignalCard.tsx`

Renders one log as an intercept card. Server component. Uses `<SignalWaveform>` (client) inside. Handles featured + classified variants. Card is wrapped in `<Link>` to the detail page.

- [ ] **Step 3.1: Create the file**

```tsx
// src/components/now/SignalCard.tsx
import Link from "next/link";
import { SignalWaveform, type SignalWaveColor } from "./SignalWaveform";
import type { LogSummary } from "@/lib/sanity/types";

type SignalCardProps = {
  log: LogSummary;
  featured?: boolean;
};

function paddedId(id: number): string {
  return `CALLSIGN_${String(id).padStart(3, "0")}`;
}

function formatDate(iso: string): string {
  return iso.slice(0, 10).replace(/-/g, ".");
}

function resolveColor(featured: boolean, classified: boolean): SignalWaveColor {
  if (classified) return "red";
  if (featured) return "warm";
  return "cyan";
}

function tagColorClass(tag: string): string {
  if (tag === "SHIP") return "text-[color:var(--now-accent-warm)] border-[color:rgba(255,138,61,0.4)]";
  return "text-[color:var(--now-accent)] border-[color:var(--now-line)]";
}

export function SignalCard({ log, featured = false }: SignalCardProps) {
  const classified = log.priority === "CLASSIFIED";
  const high = log.priority === "HIGH";
  const color = resolveColor(featured, classified);

  const cardClass = [
    "signal-card",
    "block",
    "group",
    featured && !classified ? "signal-card--featured" : "",
    classified ? "signal-card--classified" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link
      href={`/now/${log.slug}`}
      aria-label={`Open ${paddedId(log.id)}: ${classified ? "classified transmission" : log.title}`}
      className={cardClass}
    >
      <SignalWaveform
        seed={log.slug}
        color={color}
        height={42}
        amplitude={0.65}
        jitter={classified}
      />

      <div className="mt-3 flex items-center justify-between font-[var(--font-mono)] text-[10px] md:text-[11px] text-[color:var(--now-dim)] uppercase tracking-[0.15em]">
        <span>
          {classified ? "CLASSIFIED" : log.tags[0] ?? "SIGNAL"} ·{" "}
          {formatDate(log.publishedAt)}
        </span>
        <span>INTERCEPT · {String(log.id).padStart(3, "0")}</span>
      </div>

      <div className="mt-4 font-[var(--font-mono)] text-[11px] text-[color:var(--now-dim)] tracking-[0.2em]">
        {paddedId(log.id)}
      </div>

      <h3 className="mt-1 text-2xl md:text-3xl font-[var(--font-bricolage)] leading-tight text-[color:var(--now-fg)]">
        {classified ? (
          <span className="inline-block bg-black text-transparent select-none">
            ████████████████
          </span>
        ) : (
          log.title
        )}
      </h3>

      <p className="mt-3 text-sm md:text-base text-[color:var(--now-fg)]/70 leading-relaxed line-clamp-2">
        {classified ? (
          <span className="inline-block bg-black text-transparent select-none">
            ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
          </span>
        ) : (
          log.excerpt
        )}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {log.tags.map((tag) => (
          <span
            key={tag}
            className={`px-2 py-0.5 border font-[var(--font-mono)] text-[10px] uppercase tracking-[0.15em] ${tagColorClass(tag)}`}
          >
            {tag}
          </span>
        ))}
        {classified ? (
          <span className="ml-auto font-[var(--font-mono)] text-[10px] uppercase tracking-[0.15em] text-[color:var(--now-classified)]">
            [DECRYPT TO VIEW]
          </span>
        ) : high ? (
          <span className="ml-auto font-[var(--font-mono)] text-[10px] uppercase tracking-[0.15em] text-[color:var(--now-accent-warm)]">
            PRIO · HIGH
          </span>
        ) : (
          <span className="ml-auto font-[var(--font-mono)] text-[10px] uppercase tracking-[0.15em] text-[color:var(--now-accent)] transition-transform group-hover:translate-x-1">
            READ SIGNAL →
          </span>
        )}
      </div>
    </Link>
  );
}
```

- [ ] **Step 3.2: Run lint**

Run: `npm run lint`
Expected: clean.

- [ ] **Step 3.3: Ask for commit approval, then commit**

Ask user: "OK to commit Task 3: 'feat(now): add SignalCard component'?"

After approval:
```bash
git add src/components/now/SignalCard.tsx
git commit -m "$(cat <<'EOF'
feat(now): add SignalCard component

Intercept-card renderer for a LogSummary. Featured + classified variants
swap accent color (warm / red). Waveform glyph seeded by slug. All chrome
uses existing palette tokens.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: `SignalGrid` component

**Files:**
- Create: `src/components/now/SignalGrid.tsx`

Wraps the grid layout and handles the empty state inline (replacing `EmptyState`).

- [ ] **Step 4.1: Create the file**

```tsx
// src/components/now/SignalGrid.tsx
import { SignalCard } from "./SignalCard";
import { SignalWaveform } from "./SignalWaveform";
import type { LogSummary } from "@/lib/sanity/types";

type SignalGridProps = {
  logs: LogSummary[];
};

export function SignalGrid({ logs }: SignalGridProps) {
  if (logs.length === 0) {
    return (
      <section className="px-6 md:px-12 max-w-5xl mx-auto mt-12 md:mt-16 mb-32">
        <div className="signal-card">
          <SignalWaveform
            seed="no-signal"
            color="cyan"
            height={48}
            amplitude={0.3}
            jitter
          />
          <div className="mt-6 font-[var(--font-bricolage)] text-2xl md:text-3xl text-[color:var(--now-fg)]/70">
            NO SIGNALS DETECTED
          </div>
          <p className="mt-2 font-[var(--font-mono)] text-xs md:text-sm text-[color:var(--now-dim)]">
            standby — first transmission incoming.
          </p>
          <div className="mt-6 flex items-center font-[var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-[color:var(--now-accent)]">
            <span className="signal-pulse-dot" aria-hidden="true" />
            monitoring channel
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 md:px-12 max-w-5xl mx-auto mt-12 md:mt-16 mb-32 grid grid-cols-1 md:grid-cols-2 gap-6">
      {logs.map((log, idx) => (
        <SignalCard key={log._id} log={log} featured={idx === 0} />
      ))}
    </section>
  );
}
```

- [ ] **Step 4.2: Run lint**

Run: `npm run lint`
Expected: clean.

- [ ] **Step 4.3: Ask for commit approval, then commit**

Ask user: "OK to commit Task 4: 'feat(now): add SignalGrid with empty state'?"

After approval:
```bash
git add src/components/now/SignalGrid.tsx
git commit -m "$(cat <<'EOF'
feat(now): add SignalGrid with empty state

2-col responsive grid renders SignalCards; first card flagged featured.
Empty state replaces the old EmptyState component with a HUD-styled
"no signal" intercept card.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: `SignalHero` component

**Files:**
- Create: `src/components/now/SignalHero.tsx`

The live hero. Top chip, big animated waveform, display title, rotating subtitle, two HUD corner labels (warm coords, cyan ticking timestamp). Client component because of the ticking + rotation.

- [ ] **Step 5.1: Create the file**

```tsx
// src/components/now/SignalHero.tsx
"use client";

import { useEffect, useState } from "react";
import { SignalWaveform } from "./SignalWaveform";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const SUBTITLES = [
  "transmissions from the void",
  "open signal channel",
  "real-time devlog",
];

const ROTATION_MS = 4000;

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function formatElapsed(start: number, now: number): string {
  const sec = Math.floor((now - start) / 1000);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `T+ ${pad(h)}:${pad(m)}:${pad(s)}`;
}

type SignalHeroProps = {
  logCount: number;
};

export function SignalHero({ logCount }: SignalHeroProps) {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [subtitleIdx, setSubtitleIdx] = useState(0);
  const [now, setNow] = useState<number | null>(null);
  const [start] = useState(() => Date.now());

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const id = window.setInterval(() => {
      setSubtitleIdx((i) => (i + 1) % SUBTITLES.length);
    }, ROTATION_MS);
    return () => window.clearInterval(id);
  }, [reducedMotion]);

  const padded = String(logCount).padStart(3, "0");

  return (
    <header className="relative px-6 md:px-12 pt-24 md:pt-32 pb-12 md:pb-20 max-w-5xl mx-auto">
      <div className="signal-frame">
        <span className="signal-corner signal-corner--tl" aria-hidden="true" />
        <span className="signal-corner signal-corner--tr" aria-hidden="true" />
        <span className="signal-corner signal-corner--bl" aria-hidden="true" />
        <span className="signal-corner signal-corner--br" aria-hidden="true" />

        <div className="flex items-center justify-center font-[var(--font-mono)] text-[11px] md:text-xs uppercase tracking-[0.25em] text-[color:var(--now-accent)]">
          <span className="signal-pulse-dot" aria-hidden="true" />
          STATUS: ONLINE · STREAM: ACTIVE · LOGS: {padded}
        </div>

        <div className="mt-8 md:mt-10">
          <SignalWaveform
            seed="now-akash-hero"
            live
            color="cyan"
            height={140}
            amplitude={0.7}
          />
        </div>

        <h1 className="mt-8 md:mt-10 text-center font-[var(--font-bricolage)] text-5xl md:text-7xl tracking-tight text-[color:var(--now-fg)]">
          NOW.AKASH
        </h1>

        <p
          aria-live="polite"
          className="mt-3 text-center font-[var(--font-mono)] text-xs md:text-sm uppercase tracking-[0.3em] text-[color:var(--now-dim)] transition-opacity duration-700"
          key={subtitleIdx}
        >
          {SUBTITLES[subtitleIdx]}
        </p>

        <span className="hud-corner hud-corner--bl" aria-hidden="true">
          LAT 12.97 // LON 77.59 // BLR-IN
        </span>
        <span className="hud-corner hud-corner--br" aria-hidden="true">
          {now ? formatElapsed(start, now) : "T+ 00:00:00"}
        </span>
      </div>
    </header>
  );
}
```

- [ ] **Step 5.2: Run lint**

Run: `npm run lint`
Expected: clean.

- [ ] **Step 5.3: Ask for commit approval, then commit**

Ask user: "OK to commit Task 5: 'feat(now): add SignalHero with live waveform'?"

After approval:
```bash
git add src/components/now/SignalHero.tsx
git commit -m "$(cat <<'EOF'
feat(now): add SignalHero with live waveform

HUD-framed hero: pulsing online chip, animated cyan waveform, large
display title, rotating subtitle, warm-orange coords (BL) + cyan ticking
T+ timestamp (BR). Honors prefers-reduced-motion.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Wire `/now/page.tsx` to new hero + grid

**Files:**
- Modify: `src/app/now/page.tsx`

- [ ] **Step 6.1: Replace the file contents**

Replace the entire file with:

```tsx
// src/app/now/page.tsx
import { fetchAllLogs } from "@/lib/sanity/queries";
import { SignalHero } from "@/components/now/SignalHero";
import { SignalGrid } from "@/components/now/SignalGrid";

export const dynamic = "force-static";

export default async function NowIndexPage() {
  const logs = await fetchAllLogs();

  return (
    <>
      <SignalHero logCount={logs.length} />
      <SignalGrid logs={logs} />
    </>
  );
}
```

- [ ] **Step 6.2: Run lint**

Run: `npm run lint`
Expected: clean. If lint complains about unused `HeroBanner` / `EmptyState` / `LogCard` imports — those are gone now, so this should be fine.

- [ ] **Step 6.3: Visual check in dev**

Run: `npm run dev` (or use the already-running server).
Open: http://localhost:3000/now
Confirm:
- Hero frame with corner brackets is visible
- Top chip "STATUS: ONLINE · STREAM: ACTIVE · LOGS: 000" with pulsing cyan dot
- Animated waveform
- Big "NOW.AKASH" title
- Rotating subtitle (wait 4s to see it change)
- Warm-orange coords bottom-left
- Cyan ticking T+ timestamp bottom-right
- Empty state intercept card below ("NO SIGNALS DETECTED")

- [ ] **Step 6.4: Ask for commit approval, then commit**

Ask user: "OK to commit Task 6: 'refactor(now): swap /now page to SignalHero + SignalGrid'?"

After approval:
```bash
git add src/app/now/page.tsx
git commit -m "$(cat <<'EOF'
refactor(now): swap /now page to SignalHero + SignalGrid

Replaces HeroBanner + inline LogCard map + EmptyState branch with the
new Signal* components. Data layer unchanged.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Delete superseded feed components

**Files:**
- Delete: `src/components/now/HeroBanner.tsx`
- Delete: `src/components/now/LogCard.tsx`
- Delete: `src/components/now/EmptyState.tsx`

- [ ] **Step 7.1: Confirm no remaining imports**

Run: `grep -rn "HeroBanner\|LogCard\|EmptyState" src/`

Expected: only `src/components/now/HeroBanner.tsx`, `src/components/now/LogCard.tsx`, `src/components/now/EmptyState.tsx` themselves should match. If anything else does, stop and inspect — there's a stray import to fix first.

- [ ] **Step 7.2: Delete the files**

```bash
rm src/components/now/HeroBanner.tsx
rm src/components/now/LogCard.tsx
rm src/components/now/EmptyState.tsx
```

- [ ] **Step 7.3: Run lint + build**

Run: `npm run lint`
Expected: clean.

Run: `npm run build`
Expected: build completes; `/now` route still resolves; no missing-module errors.

- [ ] **Step 7.4: Ask for commit approval, then commit**

Ask user: "OK to commit Task 7: 'chore(now): remove superseded feed components'?"

After approval:
```bash
git add -A src/components/now/
git commit -m "$(cat <<'EOF'
chore(now): remove superseded feed components

Drops HeroBanner / LogCard / EmptyState — replaced by Signal* equivalents.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: `SignalMetaStrip` component

**Files:**
- Create: `src/components/now/SignalMetaStrip.tsx`

Horizontal chip row for the detail page metadata. Server component.

- [ ] **Step 8.1: Create the file**

```tsx
// src/components/now/SignalMetaStrip.tsx
import type { LogDetail } from "@/lib/sanity/types";

type SignalMetaStripProps = {
  log: LogDetail;
};

function formatDate(iso: string): string {
  return iso.slice(0, 10).replace(/-/g, ".");
}

function tagChipClass(tag: string): string {
  if (tag === "SHIP") return "text-[color:var(--now-accent-warm)] border-[color:rgba(255,138,61,0.4)]";
  return "text-[color:var(--now-accent)] border-[color:var(--now-line)]";
}

export function SignalMetaStrip({ log }: SignalMetaStripProps) {
  const classified = log.priority === "CLASSIFIED";
  const high = log.priority === "HIGH";

  return (
    <div className="flex flex-wrap items-center gap-2 font-[var(--font-mono)] text-[10px] md:text-[11px] uppercase tracking-[0.18em]">
      <span className="px-2 py-1 border border-[color:var(--now-line)] text-[color:var(--now-accent)]">
        {formatDate(log.publishedAt)}
      </span>
      {log.tags.map((tag) => (
        <span key={tag} className={`px-2 py-1 border ${tagChipClass(tag)}`}>
          {tag}
        </span>
      ))}
      {log.location ? (
        <span className="px-2 py-1 border border-[color:var(--now-line)] text-[color:var(--now-dim)]">
          {log.location}
        </span>
      ) : null}
      {classified ? (
        <span className="px-2 py-1 border border-[color:rgba(255,59,92,0.45)] text-[color:var(--now-classified)]">
          PRIO · CLASSIFIED
        </span>
      ) : high ? (
        <span className="px-2 py-1 border border-[color:rgba(255,138,61,0.45)] text-[color:var(--now-accent-warm)]">
          PRIO · HIGH
        </span>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 8.2: Run lint**

Run: `npm run lint`
Expected: clean.

- [ ] **Step 8.3: Ask for commit approval, then commit**

Ask user: "OK to commit Task 8: 'feat(now): add SignalMetaStrip'?"

After approval:
```bash
git add src/components/now/SignalMetaStrip.tsx
git commit -m "$(cat <<'EOF'
feat(now): add SignalMetaStrip

Detail-page metadata chips: date, tags, optional location, priority
(when not NORMAL). All chips use palette tokens.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: `SignalNavRail` component

**Files:**
- Create: `src/components/now/SignalNavRail.tsx`

Prev/next neighbor rails with mini-waveform glyphs.

- [ ] **Step 9.1: Create the file**

```tsx
// src/components/now/SignalNavRail.tsx
import Link from "next/link";
import { SignalWaveform } from "./SignalWaveform";
import type { LogNeighbor } from "@/lib/sanity/types";

type SignalNavRailProps = {
  prev: LogNeighbor;
  next: LogNeighbor;
};

function paddedId(id: number): string {
  return `CALLSIGN_${String(id).padStart(3, "0")}`;
}

function Rail({
  neighbor,
  direction,
}: {
  neighbor: LogNeighbor;
  direction: "prev" | "next";
}) {
  if (!neighbor) {
    return (
      <div className="signal-rail opacity-40 cursor-default">
        <div className="flex-1">
          <div className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[color:var(--now-dim)]">
            {direction === "prev" ? "← END OF FEED" : "LIVE EDGE →"}
          </div>
        </div>
      </div>
    );
  }

  const arrow = direction === "prev" ? "←" : "→";
  const label = direction === "prev" ? "PREV SIGNAL" : "NEXT SIGNAL";

  return (
    <Link
      href={`/now/${neighbor.slug}`}
      className={`signal-rail ${direction === "next" ? "text-right" : ""}`}
    >
      <div className="flex-1 min-w-0">
        <div className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[color:var(--now-accent)]">
          {direction === "prev" ? `${arrow} ${label}` : `${label} ${arrow}`}
        </div>
        <div className="mt-1 font-[var(--font-mono)] text-[10px] text-[color:var(--now-dim)] tracking-[0.15em]">
          {paddedId(neighbor.id)}
        </div>
        <div className="mt-2 truncate font-[var(--font-bricolage)] text-base md:text-lg text-[color:var(--now-fg)]">
          {neighbor.title}
        </div>
      </div>
      <div className="w-24 shrink-0">
        <SignalWaveform seed={neighbor.slug} color="cyan" height={28} amplitude={0.55} />
      </div>
    </Link>
  );
}

export function SignalNavRail({ prev, next }: SignalNavRailProps) {
  return (
    <nav
      aria-label="Signal navigation"
      className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <Rail neighbor={prev} direction="prev" />
      <Rail neighbor={next} direction="next" />
    </nav>
  );
}
```

- [ ] **Step 9.2: Run lint**

Run: `npm run lint`
Expected: clean.

- [ ] **Step 9.3: Ask for commit approval, then commit**

Ask user: "OK to commit Task 9: 'feat(now): add SignalNavRail'?"

After approval:
```bash
git add src/components/now/SignalNavRail.tsx
git commit -m "$(cat <<'EOF'
feat(now): add SignalNavRail

Prev/next signal rails with mini-waveform glyph. Disabled state shows
"END OF FEED" / "LIVE EDGE" when neighbor is null.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: Wire `/now/[slug]/page.tsx` to new components

**Files:**
- Modify: `src/app/now/[slug]/page.tsx`

- [ ] **Step 10.1: Replace the file**

```tsx
// src/app/now/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  fetchAllSlugs,
  fetchLogBySlug,
  fetchPrevNext,
} from "@/lib/sanity/queries";
import { LogBody } from "@/components/now/LogBody";
import { DecryptShell } from "@/components/now/DecryptShell";
import { SignalWaveform } from "@/components/now/SignalWaveform";
import { SignalMetaStrip } from "@/components/now/SignalMetaStrip";
import { SignalNavRail } from "@/components/now/SignalNavRail";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const slugs = await fetchAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

function paddedId(id: number): string {
  return `CALLSIGN_${String(id).padStart(3, "0")}`;
}

export default async function NowDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const log = await fetchLogBySlug(slug);
  if (!log) notFound();

  const { prev, next } = await fetchPrevNext(log.publishedAt);
  const headerColor =
    log.priority === "CLASSIFIED"
      ? "red"
      : log.priority === "HIGH"
      ? "warm"
      : "cyan";

  const content = (
    <article className="px-6 md:px-12 max-w-5xl mx-auto pt-24 md:pt-32 pb-24">
      <SignalWaveform
        seed={log.slug}
        color={headerColor}
        height={56}
        amplitude={0.7}
      />

      <div className="mt-6 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-[color:var(--now-dim)]">
        SIGNAL // {paddedId(log.id)}
      </div>

      <h1 className="mt-3 font-[var(--font-bricolage)] text-4xl md:text-6xl tracking-tight text-[color:var(--now-fg)]">
        {log.title}
      </h1>

      <div className="mt-6">
        <SignalMetaStrip log={log} />
      </div>

      <div className="signal-frame mt-10">
        <span className="signal-corner signal-corner--tl" aria-hidden="true" />
        <span className="signal-corner signal-corner--tr" aria-hidden="true" />
        <span className="signal-corner signal-corner--bl" aria-hidden="true" />
        <span className="signal-corner signal-corner--br" aria-hidden="true" />
        <LogBody body={log.body ?? []} clueId={log.clueId} />
      </div>

      <SignalNavRail prev={prev} next={next} />

      <div className="mt-12 text-center">
        <Link
          href="/now"
          className="inline-block font-[var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-[color:var(--now-accent)] border border-[color:var(--now-line)] px-4 py-2 transition-colors hover:border-[color:rgba(98,232,255,0.5)]"
        >
          ← BACK TO FEED
        </Link>
      </div>
    </article>
  );

  if (log.priority === "CLASSIFIED") {
    return <DecryptShell logId={log.id}>{content}</DecryptShell>;
  }
  return content;
}
```

- [ ] **Step 10.2: Run lint**

Run: `npm run lint`
Expected: clean.

- [ ] **Step 10.3: Run build**

Run: `npm run build`
Expected: build completes. `/now/[slug]` route generated. If there are zero published logs, `generateStaticParams` returns `[]` and that's fine.

- [ ] **Step 10.4: Ask for commit approval, then commit**

Ask user: "OK to commit Task 10: 'refactor(now): rebuild /now/[slug] with HUD components'?"

After approval:
```bash
git add src/app/now/\[slug\]/page.tsx
git commit -m "$(cat <<'EOF'
refactor(now): rebuild /now/[slug] with HUD components

Waveform header strip, SIGNAL // CALLSIGN line, SignalMetaStrip chips,
LogBody inside corner-bracketed signal-frame, SignalNavRail neighbors,
BACK TO FEED ghost button. DecryptShell wrap kept for CLASSIFIED.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 11: Delete superseded detail components

**Files:**
- Delete: `src/components/now/LogHeader.tsx`
- Delete: `src/components/now/LogTitle.tsx`
- Delete: `src/components/now/FooterNav.tsx`

- [ ] **Step 11.1: Confirm no remaining imports**

Run: `grep -rn "LogHeader\|LogTitle\|FooterNav" src/`

Expected: only the three files themselves should match. If anything else does, stop and fix the stray import first.

- [ ] **Step 11.2: Delete**

```bash
rm src/components/now/LogHeader.tsx
rm src/components/now/LogTitle.tsx
rm src/components/now/FooterNav.tsx
```

- [ ] **Step 11.3: Run lint + build**

Run: `npm run lint`
Expected: clean.

Run: `npm run build`
Expected: build completes; no missing-module errors.

- [ ] **Step 11.4: Ask for commit approval, then commit**

Ask user: "OK to commit Task 11: 'chore(now): remove superseded detail components'?"

After approval:
```bash
git add -A src/components/now/
git commit -m "$(cat <<'EOF'
chore(now): remove superseded detail components

Drops LogHeader / LogTitle / FooterNav — replaced by the waveform-strip
header + SignalMetaStrip + SignalNavRail combination.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 12: `NowCurtain` component

**Files:**
- Create: `src/components/now/NowCurtain.tsx`

Global client component. Listens for `trigger-now-curtain` CustomEvent. Plays interception → lock → handoff sequence. Respects reduced-motion + session flag + tap-to-skip.

- [ ] **Step 12.1: Create the file**

```tsx
// src/components/now/NowCurtain.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SignalWaveform } from "./SignalWaveform";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const SESSION_KEY = "akash_now_curtain";
const EVENT = "trigger-now-curtain";

type Phase = "idle" | "intercepting" | "lock" | "handoff";

const INTERCEPT_LINES = [
  "> intercepting signal...",
  "> locking on coordinates...",
  "> decrypting frame buffer...",
];

const PHASE_TIMINGS = {
  perLine: 320,
  intercepting: 1000,
  lock: 600,
  handoff: 800,
  totalToLock: 1000,
  totalToHandoff: 1600,
  totalEnd: 2400,
} as const;

export function NowCurtain() {
  const router = useRouter();
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [phase, setPhase] = useState<Phase>("idle");
  const [shownLines, setShownLines] = useState(0);
  const timersRef = useRef<number[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  };

  useEffect(() => {
    const trigger = () => {
      if (typeof window === "undefined") return;
      if (window.sessionStorage.getItem(SESSION_KEY) === "1") {
        router.push("/now");
        return;
      }
      if (reducedMotion) {
        window.sessionStorage.setItem(SESSION_KEY, "1");
        router.push("/now");
        return;
      }

      setPhase("intercepting");
      setShownLines(0);

      INTERCEPT_LINES.forEach((_, i) => {
        const t = window.setTimeout(
          () => setShownLines(i + 1),
          (i + 1) * PHASE_TIMINGS.perLine
        );
        timersRef.current.push(t);
      });

      const toLock = window.setTimeout(() => {
        setPhase("lock");
        router.push("/now");
      }, PHASE_TIMINGS.totalToLock);
      timersRef.current.push(toLock);

      const toHandoff = window.setTimeout(() => {
        setPhase("handoff");
      }, PHASE_TIMINGS.totalToHandoff);
      timersRef.current.push(toHandoff);

      const toEnd = window.setTimeout(() => {
        window.sessionStorage.setItem(SESSION_KEY, "1");
        setPhase("idle");
        clearTimers();
      }, PHASE_TIMINGS.totalEnd);
      timersRef.current.push(toEnd);
    };

    window.addEventListener(EVENT, trigger);
    return () => {
      window.removeEventListener(EVENT, trigger);
      clearTimers();
    };
  }, [router, reducedMotion]);

  useEffect(() => {
    if (phase === "idle" || phase === "handoff") return;
    const skip = () => {
      clearTimers();
      window.sessionStorage.setItem(SESSION_KEY, "1");
      setPhase("handoff");
      router.push("/now");
      const end = window.setTimeout(() => setPhase("idle"), 200);
      timersRef.current.push(end);
    };
    window.addEventListener("keydown", skip, { once: true });
    window.addEventListener("pointerdown", skip, { once: true });
    window.addEventListener("touchstart", skip, { once: true });
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("touchstart", skip);
    };
  }, [phase, router]);

  if (phase === "idle") return null;

  const fading = phase === "handoff";
  const showSweep = phase === "lock";
  const showLockText = phase === "lock";

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[200] pointer-events-none flex items-center justify-center transition-opacity"
      style={{
        background: "rgba(5,6,10,0.96)",
        opacity: fading ? 0 : 1,
        transitionDuration: fading ? "800ms" : "200ms",
      }}
    >
      <div className="now-curtain__scanlines" />
      {showSweep ? <div className="now-curtain__sweep" /> : null}

      <div className="absolute top-6 left-6 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-[color:var(--now-accent-warm)]">
        {showLockText ? "// CHANNEL OPEN" : "// INTERCEPTING"}
      </div>

      <div className="w-full max-w-xl px-6">
        <SignalWaveform
          seed="curtain"
          live
          color={showLockText ? "red" : "cyan"}
          height={120}
          amplitude={showLockText ? 0.95 : 0.55}
        />

        <div className="mt-8 font-[var(--font-mono)] text-sm md:text-base text-[color:var(--now-accent)]">
          {showLockText ? (
            <div className="text-center text-[color:var(--now-fg)]">
              [ CHANNEL OPEN // SIGNAL ACQUIRED ]
            </div>
          ) : (
            INTERCEPT_LINES.slice(0, shownLines).map((line) => (
              <div key={line} className="my-1">
                {line}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 12.2: Run lint**

Run: `npm run lint`
Expected: clean.

- [ ] **Step 12.3: Ask for commit approval, then commit**

Ask user: "OK to commit Task 12: 'feat(now): add NowCurtain reveal component'?"

After approval:
```bash
git add src/components/now/NowCurtain.tsx
git commit -m "$(cat <<'EOF'
feat(now): add NowCurtain reveal component

Listens for trigger-now-curtain CustomEvent and plays a ~2.4s
intercepting → lock → handoff sequence. router.push fires at lock so
/now is painted by handoff. Session-flagged (akash_now_curtain),
reduced-motion + tap-to-skip respected.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 13: Mount `NowCurtain` in root layout

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 13.1: Add the import and render the curtain**

Add an import at the top of `src/app/layout.tsx` after the existing imports:

```tsx
import { NowCurtain } from "@/components/now/NowCurtain";
```

Then update the `RootLayout` return so the curtain mounts inside `<body>` after `{children}`:

```tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${outfit.variable} ${bricolage.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} ${orbitron.variable} ${rajdhani.variable} antialiased`}
    >
      <body>
        {children}
        <NowCurtain />
      </body>
    </html>
  );
}
```

(Only those two changes — the new import line + adding `<NowCurtain />` after `{children}`. Leave everything else intact.)

- [ ] **Step 13.2: Run lint + build**

Run: `npm run lint`
Expected: clean.

Run: `npm run build`
Expected: build completes; `/` route still resolves; no SSR errors from the curtain (it's client-only via `"use client"`).

- [ ] **Step 13.3: Ask for commit approval, then commit**

Ask user: "OK to commit Task 13: 'feat(now): mount NowCurtain in root layout'?"

After approval:
```bash
git add src/app/layout.tsx
git commit -m "$(cat <<'EOF'
feat(now): mount NowCurtain in root layout

Curtain lives at the root so it can play from any route when the Now
link dispatches its trigger event.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 14: Navigation integration

**Files:**
- Modify: `src/components/Navigation.tsx`

Intercept the "Now" link click. If reduced-motion or curtain already played this session, fall through to normal `<Link>` navigation. Otherwise prevent default, dispatch `trigger-now-curtain`, and let the curtain handle the route push.

- [ ] **Step 14.1: Update both Now links**

Find the two existing `<Link href="/now">` instances (one in the desktop nav block around line 91-97, one in the mobile overlay around line 129-136). Replace each.

Desktop version — replace this:

```tsx
          <Link
            href="/now"
            className="relative text-[0.7rem] font-medium tracking-[2px] uppercase transition-colors duration-300"
            style={{ color: "var(--color-text-dim)" }}
          >
            Now
          </Link>
```

with:

```tsx
          <Link
            href="/now"
            onClick={(e) => {
              if (typeof window === "undefined") return;
              const already = window.sessionStorage.getItem("akash_now_curtain") === "1";
              const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
              if (already || reduced) return;
              e.preventDefault();
              window.dispatchEvent(new CustomEvent("trigger-now-curtain"));
            }}
            className="relative text-[0.7rem] font-medium tracking-[2px] uppercase transition-colors duration-300"
            style={{ color: "var(--color-text-dim)" }}
          >
            Now
          </Link>
```

Mobile version — replace this:

```tsx
          <Link
            href="/now"
            className="font-display text-4xl font-bold transition-colors duration-300"
            style={{ color: "var(--color-text-dim)" }}
            onClick={() => setMobileOpen(false)}
          >
            Now
          </Link>
```

with:

```tsx
          <Link
            href="/now"
            className="font-display text-4xl font-bold transition-colors duration-300"
            style={{ color: "var(--color-text-dim)" }}
            onClick={(e) => {
              setMobileOpen(false);
              if (typeof window === "undefined") return;
              const already = window.sessionStorage.getItem("akash_now_curtain") === "1";
              const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
              if (already || reduced) return;
              e.preventDefault();
              window.dispatchEvent(new CustomEvent("trigger-now-curtain"));
            }}
          >
            Now
          </Link>
```

- [ ] **Step 14.2: Run lint**

Run: `npm run lint`
Expected: clean.

- [ ] **Step 14.3: Ask for commit approval, then commit**

Ask user: "OK to commit Task 14: 'feat(nav): trigger NowCurtain on Now link click'?"

After approval:
```bash
git add src/components/Navigation.tsx
git commit -m "$(cat <<'EOF'
feat(nav): trigger NowCurtain on Now link click

Both desktop and mobile Now links dispatch trigger-now-curtain when
reduced-motion is off and the curtain hasn't played this session.
Falls through to normal Link navigation otherwise.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 15: Lint + build verification

- [ ] **Step 15.1: Lint**

Run: `npm run lint`
Expected: clean, no warnings or errors.

- [ ] **Step 15.2: Build**

Run: `npm run build`
Expected:
- Build succeeds
- `/now` resolves as a static route
- `/now/[slug]` listed (may be empty if zero logs published — fine)
- `/` resolves
- No type errors, no missing-module errors

If anything fails, stop here and fix before moving on.

---

## Task 16: Manual walkthrough in dev

- [ ] **Step 16.1: Start dev server**

Run: `npm run dev`
Open: http://localhost:3000

- [ ] **Step 16.2: Curtain reveal — first visit**

In the browser dev tools, run in console:
```js
sessionStorage.removeItem("akash_now_curtain");
localStorage.removeItem("akash_now_booted");
```

Then click the "Now" link in the top nav.

Expected:
- Full-screen dark cyan overlay fades in
- Three intercept lines type out (`intercepting signal...` → `locking on...` → `decrypting frame buffer...`)
- Red sweep crosses the screen
- "CHANNEL OPEN // SIGNAL ACQUIRED" text appears briefly
- Overlay fades out revealing `/now`
- Boot sequence plays on the underlying page (first /now visit)

- [ ] **Step 16.3: Curtain reveal — second visit**

Navigate back to `/` (use browser back). Click "Now" again.

Expected: no curtain, normal client routing to /now. (Curtain sessionStorage flag is set.)

- [ ] **Step 16.4: Reduced motion**

In Chrome devtools, open the Rendering panel, set "Emulate CSS prefers-reduced-motion" to `reduce`. Clear sessionStorage flag in console. Click "Now".

Expected: no curtain, no waveform animation, no subtitle rotation, immediate route change. Page still functional.

- [ ] **Step 16.5: Mobile viewport**

Toggle device toolbar to 375px wide. Reload /now.

Expected:
- Hero scales (waveform full width, big title centered)
- Grid stacks to single column
- HUD corners visible
- Mobile nav "Now" link triggers curtain on tap

- [ ] **Step 16.6: Empty state**

If no logs are published, `/now` should already show the "NO SIGNALS DETECTED" intercept card with pulsing dot and jittered waveform. Verify.

- [ ] **Step 16.7: CLASSIFIED card (if a CLASSIFIED log exists)**

If a CLASSIFIED log is published, confirm:
- Card on feed has red border + redacted title block + "[DECRYPT TO VIEW]" chip
- Clicking routes to detail page
- Detail page renders DecryptShell pre-decrypt UI
- After clicking DECRYPT, the new HUD detail page renders inside

- [ ] **Step 16.8: Detail page**

Click into any normal log card. Confirm:
- Waveform strip across top (color: cyan; warm if HIGH; red if CLASSIFIED)
- `SIGNAL // CALLSIGN_NNN` line above title
- Big display title
- SignalMetaStrip chips (date, tag, location if present, priority if HIGH/CLASSIFIED)
- Body inside cyan-framed corner-bracketed container
- Prev / Next signal rails with mini-waveform glyphs
- `← BACK TO FEED` ghost button at bottom

- [ ] **Step 16.9: Boot sequence still works**

Open an incognito window (clean storage). Navigate to `/now`. The boot sequence should fire on first visit. Curtain should NOT fire (this is a direct navigation, not via the nav link).

- [ ] **Step 16.10: Final commit (if any small fixes were needed)**

If any of the walkthrough steps surfaced a small bug, fix it now, run `npm run lint`, ask for commit approval, and commit with a focused message. Otherwise, no commit needed for this task.

---

## Done criteria

- [ ] All 14 implementation tasks committed
- [ ] `npm run lint` clean
- [ ] `npm run build` clean
- [ ] Manual walkthrough (Task 16) all pass
- [ ] Spec file `docs/superpowers/specs/2026-05-18-now-refresh-design.md` is the source of truth — if any drift was discovered during implementation, update it in a final commit
