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
      <div className="relative z-20 w-full h-full flex flex-col justify-between p-3.5 bg-[var(--card)]/85 backdrop-blur-md rounded-xl border border-[var(--border)]/60 transition-all duration-500 group-hover:-translate-x-3">
        {items ? (
          <>
            <p
              className="text-[9px] font-mono tracking-[0.14em] uppercase leading-none"
              style={{ color: gradientFrom }}
            >
              {label}
            </p>
            <div className="flex flex-wrap gap-1">
              {items.map((item) => (
                <span
                  key={item}
                  className="text-[9px] px-1.5 py-0.5 rounded border border-white/20 text-[var(--foreground)] font-mono leading-tight"
                >
                  {item}
                </span>
              ))}
            </div>
          </>
        ) : (
          <>
            <p
              className="text-[9px] font-mono tracking-[0.14em] uppercase leading-none"
              style={{ color: gradientFrom }}
            >
              {label}
            </p>
            <p
              className="text-3xl font-bold leading-none tracking-tight"
              style={{
                fontFamily: "var(--font-display, Georgia, serif)",
                color: gradientTo,
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
