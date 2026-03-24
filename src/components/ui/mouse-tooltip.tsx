"use client";

import { useState, useRef, useCallback } from "react";
import type { LucideIcon } from "lucide-react";

const MARGIN = 16; // min distance from screen edge

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
  const panelRef = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const panel = panelRef.current;
      const w = panel?.offsetWidth ?? 300;
      const h = panel?.offsetHeight ?? 140;

      let x = e.clientX + 20;
      let y = e.clientY - 14;

      // Flip left if would overflow right edge
      if (x + w + MARGIN > window.innerWidth) {
        x = e.clientX - w - 14;
      }
      // Clamp bottom
      if (y + h + MARGIN > window.innerHeight) {
        y = window.innerHeight - h - MARGIN;
      }
      // Clamp top / left
      if (y < MARGIN) y = MARGIN;
      if (x < MARGIN) x = MARGIN;

      setPos({ x, y });
    });
  }, []);

  return (
    <>
      {/* Trigger — larger hit area */}
      <button
        aria-label={iconLabel}
        className="flex items-center justify-center w-8 h-8 rounded-full border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--foreground)]/40 hover:bg-[var(--card)] transition-all duration-150"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onMouseMove={onMouseMove}
      >
        <Icon size={13} strokeWidth={1.75} />
      </button>

      {/* Floating panel — fixed, follows cursor, clamped to screen */}
      <div
        role="tooltip"
        style={{
          position: "fixed",
          left: pos.x,
          top: pos.y,
          zIndex: 9999,
          opacity: visible ? 1 : 0,
          pointerEvents: "none",
          transition: "opacity 0.15s ease",
          maxWidth: 300,
          width: "max-content",
        }}
      >
        <div
          ref={panelRef}
          className="rounded-xl border border-[var(--border)] bg-[var(--card)]/95 backdrop-blur-md shadow-xl px-4 py-3"
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.14)" }}
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
