"use client";

import { useEffect } from "react";

export function HeroEntrance() {
  useEffect(() => {
    // Only run on desktop and when user does not prefer reduced motion
    if (typeof window === "undefined" || window.innerWidth < 1024) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Dynamically load GSAP so it is never included in the initial mobile bundle
    import("@/lib/gsap").then(({ gsap }) => {
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
      });

      tl.from(".hero-kicker", {
        opacity: 0.7,
        y: 8,
        duration: 0.4,
      })
        .from(
          ".hero-subtext",
          {
            opacity: 0.7,
            y: 8,
            duration: 0.45,
          },
          "-=0.2"
        )
        .from(
          ".hero-cta-btn",
          {
            opacity: 0.7,
            y: 8,
            duration: 0.4,
            stagger: 0.08,
          },
          "-=0.25"
        )
        .from(
          ".hero-spec-footer",
          {
            opacity: 0.7,
            y: 6,
            duration: 0.35,
          },
          "-=0.2"
        );
    });
  }, []);

  return null;
}