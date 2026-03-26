"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSiteMode } from "@/context/SiteModeContext";
import TetrisLoading from "./tetris-loader";

export function ModeTransitionOverlay() {
  const { transitionPhase } = useSiteMode();
  const visible = transitionPhase !== "idle";
  // Fade out only when 'opening' (new page is ready)
  const opacity = transitionPhase === "opening" ? 0 : 1;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="mode-overlay"
          className="fixed inset-0 z-[9999] bg-white dark:bg-black flex flex-col items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <TetrisLoading size="sm" speed="fast" showLoadingText={false} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
