"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

export interface StickyFeatureItem {
  id?: string;
  number: string;
  title: string;
  description: string;
  imageUrl: string;
  bgColor: string;
  textColor: string;
  badge?: string;
  link?: string;
}

const DEFAULT_SOLAR_FEATURES_EN: StickyFeatureItem[] = [
  {
    id: "solar-panels",
    number: "01",
    title: "Tier-1 N-Type TOPCon Solar Panels",
    description:
      "Direct manufacturer import of high-efficiency monocrystalline and bifacial solar modules. Verified with factory Sun-simulator flash tests and EL crack scans. Backed by 30-year linear performance warranties.",
    imageUrl: "/photos/cat-solar-panels.webp",
    bgColor: "bg-[#F3F6F2] dark:bg-[#121B16] border border-[#D8E2D5] dark:border-white/10",
    textColor: "text-[#1C2820] dark:text-[#E2EAE4]",
    badge: "30-YEAR WARRANTY",
    link: "/category/solar-panels",
  },
  {
    id: "solar-inverters",
    number: "02",
    title: "Commercial Multi-MPPT Solar Inverters",
    description:
      "Heavy-duty 5kW to 100kW+ on-grid and hybrid inverters engineered for industrial continuity. Delivering 98.6%+ conversion efficiency, IP66 weatherproofing, and 24/7 cloud telemetry monitoring.",
    imageUrl: "/photos/cat-solar-inverters.webp",
    bgColor: "bg-[#EEF4F8] dark:bg-[#111922] border border-[#D2E1ED] dark:border-white/10",
    textColor: "text-[#162330] dark:text-[#E0EBF5]",
    badge: "98.6% EFFICIENCY",
    link: "/category/solar-inverters",
  },
  {
    id: "lithium-batteries",
    number: "03",
    title: "LiFePO4 Industrial Energy Storage (ESS)",
    description:
      "Grade-A prismatic lithium iron phosphate rack batteries and scalable ESS units. Rated for 6,000+ deep discharge cycles with smart active BMS protection for peak shaving and zero-downtime backup.",
    imageUrl: "/photos/cat-lithium-batteries.webp",
    bgColor: "bg-[#FBF6ED] dark:bg-[#1E1911] border border-[#E9DDC9] dark:border-white/10",
    textColor: "text-[#2A2114] dark:text-[#F3ECDD]",
    badge: "6,000+ CYCLES",
    link: "/category/lithium-batteries",
  },
  {
    id: "container-indent",
    number: "04",
    title: "Direct Container Indent & Dhaka Buffer Depot",
    description:
      "Full container load (40HQ) indenting directly from Tier-1 factories with port customs clearance, complemented by ready pallet buffer stock in our central Dhaka depot for immediate dispatch.",
    imageUrl: "/photos/b2b-container-indent.webp",
    bgColor: "bg-[#F5F5F3] dark:bg-[#161616] border border-[#E2E2DE] dark:border-white/10",
    textColor: "text-[#1C1C1A] dark:text-[#E6E6E3]",
    badge: "IMMEDIATE DISPATCH",
    link: "/contact",
  },
];

