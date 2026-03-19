"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projects, categories } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import { FilterBar } from "./FilterBar";

export function ProjectGrid() {
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <div>
      <div className="mb-10">
        <FilterBar categories={categories} active={active} onChange={setActive} />
      </div>

      <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((project) => (
            <motion.div
              key={project.slug}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="text-center text-[var(--muted)] py-20">No projects in this category yet.</p>
      )}
    </div>
  );
}
