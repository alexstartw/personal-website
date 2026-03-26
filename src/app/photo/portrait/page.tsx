import type { Metadata } from "next";
import { getPhotoWorksByCategory } from "@/lib/photos";
import { GalleryGrid } from "@/components/photo/GalleryGrid";

export const metadata: Metadata = {
  title: "Portrait",
  description:
    "Portrait photography series by Alex Lin — candid and studio portraits captured in Taipei, Taiwan.",
};

export default function PortraitPage() {
  const works = getPhotoWorksByCategory("portrait");
  return (
    <div className="min-h-screen pt-14">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10">
          <p className="text-xs font-mono tracking-[0.2em] uppercase text-[var(--accent)] mb-2">
            Gallery
          </p>
          <h1 className="text-4xl font-light text-[var(--foreground)]">
            Portrait
          </h1>
        </div>
        <GalleryGrid works={works} />
      </div>
    </div>
  );
}
