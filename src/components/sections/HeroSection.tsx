"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { PinContainer } from "@/components/ui/3d-pin";

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

// Accent colors per card index for subtle variety
const CARD_ACCENTS = [
  "var(--accent)",
  "#34d399", // emerald
  "#f59e0b", // amber
  "#a78bfa", // violet
];

interface HeroSectionProps {
  onScrollTo: (id: string) => void;
}

export function HeroSection({ onScrollTo }: HeroSectionProps) {
  const { t } = useLanguage();
  const h = t.hero;
  const a = t.about;

  // Split the self-pitch headline by newline for masked word-reveal
  const headlineLines = h.headline.split("\n").filter(Boolean);

  return (
    <section
      id="hero"
      className="relative h-screen snap-start snap-always flex flex-col overflow-hidden"
    >
      {/* ── Main content area ─────────────────────────────── */}
      <div className="flex-1 flex flex-col max-w-5xl mx-auto px-6 w-full pt-[3.5rem] min-h-0">

        {/* ── Meta bar: avatar · name · title chip · badge ── */}
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
            {/* Title chip */}
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md border border-[var(--border)] bg-[var(--card)] text-[10px] font-mono text-[var(--muted)] tracking-wide">
              {h.title}
            </span>
          </div>

          {/* Available badge */}
          <span className="flex items-center gap-2 text-[11px] font-mono text-[var(--muted)] tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
            {h.badge}
          </span>
        </motion.div>

        {/* ── Two-column: headline + cards ───────────────── */}
        <div className="flex-1 flex flex-col md:flex-row items-center gap-8 md:gap-12 py-6 min-h-0">

          {/* ── LEFT: self-pitch headline + CTAs ─────────── */}
          <div className="flex flex-col justify-center flex-1 min-w-0">
            <h1
              className="hero-display leading-[0.88] tracking-tight mb-6"
              aria-label={h.headline.replace(/\n/g, " ")}
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
                    {i === headlineLines.length - 1 && (
                      <em className="not-italic text-[var(--accent)]">.</em>
                    )}
                  </motion.span>
                </span>
              ))}
            </h1>

            {/* Location meta */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex items-center gap-3 mb-5 text-[11px] font-mono tracking-[0.12em] uppercase text-[var(--muted)]"
            >
              <span className="w-6 h-px bg-[var(--border)]" />
              Taipei · Taiwan
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.85 }}
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

          {/* ── RIGHT: 2×2 stat cards with 3D pin ────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-2 gap-3 shrink-0"
          >
            {a.stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.92, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.55,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.35 + i * 0.1,
                }}
              >
                <PinContainer
                  containerClassName="w-[158px] h-[138px]"
                  className="p-0"
                  title={stat.label}
                >
                  <div className="w-[158px] h-[138px] p-4 flex flex-col justify-between">
                    {stat.items ? (
                      /* Industries card */
                      <>
                        <p
                          className="text-[9px] font-mono tracking-widest uppercase mb-2"
                          style={{ color: CARD_ACCENTS[i] }}
                        >
                          {stat.label}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {stat.items.map((item) => (
                            <span
                              key={item}
                              className="text-[9px] px-1.5 py-0.5 rounded border border-[var(--border)] text-[var(--muted)] font-mono leading-tight"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </>
                    ) : (
                      /* Numeric stat card */
                      <>
                        <p
                          className="text-3xl font-bold leading-none tracking-tight"
                          style={{
                            fontFamily: "var(--font-display, Georgia, serif)",
                            color: CARD_ACCENTS[i],
                          }}
                        >
                          {stat.value}
                        </p>
                        <p className="text-[11px] text-[var(--muted)] leading-snug">
                          {stat.label}
                        </p>
                      </>
                    )}
                  </div>
                </PinContainer>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Marquee strip ───────────────────────────────── */}
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
