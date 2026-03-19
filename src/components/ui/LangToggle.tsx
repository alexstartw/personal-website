"use client";

import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";

const OPTIONS = [
  { value: "zh", label: "中" },
  { value: "en", label: "EN" },
] as const;

export function LangToggle() {
  const { lang, toggle } = useLanguage();

  return (
    <div className="relative flex items-center h-8 rounded-full border border-[var(--border)] bg-[var(--card)] p-0.5 gap-0.5">
      {/* sliding pill */}
      <motion.span
        layoutId="lang-pill"
        animate={{ x: lang === "zh" ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 400, damping: 32 }}
        className="absolute top-0.5 bottom-0.5 rounded-full bg-[var(--accent)]"
        style={{ width: "calc(50% - 2px)", left: "2px" }}
      />

      {OPTIONS.map(({ value, label }) => (
        <button
          key={value}
          onClick={lang !== value ? toggle : undefined}
          className="relative z-10 w-8 h-7 flex items-center justify-center text-[11px] font-semibold rounded-full transition-colors duration-200 cursor-pointer select-none"
          style={{ color: lang === value ? "white" : "var(--muted)" }}
          aria-label={`Switch to ${value === "zh" ? "Chinese" : "English"}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
