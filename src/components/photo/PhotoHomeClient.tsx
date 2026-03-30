"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { Camera, Star, ImageOff, Instagram } from "lucide-react";
import type { PhotoWork } from "@/types/photo";
import { img } from "@/lib/utils";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

const PHOTOGRAPHER_IG = "https://www.instagram.com/yu_._photographer/";
const PHOTOGRAPHER_IG_HANDLE = "@yu_._photographer";

interface CategoryCardProps {
  label: string;
  href: string;
  icon: React.ElementType;
  count: number;
  coverImage?: string;
  viewGalleryLabel: string;
}

function CategoryCard({
  label,
  href,
  icon: Icon,
  count,
  coverImage,
  viewGalleryLabel,
}: CategoryCardProps) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] aspect-[4/5]"
      onClick={() => router.push(href)}
    >
      {/* Background image */}
      {coverImage && !imgError ? (
        <Image
          src={coverImage}
          alt={label}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-60"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <ImageOff className="w-10 h-10 text-[var(--border)]" />
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="flex items-center gap-2 mb-1">
          <Icon className="w-4 h-4 text-[var(--accent)]" strokeWidth={1.8} />
          <span className="text-xs font-mono text-[var(--accent)] tracking-widest uppercase">
            {count} {count === 1 ? "work" : "works"}
          </span>
        </div>
        <h2 className="text-2xl font-semibold text-white">{label}</h2>
        <div className="mt-3 flex items-center gap-1.5 text-white/60 text-sm group-hover:text-white/90 transition-colors duration-300">
          {viewGalleryLabel}
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </div>
      </div>
    </motion.div>
  );
}

interface PhotoHomeClientProps {
  portraitWorks: PhotoWork[];
  coserWorks: PhotoWork[];
  portraitCoverSrc?: string;
  coserCoverSrc?: string;
}

export function PhotoHomeClient({
  portraitWorks,
  coserWorks,
  portraitCoverSrc,
  coserCoverSrc,
}: PhotoHomeClientProps) {
  const { t } = useLanguage();
  const portraitCover =
    portraitCoverSrc ??
    (portraitWorks[0]?.images[0] ? img(portraitWorks[0].images[0]) : undefined);
  const coserCover =
    coserCoverSrc ??
    (coserWorks[0]?.images[0] ? img(coserWorks[0].images[0]) : undefined);

  return (
    <div className="min-h-screen pt-14 flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-xs font-mono tracking-[0.2em] uppercase text-[var(--accent)] mb-4"
        >
          {t.photo.label}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl md:text-7xl font-light tracking-tight text-[var(--foreground)] mb-4"
        >
          Alex Lin
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-[var(--muted)] text-base max-w-sm"
        >
          {t.photo.subtitle}
        </motion.p>
      </div>

      {/* Category cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="max-w-3xl mx-auto w-full px-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <CategoryCard
          label={t.photo.portrait}
          href="/photo/portrait"
          icon={Camera}
          count={portraitWorks.length}
          coverImage={portraitCover}
          viewGalleryLabel={t.photo.view_gallery}
        />
        <CategoryCard
          label={t.photo.coser}
          href="/photo/coser"
          icon={Star}
          count={coserWorks.length}
          coverImage={coserCover}
          viewGalleryLabel={t.photo.view_gallery}
        />
      </motion.div>

      {/* Instagram CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.65 }}
        className="max-w-3xl mx-auto w-full px-6 pb-16 mt-6"
      >
        <a
          href={PHOTOGRAPHER_IG}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between w-full px-6 py-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent)]/40 transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#f9a825] via-[#e91e8c] to-[#9c27b0] flex items-center justify-center shrink-0">
              <Instagram className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">
                {t.photo.ig_cta_title}
              </p>
              <p className="text-xs text-[var(--muted)] mt-0.5">
                {PHOTOGRAPHER_IG_HANDLE}
              </p>
            </div>
          </div>
          <span className="text-xs text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors duration-200">
            {t.photo.ig_cta_button}
          </span>
        </a>
      </motion.div>
    </div>
  );
}
