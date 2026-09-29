import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { HeroTextReveal } from "@/components/ui/hero-text-reveal";
import { FlipFadeText } from "@/components/ui/flip-fade-text";
import { StaggerText } from "@/components/ui/stagger-text";

// ================= CRISP WHITE ICONS FOR CIRCULAR CATEGORY BADGES =================
function SolarPanelRoundIcon({ className = "w-5 h-5 text-white" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="11" rx="1.8" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.8" />
      <line x1="3" y1="10.5" x2="21" y2="10.5" stroke="currentColor" strokeWidth="1.6" />
      <line x1="9" y1="5" x2="9" y2="16" stroke="currentColor" strokeWidth="1.6" />
      <line x1="15" y1="5" x2="15" y2="16" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7.5 19.5L12 16L16.5 19.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="19" cy="4" r="2" fill="currentColor" />
    </svg>
  );
}

function BatteryStorageRoundIcon({ className = "w-5 h-5 text-white" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="5.5" width="16" height="14" rx="2.5" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.8" />
      <rect x="7.5" y="3" width="3" height="2.5" rx="0.6" fill="currentColor" />
      <rect x="13.5" y="3" width="3" height="2.5" rx="0.6" fill="currentColor" />
      <path d="M12.5 8.5L9.5 13H14.5L11.5 16.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InverterRoundIcon({ className = "w-5 h-5 text-white" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="11" r="3.8" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 11C10.5 9.2 11.2 9.2 12 11C12.8 12.8 13.5 12.8 14 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="8" cy="17" r="1.1" fill="currentColor" />
      <circle cx="12" cy="17" r="1.1" fill="currentColor" />
      <circle cx="16" cy="17" r="1.1" fill="currentColor" />
    </svg>
  );
}

function PortablePowerRoundIcon({ className = "w-5 h-5 text-white" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 6V3.5C8.5 2.8 9.1 2.2 9.8 2.2H14.2C14.9 2.2 15.5 2.8 15.5 3.5V6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="3.5" y="6" width="17" height="14.5" rx="2.5" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.8" />
      <rect x="6.5" y="8.5" width="11" height="4.5" rx="1" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.2" />
      <path d="M12.5 9.5L10.5 10.8H13.5L11.5 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8" cy="16.5" r="1.3" fill="currentColor" />
      <circle cx="12" cy="16.5" r="1.3" fill="currentColor" />
      <rect x="15" y="15.5" width="2.5" height="1.8" rx="0.4" fill="currentColor" />
    </svg>
  );
}

interface HeroSectionProps {
  headline?: string;
  subheadline?: string;
  primaryCta?: string;
  secondaryCta?: string;
  locale?: string;
}

