"use client";

import { useRef, useCallback, forwardRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";

export interface TimelineRevealCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Plain (base) content */
  base: React.ReactNode;
  /** Accented (revealed) content */
  overlay: React.ReactNode;
  /** Clip-path origin — x position as CSS value, defaults to center */
  originX?: string;
  /** Clip-path origin — y position as CSS value, defaults to center */
  originY?: string;
  /** Accent background colour for the overlay */
  accent?: string;
}

export const TimelineRevealCard = forwardRef<HTMLDivElement, TimelineRevealCardProps>(
  (
    {
      base,
      overlay,
      originX = "50%",
      originY = "50%",
      accent = "var(--accent)",
      className,
      ...rest
    },
    ref,
  ) => {
    const holderRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    const assignRef = useCallback(
      (el: HTMLDivElement | null) => {
        holderRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
      },
      [ref],
    );

    const startClip = `circle(0px at ${originX} ${originY})`;
    const expandClip = `circle(200% at ${originX} ${originY})`;

    useGSAP(
      () => {
        gsap.set(overlayRef.current, { clipPath: startClip });
      },
      { scope: holderRef, dependencies: [originX, originY] },
    );

    const reveal = () => {
      gsap.to(overlayRef.current, {
        clipPath: expandClip,
        duration: 0.55,
        ease: "expo.inOut",
      });
    };

    const conceal = () => {
      gsap.to(overlayRef.current, {
        clipPath: startClip,
        duration: 0.65,
        ease: "expo.out",
      });
    };

    return (
      <div
        ref={assignRef}
        onMouseEnter={reveal}
        onMouseLeave={conceal}
        className={cn("relative overflow-hidden rounded-xl", className)}
        {...rest}
      >
        {/* Base layer */}
        <div>{base}</div>

        {/* Revealed overlay layer */}
        <div
          ref={overlayRef}
          className="absolute inset-0"
          style={{ backgroundColor: accent }}
        >
          {overlay}
        </div>
      </div>
    );
  },
);

TimelineRevealCard.displayName = "TimelineRevealCard";
