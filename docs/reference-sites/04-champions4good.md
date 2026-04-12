# Champions for Good Club
**URL:** https://www.champions4good.club/
**Tagline:** "YOUR NETWORK OF GAME CHANGERS"
**What it is:** A premium German networking club connecting elite athletes (Athlet:innen), entrepreneurs, and investors. Olympic-level testimonials (Deborah Levi — Olympic bobsled gold medalist).
**Built by:** Double Play
**Stack (inferred):** Webflow + Swiper.js + Lenis + custom WebGL canvas. Multilingual German with English editorial accents.

---

## 1. Core concept — why it feels premium

This is the **"editorial magazine for sport"** school. Where SOHub minimizes and Artefakt strips, Champions for Good *celebrates*. It uses 11 colors, 422px display type, broken-hyphen poetry, named pricing tiers, an Olympic gold-medalist testimonial, and a sound toggle in the navigation.

**Key premium signals:**
1. **422px hero headline** in **Druk Condensed Super Desktop** (Commercial Type, $$$) — letter-by-letter elements for stagger animation
2. **11-color palette** organized into 3 color worlds (purple, green, brown/yellow) — a multi-section editorial system, not a brand identity
3. **6-step typography scale** with `clamp()` viewport-responsive sizes (XXL through XS)
4. **Broken-hyphen typesetting** for the mission statement — words intentionally split mid-syllable across line breaks (a print magazine technique)
5. **Bilingual German + English** with gender-inclusive German typography (`Athlet-innen`, `Spitzen-Athlet:innen`)
6. **A "Sounds" toggle in the main nav** — they have ambient audio integrated into the experience
7. **20,762px scroll height** (~22 viewport screens) — substantial editorial journey
8. **Numbered values list with editorial line breaks**: `01 Offene Kommunikation 02 Teamgeist 03 Kollaboration…`

This site is the answer to "what if a print sports magazine became a website without losing any of its weight?"

---

## 2. Color palette — 11 named colors in 3 worlds

```css
:root {
  /* PURPLE WORLD */
  --dark-purple:  #23002b;   /* deep aubergine — primary section bg */
  --light-purple: #e894ff;   /* bright lavender — display type, brand color */

  /* GREEN WORLD */
  --dark-green:   #002629;   /* deep teal */
  --green:        #94ffe4;   /* bright mint */

  /* WARM WORLD */
  --yellow:       #ffac47;   /* warm amber */
  --brown:        #291900;   /* dark coffee */

  /* NEUTRALS */
  --grey:         #9b9b9b;
  --pure-white:   #fff;
  --colors--white:#fbfbfb;   /* off-white body bg */
  --colors--black:#121212;

  /* SEMANTIC */
  --colors--brand-color: #e894ff;  /* alias to light-purple */
  --sound-toggle-dot-active: #23002b;  /* used by audio toggle */

  /* SWIPER (carousel library) */
  --swiper-theme-color: #007aff;
}
```

### The "color world" system
Each major section pairs a dark and a light from one hue family:

| World | Background (dark) | Display type (light) | Mood |
|---|---|---|---|
| **Purple** | `#23002B` aubergine | `#E894FF` lavender | Premium / luxury |
| **Green** | `#002629` deep teal | `#94FFE4` mint | Fresh / energy |
| **Warm** | `#291900` coffee | `#FFAC47` amber | Earthy / classic |

Each color world has a built-in **dark base + light accent** pairing. As you scroll into a new section, the page background transitions to that section's dark color, and the headlines pop in the matching light color. This is the **"per-section color worlds"** technique you're already using in your portfolio — but here it's done at maximum saturation.

The body background is `#FBFBFB` (off-white), but it's covered by section-colored backgrounds that scroll independently.

---

## 3. Typography system — 6-step scale + custom oversized

Extracted directly from the inline `<style>` block:

