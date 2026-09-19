import React from "react";
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data/settings";
import { ClosingCTA } from "@/components/sections/closing-cta";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us & Warehouse — Noor Solar Energy",
  description:
    "Get in touch with Noor Solar Energy sales and logistics team. Office in Motijheel Dhaka, warehouse dispatch nationwide.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div className="pt-28 sm:pt-36 pb-24 bg-[#E4E7E4] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Contact Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#DDE1DC] text-xs font-mono text-[#111311] mb-3">
            <span className="w-2 h-2 rounded-full bg-[#CEF23E]"></span>
            <span>Commercial Sales & Warehouse Support</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#111311]">
            Contact Our Sales Engineers .
          </h1>
          <p className="text-sm sm:text-base text-[#5C605C] max-w-2xl mt-3">
            Whether planning an industrial rooftop installation, telecom battery backup, or containerized solar panel order, we are ready to assist.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="p-6 rounded-3xl bg-white border border-[#DDE1DC]">
            <div className="w-10 h-10 rounded-full bg-[#EDEDED] flex items-center justify-center text-[#111311] mb-4">
              <Phone className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono text-[#5C605C] uppercase block mb-1">Direct Sales Phone</span>
            <a href={`tel:${settings.phone}`} className="text-base font-bold font-mono text-[#111311] hover:underline">
              {settings.phoneDisplay}
            </a>
            <span className="text-[11px] text-[#5C605C] block mt-1">Direct calls for wholesale orders</span>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#DDE1DC]">
            <div className="w-10 h-10 rounded-full bg-[#CEF23E] flex items-center justify-center text-[#111311] mb-4">
              <MessageCircle className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono text-[#5C605C] uppercase block mb-1">WhatsApp Desk</span>
            <a
              href={`https://wa.me/${settings.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="text-base font-bold font-mono text-[#111311] hover:underline"
            >
              {settings.whatsappDisplay}
            </a>
            <span className="text-[11px] text-[#5C605C] block mt-1">Instant datasheet & quote dispatch</span>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#DDE1DC]">
            <div className="w-10 h-10 rounded-full bg-[#EDEDED] flex items-center justify-center text-[#111311] mb-4">
              <Mail className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono text-[#5C605C] uppercase block mb-1">Official Email</span>
            <a href={`mailto:${settings.email}`} className="text-base font-bold text-[#111311] hover:underline truncate block">
              {settings.email}
            </a>
            <span className="text-[11px] text-[#5C605C] block mt-1">Corporate RFPs & tenders</span>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#DDE1DC]">
            <div className="w-10 h-10 rounded-full bg-[#EDEDED] flex items-center justify-center text-[#111311] mb-4">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono text-[#5C605C] uppercase block mb-1">Warehouse & Office</span>
            <p className="text-xs font-bold text-[#111311]">
              {settings.hours}
            </p>
            <span className="text-[11px] text-[#5C605C] block mt-1">Visits by appointment</span>
          </div>
        </div>

        {/* Office & Logistics Depot Map Card */}
        <div className="p-8 sm:p-10 rounded-[36px] bg-white border border-[#DDE1DC] mb-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
              <span className="text-xs font-mono text-[#5C605C] uppercase block mb-1">Logistics Location</span>
              <h2 className="text-2xl font-bold text-[#111311]">Central Commercial Depot</h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#111311] bg-[#EDEDED] px-4 py-2 rounded-full">
              <MapPin className="w-4 h-4 text-[#111311]" />
              <span>{settings.address}</span>
            </div>
          </div>

          {/* Interactive Styled Map Container Placeholder */}
          <div className="w-full h-64 sm:h-80 rounded-2xl bg-[#EDEDED] border border-[#DDE1DC] relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#DDE1DC_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />
            <div className="relative z-10 flex flex-col items-center text-center p-6 glass-card rounded-2xl border border-white max-w-sm">
              <div className="w-10 h-10 rounded-full bg-[#CEF23E] flex items-center justify-center text-[#111311] mb-2 font-bold">
                ▲
              </div>
              <span className="font-bold text-sm text-[#111311]">Noor Solar Energy Central Office</span>
              <span className="text-xs text-[#5C605C] mt-1">{settings.address}</span>
              <span className="text-[10px] font-mono text-[#111311] mt-3 px-2.5 py-1 rounded-full bg-[#EDEDED]">
                Warehouse Loading Bay Available
              </span>
            </div>
          </div>
        </div>

        {/* Quotation / Inquiry Form */}
        <ClosingCTA
          phoneDisplay={settings.phoneDisplay}
          whatsappNumber={settings.whatsapp}
        />

      </div>
    </div>
  );
}
