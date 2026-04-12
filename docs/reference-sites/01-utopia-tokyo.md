# Utopia Tokyo
**URL:** https://www.utopiatokyo.com/
**Tagline:** "Masked. Marked. Watched."
**Built with:** Webflow + GSAP (inferred from `wf-design-mode` classes + motion patterns)
**Credits on site:** Simon Smeraldi // Andrew Measham. Awwwards Masterclass by Niccolò Miranda.

---

## 1. Core concept — why it feels premium

This is **not a portfolio**. It's an interactive artifact of a fictional dystopia. Every UI surface pretends it's part of a running software system from the Utopia Tokyo universe. You're not "viewing a website", you're "operating a piece of software from 2026 Tokyo".

That premise is carried by **obsessive consistency**:
- Every screen-edge shows version chrome (`VERSION: 2.0.0-RC.1`, `[LOADING]`, `>_EXECUTE_CREATION`)
- The coordinates in the top bar are Tokyo's actual lat/lon: `35.6762°N / 139.6503°E`
- Bilingual JP/EN labels everywhere (`強さ STRENGTH`, `敏捷性 AGILITY`, `鬼 Oni`, `天狗 Tengu`)
- A fake hash/block identifier on the radar (`HASH: 0xE5B28E`, `BLOCK: S-733`)
- It opens with a real **EXPERIENCE WARNING** modal offering "Safe Mode" vs "Enable Glitch Effect" — seizure warning as narrative device

Premium = **world-building so committed that the UI reads as an in-universe tool**, not a marketing page.

---

## 2. Color palette (exact values from CSS custom properties)

Extremely tight — 3 hue families, nothing else.

| Token | Hex | Usage |
|---|---|---|
| `--_color---brand--black` | `#14171F` | Body background — near-black with a blue tint |
| `--_color---light--light` | `#EBE5CE` | Primary text — warm cream / rice paper |
| `--_color---brand--red` | `#FF1919` | Accent — aggressive pure red for alarms, sliders, hover states |
| `--_color---red--red-muted` | `rgba(255,25,25, 20%)` | Red tints for backgrounds, bar fills |
| `--_color---red--red-subtle` | `rgba(255,25,25, 10%)` | Even softer red wash |
| `--_color---red--red-faint` | `rgba(255,25,25, 5%)` | Ghostly red haze |
| `--_color---light--light-muted` | `#EBE5CE` @ ~60% | Secondary cream for axes, inactive markers |
| `--_color---light--light-faint` | `rgba(235,229,206, 5%)` | Cream background panels |
| `--_color---dark--dark-subtle` | `rgba(20,23,31, 10%)` | Overlay darkening |
| `#111827` | hardcoded | Progress-bar inner background (Tailwind slate-900) |

**Philosophy:** charcoal + cream + one molten red. That's it. No secondary hues. No gradients on text. Premium comes from the **restraint and the pairing** (cream against charcoal is the Japanese paper-and-ink aesthetic; red is the hinomaru/blood accent).

---

## 3. Typography system

| Font | Role | Notes |
|---|---|---|
| **PPMori** (Bold 700) | Display/body | Used for the warning headline at 96px. Geometric sans with slightly chopped terminals — that's why the "EXPERIENCE WARNING" looks mechanical. |
| **PP Neue Montreal** | Secondary display | Used for editorial phrases later in the page |
| **Neopixel** | Decorative pixel display | Huge cut-off pixel font used for background kinetic letter scatter ("EXPERIENCE/WARNING" in the hero is actually Neopixel — background colored, so hidden but contributes to the layout noise) |
| **Zpix** | Monospace pixel font | All HUD/chrome text: `VERSION`, coordinate, `[LOADING]`, `>_EXECUTE_CREATION`, radar labels at 8px |
| **Open Sans** | Body text | Long-form paragraphs |
| **Times New Roman** | Serif accent | Used sparingly for quotes |

### Hero headline treatment
- `EXPERIENCE WARNING` modal: **PPMori 96px / 700** in `#14171F` on red `#FF1919` background — black-on-red inverts the normal palette, making it feel like a system error
- No letter-spacing (`normal`), no uppercase CSS — all caps baked into the markup

### Kinetic-text idiom
They inject **typed code-like tokens into editorial prose**:

> `Faces of [data_intellect] masks of [data_spirit] Utopia Tokyo [data_ferocity] where past and [data_agility] future Collide [data_strength]`

