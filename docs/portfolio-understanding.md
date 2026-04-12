# What I understand about what Akash wants

> **Purpose:** A living document of what I've learned about Akash, his taste, and this portfolio project across our sessions. Read this before touching anything. Pair it with `portfolio-rebuild-plan.md` (the implementation plan) and the memory files in `~/.claude/projects/.../memory/`.
>
> **Last updated:** 2026-04-11

---

## 1. Who Akash is (the short version)

- **Akash Varma.** Based in Hyderabad, India.
- **3+ years professional experience.** Currently **Platform Engineer** at **WaveFuel Solutions**. Previously Software Engineer (consultant for WaveFuel) at Varsun eTechnologies, 2022–2024. B.Tech CSE from BV Raju Institute of Technology, 2018–2022.
- **Akash's own honest framing:** *"I am currently a fullstack developer. My goal is to become a platform engineer."* His WaveFuel title is Platform Engineer — that's the ceiling. No "Senior", no "Staff", no "Lead", no "Architect".
- **He is the target audience for himself.** This is not a blog post about engineering. This is the piece of work that gets him his next job.

## 2. What this portfolio is for

- **A hiring tool.** Not an agency showcase. Not a Dribbble entry. Not a personal brand landing page.
- **4th attempt.** Three previous portfolios never shipped. Finishing this one is the win condition.
- **The premise:** a backend engineer built an agency-tier creative site. A visitor arrives expecting a dev portfolio, gets surprised by the execution quality, then realizes a backend engineer with no formal design training authored it. **The surprise is the EXECUTION, not the copy.** The copy should read like a credible senior engineer talking shop, not a comedian.
- **Audience priority (locked):**
  1. Hiring managers at product companies — ~30 seconds to evaluate
  2. Clients hiring IoT / platform / distributed-systems specialists
  3. Himself — statement piece
  4. Future-Akash as a learner

## 3. The substance/craft/personality ratio

**80% technical substance · 15% execution craft · 5% personality texture.**

This is the single most important frame I've gotten wrong before. It replaces an earlier (incorrect) Milkshake-inspired voice-heavy framing.

- **80% substance:** technical depth on projects, honest stack grouping, real experience timeline, real tools he uses. Backend-engineer-talking-shop energy.
- **15% craft:** the site *feels* well-made. Typography, spacing, rhythm, moments of tension. One high-craft moment per section beats ten medium ones.
- **5% personality:** tucked into chrome — scavenger hunt, arcade, meta corner, easter eggs. **Never in the main copy flow.**

Anyone reading the portfolio for the first time should spend 95% of their time on technical content and 5% noticing the craft moments. The personality bits should be unlockable by the visitors who stay longer — discoverable, not shouted.

## 4. Locked content constraints (do not re-litigate)

### 4.1 Forbidden in public copy (still fine on the private resume)
- ❌ `40%` faster integration
- ❌ `₹40L+` project value
- ❌ `~99% uptime`
- ❌ Any "X% reduction" / revenue / efficiency delta
- **Reason:** *"I don't want to show stuff like that because it makes the resume annoying and my current employees might feel bad."*
- ✅ Still allowed: qualitative claims (*shipped to production*, *running in client deployments*), load-test numbers (*10,000+ simulated concurrent devices* is OK — from the Digital Twin project), duration/role/dates, stack names, architecture descriptions.

### 4.2 Forbidden voice
- ❌ "Insanely brilliant or insanely stupid" tagline in the hero
- ❌ Named friends (Nishanth, Manideep) — *"I want their names anonymized. But I prefer not adding about them."*
- ❌ Restaurant names (Seasons XPress, etc.) — *"forced"*
- ❌ Coffee / lifestyle stats (0 cups, etc.) — *"lame"*
- ❌ Reverend Insanity content — defer, he'll provide later if wanted
- ❌ 2026-specific jokes, ChatGPT-era references, or anything tied to this year. Site should still read fresh in 2030.
- ❌ "By the numbers" personality sections — wrong ratio
- ❌ Inflated job titles ("Senior Platform Engineer", "Platform Architect", "DSL Designer")
- ✅ Optional spice lines allowed but **only as explicit opt-in** (like the About tone toggle). Never load-bearing. Easy to remove.

### 4.3 Emotional target
- **Surprise is the target, not confusion.**
  - Puzzle-confusion and recognition-confusion are OK.
  - Lost-confusion (*"wait where am I"*) is never OK.

## 5. Design taste — what he actually likes (the real rules)

### 5.1 Reveals, not decorations
This is the taste line that matters most.

> **Ask: does this uncover something hidden, or does it just make a visible thing wobble?**

