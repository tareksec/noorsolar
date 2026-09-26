"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";

interface BuyerSegmentationProps {
  locale?: string;
}

/* ------------------------------------------------------------------ */
/*  Shared transition presets                                          */
/* ------------------------------------------------------------------ */
const smoothEase = [0.22, 1, 0.36, 1] as const;

export function BuyerSegmentation({ locale = "bn" }: BuyerSegmentationProps) {
  const isBn = locale === "bn";
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);

  const toBnNumber = (num: number) => {
    if (!isBn) return num < 10 ? `0${num}` : `${num}`;
    const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num.toString().replace(/\d/g, (d) => bnDigits[parseInt(d, 10)]);
  };

  const segments = [
    {
      id: "epc",
      tabLabel: isBn ? "সোলার EPC" : "Solar EPC",
      badge: isBn ? "বাল্ক ইনডেন্ট" : "Bulk Indent",
      year: isBn ? "২০২৬ • প্রজেক্ট ইনডেন্ট ও বাল্ক সাপ্লাই" : "2026 • Project Indent & Bulk Supply",
      title: isBn ? "সোলার EPC ও ইনস্টলার" : "Solar EPCs & Installers",
      subtitle: isBn
        ? "সরাসরি কন্টেইনার ইনডেন্ট ও বৃহৎ প্রজেক্টের সম্পূর্ণ ইকুইপমেন্ট সমাধান।"
        : "Direct container indents and end-to-end solar project supply.",
      location: isBn ? "চট্টগ্রাম পোর্ট ও ঢাকা সেন্ট্রাল ডিপো" : "Chittagong Port & Dhaka Central Depot",
      metrics: isBn ? "১ প্যালেট থেকে মেগা-ইনডেন্ট" : "1 Pallet to Mega Indent",
      href: "/quote?segment=epc",
      image: "/photos/b2b-container-indent.webp",
    },
    {
      id: "commercial",
      tabLabel: isBn ? "ইন্ডাস্ট্রিয়াল" : "Commercial",
      badge: isBn ? "ফ্যাক্টরি ও রুফটপ" : "Factory & Rooftop",
      year: isBn ? "২০২৬ • ফ্যাক্টরি ও বাণিজ্যিক রুফটপ" : "2026 • Commercial & Industrial",
      title: isBn ? "ইন্ডাস্ট্রিয়াল ও কমার্শিয়াল বায়ার" : "Commercial & Industrial Buyers",
      subtitle: isBn
        ? "হাই-ভোল্টেজ BESS ব্যাটারি স্টোরেজ ও বাণিজ্যিক হাইব্রিড ইনভার্টার।"
        : "High-voltage BESS battery storage & commercial hybrid inverters.",
      location: isBn ? "গাজীপুর, নারায়ণগঞ্জ ও সারা দেশ" : "Gazipur, Narayanganj & Nationwide",
      metrics: isBn ? "MW স্কেল হাই-ভোল্টেজ স্টোরেজ" : "MW Scale Storage Systems",
      href: "/quote?segment=commercial",
      image: "/photos/about-commercial-plant.webp",
    },
    {
      id: "resellers",
      tabLabel: isBn ? "ডিলার ও রিসেলার" : "Dealers",
      badge: isBn ? "ডিপো স্টক" : "Depot Stock",
      year: isBn ? "২০২৬ • পাইকারি ডিলার নেটওয়ার্ক" : "2026 • Wholesale Dealer Network",
      title: isBn ? "সোলার ডিলার ও রিসেলার" : "Dealers & Resellers",
      subtitle: isBn
        ? "রেডি ডিপো স্টক, দ্রুততম ডেলিভারি ও সেরা পাইকারি মার্জিন সুবিধা।"
        : "Ready central warehouse stock, prompt delivery, and wholesale margins.",
      location: isBn ? "ঢাকা সেন্ট্রাল ওয়্যারহাউস হাব" : "Dhaka Central Warehouse Hub",
      metrics: isBn ? "রেডি স্টক থেকে তাৎক্ষণিক ডেলিভারি" : "Ready Warehouse Stock Delivery",
      href: "/quote?segment=reseller",
      image: "/photos/b2b-warehouse-stock.webp",
    },
    {
      id: "utility",
      tabLabel: isBn ? "ইউটিলিটি পার্ক" : "Utility Scale",
      badge: isBn ? "গ্রিড স্কেল" : "Grid Scale",
      year: isBn ? "২০২৬ • ইউটিলিটি স্কেল গ্রিড সাপ্লাই" : "2026 • Utility Scale Grid Supply",
      title: isBn ? "ইউটিলিটি ও সোলার পার্ক" : "Utility Scale Solar Parks",
      subtitle: isBn
        ? "মেগা ইনডেন্ট, সেন্ট্রাল ইনভার্টার ও সরাসরি পোর্ট-টু-সাইট লজিস্টিকস।"
        : "Mega indent, central inverters, and direct port-to-site logistics.",
      location: isBn ? "সরাসরি পোর্ট-টু-সাইট ডেলিভারি" : "Direct Port-to-Site Logistics",
      metrics: isBn ? "টিয়ার-১ সার্টিফাইড ইকুইপমেন্ট" : "Tier-1 Certified Consignments",
      href: "/quote?segment=utility",
      image: "/photos/hero-solar-field.webp",
    },
  ];

  // Scroll to a specific card smoothly and center it
  const scrollToCard = useCallback((index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cards = container.querySelectorAll<HTMLElement>("[data-segment-card]");
    if (cards[index]) {
      const targetCard = cards[index];
      const containerRect = container.getBoundingClientRect();
      const cardRect = targetCard.getBoundingClientRect();

      const offset =
        targetCard.offsetLeft - container.offsetLeft - (containerRect.width - cardRect.width) / 2;

      container.scrollTo({
        left: Math.max(0, offset),
        behavior: "smooth",
      });
      setActiveIndex(index);
    }
  }, []);

  const handleArrowNav = (direction: "left" | "right") => {
    const nextIndex =
      direction === "left"
        ? Math.max(0, activeIndex - 1)
        : Math.min(segments.length - 1, activeIndex + 1);
    scrollToCard(nextIndex);
  };

  // Sync activeIndex with scroll position using RAF for ultra-smooth updates
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let rafId: number;
    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!container) return;
        const cards = container.querySelectorAll<HTMLElement>("[data-segment-card]");
        if (!cards.length) return;

        const containerRect = container.getBoundingClientRect();
        const containerMid = containerRect.left + containerRect.width / 2;

        let closestIndex = 0;
        let minDiff = Infinity;

        cards.forEach((card, idx) => {
          const cardRect = card.getBoundingClientRect();
          const cardMid = cardRect.left + cardRect.width / 2;
          const diff = Math.abs(containerMid - cardMid);
          if (diff < minDiff) {
            minDiff = diff;
            closestIndex = idx;
          }
        });

        setActiveIndex((prev) => (prev !== closestIndex ? closestIndex : prev));
      });
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Desktop mouse drag to scroll
  const handleMouseDown = (e: React.MouseEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = e.pageX - container.offsetLeft;
    scrollLeftRef.current = container.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const container = scrollContainerRef.current;
    if (!container) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startXRef.current) * 1.4;
    if (Math.abs(walk) > 6) {
      hasMovedRef.current = true;
    }
    container.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  // Auto-scroll tab into view on mobile when activeIndex changes
  useEffect(() => {
    const tabsContainer = tabsContainerRef.current;
    if (!tabsContainer) return;
    const tabWrapper = tabsContainer.firstElementChild as HTMLElement;
    if (!tabWrapper) return;
    const activeTabBtn = tabWrapper.children[activeIndex] as HTMLElement;
    if (activeTabBtn) {
      const targetScroll =
        activeTabBtn.offsetLeft - (tabsContainer.offsetWidth - activeTabBtn.offsetWidth) / 2;
      tabsContainer.scrollTo({
        left: Math.max(0, targetScroll),
        behavior: "smooth",
      });
    }
  }, [activeIndex]);

  return (
    <section className="py-14 sm:py-20 lg:py-24 bg-[#F7F8F5] text-[#17251F] border-b border-[#DCE4E0] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========================================================
            SECTION HEADER — Entrance animation
            ======================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: smoothEase }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-12 mb-8 sm:mb-10"
        >
          <div>
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-2.5 h-2.5 rounded-full border border-[#074031] flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FEBE16]" />
              </span>
              <span className="text-xs font-mono font-bold tracking-widest text-[#074031] uppercase">
                {isBn ? "আমাদের প্রজেক্ট ও সেগমেন্ট" : "Our Projects & Segments"}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-4xl lg:text-[40px] font-black tracking-tight text-[#17251F] leading-[1.12]">
              {isBn ? (
                <>
                  সম্পূর্ণ সোলার <br className="hidden sm:inline" />
                  প্রকিউরমেন্ট সলিউশন
                </>
              ) : (
                <>
                  Complete Solar <br className="hidden sm:inline" />
                  Procurement Solutions
                </>
              )}
            </h2>
          </div>

          {/* Right Description & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center lg:items-end gap-5 lg:gap-8">
            <div className="border-l-2 border-[#FEBE16] pl-4 max-w-md">
              <p className="text-xs sm:text-sm text-[#62706A] leading-relaxed">
                {isBn
                  ? "বাংলাদেশের EPC কন্ট্রাক্টর, বাণিজ্যিক কারখানা ও পাইকারি ডিলারদের জন্য বিশ্বস্ত সোলার ইকুইপমেন্ট ও সরাসরি কন্টেইনার সরবরাহ।"
                  : "Reliable tier-1 equipment supply, container indents, and wholesale logistics for contractors and solar businesses in Bangladesh."}
              </p>
            </div>

            {/* Prev / Next Buttons & Counter */}
            <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
              <span className="text-xs font-mono font-semibold text-[#62706A]">
                <strong className="text-[#074031] text-sm">{toBnNumber(activeIndex + 1)}</strong> /{" "}
                {toBnNumber(segments.length)}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleArrowNav("left")}
                  disabled={activeIndex === 0}
                  aria-label={isBn ? "পূর্ববর্তী সেগমেন্ট" : "Previous segment"}
                  className="w-9 h-9 rounded-full border border-[#DCE4E0] bg-white hover:bg-[#F1F4F1] text-[#074031] disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                </button>
                <button
                  type="button"
                  onClick={() => handleArrowNav("right")}
                  disabled={activeIndex === segments.length - 1}
                  aria-label={isBn ? "পরবর্তী সেগমেন্ট" : "Next segment"}
                  className="w-9 h-9 rounded-full border border-[#DCE4E0] bg-white hover:bg-[#F1F4F1] text-[#074031] disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ========================================================
            ANIMATED TAB PILLS — with Framer Motion layoutId spring
            ======================================================== */}
        <motion.div
          ref={tabsContainerRef}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: smoothEase, delay: 0.1 }}
          className="mb-6 sm:mb-8 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          <div className="inline-flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-full bg-white border border-[#DCE4E0] shadow-xs">
            {segments.map((seg, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={seg.id}
                  type="button"
                  onClick={() => scrollToCard(idx)}
                  className={`relative shrink-0 px-3.5 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                    isActive ? "text-[#052F25] font-bold" : "text-[#62706A] hover:text-[#17251F]"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeSegmentPill"
                      className="absolute inset-0 rounded-full bg-[#FEBE16] shadow-sm shadow-[#FEBE16]/25"
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                    <span
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        isActive ? "bg-[#074031]" : "bg-[#62706A]/40"
                      }`}
                    />
                    <span>{seg.tabLabel}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* ========================================================
          HORIZONTAL SHOWCASE TRACK — Framer Motion Animated Cards
          ======================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6, ease: smoothEase, delay: 0.15 }}
        className="w-full relative"
      >
        <div
          ref={scrollContainerRef}
          data-lenis-prevent
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-x pan-y" }}
          className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory px-4 sm:px-6 lg:px-[calc((100vw-1280px)/2+2rem)] pb-4 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing select-none"
        >
          {segments.map((seg, idx) => {
            const isActive = activeIndex === idx;

            return (
              <div
                key={seg.id}
                data-segment-card
                className="shrink-0 snap-center"
              >
                {/* ============================================
                    DESKTOP CARD (>= 768px): 2-column poster
                    ============================================ */}
                <motion.div
                  animate={{
                    scale: isActive ? 1 : 0.96,
                    opacity: isActive ? 1 : 0.78,
                  }}
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  className="hidden md:flex flex-row w-[700px] lg:w-[800px] h-[360px] lg:h-[380px] rounded-[28px] overflow-hidden bg-white border group transition-shadow duration-300"
                  style={{
                    borderColor: isActive ? "rgba(7,64,49,0.35)" : "#DCE4E0",
                    boxShadow: isActive
                      ? "0 22px 50px -12px rgba(5,47,37,0.2), 0 0 0 1.5px rgba(254,190,22,0.65)"
                      : "0 4px 16px -4px rgba(5,47,37,0.06)",
                  }}
                >
                  {/* Left Column */}
                  <div className="w-[48%] bg-gradient-to-br from-[#074031] via-[#052F25] to-[#04241C] p-6 lg:p-7 flex flex-col justify-between text-white relative overflow-hidden select-none">
                    <div
                      className="absolute -top-14 -left-14 w-48 h-48 rounded-full pointer-events-none opacity-20"
                      style={{
                        background: "radial-gradient(circle, #FEBE16 0%, transparent 70%)",
                      }}
                    />

                    <div className="relative z-10 flex items-center justify-between gap-2">
                      <span className="text-[#FEBE16] text-xs font-mono font-bold tracking-wider uppercase">
                        {seg.year}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#FEBE16]/15 border border-[#FEBE16]/30 text-[#FEBE16] text-[10px] font-mono font-semibold">
                        {seg.badge}
                      </span>
                    </div>

                    <div className="relative z-10 my-auto py-1">
                      <h3 className="text-2xl lg:text-[25px] font-black tracking-tight text-white leading-tight mb-2">
                        {seg.title}
                      </h3>
                      <p className="text-xs lg:text-sm text-white/80 leading-relaxed mb-3">
                        {seg.subtitle}
                      </p>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/90 text-xs font-mono">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#FEBE16]" />
                        <span>{seg.metrics}</span>
                      </div>
                    </div>

                    <div className="relative z-10 pt-3 border-t border-white/15 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-white/85 text-xs font-medium truncate">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-[#FEBE16]" />
                        <span className="truncate">{seg.location}</span>
                      </div>

                      <Link
                        href={seg.href}
                        onClick={(e) => {
                          if (hasMovedRef.current) e.preventDefault();
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FEBE16] hover:bg-[#E4A900] text-[#052F25] text-xs font-bold transition-all shadow-md shadow-[#FEBE16]/25 group/btn cursor-pointer shrink-0"
                      >
                        <span>{isBn ? "কোটেশন নিন" : "Get Quote"}</span>
                        <ArrowRight className="w-3.5 h-3.5 stroke-[2.5] group-hover/btn:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>

                  {/* Right Column: Photo */}
                  <div className="w-[52%] h-full relative overflow-hidden bg-[#F1F4F1]">
                    <Image
                      src={seg.image}
                      alt={seg.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      sizes="(min-width: 1024px) 450px, 380px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#052F25]/45 via-transparent to-transparent opacity-60" />
                  </div>
                </motion.div>

                {/* ============================================
                    MOBILE CARD (< 768px): Vertical layout
                    ============================================ */}
                <motion.div
                  animate={{
                    scale: isActive ? 1 : 0.95,
                    opacity: isActive ? 1 : 0.85,
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  className="flex md:hidden flex-col w-[84vw] max-w-[340px] rounded-[24px] overflow-hidden bg-white border transition-shadow duration-300"
                  style={{
                    borderColor: isActive ? "rgba(7,64,49,0.3)" : "#DCE4E0",
                    boxShadow: isActive
                      ? "0 16px 40px -10px rgba(5,47,37,0.18), 0 0 0 1.5px rgba(254,190,22,0.6)"
                      : "0 2px 10px -2px rgba(5,47,37,0.05)",
                  }}
                >
                  {/* Image Banner */}
                  <div className="relative h-44 w-full overflow-hidden bg-[#F1F4F1]">
                    <Image
                      src={seg.image}
                      alt={seg.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 84vw, 340px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#052F25]/85 via-[#052F25]/25 to-transparent" />

                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-[#052F25]/85 backdrop-blur-md border border-white/20 text-[#FEBE16] text-[10px] font-mono font-bold tracking-wider uppercase">
                        {seg.badge}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-[#FEBE16] text-[#052F25] text-[10px] font-mono font-bold shadow-xs">
                        {seg.metrics}
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center gap-1.5 text-white text-[11px] font-medium drop-shadow-sm truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#FEBE16] shrink-0" />
                      <span className="truncate">{seg.location}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 bg-white">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-[#074031] uppercase tracking-wider block mb-1">
                        {seg.year}
                      </span>
                      <h3 className="text-lg font-black tracking-tight text-[#17251F] leading-snug mb-1.5">
                        {seg.title}
                      </h3>
                      <p className="text-xs text-[#62706A] leading-relaxed mb-4">
                        {seg.subtitle}
                      </p>
                    </div>

                    <Link
                      href={seg.href}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#074031] hover:bg-[#0B513E] active:bg-[#04241C] text-white flex items-center justify-center gap-2 text-xs font-bold transition-colors shadow-xs cursor-pointer"
                    >
                      <span>{isBn ? "কোটেশন নিন" : "Request Quote"}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#FEBE16] stroke-[2.5]" />
                    </Link>
                  </div>
                </motion.div>
              </div>
            );
          })}
          <div className="w-2 shrink-0" aria-hidden="true" />
        </div>
      </motion.div>

      {/* ========================================================
          BOTTOM PAGINATION DOTS & HINT
          ======================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4, ease: "easeOut" as const, delay: 0.25 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          {segments.map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              onClick={() => scrollToCard(dotIdx)}
              aria-label={`Jump to segment ${dotIdx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === dotIdx
                  ? "w-8 bg-[#074031]"
                  : "w-2 bg-[#DCE4E0] hover:bg-[#62706A]"
              }`}
            />
          ))}
        </div>

        <p className="text-xs font-mono text-[#62706A] flex items-center gap-1.5">
          <span>{isBn ? "সোয়াইপ করে সম্পূর্ণ দেখুন" : "Swipe to explore all"}</span>
          <span className="text-[#FEBE16] font-bold">→</span>
        </p>
      </motion.div>
    </section>
  );
}
