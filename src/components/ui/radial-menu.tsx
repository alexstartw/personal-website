"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { motion, AnimatePresence, type Transition } from "framer-motion";
import { ContextMenu } from "@base-ui-components/react/context-menu";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type MenuItem = {
  id: number;
  label: string;
  icon: LucideIcon;
};

type RadialMenuProps = {
  children?: React.ReactNode;
  menuItems: MenuItem[];
  size?: number;
  iconSize?: number;
  bandWidth?: number;
  innerGap?: number;
  outerGap?: number;
  outerRingWidth?: number;
  onSelect?: (item: MenuItem) => void;
};

type Point = { x: number; y: number };

// ─── Animation ───────────────────────────────────────────────────────────────

const menuTransition: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 32,
  mass: 1,
};

const wedgeTransition: Transition = {
  duration: 0.05,
  ease: "easeOut",
};

// ─── Geometry ────────────────────────────────────────────────────────────────

const FULL_CIRCLE = 360;
const START_ANGLE = -90;

function degToRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function polarToCartesian(radius: number, angleDeg: number): Point {
  const rad = degToRad(angleDeg);
  return { x: Math.cos(rad) * radius, y: Math.sin(rad) * radius };
}

function slicePath(
  index: number,
  total: number,
  wedgeRadius: number,
  innerRadius: number,
): string {
  if (total <= 0) return "";

  if (total === 1) {
    return `
      M ${wedgeRadius} 0
      A ${wedgeRadius} ${wedgeRadius} 0 1 1 ${-wedgeRadius} 0
      A ${wedgeRadius} ${wedgeRadius} 0 1 1 ${wedgeRadius} 0
      M ${innerRadius} 0
      A ${innerRadius} ${innerRadius} 0 1 0 ${-innerRadius} 0
      A ${innerRadius} ${innerRadius} 0 1 0 ${innerRadius} 0
    `;
  }

  const anglePerSlice = FULL_CIRCLE / total;
  const midDeg = START_ANGLE + anglePerSlice * index;
  const halfSlice = anglePerSlice / 2;
  const startDeg = midDeg - halfSlice;
  const endDeg = midDeg + halfSlice;

  const outerStart = polarToCartesian(wedgeRadius, startDeg);
  const outerEnd = polarToCartesian(wedgeRadius, endDeg);
  const innerStart = polarToCartesian(innerRadius, startDeg);
  const innerEnd = polarToCartesian(innerRadius, endDeg);
  const largeArcFlag = anglePerSlice > 180 ? 1 : 0;

  return `
    M ${outerStart.x} ${outerStart.y}
    A ${wedgeRadius} ${wedgeRadius} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}
    L ${innerEnd.x} ${innerEnd.y}
    A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y}
    Z
  `;
}

// ─── RadialMenu ───────────────────────────────────────────────────────────────

