"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";

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

interface EquipmentCard {
  id: string;
  stepNumber: string;
  badge: string;
  title: string;
  tagline: string;
  description: string;
  scopeLabel: string;
  capabilities: string[];
  actionText: string;
  link: string;
  image: string;
  alt: string;
  gradient: string;
  accentBorder: string;
}

const EQUIPMENT_ITEMS_EN: EquipmentCard[] = [
  {
    id: "solar-panels",
    stepNumber: "01",
    badge: "01 / 03 • SOLAR MODULE SUPPLY",
    title: "N-Type TOPCon & Bifacial PV Panels",
    tagline: "High-Yield Tier-1 Solar Modules",
    description:
      "What We Do: Direct manufacturer import and nationwide delivery of high-efficiency monocrystalline solar panels for industrial rooftops, commercial plants, and EPC utility installations.",
    scopeLabel: "Our Core Scope & Supply:",
    capabilities: [
      "Pallet buffer stock in Dhaka to direct 40HQ full container indent",
      "Factory flash test validation & original EL defect-free inspection files",
      "30-year linear performance warranty with certified local replacement support",
    ],
    actionText: "Explore Solar Panels",
    link: "/category/solar-panels",
    image: "/photos/core-topic-panel.webp",
    alt: "N-Type TOPCon high efficiency solar panel module",
    gradient: "linear-gradient(135deg, #FFF8F0 0%, #FFFFFF 52%, #F7F5EE 100%)",
    accentBorder: "rgba(217, 119, 6, 0.25)",
  },
  {
    id: "solar-inverters",
    stepNumber: "02",
    badge: "02 / 03 • POWER CONVERSION SYSTEMS",
    title: "Commercial On-Grid & Hybrid Inverters",
    tagline: "Intelligent Multi-MPPT Grid Integration",
    description:
      "What We Do: Supply and synchronize heavy-duty solar inverters from 5kW to 100kW+, ensuring high conversion efficiency, grid stability, and continuous industrial power continuity.",
    scopeLabel: "Our Core Scope & Supply:",
    capabilities: [
      "Multi-channel MPPT tracking with 98.6%+ high-efficiency conversion",
      "IP66 weatherproof outdoor enclosures engineered for extreme climates",
      "24/7 cloud remote monitoring, smart BMS handshake & telemetry apps",
    ],
    actionText: "Explore Solar Inverters",
    link: "/category/solar-inverters",
    image: "/photos/core-topic-inverter.webp",
    alt: "Commercial hybrid solar inverter unit",
    gradient: "linear-gradient(135deg, #F0F8FF 0%, #FFFFFF 52%, #EEF6F4 100%)",
    accentBorder: "rgba(2, 132, 199, 0.25)",
  },
  {
    id: "lithium-batteries",
    stepNumber: "03",
    badge: "03 / 03 • ENERGY STORAGE SYSTEMS",
    title: "LiFePO4 Industrial Battery Storage",
    tagline: "Zero-Downtime Backup & Peak Shaving",
    description:
      "What We Do: Engineering and supply of Grade-A lithium iron phosphate rack batteries and scalable ESS units designed for 6,000+ deep cycles and uninterrupted factory power.",
    scopeLabel: "Our Core Scope & Supply:",
    capabilities: [
      "Grade-A prismatic cells rated for 6,000+ cycles at 80% DoD",
      "Integrated smart BMS with multi-tier thermal & over-voltage protection",
      "Modular scalability from 5.12 kWh rack cabinets to containerized ESS",
    ],
    actionText: "Explore Energy Storage",
    link: "/category/lithium-batteries",
    image: "/photos/core-topic-battery.webp",
    alt: "LiFePO4 lithium energy storage rack system",
    gradient: "linear-gradient(135deg, #FEFCE8 0%, #FFFFFF 52%, #F5F4EE 100%)",
    accentBorder: "rgba(202, 138, 4, 0.25)",
  },
];

