"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

type FontSize = "sm" | "md" | "lg";

const SIZE_PX: Record<FontSize, number> = { sm: 14, md: 16, lg: 18 };
const STORAGE_KEY = "font-size";

interface FontSizeContextValue {
  fontSize: FontSize;
  increase: () => void;
  decrease: () => void;
  reset: () => void;
}

const FontSizeContext = createContext<FontSizeContextValue | null>(null);

const STEPS: FontSize[] = ["sm", "md", "lg"];

export function FontSizeProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSize] = useState<FontSize>("md");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as FontSize | null;
    if (saved && saved in SIZE_PX) {
      setFontSize(saved);
      document.documentElement.style.fontSize = `${SIZE_PX[saved]}px`;
    }
  }, []);

  const apply = useCallback((size: FontSize) => {
    setFontSize(size);
    document.documentElement.style.fontSize = `${SIZE_PX[size]}px`;
    localStorage.setItem(STORAGE_KEY, size);
  }, []);

  const increase = useCallback(() => {
    setFontSize((prev) => {
      const next = STEPS[Math.min(STEPS.indexOf(prev) + 1, STEPS.length - 1)];
      apply(next);
      return next;
    });
  }, [apply]);

  const decrease = useCallback(() => {
    setFontSize((prev) => {
      const next = STEPS[Math.max(STEPS.indexOf(prev) - 1, 0)];
      apply(next);
      return next;
    });
  }, [apply]);

  const reset = useCallback(() => apply("md"), [apply]);

  return (
    <FontSizeContext.Provider value={{ fontSize, increase, decrease, reset }}>
      {children}
    </FontSizeContext.Provider>
  );
}

export function useFontSize() {
  const ctx = useContext(FontSizeContext);
  if (!ctx) throw new Error("useFontSize must be used within FontSizeProvider");
  return ctx;
}
