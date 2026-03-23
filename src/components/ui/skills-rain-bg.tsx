"use client";

import { useEffect, useRef } from "react";

const RAIN_POOL = [
  "PY", "TS", "SQL", "API", "ML", "AI", "DB", "GCP", "CD", "CI",
  "K8S", "GIT", "ETL", "RAG", "LLM", "NGX", "PG", "FN", ">>",
  "{}","[]","()","=>","//","&&","||","::",
  "def", "class", "import", "async", "await", "return", "if",
  "SELECT", "FROM", "WHERE", "JOIN", "GROUP",
];

interface Column {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  lit: boolean;
}

export function SkillsRainBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let cols: Column[] = [];

    function randomChar() {
      return RAIN_POOL[Math.floor(Math.random() * RAIN_POOL.length)];
    }

    function init() {
      const W = canvas!.offsetWidth;
      const H = canvas!.offsetHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      ctx!.scale(dpr, dpr);

      const colCount = Math.max(10, Math.floor(W / 45));
      const colW = W / colCount;
      cols = [];
      for (let i = 0; i < colCount; i++) {
        cols.push({
          x: colW * i + colW / 2 + (Math.random() - 0.5) * 8,
          y: -Math.random() * (H * 1.5),
          speed: 0.4 + Math.random() * 1.2,
          chars: Array.from({ length: 7 }, randomChar),
          lit: Math.random() < 0.2,
        });
      }
    }

    function draw() {
      const W = canvas!.offsetWidth;
      const H = canvas!.offsetHeight;
      const isDark = document.documentElement.classList.contains("dark");

      ctx!.clearRect(0, 0, W, H);

      const charH = 16;

      cols.forEach((col) => {
        col.y += col.speed;
        if (col.y > H + charH * 7) {
          col.y = -charH * 4 - Math.random() * H * 0.8;
          col.speed = 0.4 + Math.random() * 1.2;
          col.lit = Math.random() < 0.2;
          col.chars = Array.from({ length: 7 }, randomChar);
        }
        if (Math.random() < 0.004) col.lit = !col.lit;

        col.chars.forEach((ch, i) => {
          const cy = col.y - i * charH;
          if (cy < -charH || cy > H + charH) return;

          const isHead = i === 0;
          let alpha: number;
          let color: string;

          if (col.lit && isHead) {
            alpha = 0.85;
            color = isDark ? "#34d399" : "#059669";
            ctx!.shadowColor = color;
            ctx!.shadowBlur = 8;
          } else if (col.lit && i < 3) {
            alpha = 0.18 - i * 0.04;
            color = isDark ? "#34d399" : "#059669";
          } else if (isHead) {
            alpha = isDark ? 0.22 : 0.15;
            color = isDark ? "#6b7280" : "#9ca3af";
          } else {
            alpha = isDark ? Math.max(0, 0.07 - i * 0.01) : Math.max(0, 0.05 - i * 0.008);
            color = isDark ? "#4b5563" : "#d1d5db";
          }

          if (alpha <= 0) return;
          ctx!.globalAlpha = alpha;
          ctx!.font = `${isHead ? "bold " : ""}${isHead ? 11 : 10}px monospace`;
          ctx!.fillStyle = color;
          ctx!.fillText(ch, col.x - (ch.length * (isHead ? 3.5 : 3)), cy);
          ctx!.shadowBlur = 0;
        });
        ctx!.globalAlpha = 1;
      });

      animId = requestAnimationFrame(draw);
    }

    init();
    animId = requestAnimationFrame(draw);

    const ro = new ResizeObserver(init);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
