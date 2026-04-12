# Milkshake Studio — 2020 Year in Review
**URL:** https://2020.milkshake.studio/
**What it is:** A standalone microsite Milkshake Studio built specifically to recap their 2020 work, projects, and predictions for 2021. **Not their main site — a one-off custom artifact for a single year.**
**Tagline:** "A (CHAOTIC) Year in Review"
**The thesis (in their own words):** *"we wrapped it in loud colors and huge typography"*
**Stack:** Custom hand-built (no Webflow/CMS detected) + 4 WebGL canvases + Tailwind defaults + 6+ paid premium fonts. Hand-coded scroll experience.

> **Note from the author:** This is the site you (the user) explicitly cited as the gold standard — the one with "videos on hover over numbers" and "lots of micro-interactions". This doc is the longest and most actionable because **this is the brand of "premium + alive" you actually want to imitate.**

---

## 1. Why this site is the user's gold standard

Milkshake's 2020 microsite is what happens when a studio decides to **make their year-in-review feel like a magazine cover story instead of a portfolio update**. Every page-equivalent section is a typographic moment. Every stat has personality. Every prediction is a comedy bit. Every transition has been hand-tuned.

**The five things that make it iconic:**

1. **The "by the numbers" section with absurd specificity** — `173 Slices of Paulie Gee's pizza consumed`, `3 Office Plants Perished`. Mixed in with real metrics (`12 Projects Launched`, `8 Awards`, `50k+ Slack Messages`, `3,126 GitHub commits`).
2. **512px project names** in House Gothic — each case study is a single oversized word as the entire layout.
3. **Long-form irreverent essays** that take strong opinions: the "Ultimate Gray" rant against Pantone 17-5104, the Apple-causes-COVID joke, the alien-deodorant prediction.
4. **A cream parchment palette** with pink hairline framing — feels like a riso-printed zine, not a website.
5. **A custom microsite for one year of work** — the willingness to ship a 1-page year-in-review as a separate domain (`2020.milkshake.studio`) is itself the premium signal.

The combination: rigorous typography + personality copy + stats with humor + huge type at every section + a tight cream-and-pink palette. **That's the recipe.**

---

## 2. Color palette — cream parchment + warm accents

No CSS custom properties at all (`--` token count: **0**). Every color is inline in the markup. Extracted from the running site:

```
PRIMARY
#E4E0DD   rgb(228, 224, 221)   ← Body background — warm parchment cream
#000000   rgb(0, 0, 0)         ← Body text — true black

SECONDARY CREAMS (per section)
#F9F6F2   rgb(249, 246, 242)   ← Lighter cream
#F9F7F0   rgb(249, 247, 240)   ← Even lighter cream (yellow-tinted)
#F5F1EE   rgb(245, 241, 238)   ← Mid cream

ACCENTS (one per section/project)
#142C74   rgb(20, 44, 116)     ← Deep navy (Voy Media, Crunchtime, Mindbloom)
#20013C   rgb(32, 1, 60)       ← Deep purple
#F7901E   rgb(247, 144, 30)    ← Orange (warning/highlight)
#0060DD   rgb(0, 96, 221)      ← Bright blue
#0000EE   rgb(0, 0, 238)       ← Pure web blue (link default)
#BAF2C3   rgb(186, 242, 195)   ← Mint green
rgba(255, 192, 203, 0.3)        ← Pink overlay (the frame border!)
#232326   rgb(35, 35, 38)      ← Near-black warm
#808080   rgb(128, 128, 128)   ← Mid grey
```

### Palette philosophy
The base is **cream + black**. Then each section/project introduces **one new color** as its world: navy, purple, orange, bright blue, mint, pink. The accents never fight each other because they only appear one at a time.

The pink frame (`rgba(255, 192, 203, 0.3)` = pink at 30% opacity) is a **constant** — it borders every viewport like a riso print bleed. It's the only thing that's the same on every screen.

### Compare to your portfolio
The user's existing portfolio uses charcoal + cream worlds. **Milkshake validates that approach.** The difference is Milkshake is much warmer (cream is yellower at `#E4E0DD`, vs your cooler `#EBE5CE`-style creams). And Milkshake's accent palette is **bolder** — they go to deep navy and bright orange, not muted secondaries.

