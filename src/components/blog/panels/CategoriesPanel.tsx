"use client";

import { motion } from "framer-motion";
import { FolderOpen } from "lucide-react";
import type { PostMeta } from "@/lib/posts";

const CAT_COLORS: Record<string, { bg: string; text: string; border: string }> =
  {
    "資料會遇到的大小事": {
      bg: "bg-blue-400/10",
      text: "text-blue-400",
      border: "border-blue-400/20",
    },
    "AI / ML": {
      bg: "bg-violet-400/10",
      text: "text-violet-400",
      border: "border-violet-400/20",
    },
    Backend: {
      bg: "bg-emerald-400/10",
      text: "text-emerald-400",
      border: "border-emerald-400/20",
    },
    Uncategorized: {
      bg: "bg-[var(--border)]",
      text: "text-[var(--muted)]",
      border: "border-[var(--border)]",
    },
  };

function catColor(cat: string) {
  return (
    CAT_COLORS[cat] ?? {
      bg: "bg-orange-400/10",
      text: "text-orange-400",
      border: "border-orange-400/20",
    }
  );
}

export function CategoriesPanel({
  postMetas,
  onSelect,
}: {
  postMetas: PostMeta[];
  onSelect: (category: string) => void;
}) {
  const counts: Record<string, number> = {};
  for (const m of postMetas) {
    const cat = m.categories[0] ?? "Uncategorized";
    counts[cat] = (counts[cat] ?? 0) + 1;
  }
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="h-full overflow-y-auto px-4 py-3">
      <p className="text-[9px] font-mono font-bold tracking-widest uppercase text-[var(--muted)] mb-3">
        Categories · {sorted.length} total
      </p>
      <div className="grid grid-cols-2 gap-2">
        {sorted.map(([cat, count], i) => {
          const { bg, text, border } = catColor(cat);
          return (
            <motion.button
              key={cat}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.18 }}
              onClick={() => onSelect(cat)}
              className={`flex items-center gap-2 p-2.5 rounded-lg border ${bg} ${border} hover:opacity-80 transition-opacity text-left`}
            >
              <FolderOpen className={`w-3.5 h-3.5 shrink-0 ${text}`} />
              <div className="min-w-0">
                <p className={`text-[10px] font-mono font-bold truncate ${text}`}>
                  {cat}
                </p>
                <p className="text-[9px] font-mono text-[var(--muted)] opacity-70">
                  {count} post{count > 1 ? "s" : ""}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
