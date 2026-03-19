"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { en, zh, type Locale } from "@/i18n";

type Lang = "en" | "zh";

interface LanguageContextValue {
  lang: Lang;
  t: Locale;
  toggle: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("zh");
  const t = lang === "en" ? en : zh;
  const toggle = () => setLang((prev) => (prev === "en" ? "zh" : "en"));

  return (
    <LanguageContext.Provider value={{ lang, t, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
