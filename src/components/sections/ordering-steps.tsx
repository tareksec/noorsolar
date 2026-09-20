"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { FileText, SlidersHorizontal, CheckSquare, Truck } from "lucide-react";
import { prefersReducedMotion, motionTokens } from "@/lib/motion";
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
}

const DEFAULT_STEPS: StepItem[] = [
  {
    num: "01",
    title: "Request a quote",
    desc: "Tell us the products and quantity you need. Send the form, call us or message us on WhatsApp.",
    image: "/photos/process-1-request.webp",
    alt: "Engineer reviewing technical solar procurement specifications",
    icon: FileText,
  },
  {
    num: "02",
    title: "Confirm specifications",
    desc: "Our team checks the datasheets and matches the right models and quantities to your project.",
    image: "/photos/process-2-specs.webp",
    alt: "Commercial engineers reviewing technical solar specifications",
    icon: SlidersHorizontal,
  },
  {
    num: "03",
    title: "Receive your quotation",
    desc: "Get a formal quotation with pricing and terms for your order.",
    image: "/photos/process-3-quotation.webp",
    alt: "Commercial documentation and equipment pallet staging",
    icon: CheckSquare,
  },
  {
    num: "04",
    title: "Confirm and arrange delivery",
    desc: "Confirm the order and we coordinate delivery. Contact sales for current schedules.",
    image: "/photos/process-4-delivery.webp",
    alt: "Depot delivery and solar equipment dispatch in Bangladesh",
    icon: Truck,
  },
];