function RadialMenu({
  children,
  menuItems,
  size = 240,
  iconSize = 18,
  bandWidth = 50,
  innerGap = 8,
  outerGap = 8,
  outerRingWidth = 12,
  onSelect,
}: RadialMenuProps) {
  const radius = size / 2;
  const outerRingOuterRadius = radius;
  const outerRingInnerRadius = outerRingOuterRadius - outerRingWidth;
  const wedgeOuterRadius = outerRingInnerRadius - outerGap;
  const wedgeInnerRadius = wedgeOuterRadius - bandWidth;
  const iconRingRadius = (wedgeOuterRadius + wedgeInnerRadius) / 2;
  const centerRadius = Math.max(wedgeInnerRadius - innerGap, 0);
  const slice = 360 / menuItems.length;

  const itemRefs = React.useRef<(HTMLElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [open, setOpen] = React.useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) setActiveIndex(null);
  };

  return (
    <ContextMenu.Root open={open} onOpenChange={handleOpenChange}>
      <ContextMenu.Trigger
        render={(triggerProps) => (
          <div
            {...triggerProps}
            className={cn("select-none outline-none", triggerProps.className)}
          >
            {children ?? (
              <div className="flex size-80 items-center justify-center rounded-lg border-2 border-dashed">
                Right-click here.
              </div>
            )}
          </div>
        )}
      />

      <AnimatePresence>
        {open && (
          <ContextMenu.Portal keepMounted>
            <ContextMenu.Positioner
              align="center"
              sideOffset={({ positioner }) => -positioner.height / 2}
              className="outline-none"
            >
              <ContextMenu.Popup
                style={{ width: size, height: size }}
                className="relative overflow-hidden rounded-full shadow-xl outline-none"
                render={
                  <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={menuTransition}
                  />
                }
              >
                <svg
                  className="absolute inset-0 size-full"
                  viewBox={`${-radius} ${-radius} ${radius * 2} ${radius * 2}`}
                >
                  {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    const midDeg = START_ANGLE + slice * index;
                    const { x: iconX, y: iconY } = polarToCartesian(
                      iconRingRadius,
                      midDeg,
                    );
                    const ICON_BOX = iconSize * 2;
                    const isActive = activeIndex === index;

                    return (
                      <g
                        key={item.id}
                        className="cursor-pointer"
                        onClick={() => itemRefs.current[index]?.click()}
                        onMouseEnter={() => {
                          setActiveIndex(index);
                          itemRefs.current[index]?.focus();
                        }}
                      >
                        {/* Outer ring segment */}
                        <motion.path
                          d={slicePath(
                            index,
                            menuItems.length,
                            outerRingOuterRadius,
                            outerRingInnerRadius,
                          )}
                          className={cn(
                            isActive
                              ? "fill-[var(--accent)]/20"
                              : "fill-[var(--card)]",
                          )}
                          initial={false}
                          animate={{
                            opacity: 1,
                          }}
                          transition={wedgeTransition}
                        />

                        {/* Inner band segment */}
                        <motion.path
                          d={slicePath(
                            index,
                            menuItems.length,
                            wedgeOuterRadius,
                            wedgeInnerRadius,
                          )}
                          className={cn(
                            "stroke-[var(--border)] stroke-1",
                            isActive
                              ? "fill-[var(--border)]"
                              : "fill-[var(--card)]",
                          )}
                          initial={false}
                          transition={wedgeTransition}
                        />

                        {/* Icon */}
                        <foreignObject
                          x={iconX - ICON_BOX / 2}
                          y={iconY - ICON_BOX / 2}
                          width={ICON_BOX}
                          height={ICON_BOX}
                        >
                          <ContextMenu.Item
                            ref={(el) => {
                              itemRefs.current[index] = el as HTMLElement | null;
                            }}
                            onFocus={() => setActiveIndex(index)}
                            onClick={() => onSelect?.(item)}
                            aria-label={item.label}
                            className={cn(
                              "flex size-full items-center justify-center rounded-full outline-none transition-colors duration-100",
                              isActive
                                ? "text-[var(--accent)]"
                                : "text-[var(--muted)]",
                            )}
                          >
                            <Icon style={{ height: iconSize, width: iconSize }} />
                          </ContextMenu.Item>
                        </foreignObject>

                        {/* Label on hover */}
                        {isActive && (
                          <text
                            x={polarToCartesian(wedgeOuterRadius + outerRingWidth / 2 + outerGap, midDeg).x}
                            y={polarToCartesian(wedgeOuterRadius + outerRingWidth / 2 + outerGap, midDeg).y}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontSize="8"
                            className="fill-[var(--muted)] pointer-events-none select-none"
                          >
                            {item.label}
                          </text>
                        )}
                      </g>
                    );
                  })}

                  {/* Center circle */}
                  <circle
                    cx={0}
                    cy={0}
                    r={centerRadius}
                    className="fill-[var(--background)] stroke-[var(--border)] stroke-1 opacity-80"
                  />
                  <circle
                    cx={0}
                    cy={0}
                    r={3}
                    className="fill-none stroke-[var(--border)]"
                  />
                </svg>
              </ContextMenu.Popup>
            </ContextMenu.Positioner>
          </ContextMenu.Portal>
        )}
      </AnimatePresence>
    </ContextMenu.Root>
  );
}

export { RadialMenu };
