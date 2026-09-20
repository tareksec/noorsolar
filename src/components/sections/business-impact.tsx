import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function BusinessImpact() {
  return (
    <section
      aria-label="Business Sustainability and Energy Efficiency"
      className="py-16 sm:py-24 bg-[#FAFBF9] border-y border-[#DDE1DC] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 sm:space-y-28">
        {/* Row 1: Future Ready (Text Left, Image Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left Text */}
          <div className="flex flex-col items-start">
            <span className="inline-flex items-center px-4 py-1 rounded-full text-xs font-medium text-[#4A5548] bg-white/90 border border-[#DDE1DC] mb-6 shadow-2xs">
              Future ready
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-medium tracking-tight text-[#111311] leading-[1.18] mb-6">
              Built for a lower impact on your business future
            </h2>
            <p className="text-sm sm:text-base text-[#5C605C] leading-relaxed mb-8 max-w-xl">
              Sustainability is becoming a business standard, not a trend. Align
              your operations with regulations, market expectations, and
              environmental responsibility while future-proofing your facility.
            </p>
            <Link
              href="/contact#quote-section"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#2D6A4F] hover:bg-[#23553E] text-white font-medium text-sm transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Talk to an expert</span>
              <ArrowUpRight size={16} className="text-white/80" />
            </Link>
          </div>

          {/* Right Image */}
          <div className="relative aspect-4/3 w-full rounded-3xl lg:rounded-[36px] overflow-hidden shadow-sm border border-[#DDE1DC] group bg-[#E4E7E4]">
            <Image
              src="/photos/impact-future-ready.webp"
              alt="Lush green renewable hills with clean energy turbines under clear sky"
              fill
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
        </div>

        {/* Row 2: Cost Efficiency (Image Left, Text Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left Image (Desktop: Left, Mobile: order-2) */}
          <div className="relative aspect-4/3 w-full rounded-3xl lg:rounded-[36px] overflow-hidden shadow-sm border border-[#DDE1DC] group bg-[#E4E7E4] order-2 lg:order-1">
            <Image
              src="/photos/impact-cost-efficiency.webp"
              alt="Industrial scale solar panels array installed across green meadows"
              fill
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>

          {/* Right Text (Desktop: Right, Mobile: order-1) */}
          <div className="flex flex-col items-start order-1 lg:order-2">
            <span className="inline-flex items-center px-4 py-1 rounded-full text-xs font-medium text-[#4A5548] bg-white/90 border border-[#DDE1DC] mb-6 shadow-2xs">
              Cost efficiency
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-medium tracking-tight text-[#111311] leading-[1.18] mb-6">
              Reduce waste, lower hidden operational and energy costs
            </h2>
            <p className="text-sm sm:text-base text-[#5C605C] leading-relaxed mb-8 max-w-xl">
              Energy loss, emissions, and resource inefficiencies create real
              financial impact. Optimising power generation and battery storage
              slashes recurring grid tariffs, eliminates diesel genset reliance,
              and protects business margins.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/contact#quote-section"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#2D6A4F] hover:bg-[#23553E] text-white font-medium text-sm transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Talk to an expert</span>
                <ArrowUpRight size={16} className="text-white/80" />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-[#F3F5F1] text-[#111311] border border-[#DDE1DC] font-medium text-sm transition-all duration-300 shadow-2xs hover:shadow-xs"
              >
                <span>Browse Equipment</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
