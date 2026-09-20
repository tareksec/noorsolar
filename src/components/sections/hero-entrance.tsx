"use client";

import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/motion";

export function HeroEntrance() {
  useEffect(() => {
    // Only run on desktop pointer devices and when user does not prefer reduced motion
    if (typeof window === "undefined" || window.innerWidth < 768) return;
    if (prefersReducedMotion()) return;

    let ctx: { revert: () => void } | undefined;

    // Dynamically load GSAP so it is never included in the initial mobile bundle
    import("@/lib/gsap").then(({ gsap }) => {
      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          defaults: { ease: "expo.out" },
        });

        // 1. Photo scale-in reveal (1.15 to 1)
        tl.from(".hero-photo-img", {
          scale: 1.15,
          duration: 1.2,
          ease: "power2.out",
        }, 0);

        // 2. Kicker slide up
        tl.from(".hero-kicker", {
          opacity: 0.6,
          y: 12,
          duration: 0.45,
        }, 0.05);

        // 3. Headline masked slide-up reveal
        tl.from(".hero-word-inner", {
          yPercent: 110,
          duration: 0.85,
          ease: "expo.out",
          stagger: 0.025,
        }, 0.1);

        // 4. Subheadline
        tl.from(".hero-subtext", {
          opacity: 0.6,
          y: 14,
          duration: 0.5,
        }, 0.3);

        // 5. CTA buttons
        tl.from(".hero-cta-btn", {
          opacity: 0.6,
          y: 14,
          duration: 0.45,
          stagger: 0.08,
        }, 0.4);

        // 6. Floating glass cards stagger settle-in
        tl.from('[data-motion="hero-glass"]', {
          y: 28,
          opacity: 0,
          duration: 0.8,
          stagger: 0.18,
          ease: "expo.out",
        }, 0.35);

        // 7. Spec footer
        tl.from(".hero-spec-footer", {
          opacity: 0.6,
          y: 8,
          duration: 0.4,
        }, 0.5);

        // Scroll Parallax on hero photo and hero visual
        gsap.to(".hero-photo-img", {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        gsap.to('[data-motion="hero-parallax"]', {
          yPercent: 5,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    });

    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  return null;
}