"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, FileText } from "lucide-react";
import { usePostSearch, highlight } from "./hooks/usePostSearch";
import type { PostMeta } from "@/lib/posts";
import { cn } from "@/lib/utils";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function SearchOverlay({
  postMetas,
  onSelect,
  onClose,
  defaultQuery = "",
}: {
  postMetas: PostMeta[];
  onSelect: (slug: string) => void;
  onClose: () => void;
  defaultQuery?: string;
}) {
  const [query, setQuery] = useState(defaultQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const results = usePostSearch(postMetas, query);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSelect = (slug: string) => {
    onSelect(slug);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -8 }}
        transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full max-w-xl bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
          <Search className="w-4 h-4 text-[var(--muted)] shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts…"
            className="flex-1 bg-transparent text-[13px] font-mono text-[var(--foreground)] placeholder:text-[var(--muted)] outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <kbd className="text-[9px] font-mono text-[var(--muted)] border border-[var(--border)] rounded px-1.5 py-0.5">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto">
          {!query.trim() ? (
            <p className="text-[11px] font-mono text-[var(--muted)] text-center py-8 opacity-50">
              Type to search across titles, descriptions and tags
            </p>
          ) : results.length === 0 ? (
            <p className="text-[11px] font-mono text-[var(--muted)] text-center py-8 opacity-50">
              No results for &ldquo;{query}&rdquo;
            </p>
          ) : (
            <ul>
              {results.map(({ meta, titleMatch, tagMatch }) => (
                <li key={meta.slug}>
                  <button
                    onClick={() => handleSelect(meta.slug)}
                    className="w-full flex items-start gap-3 px-4 py-3 hover:bg-[var(--border)]/50 transition-colors text-left border-b border-[var(--border)] last:border-0"
                  >
                    <FileText className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[12px] font-mono text-[var(--foreground)] leading-snug mb-0.5"
                        dangerouslySetInnerHTML={{
                          __html: titleMatch
                            ? highlight(meta.title, query)
                            : meta.title,
                        }}
                      />
                      {meta.description && (
                        <p
                          className="text-[11px] text-[var(--muted)] leading-relaxed line-clamp-1"
                          dangerouslySetInnerHTML={{
                            __html: highlight(meta.description, query),
                          }}
                        />
                      )}
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[9px] font-mono text-[var(--muted)] opacity-60">
                          {formatDate(meta.date)}
                        </span>
                        {meta.tags
                          .filter((t) =>
                            tagMatch
                              ? t.toLowerCase().includes(query.toLowerCase())
                              : true,
                          )
                          .slice(0, 4)
                          .map((t) => (
                            <span
                              key={t}
                              className={cn(
                                "text-[9px] font-mono px-1.5 py-0.5 rounded border border-[var(--border)]",
                                tagMatch &&
                                  t.toLowerCase().includes(query.toLowerCase())
                                  ? "text-[var(--accent)] border-[var(--accent)]/30 bg-[var(--accent)]/10"
                                  : "text-[var(--muted)]",
                              )}
                            >
                              {t}
                            </span>
                          ))}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2 border-t border-[var(--border)] flex items-center gap-3">
          <span className="text-[9px] font-mono text-[var(--muted)] opacity-50">
            {results.length > 0
              ? `${results.length} result${results.length > 1 ? "s" : ""}`
              : ""}
          </span>
          <span className="ml-auto text-[9px] font-mono text-[var(--muted)] opacity-50">
            ↵ to open
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
