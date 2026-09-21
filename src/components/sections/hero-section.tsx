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
  primaryCta = "Book Service",
  locale,
}: HeroSectionProps) {
  const isBn = locale === "bn" || (headline ? /[\u0980-\u09FF]/.test(headline) : false);

  return (
    <section className="relative w-full px-2.5 sm:px-4 lg:px-6 pb-2.5 sm:pb-4 lg:pb-6 pt-0 bg-white">
      <div className="relative w-full min-h-[calc(100vh-1rem)] sm:min-h-[calc(100vh-1.5rem)] lg:min-h-[calc(100vh-2rem)] flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl lg:rounded-[36px] border-2 sm:border-[3px] border-white shadow-[0_20px_50px_rgba(0,0,0,0.18)] ring-1 ring-black/5 bg-[#0A0D0A] text-white">
        
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
            <div data-motion="hero-parallax" className="w-[280px] sm:w-[330px] md:w-[780px] lg:w-[940px] h-[68px] sm:h-[74px] lg:h-[80px] bg-white rounded-b-[24px] sm:rounded-b-[28px] lg:rounded-b-[32px] shrink-0" />

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
            preload="auto"
            className="hero-photo-img absolute inset-0 w-full h-full object-cover pointer-events-none"
          >
            <source
              src="/video/Solar_energy_commercial_video_20260920141958.mp4"
              type="video/mp4"
            />
          </video>
        </div>

      {/* ================= MAIN HERO BODY ================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow flex flex-col justify-between pt-28 sm:pt-36 lg:pt-40 pb-8 sm:pb-10">
        
        {/* Centered Column: Kicker, Title, Subtitle, CTA Button */}
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center justify-center my-auto py-4 sm:py-6">
          {/* Kicker Pill Badge in Brand Volt Lime */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#CEF23E]/30 bg-[#CEF23E]/10 backdrop-blur-md text-[#CEF23E] text-xs sm:text-sm font-medium mb-5 shadow-[0_0_20px_rgba(206,242,62,0.15)]">
            <Sparkles className="w-4 h-4 text-[#CEF23E] shrink-0" />
            <span>{isBn ? "প্রফেশনাল সোলার ও এনার্জি সলিউশন" : "Professional Ac & Solar Services"}</span>
          </div>

          {/* Headline with Brand Volt Lime to Sky Cyan Gradient */}
          <h1
            data-motion="hero-headline"
            className="text-3xl sm:text-5xl lg:text-[3.8rem] xl:text-[4.3rem] font-bold tracking-tight text-white leading-[1.08] mb-5 text-center [text-shadow:_0_2px_12px_rgba(0,0,0,0.9),_0_4px_24px_rgba(0,0,0,0.85)]"
          >
            {headline ? (
              <span className="hero-word-inner">{headline}</span>
            ) : isBn ? (
              <>
                <span className="hero-word-inner">পরিচ্ছন্ন ও নির্ভরযোগ্য</span>{" "}
                <span className="block mt-1">
                  <span className="hero-word-inner">সোলার এনার্জি</span>{" "}
                  <span className="whitespace-nowrap bg-gradient-to-r from-[#CEF23E] via-[#E4F972] to-[#38BDF8] bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(206,242,62,0.25)]">
                    <span className="hero-word-inner">সারা বছর</span>
                  </span>
                </span>
              </>
            ) : (
              <>
                <span className="hero-word-inner">Keep Your Home Cool &</span>{" "}
                <span className="block mt-1">
                  <span className="hero-word-inner">Comfortable</span>{" "}
                  <span className="whitespace-nowrap bg-gradient-to-r from-[#CEF23E] via-[#E4F972] to-[#38BDF8] bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(206,242,62,0.25)]">
                    <span className="hero-word-inner">Year-Round</span>
                  </span>
                </span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-[1.12rem] text-slate-100 leading-relaxed max-w-2xl mb-8 font-medium text-center [text-shadow:_0_2px_8px_rgba(0,0,0,0.95),_0_3px_16px_rgba(0,0,0,0.85)]">
            {subheadline || (isBn
              ? "উচ্চ-দক্ষতার সোলার প্যানেল, লিথিয়াম ব্যাটারি ও ইনভার্টার দিয়ে আপনার বিদ্যুৎ খরচ কমান এবং নিরবচ্ছিন্ন বিদ্যুৎ নিশ্চিত করুন।"
              : "Expert AC repair, installation, and maintenance services delivered by certified technicians to keep your home cool, efficient, and comfortable all year long.")}
          </p>

          {/* Brand Volt Lime Pill CTA Button */}
          <div className="flex items-center justify-center gap-4">
            <MagneticButton>
              <Link
                href={isBn ? "/bn/contact" : "/contact"}
                data-motion="button-slide"
                className="group inline-flex items-center gap-3 pl-6 pr-2 py-2 rounded-full bg-[#CEF23E] hover:bg-[#D4F842] text-[#111311] font-bold text-sm sm:text-base shadow-[0_8px_25px_rgba(206,242,62,0.35)] transition-all hover:scale-[1.03] active:scale-[0.98] w-fit"
              >
                <span>{primaryCta}</span>
                <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#111311] flex items-center justify-center text-[#CEF23E] group-hover:translate-x-0.5 transition-transform shadow-xs">
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                </span>
              </Link>
            </MagneticButton>
          </div>
        </div>

        {/* ================= BOTTOM ROW: CAPSULE DOCK & FLOATING PROOF CARD ================= */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-5 pt-4">
          
          {/* Bottom-Left: 3-Item Frosted Capsule Dock with Volt Lime Accents */}
          <div className="inline-flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-6 p-2.5 sm:p-3 px-5 sm:px-6 rounded-2xl bg-slate-950/70 backdrop-blur-xl border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
            {/* Item 1: Same-Day Service */}
            <div data-motion="hero-glass" className="flex items-center gap-3 pr-4 sm:pr-6 sm:border-r border-white/10">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#CEF23E]/40 bg-[#CEF23E]/10 flex items-center justify-center text-[#CEF23E] shrink-0">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-100 whitespace-nowrap">
                {isBn ? "একই দিনে ডেলিভারি" : "Same-Day Service"}
              </span>
            </div>

            {/* Item 2: 24/7 Support */}
            <div data-motion="hero-glass" className="flex items-center gap-3 pr-4 sm:pr-6 sm:border-r border-white/10">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#CEF23E]/40 bg-[#CEF23E]/10 flex items-center justify-center text-[#CEF23E] shrink-0">
                <Headset className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-100 whitespace-nowrap">
                {isBn ? "২৪/৭ সাপোর্ট" : "24/7 Support"}
              </span>
            </div>

            {/* Item 3: Satisfaction Guaranteed */}
            <div data-motion="hero-glass" className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#CEF23E]/40 bg-[#CEF23E]/10 flex items-center justify-center text-[#CEF23E] shrink-0">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-100 whitespace-nowrap">
                {isBn ? "শতভাগ নিশ্চয়তা" : "Satisfaction Guaranteed"}
              </span>
            </div>
          </div>

          {/* Bottom-Right: Floating Proof & Verified Rating Card with Volt Lime Checked Badge */}
          <div data-motion="hero-glass" className="relative group p-3 sm:p-4 rounded-2xl bg-slate-950/75 backdrop-blur-xl border border-white/15 shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex items-center gap-4 max-w-md">
            {/* Left: Thumbnail of Technician */}
            <div className="relative w-32 h-24 sm:w-36 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-slate-800 border border-white/10">
              <Image
                src="/Inverter/hvac-technician-performing-air-conditioner-maintenance-inspection.jpg"
                alt={isBn ? "প্রফেশনাল সার্টিফাইড টেকনিশিয়ান" : "Professional Certified Technician"}
                fill
                sizes="(max-width: 640px) 128px, 144px"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Right: Verified Info, Stars, and Avatar Stack */}
            <div className="flex flex-col justify-center gap-1.5 min-w-0">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#CEF23E] text-[#111311] flex items-center justify-center shadow-xs shrink-0 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 fill-[#111311] text-[#CEF23E]" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-white leading-tight">
                  {isBn ? "নির্ভরযোগ্য প্রফেশনাল সোলার সেবা" : "Professional AC Care You Can Trust"}
                </span>
              </div>

              {/* 5 Gold Stars */}
              <div className="flex items-center gap-1 text-amber-400 text-sm">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>

              {/* Avatar Stack + Customer Count */}
              <div className="flex items-center gap-2.5 pt-0.5">
                <div className="flex -space-x-2 overflow-hidden">
                  <div className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 overflow-hidden relative">
                    <Image
                      src="/demo/avatar-1.svg"
                      alt="Customer 1"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 overflow-hidden relative">
                    <Image
                      src="/demo/avatar-2.svg"
                      alt="Customer 2"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 overflow-hidden relative">
                    <Image
                      src="/demo/avatar-3.svg"
                      alt="Customer 3"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="flex flex-col text-[11px] leading-tight">
                  <span className="text-slate-400">{isBn ? "আস্থাভাজন" : "Trusted By"}</span>
                  <span className="font-bold text-[#CEF23E]">{isBn ? "১০,০০০+ গ্রাহক" : "10,000+ Customers"}</span>
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