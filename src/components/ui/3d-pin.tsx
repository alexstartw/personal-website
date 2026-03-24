"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PinContainerProps {
  children: React.ReactNode;
  title?: string;
  onClick?: () => void;
  className?: string;
  containerClassName?: string;
}

export const PinContainer = ({
  children,
  title,
  onClick,
  className,
  containerClassName,
}: PinContainerProps) => {
  const [transform, setTransform] = useState(
    "translate(-50%,-50%) rotateX(0deg) scale(1)"
  );

  return (
    <div
      className={cn(
        "relative group/pin z-50 cursor-pointer select-none",
        containerClassName
      )}
      onMouseEnter={() =>
        setTransform("translate(-50%,-50%) rotateX(40deg) scale(0.8)")
      }
      onMouseLeave={() =>
        setTransform("translate(-50%,-50%) rotateX(0deg) scale(1)")
      }
      onClick={onClick}
    >
      {/* 3D perspective stage */}
      <div
        style={{
          perspective: "1000px",
          transform: "rotateX(70deg) translateZ(0px)",
        }}
        className="absolute left-1/2 top-1/2 ml-[0.09375rem] mt-4 -translate-x-1/2 -translate-y-1/2"
      >
        <div
          style={{ transform, transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)" }}
          className={cn(
            "absolute left-1/2 top-1/2 p-4",
            "flex flex-col justify-start items-start",
            "rounded-2xl overflow-hidden",
            "bg-[var(--card)] border border-[var(--border)]",
            "shadow-[0_8px_24px_rgba(0,0,0,0.12)]",
            "group-hover/pin:border-[var(--accent)]/30",
            "group-hover/pin:shadow-[0_8px_24px_rgba(0,0,0,0.2)]",
            "transition-[border-color,box-shadow] duration-500"
          )}
        >
          <div className={cn("relative z-50 w-full h-full", className)}>
            {children}
          </div>
        </div>
      </div>

      {/* Pin overlay — beam + ripples + badge */}
      <PinPerspective title={title} />
    </div>
  );
};

export const PinPerspective = ({ title }: { title?: string }) => {
  return (
    <motion.div
      className={cn(
        "pointer-events-none w-full h-full",
        "flex items-center justify-center",
        "opacity-0 group-hover/pin:opacity-100",
        "z-[60] transition-opacity duration-500"
      )}
    >
      <div className="w-full h-full -mt-7 flex-none inset-0">
        {/* Title badge */}
        {title && (
          <div className="absolute top-0 inset-x-0 flex justify-center">
            <div className="relative flex items-center z-10 rounded-full bg-[var(--card)] border border-[var(--border)] py-0.5 px-4">
              <span className="relative z-20 text-[var(--foreground)] text-[10px] font-mono tracking-widest uppercase py-0.5">
                {title}
              </span>
              <span className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/80 to-transparent" />
            </div>
          </div>
        )}

        {/* Ripple circles */}
        <div
          style={{
            perspective: "1000px",
            transform: "rotateX(70deg) translateZ(0)",
          }}
          className="absolute left-1/2 top-1/2 ml-[0.09375rem] mt-4 -translate-x-1/2 -translate-y-1/2"
        >
          {[0, 2, 4].map((delay) => (
            <motion.div
              key={delay}
              initial={{ opacity: 0, scale: 0, x: "-50%", y: "-50%" }}
              animate={{ opacity: [0, 0.6, 0], scale: 1, z: 0 }}
              transition={{ duration: 5, repeat: Infinity, delay }}
              className="absolute left-1/2 top-1/2 h-[10rem] w-[10rem] rounded-full bg-[var(--accent)]/[0.07] shadow-[0_4px_16px_rgba(0,0,0,0.15)]"
            />
          ))}
        </div>

        {/* Glowing pin beam */}
        <>
          <motion.div className="absolute right-1/2 bottom-1/2 bg-gradient-to-b from-transparent to-[var(--accent)] translate-y-[14px] w-px h-20 group-hover/pin:h-40 blur-[2px] transition-all duration-500" />
          <motion.div className="absolute right-1/2 bottom-1/2 bg-gradient-to-b from-transparent to-[var(--accent)] translate-y-[14px] w-px h-20 group-hover/pin:h-40 transition-all duration-500" />
          <motion.div className="absolute right-1/2 translate-x-[1.5px] bottom-1/2 bg-[var(--accent)] translate-y-[14px] w-[4px] h-[4px] rounded-full z-40 blur-[3px]" />
          <motion.div className="absolute right-1/2 translate-x-[0.5px] bottom-1/2 bg-[var(--accent)]/80 translate-y-[14px] w-[2px] h-[2px] rounded-full z-40" />
        </>
      </div>
    </motion.div>
  );
};