const EQUIPMENT_ITEMS_BN: EquipmentCard[] = [
  {
    id: "solar-panels",
    stepNumber: "০১",
    badge: "০১ / ০৩ • সোলার মডিউল সাপ্লাই",
    title: "এন-টাইপ TOPCon ও বাইফেসিয়াল প্যানেল",
    tagline: "টায়ার-১ হাই-আউটপুট সোলার মডিউল",
    description:
      "আমরা যা করি: বাণিজ্যিক কারখানা, টেক্সটাইল রুফটপ ও সোলার প্রজেক্টের জন্য সরাসরি প্রস্তুতকারক থেকে উচ্চ-দক্ষতাসম্পন্ন টায়ার-১ সোলার প্যানেল আমদানি ও সাইট-ডেলিভারি নিশ্চিত করি।",
    scopeLabel: "আমাদের কাজের পরিধি:",
    capabilities: [
      "ঢাকা ডিপো বাফার স্টক থেকে শুরু করে সরাসরি ৪০HQ ফুল কন্টেইনার ইনডেন্ট",
      "প্রতিটি ব্যাচে ফ্যাক্টরি সান-সিমুলেটর টেস্ট ও অরিজিনাল EL ক্র্যাক স্ক্যান রিপোর্ট",
      "৩০ বছরের রৈখিক পারফরম্যান্স ওয়ারেন্টি ও দ্রুত লোকাল ক্লেইম সাপোর্ট",
    ],
    actionText: "সোলার প্যানেল দেখুন",
    link: "/bn/category/solar-panels",
    image: "/photos/core-topic-panel.webp",
    alt: "এন-টাইপ TOPCon সোলার প্যানেল",
    gradient: "linear-gradient(135deg, #FFF8F0 0%, #FFFFFF 52%, #F7F5EE 100%)",
    accentBorder: "rgba(217, 119, 6, 0.25)",
  },
  {
    id: "solar-inverters",
    stepNumber: "০২",
    badge: "০২ / ০৩ • পাওয়ার কনভার্শন সিস্টেম",
    title: "কমার্শিয়াল অন-গ্রিড ও হাইব্রিড ইনভার্টার",
    tagline: "ইন্টেলিজেন্ট মাল্টি-MPPT গ্রিড টাই",
    description:
      "আমরা যা করি: শিল্প কারখানার নিরবচ্ছিন্ন উৎপাদন ও গ্রিড সিঙ্ক্রোনাইজেশনের জন্য ৫kW থেকে ১০০kW+ ইন্টেলিজেন্ট মাল্টি-MPPT ইনভার্টার সরবরাহ ও সিস্টেম সমন্বয় করি।",
    scopeLabel: "আমাদের কাজের পরিধি:",
    capabilities: [
      "মাল্টি-চ্যানেল MPPT ট্র্যাকিং ও ৯৮.৬%+ পিক কনভার্শন এফিসিয়েন্সি",
      "হেভি-ডিউটি IP66 ওয়েদারপ্রুফ সুরক্ষা ও ইন্ডাস্ট্রিয়াল থার্মাল কুলিং",
      "মোবাইল অ্যাপ ও সার্বক্ষণিক ২৪/৭ রিয়েল-টাইম ক্লাউড মনিটরিং সাপোর্ট",
    ],
    actionText: "সোলার ইনভার্টার দেখুন",
    link: "/bn/category/solar-inverters",
    image: "/photos/core-topic-inverter.webp",
    alt: "কমার্শিয়াল সোলার ইনভার্টার ইউনিট",
    gradient: "linear-gradient(135deg, #F0F8FF 0%, #FFFFFF 52%, #EEF6F4 100%)",
    accentBorder: "rgba(2, 132, 199, 0.25)",
  },
  {
    id: "lithium-batteries",
    stepNumber: "০৩",
    badge: "০৩ / ০৩ • এনার্জি স্টোরেজ সল্যুশন",
    title: "LiFePO4 ইন্ডাস্ট্রিয়াল ব্যাটারি স্টোরেজ",
    tagline: "নিরবচ্ছিন্ন ব্যাকআপ ও পিক শেভিং",
    description:
      "আমরা যা করি: বিদ্যুৎ বিভ্রাট ও পিক-আওয়ারে নিরবচ্ছিন্ন বিদ্যুৎ নিশ্চিত করতে এ-গ্রেড প্রিজম্যাটিক সেল ও স্মার্ট BMS সমৃদ্ধ ৬,০০০+ সাইকেলের লিথিয়াম স্টোরেজ সরবরাহ করি।",
    scopeLabel: "আমাদের কাজের পরিধি:",
    capabilities: [
      "এ-গ্রেড প্রিজম্যাটিক সেল এবং ৬,০০০+ সাইকেল ডিপ ডিসচার্জ লাইফ",
      "ইন্টিগ্রেটেড স্মার্ট BMS ওভার-ভোল্টেজ ও সেল ব্যালেন্সিং সুরক্ষা",
      "৫.১২kWh থেকে মেগাওয়াট স্কেল পর্যন্ত এক্সপ্যান্ডেবল র্যাক আর্কিটেকচার",
    ],
    actionText: "ব্যাটারি স্টোরেজ দেখুন",
    link: "/bn/category/lithium-batteries",
    image: "/photos/core-topic-battery.webp",
    alt: "LiFePO4 ব্যাটারি স্টোরেজ",
    gradient: "linear-gradient(135deg, #FEFCE8 0%, #FFFFFF 52%, #F5F4EE 100%)",
    accentBorder: "rgba(202, 138, 4, 0.25)",
  },
];

