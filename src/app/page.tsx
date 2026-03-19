"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { SectionDots } from "@/components/ui/SectionDots";

const SECTIONS = ["hero", "experience", "projects", "skills", "contact"];

export default function Home() {
  const [activeSection, setActiveSection] = useState("hero");
  const containerRef = useRef<HTMLDivElement>(null);

  // Track which section is visible using IntersectionObserver
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
      {/* Side navigation dots */}
      <SectionDots activeSection={activeSection} onDotClick={scrollTo} />

      {/* Scroll snap container */}
      <div ref={containerRef} className="snap-container">
        <div className="snap-section">
          <HeroSection onScrollTo={scrollTo} />
        </div>
        <div className="snap-section">
          <ExperienceSection />
        </div>
        <div className="snap-section">
          <ProjectsSection onScrollTo={scrollTo} />
        </div>
        <div className="snap-section">
          <SkillsSection />
        </div>
        <div className="snap-section">
          <ContactSection />
        </div>
      </div>
    </>
  );
}
