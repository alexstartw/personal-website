"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { FadeIn } from "@/components/ui/FadeIn";
import { SkillsRainBg } from "@/components/ui/skills-rain-bg";
import { skills } from "@/data/skills";

// ── TextScramble ──────────────────────────────────────────────────────────────
class TextScramble {
  private el: HTMLElement;
  private chars = "!<>-_\\/[]{}=+*^?#@|~";
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
      const start = Math.floor(Math.random() * 25);
      const end = start + Math.floor(Math.random() * 25);
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
    for (let i = 0; i < this.queue.length; i++) {
      const item = this.queue[i];
      if (this.frame >= item.end) {
        complete++;
        output += item.to;
      } else if (this.frame >= item.start) {
        if (!item.char || Math.random() < 0.28) {
          item.char = this.chars[Math.floor(Math.random() * this.chars.length)];
        }
        output += `<span style="color:var(--accent);opacity:0.65">${item.char}</span>`;
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

// ── ScrambledHeading ──────────────────────────────────────────────────────────
function ScrambledHeading({ phrases }: { phrases: string[] }) {
  const elRef = useRef<HTMLHeadingElement>(null);
  const scramblerRef = useRef<TextScramble | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (elRef.current && !scramblerRef.current) {
      scramblerRef.current = new TextScramble(elRef.current);
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready || !scramblerRef.current) return;
    let cancelled = false;
    let counter = 0;

    const next = () => {
      if (cancelled || !scramblerRef.current) return;
      scramblerRef.current.setText(phrases[counter]).then(() => {
        if (!cancelled) setTimeout(next, 2400);
      });
      counter = (counter + 1) % phrases.length;
    };

    next();
    return () => {
      cancelled = true;
    };
  }, [ready, phrases]);

  return (
    <h2
      ref={elRef}
      className="text-3xl md:text-4xl font-bold font-mono tracking-tight min-h-[1.2em]"
    >
      {phrases[0]}
    </h2>
  );
}

// ── Category config ───────────────────────────────────────────────────────────
const CATEGORY_ORDER = ["backend", "data", "cloud", "tools"] as const;

const CATEGORY_STYLE = {
  backend: {
    label: "text-[var(--accent)]",
    prompt: "text-[var(--accent)]/80",
    glow: "hover:text-[var(--accent)] hover:[text-shadow:0_0_8px_var(--accent)]",
    border: "border-[var(--accent)]/20",
    bg: "hover:bg-[var(--accent)]/5",
  },
  data: {
    label: "text-blue-400",
    prompt: "text-blue-400/70",
    glow: "hover:text-blue-300 hover:[text-shadow:0_0_8px_#60a5fa]",
    border: "border-blue-400/20",
    bg: "hover:bg-blue-400/5",
  },
  cloud: {
    label: "text-purple-400",
    prompt: "text-purple-400/70",
    glow: "hover:text-purple-300 hover:[text-shadow:0_0_8px_#c084fc]",
    border: "border-purple-400/20",
    bg: "hover:bg-purple-400/5",
  },
  tools: {
    label: "text-emerald-400",
    prompt: "text-emerald-400/70",
    glow: "hover:text-emerald-300 hover:[text-shadow:0_0_8px_#34d399]",
    border: "border-emerald-400/20",
    bg: "hover:bg-emerald-400/5",
  },
} as const;

// ── SkillsSection ─────────────────────────────────────────────────────────────
export function SkillsSection() {
  const { t } = useLanguage();
  const s = t.skills;

  const grouped = CATEGORY_ORDER.map((cat) => ({
    key: cat,
    label: s.categories[cat],
    items: skills.filter((sk) => sk.category === cat),
    style: CATEGORY_STYLE[cat],
  }));

  const scramblePhrases = [s.heading, ...grouped.map((g) => g.label)];

  return (
    <section
      id="skills"
      className="relative h-screen snap-start snap-always flex items-center overflow-hidden"
    >
      {/* Rain background */}
      <SkillsRainBg />

      {/* Subtle vignette */}
      <div className="absolute inset-0 pointer-events-none z-[1] bg-gradient-to-b from-[var(--background)]/30 via-transparent to-[var(--background)]/30" />
      <div className="absolute inset-0 pointer-events-none z-[1] bg-gradient-to-r from-[var(--background)]/40 via-transparent to-[var(--background)]/40" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 w-full">
        {/* Header */}
        <div className="mb-10">
          <FadeIn>
            <span className="text-xs font-medium tracking-widest uppercase text-[var(--accent)] mb-3 block font-mono">
              {s.label}
            </span>
          </FadeIn>
          <FadeIn delay={0.1}>
            <ScrambledHeading phrases={scramblePhrases} />
          </FadeIn>
        </div>

        {/* Category columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {grouped.map((group, gi) => (
            <FadeIn key={group.key} delay={0.15 + gi * 0.08} direction="up">
              <div>
                {/* Category label */}
                <p
                  className={`text-[10px] font-bold tracking-widest uppercase font-mono mb-3 ${group.style.label}`}
                >
                  {group.label}
                </p>

                {/* Skill items */}
                <div className="space-y-1">
                  {group.items.map((sk, si) => (
                    <div
                      key={sk.name}
                      className={`
                        flex items-center gap-1.5 px-2 py-1 rounded
                        border ${group.style.border} ${group.style.bg}
                        text-[var(--muted)] text-[12px] font-mono
                        cursor-default transition-all duration-150
                        ${group.style.glow}
                        opacity-0 animate-fade-in
                      `}
                      style={{ animationDelay: `${0.3 + gi * 0.08 + si * 0.04}s`, animationFillMode: "forwards" }}
                    >
                      <span className={`${group.style.prompt} select-none`}>&gt;</span>
                      <span>{sk.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
