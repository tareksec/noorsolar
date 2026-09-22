import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Headset,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { MagneticButton } from "@/components/ui/magnetic-button";

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
    ? "সরাসরি আমদানিকৃত সোলার ইকুইপমেন্ট। প্রজেক্ট স্কেলে পাইকারি সরবরাহ।"
    : "Solar Equipment. Imported Direct. Supplied at Project Scale.";

  const defaultSubheadline = isBn
    ? "EPC ঠিকাদার, শিল্পপ্রতিষ্ঠান ও সোলার ডিলারদের জন্য N-Type পিভি মডিউল, LiFePO4 ব্যাটারি ও কমার্শিয়াল ইনভার্টার সরবরাহ।"
    : "N-Type PV modules, LiFePO4 storage and commercial inverters for EPCs, industrial facilities and solar dealers across Bangladesh.";

  const defaultPrimaryCta = isBn ? "পাইকারি কোটেশন নিন" : "Request Wholesale Quote";
  const defaultSecondaryCta = isBn ? "বর্তমান স্টক দেখুন" : "View Available Stock";

  const resolvedHeadline = headline || defaultHeadline;
  const resolvedSubheadline = subheadline || defaultSubheadline;
  const resolvedPrimaryCta = primaryCta || defaultPrimaryCta;
  const resolvedSecondaryCta = secondaryCta || defaultSecondaryCta;

  return (
    <section className="relative w-full px-2.5 sm:px-4 lg:px-6 pb-2.5 sm:pb-4 lg:pb-6 pt-0 bg-white">
      <div className="relative w-full min-h-[calc(100vh-1rem)] sm:min-h-[calc(100vh-1.5rem)] lg:min-h-[calc(100vh-2rem)] flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl lg:rounded-[36px] border-2 sm:border-[3px] border-white shadow-[0_20px_50px_rgba(0,0,0,0.18)] ring-1 ring-black/5 bg-[#052F25] text-white">
        
        {/* ================= INVERTED U / ARCH NOTCH CRADLE FOR NAVBAR ================= */}
        <div className="absolute top-0 inset-x-0 flex justify-center pointer-events-none z-30">
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
            <span>{isBn ? "সরাসরি B2B সোলার ইকুইপমেন্ট আমদানিকারক" : "Direct B2B Solar Equipment Importer"}</span>
          </div>

          {/* Headline */}
          <h1
            data-motion="hero-headline"
            className="text-3xl sm:text-5xl lg:text-[3.8rem] xl:text-[4.3rem] font-bold tracking-tight text-white leading-[1.08] mb-5 text-center [text-shadow:_0_2px_12px_rgba(0,0,0,0.9),_0_4px_24px_rgba(0,0,0,0.85)]"
          >
            <span className="hero-word-inner">{resolvedHeadline}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-[1.12rem] text-slate-100 leading-relaxed max-w-2xl mb-8 font-medium text-center [text-shadow:_0_2px_8px_rgba(0,0,0,0.95),_0_3px_16px_rgba(0,0,0,0.85)]">
            {resolvedSubheadline}
          </p>

          {/* Brand Solar Gold Pill CTA Button + Secondary CTA */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <MagneticButton>
              <Link
                href={isBn ? "/bn/quote" : "/quote"}
                data-motion="button-slide"
                className="group inline-flex items-center gap-3 pl-6 pr-2 py-2 rounded-full bg-[#FEBE16] hover:bg-[#E4A900] text-[#052F25] font-bold text-sm sm:text-base shadow-[0_8px_25px_rgba(254,190,22,0.35)] transition-all hover:scale-[1.03] active:scale-[0.98] w-fit"
              >
                <span>{resolvedPrimaryCta}</span>
                <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#052F25] flex items-center justify-center text-[#FEBE16] group-hover:translate-x-0.5 transition-transform shadow-xs">
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                </span>
              </Link>
            </MagneticButton>

            {resolvedSecondaryCta && (
              <Link
                href={isBn ? "/bn/products" : "/products"}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>{resolvedSecondaryCta}</span>
              </Link>
            )}
          </div>
        </div>

        {/* ================= BOTTOM ROW: CAPSULE DOCK & FLOATING PROOF CARD ================= */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-5 pt-4">
          
          {/* Bottom-Left: 3-Item Frosted Capsule Dock with Solar Gold Accents */}
          <div className="inline-flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-6 p-2.5 sm:p-3 px-5 sm:px-6 rounded-2xl bg-[#052F25]/75 backdrop-blur-xl border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
            {/* Item 1: Container & Bulk Wholesale */}
            <div data-motion="hero-glass" className="flex items-center gap-3 pr-4 sm:pr-6 sm:border-r border-white/10">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#FEBE16]/40 bg-[#FEBE16]/10 flex items-center justify-center text-[#FEBE16] shrink-0">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-100 whitespace-nowrap">
                {isBn ? "কন্টেইনার ও বাল্ক সরবরাহ" : "Container & Bulk Wholesale"}
              </span>
            </div>

            {/* Item 2: Certified Solar Equipment */}
            <div data-motion="hero-glass" className="flex items-center gap-3 pr-4 sm:pr-6 sm:border-r border-white/10">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#FEBE16]/40 bg-[#FEBE16]/10 flex items-center justify-center text-[#FEBE16] shrink-0">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-100 whitespace-nowrap">
                {isBn ? "ইঞ্জিনিয়ারিং-গ্রেড পরীক্ষিত সরঞ্জাম" : "Certified Solar Equipment"}
              </span>
            </div>

            {/* Item 3: Nationwide Project Supply */}
            <div data-motion="hero-glass" className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#FEBE16]/40 bg-[#FEBE16]/10 flex items-center justify-center text-[#FEBE16] shrink-0">
                <Headset className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-100 whitespace-nowrap">
                {isBn ? "সারাদেশে প্রজেক্ট ডেলিভারি" : "Nationwide Project Supply"}
              </span>
            </div>
          </div>

          {/* Bottom-Right: Floating Proof & Verified Rating Card with Solar Gold Checked Badge */}
          <div data-motion="hero-glass" className="relative group p-3 sm:p-4 rounded-2xl bg-[#052F25]/80 backdrop-blur-xl border border-white/15 shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex items-center gap-4 max-w-md">
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
                  {isBn ? "প্রজেক্ট-গ্রেড সোলার ইকুইপমেন্ট" : "Project-Scale Solar Equipment"}
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
                <div className="flex flex-col text-[11px] leading-tight">
                  <span className="text-slate-400">{isBn ? "সরাসরি সরবরাহ" : "Trusted Supply"}</span>
                  <span className="font-bold text-[#FEBE16]">{isBn ? "বাণিজ্যিক ও প্রজেক্ট ক্লায়েন্ট" : "Commercial & Project Scale"}</span>
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