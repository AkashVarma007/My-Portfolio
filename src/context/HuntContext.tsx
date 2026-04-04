"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { CLUES, TOTAL_CLUES } from "@/data/clues";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface GameScores {
  snake: number;
  invaders: number;
  breakout: number;
  pong: number;
}

type GameKey = keyof GameScores;

interface HuntState {
  cluesFound: number[];
  gameScores: GameScores;
  achievements: string[];
}

interface HuntContextValue extends HuntState {
  unlockClue: (id: number) => boolean;
  isClueFound: (id: number) => boolean;
  canAttemptClue: (id: number) => boolean;
  updateGameScore: (game: GameKey, score: number) => void;
  addAchievement: (id: string) => void;
  hasAchievement: (id: string) => boolean;
  totalFound: number;
  totalClues: number;
  currentTier: number;
  clueJustFound: number | null;
  dismissClueToast: () => void;
}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

const DEFAULT_STATE: HuntState = {
  cluesFound: [],
  gameScores: { snake: 0, invaders: 0, breakout: 0, pong: 0 },
  achievements: [],
};

const STORAGE_KEY = "akash_hunt";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function loadFromStorage(): HuntState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<HuntState>;
    return {
      cluesFound: Array.isArray(parsed.cluesFound) ? parsed.cluesFound : [],
      gameScores: {
        snake: parsed.gameScores?.snake ?? 0,
        invaders: parsed.gameScores?.invaders ?? 0,
        breakout: parsed.gameScores?.breakout ?? 0,
        pong: parsed.gameScores?.pong ?? 0,
      },
      achievements: Array.isArray(parsed.achievements) ? parsed.achievements : [],
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function saveToStorage(state: HuntState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // quota exceeded or private browsing — silently ignore
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const HuntContext = createContext<HuntContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function HuntProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<HuntState>(DEFAULT_STATE);
  const [clueJustFound, setClueJustFound] = useState<number | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount (client-only)
  useEffect(() => {
    setState(loadFromStorage());
    setHydrated(true);
  }, []);

  // Persist to localStorage whenever state changes (after hydration)
  useEffect(() => {
    if (hydrated) {
      saveToStorage(state);
    }
  }, [state, hydrated]);

  // ------------------------------------------------------------------
  // Derived values
  // ------------------------------------------------------------------

  const totalFound = state.cluesFound.length;

  const currentTier = state.cluesFound.reduce((max, id) => {
    const clue = CLUES.find((c) => c.id === id);
    return clue ? Math.max(max, clue.tier) : max;
  }, 0);

  // ------------------------------------------------------------------
  // Actions
  // ------------------------------------------------------------------

  const isClueFound = useCallback(
    (id: number): boolean => state.cluesFound.includes(id),
    [state.cluesFound]
  );

  const canAttemptClue = useCallback(
    (id: number): boolean => {
      const clue = CLUES.find((c) => c.id === id);
      if (!clue) return false;
      if (clue.prerequisite === null) return true;
      return state.cluesFound.includes(clue.prerequisite);
    },
    [state.cluesFound]
  );

  const unlockClue = useCallback(
    (id: number): boolean => {
      // Already found
      if (state.cluesFound.includes(id)) return false;

      const clue = CLUES.find((c) => c.id === id);
      if (!clue) return false;

      // Check prerequisite chain
      if (clue.prerequisite !== null && !state.cluesFound.includes(clue.prerequisite)) {
        return false;
      }

      setState((prev) => ({
        ...prev,
        cluesFound: [...prev.cluesFound, id],
      }));
      setClueJustFound(id);
      return true;
    },
    [state.cluesFound]
  );

  const updateGameScore = useCallback((game: GameKey, score: number): void => {
    setState((prev) => {
      if (score <= prev.gameScores[game]) return prev;
      return {
        ...prev,
        gameScores: { ...prev.gameScores, [game]: score },
      };
    });
  }, []);

  const addAchievement = useCallback((id: string): void => {
    setState((prev) => {
      if (prev.achievements.includes(id)) return prev;
      return { ...prev, achievements: [...prev.achievements, id] };
    });
  }, []);

  const hasAchievement = useCallback(
    (id: string): boolean => state.achievements.includes(id),
    [state.achievements]
  );

  const dismissClueToast = useCallback((): void => {
    setClueJustFound(null);
  }, []);

  // ------------------------------------------------------------------
  // Context value
  // ------------------------------------------------------------------

  const value: HuntContextValue = {
    ...state,
    unlockClue,
    isClueFound,
    canAttemptClue,
    updateGameScore,
    addAchievement,
    hasAchievement,
    totalFound,
    totalClues: TOTAL_CLUES,
    currentTier,
    clueJustFound,
    dismissClueToast,
  };

  return <HuntContext.Provider value={value}>{children}</HuntContext.Provider>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useHunt(): HuntContextValue {
  const ctx = useContext(HuntContext);
  if (!ctx) {
    throw new Error("useHunt must be used within a HuntProvider");
  }
  return ctx;
}
