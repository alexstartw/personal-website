"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSiteMode } from "@/context/SiteModeContext";

const EASE = [0.76, 0, 0.24, 1] as const;

export function ModeTransitionOverlay() {
  const { transitionPhase } = useSiteMode();
  const visible = transitionPhase !== "idle";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="mode-overlay"
          className="fixed inset-0 z-[9999] bg-black pointer-events-none"
          initial={{ clipPath: "circle(0% at 50% 50%)" }}
          animate={{
            clipPath:
              transitionPhase === "closing"
                ? "circle(150% at 50% 50%)"
                : "circle(0% at 50% 50%)",
          }}
          exit={{ clipPath: "circle(0% at 50% 50%)" }}
          transition={{ duration: 0.65, ease: EASE }}
        />
      )}
    </AnimatePresence>
  );
}