const DEFAULT_SOLAR_FEATURES_BN: StickyFeatureItem[] = [
  {
    id: "solar-panels",
    number: "০১",
    title: "টায়ার-১ এন-টাইপ TOPCon সোলার প্যানেল",
    description:
      "বাণিজ্যিক ও শিল্প প্রকল্পের জন্য সরাসরি ফ্যাক্টরি থেকে আমদানিকৃত উচ্চ-দক্ষতাসম্পন্ন বাইফেসিয়াল সোলার মডিউল। প্রতিটি ব্যাচে সান-সিমুলেটর টেস্ট ও EL ক্র্যাক স্ক্যান ভেরিফিকেশন এবং ৩০ বছরের পারফরম্যান্স ওয়ারেন্টি।",
    imageUrl: "/photos/cat-solar-panels.webp",
    bgColor: "bg-[#F3F6F2] dark:bg-[#121B16] border border-[#D8E2D5] dark:border-white/10",
    textColor: "text-[#1C2820] dark:text-[#E2EAE4]",
    badge: "৩০ বছরের ওয়ারেন্টি",
    link: "/bn/category/solar-panels",
  },
  {
    id: "solar-inverters",
    number: "০২",
    title: "কমার্শিয়াল মাল্টি-MPPT সোলার ইনভার্টার",
    description:
      "শিল্প কারখানার নিরবচ্ছিন্ন উৎপাদনের জন্য ৫kW থেকে ১০০kW+ অন-গ্রিড ও হাইব্রিড ইনভার্টার। ৯৮.৬%+ কনভার্শন এফিসিয়েন্সি, IP66 ওয়েদারপ্রুফ কেসিং এবং ২৪/৭ ক্লাউড টেলিমেট্রি মনিটরিং সুবিধা।",
    imageUrl: "/photos/cat-solar-inverters.webp",
    bgColor: "bg-[#EEF4F8] dark:bg-[#111922] border border-[#D2E1ED] dark:border-white/10",
    textColor: "text-[#162330] dark:text-[#E0EBF5]",
    badge: "৯৮.৬% এফিসিয়েন্সি",
    link: "/bn/category/solar-inverters",
  },
  {
    id: "lithium-batteries",
    number: "০৩",
    title: "LiFePO4 ইন্ডাস্ট্রিয়াল এনার্জি স্টোরেজ (ESS)",
    description:
      "গ্রেড-এ প্রিজম্যাটিক সেল ও স্মার্ট অ্যাক্টিভ BMS সমৃদ্ধ ৬,০০০+ ডিপ সাইকেল লাইফের লিথিয়াম স্টোরেজ। লোডশেডিংয়ে নিরবচ্ছিন্ন বিদ্যুৎ ও পিক শেভিংয়ের জন্য মেগাওয়াট স্কেল পর্যন্ত এক্সপ্যান্ডেবল।",
    imageUrl: "/photos/cat-lithium-batteries.webp",
    bgColor: "bg-[#FBF6ED] dark:bg-[#1E1911] border border-[#E9DDC9] dark:border-white/10",
    textColor: "text-[#2A2114] dark:text-[#F3ECDD]",
    badge: "৬,০০০+ সাইকেল",
    link: "/bn/category/lithium-batteries",
  },
  {
    id: "container-indent",
    number: "০৪",
    title: "সরাসরি কন্টেইনার ইনডেন্ট ও বাফার ডিপো স্টক",
    description:
      "লার্জ-স্কেল প্রকল্পের জন্য সরাসরি ফ্যাক্টরি থেকে ৪০HQ ফুল কন্টেইনার আমদানি ও বন্দর কাস্টমস ক্লিয়ারেন্স সুবিধা এবং জরুরি ডেলিভারির জন্য আমাদের ঢাকা বাফার ডিপোতে প্রস্তুত প্যালেট স্টক।",
    imageUrl: "/photos/b2b-container-indent.webp",
    bgColor: "bg-[#F5F5F3] dark:bg-[#161616] border border-[#E2E2DE] dark:border-white/10",
    textColor: "text-[#1C1C1A] dark:text-[#E6E6E3]",
    badge: "তাৎক্ষণিক সাইট সরবরাহ",
    link: "/bn/contact",
  },
];

interface StickyFeatureSectionProps {
  features?: StickyFeatureItem[];
  title?: string;
  subtitle?: string;
  badge?: string;
  locale?: string;
}