The `data_*` tokens are styled differently (probably in Zpix/red) and scroll/animate independently from the surrounding PPMori text. This is the "terminal glitches invading poetry" effect. **This is their signature move.**

---

## 4. Frame chrome — the "software HUD" decoration

Every page persistently shows a decorative frame of Zpix text around the viewport edge:

```
Top edge:         35.6762°N  /  139.6503°E              japan
Left edge:        [LOADING]                  (column of letters rotating / spelling UTOPIA)
Right edge:       [LOADING]                  (column spelling TOKYO, + contextual mask names: Oni, Tengu, Okame)
Bottom edge:      >_EXECUTE_CREATION         VERSION  2.0.0-RC.1
```

The left/right columns rotate between:
1. Spelling UTOPIA / TOKYO vertically, letter by letter
2. Showing mask names contextual to the section you're on ("Samurai / Hannya / Oni / Tengu / Okame")
3. Showing `[LOADING]` as a rhythmic interrupt

Result: the edges of your screen feel **alive** in a way normal websites never do. Your eye always has peripheral motion.

---

## 5. Layout & responsive system

- **Document height:** ~10,000px (~11 viewport screens)
- **Heavy use of scroll-pinning** — scrolling doesn't linearly move content; it drives state machines via `data-*` attributes (confirmed by empty scroll frames)
- **Responsive breakpoints:** 1399, 1119, 991, 767, 479 — five breakpoints, each with hand-tuned grid coordinates (not fluid auto-layout)

### Masks gallery — pure-CSS scatter grid
```css
:root {
  --masks-count: 14;
  --masks-cols: 10;       /* 8 at <1399, 6 at <1119, 5 at <991, 4 at <767 */
  --masks-grid-rows: 4;
  --masks-grid-container-height: 90vh;
}

.masks__grid-item:nth-child(1) { --x: 0; --y: 0; --i: 0; }
.masks__grid-item:nth-child(2) { --x: 2; --y: 0; --i: 1; }
.masks__grid-item:nth-child(3) { --x: 3; --y: 0; --i: 2; }
/* ...14 items, each manually placed on a (col, row) grid... */

.masks__grid-item {
  left: calc((100% / var(--masks-cols)) * var(--x, 0));
  top:  calc(var(--masks-grid-row-spacing) * var(--y, 0));
}
```

**Takeaway:** they set the grid coordinate per item as a CSS variable on `:nth-child()`. No JS. Then the responsive breakpoints just override `--x`/`--y` for different screen sizes. This is a really elegant way to do **art-directed scatter layouts** that still degrade gracefully.

### Three view modes for the same 14 items
`data-view="grid" | "list" | "modal"` on the parent switches the same 14 items between:
- **Grid**: scattered layout (as above)
- **List**: vertical stack using `calc(var(--i) * var(--masks-list-item-height))`
- **Modal**: side preview panel + clickable list — 30vw preview, 2.5em item width

Single component, three data-attribute-swapped layouts. This is what "premium" actually means at the code level — **a component that has considered every way the user might want to see the content**.

---

## 6. Motion system (easings, durations, transitions)

Extracted from inline CSS on the site:

| Purpose | Duration | Easing |
|---|---|---|
| Slide transitions (3D carousel) | 0.6s | `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-quart) |
| Mask preview slides | 0.6s | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Radar axis state transitions | 0.3s | default |
| Radar polygon morph | 0.2s | `cubic-bezier(0.4, 0, 0.2, 1)` |
| Hover rotation (close button, toggle icons) | 0.35s | `cubic-bezier(0.625, 0.05, 0, 1)` (aggressive ease-in-out) |
| Backdrop blur on builder modal | 1s | `cubic-bezier(0.625, 0.05, 0, 1)` — same curve |
| Slider tick color transitions | 0.3s | default |
| Bar fill transitions | 75ms ease-out | very snappy |
| Button state toggle | 0.25s ease | default |

**Motion philosophy:**
- Two signature curves: **`cubic-bezier(0.16, 1, 0.3, 1)`** for content reveals (strong ease-out, things "land") and **`cubic-bezier(0.625, 0.05, 0, 1)`** for UI state toggles (very strong ease-in-out, things "snap")
- Timings cluster around 0.3–0.6s — nothing is slow enough to feel lazy, nothing fast enough to feel broken
- Progress bar uses `width 75ms ease-out` — deliberately snappy for a "filling" feel
- Backdrop blur animates over 1 second — the **slowest** animation on the site, reserved for modal entry

### Keyframe animations
```css
@keyframes radar-travel {
  to { stroke-dashoffset: -960; }
}
/* 3s linear infinite — a radar sweep ring that constantly rotates */

