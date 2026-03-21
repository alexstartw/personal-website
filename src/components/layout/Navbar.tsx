"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Briefcase, FolderOpen, Code2, Mail, Home } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LangToggle } from "@/components/ui/LangToggle";
import { AppleDock, AppleDockIcon } from "@/components/ui/apple-dock";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

const PAGE_LINKS = [
  { href: "/", labelKey: "Home" },
  { href: "/about", labelKey: "About" },
  { href: "/experience", labelKey: "Experience" },
  { href: "/projects", labelKey: "Projects" },
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

const DOCK_ITEMS = [
  {
    id: "experience",
    icon: Briefcase,
    color: "text-[var(--accent)]",
    bg: "hover:bg-[var(--accent)]/10",
    labelKey: "experience" as const,
  },
  {
    id: "projects",
    icon: FolderOpen,
    color: "text-blue-400",
    bg: "hover:bg-blue-400/10",
    labelKey: "projects" as const,
  },
  {
    id: "skills",
    icon: Code2,
    color: "text-purple-400",
    bg: "hover:bg-purple-400/10",
    labelKey: "skills" as const,
  },
  {
    id: "contact",
    icon: Mail,
    color: "text-green-400",
    bg: "hover:bg-green-400/10",
    labelKey: "contact" as const,
  },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const isHome = pathname === "/";
  // Pages that show the Apple Dock instead of plain text links
  const showDock = isHome || pathname === "/experience";

  // Dock click: scroll on home, navigate to section anchor on other pages
  const handleDockClick = (id: string) => {
    if (isHome) scrollToSection(id);
    else router.push(`/#${id}`);
  };

  useEffect(() => {
    if (!isHome) return;
    const observers: IntersectionObserver[] = [];
    DOCK_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.5 },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [isHome]);

  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--border)]"
    >
      <nav className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        {isHome ? (
          <button
            onClick={() => scrollToSection("hero")}
            className="font-semibold text-sm tracking-wide text-[var(--foreground)] hover:text-[var(--accent)] transition-colors shrink-0"
          >
            Alex Lin
          </button>
        ) : (
          <Link
            href="/"
            className="font-semibold text-sm tracking-wide text-[var(--foreground)] hover:text-[var(--accent)] transition-colors shrink-0"
          >
            Alex Lin
          </Link>
        )}

        {/* Center — Dock (home + experience) or page links (other pages) */}
        <div className="flex-1 flex justify-center">
          {showDock ? (
            /* Apple Dock in header */
            <AppleDock
              iconSize={32}
              iconMagnification={48}
              iconDistance={100}
              className="h-10 gap-1 rounded-xl px-2 border-0 bg-transparent backdrop-blur-none shadow-none"
            >
              <AppleDockIcon
                onClick={() => isHome ? scrollToSection("hero") : router.push("/")}
                className="hover:bg-[var(--border)] transition-colors rounded-lg"
                title="Home"
                aria-label="Home"
              >
                <Home
                  className="w-4 h-4 text-[var(--muted)]"
                  strokeWidth={1.8}
                />
              </AppleDockIcon>
              <div className="w-px h-5 bg-[var(--border)] mx-0.5 self-center" />
              {DOCK_ITEMS.map(({ id, icon: Icon, color, bg, labelKey }) => (
                <AppleDockIcon
                  key={id}
                  onClick={() => handleDockClick(id)}
                  className={cn(
                    "relative rounded-lg transition-colors",
                    bg,
                    activeSection === id ? "bg-[var(--border)]" : "",
                  )}
                  title={t.nav[labelKey]}
                  aria-label={t.nav[labelKey]}
                >
                  <Icon className={cn("w-4 h-4", color)} strokeWidth={1.8} />
                  {activeSection === id && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--accent)]" />
                  )}
                </AppleDockIcon>
              ))}
            </AppleDock>
          ) : (
            /* Regular links for other pages */
            <ul className="hidden md:flex items-center gap-0.5">
              {PAGE_LINKS.map((link) => (
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
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <LangToggle />
          <ThemeToggle />
          {!isHome && (
            <button
              className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-full hover:bg-[var(--border)] transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <motion.span
                animate={
                  mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }
                }
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
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {!isHome && mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-md"
          >
            <ul className="flex flex-col px-6 py-4 gap-1">
              {PAGE_LINKS.map((link) => (
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
