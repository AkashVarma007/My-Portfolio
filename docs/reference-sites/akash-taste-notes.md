# Akash's Taste Notes — what he actually loves

Source: in-conversation feedback where Akash described specific moments across Milkshake 2020, Maxima Therapy, and Utopia Tokyo that resonated with him, with screenshots.

---

## The single pattern that unifies everything

**Akash loves "reveals", not "effects".**

In every feature he called out, the user's action uncovers something hidden, and the hidden content is specific, personal, and rewarding. The interaction isn't decoration — it's discovery.

| Site | User action | What gets revealed |
|---|---|---|
| Milkshake 2020 | Hover on a metric number | A meme video plays inside a watery/wavy frame that's *contextually matched* to the metric |
| Maxima Therapy | Hover a nav item | A paper-like card rotates/tumbles out from behind the nav, revealing menu items in a hand-drawn/torn-paper style |
| Utopia Tokyo (mask creator) | Drag with mouse on empty canvas | The drag path acts like a paintbrush, revealing a colored illustration underneath the grid |

**Common DNA:**
1. **The default state is quiet and clean.** You don't get hit with everything at once.
2. **Engagement is required.** You have to hover, drag, scroll, or click to see the good stuff.
3. **The reward has personality.** Memes tied to specific numbers, hand-drawn menu cards, paint-reveal art with kanji and red figures — each reveal has *taste*.
4. **The interaction has a physical metaphor.** The dropdown "tumbles out like paper". The drag "paints like a brush". The hover opens a "watery window". These are tactile concepts, not CSS transitions.
5. **It rewards curiosity.** The user discovers the personality instead of being force-fed it.

**This is completely different from what I've been building for him.** Magnetic buttons, parallax, spring pills, tilt cards, section-number scrambles — those are decorations applied to content that's already visible. Nothing was hidden. Nothing got revealed. The user's action didn't uncover anything new or personal.

---

## Feature-by-feature breakdown

### From Milkshake 2020 — the stats section

