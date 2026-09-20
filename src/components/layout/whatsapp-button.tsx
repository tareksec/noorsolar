import React from "react";
import { MessageCircle } from "lucide-react";
import { useLocale } from "next-intl";

interface WhatsAppButtonProps {
  phone?: string;
  locale?: string;
}

export function WhatsAppButton({ phone = "8801700000000", locale: propLocale }: WhatsAppButtonProps) {
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

  const ariaLabel = isBn ? "হোয়াটসঅ্যাপে যোগাযোগ করুন" : "Contact us on WhatsApp";
  const buttonLabel = isBn ? "হোয়াটসঅ্যাপ চ্যাট" : "WhatsApp Chat";

  const url = `https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(prefill)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] right-[calc(1rem+env(safe-area-inset-right,0px))] sm:bottom-6 sm:right-6 z-50 flex items-center justify-center gap-2 p-3 sm:px-4 sm:py-3 rounded-full bg-[#111311] text-[#CEF23E] border border-[rgba(255,255,255,0.2)] shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-[#1A1D1A] hover:shadow-[0_10px_30px_-5px_rgba(206,242,62,0.3)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CEF23E]"
    >
      <MessageCircle className="w-5 h-5 text-[#CEF23E]" />
      <span className="hidden sm:inline text-sm font-semibold tracking-wide text-white pr-1">
        {buttonLabel}
      </span>
    </a>
  );
}
