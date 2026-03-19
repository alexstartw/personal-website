"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { timeline } from "@/data/timeline";
import { FadeIn } from "@/components/ui/FadeIn";
import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/utils";

export function Timeline() {
  const lineRef = useRef<HTMLDivElement>(null);
  const isLineInView = useInView(lineRef, { once: true, margin: "-100px" });

  return (
    <section className="max-w-5xl mx-auto px-6 py-24 border-t border-[var(--border)]">
      <div className="grid md:grid-cols-[1fr_2fr] gap-16">
        <FadeIn>
          <p className="text-xs font-medium tracking-widest uppercase text-[var(--accent)]">
            Experience
          </p>
        </FadeIn>

        <div className="relative" ref={lineRef}>
          {/* Timeline vertical line */}
          <div className="absolute left-3.5 top-2 bottom-2 w-px bg-[var(--border)]">
            <motion.div
              initial={{ scaleY: 0 }}
              animate={isLineInView ? { scaleY: 1 } : {}}
              transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="w-full h-full bg-gradient-to-b from-[var(--accent)] to-[var(--border)] origin-top"
            />
          </div>

          <div className="space-y-10">
            {timeline.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.07,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="relative pl-10"
              >
                {/* Dot */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.07 + 0.2 }}
                  className={cn(
                    "absolute left-0 top-1.5 w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs",
                    event.type === "work"
                      ? "border-[var(--accent)] bg-[var(--background)] text-[var(--accent)]"
                      : "border-[var(--border)] bg-[var(--background)] text-[var(--muted)]"
                  )}
                >
                  {event.type === "work" ? "W" : "E"}
                </motion.div>

                <div>
                  <p className="text-xs text-[var(--muted)] mb-1">{event.year}</p>
                  <h3 className="font-semibold text-[var(--foreground)] mb-0.5">{event.title}</h3>
                  <p className="text-sm text-[var(--accent)] mb-3">{event.company}</p>
                  <ul className="space-y-1.5 mb-4">
                    {event.description.map((line, j) => (
                      <li key={j} className="text-sm text-[var(--muted)] flex gap-2">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-[var(--border)] shrink-0" />
                        {line}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1.5">
                    {event.tags.map((tag) => (
                      <Tag key={tag} variant="accent">{tag}</Tag>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
