import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Career timeline of Li-Yu (Alex) Lin — from semiconductor automation at UMC to leading data platform engineering at Datarget. 5+ years across data engineering, GenAI, and backend development.",
};

export default function ExperienceLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
