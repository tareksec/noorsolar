import React from "react";
import Image from "next/image";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getSiteSettings } from "@/lib/data/settings";
import { ClosingCTA } from "@/components/sections/closing-cta";
import { MapPin, Phone, Mail, Clock, MessageCircle, Sun, Headphones } from "lucide-react";
import { SITE_URL } from "@/lib/site-config";

interface ContactPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isBn = locale === "bn";
  const siteUrl = SITE_URL;

  return {
    title: isBn
      ? "যোগাযোগ ও ডিপো লজিস্টিকস — নূর সোলার এনার্জি"
      : "Contact & Warehouse Logistics — Noor Solar Energy",
    description: isBn
      ? "কন্টেইনার মূল্য, টেন্ডার স্পেসিফিকেশন এবং সেন্ট্রাল ডিপো থেকে ইকুইপমেন্ট সংগ্রহের জন্য নূর সোলার এনার্জি সেলস টিমের সাথে যোগাযোগ করুন।"
      : "Get in touch with Noor Solar Energy sales and logistics team for container pricing, tender specifications, and warehouse pickup.",
    alternates: {
      canonical: isBn ? `${siteUrl}/bn/contact` : `${siteUrl}/contact`,
      languages: {
        en: `${siteUrl}/contact`,
        bn: `${siteUrl}/bn/contact`,
        "x-default": `${siteUrl}/contact`,
      },
    },
    openGraph: {
      title: isBn
        ? "যোগাযোগ ও লজিস্টিকস — নূর সোলার এনার্জি"
        : "Contact & Warehouse Logistics — Noor Solar Energy",
      description: isBn
        ? "সরাসরি যোগাযোগের ঠিকানা, ডিপো পিকআপ লোকেশন এবং বাণিজ্যিক কোটেশন ফর্ম।"
        : "Direct contact details, warehouse pickup locations, and commercial quotation request form.",
      url: isBn ? "/bn/contact" : "/contact",
      type: "website",
      locale: isBn ? "bn_BD" : "en_US",
      images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Noor Solar Energy" }],
    },
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const settings = await getSiteSettings(locale);

  const isBn = locale === "bn";

  return (
    <div className="pt-28 sm:pt-36 pb-24 bg-[#F7F8F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Contact Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white border border-[#DCE4E0] text-[11px] sm:text-xs font-mono text-[#074031] mb-3 max-w-full">
            <span className="w-2 h-2 rounded-full bg-[#FEBE16]"></span>
            <span className="truncate">{isBn ? "বাণিজ্যিক সেলস ও সহায়তা" : "Commercial Sales & Support"}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#074031] break-words">
            {isBn ? "আমাদের সেলস ইঞ্জিনিয়ারদের সাথে কথা বলুন" : "Contact Our Sales Engineers"}
          </h1>
          <p className="text-sm sm:text-base text-[#62706A] max-w-2xl mt-3">
            {isBn
              ? "ইন্ডাস্ট্রিয়াল রুফটপ প্ল্যান্ট, LiFePO4 ব্যাটারি এনার্জি স্টোরেজ বা কন্টেইনার স্কেল সোলার প্যানেল অর্ডার—আপনার প্রজেক্টের সঠিক ইকুইপমেন্ট সরবরাহে আমরা প্রস্তুত।"
              : "Whether planning an industrial rooftop installation, telecom battery backup, or containerized solar panel order, we are ready to assist."}
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="p-6 rounded-3xl bg-white border border-[#DCE4E0]">
            <div className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-[#F1F4F1] flex items-center justify-center text-[#074031] mb-4 border border-[#DCE4E0]">
              <Phone className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono text-[#62706A] uppercase block mb-1">
              {isBn ? "সরাসরি সেলস ফোন" : "Direct Sales Phone"}
            </span>
            <a href={`tel:${settings.phone}`} className="inline-flex items-center min-h-[44px] text-base font-bold font-mono text-[#17251F] hover:text-[#074031] hover:underline">
              {settings.phoneDisplay}
            </a>
            <span className="text-[11px] text-[#62706A] block mt-1">
              {isBn ? "পাইকারি অর্ডারের তথ্যের জন্য সরাসরি কল করুন" : "Direct calls for wholesale orders"}
            </span>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#DCE4E0]">
            <div className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-[#FEBE16] flex items-center justify-center text-[#052F25] mb-4 shadow-sm">
              <MessageCircle className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono text-[#62706A] uppercase block mb-1">
              {isBn ? "হোয়াটসঅ্যাপ ডেস্ক" : "WhatsApp Desk"}
            </span>
            <a
              href={`https://wa.me/${settings.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center min-h-[44px] text-base font-bold font-mono text-[#17251F] hover:text-[#074031] hover:underline"
            >
              {settings.whatsappDisplay}
            </a>
            <span className="text-[11px] text-[#62706A] block mt-1">
              {isBn ? "তাৎক্ষণিক ডেটাশিট ও কোটেশন সুবিধা" : "Instant datasheet & quote delivery"}
            </span>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#DCE4E0]">
            <div className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-[#F1F4F1] flex items-center justify-center text-[#074031] mb-4 border border-[#DCE4E0]">
              <Mail className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono text-[#62706A] uppercase block mb-1">
              {isBn ? "অফিসিয়াল ইমেইল" : "Commercial Email"}
            </span>
            <a href={`mailto:${settings.email}`} className="inline-flex items-center min-h-[44px] text-base font-bold text-[#17251F] hover:text-[#074031] hover:underline truncate">
              {settings.email}
            </a>
            <span className="text-[11px] text-[#62706A] block mt-1">
              {isBn ? "কর্পোরেট RFP ও টেন্ডার প্রস্তাব" : "Corporate RFPs & tenders"}
            </span>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#DCE4E0]">
            <div className="w-10 h-10 rounded-full bg-[#F1F4F1] flex items-center justify-center text-[#074031] mb-4 border border-[#DCE4E0]">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono text-[#62706A] uppercase block mb-1">
              {isBn ? "অফিস ও ডিপো সময়সূচি" : "Warehouse & Office"}
            </span>
            <p className="text-xs font-bold text-[#17251F]">
              {settings.hours}
            </p>
            <span className="text-[11px] text-[#62706A] block mt-1">
              {isBn ? "সরাসরি সাক্ষাতের জন্য যোগাযোগ করুন" : "Visits by appointment"}
            </span>
          </div>
        </div>

        {/* Office & Logistics Depot Map Card */}
        <div className="p-8 sm:p-10 rounded-[36px] bg-white border border-[#DCE4E0] mb-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
              <span className="text-xs font-mono text-[#62706A] uppercase block mb-1">
                {isBn ? "লজিস্টিকস ও টেকনিক্যাল সহায়তা" : "Logistics & Assistance"}
              </span>
              <h2 className="text-2xl font-bold text-[#074031]">
                {isBn ? "সেন্ট্রাল বাণিজ্যিক ডিপো ও টেকনিক্যাল অফিস" : "Central Commercial Depot & Technical Liaison"}
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#074031] bg-[#F1F4F1] border border-[#DCE4E0] px-4 py-2 rounded-full">
              <MapPin className="w-4 h-4 text-[#074031]" />
              <span>{settings.address}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Interactive Styled Map Container */}
            <div className="lg:col-span-7 h-72 sm:h-80 rounded-2xl bg-[#F1F4F1] border border-[#DCE4E0] relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#DCE4E0_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />
              <div className="relative z-10 flex flex-col items-center text-center p-6 glass-card rounded-2xl border border-white max-w-sm shadow-sm">
                <div className="w-10 h-10 rounded-full bg-[#FEBE16] flex items-center justify-center text-[#052F25] mb-2 font-bold shadow-xs">
                  <Sun className="w-5 h-5 text-[#052F25]" />
                </div>
                <span className="font-bold text-sm text-[#074031]">
                  {isBn ? "নূর সোলার এনার্জি সেন্ট্রাল অফিস" : "Noor Solar Energy Central Office"}
                </span>
                <span className="text-xs text-[#62706A] mt-1">{settings.address}</span>
                <span className="text-[10px] font-mono text-[#074031] mt-3 px-2.5 py-1 rounded-full bg-[#F1F4F1] border border-[#DCE4E0]">
                  {isBn ? "ডিপো লোডিং বে সুবিধা উপলব্ধ" : "Warehouse Loading Bay Available"}
                </span>
              </div>
            </div>

            {/* Field Engineering Liaison Photo Card */}
            <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl bg-[#EDEDED] border border-[#DDE1DC]">
              <div className="relative aspect-16/10 w-full rounded-xl overflow-hidden mb-4 bg-white">
                <Image
                  src={settings.businessPhotos?.team || "/photos/contact-sales-desk.webp"}
                  alt={isBn ? "নূর সোলার এনার্জির টেকনিক্যাল সেলস ইঞ্জিনিয়ার ফোনে সহায়তা দিচ্ছেন" : "Noor Solar Energy technical sales engineer providing phone consultation"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 400px"
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#111311] font-semibold mb-1">
                  <Headphones className="w-4 h-4 text-[#111311]" />
                  <span>{isBn ? "সরাসরি টেকনিক্যাল ডেস্ক" : "Direct Technical Desk"}</span>
                </div>
                <p className="text-xs text-[#5C605C] leading-relaxed">
                  {isBn
                    ? "স্ট্রিং ক্যালকুলেশন, সিঙ্গেল লাইন ডায়াগ্রাম (SLD) রিভিউ এবং ইনভার্টার ওয়ারেন্টির জন্য আমাদের অভিজ্ঞ ইঞ্জিনিয়ারদের সাথে যোগাযোগ করুন।"
                    : "Connect with our qualified electrical engineers for string calculation, single-line diagram review, and inverter warranty documentation."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* B2B Procurement Guidelines Notice */}
        <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-[#DDE1DC] mb-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono text-[#5C605C] uppercase font-semibold">
                {isBn ? "বাণিজ্যিক ক্রয় নির্দেশিকা ও সরবরাহ শর্তাবলি" : "Commercial Procurement Guidelines"}
              </span>
              <p className="text-xs sm:text-sm text-[#5C605C]">
                {isBn
                  ? "পাইকারি অর্ডার ন্যূনতম ১ প্যালেট থেকে শুরু হয়। ২০ ফুট ও ৪০HQ ফুল কন্টেইনার চালানের জন্য বাণিজ্যিক কোটেশন ও কন্টেইনার ইনডেন্ট শর্তাবলি প্রযোজ্য।"
                  : "Wholesale consignments start at 1 pallet for local warehouse pickup. Container orders (20ft / 40HQ) are scheduled via formal proforma quotation and commercial indent."}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-mono text-[#111311] bg-[#EDEDED] px-3.5 py-1.5 rounded-full font-bold">
                {isBn ? "৬৪ জেলায় সরাসরি ডেলিভারি" : "64 District Logistics"}
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
