# SOHub
**URL:** https://sohub.digital/
**Tagline:** "Your story builds our history."
**Stack (inferred):** Next.js + Tailwind CSS + HeroUI + Lenis smooth scroll (confirmed via `html.hydrated.lenis` class and `--heroui-box-shadow-*` tokens)
**Type:** Creative digital agency site

---

## 1. Core concept — why it feels premium

Where Utopia Tokyo is maximalist world-building, **SOHub is the opposite school of premium: aggressive restraint.**

- **Exactly 6 colors in the entire system.** No accent. No brand hue. Just ink, three greys, and an off-white.
- **Two fonts.** Inter for almost everything, publicaPlay reserved for one editorial moment near the footer.
- A **single mascot character** (a mint-teal mecha robot) that breaks the wordmark in the hero and provides the only visual warmth on the entire page.

Premium = **confidence**. The site is so sure of its idea it refuses to add color, decoration, or secondary motifs. You can't sneak anything past it. Every element has to earn its place.

---

## 2. Color palette — the complete system

All CSS custom properties, dumped from `:root`:

```css
:root {
  --color-sohub-black:     #0c1016;  /* True ink — buttons, text */
  --color-sohub-dark-grey: #1e232c;  /* Secondary text, nav links */
  --color-sohub-grey:      #a5abad;  /* Muted text, "Scroll" label */
  --color-sohub-soft-grey: #d9e0e3;  /* "BOOK A MEETING" button bg */
  --color-sohub-white:     #f0f6f8;  /* Page background — pale ice */
  --color-white:           #fff;
  --color-black:           #000;
}
```

**That's it.** Six values. No accent. No gradient. No "brand color".

| Hex | Role | Where it shows |
|---|---|---|
| `#0C1016` | **Ink** | Body text (`rgb(12,16,22)`), black CTA pills, logo paths |
| `#1E232C` | **Dark grey** | Menu link text (Home/Studio/Work/Contact) |
| `#A5ABAD` | **Muted grey** | "Scroll" indicator, disabled states |
| `#D9E0E3` | **Soft grey** | "BOOK A MEETING" pill background — near-tonal with page bg |
| `#F0F6F8` | **Pale ice / page** | The entire page background — hints of blue-mint, feels fresh without being cold |
| `#FFFFFF` | White | HeroUI overrides |

**Note the ink is NOT pure black (`#000`).** It's `#0C1016` — a slightly blue-shifted charcoal. Pure black would feel harsh on the icy background; this slightly warmer ink feels like real printed text.

The teal of the robot character is NOT defined as a token — it's baked into the image. This is deliberate: the robot is an **illustration**, not a brand color. Removing it wouldn't require re-theming the site. This is how you keep a palette clean while still having personality.

---

## 3. Typography system

| Font | Role | Sizes observed |
|---|---|---|
| **Inter** (weights 500, 600) | Everything — body, nav, headings, CTAs | 16px body, 30px "Scroll", 48px menu links, 56px hero tagline, 112px big display ("We are a diligent team…") |
| **publicaPlay** (weight 400) | **One moment only** — the "Don't be shy" contact headline at ~192px | 192px / normal weight |
| **Open Sans** | Fallback / minor body | small sizes |

### Hero headline
```
Your story builds         ← 56px / Inter 600 / #0C1016
our history.              ← 56px / Inter 600 / #0C1016
```

### Display text (scroll section)
```
"We are a [diligent] team, that's passionate about
 turning ideas into [digital realities]."
```
112px Inter 600. The bracketed-look words are the same size but color-shifted to `rgba(0,0,0,0)` (transparent) until their scroll animation fills them in — they **reveal character by character as you scroll**.

### The "one editorial font" principle
publicaPlay is used for exactly **one** piece of text on the entire site: the `Don't be shy` contact moment, deliberately broken into two lines with no space:
```
Don't
be shy
```
This is important: **one decorative font, one moment, maximum impact**. Most sites use three display fonts and dilute each. SOHub uses one for a single sentence and it becomes unforgettable.

### Letter-spacing & weight
Inter 600 is the only weight used for display-sized text. **No Black, no ExtraBold.** 600 is the "confident but not shouting" weight — this is a very specific aesthetic choice.

---

## 4. Layout & structure

- **Document height:** 7925px (~9 viewport screens)
- **Stack:** HTML → `.hydrated.lenis` (Lenis adds the class for smooth scroll) → `body > div` wrapper → `main`
- **Header:** `fixed w-screen` pointer-events enabled selectively

