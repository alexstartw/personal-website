"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const TECH_STACK = [
  "Apache Kafka",
  "dbt",
  "Apache Spark",
  "Airflow",
  "PostgreSQL",
  "Python",
  "Go",
  "GenAI",
  "RAG",
  "Apache Flink",
  "ClickHouse",
  "Kubernetes",
  "dlt",
  "LLM",
  "Terraform",
  "FastAPI",
  "Redis",
];

interface HeroSectionProps {
  onScrollTo: (id: string) => void;
}

export function HeroSection({ onScrollTo }: HeroSectionProps) {
  const { t } = useLanguage();
  const h = t.hero;

  // Each whitespace-separated chunk gets its own masked reveal line
  const titleWords = h.title.split(/\s+/).filter(Boolean);

  return (
    <section
      id="hero"
      className="relative h-screen snap-start snap-always flex flex-col overflow-hidden"
    >
      {/* Main content */}
      <div className="flex-1 flex flex-col max-w-5xl mx-auto px-6 w-full pt-[3.5rem]">
        {/* Avatar stamp + available badge */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex items-center gap-3 py-5"
        >
          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[var(--border)] shrink-0">
            <Image
              src="/avatar.jpg"
              alt="Alex Lin"
              fill
              className="object-cover object-top"
              priority
            />
          </div>
          <span className="flex items-center gap-2 text-[11px] font-mono text-[var(--muted)] tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
            {h.badge}
          </span>
        </motion.div>

        {/* Headline + meta + CTAs — vertically centered in remaining space */}
        <div className="flex-1 flex flex-col justify-center pb-8">
          {/* Display headline: each word slides up from masked overflow */}
          <h1
            className="hero-display leading-[0.88] tracking-tight mb-8 break-words"
            aria-label={h.title}
          >
            {titleWords.map((word, i) => (
              <span key={i} className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{
                    duration: 0.9,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.2 + i * 0.12,
                  }}
                >
                  {word}
                  {i === titleWords.length - 1 && (
                    <em className="not-italic text-[var(--accent)]">.</em>
                  )}
                </motion.span>
              </span>
            ))}
          </h1>

          {/* Meta row: name ── location */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.75 }}
            className="flex items-center gap-4 mb-5 text-[11px] font-mono tracking-[0.12em] uppercase text-[var(--muted)]"
          >
            <span className="shrink-0">{h.name}</span>
            <span className="flex-1 h-px bg-[var(--border)]" />
            <span className="shrink-0">Taipei · TW</span>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="text-sm text-[var(--muted)] leading-relaxed mb-8 max-w-md"
          >
            {h.subtitle}
          </motion.p>

          {/* CTA — text links with arrow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.05 }}
            className="flex items-center gap-10"
          >
            <button
              onClick={() => onScrollTo("projects")}
              className="group flex items-center gap-1.5 text-sm font-medium text-[var(--foreground)] hover:text-[var(--accent)] transition-colors duration-200"
            >
              {h.cta_projects}
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </button>
            <button
              onClick={() => onScrollTo("contact")}
              className="group flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors duration-200"
            >
              {h.cta_contact}
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Marquee strip — pinned to bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        className="shrink-0 border-t border-[var(--border)] overflow-hidden"
        aria-hidden="true"
      >
        <div className="flex py-3 hero-marquee">
          {[...TECH_STACK, ...TECH_STACK].map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-3 px-6 shrink-0 text-[10px] font-mono tracking-[0.15em] uppercase text-[var(--muted)]"
            >
              <span className="text-[var(--accent)] text-[8px]">◆</span>
              {item}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
