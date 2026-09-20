"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

interface ServiceCard {
  id: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  link: string;
}

const SERVICES: ServiceCard[] = [
  {
    id: "solar-supply",
    title: "Commercial Solar Supply",
    description:
      "Direct container-scale imports and bulk procurement of Tier-1 N-Type TOPCon bifacial modules sized for industrial factories and commercial EPC projects.",
    image: "/photos/story-panels.webp",
    alt: "High-efficiency monocrystalline solar panels installation in Bangladesh",
    link: "/category/solar-panels",
  },
  {
    id: "storage-systems",
    title: "Lithium Storage Systems",
    description:
      "High-voltage LiFePO4 commercial energy storage banks engineered for factory backup power, peak shaving, and zero-downtime industrial reliability.",
    image: "/photos/story-batteries.webp",
    alt: "Industrial LiFePO4 battery rack installations with smart BMS",
    link: "/category/lithium-batteries",
  },
  {
    id: "inverter-solutions",
    title: "Hybrid & Utility Inverters",
    description:
      "Three-phase commercial string and hybrid solar inverters with intelligent grid synchronization, high surge capacity, and remote telemetry monitoring.",
    image: "/photos/story-inverters.webp",
    alt: "Commercial solar hybrid inverter installation and testing",
    link: "/category/solar-inverters",
  },
];

export function ServicesSolutions() {
  const scrollRef = useRef<HTMLDivElement>(null);

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
    <section className="py-20 lg:py-28 bg-[#EDEDED] border-b border-[#DDE1DC]">
      <div className="page-shell">
        {/* Header Row: Eyebrow + Split Headline & Value Proposition */}
        <div className="mb-12 lg:mb-16">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full border-2 border-[#111311] inline-block" />
            <span className="text-xs font-mono uppercase tracking-wider text-[#111311] font-semibold">
              Services & Solutions
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-12">
            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#111311] max-w-xl leading-[1.08] uppercase">
              Complete Solar Solutions For Every Project
            </h2>

            {/* Accent Description Box */}
            <div className="border-l-2 border-[#111311] pl-4 sm:pl-5 max-w-md">
              <p className="text-xs sm:text-sm text-[#5C605C] leading-relaxed">
                Everything you need to keep your commercial solar installation running efficiently, reliably, and performing at its absolute peak.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Service Cards Grid / Carousel */}
        <div
          ref={scrollRef}
          className="flex lg:grid lg:grid-cols-3 gap-6 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-none snap-x snap-mandatory"
        >
          {SERVICES.map((item) => (
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
                    aria-label={`View ${item.title}`}
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
            aria-label="Previous service"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll("right")}
            className="w-11 h-11 rounded-full bg-white border border-[#DDE1DC] text-[#111311] hover:border-[#111311] hover:bg-[#111311] hover:text-white flex items-center justify-center transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CEF23E] cursor-pointer"
            aria-label="Next service"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
