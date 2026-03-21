"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { FadeIn } from "@/components/ui/FadeIn";
import { TimelineRevealCard } from "@/components/ui/timeline-reveal-card";
import { timeline } from "@/data/timeline";
import { cn } from "@/lib/utils";
import type { TimelineEvent } from "@/types";

// ── Popover ────────────────────────────────────────────────────────────────
interface PopoverPos {
  x: number;
  y: number;
  above: boolean;
}

function EventPopover({
  event,
  lang,
  pos,
}: {
  event: TimelineEvent;
  lang: string;
  pos: PopoverPos;
}) {
  const descriptions =
    lang === "zh" && event.descriptionZh
      ? event.descriptionZh
      : event.description;
  const title = lang === "zh" && event.titleZh ? event.titleZh : event.title;
  const company =
    lang === "zh" && event.companyZh ? event.companyZh : event.company;

  return createPortal(
    <motion.div
      initial={{ opacity: 0, y: pos.above ? 8 : -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: pos.above ? 8 : -8, scale: 0.97 }}
      transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        zIndex: 9999,
        width: 300,
      }}
      className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl shadow-black/10 pointer-events-none"
    >
      <div className="flex items-center gap-2 mb-1">
        <p className="text-[10px] font-medium tracking-widest uppercase text-[var(--muted)]">
          {event.year}
        </p>
        {event.freelance && (
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
            {lang === "zh" ? "副業" : "Freelance"}
          </span>
        )}
      </div>
      <h3 className="font-semibold text-[var(--foreground)] mb-0.5 text-sm">
        {title}
      </h3>
      <p className="text-xs text-[var(--accent)] mb-4">{company}</p>
      <ul className="space-y-2">
        {descriptions.map((line, i) => (
          <li
            key={i}
            className="text-xs text-[var(--muted)] flex gap-2 leading-relaxed"
          >
            <span className="mt-1.5 w-1 h-1 rounded-full bg-[var(--accent)] shrink-0" />
            {line}
          </li>
        ))}
      </ul>
      <p className="text-[10px] text-[var(--muted)] mt-4 opacity-60">
        {lang === "zh" ? "點擊查看完整詳情" : "Click to view full details"}
      </p>
    </motion.div>,
    document.body,
  );
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function dotClass(event: TimelineEvent, isHovered: boolean) {
  if (event.freelance)
    return isHovered
      ? "border-emerald-400 bg-emerald-400 text-white"
      : "border-emerald-400/70 bg-[var(--background)] text-emerald-500";
  if (event.type === "work")
    return isHovered
      ? "border-[var(--accent)] bg-[var(--accent)] text-white"
      : "border-[var(--accent)] bg-[var(--background)] text-[var(--accent)]";
  return isHovered
    ? "border-purple-400 bg-purple-400 text-white"
    : "border-purple-400/50 bg-[var(--background)] text-purple-400";
}

function typeColor(event: TimelineEvent) {
  if (event.freelance) return "text-emerald-500";
  if (event.type === "work") return "text-[var(--accent)]";
  return "text-purple-400";
}

function edgeBorderClass(event: TimelineEvent, isLeft: boolean) {
  const side = isLeft ? "border-r-2" : "border-l-2";
  if (event.freelance)
    return `${side} ${isLeft ? "border-r-emerald-400/50" : "border-l-emerald-400/50"}`;
  if (event.type === "work")
    return `${side} ${isLeft ? "border-r-[var(--accent)]/50" : "border-l-[var(--accent)]/50"}`;
  return `${side} ${isLeft ? "border-r-purple-400/40" : "border-l-purple-400/40"}`;
}

