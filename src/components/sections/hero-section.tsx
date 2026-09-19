"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Box } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@/lib/gsap";
import { HeroVisual } from "@/components/sections/hero-visual";

interface HeroSectionProps {
  headline?: string;
  subheadline?: string;
  primaryCta?: string;
  secondaryCta?: string;
}

export function HeroSection({
  headline = "Solar panels, lithium batteries and inverters, supplied in bulk.",
  subheadline = "Direct B2B importer providing engineering-grade solar equipment and wholesale delivery across Bangladesh.",
  primaryCta = "Request Quote",
  secondaryCta = "Browse Products",
}: HeroSectionProps) {
  const containerRef = useRef<HTMLElement>(null);

  // Split headline into words or natural lines for masked slide-up reveal
  const headlineWords = headline.split(" ");
  // Group into ~3 lines for punchy typography
  const line1 = headlineWords.slice(0, Math.ceil(headlineWords.length / 3)).join(" ");
  const line2 = headlineWords
    .slice(Math.ceil(headlineWords.length / 3), Math.ceil((headlineWords.length * 2) / 3))
    .join(" ");
  const line3 = headlineWords.slice(Math.ceil((headlineWords.length * 2) / 3)).join(" ");
  const lines = [line1, line2, line3].filter(Boolean);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
        });

        // 1.2s total orchestrated entrance timeline
        tl.from(".hero-kicker", {
          opacity: 0,
          y: 16,
          duration: 0.5,
        })
          .from(
            ".hero-headline-line",
            {
              yPercent: 120,
              duration: 0.75,
              stagger: 0.08,
            },
            "-=0.25"
          )
          .from(
            ".hero-subtext",
            {
              opacity: 0,
              y: 20,
              duration: 0.55,
            },
            "-=0.35"
          )
          .from(
            ".hero-cta-btn",
            {
              opacity: 0,
              y: 18,
              duration: 0.5,
              stagger: 0.1,
            },
            "-=0.35"
          )
          .from(
            ".hero-spec-footer",
            {
              opacity: 0,
              y: 12,
              duration: 0.45,
            },
            "-=0.25"
          )
          .from(
            ".hero-visual-container",
            {
              opacity: 0,
              scale: 0.94,
              duration: 0.85,
              ease: "power2.out",
            },
            0.2
          );
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="relative pt-28 sm:pt-36 pb-12 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#CEF23E]/15 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Dashboard Container Card per DESIGN.md Section 4 */}
        <div className="relative p-6 sm:p-10 lg:p-14 rounded-[36px] sm:rounded-[44px] bg-[#EDEDED] border border-[#DDE1DC] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Content & Call to Actions */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              {/* Kicker */}
              <div className="hero-kicker inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/90 border border-white text-[11px] sm:text-xs font-mono text-[#111311] max-w-full mb-6 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#CEF23E] animate-pulse"></span>
                <span>Direct B2B Solar Equipment Importer</span>
              </div>

              {/* Title H1 with Masked Line Reveal */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#111311] leading-[1.08] mb-6">
                {lines.map((line, idx) => (
                  <span key={idx} className="block overflow-hidden pb-1">
                    <span className="hero-headline-line block will-change-transform">
                      {line}
                    </span>
                  </span>
                ))}
              </h1>

              {/* Description */}
              <p className="hero-subtext text-base sm:text-lg text-[#5C605C] leading-relaxed max-w-xl mb-8">
                {subheadline}
              </p>

              {/* Button Group */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-10 w-full sm:w-auto">
                <Link
                  href="/#quote-section"
                  className="hero-cta-btn inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#CEF23E] hover:bg-[#B8DC2F] text-[#111311] font-semibold text-sm tracking-tight shadow-[0_10px_25px_-5px_rgba(206,242,62,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111311] w-full sm:w-auto text-center"
                >
                  <span>{primaryCta}</span>
                </Link>

                <Link
                  href="/products"
                  className="hero-cta-btn inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/80 hover:bg-white text-[#111311] font-medium text-sm border border-[#DDE1DC] transition-all hover:border-[#111311] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CEF23E] w-full sm:w-auto text-center"
                >
                  <span>{secondaryCta}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Specs & Compliance Footer (Neutral Specs only) */}
              <div className="hero-spec-footer pt-6 border-t border-[#DDE1DC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4 text-[11px] sm:text-xs font-mono text-[#262826] font-medium">
                  <span>BULK ORDERS</span>
                  <span className="text-[#DDE1DC]">&bull;</span>
                  <span>CUSTOM QUOTES</span>
                  <span className="text-[#DDE1DC]">&bull;</span>
                  <span>DATASHEETS</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#111311] font-medium px-2.5 py-1 rounded-full bg-white border border-[#DDE1DC]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#111311]" />
                    Datasheets
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#111311] font-medium px-2.5 py-1 rounded-full bg-white border border-[#DDE1DC]">
                    <Box className="w-3.5 h-3.5 text-[#111311]" />
                    Bulk Orders
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Layered SVG Glass Visual & Interactive Parallax */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <HeroVisual />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}