### Scroll sections (in order)
1. **Hero** — Giant SVG "sohub" wordmark with robot mecha breaking through center, `Your story builds our history.` tagline, `Scroll` indicator bottom-left
2. **Intro / Work header** — 112px editorial copy: *"We are a diligent team, that's passionate about turning ideas into digital realities."*
3. **Work** — 6 case studies stacked vertically as 860×484 images (1UP Nova, Razer, Themis, AEVA Team, CHR Innovations, Profit Saloon)
4. **Services** — 4 service pillars, each with a title + list of sub-services + one paragraph:
   - **Brand Identities**: Logo / Typography / Color Palette / Voice & Tone / Guidelines
   - **Smart Development**: Web Dev / App Dev / UI/UX / Interactions / CMS
   - **Marketing Campaigns**: Digital Marketing / SEO / Social / Content / Email
   - **3D Visualization**: Architecture / Engineering / Construction / Interior / Product
5. **Contact / CTA** — `Don't / be shy` 192px publicaPlay editorial moment, `Chat with SOHub` + `BOOK A MEETING` pills

### Grid philosophy
Case study thumbnails are **860×484** (16:9 ratio), centered, stacked vertically with generous vertical whitespace. No 2-column grid. No masonry. **One project per viewport height.** This is the "editorial magazine" approach vs the "portfolio grid" approach. It forces the reader to slow down and actually look at each thing.

---

## 5. The nav pill system

Every button on the site is a **full pill** (border-radius 9999px, shows as `3.35544e+07px` in computed style — which is the 32-bit max, effectively infinity).

Navigation structure:
```
[sohub logo]                           [CHAT WITH SOHUB  💬]  [MENU  ⋯]
```

| Button | bg | color | shape |
|---|---|---|---|
| `CHAT WITH SOHUB` | `#F0F6F8` (page color!) | `#0C1016` | pill w/ icon, 4.8px padding |
| `MENU` | `#0C1016` (black) | `#F0F6F8` (light) | pill, inverted |
| `BOOK A MEETING` | `#D9E0E3` (soft grey) | `#0C1016` | pill |
| `GO UP` | `#0C1016` (black) | light | pill |

**Key detail:** `CHAT WITH SOHUB` uses the **same color as the page background**. Instead of being "a button on a page", it feels like "a piece of chrome embedded in the surface". There's a subtle inner border visible on hover. This is a trick worth stealing — pills that match the bg and rely on shadow/stroke for separation feel more premium than pills that contrast hard.

### HeroUI shadows (used for the pills)
```css
--heroui-box-shadow-small:  0 0 5px  #00000005, 0 2px 10px #0000000f, 0 0 1px #0000004d;
--heroui-box-shadow-medium: 0 0 15px #00000008, 0 2px 30px #00000014, 0 0 1px #0000004d;
--heroui-box-shadow-large:  0 0 30px #0000000a, 0 30px 60px #0000001f, 0 0 1px #0000004d;
```

Three-stop layered shadows: faint ambient + directional drop + 1px crisp edge. Notice the **1px `#0000004d` (30% black)** stroke — this gives the pill a hard edge that makes it feel like a physical object, not a flat div. Most shadow systems skip this crisp layer; that's why they look "CSS-y".

---

## 6. Motion system

Confirmed via inspection:
- **Smooth scroll:** Lenis (`html.hydrated.lenis` class)
- **Preloader:** a `.loader-wrapper` div that fades out after page load
- **Scroll-driven text reveals:** words that start at `color: rgba(0,0,0,0)` (transparent) and fill in as the viewport passes them — this is why the intro copy reveals character by character
- **No videos, no canvas.** All motion is CSS + SVG + scroll-driven opacity/transform.

Every animation timing I could observe:
- Button hover transitions: ~0.3s default ease
- Scroll-triggered text reveals: tied 1:1 to scroll position (not autoplay) — strongest "alive" signal, because the motion responds to *you*

**Motion philosophy:** motion is there to **reward scrolling**, not to perform on load. Nothing moves if you don't scroll. This is the opposite of the "lots of intro animations" school. It feels premium because it feels like the site is quietly responsive to your engagement instead of demanding attention.

---

## 7. The mecha robot — the one illustration

There's exactly **one custom illustration** on the entire site: a ~499×674 standing mecha robot in mint teal, with mechanical tripod legs and a camera-lens head. It's positioned so it **breaks through the giant "sohub" wordmark** — standing between the "o" and "h", its head overlapping the cap of the "h".

