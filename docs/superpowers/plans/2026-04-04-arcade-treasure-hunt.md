# Arcade + Treasure Hunt Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a hidden arcade section (below footer), a pitch-black void zone with a 15-clue cipher chain, an achievement tracker widget, a hidden terminal, and a secret page — turning the portfolio into a multi-layered exploration experience.

**Architecture:** Single-page scroll extends past the footer: Footer → Arcade (Crimson Edge theme) → Void (pitch black, treasure hunt intro). A React context (HuntProvider) manages all hunt/game state in localStorage. Games are HTML5 Canvas in overlay modals. Easter egg clues are woven into existing components via the HuntContext. A floating achievement widget (bottom-left) shows progress across all sections.

**Tech Stack:** Next.js 16, React 19, GSAP + ScrollTrigger (existing), HTML5 Canvas API (games), localStorage (persistence), Tailwind CSS (styling), Orbitron + Rajdhani fonts (arcade theme)

---

## File Structure

### New files to create:

```
src/
├── context/
│   └── HuntContext.tsx            # React context + provider for all hunt/game state
├── data/
│   └── clues.ts                   # Clue definitions, hints, verification logic
├── components/
│   ├── arcade/
│   │   ├── ArcadeSection.tsx      # Main arcade container + theme wrapper
│   │   ├── ArcadeNav.tsx          # Top bar (logo, tabs, profile pill)
│   │   ├── ArcadeFeatured.tsx     # Featured game hero card
│   │   ├── ArcadeGameCard.tsx     # Individual game card in library strip
│   │   ├── ArcadeAchievements.tsx # Achievements tab content
│   │   ├── ArcadeLeaderboard.tsx  # Leaderboard tab content
│   │   └── GameOverlay.tsx        # Full-screen game container overlay
│   ├── games/
│   │   ├── SnakeGame.tsx          # Snake game (Canvas)
│   │   ├── InvadersGame.tsx       # Space Invaders game (Canvas)
│   │   ├── BreakoutGame.tsx       # Breakout game (Canvas)
│   │   └── PongGame.tsx           # Pong game (Canvas)
│   ├── void/
│   │   └── VoidSection.tsx        # Pitch-black zone + treasure hunt intro + first clue
│   ├── hunt/
│   │   ├── AchievementWidget.tsx  # Floating bottom-left tracker (collapsed + expanded)
│   │   ├── HiddenTerminal.tsx     # Konami-code activated terminal overlay
│   │   └── ClueToast.tsx          # Brief notification when clue is found
│   └── FooterTease.tsx            # Subtle "keep scrolling" hint below footer
├── app/
│   └── secret/
│       └── page.tsx               # Secret final reward page
```

### Files to modify:

```
src/app/page.tsx                   # Add HuntProvider, ArcadeSection, VoidSection, AchievementWidget, FooterTease, HiddenTerminal
src/app/layout.tsx                 # Add Orbitron + Rajdhani fonts
src/components/Hero.tsx            # Add clue 3 (icon click sequence Easter egg)
src/components/About.tsx           # Add clue 4 (hidden terminal field)
src/components/Marquee.tsx         # Add clue 5 (highlighted letters)
src/components/Journey.tsx         # Add clue 7 (clickable year badges)
src/components/Skills.tsx          # Add clue 8 (percentage cipher hint)
src/components/Contact.tsx         # Add clue 10 (coordinate offset)
src/components/ParticleCanvas.tsx  # Add clue 11 (particle pattern)
src/components/Footer.tsx          # Extend to include tease indicator
```

---

## Phase 1: Foundation

### Task 1: Hunt Context + State Management

**Files:**
- Create: `src/context/HuntContext.tsx`
- Create: `src/data/clues.ts`

This is the backbone — every other feature reads from this context.

- [ ] **Step 1: Create clue definitions**

Create `src/data/clues.ts`:

```ts
export interface Clue {
  id: number;
  tier: 1 | 2 | 3 | 4;
  title: string;
  hint: string;
  location: string;
  prerequisite: number | null; // clue ID that must be solved first, or null
}

export const CLUES: Clue[] = [
  { id: 1, tier: 1, title: "The Void Entry", hint: "You already found the void. Look closer.", location: "void", prerequisite: null },
  { id: 2, tier: 1, title: "The Flicker", hint: "Something in the darkness blinks differently.", location: "void", prerequisite: 1 },
  { id: 3, tier: 1, title: "The Constellation", hint: "The orbiting icons hold a secret order.", location: "hero", prerequisite: 2 },
  { id: 4, tier: 1, title: "The Hidden Field", hint: "The terminal knows more than it shows.", location: "about", prerequisite: 3 },
  { id: 5, tier: 2, title: "The Bright Letters", hint: "Some letters in the stream shine brighter.", location: "marquee", prerequisite: 4 },
  { id: 6, tier: 2, title: "The Answer", hint: "In Snake, the answer to everything is 42.", location: "arcade-snake", prerequisite: 5 },
  { id: 7, tier: 2, title: "The Fourth Year", hint: "The timeline has a gap. Fill it.", location: "journey", prerequisite: 6 },
  { id: 8, tier: 2, title: "The Numbers Station", hint: "Skill levels aren't just percentages.", location: "skills", prerequisite: 7 },
  { id: 9, tier: 3, title: "The Color Code", hint: "The final wall tells a colorful story.", location: "arcade-breakout", prerequisite: 8 },
  { id: 10, tier: 3, title: "The Wrong Coordinates", hint: "The map isn't pointing where you think.", location: "contact", prerequisite: 9 },
  { id: 11, tier: 3, title: "The Particle Message", hint: "Particles aren't always random.", location: "particles", prerequisite: 10 },
  { id: 12, tier: 3, title: "The Invasion Pattern", hint: "Wave 10 invaders march to a beat.", location: "arcade-invaders", prerequisite: 11 },
  { id: 13, tier: 4, title: "The Console", hint: "↑↑↓↓←→←→BA", location: "terminal", prerequisite: 12 },
  { id: 14, tier: 4, title: "The Passphrase", hint: "Every answer hides a letter. Collect them all.", location: "terminal", prerequisite: 13 },
  { id: 15, tier: 4, title: "The End", hint: "Enter the passphrase. Find the door.", location: "secret", prerequisite: 14 },
];

export const TIER_NAMES: Record<number, string> = {
  1: "Curiosity",
  2: "Pattern",
  3: "Cryptography",
  4: "The Gauntlet",
};

export const TOTAL_CLUES = CLUES.length;
```

- [ ] **Step 2: Create HuntContext provider**

Create `src/context/HuntContext.tsx`:

```tsx
"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { CLUES, TOTAL_CLUES, type Clue } from "@/data/clues";

interface GameScores {
  snake: number;
  invaders: number;
  breakout: number;
  pong: number;
}

interface HuntState {
  cluesFound: number[];
  gameScores: GameScores;
  achievements: string[];
}

interface HuntContextType {
  state: HuntState;
  unlockClue: (id: number) => boolean;
  isClueFound: (id: number) => boolean;
  canAttemptClue: (id: number) => boolean;
  updateGameScore: (game: keyof GameScores, score: number) => void;
  addAchievement: (id: string) => void;
  hasAchievement: (id: string) => boolean;
  totalFound: number;
  totalClues: number;
  currentTier: number;
  clueJustFound: number | null;
  dismissClueToast: () => void;
}

const STORAGE_KEY = "akash_hunt";

const DEFAULT_STATE: HuntState = {
  cluesFound: [],
  gameScores: { snake: 0, invaders: 0, breakout: 0, pong: 0 },
  achievements: [],
};

const HuntContext = createContext<HuntContextType | null>(null);

function loadState(): HuntState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return {
      cluesFound: Array.isArray(parsed.cluesFound) ? parsed.cluesFound : [],
      gameScores: { ...DEFAULT_STATE.gameScores, ...parsed.gameScores },
      achievements: Array.isArray(parsed.achievements) ? parsed.achievements : [],
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function saveState(state: HuntState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage full or unavailable — silently fail
  }
}

export function HuntProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<HuntState>(DEFAULT_STATE);
  const [mounted, setMounted] = useState(false);
  const [clueJustFound, setClueJustFound] = useState<number | null>(null);

  useEffect(() => {
    setState(loadState());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) saveState(state);
  }, [state, mounted]);

  const isClueFound = useCallback(
    (id: number) => state.cluesFound.includes(id),
    [state.cluesFound]
  );

  const canAttemptClue = useCallback(
    (id: number) => {
      const clue = CLUES.find((c) => c.id === id);
      if (!clue) return false;
      if (clue.prerequisite === null) return true;
      return state.cluesFound.includes(clue.prerequisite);
    },
    [state.cluesFound]
  );

  const unlockClue = useCallback(
    (id: number): boolean => {
      if (state.cluesFound.includes(id)) return false;
      if (!canAttemptClue(id)) return false;
      setState((prev) => ({
        ...prev,
        cluesFound: [...prev.cluesFound, id],
      }));
      setClueJustFound(id);
      return true;
    },
    [state.cluesFound, canAttemptClue]
  );

  const updateGameScore = useCallback(
    (game: keyof GameScores, score: number) => {
      setState((prev) => ({
        ...prev,
        gameScores: {
          ...prev.gameScores,
          [game]: Math.max(prev.gameScores[game], score),
        },
      }));
    },
    []
  );

  const addAchievement = useCallback(
    (id: string) => {
      setState((prev) =>
        prev.achievements.includes(id)
          ? prev
          : { ...prev, achievements: [...prev.achievements, id] }
      );
    },
    []
  );

  const hasAchievement = useCallback(
    (id: string) => state.achievements.includes(id),
    [state.achievements]
  );

  const dismissClueToast = useCallback(() => setClueJustFound(null), []);

  const currentTier = state.cluesFound.length === 0
    ? 1
    : Math.max(...state.cluesFound.map((id) => CLUES.find((c) => c.id === id)?.tier ?? 1));

  return (
    <HuntContext.Provider
      value={{
        state,
        unlockClue,
        isClueFound,
        canAttemptClue,
        updateGameScore,
        addAchievement,
        hasAchievement,
        totalFound: state.cluesFound.length,
        totalClues: TOTAL_CLUES,
        currentTier,
        clueJustFound,
        dismissClueToast,
      }}
    >
      {children}
    </HuntContext.Provider>
  );
}

export function useHunt() {
  const ctx = useContext(HuntContext);
  if (!ctx) throw new Error("useHunt must be used within HuntProvider");
  return ctx;
}
```

- [ ] **Step 3: Verify it compiles**

Run: `cd /home/nishanth/Desktop/Personal/Akash/Portfolio/v3 && npx next build 2>&1 | head -30`

Expected: No TypeScript errors related to HuntContext or clues.

- [ ] **Step 4: Commit**

```bash
git add src/context/HuntContext.tsx src/data/clues.ts
git commit -m "feat: add HuntContext provider and clue definitions"
```

---

### Task 2: Add Arcade Fonts to Layout

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Add Orbitron and Rajdhani imports**

In `src/app/layout.tsx`, add after the existing font imports:

```tsx
import { Outfit, Bricolage_Grotesque, Instrument_Serif, JetBrains_Mono, Orbitron, Rajdhani } from "next/font/google";
```

Replace the existing `Outfit` import line with this combined import.

- [ ] **Step 2: Add font configurations**

After the `jetbrainsMono` const, add:

```tsx
const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["500", "700", "900"],
  display: "swap",
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});
```

- [ ] **Step 3: Add font variables to html className**

Update the `<html>` element className to include the new variables:

```tsx
className={`${outfit.variable} ${bricolage.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} ${orbitron.variable} ${rajdhani.variable} antialiased`}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: add Orbitron and Rajdhani fonts for arcade theme"
```

---

### Task 3: Clue Toast Notification

**Files:**
- Create: `src/components/hunt/ClueToast.tsx`

- [ ] **Step 1: Create the toast component**

