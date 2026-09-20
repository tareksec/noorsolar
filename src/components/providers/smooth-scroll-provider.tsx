"use client";

import React, { useEffect, useRef } from "react";
import { prefersReducedMotion, isPointerFine } from "@/lib/motion";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only enable smooth scrolling on desktop pointer devices without reduced motion
    if (prefersReducedMotion() || !isPointerFine()) {
      return;
    }

    let isCleanedUp = false;
    let cleanupFn: (() => void) | undefined;

    Promise.all([import("lenis"), import("@/lib/gsap")]).then(
      ([lenisMod, gsapMod]) => {
        if (isCleanedUp) return;

        const Lenis = lenisMod.default;
        const { gsap, ScrollTrigger } = gsapMod;

        const lenis = new Lenis({
          duration: 1.1,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: "vertical",
          gestureOrientation: "vertical",
          smoothWheel: true,
          wheelMultiplier: 1.0,
          touchMultiplier: 0, // Never hijack native mobile touch scrolling
        });

        // Sync Lenis scroll events with GSAP ScrollTrigger
        const onScroll = () => {
          ScrollTrigger.update();
        };
        lenis.on("scroll", onScroll);

        // Drive Lenis frames via GSAP internal ticker
        const tickerCallback = (time: number) => {
          lenis.raf(time * 1000);
        };
        gsap.ticker.add(tickerCallback);
        gsap.ticker.lagSmoothing(0);

        // Refresh ScrollTrigger after initial mount and layout
        const timer = setTimeout(() => {
          ScrollTrigger.refresh();
        }, 150);

        cleanupFn = () => {
          clearTimeout(timer);
          lenis.off("scroll", onScroll);
          gsap.ticker.remove(tickerCallback);
          lenis.destroy();
        };
      }
    );

    return () => {
      isCleanedUp = true;
      if (cleanupFn) cleanupFn();
    };
  }, []);

  return (
    <div ref={containerRef} data-motion="smooth-scroll" className="w-full">
      {children}
    </div>
  );
}