@keyframes mp-pulse {
  0%, 100% { opacity: 0.25; }
  50% { opacity: 1; }
}
/* Used on a blinking cursor — breathes at 1s */
```

---

## 7. Data-attribute state machine pattern

Every component is driven by `data-*` attributes instead of CSS classes. This is the single most important pattern to steal:

```css
/* Slides */
.slide[data-slide-state="current"]       { transform: translateX(0%);   z-index: 10; }
.slide[data-slide-state="prev"]          { transform: translateX(-60%); z-index: 5; }
.slide[data-slide-state="next"]          { transform: translateX(60%);  z-index: 5; }
.slide[data-slide-state="inactive-left"] { transform: translateX(-140%);z-index: 1; }
.slide[data-slide-state="inactive-right"]{ transform: translateX(140%); z-index: 1; }

/* Slider */
.slider[data-slider-state="default"]  { --value-color: cream; --bg-color: cream-muted; }
.slider[data-slider-state="inputted"] { --value-color: red;   --bg-color: red-muted; }
.slider[data-slider-state="hovered"]  { --ticks-color: red;   --value-color: red; }
.slider[data-slider-state="pressed"]  { /* squish */ }
.slider[data-slider-state="pressed"] .slider__thumb-top    { transform: translateY(-3px) scaleX(1.08); }
.slider[data-slider-state="pressed"] .slider__thumb-bottom { transform: translateY(3px)  scaleX(1.08); }

/* Mask builder */
[data-mask-state="loading"] [data-mask-dim] { opacity: 0.25; filter: blur(2px); transform: scale(0.98); }
[data-mask-state="loading"] .panel--cta     { opacity: 0; transform: translateY(4px); }
[data-mask-state="loading"] .panel--loading { opacity: 1; transform: translateY(0); }

/* Radar */
.radar__axis[data-axis-state="active"]       { stroke: red; stroke-width: 2; }
.radar__label[data-label-state="active"]     { font-weight: bold; }
.radar__label[data-label-state="dim"]        { opacity: 0.35; }
.radar__marker[data-marker-state="active"]   { fill: red; }

