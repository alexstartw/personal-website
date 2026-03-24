"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Cell dimensions (px)
const CELL_W = 64;
const CELL_H = 32;
const COLS = 38;
const ROWS = 22;

// Subtle accent-family colors — semi-transparent so they work on light + dark
const HIGHLIGHT_COLORS = [
  "rgba(99, 102, 241, 0.45)",  // indigo
  "rgba(59, 130, 246, 0.45)",  // blue
  "rgba(6, 182, 212, 0.40)",   // cyan
  "rgba(139, 92, 246, 0.40)",  // violet
  "rgba(236, 72, 153, 0.35)",  // pink
  "rgba(16, 185, 129, 0.35)",  // emerald
];

interface Cell {
  col: number;
  row: number;
  color: string;
  delay: number;
  duration: number;
  repeatDelay: number;
}

export function BackgroundBoxes() {
  const [cells, setCells] = useState<Cell[]>([]);

  // Generate after mount to avoid hydration mismatch
  useEffect(() => {
    setCells(
      Array.from({ length: 32 }, () => ({
        col: Math.floor(Math.random() * COLS),
        row: Math.floor(Math.random() * ROWS),
        color:
          HIGHLIGHT_COLORS[
            Math.floor(Math.random() * HIGHLIGHT_COLORS.length)
          ],
        delay: Math.random() * 10,
        duration: 1.8 + Math.random() * 2.4,
        repeatDelay: 3 + Math.random() * 6,
      })),
    );
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Isometric grid */}
      <div
        className="absolute"
        style={{
          top: "50%",
          left: "50%",
          width: COLS * CELL_W,
          height: ROWS * CELL_H,
          transform:
            "translate(-50%, -50%) skewX(-48deg) skewY(14deg) scale(0.675)",
        }}
      >
        {/* CSS grid lines — zero JS cost */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, var(--border) 1px, transparent 1px),
              linear-gradient(to bottom, var(--border) 1px, transparent 1px)
            `,
            backgroundSize: `${CELL_W}px ${CELL_H}px`,
            opacity: 0.7,
          }}
        />

        {/* "+" markers at every other intersection */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ color: "var(--border)", opacity: 0.5 }}
        >
          {Array.from({ length: Math.ceil(ROWS / 2) }, (_, ri) =>
            Array.from({ length: Math.ceil(COLS / 2) }, (_, ci) => (
              <text
                key={`${ri}-${ci}`}
                x={ci * 2 * CELL_W - 5}
                y={ri * 2 * CELL_H + 5}
                fontSize="14"
                fill="currentColor"
                fontFamily="monospace"
                strokeWidth="0"
              >
                +
              </text>
            )),
          )}
        </svg>

        {/* Animated highlight cells */}
        {cells.map((cell, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: cell.col * CELL_W,
              top: cell.row * CELL_H,
              width: CELL_W,
              height: CELL_H,
              backgroundColor: cell.color,
            }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: cell.duration,
              delay: cell.delay,
              repeat: Infinity,
              repeatDelay: cell.repeatDelay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Radial mask — fades grid away from center so text stays readable */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 65% 70% at 50% 50%, var(--background) 30%, transparent 100%)",
        }}
      />

      {/* Edge vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, var(--background) 0%, transparent 18%, transparent 80%, var(--background) 100%)",
        }}
      />
    </div>
  );
}