export function StickyFeatureSection({
  features,
  title,
  subtitle,
  badge,
  locale,
}: StickyFeatureSectionProps = {}) {
  const isBn = locale === "bn";
  const featureList =
    features || (isBn ? DEFAULT_SOLAR_FEATURES_BN : DEFAULT_SOLAR_FEATURES_EN);
  const displayTitle = title || (isBn ? "আমরা যা সরবরাহ করি" : "WE PROVIDE");
  const displaySubtitle =
    subtitle ||
    (isBn
      ? "বাণিজ্যিক ও শিল্প প্রকল্পের জন্য টায়ার-১ সোলার প্যানেল, ইনভার্টার ও ব্যাটারি স্টোরেজ"
      : "Engineered Tier-1 Solar Panels, Commercial Inverters & Industrial Energy Storage for Commercial & EPC Projects");
  const displayBadge =
    badge || (isBn ? "নূর সোলার / মূল সরবরাহ লাইনআপ" : "NOOR SOLAR / CORE SUPPLY");

  const pinSectionRef = useRef<HTMLDivElement>(null);
  const cardsWrapperRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  // 60FPS / 120FPS GPU-Accelerated GSAP Pin & Stacking Card Scroll
  useGSAP(
    () => {
      const section = pinSectionRef.current;
      const cards = gsap.utils.toArray<HTMLElement>(".gsap-stacked-card");

      if (!section || cards.length < 2) return;

      // Master scroll timeline with fluid 1s scrub smoothing
      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "center center",
          end: () => `+=${cards.length * 85}%`,
          pin: true,
          scrub: 1, // Buttery smooth momentum scrub
          fastScrollEnd: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const step = Math.min(
              cards.length - 1,
              Math.floor(self.progress * cards.length + 0.05)
            );
            // Throttle state update to prevent redundant React re-renders while scrolling
            if (step !== activeIndexRef.current) {
              activeIndexRef.current = step;
              setActiveCardIndex(step);
            }
          },
        },
      });

      // Initial GPU-accelerated setup: card 0 centered, subsequent cards hidden below
      cards.forEach((card, index) => {
        gsap.set(card, {
          force3D: true,
          transformOrigin: "top center",
        });

        if (index > 0) {
          gsap.set(card, {
            yPercent: 100,
            scale: 0.96,
            opacity: 0,
            pointerEvents: "none",
          });
        }
      });

      // Seamless card stacking sequence
      cards.forEach((card, index) => {
        if (index === 0) return;

        const prevCards = cards.slice(0, index);

        // Previous cards recess smoothly without expensive CSS blur filters
        scrollTimeline
          .to(
            prevCards,
            {
              scale: (i) => 1 - (index - i) * 0.035,
              y: (i) => -(index - i) * 12,
              opacity: (i) => Math.max(0.4, 1 - (index - i) * 0.22),
              force3D: true,
              ease: "power1.inOut",
              duration: 1,
            },
            `card-${index}`
          )
          // Current card glides in smoothly
          .fromTo(
            card,
            {
              yPercent: 100,
              scale: 0.96,
              opacity: 0,
            },
            {
              yPercent: 0,
              scale: 1,
              opacity: 1,
              pointerEvents: "auto",
              force3D: true,
              ease: "power1.inOut",
              duration: 1,
            },
            `card-${index}`
          );
      });

      ScrollTrigger.refresh();
    },
    { scope: pinSectionRef, dependencies: [featureList] }
  );

  return (
    <div
      ref={pinSectionRef}
      className="w-full min-h-[85vh] flex flex-col justify-center items-center bg-[#FAF9F6] dark:bg-[#0B0F0D] pt-2 pb-24 sm:pb-32 select-none transition-colors"
      style={{ willChange: "transform" }}
    >
      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section - Compact & Elevated */}
        <div className="text-center max-w-3xl mx-auto mb-4 sm:mb-5">
          {displayBadge && (
            <span className="inline-block px-3 py-0.5 rounded-full bg-[#108958]/10 text-[#108958] font-mono text-[11px] font-bold tracking-widest uppercase mb-1">
              {displayBadge}
            </span>
          )}
          <h2 className="text-2xl sm:text-3xl lg:text-[38px] font-black uppercase tracking-tight text-neutral-900 dark:text-white leading-none">
            {displayTitle}
          </h2>
          <p className="text-xs sm:text-[13px] text-neutral-600 dark:text-neutral-300 mt-1.5 max-w-2xl mx-auto font-normal leading-relaxed">
            {displaySubtitle}
          </p>

          {/* Card Step Indicator */}
          <div className="flex items-center justify-center gap-1.5 mt-2.5">
            {featureList.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeCardIndex === i
                    ? "w-7 bg-[#108958]"
                    : "w-2 bg-neutral-300 dark:bg-neutral-700"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Card Canvas - Perfectly Centered with GPU Compositing */}
        <div
          ref={cardsWrapperRef}
          className="relative w-full max-w-5xl h-[330px] sm:h-[370px] lg:h-[390px] mx-auto"
        >
          {featureList.map((feature, index) => (
            <div
              key={feature.id || index}
              className={`gsap-stacked-card absolute inset-0 w-full h-full ${feature.bgColor} p-5 sm:p-6 lg:p-8 rounded-[24px] sm:rounded-[30px] shadow-[0_20px_50px_rgba(0,0,0,0.08)] flex flex-col justify-between`}
              style={{
                zIndex: index + 1,
                willChange: "transform, opacity",
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-8 items-center h-full">
                {/* Left Column: Specs & Copy */}
                <div className="md:col-span-7 flex flex-col justify-between h-full py-1">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-[11px] font-bold text-neutral-500 bg-black/5 dark:bg-white/10 px-2.5 py-0.5 rounded-full">
                        {feature.number}
                      </span>
                      {feature.badge && (
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#108958]/10 text-[#108958] dark:text-[#22C55E] text-[10px] font-mono font-bold tracking-wider uppercase">
                          {feature.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg sm:text-xl lg:text-[23px] font-black tracking-tight text-neutral-900 dark:text-white leading-tight mb-2">
                      {feature.title}
                    </h3>

                    <p
                      className={`${feature.textColor} text-xs sm:text-[13px] leading-relaxed font-normal line-clamp-3`}
                    >
                      {feature.description}
                    </p>
                  </div>

                  {feature.link && (
                    <div className="pt-2 mt-auto">
                      <Link
                        href={feature.link}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#108958] hover:bg-[#0c6c45] text-white text-xs sm:text-[13px] font-semibold tracking-wide transition-all shadow-sm hover:shadow-md group/cta w-fit"
                      >
                        <span>
                          {isBn
                            ? "ক্যাটালগ ও স্পেক্স দেখুন"
                            : "View Specifications & Stock"}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/cta:translate-x-0.5" />
                      </Link>
                    </div>
                  )}
                </div>

                {/* Right Column: High-Res Visual */}
                <div className="md:col-span-5 relative w-full h-[150px] sm:h-[180px] md:h-full max-h-[280px] rounded-2xl overflow-hidden shadow-md border border-black/10 dark:border-white/10 bg-neutral-200">
                  <Image
                    src={feature.imageUrl}
                    alt={feature.title}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/photos/cat-solar-panels.webp";
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