**Steal:** the cream-base + one-bold-accent-per-section idea. Drop the muted secondary tints in favor of one heavy accent per world.

---

## 3. Typography — six paid premium fonts

This site uses **more paid fonts than any other in the reference set**. Detected via DOM inspection:

| Font | Foundry | Role |
|---|---|---|
| **Editorial New** | Pangram Pangram ($$$) | Hero serif headline — "A (CHAOTIC) YEAR IN REVIEW", high-contrast didone-style |
| **Neue Haas Grotesk Display** | Adobe / Linotype ($$) | Body copy + nav — the proper Helvetica, not Inter |
| **Neue World** | Premium foundry | Display accents |
| **House Gothic** | House Industries ($$$) | **512px project names** — Voy Media, Crunchtime!, Mindbloom |
| **Times New Roman** | System | Editorial fallback for italics |
| **Open Sans** | Google Fonts | Possibly fallback |

### Why six fonts works
Most people would say "six fonts is too many." Milkshake makes it work because **each font has a clear job**:
- Editorial New = the magazine title moment (one place: the hero headline)
- Neue Haas = body and navigation (the workhorse, used everywhere)
- House Gothic = project names ONLY (one place: the case study reveals)
- Neue World = accents
- Times New Roman = system serif
- Open Sans = system sans fallback

Each font appears in exactly one role. None of them blur into each other. **Six fonts ≠ chaos when each font has a single, recognizable assignment.**

### The hero headline — "A (CHAOTIC) YEAR IN REVIEW"
Set in **Editorial New** at large size, with **the parenthesized "(CHAOTIC)" as a stylistic interruption**. The parentheses are real ASCII characters, not styled differently — but the visual rhythm of the "(CHAOTIC)" against "A YEAR" creates a beat. It's like reading aloud with vocal emphasis.

### The 512px project names
The project names ("Voy Media", "Crunchtime!", "Mindbloom") are each set as **standalone 512px House Gothic 400 (regular weight)** elements. Each project gets a viewport to itself with the name dominating.

**They're rendered TWICE in the DOM** — once visible in the section color, once with `color: rgba(0, 0, 0, 0)` (transparent). This is a **scroll-state animation trick**: the transparent copy is the "to-state", and a CSS/JS animation morphs from one to the other on scroll. Think of it like a `<canvas>` with two layers.

### Setting style: parentheses, mixed weights, ALL CAPS
Look at the title carefully:
```
A (CHAOTIC)YEAR
IN REVIEW
```

Three things to notice:
1. **No space between "(CHAOTIC)" and "YEAR"** — the parenthesized word abuts the next word, like a film title (Birdman, or (The Unexpected Virtue of Ignorance))
2. **The line breaks are manual** — not flowed by width
3. **All caps for the title, but with one parenthesized word** that draws the eye

This is **typesetting as voice modulation**. The parens are a whisper, the caps are a shout, and they're side by side.

---

## 4. The "by the numbers" section — the masterpiece

This is the section the user specifically cited. Reproducing the actual content:

```
A look at 2020 by the numbers.

  12       Projects Launched
  18       States Driven Through
  173      Slices of Paulie Gee's pizza consumed
  8        Honors & Awards
  50k+     Slack Messages
  3,126    github Commits
  3        Office Plants Perished
  5        New (Amazing) Clients
```

### Why this works (brutally important to internalize)

1. **Real metrics mixed with absurd metrics.** "Projects Launched" and "Honors & Awards" are real. "Slices of Paulie Gee's pizza" and "Office Plants Perished" are personality. The mix is the entire trick — neither pure-real (boring) nor pure-absurd (unserious). **A 50/50 mix.**

2. **Specificity is the joke.** It's not "many pizza slices" — it's **173**. It's not "some plants" — it's **3**. The numbers are committed to. **Specificity = honesty = funny.** A vague joke doesn't land; a precise one does.

3. **They named the pizza place.** "Paulie Gee's pizza" — not "pizza", not "our favorite pizza place", **a real Brooklyn pizzeria**. Adding the proper noun makes it real, makes it local, makes it New York studio life.

4. **"github Commits" is lowercase 'g'.** Look closely at the metric. "github" is lowercase. This is either a typo or a deliberate nod to how developers actually write it. Either way, it's human. A perfect site would have "GitHub Commits" — Milkshake doesn't bother. The slight imperfection makes it feel hand-built.

