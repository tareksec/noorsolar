import React from "react";
import Image from "next/image";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getSiteSettings } from "@/lib/data/settings";
import { ContactForm } from "@/components/contact/contact-form";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
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

  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(
    settings.address || "House-38, Road-5/A, Sector-5, Uttara, Dhaka-1230"
  )}`;

  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: isBn ? "যোগাযোগ — নূর সোলার এনার্জি" : "Contact — Noor Solar Energy",
    description: isBn
      ? "কন্টেইনার মূল্য, টেন্ডার স্পেসিফিকেশন ও ডিপো সংগ্রহের জন্য নূর সোলার এনার্জি সেলস টিমের সাথে যোগাযোগ করুন।"
      : "Contact Noor Solar Energy sales engineers for container pricing, technical specifications, and warehouse logistics.",
    url: isBn ? `${SITE_URL}/bn/contact` : `${SITE_URL}/contact`,
    mainEntity: {
      "@type": "LocalBusiness",
      name: "Noor Solar Energy",
      telephone: settings.phone || "+8801884611888",
      email: settings.email || "info@noorsolaren.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "House-38 (Flat-1A), Road-5/A, Sector-5",
        addressLocality: "Uttara, Dhaka",
        postalCode: "1230",
        addressCountry: "BD",
      },
      openingHours: "Sa,Su,Mo,Tu,We,Th 09:00-19:00",
    },
  };

  return (
    <div className="pt-28 sm:pt-36 pb-20 bg-[#F7F8F5] min-h-screen">
      {/* Schema.org ContactPage Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Pill */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#DCE4E0] text-[11px] sm:text-xs font-mono text-[#074031] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#FEBE16]" />
            <span>{isBn ? "হোম  >  যোগাযোগ" : "Home  >  Contact"}</span>
          </div>
        </div>

        {/* Hero Header: Left Text & Right Perspective Solar Field Landscape */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-10">
          {/* Left Column: Heading with Underline Accent & Description */}
          <div className="lg:col-span-6 xl:col-span-7">
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[48px] font-bold tracking-tight text-[#074031] leading-[1.18] mb-4">
              {isBn ? (
                <>
                  আমাদের সেলস ইঞ্জিনিয়ারদের{" "}
                  <span className="relative inline-block whitespace-nowrap">
                    সাথে কথা বলুন
                    <svg
                      className="absolute -bottom-1.5 left-0 w-full h-2.5 text-[#FEBE16]"
                      viewBox="0 0 100 12"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0,9 Q50,1 100,8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </>
              ) : (
                <>
                  Talk to Our{" "}
                  <span className="relative inline-block whitespace-nowrap">
                    Sales Engineers
                    <svg
                      className="absolute -bottom-1.5 left-0 w-full h-2.5 text-[#FEBE16]"
                      viewBox="0 0 100 12"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0,9 Q50,1 100,8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </>
              )}
            </h1>
            <p className="text-sm sm:text-base text-[#62706A] leading-relaxed max-w-xl">
              {isBn
                ? "ইনস্টলেশন, পণ্য, LiFePO4 ব্যাটারি, এনার্জি স্টোরেজ বা যেকোনো সোলার সিস্টেম সম্পর্কিত আপনার যেকোনো প্রশ্নের জন্য আমাদের অভিজ্ঞ সেলস ইঞ্জিনিয়ারদের সাথে যোগাযোগ করুন।"
                : "For installations, products, LiFePO4 batteries, energy storage, or any solar equipment inquiries, contact our experienced sales engineers."}
            </p>
          </div>

          {/* Right Column: Solar Farm Perspective Image with Handwritten Accent */}
          <div className="lg:col-span-6 xl:col-span-5 relative">
            <div className="relative aspect-16/9 sm:aspect-2/1 lg:aspect-16/10 w-full rounded-3xl overflow-hidden shadow-lg border border-[#DCE4E0]/60 bg-[#052F25]">
              <Image
                src="/photos/hero-solar-field.webp"
                alt={isBn ? "সৌর প্যানেল ফার্ম ও পরিষ্কার শক্তি" : "Solar panel farm landscape"}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 520px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 pointer-events-none" />
              
              {/* Handwritten style badge in the sky */}
              <div className="absolute top-4 right-5 sm:top-5 sm:right-6 pointer-events-none text-right">
                <span className="block font-serif italic text-[#074031] drop-shadow-[0_2px_10px_rgba(255,255,255,0.95)] text-lg sm:text-xl font-bold tracking-wide -rotate-3">
                  Clean Energy
                </span>
                <span className="block font-serif italic text-[#074031] drop-shadow-[0_2px_10px_rgba(255,255,255,0.95)] text-base sm:text-lg font-bold tracking-wide -rotate-3 -mt-1">
                  Brighter Future
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Quick Contact Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {/* Card 1: Call */}
          <a
            href={`tel:${settings.phone}`}
            className="p-5 rounded-2xl bg-white border border-[#DCE4E0] hover:border-[#074031]/40 hover:shadow-md transition-all flex items-center gap-4 group"
          >
            <div className="w-12 h-12 rounded-full bg-[#074031] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
              <Phone className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] text-[#62706A] block font-medium">
                {isBn ? "কল করুন" : "Call Us"}
              </span>
              <span className="text-sm sm:text-base font-bold text-[#17251F] font-mono group-hover:text-[#074031] transition-colors block truncate">
                {settings.phoneDisplay}
              </span>
              <span className="text-[11px] text-[#62706A] block truncate">
                {isBn ? "সোম-শনি, সকাল ৯টা — রাত ৯টা" : "Mon-Sat: 9 AM - 9 PM"}
              </span>
            </div>
          </a>

          {/* Card 2: WhatsApp */}
          <a
            href={`https://wa.me/${settings.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="p-5 rounded-2xl bg-white border border-[#DCE4E0] hover:border-[#FEBE16] hover:shadow-md transition-all flex items-center gap-4 group"
          >
            <div className="w-12 h-12 rounded-full bg-[#074031] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] text-[#62706A] block font-medium">
                {isBn ? "হোয়াটসঅ্যাপ / মেসেজ" : "WhatsApp / Message"}
              </span>
              <span className="text-sm sm:text-base font-bold text-[#17251F] font-mono group-hover:text-[#074031] transition-colors block truncate">
                {settings.whatsappDisplay}
              </span>
              <span className="text-[11px] text-[#62706A] block truncate">
                {isBn ? "দ্রুত উত্তর পেতে হোয়াটসঅ্যাপ করুন" : "Chat for quick response"}
              </span>
            </div>
          </a>

          {/* Card 3: Email */}
          <a
            href={`mailto:${settings.email}`}
            className="p-5 rounded-2xl bg-white border border-[#DCE4E0] hover:border-[#074031]/40 hover:shadow-md transition-all flex items-center gap-4 group"
          >
            <div className="w-12 h-12 rounded-full bg-[#074031] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
              <Mail className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] text-[#62706A] block font-medium">
                {isBn ? "ইমেইল করুন" : "Email Us"}
              </span>
              <span className="text-sm sm:text-[15px] font-bold text-[#17251F] group-hover:text-[#074031] transition-colors block truncate" title={settings.email}>
                {settings.email}
              </span>
              <span className="text-[11px] text-[#62706A] block truncate">
                {isBn ? "২৪ ঘণ্টার মধ্যে রিপ্লাই পাবেন" : "Reply within 24 hours"}
              </span>
            </div>
          </a>

          {/* Card 4: Address */}
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="p-5 rounded-2xl bg-white border border-[#DCE4E0] hover:border-[#074031]/40 hover:shadow-md transition-all flex items-center gap-4 group"
          >
            <div className="w-12 h-12 rounded-full bg-[#074031] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] text-[#62706A] block font-medium">
                {isBn ? "আমাদের ঠিকানা" : "Our Address"}
              </span>
              <span className="text-xs sm:text-[13px] font-bold text-[#17251F] group-hover:text-[#074031] transition-colors block line-clamp-1" title={settings.address}>
                {settings.address}
              </span>
              <span className="text-[11px] text-[#62706A] block truncate">
                {isBn ? "সরাসরি এসে আমাদের অফিসে দেখা করুন" : "Visit our office in person"}
              </span>
            </div>
          </a>
        </div>

        {/* Main Section: Left Info & Solar Banner, Right Form Card */}
        <div className="p-6 sm:p-8 lg:p-10 rounded-[32px] sm:rounded-[36px] bg-white border border-[#DCE4E0] shadow-sm mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* Left Column: Mission, Benefits & Bottom Solar Banner */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF5F0] text-xs font-semibold text-[#074031] mb-3">
                  <span>🌿</span>
                  <span>{isBn ? "আমাদের সাথে যোগাযোগ করুন" : "Contact With Us"}</span>
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-bold text-[#074031] leading-snug mb-3">
                  {isBn
                    ? "সৌরশক্তি নিয়ে আপনার প্রকল্পের জন্য আমরা আছি পাশে"
                    : "We Are by Your Side for Your Solar Energy Project"}
                </h2>

                <p className="text-xs sm:text-sm text-[#62706A] leading-relaxed mb-6">
                  {isBn
                    ? "বাড়ি, অফিস, শিল্প প্রতিষ্ঠান কিংবা বড় স্কেলের প্রকল্প — সোলার সিস্টেম সংক্রান্ত যে কোনো পরামর্শ, মূল্য তথ্য বা কাস্টম সমাধানের জন্য আমাদের সাথে যোগাযোগ করুন।"
                    : "Commercial rooftops, residential storage, or utility project supply — reach out for reliable technical sizing and wholesale container indent pricing."}
                </p>

                {/* Two Benefit Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  <div className="p-3.5 rounded-2xl bg-[#F7F8F5] border border-[#DCE4E0]/70 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#EAF5F0] text-[#074031] flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-[#074031]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#074031]">
                        {isBn ? "বিশেষজ্ঞ পরামর্শ" : "Expert Advice"}
                      </h4>
                      <p className="text-[11px] text-[#62706A] mt-0.5 leading-tight">
                        {isBn ? "আপনার প্রয়োজন অনুযায়ী সঠিক সমাধান" : "Tailored to your needs"}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#F7F8F5] border border-[#DCE4E0]/70 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#EAF5F0] text-[#074031] flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5 text-[#074031]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#074031]">
                        {isBn ? "বিশ্বস্ত সেবা" : "Trusted Service"}
                      </h4>
                      <p className="text-[11px] text-[#62706A] mt-0.5 leading-tight">
                        {isBn ? "বিক্রয় পরবর্তী সাপোর্ট ও সার্ভিস" : "Post-sales warranty support"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Solar Banner with Dark Overlay & Accent Bar */}
              <div className="relative aspect-16/9 w-full rounded-2xl overflow-hidden shadow-md border border-[#DCE4E0] bg-[#052F25]">
                <Image
                  src="/photos/cta-sunset-panels.webp"
                  alt={isBn ? "সবুজ শক্তি, উজ্জ্বল ভবিষ্যৎ" : "Green energy, bright future"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center pointer-events-none">
                  <div className="w-1.5 h-10 bg-[#FEBE16] rounded-full mr-3 shrink-0" />
                  <div>
                    <h4 className="text-white font-bold text-sm sm:text-base leading-tight">
                      {isBn ? "সবুজ শক্তি, উজ্জ্বল ভবিষ্যৎ" : "Green Energy, Bright Future"}
                    </h4>
                    <p className="text-white/80 text-[11px] sm:text-xs mt-0.5">
                      {isBn ? "পরিষ্কার শক্তির জন্য আজই যোগাযোগ করুন।" : "Contact today for clean solar energy."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Clean, Friendly Form Card */}
            <div className="lg:col-span-7 bg-[#F7F8F5]/80 p-6 sm:p-8 rounded-3xl border border-[#DCE4E0]">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-[#074031]">
                  {isBn ? "আপনার তথ্য দিন" : "Submit Your Details"}
                </h3>
                <p className="text-xs sm:text-sm text-[#62706A] mt-1">
                  {isBn ? "আমরা দ্রুত আপনার সাথে যোগাযোগ করব।" : "We will get back to you promptly."}
                </p>
              </div>

              <ContactForm isBn={isBn} />
            </div>
          </div>
        </div>

        {/* =========================================================================
            100% SEO PRESERVATION BLOCK (Crawled by Google, Bing & AI Bots)
            Ensures 0 negative impact on rankings for wholesale & technical keywords
            ========================================================================= */}
        <div className="sr-only" aria-hidden="true">
          <h2>
            {isBn
              ? "নূর সোলার এনার্জি সেন্ট্রাল ডিপো, পাইকারি কন্টেইনার ও টেকনিক্যাল স্পেসিফিকেশন"
              : "Noor Solar Energy Central Warehouse, Wholesale Container Indent & Technical Logistics"}
          </h2>
          <p>
            {isBn
              ? "বাংলাদেশে N-Type TOPCon ও Bifacial সোলার প্যানেল, কমার্শিয়াল ও ইন্ডাস্ট্রিয়াল অন-গ্রিড হাইব্রিড ইনভার্টার এবং LiFePO4 হাই-ভোল্টেজ লিথিয়াম ব্যাটারি আমদানিকারক ও পাইকারি সরবরাহকারী। পাইকারি অর্ডার ন্যূনতম ১ প্যালেট থেকে শুরু হয়। ২০ ফুট ও ৪০HQ ফুল কন্টেইনার চালানের জন্য বাণিজ্যিক কোটেশন ও কন্টেইনার ইনডেন্ট প্রযোজ্য। স্ট্রিং ক্যালকুলেশন, সিঙ্গেল লাইন ডায়াগ্রাম (SLD) রিভিউ এবং ইনভার্টার ওয়ারেন্টির জন্য যোগাযোগ করুন। বাংলাদেশের ৬৪ জেলায় সরাসরি ডেলিভারি। BSREA সদস্য ও আইডিকেওএল (IDCOL) অনুমোদিত।"
              : "Direct Tier-1 solar equipment importer in Bangladesh. N-Type TOPCon PV modules (585W–620W), three-phase commercial on-grid and hybrid inverters, and high-voltage LiFePO4 battery energy storage. Minimum wholesale consignment starts from 1 pallet. Container orders (20ft / 40HQ) via commercial indent and proforma quotation. 64-district nationwide freight logistics. BSREA Member, IDCOL approved, and ISO certified."}
          </p>
          <address>
            {settings.address} | Phone: {settings.phone} | WhatsApp: {settings.whatsapp} | Email: {settings.email}
          </address>
        </div>

      </div>
    </div>
  );
}
