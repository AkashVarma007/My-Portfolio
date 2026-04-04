# Arcade + Treasure Hunt — Design Spec

## Overview

Transform Akash's portfolio from a linear scroll experience into a multi-layered world with three tiers of depth:

1. **The Portfolio** (existing) — polished, professional, lime+dark theme
2. **The Arcade** — hidden below the footer, Crimson Edge theme, playable retro games
3. **The Void** — pitch-black zone below the arcade where the cipher hunt begins

Visitors who just scroll see a great portfolio. Curious ones discover the arcade. Obsessed ones enter the void and begin a 15-clue cipher chain that spans the entire site.

---

## 1. The Footer Tease

**What changes:** The existing footer gets a subtle addition — a faint downward arrow or text that hints "keep going" to curious scrollers. Nothing obvious. Just enough that someone who scrolls past the footer notices it.

**Implementation:** Add a subtle animated indicator below the current footer. CSS-only, fades in as you scroll past the footer boundary.

---

## 2. The Arcade Section

### 2.1 Theme: Crimson Edge

- **Colors:** Deep black (#06060a) background, red (#ff2d55) and orange (#ff6b2d) accents
- **Typography:** Orbitron (headings, stats), Rajdhani (body, UI) — loaded via Google Fonts
- **Style:** Sharp clip-path edges, angled UI elements, perspective grid floors, Tekken-inspired aggressive-but-clean aesthetic
- **Contrast:** Completely different from the main portfolio's lime+dark theme — entering the arcade feels like crossing into another world

### 2.2 Layout: Console Home Screen

**Top bar:**
- "ARCADE" logo in gradient text (left)
- Navigation tabs: GAMES | ACHIEVEMENTS | LEADERBOARD (left, next to logo)
- Player profile pill (right): angled avatar, name "PLAYER ONE", rank title, XP mini-bar

**Featured game hero (center):**
- Large game art/scene area (left 60%)
- Game info panel (right 40%): featured tag, game title in Orbitron, description, stats row (high score, max level, best time), "LAUNCH GAME" button with clip-path angled shape
- Perspective grid floor and character silhouette in the art area

**Game library strip (bottom):**
- Horizontal row of game cards with dark gradient backgrounds
- Each card: game icon/art, name, category dot + label, hover border glow
- "NOW PLAYING" diagonal ribbon on the featured game's card
- Final card: locked "???" — "Find 5 clues to unlock"

### 2.3 Games

Retro classics built with HTML5 Canvas or lightweight game libraries. Each game opens as a full-screen overlay on top of the arcade section.

**Confirmed games (4 playable + 1 locked):**

| Game | Type | Controls | Description |
|------|------|----------|-------------|
| Space Invaders | Action | Arrow keys + Space | Classic alien defense, wave-based |
| Snake | Classic | Arrow keys | Grow the snake, don't hit walls/self |
| Breakout | Arcade | Mouse/Arrow keys | Paddle + ball, destroy all blocks |
| Pong | PvP/AI | W/S vs Arrow keys | 2-player or vs AI paddle game |
| ??? (locked) | Mystery | — | Unlocked by finding 5 treasure hunt clues |

**Game UI when playing:**
- Full overlay with the game canvas centered
- Top bar: game name, current score, high score, pause/exit buttons
- Consistent Crimson Edge styling
- High scores persisted in localStorage

**Hidden clues in games:**
- Space Invaders: reach wave 10, a cipher flashes briefly on screen
- Breakout: destroy blocks in a specific pattern to reveal hidden text
- Snake: reach a score of exactly 42, a clue appears

### 2.4 Achievements Tab

Accessible from the top nav. Shows:
- Grid of achievement badges (locked/unlocked)
- Categories: Games (high scores, milestones), Exploration (Easter eggs found), Cipher (treasure hunt progress)
- Each achievement: icon, title, description, unlock status
- Total completion percentage

### 2.5 Leaderboard Tab

Simple local leaderboard (localStorage):
- Per-game high scores with timestamps
- Top 5 entries per game
- Optional: a fun "rank name" based on total score across all games

---

## 3. The Void

### 3.1 Transition

Below the arcade, the Crimson Edge colors gradually fade. The background transitions from #06060a to pure #000000. All UI elements dissolve. The visitor is scrolling into nothing.

### 3.2 The Introduction

After ~200px of pure black, faint text begins to appear — slowly, scroll-triggered, like it's being revealed by a flashlight:

> "You scrolled this far. Most people stopped at the footer."
>
> "Some found the arcade. You kept going."
>
> "Good."
>
> "There are 15 fragments hidden across this site. In the code. In the games. In places you haven't looked yet."
>
> "Each fragment is a piece of a cipher. Decode them all, and you'll find something meant for very few people."
>
> "Here is your first clue."

### 3.3 First Clue

The first clue appears in the void — a simple interaction-based puzzle. Easy enough that anyone who made it this far can solve it. Solving it reveals fragment #1 and the achievement tracker lights up.

---

## 4. The Treasure Hunt (Cipher Chain)

### 4.1 Structure

15 clues organized in a difficulty curve:

**Tier 1 — Curiosity (Clues 1-4):** Interaction-based, accessible to anyone paying attention.

| # | Location | Type | Puzzle |
|---|----------|------|--------|
| 1 | The Void | Interaction | First clue presented directly — click/interact to collect fragment |
| 2 | The Void | Observation | A flickering character in the void text. Click it to reveal a message pointing to the portfolio |
| 3 | Main site — Hero | Interaction | The orbiting tech icons — click them in a specific order (hinted by clue 2) to reveal fragment |
| 4 | Main site — About | Observation | The terminal's profile.json has an extra field that appears only after clue 3 is solved. It contains a hint |

**Tier 2 — Pattern Recognition (Clues 5-8):** Require noticing something is off + simple decoding.

| # | Location | Type | Puzzle |
|---|----------|------|--------|
| 5 | Main site — Marquee | Cipher | Certain letters in the scrolling marquee are subtly different (slightly brighter). Read them in order = Caesar-shifted message |
| 6 | Arcade — Snake | Game | Reach exactly score 42. A binary string flashes. Decode binary to ASCII for the next hint |
| 7 | Main site — Journey | Pattern | The year badges on the timeline (Y1, Y2, Y3) can be clicked in a non-obvious pattern. Doing so reveals a hidden 4th timeline entry with a Morse code message |
| 8 | Main site — Skills | Cipher | The skill percentage numbers (90, 85, 88, 75, 92, 85) — convert to ASCII letters for a hint |

**Tier 3 — Cryptography (Clues 9-12):** Real decoding work required.

| # | Location | Type | Puzzle |
|---|----------|------|--------|
| 9 | Arcade — Breakout | Game + Cipher | Complete all levels. The block colors in the final level, read left-to-right, encode a hex color sequence. Convert hex to ASCII |
| 10 | Main site — Contact | Hidden | The Google Maps embed coordinates are slightly off from Hyderabad. The offset values, interpreted as character codes, spell a word |
| 11 | Main site — Particles | Observation + Cipher | At a specific scroll position, the particles briefly arrange into a pattern. Screenshot it — it's a pigpen cipher |
| 12 | Arcade — Space Invaders | Game + Cipher | Reach wave 10. Invaders in that wave are arranged in a pattern — it's Morse code read row by row |

**Tier 4 — The Gauntlet (Clues 13-15):** Multi-step, cross-referencing required.

| # | Location | Type | Puzzle |
|---|----------|------|--------|
| 13 | Hidden terminal | Multi-step | A hidden terminal (accessible via Konami code on any page) accepts commands. Using fragments from clues 9-12 as input commands reveals the next cipher |
| 14 | Cross-site | Combination | Combine the first letter of each decoded clue (1-13) to form a passphrase. Enter it in the hidden terminal |
| 15 | Secret page | Final | The passphrase from clue 14 unlocks a hidden route — a secret page with Akash's personal message to whoever solved everything |

### 4.2 The Secret Page (Final Reward)

A minimal, stark page — different from both the portfolio and the arcade. White text on black, or something deliberately stripped back. Content:

- Acknowledgment: "You found it."
- A personal message from Akash about curiosity, engineering, building things
- A direct/private way to reach Akash (not the public contact form)
- A shareable "proof" — maybe a unique hash or badge image the solver can screenshot

### 4.3 Clue State Management

- All progress stored in localStorage under a single key (e.g., `akash_hunt`)
- Schema: `{ cluesFound: [1, 2, 5], totalClues: 15, gamesPlayed: {...}, achievements: [...] }`
- Each clue has a unique ID and a verification function — you can't just set localStorage manually to skip ahead (clues require proving you solved the previous prerequisite)
- Clue unlocks trigger a brief toast notification + achievement tracker update

---

## 5. Achievement Tracker Widget

### 5.1 Placement

Fixed position, bottom-left corner. Always visible across all sections (portfolio, arcade, void).

### 5.2 Collapsed State

Small icon — a glowing puzzle piece or crystal fragment. Shows a subtle count badge (e.g., "3/15"). Pulses gently when a new clue is found. Crimson accent glow matching the arcade theme but subtle enough to not clash with the main portfolio's lime theme.

### 5.3 Expanded State

Click to expand into a panel/drawer:

- **Progress bar:** "3 of 15 fragments found"
- **Clue list:** Each clue slot shown as a fragment — found ones show a checkmark + brief label ("The Void Entry"), unfound ones show "???"
- **Tier indicators:** Visual grouping by difficulty tier (Curiosity / Pattern / Crypto / Gauntlet)
- **Current hint:** A vague nudge toward the next unsolved clue (e.g., "Look closer at things that move")
- **Game stats:** Quick view of arcade high scores
- **Close button**

### 5.4 Styling

- Dark semi-transparent background with backdrop blur
- Adapts accent color based on current section: lime when on portfolio, crimson when on arcade/void
- Smooth slide-in animation
- Does not interfere with the custom cursor

---

## 6. Technical Architecture

### 6.1 New Components

| Component | Purpose |
|-----------|---------|
| `ArcadeSection` | Container for the entire arcade zone — theme provider, layout |
| `ArcadeNav` | Top bar with tabs (Games/Achievements/Leaderboard) |
| `ArcadeGameCard` | Individual game card in the library strip |
| `ArcadeFeatured` | Featured game hero section |
| `GameOverlay` | Full-screen overlay container when a game is launched |
| `SnakeGame` | Snake game implementation (Canvas) |
| `InvadersGame` | Space Invaders implementation (Canvas) |
| `BreakoutGame` | Breakout implementation (Canvas) |
| `PongGame` | Pong implementation (Canvas) |
| `VoidSection` | The pitch-black transition zone with scroll-triggered text |
| `TreasureIntro` | First clue presentation in the void |
| `AchievementWidget` | Floating bottom-left progress tracker |
| `AchievementPanel` | Expanded drawer view |
| `HiddenTerminal` | Konami-code activated command terminal overlay |
| `SecretPage` | The final reward page (separate route) |
| `HuntProvider` | React context for treasure hunt state (localStorage sync) |

### 6.2 State Management

A React context (`HuntContext`) wraps the entire app:

```
HuntProvider
├── cluesFound: number[]
├── unlockClue(id): void (with verification)
├── achievements: Achievement[]
├── gameScores: Record<string, number>
├── updateScore(game, score): void
├── currentTier: 1-4
├── isTerminalOpen: boolean
└── localStorage sync (read on mount, write on change)
```

### 6.3 Routing

- `/` — main portfolio + arcade + void (single page, scroll-based)
- `/secret` — the final reward page (only accessible if clue 15 is solved, otherwise redirects to `/`)

### 6.4 Dependencies

- **Games:** HTML5 Canvas API (no heavy game framework — keeps bundle small)
- **Fonts:** Orbitron + Rajdhani via `next/font/google` (arcade sections only)
- **Animations:** GSAP (already in project) for void scroll reveals
- **No new heavy dependencies** — everything built with Canvas + React + CSS

### 6.5 Performance

- Arcade section and games lazy-loaded (not in initial bundle)
- Game canvases only initialize when the game is launched
- Achievement widget is lightweight (just reads context)
- Void text reveals use IntersectionObserver, not scroll listeners

---

## 7. Scope Boundaries

**In scope:**
- Arcade section with 4 playable games + 1 unlockable
- 15-clue treasure hunt with progressive difficulty
- Achievement tracker widget
- Hidden terminal (Konami code)
- Secret final page
- localStorage persistence
- Footer tease hint

**Out of scope (for now):**
- Backend/server-side score tracking
- Multiplayer/online leaderboards
- Sound effects / music (can be added later)
- Mobile game controls (touch support can be a follow-up)
- Social sharing of achievements
