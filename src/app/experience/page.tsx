"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  ChevronRight,
  ChevronDown,
  FileCode2,
  FolderOpen,
  Folder,
  Copy,
  Check,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { timeline } from "@/data/timeline";
import { cn } from "@/lib/utils";
import type { TimelineEvent, ExperienceSection } from "@/types";

// ── Helpers ──────────────────────────────────────────────────────────────────
function toFileName(event: TimelineEvent): string {
  return (
    event.title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-") + ".tsx"
  );
}

function toInterfaceName(event: TimelineEvent): string {
  return event.title
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

function groupEvents(events: TimelineEvent[]) {
  return {
    current: events.filter((e) => e.year.includes("Present")),
    previous: events.filter(
      (e) => e.type === "work" && !e.year.includes("Present"),
    ),
    education: events.filter((e) => e.type === "education"),
  };
}

function typeAccent(event: TimelineEvent) {
  if (event.freelance) return "text-emerald-500";
  if (event.type === "work") return "text-[var(--accent)]";
  return "text-purple-400";
}

// ── Sidebar file tree ─────────────────────────────────────────────────────────
function FileItem({
  event,
  selected,
  lang,
  onClick,
}: {
  event: TimelineEvent;
  selected: boolean;
  lang: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2 px-2 py-[5px] rounded text-left transition-colors group",
        selected
          ? "bg-[var(--accent)]/10 text-[var(--foreground)]"
          : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--border)]/60",
      )}
    >
      <FileCode2
        className={cn(
          "w-3.5 h-3.5 shrink-0 transition-colors",
          selected ? typeAccent(event) : "opacity-50",
        )}
      />
      <span className="text-[11px] font-mono truncate">
        {toFileName(event)}
      </span>
    </button>
  );
}