**Why this works:**
1. It's the *only* decoration. Nothing competes with it.
2. It's offset from the exact center — asymmetry feels intentional, not missed
3. The teal is a color that **does not appear anywhere else** — it cannot be confused with a brand accent, it belongs to this one character
4. It creates a perfect focal entry point: your eye lands on it before it reads the tagline
5. It implies the studio has a "voice" and "friend" beyond just being an agency

**Steal this idea:** one custom illustration/object/mascot that holds a special place in the hero. Everything else stays in the neutral palette. Don't give it a second friend. Don't make variations.

---

## 8. The "giant word + object" composition

The hero uses the "sohub" wordmark at **massive** scale — larger than the viewport width, so the `u` gets cut off on the right. The SVG dimensions in the DOM were 76782×55862 (absurdly large, scaled via CSS).

This is a composition technique worth naming: **Word-As-Environment**. The wordmark isn't a logo on the page, it IS the page. The tagline is tucked below the word, the robot is within the word. You can't look at the hero without looking at the brand.

Related layouts use this idiom, but SOHub's version is distinguished by:
- The word runs off the right edge (not centered)
- The word is ink-color on page-color (no gradient, no outline)
- The word has no tracking/letter-spacing adjustment — it's just Inter 600 at colossal size

---

## 9. Content voice

The copy is intentionally understated:
- Hero: *"Your story builds our history."* — inverts the usual "our experience" framing
- Intro: *"We are a **diligent** team, that's passionate about turning ideas into digital realities."* — "diligent" is an unusual choice; sets a tone of craft over flash
- Services intro: *"We are an **unusual** digital agency…"* — again, underselling
- Contact: *"Don't be shy"* — casual, friendly, broken into two lines for typographic impact

The sentences are short, the adjectives are self-aware (diligent, unusual), and there are **no superlatives** — no "cutting-edge", "next-gen", "industry-leading". Premium copy = specificity and restraint.

---

## 10. What to steal

1. **Radical palette restraint.** Pick 4–6 colors. Commit. Do not add an accent color unless it's earned by a single illustration.
2. **The "one decorative font for one moment" rule.** publicaPlay shows up once. One big editorial font used once is more memorable than three display fonts diluting each other.
3. **Slightly-tinted ink instead of pure black.** `#0C1016` on `#F0F6F8` is far more premium than `#000` on `#FFFFFF` because real printed ink isn't pure black on pure white — this subconscious cue makes the page feel like a magazine.
4. **Pills at `border-radius: 9999px`** with 3-layer shadows (ambient + drop + 1px stroke). The crisp 30% black stroke is what elevates the pill from CSS-y to physical.
5. **A single custom illustration/mascot.** One character, positioned to break the wordmark. Never showcased again. No variations.
6. **"Word-as-environment" hero.** The brand name set large enough that it exceeds the viewport, not a logo *on* the page but the page *being* the logo.
7. **Scroll-driven text reveals** where words start transparent and fill in as they pass. Tie motion to scroll, not time.
8. **No secondary font.** Inter at weight 600 for everything. Most sites use three weights and look unfocused.
9. **One-project-per-viewport scroll** instead of grids. Force the visitor to slow down.
10. **Understated copy.** Diligent, unusual, don't be shy. No superlatives, ever.
11. **Buttons that match the page background** instead of contrasting hard. They feel like chrome embedded in the page, not stickers on top.
12. **Lenis smooth scroll** + the `html.lenis` class pattern — you're already using this. SOHub validates the choice.

---

## 11. What SOHub deliberately does NOT do

- No dark mode toggle
- No hover states beyond subtle color changes
- No gradients anywhere (ink on ice, that's it)
- No parallax for parallax's sake
- No "enter the site" button
- No cursor follower
- No sound effects
- No testimonials in quotes with headshots
- No "numbers that count up" stats row
- No client logos marquee

Restraint is the entire design system. Every absence is a statement.

---

## 12. Contrast with Utopia Tokyo

Both feel premium, but for opposite reasons:

| | Utopia Tokyo | SOHub |
|---|---|---|
| **Premium via** | Maximalism & world-building | Minimalism & restraint |
| **Color count** | 4 (dark, cream, red, muted) | 6 (all greyscale) |
| **Accent** | Aggressive red | **None** |
| **Typography** | 5 fonts (PPMori, PP Neue Montreal, Neopixel, Zpix, Times) | **2** (Inter, publicaPlay) |
| **Motion** | Constant peripheral motion, data-state machines | Scroll-triggered reveals only |
| **Personality** | Fictional dystopia | Confident studio |
| **Sound** | Seizure warning | Silence |

**Both are right.** These are two valid paths to "premium + alive". Pick the one that fits your voice. Don't try to combine them (charcoal + red + data chrome + pale minimalism would be noise).
