# Artefakt.mov
**URL:** https://artefakt.mov/
**Tagline:** "FILM PRODUCTION. REIMAGINED."
**Self-description:** "a hybrid production company fusing high-end commercial work with a drive to explore the unconventional."
**Location:** Frankfurt (ARTEFAKT.MOV GMBH, Vilbeler Landstraße 36)
**Website by:** T. Monavon & G. Lallé `:/`
**Stack:** Tailwind v4 + Vanilla **Web Components** (`c-*` custom elements) + WebGL2 canvas + 6 case-study videos. **No React, no Vue, no Svelte.** This is a hand-built component system on top of native browser APIs.

---

## 1. Core concept — why it feels premium

Artefakt is the **"the canvas IS the website"** school. The hero is a single fullscreen WebGL2 canvas with multiple custom shaders rendering grain, vignette, scanlines, and the logo. The DOM around it is extremely minimal — most of what you see is actually being **drawn**, not laid out.

**Premium signals (in order of importance):**
1. **DrukWide** as the display font (Commercial Type, used by Vogue, Bloomberg) — instant recognition signal
2. **Pure black + pure white only** — no greys, no accents, just alpha steps in oklab color space
3. **Hand-built Web Components** — 11 custom elements (`c-hero`, `c-grid`, `c-logo`, `c-shuffle-chars`, `c-image-trail`, etc.) instead of any framework
4. **WebGL2 canvas** rendering shader effects (grain, vignette, possibly logo morph) — the orange edge glow you see around the viewport is part of the shader pass, not a CSS gradient
5. **Header with `mix-blend-mode: difference`** — the nav inverts based on whatever's behind it as you scroll
6. **Sliding playful credit:** "Website by T. Monavon & G. Lallé `:/`" — the `:/` emoticon at the end of the credit is the only "personality" tell on the entire site, and it's perfect

This is the **technical-mastery** school of premium. Where SOHub feels premium through restraint and Utopia Tokyo through worldbuilding, Artefakt feels premium through **what you can do that nobody else has built**.

---

## 2. Color palette — even more brutal than SOHub

```
Background: #000000 (pure black)
Foreground: #FFFFFF (pure white)
Hierarchy:  oklab(1 0 0 / 0.16)   ← 16% white (faint)
            oklab(1 0 0 / 0.52)   ← 52% white (muted)
            oklab(0 0 0 / 0.80)   ← 80% black (overlay)
```

**Two colors. That is the entire palette.** No greys defined as colors — only as alpha transparencies of white/black using **OKLab color space** (perceptually uniform — much more accurate hierarchy than rgba).

The orange/amber edge glow visible around the viewport is **rendered inside the WebGL canvas as part of a vignette/CRT shader pass**. It is not a CSS color and never appears anywhere else. It is texture, not palette.

This is even more aggressive than SOHub. SOHub had 6 grey steps; Artefakt has zero. Just black, white, and alpha.

---

## 3. Typography system

| Font | Role | Sample |
|---|---|---|
| **DrukWide** (700) | Display headlines | `A HYBRID FILM PRODUCTION` at **112px / -2.66px letter-spacing / uppercase** |
| **TronicaMono** | Technical/canvas text | Used inside `<canvas>` and chrome elements, monospaced |
| **Open Sans** | Body / paragraphs | Long-form descriptions |
| **ui-sans-serif** | Fallback | Browser default |

### Druk Wide — why it matters
Druk Wide is a **paid Commercial Type font** (~$200+ per weight). It's the visual signature of Vogue, T Brand Studio, Bloomberg Businessweek. Using Druk Wide is a budget signal. Free fonts can imitate the proportions but never quite hit the same character — the wide x-height and the slight terminal cuts are unmistakable.

Specs as used:
```css
font-family: DrukWide;
font-weight: 700;
font-size: 112px;
letter-spacing: -2.66667px;  /* tight, around -2.4% */
text-transform: uppercase;
color: #FFFFFF;
```

### TronicaMono
A relatively obscure monospaced display font with a CRT/screen aesthetic. Pairing Druk Wide (warm editorial) with Tronica Mono (cold technical) creates the "magazine + terminal" duality that defines hybrid production sites. This is a deliberate **font opposition**, not a font combo.

### The pairing principle
- **Display font:** wide, editorial, expensive (Druk Wide)
- **UI/chrome font:** narrow, technical, machine (Tronica Mono)
- **Body font:** neutral, readable (Open Sans)

That's it. Three fonts, each with a clear job.

---

## 4. Web Components architecture (the key idea to steal)

The site is built as a tree of **vanilla custom elements**:

```html
<c-hero>
  <c-logo>...</c-logo>
  <c-shuffle-chars cid>...Works...</c-shuffle-chars>
</c-hero>

<c-grid>
  <div class="grid-work" data-slug="kasy" data-loop="true">...</div>
  <div class="grid-work" data-slug="mcdonalds">...</div>
</c-grid>

<c-works>
  <c-suptitle>01</c-suptitle>
  <c-title>Selected works</c-title>
  <c-shuffle>...</c-shuffle>
</c-works>

<c-services>...</c-services>
<c-image-trail>...</c-image-trail>
<c-back-to-top>...</c-back-to-top>
```

