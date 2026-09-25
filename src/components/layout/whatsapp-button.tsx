"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { useLocale } from "next-intl";

interface WhatsAppButtonProps {
  phone?: string;
  locale?: string;
}

export function WhatsAppButton({ phone = "8801884611888", locale: propLocale }: WhatsAppButtonProps) {
  let locale = propLocale;
  try {
    const nextIntlLocale = useLocale();
    if (!locale) locale = nextIntlLocale;
  } catch {
    // fallback if outside NextIntlClientProvider
  }

  const isBn = locale === "bn";
  const prefill = isBn
    ? "আসসালামু আলাইকুম নূর সোলার এনার্জি, আমি সোলার সামগ্রী ও পাইকারি মূল্য সম্পর্কে জানতে চাই।"
    : "Hello Noor Solar Energy, I would like to inquire about solar equipment and bulk pricing.";

  const buttonLabel = isBn ? "হোয়াটসঅ্যাপ চ্যাট" : "WhatsApp Chat";
  const ariaLabel = isBn ? "হোয়াটসঅ্যাপ চ্যাট - যোগাযোগ করুন" : "WhatsApp Chat - Contact us on WhatsApp";

  const url = `https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(prefill)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] right-4 sm:bottom-6 sm:right-6 z-40 flex items-center justify-center min-w-[48px] min-h-[48px] gap-2 p-3 sm:px-4 sm:py-3 rounded-full bg-[#074031] text-[#FEBE16] border border-white/20 shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-[#0B513E] hover:shadow-[0_10px_30px_-5px_rgba(254,190,22,0.35)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FEBE16]"
    >
      <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FEBE16] opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FEBE16]"></span>
      </span>
      <MessageCircle className="w-5 h-5 text-[#FEBE16]" />
      <span className="hidden sm:inline text-sm font-semibold tracking-wide text-white pr-1">
        {buttonLabel}
      </span>
    </a>
  );
}
