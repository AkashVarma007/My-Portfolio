# /now Refresh — Live Signal HUD

**Status:** Design
**Date:** 2026-05-18
**Scope:** `/now` feed + `/now/[slug]` detail + Nav curtain reveal

## Goal

Replace current `/now` UI with a Live Signal HUD aesthetic: live waveform hero, intercept-card grid, HUD-styled detail page, and a signal-interception curtain when navigating from the main site. Keep all existing data, Sanity wiring, and hunt integration unchanged. **Use only the existing `/now` color palette — no new color tokens.**

## Non-goals

- No Sanity schema changes
- No new GROQ queries
- No new hunt clues
- No new routes
- No backend changes
- No automated tests (project has none configured)

## Palette (existing tokens only)

| Token | Value | Use |
|---|---|---|
| `--now-bg` | `#05060a` | Page background |
| `--now-fg` | `#d7e0ee` | Primary text |
| `--now-dim` | `#6b7280` | Meta text, hairlines, muted captions |
| `--now-accent` | `#62e8ff` | Primary signal color: default waveform, chips, borders, dot glow |
| `--now-accent-warm` | `#ff8a3d` | Featured/active: newest card border, HUD coords, curtain "INTERCEPTING" text |
| `--now-classified` | `#ff3b5c` | CLASSIFIED card border + gate, curtain "BREACH" flash |
| `--now-line` | `rgba(98,232,255,0.18)` | Grid lines, frame borders, subtle dividers |

Glows reuse `box-shadow: 0 0 N color/A` with these same RGB triples. No new vars introduced.

## Architecture

### New files

| Path | Purpose |
|---|---|
| `src/components/now/SignalWaveform.tsx` | SVG waveform. Props: `seed` (string), `live` (bool), `color` (cyan/warm/red), `height`. Deterministic path from seed. Animates when `live`. |
| `src/components/now/SignalGrid.tsx` | Server component. 2-col responsive grid. Maps over `LogSummary[]`, renders `SignalCard`. |
| `src/components/now/SignalCard.tsx` | Server component. Card chrome + waveform + meta. Handles CLASSIFIED gate locally (gate is visual; decrypt still happens on detail page). |
| `src/components/now/SignalHero.tsx` | Client component. Live hero band: top chip, big waveform, display title, rotating subtitle, HUD corners (coords + timestamp). |
| `src/components/now/SignalMetaStrip.tsx` | Detail page metadata chips: date, tag, classification badge. |
| `src/components/now/SignalNavRail.tsx` | Detail page prev/next signal rails with neighbor callsign + mini-waveform. |
| `src/components/now/NowCurtain.tsx` | Global client component. Listens for `trigger-now-curtain` CustomEvent. Plays interception → lock → handoff sequence, then `router.push("/now")`. Session-flagged so it fires once per session. |

### Modified files

| Path | Change |
|---|---|
| `src/components/Navigation.tsx` | Desktop + mobile "Now" link: `onClick` dispatches `trigger-now-curtain` event and prevents default. Fallback `<Link>` href remains for no-JS / reduced-motion. |
| `src/app/layout.tsx` | Mount `<NowCurtain />` at root so the curtain works from any page. |
| `src/app/now/page.tsx` | Swap `HeroBanner` → `SignalHero`, `LogList` → `SignalGrid`. |
| `src/app/now/[slug]/page.tsx` | Replace existing metadata block with `SignalMetaStrip`, footer nav with `SignalNavRail`. Add waveform header strip. |
| `src/app/now/now.css` | Add classes: `.signal-card`, `.signal-card--featured`, `.signal-card--classified`, `.signal-frame`, `.signal-corner`, `.signal-rail`, `.hud-corner`. **No new color variables.** |

### Files removed (superseded)

- `src/components/now/HeroBanner.tsx` (replaced by `SignalHero`)
- `src/components/now/LogCard.tsx` (replaced by `SignalCard`)
- `src/components/now/EmptyState.tsx` (folded into `SignalGrid` empty branch)
- `src/components/now/LogHeader.tsx` (folded into detail page header)
- `src/components/now/LogTitle.tsx` (folded into detail page header)
- `src/components/now/FooterNav.tsx` (replaced by `SignalNavRail`)

(There is no `LogList.tsx` — `/now/page.tsx` currently inlines the map. `SignalGrid` replaces that inline section.)

All deletions are safe: verify with grep before removing.

## Feed page composition

### Hero (`SignalHero`)