```css
/* desktop ≥ 992px */
.global-headline-xxl  { font-size: clamp(8.5rem, 13vw,   13.75rem); }  /* 136 → 220px */
.global-headline-xl   { font-size: clamp(7rem,   10.5vw, 11.25rem); }  /* 112 → 180px */
.global-headline-l    { font-size: clamp(3.5rem, 5vw,    5rem);     }  /*  56 → 80px  */
.global-headline-m    { font-size: clamp(2.75rem,4vw,    4rem);     }  /*  44 → 64px  */
.global-headline-s    { font-size: clamp(2rem,   3vw,    3rem);     }  /*  32 → 48px  */
.global-headline-xs   { font-size: clamp(1.5rem, 2vw,    2rem);     }  /*  24 → 32px  */

.copytext             { font-size: clamp(0.9,    1.2vw,  1rem);     }  /*  16 → 18px  */
.copytext-small       { font-size: clamp(0.875rem,1vw,   1rem);     }  /*  14 → 16px  */

/* the giant one */
.custom-headline-01   { font-size: clamp(6rem, 22vw, 29rem); }  /* 96 → 464px ! */
.custom-headline-01-span { font-size: calc(1.75vw + 1.75vh + 0.2rem); }
```

### Notable details
1. **A 464px headline.** `.custom-headline-01` scales up to **22vw** — at a 4K monitor, that's 422px characters (which I confirmed via `getBoundingClientRect()`). Single letters are larger than most websites' entire heroes.
2. **`calc(1.75vw + 1.75vh + 0.2rem)`** — they mix vw AND vh in the calc, so the size scales with both dimensions. This is a trick for keeping headlines proportional regardless of aspect ratio.
3. **Six-step scale (XXL → XS)** is a sign of a real type system — not just "h1 h2 h3 p". They thought about hierarchy.
4. **`clamp()` for everything** — fluid responsive sizing without media-query breakpoints.

### Fonts in use
| Font | Role |
|---|---|
| **Druk Condensed Super Desktop** (400) | Hero / display headlines — 422px in `#E894FF` |
| **Neue Montreal** | Secondary headlines, editorial mid-tier |
| **Open Sans** | Body, paragraph text |
| **Arial** | System fallback |

**Druk Condensed Super Desktop** is from Commercial Type — sister to Druk Wide (which Artefakt uses). "Super" is the heaviest weight, "Condensed" is the narrowest cut. Even at weight 400 (regular), it reads as ultra-bold because the cut is so dense. **Lavender Druk Condensed Super at 422px is the visual signature of the entire site.**

### Letter-by-letter rendering
Confirmed: each character of "NETWORK" is its own DOM element with `font-size: 422.4px`. This means they're animating each letter individually — almost certainly with a stagger effect on entry (e.g., GSAP `stagger: 0.04`). This is how you get the "letters dropping in one by one" effect that feels alive.

---

## 4. Broken-hyphen typesetting (a print magazine technique)

The mission statement is set with **deliberate mid-syllable hyphenation across line breaks**:

```
unsere Mission?
die Regeln des klass-
ischen Spon-
sorings und Net-
Workings Neu denken
und Athlet-innnen den
zu-
gang zu Wirt-
Schaftlichen
Chancen Eroeffnen
DIE SIE
verdient
haben.
```

**Why it works:**
- Forces the reader to slow down — you can't skim broken words
- Looks like a print magazine block-quote (where columns are narrow and hyphenation is normal)
- The hyphens themselves become typographic elements
- It implies craft — someone *manually broke* this text instead of letting CSS auto-hyphenate

This is **typesetting as poetry**. It says "I care so much about how this looks that I'm willing to make it slightly harder to read."

Same technique used in the values list:
```
01 Offene Kommunikation
02 Teamgeist
03 Kollaboration
04 Fair Play
05 Respekt
06 Integri-Taet      ← intentional capitalization mid-word
07 Diversi-tAEt      ← intentional broken case
08 inklusion
```

