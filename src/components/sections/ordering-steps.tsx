"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { FileText, SlidersHorizontal, CheckSquare, Truck } from "lucide-react";
import { prefersReducedMotion } from "@/lib/motion";
import { gsap, useGSAP } from "@/lib/gsap";

interface StepItem {
  num: string;
  title: string;
  desc: string;
  image: string;
  alt: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface OrderingStepsProps {
  headline?: string;
  subheadline?: string;
  steps?: Array<{
    title: string;
    desc: string;
  }>;
  locale?: string;
}

const DEFAULT_STEPS_EN: StepItem[] = [
  {
    num: "01",
    title: "Request a quote",
    desc: "Tell us the products and quantity you need. Send the form, call us or message us on WhatsApp.",
    image: "/photos/process-1-request.jpg",
    alt: "Client requesting solar quotation and RFQ consulting on tablet and laptop",
    icon: FileText,
  },
  {
    num: "02",
    title: "Confirm specifications",
    desc: "Our team checks the datasheets and matches the right models and quantities to your project.",
    image: "/photos/process-2-specs.jpg",
    alt: "Solar engineers verifying technical blueprints, sizing, and module datasheets",
    icon: SlidersHorizontal,
  },
  {
    num: "03",
    title: "Receive your quotation",
    desc: "Get a formal quotation with pricing and terms for your order.",
    image: "/photos/process-3-quotation.jpg",
    alt: "Official Noor solar quotation agreement, pricing schedule, and verified wholesale terms",
    icon: CheckSquare,
  },
  {
    num: "04",
    title: "Confirm and arrange delivery",
    desc: "Confirm the order and we coordinate delivery. Contact sales for current schedules.",
    image: "/photos/process-4-delivery.jpg",
    alt: "Commercial logistics warehouse freight truck and forklift loading pallets of solar panels",
    icon: Truck,
  },
];

const DEFAULT_STEPS_BN: StepItem[] = [
  {
    num: "01",
    title: "কোটেশনের অনুরোধ করুন",
    desc: "আপনার প্রয়োজনীয় ইকুইপমেন্ট ও পরিমাণের তালিকা দিন—ওয়েবসাইট ফর্ম, ফোন কল কিংবা সরাসরি হোয়াটসঅ্যাপের মাধ্যমে।",
    image: "/photos/process-1-request.jpg",
    alt: "সোলার কোটেশন ও ইকুইপমেন্ট কনসাল্টেশনের অনুরোধ",
    icon: FileText,
  },
  {
    num: "02",
    title: "স্পেসিফিকেশন যাচাই",
    desc: "আমাদের টেকনিক্যাল টিম ডেটাশিট পর্যালোচনা করে আপনার প্রজেক্টের চাহিদামতো সঠিক মডেল ও পরিমাণ নিশ্চিত করবে।",
    image: "/photos/process-2-specs.jpg",
    alt: "সোলার প্রজেক্টের টেকনিক্যাল স্পেসিফিকেশন ও ডেটাশিট যাচাই",
    icon: SlidersHorizontal,
  },
  {
    num: "03",
    title: "আনুষ্ঠানিক কোটেশন গ্রহণ",
    desc: "মূল্যতালিকা, পেমেন্টের শর্তাবলি ও ডেলিভারির সময় উল্লেখসহ লিখিত আনুষ্ঠানিক কোটেশন বুঝে নিন।",
    image: "/photos/process-3-quotation.jpg",
    alt: "বাণিজ্যিক সোলার কোটেশন ও পাইকারি মূল্য পর্যালোচনা",
    icon: CheckSquare,
  },
  {
    num: "04",
    title: "অর্ডার নিশ্চিতকরণ ও ডেলিভারি",
    desc: "অর্ডার চূড়ান্ত হলে আমরা নির্ধারিত সময়ে সরাসরি ডিপো বা সাইটে নিরাপদ ডেলিভারির সমন্বয় করব।",
    image: "/photos/process-4-delivery.jpg",
    alt: "লজিস্টিকস ওয়্যারহাউস থেকে সোলার প্যানেল ডেলিভারি ও কন্টেইনার সরবরাহ",
    icon: Truck,
  },
];

export function OrderingSteps({
  headline,
  subheadline,
  steps,
  locale,
}: OrderingStepsProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const isBn = locale === "bn" || (headline ? /[\u0980-\u09FF]/.test(headline) : false);
  const defaultList = isBn ? DEFAULT_STEPS_BN : DEFAULT_STEPS_EN;

  const defaultHeadline = isBn ? "সহজ ৪টি ধাপে অর্ডার প্রক্রিয়া" : "Order in four simple steps";
  const defaultSubheadline = isBn
    ? "বাংলাদেশের বাণিজ্যিক ঠিকাদার, ইনস্টলার এবং বিটুবি ক্রেতাদের জন্য ঝামেলাহীন ক্রয় প্রক্রিয়া।"
    : "A straightforward procurement workflow engineered for commercial contractors, installers, and B2B buyers across Bangladesh.";

  const finalHeadline = isBn
    ? (headline && /[\u0980-\u09FF]/.test(headline) ? headline : defaultHeadline)
    : (headline || defaultHeadline);

  const finalSubheadline = isBn
    ? (subheadline && /[\u0980-\u09FF]/.test(subheadline) ? subheadline : defaultSubheadline)
    : (subheadline || defaultSubheadline);

  // Merge custom titles/descriptions from site settings if matching locale
  const displaySteps: StepItem[] = defaultList.map((step, idx) => {
    const custom = !isBn ? steps?.[idx] : undefined;
    return {
      ...step,
      title: custom?.title || step.title,
      desc: custom?.desc || step.desc,
    };
  });

  useGSAP(
    () => {
      const section = containerRef.current;
      if (!section) return;

      if (prefersReducedMotion()) {
        gsap.set(
          [
            ".process-title-reveal",
            ".process-step-item",
            ".process-circle",
            ".process-badge",
            ".process-step-content",
            ".process-arrow-svg",
            ".process-arrow-path",
            ".process-arrow-head",
            ".process-progress-fill",
          ],
          { opacity: 1, y: 0, scale: 1, strokeDashoffset: 0, scaleX: 1, clearProps: "all" }
        );
        return;
      }

      // 1. Header reveal on scroll entry
      gsap.fromTo(
        ".process-title-reveal",
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // 2. Setup curved SVG arrows
      const arrowPaths = section.querySelectorAll<SVGPathElement>(".process-arrow-path");
      arrowPaths.forEach((path) => {
        const length = path.getTotalLength ? path.getTotalLength() : 140;
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
      });

      // 3. Desktop Sequenced 4-Step Scroll Scrub Animation
      const isDesktop = window.innerWidth >= 1024;

      if (isDesktop) {
        // Master scroll scrub timeline that activates the 4 steps sequentially
        const masterTl = gsap.timeline({
          scrollTrigger: {
            trigger: ".process-steps-container",
            start: "top 72%",
            end: "bottom 35%",
            scrub: 0.8,
            onUpdate: (self) => {
              const progress = self.progress;
              if (progress < 0.25) setActiveStepIdx(0);
              else if (progress < 0.5) setActiveStepIdx(1);
              else if (progress < 0.75) setActiveStepIdx(2);
              else setActiveStepIdx(3);
            },
          },
        });

        // Background progress bar fill scrub
        masterTl.fromTo(
          ".process-progress-fill",
          { scaleX: 0 },
          { scaleX: 1, ease: "none", duration: 1 },
          0
        );

        // Step 1 Activate (0% -> 25%)
        masterTl
          .fromTo(
            ".step-item-0 .process-circle",
            { scale: 0.88, opacity: 0.4 },
            { scale: 1.05, opacity: 1, duration: 0.2, ease: "power2.out" },
            0
          )
          .fromTo(
            ".step-item-0 .process-badge",
            { scale: 0.8, rotation: -45, backgroundColor: "#074031", color: "#FEBE16" },
            { scale: 1.15, rotation: 0, backgroundColor: "#FEBE16", color: "#052F25", duration: 0.2 },
            0
          )
          .fromTo(
            ".step-item-0 .process-radar",
            { opacity: 0, scale: 0.8 },
            { opacity: 0.8, scale: 1.25, duration: 0.2 },
            0.05
          );

        // Arrow 1 (Step 1 -> Step 2)
        if (arrowPaths[0]) {
          masterTl.to(
            arrowPaths[0],
            { strokeDashoffset: 0, ease: "none", duration: 0.2 },
            0.1
          );
          masterTl.fromTo(
            ".arrow-head-0",
            { opacity: 0, scale: 0.3 },
            { opacity: 1, scale: 1, duration: 0.08 },
            0.26
          );
        }

        // Step 2 Activate (25% -> 50%)
        masterTl
          .fromTo(
            ".step-item-1 .process-circle",
            { scale: 0.88, opacity: 0.4 },
            { scale: 1.05, opacity: 1, duration: 0.2, ease: "power2.out" },
            0.25
          )
          .fromTo(
            ".step-item-1 .process-badge",
            { scale: 0.8, rotation: -45, backgroundColor: "#074031", color: "#FEBE16" },
            { scale: 1.15, rotation: 0, backgroundColor: "#FEBE16", color: "#052F25", duration: 0.2 },
            0.25
          )
          .fromTo(
            ".step-item-1 .process-radar",
            { opacity: 0, scale: 0.8 },
            { opacity: 0.8, scale: 1.25, duration: 0.2 },
            0.3
          );

        // Arrow 2 (Step 2 -> Step 3)
        if (arrowPaths[1]) {
          masterTl.to(
            arrowPaths[1],
            { strokeDashoffset: 0, ease: "none", duration: 0.2 },
            0.35
          );
          masterTl.fromTo(
            ".arrow-head-1",
            { opacity: 0, scale: 0.3 },
            { opacity: 1, scale: 1, duration: 0.08 },
            0.51
          );
        }

        // Step 3 Activate (50% -> 75%)
        masterTl
          .fromTo(
            ".step-item-2 .process-circle",
            { scale: 0.88, opacity: 0.4 },
            { scale: 1.05, opacity: 1, duration: 0.2, ease: "power2.out" },
            0.5
          )
          .fromTo(
            ".step-item-2 .process-badge",
            { scale: 0.8, rotation: -45, backgroundColor: "#074031", color: "#FEBE16" },
            { scale: 1.15, rotation: 0, backgroundColor: "#FEBE16", color: "#052F25", duration: 0.2 },
            0.5
          )
          .fromTo(
            ".step-item-2 .process-radar",
            { opacity: 0, scale: 0.8 },
            { opacity: 0.8, scale: 1.25, duration: 0.2 },
            0.55
          );

        // Arrow 3 (Step 3 -> Step 4)
        if (arrowPaths[2]) {
          masterTl.to(
            arrowPaths[2],
            { strokeDashoffset: 0, ease: "none", duration: 0.2 },
            0.6
          );
          masterTl.fromTo(
            ".arrow-head-2",
            { opacity: 0, scale: 0.3 },
            { opacity: 1, scale: 1, duration: 0.08 },
            0.76
          );
        }

        // Step 4 Activate (75% -> 100%)
        masterTl
          .fromTo(
            ".step-item-3 .process-circle",
            { scale: 0.88, opacity: 0.4 },
            { scale: 1.08, opacity: 1, duration: 0.2, ease: "power2.out" },
            0.75
          )
          .fromTo(
            ".step-item-3 .process-badge",
            { scale: 0.8, rotation: -45, backgroundColor: "#074031", color: "#FEBE16" },
            { scale: 1.2, rotation: 0, backgroundColor: "#FEBE16", color: "#052F25", duration: 0.2 },
            0.75
          )
          .fromTo(
            ".step-item-3 .process-radar",
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1.3, duration: 0.2 },
            0.8
          );

        // Gentle Parallax scrub on desktop
        const circles = section.querySelectorAll(".process-circle");
        circles.forEach((c, idx) => {
          gsap.to(c, {
            yPercent: idx % 2 === 0 ? -12 : 12,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          });
        });
      } else {
        // Mobile Vertical Stagger Animation (< 1024px)
        const stepItems = section.querySelectorAll(".process-step-item");
        stepItems.forEach((item, idx) => {
          const circle = item.querySelector(".process-circle");
          const badge = item.querySelector(".process-badge");
          const content = item.querySelector(".process-step-content");

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
              toggleActions: "play none none reverse",
              onEnter: () => setActiveStepIdx(idx),
            },
          });

          tl.fromTo(
            circle,
            { scale: 0.8, opacity: 0.3, y: 25 },
            { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.5)" }
          )
            .fromTo(
              badge,
              { scale: 0, rotation: -45, opacity: 0 },
              { scale: 1, rotation: 0, opacity: 1, duration: 0.4, ease: "back.out(2)" },
              "-=0.3"
            )
            .fromTo(
              content,
              { opacity: 0, y: 15 },
              { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
              "-=0.2"
            );
        });
      }
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="process"
      className="py-20 lg:py-28 bg-[#F1F4F1] border-y border-[#DCE4E0] relative overflow-hidden"
      data-motion="process-section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 lg:mb-20" data-motion="process-header">
          {/* Centered small label pill */}
          <div className="process-title-reveal inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#DCE4E0] shadow-xs mb-4">
            <span className="w-2 h-2 rounded-full bg-[#FEBE16] ring-2 ring-[#FEBE16]/40" />
            <span className="text-xs font-mono uppercase tracking-wider text-[#17251F] font-semibold">
              {isBn ? "সহজ চার ধাপের প্রক্রিয়া" : "Step-by-Step Process"}
            </span>
          </div>

          {/* Large centered headline */}
          <h2 className="process-title-reveal text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-[#074031] leading-[1.12] mb-4">
            {finalHeadline}
          </h2>

          {/* One or two line sub-text */}
          <p className="process-title-reveal text-sm sm:text-base text-[#62706A] leading-relaxed max-w-xl mx-auto mb-6">
            {finalSubheadline}
          </p>

          {/* Real-time active step status pill on scroll */}
          <div className="process-title-reveal inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#074031] text-white text-xs font-mono shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#FEBE16] animate-pulse" />
            <span className="font-bold text-[#FEBE16]">
              {isBn ? `ধাপ ${displaySteps[activeStepIdx]?.num}:` : `STEP ${displaySteps[activeStepIdx]?.num}:`}
            </span>
            <span>{displaySteps[activeStepIdx]?.title}</span>
          </div>
        </div>

        {/* Desktop 4-Column Layout (>= 1024px) & Mobile Stack (< 1024px) */}
        <div className="process-steps-container relative">
          
          {/* Subtle Ambient Connecting Beam on Desktop */}
          <div className="hidden lg:block absolute top-[88px] left-[10%] right-[10%] h-[3px] bg-[#DCE4E0] -z-0 pointer-events-none overflow-hidden rounded-full">
            <div className="process-progress-fill w-full h-full bg-gradient-to-r from-[#FEBE16] to-[#E4A900] shadow-[0_0_10px_rgba(254,190,22,0.5)] origin-left scale-x-0" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-6 items-start relative z-10">
            {displaySteps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = activeStepIdx === idx;

              return (
                <div
                  key={step.num}
                  onClick={() => setActiveStepIdx(idx)}
                  className={`process-step-item step-item-${idx} group flex flex-col items-center text-center relative cursor-pointer transition-all duration-300`}
                  data-motion="process-step"
                >
                  {/* Circle Photo Container with Solar Gold Border */}
                  <div className="relative mb-6">
                    {/* Glowing Radar Halo Ring on Active Step */}
                    <div
                      className={`process-radar absolute -inset-2.5 rounded-full bg-[#FEBE16]/25 blur-sm pointer-events-none transition-opacity duration-500 ${
                        isActive ? "opacity-100 animate-pulse" : "opacity-0"
                      }`}
                    />

                    {/* Number Badge Overlapping Top-Left */}
                    <div
                      className={`process-badge absolute -top-1 -left-1 sm:-top-2 sm:-left-2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white flex items-center justify-center font-mono font-bold text-xs sm:text-[13px] shadow-sm select-none transition-all duration-300 ${
                        isActive
                          ? "bg-[#FEBE16] text-[#052F25] scale-110 shadow-[0_0_12px_rgba(254,190,22,0.8)]"
                          : "bg-[#074031] text-[#FEBE16]"
                      }`}
                    >
                      {step.num}
                    </div>

                    {/* Circular Photo */}
                    <div
                      className={`process-circle relative w-36 h-36 sm:w-40 sm:h-40 lg:w-44 lg:h-44 rounded-full overflow-hidden border-[3px] bg-[#F1F4F1] shadow-xs transition-all duration-500 md:group-hover:-translate-y-2 will-change-transform ${
                        isActive
                          ? "border-[#FEBE16] shadow-[0_12px_32px_rgba(254,190,22,0.35)] ring-4 ring-[#FEBE16]/30"
                          : "border-[#DCE4E0] opacity-85 hover:opacity-100 hover:border-[#FEBE16]"
                      }`}
                    >
                      <Image
                        src={step.image}
                        alt={step.alt}
                        fill
                        sizes="(max-width: 640px) 144px, (max-width: 1024px) 160px, 176px"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        priority={idx === 0}
                      />
                      {/* Soft Glass Fallback Icon container inside image */}
                      <div className="absolute inset-0 flex items-center justify-center bg-[#074031]/5 opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity">
                        <Icon className="w-8 h-8 text-[#074031]" />
                      </div>
                    </div>
                  </div>

                  {/* Step Title & Gray Description */}
                  <div className="process-step-content max-w-[260px] mx-auto">
                    <h3
                      className={`text-lg sm:text-[19px] font-bold tracking-tight mb-2.5 transition-colors ${
                        isActive ? "text-[#074031] scale-102" : "text-[#17251F] group-hover:text-[#074031]"
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#62706A] leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  {/* Desktop Hand-drawn style curved arrows between columns (Columns 1->2, 2->3, 3->4) */}
                  {idx < 3 && (
                    <div
                      className="hidden lg:block absolute top-16 left-[calc(50%+82px)] w-[calc(100%-110px)] h-10 pointer-events-none z-10"
                      data-motion="process-arrow"
                    >
                      {idx % 2 === 0 ? (
                        /* Slight Upward Curve Arrow */
                        <svg
                          viewBox="0 0 120 38"
                          fill="none"
                          className="w-full h-full process-arrow-svg overflow-visible"
                        >
                          <path
                            d="M 6,24 C 36,4 78,6 108,18"
                            stroke="#074031"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="process-arrow-path"
                          />
                          <path
                            d="M 98,12 L 109,18 L 100,24"
                            stroke="#074031"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`process-arrow-head arrow-head-${idx}`}
                          />
                        </svg>
                      ) : (
                        /* Slight Downward Curve Arrow */
                        <svg
                          viewBox="0 0 120 38"
                          fill="none"
                          className="w-full h-full process-arrow-svg overflow-visible"
                        >
                          <path
                            d="M 6,12 C 38,32 78,30 108,18"
                            stroke="#074031"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="process-arrow-path"
                          />
                          <path
                            d="M 99,13 L 109,18 L 98,25"
                            stroke="#074031"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`process-arrow-head arrow-head-${idx}`}
                          />
                        </svg>
                      )}
                    </div>
                  )}

                  {/* Mobile Vertical Connector Arrow (< 1024px) */}
                  {idx < 3 && (
                    <div className="lg:hidden flex justify-center pt-8 pb-2 text-[#074031] pointer-events-none">
                      <svg
                        viewBox="0 0 32 44"
                        fill="none"
                        className="w-5 h-8 overflow-visible"
                      >
                        <path
                          d="M 16,4 C 22,16 10,24 16,36"
                          stroke="#074031"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="process-arrow-path"
                        />
                        <path
                          d="M 10,30 L 16,37 L 22,30"
                          stroke="#074031"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="process-arrow-head"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
