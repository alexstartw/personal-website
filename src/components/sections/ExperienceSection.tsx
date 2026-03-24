"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  GraduationCap,
  Star,
  Shield,
  Cpu,
  Code,
  Database,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { FadeIn } from "@/components/ui/FadeIn";
import { BackgroundBoxes } from "@/components/ui/background-boxes";
import RadialOrbitalTimeline, {
  type OrbitalTimelineItem,
} from "@/components/ui/radial-orbital-timeline";
import { timeline } from "@/data/timeline";

const iconMap: Record<string, React.ElementType> = {
  datarget: Database,
  deepcoding: Star,
  migo: Code,
  titansoft: Briefcase,
  fortinet: Shield,
  umc: Cpu,
  "cycu-master": GraduationCap,
  "cycu-bachelor": GraduationCap,
};

const energyMap: Record<string, number> = {
  datarget: 95,
  deepcoding: 88,
  migo: 78,
  titansoft: 65,
  fortinet: 55,
  umc: 45,
  "cycu-master": 35,
  "cycu-bachelor": 25,
};

function buildOrbitalData(lang: string): OrbitalTimelineItem[] {
  return timeline.map((event, index) => {
    const isCurrentRole = event.year.includes("Present");
    const relatedIds: number[] = [];
    if (index > 0) relatedIds.push(index);
    if (index < timeline.length - 1) relatedIds.push(index + 2);

    const title = lang === "zh" && event.titleZh ? event.titleZh : event.title;
    const company =
      lang === "zh" && event.companyZh ? event.companyZh : event.company;
    const desc =
      lang === "zh" && event.descriptionZh
        ? event.descriptionZh[0]
        : event.description[0];

    return {
      id: index + 1,
      title,
      date: event.year,
      content: desc,
      category: event.type,
      icon: iconMap[event.id] ?? Briefcase,
      relatedIds,
      status: isCurrentRole ? "in-progress" : "completed",
      energy: energyMap[event.id] ?? 50,
      company,
      tags: event.tags.slice(0, 3),
      slug: event.id,
    };
  });
}

export function ExperienceSection() {
  const { t, lang } = useLanguage();
  const e = t.experience;
  const router = useRouter();
  const orbitalData = buildOrbitalData(lang);

  const handleNavigate = useCallback(
    (slug: string) => {
      router.push(`/experience?id=${slug}`);
    },
    [router],
  );

  return (
    <section
      id="experience"
      className="relative h-screen snap-start snap-always flex flex-col"
    >
      <BackgroundBoxes interactive={false} />

      {/* Header — floats above the orbital */}
      <div className="absolute top-0 left-0 right-0 px-6 pt-14 pb-3 z-20 pointer-events-none">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <span className="text-xs font-medium tracking-widest uppercase text-[var(--accent)] mb-3 block">
              {e.label}
            </span>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="text-3xl md:text-4xl font-bold">{e.heading}</h2>
          </FadeIn>
        </div>
      </div>

      {/* Hint at bottom */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <p className="text-[11px] text-foreground/30 tracking-widest">
          {lang === "zh" ? "點擊節點查看簡介" : "Click a node to preview"}
        </p>
      </div>

      {/* Orbital timeline fills the section */}
      <div className="relative z-10 flex-1">
        <RadialOrbitalTimeline
          timelineData={orbitalData}
          onNavigate={handleNavigate}
        />
      </div>
    </section>
  );
}