- Full-width band, ~70vh on desktop, ~55vh on mobile
- Top center chip: `● STATUS: ONLINE  ·  STREAM: ACTIVE` — cyan, dot pulses every 1.4s
- Centerpiece: `SignalWaveform live color="cyan" height={120}` spanning full content width, blurred glow underneath
- Below waveform: display heading `NOW.AKASH` (display font, large, dim cyan tint via `text-shadow`)
- Below heading: rotating subtitle cycling through three phrases every 4s with crossfade
  - "transmissions from the void"
  - "open signal channel"
  - "real-time devlog"
- Bottom-left HUD corner: `LAT 12.97 // LON 77.59 // BLR-IN` in warm orange, mono, 11px
- Bottom-right HUD corner: `T+ HH:MM:SS` live timestamp in cyan, mono, 11px (ticks every second; uses `useEffect` interval so it stays client-only)
- Frame: cyan hairline border with 4 corner brackets (`.signal-corner`)
- `prefers-reduced-motion`: waveform draws static path, subtitle stops rotating (shows first phrase), timestamp still ticks

### Grid (`SignalGrid` + `SignalCard`)

Layout:
- `grid-cols-1 md:grid-cols-2 gap-6` inside max-width container
- Newest log gets `--featured` modifier (warm-orange accents)
- CLASSIFIED logs get `--classified` modifier (red accents, redacted excerpt)

Card structure:

```
┌──────────────────┐   ← .signal-card  (border: cyan hairline; warm if featured; red if classified)
│ ~/\\~/\\~~~/~~~~ │   ← SignalWaveform seed={slug} color={...} height={36}
│ TAG · 05.18      │   ← chip + date, dim
│ INTERCEPT · 017  │   ← rank label, mono, dim
│                  │
│ CALLSIGN_017     │   ← mono, dim
│ now-page-launch  │   ← display, large (this is the title)
│                  │
│ short blurb of   │   ← 2 lines max, fg-dim
│ what got logged  │
│                  │
│ [READ SIGNAL →]  │   ← ghost button, accent color
└──────────────────┘
```

Classified variant:

```
┌──────────────────┐   border: red
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │   waveform path swapped for jittered noise (still SVG, just heavy distortion)
│ CLASSIFIED · ▓▓▓ │
│ INTERCEPT · ▓▓▓ │
│                  │
│ ████████████████ │   redacted title block
│                  │
│ ░░░░░░░░░░░░░░░░ │   redacted excerpt
│ ░░░░░░░░░░░░░░░░ │
│                  │
│ [DECRYPT TO VIEW] │  red ghost button → still routes to /now/[slug]
└──────────────────┘
```

Interactions:
- Hover (desktop, no-touch): card lifts 4px (`transform: translateY(-4px)`), border glow intensifies, accent button arrow pings right. CSS-only.
- Tap (touch): no hover state; tap routes immediately to detail
- Entire card wrapped in `<Link>` so any click navigates
- Entrance: existing `.gsap-fade-up` class with `data-delay` stagger by index (~60ms apart)

### Empty state (no logs published)

Sanity returns `[]`. `SignalGrid` detects empty and renders a single full-width intercept card:

```
┌────────────────────────────────────────┐
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │   ← jittered waveform (cyan)
│                                        │
│ NO SIGNALS DETECTED                    │   display, dim
│ standby — first transmission incoming  │   mono, dim
│                                        │
│ ● MONITORING CHANNEL                   │   pulsing cyan dot
└────────────────────────────────────────┘
```

Hero still renders normally above — the live waveform alone reads as an active idle channel.

## Detail page composition (`/now/[slug]`)

Order top-to-bottom inside the existing classified/decrypt wrapper:

1. **Waveform header strip** — `SignalWaveform seed={slug} color={priorityColor} height={48}` full-bleed across content width
2. **Title block** — small `SIGNAL // CALLSIGN_NNN` line in mono dim, then big display title underneath
3. **`SignalMetaStrip`** — horizontal row of chips:
   - Date chip: cyan
   - Tag chips: all tags render in cyan except `SHIP` (warm). Existing `TAG_COLORS` map is dropped — it uses emerald/amber/violet/pink/sky which violate the palette constraint.
   - Priority chip if not NORMAL: warm for `HIGH`, red for `CLASSIFIED`
4. **Frame** — content wrapped in `.signal-frame` (cyan hairline border, 4 corner brackets, generous padding). Existing `LogBody` renders inside.
5. **`SignalNavRail`** — two horizontal rails labeled `← PREV SIGNAL` and `NEXT SIGNAL →` with neighbor callsign + mini-waveform glyph (height ~20). Stacked on mobile, side-by-side on desktop.
6. **Footer button** — `← BACK TO FEED` cyan ghost button

