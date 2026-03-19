import Link from "next/link";
import { FadeIn } from "@/components/ui/FadeIn";

const stats = [
  { value: "5+", label: "Years Experience" },
  { value: "TB", label: "Data Processed Daily" },
  { value: "NT$50M+", label: "Revenue Generated" },
  { value: "3", label: "Cloud Platforms" },
];

export function AboutPreview() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-24">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div>
          <FadeIn>
            <p className="text-xs font-medium tracking-widest uppercase text-[var(--accent)] mb-4">
              About
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
              Building the infrastructure that powers modern data products.
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-[var(--muted)] leading-relaxed mb-8">
              I&apos;m a Senior Data Engineer based in Taipei, Taiwan, with expertise in
              designing scalable data pipelines, cloud-native architectures, and
              GenAI applications. Currently at Datarget, building enterprise-grade
              multi-cloud platforms.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)] hover:gap-3 transition-all"
            >
              Full story
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </FadeIn>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-6">
          {stats.map((stat, i) => (
            <FadeIn key={stat.label} delay={0.15 * i} direction="up">
              <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
                <p className="text-3xl font-bold text-[var(--foreground)] mb-1">{stat.value}</p>
                <p className="text-sm text-[var(--muted)]">{stat.label}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