**Discovered custom elements:**
1. `<c-hero>` — hero section wrapper
2. `<c-logo>` — logo (renders to canvas/SVG)
3. `<c-grid>` — fullscreen project grid background (fixed, z-auto)
4. `<c-works>` — works section
5. `<c-services>` — services section
6. `<c-title>` — title element
7. `<c-suptitle>` — sup-title (small label above heading, e.g. "01")
8. `<c-shuffle>` — text shuffle/scramble effect wrapper
9. `<c-shuffle-chars>` — character-level shuffle (uses spans inside)
10. `<c-image-trail>` — cursor image trail (mouse-follow images)
11. `<c-back-to-top>` — back to top button

**Why this matters:**
- **No framework overhead.** No React reconciliation, no virtual DOM. Each component is a class extending `HTMLElement` with a `connectedCallback`.
- **Each component encapsulates its own behavior** — `<c-shuffle-chars>` knows how to scramble its own text on intersection observer, `<c-image-trail>` knows how to track the cursor.
- **Components are reusable** — you can drop `<c-shuffle>Hello</c-shuffle>` anywhere on the page and it works.
- **Tailwind handles styling**, components handle behavior — clean separation of concerns.

This is a **2024 architecture pattern** that's gaining traction among premium agencies. It rejects framework lock-in.

---

## 5. The WebGL canvas

```js
canvas.getContext('webgl2')  // WebGL2RenderingContext confirmed
```

Single fixed-position 1920×923 canvas at `position: fixed; z-index: 110-120` (two stacked layers — likely one for the logo, one for grain/vignette).

What it likely renders (inferred from visible behavior + the orange edge glow):
- A grain/noise shader pass
- A CRT vignette / chromatic aberration shader (the orange edge tint)
- The "ARTEFAKT" logo with possibly morph effects
- Possibly a mouse-reactive distortion field

The hero text and 6 case study videos sit *below* the canvas in normal DOM flow at scroll positions 923, 2308, 3692, 5077, etc. Each project gets its own ~1385px-tall section with a fullscreen 16:9 looping video.

The canvas is fixed; the videos scroll under it. As each video enters the viewport, it autoplays. When it leaves, it pauses (videos all start `paused: true, muted: true, loop: true, autoplay: false`).

---

## 6. The `mix-blend-mode: difference` header

```css
header {
  position: fixed;
  mix-blend-mode: difference;
}
```

The site header (top nav) uses `mix-blend-mode: difference`, which means **the rendered pixels are the difference of the header pixels and what's underneath.** Effect:
- Header text drawn as `#FFFFFF` over a black background → renders as `#FFFFFF` (white)
- Header text drawn as `#FFFFFF` over a white background → renders as `#000000` (black)
- Header text drawn as `#FFFFFF` over a video frame with mid-tones → renders as the inverted color

Result: the header is **always legible** regardless of what's behind it. Without this trick, you'd need to swap header colors per section or add a scrim background.

This is one of the highest-leverage CSS tricks in modern web design. **One line of CSS, infinite contrast.**

---

## 7. Content / scroll structure

Total document height: ~9700px (~10.5 viewport screens).

```
[Hero — fullscreen canvas]
  ├ FILM PRODUCTION. REIMAGINED.    (DrukWide 112px)
  └ artefakt.mov is a hybrid production company fusing high-end
    commercial work with a drive to explore the unconventional.

[01 / 06 — Selected works]
  ├ 01 / 06   Käsy
  │   Clients: McDonald's
  │   Type: Commercial
  │   Date: 2025
  └ See all works

[Our identity]
  └ 02 — Camera or Code? A hybrid film production / Visual Engineering Expertise

[03 — From vision to screen]
  └ "WE SHOOT. WE PRODUCE. WE FINISH. COMMERCIALS MADE FROM PASSION."

[Services — 4 pillars, each numbered]
  (01) Creative Direction
       Concept Development / Creative Consulting & Oversight /
       Talent Curation / Visual Direction
  (02) Production
       International Production Network / Cross-Border / Scalable Frameworks /
       Risk & Legal / End-to-End Mgmt
  (03) Post
       Editorial & Offline / Color & Online / VFX & Compositing /
       AI-Enhanced Post Workflows / Mastering & Delivery
  (04) Hybrid approach
       Full AI & Hybrid Production Models / Continuous AI Workflow Optimization /
       AI Integration Strategy / AI & Rights Advisory

[Footer]
  ├ ARTEFAKT.MOV GMBH
  ├ Vilbeler Landstraße 36, 60386 Frankfurt
  ├ Get in touch: info@artefakt.mov
  ├ Legals
  ├ Website by T. Monavon & G. Lallé :/
  └ Back to top
```

### Section numbering convention
Every section has a numeric label: `01 / 06`, `02`, `03`, `(01)`, `(02)`, `(03)`, `(04)`. The `01 / 06` format on works is editorial — it implies "1 of 6", like a magazine page count. The `(01)` parens style on services is more like a footnote/citation.

---

## 8. The "ARTEFAKT" word as logotype

