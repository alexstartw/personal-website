"use client";

import { motion } from "framer-motion";
import type { PostMeta } from "@/lib/posts";

export function TagAnalysisPanel({
  postMetas,
  onSelectTag,
}: {
  postMetas: PostMeta[];
  onSelectTag: (tag: string) => void;
}) {
  const counts: Record<string, number> = {};
  for (const m of postMetas) {
    for (const t of m.tags) {
      counts[t] = (counts[t] ?? 0) + 1;
    }
  }
  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25);
  const max = sorted[0]?.[1] ?? 1;

  return (
    <div className="h-full overflow-y-auto px-4 py-3">
      <p className="text-[9px] font-mono font-bold tracking-widest uppercase text-[var(--muted)] mb-3">
        Tag Analysis · {sorted.length} tags
      </p>
      <div className="space-y-1.5">
        {sorted.map(([tag, count], i) => (
          <motion.button
            key={tag}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.025, duration: 0.18 }}
            onClick={() => onSelectTag(tag)}
            className="w-full flex items-center gap-2 group"
          >
            <span className="text-[10px] font-mono text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors w-28 text-right truncate shrink-0">
              {tag}
            </span>
            <div className="flex-1 h-3 rounded-sm bg-[var(--border)] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(count / max) * 100}%` }}
                transition={{ delay: i * 0.025 + 0.1, duration: 0.4, ease: "easeOut" }}
                className="h-full rounded-sm bg-[var(--accent)]/60 group-hover:bg-[var(--accent)] transition-colors"
              />
            </div>
            <span className="text-[10px] font-mono text-[var(--muted)] w-5 text-right shrink-0">
              {count}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