- ✅ **Reveals** (uncover hidden content): hover-plays-meme, drag-to-paint, hover-to-flip, click-to-filter, scroll-to-reveal-diagram
- ❌ **Decorations** (make visible things move for the sake of movement): magnetic buttons, parallax-for-parallax's-sake, 3D tilt cards, spring hovers, blur orbs drifting

**The distinction isn't "motion vs no motion". It's "did the motion give the visitor new information or a new feeling, or did it just consume attention?"**

### 5.2 Quiet default state, rewarded discovery
- Clean, minimal first impression.
- Depth appears when you interact.
- Absolute opposite of maximalism.
- Reference points: Artefakt.mov (brutalist restraint), Maxima Therapy (warmth without loudness).
- **NOT** Milkshake Studio — that's an agency showcase where voice is the product. Wrong template.

### 5.3 Subtle ≠ invisible
This is a mistake I've made repeatedly. Subtle means:
- Slightly lower weight than loud
- Less eye-contact than the main content
- Doesn't demand attention

Subtle does **not** mean:
- 6% alpha on anything
- 2-RGB-unit color shifts you can't perceive
- Effects that the viewer has to squint to confirm exist

If a visitor can't tell an effect is happening without being told, it's not subtle — it's broken.

### 5.4 One high-craft moment per section
Not ten medium ones. A single focused thing that's clearly handmade with care beats a scatter of hover effects.

### 5.5 Performance is a taste question
- Scroll lag is a dealbreaker. He noticed immediately.
- No `filter: blur(N)` where N > ~80px — massive GPU hit.
- No always-on 60fps RAF canvas loops — throttle and pause when off-screen.
- No infinite CSS keyframes on fixed elements with GPU composited layers.
- No scroll-linked element updates that touch layout (`width`, `left`, `top`, etc.) — use transforms only.
- No ScrollTrigger `scrub` unless it's genuinely scroll-linked narrative.
- When in doubt, profile before adding.

### 5.6 Things he explicitly rejected in v3 iteration
- **Giant background section numerals.** *"I don't like those background numbers. This is not creative or intuitive at all."* — Do not bring these back. They're a Milkshake reference that doesn't fit him.
- **Whisper-subtle WOW effects.** When he can't tell an effect is there, he reads the whole site as "didn't change much".

## 6. What he does want from the creative layer (still being figured out)

He gave me full latitude — *"You are free to do what you need to do just impress me. I need to feel like proper creative wow."* — but after one attempt he said it wasn't landing. So the creative direction is **still open**.

### 6.1 The four creative-direction options currently on the table
1. **"Every click reveals something unexpected"** — minimal static visuals, but every hover/click on real content has a surprise payload: hidden diagram, changed voice, one-shot animation, sentence rewriting itself.
2. **"The content itself is the show"** — editorial long-form, no motion decoration, unusual typography, oversized titles, pull-quotes, one dramatic color block per section. Artefakt / Maxima direction.
3. **"A single memorable gesture"** — one big weird interactive moment per section (scrubbing a slider rewrites code, dragging the hero name breaks it into letters, the stat counter is interactive), everything else is quiet.
4. **Something else he points at** — a site somewhere that he wants this to feel like.

**Not yet chosen.** I should not guess. The right move is to ask him to pick or describe and then delete everything that doesn't serve the direction.

### 6.2 What's already built that's clearly worth keeping regardless of direction
- **FUS Script playground** (Projects.tsx → `FusScriptDemo`) — press Run, watch a mock message flow through 6 parse steps. Backend-engineer-specific, interactive, reveals the work. High signal. Keep.
- **Drag-to-reveal architecture overlay** on the flagship case study. Uncovers a real pipeline diagram. Reveal-not-decoration by definition. Keep.
- **About tone toggle** (technical ↔ casual). Unexpected gesture, expected task. Keep.
- **Skills click-to-filter reveal** (click a stack group → see which case studies used it, with dim-others highlighting). Honest backend-engineer move. Keep.
- **Journey year-hover micro-timeline** (hover a year badge → 12-bar month strip). Small but real. Keep, though the workload values being fake is a lie — may need a better visualization.
- **Contact char-counter** (live character count, color shift at 50 chars). Keep.
- **Scavenger hunt** and the **arcade** route. Explicit 5% personality layer. Keep.
- **Meta corner** (bottom-right `portfolio.meta` chrome) — tucked-in, small, in character. Keep unless it reads as gimmicky.

### 6.3 What's already built that might not belong and should be re-evaluated per direction
- **Terminal card in About** — still fine, but it's a "show the cool chrome" moment that the new ratio should re-examine. Leaving for now.
- **Big orbiting tech icons in Hero** — currently static positions (was infinite CSS animation → killed for perf). The hover-fact-card tooltip is good. Consider: does it serve the substance or is it decoration we tolerate?
- **GradientMesh radial glows** — currently static `radial-gradient(rgba, transparent)` instead of `blur(160px)`. Harmless, minimal cost. Keep.
- **Marquee tech strip** — fine, but worth asking whether it's a reveal or a decoration.
- **Particle canvas** — throttled to 30fps + paused off-screen. Still a RAF loop. Worth asking whether it adds signal or just burns cycles. Candidate for removal.

