import React from "react";
import type { Certification } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, ExternalLink, ArrowRight, Award, CheckCircle2, FileText, Globe } from "lucide-react";

interface CertificationsSectionProps {
  certifications?: Certification[];
  locale?: string;
}

export function CertificationsSection({ locale }: CertificationsSectionProps) {
  const isBn = locale === "bn";

  const docUrl =
    "https://drive.google.com/file/d/1GR4hILXnDjJblqNmrxRNnWH_M7It4Md2/view?usp=sharing";

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden bg-[#E8EDE6]">
      
      {/* 1. Ambient Section Background Blend */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/photos/bsrea-compliance-bg-hd.webp"
          alt="BSREA Compliance Background"
          fill
          sizes="100vw"
          className="object-cover object-top opacity-20"
          priority
        />
        {/* Soft gradient blend */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#E8EDE6] via-white/50 to-[#E8EDE6]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-xs font-mono text-[#111311] mb-3.5 border border-[#D5DDD2] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#CEF23E]" />
            <span>{isBn ? "শিল্প সমিতি সদস্যপদ" : "Industry Membership"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#111311]">
            {isBn ? "বিএসআরইএ সদস্যপদ" : "BSREA Industry Membership"}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#525C4F] max-w-2xl mx-auto leading-relaxed">
            {isBn
              ? "বাংলাদেশ সাসটেইনেবল অ্যান্ড রিনিউয়েবল এনার্জি অ্যাসোসিয়েশনের (BSREA) সাধারণ সদস্যপদ সংক্রান্ত অফিসিয়াল সনদ।"
              : "Official documentation of general membership with the Bangladesh Sustainable & Renewable Energy Association (BSREA)."}
          </p>
        </div>

        {/* 2. Main Spotlight Card (Split Showcase: Clean Image on Left + Verified Details on Right) */}
        <div className="rounded-[32px] sm:rounded-[40px] bg-white border border-[#D9E1D5] shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden p-6 sm:p-8 lg:p-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Column: Crisp BSREA Artwork */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="relative w-full h-64 sm:h-80 lg:h-[420px] rounded-[24px] overflow-hidden bg-[#F0F4EE] border border-[#D8E1D5] shadow-xs group">
                <Image
                  src="/photos/bsrea-compliance-bg.webp"
                  alt="BSREA General Member"
                  fill
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="object-cover object-center group-hover:scale-104 transition-transform duration-700 ease-out"
                  priority
                />
                
                {/* Subtle bottom badge over artwork */}
                <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-black/85 backdrop-blur-md text-white text-xs border border-white/10 shadow-md">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#CEF23E]" />
                    <span className="font-semibold text-xs">Official BSREA General Member</span>
                  </div>
                  <span className="font-mono text-xs text-[#CEF23E] font-bold">No. 20260915GEN113</span>
                </div>
              </div>
            </div>

            {/* Right Column: Verified Credential Details */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              
              {/* Header inside details */}
              <div className="mb-6 pb-5 border-b border-[#E6ECE2]">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono text-[#5C6658] uppercase tracking-wider font-semibold">
                      Industry Membership
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full" role="status">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                      Active
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 text-xs font-medium border border-stone-200 cursor-default" role="note">
                    <CheckCircle2 className="w-3.5 h-3.5 text-stone-500" />
                    <span>General Member of BSREA</span>
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#111311] leading-snug">
                  Bangladesh Sustainable & Renewable Energy Association (BSREA)
                </h3>
                <p className="text-xs font-mono text-[#636E5E] mt-1">
                  Apex Renewable Energy Trade Body in Bangladesh
                </p>
              </div>

              {/* 4 Metadata Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
                <div className="p-3.5 rounded-xl bg-[#F6F9F4] border border-[#DEE5DA]">
                  <span className="text-xs font-mono text-[#636E5E] block uppercase font-medium">
                    Member Enterprise
                  </span>
                  <span className="text-sm font-bold text-[#111311]">
                    Tasneem Knitting Industry
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F6F9F4] border border-[#DEE5DA]">
                  <span className="text-xs font-mono text-[#636E5E] block uppercase font-medium">
                    Membership ID
                  </span>
                  <span className="text-sm font-bold font-mono text-[#111311]">
                    20260915GEN113
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F6F9F4] border border-[#DEE5DA]">
                  <span className="text-xs font-mono text-[#636E5E] block uppercase font-medium">
                    Document Type
                  </span>
                  <span className="text-sm font-semibold text-[#111311]">
                    General Membership Certificate
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F6F9F4] border border-[#DEE5DA]">
                  <span className="text-xs font-mono text-[#636E5E] block uppercase font-medium">
                    Validity Period
                  </span>
                  <span className="text-sm font-semibold text-[#111311]">
                    December 31, 2026
                  </span>
                </div>
              </div>

              {/* Brief Statement */}
              <p className="text-xs sm:text-sm text-[#525C4F] leading-relaxed mb-6">
                {isBn
                  ? "তাসনিম নিটিং ইন্ডাস্ট্রি বাংলাদেশ সাসটেইনেবল অ্যান্ড রিনিউয়েবল এনার্জি অ্যাসোসিয়েশনের (BSREA) সক্রিয় সাধারণ সদস্য (20260915GEN113)। এই সনদটি বাংলাদেশের নবায়নযোগ্য শক্তি খাতে স্বীকৃত শিল্প সমিতি সদস্যপদ প্রকাশ করে।"
                  : "Tasneem Knitting Industry holds an active General Membership (20260915GEN113) in the Bangladesh Sustainable & Renewable Energy Association (BSREA). This document represents recognized trade association membership in Bangladesh's renewable energy sector."}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={docUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-full bg-[#111311] text-white text-xs font-semibold hover:bg-black transition-all hover:gap-3 shadow-xs"
                >
                  <FileText className="w-4 h-4 text-[#CEF23E]" />
                  <span>View Official Certificate (PDF)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href="https://bsreabd.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-full border border-neutral-300 bg-white hover:bg-neutral-50 hover:border-neutral-900 text-[#111311] text-xs font-semibold transition-all shadow-2xs"
                >
                  <Globe className="w-3.5 h-3.5 text-[#5C6658]" />
                  <span>Verify on BSREA Portal</span>
                </a>
              </div>

            </div>

          </div>

        </div>

        {/* 3. Pathway to Dedicated Technical Certifications Page */}
        <div className="mt-8 rounded-2xl bg-white border border-[#D9E1D5] p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-[#F6F9F4] border border-[#DEE5DA] flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-[#111311]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#111311]">
                {isBn ? "কারিগরি স্পেসিফিকেশন ও টেস্ট স্ট্যান্ডার্ড" : "Technical Standards & Inspection Protocols"}
              </h4>
              <p className="text-xs text-[#525C4F]">
                {isBn
                  ? "ল্যাবরেটরি টেস্ট প্রটোকল, কোয়ালিটি কন্ট্রোল স্ট্যান্ডার্ড এবং প্রজেক্ট ডকুমেন্টেশন যাচাই করুন।"
                  : "Explore laboratory test protocols, quality control benchmarks, and documentation request workflows."}
              </p>
            </div>
          </div>

          <Link
            href="/certifications"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-full bg-[#EDEDED] hover:bg-[#CEF23E] text-[#111311] text-xs font-bold transition-colors shrink-0"
          >
            <span>{isBn ? "সকল ডকুমেন্ট ও মানদণ্ড দেখুন" : "View All Documents & Standards"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}