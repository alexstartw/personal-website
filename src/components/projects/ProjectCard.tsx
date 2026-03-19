"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Tag } from "@/components/ui/Tag";
import type { Project } from "@/types";

const gradients: Record<string, string> = {
  "multi-cloud-data-platform": "from-blue-500/15 to-cyan-500/15",
  "genai-rag-chatbot": "from-violet-500/15 to-purple-500/15",
  "crm-saas-platform": "from-emerald-500/15 to-teal-500/15",
  "mlops-pipeline": "from-orange-500/15 to-amber-500/15",
  "rpa-automation": "from-rose-500/15 to-pink-500/15",
  "data-warehouse-clickhouse": "from-sky-500/15 to-indigo-500/15",
};

const categoryEmoji: Record<string, string> = {
  "Data Engineering": "📊",
  "AI / ML": "🤖",
  "Backend": "⚙️",
  "Automation": "🔄",
};

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block h-full">
      <motion.article
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="h-full rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden hover:border-[var(--accent)]/40 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
      >
        {/* Image area */}
        <div
          className={`relative h-48 bg-gradient-to-br ${gradients[project.slug] ?? "from-gray-500/10 to-slate-500/10"} overflow-hidden`}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl opacity-25 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500">
              {categoryEmoji[project.category] ?? "💡"}
            </span>
          </div>
          <div className="absolute top-4 right-4">
            <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--background)]/80 backdrop-blur-sm text-[var(--muted)] border border-[var(--border)]">
              {project.year}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-xs text-[var(--accent)] font-medium mb-2">{project.category}</p>
          <h3 className="font-semibold text-[var(--foreground)] mb-2 group-hover:text-[var(--accent)] transition-colors line-clamp-2">
            {project.title}
          </h3>
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-4 line-clamp-3">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {project.tech.slice(0, 4).map((t) => (
              <Tag key={t} variant="accent">{t}</Tag>
            ))}
            {project.tech.length > 4 && (
              <Tag>+{project.tech.length - 4}</Tag>
            )}
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
