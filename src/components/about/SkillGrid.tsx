import { skills, categoryLabels } from "@/data/skills";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/ui/FadeIn";
import type { Skill } from "@/types";

const categories: Skill["category"][] = ["backend", "data", "cloud", "tools"];

const categoryIcons: Record<Skill["category"], string> = {
  backend: "⚙️",
  data: "📊",
  cloud: "☁️",
  tools: "🛠️",
};

export function SkillGrid() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-24 border-t border-[var(--border)]">
      <div className="grid md:grid-cols-[1fr_2fr] gap-16">
        <FadeIn>
          <p className="text-xs font-medium tracking-widest uppercase text-[var(--accent)]">
            Skills
          </p>
        </FadeIn>

        <div className="space-y-10">
          {categories.map((cat, i) => {
            const catSkills = skills.filter((s) => s.category === cat);
            return (
              <FadeIn key={cat} delay={0.1 * i}>
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span>{categoryIcons[cat]}</span>
                    <h3 className="text-sm font-semibold text-[var(--foreground)]">
                      {categoryLabels[cat]}
                    </h3>
                  </div>
                  <FadeInStagger className="flex flex-wrap gap-2" staggerDelay={0.04}>
                    {catSkills.map((skill) => (
                      <FadeInItem key={skill.name}>
                        <span className="inline-block px-3 py-1.5 rounded-lg text-sm border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:border-[var(--accent)]/50 hover:text-[var(--accent)] transition-colors cursor-default">
                          {skill.name}
                        </span>
                      </FadeInItem>
                    ))}
                  </FadeInStagger>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
