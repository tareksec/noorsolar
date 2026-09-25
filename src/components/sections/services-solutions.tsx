"use client";

import React, { useRef, useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { ArrowRight } from "lucide-react";
import { AppImage } from "@/components/ui/app-image";

interface ProvideItem {
  id: string;
  number: string;
  badge: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  link: string;
}

const ITEMS_EN: ProvideItem[] = [
  {
    id: "solar-panels",
    number: "01",
    badge: "30-YEAR WARRANTY",
    title: "Tier-1 N-Type TOPCon Solar Panels",
    description:
      "Direct manufacturer import of high-efficiency monocrystalline and bifacial solar modules. Verified with factory Sun-simulator flash tests and EL crack scans. Backed by 30-year linear performance warranties.",
    imageUrl: "/photos/cat-solar-panels.webp",
    imageAlt: "Tier-1 N-Type TOPCon solar panels ready for wholesale supply",
    link: "/category/solar-panels",
  },
  {
    id: "solar-inverters",
    number: "02",
    badge: "98.6% EFFICIENCY",
    title: "Commercial Multi-MPPT Solar Inverters",
    description:
      "Heavy-duty 5kW to 100kW+ on-grid and hybrid inverters engineered for industrial continuity. Delivering 98.6%+ conversion efficiency, IP66 weatherproofing, and 24/7 cloud telemetry monitoring.",
    imageUrl: "/photos/cat-solar-inverters.webp",
    imageAlt: "Commercial multi-MPPT solar inverters for industrial projects",
    link: "/category/solar-inverters",
  },
  {
    id: "lithium-batteries",
    number: "03",
    badge: "6,000+ CYCLES",
    title: "LiFePO4 Industrial Energy Storage (ESS)",
    description:
      "Grade-A prismatic lithium iron phosphate rack batteries and scalable ESS units. Rated for 6,000+ deep discharge cycles with smart active BMS protection for peak shaving and zero-downtime backup.",
    imageUrl: "/photos/cat-lithium-batteries.webp",
    imageAlt: "LiFePO4 industrial battery racks for energy storage systems",
    link: "/category/lithium-batteries",
  },
];

const ITEMS_BN: ProvideItem[] = [
  {
    id: "solar-panels",
    number: "০১",
    badge: "৩০ বছরের ওয়ারেন্টি",
    title: "টায়ার-১ এন-টাইপ TOPCon সোলার প্যানেল",
    description:
      "বাণিজ্যিক ও শিল্প প্রকল্পের জন্য সরাসরি ফ্যাক্টরি থেকে আমদানিকৃত উচ্চ-দক্ষতাসম্পন্ন বাইফেসিয়াল সোলার মডিউল। প্রতিটি ব্যাচে সান-সিমুলেটর টেস্ট ও EL ক্র্যাক স্ক্যান ভেরিফিকেশন এবং ৩০ বছরের পারফরম্যান্স ওয়ারেন্টি।",
    imageUrl: "/photos/cat-solar-panels.webp",
    imageAlt: "পাইকারি সরবরাহের জন্য প্রস্তুত টায়ার-১ সোলার প্যানেল",
    link: "/category/solar-panels",
  },
  {
    id: "solar-inverters",
    number: "০২",
    badge: "৯৮.৬% এফিসিয়েন্সি",
    title: "কমার্শিয়াল মাল্টি-MPPT সোলার ইনভার্টার",
    description:
      "শিল্প কারখানার নিরবচ্ছিন্ন উৎপাদনের জন্য ৫kW থেকে ১০০kW+ অন-গ্রিড ও হাইব্রিড ইনভার্টার। ৯৮.৬%+ কনভার্শন এফিসিয়েন্সি, IP66 ওয়েদারপ্রুফ কেসিং এবং ২৪/৭ ক্লাউড টেলিমেট্রি মনিটরিং সুবিধা।",
    imageUrl: "/photos/cat-solar-inverters.webp",
    imageAlt: "শিল্প প্রকল্পের জন্য কমার্শিয়াল মাল্টি-MPPT সোলার ইনভার্টার",
    link: "/category/solar-inverters",
  },
  {
    id: "lithium-batteries",
    number: "০৩",
    badge: "৬,০০০+ সাইকেল",
    title: "LiFePO4 ইন্ডাস্ট্রিয়াল এনার্জি স্টোরেজ (ESS)",
    description:
      "গ্রেড-এ প্রিজম্যাটিক সেল ও স্মার্ট অ্যাক্টিভ BMS সমৃদ্ধ ৬,০০০+ ডিপ সাইকেল লাইফের লিথিয়াম স্টোরেজ। লোডশেডিংয়ে নিরবচ্ছিন্ন বিদ্যুৎ ও পিক শেভিংয়ের জন্য মেগাওয়াট স্কেল পর্যন্ত এক্সপ্যান্ডেবল।",
    imageUrl: "/photos/cat-lithium-batteries.webp",
    imageAlt: "এনার্জি স্টোরেজ সিস্টেমের জন্য LiFePO4 ইন্ডাস্ট্রিয়াল ব্যাটারি",
    link: "/category/lithium-batteries",
  },
];

interface ServicesSolutionsProps {
  locale?: string;
}

const cardVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    y: direction > 0 ? 32 : -32,
    filter: "blur(4px)",
    scale: 0.98,
  }),
  center: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: {
      duration: 0.42,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
  exit: (direction: number) => ({
    opacity: 0,
    y: direction > 0 ? -32 : 32,
    filter: "blur(4px)",
    scale: 0.98,
    transition: {
      duration: 0.32,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

const imageVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    scale: 1.08,
    y: direction > 0 ? 16 : -16,
  }),
  center: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.48,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
  exit: (direction: number) => ({
    opacity: 0,
    scale: 0.95,
    y: direction > 0 ? -16 : 16,
    transition: {
      duration: 0.32,
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

  // Keep activeRef in sync with state
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

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

      // 1 MOUSE SCROLL DOWN -> ANIMATE TO NEXT CARD
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

            // Smoothly align section into clear focal view on first interaction
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
      // 1 MOUSE SCROLL UP -> ANIMATE TO PREVIOUS CARD
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

  const jumpTo = (index: number) => {
    setDirection(index > active ? 1 : -1);
    setActive(index);
    activeRef.current = index;
  };

  const item = items[active];

  const header = (
    <div className="max-w-3xl">
      <span className="inline-block px-3 py-1 rounded-full bg-[#108958]/10 text-[#108958] font-mono text-[11px] sm:text-xs font-bold tracking-widest uppercase mb-2.5 sm:mb-4">
        {isBn ? "নূর সোলার / মূল সরবরাহ লাইনআপ" : "NOOR SOLAR / CORE SUPPLY"}
      </span>
      <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-neutral-900 dark:text-white leading-tight">
        {isBn ? "আমরা যা সরবরাহ করি" : "WE PROVIDE"}
      </h2>
      <p className="text-xs sm:text-base text-neutral-600 dark:text-neutral-300 mt-2 sm:mt-3 max-w-2xl leading-relaxed">
        {isBn
          ? "বাণিজ্যিক ও শিল্প প্রকল্পের জন্য টায়ার-১ সোলার প্যানেল, ইনভার্টার ও ব্যাটারি স্টোরেজ"
          : "Engineered Tier-1 Solar Panels, Commercial Inverters & Industrial Energy Storage for Commercial & EPC Projects"}
      </p>
    </div>
  );

  const textBlock = (content: ProvideItem) => (
    <>
      <div className="flex items-center gap-2.5 sm:gap-3">
        <span className="font-mono text-xs font-bold text-neutral-500 dark:text-neutral-400 bg-black/5 dark:bg-white/10 px-2.5 py-1 rounded-full">
          {content.number}
        </span>
        <span className="inline-block px-3 py-1 rounded-full bg-[#108958]/10 text-[#108958] dark:text-[#22C55E] text-[11px] font-mono font-bold tracking-wider uppercase">
          {content.badge}
        </span>
      </div>
      <h3 className="text-xl sm:text-3xl lg:text-[2.5rem] font-black tracking-tight text-neutral-900 dark:text-white leading-tight">
        {content.title}
      </h3>
      <p className="text-xs sm:text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-300 max-w-xl">
        {content.description}
      </p>
      <Link
        href={content.link}
        className="group/cta inline-flex items-center gap-2 mt-1 text-xs sm:text-sm font-bold text-[#108958] dark:text-[#22C55E] hover:underline min-h-[38px] sm:min-h-[44px]"
      >
        <span>{isBn ? "বিস্তারিত ও ক্যাটালগ দেখুন" : "View Specifications & Stock"}</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover/cta:translate-x-1" />
      </Link>
    </>
  );

  /* Reduced-motion fallback: static stacked cards, no sticky, no animation. */
  if (reduceMotion) {
    return (
      <section className="relative w-full overflow-x-clip bg-[#FAF9F6] dark:bg-[#0B0F0D] pt-10 sm:pt-14 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 sm:mb-10">{header}</div>
          <div className="flex flex-col gap-6 sm:gap-8">
            {items.map((content) => (
              <article
                key={content.id}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center rounded-[28px] bg-white dark:bg-white/[0.04] border border-[#E3E9E1] dark:border-white/10 p-5 sm:p-8"
              >
                <div className="relative w-full h-60 sm:h-72 rounded-2xl overflow-hidden bg-neutral-200 dark:bg-white/10">
                  <AppImage
                    src={content.imageUrl}
                    alt={content.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col items-start gap-4">{textBlock(content)}</div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#FAF9F6] dark:bg-[#0B0F0D] pt-8 sm:pt-14 pb-8 sm:pb-14"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">{header}</div>

        {/* Mobile View (< md): Sticky Scroll Card Stacking Animation */}
        <div className="md:hidden relative flex flex-col pb-8">
          {items.map((content, idx) => {
            const topOffset = 76 + idx * 16;
            return (
              <article
                key={content.id}
                style={{
                  top: `${topOffset}px`,
                  zIndex: 10 + idx,
                }}
                className="sticky flex flex-col rounded-[28px] bg-white dark:bg-[#111311] border border-[#DCE4E0] dark:border-white/10 p-4 sm:p-5 shadow-[0_-8px_30px_rgba(0,0,0,0.06),0_16px_36px_rgba(0,0,0,0.08)] mb-12 last:mb-2 transition-transform duration-300"
              >
                {/* Product Photo */}
                <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden bg-neutral-200 dark:bg-white/10 mb-3.5">
                  <AppImage
                    src={content.imageUrl}
                    alt={content.imageAlt}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                  <span className="absolute bottom-3 left-3 font-mono text-[11px] font-bold tracking-widest px-2.5 py-1 rounded-full bg-black/60 text-[#CEF23E] backdrop-blur-sm border border-white/10">
                    {content.number} / {isBn ? "০৩" : "03"}
                  </span>
                </div>

                {/* Product Details */}
                <div className="flex flex-col items-start gap-2.5">
                  {textBlock(content)}
                </div>
              </article>
            );
          })}
        </div>

        {/* Desktop View (>= md): Discrete 1-Mouse-Scroll to 1-Card Animation */}
        <div className="hidden md:block relative min-h-[460px] lg:min-h-[500px]">
          <div className="grid grid-cols-[72px_minmax(0,1fr)_minmax(0,1.15fr)] gap-6 md:gap-12 items-center">
            {/* Connected flow rail */}
            <div className="relative flex flex-col items-center self-stretch py-6" aria-hidden="true">
              <div className="absolute top-6 bottom-6 w-px bg-neutral-300 dark:bg-white/15" />
              <motion.div
                className="absolute top-6 bottom-6 w-[3px] -translate-x-[1px] rounded-full bg-[#108958] origin-top"
                animate={{ scaleY: active / (items.length - 1) }}
                transition={{ type: "spring", stiffness: 240, damping: 26 }}
              />
              <div className="relative flex flex-col justify-between h-full py-2">
                {items.map((content, i) => (
                  <button
                    key={content.id}
                    type="button"
                    onClick={() => jumpTo(i)}
                    className={`flex items-center justify-center w-10 h-10 rounded-full font-mono text-xs font-bold border-2 transition-all duration-300 cursor-pointer ${
                      i === active
                        ? "bg-[#108958] border-[#108958] text-white scale-110 shadow-lg shadow-[#108958]/25"
                        : i < active
                          ? "bg-[#108958]/15 border-[#108958]/60 text-[#108958]"
                          : "bg-white dark:bg-[#0B0F0D] border-neutral-300 dark:border-white/20 text-neutral-400 hover:border-[#108958]/40"
                    }`}
                  >
                    {content.number}
                  </button>
                ))}
              </div>
            </div>

            {/* Swapping text card with directional motion */}
            <div className="relative min-h-[300px] flex flex-col justify-center">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={item.id}
                  custom={direction}
                  variants={cardVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="flex flex-col items-start gap-4"
                >
                  {textBlock(item)}
                </motion.div>
              </AnimatePresence>

              {/* Desktop step dots & interactive scroll hint */}
              <div className="flex items-center gap-4 mt-8 pt-4 border-t border-neutral-200/80 dark:border-white/10">
                <div className="flex items-center gap-2">
                  {items.map((content, i) => (
                    <button
                      key={content.id}
                      onClick={() => jumpTo(i)}
                      aria-label={content.title}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        i === active
                          ? "w-10 bg-[#108958]"
                          : "w-4 bg-neutral-300 dark:bg-white/20 hover:bg-neutral-400"
                      }`}
                    />
                  ))}
                </div>

                <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
                  {isBn ? "মাউস স্ক্রলে পরবর্তী কার্ড অ্যানিমেশন" : "Mouse scroll steps 1 card"}
                </span>
              </div>
            </div>

            {/* Swapping image card with directional motion */}
            <div className="relative w-full h-[380px] lg:h-[440px] rounded-[32px] overflow-hidden bg-neutral-200 dark:bg-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-[#E3E9E1] dark:border-white/10">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={`${item.id}-img`}
                  custom={direction}
                  variants={imageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0"
                >
                  <AppImage
                    src={item.imageUrl}
                    alt={item.imageAlt}
                    fill
                    sizes="50vw"
                    className="object-cover"
                    priority={active === 0}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Step counter badge */}
              <span className="absolute bottom-5 left-5 font-mono text-xs font-bold tracking-widest px-3.5 py-1.5 rounded-full bg-black/65 text-white backdrop-blur-md border border-white/15 shadow">
                {item.number} / {isBn ? "০৩" : "03"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
