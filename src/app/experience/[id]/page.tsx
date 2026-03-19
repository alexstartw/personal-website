"use client";

import { use } from "react";
import { notFound, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { timeline } from "@/data/timeline";
import { useLanguage } from "@/context/LanguageContext";
import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/utils";
import type { ExperienceSection } from "@/types";

const TYPE_COLORS = {
  work: "border-[var(--accent)] text-[var(--accent)]",
  education: "border-[var(--border)] text-[var(--muted)]",
};

interface Props {
  params: Promise<{ id: string }>;
}

// ── Flat bullet list (fallback) ───────────────────────────────────────────────
function BulletList({
  items,
  baseDelay,
}: {
  items: string[];
  baseDelay: number;
}) {
  return (
    <ul className="space-y-4">
      {items.map((line, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: baseDelay + i * 0.06 }}
          className="flex gap-4 text-[var(--foreground)] leading-relaxed"
        >
          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
          {line}
        </motion.li>
      ))}
    </ul>
  );
}

// ── Rich sections view ────────────────────────────────────────────────────────
function SectionBlock({
  section,
  index,
}: {
  section: ExperienceSection;
  index: number;
}) {
  const blockDelay = 0.35 + index * 0.1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: blockDelay }}
      className="mb-10"
    >
      {/* Section heading */}
      <div className="flex items-center gap-3 mb-5">
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] text-xs font-bold">
          {index + 1}
        </span>
        <h2 className="text-base font-semibold text-[var(--foreground)]">
          {section.heading}
        </h2>
      </div>

      {/* Bullets */}
      <ul className="space-y-4 pl-9">
        {section.items.map((item, i) => {
          // Split "標題：內容" pattern for visual emphasis
          const colonIdx = item.indexOf("：");
          const hasLabel = colonIdx !== -1;
          const label = hasLabel ? item.slice(0, colonIdx) : null;
          const body = hasLabel ? item.slice(colonIdx + 1) : item;

          return (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.38,
                delay: blockDelay + 0.08 + i * 0.05,
              }}
              className="flex gap-3 leading-relaxed"
            >
              <span className="mt-2 w-1 h-1 rounded-full bg-[var(--accent)]/60 shrink-0" />
              <span className="text-sm text-[var(--foreground)]">
                {label && (
                  <span className="font-semibold text-[var(--foreground)]">
                    {label}：
                  </span>
                )}
                <span className="text-[var(--muted)]">{body}</span>
              </span>
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ExperienceDetailPage({ params }: Props) {
  const { id } = use(params);
  const { lang } = useLanguage();
  const router = useRouter();

  const event = timeline.find((e) => e.id === id);
  if (!event) notFound();

  const title = lang === "zh" && event.titleZh ? event.titleZh : event.title;
  const company =
    lang === "zh" && event.companyZh ? event.companyZh : event.company;

  // Prefer rich sections if available for current lang
  const richSections =
    lang === "zh" && event.sectionsZh
      ? event.sectionsZh
      : lang === "en" && event.sections
        ? event.sections
        : null;

  const flatDescriptions =
    lang === "zh" && event.descriptionZh
      ? event.descriptionZh
      : event.description;

  // Prev / Next navigation
  const currentIndex = timeline.findIndex((e) => e.id === id);
  const prev = currentIndex > 0 ? timeline[currentIndex - 1] : null;
  const next =
    currentIndex < timeline.length - 1 ? timeline[currentIndex + 1] : null;
  const prevTitle = prev
    ? lang === "zh" && prev.titleZh
      ? prev.titleZh
      : prev.title
    : null;
  const nextTitle = next
    ? lang === "zh" && next.titleZh
      ? next.titleZh
      : next.title
    : null;

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        {/* Back */}
        <motion.button
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-12 group"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="group-hover:-translate-x-1 transition-transform"
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          {lang === "zh" ? "返回" : "Back"}
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-4">
            {event.logo ? (
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white flex items-center justify-center p-1 border border-[var(--border)]">
                <Image
                  src={event.logo}
                  alt={event.company}
                  width={40}
                  height={40}
                  className="object-contain w-full h-full"
                />
              </div>
            ) : (
              <span
                className={cn(
                  "inline-flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-bold",
                  TYPE_COLORS[event.type],
                )}
              >
                {event.type === "work" ? "W" : "E"}
              </span>
            )}
            <span className="text-sm text-[var(--muted)]">{event.year}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--foreground)] mb-3">
            {title}
          </h1>
          <p className="text-xl text-[var(--accent)] font-medium mb-8">
            {company}
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="h-px bg-gradient-to-r from-[var(--accent)] to-transparent origin-left mb-10"
        />

        {/* Content: sections or flat list */}
        {richSections ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.32 }}
          >
            {richSections.map((section, i) => (
              <SectionBlock key={section.heading} section={section} index={i} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <h2 className="text-xs font-semibold tracking-widest uppercase text-[var(--muted)] mb-5">
              {lang === "zh" ? "職責與成就" : "Responsibilities & Achievements"}
            </h2>
            <BulletList items={flatDescriptions} baseDelay={0.4} />
          </motion.div>
        )}

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="mt-10 pt-8 border-t border-[var(--border)]"
        >
          <h2 className="text-xs font-semibold tracking-widest uppercase text-[var(--muted)] mb-4">
            {lang === "zh" ? "技術棧" : "Technologies"}
          </h2>
          <div className="flex flex-wrap gap-2">
            {event.tags.map((tag) => (
              <Tag key={tag} variant="accent">
                {tag}
              </Tag>
            ))}
          </div>
        </motion.div>

        {/* Prev / Next */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-10 pt-8 border-t border-[var(--border)] grid grid-cols-2 gap-4"
        >
          {prev ? (
            <button
              onClick={() => router.push(`/experience/${prev.id}`)}
              className="flex flex-col gap-1 p-4 rounded-xl border border-[var(--border)] hover:border-[var(--accent)]/40 hover:bg-[var(--card)] transition-all text-left group"
            >
              <span className="text-xs text-[var(--muted)] flex items-center gap-1">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:-translate-x-0.5 transition-transform"
                >
                  <path d="M19 12H5M12 5l-7 7 7 7" />
                </svg>
                {lang === "zh" ? "上一個" : "Previous"}
              </span>
              <span className="text-sm font-medium text-[var(--foreground)] truncate">
                {prevTitle}
              </span>
            </button>
          ) : (
            <div />
          )}

          {next ? (
            <button
              onClick={() => router.push(`/experience/${next.id}`)}
              className="flex flex-col gap-1 p-4 rounded-xl border border-[var(--border)] hover:border-[var(--accent)]/40 hover:bg-[var(--card)] transition-all text-right group col-start-2"
            >
              <span className="text-xs text-[var(--muted)] flex items-center gap-1 justify-end">
                {lang === "zh" ? "下一個" : "Next"}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:translate-x-0.5 transition-transform"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
              <span className="text-sm font-medium text-[var(--foreground)] truncate">
                {nextTitle}
              </span>
            </button>
          ) : (
            <div />
          )}
        </motion.div>
      </div>
    </div>
  );
}
