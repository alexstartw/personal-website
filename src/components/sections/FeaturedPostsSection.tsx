"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { FadeIn } from "@/components/ui/FadeIn";
import type { PostMeta } from "@/lib/posts";

const INTERVAL = 4500;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 48 : -48,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -48 : 48,
    opacity: 0,
  }),
};

export function FeaturedPostsSection({ posts }: { posts: PostMeta[] }) {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (next: number) => {
      setDir(next > index ? 1 : -1);
      setIndex(next);
    },
    [index],
  );

  useEffect(() => {
    if (paused || posts.length < 2) return;
    const id = setTimeout(() => {
      go((index + 1) % posts.length);
    }, INTERVAL);
    return () => clearTimeout(id);
  }, [index, paused, posts.length, go]);

  if (posts.length === 0) return null;

  const post = posts[index];

  return (
    <section
      id="blog"
      className="relative h-screen snap-start snap-always flex flex-col items-center justify-center overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 55%, rgba(59,130,246,0.05) 0%, transparent 75%)",
        }}
      />

      <div className="relative w-full max-w-4xl mx-auto px-6">
        {/* Section header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <FadeIn>
              <span className="text-xs font-medium tracking-widest uppercase text-[var(--accent)] mb-3 block">
                {t.posts.label}
              </span>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold">
                {t.posts.heading}
              </h2>
            </FadeIn>
          </div>
          <FadeIn delay={0.15}>
            <Link
              href="/blog"
              className="hidden md:flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              {t.nav.blog} →
            </Link>
          </FadeIn>
        </div>

        {/* Card carousel */}
        <div className="relative">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={post.slug}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Link
                href={`/blog?slug=${encodeURIComponent(post.slug)}`}
                className="group block"
              >
                <div className="grid md:grid-cols-[1fr_1.1fr] gap-0 rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden hover:border-[var(--accent)]/40 transition-colors duration-200">
                  {/* Cover image */}
                  {post.cover ? (
                    <div className="relative h-52 md:h-auto overflow-hidden bg-[var(--border)]">
                      <Image
                        src={post.cover}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[var(--card)]/20" />
                    </div>
                  ) : (
                    <div className="h-52 md:h-auto bg-[var(--border)]/30" />
                  )}

                  {/* Content */}
                  <div className="flex flex-col justify-between p-6 md:p-8">
                    <div>
                      {/* Category + date */}
                      <div className="flex items-center gap-2 mb-3">
                        {post.categories[0] && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/8 text-[var(--accent)] tracking-widest uppercase">
                            {post.categories[0]}
                          </span>
                        )}
                        <span className="text-[11px] font-mono text-[var(--muted)]">
                          {formatDate(post.date)}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold leading-snug mb-2 group-hover:text-[var(--accent)] transition-colors">
                        {post.title}
                      </h3>

                      {/* Description */}
                      {post.description && (
                        <p className="text-sm text-[var(--muted)] leading-relaxed line-clamp-3">
                          {post.description}
                        </p>
                      )}
                    </div>

                    {/* Tags + CTA */}
                    <div className="mt-5 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-1.5 py-0.5 rounded border border-[var(--border)] text-[var(--muted)] font-mono"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-[var(--accent)] font-medium shrink-0 ml-3 group-hover:underline underline-offset-2">
                        Read →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Pagination dots */}
          <div className="flex items-center justify-center gap-2 mt-5">
            {posts.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className="relative h-1.5 rounded-full overflow-hidden transition-all duration-200"
                style={{ width: i === index ? "2rem" : "0.5rem" }}
                aria-label={`Go to post ${i + 1}`}
              >
                <span className="absolute inset-0 bg-[var(--border)]" />
                {i === index && (
                  <motion.span
                    className="absolute inset-0 bg-[var(--accent)]"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: INTERVAL / 1000, ease: "linear" }}
                    style={{ originX: 0 }}
                    key={`progress-${index}`}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
