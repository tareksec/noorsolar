"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";

export default function PublicTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 6 }}
      animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{
        duration: 0.22,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="min-h-screen flex flex-col"
    >
      {children}
    </motion.div>
  );
}
