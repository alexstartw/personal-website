"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronDown,
  FileCode2,
  FolderOpen,
  Folder,
  Copy,
  Check,
  Github,
  ExternalLink,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { projects } from "@/data/projects";
import { cn } from "@/lib/utils";
import type { Project, ProjectSection } from "@/types";

// ── Helpers ──────────────────────────────────────────────────────────────────
function toFileName(project: Project): string {
  return project.slug + ".tsx";
}

function toConstName(project: Project): string {
  return project.slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

function groupProjects(list: Project[]) {
  const map: Record<string, Project[]> = {};
  for (const p of list) {
    if (!map[p.category]) map[p.category] = [];
    map[p.category].push(p);
  }
  return map;
}

const CATEGORY_COLORS: Record<string, string> = {
  "AI / ML": "text-violet-400",
  "Data Engineering": "text-blue-400",
  Backend: "text-emerald-400",
  Automation: "text-amber-400",
};

function categoryColor(category: string) {
  return CATEGORY_COLORS[category] ?? "text-[var(--accent)]";
}

// ── Sidebar file item ─────────────────────────────────────────────────────────
function FileItem({
  project,
  selected,
  onClick,
}: {
  project: Project;
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
      <FileCode2
        className={cn(
          "w-3.5 h-3.5 shrink-0 transition-colors",
          selected ? categoryColor(project.category) : "opacity-50",
        )}
      />
      <span className="text-[11px] font-mono truncate">
        {toFileName(project)}
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
  items: Project[];
  selectedSlug: string;
  onSelect: (p: Project) => void;
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
          {items.map((p) => (
            <FileItem
              key={p.slug}
              project={p}
              selected={selectedSlug === p.slug}
              onClick={() => onSelect(p)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── TypeScript const code block ───────────────────────────────────────────────
function ConstBlock({ project, lang }: { project: Project; lang: string }) {
  const [copied, setCopied] = useState(false);

  const title =
    lang === "zh" && project.titleZh ? project.titleZh : project.title;
  const desc =
    lang === "zh" && project.descriptionZh
      ? project.descriptionZh
      : project.description;
  const longDesc =
    lang === "zh" && project.longDescriptionZh
      ? project.longDescriptionZh
      : project.longDescription;
  const constName = toConstName(project);

  const plainText = [
    `const ${constName} = {`,
    `  title: "${title}",`,
    `  category: "${project.category}",`,
    `  year: "${project.year}",`,
    ``,
    `  tech: [`,
    ...project.tech.map((t) => `    "${t}",`),
    `  ],`,
    ``,
    `  summary:`,
    `    "${desc}",`,
    ``,
    `  // ${longDesc.slice(0, 80)}...`,
    `} satisfies Project;`,
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
          {toFileName(project)}
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
        <span className="text-violet-400">const </span>
        <span className="text-yellow-300">{constName}</span>
        <span className="text-[var(--muted)]"> = {"{"}</span>
        {"\n"}

        <span className="text-blue-400">{"  title"}</span>
        <span className="text-[var(--muted)]">{": "}</span>
        <span className="text-emerald-400">{`"${title}"`}</span>
        <span className="text-[var(--muted)]">,</span>
        {"\n"}

        <span className="text-blue-400">{"  category"}</span>
        <span className="text-[var(--muted)]">{": "}</span>
        <span className="text-emerald-400">{`"${project.category}"`}</span>
        <span className="text-[var(--muted)]">,</span>
        {"\n"}

        <span className="text-blue-400">{"  year"}</span>
        <span className="text-[var(--muted)]">{": "}</span>
        <span className="text-emerald-400">{`"${project.year}"`}</span>
        <span className="text-[var(--muted)]">,</span>
        {"\n\n"}

        <span className="text-blue-400">{"  tech"}</span>
        <span className="text-[var(--muted)]">{": ["}</span>
        {"\n"}
        {project.tech.map((tag, i) => (
          <span key={tag}>
            <span className="text-emerald-400">{`    "${tag}"`}</span>
            {i < project.tech.length - 1 && (
              <span className="text-[var(--muted)]">,</span>
            )}
            {"\n"}
          </span>
        ))}
        <span className="text-[var(--muted)]">{"  ],"}</span>
        {"\n\n"}

        <span className="text-blue-400">{"  summary"}</span>
        <span className="text-[var(--muted)]">{":"}</span>
        {"\n"}
        <span className="text-[var(--muted)]/60">{"    // "}</span>
        <span className="text-[var(--muted)]">
          {desc.length > 80 ? desc.slice(0, 80) + "…" : desc}
        </span>
        {"\n\n"}

        <span className="text-[var(--muted)]">{"}"}</span>
        <span className="text-[var(--muted)]/60">{" satisfies "}</span>
        <span className="text-yellow-300">Project</span>
        <span className="text-[var(--muted)]">;</span>
      </pre>
    </div>
  );
}

// ── Section block ─────────────────────────────────────────────────────────────
function SectionBlock({
  section,
  index,
  lang,
}: {
  section: ProjectSection;
  index: number;
  lang: string;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-2.5">
        <span className="w-5 h-5 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] text-[9px] font-bold shrink-0">
          {index + 1}
        </span>
        <h3 className="text-[11px] font-semibold text-[var(--foreground)] tracking-wide">
          {section.heading}
        </h3>
      </div>
      <ul className="space-y-1.5 pl-7 mb-2">
        {section.items.map((item, i) => (
          <li
            key={i}
            className="flex gap-2 text-[12px] text-[var(--muted)] leading-relaxed"
          >
            <span className="mt-[6px] w-1 h-1 rounded-full bg-[var(--accent)]/50 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
      {section.benefits && section.benefits.length > 0 && (
        <div className="ml-7 pl-3 border-l-2 border-[var(--accent)]/20 space-y-1">
          <p className="text-[9px] font-bold tracking-widest uppercase text-[var(--accent)]/60 mb-1">
            {lang === "zh" ? "效益" : "Benefits"}
          </p>
          {section.benefits.map((b, i) => (
            <p
              key={i}
              className="text-[11px] text-[var(--accent)]/70 leading-relaxed"
            >
              {b}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Detail panel ──────────────────────────────────────────────────────────────
function DetailPanel({ project, lang }: { project: Project; lang: string }) {
  const title =
    lang === "zh" && project.titleZh ? project.titleZh : project.title;
  const longDesc =
    lang === "zh" && project.longDescriptionZh
      ? project.longDescriptionZh
      : project.longDescription;
  const sections =
    lang === "zh" && project.sectionsZh ? project.sectionsZh : project.sections;

  return (
    <motion.div
      key={project.slug}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
      className="h-full overflow-y-auto"
    >
      <div className="p-6 space-y-6 max-w-xl">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={cn(
                "text-[10px] font-bold px-2.5 py-0.5 rounded-full border tracking-widest uppercase",
                project.category === "AI / ML"
                  ? "bg-violet-400/10 text-violet-400 border-violet-400/20"
                  : project.category === "Data Engineering"
                    ? "bg-blue-400/10 text-blue-400 border-blue-400/20"
                    : project.category === "Backend"
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      : "bg-amber-400/10 text-amber-400 border-amber-400/20",
              )}
            >
              {project.category}
            </span>
            <span className="text-[11px] font-mono text-[var(--muted)]">
              {project.year}
            </span>
          </div>
          <h2 className="text-base font-bold text-[var(--foreground)] leading-snug">
            {title}
          </h2>
        </div>

        {/* Tech stack */}
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase text-[var(--muted)] mb-2">
            {lang === "zh" ? "技術棧" : "Tech Stack"}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {project.tech.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-mono px-2 py-1 rounded-md border border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:border-[var(--accent)]/40 hover:text-[var(--foreground)] transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Overview */}
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase text-[var(--muted)] mb-3">
            {lang === "zh" ? "專案概述" : "Overview"}
          </p>
          <p className="text-[13px] text-[var(--muted)] leading-relaxed">
            {longDesc}
          </p>
        </div>

        {/* Project images */}
        {project.images && project.images.length > 0 && (
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-[var(--muted)] mb-3">
              {lang === "zh" ? "架構圖" : "Architecture"}
            </p>
            <div className="space-y-3">
              {project.images.map((src, i) => (
                <div
                  key={i}
                  className="rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--card)]"
                >
                  <Image
                    src={src}
                    alt={`${title} diagram ${i + 1}`}
                    width={560}
                    height={315}
                    className="w-full h-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rich sections */}
        {sections && sections.length > 0 && (
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-[var(--muted)] mb-4">
              {lang === "zh" ? "架構重點" : "Architecture Highlights"}
            </p>
            {sections.map((section, i) => (
              <SectionBlock key={i} section={section} index={i} lang={lang} />
            ))}
          </div>
        )}

        {/* Links */}
        {(project.links.github || project.links.demo) && (
          <div className="flex gap-2">
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] text-[11px] font-mono text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--foreground)]/40 transition-colors"
              >
                <Github className="w-3 h-3" />
                GitHub
              </a>
            )}
            {project.links.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent)] text-white text-[11px] font-mono hover:opacity-90 transition-opacity"
              >
                <ExternalLink className="w-3 h-3" />
                Live Demo
              </a>
            )}
          </div>
        )}

        {/* Type const */}
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase text-[var(--muted)] mb-2">
            {lang === "zh" ? "型別定義" : "Type Definition"}
          </p>
          <ConstBlock project={project} lang={lang} />
        </div>
      </div>
    </motion.div>
  );
}

// ── Main client component ─────────────────────────────────────────────────────
export function ProjectDetailClient({ slug }: { slug: string }) {
  const { lang } = useLanguage();
  const grouped = groupProjects(projects);
  const initialProject = projects.find((p) => p.slug === slug) ?? projects[0];
  const [selectedSlug, setSelectedSlug] = useState(initialProject.slug);

  const selectedProject =
    projects.find((p) => p.slug === selectedSlug) ?? projects[0];

  return (
    <div className="h-screen pt-14 flex flex-col bg-[var(--background)] overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-52 shrink-0 border-r border-[var(--border)] bg-[var(--card)] flex flex-col overflow-hidden">
          <div className="px-3 py-2 border-b border-[var(--border)]">
            <span className="text-[9px] font-mono font-bold tracking-widest uppercase text-[var(--muted)]">
              Explorer
            </span>
          </div>
          <nav className="flex-1 overflow-y-auto p-1.5 space-y-2">
            {Object.entries(grouped).map(([category, items]) => (
              <FolderGroup
                key={category}
                label={category}
                items={items}
                selectedSlug={selectedSlug}
                onSelect={(p) => setSelectedSlug(p.slug)}
              />
            ))}
          </nav>
        </aside>

        {/* Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tab strip */}
          <div className="flex items-end h-9 px-2 border-b border-[var(--border)] bg-[var(--card)] shrink-0 gap-1">
            <div className="flex items-center gap-2 px-3 h-8 rounded-t text-[11px] font-mono bg-[var(--background)] border border-b-0 border-[var(--border)] text-[var(--foreground)]">
              <FileCode2
                className={cn(
                  "w-3 h-3",
                  categoryColor(selectedProject.category),
                )}
              />
              {toFileName(selectedProject)}
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <DetailPanel
                key={selectedProject.slug}
                project={selectedProject}
                lang={lang}
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
