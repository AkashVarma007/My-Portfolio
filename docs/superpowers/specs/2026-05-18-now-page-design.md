# `/now` page — design spec

**Status:** Design locked — ready for implementation plan.
**Owner:** Akash Varma
**Date:** 2026-05-18

This spec captures the locked design for the `/now` route on the portfolio. All design questions are resolved; deferred items are implementation-plan concerns, not design concerns.

---

## 1. Purpose

A live broadcast channel where Akash posts short field updates about what he's building, learning, reading, and thinking about. Acts as a public dev log, but written for a general audience — not just developers. New posts ship from a backend (no redeploys).

Returning visitors should feel like they're tuning back into a transmission. First-time visitors should feel like they've stumbled into unknown territory and want to dig deeper.

## 2. Scope

In scope:
- Two routes: `/now` (index) and `/now/[slug]` (detail).
- Sanity CMS as the content backend.
- Schema, custom block types, index layout, entry experience.
- Visual / aesthetic direction.
- Optional hook into the existing scavenger hunt.

Out of scope (for now):
- Comments, reactions, RSS feed.
- Search / full-text indexing.
- Authoring tools beyond Sanity Studio.

## 3. Aesthetic direction

**Theme:** sci-fi field log. Hacker-coded but accessible. Reference points: Mr. Robot terminals, Alien Isolation save consoles, Stranger Things lab logs, X-Files redactions, Severance interfaces, Watch_Dogs profile pulls.

**Constraint:** must read clearly for non-developers. Sci-fi chrome is flavor, not gating. Plain-language fallbacks accompany terminal-styled chrome (e.g. a typed banner is followed by a one-line plain explanation).

**Reuses existing portfolio assets:**
- Fonts already loaded: Orbitron (HUD), JetBrains Mono (terminal), Outfit (body), Bricolage (display).
- Dark palette + neon accents from main site.
- GSAP animation registry (`AnimationProvider`) for fade-ups, glitch reveals.
- Hunt context for optional clue hooks.

## 4. Architecture

### Routes

| Route | Purpose |
|---|---|
| `/now` | Index of log entries (newest first). |
| `/now/[slug]` | Single log entry detail. |

### Data flow

```
Sanity Studio (web/desktop)
        │
        │  author publishes log
        ▼
Sanity CDN  ──►  Next.js App Router RSC fetch (GROQ)
                          │
                          ▼
                  Render index / detail
                  cached at the edge (webhook + ISR fallback)
```

- Posts publish instantly via Sanity. No redeploy.
- Next 16 RSC fetches via GROQ at request time. ISR (`revalidate = 3600`) caches rendered pages at the edge.
- Sanity webhook hits `/api/revalidate` on every publish / unpublish / delete → instant cache bust.
- ISR TTL acts as a safety net if the webhook ever fails (worst-case 1-hour lag).

### File / folder layout (proposed)

```
src/
├── app/
│   ├── now/
│   │   ├── page.tsx              index route (RSC, edge runtime, ISR)
│   │   ├── [slug]/page.tsx       detail route (RSC, edge runtime, ISR)
│   │   ├── boot.tsx              boot sequence overlay (client)
│   │   └── now.css               scoped scanlines / glitch keyframes
│   ├── studio/
│   │   └── [[...tool]]/page.tsx  embedded Sanity Studio (nodejs runtime)
│   └── api/
│       └── revalidate/
│           └── route.ts          Sanity webhook receiver (nodejs runtime)
├── components/
│   └── now/
│       ├── LogCard.tsx           index card
│       ├── LogHeader.tsx         detail metadata strip
│       ├── LogBody.tsx           portable text renderer + block types
│       ├── BootSequence.tsx      typed handshake overlay
│       ├── DecryptShell.tsx      classified-post reveal wrapper
│       └── blocks/
│           ├── RedactedSpan.tsx
│           ├── GlitchSpan.tsx
│           ├── TerminalBlock.tsx
│           ├── AsciiBlock.tsx
│           ├── TransmissionBlock.tsx
│           ├── SignalChip.tsx
│           └── ImageBlock.tsx
├── lib/
│   └── sanity/
│       ├── client.ts             Sanity client + ISR config
│       ├── queries.ts            GROQ queries
│       ├── image.ts              urlFor() helper for Sanity image CDN
│       └── types.ts              schema TS types
└── sanity/                       Sanity Studio config + schemas
    ├── sanity.config.ts
    └── schemas/
        └── log.ts
```

