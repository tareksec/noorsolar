"use client";

import React, { useRef, useEffect } from "react";
import { prefersReducedMotion } from "@/lib/motion";

interface PhotoRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  parallaxPercent?: number;
}

export function PhotoReveal({
  children,
  className = "",
  parallaxPercent = 8,
  ...props
}: PhotoRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || prefersReducedMotion() || window.innerWidth < 768) return;

    let ctx: { revert: () => void } | undefined;
    const container = containerRef.current;
    if (!container) return;

    import("@/lib/gsap").then(({ gsap }) => {
      ctx = gsap.context(() => {
        const img = container.querySelector("img") || container.firstElementChild;
        if (!img) return;

        // Reveal effect on enter
        gsap.fromTo(
          img,
          { scale: 1.15, opacity: 0.8 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: container,
              start: "top 85%",
              once: true,
            },
          }
        );

        // Gentle 8% parallax on scroll
        gsap.to(img, {
          yPercent: parallaxPercent,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }, container);
    });

    return () => {
      if (ctx) ctx.revert();
    };
  }, [parallaxPercent]);

  return (
    <div
      ref={containerRef}
      data-motion="photo-reveal"
      className={`overflow-hidden relative will-change-transform ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
