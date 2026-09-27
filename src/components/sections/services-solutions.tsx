"use client";

import React, { useRef, useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Grid3X3,
  Cpu,
  Layers,
  Activity,
  Shield,
  Battery,
  BatteryCharging,
  RefreshCw,
  Thermometer,
  Sun,
  type LucideIcon,
} from "lucide-react";
import { AppImage } from "@/components/ui/app-image";

/* ------------------------------------------------------------------ */
/*  Data Structure                                                     */
/* ------------------------------------------------------------------ */

interface SpecItem {
  icon: LucideIcon;
  label: string;
  val: string;
}

interface ProvideItem {
  id: string;
  number: string;
  stepNum: number;
  code: string;
  badge: string;
  icon: LucideIcon;
  title: string;
  description: string;
  specs: SpecItem[];
  imageUrl: string;
  imageAlt: string;
  link: string;
  watermark: string;
  displayChar: string;
}

const ITEMS_EN: ProvideItem[] = [
  {
    id: "solar-panels",
    number: "01",
    stepNum: 1,
    code: "PV-MOD // 01",
    badge: "30-YEAR WARRANTY",
    icon: Sun,
    title: "TOPCon Solar Panels",
    description:
      "Engineered with advanced TOPCon technology for ultra-high conversion efficiency and multi-decade commercial durability.",
    specs: [
      { icon: Zap, label: "Max Efficiency", val: "22.5%+" },
      { icon: ShieldCheck, label: "Warranty", val: "12–25 Yrs" },
      { icon: Grid3X3, label: "Cell Type", val: "N-Type TOPCon" },
      { icon: Cpu, label: "Power Range", val: "580–720 Wp" },
    ],
    imageUrl: "/photos/cat-solar-panels.webp",
    imageAlt: "Tier-1 N-Type TOPCon solar panels ready for wholesale supply",
    link: "/category/solar-panels",
    watermark: "PV",
    displayChar: "01",
  },
  {
    id: "solar-inverters",
    number: "02",
    stepNum: 2,
    code: "INV-PWR // 02",
    badge: "98.6% EFFICIENCY",
    icon: Cpu,
    title: "Commercial Multi-MPPT Inverters",
    description:
      "High-efficiency multi-MPPT solar inverters engineered for continuous uptime in large-scale commercial & industrial facilities.",
    specs: [
      { icon: Zap, label: "Efficiency", val: "98%+" },
      { icon: Layers, label: "MPPT Channels", val: "4–8" },
      { icon: Activity, label: "Output Power", val: "10 kW – 250 kW" },
      { icon: Shield, label: "Protection", val: "IP65 / IP66" },
    ],
    imageUrl: "/photos/cat-solar-inverters.webp",
    imageAlt: "Commercial multi-MPPT solar inverters for industrial projects",
    link: "/category/solar-inverters",
    watermark: "INV",
    displayChar: "02",
  },
  {
    id: "lithium-batteries",
    number: "03",
    stepNum: 3,
    code: "ESS-BAT // 03",
    badge: "6,000+ CYCLES",
    icon: BatteryCharging,
    title: "LiFePO4 Industrial Storage (ESS)",
    description:
      "Safe, durable, high-capacity LiFePO4 battery energy storage systems tailored for zero-downtime industrial backup.",
    specs: [
      { icon: Battery, label: "Battery Capacity", val: "50 kWh – 5 MWh" },
      { icon: RefreshCw, label: "Cycle Life", val: "6000+" },
      { icon: ShieldCheck, label: "Safety", val: "LiFePO4" },
      { icon: Thermometer, label: "Operating Temp", val: "-20°C – 60°C" },
    ],
    imageUrl: "/photos/cat-lithium-batteries.webp",
    imageAlt: "LiFePO4 industrial battery racks for energy storage systems",
    link: "/category/lithium-batteries",
    watermark: "ESS",
    displayChar: "03",
  },
];