## 5. Sanity schema

```ts
// log
{
  id:           number            // auto LOG-NNN, padded
  publishedAt:  datetime
  title:        string
  slug:         slug              // auto from title
  tags:         enum[]            // BUILD / LEARN / READ / LIFE / SHIP / DRIFT / SIGNAL
  priority:     enum              // NORMAL / HIGH / CLASSIFIED  (default NORMAL)
  location:     string?           // fake or real geo stamp, e.g. "GRID 47.3N"
  excerpt:      string            // shown on index
  body:         portableText      // custom block types below
  pinned:       boolean           // pin to top of index
  clueId:       number?           // optional hunt hook
}
```

### Tag set (locked)

| Tag | Meaning |
|---|---|
| `BUILD` | Something Akash is making |
| `LEARN` | Studying / new skill |
| `READ` | Book / article |
| `LIFE` | Personal / day-to-day |
| `SHIP` | Released / launched |
| `DRIFT` | Mood / aside / random thought |
| `SIGNAL` | Broadcast / announcement |

### Priority levels

| Priority | Effect |
|---|---|
| `NORMAL` | Default styling |
| `HIGH` | Pulsing accent border, brighter title glow |
| `CLASSIFIED` | Title shows as `[REDACTED]` on index. Detail page wrapped in `DecryptShell` with a single-tap DECRYPT button. Pure theater — no real auth. |

### Body block types

Custom Portable Text marks/blocks. Authors compose any combination per post.

| Block | Render |
|---|---|
| `prose` | Standard paragraph (Outfit font) |
| `code` | Code block, language tag, mono |
| `redacted` | Inline span shown as glitchy black bar; hover briefly reveals. Optional `isClue: boolean` flag marks the span as the hunt trigger (only one per log — see §12). |
| `glitch` | Inline span with scramble effect on viewport enter |
| `terminal` | Mono block with `$ ` prompt, scanline bg |
| `ascii` | ASCII art preserved, mono, neon glow |
| `transmission` | Boxed quote with `>> INTERCEPTED <<` header |
| `signal` | Inline `[SIGNAL: ...]` HUD chip |

All blocks are optional flourishes. Most posts will be plain prose with metadata.

## 6. Entry experience

**First visit** (localStorage flag absent):

A boot-sequence overlay covers the page for ~1.5–2 seconds:

```
> connecting to NOW.akash
> resolving handshake...
> signal stable
> ACCESS GRANTED
```

Lines type in sequence (mono, neon), then overlay fades out and the route materializes underneath. localStorage flag `akash_now_booted = true` is set.

**Scope of the flag**: the boot sequence is per-channel, not per-route. A first visit to `/now/[slug]` (linked directly from elsewhere) also triggers the boot before showing the detail page. Once `akash_now_booted` is set, neither route shows the boot overlay again until the flag is cleared.

**Return visits**: cold open. No boot overlay. Ambient FX (scanlines, faint noise, blinking cursor in header) carry the vibe without friction.

**Skip control**: pressing any key (or tapping) during boot skips to cold open and sets the flag.

## 7. Index page (`/now`) — locked

Layout = **signal intercept feed**. Vertical stack of cards. Hero banner above.

### Hero banner

```
> NOW.akash // channel open // signal stable

  ███╗   ██╗ ██████╗ ██╗    ██╗
  ████╗  ██║██╔═══██╗██║    ██║
  ██╔██╗ ██║██║   ██║██║ █╗ ██║
  ██║╚██╗██║██║   ██║██║███╗██║
  ██║ ╚████║╚██████╔╝╚███╔███╔╝
  ╚═╝  ╚═══╝ ╚═════╝  ╚══╝╚══╝

LOGS: 042   //   LAST TRANSMISSION: 2 days ago

live broadcasts from akash's desk. transmissions append
here as they happen.
```

The plain-language line on the bottom is required — it's the bridge for non-technical readers. Without it, the hero reads as gibberish.

### Card layout

