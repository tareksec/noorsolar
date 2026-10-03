"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import type { Testimonial } from "@prisma/client";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { prefersReducedMotion } from "@/lib/motion";
import { Reveal } from "@/components/ui/reveal";
import { Link } from "@/i18n/routing";

export function TestimonialsSection({
  testimonials,
  locale,
}: {
  testimonials?: Testimonial[];
  locale?: string;
}) {
  const isBn = locale === "bn";
  const displayItems = (testimonials || []).filter(
    (t) => t && typeof t.authorName === "string" && t.authorName.trim().length > 0 && typeof t.quote === "string" && t.quote.trim().length > 0
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Autoplay loop that pauses on hover or focus
  useEffect(() => {
    if (typeof window === "undefined" || prefersReducedMotion() || isPaused || displayItems.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayItems.length);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [displayItems.length, isPaused]);

  if (!displayItems || displayItems.length === 0) {
    return null;
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + displayItems.length) % displayItems.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % displayItems.length);
  };

  const currentItem = displayItems[currentIndex] || displayItems[0];
  const roleText = [currentItem?.authorRole, currentItem?.company].filter(Boolean).join(" · ");

  return (
    <section
      id="testimonials"
      className="py-20 lg:py-28 bg-[#F1F4F1] border-y border-[#DCE4E0]"
      aria-label={isBn ? "গ্রাহক মতামত" : "Client feedback"}
      data-motion="testimonials-slider"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Heading and Controls */}
          <Reveal y={24} duration={0.6} className="lg:col-span-5">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FEBE16]" />
                <span className="text-xs font-mono uppercase tracking-wider text-[#62706A]">
                  {isBn ? "গ্রাহক মতামত" : "Client Feedback"}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#074031] leading-[1.12] mb-6">
                {isBn
                  ? "শীর্ষস্থানীয় EPC ও শিল্পপ্রতিষ্ঠানসমূহের অভিজ্ঞতা"
                  : "Trusted by Leading EPCs & Commercial Facilities"}
              </h2>
              <p className="text-[#62706A] text-sm sm:text-base leading-relaxed mb-8">
                {isBn
                  ? "বাণিজ্যিক ক্রেতা ও প্রকল্প পরিচালকদের বাস্তব অভিজ্ঞতা ও মূল্যায়ন।"
                  : "Direct feedback from commercial procurement and project engineering partners across Bangladesh."}
              </p>

              {/* Navigation Arrows & Dot Indicators */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevSlide}
                    aria-label={isBn ? "পূর্ববর্তী মন্তব্য" : "Previous testimonial"}
                    className="w-11 h-11 rounded-full bg-white border border-[#DCE4E0] hover:border-[#074031] text-[#074031] flex items-center justify-center transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FEBE16]"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextSlide}
                    aria-label={isBn ? "পরবর্তী মন্তব্য" : "Next testimonial"}
                    className="w-11 h-11 rounded-full bg-white border border-[#DCE4E0] hover:border-[#074031] text-[#074031] flex items-center justify-center transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FEBE16]"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Dots */}
                <div className="flex items-center gap-1 ml-3">
                  {displayItems.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      aria-label={isBn ? `মন্তব্য ${idx + 1} দেখুন` : `Go to testimonial ${idx + 1}`}
                      className="p-2 flex items-center justify-center min-w-[44px] min-h-[44px] cursor-pointer rounded-full focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#FEBE16]"
                    >
                      <span
                        className={`h-2.5 rounded-full transition-all duration-300 block ${
                          currentIndex === idx
                            ? "w-8 bg-[#074031]"
                            : "w-2.5 bg-[#DCE4E0] hover:bg-[#62706A]"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* View All Reviews Button */}
              <div className="mt-8">
                <Link
                  href="/reviews"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-[#074031] text-[#074031] hover:text-white border border-[#DCE4E0] hover:border-[#074031] text-xs font-mono font-bold transition-all shadow-xs group cursor-pointer"
                >
                  <span>{isBn ? "সকল গ্রাহক মতামত দেখুন" : "View All Client Reviews"}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Right Column: Crossfade Testimonial Slider Card */}
          <Reveal y={24} delay={0.15} duration={0.65} className="lg:col-span-7">
            <div
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onFocus={() => setIsPaused(true)}
              onBlur={() => setIsPaused(false)}
              tabIndex={0}
              role="region"
              aria-roledescription="carousel"
              aria-label={isBn ? "গ্রাহক মতামত স্লাইডার" : "Testimonial slider"}
            >
              <Link
                href="/reviews"
                className="relative min-h-[320px] sm:min-h-[280px] bg-white rounded-[32px] p-8 sm:p-10 border border-[#DCE4E0] hover:border-[#074031] shadow-[0_16px_40px_-12px_rgba(7,64,49,0.06)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden block group cursor-pointer"
              >
                {/* Quote Mark Watermark */}
                <Quote className="absolute top-6 right-6 w-20 h-20 text-[#FEBE16]/20 pointer-events-none -rotate-12" />

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
                    <p className="text-lg sm:text-xl font-medium text-[#17251F] leading-relaxed mb-8">
                      {currentItem.quote}
                    </p>

                    {/* Author Profile */}
                    <div className="flex items-center justify-between gap-4 pt-6 border-t border-[#DCE4E0]">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#F1F4F1] border border-[#DCE4E0] shrink-0 flex items-center justify-center">
                          {currentItem.photo ? (
                            <Image
                              src={currentItem.photo}
                              alt={currentItem.authorName}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : (
                            <span className="font-bold font-mono text-sm text-[#074031]">
                              {currentItem.authorName.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-base text-[#074031]">
                            {currentItem.authorName}
                          </h3>
                          {roleText && (
                            <p className="text-xs font-mono text-[#62706A] mt-0.5">
                              {roleText}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-[#074031] font-bold text-xs font-mono shrink-0 group-hover:translate-x-1 transition-transform">
                        <span className="hidden sm:inline text-[#62706A] font-normal text-[11px]">
                          {isBn ? "রিভিউ পেজ" : "Read all"}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