const ITEMS_BN: ProvideItem[] = [
  {
    id: "solar-panels",
    number: "০১",
    stepNum: 1,
    code: "সোলার মডিউল // ০১",
    badge: "৩০ বছরের ওয়ারেন্টি",
    icon: Sun,
    title: "TOPCon সোলার প্যানেল",
    description:
      "উচ্চ দক্ষতা ও দীর্ঘস্থায়ী পারফরম্যান্সের জন্য আধুনিক TOPCon প্রযুক্তির সোলার প্যানেল সরবরাহ করি।",
    specs: [
      { icon: Zap, label: "সর্বোচ্চ দক্ষতা", val: "22.5%+" },
      { icon: ShieldCheck, label: "ওয়ারেন্টি", val: "১২–২৫ বছর" },
      { icon: Grid3X3, label: "সেল টাইপ", val: "N-Type TOPCon" },
      { icon: Cpu, label: "পাওয়ার রেঞ্জ", val: "580–720 Wp" },
    ],
    imageUrl: "/photos/cat-solar-panels.webp",
    imageAlt: "পাইকারি সরবরাহের জন্য প্রস্তুত টায়ার-১ সোলার প্যানেল",
    link: "/category/solar-panels",
    watermark: "PV",
    displayChar: "০১",
  },
  {
    id: "solar-inverters",
    number: "০২",
    stepNum: 2,
    code: "ইনভার্টার সিস্টেম // ০২",
    badge: "৯৮.৬% এফিসিয়েন্সি",
    icon: Cpu,
    title: "কমার্শিয়াল মাল্টি-MPPT সোলার ইনভার্টার",
    description:
      "বড় আকারের বাণিজ্যিক ও শিল্প স্থাপনার জন্য উচ্চ দক্ষতা সম্পন্ন মাল্টি-MPPT সোলার ইনভার্টার সরবরাহ করি।",
    specs: [
      { icon: Zap, label: "দক্ষতা", val: "98%+" },
      { icon: Layers, label: "MPPT চ্যানেল", val: "৪–৮" },
      { icon: Activity, label: "আউটপুট পাওয়ার", val: "10 kW – 250 kW" },
      { icon: Shield, label: "প্রোটেকশন", val: "IP65 / IP66" },
    ],
    imageUrl: "/photos/cat-solar-inverters.webp",
    imageAlt: "শিল্প প্রকল্পের জন্য কমার্শিয়াল মাল্টি-MPPT সোলার ইনভার্টার",
    link: "/category/solar-inverters",
    watermark: "INV",
    displayChar: "০২",
  },
  {
    id: "lithium-batteries",
    number: "০৩",
    stepNum: 3,
    code: "স্টোরেজ ESS // ০৩",
    badge: "৬,০০০+ সাইকেল",
    icon: BatteryCharging,
    title: "LiFePO4 ইন্ডাস্ট্রিয়াল এনার্জি স্টোরেজ (ESS)",
    description:
      "শিল্প ও বাণিজ্যিক স্থাপনার জন্য নিরাপদ, দীর্ঘস্থায়ী এবং উচ্চক্ষমতার LiFePO4 ব্যাটারি ভিত্তিক এনার্জি স্টোরেজ সিস্টেম।",
    specs: [
      { icon: Battery, label: "ব্যাটারি ক্যাপাসিটি", val: "50 kWh – 5 MWh" },
      { icon: RefreshCw, label: "সাইকেল লাইফ", val: "6000+" },
      { icon: ShieldCheck, label: "সেফটি", val: "LiFePO4" },
      { icon: Thermometer, label: "অপারেটিং তাপমাত্রা", val: "-20°C – 60°C" },
    ],
    imageUrl: "/photos/cat-lithium-batteries.webp",
    imageAlt: "এনার্জি স্টোরেজ সিস্টেমের জন্য LiFePO4 ইন্ডাস্ট্রিয়াল ব্যাটারি",
    link: "/category/lithium-batteries",
    watermark: "ESS",
    displayChar: "০৩",
  },
];

/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/*  Desktop Skiper-104 Animated Card Component                        */
/* ------------------------------------------------------------------ */

interface Skiper104CardProps {
  item: ProvideItem;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  activeStep: number;
  isBn: boolean;
}

