"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LangToggle } from "@/components/ui/LangToggle";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

const PAGE_SECTIONS = ["experience", "projects", "skills", "contact"] as const;

const PAGE_LINKS = [
  { href: "/", labelKey: "Home" },
  { href: "/about", labelKey: "About" },
  { href: "/projects", labelKey: "Projects" },
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function Navbar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  const navLabel: Record<string, string> = {
    about: t.nav.about,
    skills: t.nav.skills,
    experience: t.nav.experience,
    projects: t.nav.projects,
    contact: t.nav.contact,
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled || isHome
          ? "bg-[var(--background)]/90 backdrop-blur-md border-b border-[var(--border)]"
          : "bg-transparent",
      )}
    >
      <nav className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        {isHome ? (
          <button
            onClick={() => scrollToSection("hero")}
            className="font-semibold text-sm tracking-wide text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
          >
            Alex Lin
          </button>
        ) : (
          <Link
            href="/"
            className="font-semibold text-sm tracking-wide text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
          >
            Alex Lin
          </Link>
        )}

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-0.5">
          {isHome
            ? PAGE_SECTIONS.map((id) => (
                <li key={id}>
                  <button
                    onClick={() => scrollToSection(id)}
                    className="px-3 py-2 text-sm rounded-full text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                  >
                    {navLabel[id]}
                  </button>
                </li>
              ))
            : PAGE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "relative px-4 py-2 text-sm rounded-full transition-colors",
                      pathname === link.href
                        ? "text-[var(--foreground)] font-medium"
                        : "text-[var(--muted)] hover:text-[var(--foreground)]",
                    )}
                  >
                    {pathname === link.href && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-[var(--border)] rounded-full"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className="relative z-10">{link.labelKey}</span>
                  </Link>
                </li>
              ))}
        </ul>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <LangToggle />
          <ThemeToggle />
          {/* Mobile hamburger */}
          <button
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-full hover:bg-[var(--border)] transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="block w-4 h-0.5 bg-current origin-center"
            />
            <motion.span
              animate={
                mobileOpen ? { opacity: 0, x: -8 } : { opacity: 1, x: 0 }
              }
              className="block w-4 h-0.5 bg-current"
            />
            <motion.span
              animate={
                mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }
              }
              className="block w-4 h-0.5 bg-current origin-center"
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-md"
          >
            <ul className="flex flex-col px-6 py-4 gap-1">
              {isHome
                ? PAGE_SECTIONS.map((id) => (
                    <li key={id}>
                      <button
                        onClick={() => {
                          scrollToSection(id);
                          setMobileOpen(false);
                        }}
                        className="w-full text-left block px-3 py-2.5 text-sm rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--border)] transition-colors"
                      >
                        {navLabel[id]}
                      </button>
                    </li>
                  ))
                : PAGE_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          "block px-3 py-2.5 text-sm rounded-lg transition-colors",
                          pathname === link.href
                            ? "bg-[var(--border)] font-medium text-[var(--foreground)]"
                            : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--border)]",
                        )}
                      >
                        {link.labelKey}
                      </Link>
                    </li>
                  ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
