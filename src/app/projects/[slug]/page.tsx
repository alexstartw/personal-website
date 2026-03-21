import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { Tag } from "@/components/ui/Tag";
import { FadeIn } from "@/components/ui/FadeIn";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
  };
}

const gradients: Record<string, string> = {
  "multi-cloud-data-platform": "from-blue-500/20 to-cyan-500/20",
  "genai-rag-chatbot": "from-violet-500/20 to-purple-500/20",
  "crm-saas-platform": "from-emerald-500/20 to-teal-500/20",
  "mlops-pipeline": "from-orange-500/20 to-amber-500/20",
  "rpa-automation": "from-rose-500/20 to-pink-500/20",
  "data-warehouse-clickhouse": "from-sky-500/20 to-indigo-500/20",
};

const categoryEmoji: Record<string, string> = {
  "Data Engineering": "📊",
  "AI / ML": "🤖",
  Backend: "⚙️",
  Automation: "🔄",
};

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) notFound();

  return (
    <>
      {/* Hero */}
      <section
        className={`min-h-[40vh] bg-gradient-to-br ${gradients[project.slug] ?? "from-gray-500/10 to-slate-500/10"} flex items-end`}
      >
        <div className="max-w-5xl mx-auto px-6 pt-40 pb-16 w-full">
          <FadeIn>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-8"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              All Projects
            </Link>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-sm text-[var(--accent)] font-medium mb-3">
              {categoryEmoji[project.category]} {project.category} ·{" "}
              {project.year}
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {project.title}
            </h1>
          </FadeIn>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-[2fr_1fr] gap-16">
          {/* Main */}
          <div>
            <FadeIn>
              <p className="text-lg text-[var(--muted)] leading-relaxed mb-8">
                {project.longDescription}
              </p>
            </FadeIn>

            {/* Links */}
            {(project.links.github || project.links.demo) && (
              <FadeIn delay={0.1} className="flex gap-4 mt-8">
                {project.links.github && (
                  <Link
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[var(--border)] text-sm hover:border-[var(--foreground)] transition-colors"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                    GitHub
                  </Link>
                )}
                {project.links.demo && (
                  <Link
                    href={project.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--accent)] text-white text-sm hover:bg-[var(--accent-dark)] transition-colors"
                  >
                    Live Demo
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
                    </svg>
                  </Link>
                )}
              </FadeIn>
            )}
          </div>

          {/* Sidebar */}
          <FadeIn delay={0.2} direction="left">
            <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
              <h3 className="text-xs font-semibold tracking-widest uppercase text-[var(--muted)] mb-4">
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <Tag key={t} variant="accent">
                    {t}
                  </Tag>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Back / Next navigation */}
        <FadeIn
          delay={0.3}
          className="mt-20 pt-10 border-t border-[var(--border)]"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back to all projects
          </Link>
        </FadeIn>
      </section>
    </>
  );
}
