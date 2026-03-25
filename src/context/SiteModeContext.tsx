"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";

export type SiteMode = "engineer" | "photographer";
type TransitionPhase = "idle" | "closing" | "opening";

interface SiteModeContextValue {
  mode: SiteMode;
  transitionPhase: TransitionPhase;
  triggerSwitch: (onMidpoint: () => void) => void;
}

const SiteModeContext = createContext<SiteModeContextValue | null>(null);

const STORAGE_KEY = "site-mode";
const CLOSE_DURATION = 650; // ms — iris closing
const OPEN_DURATION = 650; // ms — iris opening

export function SiteModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<SiteMode>("engineer");
  const [transitionPhase, setTransitionPhase] =
    useState<TransitionPhase>("idle");
  const isTransitioning = useRef(false);

  // Read persisted mode on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "photographer" || saved === "engineer") {
      setMode(saved);
    }
  }, []);

  const triggerSwitch = useCallback((onMidpoint: () => void) => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;

    setTransitionPhase("closing");

    setTimeout(() => {
      // Screen is fully black — navigate + toggle mode
      onMidpoint();
      setMode((prev) => {
        const next = prev === "engineer" ? "photographer" : "engineer";
        localStorage.setItem(STORAGE_KEY, next);
        return next;
      });
      setTransitionPhase("opening");

      setTimeout(() => {
        setTransitionPhase("idle");
        isTransitioning.current = false;
      }, OPEN_DURATION);
    }, CLOSE_DURATION);
  }, []);

  return (
    <SiteModeContext.Provider value={{ mode, transitionPhase, triggerSwitch }}>
      {children}
    </SiteModeContext.Provider>
  );
}

export function useSiteMode() {
  const ctx = useContext(SiteModeContext);
  if (!ctx) throw new Error("useSiteMode must be used within SiteModeProvider");
  return ctx;
}
