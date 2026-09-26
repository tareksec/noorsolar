import React from "react";
import type { Certification } from "@prisma/client";
import Image from "next/image";
import {
  ShieldCheck,
  ExternalLink,
  ArrowRight,
  FileText,
  Globe,
  Building2,
  Calendar,
  CalendarClock,
} from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";

interface CertificationsSectionProps {
  certifications?: Certification[];
  locale?: string;
}

export function CertificationsSection({ locale }: CertificationsSectionProps) {
  const isBn = locale === "bn";

  const docUrl =
    "https://drive.google.com/file/d/1GR4hILXnDjJblqNmrxRNnWH_M7It4Md2/view?usp=sharing";

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden bg-[#F3F7F2]">
      {/* 1. Subtle Atmospheric Green Background with Faint Wind & Solar Silhouettes */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <Image
          src="/photos/bsrea-compliance-bg-hd.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-top opacity-15"
          priority
        />
        {/* Soft Radial & Linear Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F3F7F2] via-transparent to-[#F3F7F2]" />
        <div className="absolute top-0 left-0 w-80 h-80 bg-emerald-500/[0.04] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FEBE16]/[0.05] rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header Matching Mockup */}
        <Reveal y={20} duration={0.6}>
          <div className="text-center mb-10 sm:mb-14">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-[#D5E2D1] shadow-2xs mb-4">
              <span className="w-2 h-2 rounded-full bg-[#107C41]" />
              <span className="text-xs sm:text-[13px] font-medium text-[#1E3B2B]">
                {isBn ? "বিদ্যুৎ সাশ্রয়, সবুজ বাংলাদেশ" : "Energy Savings, Green Bangladesh"}
              </span>
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-[#0D4B39] font-serif leading-tight mb-3">
              {isBn ? "বিএসআরইএ সদস্যপদ" : "BSREA Industry Membership"}
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-[#4F685A] max-w-2xl mx-auto leading-relaxed mb-4">
              {isBn
                ? "বাংলাদেশ সাসটেইনেবল অ্যান্ড রিনিউয়েবল এনার্জি অ্যাসোসিয়েশন (BSREA) সদস্যপদ সনদপত্র প্রতিষ্ঠানের জন্য।"
                : "Official documentation of general membership with the Bangladesh Sustainable & Renewable Energy Association (BSREA)."}
            </p>

            {/* Decorative Divider */}
            <div className="flex items-center justify-center gap-3 my-2">
              <span className="w-12 sm:w-16 h-[1px] bg-[#0D4B39]/20" />
              <span className="text-[#0D4B39] text-xs">🍃</span>
              <span className="w-12 sm:w-16 h-[1px] bg-[#0D4B39]/20" />
            </div>
          </div>
        </Reveal>

        {/* Main Elevated Container Card Matching Mockup */}
        <Reveal y={28} delay={0.1} duration={0.65}>
          <div className="rounded-[32px] sm:rounded-[36px] bg-white border border-[#DCE6D9] shadow-[0_20px_60px_-15px_rgba(7,64,49,0.08)] overflow-hidden p-6 sm:p-8 lg:p-10 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column: BSREA Artwork Poster with Skyline, Logo & Council Bar */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="relative w-full h-[360px] sm:h-[400px] lg:h-[450px] rounded-[24px] overflow-hidden border border-[#D5E0D2] shadow-sm flex flex-col justify-between group">
                {/* Background Skyline Image */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src="/photos/bsrea-member-poster-bg.webp"
                    alt="BSREA Skyline and Solar Facility"
                    fill
                    sizes="(max-width: 1024px) 100vw, 480px"
                    className="object-cover object-top group-hover:scale-103 transition-transform duration-700 ease-out"
                    priority
                  />
                  {/* Subtle soft gradient overlay so logo pops */}
                  <div className="absolute inset-0 bg-radial from-white/70 via-transparent to-black/35 pointer-events-none" />
                </div>

                {/* Center BSREA Logo Overlay in the Sky */}
                <div className="relative z-10 flex-1 flex items-center justify-center p-6">
                  <div className="relative w-[210px] h-[160px] sm:w-[230px] sm:h-[180px]">
                    <Image
                      src="/photos/bsrea-logo.png"
                      alt="BSREA Logo"
                      fill
                      className="object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.18)]"
                      priority
                    />
                  </div>
                </div>

                {/* Dark Emerald Bottom Council Bar */}
                <div className="relative z-10 w-full bg-[#074031] text-white py-3 px-4 sm:px-5 flex items-center justify-between border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#FEBE16]" />
                    <span className="text-xs sm:text-[13px] font-semibold tracking-wide">
                      Official BSREA Council Member
                    </span>
                  </div>
                  <span className="text-xs sm:text-[13px] font-mono font-bold text-[#FEBE16]">
                    No. 202640795CRK112
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Verified Credential Details Matching Mockup */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              {/* Header Badges Row */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono text-[#6A7B6E] font-semibold">
                      Industry Membership
                    </span>
                    <span
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E7A3E] bg-[#E8F8EE] border border-[#BDEBD0] px-3 py-1 rounded-full"
                      role="status"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0E7A3E] animate-pulse" />
                      Active
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-50 text-stone-700 text-xs font-medium border border-stone-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-stone-500" />
                    <span>General Member of BSREA</span>
                  </span>
                </div>

                {/* Main Heading */}
                <h3 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#0D4B39] leading-snug tracking-tight">
                  Bangladesh Sustainable & Renewable Energy Association (BSREA)
                </h3>
                <p className="text-xs sm:text-sm text-[#62706A] mt-1 font-medium">
                  Apex Renewable Energy Trade Body in Bangladesh
                </p>

                {/* 4 Info Cards Grid (2x2) with staggered cascade */}
                <RevealGroup stagger={0.07} className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-5">
                  {/* Card 1: Organization Name */}
                  <RevealItem y={16}>
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-[#F6F9F5] border border-[#E3ECE0] flex items-center gap-3.5 h-full">
                      <div className="w-9 h-9 rounded-xl bg-white border border-[#DCE6D9] flex items-center justify-center text-[#0D4B39] shrink-0 shadow-2xs">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[11px] font-mono text-[#718073] block uppercase font-medium">
                          {isBn ? "প্রতিষ্ঠানের নাম" : "Organization Name"}
                        </span>
                        <span className="text-sm font-bold text-[#142019]">
                          {isBn ? "নূর সোলার এনার্জি" : "Noor Solar Energy"}
                        </span>
                      </div>
                    </div>
                  </RevealItem>

                  {/* Card 2: Membership Number */}
                  <RevealItem y={16}>
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-[#F6F9F5] border border-[#E3ECE0] flex items-center gap-3.5 h-full">
                      <div className="w-9 h-9 rounded-xl bg-white border border-[#DCE6D9] flex items-center justify-center text-[#0D4B39] shrink-0 shadow-2xs">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[11px] font-mono text-[#718073] block uppercase font-medium">
                          Membership Number
                        </span>
                        <span className="text-sm font-bold font-mono text-[#142019]">
                          202640795CRK112
                        </span>
                      </div>
                    </div>
                  </RevealItem>

                  {/* Card 3: Membership Date */}
                  <RevealItem y={16}>
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-[#F6F9F5] border border-[#E3ECE0] flex items-center gap-3.5 h-full">
                      <div className="w-9 h-9 rounded-xl bg-white border border-[#DCE6D9] flex items-center justify-center text-[#0D4B39] shrink-0 shadow-2xs">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[11px] font-mono text-[#718073] block uppercase font-medium">
                          Membership Date
                        </span>
                        <span className="text-sm font-bold text-[#142019]">
                          16 March 2024
                        </span>
                      </div>
                    </div>
                  </RevealItem>

                  {/* Card 4: Valid Until */}
                  <RevealItem y={16}>
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-[#F6F9F5] border border-[#E3ECE0] flex items-center gap-3.5 h-full">
                      <div className="w-9 h-9 rounded-xl bg-white border border-[#DCE6D9] flex items-center justify-center text-[#0D4B39] shrink-0 shadow-2xs">
                        <CalendarClock className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[11px] font-mono text-[#718073] block uppercase font-medium">
                          Valid Until
                        </span>
                        <span className="text-sm font-bold text-[#142019]">
                          15 March 2026
                        </span>
                      </div>
                    </div>
                  </RevealItem>
                </RevealGroup>

                {/* Paragraph Note */}
                <p className="text-xs sm:text-[13.5px] text-[#4F685A] leading-relaxed mb-6 font-normal">
                  {isBn
                    ? "বিএসআরইএ (BSREA) বাংলাদেশ নবায়নযোগ্য জ্বালানি খাতের অন্যতম প্রধান সংগঠন। প্রতিষ্ঠানটি টেকসই জ্বালানি উন্নয়ন, পরিবেশ রক্ষা এবং সবুজ ভবিষ্যৎ গড়ার লক্ষ্যে কাজ করে।"
                    : "BSREA is the apex trade association for the renewable energy sector in Bangladesh, driving sustainable energy development, environmental stewardship, and green industrial growth."}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a
                    href={docUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3 min-h-[44px] rounded-full bg-[#074031] hover:bg-[#052F25] text-white text-xs sm:text-[13px] font-semibold transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>{isBn ? "সদস্যপদ সনদ দেখুন (PDF)" : "View Membership Certificate (PDF)"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href="https://bsreabd.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-full border border-[#DCE4E0] bg-white hover:bg-[#F6F9F5] text-[#17251F] text-xs sm:text-[13px] font-medium transition-all shadow-2xs cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5 text-[#62706A]" />
                    <span>{isBn ? "BSREA অফিসিয়াল ওয়েবসাইট" : "BSREA Official Website"}</span>
                    <ExternalLink className="w-3 h-3 text-[#62706A]" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        </Reveal>
      </div>
    </section>
  );
}