export function OrderingSteps({
  headline = "Order in four simple steps",
  subheadline = "A straightforward procurement workflow engineered for commercial contractors, installers, and B2B buyers across Bangladesh.",
  steps,
}: OrderingStepsProps) {
  const containerRef = useRef<HTMLElement>(null);

  // Merge custom titles/descriptions from site settings if provided
  const displaySteps: StepItem[] = DEFAULT_STEPS.map((step, idx) => {
    const custom = steps?.[idx];
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

      if (prefersReducedMotion() || (typeof window !== "undefined" && window.innerWidth < 768)) {
        // Immediate clean display for reduced-motion and mobile screens
        gsap.set(
          [
            ".process-title-reveal",
            ".process-step-item",
            ".process-circle",
            ".process-badge",
            ".process-arrow-svg",
          ],
          { opacity: 1, y: 0, scale: 1, clearProps: "all" }
        );
        return;
      }

      // 1. Header reveal (masked slide-up)
      gsap.fromTo(
        ".process-title-reveal",
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: motionTokens.duration.slow,
          ease: motionTokens.ease.gsapExpoOut,
          stagger: 0.12,
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        }
      );

      // 2. Circles scale in with stagger
      gsap.fromTo(
        ".process-circle",
        { scale: 0.85, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.55,
          stagger: motionTokens.stagger.cards,
          ease: "back.out(1.3)",
          scrollTrigger: {
            trigger: ".process-steps-container",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // 3. Numbered badges pop in after circles
      gsap.fromTo(
        ".process-badge",
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          delay: 0.18,
          stagger: motionTokens.stagger.cards,
          ease: "back.out(1.8)",
          scrollTrigger: {
            trigger: ".process-steps-container",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // 4. Step titles and text fade up
      gsap.fromTo(
        ".process-step-content",
        { y: 16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          delay: 0.25,
          stagger: motionTokens.stagger.cards,
          ease: motionTokens.ease.gsapPower2Out,
          scrollTrigger: {
            trigger: ".process-steps-container",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // 5. Curved arrows draw themselves left to right
      const arrowPaths = section.querySelectorAll<SVGPathElement>(".process-arrow-path");
      arrowPaths.forEach((path, idx) => {
        const length = path.getTotalLength ? path.getTotalLength() : 120;
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 0.6,
          delay: 0.35 + idx * 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".process-steps-container",
            start: "top 78%",
            toggleActions: "play none none none",
          },
        });
      });

      // Arrow heads fade in right when the path finishes drawing
      gsap.fromTo(
        ".process-arrow-head",
        { opacity: 0, scale: 0.6 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.25,
          delay: 0.7,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".process-steps-container",
            start: "top 78%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="process"
      className="py-20 lg:py-28 bg-[#EDEDED] border-y border-[#DDE1DC] relative overflow-hidden"
      data-motion="process-section"
    >
      <div className="page-shell">
        {/* Centered Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 lg:mb-20" data-motion="process-header">
          {/* Centered small label pill */}
          <div className="process-title-reveal inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#DDE1DC] shadow-xs mb-4">
            <span className="w-2 h-2 rounded-full bg-[#CEF23E] ring-2 ring-[#CEF23E]/40" />
            <span className="text-xs font-mono uppercase tracking-wider text-[#111311] font-semibold">
              Process
            </span>
          </div>

          {/* Large centered headline */}
          <h2 className="process-title-reveal text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-[#111311] leading-[1.12] mb-4">
            {headline}
          </h2>

          {/* One or two line sub-text */}
          <p className="process-title-reveal text-sm sm:text-base text-[#5C605C] leading-relaxed max-w-xl mx-auto">
            {subheadline}
          </p>
        </div>

        {/* Desktop 4-Column Layout (>= 1024px) & Mobile Stack (< 1024px) */}
        <div className="process-steps-container relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-6 items-start">
            {displaySteps.map((step, idx) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.num}
                  className="process-step-item group flex flex-col items-center text-center relative"
                  data-motion="process-step"
                >
                  {/* Circle Photo Container with Volt-Lime Border */}
                  <div className="relative mb-6">
                    {/* Number Badge Overlapping Top-Left */}
                    <div
                      className="process-badge absolute -top-1 -left-1 sm:-top-2 sm:-left-2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#111311] text-[#CEF23E] border-2 border-white flex items-center justify-center font-mono font-bold text-xs sm:text-[13px] shadow-sm select-none"
                    >
                      {step.num}
                    </div>

                    {/* Circular Photo */}
                    <div
                      className="process-circle relative w-36 h-36 sm:w-40 sm:h-40 lg:w-44 lg:h-44 rounded-full overflow-hidden border-[3px] border-[#CEF23E] bg-[#E4E7E4] shadow-xs transition-all duration-300 md:group-hover:-translate-y-2 md:group-hover:shadow-[0_12px_28px_rgba(206,242,62,0.35)]"
                    >
                      <Image
                        src={step.image}
                        alt={step.alt}
                        fill
                        sizes="(max-width: 640px) 144px, (max-width: 1024px) 160px, 176px"
                        className="object-cover transition-transform duration-500 md:group-hover:scale-108"
                        priority={idx === 0}
                      />
                      {/* Soft Glass Fallback Icon container inside image in case image fails */}
                      <div className="absolute inset-0 flex items-center justify-center bg-[#111311]/5 opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity">
                        <Icon className="w-8 h-8 text-[#111311]" />
                      </div>
                    </div>
                  </div>

                  {/* Step Title & Gray Description */}
                  <div className="process-step-content max-w-[260px] mx-auto">
                    <h3 className="text-lg sm:text-[19px] font-bold text-[#111311] tracking-tight mb-2.5">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#5C605C] leading-relaxed">
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
                            stroke="#111311"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="process-arrow-path"
                          />
                          <path
                            d="M 98,12 L 109,18 L 100,24"
                            stroke="#111311"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="process-arrow-head"
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
                            stroke="#111311"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="process-arrow-path"
                          />
                          <path
                            d="M 99,13 L 109,18 L 98,25"
                            stroke="#111311"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="process-arrow-head"
                          />
                        </svg>
                      )}
                    </div>
                  )}

                  {/* Mobile Vertical Connector Arrow (< 1024px) */}
                  {idx < 3 && (
                    <div className="lg:hidden flex justify-center pt-8 pb-2 text-[#111311] pointer-events-none">
                      <svg
                        viewBox="0 0 32 44"
                        fill="none"
                        className="w-5 h-8 overflow-visible"
                      >
                        <path
                          d="M 16,4 C 22,16 10,24 16,36"
                          stroke="#111311"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="process-arrow-path"
                        />
                        <path
                          d="M 10,30 L 16,37 L 22,30"
                          stroke="#111311"
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
