import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Data engineering, GenAI, cloud infrastructure, and backend projects by Alex Lin — including TB-scale data pipelines, RAG applications, and enterprise platform engineering.",
};

export default function ProjectsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
