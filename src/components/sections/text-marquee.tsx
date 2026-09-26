"use client";

import React, { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { usePathname } from "next/navigation";

interface MarqueeItem {
  id: string;
  labelEn: string;
  labelBn: string;
  icon: (props: { className?: string }) => React.JSX.Element;
}

const SolarPanelIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {/* Angled PV module frame */}
    <rect x="2" y="3" width="20" height="12" rx="1.5" />
    {/* Cell dividers */}
    <line x1="12" y1="3" x2="12" y2="15" />
    <line x1="2" y1="9" x2="22" y2="9" />
    {/* Stand / mounting legs */}
    <line x1="6" y1="15" x2="4" y2="21" />
    <line x1="18" y1="15" x2="20" y2="21" />
    <line x1="8" y1="21" x2="16" y2="21" />
  </svg>
);

const BatteryIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {/* Battery body */}
    <rect x="1" y="6" width="18" height="12" rx="2" />
    {/* Terminal pin */}
    <path d="M23 10v4" />
    {/* Charge cell bars */}
    <line x1="6" y1="10" x2="6" y2="14" />
    <line x1="10" y1="10" x2="10" y2="14" />
    <line x1="14" y1="10" x2="14" y2="14" />
  </svg>
);

const InverterIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {/* Inverter chassis */}
    <rect x="3" y="4" width="18" height="16" rx="2" />
    {/* Sine wave AC conversion */}
    <path d="M7 12c1.2-2 2.4-2 3.5 0s2.3 2 3.5 0 2.3-2 3-0.5" />
    {/* Status indicator LEDs */}
    <circle cx="7" cy="7" r="1" fill="currentColor" />
    <circle cx="10" cy="7" r="1" fill="currentColor" />
  </svg>
);

const ContainerIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {/* Freight container box */}
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
);

const IndustrialBackupIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
    aria-hidden="true"
  >
    {/* Bold industrial power bolt */}
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

const RackingIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {/* Mounting / engineering tool */}
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

const DirectImporterIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {/* Verified importer shield */}
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

// Noor Solar context items matching Bangladesh B2B wholesale supply
const MARQUEE_ITEMS: MarqueeItem[] = [
  {
    id: "solar-panels",
    labelEn: "High-Yield Solar Panels",
    labelBn: "উচ্চ-ফলনশীল সোলার প্যানেল",
    icon: SolarPanelIcon,
  },
  {
    id: "battery-storage",
    labelEn: "Lithium LiFePO4 Storage",
    labelBn: "লিথিয়াম LiFePO4 স্টোরেজ",
    icon: BatteryIcon,
  },
  {
    id: "inverters",
    labelEn: "Hybrid & On-Grid Inverters",
    labelBn: "হাইব্রিড ও অন-গ্রিড ইনভার্টার",
    icon: InverterIcon,
  },
  {
    id: "container-supply",
    labelEn: "Container-Scale Supply",
    labelBn: "সরাসরি কন্টেইনার সরবরাহ",
    icon: ContainerIcon,
  },
  {
    id: "bulk-wholesale",
    labelEn: "Bulk Wholesale Bangladesh",
    labelBn: "বাণিজ্যিক পাইকারি রেট",
    icon: DirectImporterIcon,
  },
  {
    id: "industrial-backup",
    labelEn: "Industrial & EPC Backup",
    labelBn: "ইন্ডাস্ট্রিয়াল ও ইপিসি ব্যাকআপ",
    icon: IndustrialBackupIcon,
  },
  {
    id: "racking-components",
    labelEn: "Racking & DC Hardware",
    labelBn: "মাউন্টিং র‍্যাকিং ও সরঞ্জাম",
    icon: RackingIcon,
  },
  {
    id: "direct-pricing",
    labelEn: "Direct Importer Pricing",
    labelBn: "সরাসরি আমদানিকারক মূল্য",
    icon: DirectImporterIcon,
  },
];

interface TextMarqueeProps {
  locale?: string;
}

export function TextMarquee({ locale }: TextMarqueeProps = {}) {
  const pathname = usePathname() || "";
  const isBn = locale === "bn" || pathname.startsWith("/bn/") || pathname === "/bn";
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
            const velocity = Math.abs(self.getVelocity());
            if (velocity > 50) {
              targetSpeed = Math.min(1 + velocity / 600, 3.5);
            }
          },
        });

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
    <section
      ref={marqueeRef}
      aria-label={isBn ? "নূর সোলার পণ্য ও সরবরাহ পরিচিতি" : "Noor Solar Products and Supply Ticker"}
      className="relative z-10 my-4 sm:my-6 py-3.5 sm:py-4 border-y border-[#0B513E] dark:border-[#108958]/35 bg-[#074031] dark:bg-[#07241C] overflow-hidden select-none shadow-[0_4px_16px_rgba(7,64,49,0.18)]"
      data-motion="text-marquee"
    >
      <div
        ref={trackRef}
        className="flex items-center whitespace-nowrap will-change-transform marquee-anim-track"
      >
        {/* Render duplicate tracks for continuous seamless loop */}
        {[0, 1].map((loopIdx) => (
          <div key={loopIdx} className="flex items-center shrink-0">
            {MARQUEE_ITEMS.map((item) => {
              const Icon = item.icon;
              const label = isBn ? item.labelBn : item.labelEn;

              return (
                <div key={`${loopIdx}-${item.id}`} className="flex items-center">
                  <div className="inline-flex items-center gap-2.5 sm:gap-3 px-5 sm:px-7 text-white transition-opacity hover:opacity-90">
                    {/* Brand Electric Lime Icon */}
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#CEF23E] shrink-0 drop-shadow-[0_0_6px_rgba(206,242,62,0.35)]" />
                    <span className="text-xs sm:text-[13px] md:text-sm font-mono font-semibold tracking-wider text-white/95">
                      {label}
                    </span>
                  </div>
                  {/* Brand Solar Gold separator dot with glow */}
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[#FEBE16] shrink-0 shadow-[0_0_8px_#FEBE16] mx-1 sm:mx-2"
                    aria-hidden="true"
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <style jsx>{`
        .marquee-anim-track {
          animation: marqueeScroll 34s linear infinite;
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
    </section>
  );
}
