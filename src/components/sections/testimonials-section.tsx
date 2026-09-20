"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import type { Testimonial } from "@prisma/client";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { prefersReducedMotion } from "@/lib/motion";

const DEMO_TESTIMONIALS: Array<{
  id: string;
  authorName: string;
  authorRole: string | null;
  company: string | null;
  photo: string | null;
  quote: string;
}> = [
  {
    id: "demo-1",
    authorName: "Arif Hossain",
    authorRole: "Business Owner",
    company: "EcoPower BD",
    photo: "/photos/testimonial-arif.jpg",
    quote:
      "Noor Solar helped us seamlessly transition to industrial-grade solar and storage. Our operating costs dropped significantly, and our rooftop plant has performed flawlessly through two monsoon seasons.",
  },
  {
    id: "demo-2",
    authorName: "Mahmud Karim",
    authorRole: "Property Developer",
    company: "Apex Developments",
    photo: "/photos/testimonial-mahmud.jpg",
    quote:
      "The 51.2V LiFePO4 rack batteries and hybrid string inverters installed across our commercial properties cut grid reliance by 65%. Deliveries were on schedule with all manufacturer datasheets.",
  },
  {
    id: "demo-3",
    authorName: "Farhana Ahmed",
    authorRole: "Industrial Plant Director",
    company: "Delta Manufacturing",
    photo: "/photos/testimonial-farhana.jpg",
    quote:
      "From initial engineering assessment through container dispatch, the experience was flawless. Our production plant achieved ROI faster than projected with their high-yield TOPCon modules.",
  },
];

export function TestimonialsSection({ testimonials }: { testimonials?: Testimonial[] }) {
  const displayItems = testimonials && testimonials.length > 0 ? testimonials : DEMO_TESTIMONIALS;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Autoplay loop that pauses on hover or focus
  useEffect(() => {
    if (typeof window === "undefined" || prefersReducedMotion() || isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayItems.length);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [displayItems.length, isPaused]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + displayItems.length) % displayItems.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % displayItems.length);
  };

  const currentItem = displayItems[currentIndex] || displayItems[0];
  const photoSrc =
    currentItem.photo ||
    (currentIndex === 0
      ? "/photos/testimonial-arif.jpg"
      : currentIndex === 1
      ? "/photos/testimonial-mahmud.jpg"
      : "/photos/testimonial-farhana.jpg");

  const roleText = [currentItem.authorRole, currentItem.company].filter(Boolean).join(" · ");

  return (
    <section
      className="py-20 lg:py-28 bg-[#EDEDED] border-y border-[#DDE1DC]"
      aria-label="Client testimonials"
      data-motion="testimonials-slider"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Heading and Controls */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#CEF23E]" />
              <span className="text-xs font-mono uppercase tracking-wider text-[#5C605C]">
                Verified Testimonials
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#111311] leading-[1.12] mb-6">
              Trusted by Leading EPCs & Commercial Plants
            </h2>
            <p className="text-[#5C605C] text-sm sm:text-base leading-relaxed mb-8">
              Over 250 completed commercial installations and wholesale container dispatches across Bangladesh.
            </p>

            {/* Navigation Arrows & Dot Indicators */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={prevSlide}
                  aria-label="Previous testimonial"
                  className="w-11 h-11 rounded-full bg-white border border-[#DDE1DC] hover:border-[#111311] text-[#111311] flex items-center justify-center transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#CEF23E]"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextSlide}
                  aria-label="Next testimonial"
                  className="w-11 h-11 rounded-full bg-white border border-[#DDE1DC] hover:border-[#111311] text-[#111311] flex items-center justify-center transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#CEF23E]"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Dots */}
              <div className="flex items-center gap-2 ml-4">
                {displayItems.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Go to testimonial ${idx + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      currentIndex === idx
                        ? "w-8 bg-[#111311]"
                        : "w-2.5 bg-[#DDE1DC] hover:bg-[#5C605C]"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Crossfade Testimonial Slider */}
          <div
            className="lg:col-span-7"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
            tabIndex={0}
            role="region"
            aria-roledescription="carousel"
            aria-label="Testimonial slider"
          >
            <div className="relative min-h-[320px] sm:min-h-[280px] bg-white rounded-[32px] p-8 sm:p-10 border border-[#DDE1DC] shadow-[0_16px_40px_-12px_rgba(0,0,0,0.06)] flex flex-col justify-between overflow-hidden">
              {/* Quote Mark Watermark */}
              <Quote className="absolute top-6 right-6 w-20 h-20 text-[#CEF23E]/20 pointer-events-none -rotate-12" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentItem.id || currentIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col justify-between h-full relative z-10 will-change-transform"
                >
                  {/* Quote Body */}
                  <p className="text-lg sm:text-xl font-medium text-[#111311] leading-relaxed mb-8">
                    {currentItem.quote}
                  </p>

                  {/* Author Profile */}
                  <div className="flex items-center gap-4 pt-6 border-t border-[#EDEDED]">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#EDEDED] border border-[#DDE1DC] shrink-0">
                      <Image
                        src={photoSrc}
                        alt={currentItem.authorName}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-[#111311]">
                        {currentItem.authorName}
                      </h3>
                      {roleText && (
                        <p className="text-xs font-mono text-[#5C605C] mt-0.5">
                          {roleText}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
