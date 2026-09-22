"use client";

import React, { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { usePathname } from "next/navigation";

const MARQUEE_ITEMS_EN = [
  "High-Yield Solar Panels",
  "Lithium LiFePO4 Storage",
  "Hybrid & On-Grid Inverters",
  "Bulk Wholesale Bangladesh",
  "Container-Scale Supply",
  "Engineering-Grade Quality",
  "Direct Importer Pricing",
];

const MARQUEE_ITEMS_BN = [
  "উচ্চ-ফলনশীল সোলার প্যানেল",
  "লিথিয়াম LiFePO4 স্টোরেজ",
  "হাইব্রিড ও অন-গ্রিড ইনভার্টার",
  "সরাসরি কন্টেইনার সরবরাহ",
  "বাণিজ্যিক পাইকারি রেট",
  "ইঞ্জিনিয়ারিং গ্রেড কোয়ালিটি",
  "সরাসরি আমদানিকারক মূল্য",
];

interface TextMarqueeProps {
  locale?: string;
}

export function TextMarquee({ locale }: TextMarqueeProps = {}) {
  const pathname = usePathname() || "";
  const isBn = locale === "bn" || pathname.startsWith("/bn/") || pathname === "/bn";
  const items = isBn ? MARQUEE_ITEMS_BN : MARQUEE_ITEMS_EN;
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
      className="relative z-10 my-6 sm:my-8 py-4 sm:py-5 border-y border-[#0B513E] bg-[#074031] overflow-hidden select-none shadow-md"
      data-motion="text-marquee"
    >
      <div
        ref={trackRef}
        className="flex items-center whitespace-nowrap will-change-transform marquee-anim-track"
      >
        {/* Render twice for continuous loop */}
        {[...Array(2)].map((_, loopIdx) => (
          <div key={loopIdx} className="flex items-center shrink-0">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center">
                <span className="text-xs sm:text-sm font-mono font-bold tracking-widest text-white/95 px-6 sm:px-8">
                  {item}
                </span>
                <span className="w-2 h-2 rounded-full bg-[#FEBE16] shrink-0 shadow-[0_0_8px_#FEBE16]" />
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
