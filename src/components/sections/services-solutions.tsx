"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "motion/react";
import {
  ArrowRight,
  Plus,
  Minus,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { AppImage } from "@/components/ui/app-image";

interface SpecItem {
  label: string;
  val: string;
}

interface ProvideItem {
  id: string;
  number: string;
  code: string;
  badge: string;
  title: string;
  description: string;
  specs: SpecItem[];
  imageUrl: string;
  imageAlt: string;
  link: string;
}

const ITEMS_EN: ProvideItem[] = [
  {
    id: "solar-panels",
    number: "01",
    code: "PV-MOD // 01",
    badge: "30-YEAR WARRANTY",
    title: "Tier-1 N-Type TOPCon Solar Panels",
    description:
      "Direct manufacturer import of high-efficiency monocrystalline and bifacial solar modules. Verified with factory Sun-simulator flash tests and EL crack scans. Backed by 30-year linear performance warranties.",
    specs: [
      { label: "EFFICIENCY", val: "22.8%+" },
      { label: "BIFACIALITY", val: "85% ± 5%" },
      { label: "STANDARDS", val: "IEC 61215 / 61730" },
    ],
    imageUrl: "/photos/cat-solar-panels.webp",
    imageAlt: "Tier-1 N-Type TOPCon solar panels ready for wholesale supply",
    link: "/category/solar-panels",
  },
  {
    id: "solar-inverters",
    number: "02",
    code: "INV-PWR // 02",
    badge: "98.6% EFFICIENCY",
    title: "Commercial Multi-MPPT Solar Inverters",
    description:
      "Heavy-duty 5kW to 100kW+ on-grid and hybrid inverters engineered for industrial continuity. Delivering 98.6%+ conversion efficiency, IP66 weatherproofing, and 24/7 cloud telemetry monitoring.",
    specs: [
      { label: "PEAK CONVERSION", val: "98.6%" },
      { label: "PROTECTION", val: "IP66 Rugged" },
      { label: "TELEMETRY", val: "24/7 Cloud IoT" },
    ],
    imageUrl: "/photos/cat-solar-inverters.webp",
    imageAlt: "Commercial multi-MPPT solar inverters for industrial projects",
    link: "/category/solar-inverters",
  },
  {
    id: "lithium-batteries",
    number: "03",
    code: "ESS-BAT // 03",
    badge: "6,000+ CYCLES",
    title: "LiFePO4 Industrial Energy Storage (ESS)",
    description:
      "Grade-A prismatic lithium iron phosphate rack batteries and scalable ESS units. Rated for 6,000+ deep discharge cycles with smart active BMS protection for peak shaving and zero-downtime backup.",
    specs: [
      { label: "CYCLE LIFE", val: "6,000+ @ 80% DoD" },
      { label: "CHEMISTRY", val: "LiFePO4 Grade-A" },
      { label: "MANAGEMENT", val: "Active Multi-BMS" },
    ],
    imageUrl: "/photos/cat-lithium-batteries.webp",
    imageAlt: "LiFePO4 industrial battery racks for energy storage systems",
    link: "/category/lithium-batteries",
  },
];

const ITEMS_BN: ProvideItem[] = [
  {
    id: "solar-panels",
    number: "০১",
    code: "সোলার মডিউল // ০১",
    badge: "৩০ বছরের ওয়ারেন্টি",
    title: "টায়ার-১ এন-টাইপ TOPCon সোলার প্যানেল",
    description:
      "বাণিজ্যিক ও শিল্প প্রকল্পের জন্য সরাসরি ফ্যাক্টরি থেকে আমদানিকৃত উচ্চ-দক্ষতাসম্পন্ন বাইফেসিয়াল সোলার মডিউল। প্রতিটি ব্যাচে সান-সিমুলেটর টেস্ট ও EL ক্র্যাক স্ক্যান ভেরিফিকেশন এবং ৩০ বছরের পারফরম্যান্স ওয়ারেন্টি।",
    specs: [
      { label: "এফিসিয়েন্সি", val: "২২.৮%+" },
      { label: "বাইফেসিয়ালিটি", val: "৮৫% ± ৫%" },
      { label: "স্ট্যান্ডার্ড", val: "IEC ৬১২১৫ / ৬১৭৩০" },
    ],
    imageUrl: "/photos/cat-solar-panels.webp",
    imageAlt: "পাইকারি সরবরাহের জন্য প্রস্তুত টায়ার-১ সোলার প্যানেল",
    link: "/category/solar-panels",
  },
  {
    id: "solar-inverters",
    number: "০২",
    code: "ইনভার্টার সিস্টেম // ০২",
    badge: "৯৮.৬% এফিসিয়েন্সি",
    title: "কমার্শিয়াল মাল্টি-MPPT সোলার ইনভার্টার",
    description:
      "শিল্প কারখানার নিরবচ্ছিন্ন উৎপাদনের জন্য ৫kW থেকে ১০০kW+ অন-গ্রিড ও হাইব্রিড ইনভার্টার। ৯৮.৬%+ কনভার্শন এফিসিয়েন্সি, IP66 ওয়েদারপ্রুফ কেসিং এবং ২৪/৭ ক্লাউড টেলিমেট্রি মনিটরিং সুবিধা।",
    specs: [
      { label: "পিক এফিসিয়েন্সি", val: "৯৮.৬%" },
      { label: "সুরক্ষা মান", val: "IP66 ওয়েদারপ্রুফ" },
      { label: "টেলিমেট্রি", val: "২৪/৭ ক্লাউড IoT" },
    ],
    imageUrl: "/photos/cat-solar-inverters.webp",
    imageAlt: "শিল্প প্রকল্পের জন্য কমার্শিয়াল মাল্টি-MPPT সোলার ইনভার্টার",
    link: "/category/solar-inverters",
  },
  {
    id: "lithium-batteries",
    number: "০৩",
    code: "স্টোরেজ ESS // ০৩",
    badge: "৬,০০০+ সাইকেল",
    title: "LiFePO4 ইন্ডাস্ট্রিয়াল এনার্জি স্টোরেজ (ESS)",
    description:
      "গ্রেড-এ প্রিজম্যাটিক সেল ও স্মার্ট অ্যাক্টিভ BMS সমৃদ্ধ ৬,০০০+ ডিপ সাইকেল লাইফের লিথিয়াম স্টোরেজ। লোডশেডিংয়ে নিরবচ্ছিন্ন বিদ্যুৎ ও পিক শেভিংয়ের জন্য মেগাওয়াট স্কেল পর্যন্ত এক্সপ্যান্ডেবল।",
    specs: [
      { label: "সাইকেল লাইফ", val: "৬,০০০+ @ ৮০% DoD" },
      { label: "সেল গ্রেড", val: "LiFePO4 গ্রেড-এ" },
      { label: "ব্যাটারি সুরক্ষা", val: "অ্যাক্টিভ স্মার্ট BMS" },
    ],
    imageUrl: "/photos/cat-lithium-batteries.webp",
    imageAlt: "এনার্জি স্টোরেজ সিস্টেমের জন্য LiFePO4 ইন্ডাস্ট্রিয়াল ব্যাটারি",
    link: "/category/lithium-batteries",
  },
];

interface ServicesSolutionsProps {
  locale?: string;
}

const cardContentVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    y: dir > 0 ? 28 : -28,
    filter: "blur(4px)",
  }),
  center: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
  exit: (dir: number) => ({
    opacity: 0,
    y: dir > 0 ? -24 : 24,
    filter: "blur(4px)",
    transition: {
      duration: 0.28,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

const visualStageVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    scale: 1.05,
    y: dir > 0 ? 20 : -20,
  }),
  center: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
  exit: (dir: number) => ({
    opacity: 0,
    scale: 0.96,
    y: dir > 0 ? -16 : 16,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

export function ServicesSolutions({ locale }: ServicesSolutionsProps = {}) {
  const pathname = usePathname() || "";
  const isBn = locale === "bn" || pathname.startsWith("/bn/") || pathname === "/bn";
  const reduceMotion = useReducedMotion();
  const items = isBn ? ITEMS_BN : ITEMS_EN;

  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const activeRef = useRef(0);
  const cooldownRef = useRef(false);

  // Desktop guard to prevent double image decode on mobile viewports
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Keep activeRef in sync
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  const jumpTo = useCallback((index: number) => {
    if (index === activeRef.current) return;
    setDirection(index > activeRef.current ? 1 : -1);
    setActive(index);
    activeRef.current = index;
  }, []);

  // Discrete 1-mouse-scroll to 1-card animation handler for Desktop
  useEffect(() => {
    if (typeof window === "undefined" || reduceMotion) return;

    const el = sectionRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      // Only execute on desktop screens
      if (window.innerWidth < 768) return;

      const rect = el.getBoundingClientRect();
      const inView = rect.top <= 140 && rect.bottom >= window.innerHeight * 0.4;

      if (!inView) return;

      const delta = e.deltaY;

      // 1 MOUSE SCROLL DOWN -> ADVANCE TO NEXT CARD
      if (delta > 18) {
        if (activeRef.current < items.length - 1) {
          e.preventDefault();

          if (!cooldownRef.current) {
            cooldownRef.current = true;
            setDirection(1);
            setActive((prev) => {
              const next = Math.min(items.length - 1, prev + 1);
              activeRef.current = next;
              return next;
            });

            // Smoothly align section into clear focal view on interaction
            if (rect.top > 80 || rect.top < 30) {
              window.scrollTo({
                top: window.scrollY + rect.top - 70,
                behavior: "smooth",
              });
            }

            setTimeout(() => {
              cooldownRef.current = false;
            }, 550);
          }
        }
        // At the last card, normal page scroll continues naturally down
      }
      // 1 MOUSE SCROLL UP -> GO TO PREVIOUS CARD
      else if (delta < -18) {
        if (activeRef.current > 0) {
          e.preventDefault();

          if (!cooldownRef.current) {
            cooldownRef.current = true;
            setDirection(-1);
            setActive((prev) => {
              const next = Math.max(0, prev - 1);
              activeRef.current = next;
              return next;
            });

            if (rect.top > 80 || rect.top < 30) {
              window.scrollTo({
                top: window.scrollY + rect.top - 70,
                behavior: "smooth",
              });
            }

            setTimeout(() => {
              cooldownRef.current = false;
            }, 550);
          }
        }
        // At the first card, normal page scroll continues naturally up
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, [items.length, reduceMotion]);

  // Keyboard navigation for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      if (active < items.length - 1) {
        e.preventDefault();
        jumpTo(active + 1);
      }
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      if (active > 0) {
        e.preventDefault();
        jumpTo(active - 1);
      }
    }
  };

  const item = items[active];

  // Header markup
  const header = (
    <div className="max-w-4xl relative">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-[#108958] animate-pulse" />
        <span className="font-mono text-[11px] sm:text-xs font-semibold tracking-[0.2em] text-[#108958] dark:text-[#22C55E] uppercase">
          {isBn ? "নূর সোলার // মূল সরবরাহ লাইনআপ" : "NOOR SOLAR // CORE SUPPLY LINEUP"}
        </span>
      </div>

      <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-3">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-neutral-900 dark:text-white leading-[1.1]">
          {isBn ? "আমরা যা সরবরাহ করি" : "WE PROVIDE"}
        </h2>
        <span className="hidden md:inline-block font-mono text-xs font-medium text-neutral-500 dark:text-neutral-400">
          [ 03 {isBn ? "টি প্রধান ক্যাটাগরি" : "PRIMARY CATEGORIES"} ]
        </span>
      </div>

      <p className="text-xs sm:text-base text-neutral-600 dark:text-neutral-300 mt-2.5 max-w-2xl leading-relaxed">
        {isBn
          ? "বাণিজ্যিক ও শিল্প প্রকল্পের জন্য সরাসরি প্রস্তুত আমদানিকৃত টায়ার-১ সোলার প্যানেল, ইনভার্টার ও ব্যাটারি স্টোরেজ"
          : "Engineered Tier-1 Solar Panels, Commercial Inverters & Industrial Energy Storage for Commercial & EPC Projects"}
      </p>
    </div>
  );

  /* Reduced-motion fallback: clean accessible editorial stack without scroll-locking */
  if (reduceMotion) {
    return (
      <section className="relative w-full bg-[#F8F9F5] dark:bg-[#0B0F0D] py-12 sm:py-16 border-y border-[#E2E8DF] dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">{header}</div>
          <div className="flex flex-col gap-8">
            {items.map((content) => (
              <article
                key={content.id}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center rounded-2xl bg-white dark:bg-white/[0.03] border border-[#E2E8DF] dark:border-white/10 p-6 sm:p-10 shadow-sm"
              >
                <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden bg-neutral-200 dark:bg-white/10">
                  <AppImage
                    src={content.imageUrl}
                    alt={content.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col items-start gap-4">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-white/10 px-2.5 py-1 rounded">
                      {content.number}
                    </span>
                    <span className="font-mono text-[11px] font-bold tracking-wider uppercase text-[#108958] dark:text-[#22C55E] bg-[#108958]/10 px-3 py-1 rounded">
                      {content.badge}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 dark:text-white">
                    {content.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                    {content.description}
                  </p>
                  <Link
                    href={content.link}
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#108958] hover:underline"
                  >
                    <span>{isBn ? "বিস্তারিত ও ক্যাটালগ দেখুন" : "View Specifications & Stock"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="services-solutions"
      ref={sectionRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="We Provide - Core Supply Lineup"
      className="relative w-full bg-[#F8F9F5] dark:bg-[#0B0F0D] py-10 sm:py-16 border-y border-[#E2E8DF] dark:border-white/10 focus:outline-none"
    >
      {/* Background Architectural Drafting Accents */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20"
        aria-hidden="true"
      >
        <div className="w-full h-full bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-12">{header}</div>

        {/* ============================================================== */}
        {/* MOBILE VIEW (< md): Sticky Scroll Card Stacking Deck Animation */}
        {/* ============================================================== */}
        <div className="md:hidden relative flex flex-col pb-10">
          {items.map((content, idx) => {
            const topOffset = 76 + idx * 16;

            return (
              <motion.article
                key={content.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.45, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  top: `${topOffset}px`,
                  zIndex: 10 + idx,
                }}
                className="sticky flex flex-col rounded-[26px] bg-white dark:bg-[#131915] border border-[#E2E8DF] dark:border-white/10 p-4 sm:p-5 shadow-[0_-8px_30px_rgba(0,0,0,0.08),0_18px_40px_rgba(0,0,0,0.08)] mb-10 last:mb-2 transition-transform duration-300"
              >
                {/* Header Strip */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg font-mono text-xs font-bold bg-[#108958] text-white shadow-xs">
                      {content.number}
                    </span>
                    <span className="font-mono text-[11px] font-bold text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-white/10 px-2 py-0.5 rounded">
                      {content.code}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-[#108958] dark:text-[#22C55E] tracking-wider uppercase bg-[#108958]/10 border border-[#108958]/20 px-2.5 py-1 rounded-full">
                    <Sparkles className="w-3 h-3 text-[#108958]" />
                    {content.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900 dark:text-white leading-tight mb-3">
                  {content.title}
                </h3>

                {/* High-Impact Product Imagery with Drafting Corner Crosshairs */}
                <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden bg-neutral-200 dark:bg-white/10 shadow-inner mb-3.5">
                  <AppImage
                    src={content.imageUrl}
                    alt={content.imageAlt}
                    fill
                    sizes="(max-width: 480px) 256px, 400px"
                    className="object-cover"
                    loading={idx === 0 ? "eager" : "lazy"}
                    priority={idx === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/20 pointer-events-none" />

                  {/* Corner Crosshairs */}
                  <span className="absolute top-2.5 left-2.5 z-10 font-mono text-[9px] text-white/70 select-none drop-shadow" aria-hidden="true">+</span>
                  <span className="absolute top-2.5 right-2.5 z-10 font-mono text-[9px] text-white/70 select-none drop-shadow" aria-hidden="true">+</span>

                  {/* Badges */}
                  <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-mono font-bold text-white shadow-xs">
                    <CheckCircle2 className="w-3 h-3 text-[#22C55E]" />
                    <span>{isBn ? "প্রস্তুত স্টক" : "DIRECT STOCK"}</span>
                  </div>

                  <span className="absolute bottom-2.5 left-2.5 z-10 font-mono text-[10px] font-bold tracking-widest px-2.5 py-1 rounded bg-black/75 text-white backdrop-blur-sm border border-white/15">
                    {content.number} / {isBn ? "০৩" : "03"}
                  </span>
                </div>

                {/* Technical Specs Micro-Grid */}
                <div className="grid grid-cols-3 gap-2 py-1 mb-3">
                  {content.specs.map((sp, i) => (
                    <div
                      key={i}
                      className="flex flex-col p-2 rounded-xl bg-neutral-50 dark:bg-white/[0.04] border border-neutral-200/60 dark:border-white/5"
                    >
                      <span className="font-mono text-[9px] font-bold text-neutral-400 dark:text-neutral-500 tracking-wider truncate">
                        {sp.label}
                      </span>
                      <span className="font-mono text-[11px] font-black text-neutral-900 dark:text-neutral-100 truncate mt-0.5">
                        {sp.val}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Description */}
                <p className="text-xs sm:text-[13px] leading-relaxed text-neutral-600 dark:text-neutral-300 mb-3.5">
                  {content.description}
                </p>

                {/* CTA Link */}
                <Link
                  href={content.link}
                  className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-xs hover:bg-[#108958] dark:hover:bg-[#108958] dark:hover:text-white transition-colors min-h-[44px] shadow-xs"
                >
                  <span>{isBn ? "ক্যাটালগ ও স্পেসিফিকেশন দেখুন" : "View Specifications & Stock"}</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </motion.article>
            );
          })}
        </div>

        {/* ============================================================== */}
        {/* DESKTOP VIEW (>= md): Pinned 1-Scroll-to-1-Card Architectural Deck */}
        {/* ============================================================== */}
        <div className="hidden md:block relative min-h-[490px] lg:min-h-[530px]">
          {/* Architectural Drafting Corner Accents */}
          <span className="absolute -top-3 -left-3 font-mono text-neutral-400 dark:text-neutral-600 text-xs select-none" aria-hidden="true">+</span>
          <span className="absolute -top-3 -right-3 font-mono text-neutral-400 dark:text-neutral-600 text-xs select-none" aria-hidden="true">+</span>

          <div className="grid grid-cols-[80px_minmax(0,1.05fr)_minmax(0,1.15fr)] gap-8 lg:gap-12 items-center">
            
            {/* 1. Architectural Vertical Timeline Rail */}
            <div className="relative flex flex-col items-center self-stretch py-8">
              {/* Drafting Rail Hairline */}
              <div className="absolute top-8 bottom-8 w-px bg-neutral-300 dark:bg-white/15" aria-hidden="true" />
              
              {/* Active Indicator Spring Rail */}
              <motion.div
                className="absolute top-8 bottom-8 w-[2px] rounded-full bg-[#108958] origin-top shadow-[0_0_8px_rgba(16,137,88,0.5)]"
                animate={{ scaleY: active / (items.length - 1) }}
                transition={{ type: "spring", stiffness: 220, damping: 26 }}
                aria-hidden="true"
              />

              <div className="relative flex flex-col justify-between h-full py-2">
                {items.map((content, i) => {
                  const isActive = i === active;
                  const isPassed = i < active;

                  return (
                    <button
                      key={content.id}
                      type="button"
                      onClick={() => jumpTo(i)}
                      aria-label={`Jump to step ${content.number}: ${content.title}`}
                      className={`group relative flex items-center justify-center w-12 h-12 rounded-xl font-mono text-xs font-bold border transition-all duration-300 cursor-pointer ${
                        isActive
                          ? "bg-[#108958] border-[#108958] text-white shadow-lg shadow-[#108958]/20 scale-105"
                          : isPassed
                            ? "bg-[#108958]/10 border-[#108958]/40 text-[#108958]"
                            : "bg-white dark:bg-[#111613] border-neutral-300 dark:border-white/15 text-neutral-400 hover:border-neutral-600 dark:hover:border-white/30"
                      }`}
                    >
                      <span>{content.number}</span>
                      
                      {/* Active floating indicator ping */}
                      {isActive && (
                        <span className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-[#108958] ring-4 ring-[#108958]/20" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Swapping Editorial Spec Card (Middle Column) */}
            <div className="relative min-h-[360px] flex flex-col justify-center">
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.div
                  key={item.id}
                  custom={direction}
                  variants={cardContentVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="flex flex-col items-start gap-4"
                >
                  {/* Category Code & Swiss Badge */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-neutral-600 dark:text-neutral-400 bg-neutral-200/70 dark:bg-white/10 px-2.5 py-1 rounded">
                      {item.code}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#108958]/10 text-[#108958] dark:text-[#22C55E] text-xs font-mono font-bold tracking-wider uppercase border border-[#108958]/20">
                      <Sparkles className="w-3 h-3 text-[#108958]" />
                      {item.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl sm:text-3xl lg:text-[2.35rem] font-black tracking-tight text-neutral-900 dark:text-white leading-[1.15]">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-300 max-w-xl">
                    {item.description}
                  </p>

                  {/* Technical Spec Matrix Chips */}
                  <div className="grid grid-cols-3 gap-2.5 w-full max-w-lg mt-1 pt-3 border-t border-neutral-200/80 dark:border-white/10">
                    {item.specs.map((sp, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col p-2.5 rounded-xl bg-white dark:bg-white/[0.03] border border-[#E2E8DF] dark:border-white/10 shadow-xs"
                      >
                        <span className="font-mono text-[10px] font-bold text-neutral-400 dark:text-neutral-500 tracking-wider">
                          {sp.label}
                        </span>
                        <span className="font-mono text-xs lg:text-[13px] font-black text-neutral-900 dark:text-neutral-100 mt-1">
                          {sp.val}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Action Link */}
                  <div className="pt-2">
                    <Link
                      href={item.link}
                      className="group/cta inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs sm:text-sm font-bold shadow hover:bg-[#108958] dark:hover:bg-[#108958] dark:hover:text-white transition-all duration-200 min-h-[42px]"
                    >
                      <span>{isBn ? "ক্যাটালগ ও স্পেসিফিকেশন দেখুন" : "View Specifications & Stock"}</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/cta:translate-x-1" />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Progress Indicator Bar & Scroll Hint */}
              <div className="flex items-center justify-between gap-4 mt-8 pt-5 border-t border-neutral-200/90 dark:border-white/10">
                <div className="flex items-center gap-2">
                  {items.map((content, i) => (
                    <button
                      key={content.id}
                      type="button"
                      onClick={() => jumpTo(i)}
                      aria-label={`Step ${content.number}`}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        i === active
                          ? "w-10 bg-[#108958]"
                          : "w-4 bg-neutral-300 dark:bg-white/20 hover:bg-neutral-400"
                      }`}
                    />
                  ))}
                  <span className="font-mono text-[11px] font-bold text-neutral-500 dark:text-neutral-400 ml-2">
                    0{active + 1} / 0{items.length}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500" />
                  <span>
                    {isBn ? "মাউস স্ক্রলে পরবর্তী কার্ড (১/৩)" : "Mouse scroll steps 1 card"}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Swapping Architectural Showcase Frame (Right Column) */}
            <div className="relative w-full h-[400px] lg:h-[460px] rounded-3xl overflow-hidden bg-neutral-200 dark:bg-[#111613] shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-[#E2E8DF] dark:border-white/10">
              
              {/* Drafting Corner Crosshairs */}
              <span className="absolute top-3 left-3 z-20 font-mono text-[10px] text-white/70 select-none drop-shadow" aria-hidden="true">+</span>
              <span className="absolute top-3 right-3 z-20 font-mono text-[10px] text-white/70 select-none drop-shadow" aria-hidden="true">+</span>
              <span className="absolute bottom-3 left-3 z-20 font-mono text-[10px] text-white/70 select-none drop-shadow" aria-hidden="true">+</span>
              <span className="absolute bottom-3 right-3 z-20 font-mono text-[10px] text-white/70 select-none drop-shadow" aria-hidden="true">+</span>

              <AnimatePresence mode="wait" initial={false} custom={direction}>
                {isDesktop && (
                  <motion.div
                    key={`${item.id}-img`}
                    custom={direction}
                    variants={visualStageVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0"
                  >
                    <AppImage
                      src={item.imageUrl}
                      alt={item.imageAlt}
                      fill
                      sizes="(max-width: 1280px) 45vw, 550px"
                      className="object-cover"
                      priority={active === 0}
                    />

                    {/* Gradient shadow overlay for legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Status Header Badge on Top-Right */}
              <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-mono font-bold text-white shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                <span>{isBn ? "আমদানিকৃত প্রস্তুত স্টক" : "DIRECT IMPORTER STOCK"}</span>
              </div>

              {/* Step counter badge on Bottom-Left */}
              <div className="absolute bottom-4 left-4 z-20 font-mono text-xs font-bold tracking-widest px-3.5 py-1.5 rounded-xl bg-black/70 text-white backdrop-blur-md border border-white/15 shadow">
                {item.number} / {isBn ? "০৩" : "03"}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