Create `src/components/hunt/ClueToast.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import { useHunt } from "@/context/HuntContext";
import { CLUES } from "@/data/clues";

export function ClueToast() {
  const { clueJustFound, dismissClueToast, totalFound, totalClues } = useHunt();

  useEffect(() => {
    if (clueJustFound !== null) {
      const timer = setTimeout(dismissClueToast, 4000);
      return () => clearTimeout(timer);
    }
  }, [clueJustFound, dismissClueToast]);

  if (clueJustFound === null) return null;

  const clue = CLUES.find((c) => c.id === clueJustFound);
  if (!clue) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 80,
        left: 24,
        zIndex: 10000,
        background: "rgba(255,45,85,0.12)",
        border: "1px solid rgba(255,45,85,0.3)",
        backdropFilter: "blur(12px)",
        borderRadius: 6,
        padding: "12px 18px",
        maxWidth: 300,
        animation: "toast-in 0.4s ease-out",
        fontFamily: "var(--font-rajdhani), sans-serif",
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 2,
          color: "#ff2d55",
          textTransform: "uppercase" as const,
          marginBottom: 4,
        }}
      >
        Fragment Found
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 2 }}>
        {clue.title}
      </div>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
        {totalFound} of {totalClues} fragments collected
      </div>
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(12px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/hunt/ClueToast.tsx
git commit -m "feat: add ClueToast notification component"
```

---

### Task 4: Achievement Widget

**Files:**
- Create: `src/components/hunt/AchievementWidget.tsx`

- [ ] **Step 1: Create the floating widget**

Create `src/components/hunt/AchievementWidget.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useHunt } from "@/context/HuntContext";
import { CLUES, TIER_NAMES } from "@/data/clues";

export function AchievementWidget() {
  const [expanded, setExpanded] = useState(false);
  const { totalFound, totalClues, isClueFound, state, currentTier } = useHunt();

  // Don't show until at least the void has been reached (clue 1 area)
  // We show it always so users can track, but it's subtle
  const progressPct = (totalFound / totalClues) * 100;

  return (
    <>
      {/* Collapsed icon */}
      <button
        onClick={() => setExpanded(!expanded)}
        aria-label="Achievement tracker"
        style={{
          position: "fixed",
          bottom: 24,
          left: 24,
          zIndex: 9990,
          width: 44,
          height: 44,
          borderRadius: 8,
          background: "rgba(255,45,85,0.1)",
          border: "1px solid rgba(255,45,85,0.25)",
          backdropFilter: "blur(8px)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s ease",
          boxShadow: totalFound > 0 ? "0 0 12px rgba(255,45,85,0.2)" : "none",
        }}
      >
        <span style={{ fontSize: 18 }}>◆</span>
        {totalFound > 0 && (
          <span
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              background: "#ff2d55",
              color: "#fff",
              fontSize: 9,
              fontWeight: 700,
              width: 18,
              height: 18,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-orbitron), monospace",
            }}
          >
            {totalFound}
          </span>
        )}
      </button>

      {/* Expanded panel */}
      {expanded && (
        <div
          style={{
            position: "fixed",
            bottom: 80,
            left: 24,
            zIndex: 9991,
            width: 320,
            maxHeight: "70vh",
            overflowY: "auto",
            background: "rgba(6,6,10,0.95)",
            border: "1px solid rgba(255,45,85,0.15)",
            borderRadius: 10,
            backdropFilter: "blur(16px)",
            padding: 20,
            fontFamily: "var(--font-rajdhani), sans-serif",
            animation: "widget-in 0.3s ease-out",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, color: "#ff2d55", textTransform: "uppercase" as const }}>
                Fragments
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", fontFamily: "var(--font-orbitron), monospace" }}>
                {totalFound} / {totalClues}
              </div>
            </div>
            <button
              onClick={() => setExpanded(false)}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: 18, cursor: "pointer" }}
            >
              ✕
            </button>
          </div>

          {/* Progress bar */}
          <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, marginBottom: 20 }}>
            <div
              style={{
                width: `${progressPct}%`,
                height: "100%",
                background: "linear-gradient(90deg, #ff2d55, #ff6b2d)",
                borderRadius: 2,
                transition: "width 0.5s ease",
              }}
            />
          </div>

          {/* Clue list by tier */}
          {[1, 2, 3, 4].map((tier) => {
            const tierClues = CLUES.filter((c) => c.tier === tier);
            return (
              <div key={tier} style={{ marginBottom: 16 }}>
                <div
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: 2,
                    color: "rgba(255,255,255,0.25)",
                    textTransform: "uppercase" as const,
                    marginBottom: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span style={{ color: tier <= currentTier ? "#ff2d55" : "inherit" }}>
                    {TIER_NAMES[tier]}
                  </span>
                </div>
                {tierClues.map((clue) => {
                  const found = isClueFound(clue.id);
                  return (
                    <div
                      key={clue.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "6px 0",
                        borderBottom: "1px solid rgba(255,255,255,0.03)",
                      }}
                    >
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 3,
                          border: `1px solid ${found ? "#ff2d55" : "rgba(255,255,255,0.08)"}`,
                          background: found ? "rgba(255,45,85,0.15)" : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10,
                          color: "#ff2d55",
                          flexShrink: 0,
                        }}
                      >
                        {found ? "✓" : ""}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: found ? "#fff" : "rgba(255,255,255,0.2)" }}>
                          {found ? clue.title : "???"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}

          {/* Hint for next clue */}
          {totalFound < totalClues && (
            <div
              style={{
                marginTop: 8,
                padding: "10px 12px",
                background: "rgba(255,45,85,0.05)",
                border: "1px solid rgba(255,45,85,0.1)",
                borderRadius: 6,
                fontSize: 11,
                color: "rgba(255,255,255,0.35)",
                fontStyle: "italic",
              }}
            >
              💡 {CLUES.find((c) => !isClueFound(c.id) && (c.prerequisite === null || isClueFound(c.prerequisite)))?.hint ?? "Keep exploring..."}
            </div>
          )}

          {/* Game scores */}
          {(state.gameScores.snake > 0 || state.gameScores.invaders > 0 || state.gameScores.breakout > 0 || state.gameScores.pong > 0) && (
            <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: "rgba(255,255,255,0.25)", textTransform: "uppercase" as const, marginBottom: 8 }}>
                High Scores
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {Object.entries(state.gameScores).map(([game, score]) =>
                  score > 0 ? (
                    <div key={game} style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                      <span style={{ color: "#ff6b2d", fontFamily: "var(--font-orbitron), monospace", fontSize: 13, fontWeight: 700 }}>
                        {score.toLocaleString()}
                      </span>{" "}
                      {game}
                    </div>
                  ) : null
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes widget-in {
          from { opacity: 0; transform: translateY(8px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/hunt/AchievementWidget.tsx
git commit -m "feat: add AchievementWidget with progress panel"
```

---

### Task 5: Footer Tease

**Files:**
- Create: `src/components/FooterTease.tsx`

- [ ] **Step 1: Create the footer tease component**

Create `src/components/FooterTease.tsx`:

```tsx
"use client";

export function FooterTease() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 0 20px",
        opacity: 0.15,
        transition: "opacity 0.5s ease",
        cursor: "default",
        userSelect: "none",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.opacity = "0.35";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.opacity = "0.15";
      }}
    >
      <div
        style={{
          fontSize: 10,
          letterSpacing: 4,
          color: "rgba(255,255,255,0.5)",
          textTransform: "uppercase" as const,
          fontFamily: "var(--font-mono)",
          marginBottom: 12,
        }}
      >
        keep scrolling
      </div>
      <div
        style={{
          width: 1,
          height: 30,
          background: "linear-gradient(180deg, rgba(255,255,255,0.2), transparent)",
        }}
      />
      <div
        style={{
          animation: "tease-bounce 2s ease-in-out infinite",
          fontSize: 14,
          color: "rgba(255,255,255,0.3)",
          marginTop: 4,
        }}
      >
        ↓
      </div>
      <style>{`
        @keyframes tease-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/FooterTease.tsx
git commit -m "feat: add FooterTease component for scroll hint"
```

---

## Phase 2: Arcade Section

### Task 6: Arcade Section Container + Nav

**Files:**
- Create: `src/components/arcade/ArcadeSection.tsx`
- Create: `src/components/arcade/ArcadeNav.tsx`

- [ ] **Step 1: Create ArcadeNav**

Create `src/components/arcade/ArcadeNav.tsx`:

```tsx
"use client";

import { useHunt } from "@/context/HuntContext";

interface ArcadeNavProps {
  activeTab: "games" | "achievements" | "leaderboard";
  onTabChange: (tab: "games" | "achievements" | "leaderboard") => void;
}