**What Akash loves:**
1. **Stats with personality**: Real metrics (12 projects, 3,126 GitHub commits) mixed with absurd specifics (173 slices of Paulie Gee's pizza, 3 office plants perished)
2. **Hover-plays-meme on each number**: Each stat has a relevant meme video that plays when you hover — the video is framed inside a **watery/wavy/blurred organic shape**, not a rectangle. Example: hovering "12 PROJECTS LAUNCHED" shows a Simpsons meme inside a blurred soft-edge window near the number.
3. **"Hover Us" badge on the divider line**: The horizontal rule between metric rows has a small circular "Hover Us" sticker that prompts the interaction. It's permission to play.
4. **Draggable hero numbers**: In the hero, Akash can grab and throw the numbers around with physics.
5. **Persistent ambient motion during scroll**: As you scroll, something is always subtly moving — no frozen frames, no dead space.
6. **Smooth color/section transitions**: As you scroll between sections, the background color and content ease into each other rather than snapping at a scroll threshold.

**Akash's exact words:** *"EVERYSINGLE THING IS BEAUTIFUL, SIMPLE, CLEAN, CREATIVE and ENGAGING."*

**The key adjective: CLEAN.** He doesn't want maximalism. He wants **minimalism that rewards curiosity**. Quiet default state + creative reveals on interaction.

### From Maxima Therapy — the nav dropdown

**What Akash loves:**
1. **Age-group chooser in the hero**: User picks 0-3, 3-18, 18-65, or 65+ as their starting context, and the content that loads below matches their choice. The hero becomes a *personalized entry point* instead of a static banner.
2. **Scroll-triggered font appearance**: Text reveals (fade/morph/character-by-character) as each section enters the viewport.
3. **The dropdown card that rotates out like paper**: This is the moment he said "hooked me the most". When you hover a nav item, a white card tumbles out from behind the nav at a tilted angle (as if unfolding from a book), revealing menu items in bold orange uppercase text — "EARLY INTERVENTION / ADAPTIVE SKILLS / WORKFORCE / RESIDENTIAL" on one card, "OUR STORY / CAREERS / FAQ / SHOP / CONTACT" on another. The effect feels *handmade* — like paper, not CSS.

**Akash's key principle** (this is the line to remember):
> *"the user randomly interacts with something and the website performs the expected task in unexpected and creative way which would leave lasting impression in users."*

Translation: **Do the expected job. Just don't do it in the expected way.** The nav SHOULD open a menu — but it doesn't have to do it with a CSS `slide-down` animation. It can tumble out like a paper card. Same job, different feeling.

### From Utopia Tokyo — the drag-to-reveal mask creator

**What Akash loves:**
1. **Masks gallery with hover highlight** (screenshot 3): The grid of 14 masks uses small corner brackets + a small katakana tooltip ("ナマハゲ") to show which mask is under the cursor. The background displays large "NAMAHAGE" text in TronicaMono that morphs between names as you hover between masks. **The interaction makes the user feel like they're targeting something — like a HUD viewfinder, not a gallery.**
2. **The drag-to-reveal painting** (screenshots 4 and 5): The page starts with sparse hints of content (a small "SEC-01", "SEC-02", corner fragments of red imagery, "DRAG TO REVEAL" prompt, a cyan wireframe of "TRICKSTER"). When the user drags their mouse across the empty grid, their drag path acts like a paintbrush that **erases an upper layer to reveal a colored image underneath**. Full reveal: a striking red samurai/Tengu illustration with kanji "狭猪なろ天狗" and the "TRICKSTER" title filled with cyan-over-cream.

**Akash's exact words:** *"such a candy for the eye, at least for me."*

**What this interaction has that the rest of UT doesn't:** it's **hands-on**. You're not just scrolling past content — you're *making* the content appear with your own gesture. The reveal is tied to YOUR mouse path, which makes it feel personal. No two users reveal the image in the same order.

---

## What this tells me Akash's current portfolio is missing

### The wrong kind of motion everywhere
The portfolio has lots of motion — magnetic buttons, parallax, tilt cards, spring hovers, scramble effects, ambient spotlights. But none of these are **reveals**. They're decorations on content that was already visible. They don't uncover anything, they just make existing things wobble or glow.

### No creative delivery mechanism for the voice
I previously told Akash his biggest gap is voice (based on Milkshake's 99/100 voice score). That's still true. But I under-specified HOW to deliver the voice. Just writing better sentences and putting them on the page isn't enough — the best sites hide their voice behind **creative interactions** so users discover it as a reward.

> Voice + Reveals = the formula Akash is actually chasing.

Not voice alone. Not reveals alone. The combination.

Example: instead of a static stats row showing "10,000+ Devices handled concurrently", the stat should be quiet by default, and **hovering it plays a relevant meme/video/animation with specific personality tied to that number** (e.g., the moment you realized you had 10k devices connected, what it felt like, a visual joke about that). The stat IS the voice; the hover IS the reveal.

### The current portfolio shows everything at face value
Scroll in, see the content. No mystery. No discovery. Nothing hidden waiting for the user to find it. The scavenger hunt + arcade are easter eggs, but the *main content* (projects, about, stats, skills) has no reveals. It's all visible immediately.

---

## What to build into the portfolio (concrete ideas based on his taste)

These are ideas I have, to be validated before building:

1. **A "Reveal Stats" section** — Akash's version of Milkshake's by-the-numbers. Each metric is quiet by default. On hover, a small framed media element appears next to the number (could be a meme GIF, an animated sticker, an SVG sequence, a looping micro-video) tied specifically to the number. The frame should be an organic shape (SVG displacement filter), not a rectangle. Add a "Hover me" sticker on the dividing line between rows.

2. **A draggable hero** — not just parallax. Some element(s) in the hero should respond to click-and-drag with physics (spring, momentum, collision). Could be the name letters (drag "AKASH" around), a floating orb, stat numbers.

3. **A drag-to-reveal section somewhere** — could be the About section (you drag a brush across the card to reveal Akash's story), or a hidden work case study that requires painting to uncover. The revealed content has to have personality — handwritten annotations, a code snippet, a sketch, etc.

4. **A creative nav dropdown** — his nav shouldn't slide down. It should do something unexpected-but-appropriate. Ideas: a paper card flipping out (like Maxima), a "terminal popping up" (fits his engineering voice), a "filing cabinet drawer sliding out", a "blueprint unrolling".

5. **A "Hover Us" style affordance culture** — Akash should add small "hover me" / "click me" / "drag me" hints next to interactive elements, so users know to engage. Without the hint, they'll scroll past.

6. **Smooth scroll-triggered color transitions between sections** — the portfolio currently has hard section breaks (charcoal → cream → charcoal). Instead, the background should *ease* between colors as you scroll past the boundary, like Milkshake does.

---

## My open questions for Akash

Before we build anything, I need these answered:

### Q1. On the Milkshake meme-hover:
Do you want **literal meme videos** (Simpsons clips etc.) for your stat hovers, or are you open to a substitute like:
- Animated illustrations / Lottie files
- Short Akash-created sketches
- SVG sequences / micro-animations
- Actual short videos from your work (terminal sessions, device dashboards, code playing)
- Memes but engineering-themed (Grug wizards, "this is fine", dev-Twitter screenshots)

### Q2. On the Maxima paper-card dropdown:
Do you want to literally copy this specific effect for your nav, or are you open to a different "creative nav" idiom that fits your engineering voice better? (e.g., a terminal window that types out nav items, a file tree that expands, a blueprint that unrolls, a CRT that boots up)

### Q3. On the UT drag-to-reveal:
Where do you see this interaction living in your portfolio?
- (a) Your About section — user drags across a card to reveal your story like scratching a lottery ticket
- (b) A hidden case study — you have to find and reveal one of your projects to unlock it
- (c) An easter-egg moment somewhere in the page that serves no function but is fun
- (d) The hero — the site loads empty and drag reveals your name / title

### Q4. On the "always something moving during scroll":
When you say this, do you mean:
- **Background ambient motion** — particles, floating orbs, grain shimmer, the edge glow animating, floating decorative elements
- **Foreground content motion** — text revealing character-by-character as scroll enters, cards sliding in from the side, images zooming/fading
- **Both** — every scroll position has both background and foreground activity

### Q5. The biggest question — what's your "173 pizza slices"?
You loved the specificity of that Milkshake stat. What's the equivalent for YOU? I'd like 3-5 candidates for absurd-but-specific Akash stats. Things like:
- Cups of filter coffee per year (and from where — name the café)
- Midnight Slack messages to [specific colleague]
- Late-night debugging sessions with a specific song on repeat
- A specific weird thing you did once at work that you're secretly proud of
- Something that happens a lot in your office life that nobody talks about

These will be the reveals. Without specific numbers + specific nouns, the stats stay forgettable.

---

## Status

Holding off on implementation until Akash answers Q1-Q5 and sends the next batch of sites.
