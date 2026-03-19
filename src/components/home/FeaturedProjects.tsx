import Link from "next/link";
import { projects } from "@/data/projects";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/ui/FadeIn";
import { Tag } from "@/components/ui/Tag";

const featured = projects.filter((p) => p.featured).slice(0, 3);

const projectColors: Record<string, string> = {
  "multi-cloud-data-platform": "from-blue-500/10 to-cyan-500/10",
  "genai-rag-chatbot": "from-violet-500/10 to-purple-500/10",
  "crm-saas-platform": "from-emerald-500/10 to-teal-500/10",
};

export function FeaturedProjects() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-24">
      <FadeIn>
        <p className="text-xs font-medium tracking-widest uppercase text-[var(--accent)] mb-4">
          Projects
        </p>
      </FadeIn>
      <div className="flex items-end justify-between mb-12">
        <FadeIn delay={0.1}>
          <h2 className="text-3xl md:text-4xl font-bold">Featured Work</h2>
        </FadeIn>
        <FadeIn delay={0.2}>
          <Link
            href="/projects"
            className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors hidden md:flex items-center gap-1.5"
          >
            All projects
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </FadeIn>
      </div>

      <FadeInStagger className="grid md:grid-cols-3 gap-6">
        {featured.map((project) => (
          <FadeInItem key={project.slug}>
            <Link href={`/projects/${project.slug}`} className="group block h-full">
              <article className="h-full rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden hover:border-[var(--accent)]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/5">
                {/* Image placeholder with gradient */}
                <div
                  className={`h-48 bg-gradient-to-br ${projectColors[project.slug] ?? "from-gray-500/10 to-slate-500/10"} flex items-center justify-center`}
                >
                  <span className="text-4xl opacity-30">
                    {project.category === "AI / ML" ? "🤖" : project.category === "Data Engineering" ? "📊" : "⚙️"}
                  </span>
                </div>
                <div className="p-6">
                  <p className="text-xs text-[var(--accent)] font-medium mb-2">{project.category}</p>
                  <h3 className="font-semibold text-[var(--foreground)] mb-2 group-hover:text-[var(--accent)] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.slice(0, 3).map((t) => (
                      <Tag key={t} variant="accent">{t}</Tag>
                    ))}
                    {project.tech.length > 3 && (
                      <Tag>+{project.tech.length - 3}</Tag>
                    )}
                  </div>
                </div>
              </article>
            </Link>
          </FadeInItem>
        ))}
      </FadeInStagger>

      <FadeIn delay={0.2} className="text-center mt-10 md:hidden">
        <Link
          href="/projects"
          className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        >
          View all projects →
        </Link>
      </FadeIn>
    </section>
  );
}
