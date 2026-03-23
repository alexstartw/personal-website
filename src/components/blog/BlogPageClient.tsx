"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ChevronRight,
  ChevronDown,
  FileText,
  FolderOpen,
  Folder,
  X,
  BookOpen,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PostMeta } from "@/lib/posts";
import { BottomDock, type DockPanel } from "./BottomDock";
import { TimelinePanel } from "./panels/TimelinePanel";
import { CategoriesPanel } from "./panels/CategoriesPanel";
import { TagAnalysisPanel } from "./panels/TagAnalysisPanel";
import { SearchOverlay } from "./SearchOverlay";
import { ArticleOutline } from "./ArticleOutline";

// ── Helpers ───────────────────────────────────────────────────────────────────
function toFileName(slug: string) {
  return slug + ".md";
}

function groupByCategory(metas: PostMeta[]): Record<string, PostMeta[]> {
  const map: Record<string, PostMeta[]> = {};
  for (const m of metas) {
    const cat = m.categories[0] ?? "Uncategorized";
    if (!map[cat]) map[cat] = [];
    map[cat].push(m);
  }
  return map;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ── Sidebar components ────────────────────────────────────────────────────────
function FileItem({
  meta,
  selected,
  onClick,
}: {
  meta: PostMeta;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2 px-2 py-[5px] rounded text-left transition-colors",
        selected
          ? "bg-[var(--accent)]/10 text-[var(--foreground)]"
          : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--border)]/60",
      )}
    >
      <FileText
        className={cn(
          "w-3.5 h-3.5 shrink-0 transition-colors",
          selected ? "text-orange-400" : "opacity-50",
        )}
      />
      <span className="text-[11px] font-mono truncate">
        {toFileName(meta.slug)}
      </span>
    </button>
  );
}

