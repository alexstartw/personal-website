"use client";

import * as React from "react";
import {
  motion,
  AnimatePresence,
  type PanInfo,
  type Transition,
} from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type FocusRailItem = {
  id: string | number;
  title: string;
  description?: string;
  imageSrc: string;
  href?: string;
  meta?: string;
};

interface FocusRailProps {
  items: FocusRailItem[];
  initialIndex?: number;
  loop?: boolean;
  autoPlay?: boolean;
  interval?: number;
  className?: string;
}

function wrap(min: number, max: number, v: number) {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

const BASE_SPRING: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 1,
};
const TAP_SPRING: Transition = {
  type: "spring",
  stiffness: 450,
  damping: 18,
  mass: 1,
};

export function FocusRail({
  items,
  initialIndex = 0,
  loop = true,
  autoPlay = true,
  interval = 4000,
  className,
}: FocusRailProps) {
  const router = useRouter();
  const [active, setActive] = React.useState(initialIndex);
  const [isHovering, setIsHovering] = React.useState(false);
  const lastWheelTime = React.useRef<number>(0);

  const count = items.length;
  const activeIndex = wrap(0, count, active);
  const activeItem = items[activeIndex];

  const handlePrev = React.useCallback(() => {
    if (!loop && active === 0) return;
    setActive((p) => p - 1);
  }, [loop, active]);

  const handleNext = React.useCallback(() => {
    if (!loop && active === count - 1) return;
    setActive((p) => p + 1);
  }, [loop, active, count]);

  const onWheel = React.useCallback(
    (e: React.WheelEvent) => {
      const now = Date.now();
      if (now - lastWheelTime.current < 400) return;
      const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      const delta = isHorizontal ? e.deltaX : e.deltaY;
      if (Math.abs(delta) > 20) {
        delta > 0 ? handleNext() : handlePrev();
        lastWheelTime.current = now;
      }
    },
    [handleNext, handlePrev],
  );

  React.useEffect(() => {
    if (!autoPlay || isHovering) return;
    const timer = setInterval(() => handleNext(), interval);
    return () => clearInterval(timer);
  }, [autoPlay, isHovering, handleNext, interval]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrev();
    if (e.key === "ArrowRight") handleNext();
  };

  const swipePower = (offset: number, velocity: number) =>
    Math.abs(offset) * velocity;

  const onDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    { offset, velocity }: PanInfo,
  ) => {
    const swipe = swipePower(offset.x, velocity.x);
    if (swipe < -10000) handleNext();
    else if (swipe > 10000) handlePrev();
  };

  const visibleOffsets = [-2, -1, 0, 1, 2];

  return (
    <div
      className={[
        "relative flex h-full w-full flex-col overflow-hidden select-none outline-none",
        className ?? "",
      ].join(" ")}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onWheel={onWheel}
    >
      {/* Background ambience blur */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`bg-${activeItem.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeItem.imageSrc}
              alt=""
              className="h-full w-full object-cover blur-3xl saturate-150 scale-110"
              style={{ opacity: 0.18 }}
            />
          </motion.div>
        </AnimatePresence>
        {/* Fade to background at edges */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, var(--background) 0%, transparent 30%, transparent 70%, var(--background) 100%)",
          }}
        />
      </div>

      {/* Draggable card rail */}
      <div className="relative z-10 flex flex-1 flex-col justify-center">
        <motion.div
          className="relative mx-auto flex h-[300px] w-full max-w-5xl items-center justify-center cursor-grab active:cursor-grabbing"
          style={{ perspective: "1200px" }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={onDragEnd}
        >
          {visibleOffsets.map((offset) => {
            const absIndex = active + offset;
            const index = wrap(0, count, absIndex);
            const item = items[index];

            if (!loop && (absIndex < 0 || absIndex >= count)) return null;

            const isCenter = offset === 0;
            const dist = Math.abs(offset);
            const xOffset = offset * 320;
            const zOffset = -dist * 140;
            const scale = isCenter ? 1 : 0.82;
            const rotateY = offset * -18;
            const opacity = isCenter ? 1 : Math.max(0.08, 1 - dist * 0.52);
            const blur = isCenter ? 0 : dist * 5;
            const brightness = isCenter ? 1 : 0.45;

            return (
              <motion.div
                key={absIndex}
                className={[
                  "absolute rounded-xl overflow-hidden border border-[var(--border)]",
                  "bg-[var(--card)] shadow-lg",
                  isCenter ? "z-20" : "z-10",
                ].join(" ")}
                style={{
                  width: 280,
                  aspectRatio: "4/3",
                  transformStyle: "preserve-3d",
                  cursor: isCenter && item.href ? "pointer" : undefined,
                }}
                initial={false}
                animate={{
                  x: xOffset,
                  z: zOffset,
                  scale,
                  rotateY,
                  opacity,
                  filter: `blur(${blur}px) brightness(${brightness})`,
                }}
                transition={isCenter ? TAP_SPRING : BASE_SPRING}
                onClick={() => {
                  if (offset !== 0) setActive((p) => p + offset);
                  else if (item.href) router.push(item.href);
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageSrc}
                  alt={item.title}
                  className="h-full w-full object-cover pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/8 to-transparent pointer-events-none" />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Info + Controls */}
        <div className="mx-auto mt-8 flex w-full max-w-3xl flex-col items-center justify-between gap-5 px-6 md:flex-row pointer-events-auto">
          {/* Text info */}
          <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left h-24 justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem.id}
                initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                transition={{ duration: 0.28 }}
                className="space-y-1.5"
              >
                {activeItem.meta && (
                  <span
                    className="text-[10px] font-mono tracking-[0.16em] uppercase"
                    style={{ color: "var(--accent)" }}
                  >
                    {activeItem.meta}
                  </span>
                )}
                <h2
                  className="text-xl font-bold tracking-tight leading-snug"
                  style={{ color: "var(--foreground)" }}
                >
                  {activeItem.title}
                </h2>
                {activeItem.description && (
                  <p
                    className="text-sm leading-relaxed line-clamp-2 max-w-sm"
                    style={{ color: "var(--muted)" }}
                  >
                    {activeItem.description}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-0.5 rounded-full p-1 border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-sm">
              <button
                onClick={handlePrev}
                className="rounded-full p-2 text-[var(--muted)] transition hover:bg-[var(--border)] hover:text-[var(--foreground)] active:scale-95"
                aria-label="Previous"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="min-w-[36px] text-center text-[10px] font-mono text-[var(--muted)]">
                {activeIndex + 1} / {count}
              </span>
              <button
                onClick={handleNext}
                className="rounded-full p-2 text-[var(--muted)] transition hover:bg-[var(--border)] hover:text-[var(--foreground)] active:scale-95"
                aria-label="Next"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {activeItem.href && (
              <Link
                href={activeItem.href}
                className="group flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-xs font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                Read
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
