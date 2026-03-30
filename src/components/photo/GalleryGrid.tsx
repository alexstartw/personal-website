"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, ImageOff } from "lucide-react";
import { CinematicSlideshow } from "./CinematicSlideshow";
import type { PhotoWork } from "@/types/photo";
import { img } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface GalleryGridProps {
  works: PhotoWork[];
}

function PhotoCard({
  work,
  onOpen,
}: {
  work: PhotoWork;
  onOpen: (work: PhotoWork) => void;
}) {
  const [imgError, setImgError] = useState(false);
  const primaryImage = work.images[0] ? img(work.images[0]) : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group relative cursor-pointer overflow-hidden rounded-xl bg-[var(--card)] border border-[var(--border)]"
      onClick={() => onOpen(work)}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        {primaryImage && !imgError ? (
          <Image
            src={primaryImage}
            alt={work.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[var(--border)]">
            <ImageOff className="w-8 h-8 text-[var(--muted)]" />
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex flex-col items-center justify-end p-4 opacity-0 group-hover:opacity-100">
          <p className="text-white font-medium text-sm text-center">
            {work.title}
          </p>
          {work.subject && (
            <p className="text-white/60 text-xs mt-0.5">{work.subject}</p>
          )}
        </div>
      </div>

      {/* Card footer */}
      <div className="p-3 flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-[var(--foreground)] text-sm font-medium truncate">
            {work.title}
          </p>
          {work.subject && (
            <p className="text-[var(--muted)] text-xs truncate mt-0.5">
              {work.subject}
            </p>
          )}
        </div>
        {work.igUrl && (
          <a
            href={work.igUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 ml-2 p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors"
            aria-label="View on Instagram"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </motion.div>
  );
}

export function GalleryGrid({ works }: GalleryGridProps) {
  const [lightboxWork, setLightboxWork] = useState<PhotoWork | null>(null);
  const { t } = useLanguage();

  if (works.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-[var(--muted)]">
        <ImageOff className="w-10 h-10 mb-3 opacity-40" />
        <p className="text-sm">{t.photo.no_works}</p>
      </div>
    );
  }

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {works.map((work) => (
          <div key={work.slug} className="break-inside-avoid">
            <PhotoCard work={work} onOpen={setLightboxWork} />
          </div>
        ))}
      </div>

      <AnimatePresence>
        {lightboxWork && (
          <CinematicSlideshow
            work={lightboxWork}
            onClose={() => setLightboxWork(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
