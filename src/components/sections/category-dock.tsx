"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

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
  slug: string;
  title: string;
  categoryNumber: string;
  specSummary: string;
  description: string;
  image: string;
  alt: string;
  link: string;
}

const EQUIPMENT_ITEMS_EN: EquipmentCard[] = [
  {
    id: "solar-panels",
    slug: "solar-panels",
    title: "Solar Panels",
    categoryNumber: "01",
    specSummary: "Tier-1 N-Type TOPCon & Bifacial",
    description:
      "High-efficiency monocrystalline and bifacial solar modules engineered for maximum irradiance capture, harsh weather resistance, and 25-year performance.",
    image: "/solar-images/solar-panel-3d-isolated.webp",
    alt: "High-efficiency monocrystalline solar panels under clear sky",
    link: "/category/solar-panels",
  },
  {
    id: "inverters-controllers",
    slug: "solar-inverters",
    title: "Inverters & Controllers",
    categoryNumber: "02",
    specSummary: "Hybrid, On-Grid & MPPT",
    description:
      "Commercial and residential hybrid inverters with intelligent dual MPPT tracking, pure sine wave power conversion, and smart cloud telemetry.",
    image: "/Inverter/white-inverter-of-solar-cell-power-generation-system.jpg",
    alt: "High-power commercial hybrid solar inverter unit",
    link: "/category/solar-inverters",
  },
  {
    id: "batteries-storage",
    slug: "lithium-batteries",
    title: "Batteries & Energy Storage",
    categoryNumber: "03",
    specSummary: "LiFePO4 · 6,000+ Deep Cycles",
    description:
      "Long-life lithium iron phosphate battery banks and modular rack systems designed for zero-downtime backup, peak shaving, and night storage.",
    image: "/bettry/500_F_2090872600_mpL6CKZulRNh7R8OMe31iD00cXQpEpR7.jpg",
    alt: "LiFePO4 lithium battery energy storage system",
    link: "/category/lithium-batteries",
  },
];

const EQUIPMENT_ITEMS_BN: EquipmentCard[] = [
  {
    id: "solar-panels",
    slug: "solar-panels",
    title: "সোলার প্যানেল",
    categoryNumber: "০১",
    specSummary: "টায়ার-১ N-Type TOPCon ও বাইফেসিয়াল",
    description:
      "উচ্চ-দক্ষতাসম্পন্ন মনোক্রিস্টালাইন ও বাইফেসিয়াল মডিউল — যা তীব্র তাপেও সর্বোচ্চ বিদ্যুৎ উৎপাদন এবং দীর্ঘ ২৫ বছরের স্থায়িত্ব নিশ্চিত করে।",
    image: "/solar-images/solar-panel-3d-isolated.webp",
    alt: "উচ্চ-দক্ষতাসম্পন্ন মনোক্রিস্টালাইন সোলার প্যানেল",
    link: "/bn/category/solar-panels",
  },
  {
    id: "inverters-controllers",
    slug: "solar-inverters",
    title: "ইনভার্টার ও কন্ট্রোলার",
    categoryNumber: "০২",
    specSummary: "হাইব্রিড, অন-গ্রিড ও MPPT",
    description:
      "বাণিজ্যিক ও আবাসিক হাইব্রিড ইনভার্টার — ডুয়াল MPPT ট্র্যাকিং, পিওর সাইন ওয়েভ রূপান্তর এবং ক্লাউড মনিটরিং সুবিধাসহ।",
    image: "/Inverter/white-inverter-of-solar-cell-power-generation-system.jpg",
    alt: "কমার্শিয়াল হাইব্রিড সোলার ইনভার্টার ইউনিট",
    link: "/bn/category/solar-inverters",
  },
  {
    id: "batteries-storage",
    slug: "lithium-batteries",
    title: "ব্যাটারি ও এনার্জি স্টোরেজ",
    categoryNumber: "০৩",
    specSummary: "LiFePO4 · ৬,০০০+ ডিপ সাইকেল",
    description:
      "নিরবচ্ছিন্ন বিদ্যুৎ নিশ্চিত করতে দীর্ঘস্থায়ী লিথিয়াম আয়রন ফসফেট ব্যাটারি ও স্মার্ট র্যাক-মাউন্ট এনার্জি স্টোরেজ সিস্টেম।",
    image: "/bettry/500_F_2090872600_mpL6CKZulRNh7R8OMe31iD00cXQpEpR7.jpg",
    alt: "LiFePO4 লিথিয়াম ব্যাটারি এনার্জি স্টোরেজ সিস্টেম",
    link: "/bn/category/lithium-batteries",
  },
];

