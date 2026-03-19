"use client";

import { useLanguage } from "@/context/LanguageContext";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/ui/FadeIn";
import { Tag } from "@/components/ui/Tag";
import { projects } from "@/data/projects";

const featured = projects.filter((p) => p.featured).slice(0, 3);

const PROJECT_COLORS: Record<string, string> = {
  "multi-cloud-data-platform": "from-blue-500/10 to-cyan-500/10",
  "genai-rag-chatbot": "from-violet-500/10 to-purple-500/10",
  "crm-saas-platform": "from-emerald-500/10 to-teal-500/10",
};

const CATEGORY_ICONS: Record<string, string> = {
  "AI / ML": "🤖",
  "Data Engineering": "📊",
  Backend: "⚙️",
  Automation: "🔧",
};

interface ProjectsSectionProps {
  onScrollTo: (id: string) => void;
}

export function ProjectsSection({ onScrollTo }: ProjectsSectionProps) {
  const { t, lang } = useLanguage();
  const p = t.projects;

  return (
    <section
      id="projects"
      className="relative h-screen snap-start snap-always flex items-center overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-6 w-full">
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
            <button
              onClick={() => onScrollTo("contact")}
              className="hidden md:flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              {p.view_all}
            </button>
          </FadeIn>
        </div>

        {/* Cards */}
        <FadeInStagger className="grid md:grid-cols-3 gap-5" staggerDelay={0.1}>
          {featured.map((project) => {
            const title = lang === "zh" && project.titleZh ? project.titleZh : project.title;
            const description =
              lang === "zh" && project.descriptionZh
                ? project.descriptionZh
                : project.description;
            const category =
              lang === "zh"
                ? p.category_map[project.category as keyof typeof p.category_map] ??
                  project.category
                : project.category;

            return (
              <FadeInItem key={project.slug}>
                <article className="h-full rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden hover:border-[var(--accent)]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/5">
                  <div
                    className={`h-36 bg-gradient-to-br ${PROJECT_COLORS[project.slug] ?? "from-gray-500/10 to-slate-500/10"} flex items-center justify-center`}
                  >
                    <span className="text-4xl opacity-30">
                      {CATEGORY_ICONS[project.category] ?? "📦"}
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-[var(--accent)] font-medium mb-1">{category}</p>
                    <h3 className="font-semibold text-[var(--foreground)] mb-2 text-sm leading-snug">
                      {title}
                    </h3>
                    <p className="text-xs text-[var(--muted)] leading-relaxed mb-3">
                      {description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech.slice(0, 3).map((tech) => (
                        <Tag key={tech} size="sm" variant="accent">
                          {tech}
                        </Tag>
                      ))}
                      {project.tech.length > 3 && (
                        <Tag size="sm">+{project.tech.length - 3}</Tag>
                      )}
                    </div>
                  </div>
                </article>
              </FadeInItem>
            );
          })}
        </FadeInStagger>
      </div>
    </section>
  );
}
