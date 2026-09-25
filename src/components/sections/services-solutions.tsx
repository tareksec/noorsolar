"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
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

export function ServicesSolutions({ locale }: ServicesSolutionsProps = {}) {
  const pathname = usePathname() || "";
  const isBn = locale === "bn" || pathname.startsWith("/bn/") || pathname === "/bn";
  const reduceMotion = useReducedMotion();
  const items = isBn ? ITEMS_BN : ITEMS_EN;

  return (
    <section className="relative w-full overflow-hidden bg-[#FAF9F6] dark:bg-[#0B0F0D] py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#108958]/10 text-[#108958] font-mono text-xs font-bold tracking-widest uppercase mb-4">
            {isBn ? "নূর সোলার / মূল সরবরাহ লাইনআপ" : "NOOR SOLAR / CORE SUPPLY"}
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-neutral-900 dark:text-white">
            {isBn ? "আমরা যা সরবরাহ করি" : "WE PROVIDE"}
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-neutral-600 dark:text-neutral-300 mt-4 max-w-2xl">
            {isBn
              ? "বাণিজ্যিক ও শিল্প প্রকল্পের জন্য টায়ার-১ সোলার প্যানেল, ইনভার্টার ও ব্যাটারি স্টোরেজ"
              : "Engineered Tier-1 Solar Panels, Commercial Inverters & Industrial Energy Storage for Commercial & EPC Projects"}
          </p>
        </div>

        {/* Alternating editorial blocks — image first on mobile, alternating on desktop */}
        <div className="flex flex-col gap-10 sm:gap-14">
          {items.map((item, index) => {
            const imageRightOnDesktop = index % 2 === 1;
            return (
              <motion.article
                key={item.id}
                initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="group/row relative grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 lg:gap-14 items-center rounded-[28px] bg-white dark:bg-white/[0.04] border border-[#E3E9E1] dark:border-white/10 p-5 sm:p-8 lg:p-10 shadow-[0_16px_40px_rgba(0,0,0,0.06)]"
              >
                <div
                  className={`relative w-full h-64 sm:h-80 lg:h-[380px] rounded-2xl overflow-hidden bg-neutral-200 dark:bg-white/10 ${
                    imageRightOnDesktop ? "md:order-2" : "md:order-1"
                  }`}
                >
                  <AppImage
                    src={item.imageUrl}
                    alt={item.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>

                <div
                  className={`flex flex-col items-start gap-4 ${
                    imageRightOnDesktop ? "md:order-1" : "md:order-2"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-neutral-500 dark:text-neutral-400 bg-black/5 dark:bg-white/10 px-2.5 py-1 rounded-full">
                      {item.number}
                    </span>
                    <span className="inline-block px-3 py-1 rounded-full bg-[#108958]/10 text-[#108958] dark:text-[#22C55E] text-[11px] font-mono font-bold tracking-wider uppercase">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900 dark:text-white leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-300">
                    {item.description}
                  </p>
                  <Link
                    href={item.link}
                    className="group/cta inline-flex items-center gap-2 mt-1 text-sm font-bold text-[#108958] dark:text-[#22C55E] hover:underline"
                  >
                    <span>{isBn ? "বিস্তারিত ও ক্যাটালগ দেখুন" : "View Specifications & Stock"}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/cta:translate-x-1" />
                  </Link>
                </div>

                <Link
                  href={item.link}
                  aria-label={item.title}
                  className="hidden md:inline-flex absolute top-6 right-6 items-center justify-center w-10 h-10 rounded-full bg-[#111311] text-[#CEF23E] opacity-0 group-hover/row:opacity-100 transition-opacity"
                >
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
