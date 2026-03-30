import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPhotoWorkBySlug, getAllPhotoSlugs } from "@/lib/photos";
import { img } from "@/lib/utils";
import { PhotoWorkPageClient } from "@/components/photo/PhotoWorkPageClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

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

  return <PhotoWorkPageClient work={work} />;
}
