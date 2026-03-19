"use client";

import { useLanguage } from "@/context/LanguageContext";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/ui/FadeIn";
import { Tag } from "@/components/ui/Tag";
import { skills } from "@/data/skills";
import type { Skill } from "@/types";

const CATEGORY_ORDER: Skill["category"][] = ["backend", "data", "cloud", "tools"];

export function SkillsSection() {
  const { t } = useLanguage();
  const s = t.skills;

  const grouped = CATEGORY_ORDER.map((cat) => ({
    key: cat,
    label: s.categories[cat],
    items: skills.filter((sk) => sk.category === cat),
  }));

  return (
    <section
      id="skills"
      className="relative h-screen snap-start snap-always flex items-center overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-6 w-full">
        {/* Header */}
        <div className="mb-10">
          <FadeIn>
            <p className="text-xs font-medium tracking-widest uppercase text-[var(--accent)] mb-3">
              {s.label}
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="text-3xl md:text-4xl font-bold">{s.heading}</h2>
          </FadeIn>
        </div>

        {/* Grid of categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {grouped.map((group, i) => (
            <FadeIn key={group.key} delay={0.1 + i * 0.1} direction="up">
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold tracking-wider uppercase text-[var(--accent)]">
                  {group.label}
                </p>
                <FadeInStagger className="flex flex-wrap gap-2" staggerDelay={0.04}>
                  {group.items.map((sk) => (
                    <FadeInItem key={sk.name}>
                      <Tag variant="accent">{sk.name}</Tag>
                    </FadeInItem>
                  ))}
                </FadeInStagger>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
