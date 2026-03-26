import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAllSlugs, getPostBySlug } from "@/lib/posts";
import { img } from "@/lib/utils";
import { InstagramEmbedLoader } from "@/components/blog/InstagramEmbedLoader";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug: encodeURIComponent(slug) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(decodeURIComponent(slug));
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      ...(post.cover ? { images: [{ url: img(post.cover) }] } : {}),
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(decodeURIComponent(slug));
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-[var(--background)] pt-14">
      {/* Cover image */}
      {post.cover && (
        <div className="w-full h-48 md:h-64 overflow-hidden">
          <Image
            src={img(post.cover!)}
            alt={post.title}
            width={1200}
            height={400}
            className="w-full h-full object-cover"
            priority
          />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Back */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-8 font-mono"
        >
          ← Blog
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.categories.map((cat) => (
              <span
                key={cat}
                className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 text-[var(--accent)] tracking-widest uppercase"
              >
                {cat}
              </span>
            ))}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold leading-snug mb-3">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono text-[var(--muted)]">
              {formatDate(post.date)}
            </span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-1.5 py-0.5 rounded border border-[var(--border)] text-[var(--muted)] font-mono"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Article content */}
        <article
          className="prose-blog"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        {post.content.includes("instagram-media") && <InstagramEmbedLoader />}
      </div>
    </div>
  );
}
