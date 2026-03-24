"use client";

import React from "react";

interface GradientCardProps {
  value?: string;
  label: string;
  items?: string[];
  gradientFrom: string;
  gradientTo: string;
}

export function GradientCard({
  value,
  label,
  items,
  gradientFrom,
  gradientTo,
}: GradientCardProps) {
  const gradient = `linear-gradient(315deg, ${gradientFrom}, ${gradientTo})`;

  return (
    <div className="group relative w-[172px] h-[124px] transition-all duration-500">
      {/* Skewed gradient panel */}
      <span
        className="absolute top-0 left-[30px] w-1/2 h-full rounded-xl skew-x-[15deg] transition-all duration-500 group-hover:skew-x-0 group-hover:left-[10px] group-hover:w-[calc(100%-48px)]"
        style={{ background: gradient }}
      />
      {/* Blur glow */}
      <span
        className="absolute top-0 left-[30px] w-1/2 h-full rounded-xl skew-x-[15deg] blur-[22px] transition-all duration-500 group-hover:skew-x-0 group-hover:left-[10px] group-hover:w-[calc(100%-48px)]"
        style={{ background: gradient }}
      />

      {/* Animated blob corners */}
      <span className="pointer-events-none absolute inset-0 z-10">
        <span className="absolute top-0 left-0 w-0 h-0 rounded-lg opacity-0 bg-white/10 backdrop-blur-sm transition-all duration-300 animate-blob group-hover:-top-[20px] group-hover:left-[20px] group-hover:w-[40px] group-hover:h-[40px] group-hover:opacity-100" />
        <span className="absolute bottom-0 right-0 w-0 h-0 rounded-lg opacity-0 bg-white/10 backdrop-blur-sm transition-all duration-500 animate-blob animation-delay-1000 group-hover:-bottom-[20px] group-hover:right-[20px] group-hover:w-[40px] group-hover:h-[40px] group-hover:opacity-100" />
      </span>

      {/* Content glass panel */}
      <div className="relative z-20 w-full h-full flex flex-col p-3.5 bg-[var(--card)]/85 backdrop-blur-md rounded-xl border border-[var(--border)]/60 transition-all duration-500 group-hover:-translate-x-3 overflow-hidden">
        {items ? (
          /* ── List card (Industries) ── */
          <>
            {/* Top accent bar */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: gradient }}
            />
            {/* Label */}
            <p
              className="text-[8px] font-mono tracking-[0.18em] uppercase mt-2 mb-2.5 leading-none"
              style={{ color: gradientFrom }}
            >
              {label}
            </p>
            {/* Vertical list */}
            <div className="flex flex-col gap-[5px]">
              {items.map((item, i) => (
                <div key={item} className="flex items-center gap-1.5">
                  <span
                    className="w-[3px] h-[3px] rounded-full shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
                      opacity: 0.6 + i * 0.1,
                    }}
                  />
                  <span className="text-[10px] font-medium text-[var(--foreground)] leading-none tracking-tight">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* ── Numeric stat card ── */
          <>
            {/* Top accent bar */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: gradient }}
            />
            {/* Faint decorative circle — depth */}
            <div
              className="absolute -top-5 -right-5 w-20 h-20 rounded-full"
              style={{ background: gradientTo, opacity: 0.07 }}
            />
            {/* Label */}
            <p
              className="text-[8px] font-mono tracking-[0.18em] uppercase mt-2 leading-none"
              style={{ color: gradientFrom }}
            >
              {label}
            </p>
            {/* Number — the hero */}
            <p
              className="leading-none tracking-tight font-bold mt-auto"
              style={{
                fontFamily: "var(--font-display, Georgia, serif)",
                color: gradientTo,
                fontSize: value && value.length > 5 ? "1.5rem" : "2.4rem",
              }}
            >
              {value}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
