"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TetrisGame } from "@/components/tetris/TetrisGame";

export default function NotFound() {
  return (
    <main className="min-h-screen pt-20 pb-16 flex flex-col items-center px-4">
      {/* 404 heading */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-8"
      >
        <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-[var(--accent)] mb-3">
          Error 404
        </p>
        <h1 className="text-8xl md:text-9xl font-bold text-[var(--muted)]/20 font-mono leading-none select-none">
          404
        </h1>
        <p className="text-[var(--muted)] text-sm mt-3">
          This page wandered off. Play some Tetris while you&apos;re here.
        </p>
        <Link
          href="/"
          className="inline-block mt-3 text-sm text-[var(--accent)] hover:underline underline-offset-4 transition-colors"
        >
          ← Back to home
        </Link>
      </motion.div>

      {/* Game */}
      <TetrisGame />
    </main>
  );
}
