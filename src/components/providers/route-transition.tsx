"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { motionTokens } from "@/lib/motion";

/**
 * Visual-only page transition wrapper (App Router).
 *
 * The keyed motion element remounts on every pathname change and plays a fast,
 * subtle fade + slight rise on entry. There is intentionally NO exit animation
 * and NO AnimatePresence gate: the route swap itself is never delayed or
 * blocked — this layer only dresses the incoming content (200-400ms).
 *
 * Hydration-safe: the same tree renders on server and client. Reduced motion
 * only flips animation props (via useReducedMotion), never the element tree,
 * so incoming content appears instantly with zero animation.
 */
export function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      key={pathname}
      data-motion="route-transition"
      initial={shouldReduceMotion ? false : { opacity: 0, y: motionTokens.distance.xs }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: motionTokens.duration.routeTransition,
        ease: motionTokens.ease.expoOut,
      }}
      className="w-full flex-grow flex flex-col"
    >
      {children}
    </motion.div>
  );
}
