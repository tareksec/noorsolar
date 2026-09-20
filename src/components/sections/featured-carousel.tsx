"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { motion, useReducedMotion } from "motion/react";
import { isPointerFine } from "@/lib/motion";

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

export function FeaturedCarousel({ products }: FeaturedCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  // Custom "Drag" cursor state
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ startX: 0, scrollLeft: 0 });

  const updateProgress = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      const p = Math.min(1, Math.max(0, scrollLeft / maxScroll));
      setScrollProgress(p);
      const idx = Math.round(p * (products.length - 1));
      setActiveIndex(idx);
    }
  }, [products.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
    return () => el.removeEventListener("scroll", updateProgress);
  }, [updateProgress]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: shouldReduceMotion ? "auto" : "smooth",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scroll("left");
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      scroll("right");
    }
  };

  // Mouse Drag to Scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isPointerFine()) return;
    const el = scrollRef.current;
    if (!el) return;
    setIsDragging(true);
    dragStartRef.current = {
      startX: e.pageX - el.offsetLeft,
      scrollLeft: el.scrollLeft,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPointerFine()) return;
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      setCursorPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }

    if (!isDragging) return;
    const el = scrollRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - dragStartRef.current.startX) * 1.5;
    el.scrollLeft = dragStartRef.current.scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!products || products.length === 0) return null;

  return (
    <section
      className="py-20 bg-[#EDEDED] border-y border-[#DDE1DC] overflow-hidden relative"
      aria-roledescription="carousel"
      aria-label="Featured equipment carousel"
      data-motion="featured-carousel"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#CEF23E]" />
              <span className="text-xs font-mono uppercase tracking-wider text-[#5C605C]">
                Featured Equipment
              </span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-[#111311]">
              Engineered for Highest Yield
            </h2>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              className="p-3 rounded-full bg-white border border-[#DDE1DC] hover:border-[#111311] text-[#111311] hover:bg-[#111311] hover:text-white transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CEF23E] cursor-pointer"
              aria-label="Previous equipment slide"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-3 rounded-full bg-white border border-[#DDE1DC] hover:border-[#111311] text-[#111311] hover:bg-[#111311] hover:text-white transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CEF23E] cursor-pointer"
              aria-label="Next equipment slide"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Carousel Track */}
      <div
        ref={containerRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsDragging(false);
        }}
        onMouseMove={handleMouseMove}
      >
        {/* Custom "Drag" Cursor for Desktop Pointer */}
        {isHovered && !shouldReduceMotion && (
          <div
            className="pointer-events-none hidden md:flex items-center justify-center absolute z-40 px-3 py-1.5 rounded-full bg-[#111311] text-[#CEF23E] text-[11px] font-mono font-bold tracking-wider shadow-lg transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
            style={{
              left: `${cursorPos.x}px`,
              top: `${cursorPos.y}px`,
              scale: isDragging ? 0.9 : 1,
            }}
          >
            {isDragging ? "DRAGGING" : "DRAG ↔"}
          </div>
        )}

        <div
          ref={scrollRef}
          onKeyDown={handleKeyDown}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          tabIndex={0}
          role="region"
          aria-label="Equipment slides. Use arrow keys to navigate."
          className={`featured-carousel-scroll flex gap-6 overflow-x-auto pb-6 pt-2 scrollbar-none snap-x snap-mandatory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CEF23E] rounded-3xl ${
            isDragging ? "cursor-grabbing select-none snap-none" : "cursor-grab"
          }`}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((prod, idx) => (
            <motion.div
              key={prod.id}
              whileHover={shouldReduceMotion ? {} : { y: -4 }}
              transition={{ duration: 0.2 }}
              className="w-[280px] sm:w-[320px] md:w-[360px] shrink-0 snap-start"
              role="group"
              aria-roledescription="slide"
              aria-label={`${idx + 1} of ${products.length}: ${prod.name}`}
            >
              <ProductCard product={prod} />
            </motion.div>
          ))}
        </div>

        {/* Carousel Progress Indicator Bar */}
        <div className="max-w-xs mx-auto mt-6 flex items-center gap-3">
          <div className="flex-1 h-1 bg-[#DDE1DC] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#111311] rounded-full transition-all duration-150"
              style={{ width: `${Math.max(15, scrollProgress * 100)}%` }}
            />
          </div>
          <span className="text-[11px] font-mono text-[#5C605C] shrink-0 font-medium">
            {activeIndex + 1} / {products.length}
          </span>
        </div>
      </div>
    </section>
  );
}
