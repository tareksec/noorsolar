"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

interface ServiceCard {
  id: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  link: string;
}

interface ServicesSolutionsProps {
  locale?: string;
}

export function ServicesSolutions({ locale }: ServicesSolutionsProps = {}) {
  const pathname = usePathname() || "";
  const isBn = locale === "bn" || pathname.startsWith("/bn/") || pathname === "/bn";
  const scrollRef = useRef<HTMLDivElement>(null);

  const services: ServiceCard[] = [
    {
      id: "solar-supply",
      title: isBn ? "বাণিজ্যিক সোলার সরবরাহ" : "Commercial Solar Supply",
      description: isBn
        ? "শিল্প কারখানা ও বাণিজ্যিক EPC প্রকল্পের জন্য টায়ার-১ এন-টাইপ TOPCon বাইফেসিয়াল মডিউলের সরাসরি কন্টেইনার আমদানি ও পাইকারি সংগ্রহ।"
        : "Direct container-scale imports and bulk procurement of Tier-1 N-Type TOPCon bifacial modules sized for industrial factories and commercial EPC projects.",
      image: "/solar-images/solar-panels-arranged-in-a-grid-pattern-on-a-clean-surface-under-bright-lighting-photo.jpeg",
      alt: isBn ? "বাংলাদেশে উচ্চ-দক্ষতাসম্পন্ন সোলার প্যানেল ইনস্টলেশন" : "High-efficiency monocrystalline solar panels installation in Bangladesh",
      link: "/category/solar-panels",
    },
    {
      id: "storage-systems",
      title: isBn ? "লিথিয়াম এনার্জি স্টোরেজ" : "Lithium Storage Systems",
      description: isBn
        ? "কারখানার ব্যাকআপ বিদ্যুৎ, পিক শেভিং এবং নিরবচ্ছিন্ন উৎপাদনের জন্য নির্মিত হাই-ভোল্টেজ LiFePO4 বাণিজ্যিক এনার্জি স্টোরেজ ব্যাংক।"
        : "High-voltage LiFePO4 commercial energy storage banks engineered for factory backup power, peak shaving, and zero-downtime industrial reliability.",
      image: "/bettry/500_F_2090872523_bLZOG1F2Gbz4TsCdhboiXNUezn7dTZZI.jpg",
      alt: isBn ? "স্মার্ট BMS সহ ইন্ডাস্ট্রিয়াল LiFePO4 ব্যাটারি রেক" : "Industrial LiFePO4 battery rack installations with smart BMS",
      link: "/category/lithium-batteries",
    },
    {
      id: "inverter-solutions",
      title: isBn ? "হাইব্রিড ও ইউটিলিটি ইনভার্টার" : "Hybrid & Utility Inverters",
      description: isBn
        ? "ইন্টেলিজেন্ট গ্রিড সিনক্রোনাইজেশন, উচ্চ সার্জ ক্ষমতা এবং দূরবর্তী টেলিমেট্রি মনিটরিং সুবিধাসহ থ্রি-ফেজ কমার্শিয়াল স্ট্রিং ও হাইব্রিড ইনভার্টার।"
        : "Three-phase commercial string and hybrid solar inverters with intelligent grid synchronization, high surge capacity, and remote telemetry monitoring.",
      image: "/Inverter/white-inverter-of-solar-cell-power-generation-system.jpg",
      alt: isBn ? "বাণিজ্যিক সোলার হাইব্রিড ইনভার্টার ইনস্টলেশন ও পরীক্ষা" : "Commercial solar hybrid inverter installation and testing",
      link: "/category/solar-inverters",
    },
  ];

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = 380;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section id="services" className="pt-16 lg:pt-24 pb-8 lg:pb-10 bg-[#EDEDED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Row: Eyebrow + Split Headline & Value Proposition */}
        <div className="mb-12 lg:mb-16">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full border-2 border-[#111311] inline-block" />
            <span className="text-xs font-mono uppercase tracking-wider text-[#111311] font-semibold">
              {isBn ? "সেবা ও সমাধান" : "Services & Solutions"}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-12">
            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#111311] max-w-xl leading-[1.08] uppercase">
              {isBn ? "প্রতিটি প্রকল্পের জন্য পূর্ণাঙ্গ সোলার সমাধান" : "Complete Solar Solutions For Every Project"}
            </h2>

            {/* Accent Description Box */}
            <div className="border-l-2 border-[#111311] pl-4 sm:pl-5 max-w-md">
              <p className="text-xs sm:text-sm text-[#5C605C] leading-relaxed">
                {isBn
                  ? "আপনার বাণিজ্যিক সোলার ইনস্টলেশন দক্ষ, নির্ভরযোগ্য এবং সর্বোচ্চ উৎপাদনে চালু রাখতে প্রয়োজনীয় সবকিছু।"
                  : "Everything you need to keep your commercial solar installation running efficiently, reliably, and performing at its absolute peak."}
              </p>
            </div>
          </div>
        </div>

        {/* 3 Service Cards Grid / Carousel */}
        <div
          ref={scrollRef}
          className="flex lg:grid lg:grid-cols-3 gap-6 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-none snap-x snap-mandatory"
        >
          {services.map((item) => (
            <div
              key={item.id}
              className="w-[300px] sm:w-[350px] lg:w-auto shrink-0 snap-start bg-white rounded-[28px] p-6 sm:p-7 border border-[#DDE1DC] shadow-xs hover:border-[#111311] transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111311]">
                    {item.title}
                  </h3>
                  <Link
                    href={item.link}
                    className="p-2 rounded-full bg-[#EDEDED] text-[#111311] group-hover:bg-[#CEF23E] transition-colors shrink-0"
                    aria-label={isBn ? `${item.title} দেখুন` : `View ${item.title}`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
                <p className="text-xs sm:text-[13px] text-[#5C605C] leading-relaxed mb-6 line-clamp-3">
                  {item.description}
                </p>
              </div>

              {/* Card Photo Below Text */}
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#E4E7E4]">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 300px, (max-width: 1024px) 350px, 400px"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Navigation Arrows (Desktop & Mobile) */}
        <div className="flex items-center justify-end gap-3 mt-8">
          <button
            onClick={() => handleScroll("left")}
            className="w-11 h-11 rounded-full bg-white border border-[#DDE1DC] text-[#111311] hover:border-[#111311] hover:bg-[#111311] hover:text-white flex items-center justify-center transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CEF23E] cursor-pointer"
            aria-label={isBn ? "পূর্ববর্তী সমাধান" : "Previous service"}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll("right")}
            className="w-11 h-11 rounded-full bg-white border border-[#DDE1DC] text-[#111311] hover:border-[#111311] hover:bg-[#111311] hover:text-white flex items-center justify-center transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CEF23E] cursor-pointer"
            aria-label={isBn ? "পরবর্তী সমাধান" : "Next service"}
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
