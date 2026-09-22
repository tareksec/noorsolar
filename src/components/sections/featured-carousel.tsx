"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "motion/react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

interface CarouselProduct {
  id: string;
  slug: string;
  name: string;
  brand?: string | null;
  model?: string | null;
  stockStatus: string;
  priceBdt?: number | null;
  showPrice: boolean;
  images: Array<{ url: string; alt: string }>;
  specs: Array<{ label: string; value: string }>;
  category?: { name: string; slug: string } | null;
}

interface FeaturedCarouselProps {
  products: CarouselProduct[];
  locale?: string;
}

export function throttle<T extends (...args: unknown[]) => void>(fn: T, wait: number) {
  let shouldWait = false;

  return function throttledFunction(this: unknown, ...args: Parameters<T>) {
    if (!shouldWait) {
      fn.apply(this, args);
      shouldWait = true;
      setTimeout(() => (shouldWait = false), wait);
    }
  };
}

export function FeaturedCarousel({ products, locale }: FeaturedCarouselProps): React.ReactNode {
  const containerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [carouselEndPosition, setCarouselEndPosition] = useState(0);
  const isBn = locale === "bn";

  const displayProducts = products && products.length > 0 ? products.slice(0, 15) : [];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // 1. Map vertical scroll progress to full horizontal travel distance
  const rawX = useTransform(scrollYProgress, [0, 1], [0, carouselEndPosition]);

  // 2. Calm, balanced, and smooth spring physics for comfortable browsing
  const x = useSpring(rawX, {
    stiffness: 85,
    damping: 22,
    mass: 0.4,
  });

  useEffect(() => {
    const calculateBounds = () => {
      if (carouselRef.current) {
        const trackWidth = carouselRef.current.scrollWidth;
        const viewportWidth = window.innerWidth;
        const totalTravel = -(trackWidth - viewportWidth + 80);
        setCarouselEndPosition(totalTravel < 0 ? totalTravel : 0);
      }
    };

    calculateBounds();

    const throttledResize = throttle(calculateBounds, 150);
    window.addEventListener("resize", throttledResize);

    const timer = setTimeout(calculateBounds, 400);

    return () => {
      window.removeEventListener("resize", throttledResize);
      clearTimeout(timer);
    };
  }, [displayProducts.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let startX = 0;
    let startY = 0;
    let isSwiping = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isSwiping = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isSwiping || e.touches.length !== 1) return;
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const deltaX = startX - currentX;
      const deltaY = startY - currentY;

      // If predominantly horizontal swipe
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
        window.scrollBy({ top: deltaX * 1.5, behavior: "auto" });
        startX = currentX;
        startY = currentY;
      }
    };

    const handleTouchEnd = () => {
      isSwiping = false;
    };

    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  if (displayProducts.length === 0) return null;

  return (
    <section data-motion="featured-carousel" className="relative bg-[#F1F4F1]">
      {/* Balanced & Smooth Sticky Scroll Container (320vh provides calm, controlled product browsing) */}
      <div ref={containerRef} className="w-full relative" style={{ height: "320vh" }}>
        <div className="sticky top-0 h-screen w-full flex flex-col justify-between py-6 sm:py-8 overflow-hidden">
          
          {/* 1. Header: Shop Solar / Featured Products */}
          <div className="text-center max-w-3xl mx-auto px-4 shrink-0">
            {/* Kicker Lines */}
            <div className="inline-flex items-center justify-center gap-3 text-xs sm:text-sm font-semibold tracking-wider text-[#074031] uppercase mb-2">
              <span className="w-8 sm:w-12 h-[1.5px] bg-[#074031]/50 rounded-full" />
              <span>{isBn ? "সোলার ইকুইপমেন্ট" : "Shop Solar"}</span>
              <span className="w-8 sm:w-12 h-[1.5px] bg-[#074031]/50 rounded-full" />
            </div>

            {/* Heading */}
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#17251F] leading-tight">
              {isBn ? (
                <>
                  নির্বাচিত <span className="text-[#074031] font-extrabold">পাইকারি ইকুইপমেন্ট</span>
                </>
              ) : (
                <>
                  Featured <span className="text-[#074031] font-extrabold">Wholesale Equipment</span>
                </>
              )}
            </h2>

            {/* Subtitle */}
            <p className="mt-1.5 text-xs sm:text-sm text-[#62706A] max-w-2xl mx-auto leading-relaxed">
              {isBn
                ? "প্রজেক্ট-গ্রেড সোলার প্যানেল, ইনভার্টার ও ব্যাটারি — প্রতিটি পণ্যে প্রস্তুতকারকের অফিসিয়াল ওয়ারেন্টি।"
                : "Genuine panels, inverters, batteries and UPS systems — each with digital warranty and authenticity on every serial."}
            </p>
          </div>

          {/* Moving Horizontal Track */}
          <div className="w-full overflow-hidden flex items-center my-auto">
            <motion.div
              ref={carouselRef}
              className="featured-carousel-scroll flex gap-6 sm:gap-8 px-6 sm:px-12 items-center will-change-transform"
              style={{ x }}
            >
            {displayProducts.map((product, index) => {
              const imageSrc =
                product.images?.[0]?.url || "/photos/cat-solar-panels.webp";
              const categoryTitle =
                product.category?.name?.toUpperCase() || (isBn ? "সোলার সরঞ্জাম" : "SOLAR EQUIPMENT");
              const linkHref = isBn ? `/bn/product/${product.slug}` : `/product/${product.slug}`;

              return (
                <div
                  key={product.id || index}
                  role="group"
                  aria-roledescription="slide"
                  data-motion="product-card"
                  className="w-[280px] sm:w-[330px] md:w-[360px] h-[450px] sm:h-[470px] shrink-0 rounded-[28px] bg-white border border-[#DCE4E0] shadow-[0_6px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_45px_rgba(7,64,49,0.08)] hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col justify-between group"
                >
                  <Link href={linkHref} className="flex flex-col h-full">
                    
                    {/* Top Studio Image Area with Light Neutral Display Canvas */}
                    <div className="relative w-full h-56 sm:h-60 bg-[#F7F8F5] border-b border-[#DCE4E0] overflow-hidden flex items-center justify-center p-6">
                      <Image
                        src={imageSrc}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 280px, 360px"
                        className="object-contain p-4 group-hover:scale-108 transition-transform duration-500 ease-out pointer-events-none"
                      />

                      {/* Brand Pill */}
                      {product.brand && (
                        <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white/95 border border-[#DCE4E0] text-xs font-mono font-bold text-[#17251F] shadow-2xs">
                          {product.brand}
                        </div>
                      )}

                      {/* Item Index Pill */}
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-[#074031] text-white text-xs font-mono font-bold">
                        0{index + 1}
                      </div>
                    </div>

                    {/* Content Box */}
                    <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                      <div>
                        {/* Category Kicker */}
                        <span className="text-xs font-mono uppercase tracking-wider text-[#62706A] font-semibold block mb-1.5">
                          {categoryTitle}
                        </span>

                        {/* Product Name */}
                        <h3 className="text-base sm:text-lg font-bold text-[#17251F] group-hover:text-[#074031] line-clamp-2 leading-snug mb-2.5">
                          {product.name}
                        </h3>

                        {/* Model / Subtitle */}
                        {product.model && (
                          <p className="text-xs font-mono text-[#62706A] mb-3">
                            {isBn ? `মডেল: ${product.model}` : `Model: ${product.model}`}
                          </p>
                        )}

                        {/* Top Spec Chip if available */}
                        {product.specs && product.specs[0] && (
                          <div className="inline-block px-2.5 py-1 rounded-md bg-[#F1F4F1] border border-[#DCE4E0] text-xs font-mono text-[#62706A]">
                            <span className="font-semibold text-[#17251F]">
                              {product.specs[0].label}:
                            </span>{" "}
                            {product.specs[0].value}
                          </div>
                        )}
                      </div>

                      {/* Bottom Footer Info */}
                      <div className="pt-3.5 border-t border-[#F1F4F1] flex items-center justify-between mt-auto">
                        <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full font-semibold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{isBn ? "রেডি স্টক" : "In Stock"}</span>
                        </span>

                        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#074031] group-hover:text-[#0B513E] group-hover:translate-x-1 transition-all">
                          <span>{isBn ? "টেকনিক্যাল তথ্য" : "View Details"}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-[#074031]" />
                        </span>
                      </div>

                    </div>

                  </Link>
                </div>
              );
            })}
            </motion.div>
          </div>

          {/* 3. Bottom Progress Bar */}
          <div className="max-w-xs mx-auto w-full px-4 shrink-0 flex flex-col items-center gap-1.5 pb-2">
            <div className="w-full h-1 bg-[#DCE4E0] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#074031] rounded-full"
                style={{ scaleX: scrollYProgress, transformOrigin: "0%" }}
              />
            </div>
            <span className="text-xs font-mono text-[#62706A] tracking-wider">
              {isBn ? "স্ক্রোল করে ডানে দেখুন" : "Scroll to explore"}
            </span>
          </div>

        </div>
      </div>

      {/* 3. Bottom Transition Strip to Next Section */}
      <div className="bg-[#074031] py-12 px-4 text-center text-white border-t border-[#0B513E]">
        <div className="max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <span className="text-xs font-mono text-[#FEBE16] block">
              {isBn ? "B2B পাইকারি ক্যাটালগ" : "B2B Wholesale Catalog"}
            </span>
            <p className="text-sm font-semibold text-white">
              {isBn ? "সকল মডেল ও টেকনিক্যাল স্পেসিফিকেশন দেখুন" : "Explore all equipment models & specs"}
            </p>
          </div>
          <Link
            href={isBn ? "/bn/products" : "/products"}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 min-h-[44px] rounded-full bg-[#FEBE16] hover:bg-[#E4A900] text-[#052F25] text-xs font-bold transition-all hover:scale-105 shrink-0"
          >
            <span>{isBn ? "সকল পণ্য দেখুন" : `View All ${products.length} Products`}</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </section>
  );
}
