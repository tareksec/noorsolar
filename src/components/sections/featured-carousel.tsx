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

export function FeaturedCarousel({ products }: FeaturedCarouselProps): React.ReactNode {
  const mainRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [carouselEndPosition, setCarouselEndPosition] = useState(0);

  const displayProducts = products && products.length > 0 ? products.slice(0, 8) : [];

  const { scrollYProgress } = useScroll({
    target: mainRef,
    offset: ["start start", "end end"],
  });

  // 1. Map vertical scroll progress to full horizontal travel distance
  const rawX = useTransform(scrollYProgress, [0, 1], [0, carouselEndPosition]);

  // 2. Slow, graceful, and smooth spring physics so the slide moves calmly and gently
  const x = useSpring(rawX, {
    stiffness: 55,
    damping: 28,
    mass: 1.2,
    restDelta: 0.001,
  });

  useEffect(() => {
    if (!carouselRef.current) return;

    const resetCarouselEndPosition = () => {
      if (carouselRef.current) {
        const totalWidth = carouselRef.current.scrollWidth;
        const viewportWidth = window.innerWidth;
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        const paddingOffset = window.innerWidth < 640 ? 24 : 48;
        const newPosition = totalWidth - viewportWidth + scrollbarWidth + paddingOffset;

        setCarouselEndPosition(-Math.max(0, newPosition));
      }
    };

    resetCarouselEndPosition();
    const handleResize = throttle(resetCarouselEndPosition, 30);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [displayProducts.length]);

  if (displayProducts.length === 0) return null;

  return (
    <section ref={mainRef} data-motion="featured-carousel" className="relative bg-[#E4E7E4]">
      
      {/* 1. Header: Shop Solar / Featured Products */}
      <div className="pt-16 sm:pt-24 pb-6 text-center max-w-3xl mx-auto px-4">
        {/* Amber Kicker Lines */}
        <div className="inline-flex items-center justify-center gap-3 text-xs sm:text-sm font-semibold tracking-wider text-[#85580F] uppercase mb-3">
          <span className="w-8 sm:w-12 h-[1.5px] bg-[#85580F]/70 rounded-full" />
          <span>Shop Solar</span>
          <span className="w-8 sm:w-12 h-[1.5px] bg-[#85580F]/70 rounded-full" />
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111311] leading-tight">
          Featured <span className="text-[#485244] font-extrabold">Products</span>
        </h2>

        {/* Subtitle */}
        <p className="mt-3 text-sm sm:text-base text-[#5C605C] max-w-2xl mx-auto leading-relaxed">
          Genuine panels, inverters, batteries and UPS systems — each with digital warranty and authenticity on every serial.
        </p>

        {/* Scroll Progress Bar indicator */}
        <div className="max-w-xs mx-auto mt-4 h-1 bg-[#D8E1D5] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#111311] rounded-full"
            style={{ scaleX: scrollYProgress, transformOrigin: "0%" }}
          />
        </div>
      </div>

      {/* 2. Slow & Smooth Sticky Scroll Container (450vh allows calm, gradual sliding) */}
      <div className="w-full relative" style={{ height: "450vh" }}>
        <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden">
          
          {/* Moving Horizontal Track */}
          <motion.div
            ref={carouselRef}
            className="featured-carousel-scroll flex gap-6 sm:gap-8 px-6 sm:px-12 items-center will-change-transform"
            style={{ x }}
          >
            {displayProducts.map((product, index) => {
              const imageSrc =
                product.images?.[0]?.url || "/photos/cat-solar-panels.webp";
              const categoryTitle =
                product.category?.name?.toUpperCase() || "SOLAR EQUIPMENT";

              return (
                <div
                  key={product.id || index}
                  role="group"
                  aria-roledescription="slide"
                  className="w-[280px] sm:w-[330px] md:w-[360px] h-[450px] sm:h-[470px] shrink-0 rounded-[28px] bg-white border border-[#DDE1DC] shadow-[0_6px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col justify-between group"
                >
                  <Link href={`/product/${product.slug}`} className="flex flex-col h-full">
                    
                    {/* Top Studio Image Area with Light Neutral Display Canvas */}
                    <div className="relative w-full h-56 sm:h-60 bg-[#F5F7F3] border-b border-[#E8ECE5] overflow-hidden flex items-center justify-center p-6">
                      <Image
                        src={imageSrc}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 280px, 360px"
                        className="object-contain p-4 group-hover:scale-108 transition-transform duration-500 ease-out pointer-events-none"
                      />

                      {/* Brand Pill */}
                      {product.brand && (
                        <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white/95 border border-[#DDE1DC] text-[10px] font-mono font-bold text-[#111311] shadow-2xs">
                          {product.brand}
                        </div>
                      )}

                      {/* Item Index Pill */}
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-[#111311] text-white text-[10px] font-mono font-bold">
                        0{index + 1}
                      </div>
                    </div>

                    {/* Content Box */}
                    <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                      <div>
                        {/* Category Kicker */}
                        <span className="text-[11px] font-mono uppercase tracking-wider text-[#6B7567] font-semibold block mb-1.5">
                          {categoryTitle}
                        </span>

                        {/* Product Name */}
                        <h3 className="text-base sm:text-lg font-bold text-[#111311] group-hover:text-black line-clamp-2 leading-snug mb-2.5">
                          {product.name}
                        </h3>

                        {/* Model / Subtitle */}
                        {product.model && (
                          <p className="text-xs font-mono text-[#4F594A] mb-3">
                            Model: {product.model}
                          </p>
                        )}

                        {/* Top Spec Chip if available */}
                        {product.specs && product.specs[0] && (
                          <div className="inline-block px-2.5 py-1 rounded-md bg-[#F4F6F2] border border-[#E2E6DF] text-[11px] font-mono text-[#4C5447]">
                            <span className="font-semibold text-[#111311]">
                              {product.specs[0].label}:
                            </span>{" "}
                            {product.specs[0].value}
                          </div>
                        )}
                      </div>

                      {/* Bottom Footer Info */}
                      <div className="pt-3.5 border-t border-[#F0F2EF] flex items-center justify-between mt-auto">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full font-semibold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>In Stock</span>
                        </span>

                        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#111311] group-hover:text-black group-hover:translate-x-1 transition-all">
                          <span>View Details</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-[#111311]" />
                        </span>
                      </div>

                    </div>

                  </Link>
                </div>
              );
            })}
          </motion.div>

        </div>
      </div>

      {/* 3. Bottom Transition Strip to Next Section */}
      <div className="bg-[#111311] py-12 px-4 text-center text-white border-t border-[#252A25]">
        <div className="max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <span className="text-xs font-mono text-[#CEF23E] block">B2B Wholesale Catalog</span>
            <p className="text-sm font-semibold text-white">Explore all equipment models & specs</p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#CEF23E] hover:bg-[#b8da35] text-[#111311] text-xs font-bold transition-all hover:scale-105 shrink-0"
          >
            <span>View All {products.length} Products</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </section>
  );
}