The brand uses `artefakt.mov` as its full name — including the file extension `.mov` — and treats the dot-mov as part of the wordmark. This is genius branding for a film production company because:
1. `.mov` is a video file extension (Apple QuickTime)
2. The TLD `.mov` is real (Google's TLD launched in 2014)
3. So they got both the brand reference AND the literal domain match

The logo (rendered via `<c-logo>`) likely treats "artefakt" and ".mov" as separate stylistic elements — possibly with the `.mov` in mono, the rest in Druk.

---

## 9. Motion & interaction signals

Inferred from the custom element names and the architecture:

| Component | Behavior |
|---|---|
| `<c-shuffle>` / `<c-shuffle-chars>` | Text scramble effect on scroll/load — characters cycle through random glyphs before resolving to the target string |
| `<c-image-trail>` | Cursor leaves a trail of images/frames — common in film studio sites, evokes a film strip |
| `<c-logo>` | The logo morphs/reveals with shader effects |
| Header `mix-blend-mode: difference` | Always-legible nav |
| Videos with `paused: true` until viewport entry | Scroll-triggered autoplay |
| Vignette/grain shader pass | Persistent CRT/film overlay |

There is no Lenis class on the document — they may be using `scroll-behavior: smooth` or a custom scroll handler. Or no smooth scroll at all (some sites with heavy WebGL skip Lenis to avoid frame-drop conflicts).

---

## 10. Tech specs summary

| | |
|---|---|
| **Framework** | None (Vanilla Web Components) |
| **CSS** | Tailwind v4 (`--tw-*` tokens, `oklab()` colors) |
| **Rendering** | WebGL2 canvas (1920×923 fixed) |
| **Videos** | 6 looping muted 16:9 case studies, scroll-triggered autoplay |
| **DOM nodes** | 1315 (substantial but manageable) |
| **Color palette** | Black + White + alpha steps (in OKLab) |
| **Fonts** | DrukWide, TronicaMono, Open Sans |
| **Smooth scroll** | None detected (raw scroll) |
| **Custom elements** | 11 (`c-hero`, `c-grid`, `c-logo`, `c-works`, `c-services`, `c-title`, `c-suptitle`, `c-shuffle`, `c-shuffle-chars`, `c-image-trail`, `c-back-to-top`) |
| **Drop shadows** | Tailwind defaults (heroui style) |

---

## 11. What to steal

1. **`mix-blend-mode: difference` on the header** — one CSS line, header always legible regardless of background. Highest-leverage trick on the entire site.
2. **Black + white + alpha steps in OKLab** — `oklab(1 0 0 / 0.16)` instead of `rgba(255,255,255,0.16)` for perceptually uniform hierarchy. Modern browsers all support this.
3. **Web Components instead of React** for component-driven sites that don't need state management. Each component encapsulates behavior; Tailwind handles styling.
4. **Section numbering as editorial device** — `01 / 06`, `(02)`, `(03)`. Treat every section like a magazine spread with a folio.
5. **Druk Wide (or a similar wide editorial display)** for headlines. Pair with a mono for chrome. Two fonts only, maximum opposition.
6. **Domain extension as part of the brand** — `artefakt.mov`, `something.studio`, `name.dev`. Use the TLD as a meaningful suffix.
7. **WebGL canvas for grain/vignette/CRT effects** layered above the design. Treat the canvas as a *texture* that adds film-stock feel, not as the primary content.
8. **Scroll-triggered video autoplay/pause** — load metadata only, autoplay on intersection enter, pause on exit. Bandwidth-efficient and feels alive.
9. **Self-deprecating credit lines** — "Website by X & Y `:/`". The emoticon humanizes a technical site.
10. **Section labels in mono, headlines in display** — `(01) Creative Direction` puts the number in TronicaMono and the word in DrukWide. Two fonts, two roles, one line.
11. **No accent color, ever.** Black and white is enough if your typography and imagery are good enough.

---

## 12. What Artefakt deliberately does NOT do

- No accent color
- No greys (only alpha)
- No frameworks (no React/Vue/Svelte build chain)
- No "Get a quote" CTA
- No client logos marquee
- No testimonials
- No team headshots
- No blog
- No case study detail pages linked from the home (just `See all works` going somewhere else)
- No social media icons in the header
- No cookie banner I could see
- No newsletter signup

It is **brutally minimal**. The work is the only argument it makes.

---

## 13. Comparison snapshot

| | Utopia Tokyo | SOHub | **Artefakt.mov** |
|---|---|---|---|
| Hue count | 4 | 6 | **2 (B/W)** |
| Display font | PPMori | publicaPlay (1 use) | **DrukWide** |
| Stack | Webflow + GSAP | Next.js + Tailwind + HeroUI | **Web Components + Tailwind** |
| Hero | Crossed katanas video | Wordmark + robot | **WebGL canvas + grain** |
| Nav blend | None | Pill chrome | **`mix-blend-mode: difference`** |
| Content | Worldbuilding lore | Studio agency pitch | **Film case studies** |

Three completely different recipes, all premium. Pick the one whose constraints feel exciting, not the one that has the most features.
