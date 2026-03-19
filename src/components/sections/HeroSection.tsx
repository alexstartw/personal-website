"use client";

import { motion } from "framer-motion";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { FadeIn } from "@/components/ui/FadeIn";
import { useLanguage } from "@/context/LanguageContext";

interface HeroSectionProps {
  onScrollTo: (id: string) => void;
}

export function HeroSection({ onScrollTo }: HeroSectionProps) {
  const { t } = useLanguage();
  const h = t.hero;
  const a = t.about;

  return (
    <section
      id="hero"
      className="relative h-screen snap-start snap-always flex items-center overflow-hidden"
    >
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle at center, rgba(59,130,246,0.12) 0%, transparent 70%)",
          }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle at center, rgba(59,130,246,0.07) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 w-full pt-16">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* ── Left: hero content ─────────────────────────────── */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--muted)]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              {h.badge}
            </motion.div>

            {/* Name + title */}
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.08] mb-5">
              <AnimatedText text={h.name} delay={0.2} staggerDelay={0.05} />
              <br />
              <span className="text-[var(--accent)] block mt-2">
                <AnimatedText text={h.title} delay={0.55} staggerDelay={0.06} />
              </span>
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="text-base md:text-lg text-[var(--muted)] leading-relaxed mb-8"
            >
              {h.subtitle}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={() => onScrollTo("projects")}
                className="px-6 py-3 rounded-full bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-dark)] transition-colors"
              >
                {h.cta_projects}
              </button>
              <button
                onClick={() => onScrollTo("contact")}
                className="px-6 py-3 rounded-full border border-[var(--border)] text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--foreground)] transition-colors"
              >
                {h.cta_contact}
              </button>
            </motion.div>
          </div>

          {/* ── Right: about content ────────────────────────────── */}
          <div>
            {/* Bio — skip education paragraph (bio3) */}
            <div className="space-y-3 mb-6">
              {([a.bio1, a.bio2, a.bio4] as string[]).map((bio, i) => (
                <FadeIn key={i} delay={0.3 + i * 0.1}>
                  <p
                    className={`leading-relaxed text-sm ${
                      i === 0
                        ? "text-[var(--foreground)]"
                        : "text-[var(--muted)]"
                    }`}
                  >
                    {bio}
                  </p>
                </FadeIn>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              {a.stats.map((stat, i) => (
                <FadeIn key={stat.label} delay={0.5 + i * 0.08} direction="up">
                  <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent)]/40 transition-colors h-full">
                    {stat.items ? (
                      <>
                        <p className="text-xs font-semibold text-[var(--accent)] mb-2">
                          {stat.label}
                        </p>
                        <ul className="space-y-1">
                          {stat.items.map((item) => (
                            <li
                              key={item}
                              className="flex items-center gap-1.5"
                            >
                              <span className="w-1 h-1 rounded-full bg-[var(--accent)] shrink-0" />
                              <span className="text-xs text-[var(--foreground)]">
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <>
                        <p className="text-2xl font-bold text-[var(--foreground)] mb-0.5">
                          {stat.value}
                        </p>
                        <p className="text-xs text-[var(--muted)]">
                          {stat.label}
                        </p>
                      </>
                    )}
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.8 }}
        onClick={() => onScrollTo("experience")}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer group"
        aria-label="Scroll to next section"
      >
        <span className="text-xs text-[var(--muted)] tracking-widest uppercase group-hover:text-[var(--foreground)] transition-colors">
          {h.scroll}
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-[var(--muted)] to-transparent"
        />
      </motion.button>
    </section>
  );
}
