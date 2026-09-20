import React from "react";
import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  phone?: string;
}

export function WhatsAppButton({ phone = "8801700000000" }: WhatsAppButtonProps) {
  const url = `https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    "Hello Noor Solar Energy, I would like to inquire about solar equipment and bulk pricing."
  )}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact us on WhatsApp"
      className="mx-auto my-4 lg:my-0 lg:fixed lg:bottom-5 lg:right-4 z-30 flex w-fit items-center justify-center gap-2 px-4 py-3 lg:p-3 rounded-full bg-[#111311] text-[#CEF23E] border border-white/20 shadow-lg transition-colors hover:bg-[#30372C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CEF23E]"
    >
      <MessageCircle className="w-5 h-5 text-[#CEF23E]" />
      <span className="lg:hidden text-sm font-medium text-white">Message on WhatsApp</span>
    </a>
  );
}
