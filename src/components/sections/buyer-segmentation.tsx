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

  // Measure scrollable track width dynamically across all device widths
  useEffect(() => {
    const calculateRange = () => {
      if (trackRef.current && sectionRef.current) {
        const trackWidth = trackRef.current.scrollWidth;
        const viewportWidth = window.innerWidth;
        const endPad = viewportWidth < 640 ? 24 : viewportWidth < 1024 ? 40 : 64;
        const distance = Math.max(0, trackWidth - viewportWidth + endPad);
        setScrollRange(distance);
      }
    };

    calculateRange();
    window.addEventListener("resize", calculateRange);
    const t1 = setTimeout(calculateRange, 200);
    const t2 = setTimeout(calculateRange, 800);
    return () => {
      window.removeEventListener("resize", calculateRange);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [segments.length]);

  // Framer Motion pinned scroll (works on all devices: mobile, tablet, desktop)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    mass: 0.6,
    restDelta: 0.001,
  });

  const x = useTransform(smoothProgress, [0, 1], [0, -scrollRange]);

  // Update active slide index based on scroll position
  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      const index = Math.min(
        segments.length - 1,
        Math.max(0, Math.floor(latest * segments.length + 0.15))
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

  // Touch swipe support (allows user to swipe left/right directly on touch screens)
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        scrollToSlide(Math.min(segments.length - 1, activeSlide + 1));
      } else {
        scrollToSlide(Math.max(0, activeSlide - 1));
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <section
      ref={sectionRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative h-[300vh] sm:h-[280vh] w-full bg-[#F7F8F5] text-[#17251F] overflow-clip"
    >
      <div className="sticky top-0 h-[100dvh] w-full flex flex-col justify-between pt-5 sm:pt-7 lg:pt-10 pb-5 sm:pb-8 lg:pb-12 px-4 sm:px-6 lg:px-12 overflow-hidden select-none">
        {/* Top Header: Eyebrow + Title & Description + Controls */}
        <div className="max-w-7xl mx-auto w-full shrink-0">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-1.5 sm:mb-2.5">
            <span className="w-2.5 h-2.5 rounded-full border border-[#074031] flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FEBE16]" />
            </span>
            <span className="text-[11px] sm:text-xs font-mono font-bold tracking-widest text-[#074031] uppercase">
              {isBn ? "আমাদের প্রজেক্ট ও সেগমেন্ট" : "Our Projects & Segments"}
            </span>
          </div>

          {/* Title & Description Row with Prev/Next Controls */}
          <div className="flex items-end justify-between gap-4 lg:gap-12">
            <div className="max-w-xl">
              <h2 className="text-xl sm:text-3xl lg:text-[42px] font-black tracking-tight text-[#17251F] leading-[1.1]">
                {isBn ? "সম্পূর্ণ সোলার প্রকিউরমেন্ট সলিউশন" : "Complete Solar Procurement Solutions"}
              </h2>

              <div className="hidden sm:block border-l-2 border-[#FEBE16] pl-3 sm:pl-4 mt-2">
                <p className="text-xs sm:text-sm text-[#62706A] leading-relaxed">
                  {isBn
                    ? "বাংলাদেশের EPC ঠিকাদার, বাণিজ্যিক প্রতিষ্ঠান ও আঞ্চলিক পাইকারি ডিলারদের জন্য নির্ভরযোগ্য সোলার ইকুইপমেন্ট ও কন্টেইনার সরবরাহ।"
                    : "Everything you need to supply commercial solar installations, EPC project indents, and wholesale distribution across Bangladesh."}
                </p>
              </div>
            </div>

            {/* Navigation Arrow Controls (Visible and accessible on all screen sizes) */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => scrollToSlide(Math.max(0, activeSlide - 1))}
                disabled={activeSlide === 0}
                aria-label={isBn ? "পূর্ববর্তী স্লাইড" : "Previous slide"}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#DCE4E0] bg-white hover:bg-[#F1F4F1] text-[#074031] disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-colors shadow-xs cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollToSlide(Math.min(segments.length - 1, activeSlide + 1))}
                disabled={activeSlide === segments.length - 1}
                aria-label={isBn ? "পরবর্তী স্লাইড" : "Next slide"}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#DCE4E0] bg-white hover:bg-[#F1F4F1] text-[#074031] disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-colors shadow-xs cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Cards Track (Translates horizontally with scroll & touch swipe) */}
        <div className="relative w-full my-auto overflow-visible py-2">
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex items-center gap-4 sm:gap-6 will-change-transform pl-4 sm:pl-6 lg:pl-12"
          >
            {segments.map((seg) => (
              <div
                key={seg.id}
                className="w-[84vw] max-w-[340px] sm:w-[440px] md:w-[680px] lg:w-[760px] h-[380px] sm:h-[410px] md:h-[350px] lg:h-[380px] shrink-0 rounded-[24px] sm:rounded-[28px] overflow-hidden flex flex-col md:flex-row bg-white border border-[#DCE4E0] shadow-xl md:shadow-2xl shadow-[#052F25]/[0.08] group transition-shadow"
              >
                {/* Left/Top Column: Signature Deep Brand Green (#074031) */}
                <div className="w-full md:w-[44%] shrink-0 bg-gradient-to-br from-[#074031] via-[#052F25] to-[#04241C] p-5 sm:p-6 lg:p-8 flex flex-col justify-between relative overflow-hidden text-white">
                  {/* Subtle Solar Radial Glow Overlay */}
                  <div
                    className="absolute -top-12 -left-12 w-48 h-48 rounded-full pointer-events-none opacity-20"
                    style={{
                      background: "radial-gradient(circle, #FEBE16 0%, transparent 70%)",
                    }}
                  />

                  {/* Top Tag: Solar Gold Accent + Metrics Pill */}
                  <div className="relative z-10 flex items-center justify-between gap-2">
                    <h4 className="text-[#FEBE16] text-[11px] sm:text-xs lg:text-[13px] font-mono font-bold tracking-wider uppercase">
                      {seg.year}
                    </h4>
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FEBE16]/15 border border-[#FEBE16]/30 text-[#FEBE16] text-[10px] sm:text-[11px] font-mono font-semibold">
                      <ShieldCheck className="w-3 h-3 stroke-[2.5]" />
                      <span>{seg.metrics}</span>
                    </div>
                  </div>

                  {/* Middle: Crisp White Title + Light Mint/Silver Subtitle */}
                  <div className="my-auto py-2 relative z-10">
                    <h3 className="text-xl sm:text-2xl lg:text-[27px] font-black tracking-tight leading-tight text-white mb-1.5">
                      {seg.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-white/75 leading-snug line-clamp-2">
                      {seg.subtitle}
                    </p>
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

                {/* Right/Bottom Column: Full-Bleed Photograph */}
                <div className="w-full md:w-[56%] h-44 sm:h-52 md:h-full relative overflow-hidden bg-[#F1F4F1]">
                  <Image
                    src={seg.image}
                    alt={seg.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 84vw, (min-width: 1024px) 450px, 350px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#052F25]/40 via-transparent to-transparent opacity-60" />
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom Bar: Indicators & Slide Counter */}
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4 shrink-0 pt-1">
          {/* Dots */}
          <div className="flex items-center gap-2">
            {segments.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => scrollToSlide(dotIdx)}
                aria-label={`Jump to segment ${dotIdx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  activeSlide === dotIdx
                    ? "w-7 sm:w-8 bg-[#074031]"
                    : "w-2 bg-[#DCE4E0] hover:bg-[#62706A]"
                }`}
              />
            ))}
          </div>

          {/* Slide counter & Scroll Hint */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-[#074031]">
              {activeSlide + 1} / {segments.length}
            </span>
            <p className="text-xs font-mono text-[#62706A] flex items-center gap-1.5">
              <span>{isBn ? "স্ক্রোল করে দেখুন" : "Scroll to explore"}</span>
              <span className="inline-block text-[#FEBE16] font-bold animate-pulse">→</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
