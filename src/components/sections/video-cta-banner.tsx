import React from "react";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";

interface VideoCtaBannerProps {
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  ctaHref?: string;
  videoSrc?: string;
  locale?: string;
}

export function VideoCtaBanner({
  headline,
  subheadline,
  ctaText,
  ctaHref = "/quote",
  videoSrc = "/video/Robots_assembling_solar_panels_20260920132147.mp4",
  locale,
}: VideoCtaBannerProps) {
  const isBn = locale === "bn";

  const defaultHeadline = isBn
    ? "আজই কন্টেইনার স্কেল সোলার সরঞ্জাম প্রয়োজন?"
    : "Need Container-Scale Solar Supply Today?";

  const defaultSubheadline = isBn
    ? "উন্নত স্বয়ংক্রিয় প্রযুক্তিতে প্রস্তুত সোলার প্যানেল, ইন্ডাস্ট্রিয়াল LiFePO4 ব্যাটারি ব্যাংক এবং হাইব্রিড ইনভার্টারের সরাসরি আমদানিকারক। দ্রুত কন্টেইনার ডেলিভারি ও পাইকারি মূল্য।"
    : "Direct importer of factory-tested solar panels, industrial LiFePO4 battery banks, and hybrid inverters. Fast container dispatch, certified engineering, and wholesale pricing across Bangladesh.";

  const defaultCtaText = isBn ? "পাইকারি কোটেশন নিন" : "Request Wholesale Quote";

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#F1F4F1] border-b border-[#DCE4E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[28px] sm:rounded-[36px] min-h-[440px] sm:min-h-[500px] lg:min-h-[540px] flex items-center p-8 sm:p-12 lg:p-16 shadow-xl border border-[#DCE4E0]/80 group">
          {/* Background Video (Zero overlay layer - completely natural and clear) */}
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            poster="/photos/hero-solar-field.webp"
            className="absolute inset-0 w-full h-full object-cover object-center scale-100 group-hover:scale-103 transition-transform duration-1000 ease-out"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>

          {/* Content Box */}
          <div className="relative z-10 max-w-xl lg:max-w-2xl">
            {/* Live Indicator / Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#052F25]/75 backdrop-blur-md border border-white/20 text-white text-xs font-mono uppercase tracking-wider mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#FEBE16] animate-pulse" />
              <span>{isBn ? "স্বয়ংক্রিয় রোবোটিক অ্যাসেম্বলি" : "Automated Robotic Assembly"}</span>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold text-white leading-[1.08] tracking-tight mb-5 [text-shadow:_0_3px_14px_rgb(0_0_0_/_95%)]">
              {headline || defaultHeadline}
            </h2>

            {/* Subheadline / Information */}
            <p className="text-sm sm:text-base md:text-lg text-white/95 leading-relaxed max-w-xl mb-8 font-normal [text-shadow:_0_2px_10px_rgb(0_0_0_/_95%)]">
              {subheadline || defaultSubheadline}
            </p>

            {/* Action Button: Solar Gold */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={ctaHref}
                className="inline-flex items-center min-h-[44px] gap-3.5 pl-6 pr-2.5 py-2.5 rounded-full bg-[#FEBE16] hover:bg-[#E4A900] active:scale-[0.98] text-[#052F25] font-bold text-sm sm:text-base shadow-[0_8px_24px_-4px_rgba(254,190,22,0.4)] transition-all duration-200 group/btn"
              >
                <span>{ctaText || defaultCtaText}</span>
                <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#052F25] text-[#FEBE16] flex items-center justify-center group-hover/btn:translate-x-1 transition-all duration-200 shadow-xs">
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-current stroke-[2.5]" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
