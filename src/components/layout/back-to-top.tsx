"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { useLocale } from "next-intl";

interface BackToTopProps {
  locale?: string;
}

export function BackToTop({ locale: propLocale }: BackToTopProps) {
  let locale = propLocale;
  try {
    const nextIntlLocale = useLocale();
    if (!locale) locale = nextIntlLocale;
  } catch {
    // fallback if outside NextIntlClientProvider
  }

  const [isVisible, setIsVisible] = useState(false);

  const isBn = locale === "bn";
  const ariaLabel = isBn ? "পৃষ্ঠার শীর্ষে যান" : "Scroll to top";

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY || document.documentElement.scrollTop;
      setIsVisible(currentScrollY > 300);
    };

    // Initial check scheduled outside synchronous effect execution
    const rafId = requestAnimationFrame(handleScroll);

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={`fixed bottom-[calc(8.5rem+env(safe-area-inset-bottom,0px))] right-4 sm:bottom-20 sm:right-6 z-40 group flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#074031]/90 backdrop-blur-md text-[#FEBE16] border border-white/20 shadow-xl transition-all duration-300 hover:bg-[#0B513E] hover:border-[#FEBE16]/60 hover:shadow-[0_8px_25px_-4px_rgba(254,190,22,0.35)] hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FEBE16] ${
        isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-3 pointer-events-none"
      }`}
    >
      <ArrowUp className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-0.5 group-active:translate-y-0" />
    </button>
  );
}
