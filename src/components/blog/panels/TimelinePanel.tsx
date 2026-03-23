"use client";

import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import type { PostMeta } from "@/lib/posts";
import { cn } from "@/lib/utils";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("zh-TW", {
    month: "short",
    day: "numeric",
  });
}

function groupByMonth(metas: PostMeta[]): Record<string, PostMeta[]> {
  const map: Record<string, PostMeta[]> = {};
  for (const m of metas) {
    const d = new Date(m.date);
    const key = `${d.getFullYear()} / ${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!map[key]) map[key] = [];
    map[key].push(m);
  }
  return map;
}

export function TimelinePanel({
  postMetas,
  activeSlug,
  onSelect,
}: {
  postMetas: PostMeta[];
  activeSlug: string | null;
  onSelect: (slug: string) => void;
}) {
  const groups = groupByMonth(postMetas);

  return (
    <div className="h-full overflow-y-auto px-4 py-3">
      <p className="text-[9px] font-mono font-bold tracking-widest uppercase text-[var(--muted)] mb-3">
        Publication Timeline · {postMetas.length} posts
      </p>
      <div className="space-y-4">
        {Object.entries(groups).map(([month, posts], gi) => (
          <motion.div
            key={month}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: gi * 0.04, duration: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono font-bold text-[var(--accent)] tracking-widest">
                {month}
              </span>
              <div className="flex-1 h-px bg-[var(--border)]" />
              <span className="text-[9px] font-mono text-[var(--muted)] opacity-60">
                {posts.length}
              </span>
            </div>
            <div className="ml-2 border-l border-[var(--border)] pl-3 space-y-1">
              {posts.map((p) => (
                <button
                  key={p.slug}
                  onClick={() => onSelect(p.slug)}
                  className={cn(
                    "w-full flex items-start gap-2 py-1 rounded text-left transition-colors group",
                    activeSlug === p.slug
                      ? "text-[var(--foreground)]"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]",
                  )}
                >
                  <span className="mt-[5px] w-1.5 h-1.5 rounded-full bg-[var(--border)] group-hover:bg-[var(--accent)] shrink-0 transition-colors" />
                  <span className="flex-1 text-[11px] font-mono leading-snug truncate">
                    {p.title}
                  </span>
                  <span className="text-[9px] font-mono text-[var(--muted)] opacity-60 shrink-0 mt-0.5">
                    {formatDate(p.date)}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
