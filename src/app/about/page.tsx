import type { Metadata } from "next";
import { Biography } from "@/components/about/Biography";
import { SkillGrid } from "@/components/about/SkillGrid";
import { Timeline } from "@/components/about/Timeline";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Li-Yu Alex Lin — Senior Data Engineer with 5+ years building data-intensive systems.",
};

export default function AboutPage() {
  return (
    <>
      {/* Page header */}
      <section className="max-w-5xl mx-auto px-6 pt-40 pb-12">
        <p className="text-xs font-medium tracking-widest uppercase text-[var(--accent)] mb-4">
          Who I am
        </p>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">About</h1>
      </section>

      <Biography />
      <SkillGrid />
      <Timeline />
    </>
  );
}
