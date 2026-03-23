"use client";

import { motion } from "framer-motion";

const SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "posts", label: "Writing" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

interface SectionDotsProps {
  activeSection: string;
  onDotClick: (id: string) => void;
}

export function SectionDots({ activeSection, onDotClick }: SectionDotsProps) {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3 hidden md:flex">
      {SECTIONS.map((s) => {
        const isActive = activeSection === s.id;
        return (
          <button
            key={s.id}
            onClick={() => onDotClick(s.id)}
            aria-label={`Go to ${s.label}`}
            className="group relative flex items-center justify-end gap-2"
          >
            {/* label tooltip */}
            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-[var(--muted)] whitespace-nowrap pointer-events-none">
              {s.label}
            </span>
            {/* dot */}
            <motion.span
              animate={{
                width: isActive ? 20 : 6,
                backgroundColor: isActive ? "var(--accent)" : "var(--border)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="block h-1.5 rounded-full"
            />
          </button>
        );
      })}
    </div>
  );
}
