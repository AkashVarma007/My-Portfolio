# Portfolio Rebuild Plan — v3 branch

**Status:** Plan drafted, awaiting approval before execution.
**Owner:** Akash Varma
**Author:** Claude (session with deep context on Akash's taste + reference sites)
**Branch:** `v3`
**Last updated:** 2026-04-08

> **For future sessions:** This document is designed to be read standalone after a context compaction. It contains (1) everything you need to know about Akash and the portfolio's goals, (2) the locked decisions and constraints, (3) draft copy for every section, (4) a file-by-file execution plan for the existing codebase, and (5) phased execution with checkpoints. Read sections 1–5 end-to-end before touching code. Cross-reference memory files in `~/.claude/projects/-home-nishanth-Desktop-Personal-Akash-portfolio-My-Portfolio/memory/` and deep-dive docs in `docs/reference-sites/`.

---

## 1. Context for fresh sessions

### 1.1 Who is this for?
**Akash Varma** — 3+ years professional experience, currently Platform Engineer at **WaveFuel Solutions** in Hyderabad, India. Previously Software Engineer at **Varsun eTechnologies** (consultant for WaveFuel) 2022–2024. B.Tech CSE from BV Raju Institute of Technology (2018–2022).

Akash's own honest framing: **"I am currently a fullstack developer. My goal is to become a platform engineer."** Do NOT inflate his title — he explicitly rejected "Senior Platform Engineer". His WaveFuel job title is "Platform Engineer" (matches his resume header), and that's the ceiling we use on the portfolio.

### 1.2 What is this portfolio?
- Akash's **4th portfolio attempt**. The first three never shipped. This is the one he wants to finish.
- **Central premise:** A backend / platform engineer built an agency-tier creative site. Visitors arrive expecting a dev portfolio, get surprised by the execution quality, then realize a backend engineer with no formal design training authored it. **The surprise is the EXECUTION, not the copy.**
- The portfolio is a **hiring tool**, not an agency showcase. Technical substance carries ~80% of the weight. Execution craft ~15%. Personality texture ~5%. Not the Milkshake-style voice-heavy approach — see `memory/feedback_voice_is_spice_not_structure.md` for the full correction story.

### 1.3 Audience priority (locked)
1. **Hiring managers at product companies** — they need to evaluate him in ~30 seconds
2. **Clients who need an IoT / platform / distributed-systems specialist** — must understand he's a backend dev, not a frontend person
3. **Himself** — this is his statement piece
4. **Future-Akash as a learner** — he's building this partly to learn web craft

### 1.4 Current branch state
```
Branch:     v3
Latest:     89552c4  Refactor code structure for improved readability
            3b97828  Refactor Contact → Formspree, Footer arcade entry, etc.
            3329b7e  Remove box shadow from tech icon styles in Hero
            e5b64b7  Initial commit
```

This is NOT the same branch I worked on in earlier sessions (where magnetic buttons, spotlight glow, parallax names were added). The v3 branch is an earlier/cleaner state. References to "earlier work" in older memory files may not apply here.

---

## 2. Locked decisions (do not re-litigate)

### 2.1 Positioning
- **Title on site:** Platform Engineer (matches his WaveFuel resume title)
- **Tone under the title:** Fullstack developer building platform infrastructure
- **Seniority claim:** None. No "Senior", no "Staff", no "Lead". The work speaks for itself.
- **Career direction:** Platform Engineer (where he's headed, evidenced by his IoT / DSL / distributed systems work)

### 2.2 Hard content constraints (protect Akash's employer relationship)
- **NO revenue numbers.** ❌ `₹40L+ in project value` — out.
- **NO uptime percentages.** ❌ `~99% uptime` — out.
- **NO efficiency deltas.** ❌ `~40% reduction in hardware integration time` — out.
- **Rationale:** Akash said *"I don't want to show stuff like that because it makes the resume annoying and my current employees might feel bad."*
- **What IS allowed:** qualitative claims (*"shipped to production"*, *"running in client deployments"*), load-test numbers (*"10,000+ simulated concurrent devices"* — this is from his 2024 Digital Twin Simulation Engine project on his public resume, which he's happy with), duration / role / dates, stack names, architecture descriptions.

### 2.3 Voice constraints
- **Personality ratio:** ~5% of the content, not ~50%. Subtle easter eggs, not a "by the numbers" comedy section.
- **No "insanely brilliant or insanely stupid" tagline** in the hero. Can live as a tucked-in easter egg somewhere small (e.g. hidden via scavenger hunt or in an unlit corner of the site). Not front-and-center.
- **No named friends** in copy. Akash said *"I want their names to be anonymized. But I prefer not adding about them."* — so just don't mention Nishanth or Manideep at all. Reference to "mentoring 2 junior engineers and 1 intern" is fine.
- **No restaurant names** (Seasons XPress etc.) — he called these "forced".
- **No Reverend Insanity** content yet — he said he'd provide quotes later if we want them.
- **No coffee / lifestyle stats** — he called these "lame".
- **Timeless, not timestamped:** no 2026-specific jokes, no ChatGPT-era references, no pop-culture references tied to this year. The site should still read as fresh in 2030.
- **"Surprise" is the emotional target** — not "confusion". Puzzle-confusion and recognition-confusion are OK; lost-confusion is not.

### 2.4 Design direction
- The **execution quality** is the surprise. Visitors should think "agency built this" for ~5 seconds before noticing a backend engineer authored it.
- **Reveals, not decorations.** When adding interactivity, ask: *does this uncover something hidden, or does it just make a visible thing wobble?* Prefer reveals (hover-plays-media, drag-to-paint, scroll-linked background numbers). Avoid decorations (magnetic buttons, parallax-for-its-own-sake, tilt cards, spring hovers). See `memory/feedback_design_reveals_not_effects.md`.
- **Clean and quiet default state** — minimalism that rewards curiosity, not maximalism.
- One **high-craft moment per section** beats ten medium ones.

---

## 3. Reference material index

All of these are already written and live in the repo / memory. Read as needed.

### 3.1 Reference site analyses (`docs/reference-sites/`)
| File | What's in it |
|---|---|
| `00-ranking-and-review.md` | 12-parameter grading matrix of all 6 reference sites, with honest verdict: Akash's real diagnosis is voice + reveals, not more motion. **Note:** the "Milkshake as gold standard" conclusion in this doc was partially corrected later — see `akash-taste-notes.md` and `memory/feedback_voice_is_spice_not_structure.md`. |
| `01-utopia-tokyo.md` | Maximalist worldbuilding, data-state machines, frame chrome. |
| `02-sohub-digital.md` | Aggressive restraint, 6-color palette, 1 mascot. |
| `03-artefakt-mov.md` | Brutalist WebGL, `mix-blend-mode: difference` header, B/W only. Closest reference to what the portfolio should *feel* like (substance + restraint). |
| `04-champions4good.md` | Editorial maximalism, 422px Druk Condensed, broken-hyphen typography. |
| `05-maxima-therapy.md` | Premium friendly, per-route theming, Sanity CMS, warmth through illustration. **Second-closest reference** — Maxima is substance-heavy with warmth-as-texture, which is the target feel. |
| `06-milkshake-2020.md` | The site Akash originally cited as his favorite. **Warning:** this is an agency showcase, not a hiring portfolio. Use for execution inspiration (hover-plays-meme, always-moving scroll, drag-to-play hero) — NOT for the structure-of-content model. |
| `akash-taste-notes.md` | Detailed notes on what Akash specifically loves after walking through screenshots. Key pattern: **reveals, not effects.** |

### 3.2 Memory files (persistent across sessions)
| File | What's in it |
|---|---|
| `MEMORY.md` | Index of all memory entries. |
| `user_portfolio_positioning.md` | Positioning, audience, constraints, observability stack — **the most important memory file for this project.** |
| `user_voice_anchors.md` | Raw material Akash has approved (tagline candidate, named-friend references, Reverend Insanity, FUS Script description, hot takes). Use as spice, NOT as structure. |
| `feedback_design_reveals_not_effects.md` | Akash prefers interaction reveals over decorative effects. |
| `feedback_voice_is_spice_not_structure.md` | Correction to earlier voice-heavy advice. The 80/15/5 ratio. |
| `feedback_voice_over_motion.md` | Earlier advice — voice matters more than more motion effects. Still true but tempered by the "voice is spice not structure" correction. |
| `reference_site_rankings.md` | Index pointer to the reference-sites docs. |
| `project_portfolio_stack.md` | Tech stack and architectural invariants. |

### 3.3 Primary sources (Akash's own words)
| File | What's in it |
|---|---|
| `Me.txt` | Akash's unfiltered career story in his own words. 3 years of work, projects, client stories, salary history, mentorship. |
| `Akash Varma Resume-7.pdf` | The polished resume. Has the business metrics (₹40L, 99% uptime, 40% reduction) that are OK on the resume but OUT on the public portfolio. |
| `websites.txt` | The 6 reference sites. |

---

## 4. Current codebase snapshot (v3 branch)

### 4.1 Stack
- **Framework:** Next.js 16.2.2 (**requires `--webpack` flag** — see `AGENTS.md`)
- **React:** 19
- **TypeScript, Tailwind CSS v4**
- **Animation:** GSAP + ScrollTrigger, registered globally via `AnimationProvider.tsx`
- **Smooth scroll:** Lenis, piped through GSAP ticker (`SmoothScroll.tsx`)
- **Fonts:** self-hosted via `@fontsource` packages (no Google Fonts network)
  - `--font-outfit` (body default)
  - `--font-bricolage` (display/headings)
  - `--font-serif` (Instrument Serif)
  - `--font-mono` (JetBrains Mono)
  - `--font-orbitron` (arcade/tech display)
  - `--font-rajdhani` (labels/badges)

### 4.2 Page composition (`src/app/page.tsx`)
```tsx
<HuntProvider>
  <SmoothScroll />
  <CustomCursor />
  <Preloader onComplete={handlePreloaderComplete} />

  <div style={{ opacity: preloaderDone ? 1 : 0, ... }}>
    <div className="scroll-progress" />
    <ParticleCanvas />
    <GradientMesh />
    <AnimationProvider />
    <Navigation />

    <Hero />
    <Marquee />
    <About />
    <div className="divider-glow mx-6 md:mx-12" />
    <Projects />
    <div className="divider-glow mx-6 md:mx-12" />
    <Journey />
    <div className="divider-glow mx-6 md:mx-12" />
    <Skills />
    <div className="divider-glow mx-6 md:mx-12" />
    <Contact />
    <Footer />

    <ArcadeCurtain />  {/* scroll past footer → /arcade */}
    <AchievementWidget />
    <ClueToast />
    <HiddenTerminal />
  </div>
</HuntProvider>
```

### 4.3 Component inventory (`src/components/`)
| File | Lines | Role | Status in plan |
|---|---|---|---|
| `Hero.tsx` | 328 | Name, role rotation, hero copy, stats row, orbiting tech icons | **Edit — copy rewrite + stats update** |
| `Marquee.tsx` | ~150 | Horizontal scrolling tech marquee | **Keep** |
| `About.tsx` | 241 | Terminal card, about copy | **Edit — copy rewrite** |
| `Projects.tsx` | 480 | 6-project grid + featured project | **Major edit — trim to 4 case studies, remove forbidden metrics, add technical depth** |
| `Journey.tsx` | 643 | Experience timeline with year badges | **Edit — simplify content to resume timeline, keep the look** |
| `Skills.tsx` | 449 | Skills categorized as pills | **Edit — regroup to match the plan's tech stack, add observability tools** |
| `Contact.tsx` | 406 | Formspree form + map + info cards | **Simplify — may trim form if we go link-only** |
| `Footer.tsx` | 15 | Minimal footer with arcade entry | **Keep** |
| `Navigation.tsx` | 125 | Nav + active section tracking + mobile menu | **Keep** |
| `Preloader.tsx` | — | Initial loading screen | **Keep** |
| `CustomCursor.tsx` | 276 | Custom cursor component | **Keep (but see §8.1 — possibly remove per earlier taste feedback)** |
| `AnimationProvider.tsx` | — | Renderless GSAP registration | **Keep** |
| `ParticleCanvas.tsx` | — | Background particles | **Keep** |
| `GradientMesh.tsx` | — | Background gradient mesh | **Keep** |
| `SmoothScroll.tsx` | — | Lenis integration | **Keep** |
| `TiltCard.tsx` | — | 3D tilt card effect | **Keep if used in Projects, otherwise remove** |
| `RevealText.tsx` | — | FadeUp / RevealText reveal helpers | **Keep** |
| `ArcadeCurtain.tsx` | — | Curtain transition to /arcade | **Keep** |
| `hunt/` | — | Scavenger hunt widgets (AchievementWidget, ClueToast, HiddenTerminal) | **Keep — this IS the 5% personality** |
| `arcade/` | — | Arcade game wrapper | **Keep — unchanged** |
| `games/` | — | Snake, Breakout, Pong, Invaders | **Keep — unchanged** |
| `void/` | — | `/secret` route content | **Keep — unchanged** |

### 4.4 Current content problems (to fix in this plan)

**In `Hero.tsx`:**
- Role rotation is `["Systems Engineer", "Platform Architect", "DSL Designer", "IoT Specialist"]` — "Platform Architect" is inflated (he's not an "Architect" yet). Needs trim.
- Hero headline: `"Building the infrastructure that powers the future."` — generic marketing speak. Needs rewrite.
- Description: mentions "10,000+ concurrent devices" inline — **this is OK**, it's from his Digital Twin load test and is already on his public resume.
- Stats row: `3 Years Building / 6 Production Systems / 2 App Stores Shipped / 3 Engineers Mentored` — **all four are fine** under the new constraints. No percentages, no revenue.
- CTAs: `View My Work` (scrolls to `#work`) / `Get In Touch` / `Resume` (downloads `/resume.pdf`) — good, keep.

**In `Projects.tsx`:**
- 🚨 **Project 1 has forbidden metrics:** `{ value: "40%", label: "Faster Integration" }` and `{ value: "₹40L+", label: "Project Value" }` — must be removed.
- 🚨 **Project 2 description contains `"~99% uptime"`** — must be removed.
- Only 6 projects listed, but the plan calls for 4 featured + a small "also shipped" strip of smaller work. Two projects (Autonomous Job Manager, Sonar Analysis Platform) should demote to the "also shipped" strip, not full cards.
- Descriptions are 1-2 sentences each — need expansion to 2-3 paragraphs of technical depth for the 4 featured ones.

**In `About.tsx`:**
- Need to read full content to verify, but the rewrite will align it to:
  > "I'm a fullstack developer in Hyderabad, 3+ years into building production IoT infrastructure..."

**In `Skills.tsx`:**
- Grafana may be listed but Prometheus, Elastic APM, Kibana need to be added.
- Grouping may need to change to match the tech stack matrix in §6.4 of this plan.

**In `Journey.tsx`:**
- Need to verify content matches the resume's WaveFuel + Varsun timeline. Remove any inflated claims.

**In `Contact.tsx`:**
- Has a Formspree form. Plan proposes simplifying to 3 links + availability line, but keeping the form is also fine. Decision: **keep the form** for now (it's already wired up), just audit copy.

---

## 5. The approved portfolio structure (six sections)

```
1. Hero                 Name + positioning + one-line thesis + CTAs
2. Selected Work        4 case studies with technical depth + small "also shipped" strip
3. About                Who, what, why — 3-4 sentences max
4. Technical Stack      Grouped by category, scannable
5. Experience           WaveFuel + Varsun timeline, mentorship note
6. Contact              Email (primary) + GitHub + LinkedIn + availability
```

**Section order on the page:**
```
Hero → Marquee → Selected Work → About → Technical Stack → Experience → Contact → Footer
```

Note: the **Marquee** stays between Hero and Selected Work as a visual breather + tech-icon reinforcement. The plan does NOT move Selected Work before About on the page (current order is About before Projects) — instead, we re-order so Selected Work immediately follows Hero/Marquee because that's the highest-value proof for hiring managers. About moves to position 4 on the page (after Selected Work, before Technical Stack).

**Mapping to current components:**
| Plan section | Current component(s) |
|---|---|
| 1. Hero | `Hero.tsx` |
| (marquee breather) | `Marquee.tsx` |
| 2. Selected Work | `Projects.tsx` (needs rename conceptually — still called Projects in code) |
| 3. About | `About.tsx` |
| 4. Technical Stack | `Skills.tsx` (needs rename conceptually — still called Skills in code) |
| 5. Experience | `Journey.tsx` (needs rename conceptually — still called Journey in code) |
| 6. Contact | `Contact.tsx` |
| footer | `Footer.tsx` |

---

## 6. Section-by-section build spec (with draft copy)

Each subsection has: **target state**, **draft copy** (to be approved), **files affected**, **what changes**, **what stays**.

### 6.1 Hero (`Hero.tsx`)

#### Target state
- Name: AKASH VARMA
- Role line: **Platform Engineer** (single, no rotation — or 2-word rotation max, see below)
- Main headline: clearer, less marketing-speak
- Sub-description: 1-2 sentences, technical, direct
- Stats row: current 4 stats (unchanged)
- CTAs: View My Work / Get In Touch / Resume (unchanged)
- Orbiting tech icons: keep (also a hunt puzzle hook)
- Typing role rotation: drop to **"Platform Engineer"** as a single static title OR rotate through: `["Platform Engineer", "Fullstack Developer", "IoT Builder"]` — max 3 options, all honest.

#### Draft copy (v1 — for approval)

```
(small eyebrow label)          AKASH VARMA

(role, typing)                 PLATFORM ENGINEER
                                (optionally rotating:
                                 Platform Engineer / Fullstack Developer / IoT Builder)

(headline, large display)
                               I build
                               IoT platforms
                               and the DSLs
                               that run them.

(description, max 2 sentences)
                               3+ years shipping production IoT infrastructure — device-agnostic
                               onboarding, distributed messaging, runtime DSL parsers.
                               Based in Hyderabad. Open to opportunities.

(CTAs)                         [ See the work ]  [ Get in touch ]  [ Resume ↓ ]

(stats row — keep as-is)
                               3+          6             2                3
                               Years       Production    App Stores       Engineers
                               Building    Systems       Shipped          Mentored
```

#### Draft copy alternatives

**Alt headline A (shorter, more confident):**
> Device-agnostic IoT infrastructure.
> Written in TypeScript. Stress-tested by real clients.

**Alt headline B (leans into the DSL angle):**
> I build platforms that onboard any device,
> over any protocol, without a redeploy.

**Alt headline C (closest to current, polished):**
> I build the infrastructure that
> onboards 10,000+ devices.

Akash to pick one — or combine.

#### Files affected
- `src/components/Hero.tsx` — edit role array, headline markup, description paragraph

#### Changes
- Change `ROLES` array: trim to `["Platform Engineer", "Fullstack Developer", "IoT Builder"]` (or pick a single static title — both are fine)
- Replace the `<h1>` content from "Building the infrastructure that powers the future." to the chosen headline
- Tighten the description paragraph
- **Keep:** orbiting tech icons, `<CLUE3_SEQUENCE>` scavenger hunt hook, stats row, typing effect helper, CTAs, resume download link

#### What stays
- Stats row (all 4 stats are fine under the constraints)
- Orbiting tech icons with scavenger hunt click sequence
- Role typer mechanic (just different word list)
- All the scroll + animation wiring

---

### 6.2 Selected Work (`Projects.tsx`)

#### Target state
- **4 featured case studies** (currently 6 projects, 2 get demoted to the "also shipped" strip)
- Each featured case study has: title, tag line, 2–3 paragraphs of technical depth, stack tags, year range, optional visual
- **NO forbidden metrics** (no `40%`, no `₹40L+`, no `99% uptime`)
- **"Also shipped" strip** at the bottom: 3–5 single-line entries for the smaller work

#### The 4 featured case studies — draft content

##### Case Study 1: FUS Script + Device-Agnostic IoT Platform

**Tag line:** `Onboard any device. Any protocol. Without a redeploy.`

**Role / Year:** Platform Engineer · WaveFuel Solutions · 2024–present

**Stack:** `TypeScript` · `Node.js` · `PostgreSQL` · `Redis` · `MQTT` · `WebSockets` · `Docker` · `Kubernetes`

**Paragraph 1 — The problem:**
Every new client came with a different device, a different protocol, and a different data contract. Onboarding each one meant days of custom code and a redeploy. The platform didn't scale with the pipeline.

**Paragraph 2 — What I built:**
I designed **FUS Script** — a custom domain-specific language + runtime parser that lets clients (or us) define device protocols and data transformations at runtime. Adding a new device type means writing a FUS Script definition, not shipping code. The parser handles everything from field-level data mapping to runtime operations (example: RSA encryption on a specific outbound field). Around FUS Script, I built the ingest and messaging layer — a Redis-backed routing system that handles cross-instance WebSocket delivery in a clustered load-balanced environment, so a message sent by the user reaches the right device regardless of which backend instance it's connected to.

**Paragraph 3 — What was hard:**
Two things. First: making the DSL **flexible yet rigid** — flexible enough to cover arbitrary device protocols, rigid enough that the parser can reject bad definitions at parse time instead of runtime. Second: the cross-instance routing. A load-balanced cluster means a device and its user can be talking to different server instances, and messages have to find the device without broadcasting. Redis holds the device-to-instance map; the messaging layer reads it before dispatch.

**Scale note (allowed):** stress-tested with 10,000+ concurrent simulated devices from the Digital Twin project (§Case Study 3).

---

##### Case Study 2: EV Charging Infrastructure (OCPP 1.6J)

**Tag line:** `Production EV charging, end-to-end.`

**Role / Year:** Software Engineer (consultant for WaveFuel) · Varsun eTechnologies · 2022–2024

**Stack:** `TypeScript` · `Node.js` · `React` · `OCPP 1.6J` · `WebSockets`

**Paragraph 1 — The problem:**
Deliver a full EV charging platform from scratch on the OCPP 1.6J protocol — onboarding, monitoring, control, per-site dashboards. First real production system I owned end-to-end.

**Paragraph 2 — What I built:**
A multi-site EV charger management platform where clients can onboard OCPP-compatible chargers, assign them to sites (Site A, Site B, ...), monitor live telemetry, trigger remote commands, and see analytics dashboards for utilization and power consumption. Full-stack: backend message handling against OCPP, frontend dashboard and site admin, and the telemetry pipeline feeding the analytics layer.

**Paragraph 3 — What was hard:**
OCPP 1.6J is a chatty, strict protocol. Sub-second telemetry requires careful WebSocket handling and efficient session state so the platform can hold thousands of charger sessions without drifting. I spent real time on the session layer — specifically on how to cleanly recover a charger's state after a dropped connection without replaying the whole session.

---

##### Case Study 3: Digital Twin Simulation Engine

**Tag line:** `A reusable simulator for any industry's IoT devices.`

**Role / Year:** Platform Engineer · WaveFuel Solutions · 2024

**Stack:** `TypeScript` · `Node.js` · `Event-Driven Architecture` · `MQTT`

**Paragraph 1 — The problem:**
Running load tests, client demonstrations, and early-stage architecture reviews all required physical IoT devices. Physical devices are slow to procure, expensive, and don't scale past tens. We needed a way to simulate thousands of realistic devices without hardware.

**Paragraph 2 — What I built:**
A plug-and-play simulation engine. The first implementation modeled the **dairy industry** — I researched end-to-end data flows, the sensors and actuators involved, the alerting patterns. That research became a reusable simulation base: the same engine that simulates a dairy plant can simulate a different industry by swapping in new device definitions. It feeds our real IoT platform, so the devices it simulates look and behave like real ones from the server's perspective.

**Paragraph 3 — What was hard:**
Making the engine generic without making it toothless. I wanted "define a new industry in a config, get a working simulator" — not "build a new engine per industry." The hard part was designing the device abstraction so that the dairy-specific work didn't leak into the base. Result: **stress-tested with 10,000+ concurrent simulated devices** across multiple industries, with no physical hardware.

---

##### Case Study 4: IoT Mobile SDK + Consumer App (React Native)

**Tag line:** `Shipped to both stores. Mobile sync is where joy goes to die.`

**Role / Year:** Software Engineer · Varsun eTechnologies · 2023–2024

**Stack:** `React Native` · `TypeScript`

**Paragraph 1 — The problem:**
A client needed a consumer-facing mobile app where end-users could onboard the client's IoT devices, share access with family members, create automation scenes and routines, and see usage analytics. Had to ship cross-platform.

**Paragraph 2 — What I built:**
A React Native app and the cross-platform SDK underneath it. The SDK abstracts the device onboarding flow — BLE pairing, Wi-Fi provisioning, handshake with the server, ownership assignment — so the app code doesn't have to know about any of it. The app wraps the SDK with user-facing flows: adding a device, inviting a household member, building a scene, viewing analytics. Shipped to both Google Play and the iOS App Store.

**Paragraph 3 — The honest note:**
This is also the project that taught me how much pain there is in cross-platform mobile state sync. Between BLE reconnect storms, OS-level background restrictions, and the two platforms disagreeing on how to handle provisioning, most of the work was making the SDK feel reliable even when the underlying conditions aren't. *(If Akash wants the mobile-sync-is-where-joy-goes-to-die line, it goes here — as a tucked-in tooltip or italic aside, not a headline.)*

---

#### "Also shipped" strip — 4 one-liners

These are the demoted projects. Each is a single line, no metrics, no paragraph — just "yes, I also did this."

```
• Autonomous Job Manager (2023) — AI-driven async task orchestration in isolated Docker
  containers with automated error recovery. Stack: Node.js, Docker.
• Form Builder (2024) — Drag-and-drop grid form builder used by a client to generate
  iframe-embeddable forms for their website. Stack: React, Next.js.
• Sonar Audio Analysis Tool (2023) — Audio signal processing pipeline that generates
  heatmaps from sonar recordings for object identification. Stack: Python, Next.js.
• AI Chatbot MCP Tool Server (2025) — Designed and documented the MCP tool surface
  so an AI chatbot could perform every operation supported by the IoT platform.
  Stack: TypeScript, MCP.
```

#### Files affected
- `src/components/Projects.tsx` — rewrite the `projects` array, add case study layout variant, add "also shipped" strip

#### Changes

**In the `projects` array (top of file):**
1. Rewrite Project 1 (IoT Platform): **remove `metrics` array** (`40%`, `₹40L+` entries), rewrite `desc` to match Case Study 1's paragraphs.
2. Rewrite Project 2 (EV Charging): **remove `~99% uptime` from desc**, rewrite to match Case Study 2's paragraphs.
3. Rewrite Project 3 (IoT Mobile App → rename to match Case Study 4), expand `desc`.
4. Rewrite Project 4 (Digital Twin Engine), expand `desc`.
5. **Remove Projects 5 and 6 from the main array.** Move them to a new `alsoShipped` array alongside two new entries (Form Builder, AI Chatbot MCP Tools).
6. Add the 4 new "also shipped" entries.

**Layout changes:**
- The featured project card UI (TiltCard variant?) needs to accommodate 2–3 paragraphs per project. Current cards may be too short. May need a "read more" expansion or a modal / detail view, OR just taller cards with scrollable content within the viewport.
- Add the `alsoShipped` strip below the featured cards — minimal styling, one line each.

#### What stays
- Section heading / number ("02 — Selected Work" or similar)
- Color worlds per project (current v3 has accent colors per project — keep them)
- Scroll animations

---

### 6.3 About (`About.tsx`)

#### Target state
- 3–4 sentences maximum.
- Technical, not poetic.
- Establishes: fullstack honesty, 3+ years, IoT / platform direction, location.
- Optional: ONE sentence of personality at the end, easy to remove.

#### Draft copy (v1)

```
I'm a fullstack developer in Hyderabad, 3+ years deep into building production IoT
infrastructure. Lately the work has been platform-shaped — device-agnostic
architectures, a custom DSL, Redis-routed distributed messaging. I mentor two
junior engineers and an intern at WaveFuel Solutions.

Outside work, I read too many Chinese web novels and change what I'm eating every
weeknight.   (← optional spice line; remove if it feels forced)
```

#### Alternative (more technical, drops all personality)

```
I'm a fullstack developer, 3+ years into production IoT infrastructure at WaveFuel
Solutions in Hyderabad. Recent work has been platform-shaped — device-agnostic
onboarding, a runtime DSL parser, Redis-backed distributed messaging across
clustered instances. I mentor two junior engineers and an intern on the side.
```

Akash to pick.

#### Files affected
- `src/components/About.tsx` — replace current About copy with the chosen draft

#### Changes
- Replace the body text of the terminal-card or about section with the new copy
- If the terminal card has hardcoded content, rewrite. If it pulls from a data structure, edit the data.
- Keep the visual (terminal card, background treatment, scroll animation)

#### What stays
- The terminal-card UI (it's a nice craft moment)
- The 2-column section layout
- Any existing animations

---

### 6.4 Technical Stack (`Skills.tsx`)

#### Target state
- Grouped, scannable, one subsection per category.
- Full honesty (includes the observability stack Akash confirmed: Grafana + Prometheus + Elastic APM + Kibana).
- Directly answers "what can they hire me for?" in 10 seconds.

#### Draft content

```
Languages       TypeScript · JavaScript · Python · SQL
Backend         Node.js · Express.js · Next.js
Databases       PostgreSQL · Redis · Prisma ORM
Protocols       MQTT · WebSockets · HTTP · OCPP 1.6J
Infrastructure  Docker · Kubernetes · Linux · GitHub Actions
Observability   Grafana · Prometheus · Elastic APM · Kibana
Mobile          React Native
Frontend        React · Next.js
Patterns        Event-driven architecture · DSL design · Distributed systems
```

#### Files affected
- `src/components/Skills.tsx` — rewrite the skills data structure

#### Changes
- Replace the existing skill groups with the 9 groups above
- Ensure Prometheus, Elastic APM, and Kibana are added (they were not in the earlier icon list)
- Remove anything that's not on this list (if the current file has padding skills like "HTML/CSS" or similar, drop them — this list is the authoritative version)

#### What stays
- The visual design (pill grid, category headers, animations, color worlds)
- The `gsap-skill-card` animation class hooks

---

### 6.5 Experience (`Journey.tsx`)

#### Target state
- Clean timeline with 2 professional entries + education.
- Brief descriptions, no bullet lists, no superlatives.
- Dates as proof.

#### Draft content

```
2024–present    Platform Engineer
                WaveFuel Solutions · Hyderabad
                Architected the device-agnostic IoT platform and FUS Script DSL.
                Mentor two junior engineers and an intern.

2022–2024       Software Engineer (Consultant for WaveFuel)
                Varsun eTechnologies · Hyderabad
                End-to-end EV charging infrastructure on OCPP 1.6J.
                Cross-platform mobile SDK for IoT device onboarding.
                Shipped to Google Play and the iOS App Store.

2018–2022       B.Tech, Computer Science & Engineering
                BV Raju Institute of Technology · Hyderabad
```

#### Files affected
- `src/components/Journey.tsx` — rewrite the timeline data

#### Changes
- Replace the current timeline content with the 3 entries above (if it has more entries or different content)
- Remove any inflated claims or bullet lists
- Remove the uptime / revenue / efficiency percentages if present

#### What stays
- The amber-on-charcoal visual design
- Year badges with hover effects
- The GSAP scroll-driven alternation animations

---

### 6.6 Contact (`Contact.tsx`)

#### Target state
- Email as primary contact, prominent
- GitHub + LinkedIn as secondary links
- Availability line: "Open to opportunities"
- Optional: keep the Formspree form (it's already wired up)
- Optional: keep the map of Hyderabad (nice craft touch)

#### Draft content

```
Let's talk.

Primary             g.akashvarma@gmail.com
LinkedIn            linkedin.com/in/akash-varma-gadiraju
GitHub              github.com/AkashVarmaGadiraju

Location            Hyderabad, India
Availability        Open to opportunities
```

If keeping the form: existing headline + form + map stays, just audit the copy to remove any marketing-speak.

#### Files affected
- `src/components/Contact.tsx` — audit copy, update contact details if stale

#### Changes
- Ensure email, LinkedIn, GitHub URLs match the resume exactly
- Add the availability line if missing
- Audit any copy that sounds like an agency pitch

#### What stays
- Formspree form wiring
- Map of Hyderabad (if present)
- Design / layout / animations

---

## 7. Components to remove or deprecate

**Don't remove anything without Akash's explicit OK.** This section is the *candidate* removal list, not an action list.

### 7.1 Candidates for removal
- **`CustomCursor.tsx`** — earlier taste feedback said Akash dislikes custom cursors. But the v3 branch still has it imported in `page.tsx`. **Decision: ask Akash before removing.** This file is 276 lines.
- **`divider-glow`** dividers in `page.tsx` — these are the `<div className="divider-glow mx-6 md:mx-12" />` between sections. They make the section boundaries feel like explicit visual rules. If the new design wants smoother color transitions between sections (Milkshake-style), these might need to go. **Decision: ask Akash.**
- **`TiltCard.tsx`** — if Projects doesn't use it after the rewrite, remove it. Inventory first.

### 7.2 Not removing (locked keep)
- All scavenger hunt widgets (`hunt/` folder + `HuntContext`)
- Arcade route and games
- `/secret` void route
- Preloader
- SmoothScroll / Lenis
- ParticleCanvas / GradientMesh / Marquee
- AnimationProvider and its scroll-triggered animation system

---

## 8. Execution plan (phased, resumable)

Execution is split into **8 phases**. Each phase has: entry criteria, actions, verification, exit criteria. A fresh session can pick up at any completed checkpoint.

### Phase 0: Pre-work (do now, before any code changes)
- [x] This plan document written
- [ ] **Akash approves the plan** ← gate for Phase 1
- [ ] Akash picks one of the hero headline variants
- [ ] Akash picks the About copy variant (with or without the "spice" line)
- [ ] Akash confirms: remove `CustomCursor.tsx`? keep `divider-glow`?

### Phase 1: Hero rewrite
**Entry:** Phase 0 complete and approved.
**Files:** `src/components/Hero.tsx`
**Actions:**
1. Update the `ROLES` array to the new list (single title OR 3-word rotation)
2. Replace the `<h1>` block with the chosen headline
3. Update the description paragraph
4. Verify the stats row still reads `3+/6/2/3`
5. Verify CTAs still wire up correctly
**Verification:** `npm run dev`, load page, inspect Hero visually. Run `npx tsc --noEmit` to check types.
**Exit:** Hero matches §6.1 draft.

### Phase 2: Projects → Selected Work
**Entry:** Phase 1 complete.
**Files:** `src/components/Projects.tsx`
**Actions:**
1. Rewrite the `projects` array: 4 featured projects with full 3-paragraph descriptions (§6.2)
2. **Remove all forbidden metrics** (`40%`, `₹40L+`, `~99% uptime`) — search the entire file
3. Add an `alsoShipped` array with the 4 demoted entries
4. Update the rendering layout to accommodate multi-paragraph descriptions (may require card redesign)
5. Render the `alsoShipped` strip below the featured cards
**Verification:**
```bash
grep -E "40%|40L|99%" src/components/Projects.tsx   # should return 0 matches
```
Load page, scroll through Projects, verify 4 featured case studies render with full depth and no forbidden metrics.
**Exit:** Projects section matches §6.2 draft.

### Phase 3: About rewrite
**Entry:** Phase 2 complete.
**Files:** `src/components/About.tsx`
**Actions:**
1. Replace the About copy with the chosen §6.3 draft
2. Verify the terminal-card visual still renders correctly
**Verification:** visual check, no layout breakage.
**Exit:** About matches §6.3.

### Phase 4: Technical Stack
**Entry:** Phase 3 complete.
**Files:** `src/components/Skills.tsx`
**Actions:**
1. Rewrite the skills data to the 9-group structure in §6.4
2. Add observability tools (Prometheus, Elastic APM, Kibana)
3. Remove any skills NOT in §6.4
**Verification:** visual check of all 9 groups rendering.
**Exit:** Skills matches §6.4.

### Phase 5: Experience simplification
**Entry:** Phase 4 complete.
**Files:** `src/components/Journey.tsx`
**Actions:**
1. Replace the timeline content with the 3 entries in §6.5
2. Remove any bullet lists, superlatives, or inflated claims
3. Remove any forbidden metrics (uptime, revenue, percentages)
**Verification:**
```bash
grep -E "40%|40L|99%" src/components/Journey.tsx   # should return 0 matches
```
Visual check of the timeline.
**Exit:** Journey matches §6.5.

### Phase 6: Contact audit
**Entry:** Phase 5 complete.
**Files:** `src/components/Contact.tsx`
**Actions:**
1. Verify email, LinkedIn, GitHub URLs match the resume exactly
2. Add/verify "Open to opportunities" line
3. Audit copy for marketing-speak
4. Keep the Formspree form if present and working
**Verification:** visual check, contact details match resume.
**Exit:** Contact matches §6.6.

### Phase 7: Global cleanup + forbidden-metric audit
**Entry:** Phase 6 complete.
**Files:** all of `src/components/**`
**Actions:**
1. Grep the entire codebase for forbidden metrics:
   ```bash
   grep -rE "40%|40L|99%|₹[0-9]" src/
   ```
   Any match outside of code comments or the `/arcade` games is a blocker.
2. Remove `CustomCursor.tsx` if Akash approved removal
3. Remove `divider-glow` elements if Akash approved removal
4. Remove `TiltCard.tsx` if no longer used (check imports first)
5. Run `npx tsc --noEmit` to verify no type errors
6. Run `npm run lint` to verify no lint errors
**Verification:** both commands pass clean.
**Exit:** codebase is clean, no forbidden content, no type errors.

### Phase 8: Execution polish (the "alive" layer)
**Entry:** Phase 7 complete. This is the creative craft phase.
**Files:** various, TBD based on Akash's feedback
**Actions:** These are candidate additions from Akash's taste research, all low-commitment and reversible:
- [ ] Scroll-linked background section numbers (à la Milkshake — a big translucent "2" slides across the background as you scroll into Section 2, etc.)
- [ ] Smooth color/section transitions instead of hard divider-glow breaks
- [ ] One "reveal" interaction — likely a drag-to-reveal or hover-plays-media moment — placed somewhere small so it doesn't dominate
- [ ] Hero micro-interaction that lets visitors "play" with something (draggable name letters, throwable orbs, physics on the stat numbers)
- [ ] A clever 404 page that matches the site's tone
- [ ] Audit every existing hover state: is it a *reveal* or a *decoration*? Prefer reveals.
**Verification:** Akash checks the site and confirms it feels "alive" under the new frame.
**Exit:** Akash signs off.

---

## 9. Checkpoints / progress tracking

**Use TaskCreate to track each phase as a task.** Recommended tasks:

```
Phase 0 — Approve rebuild plan (awaiting Akash)
Phase 1 — Hero copy rewrite
Phase 2 — Projects → Selected Work with case studies
Phase 3 — About rewrite
Phase 4 — Technical Stack regrouping
Phase 5 — Experience simplification
Phase 6 — Contact audit
Phase 7 — Global cleanup + forbidden-metric audit
Phase 8 — Execution polish (craft + reveals)
```

A fresh session resuming later should:
1. Read this doc end-to-end (sections 1–5 are essential; 6 is reference)
2. Check TaskList for the next incomplete phase
3. Read the relevant section (§6.1 for Phase 1, §6.2 for Phase 2, etc.)
4. Execute only that phase's actions
5. Verify and mark complete

---

## 10. Akash's answers (LOCKED — no longer open)

All questions answered 2026-04-08. Execution unblocked.

1. **Hero headline:** Use the current polished one (*"Building the infrastructure that powers the future."*) — keep it editable so Akash can change it later without friction.
2. **Role rotation:** 3-word rotation `[Platform Engineer / Fullstack Developer / IoT Builder]`.
3. **About spice line:** KEEP the optional spice line.
4. **`CustomCursor.tsx`:** REMOVE. A new simpler cursor may be built later if the site feels like it needs one — not in scope for initial phases.
5. **`divider-glow`:** REPLACE with smooth color transitions between sections. Bigger lift, worth it.
6. **Old role labels:** *"Platform Architect"* and *"DSL Designer"* are **too inflated**. Drop them. The 3-word rotation in #2 is the replacement.
7. **Case Study 4 mobile-sync line:** INCLUDE it. *"Mobile sync is where joy goes to die"* goes in as an italic aside.
8. **Contact Formspree form:** Claude's choice. **Decision: KEEP the form.** It's wired up, it works, and a working form is better than a mailto link for a hiring portfolio.

### 10a. Additional latitude granted by Akash
> *"this can be single page website or multi page website, or anything. You are free to do what you need to do just impress me. I need to feel like proper creative wow."*

Interpretation: the rebuild isn't just a copy cleanup — Akash wants the final site to feel genuinely **creative wow**, not just "cleaner than before". Any Claude session executing this plan has license to go beyond the letter of the rebuild and add the kind of coherent craft moves that make a site memorable. Specific moves I'm committing to are in §13 below.

---

## 13. Creative WOW vision (the overlay on the rebuild)

Akash explicitly asked for *"proper creative wow"*, with full latitude on single-page vs multi-page vs anything. This section is the coherent creative overlay I'm committing to, on top of the content rebuild in §6.

**Guiding principle:** every creative move must be a **reveal** (uncovers hidden content) and must **serve the substance** (not pure decoration). No WebGL showoff for its own sake. Coherence > feature count.

**Decision:** stay single-page. Multi-page would fragment the experience and lose scroll-driven choreography. Single-page with strong scroll narrative is more distinctive for a hiring portfolio than N individual project pages.

### 13.1 The five committed creative moves

These are the moments that make the site feel like an experience, not a scroll-through. Each is scoped and achievable inside the existing stack (Next.js 16 + GSAP + Lenis + Tailwind v4).

#### WOW 1. Scroll-linked per-section giant numerals (the Milkshake move)
As the user scrolls into each section, a giant translucent section number (`01`, `02`, `03`, `04`, `05`, `06`) glides across the background from the edge. It's scroll-linked via `ScrollTrigger.scrub`, so it responds to user motion — scroll up and it reverses. The number is set in the display font, ~40vw tall, ~8% opacity. Feels alive without being busy.
- **Implementation:** one persistent fixed-position `<div>` per section, each GSAP-scrubbed to translate across as the section enters/exits the viewport.
- **File impact:** `page.tsx` (add a `<SectionNumerals />` component) + new `src/components/SectionNumerals.tsx`.
- **Why it's wow:** the background is participating in navigation. Unusual. Memorable.

#### WOW 2. Smooth color-world transitions (kills the divider-glow)
Instead of hard section breaks with `divider-glow` dividers, the page background eases between color temperatures as you scroll. Each section declares its color world via a CSS custom property on its root element; a scroll-driven `ScrollTrigger` interpolates the page background between them. End result: the site feels like one continuous surface, not chunked.
- **Implementation:** define `--section-bg` per section, use `ScrollTrigger` + `gsap.to()` to tween `<body>` (or a page wrapper) background color as each section's boundaries enter/exit the viewport.
- **File impact:** `page.tsx` (wire the ScrollTrigger), `globals.css` (declare color worlds), each section component (attach a `data-section-color` attribute).
- **Why it's wow:** the site breathes in color. Competing portfolios chunk their sections with hard borders; this one flows.

#### WOW 3. One custom interactive per section ("expected task, unexpected gesture")
Every section gets ONE small moment where the visitor can do something beyond scrolling. Each one is a **reveal** (uncovers hidden content). Scope is tight — one per section, not five.

| Section | Reveal | How it works |
|---|---|---|
| **Hero** | Orbiting tech icons are hover-to-reveal fact cards | Hover an icon, a small tooltip card appears with one fact about how Akash uses that tech (`"Postgres: my default for anything with state"`). The existing orbit animation stays; the hover adds a reveal layer. |
| **Selected Work** | Drag-to-reveal architecture on a case study card | One case study card (likely the flagship FUS Script project) has a thin overlay that says `DRAG TO REVEAL ARCHITECTURE`. When the user drags across the card, the overlay erases to reveal an architecture diagram underneath. Pure UT-style drag-to-paint. |
| **About** | Terminal card has a "toggle tone" switch | A small `[technical / casual]` toggle in the terminal card corner. Flipping it swaps the About copy between the technical version and the spice version. Expected task (read an About), unexpected gesture (flip a toggle to change the voice). |
| **Technical Stack** | Click a skill to see which case studies used it | Click `Redis` and the 4 case study cards highlight the ones that used Redis. Click `React Native` and only Case Study 4 lights up. Tiny interaction, big "oh that's clever" moment. |
| **Experience** | Hover a year badge to see a month-by-month micro-timeline | The current Journey already has year badges. On hover, a small filmstrip of 12 dots appears, each scaling to represent relative workload. Fake data is fine — it's vibes, not a metric. |
| **Contact** | Live typing preview with character counter | As the user types in the message field, a small counter animates showing character count + a subtle color shift once they pass 50 chars (signalling "this is enough for me to reply meaningfully"). Subtle nudge, not obnoxious. |

Each of these is <1 day of work, adds no new dependencies, and is a legitimate reveal.

#### WOW 4. The FUS Script playground (the backend-engineer moment)
This is the biggest swing. Tucked inside Case Study 1 (the flagship project), a small interactive code panel displays a sample FUS Script definition (hand-authored, representative, not actual WaveFuel IP). A "Run" button simulates a mock device sending a message. The visitor watches the message flow through the parser in real-time — field extraction, data transformations, a mock RSA-encryption step on an outbound field, and finally a response event.

No backend. Pure frontend simulation. The point is to let visitors **see what a DSL parser does** instead of reading paragraphs about one. This is the move that genuinely surprises — a portfolio doesn't just describe Akash's flagship work, it lets you touch it.

- **Implementation:** a new `<FusScriptDemo />` component rendered inside the Case Study 1 card. ~200 lines: code panel (styled pre/code block), mock device panel, simulated message flow animation with sequential step highlighting. Uses the existing color world; no new deps.
- **File impact:** new `src/components/FusScriptDemo.tsx`, wired into `Projects.tsx` case study 1.
- **Why it's wow:** zero other portfolios let you interact with the flagship work. Hiring managers don't read case studies — they scan. A playable playground is unmissable.
- **Risk:** if this turns into a rabbit hole, cut scope to a non-interactive animated "walkthrough" of a sample message flowing through. Still impressive, zero input friction.

#### WOW 5. The self-referential meta corner
A tiny fixed-position chrome element (top-right or bottom-right) that shows live stats about the site itself:
```
portfolio.akashvarma.com
built in 2026 · 3,847 LOC · 1 DSL · 0 React Native
```
The "0 React Native" is the tiny punchline (since Akash hates it). The numbers can be hardcoded at build time from actual LOC counts — no runtime cost. It's the 5% personality, tucked into the chrome, invisible until noticed. Scavenger hunt clue #whatever can point visitors at it.
- **Implementation:** a new `<MetaCorner />` component, fixed-position, `opacity: 0.4` at rest, `opacity: 1` on hover. No interaction required.
- **File impact:** new `src/components/MetaCorner.tsx`, wired into `page.tsx`.
- **Why it's wow:** it's a dev-author self-portrait. Other engineers will smile. It's not forced personality — it's tucked-in personality.

### 13.2 The new cursor (deferred decision)
Akash said: *"remove, and create a new cursor if needed."* That's conditional permission, not a command to build.

**Plan:** remove `CustomCursor.tsx` in Phase 7. Build the new one **only if the site feels naked without one** after the rebuild. If we do build one, it's a small contextual dot — not a trailing follower:
- Tiny 6px dot at rest
- Expands to a pill-label on hover over interactive elements (`click to expand`, `drag to reveal`, etc.)
- Inherits the current section's accent color (ties into WOW 2)
- `mix-blend-mode: difference` so it's always visible

Deferred until after Phase 7 cleanup. The site may not need it.

### 13.3 What this is explicitly NOT
- NOT a scroll-jacked experience. Lenis smooth scroll stays, but scroll remains linear and native-feeling.
- NOT a WebGL shader showcase. The existing ParticleCanvas and GradientMesh stay as subtle background; no new canvas work in this plan.
- NOT a multi-page site with route transitions. Single-page with strong scroll narrative is the committed direction.
- NOT a complete visual redesign. The existing color palette, fonts, and layout rhythm stay. The creative moves overlay the existing aesthetic rather than replace it.
- NOT trying to be every reference site at once. Maxima-warmth + Milkshake-moments + Artefakt-restraint in tension. Pick the best-of, not the all-of.

### 13.4 Integration with the phase plan
The creative moves are **not** a Phase 8 afterthought. They're embedded into the phases:
- **Phase 1 (Hero):** WOW 3 hero tooltip reveal gets built here
- **Phase 2 (Projects):** WOW 3 case study drag-to-reveal + WOW 4 FUS Script playground both built here
- **Phase 3 (About):** WOW 3 terminal tone toggle built here
- **Phase 4 (Tech Stack):** WOW 3 click-to-filter-projects built here
- **Phase 5 (Experience):** WOW 3 year hover micro-timeline built here
- **Phase 6 (Contact):** WOW 3 live typing preview built here
- **Phase 7 (Cleanup):** WOW 2 smooth color transitions replace divider-glow, CustomCursor removed
- **Phase 8 (polish):** WOW 1 scroll-linked section numerals + WOW 5 meta corner + new cursor (if needed)

The rebuild IS the creative wow. There's no "boring phase then creative phase".

---

## 11. Non-goals (things this plan does NOT do)

- Does NOT add a "by the numbers" personality section. Out of scope per voice constraints.
- Does NOT add named friends, restaurant names, or Reverend Insanity content to the main copy. Can revisit later if Akash wants specific moments.
- Does NOT change the scavenger hunt, arcade, or `/secret` route. Those are the 5% personality — they stay.
- Does NOT introduce new dependencies. Everything uses the existing stack.
- Does NOT redesign the visual language / color world. The current aesthetic is kept; only content changes.
- Does NOT rebuild the page from scratch. All changes are edits to existing components.
- Does NOT touch the `/arcade` or `/secret` routes.

---

## 12. Quick reference card (for compaction)

If the context is compacted and only this section survives, here's the minimum viable information to resume the plan.

```
WHO:          Akash Varma, fullstack → platform engineer, 3+ years, Hyderabad
GOAL:         Hiring-tool portfolio, 4th attempt, finish this one
POSITIONING:  Platform Engineer (his WaveFuel title), fullstack background
RATIO:        80% substance, 15% craft, 5% personality
CONSTRAINTS:  NO uptime %, revenue ₹, or "reduction" percentages anywhere on public site
              NO named friends, restaurant names, Reverend Insanity, coffee/lifestyle stats
              NO "by the numbers" personality section, NO "insanely brilliant" tagline in hero
              TIMELESS (no 2026-specific references)

STRUCTURE:
  1. Hero              — clearer copy, trim role rotation, keep stats (3+/6/2/3)
  2. Selected Work     — 4 case studies (IoT Platform/FUS, EV Charging, Digital Twin,
                         Mobile SDK) + "also shipped" strip (4 entries)
  3. About             — 3-4 sentence technical framing
  4. Technical Stack   — 9 groups (Languages, Backend, Databases, Protocols, Infra,
                         Observability [Grafana+Prometheus+Elastic APM+Kibana], Mobile,
                         Frontend, Patterns)
  5. Experience        — WaveFuel (2024–) / Varsun (2022–24) / BVRIT (2018–22)
  6. Contact           — email / LinkedIn / GitHub / "Open to opportunities"

FILES TO EDIT:
  Hero.tsx              copy rewrite
  Projects.tsx          major rewrite, remove forbidden metrics, add case studies
  About.tsx             copy rewrite
  Skills.tsx            regroup into 9 categories
  Journey.tsx           simplify to resume timeline
  Contact.tsx           audit copy

FILES TO CONSIDER REMOVING (with Akash's OK):
  CustomCursor.tsx      earlier taste feedback said remove
  divider-glow in page.tsx  maybe
  TiltCard.tsx          if unused after Projects rewrite

CRITICAL FILES TO READ BEFORE CODING:
  docs/portfolio-rebuild-plan.md    (this doc)
  memory/user_portfolio_positioning.md
  memory/feedback_voice_is_spice_not_structure.md
  memory/feedback_design_reveals_not_effects.md
  Me.txt                            (Akash's journey in his own words)
  Akash Varma Resume-7.pdf          (polished source of truth for work history)

PRIMARY CONTACTS (from resume):
  Email:     g.akashvarma@gmail.com
  Phone:     +91 850-044-9747
  LinkedIn:  linkedin.com/in/akash-varma-gadiraju
  GitHub:    github.com/AkashVarmaGadiraju
  Location:  Hyderabad, India
  Title:     Platform Engineer @ WaveFuel Solutions (2024–present)
  Prev:      Software Engineer @ Varsun eTechnologies (2022–2024)
  Edu:       B.Tech CSE, BV Raju Institute of Technology (2018–2022)
```

---

**End of plan. Ready for Akash's approval on the §10 open questions, then Phase 1 begins.**
