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
interface PopoverPos { x: number; y: number; above: boolean }

function EventPopover({ event, lang, pos }: { event: TimelineEvent; lang: string; pos: PopoverPos }) {
  const descriptions = lang === "zh" && event.descriptionZh ? event.descriptionZh : event.description;
  const title   = lang === "zh" && event.titleZh   ? event.titleZh   : event.title;
  const company = lang === "zh" && event.companyZh ? event.companyZh : event.company;

  return createPortal(
    <motion.div
      initial={{ opacity: 0, y: pos.above ? 8 : -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: pos.above ? 8 : -8, scale: 0.97 }}
      transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
      style={{ position: "fixed", left: pos.x, top: pos.y, zIndex: 9999, width: 300 }}
      className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl shadow-black/10 pointer-events-none"
    >
      <div className="flex items-center gap-2 mb-1">
        <p className="text-[10px] font-medium tracking-widest uppercase text-[var(--muted)]">{event.year}</p>
        {event.freelance && (
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
            {lang === "zh" ? "副業" : "Freelance"}
          </span>
        )}
      </div>
      <h3 className="font-semibold text-[var(--foreground)] mb-0.5 text-sm">{title}</h3>
      <p className="text-xs text-[var(--accent)] mb-4">{company}</p>
      <ul className="space-y-2">
        {descriptions.map((line, i) => (
          <li key={i} className="text-xs text-[var(--muted)] flex gap-2 leading-relaxed">
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

// ── Dot ────────────────────────────────────────────────────────────────────
function dotClass(event: TimelineEvent, isHovered: boolean) {
  if (event.freelance) return isHovered
    ? "border-emerald-400 bg-emerald-400 text-white"
    : "border-emerald-400/70 bg-[var(--background)] text-emerald-500";
  if (event.type === "work") return isHovered
    ? "border-[var(--accent)] bg-[var(--accent)] text-white"
    : "border-[var(--accent)] bg-[var(--background)] text-[var(--accent)]";
  return isHovered
    ? "border-[var(--muted)] bg-[var(--muted)] text-white"
    : "border-[var(--border)] bg-[var(--background)] text-[var(--muted)]";
}

// ── Card content ────────────────────────────────────────────────────────────
function CardBody({
  event, title, company, lang, isLeft, isAccented,
}: {
  event: TimelineEvent; title: string; company: string;
  lang: string; isLeft: boolean; isAccented: boolean;
}) {
  const isFreelance = event.freelance === true;

  return (
    <div className={cn("py-2 px-3 select-none", isLeft ? "text-right" : "text-left")}>
      {/* Year row */}
      <div className={cn("flex items-center gap-1.5 mb-1", isLeft ? "justify-end" : "justify-start")}>
        <span className={cn(
          "text-[9px] font-semibold tracking-[0.15em] uppercase",
          isAccented ? "text-white/60" : "text-[var(--muted)]",
        )}>
          {event.year}
        </span>
        {isFreelance && (
          <span className={cn(
            "text-[8px] font-bold px-1.5 py-px rounded-full tracking-widest uppercase",
            isAccented ? "bg-white/20 text-white" : "bg-emerald-500/10 text-emerald-500",
          )}>
            {lang === "zh" ? "副業" : "Side"}
          </span>
        )}
        <span className={cn(
          "text-[8px] font-semibold px-1.5 py-px rounded-full tracking-widest uppercase",
          isAccented
            ? "bg-white/15 text-white/70"
            : event.type === "work"
              ? "bg-[var(--accent)]/10 text-[var(--accent)]"
              : "bg-[var(--border)] text-[var(--muted)]",
        )}>
          {event.type === "work"
            ? (lang === "zh" ? "工作" : "Work")
            : (lang === "zh" ? "學歷" : "Edu")}
        </span>
      </div>

      {/* Title */}
      <h3 className={cn(
        "font-bold text-sm leading-tight mb-1",
        isAccented ? "text-white" : "text-[var(--foreground)]",
      )}>
        {title}
      </h3>

      {/* Company + logo */}
      <div className={cn("flex items-center gap-1.5 mb-2", isLeft ? "justify-end" : "justify-start")}>
        {!isLeft && event.logo && (
          <div className="w-4 h-4 rounded-sm overflow-hidden bg-white flex items-center justify-center shrink-0 shadow-sm">
            <Image src={event.logo} alt={event.company} width={16} height={16} className="object-contain w-full h-full" />
          </div>
        )}
        <span className={cn(
          "text-[11px] font-medium",
          isAccented ? "text-white/80" : "text-[var(--muted)]",
        )}>
          {company}
        </span>
        {isLeft && event.logo && (
          <div className="w-4 h-4 rounded-sm overflow-hidden bg-white flex items-center justify-center shrink-0 shadow-sm">
            <Image src={event.logo} alt={event.company} width={16} height={16} className="object-contain w-full h-full" />
          </div>
        )}
      </div>

      {/* Tags — dot style */}
      <div className={cn("flex flex-wrap gap-1", isLeft ? "justify-end" : "justify-start")}>
        {event.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className={cn(
              "text-[9px] font-medium px-1.5 py-0.5 rounded-sm tracking-wide",
              isAccented
                ? "bg-white/15 text-white/80"
                : "bg-[var(--border)] text-[var(--muted)]",
            )}
          >
            {tag}
          </span>
        ))}
        {event.tags.length > 3 && (
          <span className={cn(
            "text-[9px] font-medium px-1.5 py-0.5 rounded-sm",
            isAccented ? "text-white/60" : "text-[var(--muted)]",
          )}>
            +{event.tags.length - 3}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Main section ───────────────────────────────────────────────────────────
export function ExperienceSection() {
  const { t, lang } = useLanguage();
  const e = t.experience;
  const router = useRouter();

  const containerRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [dotPositions, setDotPositions] = useState<{ x: number; y: number }[]>([]);

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [popoverPos, setPopoverPos] = useState<PopoverPos>({ x: 0, y: 0, above: false });
  const hoveredEvent = timeline.find((ev) => ev.id === hoveredId) ?? null;

  const measureDots = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const positions = dotRefs.current.map((dot) => {
      if (!dot) return { x: 0, y: 0 };
      const rect = dot.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2 - containerRect.left,
        y: rect.top + rect.height / 2 - containerRect.top,
      };
    });
    setDotPositions(positions);
  }, []);

  useEffect(() => {
    const id = setTimeout(measureDots, 80);
    const observer = new ResizeObserver(measureDots);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => { clearTimeout(id); observer.disconnect(); };
  }, [measureDots]);

  const handleMouseEnter = useCallback((ev: React.MouseEvent<HTMLDivElement>, id: string) => {
    const rect = ev.currentTarget.getBoundingClientRect();
    const pw = 300, ph = 230;
    let x = rect.left + rect.width / 2 - pw / 2;
    x = Math.max(8, Math.min(x, window.innerWidth - pw - 8));
    const above = window.innerHeight - rect.bottom < ph + 12;
    const y = above ? rect.top - ph - 8 : rect.bottom + 8;
    setPopoverPos({ x, y, above });
    setHoveredId(id);
  }, []);

  const handleMouseLeave = useCallback(() => setHoveredId(null), []);
  const handleClick = useCallback((id: string) => router.push(`/experience/${id}`), [router]);

  const buildCurve = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    const midY = (p1.y + p2.y) / 2;
    return `M ${p1.x},${p1.y} C ${p1.x},${midY} ${p2.x},${midY} ${p2.x},${p2.y}`;
  };

  return (
    <section id="experience" className="relative h-screen snap-start snap-always flex flex-col">
      {/* Header */}
      <div className="px-6 pt-16 pb-4 max-w-5xl mx-auto w-full shrink-0">
        <FadeIn>
          <p className="text-xs font-medium tracking-widest uppercase text-[var(--accent)] mb-1.5">{e.label}</p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="text-2xl md:text-3xl font-bold">{e.heading}</h2>
        </FadeIn>
      </div>

      {/* Zigzag timeline */}
      <div
        ref={containerRef}
        className="flex-1 relative max-w-5xl mx-auto w-full px-6 flex flex-col"
        style={{ paddingBottom: 24 }}
      >
        {/* SVG curves */}
        {dotPositions.length === timeline.length && (
          <svg
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", overflow: "visible" }}
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="curve-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%"   stopColor="var(--accent)" stopOpacity="0.55" />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.12" />
              </linearGradient>
            </defs>
            {dotPositions.slice(0, -1).map((pos, i) => (
              <motion.path
                key={i}
                d={buildCurve(pos, dotPositions[i + 1])}
                stroke="url(#curve-grad)"
                strokeWidth={2}
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  pathLength: { duration: 1, delay: 0.3 + i * 0.12, ease: "easeInOut" },
                  opacity: { duration: 0.2, delay: 0.3 + i * 0.12 },
                }}
              />
            ))}
          </svg>
        )}

        {/* Rows */}
        {timeline.map((event, i) => {
          const isLeft = i % 2 === 0;
          const title   = lang === "zh" && event.titleZh   ? event.titleZh   : event.title;
          const company = lang === "zh" && event.companyZh ? event.companyZh : event.company;
          const isHovered = hoveredId === event.id;

          const card = (
            <motion.div
              initial={{ opacity: 0, x: isLeft ? -16 : 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10px" }}
              transition={{ duration: 0.4, delay: i * 0.04, ease: [0.25, 0.1, 0.25, 1] }}
              onMouseEnter={(ev) => handleMouseEnter(ev, event.id)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(event.id)}
              className="cursor-pointer w-fit"
            >
              <TimelineRevealCard
                originX={isLeft ? "100%" : "0%"}
                originY="50%"
                className="rounded-lg"
                base={
                  <div className={cn(
                    "rounded-lg border border-[var(--border)] bg-[var(--card)]",
                    isLeft
                      ? "border-r-2 border-r-[var(--accent)]/40"
                      : "border-l-2 border-l-[var(--accent)]/40",
                  )}>
                    <CardBody event={event} title={title} company={company} lang={lang} isLeft={isLeft} isAccented={false} />
                  </div>
                }
                overlay={
                  <div className="h-full flex items-center">
                    <CardBody event={event} title={title} company={company} lang={lang} isLeft={isLeft} isAccented={true} />
                  </div>
                }
              />
            </motion.div>
          );

          const dot = (
            <motion.div
              ref={(el) => { dotRefs.current[i] = el as HTMLDivElement | null; }}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.28, delay: i * 0.05 + 0.15 }}
              animate={isHovered ? { scale: 1.25 } : { scale: 1 }}
              className={cn(
                "relative z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[9px] font-bold transition-colors duration-200 shrink-0",
                dotClass(event, isHovered),
              )}
            >
              {event.freelance ? "F" : event.type === "work" ? "W" : "E"}
            </motion.div>
          );

          return (
            <div key={event.id} className="flex-1 flex items-center gap-2">
              {isLeft ? (
                <>
                  {/* card hugs right (toward dot) */}
                  <div className="flex-[2] flex justify-end min-w-0">{card}</div>
                  {dot}
                  <div className="flex-[3]" />
                </>
              ) : (
                <>
                  <div className="flex-[3]" />
                  {dot}
                  {/* card hugs left (toward dot) */}
                  <div className="flex-[2] flex justify-start min-w-0">{card}</div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Popover */}
      <AnimatePresence>
        {hoveredEvent && <EventPopover event={hoveredEvent} lang={lang} pos={popoverPos} />}
      </AnimatePresence>
    </section>
  );
}
