# Maxima Therapy
**URL:** https://maximatherapy.com/ → redirects to `/programs/3-to-18`
**Tagline:** "Person-centered care for every stage of life."
**Mission line:** *"We don't treat disabilities. We support differences, from birth to golden age."*
**Brand promise:** "See life from a different angle"
**What it is:** A neurodiversity-affirming therapy provider serving California — programs for ages 0-3, 3-18, 18-65, and 65+
**Stack:** React Router v7 / Remix (streaming SSR confirmed via `window.__reactRouterContext`) + Sanity CMS (`cdn.sanity.io/images/ucjvjwsr/...`) + Tailwind v4 + CookieConsent library

---

## 1. Core concept — why it feels premium

Maxima Therapy is the **"premium maximalism for healthcare"** school. Therapy/medical sites usually look one of two ways: cold-clinical (white + blue + stock photos of doctors) or saccharine-cute (Comic Sans + cartoon stickers). Maxima rejects both.

Their answer: **use premium paid foundry fonts (Dinamo's ABC Diatype Rounded) at gigantic display sizes, with a rigorously tokenized 4-program color system, hand-illustrated cartoon clouds and characters, and copy that sounds like a real human wrote it.**

**Premium signals (in order of importance):**
1. **ABC Diatype Rounded** at **767px** weight 900 in `#2668FD` bright blue — each letter individually rendered for stagger animation. This is a $$$ Dinamo Type font deployed at heroic scale.
2. **A 4-program color world system** — every age range gets its own primary + secondary color pair. Switch programs and the entire site re-themes.
3. **Custom hand-illustrated characters** for every page (the 404 has a giant blue figure with a green bird; the program pages have illustrated children/adults in matching colors)
4. **Cartoon clouds** as a recurring motif across all pages — playful but consistent
5. **Voice of an actual human**: *"We're not a clinic. We're a community."* / *"Families were telling us they felt lost in systems that were cold, clinical, or dismissive. So we built something warmer."*
6. **Self-aware humor in legal pages**: their privacy policy literally ends with *"Please note that this Privacy Policy is entirely fictitious and should not be used as a template."* — a placeholder shipped to production with a wink
7. **Poetic program names**: "The First Years Matter Most" / "The Learning Years Shape Us" / "The Working Years Build Futures" / "The Golden Years Deserve Care"
8. **An actual e-commerce shop** with playful product names: SUNSHINE TOTE BAG, GENTLE MORNING MUG, GOOD IDEAS PENCIL, FEEL-GOOD SOCKS, No Stress Ball, DIFFERENT ANGLE CAP

This is what "premium" means when the brand's job is to make people feel safe, not impressed.

---

## 2. The 4-program color world system

This is the key architectural pattern. Each of the 4 life-stage programs has its own color world, and the entire route's theme switches when you navigate to it.

```css
:root {
  /* PROGRAM 1 — Early Intervention (Ages 0-3) */
  --color-program1-primary:    #fdcb40;  /* yellow */
  --color-program1-secondary:  #fff2b7;  /* pale yellow */

  /* PROGRAM 2 — Adaptive Skills Training (Ages 3-18) */
  --color-program2-primary:    #00b351;  /* green */
  --color-program2-secondary:  #a7eb98;  /* pale green */

  /* PROGRAM 3 — Workforce Development (Ages 18-65) */
  --color-program3-primary:    #f780d4;  /* pink */
  --color-program3-secondary:  #f5cbff;  /* pale pink */

  /* PROGRAM 4 — Residential Support (Ages 65+) */
  --color-program4-primary:    #2cd1d0;  /* turquoise */
  --color-program4-secondary:  #b9ecea;  /* pale turquoise */
}
```

Each program has a **primary (saturated) + secondary (pale)** pair. Headlines and accents use primary; backgrounds and chips use secondary.

### Mapping
| Program | Age | Primary | Secondary | Mood |
|---|---|---|---|---|
| Early Intervention | 0-3 | `#FDCB40` yellow | `#FFF2B7` pale yellow | Sunshine, beginning |
| Adaptive Skills | 3-18 | `#00B351` green | `#A7EB98` pale green | Growth, learning |
| Workforce Dev | 18-65 | `#F780D4` pink | `#F5CBFF` pale pink | Independence, identity |
| Residential | 65+ | `#2CD1D0` turquoise | `#B9ECEA` pale turquoise | Calm, dignity |

This is the **per-section-world idea applied at the route level**. Each page is a complete color universe. Users only see one program at a time, so the palette never feels cluttered — but across the site, there's the visual richness of 8 colors.

### Plus a named hue palette for global use
```css
--color-mauve:        #503fd0
--color-salmon-pale:  #ffa8e5
--color-salmon:       #ffcccd
--color-beige:        #f3efe0    /* THE PAGE BACKGROUND on most pages */
--color-blue:         #2668fd    /* HERO DISPLAY TEXT — the bright sky blue */
--color-blue-dark:    #314c95
--color-blue-moss:    #eef9f8
--color-yellow:       #fdcb40
--color-orange:       #f80
--color-red:          #fd4401
--color-red-dark:     #ae0c36
--color-green:        #00b351
--color-green-pale:   #a7eb98
--color-green-dark:   #005c00
--color-turquoise:    #2cd1d0
--color-turquoise-dark:#2b93a1
--color-purple:       #6b3088
--color-light-gray:   #f1f1f1
--color-white:        #fff
--color-black:        #000
```

That's **20+ named colors** in the global palette, on top of the 8 program-specific colors. Total system: **~28 colors**. Most are unused on any given page — they're available when needed.

The page background `#F3EFE0` (beige) is the consistent neutral across all programs — the warm sand/cream that feels like a kid's sketchbook page.

---

## 3. Typography — premium friendly fonts

| Font | Source | Role | Usage |
|---|---|---|---|
| **ABC Diatype Rounded** (900) | Dinamo Type Foundry ($$) | Hero display | **767px** in `#2668FD` (bright blue), each letter its own DOM element |
| **ABC Diatype Rounded Plus** | Dinamo | Heavier display variant | Used at large but not gigantic sizes |
| **Robuck Rounded** | Display font | Hand-drawn rounded accent | Used for playful labels, possibly the "THE PAGE FOR" 404 message |
| **Open Sans** | Free Google Font | Body text | Long-form paragraphs |
| **ui-sans-serif** | System fallback | Default | — |

### Why ABC Diatype Rounded matters
Dinamo is a Swiss type foundry; ABC Diatype is one of their flagship families and **ABC Diatype Rounded** is the rounded variant — friendly without being childish, geometric without being cold. Used by Notion, Vercel, and other tech brands that want to feel approachable.

**ABC Diatype Rounded at 767px / weight 900** is an unbelievable choice for a healthcare site. It says: "We respect your child enough to set their landing page in the same fonts as the world's premier tech brands." That's a class signal that no clinical typeface can deliver.

### Letter-by-letter rendering
Each letter of "talk", "learn", "play" (the page's hero word group) is rendered as its own element at 767px. This means they can:
- Stagger entry animations per letter
- Animate each letter independently (rotation, scale, color)
- Position letters non-uniformly (overlap, offset)
- Recolor specific letters in different program colors

### Robuck Rounded
A separate hand-drawn rounded font, used for accent moments. Likely the more "kid handwriting" voice while ABC Diatype Rounded is the "premium tech" voice. Two complementary friendly fonts.

---

## 4. Page structure — programs as routes, not sections

Most agency sites have one long scroll with section anchors. Maxima uses **separate routes per program** with theme switching. URL structure:

```
/                          → redirects to /programs/3-to-18
/programs/0-to-3           → Early Intervention (yellow world)
/programs/3-to-18          → Adaptive Skills Training (green world)
/programs/18-to-65         → Workforce Development (pink world)
/programs/65-and-plus      → Residential Support (turquoise world)
/areas                     → Service Areas (21 California regions)
/about                     → Our Story
/careers                   → Job listings (Physical Therapist, SLPA, Child Dev Specialist)
/faq                       → FAQ
/shop                      → 7-product e-commerce
/contact                   → Contact form with subject options
```

This means each program page can have **completely different illustrations, headlines, and color treatments** while sharing the same component system. The user navigates between worlds via the nav.

### Inside one program page (e.g. Adaptive Skills Training)
```
[Hero — 767px "talk learn play" or similar in blue, beige bg, illustrated cloud and character]

[Program description — "Adaptive Skills Training focuses on building the essential skills..."]

[Key approaches — 4 columns]
  - Adaptive Skills Training
  - Evidence Based Practices
  - Positive Behavioral Intervention & Support (PBIS)
  - Parent/Caregiver Education

[Belief statement — large editorial text]
  "We believe independence grows when children are supported with care,
  respect, and the freedom to learn at their own pace."

[About Maxima section — story snippet linking to about page]
  "talk / learn / play"
  "The Learning Years Shape Us"
  Long-form story paragraph

[Service Areas — "We made the process as quick, easy, and stress-free as possible."]

[Get started — 4-step process]
  1. Start With a Referral
  2. Create a Customized Plan
  3. Learn and Grow Together
  4. (Next stop: Workforce Development → links to program 3)

[Footer — Programs / Careers / Shop / Service Areas / Our Story / FAQ / Contact / Donate]
```

### The "Next stop" cross-link
At the end of each program page, there's a **"Next stop"** link to the next age range:
- Early Intervention → Adaptive Skills
- Adaptive Skills → Workforce Development
- Workforce Development → Residential Support
- Residential Support → Early Intervention (loops back)

This creates a **lifecycle journey** through the site. The brand isn't four programs — it's a single continuous arc of care from birth to senior years. The cross-links make that explicit.

---

## 5. Voice & copywriting

This site has the best voice of any in the reference set. Examples:

**Mission statement**:
> "We don't treat disabilities. We support differences, from birth to golden age."

**Origin story**:
> "Families were telling us they felt lost in systems that were cold, clinical, or dismissive. So we built something warmer. A place where children, teens, adults, and elders could be seen, understood, and supported through every life stage. Our name says it all: we aim to offer the maximum support, the maximum care, and the maximum belief in people's potential. **We're not a clinic. We're a community.**"

**Program names** (poetic, life-stage-aware):
- "The First Years Matter Most" — Early Intervention
- "The Learning Years Shape Us" — Adaptive Skills
- "The Working Years Build Futures" — Workforce Development
- "The Golden Years Deserve Care" — Residential Support

**Process steps** are functional but warm:
1. *Start With a Referral* — "Have your Regional Center Service Coordinator refer your child to our program to begin services."
2. *Create a Customized Plan* — "We collaborate with families and the IPP team to design a plan focused on meaningful progress and everyday skills."
3. *Learn and Grow Together* — "Services take place where your child lives, learns, and plays, ensuring skills are meaningful and functional."

**Contact subjects** include "Feedback" and "Other" — they want to hear anything, not just sales-qualified leads.

**Career copy**:
> "We believe rest is essential to care. Take the time you need — guilt-free." (Paid Time Off)
>
> "Work when and where you're most productive, whether you're an early bird or a night owl." (Flexible Schedules)
>
> "On-demand guidance from senior clinicians to help you navigate clients, documentation, and more." (Mentorship)
>
> "You'll be surrounded by smart, capable, and helpful people who want you to thrive." (A Team That Cares)

**The shop product names** are the masterclass:
| Product | Name |
|---|---|
| Tote bag | **SUNSHINE TOTE BAG** |
| Mug | **GENTLE MORNING MUG** |
| Pencil | **GOOD IDEAS PENCIL** |
| Socks | **FEEL-GOOD SOCKS** |
| T-shirt | **SUNSHINE T-SHIRT** |
| Stress ball | **No Stress Ball** |
| Cap | **DIFFERENT ANGLE CAP** |

Every product name contains a **feeling word** — sunshine, gentle, good, feel-good, no stress, different angle. Nothing is named generically. Each item is a small moment of self-care branded as such.

**Self-aware easter egg** — at the end of their privacy policy:
> *"Please note that this Privacy Policy is entirely fictitious and should not be used as a template or guideline for a real website."*

A placeholder shipped to production. Either it's an in-joke, or they're owning that the page is a stub. Either way, it humanizes the legal section — and that's the section nobody else humanizes.

---

## 6. Custom illustrations as the visual signature

Every page has hand-drawn illustrations:
- **Cartoon clouds** float across the top of each page (multiple sizes)
- **Character illustrations** for each program (a child in early-intervention green, a teen in adaptive-skills colors, etc.)
- **The 404 page** has a custom illustration: a giant seated blue figure with a green bird on its shoulder, surrounded by clouds and a colorful rainbow shape

The illustrations are **all in flat-color vector style** matching the program colors. They're not photos. They're not 3D renders. They're not Lottie animations. They're **handmade SVGs** that probably go straight from Illustrator into the build.

**Why this matters:** illustrated characters in a kids/family healthcare site are *expected*. What's unusual is that Maxima's illustrations are:
- Stylistically consistent (one illustrator's hand)
- Non-saccharine (no smiling stock-photo families)
- Colored from the same token system as the rest of the site
- Used as **layout elements** (the character takes up real estate, anchoring the composition)

This is the **"one illustrator, one style, every page"** approach. It's the same idea as SOHub's single robot mascot — but here, the illustration system is more elaborate because there's a character per program.

---

## 7. Tech stack details

- **Framework:** React Router v7 (or Remix) — confirmed by `window.__reactRouterContext.streamController` and `$RC` / `$RV` streaming SSR helpers in the page source
- **CMS:** Sanity (`cdn.sanity.io/images/ucjvjwsr/production/...`) — all program content, jobs, products, FAQs are managed in Sanity
- **CSS:** Tailwind v4 (`oklch()` color tokens, `--tw-*` properties)
- **Cookie consent:** [orestbida/cookieconsent](https://github.com/orestbida/cookieconsent) — confirmed by `--cc-*` token names
- **Fonts:** Self-hosted (likely WOFF2) — ABC Diatype Rounded, Robuck Rounded, Open Sans
- **No WebGL canvas** detected
- **No videos** in hero
- **No custom elements** (vanilla React component composition)

### Server-side rendering streaming
The page uses React Router's SSR streaming protocol (`$RC("B:0", "S:0")`), which means content is **progressively rendered as it's ready** rather than waiting for everything. Users see the first paint instantly. This is a 2024-era performance pattern that contributes to the site feeling fast.

### CMS-driven everything
Programs, jobs, products, FAQs, and even legal pages are all in Sanity. The 21 service areas (Alta California / Central Valley / East Bay / Eastern LA / Far Northern / Frank D. Lanterman / Golden Gate / Harbor / Inland / Kern / North Bay / North LA County / Orange County / Redwood Coast / San Andreas / San Diego / San Gabriel/Pomona / South Central LA / Tri-Counties / Valley Mountain / Westside) are CMS records with `isActive` toggles — they can switch a region on/off without a code deploy.

---

## 8. The 4-step "Get started" process pattern

Every program ends with a 3-4 step process visualization:

```
01. Start With a Referral
    ↓
02. Create a Customized Plan
    ↓
03. Learn and Grow Together
    ↓
04. (Next stop — links to next program)
```

Numbered, large, with brief warm descriptions. This pattern is reused across all 4 programs with slight variations. **Reusing structure across pages reinforces brand cohesion** — visitors recognize "oh, this is the same kind of journey, the company has a system."

---

## 9. What to steal

1. **Per-route color worlds** — instead of switching backgrounds on scroll, switch them on navigation. Each route is a complete theme. Use CSS custom properties scoped to a route-level wrapper class.
2. **A premium paid friendly font** for friendly contexts — ABC Diatype Rounded, ABC Walter, Söhne Breit, etc. Free fonts that look "friendly" almost always look cheap. Pay for the rounded one.
3. **One huge editorial display word per hero**, set letter-by-letter at >500px. "talk / learn / play" or "build / design / ship" — three short words that name your modes.
4. **A primary + secondary color pair per section/program**, where the secondary is a pale tint of the primary. Use primary for accents, secondary for backgrounds.
5. **Poetic section/program names** instead of functional ones. "The Learning Years Shape Us" beats "Ages 3-18 Program."
6. **A "Next stop" cross-link** at the end of every section/route, linking to a logical next destination. Creates a journey feeling instead of a hub-and-spoke feeling.
7. **CMS-driven content** — even if it's just for one team member, having the marketing copy in Sanity/Contentful means you can iterate without code deploys.
8. **Voice that includes "we"** instead of "the company". Read your copy aloud. If it sounds like a press release, rewrite it.
9. **Self-aware Easter eggs in legal pages** — humanize the boring sections that nobody bothers to humanize.
10. **Product/feature names with a feeling word** in them. SUNSHINE / GENTLE / GOOD / FEEL-GOOD / DIFFERENT-ANGLE. If your product is generic, your name doesn't have to be.
11. **A 4-step "Get started" process** at the end of every major section. Numbered, named, brief. People love processes.
12. **An actual shop with branded merch** — even just 7 products. Selling something physical changes how people perceive your brand from "service provider" to "studio with taste".
13. **Custom illustrations from one illustrator** instead of stock or AI imagery. The visual cohesion is the premium signal.
14. **A custom 404 page** that uses the same illustration system as the rest of the site. Don't waste your error pages.
15. **Streaming SSR** if you're using React Router/Remix — the perceived performance gain is worth the complexity.

---

## 10. What Maxima refuses to do

- Use stock photography
- Use clinical/medical iconography (no caduceus, no stethoscope, no checklist clipboards)
- Use the words "expert", "leading", "best-in-class", "proven"
- Refer to children as "patients"
- Use Comic Sans or any "kid font" that looks cheap
- Use a hero video of a smiling family
- Pretend to be bigger than they are
- Skimp on the legal pages
- Have a "schedule a free consultation" CTA above the fold

The site is what happens when a healthcare brand commits to looking like a **studio**, not a clinic. The fonts are studio-tier, the illustrations are studio-tier, the copy is studio-tier — but the *content* is genuinely about therapy and care.

---

## 11. Comparison snapshot

| | UT | SOHub | Artefakt | C4G | **Maxima** |
|---|---|---|---|---|---|
| **Color count** | 4 | 6 | 2 | 11 | **~28 (4 program worlds + global)** |
| **Display font** | PPMori | publicaPlay | DrukWide | Druk Cond Super | **ABC Diatype Rounded (Dinamo)** |
| **Hero text size** | 96px | 56px tagline | 112px | 422px | **767px** |
| **Theme switching** | None | None | None | Per-section | **Per-route (programs)** |
| **CMS** | Webflow | Inline | Inline | Webflow | **Sanity** |
| **Stack** | Webflow + GSAP | Next + HeroUI | Web Components | Webflow | **React Router v7 + Sanity** |
| **Illustrations** | None (3D) | One robot | None (canvas) | Heavy | **One per program** |
| **Mood** | Dystopia | Restraint | Brutalism | Maximalism | **Warmth + dignity** |

Maxima is the only site in the set that uses **per-route theming** and **a premium friendly font as the display face**. It's the most successful at being approachable without being childish. If your portfolio's audience values warmth + craft over edge or austerity, this is the closest reference.
