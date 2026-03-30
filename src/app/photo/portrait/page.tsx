import type { Metadata } from "next";
import { getPhotoWorksByCategory } from "@/lib/photos";
import { GalleryGrid } from "@/components/photo/GalleryGrid";
import { GalleryPageHeader } from "@/components/photo/GalleryPageHeader";

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
        <GalleryPageHeader category="portrait" />
        <GalleryGrid works={works} />
      </div>
    </div>
  );
}
