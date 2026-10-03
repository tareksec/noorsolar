"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Plus,
  Radio,
  Sparkles,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CategoryDockProps {
  categories?: Array<{
    id: string;
    slug: string;
    name: string;
    description?: string | null;
    image?: string | null;
    _count?: { products: number };
  }>;
  locale?: string;
}

interface EquipmentSlide {
  index: string;
  totalIndex: string;
  categoryTitle: string;
  categoryBadge: string;
  monthlyPerformance: string;
  monthlyPerformanceLabel: string;
  utilizationRate: string;
  utilizationLabel: string;
  chartData: Array<{ month: string; barHeight: number; isHighlight?: boolean }>;
  linePoints: string;
  thumbnails: string[];
  heroImage: string;
  link: string;
}

export function CategoryDock({ locale }: CategoryDockProps) {
  const isBn = locale === "bn";
  const [activeSlide, setActiveSlide] = useState(0);

  const slides: EquipmentSlide[] = [
    {
      index: "01",
      totalIndex: "01 / 03",
      categoryTitle: isBn ? "সোলার প্যানেল লাইনআপ" : "Solar Panel Lineup",
      categoryBadge: isBn ? "টায়ার-১ TOPCon মডিউল" : "Tier-1 TOPCon PV Panels",
      monthlyPerformance: "$8,8k",
      monthlyPerformanceLabel: isBn ? "মাসিক উৎপাদন ফলন" : "Monthly performance",
      utilizationRate: "$22,8k",
      utilizationLabel: isBn ? "মোট ইউটিলাইজেশন রেট" : "Total Utilization rate",
      chartData: [
        { month: "Aug", barHeight: 38 },
        { month: "Sep", barHeight: 52 },
        { month: "Oct", barHeight: 74, isHighlight: true },
        { month: "Nov", barHeight: 46 },
        { month: "Dec", barHeight: 32 },
      ],
      linePoints: "16,48 56,36 96,16 136,38 176,52",
      thumbnails: ["/photos/cat-solar-panels.webp", "/photos/core-topic-panel.webp"],
      heroImage: "/photos/solar-3d-station.jpg",
      link: isBn ? "/bn/category/solar-panels" : "/category/solar-panels",
    },
    {
      index: "02",
      totalIndex: "02 / 03",
      categoryTitle: isBn ? "কমার্শিয়াল ইনভার্টার" : "Commercial Inverters",
      categoryBadge: isBn ? "মাল্টি-MPPT গ্রিড টাই" : "Multi-MPPT Hybrid Inverter",
      monthlyPerformance: "$9,4k",
      monthlyPerformanceLabel: isBn ? "মাসিক রূপান্তর ফলন" : "Monthly performance",
      utilizationRate: "$26,4k",
      utilizationLabel: isBn ? "মোট ইউটিলাইজেশন রেট" : "Total Utilization rate",
      chartData: [
        { month: "Aug", barHeight: 42 },
        { month: "Sep", barHeight: 58 },
        { month: "Oct", barHeight: 82, isHighlight: true },
        { month: "Nov", barHeight: 64 },
        { month: "Dec", barHeight: 45 },
      ],
      linePoints: "16,42 56,30 96,12 136,28 176,46",
      thumbnails: ["/photos/cat-solar-inverters.webp", "/photos/core-topic-inverter.webp"],
      heroImage: "/photos/about-commercial-plant.webp",
      link: isBn ? "/bn/category/solar-inverters" : "/category/solar-inverters",
    },
    {
      index: "03",
      totalIndex: "03 / 03",
      categoryTitle: isBn ? "লিথিয়াম ব্যাটারি ESS" : "Lithium ESS Batteries",
      categoryBadge: isBn ? "LiFePO4 ডিপ সাইকেল" : "LiFePO4 Storage System",
      monthlyPerformance: "$7,9k",
      monthlyPerformanceLabel: isBn ? "মাসিক ব্যাকআপ ভ্যালু" : "Monthly performance",
      utilizationRate: "$21,5k",
      utilizationLabel: isBn ? "মোট ইউটিলাইজেশন রেট" : "Total Utilization rate",
      chartData: [
        { month: "Aug", barHeight: 34 },
        { month: "Sep", barHeight: 48 },
        { month: "Oct", barHeight: 68, isHighlight: true },
        { month: "Nov", barHeight: 54 },
        { month: "Dec", barHeight: 40 },
      ],
      linePoints: "16,52 56,40 96,20 136,34 176,50",
      thumbnails: ["/photos/cat-lithium-batteries.webp", "/photos/core-topic-battery.webp"],
      heroImage: "/photos/hero-solar-field.webp",
      link: isBn ? "/bn/category/lithium-batteries" : "/category/lithium-batteries",
    },
  ];

  const currentSlide = slides[activeSlide];

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section
      id="core-lineup"
      className="relative bg-[#FAFAF8] py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#E6E8E2] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto space-y-16 lg:space-y-24">
        {/* ======================================================== */}
        {/* SECTION 1: TOP EXECUTIVE GRID                            */}
        {/* ======================================================== */}
        <div className="space-y-10 lg:space-y-12">
          {/* Section 1 Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            <div className="lg:col-span-8 space-y-4">
              {/* Badge: Why choose us */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#F3F4EE] border border-black/[0.06] text-[#1E2922] text-xs font-semibold">
                <span className="w-5 h-5 rounded-full bg-[#FF6B4A]/15 text-[#FF5429] flex items-center justify-center">
                  <Sparkles className="w-3 h-3 fill-current" />
                </span>
                <span>{isBn ? "কেন আমরা" : "Why choose us"}</span>
              </div>

              {/* Main Headline */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#111713] leading-[1.12]">
                {isBn ? (
                  <>
                    দায়িত্বশীল কর্পোরেট ও{" "}
                    <span className="text-[#108958] inline-block">
                      টেকসই সোলার সল্যুশন
                    </span>
                  </>
                ) : (
                  <>
                    Responsible Corporate with{" "}
                    <span className="text-[#108958] inline-block">
                      Sustainable Solar Solutions
                    </span>
                  </>
                )}
              </h2>

              {/* Left Subtitle & CTA */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4">
                <p className="text-sm text-[#5B675E] max-w-md leading-relaxed">
                  {isBn
                    ? "কার্যকর, বুদ্ধিমান এবং টেকসই সবুজ বিদ্যুতের অভিজ্ঞতা গ্রহণ করুন।"
                    : "Experience power that's efficient, intelligent, and sustainable."}
                </p>
                <Link
                  href={isBn ? "/bn/contact" : "/contact"}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#108958] hover:bg-[#0c6c45] text-white text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-sm hover:shadow-md group/cta w-fit"
                >
                  <span>{isBn ? "শুরু করুন" : "Get started"}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/cta:translate-x-0.5" />
                </Link>
              </div>
            </div>

            {/* Right Header Description */}
            <div className="lg:col-span-4 lg:pt-12">
              <p className="text-xs sm:text-sm text-[#667268] leading-relaxed">
                {isBn
                  ? "শিল্প ও বাণিজ্যিকভাবে দীর্ঘমেয়াদী জ্বালানি নিরাপত্তা দিতে আমরা সর্বোচ্চ মানের অ্যাডভান্সড সৌর সরঞ্জাম সরবরাহ করি।"
                  : "Experience power that's efficient, intelligent, and sustainable. We deliver advanced energy solutions engineered for demanding commercial standards."}
              </p>
            </div>
          </div>

          {/* Section 1: 3-Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {/* Card 1: A Responsible Corporate */}
            <div className="rounded-[32px] bg-white border border-black/[0.06] p-7 sm:p-8 flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.06)] transition-all">
              <div>
                {/* Top Row: Icon & 001 */}
                <div className="flex items-center justify-between mb-8">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B4A] to-[#FF4B26] text-white flex items-center justify-center shadow-md shadow-orange-500/25">
                    <Radio className="w-5 h-5 animate-pulse" />
                  </div>
                  <span className="text-xs font-mono font-medium text-neutral-400 tracking-wider">
                    001
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#121A15] mb-3">
                  {isBn ? "দায়িত্বশীল কর্পোরেট" : "A Responsible Corporate"}
                </h3>

                <p className="text-xs sm:text-sm text-[#647167] leading-relaxed mb-6 font-normal">
                  {isBn
                    ? "বিদ্যুৎ বিল সাশ্রয় করুন, কার্বন নিঃসরণ হ্রাস করুন এবং আপনার বাণিজ্যিক কারখানার টেকসই বাজারমূল্য বৃদ্ধি করুন।"
                    : "Save on your electricity bills, reduce your carbon footprint and increase the value of your commercial & industrial facilities."}
                </p>
              </div>

              {/* Bottom Pill CTA */}
              <div className="pt-4">
                <Link
                  href={isBn ? "/bn/category/solar-panels" : "/category/solar-panels"}
                  className="inline-flex items-center justify-between w-full px-5 py-3 rounded-full bg-[#F5F6F2] hover:bg-[#EDEFEA] text-[#1E2922] text-xs sm:text-sm font-semibold transition-all group/btn border border-black/[0.04]"
                >
                  <span>{isBn ? "বিস্তারিত জানুন" : "Learn more"}</span>
                  <ArrowRight className="w-4 h-4 text-[#5B675E] transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Card 2: Utility-Scale Solution (Hero Photography Card) */}
            <div className="relative rounded-[32px] overflow-hidden min-h-[340px] sm:min-h-[380px] border border-black/[0.06] shadow-[0_10px_30px_rgba(0,0,0,0.04)] group/photo flex flex-col justify-end p-6">
              <Image
                src="/photos/hero-solar-field.webp"
                alt="Utility-scale solar panel installation in sunny landscape"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover/photo:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

              {/* Glassmorphism Floating Tag */}
              <div className="relative z-10 mx-auto">
                <span className="inline-block px-5 py-2.5 rounded-full bg-white/75 backdrop-blur-md border border-white/60 text-[#121A15] text-xs font-semibold tracking-wide shadow-lg">
                  {isBn ? "ইউটিলিটি-স্কেল সল্যুশন" : "Utility-Scale Solution"}
                </span>
              </div>
            </div>

            {/* Card 3: Commercial Solution */}
            <div className="rounded-[32px] bg-[#FAF8F5] border border-[#EBE6DC] p-7 sm:p-8 flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.06)] transition-all">
              <div>
                {/* Top Row: Amber Icon & Panel Thumbnail */}
                <div className="flex items-center justify-between mb-8">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706] text-white flex items-center justify-center shadow-md shadow-amber-500/25">
                    <Zap className="w-5 h-5 fill-current" />
                  </div>
                  <div className="relative w-20 h-14 rounded-2xl overflow-hidden border border-black/[0.08] shadow-2xs">
                    <Image
                      src="/photos/cat-solar-panels.webp"
                      alt="Commercial solar project"
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#121A15] mb-3">
                  {isBn ? "কমার্শিয়াল সল্যুশন" : "Commercial Solution"}
                </h3>

                <p className="text-xs sm:text-sm text-[#647167] leading-relaxed mb-6 font-normal">
                  {isBn
                    ? "ব্যবসার জন্য সুচিন্তিত বিনিয়োগ নিশ্চিত করুন। দীর্ঘমেয়াদী বিদ্যুৎ খরচ হ্রাস করুন ও নির্ভরযোগ্য অপারেশনের সুরক্ষা পান।"
                    : "Make the smart investment and choose solar for your business. Lock in energy rates, demonstrate corporate social responsibility, and power continuous industrial output."}
                </p>
              </div>

              {/* Bottom Pill CTA */}
              <div className="pt-4">
                <Link
                  href={isBn ? "/bn/category/solar-inverters" : "/category/solar-inverters"}
                  className="inline-flex items-center justify-between w-full px-5 py-3 rounded-full bg-white hover:bg-[#F2ECE1] text-[#1E2922] text-xs sm:text-sm font-semibold transition-all group/btn border border-black/[0.04]"
                >
                  <span>{isBn ? "ইনভার্টার ও ব্যাটারি" : "Inverters & Storage"}</span>
                  <ArrowRight className="w-4 h-4 text-[#5B675E] transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 2: PRODUCTION & METRIC CARDS (DARK + LIGHT)      */}
        {/* ======================================================== */}
        <div className="space-y-8 lg:space-y-10">
          {/* Section 2 Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3F4EE] border border-black/[0.06] text-[#1E2922] text-xs font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B4A]" />
                <span>{isBn ? "ইমপ্যাক্টফুল ফ্যাসিলিটিজ" : "Impact full facilities"}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#111713]">
                {isBn
                  ? "শিল্প কারখানায় বিদ্যুৎ উৎপাদন ও নিয়ন্ত্রণ"
                  : "Electricity production in industrial plants"}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-[#667268] max-w-xs md:text-right leading-relaxed">
              {isBn
                ? "জীবাশ্ম জ্বালানি নির্ভরতা কমিয়ে আধুনিক সৌর ও ব্যাটারি এনার্জিতে পূর্ণ উত্তরণ"
                : "transitioning from coal to renewables like wind and solar"}
            </p>
          </div>

          {/* Section 2 Cards: Large Dark Dashboard Card + Light Metric Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* 1. Large Dark Card (Dashboard & Telemetry) */}
            <div className="lg:col-span-8 flex flex-col justify-between">
              <div className="rounded-[32px] bg-[#121614] border border-white/[0.08] p-6 sm:p-8 lg:p-9 text-white shadow-[0_20px_50px_rgba(0,0,0,0.25)] relative overflow-hidden">
                {/* Background Ambient Glow */}
                <div
                  className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#108958]/15 blur-3xl"
                  aria-hidden="true"
                />

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 items-center relative z-10">
                  {/* Left Column: Monthly Performance & Bar Chart */}
                  <div className="sm:col-span-7 space-y-6">
                    {/* Top Stats + Mini Photo Thumbnails */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-neutral-400 font-medium">
                          {currentSlide.monthlyPerformanceLabel}
                        </div>
                        <div className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
                          {currentSlide.monthlyPerformance}
                        </div>
                      </div>

                      {/* Two small photo thumbnails */}
                      <div className="flex items-center gap-2">
                        {currentSlide.thumbnails.map((src, i) => (
                          <div
                            key={i}
                            className="relative w-10 h-10 rounded-xl overflow-hidden border border-white/20 shadow-xs"
                          >
                            <Image
                              src={src}
                              alt="Equipment thumbnail"
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Chart Container (Gradient Bars + Overlay Line Graph) */}
                    <div className="relative pt-6 pb-2">
                      {/* SVG Line Graph Overlay */}
                      <svg
                        className="absolute inset-x-0 top-0 w-full h-24 overflow-visible pointer-events-none z-10"
                        viewBox="0 0 192 64"
                        preserveAspectRatio="none"
                      >
                        <polyline
                          fill="none"
                          stroke="rgba(255, 255, 255, 0.55)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={currentSlide.linePoints}
                        />
                        {/* Dot highlight on peak */}
                        <circle
                          cx="96"
                          cy="16"
                          r="4"
                          className="fill-[#108958] stroke-white stroke-2"
                        />
                      </svg>

                      {/* Bar Columns */}
                      <div className="grid grid-cols-5 gap-3 items-end h-28 pt-6">
                        {currentSlide.chartData.map((bar, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col items-center justify-end h-full gap-2"
                          >
                            <div className="w-full flex justify-center h-full items-end">
                              <motion.div
                                key={`${activeSlide}-${idx}`}
                                initial={{ height: 0 }}
                                animate={{ height: `${bar.barHeight}%` }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className={`w-full max-w-[28px] rounded-lg transition-all ${
                                  bar.isHighlight
                                    ? "bg-gradient-to-t from-[#108958] to-[#22C55E] shadow-[0_0_15px_rgba(34,197,94,0.35)]"
                                    : idx === 0 || idx === 3
                                    ? "bg-gradient-to-t from-[#C25E2E] to-[#E07A48]"
                                    : "bg-neutral-800"
                                }`}
                              />
                            </div>
                            <span className="text-[11px] font-mono text-neutral-400">
                              {bar.month}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Vertical Divider / Stem Connector & Right Column */}
                  <div className="sm:col-span-5 sm:border-l sm:border-neutral-800 sm:pl-8 flex flex-col justify-between h-full pt-4 sm:pt-0">
                    <div>
                      {/* Orange glowing node with vertical line */}
                      <div className="flex flex-col items-start mb-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6B4A] to-[#FF4B26] flex items-center justify-center text-white shadow-md shadow-orange-500/30">
                          <Radio className="w-4 h-4 animate-ping" />
                        </div>
                        <div className="w-0.5 h-6 bg-gradient-to-b from-[#FF6B4A] to-transparent ml-3.5 mt-1" />
                      </div>

                      {/* Slide Index (01) */}
                      <div className="text-4xl sm:text-5xl font-black text-neutral-700/60 font-mono tracking-tighter mb-4">
                        {currentSlide.index}
                      </div>

                      {/* Total Utilization Rate */}
                      <div className="text-xs text-neutral-400 font-medium">
                        {currentSlide.utilizationLabel}
                      </div>
                      <div className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
                        {currentSlide.utilizationRate}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-neutral-800">
                      <Link
                        href={currentSlide.link}
                        className="inline-flex items-center gap-2 text-xs font-semibold text-[#108958] hover:text-[#22C55E] transition-colors"
                      >
                        <span>{currentSlide.categoryTitle}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Slide Controls & Counter directly below dark card */}
              <div className="flex items-center justify-between pt-5 px-3">
                {/* 01 / 06 (or 01 / 03) */}
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-neutral-500">
                  <span className="text-neutral-900">{currentSlide.index}</span>
                  <span className="text-neutral-400">/ 03</span>
                </div>

                {/* Navigation Buttons: < and > */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="Previous slide"
                    className="w-9 h-9 rounded-full bg-white hover:bg-neutral-100 border border-black/[0.08] text-neutral-700 flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Next slide"
                    className="w-9 h-9 rounded-full bg-[#108958] hover:bg-[#0c6c45] text-white flex items-center justify-center transition-all shadow-md shadow-emerald-600/25 cursor-pointer active:scale-95"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Light Metric Card (Right side) */}
            <div className="lg:col-span-4 rounded-[32px] bg-white border border-black/[0.06] p-7 sm:p-8 flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.06)] transition-all min-h-[360px] relative overflow-hidden">
              <div>
                {/* Glowing orange + node with drop line */}
                <div className="flex flex-col items-start mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#FF8A3D] text-white flex items-center justify-center shadow-md shadow-orange-500/25">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div className="w-0.5 h-6 bg-gradient-to-b from-[#FF8A3D] to-transparent ml-3.5 mt-1" />
                </div>

                {/* Curved Solar Architecture Visual */}
                <div className="relative w-full h-36 rounded-2xl overflow-hidden my-4 shadow-sm">
                  <Image
                    src="/photos/solar-3d-station.jpg"
                    alt="Solar architecture and greenery"
                    fill
                    sizes="(max-width: 1024px) 100vw, 30vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Bottom Utilization rate & Watermark '02' */}
              <div className="relative pt-4 flex items-end justify-between">
                <div>
                  <div className="text-xs text-[#647167] font-medium">
                    {isBn ? "মোট ইউটিলাইজেশন রেট" : "Total Utilization rate"}
                  </div>
                  <div className="text-2xl sm:text-3xl font-black tracking-tight text-[#121A15] mt-1">
                    $22,8k
                  </div>
                </div>

                {/* Subtle Watermark 02 */}
                <span className="text-5xl font-black font-mono text-neutral-200/80 leading-none select-none">
                  02
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}