"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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
  const [direction, setDirection] = useState(0);
  const hasMultiple = work.images.length > 1;
  const touchStartX = useRef<number | null>(null);

  const prev = useCallback(() => {
    setDirection(-1);
    setIndex((i) => (i - 1 + work.images.length) % work.images.length);
  }, [work.images.length]);

  const next = useCallback(() => {
    setDirection(1);
    setIndex((i) => (i + 1) % work.images.length);
  }, [work.images.length]);

  const goTo = useCallback((i: number, current: number) => {
    setDirection(i > current ? 1 : -1);
    setIndex(i);
  }, []);

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
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40 && hasMultiple) {
      delta < 0 ? next() : prev();
    }
    touchStartX.current = null;
  };

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 48 : -48 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -48 : 48 }),
  };

  return (
    <motion.div
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/92 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl mx-4 max-h-screen">
        {/* Top bar: counter + close */}
        <div className="absolute top-0 left-0 right-0 -translate-y-12 flex items-center justify-between px-1">
          {hasMultiple ? (
            <span className="text-white/50 text-xs font-mono tracking-wider">
              {index + 1} / {work.images.length}
            </span>
          ) : (
            <span />
          )}
          <button
            onClick={onClose}
            className="p-2 text-white/50 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image */}
        <div
          className="relative w-full overflow-hidden"
          style={{ maxHeight: "70vh" }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative w-full"
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
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/40 rounded-full text-white/70 hover:text-white hover:bg-black/60 transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail strip */}
        {hasMultiple && (
          <div className="flex gap-2 mt-3">
            {work.images.map((src, i) => (
              <button
                key={i}
                onClick={() => goTo(i, index)}
                aria-label={`Photo ${i + 1}`}
                className={[
                  "relative w-14 h-14 rounded-md overflow-hidden shrink-0 transition-all duration-150",
                  i === index
                    ? "ring-2 ring-white opacity-100"
                    : "opacity-40 hover:opacity-70",
                ].join(" ")}
              >
                <Image
                  src={img(src)}
                  alt={`${work.title} ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Meta */}
        <div className="mt-3 w-full flex items-center justify-between px-1">
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
      </div>
    </motion.div>
  );
}
