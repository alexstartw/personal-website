"use client";

import { useEffect, useState, useCallback } from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { FeaturedPostsSection } from "@/components/sections/FeaturedPostsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { SectionDots } from "@/components/ui/SectionDots";
import type { PostMeta } from "@/lib/posts";

const SECTIONS = [
  "hero",
  "experience",
  "projects",
  "blog",
  "skills",
  "contact",
];

export function HomeClient({ featuredPosts }: { featuredPosts: PostMeta[] }) {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.5 },
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <>
      <SectionDots activeSection={activeSection} onDotClick={scrollTo} />
      <div className="snap-container">
        <HeroSection onScrollTo={scrollTo} />
        <ExperienceSection />
        <ProjectsSection />
        <FeaturedPostsSection posts={featuredPosts} />
        <SkillsSection />
        <ContactSection />
      </div>
    </>
  );
}
