"use client";

import { useState, useRef, useCallback } from "react";
import type { LucideIcon } from "lucide-react";

interface MouseTooltipProps {
  content: string;
  icon: LucideIcon;
  iconLabel?: string;
}

export function MouseTooltip({
  content,
  icon: Icon,
  iconLabel = "More info",
}: MouseTooltipProps) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setPos({ x: e.clientX, y: e.clientY });
    });
  }, []);

  return (
    <>
      {/* Trigger icon */}
      <button
        aria-label={iconLabel}
        className="flex items-center justify-center w-6 h-6 rounded-full border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--foreground)]/30 transition-all duration-150"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onMouseMove={onMouseMove}
      >
        <Icon size={11} strokeWidth={1.75} />
      </button>

      {/* Floating panel — fixed, follows cursor */}
      <div
        role="tooltip"
        style={{
          position: "fixed",
          left: pos.x + 18,
          top: pos.y - 12,
          zIndex: 9999,
          opacity: visible ? 1 : 0,
          pointerEvents: "none",
          transition: "opacity 0.15s ease",
          maxWidth: 300,
        }}
      >
        <div
          className="rounded-xl border border-[var(--border)] bg-[var(--card)]/95 backdrop-blur-md shadow-xl px-4 py-3"
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}
        >
          {content.split("\n\n").map((para, i) => (
            <p
              key={i}
              className={`text-xs leading-relaxed text-[var(--muted)] ${i > 0 ? "mt-2.5" : ""}`}
            >
              {para}
            </p>
          ))}
        </div>
      </div>
    </>
  );
}