```
╔══════════════════════════════════════════════════════╗
║  LOG-042  //  2026-05-18  //  GRID 47.3N            ║
║  ─────────────────────────────────────────────────  ║
║                                                      ║
║    shipped the /now route                            ║
║                                                      ║
║    spent the weekend building this log channel.      ║
║    feels like opening a window into a private        ║
║    room. signal stable. broadcasting...              ║
║                                                      ║
║    [BUILD] [SHIP]                       PRIO: NORMAL ║
║    ─────────────────────────────────────────────    ║
║                          OPEN TRANSMISSION  →        ║
╚══════════════════════════════════════════════════════╝
```

Details:
- Border is a thin neon line. Brightens on hover.
- Scanlines on card background, subtle.
- Title in Bricolage (display).
- Excerpt in Outfit (body).
- Metadata strips in JetBrains Mono.
- Tag chips styled as HUD pills, color-coded per tag.
- Entire card is a clickable link → `/now/[slug]`.
- GSAP fade-up stagger on mount.

### Classified card treatment

`CLASSIFIED` priority posts render their card with:
- Title replaced by `[ ████████ ]` redaction bars.
- Excerpt fully redacted.
- Tags still visible (so reader sees category).
- Card glows faintly to draw attention.
- Click still routes to detail page where the DECRYPT button lives.

Non-tech reader interprets these as "oh, the secret ones" — universal sci-fi grammar.

### Pinned posts

`pinned: true` posts always render at the top of the feed, above chronological entries. Visually marked with a `PIN` chip in the metadata strip.

## 8. Detail page (`/now/[slug]`) — locked

Layout = **single column + theatrical header strip**. Three vertical zones: HUD metadata strip, protected reading column, footer nav. Sci-fi chrome lives at the edges; the reading flow stays clean.

### Zone 1 — Metadata strip (top)

A dense HUD block. Mono font throughout (JetBrains).

```
╔════════════════════════════════════════════════════════════════╗
║  ▎ LOG-042                                       ◉◉◉◉◌ SIGNAL ║
║  TIMESTAMP   2026-05-18 03:42 UTC                              ║
║  CHANNEL     NOW.akash                                          ║
║  ORIGIN      GRID 47.3N                                         ║
║  PRIORITY    NORMAL                                             ║
║  TAGS        [BUILD] [SHIP]                                     ║
║  HASH        a9f4e2c1                                           ║
╚════════════════════════════════════════════════════════════════╝
```

Details:
- Title is **not** rendered inside the strip — it appears in the reading column below. Strip is pure HUD.
- `HASH` is a deterministic vanity hash derived from the slug. 8 chars. Pure flavor.
- Signal bars (`◉◉◉◉◌`) are static decorative. No animation. Live bars are distracting noise.
- Blinking cursor in the strip's top-right corner = ambient life.
- `PRIORITY` value color-coded: NORMAL (neutral), HIGH (amber, pulse), CLASSIFIED (red, glow).

### Zone 2 — Title + body (reading-protected)

```
─── shipped the /now route ─────────────────────────────────────

  spent the weekend building this log channel. feels like
  opening a window into a private room. signal stable.
  broadcasting...

  [TERMINAL BLOCK]
  $ npm run dev
  > ready in 1.2s
  > now serving log channel
  [/TERMINAL BLOCK]

  more soon.

────────────────────────────────────────────────────────────────
```

Details:
- Title in Bricolage (display), bracketed by ASCII rules.
- Body in Outfit (body font). Reading column max-width ~720px for legibility.
- Portable Text rendered via custom serializers (see §5 block types).
- Faint scanlines on background, never overlaid on text.
- GSAP fade-up applied to body blocks on scroll (`gsap-fade-up` class).

### Zone 3 — Footer nav

```
────────────────────────────────────────────────────────────────
                       END OF TRANSMISSION
────────────────────────────────────────────────────────────────

  < PREV LOG                                       NEXT LOG >
    LOG-041                                          LOG-043
    "the weight of unfinished things"                "—"

                    # RETURN TO CHANNEL
```

Details:
- `END OF TRANSMISSION` separator marks reading complete.
- Prev / next show adjacent log id plus truncated title (40 chars). Disabled state when no neighbor exists.
- `RETURN TO CHANNEL` link routes back to `/now`. Mono, centered.

### CLASSIFIED gate (`DecryptShell`)