CLASSIFIED handling: `DecryptShell` already wraps. No change to DecryptShell itself. The new header strip + meta render inside DecryptShell's "after decrypt" branch. The pre-decrypt UI inside DecryptShell stays as-is (already on-brand).

## Curtain reveal (`NowCurtain`)

Mounted globally in `src/app/layout.tsx`. Listens for window event `trigger-now-curtain`. Skip via `sessionStorage["akash_now_curtain"] === "1"` (one play per session, same pattern as `ArcadeCurtain`).

Sequence (~2.4s total, faster than arcade's 3.5s):

| Phase | Window | Visual |
|---|---|---|
| `idle` | n/a | Nothing rendered (component returns null) |
| `intercepting` | 0–1000ms | Full-screen overlay (`--now-bg` at 0.96 alpha) fades in. Cyan-tinted scan lines crawl downward. Center: monospaced text typing line-by-line: `> intercepting signal...` `> locking on coordinates...` `> decrypting frame buffer...`. Faint waveform line draws horizontally across center, amplitude growing. Tiny warm-orange "INTERCEPTING" label top-left corner. |
| `lock` | 1000–1600ms | Waveform amplitude spikes hard. Red flash (`--now-classified`) crosses screen left-to-right, single horizontal scan line. Brief blackout (50ms). Center text replaced with cyan: `[CHANNEL OPEN // SIGNAL ACQUIRED]`. `router.push("/now")` fires at start of this phase so page is ready by handoff. |
| `handoff` | 1600–2400ms | Overlay fades to 0 over 800ms with subtle vertical wipe. Underneath `/now` is fully painted. |

After `handoff`, set sessionStorage flag and unmount overlay (return null).

Skip behavior:
- `prefers-reduced-motion: reduce` → skip entire curtain, immediate `router.push("/now")`
- Any keydown/pointerdown/touchstart during play → skip remaining phases, fast handoff (200ms fade)
- If user navigates away mid-curtain → cleanup all timeouts on unmount

Navigation integration:
- `Navigation.tsx` "Now" link: onClick
  - If `sessionStorage["akash_now_curtain"] === "1"` or `prefers-reduced-motion`: do default `<Link>` navigation
  - Else: `e.preventDefault()`, dispatch `trigger-now-curtain` event, curtain handles `router.push`
  - The `<Link href="/now">` markup remains so the reduced-motion / already-seen branches use normal Next.js client routing (no curtain)

Important: the curtain ONLY plays when navigating TO /now from another route. Direct page loads on /now (refresh, deeplink) do NOT play it — those still get the existing `BootSequence` (first visit only, distinct flag `akash_now_booted`).

## Animations / interactions

- Hero waveform: SVG path morph via requestAnimationFrame. Paused when `document.hidden`.
- Card waveforms: static path drawn once. Deterministic seed = simple string hash of slug.
- Subtitle rotation: state index incremented on interval, opacity transition via CSS.
- Card hover: CSS-only transitions, no JS.
- Card entrance: existing `.gsap-fade-up` (no new GSAP wiring needed).
- Curtain text typing: timeline of setTimeouts updating shown-line count, similar to `BootSequence`.

`prefers-reduced-motion: reduce` behavior summary:
- Hero waveform: static, no animation
- Subtitle: static (first phrase only)
- Card hover lift: disabled
- Curtain: skipped entirely
- BootSequence: unchanged (already respects)

## SignalWaveform component spec

```
Props:
  seed: string                         // any string; use slug for cards, fixed constant ("now-akash-hero") for hero
  live?: boolean                        // animate phase if true (hero only)
  color?: "cyan" | "warm" | "red"       // maps to existing tokens; default cyan
  height?: number                       // px
  amplitude?: number                    // 0..1, default 0.6
  jitter?: boolean                      // CLASSIFIED noise mode
```

Color → token map:
- `cyan` → `var(--now-accent)`
- `warm` → `var(--now-accent-warm)`
- `red`  → `var(--now-classified)`

**Priority color resolution** (used by card + detail header):
- Log marked CLASSIFIED → `red`
- Log is newest in feed (index 0) on the feed page → `warm`
- All others → `cyan`

Implementation:
- Renders a single SVG `<path>` element
- Deterministic seed: hash string to 32-bit int, use as RNG seed
- Generate 60 points across width with smoothed sine + noise composite
- `live`: rAF loop advances phase, updates path `d` attribute. Throttled to 30fps.
- `jitter`: increase noise amplitude, irregular spikes (for CLASSIFIED cards)
- Stroke color reads `var(--now-accent)` / `var(--now-accent-warm)` / `var(--now-classified)` so palette changes propagate

## Data flow

Unchanged. `fetchLogs()`, `fetchLogBySlug()`, `fetchPrevNext()` in `src/lib/sanity/queries.ts` keep working. Both pages stay `export const dynamic = "force-static"` with `generateStaticParams`. Webhook invalidation via `revalidateTag("logs", "max")` unchanged.

## Hunt integration

Unchanged. `RedactedSpan` continues to call `unlockClue(clueId)` for body redactions. No new clue is added by this refresh.

## Boot sequence

Unchanged. Still fires on first `/now` visit. Flag `akash_now_booted` is independent of curtain flag `akash_now_curtain`. Boot plays after curtain handoff completes (different overlays don't collide — curtain unmounts before boot mounts, both controlled by their own state).

## CSS additions (in `now.css`, no new tokens)

```css
.signal-card {
  position: relative;
  border: 1px solid var(--now-line);
  background: linear-gradient(180deg, rgba(98,232,255,0.02), transparent);
  padding: 1.25rem;
  transition: transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
}
.signal-card:hover {
  transform: translateY(-4px);
  border-color: rgba(98,232,255,0.35);
  box-shadow: 0 12px 30px -16px rgba(98,232,255,0.25);
}
.signal-card--featured { border-color: rgba(255,138,61,0.45); }
.signal-card--featured:hover { box-shadow: 0 12px 30px -16px rgba(255,138,61,0.3); }
.signal-card--classified { border-color: rgba(255,59,92,0.4); }
.signal-card--classified:hover { box-shadow: 0 12px 30px -16px rgba(255,59,92,0.3); }

.signal-frame { position: relative; border: 1px solid var(--now-line); padding: 2rem; }
.signal-corner { position: absolute; width: 12px; height: 12px; border: 1px solid var(--now-accent); }
.signal-corner--tl { top: -1px; left: -1px; border-right: 0; border-bottom: 0; }
.signal-corner--tr { top: -1px; right: -1px; border-left: 0; border-bottom: 0; }
.signal-corner--bl { bottom: -1px; left: -1px; border-right: 0; border-top: 0; }
.signal-corner--br { bottom: -1px; right: -1px; border-left: 0; border-top: 0; }

.signal-rail { display: flex; gap: 0.75rem; align-items: center; padding: 1rem; border: 1px solid var(--now-line); transition: border-color 200ms ease; }
.signal-rail:hover { border-color: rgba(98,232,255,0.35); }

.hud-corner { position: absolute; font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.08em; }
.hud-corner--bl { bottom: 1.25rem; left: 1.25rem; color: var(--now-accent-warm); }
.hud-corner--br { bottom: 1.25rem; right: 1.25rem; color: var(--now-accent); }

@media (prefers-reduced-motion: reduce) {
  .signal-card { transition: none; }
  .signal-card:hover { transform: none; }
}
```

## Build / verification plan

- `npm run lint` clean
- `npm run build` clean (8 static routes still resolve)
- Manual walkthrough in dev:
  1. From `/` click Now in desktop nav → curtain plays → lands on /now
  2. Reload /now → curtain does NOT replay (session flag honored)
  3. Click a card → /now/[slug] renders with waveform header
  4. Use prev/next rails
  5. Toggle `prefers-reduced-motion` → curtain skipped, waveforms static
  6. Mobile viewport (375px): grid stacks, hero scales, mobile nav Now link triggers curtain on tap
  7. CLASSIFIED card on feed shows red gate; clicking still routes to detail; DecryptShell still works
- No automated tests required (project has none)

## Risks

- Curtain + boot stacking: confirm only one overlay mounts at a time. The curtain unmounts before BootSequence mounts because BootSequence's effect runs on /now mount (after navigation completes), while curtain unmounts itself after its handoff phase. Both use distinct localStorage/sessionStorage keys.
- SVG path performance: 60 points morphing at 30fps on desktop is cheap; on low-end mobile the hero waveform respects reduced-motion automatically. No worry.
- Removing `HeroBanner`/`LogCard`/`LogList` files: check for any external imports before deletion. If found, keep file as thin re-export or shrink to nothing.

## Out of scope

- New Sanity fields (waveform-data, coordinates, etc.)
- Theme switcher
- Analytics
- New hunt clues
- New routes
- Server-driven waveform data
- Sound effects on curtain (could be added later; not now)

## Open questions

None at spec time. User explicitly said "you do you, surprise me." Defaults chosen above are committed.
