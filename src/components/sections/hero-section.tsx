import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  Box,
  FileText,
  SlidersHorizontal,
  Store,
  Zap,
  Building2,
} from "lucide-react";

interface HeroSectionProps {
  headline?: string;
  subheadline?: string;
  primaryCta?: string;
  secondaryCta?: string;
}

export function HeroSection({
  headline,
  subheadline,
  primaryCta,
  secondaryCta,
}: HeroSectionProps) {
  return (
    <section className="hero-section page-shell" aria-labelledby="hero-title">
      <div className="hero-frame">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="status-dot" /> Bangladesh · B2B solar importer
          </p>
          <h1 id="hero-title">{headline}</h1>
          <p className="hero-description">{subheadline}</p>
          <div className="hero-actions">
            <Link href="/contact#quote-section" className="button button-lime">
              {primaryCta}
              <ArrowUpRight size={18} />
            </Link>
            <Link href="/products" className="button button-outline">
              {secondaryCta}
              <ArrowRight size={17} />
            </Link>
          </div>
          <div className="hero-capabilities" aria-label="Procurement options">
            <span>
              <Box size={16} /> Bulk orders
            </span>
            <span>
              <SlidersHorizontal size={16} /> Custom quotes
            </span>
            <span>
              <FileText size={16} /> Product specs
            </span>
          </div>
        </div>
        <div className="hero-scene">
          <Image
            src="/photos/hero-solar-field.webp"
            alt="Rows of solar panels catching the evening sunlight"
            width={1600}
            height={897}
            sizes="(max-width: 767px) 90vw, (max-width: 1023px) 80vw, 600px"
            loading="eager"
            fetchPriority="high"
            className="hero-photo"
          />
          <div className="hero-scene-top">
            <span className="scene-label">GENERATE / STORE / CONVERT</span>
            <ArrowUpRight size={28} />
          </div>
          <div className="hero-glass">
            <span className="hero-glass-icon">
              <Box size={22} />
            </span>
            <div>
              <strong>One catalog. Three essentials.</strong>
              <span>Panels · Lithium batteries · Inverters</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upgraded & Highlighted B2B Solutions Section for Dealers, EPC & Project Buyers */}
      <div className="mt-8 pt-6 pb-2">
        <div className="rounded-2xl sm:rounded-3xl bg-white/85 backdrop-blur-md border border-[#DDE1DC] p-5 sm:p-7 shadow-xs hover:shadow-md transition-all duration-300">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left Header */}
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111311] text-[#CEF23E] text-[11px] font-mono font-medium tracking-wide uppercase shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#CEF23E] animate-ping" />
                <span>B2B Wholesale Procurement</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#111311] tracking-tight">
                For Dealers, EPC Teams & Project Buyers
              </h2>
              <p className="text-xs sm:text-sm text-[#5C605C] leading-relaxed">
                Direct container-scale imports with dedicated pallet pricing, manufacturer warranties, and ready inventory dispatched from our central Dhaka warehouse.
              </p>
            </div>

            {/* Right Quick Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 lg:shrink-0">
              <a
                href="#equipment"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#111311] hover:bg-[#222622] text-[#CEF23E] font-medium text-xs tracking-tight transition-all shadow-xs group"
              >
                <span>Explore the Equipment</span>
                <ArrowDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
              </a>
              <Link
                href="/contact#quote-section"
                className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl bg-[#F0F2ED] hover:bg-[#E4E8E0] text-[#111311] border border-[#DDE1DC] font-medium text-xs tracking-tight transition-all"
              >
                <span>Request B2B Quote</span>
                <ArrowUpRight size={14} className="text-[#2D6A4F]" />
              </Link>
            </div>
          </div>

          {/* 3 Dedicated Solution Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6 pt-5 border-t border-[#E8ECE5]">
            {/* 1. Dealers */}
            <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white/70 border border-[#E8ECE5] hover:border-[#CEF23E] hover:bg-white hover:shadow-xs transition-all group">
              <div className="w-9 h-9 rounded-xl bg-[#111311] text-[#CEF23E] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Store size={18} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#111311] group-hover:text-black">
                  Solar Dealers & Resellers
                </h3>
                <p className="text-[11px] text-[#5C605C] mt-1 leading-snug">
                  Container & pallet bulk rates, reliable restocking cycles, and wholesale margin protection.
                </p>
              </div>
            </div>

            {/* 2. EPC Contractors */}
            <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white/70 border border-[#E8ECE5] hover:border-[#CEF23E] hover:bg-white hover:shadow-xs transition-all group">
              <div className="w-9 h-9 rounded-xl bg-[#2D6A4F] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Zap size={18} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#111311] group-hover:text-black">
                  EPC Contractors & Engineers
                </h3>
                <p className="text-[11px] text-[#5C605C] mt-1 leading-snug">
                  Factory test reports, MPPT voltage string verification, and guaranteed spec compliance.
                </p>
              </div>
            </div>

            {/* 3. Project Buyers */}
            <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white/70 border border-[#E8ECE5] hover:border-[#CEF23E] hover:bg-white hover:shadow-xs transition-all group">
              <div className="w-9 h-9 rounded-xl bg-[#CEF23E] text-[#111311] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Building2 size={18} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#111311] group-hover:text-black">
                  Commercial Project Buyers
                </h3>
                <p className="text-[11px] text-[#5C605C] mt-1 leading-snug">
                  Rooftop & factory setups, full VAT/AIT chalan documentation, and depot-to-site delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
