"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import type { Testimonial } from "@prisma/client";
import { Quote, ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  // Autoplay with pause on hover/focus
  useEffect(() => {
    if (testimonials.length <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testimonials.length, isPaused, nextSlide]);

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const current = testimonials[currentIndex];

  return (
    <section
      className="py-20 bg-[#E4E7E4]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="Customer testimonials"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-[11px] font-mono text-[#111311] mb-3 border border-[#DDE1DC]">
            <span className="w-2 h-2 rounded-full bg-[#CEF23E]"></span>
            <span>Commercial Feedback</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111311]">
            Procurement & Project Verification
          </h2>
        </div>

        {/* Testimonial Card with Crossfade Animation */}
        <div className="relative min-h-[280px] sm:min-h-[240px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id || currentIndex}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: "easeOut" }}
              className="w-full rounded-[36px] bg-white border border-[#DDE1DC] p-8 sm:p-12 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-full bg-[#EDEDED] flex items-center justify-center text-[#111311] mb-6 shadow-xs">
                  <Quote className="w-4 h-4 fill-current" />
                </div>
                <blockquote className="text-base sm:text-xl text-[#111311] font-medium leading-relaxed mb-8">
                  &ldquo;{current.quote}&rdquo;
                </blockquote>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-[#EDEDED]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#111311] text-[#CEF23E] border border-[#CEF23E]/30 flex items-center justify-center text-sm font-bold font-mono shrink-0 shadow-xs">
                    {current.authorName
                      ? current.authorName
                          .split(" ")
                          .filter(Boolean)
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()
                      : "NS"}
                  </div>
                  <div>
                    <div className="font-bold text-base text-[#111311]">
                      {current.authorName}
                    </div>
                    {(current.authorRole || current.company) && (
                      <div className="text-xs font-mono text-[#5C605C]">
                        {[current.authorRole, current.company].filter(Boolean).join(" · ")}
                      </div>
                    )}
                  </div>
                </div>

                {/* Arrow Controls */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={prevSlide}
                    className="p-2.5 rounded-full bg-[#EDEDED] hover:bg-[#111311] text-[#111311] hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CEF23E]"
                    aria-label="Previous testimonial"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="p-2.5 rounded-full bg-[#EDEDED] hover:bg-[#111311] text-[#111311] hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CEF23E]"
                    aria-label="Next testimonial"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dot Indicators */}
        {testimonials.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CEF23E] ${
                  idx === currentIndex
                    ? "w-8 bg-[#111311]"
                    : "w-2 bg-[#DDE1DC] hover:bg-[#5C605C]"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
                aria-current={idx === currentIndex ? "true" : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