// ── Card body ────────────────────────────────────────────────────────────────
function CardBody({
  event,
  title,
  company,
  lang,
  isLeft,
  isAccented,
}: {
  event: TimelineEvent;
  title: string;
  company: string;
  lang: string;
  isLeft: boolean;
  isAccented: boolean;
}) {
  return (
    <div
      className={cn(
        "px-3 py-2 select-none",
        isLeft ? "text-right" : "text-left",
      )}
    >
      {/* Title */}
      <h3
        className={cn(
          "font-semibold text-[12px] leading-snug mb-1",
          isAccented ? "text-white" : "text-[var(--foreground)]",
        )}
      >
        {title}
      </h3>

      {/* Company + logo */}
      <div
        className={cn(
          "flex items-center gap-1.5 mb-1.5",
          isLeft ? "justify-end" : "justify-start",
        )}
      >
        {!isLeft && event.logo && (
          <div className="w-3.5 h-3.5 rounded-sm overflow-hidden bg-white flex items-center justify-center shrink-0 shadow-sm">
            <Image
              src={event.logo}
              alt={event.company}
              width={14}
              height={14}
              className="object-contain w-full h-full"
            />
          </div>
        )}
        <span
          className={cn(
            "text-[11px]",
            isAccented ? "text-white/75" : "text-[var(--muted)]",
          )}
        >
          {company}
        </span>
        {isLeft && event.logo && (
          <div className="w-3.5 h-3.5 rounded-sm overflow-hidden bg-white flex items-center justify-center shrink-0 shadow-sm">
            <Image
              src={event.logo}
              alt={event.company}
              width={14}
              height={14}
              className="object-contain w-full h-full"
            />
          </div>
        )}
      </div>

      {/* Tags */}
      <div
        className={cn(
          "flex flex-wrap gap-1",
          isLeft ? "justify-end" : "justify-start",
        )}
      >
        {event.tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className={cn(
              "text-[9px] font-medium px-1.5 py-px rounded-sm tracking-wide",
              isAccented
                ? "bg-white/15 text-white/80"
                : "bg-[var(--border)] text-[var(--muted)]",
            )}
          >
            {tag}
          </span>
        ))}
        {event.tags.length > 2 && (
          <span
            className={cn(
              "text-[9px] px-1 py-px",
              isAccented ? "text-white/50" : "text-[var(--muted)]",
            )}
          >
            +{event.tags.length - 2}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Spacer info (year + type badge shown in the wide side) ──────────────────
function SpacerInfo({
  event,
  lang,
  align,
}: {
  event: TimelineEvent;
  lang: string;
  align: "left" | "right";
}) {
  const typeLabel = event.freelance
    ? lang === "zh"
      ? "副業"
      : "Side"
    : event.type === "work"
      ? lang === "zh"
        ? "工作"
        : "Work"
      : lang === "zh"
        ? "學歷"
        : "Edu";

  return (
    <div
      className={cn(
        "flex flex-col gap-0.5",
        align === "right" ? "items-start" : "items-end",
      )}
    >
      <span
        className={cn(
          "text-[8px] font-bold tracking-widest uppercase",
          typeColor(event),
        )}
      >
        {typeLabel}
      </span>
      <span className="text-[9px] font-medium tracking-wide text-[var(--muted)] whitespace-nowrap">
        {event.year}
      </span>
    </div>
  );
}

// ── Main section ────────────────────────────────────────────────────────────
export function ExperienceSection() {
  const { t, lang } = useLanguage();
  const e = t.experience;
  const router = useRouter();

  const containerRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [dotPositions, setDotPositions] = useState<{ x: number; y: number }[]>(
    [],
  );

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [popoverPos, setPopoverPos] = useState<PopoverPos>({
    x: 0,
    y: 0,
    above: false,
  });
  const hoveredEvent = timeline.find((ev) => ev.id === hoveredId) ?? null;

  const measureDots = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const cr = container.getBoundingClientRect();
    const positions = dotRefs.current.map((dot) => {
      if (!dot) return { x: 0, y: 0 };
      const r = dot.getBoundingClientRect();
      return {
        x: r.left + r.width / 2 - cr.left,
        y: r.top + r.height / 2 - cr.top,
      };
    });
    setDotPositions(positions);
  }, []);

  useEffect(() => {
    const id = setTimeout(measureDots, 80);
    const observer = new ResizeObserver(measureDots);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
      clearTimeout(id);
      observer.disconnect();
    };
  }, [measureDots]);

  const handleMouseEnter = useCallback(
    (ev: React.MouseEvent<HTMLDivElement>, id: string) => {
      const rect = ev.currentTarget.getBoundingClientRect();
      const pw = 300,
        ph = 230;
      let x = rect.left + rect.width / 2 - pw / 2;
      x = Math.max(8, Math.min(x, window.innerWidth - pw - 8));
      const above = window.innerHeight - rect.bottom < ph + 12;
      const y = above ? rect.top - ph - 8 : rect.bottom + 8;
      setPopoverPos({ x, y, above });
      setHoveredId(id);
    },
    [],
  );

  const handleMouseLeave = useCallback(() => setHoveredId(null), []);
  const handleClick = useCallback(
    (id: string) => router.push(`/experience?id=${id}`),
    [router],
  );

  const buildCurve = (
    p1: { x: number; y: number },
    p2: { x: number; y: number },
  ) => {
    const midY = (p1.y + p2.y) / 2;
    return `M ${p1.x},${p1.y} C ${p1.x},${midY} ${p2.x},${midY} ${p2.x},${p2.y}`;
  };

  return (
    <section
      id="experience"
      className="relative h-screen snap-start snap-always flex flex-col"
    >
      {/* Header */}
      <div className="px-6 pt-14 pb-3 max-w-5xl mx-auto w-full shrink-0">
        <FadeIn>
          <p className="text-xs font-medium tracking-widest uppercase text-[var(--accent)] mb-1">
            {e.label}
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="text-2xl md:text-3xl font-bold">{e.heading}</h2>
        </FadeIn>
      </div>

      {/* Timeline */}
      <div
        ref={containerRef}
        className="flex-1 relative max-w-5xl mx-auto w-full px-6 flex flex-col"
        style={{ paddingBottom: 20 }}
      >
        {/* SVG curves */}
        {dotPositions.length === timeline.length && (
          <svg
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              overflow: "visible",
            }}
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="cg" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.5" />
                <stop
                  offset="100%"
                  stopColor="var(--accent)"
                  stopOpacity="0.1"
                />
              </linearGradient>
            </defs>
            {dotPositions.slice(0, -1).map((pos, i) => (
              <motion.path
                key={i}
                d={buildCurve(pos, dotPositions[i + 1])}
                stroke="url(#cg)"
                strokeWidth={1.5}
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  pathLength: {
                    duration: 0.9,
                    delay: 0.25 + i * 0.1,
                    ease: "easeInOut",
                  },
                  opacity: { duration: 0.2, delay: 0.25 + i * 0.1 },
                }}
              />
            ))}
          </svg>
        )}

        {/* Rows */}
        {timeline.map((event, i) => {
          // isLeft → dot sits in the LEFT third of the row (flex-[1] | dot | flex-[2])
          // isRight → dot sits in the RIGHT third (flex-[2] | dot | flex-[1])
          const isLeft = i % 2 === 0;
          const title =
            lang === "zh" && event.titleZh ? event.titleZh : event.title;
          const company =
            lang === "zh" && event.companyZh ? event.companyZh : event.company;
          const isHovered = hoveredId === event.id;

          const card = (
            <motion.div
              initial={{ opacity: 0, x: isLeft ? -12 : 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-8px" }}
              transition={{
                duration: 0.36,
                delay: i * 0.05,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              onMouseEnter={(ev) => handleMouseEnter(ev, event.id)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(event.id)}
              className="cursor-pointer"
            >
              <TimelineRevealCard
                originX={isLeft ? "100%" : "0%"}
                originY="50%"
                className="rounded-lg w-[188px]"
                base={
                  <div
                    className={cn(
                      "rounded-lg border border-[var(--border)] bg-[var(--card)]",
                      edgeBorderClass(event, isLeft),
                    )}
                  >
                    <CardBody
                      event={event}
                      title={title}
                      company={company}
                      lang={lang}
                      isLeft={isLeft}
                      isAccented={false}
                    />
                  </div>
                }
                overlay={
                  <div className="h-full flex items-center">
                    <CardBody
                      event={event}
                      title={title}
                      company={company}
                      lang={lang}
                      isLeft={isLeft}
                      isAccented={true}
                    />
                  </div>
                }
              />
            </motion.div>
          );

          const dot = (
            <motion.div
              ref={(el) => {
                dotRefs.current[i] = el as HTMLDivElement | null;
              }}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25, delay: i * 0.05 + 0.18 }}
              animate={isHovered ? { scale: 1.22 } : { scale: 1 }}
              className={cn(
                "relative z-10 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[7px] font-bold shrink-0 transition-colors duration-200",
                dotClass(event, isHovered),
              )}
            >
              {event.freelance ? "F" : event.type === "work" ? "W" : "E"}
            </motion.div>
          );

          const info = (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 + 0.1 }}
            >
              <SpacerInfo
                event={event}
                lang={lang}
                align={isLeft ? "right" : "left"}
              />
            </motion.div>
          );

          return (
            <div key={event.id} className="flex-1 flex items-center gap-2">
              {isLeft ? (
                <>
                  {/* card in narrow left third → hugs toward dot */}
                  <div className="flex-[1] flex justify-end min-w-0 pr-2">
                    {card}
                  </div>
                  {dot}
                  {/* info in wide right two-thirds */}
                  <div className="flex-[2] pl-3">{info}</div>
                </>
              ) : (
                <>
                  {/* info in wide left two-thirds */}
                  <div className="flex-[2] flex justify-end pr-3">{info}</div>
                  {dot}
                  {/* card in narrow right third → hugs toward dot */}
                  <div className="flex-[1] flex justify-start min-w-0 pl-2">
                    {card}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Popover */}
      <AnimatePresence>
        {hoveredEvent && (
          <EventPopover event={hoveredEvent} lang={lang} pos={popoverPos} />
        )}
      </AnimatePresence>
    </section>
  );
}
