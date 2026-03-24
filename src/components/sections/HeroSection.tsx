"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { StatCard } from "@/components/ui/stat-card";
import { MouseTooltip } from "@/components/ui/mouse-tooltip";
import { Clock, Globe, TrendingUp, Sparkles, Info } from "lucide-react";

const TECH_STACK = [
  "Apache Kafka",
  "dbt",
  "Airflow",
  "PostgreSQL",
  "Python",
  "C#",
  "GenAI",
  "RAG",
  "ClickHouse",
  "LLM",
  "FastAPI",
  "Redis",
  "Docker",
  "AWS",
  "Snowflake",
  "Grafana",
];

const STAT_ICONS = [Clock, Globe, TrendingUp, Sparkles];
const STAT_ACCENTS = ["#6366f1", "#06b6d4", "#ef4444", "#ec4899"];
const SCRAMBLE_CHARS = "!<>-_\\/[]{}=+*^?#@|~";

// ── TextScramble ───────────────────────────────────────────────────────────────
class TextScramble {
  private el: HTMLElement;
  private queue: Array<{
    from: string;
    to: string;
    start: number;
    end: number;
    char?: string;
  }> = [];
  private frame = 0;
  private frameRequest = 0;
  private resolve: () => void = () => {};

  constructor(el: HTMLElement) {
    this.el = el;
    this.update = this.update.bind(this);
  }

  setText(newText: string): Promise<void> {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise<void>((r) => (this.resolve = r));
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || "";
      const to = newText[i] || "";
      const start = Math.floor(Math.random() * 20);
      const end = start + Math.floor(Math.random() * 20);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  private update() {
    let output = "";
    let complete = 0;
    for (const item of this.queue) {
      if (this.frame >= item.end) {
        complete++;
        output += item.to;
      } else if (this.frame >= item.start) {
        if (!item.char || Math.random() < 0.28) {
          item.char =
            SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
        output += `<span style="color:var(--accent);opacity:0.5">${item.char}</span>`;
      } else {
        output += item.from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
}

// ── ScrambledHeroHeadline ─────────────────────────────────────────────────────
// Each phrase is split into lines; one TextScramble instance per line element.
function ScrambledHeroHeadline({ phrases }: { phrases: string[] }) {
  // Split all phrases into per-line arrays
  const splitPhrases = phrases.map((p) => p.split("\n").filter(Boolean));
  const lineCount = Math.max(...splitPhrases.map((p) => p.length));

  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const scramblers = useRef<(TextScramble | null)[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    scramblers.current = lineRefs.current.map((el) =>
      el ? new TextScramble(el) : null,
    );
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    let counter = 0;

    const next = () => {
      if (cancelled) return;
      const lines = splitPhrases[counter];
      const promises = scramblers.current.map((s, i) =>
        s ? s.setText(lines[i] ?? "") : Promise.resolve(),
      );
      Promise.all(promises).then(() => {
        if (!cancelled) setTimeout(next, 3200);
      });
      counter = (counter + 1) % splitPhrases.length;
    };

    next();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  return (
    <h1
      className="hero-display leading-[0.88] tracking-tight mb-5"
      aria-label={phrases[0].replace(/\n/g, " ")}
    >
      {Array.from({ length: lineCount }).map((_, i) => (
        <span key={i} className="block">
          <span
            ref={(el) => {
              lineRefs.current[i] = el;
            }}
          >
            {splitPhrases[0][i] ?? ""}
          </span>
        </span>
      ))}
    </h1>
  );
}

// ── RotatingKeyword ───────────────────────────────────────────────────────────
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

// ── HeroSection ───────────────────────────────────────────────────────────────
interface HeroSectionProps {
  onScrollTo: (id: string) => void;
}

export function HeroSection({ onScrollTo }: HeroSectionProps) {
  const { t } = useLanguage();
  const h = t.hero;
  const a = t.about;

  const bioContent = [a.bio1, a.bio2].join("\n\n");

  return (
    <section
      id="hero"
      className="relative h-screen snap-start snap-always flex flex-col overflow-hidden"
    >
      {/* ── Main content ──────────────────────────────── */}
      <div className="flex-1 flex flex-col max-w-5xl mx-auto px-6 w-full pt-[3.5rem] min-h-0">
        {/* Meta bar */}
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
            <ScrambledHeroHeadline phrases={h.headlines} />

            {/* Specializing in + rotating keyword */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
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
              transition={{ duration: 0.6, delay: 0.65 }}
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

          {/* ── RIGHT: 2×2 stat cards + info tooltip ── */}
          <div className="shrink-0 flex flex-col items-end gap-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.38,
              }}
              className="border border-[var(--border)] rounded-xl overflow-hidden grid grid-cols-2 w-[320px]"
            >
              {a.stats.map((stat, i) => (
                <StatCard
                  key={stat.label}
                  value={stat.value || undefined}
                  label={stat.label}
                  items={stat.items}
                  icon={STAT_ICONS[i]}
                  accentColor={STAT_ACCENTS[i]}
                  borderRight={i % 2 === 0}
                  borderBottom={i < 2}
                />
              ))}
            </motion.div>

            {/* Info tooltip trigger */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              <MouseTooltip
                content={bioContent}
                icon={Info}
                iconLabel="About me"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Marquee strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.0 }}
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
