/**
 * src/lib/motion.ts
 * Single source of truth for motion tokens across Noor Solar Energy.
 * Client-safe: exports constants and pure helpers for GSAP and Motion (motion/react).
 */

export const motionTokens = {
  // Durations in seconds
  duration: {
    fast: 0.2,
    base: 0.4,
    slow: 0.8,
    hero: 1.2,
    countUp: 1.8,
    routeTransition: 0.25,
  },

  // Easing curves
  ease: {
    // Cubic bezier curves for Motion and CSS transitions
    expoOut: [0.16, 1, 0.3, 1] as const,
    inOutSoft: [0.4, 0, 0.2, 1] as const,
    smoothOut: [0.25, 1, 0.5, 1] as const,

    // GSAP easing strings
    gsapExpoOut: "expo.out",
    gsapPower2Out: "power2.out",
    gsapSmooth: "power3.out",

    // Spring configurations for Motion
    springQuick: { stiffness: 400, damping: 30 },
    springSmooth: { stiffness: 260, damping: 25 },
    springBouncy: { stiffness: 350, damping: 20 },
  },

  // Pixel displacement distances
  distance: {
    xs: 6,
    sm: 12,
    md: 24,
    lg: 48,
    xl: 80,
  },

  // Stagger intervals in seconds
  stagger: {
    fast: 0.05,
    base: 0.1,
    cards: 0.12,
    links: 0.06,
  },
} as const;

/**
 * Checks if the user has requested reduced motion.
 * Returns false on server.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Checks if the primary input is an accurate pointer device (mouse/trackpad).
 * Returns false on touch devices or server.
 */
export function isPointerFine(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: fine)").matches;
}

/**
 * Common Motion transition presets
 */
export const transitions = {
  fast: {
    duration: motionTokens.duration.fast,
    ease: motionTokens.ease.expoOut,
  },
  base: {
    duration: motionTokens.duration.base,
    ease: motionTokens.ease.expoOut,
  },
  slow: {
    duration: motionTokens.duration.slow,
    ease: motionTokens.ease.expoOut,
  },
  hero: {
    duration: motionTokens.duration.hero,
    ease: motionTokens.ease.expoOut,
  },
  spring: motionTokens.ease.springSmooth,
  springQuick: motionTokens.ease.springQuick,
};
