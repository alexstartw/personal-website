"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { GradientCard } from "@/components/ui/gradient-card";

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

const CARD_GRADIENTS = [
  { from: "#3b82f6", to: "#6366f1" }, // blue → indigo
  { from: "#10b981", to: "#06b6d4" }, // emerald → cyan
  { from: "#f59e0b", to: "#ef4444" }, // amber → red
  { from: "#8b5cf6", to: "#ec4899" }, // violet → pink
];

// Rotating keyword component — Marqeta-style fade+slide swap
function RotatingKeyword({ keywords }: { keywords: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % keywords.length),
      2600,
    );
    return () => clearInterval(id);
  }, [keywords.length]);

  return (
    <div className="h-7 overflow-hidden relative">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          className="absolute inset-0 text-base font-semibold text-[var(--accent)]"
          style={{ fontFamily: "var(--font-display, Georgia, serif)" }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
        >
          {keywords[index]} ↗
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

interface HeroSectionProps {
  onScrollTo: (id: string) => void;
}

export function HeroSection({ onScrollTo }: HeroSectionProps) {
  const { t } = useLanguage();
  const h = t.hero;
  const a = t.about;

  const headlineLines = h.headline.split("\n").filter(Boolean);

  return (
    <section
      id="hero"
      className="relative h-screen snap-start snap-always flex flex-col overflow-hidden"
    >
      {/* ── Main content ──────────────────────────────── */}
      <div className="flex-1 flex flex-col max-w-5xl mx-auto px-6 w-full pt-[3.5rem] min-h-0">
        {/* Meta bar: avatar · name · title chip · badge */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="flex items-center justify-between py-4 border-b border-[var(--border)]/50"
        >
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[var(--border)] shrink-0">
              <Image
                src="/avatar.jpg"
                alt="Alex Lin"
                fill
                className="object-cover object-top"
                priority
              />
            </div>
            <span className="text-sm font-medium text-[var(--foreground)]">
              {h.name}
            </span>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md border border-[var(--border)] bg-[var(--card)] text-[10px] font-mono text-[var(--muted)] tracking-wide">
              {h.title}
            </span>
          </div>
          <span className="flex items-center gap-2 text-[11px] font-mono text-[var(--muted)] tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
            {h.badge}
          </span>
        </motion.div>

        {/* Two-column content */}
        <div className="flex-1 flex flex-col md:flex-row items-center gap-10 md:gap-16 py-5 min-h-0">
          {/* ── LEFT: headline + rotator + CTAs ─────── */}
          <div className="flex flex-col justify-center flex-1 min-w-0">
            {/* Big display headline */}
            <h1
              className="hero-display leading-[0.88] tracking-tight mb-5"
              aria-label={h.headline.replace(/\n/g, " ") + "."}
            >
              {headlineLines.map((line, i) => (
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
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            {/* Specializing in + rotating keyword */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.72 }}
              className="mb-6"
            >
              <p className="text-[11px] font-mono tracking-[0.14em] uppercase text-[var(--muted)] mb-1">
                Specializing in
              </p>
              <RotatingKeyword keywords={h.rotating_keywords} />
            </motion.div>

            {/* CTA links */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.88 }}
              className="flex items-center gap-8"
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

          {/* ── RIGHT: 2×2 gradient skew cards ──────── */}
          <div className="grid grid-cols-2 gap-3 shrink-0">
            {a.stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.55,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.38 + i * 0.1,
                }}
              >
                <GradientCard
                  value={stat.value || undefined}
                  label={stat.label}
                  items={stat.items}
                  gradientFrom={CARD_GRADIENTS[i].from}
                  gradientTo={CARD_GRADIENTS[i].to}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Marquee strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
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
