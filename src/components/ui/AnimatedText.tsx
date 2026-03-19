"use client";

import { motion } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

export function AnimatedText({ text, className, delay = 0, staggerDelay = 0.04 }: AnimatedTextProps) {
  const words = text.split(" ");

  return (
    <motion.span
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay, delayChildren: delay } },
      }}
      className={className}
      style={{ display: "inline-flex", flexWrap: "wrap", gap: "0.25em" }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
            visible: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] },
            },
          }}
          style={{ display: "inline-block" }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}
