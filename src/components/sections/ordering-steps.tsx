"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { FileText, SlidersHorizontal, CheckSquare, Truck, Check } from "lucide-react";
import { prefersReducedMotion } from "@/lib/motion";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

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

/**
 * Leading scroll fraction of the pinned journey during which no step is lit yet,
 * so the very first scroll advance is what lights up step 01.
 */
const PIN_DEAD_ZONE = 0.12;

export function OrderingSteps({
  headline,
  subheadline,
  steps,
  locale,
}: OrderingStepsProps) {
  const isBn = locale === "bn";
  const defaultList = isBn ? DEFAULT_STEPS_BN : DEFAULT_STEPS_EN;
  const finalHeadline = headline || (isBn ? "আমরা যেভাবে কাজ করি" : "How We Process Orders");
  const finalSubheadline =
    subheadline ||
    (isBn
      ? "মাত্র ৪টি স্বচ্ছ ও সহজ ধাপে আপনার কাঙ্ক্ষিত পণ্য বুঝে নিন নির্ভরযোগ্য সহযোগিতায়।"
      : "From your initial request to rapid on-site delivery — guaranteed quality, transparent quotes, and seamless fulfillment.");

  const displaySteps = defaultList.map((defaultStep, idx) => ({
    ...defaultStep,
    title: steps?.[idx]?.title || defaultStep.title,
    desc: steps?.[idx]?.desc || defaultStep.desc,
  }));

  const containerRef = useRef<HTMLElement>(null);
  // -1 = pinned but no step activated yet; the first scroll advance lights step 01
  const [activeStepIdx, setActiveStepIdx] = useState(-1);
  const scrubStepRef = useRef(-1);

  // Smooth, slow step animation function (draws connecting arrows, expands progress beam, lights up circle)
  const animateStep = (targetIdx: number) => {
    const section = containerRef.current;
    if (!section) return;

    // 1. Slow curved SVG arrows draw / reverse
    const arrowPaths = section.querySelectorAll<SVGPathElement>(".process-arrow-path");
    arrowPaths.forEach((path, i) => {
      const length = path.getTotalLength ? path.getTotalLength() : 140;
      const head = section.querySelector(`.arrow-head-${i}`);

      if (i < targetIdx) {
        // Draw arrow slowly with solar gold stroke
        gsap.to(path, {
          strokeDashoffset: 0,
          stroke: "#FEBE16",
          strokeWidth: 3,
          duration: 0.85,
          ease: "power2.inOut",
        });
        if (head) {
          gsap.to(head, {
            opacity: 1,
            scale: 1,
            stroke: "#FEBE16",
            duration: 0.4,
            delay: 0.45,
            ease: "back.out(2)",
          });
        }
      } else {
        // Reverse arrow
        gsap.to(path, {
          strokeDashoffset: length,
          stroke: "#074031",
          strokeWidth: 2.4,
          duration: 0.6,
          ease: "power2.in",
        });
        if (head) {
          gsap.to(head, {
            opacity: 0,
            scale: 0.3,
            stroke: "#074031",
            duration: 0.25,
          });
        }
      }
    });

    // 2. Highlight step circles and badges
    displaySteps.forEach((_, i) => {
      const circle = section.querySelector(`.step-item-${i} .process-circle`);
      const badge = section.querySelector(`.step-item-${i} .process-badge`);
      const radar = section.querySelector(`.step-item-${i} .process-radar`);

      if (i === targetIdx) {
        // Active item
        if (circle) {
          gsap.to(circle, {
            scale: 1.08,
            borderColor: "#FEBE16",
            duration: 0.65,
            ease: "back.out(1.5)",
          });
        }
        if (badge) {
          gsap.to(badge, {
            scale: 1.2,
            rotation: 0,
            backgroundColor: "#FEBE16",
            color: "#052F25",
            duration: 0.55,
            ease: "back.out(2)",
          });
        }
        if (radar) {
          gsap.to(radar, { opacity: 0.9, scale: 1.25, duration: 0.5 });
        }
      } else if (i < targetIdx) {
        // Completed items
        if (circle) {
          gsap.to(circle, {
            scale: 1,
            borderColor: "#108958",
            duration: 0.45,
          });
        }
        if (badge) {
          gsap.to(badge, {
            scale: 1,
            rotation: 0,
            backgroundColor: "#108958",
            color: "#ffffff",
            duration: 0.45,
          });
        }
        if (radar) {
          gsap.to(radar, { opacity: 0, scale: 0.8, duration: 0.3 });
        }
      } else {
        // Upcoming items
        if (circle) {
          gsap.to(circle, {
            scale: 0.95,
            borderColor: "#DCE4E0",
            duration: 0.45,
          });
        }
        if (badge) {
          gsap.to(badge, {
            scale: 1,
            rotation: 0,
            backgroundColor: "#074031",
            color: "#FEBE16",
            duration: 0.45,
          });
        }
        if (radar) {
          gsap.to(radar, { opacity: 0, scale: 0.8, duration: 0.3 });
        }
      }
    });
  };

  const handleStepClick = (idx: number) => {
    scrubStepRef.current = idx;
    setActiveStepIdx(idx);
    animateStep(idx);
  };

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
          ],
          { opacity: 1, y: 0, scale: 1, strokeDashoffset: 0, scaleX: 1, clearProps: "all" }
        );
        // Show the completed journey statically when motion is disabled
        setActiveStepIdx(displaySteps.length - 1);
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

      const mm = gsap.matchMedia();

      // 3. Desktop (>= 1024px): pinned scrub journey.
      //    The CSS-sticky viewport freezes while scroll progress lights up one
      //    step per advance; scrolling past the last step releases into the
      //    next section. Works with Lenis because ScrollTrigger stays synced.
      mm.add("(min-width: 1024px)", () => {
        // Start with every step dimmed; the first scroll advance lights step 01
        displaySteps.forEach((_, i) => {
          gsap.set(section.querySelector(`.step-item-${i} .process-circle`), {
            scale: 0.95,
            borderColor: "#DCE4E0",
          });
          gsap.set(section.querySelector(`.step-item-${i} .process-badge`), {
            scale: 1,
            rotation: 0,
            backgroundColor: "#074031",
            color: "#FEBE16",
          });
          gsap.set(section.querySelector(`.step-item-${i} .process-radar`), {
            opacity: 0,
            scale: 0.8,
          });
        });
        const scrubTrigger = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            const p = self.progress;
            const idx =
              p < PIN_DEAD_ZONE
                ? -1
                : Math.min(
                    displaySteps.length - 1,
                    Math.floor(
                      ((p - PIN_DEAD_ZONE) / (1 - PIN_DEAD_ZONE)) * displaySteps.length
                    )
                  );
            if (scrubStepRef.current !== idx) {
              scrubStepRef.current = idx;
              setActiveStepIdx(idx);
              animateStep(idx);
            }
          },
        });

        return () => {
          scrubTrigger.kill();
          scrubStepRef.current = -1;
        };
      });

      // 4. Mobile Vertical Stagger Animation (< 1024px, natural page flow)
      mm.add("(max-width: 1023px)", () => {
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
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="process"
      className="py-16 lg:py-0 motion-safe:lg:h-[320vh] bg-[#F1F4F1] border-y border-[#DCE4E0] relative"
      data-motion="process-section"
    >
      {/* Pinned viewport on desktop: screen freezes here while steps advance */}
      <div className="overflow-hidden motion-safe:lg:sticky motion-safe:lg:top-0 motion-safe:lg:h-screen motion-safe:lg:min-h-[700px] motion-safe:lg:flex motion-safe:lg:flex-col motion-safe:lg:justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Centered Header */}
        <div className="max-w-3xl mx-auto text-center mb-10 lg:mb-12" data-motion="process-header">
          {/* Centered small label pill */}
          <div className="process-title-reveal inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#DCE4E0] shadow-xs mb-3">
            <span className="w-2 h-2 rounded-full bg-[#FEBE16] ring-2 ring-[#FEBE16]/40" />
            <span className="text-xs font-mono uppercase tracking-wider text-[#17251F] font-semibold">
              {isBn ? "সহজ চার ধাপের প্রক্রিয়া" : "Step-by-Step Process"}
            </span>
          </div>

          {/* Large centered headline */}
          <h2 className="process-title-reveal text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-[#074031] leading-[1.12] mb-3">
            {finalHeadline}
          </h2>

          {/* One or two line sub-text */}
          <p className="process-title-reveal text-sm sm:text-base text-[#62706A] leading-relaxed max-w-xl mx-auto mb-5">
            {finalSubheadline}
          </p>

          {/* Real-time active step status pill on scroll */}
          <div className="process-title-reveal inline-flex items-center justify-center min-w-[280px] sm:min-w-[340px] text-center gap-2.5 px-5 py-2 rounded-full bg-[#074031] text-white text-xs font-mono shadow-sm transition-all duration-300">
            <span className="w-2 h-2 rounded-full bg-[#FEBE16] animate-pulse" />
            <span className="font-bold text-[#FEBE16]">
              {activeStepIdx < 0
                ? isBn
                  ? "স্ক্রল করুন"
                  : "Scroll to begin"
                : isBn
                  ? `ধাপ ${displaySteps[activeStepIdx]?.num}:`
                  : `STEP ${displaySteps[activeStepIdx]?.num}:`}
            </span>
            <span>
              {activeStepIdx < 0
                ? isBn
                  ? "৪টি সহজ ধাপ"
                  : "4 simple steps"
                : displaySteps[activeStepIdx]?.title}
            </span>
          </div>
        </div>

        {/* Desktop 4-Column Layout (>= 1024px) & Mobile Stack (< 1024px) */}
        <div className="process-steps-container relative">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-6 items-start relative z-10">
            {displaySteps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = activeStepIdx === idx;
              const isPassed = idx < activeStepIdx;

              return (
                <div
                  key={step.num}
                  onClick={() => handleStepClick(idx)}
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
                          : isPassed
                          ? "bg-[#108958] text-white"
                          : "bg-[#074031] text-[#FEBE16]"
                      }`}
                    >
                      {isPassed ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : (
                        step.num
                      )}
                    </div>

                    {/* Circular Photo */}
                    <div
                      className={`process-circle relative w-36 h-36 sm:w-40 sm:h-40 lg:w-44 lg:h-44 rounded-full overflow-hidden border-[3px] bg-[#F1F4F1] shadow-xs transition-all duration-500 md:group-hover:-translate-y-2 will-change-transform ${
                        isActive
                          ? "border-[#FEBE16] shadow-[0_12px_32px_rgba(254,190,22,0.35)] ring-4 ring-[#FEBE16]/30"
                          : isPassed
                          ? "border-[#108958] opacity-95"
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
                        isActive
                          ? "text-[#074031] scale-102"
                          : isPassed
                          ? "text-[#108958]"
                          : "text-[#17251F] group-hover:text-[#074031]"
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

        {/* Desktop Step Navigation Dots & Scroll Indicator */}
        <div className="hidden lg:flex items-center justify-center gap-3 mt-10 text-xs font-mono text-[#62706A]">
          <span className="text-[#074031] font-semibold">
            {isBn ? "মাউস স্ক্রল করুন" : "Scroll to advance"}
          </span>
          <div className="flex items-center gap-2">
            {displaySteps.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleStepClick(idx)}
                className="p-2 min-w-[32px] min-h-[32px] flex items-center justify-center cursor-pointer group/dot focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#074031] rounded-full"
                aria-label={`Go to step ${idx + 1}`}
              >
                <span
                  className={`h-2 rounded-full transition-all duration-500 block ${
                    activeStepIdx === idx
                      ? "w-8 bg-[#FEBE16]"
                      : idx < activeStepIdx
                      ? "w-3 bg-[#108958]"
                      : "w-2 bg-[#DCE4E0] group-hover/dot:bg-[#074031]/50"
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="text-[#108958] font-bold">
            {Math.max(1, activeStepIdx + 1)} / {displaySteps.length}
          </span>
        </div>
      </div>
      </div>
    </section>
  );
}
