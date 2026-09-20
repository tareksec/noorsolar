"use client";

import React, { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

const MARQUEE_ITEMS = [
  "TIER 1 SOLAR PANELS",
  "LITHIUM LiFePO4 STORAGE",
  "HYBRID & ON-GRID INVERTERS",
  "BULK WHOLESALE BANGLADESH",
  "CONTAINER-SCALE SUPPLY",
  "ENGINEERING-GRADE QUALITY",
  "DIRECT IMPORTER PRICING",
];

export function TextMarquee() {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || prefersReducedMotion() || window.innerWidth < 768) return;

    let ctx: { revert: () => void } | undefined;
    let currentSpeed = 1;
    let targetSpeed = 1;
    let animId: number;

    const track = trackRef.current;
    if (!track) return;

    // Use GSAP if available to smoothly interpolate scroll velocity
    import("@/lib/gsap").then(({ gsap, ScrollTrigger }) => {
      ctx = gsap.context(() => {
        ScrollTrigger.create({
          onUpdate: (self) => {
            // Velocity is pixels per second
            const velocity = Math.abs(self.getVelocity());
            if (velocity > 50) {
              targetSpeed = Math.min(1 + velocity / 600, 3.5);
            }
          },
        });

        // Decay speed smoothly back to 1
        const updateLoop = () => {
          targetSpeed += (1 - targetSpeed) * 0.05;
          currentSpeed += (targetSpeed - currentSpeed) * 0.1;
          if (track) {
            track.style.setProperty("--marquee-speed-multiplier", `${currentSpeed.toFixed(3)}`);
          }
          animId = requestAnimationFrame(updateLoop);
        };
        animId = requestAnimationFrame(updateLoop);
      });
    });

    return () => {
      if (animId) cancelAnimationFrame(animId);
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <div
      ref={marqueeRef}
      className="relative z-10 my-6 sm:my-8 py-4 sm:py-5 border-y border-[#282E28] bg-[#111311] overflow-hidden select-none shadow-md"
      data-motion="text-marquee"
    >
      <div
        ref={trackRef}
        className="flex items-center whitespace-nowrap will-change-transform marquee-anim-track"
      >
        {/* Render twice for continuous loop */}
        {[...Array(2)].map((_, loopIdx) => (
          <div key={loopIdx} className="flex items-center shrink-0">
            {MARQUEE_ITEMS.map((item, idx) => (
              <div key={idx} className="flex items-center">
                <span className="text-xs sm:text-sm font-mono font-bold tracking-widest text-white/95 px-6 sm:px-8 uppercase">
                  {item}
                </span>
                <span className="w-2 h-2 rounded-full bg-[#CEF23E] shrink-0 shadow-[0_0_8px_#CEF23E]" />
              </div>
            ))}
          </div>
        ))}
      </div>

      <style jsx>{`
        .marquee-anim-track {
          animation: marqueeScroll 28s linear infinite;
        }
        .marquee-anim-track:hover {
          animation-play-state: paused;
        }
        @keyframes marqueeScroll {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-anim-track {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}