export function ArcadeNav({ activeTab, onTabChange }: ArcadeNavProps) {
  const { totalFound, totalClues, state } = useHunt();
  const tabs = ["games", "achievements", "leaderboard"] as const;

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        height: 52,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
      }}
    >
      {/* Left: logo + tabs */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span
          style={{
            fontFamily: "var(--font-orbitron), monospace",
            fontSize: 14,
            fontWeight: 900,
            background: "linear-gradient(135deg, #ff2d55, #ff6b2d)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: 3,
          }}
        >
          ARCADE
        </span>
        <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.1)" }} />
        <div style={{ display: "flex", gap: 16 }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              style={{
                background: "none",
                border: "none",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: activeTab === tab ? "#ff2d55" : "rgba(255,255,255,0.3)",
                cursor: "pointer",
                fontFamily: "var(--font-rajdhani), sans-serif",
                transition: "color 0.2s",
                padding: "4px 0",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Right: XP bar + profile */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 60, height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 0, overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${(totalFound / totalClues) * 100}%`,
              background: "linear-gradient(90deg, #ff2d55, #ff6b2d)",
              transition: "width 0.5s ease",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 3,
            padding: "4px 10px 4px 4px",
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              background: "linear-gradient(135deg, #ff2d55, #ff6b2d)",
              clipPath: "polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              fontWeight: 900,
              color: "#fff",
            }}
          >
            AV
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.8)", letterSpacing: 1, fontFamily: "var(--font-rajdhani)" }}>
              PLAYER ONE
            </div>
            <div style={{ fontSize: 8, color: "#ff2d55", fontWeight: 600, letterSpacing: 1 }}>
              ◆ {totalFound >= 13 ? "LEGEND" : totalFound >= 9 ? "HACKER" : totalFound >= 5 ? "EXPLORER" : "ROOKIE"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create ArcadeSection container**

Create `src/components/arcade/ArcadeSection.tsx`:

```tsx
"use client";

import { useState } from "react";
import { ArcadeNav } from "./ArcadeNav";
import { ArcadeFeatured } from "./ArcadeFeatured";
import { ArcadeGameCard } from "./ArcadeGameCard";
import { ArcadeAchievements } from "./ArcadeAchievements";
import { ArcadeLeaderboard } from "./ArcadeLeaderboard";
import { GameOverlay } from "./GameOverlay";
import { useHunt } from "@/context/HuntContext";

type GameId = "invaders" | "snake" | "breakout" | "pong" | "secret";
type Tab = "games" | "achievements" | "leaderboard";

const GAMES = [
  { id: "invaders" as GameId, name: "Invaders", icon: "👾", category: "Action", categoryColor: "#ff2d55", bg: "linear-gradient(135deg,#1a0520,#200a15)" },
  { id: "snake" as GameId, name: "Snake", icon: "🐍", category: "Classic", categoryColor: "#00ff88", bg: "linear-gradient(135deg,#0a1a10,#0a200a)" },
  { id: "breakout" as GameId, name: "Breakout", icon: "🧱", category: "Arcade", categoryColor: "#ffaa00", bg: "linear-gradient(135deg,#1a1005,#201a0a)" },
  { id: "pong" as GameId, name: "Pong", icon: "🏓", category: "PvP", categoryColor: "#7b7bff", bg: "linear-gradient(135deg,#0a0a1a,#0f0a20)" },
];

export function ArcadeSection() {
  const [activeTab, setActiveTab] = useState<Tab>("games");
  const [activeGame, setActiveGame] = useState<GameId | null>(null);
  const [featuredGame, setFeaturedGame] = useState<GameId>("invaders");
  const { totalFound } = useHunt();

  const secretUnlocked = totalFound >= 5;

  return (
    <section
      id="arcade-section"
      style={{
        background: "#06060a",
        minHeight: "100vh",
        position: "relative",
        fontFamily: "var(--font-rajdhani), sans-serif",
        color: "#fff",
      }}
    >
      {/* Top accent line */}
      <div style={{ height: 2, background: "linear-gradient(90deg, #ff2d55, #ff6b2d)" }} />

      <ArcadeNav activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "games" && (
        <>
          <ArcadeFeatured
            game={GAMES.find((g) => g.id === featuredGame)!}
            onLaunch={() => setActiveGame(featuredGame)}
          />

          {/* Game library strip */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0 20px",
              gap: 12,
              borderTop: "1px solid rgba(255,255,255,0.04)",
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(10px)",
              height: 140,
            }}
          >
            <div
              style={{
                writingMode: "vertical-lr",
                textOrientation: "mixed",
                fontSize: 9,
                color: "rgba(255,255,255,0.15)",
                letterSpacing: 3,
                textTransform: "uppercase",
                fontWeight: 700,
                transform: "rotate(180deg)",
                marginRight: 4,
              }}
            >
              Library
            </div>
            {GAMES.map((game) => (
              <ArcadeGameCard
                key={game.id}
                game={game}
                isFeatured={featuredGame === game.id}
                onClick={() => setFeaturedGame(game.id)}
                onPlay={() => setActiveGame(game.id)}
              />
            ))}
            {/* Locked secret game */}
            <ArcadeGameCard
              game={{
                id: "secret",
                name: secretUnlocked ? "???" : "???",
                icon: secretUnlocked ? "⚡" : "🔒",
                category: secretUnlocked ? "Secret" : "",
                categoryColor: "#ff2d55",
                bg: "#0a0a0f",
              }}
              isFeatured={false}
              locked={!secretUnlocked}
              onClick={() => {
                if (secretUnlocked) setActiveGame("secret");
              }}
              onPlay={() => {
                if (secretUnlocked) setActiveGame("secret");
              }}
            />
          </div>
        </>
      )}

      {activeTab === "achievements" && <ArcadeAchievements />}
      {activeTab === "leaderboard" && <ArcadeLeaderboard />}

      {/* Game overlay */}
      {activeGame && (
        <GameOverlay gameId={activeGame} onClose={() => setActiveGame(null)} />
      )}
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/arcade/ArcadeSection.tsx src/components/arcade/ArcadeNav.tsx
git commit -m "feat: add ArcadeSection container and ArcadeNav"
```

---

### Task 7: Featured Game + Game Card Components

**Files:**
- Create: `src/components/arcade/ArcadeFeatured.tsx`
- Create: `src/components/arcade/ArcadeGameCard.tsx`

- [ ] **Step 1: Create ArcadeFeatured**

Create `src/components/arcade/ArcadeFeatured.tsx`:

```tsx
"use client";

import { useHunt } from "@/context/HuntContext";

interface Game {
  id: string;
  name: string;
  icon: string;
  category: string;
  categoryColor: string;
  bg: string;
}

interface ArcadeFeaturedProps {
  game: Game;
  onLaunch: () => void;
}

const GAME_DESCRIPTIONS: Record<string, { desc: string; stat1: string; stat1Label: string; stat2: string; stat2Label: string }> = {
  invaders: {
    desc: "Classic alien defense reimagined. Waves get faster. Shields crumble. How long can you hold the line?",
    stat1: "LV.12", stat1Label: "Max Wave", stat2: "3:42", stat2Label: "Best Time",
  },
  snake: {
    desc: "The original. Grow longer, don't hit walls. Simple rules, infinite challenge. Can you find the magic number?",
    stat1: "256", stat1Label: "Max Length", stat2: "∞", stat2Label: "Loops",
  },
  breakout: {
    desc: "Precision meets power. Destroy every block. Every level hides something. Pay attention to the colors.",
    stat1: "LV.8", stat1Label: "Stage", stat2: "92%", stat2Label: "Accuracy",
  },
  pong: {
    desc: "The granddaddy. You vs the machine. First to 11 wins. Simple. Brutal. Fair.",
    stat1: "11-3", stat1Label: "Best Win", stat2: "0:48", stat2Label: "Fastest",
  },
};

export function ArcadeFeatured({ game, onLaunch }: ArcadeFeaturedProps) {
  const { state } = useHunt();
  const info = GAME_DESCRIPTIONS[game.id] ?? GAME_DESCRIPTIONS.invaders;
  const gameKey = game.id as keyof typeof state.gameScores;
  const highScore = state.gameScores[gameKey] ?? 0;

  return (
    <div style={{ display: "flex", height: "calc(100vh - 52px - 140px)", minHeight: 400, position: "relative", overflow: "hidden" }}>
      {/* Game art area */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #1a0520 0%, #0d0d20 50%, #0a1520 100%)" }} />
        {/* Grid floor */}
        <div
          style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "50%",
            background: "repeating-linear-gradient(90deg, rgba(255,45,85,0.04) 0px, rgba(255,45,85,0.04) 1px, transparent 1px, transparent 50px), repeating-linear-gradient(0deg, rgba(255,45,85,0.03) 0px, rgba(255,45,85,0.03) 1px, transparent 1px, transparent 30px)",
            transform: "perspective(200px) rotateX(50deg)", transformOrigin: "bottom",
          }}
        />
        {/* Character/icon */}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              width: 140, height: 180, position: "relative",
              background: "linear-gradient(180deg, rgba(255,45,85,0.15), rgba(255,107,45,0.08))",
              border: "1px solid rgba(255,45,85,0.1)",
              clipPath: "polygon(10% 0%, 90% 0%, 100% 20%, 100% 100%, 0% 100%, 0% 20%)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <span style={{ fontSize: 64 }}>{game.icon}</span>
          </div>
          <div
            style={{
              position: "absolute", bottom: "20%", left: "50%", transform: "translateX(-50%)",
              width: 200, height: 40,
              background: "radial-gradient(ellipse, rgba(255,45,85,0.2), transparent 70%)",
            }}
          />
        </div>
      </div>

      {/* Fade overlay */}
      <div style={{ position: "absolute", top: 0, bottom: 0, right: 340, width: 100, background: "linear-gradient(90deg, transparent, rgba(6,6,10,0.8))", zIndex: 1 }} />

      {/* Game info panel */}
      <div style={{ width: 340, padding: 28, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 2, background: "rgba(6,6,10,0.6)" }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 3, color: "#ff2d55", textTransform: "uppercase" as const, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 16, height: 2, background: "#ff2d55", display: "inline-block" }} />
          Featured Game
        </div>
        <div style={{ fontFamily: "var(--font-orbitron), monospace", fontSize: 28, fontWeight: 900, color: "#fff", letterSpacing: 2, lineHeight: 1.2, marginBottom: 10 }}>
          {game.name.toUpperCase()}
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.6, marginBottom: 18 }}>
          {info.desc}
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: "var(--font-orbitron), monospace", fontSize: 16, fontWeight: 700, color: "#ff6b2d" }}>
              {highScore > 0 ? highScore.toLocaleString() : "—"}
            </div>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.25)", letterSpacing: 1, textTransform: "uppercase" as const }}>High Score</div>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-orbitron), monospace", fontSize: 16, fontWeight: 700, color: "#ff6b2d" }}>{info.stat1}</div>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.25)", letterSpacing: 1, textTransform: "uppercase" as const }}>{info.stat1Label}</div>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-orbitron), monospace", fontSize: 16, fontWeight: 700, color: "#ff6b2d" }}>{info.stat2}</div>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.25)", letterSpacing: 1, textTransform: "uppercase" as const }}>{info.stat2Label}</div>
          </div>
        </div>

        <button
          onClick={onLaunch}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6, width: "fit-content",
            padding: "10px 24px", fontSize: 13, fontWeight: 700, letterSpacing: 2,
            background: "linear-gradient(135deg, #ff2d55, #ff6b2d)",
            color: "#fff", border: "none", textTransform: "uppercase" as const,
            clipPath: "polygon(0% 0%, 95% 0%, 100% 30%, 100% 100%, 5% 100%, 0% 70%)",
            cursor: "pointer", fontFamily: "var(--font-rajdhani), sans-serif",
            transition: "filter 0.2s",
          }}
          onMouseEnter={(e) => { (e.target as HTMLElement).style.filter = "brightness(1.15)"; }}
          onMouseLeave={(e) => { (e.target as HTMLElement).style.filter = "brightness(1)"; }}
        >
          ▶ LAUNCH GAME
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create ArcadeGameCard**

Create `src/components/arcade/ArcadeGameCard.tsx`:

