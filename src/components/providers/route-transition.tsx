"use client";

import React from "react";

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
  return (
    <div
      data-motion="route-transition"
      className="w-full flex-grow flex flex-col"
    >
      {children}
    </div>
  );
}