/* Views */
.section.cc-masks[data-view="grid"]  .masks__grid-item { /* scatter */ }
.section.cc-masks[data-view="list"]  .masks__grid-item { /* stack */ }
.section.cc-masks[data-view="modal"] .masks__grid-item { /* panel */ }
```

**Why this is powerful:**
1. JS only has to flip an attribute — all motion/color lives in CSS
2. One component can have **dozens of visual states** declaratively
3. Easy to debug in devtools (you literally see the state on the element)
4. Easy to add new states without refactoring JS

---

## 8. The "Mask Builder" — a mini-game as a section

The centerpiece interactive element. Users can:
- Move 6 sliders to allocate Skill Points (total = 60) across: STRENGTH / AGILITY / VITALITY / INTELLECT / SPIRIT / FEROCITY
- See a **radar chart** (SVG hexagon + polygon) morph in real-time
- Hit `RANDOM SELECTION` or `RESET`
- Click `>_DISCOVER_YOUR_INNER_MASK` to run a loading sequence with a pixelated progress bar (`GENERATING MASK… MASK READY_ COMPLETION 100% HASH: 0xE5B28E BLOCK: S-733`)
- Get matched to one of 14 masks (e.g., `SAMURAI`)

### Progress bar construction (notable CSS)
```css
.mask-progress__bar           { background: #111827; border: 1px solid rgba(107,114,128,.55); }
.mask-progress__bar-fill      { background: #FF1919; transition: width 75ms ease-out; }
.mask-progress__bar-grid      { background-image: linear-gradient(90deg, transparent 95%, #0b0c15 95%); background-size: 4% 100%; }
.mask-progress__bar-sheen     { background-image: linear-gradient(45deg, transparent 25%, rgba(255,255,255,.2) 50%, transparent 75%); background-size: 10px 10px; }
.mask-progress__bar-cap       { width: 2px; background: #FF1919; box-shadow: 0 0 10px rgba(255,255,255,.6); }
```

Three overlaid layers: the filling bar, a vertical tick grid overlay, a diagonal sheen overlay, and a glowing cap at the fill edge. That's how you make a **progress bar feel expensive** — most sites have one layer.

### Radar chart
```css
.radar__svg  { filter: drop-shadow(0 0 10px rgba(255,51,51,0.1)); }
.radar__poly { fill: rgba(255,25,25,0.2); stroke: #FF1919; stroke-width: 2;
               filter: drop-shadow(0 0 4px rgba(255,25,25,0.5));
               transition: points 0.2s cubic-bezier(0.4,0,0.2,1); }
.radar__loading-ring { stroke: rgba(255,51,51,0.9); stroke-width: 2;
                       stroke-dasharray: 120 840;
                       animation: radar-travel 3s linear infinite; }
```

**Note:** `transition: points 0.2s` — they're animating the SVG `points` attribute directly. Modern browsers can tween polygon points if the polygon has CSS transitions; this is a **recent capability** and a nice detail.

---

## 9. Content structure (scroll order)

1. **Warning modal** — Safe Mode vs Glitch Effect (seizure disclaimer as narrative)
2. **Hero**: Crossed katanas (video: `preloader.mp4`) + `UTOPIA TOKYO / MASKED.MARKED.WATCHED.` + coords
3. **Lore paragraph**: "Holographic billboards light up the towering skyline, while traditional temples…" — the dystopian premise
4. **3D slider carousel** of 5 named masks (Samurai / Hannya / Oni / Tengu / Okame) with neighbors scaled 0.7× and brightness 200% washed out
5. **Editorial phrase with injected tokens**: `Faces of data_intellect masks of data_spirit Utopia Tokyo data_ferocity where past and data_agility future Collide data_strength`
6. **Masks grid/list/modal** — 14 masks with view switcher
7. **Scrolling marquee**: `•hidden histories converge with a reimagined future, and ancient masks become symbols of untold possibilities` repeated 6× horizontally
8. **"DISCOVER YOUR MASK" builder** — sliders + radar + progress sequence
9. **Footer**: credits, `PLAY MINIGAME`, `2026`, `UTOPIA TOKYO`, `VERSION: 2.0.0-RC.1`

---

## 10. What to steal

1. **Data-attribute state machines** over React state for visual variants. Flip `data-view="grid"` vs `data-view="list"` vs `data-view="modal"` and let CSS do everything.
2. **The frame chrome idea** — persistent decorative text around the viewport edge. Coordinates, version numbers, loading markers. Your eye always has something to look at in the periphery.
3. **Injected tokens in editorial text** — `data_intellect`, `data_spirit` interrupting prose. Makes text feel corrupted/alive.
4. **Layered progress bars** — the filling bar + tick overlay + diagonal sheen + glowing cap. Four layers to make one bar feel expensive.
5. **The two signature easings**:
   - Content reveals: `cubic-bezier(0.16, 1, 0.3, 1)` @ 0.6s
   - UI toggles: `cubic-bezier(0.625, 0.05, 0, 1)` @ 0.35s
6. **Scatter layouts via `--x`/`--y` CSS variables on `:nth-child()`** — purely declarative, responsive-friendly, no JS.
7. **Radical palette restraint** — one dark, one cream, one red. Resist the urge to add more.
8. **Bilingual labels** (JP + EN) for premium/authenticity signal, even if you don't speak Japanese. Any second language that fits the narrative works.
9. **Fake system data as texture** — hashes, block numbers, GPS coords, version strings. Makes the site feel like it's part of a larger system, even if the data is static.
10. **Thumb squash on slider press**: `scaleX(1.08)` on `[data-slider-state="pressed"]` — tiny physics-feeling detail that makes the UI feel alive under your hands.

---

## 11. What's distinctly *not* premium/alive about ordinary sites (by contrast)

Utopia Tokyo never does any of these — note them as anti-patterns:
- Three-column feature grids with icons
- Hover states that only change color
- "Learn more →" buttons
- Stock photography of people laughing at laptops
- Gradient text for "premium" feel
- Parallax effects unrelated to narrative
- Fonts you recognize from every other site (Inter, Poppins, DM Sans)
- Generic easing (`ease`, `ease-in-out`, 0.3s)
- Spacing that could be auto-generated by a CSS framework
