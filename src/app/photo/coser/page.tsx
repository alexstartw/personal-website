import type { Metadata } from "next";
import { getPhotoWorksByCategory } from "@/lib/photos";
import { GalleryGrid } from "@/components/photo/GalleryGrid";
import { GalleryPageHeader } from "@/components/photo/GalleryPageHeader";

export const metadata: Metadata = {
  title: "Coser",
  description:
    "Cosplay photography series by Alex Lin — creative character portraits and costume shoots in Taipei, Taiwan.",
};

export default function CoserPage() {
  const works = getPhotoWorksByCategory("coser");
  return (
    <div className="min-h-screen pt-14">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <GalleryPageHeader category="coser" />
        <GalleryGrid works={works} />
      </div>
    </div>
  );
}
