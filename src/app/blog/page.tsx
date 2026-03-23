import Link from "next/link";
import Image from "next/image";
import { getAllPostMetas } from "@/lib/posts";

export const metadata = {
  title: "Blog",
  description: "Technical articles and notes",
};

function formatDate(iso: string, lang = "en") {
  const d = new Date(iso);
  return d.toLocaleDateString(lang === "zh" ? "zh-TW" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPage() {
  const posts = getAllPostMetas();

  return (
    <div className="min-h-screen bg-[var(--background)] pt-14">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <span className="text-xs font-medium tracking-widest uppercase text-[var(--accent)] mb-3 block">
            Writing
          </span>
          <h1 className="text-3xl md:text-4xl font-bold">Blog</h1>
          <p className="text-[var(--muted)] text-sm mt-3">
            {posts.length} articles · data engineering, backend, AI/ML
          </p>
        </div>

        {/* Post list */}
        <div className="space-y-px">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${encodeURIComponent(post.slug)}`}
              className="group flex items-start gap-4 py-5 border-b border-[var(--border)] hover:border-[var(--accent)]/40 transition-colors"
            >
              {/* Cover thumbnail */}
              {post.cover ? (
                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-[var(--border)] bg-[var(--card)]">
                  <Image
                    src={post.cover}
                    alt={post.title}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-lg shrink-0 border border-[var(--border)] bg-[var(--card)] flex items-center justify-center">
                  <span className="text-[var(--muted)] text-xs font-mono">md</span>
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors leading-snug mb-1 truncate">
                  {post.title}
                </h2>
                {post.description && (
                  <p className="text-xs text-[var(--muted)] leading-relaxed line-clamp-2 mb-2">
                    {post.description}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono text-[var(--muted)]">
                    {formatDate(post.date)}
                  </span>
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-1.5 py-0.5 rounded border border-[var(--border)] text-[var(--muted)] font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="text-[10px] text-[var(--muted)] font-mono">
                      +{post.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
