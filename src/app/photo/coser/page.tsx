import type { Metadata } from "next";
import { getPhotoWorksByCategory } from "@/lib/photos";
import { GalleryGrid } from "@/components/photo/GalleryGrid";

export const metadata: Metadata = { title: "Coser" };

export default function CoserPage() {
  const works = getPhotoWorksByCategory("coser");
  return (
    <div className="min-h-screen pt-14">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10">
          <p className="text-xs font-mono tracking-[0.2em] uppercase text-[var(--accent)] mb-2">
            Gallery
          </p>
          <h1 className="text-4xl font-light text-[var(--foreground)]">
            Coser
          </h1>
        </div>
        <GalleryGrid works={works} />
      </div>
    </div>
  );
}
