"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Github, ExternalLink } from "lucide-react";
import { Tag } from "@/components/ui/Tag";

interface WaveProjectCardProps {
  slug: string;
  title: string;
  description: string;
  category: string;
  tech: string[];
  links: { github?: string; demo?: string };
  waveColor: string;
  animationDelay?: number;
}

export function WaveProjectCard({
  slug,
  title,
  description,
  category,
  tech,
  links,
  waveColor,
  animationDelay = 0,
}: WaveProjectCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;

    // 4 waves with individual state
    const waves = Array.from({ length: 4 }, (_, i) => ({
      value: 0.2 + i * 0.12,
      targetValue: 0.2 + i * 0.12,
      speed: 0.012 + i * 0.004,
      phase: (i * Math.PI) / 2,
    }));

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx!.scale(dpr, dpr);
    }

    function update() {
      waves.forEach((w) => {
        if (Math.random() < 0.008) w.targetValue = 0.1 + Math.random() * 0.6;
        w.value += (w.targetValue - w.value) * w.speed;
      });
    }

    function draw() {
      if (!canvas || !ctx) return;
      const W = canvas.getBoundingClientRect().width;
      const H = canvas.getBoundingClientRect().height;

      ctx.clearRect(0, 0, W, H);

      // Subtle tinted background
      ctx.fillStyle = `${waveColor}08`;
      ctx.fillRect(0, 0, W, H);

      waves.forEach((w, i) => {
        const freq = w.value * 6;
        ctx.beginPath();

        for (let x = 0; x <= W; x += 2) {
          const nx = (x / W) * 2 - 1;
          const px = nx + i * 0.05 + freq * 0.03;
          const py =
            Math.sin(px * 8 + time + w.phase) *
            Math.cos(px * 1.5 + time * 0.3) *
            freq *
            0.09 *
            ((i + 1) / 4);
          const y = (py + 1) * (H / 2);

          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }

        const opacity = 0.25 + (i / 4) * 0.45;
        ctx.lineWidth = 1.2 + i * 0.4;
        ctx.strokeStyle = `${waveColor}${Math.round(opacity * 255)
          .toString(16)
          .padStart(2, "0")}`;
        ctx.shadowColor = waveColor;
        ctx.shadowBlur = 4 + i * 2;
        ctx.stroke();
        ctx.shadowBlur = 0;
      });
    }

    function tick() {
      time += 0.018;
      update();
      draw();
      rafRef.current = requestAnimationFrame(tick);
    }

    const ro = new ResizeObserver(() => {
      resize();
    });
    ro.observe(canvas);
    resize();
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [waveColor]);

  return (
    <Link
      href={`/projects/${slug}`}
      className="block h-full rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden hover:border-[var(--accent)]/40 transition-all duration-300 hover:shadow-lg hover:shadow-black/5 animate-float group"
      style={{ animationDelay: `${animationDelay}s` }}
    >
      {/* Wave canvas header */}
      <div className="relative h-36 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          aria-hidden="true"
        />
        {/* Category badge overlaid on canvas */}
        <div className="absolute top-3 left-3">
          <span
            className="inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase border"
            style={{
              color: waveColor,
              borderColor: `${waveColor}40`,
              backgroundColor: `${waveColor}15`,
            }}
          >
            {category}
          </span>
        </div>
        {/* Links overlaid top-right */}
        {(links.github || links.demo) && (
          <div className="absolute top-3 right-3 flex gap-1.5">
            {links.github && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(links.github, "_blank", "noopener,noreferrer");
                }}
                className="w-7 h-7 rounded-full flex items-center justify-center bg-[var(--card)]/80 backdrop-blur-sm border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                aria-label="GitHub"
              >
                <Github size={13} />
              </button>
            )}
            {links.demo && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(links.demo, "_blank", "noopener,noreferrer");
                }}
                className="w-7 h-7 rounded-full flex items-center justify-center bg-[var(--card)]/80 backdrop-blur-sm border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                aria-label="Live demo"
              >
                <ExternalLink size={13} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-[var(--foreground)] mb-2 text-sm leading-snug group-hover:text-[var(--accent)] transition-colors">
          {title}
        </h3>
        <p className="text-xs text-[var(--muted)] leading-relaxed mb-4">
          {description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {tech.slice(0, 3).map((t) => (
            <Tag key={t} size="sm" variant="accent">
              {t}
            </Tag>
          ))}
          {tech.length > 3 && <Tag size="sm">+{tech.length - 3}</Tag>}
        </div>
      </div>
    </Link>
  );
}