export function HeroSection({
  headline,
  subheadline,
  primaryCta,
  secondaryCta,
  locale,
}: HeroSectionProps) {
  const isBn = locale === "bn" || (headline ? /[\u0980-\u09FF]/.test(headline) : false);

  const defaultHeadline = isBn
    ? "সরাসরি আমদানিকৃত সেরা সোলার ইকুইপমেন্ট — আপনার প্রজেক্টের বিশ্বস্ত সমাধান"
    : "Solar Equipment. Imported Direct. Supplied at Project Scale.";

  const defaultSubheadline = isBn
    ? "EPC কন্ট্রাক্টর, কারখানা ও সোলার ডিলারদের জন্য টিয়ার-১ N-Type সোলার প্যানেল, নিরাপদ LiFePO4 ব্যাটারি ও স্মার্ট ইনভার্টারের নির্ভরযোগ্য পাইকারি সরবরাহ — সরাসরি চট্টগ্রাম পোর্ট ও ঢাকা ওয়্যারহাউস থেকে দ্রুত ডেলিভারি।"
    : "N-Type PV modules, LiFePO4 storage and commercial inverters for EPCs, industrial facilities and solar dealers across Bangladesh.";

  const defaultPrimaryCta = isBn ? "সহজেই কোটেশন নিন" : "Request Wholesale Quote";
  const defaultSecondaryCta = isBn ? "আমাদের রেডি স্টক দেখুন" : "View Available Stock";

  const resolvedHeadline = headline || defaultHeadline;
  const resolvedSubheadline = subheadline || defaultSubheadline;
  const resolvedPrimaryCta = primaryCta || defaultPrimaryCta;
  const resolvedSecondaryCta = secondaryCta || defaultSecondaryCta;

  return (
    <section className="relative w-full px-0 sm:px-4 lg:px-6 pb-0 sm:pb-4 lg:pb-6 pt-0 bg-white overflow-x-clip">
      <div className="relative w-full min-h-svh sm:min-h-[calc(100vh-1.5rem)] lg:min-h-[calc(100vh-2rem)] flex flex-col justify-between overflow-hidden rounded-none sm:rounded-3xl lg:rounded-[36px] border-0 sm:border-[3px] border-white shadow-[0_20px_50px_rgba(0,0,0,0.18)] ring-1 ring-black/5 bg-[#052F25] text-white">
        
        {/* ================= INVERTED U / ARCH NOTCH CRADLE FOR NAVBAR ================= */}
        <div className="absolute top-0 inset-x-0 hidden md:flex justify-center pointer-events-none z-30">
          <div className="relative flex items-start">
            {/* Left Inverted Fillet (Concave Curve) */}
            <svg
              viewBox="0 0 32 32"
              className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 fill-white block shrink-0"
              aria-hidden="true"
            >
              <path d="M0,0 C17.67,0 32,14.33 32,32 L32,0 Z" />
            </svg>

            {/* Center Cradle Tab */}
            <div data-motion="hero-parallax" className="w-[300px] sm:w-[460px] md:w-[760px] lg:w-[785px] xl:w-[790px] h-[58px] sm:h-[64px] lg:h-[66px] bg-white rounded-b-[22px] sm:rounded-b-[26px] lg:rounded-b-[28px] shrink-0" />

            {/* Right Inverted Fillet (Concave Curve) */}
            <svg
              viewBox="0 0 32 32"
              className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 fill-white block shrink-0"
              aria-hidden="true"
            >
              <path d="M32,0 C14.33,0 0,14.33 0,32 L0,0 Z" />
            </svg>
          </div>
        </div>

        <div data-motion="hero-photo" className="absolute inset-0 w-full h-full overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            className="hero-photo-img absolute inset-0 w-full h-full object-cover pointer-events-none"
          >
            <source
              src="/video/Solar_energy_commercial_video_20260920141958.mp4"
              type="video/mp4"
            />
          </video>
        </div>

      {/* ================= MAIN HERO BODY ================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow flex flex-col justify-between pt-20 sm:pt-24 lg:pt-28 pb-8 sm:pb-10">
        
        {/* Centered Column: Kicker, Title, Subtitle, CTA Button */}
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center justify-center my-auto py-2 sm:py-4">
          {/* Kicker Pill Badge in Brand Solar Gold */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#FEBE16]/30 bg-[#FEBE16]/10 backdrop-blur-md text-[#FEBE16] text-xs sm:text-sm font-medium mb-5 shadow-[0_0_20px_rgba(254,190,22,0.15)]">
            <Sparkles className="w-4 h-4 text-[#FEBE16] shrink-0" />
            <span>{isBn ? "✨ সরাসরি আমদানিকারক • বিশ্বস্ত B2B সোলার পার্টনার" : "Direct B2B Solar Equipment Importer"}</span>
          </div>

          {/* Headline with StaggerText */}
          <h1
            data-motion="hero-headline"
            className="text-3xl sm:text-5xl lg:text-[3.8rem] xl:text-[4.3rem] font-bold tracking-tight text-white leading-[1.08] mb-5 text-center [text-shadow:_0_2px_12px_rgba(0,0,0,0.9),_0_4px_24px_rgba(0,0,0,0.85)]"
          >
            <StaggerText delay={0.1} divideBy="word">
              {resolvedHeadline}
            </StaggerText>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-[1.12rem] text-slate-100 leading-relaxed max-w-2xl mb-8 font-medium text-center [text-shadow:_0_2px_8px_rgba(0,0,0,0.95),_0_3px_16px_rgba(0,0,0,0.85)]">
            {resolvedSubheadline}
          </p>

          {/* Brand Solar Gold Pill CTA Button + Secondary CTA */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <MagneticButton>
              <Link
                href={isBn ? "/quote" : "/en/quote"}
                data-motion="button-slide"
                className="btn-slide-fill group inline-flex items-center gap-3 pl-6 pr-2 py-2 rounded-full bg-[#FEBE16] hover:bg-[#E4A900] text-[#052F25] font-bold text-sm sm:text-base shadow-[0_8px_25px_rgba(254,190,22,0.35)] transition-all hover:scale-[1.03] active:scale-[0.98] w-fit"
              >
                <span>{resolvedPrimaryCta}</span>
                <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#052F25] flex items-center justify-center text-[#FEBE16] group-hover:translate-x-0.5 transition-transform shadow-xs">
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                </span>
              </Link>
            </MagneticButton>

            {resolvedSecondaryCta && (
              <Link
                href={isBn ? "/products" : "/en/products"}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>{resolvedSecondaryCta}</span>
              </Link>
            )}
          </div>
        </div>

        {/* ================= BOTTOM ROW: 4 CATEGORY CARDS & FLOATING PROOF CARD ================= */}
        <div className="flex flex-col xl:flex-row items-start xl:items-end justify-between gap-4 pt-4">
          
          {/* 4 Core Category Cards matching user reference: Solid Round Badges + White Card + "SHOP NOW >" */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 w-full xl:w-auto">
            {/* Category 1: Solar Panels (Solar Gold Badge) */}
            <Link
              href={isBn ? "/products?category=solar-panels" : "/en/products?category=solar-panels"}
              data-motion="hero-glass"
              className="group flex items-center gap-2.5 sm:gap-3 p-2.5 sm:px-3.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white/95 hover:bg-white text-[#074031] shadow-[0_8px_25px_rgba(0,0,0,0.18)] hover:shadow-[0_12px_32px_rgba(7,64,49,0.3)] hover:-translate-y-0.5 border border-white/80 transition-all duration-300 min-w-0"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-[#FEBE16] to-[#E4A900] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
                <SolarPanelRoundIcon className="w-5 h-5 text-[#052F25]" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs sm:text-sm font-bold text-[#074031] group-hover:text-[#108958] transition-colors leading-tight truncate">
                  {isBn ? "সোলার প্যানেল" : "Solar Panels"}
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold text-[#108958] group-hover:text-[#074031] tracking-wider uppercase flex items-center gap-0.5 mt-0.5 transition-colors">
                  <span>{isBn ? "এখন কিনুন" : "SHOP NOW"}</span>
                  <ChevronRight className="w-3 h-3 text-[#FEBE16] stroke-[3] group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </Link>

            {/* Category 2: Lithium Batteries (Emerald Green Badge) */}
            <Link
              href={isBn ? "/products?category=lithium-batteries" : "/en/products?category=lithium-batteries"}
              data-motion="hero-glass"
              className="group flex items-center gap-2.5 sm:gap-3 p-2.5 sm:px-3.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white/95 hover:bg-white text-[#074031] shadow-[0_8px_25px_rgba(0,0,0,0.18)] hover:shadow-[0_12px_32px_rgba(7,64,49,0.3)] hover:-translate-y-0.5 border border-white/80 transition-all duration-300 min-w-0"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-[#108958] to-[#074031] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
                <BatteryStorageRoundIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs sm:text-sm font-bold text-[#074031] group-hover:text-[#108958] transition-colors leading-tight truncate">
                  {isBn ? "লিথিয়াম ব্যাটারি" : "Lithium Batteries"}
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold text-[#108958] group-hover:text-[#074031] tracking-wider uppercase flex items-center gap-0.5 mt-0.5 transition-colors">
                  <span>{isBn ? "এখন কিনুন" : "SHOP NOW"}</span>
                  <ChevronRight className="w-3 h-3 text-[#FEBE16] stroke-[3] group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </Link>

            {/* Category 3: Solar Inverters (Industrial Forest + Gold Badge) */}
            <Link
              href={isBn ? "/products?category=solar-inverters" : "/en/products?category=solar-inverters"}
              data-motion="hero-glass"
              className="group flex items-center gap-2.5 sm:gap-3 p-2.5 sm:px-3.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white/95 hover:bg-white text-[#074031] shadow-[0_8px_25px_rgba(0,0,0,0.18)] hover:shadow-[0_12px_32px_rgba(7,64,49,0.3)] hover:-translate-y-0.5 border border-white/80 transition-all duration-300 min-w-0"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-[#074031] to-[#0B513E] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300 border border-[#FEBE16]/20">
                <InverterRoundIcon className="w-5 h-5 text-[#FEBE16]" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs sm:text-sm font-bold text-[#074031] group-hover:text-[#108958] transition-colors leading-tight truncate">
                  {isBn ? "সোলার ইনভার্টার" : "Solar Inverters"}
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold text-[#108958] group-hover:text-[#074031] tracking-wider uppercase flex items-center gap-0.5 mt-0.5 transition-colors">
                  <span>{isBn ? "এখন কিনুন" : "SHOP NOW"}</span>
                  <ChevronRight className="w-3 h-3 text-[#FEBE16] stroke-[3] group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </Link>

            {/* Category 4: Portable Power Stations (Warm Solar Amber Badge) */}
            <Link
              href={isBn ? "/products?category=portable-power-stations" : "/en/products?category=portable-power-stations"}
              data-motion="hero-glass"
              className="group flex items-center gap-2.5 sm:gap-3 p-2.5 sm:px-3.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white/95 hover:bg-white text-[#074031] shadow-[0_8px_25px_rgba(0,0,0,0.18)] hover:shadow-[0_12px_32px_rgba(7,64,49,0.3)] hover:-translate-y-0.5 border border-white/80 transition-all duration-300 min-w-0"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
                <PortablePowerRoundIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs sm:text-sm font-bold text-[#074031] group-hover:text-[#108958] transition-colors leading-tight truncate">
                  {isBn ? "পোর্টেবল পাওয়ার" : "Portable Power"}
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold text-[#108958] group-hover:text-[#074031] tracking-wider uppercase flex items-center gap-0.5 mt-0.5 transition-colors">
                  <span>{isBn ? "এখন কিনুন" : "SHOP NOW"}</span>
                  <ChevronRight className="w-3 h-3 text-[#FEBE16] stroke-[3] group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </Link>
          </div>

          {/* Bottom-Right: Floating Proof & Verified Rating Card with Solar Gold Checked Badge */}
          <div data-motion="hero-glass" className="relative group p-3 sm:p-4 rounded-2xl bg-[#052F25]/80 backdrop-blur-xl border border-white/15 shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex items-center gap-4 max-w-md w-full sm:w-auto">
            {/* Left: Thumbnail of Solar Inverter / Storage System */}
            <div className="relative w-32 h-24 sm:w-36 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-slate-800 border border-white/10">
              <Image
                src="/Inverter/solar-inverter-with-battery-storage.jpg"
                alt={isBn ? "বাণিজ্যিক সোলার ইনভার্টার ও স্টোরেজ" : "Commercial Solar Inverter & Battery Storage"}
                fill
                sizes="(max-width: 640px) 128px, 144px"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Right: Verified Info, Stars, and Avatar Stack */}
            <div className="flex flex-col justify-center gap-1.5 min-w-0">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#FEBE16] text-[#052F25] flex items-center justify-center shadow-xs shrink-0 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 fill-[#052F25] text-[#FEBE16]" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-white leading-tight">
                  {isBn ? "প্রজেক্ট-গ্রেড প্রিমিয়াম ইকুইপমেন্ট" : "Project-Scale Solar Equipment"}
                </span>
              </div>

              {/* 5 Gold Stars */}
              <div className="flex items-center gap-1 text-amber-400 text-sm">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>

              {/* Avatar Stack + B2B Trust Label */}
              <div className="flex items-center gap-2.5 pt-0.5">
                <div className="flex -space-x-2 overflow-hidden" aria-hidden="true">
                  <div className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 overflow-hidden relative">
                    <Image
                      src="/demo/avatar-1.svg"
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 overflow-hidden relative">
                    <Image
                      src="/demo/avatar-2.svg"
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 overflow-hidden relative">
                    <Image
                      src="/demo/avatar-3.svg"
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="flex flex-col text-xs leading-tight">
                  <span className="text-slate-300">{isBn ? "সরাসরি ওয়্যারহাউস থেকে" : "Trusted Supply"}</span>
                  <span className="font-bold text-[#FEBE16]">{isBn ? "বাণিজ্যিক ও প্রজেক্টের বিশ্বস্ত পার্টনার" : "Commercial & Project Scale"}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>
);
}