5. **"New (Amazing) Clients"** — the parenthesized adjective. Same trick as "(CHAOTIC)" in the title. A whispered editorial note that adds personality without slowing down the line.

6. **Counter order matters.** The "real" numbers (12, 18) come first to anchor the reader. Then the joke (173 pizza). Then more real (8, 50k, 3,126). Then another joke (3 plants). Then back to real (5 clients). The rhythm is **real–real–JOKE–real–real–real–JOKE–real**. You're never sure which one is next.

### What to literally copy for your portfolio

You should have a "by the numbers" section. It should mix real and absurd. Examples for *your* portfolio (Akash):

```
10,000+   Devices handled concurrently         (real)
3         Engineers mentored                    (real)
99%       Uptime on EV infrastructure          (real)
6         Production systems shipped           (real)
   ↓ now add personality ↓
247       Cups of filter coffee in 2024        (absurd)
14        Late-night Slack threads with Ravi   (absurd, named)
2         Office plants kept alive             (absurd, low number)
1         DSL designed from scratch            (real, low number, brag)
0         Times I've used jQuery in 5 years    (the bragging zero)
```

The trick is the mix. The absurd numbers should be **specific** and **named** (not "many" or "lots"). The real numbers should be **numerically distinctive** (10,000 not 10K, 3,126 not 3K).

---

## 5. Project case studies — one giant word per project

Each of the 5 projects is presented as:

```
[Section bg color: cream variant]

Case Study | See it Live              ← top label, small Neue Haas
                                       (these are clickable labels!)

[GIANT 512px PROJECT NAME]            ← House Gothic, single line
Time Equities | Voy Media | etc.

Strategy + Web                        ← service tag, small caps Neue Haas

How does a global real estate         ← brief description, ~40-60 words
company re-imagine their digital      Neue Haas Display body size
presence? Lots of strategy,
interviews, and code.
```

