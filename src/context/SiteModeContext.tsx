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
import { usePathname } from "next/navigation";

export type SiteMode = "engineer" | "photographer";
// 'waiting' = iris fully black, holding until new page has actually mounted
type TransitionPhase = "idle" | "closing" | "waiting" | "opening";

interface SiteModeContextValue {
  mode: SiteMode;
  transitionPhase: TransitionPhase;
  triggerSwitch: (onMidpoint: () => void) => void;
}

const SiteModeContext = createContext<SiteModeContextValue | null>(null);

const STORAGE_KEY = "site-mode";
const CLOSE_DURATION = 650; // ms
const OPEN_DURATION = 650;  // ms

export function SiteModeProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mode, setMode] = useState<SiteMode>("engineer");
  const [transitionPhase, setTransitionPhase] =
    useState<TransitionPhase>("idle");
  const isTransitioning = useRef(false);
  const prevPathname = useRef(pathname);

  // Read persisted mode on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "photographer" || saved === "engineer") {
      setMode(saved);
    }
  }, []);

  // When pathname actually changes, the new page has mounted — start opening
  useEffect(() => {
    if (transitionPhase === "waiting" && pathname !== prevPathname.current) {
      prevPathname.current = pathname;
      setTransitionPhase("opening");
      setTimeout(() => {
        setTransitionPhase("idle");
        isTransitioning.current = false;
      }, OPEN_DURATION);
    } else {
      prevPathname.current = pathname;
    }
  }, [pathname, transitionPhase]);

  const triggerSwitch = useCallback((onMidpoint: () => void) => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;

    setTransitionPhase("closing");

    setTimeout(() => {
      // Screen fully black — navigate + toggle mode, then wait for new page
      onMidpoint();
      setMode((prev) => {
        const next = prev === "engineer" ? "photographer" : "engineer";
        localStorage.setItem(STORAGE_KEY, next);
        return next;
      });
      setTransitionPhase("waiting");
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
