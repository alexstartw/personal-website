"use client";

import { useState, useEffect, RefObject } from "react";

export interface Heading {
  id: string;
  text: string;
  level: 1 | 2 | 3;
}

export function useHeadingObserver(
  containerRef: RefObject<HTMLElement | null>,
  contentKey: string,
) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Extract headings after content renders
  useEffect(() => {
    if (!contentKey) {
      setHeadings([]);
      setActiveId(null);
      return;
    }

    // Delay to let AnimatePresence finish + DOM settle
    const timer = setTimeout(() => {
      const el = containerRef.current;
      if (!el) return;

      const nodes = el.querySelectorAll("h1, h2, h3");
      const extracted: Heading[] = Array.from(nodes)
        .filter((n) => n.id)
        .map((n) => ({
          id: n.id,
          text: n.textContent?.trim() ?? "",
          level: parseInt(n.tagName[1]) as 1 | 2 | 3,
        }));

      setHeadings(extracted);
      setActiveId(null);
    }, 350);

    return () => clearTimeout(timer);
  }, [contentKey, containerRef]);

  // Scroll spy via IntersectionObserver
  useEffect(() => {
    if (!contentKey || headings.length === 0) return;
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the first intersecting heading (topmost visible)
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        root: el,
        rootMargin: "-56px 0px -60% 0px",
        threshold: 0,
      },
    );

    headings.forEach(({ id }) => {
      const node = el.querySelector(`#${CSS.escape(id)}`);
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, [headings, contentKey, containerRef]);

  // Scroll progress bar
  useEffect(() => {
    if (!contentKey) return;
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const max = scrollHeight - clientHeight;
      setScrollProgress(max > 0 ? scrollTop / max : 0);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [containerRef, contentKey]);

  return { headings, activeId, scrollProgress };
}