Posts with `priority: CLASSIFIED` render gated until the user decrypts:

Initial state on page load:
- Title rendered as redaction bars: `[ ████████████████ ]`.
- Body shown as scrambled gibberish (random unicode + static).
- Metadata strip shows `PRIORITY  CLASSIFIED` in glowing red.
- Center-screen overlay panel:

```
┌──────────────────────────────────────────────┐
│  TRANSMISSION ENCRYPTED                       │
│                                               │
│  This log is classified.                      │
│  Press DECRYPT to access the broadcast.       │
│                                               │
│            [  DECRYPT TRANSMISSION  ]         │
└──────────────────────────────────────────────┘
```

Behavior:
- Click DECRYPT → 1.5s scramble-resolve animation, overlay fades, real content appears.
- Decryption state persists to localStorage as `akash_now_decrypted: number[]` (array of log ids).
- User does not re-decrypt the same log on revisit.
- No real auth. Pure theater. Universal sci-fi grammar — non-tech readers grasp it immediately.

### Ambient FX (detail page)

- Faint scanlines on background.
- Subtle vignette darkening edges.
- Blinking cursor in metadata strip corner.
- Audio is **not** in scope for v1. Off-by-default audio is correct UX but adds plumbing; revisit if desired later.

## 9. Sanity ops — locked

### Studio hosting

**Decision: embedded Studio at `/studio`.**

Sanity Studio runs inside this Next app as a catch-all route (`app/studio/[[...tool]]/page.tsx`). One repo, one deploy. Author logs by visiting `your-domain.com/studio`. Authentication handled by Sanity.

Tradeoff accepted: Studio bundle adds ~2 MB to the Next build, but lives in its own route chunk under App Router — does not affect main page TTI. Block `/studio` from search indexers via `robots.txt`.

### Revalidation strategy

**Decision: hybrid — webhook for instant publish + ISR as safety net.**

- Both `/now` and `/now/[slug]` use `export const revalidate = 3600` (ISR with 1-hour TTL as fallback).
- Sanity configured with a webhook → `POST /api/revalidate` on every publish / unpublish / delete.
- Endpoint verifies signature (`SANITY_WEBHOOK_SECRET`), then calls `revalidatePath('/now')` and `revalidatePath('/now/[slug]', 'page')`.
- Result: publish in Studio → page updates within seconds. Webhook failure → updates still appear within an hour.

### Media support

**Decision: yes, support images.**

- Add `image` block to log body schema (Sanity asset + caption + alt text).
- Render via Sanity image CDN with transforms: `urlFor(img).width(1440).auto('format').quality(75)`.
- Use `next/image` with `unoptimized` flag (Sanity already optimizes) and explicit width/height to avoid CLS.
- Lazy-load images below the fold.

## 10. Hosting & costs — locked

**Stack**: Vercel Hobby (Next.js host) + Sanity free tier (CMS) + Sanity asset CDN (images).

### Vercel Hobby (free)

| Limit | Value |
|---|---|
| Bandwidth | 100 GB / month |
| Serverless function invocations | 100k / day |
| Build minutes | 6000 / month |
| Function execution time | 10 s max |
| ISR | included |
| Commercial use | **not allowed** on Hobby — switch to Pro ($20/mo) if monetizing |

Portfolio-scale traffic (≤1k visits/day): well within all limits.

### Sanity free tier

| Limit | Value (verify before commit) |
|---|---|
| Seats | 3 |
| Documents | 10k |
| API CDN requests | ~500k / month |
| Asset storage | ~5 GB |
| Asset bandwidth | ~5 GB / month |
| Datasets | 1 |
| Webhooks | unlimited |

ISR caching means Sanity API hits per route fire only on cache miss. Real usage stays in low hundreds per month — orders of magnitude under the cap.

### Hidden cost watch-items

1. **Sanity asset bandwidth** — if `/now` posts use many large images and the page goes viral. Mitigation: always serve via `urlFor()` transforms (`?w=720&auto=format&q=75`). Lazy-load below fold.
2. **Vercel Hobby non-commercial clause** — adding monetization (ads, paid services) requires Pro tier.
3. **Sanity Studio bundle** — adds to build time. Negligible runtime impact since Studio is isolated to `/studio` chunk.