export function CategoryDock({ locale }: CategoryDockProps) {
  const isBn = locale === "bn";
  const equipmentItems = isBn ? EQUIPMENT_ITEMS_BN : EQUIPMENT_ITEMS_EN;
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [activeStep, setActiveStep] = useState(0);

  // Sticky Scroll: Section spans 320vh for calm, luxurious pacing
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Unified master spring for buttery-smooth 60fps/120fps motion
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    mass: 0.35,
    restDelta: 0.0001,
  });

  useMotionValueEvent(smoothProgress, "change", (latest) => {
    if (latest < 0.35) {
      setActiveStep(0);
    } else if (latest < 0.68) {
      setActiveStep(1);
    } else {
      setActiveStep(2);
    }
  });

  // Card 1: Front at start -> gently eases back and recesses as Card 2 arrives
  const card1Y = useTransform(smoothProgress, [0, 0.28, 0.48], [0, 0, -20]);
  const card1Scale = useTransform(smoothProgress, [0, 0.28, 0.48], [1, 1, 0.94]);
  const card1Opacity = useTransform(smoothProgress, [0, 0.28, 0.48, 0.72], [1, 1, 0.38, 0.15]);

  // Card 2: Starts below -> glides up into front -> rests -> gently recesses as Card 3 arrives
  const card2Y = useTransform(smoothProgress, [0.18, 0.44, 0.62, 0.80], [220, 0, 0, -10]);
  const card2Scale = useTransform(smoothProgress, [0.18, 0.44, 0.62, 0.80], [0.90, 1, 1, 0.97]);
  const card2Opacity = useTransform(smoothProgress, [0.15, 0.35, 0.62, 0.80], [0, 1, 1, 0.38]);

  // Card 3: Starts below -> glides up into front -> stays in front
  const card3Y = useTransform(smoothProgress, [0.52, 0.78, 1], [220, 0, 0]);
  const card3Scale = useTransform(smoothProgress, [0.52, 0.78, 1], [0.90, 1, 1]);
  const card3Opacity = useTransform(smoothProgress, [0.48, 0.70, 1], [0, 1, 1]);

  // Click on step dots or arrows to scroll directly to that position
  const scrollToStep = (step: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY + rect.top;
    const maxScroll = containerRef.current.offsetHeight - window.innerHeight;
    const targetScroll = scrollTop + (step / 2) * maxScroll;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  const cardMotionProps = [
    {
      style: {
        y: shouldReduceMotion ? 0 : card1Y,
        scale: shouldReduceMotion ? 1 : card1Scale,
        opacity: shouldReduceMotion ? 1 : card1Opacity,
        zIndex: 10,
        willChange: "transform, opacity",
      },
    },
    {
      style: {
        y: shouldReduceMotion ? 0 : card2Y,
        scale: shouldReduceMotion ? 1 : card2Scale,
        opacity: shouldReduceMotion ? 1 : card2Opacity,
        zIndex: 20,
        willChange: "transform, opacity",
      },
    },
    {
      style: {
        y: shouldReduceMotion ? 0 : card3Y,
        scale: shouldReduceMotion ? 1 : card3Scale,
        opacity: shouldReduceMotion ? 1 : card3Opacity,
        zIndex: 30,
        willChange: "transform, opacity",
      },
    },
  ];

  return (
    <section
      id="core-lineup"
      ref={containerRef}
      className="relative bg-[#EAECE6] border-b border-[#D4DCD2]"
      style={{ height: "320vh" }}
    >
      {/* Sticky 100vh Viewport Window */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between py-6 sm:py-8 lg:py-10 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden">
        {/* Background Architectural Grid Pattern */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(#074031_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.05]"
          aria-hidden="true"
        />

        {/* 1. Header Section */}
        <div className="text-center max-w-3xl mx-auto px-4 shrink-0 z-10">
          <div className="inline-flex items-center justify-center gap-3 text-xs sm:text-sm font-semibold tracking-wider text-[#074031] uppercase mb-2">
            <span className="w-8 sm:w-12 h-[1.5px] bg-[#074031]/40 rounded-full" />
            <span className="px-3.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#074031]/20 font-mono text-[11px] sm:text-xs text-[#074031] shadow-2xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#074031] animate-pulse" />
              {isBn ? "কোর ইকুইপমেন্ট লাইনআপ" : "Core Equipment Lineup"}
            </span>
            <span className="w-8 sm:w-12 h-[1.5px] bg-[#074031]/40 rounded-full" />
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#142019] leading-tight">
            {isBn ? (
              <>
                বাণিজ্যিক প্রজেক্টের জন্য{" "}
                <span className="text-[#074031] relative inline-block">
                  ইঞ্জিনিয়ারিং-গ্রেড ইকুইপমেন্ট
                </span>
              </>
            ) : (
              <>
                Commercial & Industrial{" "}
                <span className="text-[#074031] relative inline-block">
                  Equipment Lineup
                </span>
              </>
            )}
          </h2>

          <p className="mt-1.5 text-xs sm:text-sm text-[#556350] max-w-xl mx-auto leading-relaxed hidden sm:block">
            {isBn
              ? "নিচে স্ক্রোল করুন — ৩টি প্রধান ইকুইপমেন্ট চ্যানেলের বিস্তারিত ও আমাদের কাজের পরিধি এক নজরে দেখুন।"
              : "Scroll down to see our primary supply channels and scope of work animate onto the stage."}
          </p>
        </div>

        {/* 2. Stacked Cards Canvas */}
        <div className="relative w-full max-w-4xl lg:max-w-5xl h-[480px] sm:h-[500px] lg:h-[520px] mx-auto flex items-center justify-center my-auto">
          {equipmentItems.map((item, idx) => {
            const motionProps = cardMotionProps[idx];
            const isStepActive = activeStep === idx;

            return (
              <motion.div
                key={item.id}
                style={motionProps.style}
                className="absolute inset-0 w-full h-full rounded-[32px] sm:rounded-[36px] lg:rounded-[40px] border border-white/95 shadow-[0_30px_70px_-15px_rgba(7,64,49,0.18),0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden"
              >
                {/* Individual Card Surface */}
                <div
                  className="relative w-full h-full p-6 sm:p-8 lg:p-10 flex flex-col justify-between"
                  style={{ background: item.gradient }}
                >
                  {/* Subtle Background Radial Ambient Glow */}
                  <div
                    className="pointer-events-none absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/60 blur-3xl"
                    aria-hidden="true"
                  />

                  {/* 2-Column Split: Content & Capabilities (Left) + Large 3D Visual (Right) */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 h-full items-center">
                    {/* Left Column: What We Do & Scope */}
                    <div className="md:col-span-7 flex flex-col justify-between h-full z-10">
                      <div>
                        {/* Top Step & Category Badge */}
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#074031]/[0.08] text-[#074031] font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#074031] animate-pulse" />
                            {item.badge}
                          </div>
                          <span className="text-[11px] font-mono font-semibold text-[#556350] bg-black/[0.04] px-2.5 py-0.5 rounded-full">
                            CAT #{item.stepNumber}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl sm:text-2xl lg:text-[28px] font-black tracking-tight text-[#142019] leading-tight">
                          {item.title}
                        </h3>

                        {/* What We Do Text */}
                        <p className="text-xs sm:text-[13.5px] text-[#4A5748] leading-relaxed mt-2.5 font-normal">
                          {item.description}
                        </p>

                        {/* Scope of Work / Capabilities Checklist */}
                        <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-black/[0.06]">
                          <div className="text-[11px] font-mono font-bold tracking-wider text-[#074031] uppercase mb-2">
                            {item.scopeLabel}
                          </div>
                          <div className="space-y-1.5 sm:space-y-2">
                            {item.capabilities.map((cap, cIdx) => (
                              <div
                                key={cIdx}
                                className="flex items-start gap-2.5 text-xs sm:text-[13px] text-[#243329] font-medium leading-snug"
                              >
                                <CheckCircle2 className="w-4 h-4 text-[#074031] shrink-0 mt-0.5" />
                                <span>{cap}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Action CTA Button */}
                      <div className="pt-4 mt-auto">
                        <Link
                          href={item.link}
                          className="inline-flex items-center justify-between gap-4 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#074031] hover:bg-[#052F25] text-white text-xs sm:text-[13.5px] font-semibold tracking-wide transition-all shadow-sm hover:shadow-md group/btn"
                        >
                          <span>{item.actionText}</span>
                          <span className="w-6 h-6 rounded-full bg-white/20 group-hover/btn:bg-white/30 flex items-center justify-center transition-all group-hover/btn:translate-x-0.5">
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </Link>
                      </div>
                    </div>

                    {/* Right Column: High-Impact 3D Product Image */}
                    <div className="md:col-span-5 relative h-full flex items-center justify-center">
                      <div className="relative w-full h-[180px] sm:h-[240px] md:h-[280px] lg:h-[320px] flex items-center justify-center">
                        {/* Soft Ambient Spotlight behind asset */}
                        <div
                          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.9),transparent_65%)] pointer-events-none"
                          aria-hidden="true"
                        />
                        <Image
                          src={item.image}
                          alt={item.alt}
                          fill
                          priority={idx === 0}
                          sizes="(max-width: 768px) 300px, (max-width: 1200px) 420px, 460px"
                          className="object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.14)] transition-transform duration-700 hover:scale-105"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 3. Bottom Interactive Scroll Indicator & Step Controls */}
        <div className="shrink-0 flex items-center justify-between max-w-4xl lg:max-w-5xl w-full mx-auto px-4 z-20">
          {/* Step Badges (Clickable to jump) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {equipmentItems.map((item, idx) => {
              const isActive = activeStep === idx;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToStep(idx)}
                  className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-[#074031] text-white shadow-sm scale-105"
                      : "bg-white/80 text-[#556350] hover:bg-white border border-[#DCE4DA]"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isActive ? "bg-[#FEBE16]" : "bg-[#074031]/30"
                    }`}
                  />
                  <span>
                    {isBn
                      ? idx === 0
                        ? "সোলার প্যানেল"
                        : idx === 1
                        ? "ইনভার্টার"
                        : "ব্যাটারি"
                      : idx === 0
                      ? "01 Panels"
                      : idx === 1
                      ? "02 Inverters"
                      : "03 Batteries"}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Smooth Scroll Progress Bar */}
          <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/85 backdrop-blur-xs border border-[#DCE4DA]">
            <span className="text-[11px] font-mono text-[#556350] font-bold tracking-wider">
              {activeStep === 0 ? "01 / 03" : activeStep === 1 ? "02 / 03" : "03 / 03"}
            </span>
            <div className="w-20 lg:w-28 h-1.5 rounded-full bg-[#074031]/15 overflow-hidden">
              <motion.div
                style={{ scaleX: smoothProgress, transformOrigin: "left" }}
                className="w-full h-full bg-[#074031] rounded-full"
              />
            </div>
          </div>

          {/* Up / Down Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous card step"
              onClick={() => scrollToStep(Math.max(0, activeStep - 1))}
              disabled={activeStep === 0}
              className="w-9 h-9 rounded-full bg-white border border-[#DCE4DA] text-[#074031] hover:bg-[#074031] hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#074031] flex items-center justify-center transition-all shadow-xs cursor-pointer"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label="Next card step"
              onClick={() => scrollToStep(Math.min(2, activeStep + 1))}
              disabled={activeStep === 2}
              className="w-9 h-9 rounded-full bg-white border border-[#DCE4DA] text-[#074031] hover:bg-[#074031] hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#074031] flex items-center justify-center transition-all shadow-xs cursor-pointer"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}