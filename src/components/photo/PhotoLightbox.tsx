"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import type { PhotoWork } from "@/types/photo";
import { img } from "@/lib/utils";

interface PhotoLightboxProps {
  work: PhotoWork;
  initialIndex?: number;
  onClose: () => void;
}

export function PhotoLightbox({
  work,
  initialIndex = 0,
  onClose,
}: PhotoLightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const hasMultiple = work.images.length > 1;

  const prev = useCallback(
    () => setIndex((i) => (i - 1 + work.images.length) % work.images.length),
    [work.images.length],
  );
  const next = useCallback(
    () => setIndex((i) => (i + 1) % work.images.length),
    [work.images.length],
  );

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasMultiple) prev();
      if (e.key === "ArrowRight" && hasMultiple) next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, prev, next, hasMultiple]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/92 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl mx-4 max-h-screen">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-0 right-0 -translate-y-12 p-2 text-white/60 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image */}
        <div className="relative w-full" style={{ maxHeight: "70vh" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="relative w-full h-full"
              style={{ maxHeight: "70vh" }}
            >
              <Image
                src={img(work.images[index])}
                alt={work.title}
                width={1200}
                height={800}
                className="object-contain w-full rounded-lg"
                style={{ maxHeight: "70vh" }}
                priority
              />
            </motion.div>
          </AnimatePresence>

          {/* Prev / Next */}
          {hasMultiple && (
            <>
              <button
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/40 rounded-full text-white/70 hover:text-white hover:bg-black/60 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/40 rounded-full text-white/70 hover:text-white hover:bg-black/60 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Meta */}
        <div className="mt-4 w-full flex items-center justify-between px-1">
          <div>
            <p className="text-white font-medium">{work.title}</p>
            {work.subject && (
              <p className="text-white/50 text-sm mt-0.5">{work.subject}</p>
            )}
            {work.description && (
              <p className="text-white/40 text-sm mt-1 max-w-md">
                {work.description}
              </p>
            )}
          </div>
          {work.igUrl && (
            <a
              href={work.igUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/20 text-white/70 hover:text-white hover:border-white/40 text-sm transition-colors shrink-0 ml-4"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Instagram
            </a>
          )}
        </div>

        {/* Dots */}
        {hasMultiple && (
          <div className="flex gap-1.5 mt-3">
            {work.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === index ? "bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
