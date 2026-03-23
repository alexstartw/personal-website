"use client";

import { RefObject } from "react";
import { useHeadingObserver } from "./hooks/useHeadingObserver";
import { cn } from "@/lib/utils";

export function ArticleOutline({
  containerRef,
  contentKey,
}: {
  containerRef: RefObject<HTMLElement | null>;
  contentKey: string;
}) {
  const { headings, activeId, scrollProgress } = useHeadingObserver(
    containerRef,
    contentKey,
  );

  // Don't occupy space when no post is open
  if (!contentKey) return null;

  const scrollTo = (id: string) => {
    const el = containerRef.current;
    if (!el) return;
    const target = el.querySelector(`#${CSS.escape(id)}`);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <aside className="w-44 shrink-0 border-l border-[var(--border)] bg-[var(--card)] flex-col overflow-hidden hidden lg:flex">
      {/* Scroll progress bar */}
      <div className="h-0.5 bg-[var(--border)] shrink-0">
        <div
          className="h-full bg-[var(--accent)] transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Header */}
      <div className="px-3 py-2 border-b border-[var(--border)] shrink-0">
        <span className="text-[9px] font-mono font-bold tracking-widest uppercase text-[var(--muted)]">
          Outline
        </span>
      </div>

      {/* Heading tree — loading state while extracting */}
      <nav className="flex-1 overflow-y-auto p-2">
        {headings.length === 0 ? (
          <p className="text-[10px] font-mono text-[var(--muted)] opacity-40 px-2 pt-2">
            Loading…
          </p>
        ) : (
          <div className="space-y-0.5">
            {headings.map((h) => {
              const isActive = activeId === h.id;
              return (
                <button
                  key={h.id}
                  onClick={() => scrollTo(h.id)}
                  className={cn(
                    "w-full text-left py-1 text-[10px] font-mono leading-snug transition-colors rounded",
                    h.level === 1 ? "pl-2" : h.level === 2 ? "pl-4" : "pl-6",
                    isActive
                      ? "text-[var(--accent)] font-medium"
                      : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--border)]/50",
                  )}
                >
                  {isActive && (
                    <span className="inline-block w-1 h-1 rounded-full bg-[var(--accent)] mr-1.5 mb-[1px] shrink-0" />
                  )}
                  {h.text.length > 26 ? h.text.slice(0, 26) + "…" : h.text}
                </button>
              );
            })}
          </div>
        )}
      </nav>
    </aside>
  );
}