### Verdict

Expected cost: **$0 / month** at portfolio scale, indefinitely. Upgrade triggers:
- Going commercial → Vercel Pro ($20/mo).
- High image-heavy virality → Sanity Growth ($15/mo, 10× bandwidth + assets).

> **Pricing caveat**: numbers above reflect knowledge as of Jan 2026 cutoff. Verify current tiers at <https://www.sanity.io/pricing> and <https://vercel.com/pricing> before committing.

## 11. Serverless architecture — locked

Vercel runs Next 16 routes as serverless / edge functions by default. This shape fits `/now` perfectly: stateless rendering with cached output.

### Runtime per route

| Route | Runtime | Reason |
|---|---|---|
| `/now` | `edge` | Geo-distributed, fast cold start (~50 ms). Sanity client works on edge. |
| `/now/[slug]` | `edge` | Same. |
| `/api/revalidate` | `nodejs` | Webhook signature verification needs node crypto. |
| `/studio/[[...tool]]` | `nodejs` | Sanity Studio runtime requires node. |

### Caching pattern

- ISR cache holds rendered pages at the edge.
- Cache hits = no function invocation = zero cost, zero latency.
- Cache misses fire the edge function → Sanity GROQ fetch (~150 ms) → render → cache for next requests.
- Webhook revalidation bypasses TTL and busts cache instantly on publish.

### Why serverless is correct here

- No persistent state (Sanity holds it).
- No long-lived connections (no WebSockets / SSE).
- No heavy compute (Sanity fetch + RSC render = <300 ms).
- Function execution times well under the 10 s Hobby limit.
- Scales to zero when idle — pay nothing during quiet periods.

Going serverful (Railway / Fly / VPS) buys nothing for this workload and adds $5–10 / month + ops burden.

## 12. Hunt integration — locked

**Decision: theatrical click-to-trigger inside CLASSIFIED logs.**

Schema field `clueId?` opts a log into the hunt. Hunt-enabled logs are authored with `priority: CLASSIFIED` and contain at least one `redacted` span in the body.

### Trigger mechanic

1. Reader arrives at the detail page. `DecryptShell` overlay shows. They press DECRYPT.
2. Body materializes with one (or more) `redacted` span(s) styled as glitchy black bars.
3. Clicking a hunt-marked redacted span:
   - Plays a scramble-resolve animation revealing the hidden payload text.
   - Calls `markClueFound(clueId)` on `HuntContext`.
   - The existing `<ClueToast />` global listener pops the standard clue notification.
4. Subsequent visits show the span already revealed (state persisted via existing hunt context).

### Authoring convention

Within the `redacted` block in Sanity, an optional `isClue: boolean` flag distinguishes the hunt-triggering span from purely decorative redactions. Only one `isClue: true` span per log entry. Non-hunters clicking it see flavor text and a one-off toast; hunters following the chain get the actual progression payload.

### Non-hunter experience

- Sees a CLASSIFIED log like any other dramatic post.
- Clicking the redacted span just feels like an easter egg reveal.
- No persistent state visible to them (no badge changes unless they have already discovered the arcade — `HuntUI` is gated behind clue 1).

### Hunter experience

- Has been pointed to this log via the previous clue's payload (e.g. "transmission 042 contains the next signal").
- Decrypts the log, finds the redacted span, clicks it, reveals the next instruction.
- Clue chain advances.

### Cross-route state

The existing `akash_hunt` localStorage key handles persistence. `/now` does not introduce a new persistence layer for hunt state — it only calls into `HuntContext`.

### localStorage keys summary

`/now` reads / writes the following keys (separate from any other site state):

| Key | Type | Purpose |
|---|---|---|
| `akash_now_booted` | boolean | True once boot sequence has played (covers both `/now` and `/now/[slug]`). |
| `akash_now_decrypted` | `number[]` | Log IDs the user has already decrypted (CLASSIFIED priority). |
| `akash_hunt` | (existing) | Pre-existing hunt state. `/now` only calls into `HuntContext`; never writes directly. |

## 13. Mobile & empty-state — locked

### Mobile rules

