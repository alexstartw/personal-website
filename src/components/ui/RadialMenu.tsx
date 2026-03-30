"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useLanguage } from "@/context/LanguageContext";
import { useFontSize } from "@/context/FontSizeContext";

// ─── Constants ────────────────────────────────────────────────────────────────

const RADIUS = 76; // px from FAB center to item center

function degToXY(deg: number) {
  const rad = (deg * Math.PI) / 180;
  return {
    x: Math.round(RADIUS * Math.cos(rad) * 10) / 10,
    y: Math.round(-RADIUS * Math.sin(rad) * 10) / 10, // negative: up in screen coords
  };
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function SunIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface MenuItem {
  angleDeg: number;
  label: string;
  icon: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  active?: boolean;
  keepOpen?: boolean;
}

// ─── RadialItem ───────────────────────────────────────────────────────────────

function RadialItem({
  item,
  index,
  total,
  onClose,
}: {
  item: MenuItem;
  index: number;
  total: number;
  onClose: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const pos = degToXY(item.angleDeg);

  return (
    <motion.div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        marginTop: "-20px",
        marginLeft: "-20px",
        width: "40px",
        height: "40px",
        zIndex: hovered ? 10 : 1,
      }}
      initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
      animate={{ x: pos.x, y: pos.y, scale: 1, opacity: 1 }}
      exit={{
        x: 0,
        y: 0,
        scale: 0,
        opacity: 0,
        transition: {
          delay: (total - 1 - index) * 0.025,
          duration: 0.18,
          ease: [0.4, 0, 1, 1],
        },
      }}
      transition={{
        type: "spring",
        stiffness: 360,
        damping: 22,
        delay: index * 0.04,
      }}
    >
      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.88 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className="pointer-events-none absolute bottom-full left-1/2 mb-2.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-[var(--foreground)] px-2 py-0.5 text-[10px] font-medium text-[var(--background)]"
          >
            {item.label}
            {/* Arrow */}
            <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-[var(--foreground)]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button */}
      <motion.button
        onClick={(e) => {
          item.onClick(e);
          if (!item.keepOpen) onClose();
        }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileTap={{ scale: 0.85 }}
        aria-label={item.label}
        className={[
          "h-10 w-10 rounded-full border backdrop-blur-md",
          "flex items-center justify-center shadow-lg",
          "transition-colors duration-150",
          item.active
            ? "border-[var(--accent)] bg-[var(--accent)] text-white"
            : "border-[var(--border)] bg-[var(--card)]/95 text-[var(--muted)] hover:border-[var(--accent)]/50 hover:text-[var(--foreground)]",
        ].join(" ")}
      >
        {item.icon}
      </motion.button>
    </motion.div>
  );
}

// ─── RadialMenu ───────────────────────────────────────────────────────────────

export function RadialMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { lang, setLang } = useLanguage();
  const { fontSize, increase, decrease, reset } = useFontSize();

  useEffect(() => setMounted(true), []);

  const isDark = mounted ? theme === "dark" : false;

  const handleTheme = (e: React.MouseEvent) => {
    const next = isDark ? "light" : "dark";
    if (!document.startViewTransition) {
      setTheme(next);
      return;
    }
    const x = e.clientX,
      y = e.clientY;
    const maxR = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    );
    document
      .startViewTransition(() => setTheme(next))
      .ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${maxR}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 500,
            easing: "ease-in-out",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      });
  };

  const items: MenuItem[] = [
    // ── Theme: straight up (90°)
    {
      angleDeg: 90,
      label: isDark ? "Light mode" : "Dark mode",
      icon: mounted ? (
        isDark ? <SunIcon /> : <MoonIcon />
      ) : (
        <div className="h-[15px] w-[15px]" />
      ),
      onClick: handleTheme,
    },
    // ── Language (112.5°)
    {
      angleDeg: 112.5,
      label: lang === "zh" ? "Switch to EN" : "切換中文",
      icon: (
        <span className="text-[11px] font-bold tracking-tight">
          {lang === "zh" ? "中" : "EN"}
        </span>
      ),
      onClick: () => setLang(lang === "zh" ? "en" : "zh"),
    },
    // ── Font + (135°)
    {
      angleDeg: 135,
      label: "Large text",
      icon: <span className="font-mono text-[13px] font-bold">A+</span>,
      onClick: increase,
      active: fontSize === "lg",
      keepOpen: true,
    },
    // ── Font reset (157.5°)
    {
      angleDeg: 157.5,
      label: "Default text",
      icon: <span className="font-mono text-[11px] font-bold">A</span>,
      onClick: reset,
      active: fontSize === "md",
      keepOpen: true,
    },
    // ── Font − (180°, straight left)
    {
      angleDeg: 180,
      label: "Small text",
      icon: <span className="font-mono text-[10px] font-bold">A−</span>,
      onClick: decrease,
      active: fontSize === "sm",
      keepOpen: true,
    },
  ];

  return (
    <>
      {/* Invisible backdrop — click to close */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Menu container — anchor point = center of FAB */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative h-11 w-11">
          {/* Radial items */}
          <AnimatePresence>
            {open &&
              items.map((item, i) => (
                <RadialItem
                  key={item.angleDeg}
                  item={item}
                  index={i}
                  total={items.length}
                  onClose={() => setOpen(false)}
                />
              ))}
          </AnimatePresence>

          {/* FAB trigger */}
          <motion.button
            onClick={() => setOpen((v) => !v)}
            whileTap={{ scale: 0.88 }}
            aria-label={open ? "Close settings" : "Open settings"}
            className={[
              "absolute inset-0 rounded-full",
              "flex items-center justify-center",
              "border shadow-lg backdrop-blur-md",
              "bg-[var(--card)]/95 transition-colors duration-200",
              open
                ? "border-[var(--accent)]/60 text-[var(--foreground)]"
                : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/40 hover:text-[var(--foreground)]",
            ].join(" ")}
          >
            <AnimatePresence mode="wait">
              {open ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -45, opacity: 0, scale: 0.6 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 45, opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.15 }}
                >
                  <CloseIcon />
                </motion.div>
              ) : (
                <motion.div
                  key={mounted ? (isDark ? "moon" : "sun") : "init"}
                  initial={{ rotate: -20, opacity: 0, scale: 0.6 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 20, opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.15 }}
                >
                  {mounted ? (
                    isDark ? (
                      <MoonIcon size={16} />
                    ) : (
                      <SunIcon size={16} />
                    )
                  ) : (
                    <div className="h-4 w-4" />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </>
  );
}