```tsx
"use client";

interface Game {
  id: string;
  name: string;
  icon: string;
  category: string;
  categoryColor: string;
  bg: string;
}

interface ArcadeGameCardProps {
  game: Game;
  isFeatured: boolean;
  locked?: boolean;
  onClick: () => void;
  onPlay: () => void;
}

export function ArcadeGameCard({ game, isFeatured, locked, onClick, onPlay }: ArcadeGameCardProps) {
  return (
    <div
      onClick={locked ? undefined : onClick}
      onDoubleClick={locked ? undefined : onPlay}
      style={{
        flex: 1,
        height: 100,
        position: "relative",
        overflow: "hidden",
        border: `1px solid ${isFeatured ? "rgba(255,45,85,0.2)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: 4,
        background: "rgba(255,255,255,0.02)",
        cursor: locked ? "not-allowed" : "pointer",
        opacity: locked ? 0.35 : 1,
        transition: "all 0.3s",
      }}
      onMouseEnter={(e) => {
        if (!locked) (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,45,85,0.3)";
      }}
      onMouseLeave={(e) => {
        if (!locked) (e.currentTarget as HTMLElement).style.borderColor = isFeatured ? "rgba(255,45,85,0.2)" : "rgba(255,255,255,0.06)";
      }}
    >
      {/* Art bg */}
      <div style={{ position: "absolute", inset: 0, background: game.bg }} />

      {/* Icon */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 32, position: "relative", zIndex: 1, filter: locked ? "brightness(0.3)" : "brightness(0.85)" }}>
          {game.icon}
        </span>
      </div>

      {/* Lock overlay */}
      {locked && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3, fontSize: 22 }}>
          🔒
        </div>
      )}

      {/* Gradient overlay */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50%", background: "linear-gradient(0deg, rgba(0,0,0,0.9), transparent)" }} />

      {/* Info */}
      <div style={{ position: "absolute", bottom: 8, left: 10, right: 10, zIndex: 2 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing: 1, fontFamily: "var(--font-rajdhani)" }}>
          {game.name}
        </div>
        {game.category && (
          <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: game.categoryColor, display: "inline-block" }} />
            {game.category}
          </div>
        )}
        {locked && (
          <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
            Find 5 clues to unlock
          </div>
        )}
      </div>

      {/* Featured ribbon */}
      {isFeatured && (
        <div
          style={{
            position: "absolute", top: 6, right: -18,
            background: "#ff2d55", color: "#fff",
            fontSize: 7, fontWeight: 700,
            padding: "2px 24px",
            transform: "rotate(35deg)",
            letterSpacing: 1, zIndex: 4,
          }}
        >
          SELECTED
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/arcade/ArcadeFeatured.tsx src/components/arcade/ArcadeGameCard.tsx
git commit -m "feat: add ArcadeFeatured and ArcadeGameCard components"
```

---

### Task 8: Achievements + Leaderboard Tabs

**Files:**
- Create: `src/components/arcade/ArcadeAchievements.tsx`
- Create: `src/components/arcade/ArcadeLeaderboard.tsx`

- [ ] **Step 1: Create ArcadeAchievements**

Create `src/components/arcade/ArcadeAchievements.tsx`:

```tsx
"use client";

import { useHunt } from "@/context/HuntContext";
import { CLUES, TIER_NAMES } from "@/data/clues";

const GAME_ACHIEVEMENTS = [
  { id: "snake_50", title: "Snek", desc: "Score 50 in Snake", game: "snake" as const, threshold: 50 },
  { id: "snake_100", title: "Serpent", desc: "Score 100 in Snake", game: "snake" as const, threshold: 100 },
  { id: "invaders_10k", title: "Defender", desc: "Score 10,000 in Invaders", game: "invaders" as const, threshold: 10000 },
  { id: "invaders_50k", title: "Earth Shield", desc: "Score 50,000 in Invaders", game: "invaders" as const, threshold: 50000 },
  { id: "breakout_5k", title: "Wall Breaker", desc: "Score 5,000 in Breakout", game: "breakout" as const, threshold: 5000 },
  { id: "pong_win", title: "Champion", desc: "Win a Pong match", game: "pong" as const, threshold: 1 },
];

export function ArcadeAchievements() {
  const { isClueFound, state } = useHunt();

  return (
    <div style={{ padding: "32px 24px", maxWidth: 800, margin: "0 auto" }}>
      <h2 style={{ fontFamily: "var(--font-orbitron), monospace", fontSize: 20, fontWeight: 900, letterSpacing: 2, marginBottom: 24 }}>
        ACHIEVEMENTS
      </h2>

      {/* Cipher fragments */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, color: "#ff2d55", textTransform: "uppercase" as const, marginBottom: 16 }}>
          Cipher Fragments
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
          {CLUES.map((clue) => {
            const found = isClueFound(clue.id);
            return (
              <div
                key={clue.id}
                style={{
                  padding: "12px 14px",
                  background: found ? "rgba(255,45,85,0.06)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${found ? "rgba(255,45,85,0.15)" : "rgba(255,255,255,0.04)"}`,
                  borderRadius: 4,
                  display: "flex", alignItems: "center", gap: 10,
                }}
              >
                <div
                  style={{
                    width: 28, height: 28, borderRadius: 4,
                    background: found ? "rgba(255,45,85,0.15)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${found ? "rgba(255,45,85,0.3)" : "rgba(255,255,255,0.06)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, color: found ? "#ff2d55" : "rgba(255,255,255,0.1)",
                    fontFamily: "var(--font-orbitron), monospace", fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {found ? "✓" : clue.id}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: found ? "#fff" : "rgba(255,255,255,0.2)" }}>
                    {found ? clue.title : "???"}
                  </div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: 1 }}>
                    {TIER_NAMES[clue.tier]}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Game achievements */}
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, color: "#ff6b2d", textTransform: "uppercase" as const, marginBottom: 16 }}>
          Game Milestones
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
          {GAME_ACHIEVEMENTS.map((ach) => {
            const unlocked = state.gameScores[ach.game] >= ach.threshold;
            return (
              <div
                key={ach.id}
                style={{
                  padding: "12px 14px",
                  background: unlocked ? "rgba(255,107,45,0.06)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${unlocked ? "rgba(255,107,45,0.15)" : "rgba(255,255,255,0.04)"}`,
                  borderRadius: 4,
                  display: "flex", alignItems: "center", gap: 10,
                }}
              >
                <div
                  style={{
                    width: 28, height: 28, borderRadius: 4,
                    background: unlocked ? "rgba(255,107,45,0.15)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${unlocked ? "rgba(255,107,45,0.3)" : "rgba(255,255,255,0.06)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, flexShrink: 0,
                  }}
                >
                  {unlocked ? "🏆" : "🔒"}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: unlocked ? "#fff" : "rgba(255,255,255,0.2)" }}>
                    {ach.title}
                  </div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)" }}>
                    {ach.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create ArcadeLeaderboard**

Create `src/components/arcade/ArcadeLeaderboard.tsx`:

```tsx
"use client";

import { useHunt } from "@/context/HuntContext";

const RANK_NAMES = ["Rookie", "Player", "Competitor", "Pro", "Elite", "Master", "Legend"];

export function ArcadeLeaderboard() {
  const { state } = useHunt();
  const games = [
    { key: "invaders" as const, name: "Space Invaders", icon: "👾" },
    { key: "snake" as const, name: "Snake", icon: "🐍" },
    { key: "breakout" as const, name: "Breakout", icon: "🧱" },
    { key: "pong" as const, name: "Pong", icon: "🏓" },
  ];

  const totalScore = Object.values(state.gameScores).reduce((a, b) => a + b, 0);
  const rankIndex = Math.min(Math.floor(totalScore / 5000), RANK_NAMES.length - 1);

  return (
    <div style={{ padding: "32px 24px", maxWidth: 600, margin: "0 auto" }}>
      <h2 style={{ fontFamily: "var(--font-orbitron), monospace", fontSize: 20, fontWeight: 900, letterSpacing: 2, marginBottom: 24 }}>
        LEADERBOARD
      </h2>

      {/* Total score card */}
      <div
        style={{
          padding: 20, marginBottom: 24,
          background: "linear-gradient(135deg, rgba(255,45,85,0.08), rgba(255,107,45,0.05))",
          border: "1px solid rgba(255,45,85,0.12)", borderRadius: 6,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, color: "rgba(255,255,255,0.3)", textTransform: "uppercase" as const }}>
          Combined Score
        </div>
        <div style={{ fontFamily: "var(--font-orbitron), monospace", fontSize: 36, fontWeight: 900, color: "#ff2d55", margin: "8px 0" }}>
          {totalScore.toLocaleString()}
        </div>
        <div style={{ fontSize: 12, color: "#ff6b2d", fontWeight: 700, letterSpacing: 2 }}>
          ◆ {RANK_NAMES[rankIndex]}
        </div>
      </div>

      {/* Per-game scores */}
      {games.map((game, i) => (
        <div
          key={game.key}
          style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "14px 16px", marginBottom: 8,
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.04)",
            borderRadius: 4,
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 900, color: "rgba(255,255,255,0.1)", fontFamily: "var(--font-orbitron), monospace", width: 24 }}>
            {i + 1}
          </div>
          <div style={{ fontSize: 24 }}>{game.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{game.name}</div>
          </div>
          <div style={{ fontFamily: "var(--font-orbitron), monospace", fontSize: 18, fontWeight: 700, color: state.gameScores[game.key] > 0 ? "#ff6b2d" : "rgba(255,255,255,0.1)" }}>
            {state.gameScores[game.key] > 0 ? state.gameScores[game.key].toLocaleString() : "—"}
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/arcade/ArcadeAchievements.tsx src/components/arcade/ArcadeLeaderboard.tsx
git commit -m "feat: add ArcadeAchievements and ArcadeLeaderboard tabs"
```

---

### Task 9: Game Overlay Container

**Files:**
- Create: `src/components/arcade/GameOverlay.tsx`

- [ ] **Step 1: Create GameOverlay**

Create `src/components/arcade/GameOverlay.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import { SnakeGame } from "@/components/games/SnakeGame";
import { InvadersGame } from "@/components/games/InvadersGame";
import { BreakoutGame } from "@/components/games/BreakoutGame";
import { PongGame } from "@/components/games/PongGame";

interface GameOverlayProps {
  gameId: string;
  onClose: () => void;
}

const GAME_NAMES: Record<string, string> = {
  invaders: "SPACE INVADERS",
  snake: "SNAKE",
  breakout: "BREAKOUT",
  pong: "PONG",
  secret: "???",
};

export function GameOverlay({ gameId, onClose }: GameOverlayProps) {
  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9000,
        background: "rgba(0,0,0,0.95)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--font-rajdhani), sans-serif",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          borderBottom: "1px solid rgba(255,45,85,0.1)",
          background: "rgba(6,6,10,0.9)",
          flexShrink: 0,
        }}
      >
        <div style={{ fontFamily: "var(--font-orbitron), monospace", fontSize: 13, fontWeight: 700, letterSpacing: 2, color: "#ff2d55" }}>
          {GAME_NAMES[gameId] ?? gameId.toUpperCase()}
        </div>
        <button
          onClick={onClose}
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 4,
            color: "rgba(255,255,255,0.5)",
            padding: "4px 12px",
            fontSize: 11,
            cursor: "pointer",
            fontFamily: "var(--font-rajdhani)",
            fontWeight: 600,
            letterSpacing: 1,
          }}
        >
          ESC — EXIT
        </button>
      </div>

      {/* Game area */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        {gameId === "snake" && <SnakeGame />}
        {gameId === "invaders" && <InvadersGame />}
        {gameId === "breakout" && <BreakoutGame />}
        {gameId === "pong" && <PongGame />}
        {gameId === "secret" && (
          <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚡</div>
            <div style={{ fontFamily: "var(--font-orbitron), monospace", fontSize: 18, letterSpacing: 3 }}>COMING SOON</div>
            <div style={{ fontSize: 12, marginTop: 8 }}>This game is still being built...</div>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/arcade/GameOverlay.tsx
git commit -m "feat: add GameOverlay container for launching games"
```

---

## Phase 3: Games

### Task 10: Snake Game

**Files:**
- Create: `src/components/games/SnakeGame.tsx`

- [ ] **Step 1: Create Snake game**

Create `src/components/games/SnakeGame.tsx`:

```tsx
"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useHunt } from "@/context/HuntContext";

const CELL = 20;
const COLS = 25;
const ROWS = 25;
const W = COLS * CELL;
const H = ROWS * CELL;
const TICK_MS = 100;

type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Point = { x: number; y: number };

export function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { updateGameScore, unlockClue, canAttemptClue } = useHunt();
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

  const stateRef = useRef({
    snake: [{ x: 12, y: 12 }] as Point[],
    dir: "RIGHT" as Dir,
    nextDir: "RIGHT" as Dir,
    food: { x: 5, y: 5 } as Point,
    score: 0,
    gameOver: false,
  });

  const spawnFood = useCallback((snake: Point[]): Point => {
    let food: Point;
    do {
      food = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
    } while (snake.some((s) => s.x === food.x && s.y === food.y));
    return food;
  }, []);

  const resetGame = useCallback(() => {
    const s = stateRef.current;
    s.snake = [{ x: 12, y: 12 }];
    s.dir = "RIGHT";
    s.nextDir = "RIGHT";
    s.food = spawnFood(s.snake);
    s.score = 0;
    s.gameOver = false;
    setScore(0);
    setGameOver(false);
    setStarted(true);
  }, [spawnFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const handleKey = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (s.gameOver && e.key === " ") { resetGame(); return; }
      if (!started && e.key === " ") { setStarted(true); return; }

      const map: Record<string, Dir> = { ArrowUp: "UP", ArrowDown: "DOWN", ArrowLeft: "LEFT", ArrowRight: "RIGHT" };
      const nd = map[e.key];
      if (!nd) return;
      e.preventDefault();

      const opp: Record<Dir, Dir> = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
      if (nd !== opp[s.dir]) s.nextDir = nd;
    };
    window.addEventListener("keydown", handleKey);

    const interval = setInterval(() => {
      const s = stateRef.current;
      if (s.gameOver || !started) return;

      s.dir = s.nextDir;
      const head = { ...s.snake[0] };
      if (s.dir === "UP") head.y--;
      if (s.dir === "DOWN") head.y++;
      if (s.dir === "LEFT") head.x--;
      if (s.dir === "RIGHT") head.x++;

      // Wall collision
      if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
        s.gameOver = true;
        setGameOver(true);
        updateGameScore("snake", s.score);
        return;
      }

      // Self collision
      if (s.snake.some((seg) => seg.x === head.x && seg.y === head.y)) {
        s.gameOver = true;
        setGameOver(true);
        updateGameScore("snake", s.score);
        return;
      }

      s.snake.unshift(head);

      if (head.x === s.food.x && head.y === s.food.y) {
        s.score++;
        setScore(s.score);
        s.food = spawnFood(s.snake);

        // Clue 6: exact score of 42
        if (s.score === 42 && canAttemptClue(6)) {
          unlockClue(6);
        }
      } else {
        s.snake.pop();
      }
    }, TICK_MS);

    const render = () => {
      const s = stateRef.current;
      ctx.fillStyle = "#0a0a12";
      ctx.fillRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = "rgba(255,45,85,0.04)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x <= COLS; x++) { ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, H); ctx.stroke(); }
      for (let y = 0; y <= ROWS; y++) { ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(W, y * CELL); ctx.stroke(); }

      // Food
      ctx.fillStyle = "#ff2d55";
      ctx.shadowColor = "#ff2d55";
      ctx.shadowBlur = 8;
      ctx.fillRect(s.food.x * CELL + 3, s.food.y * CELL + 3, CELL - 6, CELL - 6);
      ctx.shadowBlur = 0;

      // Snake
      s.snake.forEach((seg, i) => {
        const alpha = 1 - i * 0.02;
        ctx.fillStyle = i === 0 ? "#ff6b2d" : `rgba(255,45,85,${Math.max(0.3, alpha)})`;
        ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
      });

      // Start screen
      if (!started) {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 16px 'Rajdhani', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("PRESS SPACE TO START", W / 2, H / 2);
        ctx.font = "11px 'Rajdhani', sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.fillText("Arrow keys to move", W / 2, H / 2 + 24);
      }

      // Game over
      if (s.gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#ff2d55";
        ctx.font = "bold 20px 'Orbitron', monospace";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", W / 2, H / 2 - 10);
        ctx.fillStyle = "#fff";
        ctx.font = "14px 'Rajdhani', sans-serif";
        ctx.fillText(`Score: ${s.score}`, W / 2, H / 2 + 16);
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.font = "11px 'Rajdhani', sans-serif";
        ctx.fillText("SPACE to restart", W / 2, H / 2 + 40);
      }

      requestAnimationFrame(render);
    };
    const raf = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("keydown", handleKey);
      clearInterval(interval);
      cancelAnimationFrame(raf);
    };
  }, [started, resetGame, spawnFood, updateGameScore, unlockClue, canAttemptClue]);

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ marginBottom: 12, fontFamily: "var(--font-orbitron), monospace", fontSize: 18, fontWeight: 700, color: "#ff6b2d" }}>
        {score}
      </div>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{ border: "1px solid rgba(255,45,85,0.15)", borderRadius: 4 }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/games/SnakeGame.tsx
git commit -m "feat: add Snake game with clue 6 trigger at score 42"
```

---

### Task 11: Space Invaders Game

**Files:**
- Create: `src/components/games/InvadersGame.tsx`

- [ ] **Step 1: Create Space Invaders game**

Create `src/components/games/InvadersGame.tsx`. This is a full canvas implementation with:
- Player ship (bottom, moves left/right, shoots with Space)
- Grid of invaders that move side-to-side and descend
- Invaders shoot back randomly
- Wave system (wave 1-N, getting faster)
- Score tracking
- Clue 12 trigger: at wave 10, invaders arrange in a Morse-like pattern

```tsx
"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useHunt } from "@/context/HuntContext";

const W = 500;
const H = 500;

interface Bullet { x: number; y: number; dy: number; }
interface Invader { x: number; y: number; alive: boolean; type: number; }

export function InvadersGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { updateGameScore, unlockClue, canAttemptClue } = useHunt();
  const [score, setScore] = useState(0);
  const [wave, setWave] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

  const stateRef = useRef({
    playerX: W / 2,
    bullets: [] as Bullet[],
    enemyBullets: [] as Bullet[],
    invaders: [] as Invader[],
    dir: 1,
    speed: 1,
    moveTimer: 0,
    score: 0,
    wave: 1,
    gameOver: false,
    keys: new Set<string>(),
    clue12Shown: false,
  });

  const createWave = useCallback((waveNum: number): Invader[] => {
    const rows = Math.min(3 + Math.floor(waveNum / 3), 6);
    const cols = Math.min(6 + Math.floor(waveNum / 2), 10);
    const invaders: Invader[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        invaders.push({ x: 60 + c * 42, y: 40 + r * 36, alive: true, type: r % 3 });
      }
    }
    return invaders;
  }, []);

  const resetGame = useCallback(() => {
    const s = stateRef.current;
    s.playerX = W / 2;
    s.bullets = [];
    s.enemyBullets = [];
    s.invaders = createWave(1);
    s.dir = 1;
    s.speed = 1;
    s.moveTimer = 0;
    s.score = 0;
    s.wave = 1;
    s.gameOver = false;
    s.clue12Shown = false;
    setScore(0);
    setWave(1);
    setGameOver(false);
    setStarted(true);
  }, [createWave]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const s = stateRef.current;
    if (!started) { s.invaders = createWave(1); }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (s.gameOver && e.key === " ") { resetGame(); return; }
      if (!started && e.key === " ") { setStarted(true); return; }
      s.keys.add(e.key);
      if (["ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault();
    };
    const handleKeyUp = (e: KeyboardEvent) => { s.keys.delete(e.key); };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    let lastShot = 0;
    let frame = 0;

    const loop = () => {
      frame++;
      ctx.fillStyle = "#0a0a12";
      ctx.fillRect(0, 0, W, H);

      if (!started || s.gameOver) {
        // Draw static invaders
        s.invaders.forEach((inv) => {
          if (!inv.alive) return;
          ctx.fillStyle = inv.type === 0 ? "#ff2d55" : inv.type === 1 ? "#ff6b2d" : "#ffaa00";
          ctx.fillRect(inv.x - 10, inv.y - 8, 20, 16);
        });

        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, W, H);
        ctx.textAlign = "center";

        if (s.gameOver) {
          ctx.fillStyle = "#ff2d55";
          ctx.font = "bold 20px 'Orbitron', monospace";
          ctx.fillText("GAME OVER", W / 2, H / 2 - 10);
          ctx.fillStyle = "#fff";
          ctx.font = "14px 'Rajdhani', sans-serif";
          ctx.fillText(`Score: ${s.score} — Wave: ${s.wave}`, W / 2, H / 2 + 16);
          ctx.fillStyle = "rgba(255,255,255,0.4)";
          ctx.font = "11px 'Rajdhani', sans-serif";
          ctx.fillText("SPACE to restart", W / 2, H / 2 + 40);
        } else {
          ctx.fillStyle = "#fff";
          ctx.font = "bold 16px 'Rajdhani', sans-serif";
          ctx.fillText("PRESS SPACE TO START", W / 2, H / 2);
          ctx.font = "11px 'Rajdhani', sans-serif";
          ctx.fillStyle = "rgba(255,255,255,0.4)";
          ctx.fillText("← → to move, SPACE to shoot", W / 2, H / 2 + 24);
        }

        requestAnimationFrame(loop);
        return;
      }

      // Player movement
      if (s.keys.has("ArrowLeft")) s.playerX = Math.max(15, s.playerX - 4);
      if (s.keys.has("ArrowRight")) s.playerX = Math.min(W - 15, s.playerX + 4);

      // Player shooting
      if (s.keys.has(" ") && frame - lastShot > 15) {
        s.bullets.push({ x: s.playerX, y: H - 40, dy: -6 });
        lastShot = frame;
      }

      // Move invaders
      s.moveTimer++;
      const moveInterval = Math.max(10, 40 - s.wave * 3);
      if (s.moveTimer >= moveInterval) {
        s.moveTimer = 0;
        let hitEdge = false;
        s.invaders.forEach((inv) => {
          if (!inv.alive) return;
          inv.x += s.dir * 12;
          if (inv.x > W - 20 || inv.x < 20) hitEdge = true;
        });
        if (hitEdge) {
          s.dir *= -1;
          s.invaders.forEach((inv) => { if (inv.alive) inv.y += 16; });
        }
      }

      // Enemy shooting
      const aliveInvaders = s.invaders.filter((inv) => inv.alive);
      if (frame % Math.max(20, 60 - s.wave * 4) === 0 && aliveInvaders.length > 0) {
        const shooter = aliveInvaders[Math.floor(Math.random() * aliveInvaders.length)];
        s.enemyBullets.push({ x: shooter.x, y: shooter.y + 10, dy: 3 + s.wave * 0.3 });
      }

      // Update bullets
      s.bullets = s.bullets.filter((b) => { b.y += b.dy; return b.y > 0; });
      s.enemyBullets = s.enemyBullets.filter((b) => { b.y += b.dy; return b.y < H; });

      // Bullet-invader collision
      s.bullets = s.bullets.filter((bullet) => {
        for (const inv of s.invaders) {
          if (!inv.alive) continue;
          if (Math.abs(bullet.x - inv.x) < 14 && Math.abs(bullet.y - inv.y) < 12) {
            inv.alive = false;
            s.score += 100;
            setScore(s.score);
            return false;
          }
        }
        return true;
      });

      // Enemy bullet-player collision
      for (const b of s.enemyBullets) {
        if (Math.abs(b.x - s.playerX) < 14 && b.y > H - 48) {
          s.gameOver = true;
          setGameOver(true);
          updateGameScore("invaders", s.score);
          break;
        }
      }

      // Invader reached bottom
      if (aliveInvaders.some((inv) => inv.y > H - 60)) {
        s.gameOver = true;
        setGameOver(true);
        updateGameScore("invaders", s.score);
      }

      // Wave cleared
      if (aliveInvaders.length === 0) {
        s.wave++;
        setWave(s.wave);
        s.invaders = createWave(s.wave);
        s.dir = 1;
        s.bullets = [];
        s.enemyBullets = [];

        // Clue 12: wave 10 reached
        if (s.wave === 10 && canAttemptClue(12) && !s.clue12Shown) {
          s.clue12Shown = true;
          unlockClue(12);
        }
      }

      // Draw invaders
      s.invaders.forEach((inv) => {
        if (!inv.alive) return;
        const colors = ["#ff2d55", "#ff6b2d", "#ffaa00"];
        ctx.fillStyle = colors[inv.type];
        ctx.shadowColor = colors[inv.type];
        ctx.shadowBlur = 4;
        ctx.fillRect(inv.x - 10, inv.y - 8, 20, 16);
        ctx.shadowBlur = 0;
      });

      // Draw player
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.moveTo(s.playerX, H - 40);
      ctx.lineTo(s.playerX - 12, H - 24);
      ctx.lineTo(s.playerX + 12, H - 24);
      ctx.fill();

      // Draw bullets
      ctx.fillStyle = "#00ffaa";
      ctx.shadowColor = "#00ffaa";
      ctx.shadowBlur = 6;
      s.bullets.forEach((b) => ctx.fillRect(b.x - 1.5, b.y, 3, 10));
      ctx.shadowBlur = 0;

      ctx.fillStyle = "#ff2d55";
      ctx.shadowColor = "#ff2d55";
      ctx.shadowBlur = 4;
      s.enemyBullets.forEach((b) => ctx.fillRect(b.x - 1.5, b.y, 3, 8));
      ctx.shadowBlur = 0;

      // HUD
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.font = "10px 'Rajdhani', sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`WAVE ${s.wave}`, 10, 20);

      requestAnimationFrame(loop);
    };

    const raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      cancelAnimationFrame(raf);
    };
  }, [started, resetGame, createWave, updateGameScore, unlockClue, canAttemptClue]);

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ marginBottom: 12, display: "flex", justifyContent: "center", gap: 24, fontFamily: "var(--font-orbitron), monospace" }}>
        <span style={{ fontSize: 18, fontWeight: 700, color: "#ff6b2d" }}>{score.toLocaleString()}</span>
        <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.3)", alignSelf: "center" }}>WAVE {wave}</span>
      </div>
      <canvas ref={canvasRef} width={W} height={H} style={{ border: "1px solid rgba(255,45,85,0.15)", borderRadius: 4 }} />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/games/InvadersGame.tsx
git commit -m "feat: add Space Invaders game with clue 12 trigger at wave 10"
```

---

### Task 12: Breakout Game

**Files:**
- Create: `src/components/games/BreakoutGame.tsx`

- [ ] **Step 1: Create Breakout game**

Create `src/components/games/BreakoutGame.tsx`:

```tsx
"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useHunt } from "@/context/HuntContext";

const W = 500;
const H = 500;
const PADDLE_W = 80;
const PADDLE_H = 12;
const BALL_R = 6;
const BRICK_ROWS = 6;
const BRICK_COLS = 10;
const BRICK_W = 46;
const BRICK_H = 16;
const BRICK_PAD = 3;
const BRICK_TOP = 50;
const BRICK_LEFT = (W - BRICK_COLS * (BRICK_W + BRICK_PAD)) / 2;

interface Brick { x: number; y: number; alive: boolean; color: string; }

const ROW_COLORS = ["#ff2d55", "#ff4d3d", "#ff6b2d", "#ff8c1a", "#ffaa00", "#ffc800"];

export function BreakoutGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { updateGameScore, unlockClue, canAttemptClue } = useHunt();
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

  const stateRef = useRef({
    paddleX: W / 2 - PADDLE_W / 2,
    ballX: W / 2, ballY: H - 60,
    dx: 3, dy: -3,
    bricks: [] as Brick[],
    score: 0,
    gameOver: false,
    won: false,
    keys: new Set<string>(),
  });

  const createBricks = useCallback((): Brick[] => {
    const bricks: Brick[] = [];
    for (let r = 0; r < BRICK_ROWS; r++) {
      for (let c = 0; c < BRICK_COLS; c++) {
        bricks.push({
          x: BRICK_LEFT + c * (BRICK_W + BRICK_PAD),
          y: BRICK_TOP + r * (BRICK_H + BRICK_PAD),
          alive: true,
          color: ROW_COLORS[r],
        });
      }
    }
    return bricks;
  }, []);

  const resetGame = useCallback(() => {
    const s = stateRef.current;
    s.paddleX = W / 2 - PADDLE_W / 2;
    s.ballX = W / 2; s.ballY = H - 60;
    s.dx = 3; s.dy = -3;
    s.bricks = createBricks();
    s.score = 0;
    s.gameOver = false;
    s.won = false;
    setScore(0);
    setGameOver(false);
    setStarted(true);
  }, [createBricks]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const s = stateRef.current;
    if (s.bricks.length === 0) s.bricks = createBricks();

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((s.gameOver || s.won) && e.key === " ") { resetGame(); return; }
      if (!started && e.key === " ") { setStarted(true); return; }
      s.keys.add(e.key);
      if (["ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault();
    };
    const handleKeyUp = (e: KeyboardEvent) => { s.keys.delete(e.key); };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const loop = () => {
      ctx.fillStyle = "#0a0a12";
      ctx.fillRect(0, 0, W, H);

      // Draw bricks
      s.bricks.forEach((b) => {
        if (!b.alive) return;
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 3;
        ctx.fillRect(b.x, b.y, BRICK_W, BRICK_H);
        ctx.shadowBlur = 0;
      });

      if (!started || s.gameOver || s.won) {
        // Draw paddle
        ctx.fillStyle = "#fff";
        ctx.fillRect(s.paddleX, H - 30, PADDLE_W, PADDLE_H);

        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, W, H);
        ctx.textAlign = "center";

        if (s.gameOver) {
          ctx.fillStyle = "#ff2d55";
          ctx.font = "bold 20px 'Orbitron', monospace";
          ctx.fillText("GAME OVER", W / 2, H / 2 - 10);
          ctx.fillStyle = "#fff";
          ctx.font = "14px 'Rajdhani', sans-serif";
          ctx.fillText(`Score: ${s.score}`, W / 2, H / 2 + 16);
          ctx.fillStyle = "rgba(255,255,255,0.4)";
          ctx.font = "11px 'Rajdhani', sans-serif";
          ctx.fillText("SPACE to restart", W / 2, H / 2 + 40);
        } else if (s.won) {
          ctx.fillStyle = "#ffaa00";
          ctx.font = "bold 20px 'Orbitron', monospace";
          ctx.fillText("YOU WIN!", W / 2, H / 2 - 10);
          ctx.fillStyle = "#fff";
          ctx.font = "14px 'Rajdhani', sans-serif";
          ctx.fillText(`Score: ${s.score}`, W / 2, H / 2 + 16);
          ctx.fillStyle = "rgba(255,255,255,0.4)";
          ctx.font = "11px 'Rajdhani', sans-serif";
          ctx.fillText("SPACE to play again", W / 2, H / 2 + 40);
        } else {
          ctx.fillStyle = "#fff";
          ctx.font = "bold 16px 'Rajdhani', sans-serif";
          ctx.fillText("PRESS SPACE TO START", W / 2, H / 2);
          ctx.font = "11px 'Rajdhani', sans-serif";
          ctx.fillStyle = "rgba(255,255,255,0.4)";
          ctx.fillText("← → to move paddle", W / 2, H / 2 + 24);
        }
        requestAnimationFrame(loop);
        return;
      }

      // Paddle movement
      if (s.keys.has("ArrowLeft")) s.paddleX = Math.max(0, s.paddleX - 6);
      if (s.keys.has("ArrowRight")) s.paddleX = Math.min(W - PADDLE_W, s.paddleX + 6);

      // Ball movement
      s.ballX += s.dx;
      s.ballY += s.dy;

      // Wall bounce
      if (s.ballX - BALL_R < 0 || s.ballX + BALL_R > W) s.dx *= -1;
      if (s.ballY - BALL_R < 0) s.dy *= -1;

      // Bottom = game over
      if (s.ballY + BALL_R > H) {
        s.gameOver = true;
        setGameOver(true);
        updateGameScore("breakout", s.score);
        requestAnimationFrame(loop);
        return;
      }

      // Paddle bounce
      if (
        s.ballY + BALL_R >= H - 30 &&
        s.ballY + BALL_R <= H - 30 + PADDLE_H &&
        s.ballX >= s.paddleX &&
        s.ballX <= s.paddleX + PADDLE_W
      ) {
        s.dy = -Math.abs(s.dy);
        const hitPos = (s.ballX - s.paddleX) / PADDLE_W;
        s.dx = (hitPos - 0.5) * 8;
      }

      // Brick collision
      for (const brick of s.bricks) {
        if (!brick.alive) continue;
        if (
          s.ballX + BALL_R > brick.x &&
          s.ballX - BALL_R < brick.x + BRICK_W &&
          s.ballY + BALL_R > brick.y &&
          s.ballY - BALL_R < brick.y + BRICK_H
        ) {
          brick.alive = false;
          s.dy *= -1;
          s.score += 50;
          setScore(s.score);
          break;
        }
      }

      // Win check
      if (s.bricks.every((b) => !b.alive)) {
        s.won = true;
        updateGameScore("breakout", s.score);
        // Clue 9: complete all bricks
        if (canAttemptClue(9)) unlockClue(9);
        requestAnimationFrame(loop);
        return;
      }

      // Draw paddle
      ctx.fillStyle = "#fff";
      ctx.shadowColor = "rgba(255,255,255,0.3)";
      ctx.shadowBlur = 6;
      ctx.fillRect(s.paddleX, H - 30, PADDLE_W, PADDLE_H);
      ctx.shadowBlur = 0;

      // Draw ball
      ctx.fillStyle = "#ff2d55";
      ctx.shadowColor = "#ff2d55";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(s.ballX, s.ballY, BALL_R, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      requestAnimationFrame(loop);
    };

    const raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      cancelAnimationFrame(raf);
    };
  }, [started, resetGame, createBricks, updateGameScore, unlockClue, canAttemptClue]);

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ marginBottom: 12, fontFamily: "var(--font-orbitron), monospace", fontSize: 18, fontWeight: 700, color: "#ff6b2d" }}>
        {score.toLocaleString()}
      </div>
      <canvas ref={canvasRef} width={W} height={H} style={{ border: "1px solid rgba(255,45,85,0.15)", borderRadius: 4 }} />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/games/BreakoutGame.tsx
git commit -m "feat: add Breakout game with clue 9 trigger on win"
```

---

### Task 13: Pong Game

**Files:**
- Create: `src/components/games/PongGame.tsx`

- [ ] **Step 1: Create Pong game**

Create `src/components/games/PongGame.tsx`:

```tsx
"use client";

import { useRef, useEffect, useState } from "react";
import { useHunt } from "@/context/HuntContext";

const W = 500;
const H = 400;
const PADDLE_W = 10;
const PADDLE_H = 70;
const BALL_R = 6;
const WIN_SCORE = 11;

export function PongGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { updateGameScore } = useHunt();
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

  const stateRef = useRef({
    playerY: H / 2 - PADDLE_H / 2,
    aiY: H / 2 - PADDLE_H / 2,
    ballX: W / 2, ballY: H / 2,
    dx: 4, dy: 2,
    pScore: 0, aScore: 0,
    gameOver: false,
    keys: new Set<string>(),
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const s = stateRef.current;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (s.gameOver && e.key === " ") {
        s.playerY = H / 2 - PADDLE_H / 2;
        s.aiY = H / 2 - PADDLE_H / 2;
        s.ballX = W / 2; s.ballY = H / 2;
        s.dx = 4; s.dy = 2;
        s.pScore = 0; s.aScore = 0;
        s.gameOver = false;
        setPlayerScore(0); setAiScore(0); setGameOver(false); setStarted(true);
        return;
      }
      if (!started && e.key === " ") { setStarted(true); return; }
      s.keys.add(e.key);
      if (["ArrowUp", "ArrowDown", "w", "s", " "].includes(e.key)) e.preventDefault();
    };
    const handleKeyUp = (e: KeyboardEvent) => { s.keys.delete(e.key); };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const resetBall = () => {
      s.ballX = W / 2; s.ballY = H / 2;
      s.dx = (Math.random() > 0.5 ? 1 : -1) * 4;
      s.dy = (Math.random() - 0.5) * 4;
    };

    const loop = () => {
      ctx.fillStyle = "#0a0a12";
      ctx.fillRect(0, 0, W, H);

      // Center line
      ctx.setLineDash([4, 6]);
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); ctx.stroke();
      ctx.setLineDash([]);

      if (!started || s.gameOver) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(20, s.playerY, PADDLE_W, PADDLE_H);
        ctx.fillRect(W - 30, s.aiY, PADDLE_W, PADDLE_H);

        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, W, H);
        ctx.textAlign = "center";

        if (s.gameOver) {
          ctx.fillStyle = s.pScore >= WIN_SCORE ? "#00ff88" : "#ff2d55";
          ctx.font = "bold 20px 'Orbitron', monospace";
          ctx.fillText(s.pScore >= WIN_SCORE ? "YOU WIN!" : "YOU LOSE", W / 2, H / 2 - 10);
          ctx.fillStyle = "#fff";
          ctx.font = "14px 'Rajdhani', sans-serif";
          ctx.fillText(`${s.pScore} — ${s.aScore}`, W / 2, H / 2 + 16);
          ctx.fillStyle = "rgba(255,255,255,0.4)";
          ctx.font = "11px 'Rajdhani', sans-serif";
          ctx.fillText("SPACE to restart", W / 2, H / 2 + 40);
        } else {
          ctx.fillStyle = "#fff";
          ctx.font = "bold 16px 'Rajdhani', sans-serif";
          ctx.fillText("PRESS SPACE TO START", W / 2, H / 2);
          ctx.font = "11px 'Rajdhani', sans-serif";
          ctx.fillStyle = "rgba(255,255,255,0.4)";
          ctx.fillText("↑ ↓ to move paddle — First to 11 wins", W / 2, H / 2 + 24);
        }
        requestAnimationFrame(loop);
        return;
      }

      // Player paddle
      if (s.keys.has("ArrowUp") || s.keys.has("w")) s.playerY = Math.max(0, s.playerY - 5);
      if (s.keys.has("ArrowDown") || s.keys.has("s")) s.playerY = Math.min(H - PADDLE_H, s.playerY + 5);

      // AI paddle
      const aiCenter = s.aiY + PADDLE_H / 2;
      const aiSpeed = 3;
      if (aiCenter < s.ballY - 10) s.aiY += aiSpeed;
      if (aiCenter > s.ballY + 10) s.aiY -= aiSpeed;
      s.aiY = Math.max(0, Math.min(H - PADDLE_H, s.aiY));

      // Ball
      s.ballX += s.dx;
      s.ballY += s.dy;

      // Top/bottom bounce
      if (s.ballY - BALL_R < 0 || s.ballY + BALL_R > H) s.dy *= -1;

      // Player paddle hit
      if (s.ballX - BALL_R < 30 && s.ballY > s.playerY && s.ballY < s.playerY + PADDLE_H) {
        s.dx = Math.abs(s.dx) * 1.05;
        s.dy += (s.ballY - (s.playerY + PADDLE_H / 2)) * 0.1;
      }

      // AI paddle hit
      if (s.ballX + BALL_R > W - 30 && s.ballY > s.aiY && s.ballY < s.aiY + PADDLE_H) {
        s.dx = -Math.abs(s.dx) * 1.05;
        s.dy += (s.ballY - (s.aiY + PADDLE_H / 2)) * 0.1;
      }

      // Score
      if (s.ballX < 0) {
        s.aScore++; setAiScore(s.aScore);
        if (s.aScore >= WIN_SCORE) { s.gameOver = true; setGameOver(true); updateGameScore("pong", s.pScore); }
        else resetBall();
      }
      if (s.ballX > W) {
        s.pScore++; setPlayerScore(s.pScore);
        if (s.pScore >= WIN_SCORE) { s.gameOver = true; setGameOver(true); updateGameScore("pong", s.pScore); }
        else resetBall();
      }

      // Draw paddles
      ctx.fillStyle = "#fff";
      ctx.shadowColor = "rgba(255,255,255,0.3)";
      ctx.shadowBlur = 6;
      ctx.fillRect(20, s.playerY, PADDLE_W, PADDLE_H);
      ctx.fillRect(W - 30, s.aiY, PADDLE_W, PADDLE_H);
      ctx.shadowBlur = 0;

      // Draw ball
      ctx.fillStyle = "#ff2d55";
      ctx.shadowColor = "#ff2d55";
      ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.arc(s.ballX, s.ballY, BALL_R, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;

      // Score display
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      ctx.font = "bold 40px 'Orbitron', monospace";
      ctx.textAlign = "center";
      ctx.fillText(String(s.pScore), W / 2 - 50, 50);
      ctx.fillText(String(s.aScore), W / 2 + 50, 50);

      requestAnimationFrame(loop);
    };

    const raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      cancelAnimationFrame(raf);
    };
  }, [started, updateGameScore]);

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ marginBottom: 12, fontFamily: "var(--font-orbitron), monospace", display: "flex", justifyContent: "center", gap: 30 }}>
        <span style={{ fontSize: 18, fontWeight: 700, color: "#00ff88" }}>{playerScore}</span>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", alignSelf: "center" }}>VS</span>
        <span style={{ fontSize: 18, fontWeight: 700, color: "#ff2d55" }}>{aiScore}</span>
      </div>
      <canvas ref={canvasRef} width={W} height={H} style={{ border: "1px solid rgba(255,45,85,0.15)", borderRadius: 4 }} />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/games/PongGame.tsx
git commit -m "feat: add Pong game vs AI"
```

---

## Phase 4: The Void + Hunt Intro

### Task 14: Void Section

**Files:**
- Create: `src/components/void/VoidSection.tsx`

- [ ] **Step 1: Create VoidSection with scroll-triggered text and first clue**

Create `src/components/void/VoidSection.tsx`:

```tsx
"use client";

import { useRef, useEffect, useState } from "react";
import { useHunt } from "@/context/HuntContext";

const VOID_LINES = [
  "You scrolled this far.",
  "Most people stopped at the footer.",
  "Some found the arcade.",
  "You kept going.",
  "Good.",
  "",
  "There are 15 fragments hidden across this site.",
  "In the code. In the games.",
  "In places you haven't looked yet.",
  "",
  "Each fragment is a piece of a cipher.",
  "Decode them all, and you'll find something",
  "meant for very few people.",
  "",
  "Here is your first fragment.",
];

export function VoidSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [clue1Available, setClue1Available] = useState(false);
  const { unlockClue, isClueFound, canAttemptClue } = useHunt();
  const [flickerActive, setFlickerActive] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const lineEls = section.querySelectorAll<HTMLElement>("[data-void-line]");
    const observers: IntersectionObserver[] = [];

    lineEls.forEach((el, i) => {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleLines((prev) => (prev.includes(i) ? prev : [...prev, i]));
            if (i === VOID_LINES.length - 1) setClue1Available(true);
          }
        },
        { threshold: 0.5 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const handleClue1 = () => {
    if (canAttemptClue(1)) {
      unlockClue(1);
    }
  };

  // Clue 2: flickering character — only visible after clue 1
  const handleFlicker = () => {
    if (isClueFound(1) && canAttemptClue(2)) {
      unlockClue(2);
      setFlickerActive(true);
    }
  };

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#000",
        minHeight: "150vh",
        position: "relative",
        padding: "200px 0",
      }}
    >
      {/* Transition gradient from arcade */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 200,
          background: "linear-gradient(180deg, #06060a, #000000)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 24px" }}>
        {VOID_LINES.map((line, i) => (
          <div
            key={i}
            data-void-line
            style={{
              minHeight: line === "" ? 60 : 80,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {line && (
              <p
                style={{
                  fontSize: i === 4 ? 24 : 16,
                  fontWeight: i === 4 ? 700 : 400,
                  color: visibleLines.includes(i) ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0)",
                  textAlign: "center",
                  fontFamily: i === 4 ? "var(--font-orbitron), monospace" : "var(--font-rajdhani), sans-serif",
                  letterSpacing: i === 4 ? 4 : 1,
                  transition: "color 1.2s ease",
                  lineHeight: 1.6,
                }}
              >
                {line}
              </p>
            )}
          </div>
        ))}

        {/* First clue - clickable fragment */}
        {clue1Available && (
          <div
            style={{
              marginTop: 60,
              textAlign: "center",
              animation: "void-pulse 3s ease-in-out infinite",
            }}
          >
            {!isClueFound(1) ? (
              <button
                onClick={handleClue1}
                style={{
                  background: "none",
                  border: "1px solid rgba(255,45,85,0.3)",
                  borderRadius: 6,
                  padding: "16px 32px",
                  cursor: "pointer",
                  color: "#ff2d55",
                  fontFamily: "var(--font-orbitron), monospace",
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: 3,
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.background = "rgba(255,45,85,0.08)";
                  (e.target as HTMLElement).style.boxShadow = "0 0 20px rgba(255,45,85,0.15)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.background = "none";
                  (e.target as HTMLElement).style.boxShadow = "none";
                }}
              >
                ◆ COLLECT FRAGMENT #1
              </button>
            ) : (
              <div>
                <div style={{ color: "#ff2d55", fontSize: 12, fontWeight: 700, letterSpacing: 3, marginBottom: 12, fontFamily: "var(--font-orbitron), monospace" }}>
                  FRAGMENT #1 COLLECTED
                </div>

                {/* Clue 2: flickering text */}
                {!isClueFound(2) && (
                  <p
                    onClick={handleFlicker}
                    style={{
                      color: "rgba(255,255,255,0.08)",
                      fontSize: 13,
                      marginTop: 40,
                      cursor: "pointer",
                      animation: "flicker 4s ease-in-out infinite",
                      fontFamily: "var(--font-mono)",
                      letterSpacing: 2,
                      userSelect: "none",
                    }}
                  >
                    th̷e ico̵ns r̶emem̸ber the̵ or̷der: RDTK
                  </p>
                )}

                {isClueFound(2) && !flickerActive && (
                  <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 13, marginTop: 40, fontFamily: "var(--font-mono)", letterSpacing: 2 }}>
                    The icons remember the order: RDTK
                  </p>
                )}

                {flickerActive && (
                  <div style={{ marginTop: 20 }}>
                    <div style={{ color: "#ff2d55", fontSize: 11, letterSpacing: 3, fontFamily: "var(--font-orbitron), monospace" }}>
                      FRAGMENT #2 COLLECTED
                    </div>
                    <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, marginTop: 8 }}>
                      RDTK — find the orbiting icons in the hero. Click them in this order.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes void-pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        @keyframes flicker {
          0%, 90%, 100% { opacity: 0.08; }
          92% { opacity: 0.4; }
          94% { opacity: 0.05; }
          96% { opacity: 0.35; }
        }
      `}</style>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/void/VoidSection.tsx
git commit -m "feat: add VoidSection with scroll-reveal text, clue 1 and clue 2"
```

---

## Phase 5: Wire Everything Together

### Task 15: Update page.tsx — Integrate All New Sections

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Update page.tsx to include HuntProvider, new sections, and widgets**

Replace the contents of `src/app/page.tsx` with:

```tsx
"use client";

import { useState } from "react";
import { HuntProvider } from "@/context/HuntContext";
import { GradientMesh } from "@/components/GradientMesh";
import { ParticleCanvas } from "@/components/ParticleCanvas";
import { AnimationProvider } from "@/components/AnimationProvider";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { About } from "@/components/About";
import { Projects } from "@/components/Projects";
import { Journey } from "@/components/Journey";
import { Skills } from "@/components/Skills";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Preloader } from "@/components/Preloader";
import { CustomCursor } from "@/components/CustomCursor";
import { FooterTease } from "@/components/FooterTease";
import { ArcadeSection } from "@/components/arcade/ArcadeSection";
import { VoidSection } from "@/components/void/VoidSection";
import { AchievementWidget } from "@/components/hunt/AchievementWidget";
import { ClueToast } from "@/components/hunt/ClueToast";

export default function Home() {
  const [preloaderDone, setPreloaderDone] = useState(false);

  return (
    <HuntProvider>
      <CustomCursor />
      <Preloader onComplete={() => setPreloaderDone(true)} />

      {/* Main content — hidden until preloader completes */}
      <div
        style={{
          opacity: preloaderDone ? 1 : 0,
          transition: "opacity 0.5s ease",
          pointerEvents: preloaderDone ? "auto" : "none",
        }}
      >
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

        {/* Hidden layers — beyond the footer */}
        <FooterTease />
        <ArcadeSection />
        <VoidSection />

        {/* Floating widgets */}
        <AchievementWidget />
        <ClueToast />
      </div>
    </HuntProvider>
  );
}
```

- [ ] **Step 2: Verify the app compiles and loads**

Run: `cd /home/nishanth/Desktop/Personal/Akash/Portfolio/v3 && npx next build 2>&1 | tail -20`

Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: wire up HuntProvider, Arcade, Void, Widget, and Toast into main page"
```

---

## Phase 6: Hidden Terminal + Secret Page

### Task 16: Hidden Terminal (Konami Code)

**Files:**
- Create: `src/components/hunt/HiddenTerminal.tsx`

- [ ] **Step 1: Create the hidden terminal**

Create `src/components/hunt/HiddenTerminal.tsx`:

```tsx
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useHunt } from "@/context/HuntContext";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

export function HiddenTerminal() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<{ cmd: string; response: string }[]>([]);
  const { unlockClue, isClueFound, canAttemptClue, totalFound } = useHunt();
  const konamiRef = useRef<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Konami code listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (open) return;
      konamiRef.current.push(e.key);
      if (konamiRef.current.length > KONAMI.length) konamiRef.current.shift();
      if (konamiRef.current.join(",") === KONAMI.join(",")) {
        setOpen(true);
        if (canAttemptClue(13)) unlockClue(13);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, unlockClue, canAttemptClue]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  // Lock scroll when open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const processCommand = useCallback((cmd: string): string => {
    const lower = cmd.trim().toLowerCase();

    if (lower === "help") return "Commands: help, status, clues, hint, clear, exit";
    if (lower === "status") return `Fragments found: ${totalFound}/15. ${totalFound >= 14 ? "You're almost there." : "Keep searching."}`;
    if (lower === "clues") return `Found: ${totalFound} fragments. ${isClueFound(14) ? "You have the passphrase. Enter it." : "Collect more fragments to progress."}`;
    if (lower === "hint") return "The first letters of each fragment's decoded answer... they spell something.";
    if (lower === "clear") { setHistory([]); return ""; }
    if (lower === "exit") { setOpen(false); return ""; }

    // Clue 14: passphrase entry (placeholder — the actual passphrase would be determined by clue answers)
    if (lower === "curiosity" && canAttemptClue(14)) {
      unlockClue(14);
      return "ACCESS GRANTED. The path is open. Navigate to /secret to claim your reward.";
    }

    // Clue 15 hint
    if (isClueFound(14) && lower === "/secret") {
      if (canAttemptClue(15)) unlockClue(15);
      return "Fragment #15 collected. Open /secret in your browser.";
    }

    return `Unknown command: "${cmd}". Type "help" for available commands.`;
  }, [totalFound, isClueFound, unlockClue, canAttemptClue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const response = processCommand(input);
    if (response) setHistory((prev) => [...prev, { cmd: input, response }]);
    setInput("");
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 99000,
        background: "rgba(0,0,0,0.95)", backdropFilter: "blur(10px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-mono), monospace",
      }}
    >
      <div
        style={{
          width: 600, maxHeight: "70vh",
          background: "#0a0a0f", border: "1px solid rgba(255,45,85,0.2)",
          borderRadius: 6, overflow: "hidden",
          display: "flex", flexDirection: "column",
        }}
      >
        {/* Title bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 14px", borderBottom: "1px solid rgba(255,45,85,0.1)", background: "rgba(255,45,85,0.03)" }}>
          <span style={{ fontSize: 11, color: "#ff2d55", letterSpacing: 2, fontWeight: 700 }}>TERMINAL</span>
          <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 14 }}>✕</button>
        </div>

        {/* Output */}
        <div style={{ flex: 1, overflowY: "auto", padding: 14, fontSize: 12, lineHeight: 1.8 }}>
          <div style={{ color: "rgba(255,255,255,0.3)", marginBottom: 8 }}>
            Hidden terminal activated. Type &quot;help&quot; for commands.
          </div>
          {history.map((entry, i) => (
            <div key={i}>
              <div style={{ color: "#ff2d55" }}>
                <span style={{ color: "rgba(255,255,255,0.2)" }}>$ </span>{entry.cmd}
              </div>
              <div style={{ color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>{entry.response}</div>
            </div>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} style={{ display: "flex", borderTop: "1px solid rgba(255,45,85,0.1)", padding: "8px 14px", alignItems: "center" }}>
          <span style={{ color: "#ff2d55", marginRight: 8, fontSize: 12 }}>$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              flex: 1, background: "none", border: "none", color: "#fff",
              fontSize: 12, fontFamily: "var(--font-mono), monospace",
              outline: "none",
            }}
            autoFocus
          />
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add HiddenTerminal to page.tsx**

In `src/app/page.tsx`, add the import at the top:

```tsx
import { HiddenTerminal } from "@/components/hunt/HiddenTerminal";
```

And add `<HiddenTerminal />` right after `<ClueToast />` (before the closing `</div>` of the content wrapper).

- [ ] **Step 3: Commit**

```bash
git add src/components/hunt/HiddenTerminal.tsx src/app/page.tsx
git commit -m "feat: add HiddenTerminal with Konami code activation and clue 13-15 handling"
```

---

### Task 17: Secret Page (Final Reward)

**Files:**
- Create: `src/app/secret/page.tsx`

- [ ] **Step 1: Create the secret page**

Create `src/app/secret/page.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "akash_hunt";

export default function SecretPage() {
  const [authorized, setAuthorized] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const state = JSON.parse(raw);
        if (Array.isArray(state.cluesFound) && state.cluesFound.includes(15)) {
          setAuthorized(true);
        }
      }
    } catch { /* ignore */ }
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  if (!authorized) {
    return (
      <div
        style={{
          minHeight: "100vh", background: "#000", color: "rgba(255,255,255,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "monospace", fontSize: 14,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>🔒</div>
          <p>This page is not for you.</p>
          <p style={{ marginTop: 8, fontSize: 12, opacity: 0.5 }}>Not yet, anyway.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh", background: "#000", color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "Georgia, 'Times New Roman', serif",
        padding: 40,
      }}
    >
      <div style={{ maxWidth: 500, textAlign: "center" }}>
        <div
          style={{
            fontSize: 14, letterSpacing: 6, color: "#ff2d55",
            marginBottom: 24, fontFamily: "monospace", fontWeight: 700,
          }}
        >
          ALL 15 FRAGMENTS FOUND
        </div>

        <h1 style={{ fontSize: 36, fontWeight: 400, lineHeight: 1.4, marginBottom: 32 }}>
          You found it.
        </h1>

        <div style={{ fontSize: 16, lineHeight: 2, color: "rgba(255,255,255,0.6)", marginBottom: 40 }}>
          <p>Most people scroll. You decoded.</p>
          <p>Most people click. You investigated.</p>
          <p>Most people give up. You solved.</p>
          <p style={{ marginTop: 16, color: "rgba(255,255,255,0.8)" }}>
            That tells me something about you.
          </p>
        </div>

        <div
          style={{
            padding: "24px 32px",
            border: "1px solid rgba(255,45,85,0.2)",
            borderRadius: 8,
            background: "rgba(255,45,85,0.03)",
            marginBottom: 32,
          }}
        >
          <div style={{ fontSize: 12, letterSpacing: 3, color: "#ff2d55", marginBottom: 12, fontFamily: "monospace" }}>
            DIRECT LINE
          </div>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", lineHeight: 1.6 }}>
            I want to meet people like you. Reach me at:
          </p>
          <p style={{ fontSize: 18, color: "#ff2d55", marginTop: 8, fontFamily: "monospace" }}>
            akash@secret.contact
          </p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 8 }}>
            Mention &quot;Fragment 15&quot; so I know you earned this.
          </p>
        </div>

        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.15)", fontFamily: "monospace", letterSpacing: 2 }}>
          Built with curiosity. Solved with persistence.
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/secret/page.tsx
git commit -m "feat: add secret reward page for treasure hunt completion"
```

---

## Phase 7: Easter Egg Clues in Existing Components

### Task 18: Clue 3 — Hero Icon Click Sequence

**Files:**
- Modify: `src/components/Hero.tsx`

- [ ] **Step 1: Read the current Hero component to understand the orbiting icons implementation**

Read `src/components/Hero.tsx` fully.

- [ ] **Step 2: Add click handlers to the orbiting tech icons**

Find the orbiting icons section in Hero.tsx. Add a click tracking mechanism: when icons are clicked in the order R(React) → D(Docker) → T(TypeScript) → K(K8s), unlock clue 3. This requires:

1. Import `useHunt` from the context
2. Add a ref to track click sequence
3. Add onClick handlers to the relevant icons
4. Check if the sequence matches "RDTK" (from clue 2's hint)

The exact implementation depends on how the icons are currently structured — read the file first, then add the minimum changes needed.

- [ ] **Step 3: Commit**

```bash
git add src/components/Hero.tsx
git commit -m "feat: add clue 3 Easter egg — icon click sequence in Hero"
```

---

### Task 19: Clue 4 — Hidden Terminal Field in About

**Files:**
- Modify: `src/components/About.tsx`

- [ ] **Step 1: Read the current About component**

Read `src/components/About.tsx` fully to understand the terminal/profile.json rendering.

- [ ] **Step 2: Add a conditional hidden field**

After clue 3 is found, add an extra line to the profile.json terminal output:
```
"secret": "the marquee whispers"
```

This hints the user toward the Marquee section for clue 5. Use `useHunt().isClueFound(3)` to conditionally render it. When the user clicks this new line, unlock clue 4.

- [ ] **Step 3: Commit**

```bash
git add src/components/About.tsx
git commit -m "feat: add clue 4 Easter egg — hidden terminal field in About"
```

---

### Task 20: Remaining Easter Egg Clues (5, 7, 8, 10)

**Files:**
- Modify: `src/components/Marquee.tsx` (clue 5)
- Modify: `src/components/Journey.tsx` (clue 7)
- Modify: `src/components/Skills.tsx` (clue 8)
- Modify: `src/components/Contact.tsx` (clue 10)

For each component, the pattern is the same:
1. Read the current component
2. Import `useHunt`
3. Add the Easter egg interaction (conditional on prerequisite clue being found)
4. Call `unlockClue(N)` when the interaction completes

- [ ] **Step 1: Clue 5 — Marquee highlighted letters**

Read `src/components/Marquee.tsx`. After clue 4 is found, make specific letters in the marquee items slightly brighter (e.g., opacity 1.0 vs the default 0.6). The bright letters spell a Caesar-shifted word. When the user clicks the last bright letter, unlock clue 5.

- [ ] **Step 2: Clue 7 — Journey year badges**

Read `src/components/Journey.tsx`. After clue 6 is found, make the year badges (Y1, Y2, Y3) clickable in sequence 3-1-2. Clicking in that order reveals a hidden 4th card with a Morse code message and unlocks clue 7.

- [ ] **Step 3: Clue 8 — Skills percentages**

Read `src/components/Skills.tsx`. After clue 7 is found, add a subtle hover effect on the percentage numbers. When all 6 are clicked in order, unlock clue 8.

- [ ] **Step 4: Clue 10 — Contact coordinates**

Read `src/components/Contact.tsx`. After clue 9 is found, the Google Maps iframe src gets slightly different coordinates. Add a hidden element near the map that, when clicked, shows the offset and unlocks clue 10.

- [ ] **Step 5: Commit all Easter eggs**

```bash
git add src/components/Marquee.tsx src/components/Journey.tsx src/components/Skills.tsx src/components/Contact.tsx
git commit -m "feat: add Easter egg clues 5, 7, 8, 10 across portfolio sections"
```

---

### Task 21: Clue 11 — Particle Pattern

**Files:**
- Modify: `src/components/ParticleCanvas.tsx`

- [ ] **Step 1: Read ParticleCanvas.tsx**

Read the current implementation to understand the particle system.

- [ ] **Step 2: Add a particle pattern trigger**

After clue 10 is found, at a specific scroll position (around the Skills section), briefly arrange ~20 particles into a recognizable shape (a simple pattern like a triangle or arrow). The pattern holds for 2 seconds then dissolves. Clicking during the pattern unlocks clue 11.

- [ ] **Step 3: Commit**

```bash
git add src/components/ParticleCanvas.tsx
git commit -m "feat: add clue 11 — particle pattern Easter egg"
```

---

## Phase 8: Final Polish

### Task 22: Build Verification + Bug Fixes

- [ ] **Step 1: Run the build**

```bash
cd /home/nishanth/Desktop/Personal/Akash/Portfolio/v3 && npx next build 2>&1
```

Fix any TypeScript errors, missing imports, or build failures.

- [ ] **Step 2: Run the dev server and manually test**

```bash
cd /home/nishanth/Desktop/Personal/Akash/Portfolio/v3 && npm run dev
```

Verify:
1. Portfolio loads normally
2. Footer tease is visible below footer
3. Scrolling past footer reveals arcade section
4. All 4 games launch and are playable
5. Void section appears below arcade with scroll-triggered text
6. First clue is collectible
7. Achievement widget appears and updates
8. Konami code opens hidden terminal

- [ ] **Step 3: Commit any fixes**

```bash
git add -A && git commit -m "fix: resolve build issues and polish integration"
```

---

### Task 23: Add .superpowers to .gitignore

- [ ] **Step 1: Check if .gitignore exists and update**

```bash
echo ".superpowers/" >> /home/nishanth/Desktop/Personal/Akash/Portfolio/v3/.gitignore
```

- [ ] **Step 2: Commit**

```bash
git add .gitignore
git commit -m "chore: add .superpowers to gitignore"
```
