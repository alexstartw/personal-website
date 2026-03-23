"use client";

import { useState, useEffect } from "react";
import type { PostMeta } from "@/lib/posts";

export interface SearchMatch {
  meta: PostMeta;
  titleMatch: boolean;
  descMatch: boolean;
  tagMatch: boolean;
}

export function usePostSearch(
  metas: PostMeta[],
  query: string,
): SearchMatch[] {
  const [results, setResults] = useState<SearchMatch[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(() => {
      const q = query.toLowerCase();
      const matched = metas
        .map((m) => ({
          meta: m,
          titleMatch: m.title.toLowerCase().includes(q),
          descMatch: m.description.toLowerCase().includes(q),
          tagMatch: m.tags.some((t) => t.toLowerCase().includes(q)),
        }))
        .filter((r) => r.titleMatch || r.descMatch || r.tagMatch);
      setResults(matched);
    }, 150);
    return () => clearTimeout(timer);
  }, [query, metas]);

  return results;
}

/** Wrap matching substring with <mark> tags */
export function highlight(text: string, query: string): string {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(
    new RegExp(`(${escaped})`, "gi"),
    '<mark class="bg-[var(--accent)]/30 text-[var(--foreground)] rounded-sm px-0.5">$1</mark>',
  );
}
