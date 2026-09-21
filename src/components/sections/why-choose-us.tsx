"use client";

import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatedCounter } from "@/components/ui/animated-counter";

interface WhyChooseUsProps {
  locale?: string;
}

export function WhyChooseUs({ locale }: WhyChooseUsProps = {}) {
  const pathname = usePathname() || "";
  const isBn = locale === "bn" || pathname.startsWith("/bn/") || pathname === "/bn";

  return (
    <section id="why-choose-us" className="pt-6 sm:pt-8 pb-20 lg:pb-28 bg-[#EDEDED] border-b border-[#DDE1DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 lg:mb-14">
          {/* Eyebrow */}
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#CEF23E] ring-2 ring-[#111311]/20 inline-block" />
            <span className="text-xs font-mono uppercase tracking-wider text-[#5C605C] font-semibold">
              {isBn ? "কেন নূর সোলার বেছে নেবেন" : "Why Choose Noor Solar Energy"}
            </span>
          </div>

          {/* Clean Balanced Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#111311] max-w-3xl leading-[1.12]">
            {isBn ? "বিশ্বস্ত দক্ষতা। নির্ভরযোগ্য ফলাফল। প্রতিবার।" : "Trusted Expertise. Reliable Results. Every Time."}
          </h2>
        </div>

        {/* Main Grid: Left Big Photo + Right Stack (2 Photos + Accent Paragraph + 3 Big Stats) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Large Featured Installation Photo */}
          <div className="lg:col-span-6 h-full">
            <div className="relative w-full h-[320px] sm:h-[420px] lg:h-[520px] rounded-[28px] overflow-hidden border border-[#DDE1DC] bg-[#E4E7E4] shadow-xs group">
              <Image
                src="/photos/about-commercial-plant.webp"
                alt={isBn ? "বাংলাদেশে বাণিজ্যিক সোলার বিদ্যুৎ প্রকল্প" : "Commercial industrial solar power facility installation in Bangladesh"}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-104 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111311]/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-white/90 backdrop-blur-xs border border-white/80 flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono tracking-wider text-[#5C605C] font-semibold">
                    {isBn ? "সরাসরি আমদানিকারকের গুণমান" : "Direct Importer Quality"}
                  </p>
                  <p className="text-sm font-bold text-[#111311]">
                    {isBn ? "কন্টেইনার স্কেল টায়ার-১ সংগ্রহ" : "Container-Scale Tier-1 Procurement"}
                  </p>
                </div>
                <span className="w-3 h-3 rounded-full bg-[#CEF23E] ring-4 ring-[#CEF23E]/30" />
              </div>
            </div>
          </div>

          {/* Right Column: 2 Side-by-Side Photos + Accent Text + 3 Key Metrics */}
          <div className="lg:col-span-6 flex flex-col justify-between h-full">
            {/* Top: 2 Photos Side-by-Side */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-8">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-[#DDE1DC] bg-[#E4E7E4] shadow-xs group">
                <Image
                  src="/Inverter/technician-engineering-setting-inverter-solar-panel-in-electrical-room-service-engineer.jpg"
                  alt={isBn ? "ইলেকট্রিক্যাল রুমে কমার্শিয়াল সোলার ইনভার্টার কনফিগার করছেন ইঞ্জিনিয়ার" : "Engineer setting commercial solar inverter in electrical room"}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center group-hover:scale-106 transition-transform duration-500"
                />
              </div>

              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-[#DDE1DC] bg-[#E4E7E4] shadow-xs group">
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
            <div className="border-l-2 border-[#111311] pl-5 sm:pl-6 mb-10 max-w-xl">
              <p className="text-xs sm:text-sm text-[#5C605C] leading-relaxed">
                {isBn
                  ? "যাচাইকৃত টেকনিক্যাল ডেটাশিট, প্রত্যয়িত টায়ার-১ ইঞ্জিনিয়ারিং সরঞ্জাম এবং দীর্ঘমেয়াদী নির্ভরযোগ্যতা ও গ্রাহক সন্তুষ্টির সাথে সারা বাংলাদেশে সরাসরি ফ্যাক্টরি সংগ্রহ সরবরাহ।"
                  : "Direct factory procurement delivered with verified technical datasheets, certified Tier-1 engineering components, and an uncompromising commitment to long-term reliability, efficiency, and customer satisfaction across Bangladesh."}
              </p>
            </div>

            {/* Bottom: 3 Big Bold Statistics */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 border-t border-[#DDE1DC]">
              {/* Stat 1 */}
              <div>
                <div className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-[#111311] font-mono leading-none mb-2">
                  <AnimatedCounter value={8} suffix="+" />
                </div>
                <div className="text-xs sm:text-[13px] font-semibold text-[#111311] leading-tight mb-0.5">
                  {isBn ? "বছরের অভিজ্ঞতা" : "Years in Business"}
                </div>
                <div className="text-[11px] text-[#5C605C] leading-tight">
                  {isBn ? "প্রতিষ্ঠিত অবস্থান" : "Established presence"}
                </div>
              </div>

              {/* Stat 2 */}
              <div>
                <div className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-[#111311] font-mono leading-none mb-2">
                  <AnimatedCounter value={250} suffix="+" />
                </div>
                <div className="text-xs sm:text-[13px] font-semibold text-[#111311] leading-tight mb-0.5">
                  {isBn ? "প্রকল্পে সরঞ্জাম সরবরাহ" : "Projects Supplied"}
                </div>
                <div className="text-[11px] text-[#5C605C] leading-tight">
                  {isBn ? "শিল্প প্রতিষ্ঠান" : "Industrial facilities"}
                </div>
              </div>

              {/* Stat 3 */}
              <div>
                <div className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-[#111311] font-mono leading-none mb-2">
                  <AnimatedCounter value={180} suffix="+" />
                </div>
                <div className="text-xs sm:text-[13px] font-semibold text-[#111311] leading-tight mb-0.5">
                  {isBn ? "সন্তুষ্ট গ্রাহক" : "Happy Clients"}
                </div>
                <div className="text-[11px] text-[#5C605C] leading-tight">
                  {isBn ? "বাণিজ্যিক ক্রেতা" : "Commercial buyers"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
