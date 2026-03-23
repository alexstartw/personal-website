"use client";

import { Clock, FolderTree, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

export type DockPanel = "timeline" | "categories" | "tags";

const PANELS: { id: DockPanel; icon: React.ElementType; label: string }[] = [
  { id: "timeline", icon: Clock, label: "Timeline" },
  { id: "categories", icon: FolderTree, label: "Categories" },
  { id: "tags", icon: BarChart3, label: "Tag Analysis" },
];

export function BottomDock({
  active,
  onToggle,
}: {
  active: DockPanel | null;
  onToggle: (panel: DockPanel) => void;
}) {
  return (
    <div className="shrink-0 flex items-center h-7 border-t border-[var(--border)] bg-[var(--card)] px-2 gap-0.5">
      <span className="text-[9px] font-mono font-bold tracking-widest uppercase text-[var(--muted)] mr-2 opacity-50">
        Panel
      </span>
      {PANELS.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => onToggle(id)}
          title={label}
          className={cn(
            "flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono transition-colors",
            active === id
              ? "bg-[var(--accent)]/15 text-[var(--accent)]"
              : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--border)]",
          )}
        >
          <Icon className="w-3 h-3" />
          {label}
        </button>
      ))}
    </div>
  );
}
