"use client";

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
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#111311] text-[#CEF23E] border border-[rgba(255,255,255,0.2)] shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-[#1A1D1A] hover:shadow-[0_10px_30px_-5px_rgba(206,242,62,0.3)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CEF23E]"
    >
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CEF23E] opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#CEF23E]"></span>
      </span>
      <MessageCircle className="w-5 h-5 text-[#CEF23E]" />
      <span className="text-sm font-semibold tracking-wide text-white pr-1">WhatsApp Chat</span>
    </a>
  );
}
