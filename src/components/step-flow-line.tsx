"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";

// Thin gold line that draws itself across the "How we work" step numbers as
// the section scrolls into view. Desktop only (the 4-column layout); below
// lg the steps stack and the line would have nothing to connect.
export function StepFlowLine() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.4"],
  });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="absolute inset-x-0 top-5 hidden lg:block"
    >
      <div className="h-px bg-border" />
      <motion.div
        className="-mt-px h-px origin-left bg-gold/70"
        style={{ scaleX: reduceMotion ? 1 : scaleX }}
      />
    </div>
  );
}
