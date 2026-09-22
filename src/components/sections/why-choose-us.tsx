"use client";

import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { Stat } from "@prisma/client";
import { AnimatedCounter } from "@/components/ui/animated-counter";

interface WhyChooseUsProps {
  locale?: string;
  stats?: Stat[];
}

export function WhyChooseUs({ locale, stats }: WhyChooseUsProps = {}) {
  const pathname = usePathname() || "";
  const isBn = locale === "bn" || pathname.startsWith("/bn/") || pathname === "/bn";
  const displayStats = stats && stats.length > 0 ? stats.slice(0, 3) : null;

  return (
    <section id="why-choose-us" className="pt-6 sm:pt-8 pb-20 lg:pb-28 bg-[#F1F4F1] border-b border-[#DCE4E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 lg:mb-14">
          {/* Eyebrow */}
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FEBE16] ring-2 ring-[#074031]/20 inline-block" />
            <span className="text-xs font-mono uppercase tracking-wider text-[#62706A] font-semibold">
              {isBn ? "কেন নূর সোলার এনার্জি বেছে নেবেন" : "Why Choose Noor Solar Energy"}
            </span>
          </div>

          {/* Clean Balanced Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#074031] max-w-3xl leading-[1.12]">
            {isBn ? "নির্ভরযোগ্য মান। প্রমাণিত দক্ষতা। স্বচ্ছ সরবরাহ।" : "Trusted Expertise. Reliable Results. Every Time."}
          </h2>
        </div>

        {/* Main Grid: Left Big Photo + Right Stack (2 Photos + Accent Paragraph + 3 Big Stats) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Large Featured Installation Photo */}
          <div className="lg:col-span-6 h-full">
            <div className="relative w-full h-[320px] sm:h-[420px] lg:h-[520px] rounded-[28px] overflow-hidden border border-[#DCE4E0] bg-[#F1F4F1] shadow-xs group">
              <Image
                src="/photos/about-commercial-plant.webp"
                alt={isBn ? "বাংলাদেশে বাণিজ্যিক সোলার বিদ্যুৎ প্রকল্প" : "Commercial industrial solar power facility installation in Bangladesh"}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-104 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#052F25]/50 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-white/90 backdrop-blur-xs border border-white/80 flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono tracking-wider text-[#62706A] font-semibold">
                    {isBn ? "সরাসরি আমদানিকারকের নিশ্চয়তা" : "Direct Importer Quality"}
                  </p>
                  <p className="text-sm font-bold text-[#17251F]">
                    {isBn ? "কন্টেইনার স্কেলে সরাসরি ফ্যাক্টরি থেকে আমদানি" : "Container-Scale Direct Factory Sourcing"}
                  </p>
                </div>
                <span className="w-3 h-3 rounded-full bg-[#FEBE16] ring-4 ring-[#FEBE16]/30" />
              </div>
            </div>
          </div>

          {/* Right Column: 2 Side-by-Side Photos + Accent Text + 3 Key Metrics */}
          <div className="lg:col-span-6 flex flex-col justify-between h-full">
            {/* Top: 2 Photos Side-by-Side */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-8">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-[#DCE4E0] bg-[#F1F4F1] shadow-xs group">
                <Image
                  src="/Inverter/technician-engineering-setting-inverter-solar-panel-in-electrical-room-service-engineer.jpg"
                  alt={isBn ? "ইলেকট্রিক্যাল রুমে কমার্শিয়াল সোলার ইনভার্টার কনফিগার করছেন ইঞ্জিনিয়ার" : "Engineer setting commercial solar inverter in electrical room"}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center group-hover:scale-106 transition-transform duration-500"
                />
              </div>

              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-[#DCE4E0] bg-[#F1F4F1] shadow-xs group">
                <Image
                  src="/Inverter/electrician-installing-solar-panel-system-wiring-inverter-and-electric-box.jpg"
                  alt={isBn ? "সোলার ইনভার্টার ও তার সংযোগের কাজ করছেন টেকনিশিয়ান" : "Electrician installing solar inverter and wiring electric box"}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center group-hover:scale-106 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Middle: Vertical Accent Bar with Text */}
            <div className="border-l-2 border-[#074031] pl-5 sm:pl-6 mb-10 max-w-xl">
              <p className="text-xs sm:text-sm text-[#62706A] leading-relaxed">
                {isBn
                  ? "যাচাইকৃত টেকনিক্যাল ডেটাশিট, ফ্যাক্টরি টেস্ট রিপোর্ট এবং অফিসিয়াল ওয়ারেন্টি সুবিধাসহ সারা বাংলাদেশে নির্ভরযোগ্য সোলার ইকুইপমেন্ট সরবরাহ।"
                  : "Direct factory procurement delivered with verified technical datasheets, certified engineering components, and transparent bill of lading documentation across Bangladesh."}
              </p>
            </div>

            {/* Bottom: Centralized Key Metrics */}
            {displayStats && displayStats.length > 0 && (
              <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 border-t border-[#DCE4E0]">
                {displayStats.map((item) => (
                  <div key={item.id}>
                    <div className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-[#074031] font-mono leading-none mb-2">
                      <AnimatedCounter
                        value={item.value}
                        prefix={item.prefix}
                        suffix={item.suffix}
                        decimals={Number.isInteger(item.value) ? 0 : 1}
                      />
                    </div>
                    <div className="text-xs sm:text-[13px] font-semibold text-[#17251F] leading-tight mb-0.5">
                      {item.label}
                    </div>
                    {item.description && (
                      <div className="text-[11px] text-[#62706A] leading-tight">
                        {item.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
