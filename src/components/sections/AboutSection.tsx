"use client";

import { useLanguage } from "@/context/LanguageContext";
import { FadeIn } from "@/components/ui/FadeIn";

export function AboutSection() {
  const { t } = useLanguage();
  const a = t.about;

  return (
    <section
      id="about"
      className="relative h-screen snap-start snap-always flex items-center overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-6 w-full">
        <div className="grid md:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-center">
          {/* Left: bio */}
          <div>
            <FadeIn>
              <p className="text-xs font-medium tracking-widest uppercase text-[var(--accent)] mb-4">
                {a.label}
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
                {a.heading}
              </h2>
            </FadeIn>
            <div className="space-y-3">
              {([a.bio1, a.bio2, a.bio3, a.bio4] as string[]).map((bio, i) => (
                <FadeIn key={i} delay={0.15 + i * 0.08}>
                  <p
                    className={`leading-relaxed text-sm md:text-base ${
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
          </div>

          {/* Right: stats */}
          <div className="grid grid-cols-2 gap-4">
            {a.stats.map((stat, i) => (
              <FadeIn key={stat.label} delay={0.2 + i * 0.1} direction="up">
                <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent)]/40 transition-colors">
                  <p className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-[var(--muted)]">{stat.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
