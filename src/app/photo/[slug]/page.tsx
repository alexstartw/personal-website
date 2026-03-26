import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { getPhotoWorkBySlug, getAllPhotoSlugs } from "@/lib/photos";
import { img } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPhotoSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const work = getPhotoWorkBySlug(slug);
  if (!work) return {};
  const coverImage = work.images[0] ? img(work.images[0]) : undefined;
  return {
    title: work.title,
    description: `${work.title} — photography by Alex Lin${work.model?.name ? `, featuring ${work.model.name}` : ""}${work.location?.name ? ` at ${work.location.name}` : ""}.`,
    openGraph: {
      title: work.title,
      type: "article",
      ...(coverImage ? { images: [{ url: coverImage }] } : {}),
    },
  };
}

export default async function PhotoWorkPage({ params }: Props) {
  const { slug } = await params;
  const work = getPhotoWorkBySlug(slug);
  if (!work) notFound();

  const backHref = `/photo/${work.category}`;
  const backLabel = work.category === "portrait" ? "Portrait" : "Coser";

  return (
    <div className="min-h-screen pt-14">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back link */}
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {backLabel}
        </Link>

        {/* Title */}
        <div className="mb-8">
          <p className="text-xs font-mono tracking-[0.2em] uppercase text-[var(--accent)] mb-2">
            {work.category}
          </p>
          <h1 className="text-3xl font-light text-[var(--foreground)]">
            {work.title}
          </h1>
          {work.subject && (
            <p className="text-[var(--muted)] mt-1">{work.subject}</p>
          )}
        </div>

        {/* Images */}
        <div
          className={`grid gap-4 ${work.images.length > 1 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 max-w-xl"}`}
        >
          {work.images.map((src, i) => (
            <div
              key={i}
              className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[var(--card)]"
            >
              <Image
                src={src}
                alt={`${work.title} ${i + 1}`}
                fill
                className="object-cover"
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        {/* Description + IG link */}
        <div className="mt-8 flex flex-col sm:flex-row sm:items-start gap-4">
          {work.description && (
            <p className="text-[var(--muted)] flex-1">{work.description}</p>
          )}
          {work.igUrl && (
            <a
              href={work.igUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)] text-sm transition-colors shrink-0"
            >
              <ExternalLink className="w-4 h-4" />
              View on Instagram
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