function FolderGroup({
  label,
  events,
  selectedId,
  lang,
  onSelect,
  defaultOpen = true,
}: {
  label: string;
  events: TimelineEvent[];
  selectedId: string;
  lang: string;
  onSelect: (e: TimelineEvent) => void;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  if (events.length === 0) return null;

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
          {events.length}
        </span>
      </button>

      {open && (
        <div className="ml-2.5 border-l border-[var(--border)] pl-2 space-y-0.5">
          {events.map((ev) => (
            <FileItem
              key={ev.id}
              event={ev}
              selected={selectedId === ev.id}
              lang={lang}
              onClick={() => onSelect(ev)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── TypeScript interface code block ───────────────────────────────────────────
function InterfaceBlock({
  event,
  lang,
}: {
  event: TimelineEvent;
  lang: string;
}) {
  const [copied, setCopied] = useState(false);

  const name = toInterfaceName(event);
  const company =
    lang === "zh" && event.companyZh ? event.companyZh : event.company;
  const descs = (
    lang === "zh" && event.descriptionZh
      ? event.descriptionZh
      : event.description
  ).slice(0, 3);
  const [start, end] = event.year.split("–").map((s) => s.trim());
  const type = event.freelance
    ? "Freelance"
    : event.type === "work"
      ? "Full-time"
      : "Education";

  const plainText = [
    `interface ${name} {`,
    `  company: "${company}"`,
    `  type: "${type}"`,
    `  period: "${start} → ${end || "Present"}"`,
    ``,
    `  stack: [`,
    ...event.tags.map((t) => `    "${t}",`),
    `  ]`,
    ``,
    `  achievements: [`,
    ...descs.map((d) => `    // ${d}`),
    `  ]`,
    `}`,
  ].join("\n");

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(plainText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [plainText]);

  return (
    <div className="rounded-lg border border-[var(--border)] overflow-hidden text-[12px] font-mono">
      {/* Titlebar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[var(--card)] border-b border-[var(--border)]">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400/50" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/50" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400/50" />
        </div>
        <span className="ml-2 text-[var(--muted)] text-[10px]">
          {toFileName(event)}
        </span>
        <button
          onClick={handleCopy}
          className="ml-auto flex items-center gap-1 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-green-400" />
              <span className="text-[10px]">copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span className="text-[10px]">copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <pre className="p-4 bg-[var(--background)] overflow-x-auto leading-[1.75]">
        {/* interface Name { */}
        <span className="text-violet-400">interface </span>
        <span className="text-yellow-300">{name}</span>
        <span className="text-[var(--foreground)]">{" {"}</span>
        {"\n"}

        {/* company */}
        <span className="text-blue-400">{"  company"}</span>
        <span className="text-[var(--muted)]">{": "}</span>
        <span className="text-emerald-400">{`"${company}"`}</span>
        {"\n"}

        {/* type */}
        <span className="text-blue-400">{"  type"}</span>
        <span className="text-[var(--muted)]">{": "}</span>
        <span className="text-emerald-400">{`"${type}"`}</span>
        {"\n"}

        {/* period */}
        <span className="text-blue-400">{"  period"}</span>
        <span className="text-[var(--muted)]">{": "}</span>
        <span className="text-emerald-400">{`"${start} → ${end || "Present"}"`}</span>
        {"\n\n"}

        {/* stack */}
        <span className="text-blue-400">{"  stack"}</span>
        <span className="text-[var(--muted)]">{"  : ["}</span>
        {"\n"}
        {event.tags.map((tag, i) => (
          <span key={tag}>
            <span className="text-emerald-400">{`    "${tag}"`}</span>
            {i < event.tags.length - 1 && (
              <span className="text-[var(--muted)]">,</span>
            )}
            {"\n"}
          </span>
        ))}
        <span className="text-[var(--muted)]">{"  ]"}</span>
        {"\n\n"}

        {/* achievements */}
        <span className="text-blue-400">{"  impact"}</span>
        <span className="text-[var(--muted)]">{"  : ["}</span>
        {"\n"}
        {descs.map((d, i) => (
          <span key={i}>
            <span className="text-[var(--muted)]/60">{"    // "}</span>
            <span className="text-[var(--muted)]">
              {d.length > 70 ? d.slice(0, 70) + "…" : d}
            </span>
            {"\n"}
          </span>
        ))}
        <span className="text-[var(--muted)]">{"  ]"}</span>
        {"\n"}

        <span className="text-[var(--foreground)]">{"}"}</span>
      </pre>
    </div>
  );
}

// ── Rich section block ────────────────────────────────────────────────────────
function RichSection({
  section,
  index,
}: {
  section: ExperienceSection;
  index: number;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-5 h-5 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] text-[9px] font-bold shrink-0">
          {index + 1}
        </span>
        <h3 className="text-[11px] font-semibold text-[var(--foreground)] tracking-wide">
          {section.heading}
        </h3>
      </div>
      <ul className="space-y-2.5 pl-7">
        {section.items.map((item, i) => {
          const colonIdx = item.indexOf("：");
          const hasLabel = colonIdx !== -1;
          const label = hasLabel ? item.slice(0, colonIdx) : null;
          const body = hasLabel ? item.slice(colonIdx + 1) : item;
          return (
            <li key={i} className="flex gap-2 text-[13px] leading-relaxed">
              <span className="mt-[7px] w-1 h-1 rounded-full bg-[var(--accent)]/50 shrink-0" />
              <span className="text-[var(--muted)]">
                {label && (
                  <span className="font-semibold text-[var(--foreground)]">
                    {label}：
                  </span>
                )}
                {body}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ── Detail panel ──────────────────────────────────────────────────────────────
function DetailPanel({ event, lang }: { event: TimelineEvent; lang: string }) {
  const title = lang === "zh" && event.titleZh ? event.titleZh : event.title;
  const company =
    lang === "zh" && event.companyZh ? event.companyZh : event.company;
  const richSections =
    lang === "zh" && event.sectionsZh
      ? event.sectionsZh
      : lang === "en" && event.sections
        ? event.sections
        : null;
  const flatDescs =
    lang === "zh" && event.descriptionZh
      ? event.descriptionZh
      : event.description;
  const [start, end] = event.year.split("–").map((s) => s.trim());

  const badgeBase =
    "text-[10px] font-bold px-2.5 py-0.5 rounded-full border tracking-widest uppercase";
  const typeBadge = event.freelance
    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
    : event.type === "work"
      ? "bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/20"
      : "bg-purple-400/10 text-purple-400 border-purple-400/20";

  return (
    <motion.div
      key={event.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
      className="h-full overflow-y-auto"
    >
      <div className="p-6 space-y-6 max-w-xl">
        {/* Header */}
        <div className="flex items-start gap-4">
          {event.logo && (
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-[var(--border)] flex items-center justify-center shrink-0 shadow-sm">
              <Image
                src={event.logo}
                alt={company}
                width={40}
                height={40}
                className="object-contain w-full h-full p-1"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-[var(--foreground)] leading-snug">
              {title}
            </h2>
            <p className="text-sm text-[var(--muted)] mt-0.5">{company}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className={cn(badgeBase, typeBadge)}>
                {event.freelance
                  ? lang === "zh"
                    ? "副業"
                    : "Freelance"
                  : event.type === "work"
                    ? lang === "zh"
                      ? "工作"
                      : "Work"
                    : lang === "zh"
                      ? "學歷"
                      : "Edu"}
              </span>
              {event.year.includes("Present") && (
                <span
                  className={cn(
                    badgeBase,
                    "bg-green-500/10 text-green-500 border-green-500/20",
                  )}
                >
                  {lang === "zh" ? "目前" : "Current"}
                </span>
              )}
              <span className="text-[11px] font-mono text-[var(--muted)]">
                {start} → {end || (lang === "zh" ? "至今" : "Present")}
              </span>
            </div>
          </div>
        </div>

        {/* Stack */}
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase text-[var(--muted)] mb-2">
            {lang === "zh" ? "技術棧" : "Stack"}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {event.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-mono px-2 py-1 rounded-md border border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:border-[var(--accent)]/40 hover:text-[var(--foreground)] transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Content: rich sections or flat list */}
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase text-[var(--muted)] mb-3">
            {lang === "zh" ? "職責與成就" : "Responsibilities & Achievements"}
          </p>
          {richSections ? (
            <div>
              {richSections.map((section, i) => (
                <RichSection
                  key={section.heading}
                  section={section}
                  index={i}
                />
              ))}
            </div>
          ) : (
            <ul className="space-y-2.5">
              {flatDescs.map((line, i) => (
                <li
                  key={i}
                  className="flex gap-2.5 text-[13px] text-[var(--muted)] leading-relaxed"
                >
                  <span className="mt-[7px] w-1 h-1 rounded-full bg-[var(--accent)] shrink-0" />
                  {line}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Type interface */}
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase text-[var(--muted)] mb-2">
            {lang === "zh" ? "型別定義" : "Type Definition"}
          </p>
          <InterfaceBlock event={event} lang={lang} />
        </div>
      </div>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ExperiencePage() {
  const { lang } = useLanguage();
  const searchParams = useSearchParams();
  const groups = groupEvents(timeline);
  const [selectedId, setSelectedId] = useState(timeline[0].id);

  // Pre-select from ?id= query param (set when navigating from home timeline cards)
  useEffect(() => {
    const id = searchParams.get("id");
    if (id && timeline.some((e) => e.id === id)) setSelectedId(id);
  }, [searchParams]);

  const selectedEvent =
    timeline.find((e) => e.id === selectedId) ?? timeline[0];

  return (
    // pt-14 offsets the global fixed Navbar (h-14)
    <div className="h-screen pt-14 flex flex-col bg-[var(--background)] overflow-hidden">
      {/* Layout: sidebar + editor */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-52 shrink-0 border-r border-[var(--border)] bg-[var(--card)] flex flex-col overflow-hidden">
          <div className="px-3 py-2 border-b border-[var(--border)]">
            <span className="text-[9px] font-mono font-bold tracking-widest uppercase text-[var(--muted)]">
              Explorer
            </span>
          </div>
          <nav className="flex-1 overflow-y-auto p-1.5 space-y-2">
            <FolderGroup
              label="current"
              events={groups.current}
              selectedId={selectedId}
              lang={lang}
              onSelect={(e) => setSelectedId(e.id)}
              defaultOpen={true}
            />
            <FolderGroup
              label="work"
              events={groups.previous}
              selectedId={selectedId}
              lang={lang}
              onSelect={(e) => setSelectedId(e.id)}
              defaultOpen={true}
            />
            <FolderGroup
              label="education"
              events={groups.education}
              selectedId={selectedId}
              lang={lang}
              onSelect={(e) => setSelectedId(e.id)}
              defaultOpen={true}
            />
          </nav>
        </aside>

        {/* Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tab strip */}
          <div className="flex items-end h-9 px-2 border-b border-[var(--border)] bg-[var(--card)] shrink-0 gap-1">
            <div className="flex items-center gap-2 px-3 h-8 rounded-t text-[11px] font-mono bg-[var(--background)] border border-b-0 border-[var(--border)] text-[var(--foreground)]">
              <FileCode2 className={cn("w-3 h-3", typeAccent(selectedEvent))} />
              {toFileName(selectedEvent)}
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <DetailPanel
                key={selectedEvent.id}
                event={selectedEvent}
                lang={lang}
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