| Element | Mobile treatment |
|---|---|
| Boot sequence | Mono type drops to ~12 px. Same lines, same duration. |
| Hero ASCII art | Swap to smaller 4-line ASCII variant; below ~480 px replace with plain text `> NOW.akash` banner. |
| Index cards | Stack full-width. Padding reduced (24 px → 16 px). Border radius preserved. |
| Detail metadata strip | Two-column rows collapse to single column (label above value). Signal bars + cursor stay top-right. |
| Reading column | Edge padding 20 px. Max-width irrelevant — viewport drives it. |
| Scanlines | Reduce opacity ~50 % on `<768 px` to protect contrast. |
| Glitch / scramble FX | Run normally; budget already cheap (CSS keyframes + GSAP). |
| Prev / next footer | Stack vertically. Truncate adjacent log title to 28 chars. |

### Empty state (zero logs)

Index page when no logs published yet:

```
> NOW.akash // channel open // signal cold

NO TRANSMISSIONS YET

stand by. first broadcast incoming.
```

- Hero banner + ASCII art still render.
- Below banner: `NO TRANSMISSIONS YET` in display font.
- Plain-language subline replaces the usual "live broadcasts" line.
- No cards rendered.

### Prev / next no-neighbor state

On detail page, when an adjacent log does not exist:

- Disabled slot shows label `< START OF LOG` (no prev) or `END OF LOG >` (no next).
- Dimmed styling, no link, no hover effect.

## 14. Open questions

All design questions resolved. Items deferred to implementation plan:

- Exact GSAP timeline values (durations, eases) for boot sequence, glitch reveal, decrypt scramble.
- Scanline / vignette CSS specifics (pseudo-element vs SVG mask).
- Vanity hash function (proposed: first 8 hex chars of SHA-1 over slug).
- Sanity Studio schema TypeScript codegen pipeline.
- Webhook signature header name + verification snippet.

## 15. Decisions log (chronological)

| # | Decision | Notes |
|---|---|---|
| 1 | Format = sci-fi devlog | Picked over journal-flip, VHS, save-slots, etc. |
| 2 | Routing = index + detail | `/now` + `/now/[slug]` |
| 3 | Entry = boot first visit, cold open after | localStorage flag |
| 4 | Backend = Sanity | Over Notion, Supabase, custom API |
| 5 | Tag set | BUILD / LEARN / READ / LIFE / SHIP / DRIFT / SIGNAL |
| 6 | Priority levels | NORMAL / HIGH / CLASSIFIED |
| 7 | clueId hook | Optional schema field, mechanics TBD |
| 8 | Index layout = signal intercept cards | Plus typed banner + ASCII title + plain-language subline |
| 9 | Audience = general, not just devs | Sci-fi chrome must remain readable for non-tech visitors |
| 10 | Detail page = single column + theatrical header strip | Three zones: HUD metadata strip / reading column / footer nav |
| 11 | Title rendered below metadata strip | Strip is pure HUD; title belongs in reading column |
| 12 | Hash field = deterministic 8-char vanity from slug | Pure flavor |
| 13 | Signal bars = static decorative | Live = distracting |
| 14 | CLASSIFIED gate = `DecryptShell` overlay + scramble animation | Decrypted state persisted in localStorage |
| 15 | Audio out of scope for v1 | Revisit later |
| 16 | Sanity Studio = embedded at `/studio` | One repo, one deploy; `/studio` blocked from indexers |
| 17 | Revalidation = webhook + ISR fallback | Webhook hits `/api/revalidate`, ISR TTL = 3600 s as safety net |
| 18 | Image support = yes, via Sanity image CDN | `urlFor()` transforms + lazy-load below fold |
| 19 | Runtime split | `/now`, `/now/[slug]` on edge; `/api/revalidate`, `/studio` on nodejs |
| 20 | Hosting | Vercel Hobby + Sanity free tier; $0/mo at portfolio scale |
| 21 | Hunt integration = theatrical click-to-trigger in CLASSIFIED logs | `redacted` span with `isClue: true` fires `markClueFound(clueId)` |
| 22 | Mobile rules locked | Boot 12 px, ASCII swap <480 px, scanlines −50 % opacity <768 px |
| 23 | Empty state | "NO TRANSMISSIONS YET" + cold-signal subline |
| 24 | No-neighbor prev/next | Disabled "START OF LOG" / "END OF LOG" labels |
