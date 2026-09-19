"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Box, Zap, Truck } from "lucide-react";

interface HeroSectionProps {
  headline?: string;
  subheadline?: string;
}

export function HeroSection({
  headline = "Solar panels, lithium batteries and inverters, supplied in bulk .",
  subheadline = "Direct B2B importer providing engineering-grade solar equipment, guaranteed tier-1 quality, and wholesale delivery across Bangladesh.",
}: HeroSectionProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  return (
    <section className="relative pt-28 sm:pt-36 pb-12 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#CEF23E]/15 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Dashboard Container Card per DESIGN.md Section 4 */}
        <div className="relative p-6 sm:p-10 lg:p-14 rounded-[36px] sm:rounded-[44px] bg-[#EDEDED] border border-[#DDE1DC] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Content & Call to Actions */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              {/* Kicker */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-white text-xs font-mono text-[#111311] w-fit mb-6 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#CEF23E] animate-pulse"></span>
                <span>Power Equipment for a Resilient Bangladesh 🌱</span>
              </div>

              {/* Title H1 */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#111311] leading-[1.08] mb-6">
                <span className="inline-block text-[#CEF23E] mr-2">↗</span>
                {headline}
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-[#5C605C] leading-relaxed max-w-xl mb-8">
                {subheadline}
              </p>

              {/* Button Group */}
              <div className="flex flex-wrap items-center gap-4 mb-10">
                <Link
                  href="/#quote-section"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#CEF23E] hover:bg-[#B8DC2F] text-[#111311] font-semibold text-sm tracking-tight shadow-[0_10px_25px_-5px_rgba(206,242,62,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111311]"
                >
                  <span>↗ Request Bulk Quote</span>
                </Link>

                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/80 hover:bg-white text-[#111311] font-medium text-sm border border-[#DDE1DC] transition-all hover:border-[#111311] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CEF23E]"
                >
                  <span>Browse Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Specs & Compliance Footer (Neutral Specs only) */}
              <div className="pt-6 border-t border-[#DDE1DC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-xs font-mono text-[#5C605C]">
                  <span>TIER-1 QUALITY</span>
                  <span className="text-[#DDE1DC]">&bull;</span>
                  <span>DHAKA STOCK</span>
                  <span className="text-[#DDE1DC]">&bull;</span>
                  <span>B2B INDENT</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#111311] font-medium px-2.5 py-1 rounded-full bg-white border border-[#DDE1DC]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#111311]" />
                    Datasheets
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#111311] font-medium px-2.5 py-1 rounded-full bg-white border border-[#DDE1DC]">
                    <Box className="w-3.5 h-3.5 text-[#111311]" />
                    Container Wholesale
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Procedural Glass Visual & Floating Cards */}
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
              className="lg:col-span-5 relative w-full aspect-square sm:aspect-[4/3] lg:aspect-[4/4] flex items-center justify-center"
            >
              {/* Central Visual Presentation */}
              <div
                style={{
                  transform: `perspective(1000px) rotateY(${mousePos.x * 12}deg) rotateX(${-mousePos.y * 12}deg)`,
                  transition: "transform 0.15s ease-out",
                }}
                className="relative w-full h-full rounded-3xl overflow-hidden glass-card bg-white/40 border border-white/80 p-4 shadow-xl flex items-center justify-center"
              >
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#111311] flex items-center justify-center border border-white/20">
                  <Image
                    src="/demo/panel-620w-topcon.svg"
                    alt="Tier-1 Solar Panels and Equipment"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover opacity-90 scale-105"
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111311]/70 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Floating Glass Card A: Logistics dispatch */}
              <div
                style={{
                  transform: `translate(${mousePos.x * -18}px, ${mousePos.y * -18}px)`,
                  transition: "transform 0.2s ease-out",
                }}
                className="absolute -top-4 -left-3 sm:-left-6 p-4 rounded-2xl glass-card bg-white/80 border border-white shadow-xl max-w-[210px] hidden sm:block pointer-events-none"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Truck className="w-4 h-4 text-[#111311]" />
                  <span className="text-[11px] font-mono uppercase font-bold text-[#111311]">
                    Central Depot
                  </span>
                </div>
                <p className="text-xs text-[#5C605C] leading-snug">
                  24–48h Wholesale dispatch across Bangladesh
                </p>
              </div>

              {/* Floating Glass Card B: Battery Capsule Status */}
              <div
                style={{
                  transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`,
                  transition: "transform 0.2s ease-out",
                }}
                className="absolute -bottom-4 -right-2 sm:-right-6 p-4 rounded-2xl glass-card bg-white/85 border border-white shadow-xl min-w-[220px] pointer-events-none"
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#111311]" />
                    <span className="text-[11px] font-mono font-bold text-[#111311]">
                      ESS GRADE
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#CEF23E] bg-[#111311] px-2 py-0.5 rounded-full font-bold">
                    6000+ CYCLES
                  </span>
                </div>
                {/* Visual Capsule Progress Bar */}
                <div className="w-full h-2.5 rounded-full bg-[#EDEDED] overflow-hidden p-0.5 border border-[#DDE1DC]">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#CEF23E] to-[#B8DC2F] w-[88%]" />
                </div>
                <span className="text-[10px] font-mono text-[#5C605C] mt-1.5 block">
                  LiFePO4 Safe Prismatic Cells
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