Notice the intentional capitalization stutters: `IntegriTaet`, `DiversitAEt`, `inklusion`. This is **typographic personality** — an inside language for the brand.

---

## 5. The 4-tier membership pricing card

A classic SaaS pattern executed with editorial weight:

| Tier | Price | Audience |
|---|---|---|
| **Athlete** | Kostenfrei (Free) | Spitzen-Athlet:innen — top athletes who want to develop their career beyond sport |
| **Booster** | €85/month | Young companies less than 2 years on the market |
| **Business** | from €150/month | Managements, entrepreneurs, executives, investors using sport for new business |
| **Partner** | Individuell (Custom) | Strategic partners shaping the club itself |

Each card has 3 bullet benefits and a "Join" CTA. The cards are duplicated in the DOM (visible twice in the page text dump) — likely a Swiper.js carousel that holds two instances for infinite-scroll behavior.

**Premium signal:** They named the tiers after **roles** (Athlete, Booster, Business, Partner), not generic levels (Bronze, Silver, Gold, Platinum). Each tier names its actual audience. This is good copy.

---

## 6. The "Sounds" navigation item — audio integration

The main nav includes **a "Sounds" toggle** alongside Members / Events / FAQ / Join. There's also `--sound-toggle-dot-active: #23002b` in the CSS variables — the active state of an audio toggle dot.

This implies the site has **ambient sound design** (probably a music track or sound effects) that the user can toggle. Adding sound to a portfolio/marketing site is rare and a strong "alive" signal **if the sound is good**. It's a high-stakes choice — bad sound is worse than no sound.

The sound toggle has its own UI element with a "dot active" state, suggesting a circular indicator that fills in when audio is on. Could be a single toggle, or could be a multi-track mixer.

---

## 7. Content structure (scroll order)

```
NAV: [logo] Members  Events  FAQ  Sounds  Join

[Hero — full bleed canvas, dark purple bg]
  YOUR NETWORK OF
  GAME CHANGERS                        ← 422px Druk Condensed in #E894FF, letter by letter
  Der Champions for Good Club verbindet Athlet:innen,
  Unternehmer:innen und Investor:innen.

[Editorial section]
  Finally
  No boring
  networking
  Sondern: Sportliche Events, echte Begegnungen
  und neue Chancen fuer alle Mitglieder...

[Quote — testimonial]
  „Mit Champions for Good ist eine Plattform entstanden, die
   Athlet:innen Zugang zu einem vielseitigen Netzwerk eröffnet…"
  — Deborah Levi
    Olympiasiegerin Bob-Zweier (Olympic gold, 2-women bobsled)

[Unser Ziel — Our Goal]
  Neue Chancen
  fuer Athleten

[Mission statement — broken hyphen typography]
  unsere Mission?
  die Regeln des klass-
  ischen Spon-sorings...
  (etc.)

[Our Values — 8 numbered]
  01 Offene Kommunikation
  02 Teamgeist
  03 Kollaboration
  04 Fair Play
  05 Respekt
  06 IntegriTaet
  07 DiversitAEt
  08 inklusion

[Club Memberships — 4 pricing cards in carousel]
  Athlete (free)
  Booster (€85/mo)
  Business (€150+/mo)
  Partner (custom)

[Your Benefits — 3 numbered]
  01 Kuratiertes Netzwerk aus Executives und Athlet-innen
  02 Tickets zu einzigartigen sport-EVENTS
  03 Exklusive Benefits und rabatte auf angebote unserer Club-partner

[READY TO JOIN? CTA]
  Vereinbare ein Gespraech mit unserem team...
  [Join button]

[Footer]
  Menü: Members / Events / FAQ
  Links: Club Platform / LinkedIn
  Legal: Impressum / Datenschutz
  © 2026 | Champions for Good GmbH
  Website made by Double Play
```

---

## 8. Tech specs

