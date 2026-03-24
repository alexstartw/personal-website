"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  value?: string;
  label: string;
  items?: string[];
  icon: LucideIcon;
  accentColor: string;
  /** border-r on right edge */
  borderRight?: boolean;
  /** border-b on bottom edge */
  borderBottom?: boolean;
}

export function StatCard({
  value,
  label,
  items,
  icon: Icon,
  accentColor,
  borderRight,
  borderBottom,
}: StatCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={[
        "group relative p-4 overflow-hidden cursor-default transition-all duration-200",
        borderRight ? "border-r border-[var(--border)]" : "",
        borderBottom ? "border-b border-[var(--border)]" : "",
      ].join(" ")}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Gradient overlay on hover */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: `linear-gradient(to bottom, ${accentColor}12, transparent)`,
          opacity: hovered ? 1 : 0,
        }}
      />

      {/* Animated left accent bar */}
      <div
        className="absolute left-0 top-4 w-[2px] rounded-r-full transition-all duration-300"
        style={{
          height: hovered ? "1.75rem" : "1.25rem",
          background: hovered ? accentColor : "var(--border)",
        }}
      />

      {/* Content */}
      <div className="relative pl-3">
        {/* Icon */}
        <div
          className="mb-2.5 transition-transform duration-200"
          style={{ color: accentColor, opacity: hovered ? 1 : 0.7 }}
        >
          <Icon size={14} strokeWidth={1.75} />
        </div>

        {/* Value or items */}
        {items ? (
          <div
            className="transition-transform duration-200"
            style={{ transform: hovered ? "translateX(2px)" : "translateX(0)" }}
          >
            <p
              className="leading-none mb-1.5"
              style={{
                fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: accentColor,
              }}
            >
              {label}
            </p>
            <div className="flex flex-col gap-[3px]">
              {items.map((item) => (
                <span
                  key={item}
                  className="leading-none text-[var(--foreground)]"
                  style={{
                    fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
                    fontSize: "0.65rem",
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div
            className="transition-transform duration-200"
            style={{ transform: hovered ? "translateX(2px)" : "translateX(0)" }}
          >
            <p
              className="leading-none mb-1.5"
              style={{
                fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
                fontWeight: 600,
                fontSize: value && value.length > 5 ? "1.35rem" : "1.7rem",
                color: "var(--foreground)",
                letterSpacing: "-0.03em",
              }}
            >
              {value}
            </p>
            <p
              className="leading-none"
              style={{
                fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--muted)",
              }}
            >
              {label}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
