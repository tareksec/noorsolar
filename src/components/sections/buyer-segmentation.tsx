"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from "framer-motion";
import { MapPin, ArrowRight, ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";

interface BuyerSegmentationProps {
  locale?: string;
}

export function BuyerSegmentation({ locale = "bn" }: BuyerSegmentationProps) {
  const isBn = locale === "bn";
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollRange, setScrollRange] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768 ? 1150 : 1950;
    }
    return 1950;
  });

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const mouseStartX = useRef(0);
  const isMouseDragging = useRef(false);

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
      year: isBn ? "২০২৬ • প্রজেক্ট ইনডেন্ট ও বাল্ক সাপ্লাই" : "2026 • Project Indent & Supply",
      title: isBn ? "সোলার EPC ও ইনস্টলার" : "Solar EPCs & Installers",
      subtitle: isBn
        ? "সরাসরি কন্টেইনার ইনডেন্ট ও বৃহৎ মেগা প্রজেক্টের সম্পূর্ণ ইকুইপমেন্ট সমাধান।"
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

  // Dynamically calculate the horizontal scroll distance
  const updateScrollRange = useCallback(() => {
    if (trackRef.current) {
      const trackWidth = trackRef.current.scrollWidth;
      const windowWidth = window.innerWidth;
      const padding = windowWidth < 640 ? 32 : windowWidth < 1024 ? 64 : 100;
      const distance = Math.max(0, trackWidth - windowWidth + padding);
      setScrollRange(distance);
    }
  }, []);

  useEffect(() => {
    updateScrollRange();
    window.addEventListener("resize", updateScrollRange);
    const t1 = setTimeout(updateScrollRange, 150);
    const t2 = setTimeout(updateScrollRange, 600);
    const t3 = setTimeout(updateScrollRange, 1200);
    return () => {
      window.removeEventListener("resize", updateScrollRange);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [updateScrollRange]);

  // Framer Motion scroll linked animation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 95,
    damping: 24,
    mass: 0.5,
    restDelta: 0.001,
  });

  const x = useTransform(smoothProgress, [0, 1], [0, -scrollRange]);

  // Update active slide index based on scroll position
  useMotionValueEvent(smoothProgress, "change", (latest) => {
    const segmentCount = segments.length;
    const index = Math.min(
      segmentCount - 1,
      Math.max(0, Math.floor(latest * segmentCount + 0.15))
    );
    setActiveIndex(index);
  });

  // Smooth scroll to a specific slide
  const scrollToSlide = useCallback(
    (index: number) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const currentScrollY = window.scrollY || document.documentElement.scrollTop;
      const containerTop = rect.top + currentScrollY;
      const scrollableDistance = container.offsetHeight - window.innerHeight;

      const targetProgress = index / (segments.length - 1);
      const targetScrollY = containerTop + targetProgress * scrollableDistance;

      const win = window as unknown as { lenis?: { scrollTo: (target: number) => void } };
      if (win.lenis && typeof win.lenis.scrollTo === "function") {
        win.lenis.scrollTo(targetScrollY);
      } else {
        window.scrollTo({
          top: targetScrollY,
          behavior: "smooth",
        });
      }
      setActiveIndex(index);
    },
    [segments.length]
  );

  const handleArrowNav = (direction: "left" | "right") => {
    const nextIndex =
      direction === "left"
        ? Math.max(0, activeIndex - 1)
        : Math.min(segments.length - 1, activeIndex + 1);
    scrollToSlide(nextIndex);
  };

  // Auto-scroll active tab into view on mobile
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

  // Mobile horizontal swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      if (deltaX < 0) {
        if (activeIndex < segments.length - 1) scrollToSlide(activeIndex + 1);
      } else {
        if (activeIndex > 0) scrollToSlide(activeIndex - 1);
      }
    }
  };

  // Desktop mouse drag gestures
  const handleMouseDown = (e: React.MouseEvent) => {
    isMouseDragging.current = true;
    mouseStartX.current = e.clientX;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isMouseDragging.current) return;
    isMouseDragging.current = false;
    const deltaX = e.clientX - mouseStartX.current;
    if (Math.abs(deltaX) > 50) {
      if (deltaX < 0) {
        if (activeIndex < segments.length - 1) scrollToSlide(activeIndex + 1);
      } else {
        if (activeIndex > 0) scrollToSlide(activeIndex - 1);
      }
    }
  };

  return (
    <div ref={containerRef} className="relative h-[260vh] bg-[#F7F8F5] text-[#17251F]">
      {/* ========================================================
          STICKY FULL-VIEWPORT FRAME (100dvh)
          ======================================================== */}
      <div className="sticky top-0 h-[100dvh] w-full flex flex-col justify-between overflow-hidden py-3 sm:py-5 lg:py-6 px-4 sm:px-6 lg:px-8 border-b border-[#DCE4E0]">
        <div className="max-w-7xl mx-auto w-full shrink-0">
          {/* ========================================================
              SECTION HEADER
              ======================================================== */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 lg:gap-8 mb-4 sm:mb-6">
            <div>
              {/* Eyebrow */}
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2.5 h-2.5 rounded-full border border-[#074031] flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FEBE16]" />
                </span>
                <span className="text-xs font-mono font-bold tracking-widest text-[#074031] uppercase">
                  {isBn ? "আমাদের প্রজেক্ট ও সেগমেন্ট" : "Our Projects & Segments"}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl lg:text-[38px] font-black tracking-tight text-[#17251F] leading-[1.1]">
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

            {/* Right: Description & Arrows */}
            <div className="flex flex-col sm:flex-row sm:items-center lg:items-end gap-4 lg:gap-6">
              <div className="border-l-2 border-[#FEBE16] pl-3.5 max-w-md hidden sm:block">
                <p className="text-xs sm:text-sm text-[#62706A] leading-relaxed">
                  {isBn
                    ? "বাংলাদেশের EPC কন্ট্রাক্টর, বাণিজ্যিক কারখানা ও পাইকারি ডিলারদের জন্য বিশ্বস্ত সোলার ইকুইপমেন্ট ও সরাসরি কন্টেইনার সরবরাহ।"
                    : "Reliable tier-1 equipment supply, container indents, and wholesale logistics across Bangladesh."}
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
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#DCE4E0] bg-white hover:bg-[#F1F4F1] text-[#074031] disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleArrowNav("right")}
                    disabled={activeIndex === segments.length - 1}
                    aria-label={isBn ? "পরবর্তী সেগমেন্ট" : "Next segment"}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#DCE4E0] bg-white hover:bg-[#F1F4F1] text-[#074031] disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              ANIMATED TAB PILLS — with Framer Motion layoutId spring
              ======================================================== */}
          <div
            ref={tabsContainerRef}
            className="mb-3 sm:mb-5 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            <div className="inline-flex items-center gap-1 sm:gap-2 p-1 rounded-full bg-white border border-[#DCE4E0] shadow-xs">
              {segments.map((seg, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <button
                    key={seg.id}
                    type="button"
                    onClick={() => scrollToSlide(idx)}
                    className={`relative shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-200 cursor-pointer ${
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
          </div>
        </div>

        {/* ========================================================
            HORIZONTAL SCROLL TRACK (Framer Motion style={{ x }})
            ======================================================== */}
        <div className="relative w-full my-auto overflow-visible select-none">
          <motion.div
            ref={trackRef}
            style={{ x }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            className="flex items-center gap-4 sm:gap-6 lg:gap-8 will-change-transform pl-4 sm:pl-8 lg:pl-16 cursor-grab active:cursor-grabbing"
          >
            {segments.map((seg, idx) => {
              const isActive = activeIndex === idx;

              return (
                <div key={seg.id} data-segment-card className="shrink-0">
                  {/* ============================================
                      DESKTOP CARD (>= 768px): 2-Column Poster
                      ============================================ */}
                  <motion.div
                    animate={{
                      scale: isActive ? 1 : 0.95,
                      opacity: isActive ? 1 : 0.72,
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    className="hidden md:flex flex-row w-[680px] lg:w-[780px] h-[330px] lg:h-[360px] rounded-[26px] overflow-hidden bg-white border group transition-shadow duration-300"
                    style={{
                      borderColor: isActive ? "rgba(7,64,49,0.35)" : "#DCE4E0",
                      boxShadow: isActive
                        ? "0 22px 50px -12px rgba(5,47,37,0.22), 0 0 0 2px #FEBE16"
                        : "0 4px 16px -4px rgba(5,47,37,0.06)",
                    }}
                  >
                    {/* Left Column */}
                    <div className="w-[46%] bg-gradient-to-br from-[#074031] via-[#052F25] to-[#04241C] p-5 lg:p-7 flex flex-col justify-between text-white relative overflow-hidden">
                      <div
                        className="absolute -top-14 -left-14 w-44 h-44 rounded-full pointer-events-none opacity-20"
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
                        <h3 className="text-xl lg:text-[24px] font-black tracking-tight text-white leading-tight mb-2">
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

                      <div className="relative z-10 pt-2.5 border-t border-white/15 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-white/85 text-xs font-medium truncate">
                          <MapPin className="w-3.5 h-3.5 shrink-0 text-[#FEBE16]" />
                          <span className="truncate">{seg.location}</span>
                        </div>

                        <Link
                          href={seg.href}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FEBE16] hover:bg-[#E4A900] text-[#052F25] text-xs font-bold transition-all shadow-md shadow-[#FEBE16]/25 group/btn cursor-pointer shrink-0"
                        >
                          <span>{isBn ? "কোটেশন নিন" : "Get Quote"}</span>
                          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5] group-hover/btn:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>

                    {/* Right Column: High-Res Photography */}
                    <div className="w-[54%] h-full relative overflow-hidden bg-[#F1F4F1]">
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
                      MOBILE CARD (< 768px): Rich Vertical Layout
                      ============================================ */}
                  <motion.div
                    animate={{
                      scale: isActive ? 1 : 0.95,
                      opacity: isActive ? 1 : 0.8,
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    className="flex md:hidden flex-col w-[86vw] max-w-[340px] h-[330px] rounded-[22px] overflow-hidden bg-white border transition-shadow duration-300"
                    style={{
                      borderColor: isActive ? "rgba(7,64,49,0.3)" : "#DCE4E0",
                      boxShadow: isActive
                        ? "0 16px 40px -10px rgba(5,47,37,0.18), 0 0 0 2px #FEBE16"
                        : "0 2px 10px -2px rgba(5,47,37,0.05)",
                    }}
                  >
                    {/* Top Image Banner */}
                    <div className="relative h-[155px] w-full overflow-hidden bg-[#F1F4F1] shrink-0">
                      <Image
                        src={seg.image}
                        alt={seg.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 86vw, 340px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#052F25]/85 via-[#052F25]/25 to-transparent" />

                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-[#052F25]/85 backdrop-blur-md border border-white/20 text-[#FEBE16] text-[10px] font-mono font-bold tracking-wider uppercase">
                          {seg.badge}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#FEBE16] text-[#052F25] text-[10px] font-mono font-bold shadow-xs">
                          {seg.metrics}
                        </span>
                      </div>

                      <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center gap-1.5 text-white text-[11px] font-medium drop-shadow-sm truncate">
                        <MapPin className="w-3 h-3 text-[#FEBE16] shrink-0" />
                        <span className="truncate">{seg.location}</span>
                      </div>
                    </div>

                    {/* Bottom Card Body */}
                    <div className="p-3.5 flex flex-col justify-between flex-1 bg-white">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-[#074031] uppercase tracking-wider block mb-1">
                          {seg.year}
                        </span>
                        <h3 className="text-base font-black tracking-tight text-[#17251F] leading-snug mb-1">
                          {seg.title}
                        </h3>
                        <p className="text-[11px] text-[#62706A] leading-relaxed line-clamp-2">
                          {seg.subtitle}
                        </p>
                      </div>

                      <Link
                        href={seg.href}
                        className="w-full py-2 px-3 rounded-lg bg-[#074031] hover:bg-[#0B513E] active:bg-[#04241C] text-white flex items-center justify-center gap-1.5 text-xs font-bold transition-colors shadow-xs cursor-pointer mt-2"
                      >
                        <span>{isBn ? "কোটেশন নিন" : "Request Quote"}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#FEBE16] stroke-[2.5]" />
                      </Link>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* ========================================================
            BOTTOM PAGINATION DOTS & SCROLL HINT
            ======================================================== */}
        <div className="max-w-7xl mx-auto w-full shrink-0 flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            {segments.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => scrollToSlide(dotIdx)}
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
            <span>{isBn ? "স্ক্রোল বা সোয়াইপ করুন" : "Scroll or swipe"}</span>
            <span className="text-[#FEBE16] font-bold">→</span>
          </p>
        </div>
      </div>
    </div>
  );
}
