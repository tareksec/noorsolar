"use client";

import React, { useRef, useState, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { ProductCard } from "@/components/product/product-card";
import { Reveal } from "@/components/ui/reveal";

export interface FeaturedProduct {
  id: string;
  slug: string;
  name: string;
  brand?: string | null;
  model?: string | null;
  stockStatus: string;
  moq?: string | null;
  priceBdt?: number | null;
  showPrice: boolean;
  images: Array<{ url: string; alt: string }>;
  specs: Array<{ label: string; value: string }>;
  category?: { name: string; slug: string } | null;
}

interface FeaturedProductsProps {
  products?: FeaturedProduct[];
  locale?: string;
}

export function FeaturedProducts({ products = [], locale = "en" }: FeaturedProductsProps) {
  const isBn = locale === "bn";
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const displayProducts = products.slice(0, 10);

  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollContainerRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [displayProducts.length]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.75;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (displayProducts.length === 0) return null;

  return (
    <section id="featured-products" className="py-10 sm:py-14 lg:py-18 bg-white border-b border-[#DCE4E0] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: left-aligned title, right-aligned controls & catalog link */}
        <Reveal y={20} duration={0.6}>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-6 sm:mb-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2.5 mb-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FEBE16] ring-2 ring-[#074031]/20 inline-block" />
                <span className="text-xs font-mono uppercase tracking-wider text-[#62706A] font-semibold">
                  {isBn ? "নির্বাচিত পণ্য" : "Featured Products"}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-[2.5rem] font-bold tracking-tight text-[#074031] leading-tight">
                {isBn ? "প্রজেক্ট-গ্রেড সরঞ্জাম, স্টকে প্রস্তুত" : "Project-Grade Equipment, Ready in Stock"}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-[#62706A] leading-relaxed">
                {isBn
                  ? "EPC ঠিকাদার ও ডিলারদের সবচেয়ে বেশি চাহিদার সোলার প্যানেল, ব্যাটারি ও ইনভার্টার — অফিসিয়াল ওয়ারেন্টিসহ।"
                  : "The most requested solar panels, batteries and inverters for EPCs and dealers — each with official warranty."}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
              {/* Horizontal 1-line Navigation Controls */}
              <div className="flex items-center gap-1.5 bg-[#F1F4F1] p-1 rounded-full border border-[#DCE4E0]">
                <button
                  type="button"
                  onClick={() => scroll("left")}
                  disabled={!canScrollLeft}
                  aria-label="Previous products"
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    canScrollLeft
                      ? "bg-white text-[#074031] shadow-xs hover:bg-[#074031] hover:text-white cursor-pointer"
                      : "text-slate-300 cursor-not-allowed opacity-40"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scroll("right")}
                  disabled={!canScrollRight}
                  aria-label="Next products"
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    canScrollRight
                      ? "bg-white text-[#074031] shadow-xs hover:bg-[#074031] hover:text-white cursor-pointer"
                      : "text-slate-300 cursor-not-allowed opacity-40"
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <Link
                href="/products"
                className="group inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 min-h-[40px] sm:min-h-[44px] rounded-full text-xs sm:text-sm font-semibold bg-white hover:bg-[#074031] text-[#074031] hover:text-white border border-[#074031]/30 hover:border-[#074031] shadow-xs transition-all duration-300"
              >
                <span>{isBn ? "সকল পণ্য" : "View All"}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </Reveal>

        {/* 1-Line Single Row Carousel / Horizontal Scroll */}
        <Reveal y={24} delay={0.1} duration={0.65}>
          <div
            ref={scrollContainerRef}
            className="flex flex-nowrap items-stretch gap-4 sm:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 pt-1 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {displayProducts.map((product, idx) => (
              <div
                key={product.id || product.slug}
                className="w-[270px] sm:w-[290px] lg:w-[310px] shrink-0 snap-start flex flex-col"
              >
                <ProductCard product={product} priority={idx < 4} />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