## 7. Locked structural decisions

### 7.1 Section order (locked)
```
Hero → Marquee → Selected Work → About → Technical Stack → Experience → Contact → Footer
```
- 01 Hero
- 02 Selected Work
- 03 About
- 04 Technical Stack
- 05 Experience
- 06 Contact

Rationale: the highest-value proof for hiring managers (real work) comes right after the hero. About follows as "who built this", then stack as "what they use", experience as "where they've been", contact to convert.

### 7.2 The 4 case studies (locked)
1. **FUS Script + Device-Agnostic IoT Platform** — WaveFuel, 2024–present. Flagship. Has playground + architecture reveal.
2. **EV Charging Infrastructure (OCPP 1.6J)** — Varsun, 2022–2024. First real production system owned end-to-end.
3. **Digital Twin Simulation Engine** — WaveFuel, 2024. The 10,000-concurrent-device load-test number lives here.
4. **IoT Mobile SDK + Consumer App** — Varsun, 2023–2024. Shipped to both stores. "Mobile sync is where joy goes to die" line lives here.

Each case study is written as 3 headed paragraphs: **The problem · What I built · What was hard** (or *The honest note* for the mobile one).

### 7.3 The "also shipped" strip (locked)
One-line entries, no metrics:
- Autonomous Job Manager (2023) — Node.js, Docker
- Form Builder (2024) — React, Next.js
- Sonar Audio Analysis Tool (2023) — Python, Next.js
- AI Chatbot MCP Tool Server (2025) — TypeScript, MCP

### 7.4 The 9-group technical stack (locked)
Languages · Backend · Databases · Protocols · Infrastructure · Observability · Mobile · Frontend · Patterns.

Observability group must include **Grafana + Prometheus + Elastic APM + Kibana** (he confirmed these are the real tools he uses).

### 7.5 Hero rotation (locked)
`[Platform Engineer / Fullstack Developer / IoT Builder]` — 3 items, all honest, cycling. No more.

### 7.6 Stats row (locked)
`3+ Years Building / 6 Production Systems / 2 App Stores Shipped / 3 Engineers Mentored` — all four pass the constraints.

## 8. Locked contact details (from resume)

```
Email:     g.akashvarma@gmail.com
LinkedIn:  linkedin.com/in/akash-varma-gadiraju
GitHub:    github.com/AkashVarmaGadiraju
Phone:     +91 850-044-9747
Location:  Hyderabad, India
Availability: Open to opportunities
```

Formspree form is wired up — keep it.

## 9. Technical stack constraints (the build itself)

- **Next.js 16.2.2** — `--webpack` flag is required. This is NOT the Next.js from training data. Read deprecation notices. See `AGENTS.md`.
- **React 19, TypeScript, Tailwind CSS v4** — assume all three have breaking changes from what I remember.
- **GSAP + ScrollTrigger** for scroll animations, wired via `AnimationProvider.tsx`.
- **Lenis smooth scroll** piped through GSAP ticker via `SmoothScroll.tsx` — one RAF loop, not two.
- **Fonts self-hosted via `@fontsource`** — no Google Fonts network calls.
- **Font CSS vars:** `--font-outfit` (body), `--font-bricolage` (display), `--font-serif` (Instrument Serif), `--font-mono` (JetBrains Mono), `--font-orbitron` (arcade), `--font-rajdhani` (labels).
- **Single-page site.** Not multi-page. Strong scroll narrative.
- **Scavenger hunt** (`HuntProvider`, `src/data/clues.ts`, 15 clues across 4 tiers) is load-bearing — do not break it.
- **Arcade route** `/arcade` with Snake, Breakout, Pong, Invaders — do not touch.
- **`/secret` void route** — do not touch.

## 10. Things I got wrong (mistakes I should not repeat)

