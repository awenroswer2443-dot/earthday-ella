"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { setMuted } from "@/lib/sounds";

export type ActId =
  | "boot"
  | "act1"
  | "act2"
  | "act3"
  | "act4"
  | "act5"
  | "act6"
  | "act7";

interface State {
  act: ActId;
  visited: Record<ActId, boolean>;
  soundOn: boolean;
  wishes: string[];
  bouquet: string[];
  pledgesSigned: number;
  hydrated: boolean;
}

type Action =
  | { type: "hydrate"; payload: Partial<State> }
  | { type: "go"; payload: ActId }
  | { type: "toggleSound" }
  | { type: "addWish"; payload: string }
  | { type: "addFlower"; payload: string }
  | { type: "resetBouquet" }
  | { type: "pledge" }
  | { type: "reset" };

const initial: State = {
  act: "boot",
  visited: {
    boot: false,
    act1: false,
    act2: false,
    act3: false,
    act4: false,
    act5: false,
    act6: false,
    act7: false,
  },
  soundOn: true,
  wishes: [],
  bouquet: [],
  pledgesSigned: 1243891,
  hydrated: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return { ...state, ...action.payload, hydrated: true };
    case "go":
      return {
        ...state,
        act: action.payload,
        visited: { ...state.visited, [action.payload]: true },
      };
    case "toggleSound":
      return { ...state, soundOn: !state.soundOn };
    case "addWish":
      if (state.wishes.includes(action.payload)) return state;
      return { ...state, wishes: [...state.wishes, action.payload] };
    case "addFlower":
      if (state.bouquet.includes(action.payload)) return state;
      return { ...state, bouquet: [...state.bouquet, action.payload] };
    case "resetBouquet":
      return { ...state, bouquet: [] };
    case "pledge":
      return { ...state, pledgesSigned: state.pledgesSigned + 1 };
    case "reset":
      return { ...initial, hydrated: true, soundOn: state.soundOn };
    default:
      return state;
  }
}

interface GameContextValue {
  state: State;
  act: ActId;
  soundOn: boolean;
  wishes: string[];
  bouquet: string[];
  pledgesSigned: number;
  hydrated: boolean;
  go: (act: ActId) => void;
  toggleSound: () => void;
  addWish: (w: string) => void;
  addFlower: (id: string) => void;
  resetBouquet: () => void;
  pledge: () => void;
  reset: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

const STORAGE_KEY = "earthday-ella.v1";

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<State>;
        dispatch({ type: "hydrate", payload: parsed });
        setMuted(!(parsed.soundOn ?? true));
      } else {
        dispatch({ type: "hydrate", payload: {} });
      }
    } catch {
      dispatch({ type: "hydrate", payload: {} });
    }
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    try {
      const { hydrated: _h, ...persist } = state;
      void _h;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persist));
    } catch {
      /* ignore */
    }
    setMuted(!state.soundOn);
  }, [state]);

  const go = useCallback((act: ActId) => dispatch({ type: "go", payload: act }), []);
  const toggleSound = useCallback(() => dispatch({ type: "toggleSound" }), []);
  const addWish = useCallback(
    (w: string) => dispatch({ type: "addWish", payload: w }),
    []
  );
  const addFlower = useCallback(
    (id: string) => dispatch({ type: "addFlower", payload: id }),
    []
  );
  const resetBouquet = useCallback(() => dispatch({ type: "resetBouquet" }), []);
  const pledge = useCallback(() => dispatch({ type: "pledge" }), []);
  const reset = useCallback(() => dispatch({ type: "reset" }), []);

  const value = useMemo<GameContextValue>(
    () => ({
      state,
      act: state.act,
      soundOn: state.soundOn,
      wishes: state.wishes,
      bouquet: state.bouquet,
      pledgesSigned: state.pledgesSigned,
      hydrated: state.hydrated,
      go,
      toggleSound,
      addWish,
      addFlower,
      resetBouquet,
      pledge,
      reset,
    }),
    [state, go, toggleSound, addWish, addFlower, resetBouquet, pledge, reset]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
}