function Skiper104DesktopCard({
  item,
  index,
  total,
  scrollYProgress,
  activeStep,
  isBn,
}: Skiper104CardProps) {
  const IconComponent = item.icon;

  // Stagger intervals across scroll:
  // Card 0: starts visible so there is never an empty screen!
  // Card 1: animates in between scroll 0.18 and 0.48
  // Card 2: animates in between scroll 0.52 and 0.82
  const start = index === 0 ? 0 : index === 1 ? 0.18 : 0.52;
  const end = index === 0 ? 0.2 : index === 1 ? 0.48 : 0.82;

  const progressRatio = (progress: number) => {
    if (index === 0) return 1;
    if (progress >= end) return 1;
    if (progress <= start) return 0.25; // Subtle preview opacity so cards aren't missing
    return 0.25 + 0.75 * ((progress - start) / (end - start));
  };

  const yImage = useTransform(scrollYProgress, (p) => {
    if (index === 0) return 0;
    const r = progressRatio(p);
    return 28 * (1 - r);
  });

  const yText = useTransform(scrollYProgress, (p) => {
    if (index === 0) return 0;
    const r = progressRatio(p);
    return -28 * (1 - r);
  });

  const scaleBadge = useTransform(scrollYProgress, (p) => {
    if (index === 0) return 1;
    const r = progressRatio(p);
    return 0.85 + 0.25 * r;
  });

  const opacity = useTransform(scrollYProgress, (p) => {
    return progressRatio(p);
  });

  const isCurrentStep = activeStep === index;
  const isPastStep = activeStep > index;

  return (
    <div className="relative z-10 flex flex-col gap-3.5 xl:gap-4 group/card">
      {/* 1. Top Content Card */}
      <motion.div
        style={{ y: yText, opacity }}
        className={`flex flex-col h-[185px] xl:h-[195px] justify-between rounded-2xl bg-white dark:bg-[#131915] border p-4 xl:p-5 shadow-[0_4px_24px_rgba(7,64,49,0.06)] transition-all ${
          isCurrentStep
            ? "border-[#108958] dark:border-[#22C55E]/50 shadow-[0_8px_30px_rgba(7,64,49,0.12)] ring-1 ring-[#108958]/20"
            : "border-[#E2E8DF] dark:border-white/10 hover:border-[#108958]/30"
        }`}
      >
        <div>
          {/* Header Row: Icon + Title */}
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`w-9 h-9 xl:w-10 xl:h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                isCurrentStep
                  ? "bg-[#108958] text-white"
                  : "bg-[#E8F5E9] dark:bg-[#108958]/20 text-[#108958] dark:text-[#22C55E]"
              }`}
            >
              <IconComponent className="w-4 h-4 xl:w-5 xl:h-5 stroke-[2.2]" />
            </div>
            <h3 className="text-sm xl:text-base font-bold text-[#074031] dark:text-white leading-snug line-clamp-1">
              {item.title}
            </h3>
          </div>

          {/* Description */}
          <p className="text-[11px] xl:text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* 4 Technical Specs Micro-Grid with Icons */}
        <div className="pt-2 border-t border-neutral-100 dark:border-white/10 grid grid-cols-4 gap-1 text-center">
          {item.specs.map((sp, i) => {
            const SpecIcon = sp.icon;
            return (
              <div key={i} className="flex flex-col items-center">
                <SpecIcon className="w-3.5 h-3.5 text-[#108958] dark:text-[#22C55E] mb-0.5" />
                <span className="text-[9px] text-neutral-500 dark:text-neutral-400 font-medium truncate w-full">
                  {sp.label}
                </span>
                <span className="text-[10px] xl:text-[11px] font-bold text-neutral-900 dark:text-white truncate w-full mt-0.5">
                  {sp.val}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* 2. Step Badge (On Timeline) */}
      <div className="relative flex items-center justify-center h-8">
        <motion.div
          style={{ scale: scaleBadge }}
          className={`z-10 flex size-8 items-center justify-center rounded-lg font-mono text-xs font-bold shadow-md transition-all ${
            isCurrentStep || isPastStep
              ? "bg-[#074031] dark:bg-[#108958] text-[#FEBE16] dark:text-white border border-[#FEBE16] shadow-[0_0_12px_rgba(254,190,22,0.35)]"
              : "bg-white dark:bg-[#131915] text-neutral-400 dark:text-neutral-500 border border-neutral-300 dark:border-white/20"
          }`}
        >
          {item.stepNum}
        </motion.div>
      </div>

      {/* 3. Bottom Visual Showcase + CTA */}
      <motion.div
        style={{ y: yImage, opacity }}
        className="flex flex-col gap-2.5 xl:gap-3"
      >
        <div
          className={`group/img relative flex h-40 xl:h-48 w-full items-center justify-center rounded-2xl overflow-hidden bg-white dark:bg-[#131915] border shadow-[0_4px_24px_rgba(7,64,49,0.06)] transition-all ${
            isCurrentStep
              ? "border-[#108958] dark:border-[#22C55E]/50 shadow-[0_8px_30px_rgba(7,64,49,0.12)]"
              : "border-[#E2E8DF] dark:border-white/10"
          }`}
        >
          {/* Background Watermark Lettering */}
          <span
            className="absolute -top-2 -left-2 font-mono font-black italic text-[95px] xl:text-[115px] text-[#074031]/5 dark:text-white/5 select-none pointer-events-none leading-none z-0"
            aria-hidden="true"
          >
            {item.watermark}
          </span>

          {/* Product Image */}
          <AppImage
            src={item.imageUrl}
            alt={item.imageAlt}
            fill
            sizes="(max-width: 1280px) 33vw, 400px"
            className="object-cover transition-transform duration-700 group-hover/img:scale-105"
            priority={index === 0}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none" />

          {/* Corner Crosshairs */}
          <span
            className="absolute top-2.5 left-2.5 z-10 font-mono text-[9px] text-[#FEBE16]/80 select-none"
            aria-hidden="true"
          >
            +
          </span>
          <span
            className="absolute top-2.5 right-12 z-10 font-mono text-[9px] text-[#FEBE16]/80 select-none"
            aria-hidden="true"
          >
            +
          </span>

          {/* Direct Stock Badge */}
          <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-mono font-bold text-white">
            <CheckCircle2 className="w-3 h-3 text-[#22C55E]" />
            <span>{isBn ? "প্রস্তুত স্টক" : "DIRECT STOCK"}</span>
          </div>

          {/* Stylized Typography Overlay */}
          <div className="absolute bottom-2.5 left-2.5 z-10 flex items-baseline gap-2">
            <span className="font-mono text-2xl xl:text-3xl text-white font-bold tracking-tight drop-shadow-md">
              {item.displayChar}
            </span>
            <span className="font-mono text-[9px] xl:text-[10px] font-semibold text-white/90 uppercase tracking-widest bg-black/50 px-2 py-0.5 rounded backdrop-blur-xs border border-white/10">
              {item.code}
            </span>
          </div>
        </div>

        {/* CTA Link */}
        <Link
          href={item.link}
          className="inline-flex items-center justify-between w-full px-3.5 py-2 rounded-xl bg-[#074031] dark:bg-[#108958] text-white font-bold text-xs hover:bg-[#0B513E] dark:hover:bg-[#0E7A4E] transition-colors min-h-[38px] shadow-xs group/cta"
        >
          <span>
            {isBn
              ? "ক্যাটালগ ও স্পেসিফিকেশন দেখুন"
              : "View Specifications & Stock"}
          </span>
          <ArrowRight className="w-4 h-4 ml-2 transition-transform text-[#FEBE16] group-hover/cta:translate-x-1" />
        </Link>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main ServicesSolutions Component                                   */
/* ------------------------------------------------------------------ */

interface ServicesSolutionsProps {
  locale?: string;
}

export function ServicesSolutions({ locale }: ServicesSolutionsProps = {}) {
  const pathname = usePathname() || "";
  const isBn =
    locale === "bn" || pathname.startsWith("/bn/") || pathname === "/bn";
  const items = isBn ? ITEMS_BN : ITEMS_EN;

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      if (latest < 0.35) {
        setActiveStep(0);
      } else if (latest < 0.70) {
        setActiveStep(1);
      } else {
        setActiveStep(2);
      }
    });
  }, [scrollYProgress]);

  // Brand progress line that expands across step 1 -> step 2 -> step 3
  const lineWidth = useTransform(scrollYProgress, [0, 1], ["20%", "100%"]);

  return (
    <section
      id="services-solutions"
      aria-label="We Provide - Core Supply Lineup"
      className="relative w-full bg-[#F8F9F5] dark:bg-[#0B0F0D] border-y border-[#E2E8DF] dark:border-white/10"
    >
      {/* Background Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20 z-0"
        aria-hidden="true"
      >
        <div className="w-full h-full bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* ============================================================ */}
      {/* DESKTOP SKIPER-104 (Interactive Scroll-Driven Animation)     */}
      {/* ============================================================ */}
      <div className="hidden lg:block relative z-10 w-full">
        {/* Scroll Track: 230vh gives smooth, deliberate animation without feeling stuck */}
        <div ref={containerRef} className="h-[230vh] w-full relative">
          {/* Sticky Viewport Container - compact sizing fits perfectly inside laptop viewports */}
          <div className="sticky top-0 h-screen w-full flex flex-col justify-center max-w-7xl mx-auto px-6 lg:px-8 py-4 xl:py-6 overflow-hidden">
            {/* Section Header */}
            <div className="w-full mb-4 xl:mb-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl xl:text-4xl font-black tracking-tight text-[#074031] dark:text-white leading-[1.1]">
                    {isBn ? "আমরা যা সরবরাহ করি" : "WE PROVIDE"}
                  </h2>
                  {/* Yellow/Gold Accent Underline */}
                  <div className="w-12 h-1 bg-[#FEBE16] rounded-full mt-1.5 mb-2" />
                  <p className="text-xs xl:text-sm text-neutral-600 dark:text-neutral-300 max-w-2xl leading-relaxed">
                    {isBn
                      ? "টেকসই ভবিষ্যতের জন্য নির্ভরযোগ্য সোলার এনার্জি সমাধান। আমরা সরবরাহ করি উচ্চমানের সোলার প্যানেল, আধুনিক ইনভার্টার এবং শিল্প-উদ্যোগের জন্য শক্তিশালী এনার্জি স্টোরেজ সিস্টেম।"
                      : "Reliable solar energy solutions for a sustainable future. We supply premium solar panels, modern inverters, and heavy-duty energy storage systems for commercial and industrial use."}
                  </p>
                </div>

                {/* Right Header Badges / Features with Live Active Step Counter */}
                <div className="flex items-center gap-3 font-medium text-xs text-neutral-600 dark:text-neutral-300 pb-1">
                  <span className="text-neutral-300 dark:text-white/20">|</span>
                  <span>{isBn ? "বিশ্বস্ত পণ্য" : "Trusted Products"}</span>
                  <span className="text-neutral-300 dark:text-white/20">|</span>
                  <span>{isBn ? "দীর্ঘমেয়াদী সমাধান" : "Long-term Solutions"}</span>
                  <span className="text-neutral-300 dark:text-white/20">|</span>
                  <span className="font-mono font-bold text-[#108958] dark:text-[#22C55E] bg-[#E8F5E9] dark:bg-[#108958]/20 px-2 py-0.5 rounded">
                    [ {items[activeStep].number} / {isBn ? "০৩" : "03"} ]
                  </span>
                </div>
              </div>
            </div>

            {/* Skiper-104 Animated Cards Grid */}
            <div
              className="relative grid gap-5 xl:gap-7 w-full items-start"
              style={{
                gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
              }}
            >
              {/* Background Gray Track Line */}
              <div className="absolute top-[215px] xl:top-[225px] left-0 h-[2px] w-full bg-[#E2E8DF] dark:bg-white/15 z-0" />

              {/* Dynamic Brand Animated Progress Line */}
              <motion.div
                style={{ width: lineWidth }}
                className="absolute top-[215px] xl:top-[225px] left-0 h-[3px] bg-gradient-to-r from-[#108958] via-[#0B513E] to-[#FEBE16] z-0 shadow-sm"
              />

              {/* Cards */}
              {items.map((item, idx) => (
                <Skiper104DesktopCard
                  key={item.id}
                  item={item}
                  index={idx}
                  total={items.length}
                  scrollYProgress={scrollYProgress}
                  activeStep={activeStep}
                  isBn={isBn}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MOBILE & TABLET SKIPER-104 (Vertical Interactive Timeline)    */}
      {/* ============================================================ */}
      <div className="block lg:hidden relative z-10 w-full max-w-2xl mx-auto px-4 sm:px-6 py-12">
        {/* Section Header (Matching Screenshot Design) */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#074031] dark:text-white leading-tight">
            {isBn ? "আমরা যা সরবরাহ করি" : "WE PROVIDE"}
          </h2>
          {/* Yellow/Gold Accent Underline */}
          <div className="w-12 h-1 bg-[#FEBE16] rounded-full mt-2 mb-2.5" />
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-3">
            {isBn
              ? "টেকসই ভবিষ্যতের জন্য নির্ভরযোগ্য সোলার এনার্জি সমাধান। আমরা সরবরাহ করি উচ্চমানের সোলার প্যানেল, আধুনিক ইনভার্টার এবং শিল্প-উদ্যোগের জন্য শক্তিশালী এনার্জি স্টোরেজ সিস্টেম।"
              : "Reliable solar energy solutions for a sustainable future. We supply premium solar panels, modern inverters, and heavy-duty energy storage systems for commercial and industrial use."}
          </p>
          <div className="flex items-center gap-2 font-medium text-[11px] text-neutral-500 dark:text-neutral-400">
            <span>{isBn ? "বিশ্বস্ত পণ্য" : "Trusted Products"}</span>
            <span className="text-neutral-300 dark:text-white/20">|</span>
            <span>{isBn ? "দীর্ঘমেয়াদী সমাধান" : "Long-term Solutions"}</span>
          </div>
        </div>

        {/* Vertical Timeline Container */}
        <div className="relative flex flex-col gap-10 pl-11">
          {/* Vertical Brand Connecting Line */}
          <div className="absolute left-[15px] top-3 bottom-6 w-[2px] bg-gradient-to-b from-[#108958] via-[#0B513E] to-[#FEBE16]" />

          {/* Cards */}
          {items.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative z-10 flex flex-col gap-3.5 rounded-2xl bg-white dark:bg-[#131915] border border-[#E2E8DF] dark:border-white/10 p-4 sm:p-5 shadow-[0_4px_24px_rgba(7,64,49,0.06)]"
              >
                {/* Step Badge on the Timeline */}
                <div className="absolute -left-[43px] top-4 flex size-8 items-center justify-center bg-[#074031] dark:bg-[#108958] text-[#FEBE16] dark:text-white font-mono text-xs font-bold shadow-md border border-[#FEBE16]/40 dark:border-white/20">
                  {item.stepNum}
                </div>

                {/* 1. Header Row: Icon + Title */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] dark:bg-[#108958]/20 flex items-center justify-center text-[#108958] dark:text-[#22C55E] flex-shrink-0">
                    <IconComponent className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#074031] dark:text-white leading-tight">
                    {item.title}
                  </h3>
                </div>

                {/* 2. Description */}
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {item.description}
                </p>

                {/* 3. 4 Technical Specs Micro-Grid with Icons */}
                <div className="pt-3 border-t border-neutral-100 dark:border-white/10 grid grid-cols-4 gap-1 text-center">
                  {item.specs.map((sp, i) => {
                    const SpecIcon = sp.icon;
                    return (
                      <div key={i} className="flex flex-col items-center">
                        <SpecIcon className="w-3.5 h-3.5 text-[#108958] dark:text-[#22C55E] mb-1" />
                        <span className="text-[9px] text-neutral-500 dark:text-neutral-400 font-medium truncate w-full">
                          {sp.label}
                        </span>
                        <span className="text-[10px] font-bold text-neutral-900 dark:text-white truncate w-full mt-0.5">
                          {sp.val}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* 4. Product Visual (Photo BELOW Text) */}
                <div className="relative w-full h-44 sm:h-52 rounded-xl overflow-hidden bg-neutral-100 dark:bg-white/5 border border-neutral-200/60 dark:border-white/10 mt-1">
                  <AppImage
                    src={item.imageUrl}
                    alt={item.imageAlt}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

                  {/* Stock badge */}
                  <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-mono font-bold text-white">
                    <CheckCircle2 className="w-3 h-3 text-[#22C55E]" />
                    <span>{isBn ? "প্রস্তুত স্টক" : "DIRECT STOCK"}</span>
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 z-10 flex items-baseline gap-2">
                    <span className="font-mono text-2xl text-white font-bold tracking-tight drop-shadow-md">
                      {item.displayChar}
                    </span>
                    <span className="font-mono text-[9px] font-semibold text-white/90 uppercase tracking-widest bg-black/50 px-2 py-0.5 rounded border border-white/10">
                      {item.code}
                    </span>
                  </div>
                </div>

                {/* 5. CTA Link */}
                <Link
                  href={item.link}
                  className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-[#074031] dark:bg-[#108958] text-white font-bold text-xs hover:bg-[#0B513E] dark:hover:bg-[#0E7A4E] transition-colors min-h-[40px] shadow-xs mt-1 group/cta"
                >
                  <span>
                    {isBn
                      ? "ক্যাটালগ ও স্পেসিফিকেশন দেখুন"
                      : "View Specifications & Stock"}
                  </span>
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform text-[#FEBE16] group-hover/cta:translate-x-1" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ServicesSolutions;
