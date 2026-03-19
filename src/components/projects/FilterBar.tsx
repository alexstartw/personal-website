"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  categories: string[];
  active: string;
  onChange: (category: string) => void;
}

export function FilterBar({ categories, active, onChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={cn(
            "relative px-4 py-2 text-sm rounded-full transition-colors",
            active === cat
              ? "text-white"
              : "text-[var(--muted)] hover:text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--foreground)]"
          )}
        >
          {active === cat && (
            <motion.span
              layoutId="filter-pill"
              className="absolute inset-0 bg-[var(--accent)] rounded-full"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <span className="relative z-10">{cat}</span>
        </button>
      ))}
    </div>
  );
}
