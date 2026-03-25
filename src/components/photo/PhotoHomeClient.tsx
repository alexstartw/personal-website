"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { Camera, Star, ImageOff } from "lucide-react";
import type { PhotoWork } from "@/types/photo";
import { useState } from "react";

interface CategoryCardProps {
  label: string;
  href: string;
  icon: React.ElementType;
  count: number;
  coverImage?: string;
}

function CategoryCard({
  label,
  href,
  icon: Icon,
  count,
  coverImage,
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
          View gallery
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
}

export function PhotoHomeClient({
  portraitWorks,
  coserWorks,
}: PhotoHomeClientProps) {
  const portraitCover = portraitWorks[0]?.images[0];
  const coserCover = coserWorks[0]?.images[0];

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
          Photography
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
          Portrait & Cosplay Photography — Taipei, Taiwan
        </motion.p>
      </div>

      {/* Category cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="max-w-3xl mx-auto w-full px-6 pb-16 grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <CategoryCard
          label="Portrait"
          href="/photo/portrait"
          icon={Camera}
          count={portraitWorks.length}
          coverImage={portraitCover}
        />
        <CategoryCard
          label="Coser"
          href="/photo/coser"
          icon={Star}
          count={coserWorks.length}
          coverImage={coserCover}
        />
      </motion.div>
    </div>
  );
}
