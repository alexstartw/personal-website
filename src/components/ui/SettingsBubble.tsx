"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, ALargeSmall } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/context/LanguageContext";
import { useFontSize } from "@/context/FontSizeContext";

// ── Sun / Moon icons (inline to avoid extra import) ───────────────────────────
function SunIcon() {
  return (
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
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
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
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

// ── Shared row button ──────────────────────────────────────────────────────────
function BubbleBtn({
  onClick,
  active,
  children,
  title,
}: {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  active?: boolean;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={[
        "flex items-center justify-center rounded-lg w-8 h-8 text-xs font-medium transition-all duration-150",
        active
          ? "bg-[var(--accent)] text-white shadow-sm"
          : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--border)]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

// ── SettingsBubble ─────────────────────────────────────────────────────────────
export function SettingsBubble() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

  // Auto-close on click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);
  const { lang, setLang } = useLanguage();
  const { fontSize, increase, decrease, reset } = useFontSize();

  const isDark = theme === "dark";

  const handleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
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

  const panel = [
    // Font size row
    {
      key: "font",
      content: (
        <div className="flex items-center gap-1">
          <BubbleBtn
            onClick={decrease}
            active={fontSize === "sm"}
            title="Small text"
          >
            <span className="text-[10px] font-mono">A-</span>
          </BubbleBtn>
          <BubbleBtn
            onClick={reset}
            active={fontSize === "md"}
            title="Default text"
          >
            <ALargeSmall className="w-3.5 h-3.5" />
          </BubbleBtn>
          <BubbleBtn
            onClick={increase}
            active={fontSize === "lg"}
            title="Large text"
          >
            <span className="text-[13px] font-mono">A+</span>
          </BubbleBtn>
        </div>
      ),
    },
    // Language row — capsule
    {
      key: "lang",
      content: (
        <div className="relative flex items-center rounded-lg border border-[var(--border)] bg-[var(--border)]/40 p-0.5 gap-0">
          {/* sliding pill */}
          <motion.span
            layout
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute top-0.5 bottom-0.5 rounded-md bg-[var(--accent)] shadow-sm"
            style={{
              left: lang === "zh" ? "2px" : "50%",
              right: lang === "zh" ? "50%" : "2px",
            }}
          />
          {(["zh", "en"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={[
                "relative z-10 flex-1 px-3 py-1 text-[11px] font-medium rounded-md transition-colors duration-150",
                lang === l
                  ? "text-white"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]",
              ].join(" ")}
            >
              {l === "zh" ? "中" : "EN"}
            </button>
          ))}
        </div>
      ),
    },
    // Theme row — single toggle button
    {
      key: "theme",
      content: (
        <button
          onClick={handleTheme}
          title={isDark ? "Switch to light" : "Switch to dark"}
          className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--border)] transition-colors duration-150"
        >
          <span className="text-[11px] font-medium">
            {isDark ? "Dark" : "Light"}
          </span>
          <motion.div
            key={isDark ? "moon" : "sun"}
            initial={{ scale: 0, rotate: -30, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 30, opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {isDark ? <MoonIcon /> : <SunIcon />}
          </motion.div>
        </button>
      ),
    },
  ];

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2"
    >
      {/* Expanded panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
            className="bg-[var(--card)]/90 backdrop-blur-md border border-[var(--border)] rounded-2xl p-2 shadow-xl flex flex-col gap-1"
          >
            {panel.map(({ key, content }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, duration: 0.16 }}
              >
                {content}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.92 }}
        aria-label="Settings"
        className={[
          "w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-colors duration-200",
          "bg-[var(--card)]/90 backdrop-blur-md border border-[var(--border)]",
          "text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--accent)]/50",
          open ? "border-[var(--accent)]/50 text-[var(--foreground)]" : "",
        ].join(" ")}
      >
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Settings className="w-4 h-4" />
        </motion.div>
      </motion.button>
    </div>
  );
}
