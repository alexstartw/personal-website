import type { Metadata } from "next";
import { ProjectGrid } from "@/components/projects/ProjectGrid";

export const metadata: Metadata = {
  title: "Projects",
  description: "A collection of data engineering, AI/ML, and backend projects by Li-Yu Alex Lin.",
};

export default function ProjectsPage() {
  return (
    <>
      <section className="max-w-5xl mx-auto px-6 pt-40 pb-12">
        <p className="text-xs font-medium tracking-widest uppercase text-[var(--accent)] mb-4">
          Portfolio
        </p>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">Projects</h1>
        <p className="text-lg text-[var(--muted)] max-w-xl">
          A selection of work spanning data engineering, GenAI applications, and cloud infrastructure.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24">
        <ProjectGrid />
      </section>
    </>
  );
}
