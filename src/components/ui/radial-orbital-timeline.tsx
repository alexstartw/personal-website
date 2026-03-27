"use client";

import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

export interface OrbitalTimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
  company: string;
  tags: string[];
  slug: string;
}

interface RadialOrbitalTimelineProps {
  timelineData: OrbitalTimelineItem[];
  onNavigate?: (slug: string) => void;
}

// ─── Position math (pure, no side effects) ───────────────────────────────────

function calcNodePosition(index: number, total: number, angleDeg: number) {
  const nodeAngle = ((index / total) * 360 + angleDeg) % 360;
  const radius = 200;
  const rad = (nodeAngle * Math.PI) / 180;
  const x = radius * Math.cos(rad);
  const y = radius * Math.sin(rad);
  const zIndex = Math.round(100 + 50 * Math.cos(rad));
  const opacity = Math.max(0.4, Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(rad)) / 2)));
  return { x, y, zIndex, opacity };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RadialOrbitalTimeline({
  timelineData,
  onNavigate,
}: RadialOrbitalTimelineProps) {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Mutable refs read inside rAF — never stale, never trigger re-renders
  const rotationRef = useRef(0);
  const autoRotateRef = useRef(true);
  const activeIdRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  // Keep imperative refs in sync
  useEffect(() => { autoRotateRef.current = autoRotate; }, [autoRotate]);
  useEffect(() => { activeIdRef.current = activeId; }, [activeId]);

  // Apply positions directly to DOM — called by both layout effect and rAF
  const applyPositions = useCallback(
    (angleDeg: number) => {
      timelineData.forEach((item, index) => {
        const el = nodeRefs.current[item.id];
        if (!el) return;
        const isActive = activeIdRef.current === item.id;
        const pos = calcNodePosition(index, timelineData.length, angleDeg);
        el.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
        el.style.opacity = String(isActive ? 1 : pos.opacity);
        el.style.zIndex = String(isActive ? 200 : pos.zIndex);
      });
    },
    [timelineData],
  );

  // Set initial positions before first paint (no flash)
  useLayoutEffect(() => {
    applyPositions(rotationRef.current);
  }, [applyPositions]);

  // ── rAF loop: drives rotation at ~60 fps without any React re-render ──────
  useEffect(() => {
    const tick = () => {
      if (autoRotateRef.current) {
        rotationRef.current = (rotationRef.current + 0.3) % 360;
      }
      applyPositions(rotationRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [applyPositions]);

  // ── Interaction ───────────────────────────────────────────────────────────

  const centerViewOnNode = useCallback(
    (nodeId: number) => {
      const idx = timelineData.findIndex((item) => item.id === nodeId);
      const target = (idx / timelineData.length) * 360;
      rotationRef.current = ((270 - target) % 360 + 360) % 360;
    },
    [timelineData],
  );

  const handleNodeClick = useCallback(
    (id: number) => {
      if (activeId === id) {
        setActiveId(null);
        setAutoRotate(true);
      } else {
        setActiveId(id);
        setAutoRotate(false);
        centerViewOnNode(id);
      }
    },
    [activeId, centerViewOnNode],
  );

  const handleContainerClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === containerRef.current || e.target === orbitRef.current) {
        setActiveId(null);
        setAutoRotate(true);
      }
    },
    [],
  );

  const handleCardClick = useCallback(
    (e: React.MouseEvent, slug: string) => {
      e.stopPropagation();
      onNavigate?.(slug);
    },
    [onNavigate],
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center bg-background/50 backdrop-blur-[2px] overflow-visible"
      onClick={handleContainerClick}
    >
      <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
        <div
          ref={orbitRef}
          className="absolute w-full h-full flex items-center justify-center"
          style={{ perspective: "1000px" }}
        >
          {/* ── Center orb ────────────────────────────────────────────────── */}
          <div className="absolute z-10 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 animate-pulse pointer-events-none">
            <div className="absolute h-20 w-20 rounded-full border border-foreground/20 animate-ping opacity-70" />
            <div
              className="absolute h-24 w-24 rounded-full border border-foreground/10 animate-ping opacity-50"
              style={{ animationDelay: "0.5s" }}
            />
            <div className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-md" />
          </div>

          {/* ── Orbit ring ────────────────────────────────────────────────── */}
          <div className="absolute h-96 w-96 rounded-full border border-foreground/10 pointer-events-none" />

          {/* ── Nodes ─────────────────────────────────────────────────────── */}
          {timelineData.map((item) => {
            const isActive = activeId === item.id;
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                ref={(el) => { nodeRefs.current[item.id] = el; }}
                className="absolute cursor-pointer"
                // transform / opacity / zIndex managed imperatively by rAF
                style={{ willChange: "transform, opacity" }}
                onClick={(e) => { e.stopPropagation(); handleNodeClick(item.id); }}
              >
                {/* Energy glow */}
                <div
                  className={`absolute rounded-full pointer-events-none ${isActive ? "animate-pulse" : ""}`}
                  style={{
                    background:
                      "radial-gradient(circle, color-mix(in srgb, var(--accent) 25%, transparent) 0%, transparent 70%)",
                    width: `${item.energy * 0.5 + 40}px`,
                    height: `${item.energy * 0.5 + 40}px`,
                    left: `-${(item.energy * 0.5) / 2}px`,
                    top: `-${(item.energy * 0.5) / 2}px`,
                  }}
                />

                {/* Icon button — transition only the properties that actually change */}
                <div className="relative">
                  <div
                    className={[
                      "h-10 w-10 rounded-full border-2 flex items-center justify-center",
                      "transition-[transform,background-color,border-color,box-shadow,color] duration-300",
                      isActive
                        ? "scale-150 bg-foreground text-background border-foreground shadow-lg"
                        : "bg-background text-foreground border-foreground/40 hover:border-foreground/70",
                    ].join(" ")}
                  >
                    <Icon size={16} />
                  </div>

                  {/* Current-role dot */}
                  {item.status === "in-progress" && (
                    <span className="pointer-events-none absolute -right-0.5 -top-0.5 flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500 border border-background" />
                    </span>
                  )}
                </div>

                {/* Label */}
                <div
                  className={[
                    "pointer-events-none absolute top-12 whitespace-nowrap",
                    "text-xs font-semibold tracking-wider",
                    "transition-[color,transform] duration-300",
                    isActive ? "text-foreground" : "text-foreground/60",
                  ].join(" ")}
                  style={{
                    left: "50%",
                    transform: isActive
                      ? "translateX(-50%) scale(1.2)"
                      : "translateX(-50%)",
                  }}
                >
                  {item.title}
                </div>

                {/* Popup card */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 8 }}
                      transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
                      className="absolute top-full mt-16 left-1/2 -translate-x-1/2 w-60 z-[300]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 h-3 w-px bg-border" />

                      <div
                        className="group cursor-pointer overflow-hidden rounded-xl border border-border bg-card shadow-lg shadow-black/10 dark:shadow-black/40"
                        onClick={(e) => handleCardClick(e, item.slug)}
                      >
                        <div className="p-4">
                          <p className="mb-1 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-accent">
                            {item.title}
                          </p>

                          <div className="mb-3 flex flex-wrap items-center gap-1.5">
                            <p className="text-xs text-muted">
                              {item.company}
                              <span className="mx-1.5 opacity-40">·</span>
                              {item.date}
                            </p>
                            {item.status === "in-progress" && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-green-500/20 bg-green-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-green-500">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                                Now
                              </span>
                            )}
                          </div>

                          <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-foreground/70">
                            {item.content}
                          </p>

                          <div className="mb-3 flex flex-wrap gap-1">
                            {item.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="rounded-md border border-accent/20 bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-accent"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center gap-1 text-[11px] text-muted transition-colors group-hover:text-accent">
                            <span>View details</span>
                            <ArrowRight
                              size={10}
                              className="transition-transform group-hover:translate-x-0.5"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
