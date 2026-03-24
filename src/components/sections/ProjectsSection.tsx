"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/ui/FadeIn";
import { BackgroundBoxes } from "@/components/ui/background-boxes";
import { WaveProjectCard } from "@/components/ui/wave-project-card";
import { projects } from "@/data/projects";

const featured = projects.filter((p) => p.featured).slice(0, 3);

const WAVE_COLORS: Record<string, string> = {
  autollm: "#f59e0b",
  "nine-nine-pos": "#10b981",
  "fabric-data-pipeline": "#3b82f6",
};

export function ProjectsSection() {
  const { t, lang } = useLanguage();
  const p = t.projects;

  return (
    <section
      id="projects"
      className="relative h-screen snap-start snap-always flex items-center overflow-hidden"
    >
      <BackgroundBoxes />

      <div className="relative z-10 max-w-5xl mx-auto px-6 w-full pointer-events-none">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <FadeIn>
              <span className="text-xs font-medium tracking-widest uppercase text-[var(--accent)] mb-3 block">
                {p.label}
              </span>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold">{p.heading}</h2>
            </FadeIn>
          </div>
          <FadeIn delay={0.15}>
            <Link
              href="/projects"
              className="pointer-events-auto hidden md:flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              {p.view_all}
            </Link>
          </FadeIn>
        </div>

        {/* Cards */}
        <FadeInStagger
          className="pointer-events-auto grid md:grid-cols-3 gap-5"
          staggerDelay={0.1}
        >
          {featured.map((project, i) => {
            const title =
              lang === "zh" && project.titleZh
                ? project.titleZh
                : project.title;
            const description =
              lang === "zh" && project.descriptionZh
                ? project.descriptionZh
                : project.description;
            const category =
              lang === "zh"
                ? (p.category_map[
                    project.category as keyof typeof p.category_map
                  ] ?? project.category)
                : project.category;

            return (
              <FadeInItem key={project.slug}>
                <WaveProjectCard
                  slug={project.slug}
                  title={title}
                  description={description}
                  category={category}
                  tech={project.tech}
                  links={project.links}
                  waveColor={WAVE_COLORS[project.slug] ?? "#6366f1"}
                  animationDelay={i * 0.4}
                />
              </FadeInItem>
            );
          })}
        </FadeInStagger>
      </div>
    </section>
  );
}
