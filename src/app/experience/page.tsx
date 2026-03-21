"use client";

import {
  Briefcase,
  GraduationCap,
  Star,
  Shield,
  Cpu,
  Code,
  Database,
} from "lucide-react";
import RadialOrbitalTimeline, {
  type OrbitalTimelineItem,
} from "@/components/ui/radial-orbital-timeline";
import { timeline } from "@/data/timeline";
import { useLanguage } from "@/context/LanguageContext";

// Map timeline events to orbital items
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

function buildOrbitalData(lang: string): OrbitalTimelineItem[] {
  return timeline.map((event, index) => {
    const isCurrentRole = event.year.includes("Present");
    const status = isCurrentRole
      ? ("in-progress" as const)
      : ("completed" as const);

    // Energy: current roles have high energy, older roles lower
    const energyValues: Record<string, number> = {
      datarget: 95,
      deepcoding: 88,
      migo: 78,
      titansoft: 65,
      fortinet: 55,
      umc: 45,
      "cycu-master": 35,
      "cycu-bachelor": 25,
    };

    // Adjacent items are "connected"
    const relatedIds: number[] = [];
    if (index > 0) relatedIds.push(index); // previous item (1-indexed)
    if (index < timeline.length - 1) relatedIds.push(index + 2); // next item (1-indexed)

    const title = lang === "zh" && event.titleZh ? event.titleZh : event.title;
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
      status,
      energy: energyValues[event.id] ?? 50,
    };
  });
}

export default function ExperiencePage() {
  const { lang } = useLanguage();
  const orbitalData = buildOrbitalData(lang);

  return (
    <div className="h-screen pt-14 bg-black">
      <RadialOrbitalTimeline timelineData={orbitalData} />
    </div>
  );
}