**The 5 projects** (Milkshake's actual 2020 client list):
1. **Time Equities** — Strategy + Web — *"How does a global real estate company re-imagine their digital presence?"*
2. **Voy Media** — Brand + Web — *"Digital advertising doesn't have to be just numbers and CPMs."*
3. **Crunchtime!** — Strategy + Web — *"We gave the legends of food tech a proper website and brand refresh. We'd like to think we helped get your food delivered faster."*
4. **Mindbloom** — Brand + Web — *"We helped the ahead-of-the-curve team at Mindbloom launch psychedelic medicine for the masses."*
5. **Oji Life Lab** — Brand, Web, App — *"We helped bring emotional intelligence to the masses."*

### The case study writing pattern
Notice every description:
- Opens with a question or a confident statement
- Has 2-3 sentences max
- Ends with a clever observation or self-effacing brag
- **Names the client** as the protagonist (not "we built…")
- Uses "we" as the studio voice

**What to steal:** for your project descriptions, write 3 sentences max. Open with a question or thesis. Close with a small wink.

---

## 6. The voice — long-form irreverent essays

Beyond the case studies, the site has an introduction and a "Predictions for 2021" section. Both are written in a voice that takes opinions and tells jokes.

### The intro essay (excerpt):

> "Where to begin? No need to state the obvious. 2020 was a crazy year. Between pandemics, elections, civic unrest, devastating forest fires, **murder hornets**, and not being able to shake hands with anyone, there's been a lot to process. But through it all, a few things remained constant. **Email. The death of big retail. Fedoras still not being fashionable.** Debates like 'Should designers code?' and 'Is a taco a sandwich?' It was a year to reflect on the little things... At Milkshake, we kept on trucking. Making things on the internet for bold businesses that are focused on their future. This is a small peek into our year. A year like many experienced, except **we wrapped it in loud colors and huge typography**."

### What makes this voice work
1. **It admits chaos** — "No need to state the obvious. 2020 was a crazy year." Doesn't pretend to be above the moment.
2. **It uses pop culture references** that date the work — fedoras, "Should designers code?", "Is a taco a sandwich?". A year from now these will feel like time capsules. That's the *point*.
3. **It states the studio's thesis explicitly** — "we wrapped it in loud colors and huge typography." The voice is allowed to *describe* the design, not just be the design.
4. **It uses bolds and italics for vocal emphasis** — like reading aloud.
5. **Run-on sentence energy** — the first paragraph is one breathless run-on. That's the pacing.

### The Pantone "Ultimate Gray" rant (excerpted):

> "Pantone 17-5104. **No one uses this color once.** There is no such thing as 'Ultimate Gray'. There's change-of-pace gray, and background gray, and foggy gray, and grey, and gunmetal grey. But that's enough grays. I'm looking in the #F0F0F0 to #FAFAFA range, or I'm using black at different opacities, but **not Ultimate Gray. There is nothing strong or positive or thoughtful or ultimate about it. Sorry, Ernst and Young, but no.**"

This is the **opinion that wins the internet**. It commits to a specific design grievance, names the company that licensed the color (E&Y), drops actual hex codes, and refuses to be polite about it. **The Sorry, Ernst and Young, but no.** is the kind of line you'd never see on a corporate site.

### The Mindbloom one-liner

> "We helped the ahead-of-the-curve team at Mindbloom launch psychedelic medicine for the masses. **Glowing reviews all around.**"

"Glowing reviews" with a wink at the psychedelic context. They're letting the joke do the work without pointing at it.

---

## 7. The "Predictions for 2021" section

This is the back half of the microsite — a numbered list of fake predictions for the year ahead. Each prediction has a title and a 2-paragraph absurd narrative. Examples:

| Title | Setup |
|---|---|
| **Covid-19** | "Apple ended up being the source of the outbreak after an extensive investigation. They plan on releasing **COVID-19 Pro and COVID-19 Pro Max** in 2021." |
| **Fashion** | "Athleisure finally puts an end to every other fashion trend. Levi's and Big Demin all go bankrupt overnight... The company that creates **Wedding Attire out of sweatpants** has explosive growth, eventually unseating Tesla as the world's most overvalued company." |
| **Stock Market** | "Money as we know it becomes about as useful as the UN. We begin to rely on bartering, much like a global Burning Man." |
| **The Internet** | "The only man to do it [unplug it] decided to go hang gliding in a hurricane. **A selfish yet thrilling mistake.**" |
| **Outer Space** | "We finally contact intelligent life. The transmission ends up being an ad for **alien deodorant called Astrostick®**, sold directly to the consumer and made from only recycled materials." |
| **Senate Runoff** | "63% of people write in **Andre 3000** and... 56% write in **Big Boi**. Outkast is back baby!" |
| **Social Media** | "TikTok gains so much momentum that quartely investor calls are now done in **15 second dance clips**." |
| **Pantone 17-5104** | The Ultimate Gray rant (above). |

### What this section does for the brand
- **Shows opinions.** The studio has takes on Apple, design, EY, Outkast, athleisure.
- **Shows cultural literacy.** They reference things from the actual year (TikTok dance clips, COVID Pro Max, Andre 3000).
- **Shows comfort with absurdity.** The predictions are deliberately impossible. That's the joke.
- **Shows commitment.** Every prediction is 2-3 paragraphs of writing. Nobody else bothers.

You leave the site thinking: *"these people have a point of view, they spend time writing, they make jokes, and they ship."* That's the entire premium positioning.

---

## 8. The 4 WebGL canvases

Confirmed via DOM inspection: **4 separate `<canvas>` elements**. The site has 0 videos, so all motion is either CSS or canvas-rendered.

What the canvases likely do (inferred from the visible behavior + common patterns):
1. **A grain/noise overlay** — the site looks like riso paper, that grain is rendered in canvas (it's animated, you can see it shimmer)
2. **The pink frame border** — possibly a canvas-rendered border with subtle texture
3. **Project name morph** — between the visible and transparent copies of "Voy Media", there's likely a canvas drawing the morph state
4. **Page transitions** — possibly a curtain/wipe canvas for navigating between sections

### Why 4 canvases instead of CSS
The grain alone could be a CSS background-image, but **animated grain** (where the noise pattern shifts every frame) needs canvas. The pink frame *looks* like a CSS `border` but if you look carefully, the corners are slightly imperfect — that's a hand-drawn canvas border, not a clean CSS one.

The premium signal is: **they wrote shaders for the texture instead of using PNGs.** Most studios would slap a noise.png over the page. Milkshake animates it.

---

## 9. Layout — single-page scroll-jacked experience

`document.scrollHeight === window.innerHeight === 923` — the page is **literally one viewport tall** at the DOM level. This means:

- The "Scroll to Explore" prompt doesn't actually scroll the document
- Sections are revealed via **scroll hijacking** — your scroll input drives section transitions, but the page itself doesn't move
- Content swaps in/out via opacity/transform on layered absolute-positioned divs
- Each "scroll moment" is a discrete state, not a continuous scroll

This is why the site feels so deliberate. There's no awkward mid-scroll position. You're either *in* one section or transitioning to the next.

### Trade-offs of scroll-jacking
**Pro:** every state is hand-tuned, every transition is choreographed
**Con:** you lose native scroll affordance (no scrubbing back, no scroll position memory, harder accessibility)

Milkshake accepts the cons because the experience is the product. **For a portfolio, this is risky** — visitors who don't realize they're in a hijacked scroll get confused. Use carefully.

---

## 10. The frame chrome — pink hairline border

Around the entire viewport: a **pink hairline border** at `rgba(255, 192, 203, 0.3)` — peach/baby pink at 30% opacity. It's 2-3px thick, runs along all four edges, and includes **slightly imperfect/torn corners** in the top-right and bottom-left (visible in the screenshots).

### Why the imperfect corners matter
Perfect rectangles look CSS. **Imperfect rectangles look hand-drawn.** Milkshake's frame is:
- Not a rectangle. The corners have slight irregularities.
- Not a uniform width. The thickness varies subtly along the perimeter.
- Pink at 30% opacity. Not red, not magenta, not pure pink — a warm desaturated peach.

This is the **riso print aesthetic**. Riso (a Japanese duplicator printer) prints with imperfect registration, and the imperfections are part of the charm. Milkshake's frame says "we are a print zine pretending to be a website."

**The frame is the only constant on every page.** It's the brand's signature.

---

## 11. Tech spec summary

| | |
|---|---|
| **Document height** | 923px (single viewport — scroll-jacked) |
| **Body bg** | `#E4E0DD` (warm parchment) |
| **Body text** | `#000000` |
| **Body font** | Neue Haas Grotesk Display |
| **Display fonts** | Editorial New, House Gothic, Neue World |
| **CSS custom properties** | **0** (everything inline) |
| **Canvases** | 4 (grain, frame, type morph, transitions) |
| **Videos** | 0 |
| **CMS** | None detected (hand-built) |
| **Smooth scroll** | Likely custom (no Lenis class, but scroll-jacked) |
| **Total project count** | 5 case studies + 8 predictions + 1 numbers section |
| **Length** | ~5 minutes of reading + scrolling |

---

## 12. What to STEAL — the actionable list (this is the most important section)

If you only read one section of these reference docs, read this one. These are the things you can lift directly into your portfolio.

### Typography
1. **One serif moment + one sans workhorse + one display showpiece.** Your version: Editorial-style serif for the hero (e.g. PP Editorial New, GT Sectra, or your existing Bricolage at very condensed weight), Neue Haas / Inter / your existing Outfit for body, and one paid display (House Gothic, Druk, or Pangram-Pangram-style alternative) for project names at 400-500px.
2. **One project name = one viewport at 400-500px.** Stop trying to fit all your projects on one screen. Each project becomes its own oversized typographic page.
3. **Parenthesized words inside titles** for vocal emphasis: "I build (boring) infrastructure", "A (chaotic) year of shipping", "Engineering (with feelings)". The parens whisper while the caps shout.
4. **Manual line breaks in display headlines** — never let CSS flow your hero copy. Decide where the break is.

### Stats / "By the Numbers" section
5. **Mix real and absurd stats 50/50.** This is the single highest-leverage move you can steal. Use a section header like "A look at [2024] by the numbers" or "Some stats from this year".
6. **The absurd ones should be specific and named.** Not "many pizzas" — "247 cups of filter coffee from Third Wave Coffee Indiranagar". The proper noun anchors the joke.
7. **Order the stats: real–real–JOKE–real–real–real–JOKE–real.** Establish credibility, then pay it off with a wink, then back to credibility.
8. **Lowercase your "github commits"** or whatever — slight imperfection that signals "human wrote this, not a CMS".

### Voice
9. **Write a paragraph that admits something self-deprecating.** Milkshake admits 2020 was chaos. You can admit your portfolio is your fourth attempt, or that you got into Node because of a bad ASP.NET job.
10. **Take one specific opinion and commit to it.** Milkshake committed to "Ultimate Gray is bad". You can commit to "TypeScript any is fine" or "I'd pick Postgres over MongoDB ten times out of ten" or "JIRA is a productivity tax".
11. **Name real things.** Real coffee shops, real client names, real numbers. Specificity is the trust signal.
12. **Use bolds for vocal emphasis** in long paragraphs, like a magazine pull-quote does. Don't bold for "important keywords" — bold for **"this is the part you should hear if you only skim"**.

### Color
13. **Cream parchment (`#E4E0DD` or warmer) instead of grey** as your light backgrounds. Warmer creams feel like print, cool greys feel like screen.
14. **One bold accent per section/project.** Drop muted secondaries. Each project page gets a deep navy or a pure orange or a mint, full strength.
15. **A 30%-opacity pink (or other warm) hairline frame** around the viewport on every page. The constant chrome that says "you're in our world."

### Texture
16. **Animated grain via canvas**, not a static PNG noise overlay. The grain should *shimmer* slightly between frames. This is the single biggest "alive" signal you can add.
17. **Imperfect hand-drawn frame corners.** Don't use `border-radius: 0`. Slightly irregular. Slightly off-axis. Looks hand-drawn.

### Content moves
18. **A "year in review" or "this season" microsite** as a separate domain. Even just `2025.akashvarma.dev`. The willingness to ship a one-off says "I have time and taste."
19. **A "predictions for next year" section** with 5-8 absurd-but-specific takes. Doesn't have to be tech — could be predictions for the food at your favorite restaurant, the next JIRA disaster, the death of a framework.
20. **Long-form irreverent essays** instead of short-bullet About sections. Three paragraphs that take a stance and tell jokes. Show the visitor what your voice sounds like, not just what your skills are.

---

## 13. What Milkshake refuses to do

- Use a generic font (Inter, Poppins, DM Sans)
- Use a CMS
- Use stock photography
- Have a single hero CTA
- Have a "schedule a call" button
- Be neutral on anything
- Pretend the year was easy
- Use round numbers
- Be silent about specific brands they like or dislike
- Use a frame that's a clean rectangle
- Have a static (non-animated) grain
- Have a "by the numbers" section without at least one joke

---

## 14. Comparison snapshot — Milkshake vs the others

| | UT | SOHub | Artefakt | C4G | Maxima | **Milkshake** |
|---|---|---|---|---|---|---|
| **Color count** | 4 | 6 | 2 | 11 | 28 | **~14** |
| **Display font cost** | $$ | $$ | $$$ | $$$ | $$$ | **$$$$ (6 paid)** |
| **Hero text size** | 96px | 56px | 112px | 422px | 767px | **(Editorial New, large) + 512px project names** |
| **CSS tokens** | Many | 6 | Tailwind | Many | Many | **0** |
| **CMS** | Webflow | Inline | Inline | Webflow | Sanity | **None (hand-built)** |
| **Voice** | Worldbuilding | Studio confidence | Brutalist quiet | Editorial brand | Warm & dignified | **Funny, opinionated, self-aware** |
| **Stats with personality** | No | No | No | No | No | **YES — the killer feature** |
| **Long irreverent essay** | No | No | No | No | No | **YES** |
| **Per-project oversized typography** | No | No | No | No | No | **YES** |
| **Microsite for one year** | n/a | n/a | n/a | n/a | n/a | **YES** |

**Milkshake is the only site in the entire reference set that has personality copy.** Every other site has *good* copy but neutral copy. Milkshake's copy is **opinionated, funny, and culturally literate**.

That's why you (the user) love it. The other sites look premium. **Milkshake feels like a person you'd want to hire.**

---

## 15. The single sentence summary

**Milkshake's 2020 microsite is what happens when a studio commits to the idea that "premium" and "funny" are not opposed, and then spends real money on fonts, real time on writing, and real attention on every typographic decision — to ship a one-off zine for one year of work.**

Premium = restraint + craft + ***voice***. Most sites have the first two. Milkshake has all three.
