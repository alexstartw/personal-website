import { FadeIn } from "@/components/ui/FadeIn";

export function Biography() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-24">
      <div className="grid md:grid-cols-[1fr_2fr] gap-16">
        <FadeIn>
          <p className="text-xs font-medium tracking-widest uppercase text-[var(--accent)]">
            Biography
          </p>
        </FadeIn>

        <div className="space-y-6">
          <FadeIn delay={0.1}>
            <p className="text-lg leading-relaxed text-[var(--foreground)]">
              I&apos;m <strong>Li-Yu (Alex) Lin</strong>, a Senior Data Engineer based in Taipei, Taiwan.
              With over 5 years of experience, I specialize in building data-intensive systems
              across event-driven architectures and cloud-native environments.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="leading-relaxed text-[var(--muted)]">
              My journey spans semiconductor manufacturing automation at UMC, backend API development
              at Migo Corp, and now leading enterprise-grade data platform engineering at Datarget.
              Along the way, I&apos;ve built systems that process TB-level data traffic daily and
              developed GenAI solutions that generate significant business value.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="leading-relaxed text-[var(--muted)]">
              I hold a Master&apos;s degree in Information and Computer Engineering from Chung Yuan
              Christian University, which gave me a strong foundation in algorithms, distributed systems,
              and machine learning. Today, I bridge that academic rigor with practical, production-scale
              engineering.
            </p>
          </FadeIn>
          <FadeIn delay={0.4}>
            <p className="leading-relaxed text-[var(--muted)]">
              Outside of work, I&apos;m passionate about the intersection of large language models and
              data infrastructure — particularly how RAG architectures can make enterprise knowledge
              more accessible and actionable.
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