1. **I built WOW moves whisper-subtle.** 6% alpha stroke on giant numerals, 2-RGB-unit background color shifts. Akash reads those as "nothing changed". If it's meant to be visible, it must be clearly visible — subtle does not mean invisible.
2. **I cargo-culted Milkshake's giant background numerals.** Wrong template. They're a reference-site cliché that doesn't fit a backend-engineer hiring portfolio. He rejected them explicitly.
3. **I promised WOW moves in the plan and only half-built them.** Hero icon tooltips, Skills click-to-filter, Journey year hover, Contact typing feedback — I listed them in the plan but skipped most in the first execution pass. If I promise a reveal, I must build it the first time, not the second.
4. **I introduced performance-hostile CSS.** `filter: blur(160px)` on two orbs, combined with infinite CSS animations and scroll-linked parallax, tanked scroll perf immediately. Akash noticed on the first reload. **Scroll perf must be auditable before I ship UI.**
5. **I stopped asking what he wants and started guessing.** When I gave him full latitude, I picked a Milkshake-style direction on my own and shipped it without checking. When it landed wrong, I had to rip half of it out. Better path: propose 2–4 concrete directions and let him pick.
6. **I misread "I only use DOM verification" as equivalent to "it works".** DOM rendering is necessary but not sufficient — it doesn't tell me whether the result *feels* like anything. Akash's eyeballs are the only test that matters for taste questions.
7. **I chased the Chrome MCP screenshot capture bug for too long.** It returns black for the flagship case study region. I should accept the tool limitation faster and ask Akash to eyeball the browser himself.

## 11. Current state of the codebase (as of this doc)

### Files I rewrote / created recently
- `src/components/Hero.tsx` — rotation trimmed to 3, tech icons static + hover-to-reveal fact cards
- `src/components/Projects.tsx` — 4 case studies with 3 paragraphs each, `FusScriptDemo` embedded, `DragToRevealArchitecture` on flagship, `alsoShipped` strip, no forbidden metrics
- `src/components/FusScriptDemo.tsx` (new) — frontend playground for a fake FUS Script definition
- `src/components/About.tsx` — new copy, tone toggle (technical ↔ casual), terminal card simplified
- `src/components/Skills.tsx` — 9 groups, click-to-filter reveal panel, removed fake `%` self-ratings
- `src/components/Journey.tsx` — 3-entry timeline (BVRIT / Varsun / WaveFuel), year badge hover filmstrip, removed ₹40L+
- `src/components/Contact.tsx` — section renumbered to 06, live char counter
- `src/app/page.tsx` — section order reordered to the locked structure
- `src/components/MetaCorner.tsx` (new) — bottom-right chrome badge
- `src/components/GradientMesh.tsx` — killed 160px blur, static radial gradients only
- `src/components/ParticleCanvas.tsx` — throttled to 30fps, pauses when off-screen
- `src/components/AnimationProvider.tsx` — killed `.gsap-orb` parallax scrub, scroll progress bar now uses transform

### Files I deleted
- `src/components/CustomCursor.tsx` (Phase 1)
- `src/components/SectionNumerals.tsx` (removed by explicit request)
- `src/components/BackgroundTransitions.tsx` (removed — was causing repaints + subtle enough to be invisible)

### Files still to re-evaluate based on creative direction
- `src/components/Marquee.tsx` — keep or drop?
- `src/components/ParticleCanvas.tsx` — throttled but still a RAF loop; worth asking if it earns its keep
- `src/components/MetaCorner.tsx` — reads as gimmicky?
- Hero orbit icon ring — does the decoration serve substance, or is it a decoration we're tolerating?
- Terminal card in About — still worth it in the new ratio?

## 12. Open questions I need Akash to answer before the next creative pass

These must be answered before I touch the creative layer again:

1. **Creative direction** — which of §6.1's four options (or something else he has in mind)?
2. **What reference site, if any, is closest to the target feel?** Not Milkshake. Maybe Artefakt? Maxima? Something new?
3. **Are the 4 WOW moves that survived §6.2 actually ones he wants?** Playground, drag-to-reveal, tone toggle, Skills filter — or should any be cut?
4. **Do the section numerals / decorative background come back in any form?** His "not creative or intuitive" rejection was specifically about giant background digits — but he may accept a *different* kind of section anchoring.
5. **ParticleCanvas — earn its keep or cut it?** It's throttled but still a global RAF loop.
6. **Marquee between Hero and Work — keep as breather, or cut?**

## 13. How to resume this work after a session compaction

Read in this order:
1. `docs/portfolio-understanding.md` — this file
2. `docs/portfolio-rebuild-plan.md` — the implementation plan with draft copy
3. `memory/user_portfolio_positioning.md` — positioning, audience, constraints
4. `memory/feedback_design_reveals_not_effects.md` — reveals not decorations
5. `memory/feedback_voice_is_spice_not_structure.md` — 80/15/5 ratio
6. `Me.txt` and `Akash Varma Resume-7.pdf` — Akash's own words and resume

Then check in with Akash on the open questions in §12 before writing code.

Ground rules for any future session:
- Do not bring back giant background numerals without his explicit ask.
- Do not add `filter: blur(N)` where N > 80. Profile first.
- Do not add infinite CSS keyframe animations on fixed elements.
- Do not use 6% alpha anywhere. Subtle ≠ invisible.
- Do not promise WOW moves in a plan and then ship without them.
- Ask, don't guess, about creative direction.
