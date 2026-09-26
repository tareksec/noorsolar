"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { MapPin, ArrowRight, ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";

interface BuyerSegmentationProps {
  locale?: string;
}

export function BuyerSegmentation({ locale = "en" }: BuyerSegmentationProps) {
  const isBn = locale === "bn";
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  const [scrollRange, setScrollRange] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);

  const segments = [
    {
      id: "epc",
      year: isBn ? "২০২৬ – প্রজেক্ট ইনডেন্ট ও বাল্ক সাপ্লাই" : "2026 – Project Indent & Supply",
      title: isBn ? "সোলার EPC ও ইনস্টলার" : "Solar EPCs & Installers",
      subtitle: isBn ? "কন্টেইনার ইনডেন্ট ও প্রজেক্ট ইকুইপমেন্ট" : "Container Indent & Project Supply",
      location: isBn ? "চট্টগ্রাম পোর্ট ও ঢাকা সেন্ট্রাল ডিপো" : "Chittagong Port & Dhaka Depot",
      metrics: isBn ? "১ প্যালেট থেকে মেগা-ইনডেন্ট" : "1 Pallet to Mega Indent",
      href: "/quote?segment=epc",
      image: "/photos/b2b-container-indent.webp",
    },
    {
      id: "commercial",
      year: isBn ? "২০২৬ – ফ্যাক্টরি ও বাণিজ্যিক রুফটপ" : "2025 – Commercial & Industrial",
      title: isBn ? "ইন্ডাস্ট্রিয়াল ও কমার্শিয়াল বায়ার" : "Commercial & Industrial",
      subtitle: isBn ? "হাই-ভোল্টেজ BESS ও ইনভার্টার" : "High-Voltage BESS & Inverters",
      location: isBn ? "গাজীপুর, নারায়ণগঞ্জ ও সারা দেশ" : "Nationwide Industrial Delivery",
      metrics: isBn ? "MW স্কেল হাই-ভোল্টেজ স্টোরেজ" : "MW Scale Storage Systems",
      href: "/quote?segment=commercial",
      image: "/photos/about-commercial-plant.webp",
    },
    {
      id: "resellers",
      year: isBn ? "২০২৬ – পাইকারি ডিলার নেটওয়ার্ক" : "2026 – Wholesale Dealer Network",
      title: isBn ? "সোলার ডিলার ও রিসেলার" : "Dealers & Resellers",
      subtitle: isBn ? "রেডি ডিপো স্টক ও ভলিউম মার্জিন" : "Ready Depot Stock & Margins",
      location: isBn ? "ঢাকা সেন্ট্রাল ওয়্যারহাউস হাব" : "Dhaka Central Warehouse Hub",
      metrics: isBn ? "১ প্যালেট থেকে সেন্ট্রাল ডিপো স্টক" : "1 Pallet Ready Warehouse Stock",
      href: "/quote?segment=reseller",
      image: "/photos/b2b-warehouse-stock.webp",
    },
    {
      id: "utility",
      year: isBn ? "২০২৬ – ইউটিলিটি স্কেল গ্রিড সাপ্লাই" : "2026 – Utility Scale Projects",
      title: isBn ? "ইউটিলিটি ও সোলার পার্ক" : "Utility Scale Solar Parks",
      subtitle: isBn ? "মেগা ইনডেন্ট ও সেন্ট্রাল ইনভার্টার" : "Mega Indent & Central Inverters",
      location: isBn ? "সরাসরি পোর্ট-টু-সাইট লজিস্টিকস" : "Direct Port-to-Site Logistics",
      metrics: isBn ? "টিয়ার-১ সার্টিফাইড ইকুইপমেন্ট" : "Tier-1 Certified Consignments",
      href: "/quote?segment=utility",
      image: "/photos/hero-solar-field.webp",
    },
  ];

  // Measure scrollable track width dynamically
  useEffect(() => {
    const calculateRange = () => {
      if (trackRef.current) {
        const trackWidth = trackRef.current.scrollWidth;
        const viewportWidth = window.innerWidth;
        const distance = Math.max(0, trackWidth - viewportWidth + 80);
        setScrollRange(distance);
      }
    };

    calculateRange();
    window.addEventListener("resize", calculateRange);
    return () => window.removeEventListener("resize", calculateRange);
  }, []);

  // Framer Motion pinned scroll on desktop
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 24,
    restDelta: 0.001,
  });

  const x = useTransform(smoothProgress, [0, 1], [0, -scrollRange]);

  // Update active slide based on scroll
  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      const index = Math.min(
        segments.length - 1,
        Math.floor(latest * segments.length)
      );
      setActiveSlide(index);
    });
  }, [scrollYProgress, segments.length]);

  const scrollToSlide = (index: number) => {
    if (sectionRef.current) {
      const top = sectionRef.current.offsetTop;
      const height = sectionRef.current.offsetHeight - window.innerHeight;
      const targetScroll = top + (index / (segments.length - 1)) * height;
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full bg-[#F7F8F5] text-[#17251F] overflow-clip">
      {/* ========================================================
          DESKTOP PINNED HORIZONTAL SCROLL (Solar Noor Brand Theme)
          ======================================================== */}
      <section
        ref={sectionRef}
        className="hidden md:block relative h-[280vh] w-full"
      >
        <div className="sticky top-0 h-screen w-full flex flex-col justify-between pt-8 lg:pt-10 pb-20 lg:pb-24 px-6 lg:px-12 overflow-hidden">
          {/* Top Header: Eyebrow + 2-Column Title & Description */}
          <div className="max-w-7xl mx-auto w-full shrink-0">
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-2.5 h-2.5 rounded-full border border-[#074031] flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FEBE16]" />
              </span>
              <span className="text-xs font-mono font-bold tracking-widest text-[#074031] uppercase">
                {isBn ? "আমাদের প্রজেক্ট ও সেগমেন্ট" : "Our Projects & Segments"}
              </span>
            </div>

            {/* Title & Description Row */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-12">
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black tracking-tight text-[#17251F] leading-[1.08] max-w-xl">
                {isBn ? (
                  <>
                    সম্পূর্ণ সোলার <br />
                    প্রকিউরমেন্ট সলিউশন
                  </>
                ) : (
                  <>
                    Complete Solar <br />
                    Procurement Solutions
                  </>
                )}
              </h2>

              <div className="flex items-center gap-6">
                <div className="border-l-2 border-[#FEBE16] pl-4 sm:pl-5 max-w-md">
                  <p className="text-xs sm:text-sm text-[#62706A] leading-relaxed">
                    {isBn
                      ? "বাংলাদেশের EPC ঠিকাদার, বাণিজ্যিক প্রতিষ্ঠান ও আঞ্চলিক পাইকারি ডিলারদের জন্য নির্ভরযোগ্য সোলার ইকুইপমেন্ট ও কন্টেইনার সরবরাহ।"
                      : "Everything you need to supply commercial solar installations, EPC project indents, and wholesale distribution across Bangladesh."}
                  </p>
                </div>

                {/* Arrow Controls */}
                <div className="hidden xl:flex items-center gap-2 pl-4">
                  <button
                    onClick={() => scrollToSlide(Math.max(0, activeSlide - 1))}
                    disabled={activeSlide === 0}
                    aria-label="Previous slide"
                    className="w-10 h-10 rounded-full border border-[#DCE4E0] bg-white hover:bg-[#F1F4F1] text-[#074031] disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-colors shadow-xs"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      scrollToSlide(Math.min(segments.length - 1, activeSlide + 1))
                    }
                    disabled={activeSlide === segments.length - 1}
                    aria-label="Next slide"
                    className="w-10 h-10 rounded-full border border-[#DCE4E0] bg-white hover:bg-[#F1F4F1] text-[#074031] disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-colors shadow-xs"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Cards Track (Translates horizontally with scroll) */}
          <div className="relative w-full my-auto overflow-visible">
            <motion.div
              ref={trackRef}
              style={{ x }}
              className="flex items-center gap-6 will-change-transform pl-4 lg:pl-12"
            >
              {segments.map((seg) => (
                <div
                  key={seg.id}
                  className="w-[680px] lg:w-[760px] h-[340px] lg:h-[375px] shrink-0 rounded-[28px] overflow-hidden flex flex-row bg-white border border-[#DCE4E0] shadow-2xl shadow-[#052F25]/[0.08] group"
                >
                  {/* Left Column: Signature Deep Brand Green (#074031) */}
                  <div className="w-[45%] lg:w-[44%] shrink-0 bg-gradient-to-br from-[#074031] via-[#052F25] to-[#04241C] p-6 lg:p-8 flex flex-col justify-between select-none relative overflow-hidden">
                    {/* Subtle Solar Radial Glow Overlay */}
                    <div
                      className="absolute -top-12 -left-12 w-48 h-48 rounded-full pointer-events-none opacity-20"
                      style={{
                        background: "radial-gradient(circle, #FEBE16 0%, transparent 70%)",
                      }}
                    />

                    {/* Top Tag: Solar Gold Accent */}
                    <div className="relative z-10">
                      <h4 className="text-[#FEBE16] text-xs lg:text-[13px] font-mono font-bold tracking-wider uppercase">
                        {seg.year}
                      </h4>
                    </div>

                    {/* Middle: Crisp White Title + Light Mint/Silver Subtitle */}
                    <div className="my-auto py-1.5 relative z-10">
                      <h3 className="text-2xl lg:text-[27px] font-black tracking-tight leading-tight text-white mb-1.5">
                        {seg.title}
                      </h3>
                      <p className="text-xs lg:text-sm font-medium text-white/75 leading-snug">
                        {seg.subtitle}
                      </p>

                      {/* Pill Badge */}
                      <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEBE16]/15 border border-[#FEBE16]/30 text-[#FEBE16] text-[11px] font-mono font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>{seg.metrics}</span>
                      </div>
                    </div>

                    {/* Bottom: Location & Solar Gold CTA */}
                    <div className="pt-2.5 border-t border-white/15 flex items-center justify-between gap-2 relative z-10">
                      <div className="flex items-center gap-1.5 text-white/90 text-xs lg:text-[13px] font-medium truncate">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-[#FEBE16]" />
                        <span className="truncate">{seg.location}</span>
                      </div>

                      <Link
                        href={seg.href}
                        className="w-8 h-8 rounded-full bg-[#FEBE16] hover:bg-[#E4A900] text-[#052F25] flex items-center justify-center shrink-0 transition-all shadow-md shadow-[#FEBE16]/25 group/btn"
                        title={isBn ? "কোটেশন নিন" : "Request Quote"}
                      >
                        <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover/btn:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>

                  {/* Right Column: Full-Bleed High-Res Photograph */}
                  <div className="w-[55%] lg:w-[56%] h-full relative overflow-hidden bg-[#F1F4F1]">
                    <Image
                      src={seg.image}
                      alt={seg.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(min-width: 1024px) 450px, 350px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#052F25]/40 via-transparent to-transparent opacity-60" />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Bottom Bar: Indicators & Segment Pills */}
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4 shrink-0 pt-2">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {segments.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => scrollToSlide(dotIdx)}
                  aria-label={`Jump to segment ${dotIdx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeSlide === dotIdx
                      ? "w-8 bg-[#074031]"
                      : "w-2 bg-[#DCE4E0] hover:bg-[#62706A]"
                  }`}
                />
              ))}
            </div>

            {/* Scroll Hint */}
            <p className="text-xs font-mono text-[#62706A] flex items-center gap-2">
              <span>{isBn ? "স্ক্রোল করে আরও দেখুন" : "Scroll vertically to explore"}</span>
              <span className="inline-block text-[#FEBE16] animate-pulse">→</span>
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          MOBILE / TABLET TOUCH-FRIENDLY HORIZONTAL CAROUSEL
          ======================================================== */}
      <section className="md:hidden py-12 px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full border border-[#074031] flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FEBE16]" />
            </span>
            <span className="text-xs font-mono font-bold tracking-wider text-[#074031] uppercase">
              {isBn ? "আমাদের প্রজেক্ট ও সেগমেন্ট" : "Our Projects & Segments"}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#17251F] leading-tight mb-3">
            {isBn ? "সম্পূর্ণ সোলার প্রকিউরমেন্ট সমাধান" : "Complete Solar Procurement Solutions"}
          </h2>

          <div className="border-l-2 border-[#FEBE16] pl-3">
            <p className="text-xs sm:text-sm text-[#62706A] leading-relaxed">
              {isBn
                ? "বাংলাদেশের EPC ঠিকাদার, বাণিজ্যিক প্রতিষ্ঠান ও আঞ্চলিক ডিলারদের জন্য নির্ভরযোগ্য ইকুইপমেন্ট সাপ্লাই।"
                : "Everything you need to supply commercial solar installations and regional wholesale trade."}
            </p>
          </div>
        </div>

        {/* Horizontal Swipeable Track */}
        <div
          ref={mobileScrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 scrollbar-none"
        >
          {segments.map((seg) => (
            <div
              key={seg.id}
              className="w-[88vw] max-w-[360px] shrink-0 snap-center rounded-[24px] overflow-hidden flex flex-col bg-white border border-[#DCE4E0] shadow-xl shadow-[#052F25]/[0.05]"
            >
              {/* Top: Brand Deep Green Info Panel */}
              <div className="bg-gradient-to-br from-[#074031] to-[#052F25] p-6 flex flex-col justify-between select-none">
                <h4 className="text-[#FEBE16] text-xs font-mono font-bold mb-3">{seg.year}</h4>

                <h3 className="text-xl font-black tracking-tight text-white mb-1">
                  {seg.title}
                </h3>
                <p className="text-xs font-medium text-white/75 mb-3">
                  {seg.subtitle}
                </p>

                <div className="pt-3 border-t border-white/15 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-white/90 text-xs font-medium truncate">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-[#FEBE16]" />
                    <span className="truncate">{seg.location}</span>
                  </div>

                  <Link
                    href={seg.href}
                    className="w-7 h-7 rounded-full bg-[#FEBE16] text-[#052F25] flex items-center justify-center shrink-0 shadow-xs"
                  >
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </Link>
                </div>
              </div>

              {/* Bottom: Image */}
              <div className="h-48 relative overflow-hidden bg-[#F1F4F1]">
                <Image
                  src={seg.image}
                  alt={seg.title}
                  fill
                  className="object-cover"
                  sizes="360px"
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