function FolderGroup({
  label,
  items,
  selectedSlug,
  onSelect,
}: {
  label: string;
  items: PostMeta[];
  selectedSlug: string | null;
  onSelect: (meta: PostMeta) => void;
}) {
  const [open, setOpen] = useState(true);
  if (items.length === 0) return null;

  return (
    <div className="space-y-0.5">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-1.5 px-2 py-1 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
      >
        {open ? (
          <>
            <ChevronDown className="w-3 h-3" />
            <FolderOpen className="w-3.5 h-3.5 text-yellow-500" />
          </>
        ) : (
          <>
            <ChevronRight className="w-3 h-3" />
            <Folder className="w-3.5 h-3.5 text-yellow-500/60" />
          </>
        )}
        <span className="text-[10px] font-mono font-bold tracking-widest uppercase">
          {label}
        </span>
        <span className="ml-auto text-[9px] opacity-40 font-mono">
          {items.length}
        </span>
      </button>

      {open && (
        <div className="ml-2.5 border-l border-[var(--border)] pl-2 space-y-0.5">
          {items.map((m) => (
            <FileItem
              key={m.slug}
              meta={m}
              selected={selectedSlug === m.slug}
              onClick={() => onSelect(m)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Tab strip ─────────────────────────────────────────────────────────────────
function TabStrip({
  openTabs,
  activeSlug,
  onActivate,
  onClose,
}: {
  openTabs: string[];
  activeSlug: string | null;
  onActivate: (slug: string) => void;
  onClose: (slug: string) => void;
}) {
  return (
    <div className="flex items-end h-9 px-2 border-b border-[var(--border)] bg-[var(--card)] shrink-0 gap-1 overflow-x-auto">
      {openTabs.map((slug) => {
        const isActive = slug === activeSlug;
        return (
          <div
            key={slug}
            onClick={() => onActivate(slug)}
            className={cn(
              "flex items-center gap-1.5 px-3 h-8 rounded-t text-[11px] font-mono shrink-0 cursor-pointer border border-b-0 border-[var(--border)] transition-colors group",
              isActive
                ? "bg-[var(--background)] text-[var(--foreground)]"
                : "bg-[var(--card)] text-[var(--muted)] hover:text-[var(--foreground)]",
            )}
          >
            <FileText className="w-3 h-3 text-orange-400 shrink-0" />
            <span className="max-w-[120px] truncate">{toFileName(slug)}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose(slug);
              }}
              className="ml-1 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ── Article content (animates inside stable scroll container) ─────────────────
function ArticleContent({
  meta,
  content,
}: {
  meta: PostMeta;
  content: string;
}) {
  return (
    <motion.div
      key={meta.slug}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="p-6 max-w-2xl">
        {/* Post header */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {meta.categories.map((cat) => (
              <span
                key={cat}
                className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-orange-400/30 bg-orange-400/10 text-orange-400 tracking-widest uppercase"
              >
                {cat}
              </span>
            ))}
          </div>
          <h1 className="text-xl font-bold text-[var(--foreground)] leading-snug mb-2">
            {meta.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[11px] font-mono text-[var(--muted)]">
              {formatDate(meta.date)}
            </span>
            {meta.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-1.5 py-0.5 rounded border border-[var(--border)] text-[var(--muted)] font-mono"
              >
                {tag}
              </span>
            ))}
          </div>
          {meta.description && (
            <p className="mt-3 text-[13px] text-[var(--muted)] leading-relaxed border-l-2 border-[var(--accent)]/30 pl-3">
              {meta.description}
            </p>
          )}
        </div>
        <article
          className="prose-blog"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </motion.div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col items-center justify-center text-[var(--muted)] select-none"
    >
      <BookOpen className="w-10 h-10 mb-4 opacity-20" />
      <p className="text-[12px] font-mono opacity-40">
        Select a post from the sidebar
      </p>
    </motion.div>
  );
}

// ── Inner page ────────────────────────────────────────────────────────────────
function BlogPageInner({
  postMetas,
  postContents,
}: {
  postMetas: PostMeta[];
  postContents: Record<string, string>;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const grouped = groupByCategory(postMetas);

  const [openTabs, setOpenTabs] = useState<string[]>([]);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [activeDockPanel, setActiveDockPanel] = useState<DockPanel | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchDefaultQuery, setSearchDefaultQuery] = useState("");

  // Stable scroll container — always mounted, ref never breaks
  const articleScrollRef = useRef<HTMLDivElement>(null);

  // Read ?slug= on mount
  useEffect(() => {
    const slug = searchParams.get("slug");
    if (slug && postMetas.some((m) => m.slug === slug)) {
      setOpenTabs([slug]);
      setActiveSlug(slug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cmd+K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const openPost = (slug: string) => {
    setOpenTabs((prev) => (prev.includes(slug) ? prev : [...prev, slug]));
    setActiveSlug(slug);
    router.replace(`/blog?slug=${encodeURIComponent(slug)}`, { scroll: false });
  };

  const closeTab = (slug: string) => {
    const next = openTabs.filter((s) => s !== slug);
    setOpenTabs(next);
    if (activeSlug === slug) {
      const newActive = next[next.length - 1] ?? null;
      setActiveSlug(newActive);
      if (newActive) {
        router.replace(`/blog?slug=${encodeURIComponent(newActive)}`, { scroll: false });
      } else {
        router.replace("/blog", { scroll: false });
      }
    }
  };

  const activeMeta = postMetas.find((m) => m.slug === activeSlug) ?? null;
  const activeContent = activeSlug ? (postContents[activeSlug] ?? "") : "";

  return (
    <>
      {/* ── Full-height VS Code layout ─────────────────────────────────────── */}
      <div className="h-screen pt-14 flex flex-col bg-[var(--background)] overflow-hidden">

        {/* ── Main area: sidebar + editor ─────────────────────────────────── */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          {/* Left sidebar */}
          <aside className="w-52 shrink-0 border-r border-[var(--border)] bg-[var(--card)] flex flex-col overflow-hidden">
            <div className="px-3 py-2 border-b border-[var(--border)] flex items-center justify-between">
              <span className="text-[9px] font-mono font-bold tracking-widest uppercase text-[var(--muted)]">
                Explorer
              </span>
              <button
                onClick={() => setSearchOpen(true)}
                title="Search (⌘K)"
                className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                <Search className="w-3 h-3" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-1.5 space-y-2">
              {Object.entries(grouped).map(([category, items]) => (
                <FolderGroup
                  key={category}
                  label={category}
                  items={items}
                  selectedSlug={activeSlug}
                  onSelect={(m) => openPost(m.slug)}
                />
              ))}
            </nav>
          </aside>

          {/* Editor column */}
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            <TabStrip
              openTabs={openTabs}
              activeSlug={activeSlug}
              onActivate={(slug) => {
                setActiveSlug(slug);
                router.replace(`/blog?slug=${encodeURIComponent(slug)}`, { scroll: false });
              }}
              onClose={closeTab}
            />

            {/* Article + right outline */}
            <div className="flex-1 flex overflow-hidden min-h-0">
              {/* Stable scroll container — ref always valid */}
              <div
                ref={articleScrollRef}
                className="flex-1 overflow-y-auto"
              >
                <AnimatePresence mode="wait">
                  {activeMeta ? (
                    <ArticleContent
                      key={activeMeta.slug}
                      meta={activeMeta}
                      content={activeContent}
                    />
                  ) : (
                    <EmptyState key="empty" />
                  )}
                </AnimatePresence>
              </div>

              {/* Right outline — only when a post is open */}
              <ArticleOutline
                containerRef={articleScrollRef}
                contentKey={activeSlug ?? ""}
              />
            </div>
          </div>
        </div>

        {/* ── Global bottom panel (full width, outside sidebar+editor) ─────── */}
        <AnimatePresence>
          {activeDockPanel && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 220, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
              className="shrink-0 border-t border-[var(--border)] bg-[var(--card)] overflow-hidden"
            >
              {activeDockPanel === "timeline" && (
                <TimelinePanel
                  postMetas={postMetas}
                  activeSlug={activeSlug}
                  onSelect={openPost}
                />
              )}
              {activeDockPanel === "categories" && (
                <CategoriesPanel
                  postMetas={postMetas}
                  onSelect={() => {}}
                />
              )}
              {activeDockPanel === "tags" && (
                <TagAnalysisPanel
                  postMetas={postMetas}
                  onSelectTag={(tag) => {
                    setSearchDefaultQuery(tag);
                    setSearchOpen(true);
                  }}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Bottom dock toggle bar (full width) ─────────────────────────── */}
        <BottomDock
          active={activeDockPanel}
          onToggle={(panel) =>
            setActiveDockPanel((prev) => (prev === panel ? null : panel))
          }
        />
      </div>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <SearchOverlay
            postMetas={postMetas}
            onSelect={openPost}
            onClose={() => {
              setSearchOpen(false);
              setSearchDefaultQuery("");
            }}
            defaultQuery={searchDefaultQuery}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────
export function BlogPageClient({
  postMetas,
  postContents,
}: {
  postMetas: PostMeta[];
  postContents: Record<string, string>;
}) {
  return (
    <Suspense>
      <BlogPageInner postMetas={postMetas} postContents={postContents} />
    </Suspense>
  );
}
