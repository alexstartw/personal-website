"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SOCIALS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/liyu-lin-alex",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com/alexstartw",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:alexstartw@gmail.com",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
];

const ENGINEER_SEGMENTS = [
  { label: "Data Engineering" },
  { label: "GenAI" },
  { label: "Taipei, Taiwan" },
];

const PHOTO_SEGMENTS = [
  { label: "Portrait Photography" },
  { label: "Cosplay Photography" },
  { label: "Taipei, Taiwan" },
];

export function Footer() {
  const pathname = usePathname();
  const isPhotoMode = pathname.startsWith("/photo");
  const segments = isPhotoMode ? PHOTO_SEGMENTS : ENGINEER_SEGMENTS;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--card)]">
      {/* Top micro-bar — accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent" />

      <div className="max-w-5xl mx-auto px-6 h-11 flex items-center gap-3 text-[10px] font-mono">
        {/* Terminal prompt */}
        <span className="flex items-center gap-1 shrink-0">
          <span className="text-[var(--accent)]">alex</span>
          <span className="text-[var(--muted)]/40">@</span>
          <span className="text-[var(--foreground)]/50">taipei</span>
          <span className="text-[var(--muted)]/30 ml-1">:~$</span>
        </span>

        <span className="w-px h-3 bg-[var(--border)] shrink-0" />

        {/* Specialisation tags */}
        <div className="hidden sm:flex items-center gap-2">
          {segments.map((seg, i) => (
            <span key={seg.label} className="flex items-center gap-2">
              <span className="text-[var(--muted)]/50">{seg.label}</span>
              {i < segments.length - 1 && (
                <span className="text-[var(--border)]">·</span>
              )}
            </span>
          ))}
        </div>

        <div className="flex-1" />

        {/* Copyright */}
        <span className="text-[var(--muted)]/40 shrink-0">© {year}</span>

        <span className="w-px h-3 bg-[var(--border)] shrink-0" />

        {/* Social icons */}
        <div className="flex items-center gap-3 shrink-0">
          {SOCIALS.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              target={s.label !== "Email" ? "_blank" : undefined}
              rel={s.label !== "Email" ? "noopener noreferrer" : undefined}
              aria-label={s.label}
              className="text-[var(--muted)]/50 hover:text-[var(--accent)] transition-colors"
            >
              {s.icon}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
