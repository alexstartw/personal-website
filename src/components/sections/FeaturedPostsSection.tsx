"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { FadeIn } from "@/components/ui/FadeIn";
import { FocusRail, type FocusRailItem } from "@/components/ui/focus-rail";
import type { PostMeta } from "@/lib/posts";

export function FeaturedPostsSection({ posts }: { posts: PostMeta[] }) {
  const { t } = useLanguage();

  if (posts.length === 0) return null;

  const items: FocusRailItem[] = posts.map((post) => ({
    id: post.slug,
    title: post.title,
    description: post.description,
    imageSrc: post.cover ?? "",
    href: `/blog?slug=${encodeURIComponent(post.slug)}`,
    meta: post.categories[0],
  }));

  return (
    <section
      id="blog"
      className="relative h-screen snap-start snap-always flex flex-col overflow-hidden"
    >
      {/* Section header */}
      <div className="shrink-0 max-w-5xl mx-auto w-full px-6 pt-[4.5rem] pb-2 flex items-end justify-between">
        <div>
          <FadeIn>
            <span className="text-[10px] font-mono tracking-[0.18em] uppercase text-[var(--accent)] mb-2 block">
              {t.posts.label}
            </span>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              {t.posts.heading}
            </h2>
          </FadeIn>
        </div>
        <FadeIn delay={0.12}>
          <Link
            href="/blog"
            className="hidden md:flex items-center gap-1 text-xs font-mono text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            {t.posts.view_all}
          </Link>
        </FadeIn>
      </div>

      {/* Focus Rail — fills remaining height */}
      <div className="flex-1 min-h-0">
        <FocusRail items={items} autoPlay interval={4500} loop />
      </div>
    </section>
  );
}