| | |
|---|---|
| **Document height** | 20,762px (~22 viewport screens — VERY tall) |
| **Body bg** | `#FBFBFB` (covered by section colors) |
| **Canvas** | 1 (likely a fullscreen background canvas — vignette/grain) |
| **Videos** | 2 (testimonial videos likely) |
| **Custom elements** | 0 (vanilla Webflow component composition) |
| **Carousel** | Swiper.js (`--swiper-theme-color` token) |
| **Audio** | Implied via `--sound-toggle-dot-active` and "Sounds" nav item |
| **Languages** | Bilingual German/English |
| **Letter-by-letter typography** | Confirmed (each char its own DOM element at 422px) |

---

## 9. What to steal

1. **Per-section color worlds with dark base + light display pairs.** Pick 3 color families (e.g., purple, green, warm), each with a dark bg and a light text/accent. Switch worlds per section as you scroll.
2. **A 6-step typography scale** with semantic names (`global-headline-xxl` through `global-headline-xs` + `copytext` + `copytext-small`). Avoid `h1 h2 h3` — name by visual weight, not HTML semantic.
3. **`clamp()` for every type size**, never fixed pixels. Mix `vw` and `vh` in the formula for aspect-aware scaling.
4. **A single oversized headline** that uses `clamp(6rem, 22vw, 29rem)` — letting one element scale to absurd sizes on big screens. The "type as art" hero.
5. **Letter-by-letter rendering for hero text** — each character its own span — for stagger entry animations.
6. **Druk Condensed Super at weight 400** is a high-impact display choice that's distinct from Druk Wide. Pick the cut that fits your verticality.
7. **Broken-hyphen typesetting for editorial moments** — manually break long words across lines with em-dashes. Looks like printed magazine columns. Forces slower reading.
8. **Numbered editorial lists** with intentional capitalization stutters (`IntegriTaet`, `DiversitAEt`) for personality.
9. **A "Sounds" toggle in the nav** if you can commit to actually designing the audio. Don't fake it — either ambient music + sound effects done well, or skip it.
10. **Pricing tiers named after their audience**, not generic levels. "Athlete / Booster / Business / Partner" beats "Free / Pro / Enterprise" every time.
11. **Bilingual or multi-language content** — adds international weight. Even if your audience is English-only, having one tagline in another language signals reach.
12. **Olympic-grade testimonials** — if you can get one heavyweight quote, it's worth more than ten generic five-star reviews. Lead with the heaviest name you can secure.

---

## 10. What Champions for Good is willing to do that ordinary sites aren't

- Use a **464px headline**
- Use **11 colors**
- Switch background colors **per section**
- Manually break words across lines
- Mix two languages in one paragraph
- Add ambient sound to a marketing site
- Stretch to 22 viewport screens of scroll
- Spend money on **two Commercial Type fonts** (Druk Condensed Super + Neue Montreal)

Each one of those is a "no" most teams would say. The site says "yes" to all of them.

---

## 11. Comparison snapshot vs the others

| | Utopia Tokyo | SOHub | Artefakt | **Champions4Good** |
|---|---|---|---|---|
| **Color count** | 4 | 6 | 2 | **11** |
| **Display font** | PPMori | publicaPlay | DrukWide | **Druk Condensed Super** |
| **Doc height** | ~10K px | ~8K px | ~10K px | **~21K px** |
| **Languages** | EN | EN | EN | **DE+EN** |
| **Audio** | No | No | No | **Yes (Sounds toggle)** |
| **Approach** | Maximalism (worldbuilding) | Minimalism (restraint) | Brutalism (B/W canvas) | **Editorial maximalism** |

C4G is the only site so far that uses **multi-color editorial maximalism**. It proves that "premium" doesn't require restraint — you can also get there by pouring on the weight: more colors, more type, more length, more content, more languages. As long as **every choice is intentional and the type system is rigorous**, maximalism works.
