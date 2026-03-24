"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { BackgroundBoxes } from "@/components/ui/background-boxes";
import { FadeIn } from "@/components/ui/FadeIn";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { projects } from "@/data/projects";
import { cn } from "@/lib/utils";

export default function ProjectsPage() {
  const { t, lang } = useLanguage();
  const p = t.projects;
  const [active, setActive] = useState("All");

  const allLabel = p.all;
  const categories = [allLabel, ...Array.from(new Set(projects.map((pr) => pr.category)))];

  const filtered =
    active === allLabel
      ? projects
      : projects.filter((pr) => pr.category === active);

  return (
    <div className="relative min-h-screen">
      <BackgroundBoxes interactive={false} />

      {/* Header */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-28 pb-10 pointer-events-none">
        <FadeIn>
          <span className="text-xs font-medium tracking-widest uppercase text-[var(--accent)] mb-3 block">
            {p.label}
          </span>
        </FadeIn>
        <FadeIn delay={0.08}>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            {p.page_heading}
          </h1>
        </FadeIn>
        <FadeIn delay={0.14}>
          <p className="text-base text-[var(--muted)] max-w-xl">
            {p.page_description}
          </p>
        </FadeIn>
      </div>

      {/* Filter + Grid */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        {/* Filter bar */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={cn(
                "relative px-4 py-1.5 text-sm rounded-full transition-colors",
                active === cat
                  ? "text-white"
                  : "text-[var(--muted)] hover:text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--foreground)]",
              )}
            >
              {active === cat && (
                <motion.span
                  layoutId="projects-filter-pill"
                  className="absolute inset-0 bg-[var(--accent)] rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">
                {cat === allLabel ? cat : (p.category_map[cat] ?? cat)}
              </span>
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.slug}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <ProjectCard project={project} lang={lang} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <p className="text-center text-[var(--muted)] py-20">
            {lang === "zh" ? "此類別尚無專案" : "No projects in this category yet."}
          </p>
        )}
      </div>
    </div>
  );
}
