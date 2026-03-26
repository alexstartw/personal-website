"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MapPin,
  Camera,
  User,
  Play,
  Pause,
} from "lucide-react";
import type { PhotoWork } from "@/types/photo";
import { img } from "@/lib/utils";

// ── Metadata bar ──────────────────────────────────────────────────────────────
function MetaBar({ work, uiVisible }: { work: PhotoWork; uiVisible: boolean }) {
  const hasCredits =
    work.model || work.location || work.camera || work.lens || work.igUrl;

  return (
    <motion.div
      animate={{ opacity: uiVisible ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none"
      style={{
        background:
          "linear-gradient(to top, rgba(8,8,6,0.90) 0%, rgba(8,8,6,0.55) 55%, transparent 100%)",
        paddingTop: "5rem",
        paddingBottom: "1.75rem",
        paddingLeft: "2rem",
        paddingRight: "2rem",
      }}
    >
      <div
        className="pointer-events-auto flex flex-col md:flex-row md:items-end md:justify-between gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: title block */}
        <div className="min-w-0">
          <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#c8a882] mb-1">
            {work.category}
          </p>
          <h2 className="text-white text-xl font-medium leading-tight">
            {work.title}
          </h2>
          {work.subject && (
            <p className="text-[#888] text-sm mt-0.5">{work.subject}</p>
          )}
          {work.description && (
            <p className="text-[#666] text-xs mt-1 max-w-xs leading-relaxed">
              {work.description}
            </p>
          )}
        </div>

        {/* Right: credits */}
        {hasCredits && (
          <div className="flex flex-col gap-2 md:items-end shrink-0">
            {work.model && (
              <div className="flex items-center gap-1.5">
                <User
                  className="w-3 h-3 text-[#555] shrink-0"
                  strokeWidth={1.5}
                />
                {work.model.ig ? (
                  <a
                    href={work.model.ig}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-[#aaa] hover:text-white transition-colors flex items-center gap-1 group"
                  >
                    {work.model.name}
                    <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-60 transition-opacity" />
                  </a>
                ) : (
                  <span className="text-xs font-mono text-[#aaa]">
                    {work.model.name}
                  </span>
                )}
              </div>
            )}
            {work.location && (
              <div className="flex items-center gap-1.5">
                <MapPin
                  className="w-3 h-3 text-[#555] shrink-0"
                  strokeWidth={1.5}
                />
                {work.location.ig ? (
                  <a
                    href={work.location.ig}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-[#aaa] hover:text-white transition-colors flex items-center gap-1 group"
                  >
                    {work.location.name}
                    <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-60 transition-opacity" />
                  </a>
                ) : (
                  <span className="text-xs font-mono text-[#aaa]">
                    {work.location.name}
                  </span>
                )}
              </div>
            )}
            {(work.camera || work.lens) && (
              <div className="flex items-center gap-1.5">
                <Camera
                  className="w-3 h-3 text-[#555] shrink-0"
                  strokeWidth={1.5}
                />
                <span className="text-xs font-mono text-[#666]">
                  {[work.camera, work.lens].filter(Boolean).join(" · ")}
                </span>
              </div>
            )}
            {work.igUrl && (
              <a
                href={work.igUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-mono text-[#c8a882] hover:text-[#e0c8aa] transition-colors mt-1"
              >
                <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
                View on Instagram
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
interface CinematicSlideshowProps {
  work: PhotoWork;
  onClose: () => void;
}

export function CinematicSlideshow({ work, onClose }: CinematicSlideshowProps) {
  const images = work.images.slice(0, 3).map(img);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [uiVisible, setUiVisible] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const autoPlayTimer = useRef<ReturnType<typeof setInterval> | undefined>(
    undefined,
  );
  const isTouch = useRef(false);

  const go = useCallback(
    (delta: number) => {
      setDirection(delta);
      setIndex((i) => (i + delta + images.length) % images.length);
    },
    [images.length],
  );

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, go]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Detect touch device
  useEffect(() => {
    isTouch.current = "ontouchstart" in window;
  }, []);

  // Auto-hide UI chrome on mouse idle (skip on touch)
  const showUI = useCallback(() => {
    setUiVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (!isTouch.current) {
      hideTimer.current = setTimeout(() => setUiVisible(false), 3000);
    }
  }, []);

  useEffect(() => {
    showUI();
    window.addEventListener("mousemove", showUI);
    return () => {
      window.removeEventListener("mousemove", showUI);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [showUI]);

  // Auto-play
  useEffect(() => {
    if (autoPlay && images.length > 1) {
      autoPlayTimer.current = setInterval(() => go(1), 4000);
    }
    return () => {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
    };
  }, [autoPlay, go, images.length]);

  // Pause auto-play on manual navigation
  const navigate = useCallback(
    (delta: number) => {
      setAutoPlay(false);
      go(delta);
    },
    [go],
  );

  // Touch swipe
  const dragStart = useRef(0);
  const onTouchStart = (e: React.TouchEvent) => {
    dragStart.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const delta = dragStart.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 60) navigate(delta > 0 ? 1 : -1);
  };

  const variants = {
    enter: (d: number) => ({ opacity: 0, scale: 1.03 }),
    center: { opacity: 1, scale: 1 },
    exit: (d: number) => ({ opacity: 0, scale: 0.97 }),
  };

  return (
    <motion.div
      className="fixed inset-0 z-[1000] bg-[#080806] flex items-center justify-center cursor-pointer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <motion.div
        animate={{ opacity: uiVisible ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 py-4 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(8,8,6,0.7) 0%, transparent 100%)",
        }}
      >
        {/* Frame counter */}
        <span className="font-mono text-[11px] tracking-[0.3em] text-[#444] pointer-events-none select-none">
          F-{String(index + 1).padStart(2, "0")} /{" "}
          {String(images.length).padStart(2, "0")}
        </span>

        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Auto-play toggle */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setAutoPlay((p) => !p);
              }}
              className="p-1.5 text-white/25 hover:text-white/70 transition-colors"
              aria-label={autoPlay ? "Pause" : "Auto-play"}
            >
              {autoPlay ? (
                <Pause className="w-3.5 h-3.5" strokeWidth={1.5} />
              ) : (
                <Play className="w-3.5 h-3.5" strokeWidth={1.5} />
              )}
            </button>
          )}

          {/* Close */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-1.5 text-white/25 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* ── Image ───────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full h-full flex items-center justify-center cursor-default">
        <AnimatePresence custom={direction} mode="sync">
          <motion.div
            key={index}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0 flex items-center justify-center"
            style={{ paddingBottom: "5rem", paddingTop: "3rem" }}
          >
            <div className="relative w-full h-full">
              <Image
                src={images[index]}
                alt={`${work.title} ${index + 1}`}
                fill
                className="object-contain"
                priority={index === 0}
                sizes="100vw"
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Nav arrows ──────────────────────────────────────────────────── */}
      {images.length > 1 && (
        <>
          <motion.button
            animate={{ opacity: uiVisible ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(-1);
            }}
            className="absolute left-0 top-0 bottom-0 z-20 w-[15vw] max-w-[100px] flex items-center justify-start pl-4
                       text-white/20 hover:text-white/70 transition-colors group"
          >
            <ChevronLeft
              className="w-6 h-6 transform group-hover:-translate-x-0.5 transition-transform"
              strokeWidth={1.5}
            />
          </motion.button>

          <motion.button
            animate={{ opacity: uiVisible ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(1);
            }}
            className="absolute right-0 top-0 bottom-0 z-20 w-[15vw] max-w-[100px] flex items-center justify-end pr-4
                       text-white/20 hover:text-white/70 transition-colors group"
          >
            <ChevronRight
              className="w-6 h-6 transform group-hover:translate-x-0.5 transition-transform"
              strokeWidth={1.5}
            />
          </motion.button>
        </>
      )}

      {/* ── Dot indicators ──────────────────────────────────────────────── */}
      {images.length > 1 && (
        <motion.div
          animate={{ opacity: uiVisible ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="absolute z-20 flex gap-2"
          style={{ bottom: "6.5rem" }}
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setAutoPlay(false);
                setDirection(i - index);
                setIndex(i);
              }}
              className={`w-1 h-1 rounded-full transition-all duration-300 ${
                i === index
                  ? "bg-[#c8a882] w-3"
                  : "bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </motion.div>
      )}

      {/* ── Metadata bar ────────────────────────────────────────────────── */}
      <MetaBar work={work} uiVisible={uiVisible} />
    </motion.div>
  );
}
