"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { FadeIn } from "@/components/ui/FadeIn";

const LINKS = [
  {
    key: "email" as const,
    href: "mailto:alexstartw@gmail.com",
    icon: (
      <svg
        width="20"
        height="20"
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
  {
    key: "linkedin" as const,
    href: "https://www.linkedin.com/in/liyu-lin-alex",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    key: "github" as const,
    href: "https://github.com/alexstartw",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
  },
];

export function ContactSection() {
  const { t } = useLanguage();
  const c = t.contact;

  return (
    <section
      id="contact"
      className="relative h-screen snap-start snap-always flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 60%, rgba(59,130,246,0.06) 0%, transparent 80%)",
          }}
        />
      </div>

      <div className="relative max-w-2xl mx-auto px-6 text-center w-full">
        {/* Label */}
        <FadeIn>
          <p className="text-xs font-medium tracking-widest uppercase text-[var(--accent)] mb-6">
            {c.label}
          </p>
        </FadeIn>

        {/* Available badge */}
        <FadeIn delay={0.05}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-500/30 bg-green-500/5 text-xs text-green-500 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            {c.available}
          </div>
        </FadeIn>

        {/* Heading */}
        <FadeIn delay={0.1}>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            {c.heading}
          </h2>
        </FadeIn>

        {/* Subtitle */}
        <FadeIn delay={0.2}>
          <p className="text-[var(--muted)] text-lg leading-relaxed mb-12">
            {c.subtitle}
          </p>
        </FadeIn>

        {/* Contact links */}
        <FadeIn delay={0.3}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {LINKS.map((link, i) => (
              <motion.div
                key={link.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.08, duration: 0.5 }}
              >
                <Link
                  href={link.href}
                  target={link.key !== "email" ? "_blank" : undefined}
                  rel={link.key !== "email" ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-3 px-6 py-3 rounded-full border border-[var(--border)] bg-[var(--card)] text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--accent)]/40 transition-all hover:-translate-y-0.5"
                >
                  {link.icon}
                  {c.links[link.key]}
                </Link>
              </motion.div>
            ))}
          </div>
        </FadeIn>
      </div>

      {/* VS Code–style status bar footer */}
      <FadeIn delay={0.55}>
        <div className="absolute bottom-0 left-0 right-0 h-8 border-t border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-sm flex items-center px-5 gap-3 overflow-hidden">
          {/* Left — terminal prompt */}
          <span className="font-mono text-[10px] leading-none flex items-center gap-1 shrink-0">
            <span className="text-[var(--accent)]">alex</span>
            <span className="text-[var(--muted)]/50">@</span>
            <span className="text-[var(--foreground)]/60">taipei</span>
            <span className="text-[var(--muted)]/40 ml-1">:~$</span>
          </span>

          <span className="w-px h-3 bg-[var(--border)] shrink-0" />

          <span className="font-mono text-[10px] text-[var(--muted)]/60 leading-none shrink-0 hidden sm:block">
            Senior Data Engineer
          </span>

          <div className="flex-1" />

          {/* Right — year + social icons */}
          <span className="font-mono text-[10px] text-[var(--muted)]/50 leading-none shrink-0">
            © {new Date().getFullYear()}
          </span>

          <span className="w-px h-3 bg-[var(--border)] shrink-0" />

          <div className="flex items-center gap-3 shrink-0">
            {LINKS.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                target={link.key !== "email" ? "_blank" : undefined}
                rel={link.key !== "email" ? "noopener noreferrer" : undefined}
                aria-label={link.key}
                className="text-[var(--muted)]/50 hover:text-[var(--accent)] transition-colors"
              >
                <span className="block scale-75 origin-center">
                  {link.icon}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
