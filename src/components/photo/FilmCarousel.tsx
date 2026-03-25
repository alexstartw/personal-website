"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ExternalLink, MapPin, Camera, User } from "lucide-react";
import type { PhotoWork } from "@/types/photo";

// ── Film sprocket holes ──────────────────────────────────────────────────────
function SprocketStrip({ side }: { side: "left" | "right" }) {
  return (
    <div
      className={`flex flex-col justify-around py-2 px-1 bg-[#111] ${
        side === "left" ? "border-r" : "border-l"
      } border-[#2a2a2a]`}
      style={{ width: 20 }}
    >
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="rounded-sm bg-[#2a2a2a]"
          style={{ width: 10, height: 7 }}
        />
      ))}
    </div>
  );
}

// ── Info row helper ──────────────────────────────────────────────────────────
function InfoRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-3.5 h-3.5 text-[#888] mt-0.5 shrink-0" strokeWidth={1.6} />
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-widest text-[#555] font-mono">{label}</p>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#ccc] hover:text-white transition-colors flex items-center gap-1 group"
          >
            {value}
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />
          </a>
        ) : (
          <p className="text-sm text-[#ccc]">{value}</p>
        )}
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
interface FilmCarouselProps {
  work: PhotoWork;
  onClose: () => void;
}

export function FilmCarousel({ work, onClose }: FilmCarouselProps) {
  const images = work.images.slice(0, 3);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const go = useCallback(
    (delta: number) => {
      setDirection(delta);
      setIndex((i) => (i + delta + images.length) % images.length);
    },
    [images.length],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, go]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const hasInfo =
    work.model || work.location || work.camera || work.lens || work.igUrl;

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <motion.div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 p-2 text-white/40 hover:text-white transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Layout: carousel + info panel */}
      <div
        className="relative z-10 flex flex-col lg:flex-row items-center gap-8 w-full max-w-5xl mx-4 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Film strip ─────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center shrink-0">
          {/* Frame counter */}
          <p className="text-[10px] font-mono text-[#444] tracking-widest mb-2">
            {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
          </p>

          {/* Film strip with sprocket holes */}
          <div className="flex" style={{ height: "min(65vh, 520px)" }}>
            <SprocketStrip side="left" />

            {/* Photo area */}
            <div className="relative bg-[#0d0d0d] overflow-hidden" style={{ width: "min(56vw, 380px)" }}>
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={index}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.28, ease: [0.32, 0, 0.67, 0] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={images[index]}
                    alt={`${work.title} ${index + 1}`}
                    fill
                    className="object-contain"
                    priority={index === 0}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <SprocketStrip side="right" />
          </div>

          {/* Navigation */}
          {images.length > 1 && (
            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={() => go(-1)}
                className="p-2 text-white/30 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setDirection(i - index); setIndex(i); }}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      i === index ? "bg-white" : "bg-white/20"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => go(1)}
                className="p-2 text-white/30 hover:text-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* ── Info panel ──────────────────────────────────────────────────── */}
        {hasInfo && (
          <div className="flex flex-col gap-5 lg:w-56 w-full overflow-y-auto max-h-[30vh] lg:max-h-[65vh] shrink-0">
            {/* Title */}
            <div className="border-b border-white/10 pb-4">
              <p className="text-xs font-mono tracking-widest text-[#555] uppercase">
                {work.category}
              </p>
              <h2 className="text-white font-medium mt-1">{work.title}</h2>
              {work.subject && (
                <p className="text-[#666] text-sm mt-0.5">{work.subject}</p>
              )}
            </div>

            {/* Meta rows */}
            <div className="flex flex-col gap-4">
              {work.model && (
                <InfoRow
                  icon={User}
                  label="Model"
                  value={work.model.name}
                  href={work.model.ig}
                />
              )}
              {work.location && (
                <InfoRow
                  icon={MapPin}
                  label="Location"
                  value={work.location.name}
                  href={work.location.ig}
                />
              )}
              {(work.camera || work.lens) && (
                <div className="flex items-start gap-3">
                  <Camera className="w-3.5 h-3.5 text-[#888] mt-0.5 shrink-0" strokeWidth={1.6} />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#555] font-mono">Camera</p>
                    {work.camera && <p className="text-sm text-[#ccc]">{work.camera}</p>}
                    {work.lens && <p className="text-sm text-[#666]">{work.lens}</p>}
                  </div>
                </div>
              )}
            </div>

            {/* IG link */}
            {work.igUrl && (
              <a
                href={work.igUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/30 text-sm transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Instagram post
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
