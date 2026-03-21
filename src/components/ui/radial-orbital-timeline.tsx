"use client";

import { useState, useEffect, useRef } from "react";
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
  /** Company / school name shown in popup */
  company: string;
  /** Up to 3 tags shown in popup as pills */
  tags: string[];
  /** ID string used for /experience?id=... routing */
  slug: string;
}

interface RadialOrbitalTimelineProps {
  timelineData: OrbitalTimelineItem[];
  /** Called when user clicks the popup card to navigate to detail */
  onNavigate?: (slug: string) => void;
}

export default function RadialOrbitalTimeline({
  timelineData,
  onNavigate,
}: RadialOrbitalTimelineProps) {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  /* ── Rotation ─────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!autoRotate) return;
    const timer = setInterval(() => {
      setRotationAngle((prev) => Number(((prev + 0.3) % 360).toFixed(3)));
    }, 50);
    return () => clearInterval(timer);
  }, [autoRotate]);

  /* ── Helpers ──────────────────────────────────────────────────────────── */
  const centerViewOnNode = (nodeId: number) => {
    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const targetAngle = (nodeIndex / timelineData.length) * 360;
    setRotationAngle(270 - targetAngle);
  };

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = 200;
    const radian = (angle * Math.PI) / 180;
    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);
    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(
      0.4,
      Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2)),
    );
    return { x, y, zIndex, opacity };
  };

  /* ── Interaction ──────────────────────────────────────────────────────── */
  const handleNodeClick = (id: number) => {
    if (activeId === id) {
      // second click on same node closes popup
      setActiveId(null);
      setAutoRotate(true);
    } else {
      setActiveId(id);
      setAutoRotate(false);
      centerViewOnNode(id);
    }
  };

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setActiveId(null);
      setAutoRotate(true);
    }
  };

  const handleCardClick = (e: React.MouseEvent, slug: string) => {
    e.stopPropagation();
    onNavigate?.(slug);
  };

  /* ── Render ───────────────────────────────────────────────────────────── */
  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center bg-background overflow-visible"
      onClick={handleContainerClick}
    >
      <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
        <div
          ref={orbitRef}
          className="absolute w-full h-full flex items-center justify-center"
          style={{ perspective: "1000px" }}
        >
          {/* ── Center orb ── */}
          <div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 animate-pulse flex items-center justify-center z-10 pointer-events-none">
            <div className="absolute w-20 h-20 rounded-full border border-foreground/20 animate-ping opacity-70" />
            <div
              className="absolute w-24 h-24 rounded-full border border-foreground/10 animate-ping opacity-50"
              style={{ animationDelay: "0.5s" }}
            />
            <div className="w-8 h-8 rounded-full bg-background/80 backdrop-blur-md" />
          </div>

          {/* ── Orbit ring ── */}
          <div className="absolute w-96 h-96 rounded-full border border-foreground/10 pointer-events-none" />

          {/* ── Nodes ── */}
          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isActive = activeId === item.id;
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                ref={(el) => {
                  nodeRefs.current[item.id] = el;
                }}
                className="absolute transition-all duration-700 cursor-pointer"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px)`,
                  zIndex: isActive ? 200 : position.zIndex,
                  opacity: isActive ? 1 : position.opacity,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleNodeClick(item.id);
                }}
              >
                {/* Energy glow */}
                <div
                  className={`absolute rounded-full pointer-events-none ${isActive ? "animate-pulse" : ""}`}
                  style={{
                    background: `radial-gradient(circle, color-mix(in srgb, var(--accent) 25%, transparent) 0%, transparent 70%)`,
                    width: `${item.energy * 0.5 + 40}px`,
                    height: `${item.energy * 0.5 + 40}px`,
                    left: `-${(item.energy * 0.5) / 2}px`,
                    top: `-${(item.energy * 0.5) / 2}px`,
                  }}
                />

                {/* Icon button */}
                <div className="relative">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      border-2 transition-all duration-300
                      ${
                        isActive
                          ? "bg-foreground text-background border-foreground shadow-lg scale-150"
                          : "bg-background text-foreground border-foreground/40 hover:border-foreground/70"
                      }
                    `}
                  >
                    <Icon size={16} />
                  </div>

                  {/* Current role indicator */}
                  {item.status === "in-progress" && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3 pointer-events-none">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border border-background" />
                    </span>
                  )}
                </div>

                {/* Label */}
                <div
                  className={`
                    absolute top-12 whitespace-nowrap text-xs font-semibold
                    tracking-wider pointer-events-none transition-all duration-300
                    ${isActive ? "text-foreground" : "text-foreground/60"}
                  `}
                  style={{
                    left: "50%",
                    transform: isActive
                      ? "translateX(-50%) scale(1.2)"
                      : "translateX(-50%)",
                  }}
                >
                  {item.title}
                </div>

                {/* ── Popup card ── */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 8 }}
                      transition={{
                        duration: 0.18,
                        ease: [0.25, 0.1, 0.25, 1],
                      }}
                      className="absolute top-full mt-16 left-1/2 -translate-x-1/2 w-60 z-[300]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Connector line */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-border" />

                      {/* Card */}
                      <div
                        className="rounded-xl border border-border bg-card shadow-lg shadow-black/10 dark:shadow-black/40 overflow-hidden cursor-pointer group"
                        onClick={(e) => handleCardClick(e, item.slug)}
                      >
                        <div className="p-4">
                          {/* Title */}
                          <p className="font-semibold text-sm text-foreground leading-snug mb-1 group-hover:text-accent transition-colors">
                            {item.title}
                          </p>

                          {/* Company + date */}
                          <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                            <p className="text-xs text-muted">
                              {item.company}
                              <span className="mx-1.5 opacity-40">·</span>
                              {item.date}
                            </p>
                            {item.status === "in-progress" && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 tracking-widest uppercase">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                Now
                              </span>
                            )}
                          </div>

                          {/* Description (1 line) */}
                          <p className="text-xs text-foreground/70 line-clamp-2 leading-relaxed mb-3">
                            {item.content}
                          </p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1 mb-3">
                            {item.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-accent/10 text-accent border border-accent/20"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* CTA */}
                          <div className="flex items-center gap-1 text-[11px] text-muted group-hover:text-accent transition-colors">
                            <span>View details</span>
                            <ArrowRight
                              size={10}
                              className="translate-x-0 group-hover:translate-x-0.5 transition-transform"
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
