"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CELL_W = 64;
const CELL_H = 32;
const COLS = 50;
const ROWS = 30;

const COLORS = [
  "rgba(99, 102, 241, 0.55)",
  "rgba(59, 130, 246, 0.50)",
  "rgba(6, 182, 212, 0.45)",
  "rgba(139, 92, 246, 0.50)",
  "rgba(236, 72, 153, 0.45)",
  "rgba(16, 185, 129, 0.40)",
  "rgba(245, 158, 11, 0.40)",
];

function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

// Direct DOM mutation — no React state, no re-renders
function onEnter(e: React.MouseEvent<HTMLDivElement>) {
  const el = e.currentTarget;
  el.style.transition = "background-color 0s";
  el.style.backgroundColor = randomColor();
}
function onLeave(e: React.MouseEvent<HTMLDivElement>) {
  const el = e.currentTarget;
  el.style.transition = "background-color 1.8s ease";
  el.style.backgroundColor = "";
}

interface Spark {
  col: number;
  row: number;
  color: string;
  delay: number;
  duration: number;
  repeatDelay: number;
}

export function BackgroundBoxes() {
  const [sparks, setSparks] = useState<Spark[]>([]);

  // Client-only to avoid hydration mismatch
  useEffect(() => {
    setSparks(
      Array.from({ length: 22 }, () => ({
        col: Math.floor(Math.random() * COLS),
        row: Math.floor(Math.random() * ROWS),
        color: randomColor(),
        delay: Math.random() * 10,
        duration: 1.8 + Math.random() * 2.4,
        repeatDelay: 3 + Math.random() * 7,
      })),
    );
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden z-0" style={{ pointerEvents: "none" }}>
      {/* Isometric skewed container */}
      <div
        className="absolute"
        style={{
          top: "50%",
          left: "50%",
          width: COLS * CELL_W,
          height: ROWS * CELL_H,
          transform:
            "translate(-50%,-50%) skewX(-48deg) skewY(14deg) scale(0.675)",
          // Enable pointer events only on this layer
          pointerEvents: "auto",
        }}
      >
        {/* Flat CSS grid for lines — zero extra DOM nodes */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, var(--border) 1px, transparent 1px),
              linear-gradient(to bottom, var(--border) 1px, transparent 1px)
            `,
            backgroundSize: `${CELL_W}px ${CELL_H}px`,
            opacity: 0.8,
          }}
        />

        {/* Interactive cells — transparent, handle hover */}
        <div
          className="absolute inset-0"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${COLS}, ${CELL_W}px)`,
          }}
        >
          {Array.from({ length: ROWS * COLS }, (_, idx) => {
            const col = idx % COLS;
            const row = Math.floor(idx / COLS);
            const showPlus = col % 2 === 0 && row % 2 === 0;
            return (
              <div
                key={idx}
                style={{ width: CELL_W, height: CELL_H, position: "relative" }}
                onMouseEnter={onEnter}
                onMouseLeave={onLeave}
              >
                {showPlus && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="pointer-events-none"
                    style={{
                      position: "absolute",
                      top: -7,
                      left: -11,
                      width: 22,
                      height: 14,
                      color: "var(--border)",
                      opacity: 0.55,
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v12m6-6H6"
                    />
                  </svg>
                )}
              </div>
            );
          })}
        </div>

        {/* Auto-sparkle cells (framer-motion, 22 only) */}
        {sparks.map((s, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none"
            style={{
              left: s.col * CELL_W,
              top: s.row * CELL_H,
              width: CELL_W,
              height: CELL_H,
              backgroundColor: s.color,
            }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: s.duration,
              delay: s.delay,
              repeat: Infinity,
              repeatDelay: s.repeatDelay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Radial mask — fade grid from center so content stays readable */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 62% 68% at 50% 50%, var(--background) 28%, transparent 100%)",
        }}
      />

      {/* Top/bottom edge vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, var(--background) 0%, transparent 14%, transparent 83%, var(--background) 100%)",
        }}
      />
    </div>
  );
}