export function CategoryDock({ locale }: CategoryDockProps) {
  const isBn = locale === "bn";
  const equipmentItems = isBn ? EQUIPMENT_ITEMS_BN : EQUIPMENT_ITEMS_EN;

  return (
    <section className="relative z-10 py-16 sm:py-24 bg-[#E4E7E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: Crisp, Executive, Professional */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <p className="text-xs sm:text-[13px] font-mono font-medium tracking-[0.2em] text-[#556350] uppercase mb-3">
            {isBn ? "কোর সোলার সলিউশন" : "Core Equipment Lineup"}
          </p>

          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-semibold tracking-[-0.03em] text-[#111311] leading-[1.18]">
            {isBn ? (
              <>
                আধুনিক শিল্পের জন্য{" "}
                <span className="text-[#345330] font-bold">টায়ার-১ সোলার সরঞ্জাম</span>
              </>
            ) : (
              <>
                A Complete Range of{" "}
                <span className="text-[#345330] font-bold">Solar Equipment</span>
              </>
            )}
          </h2>

          <p className="mt-4 text-sm sm:text-[15px] text-[#5A6355] leading-relaxed font-normal">
            {isBn
              ? "বাসাবাড়ি থেকে শুরু করে শিল্পকারখানার জন্য আসল টায়ার-১ সরঞ্জাম, নির্ভরযোগ্য কারিগরি সাপোর্ট এবং সরাসরি পাইকারি ও খুচরা মূল্য।"
              : "From single components to turnkey home and commercial systems — genuine Tier-1 equipment, dedicated engineering support, and transparent wholesale pricing."}
          </p>
        </div>

        {/* 3 Clean, Architectural Equipment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7">
          {equipmentItems.map((item, idx) => {
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: idx * 0.1, ease: "easeOut" }}
                className="group flex flex-col rounded-[28px] sm:rounded-[32px] bg-white border border-[#DCE2D8] hover:border-[#111311]/25 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgba(17,19,17,0.08)] transition-all duration-300 overflow-hidden"
              >
                <Link href={item.link} className="flex flex-col h-full">
                  
                  {/* Clean Product Stage */}
                  <div className="relative w-full h-60 sm:h-64 bg-[#F4F6F2] border-b border-[#E6EBE2] overflow-hidden flex items-center justify-center p-6">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 380px"
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-500 ease-out"
                    />

                    {/* Top Index & Arrow Controls */}
                    <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none">
                      <span className="text-[11px] font-mono font-medium text-[#5F6A5B] bg-white/90 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-[#DDE2D8]">
                        {item.categoryNumber}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs border border-[#DDE2D8] text-[#111311] group-hover:bg-[#111311] group-hover:text-white group-hover:border-[#111311] flex items-center justify-center transition-all duration-200 shadow-2xs">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>

                  {/* Card Editorial Content */}
                  <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="text-xl sm:text-[22px] font-semibold text-[#111311] tracking-tight group-hover:text-[#234224] transition-colors mb-2.5">
                        {item.title}
                      </h3>

                      <p className="text-xs sm:text-[13px] text-[#5E6759] leading-relaxed mb-6 font-normal">
                        {item.description}
                      </p>
                    </div>

                    {/* Card Footer: Spec Tag & Text Link */}
                    <div className="pt-4 border-t border-[#EEF2EC] flex items-center justify-between text-xs">
                      <span className="text-[11px] font-mono text-[#546050] font-medium truncate max-w-[65%]">
                        {item.specSummary}
                      </span>
                      <span className="inline-flex items-center gap-1 font-semibold text-[#111311] group-hover:text-[#234224] group-hover:translate-x-0.5 transition-all duration-200 shrink-0">
                        <span>{isBn ? "পণ্যসমূহ" : "Explore"}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>

                  </div>

                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA: Single, Authoritative, Executive */}
        <div className="mt-12 sm:mt-16 text-center">
          <Link
            href={isBn ? "/bn/products" : "/products"}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#111311] hover:bg-[#234224] text-white text-xs sm:text-[13px] font-semibold tracking-wide transition-colors duration-200 shadow-xs active:scale-98"
          >
            <span>{isBn ? "সকল সোলার পণ্য দেখুন" : "View All Solar Equipment"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}