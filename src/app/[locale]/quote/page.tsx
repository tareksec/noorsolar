import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getSiteSettings } from "@/lib/data/settings";
import { QuoteForm } from "@/components/quote/quote-form";
import {
  Zap,
  Leaf,
  ShieldCheck,
  Settings2,
  DollarSign,
  Wrench,
  MessageSquare,
  FileText,
  CalendarCheck,
  Sun,
  Award,
  Truck,
  ArrowRight,
} from "lucide-react";
import { SITE_URL } from "@/lib/site-config";

interface QuotePageProps {
  params: Promise<{
    locale: string;
  }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: QuotePageProps): Promise<Metadata> {
  const { locale } = await params;
  const isBn = locale === "bn";
  const siteUrl = SITE_URL;

  return {
    title: isBn
      ? "বিনামূল্যে সোলার কোটেশন রিকোয়েস্ট — নূর সোলার এনার্জি"
      : "Get a Free Solar Quotation — Noor Solar Energy",
    description: isBn
      ? "বাসাবাড়ি, বাণিজ্যিক ভবন বা শিল্প প্রতিষ্ঠানের জন্য কাস্টমাইজড সোলার কোটেশন ও পাইকারি মূল্য জানতে অনলাইনে অনুরোধ পাঠান।"
      : "Tell us about your energy needs and get a tailored solar quotation for residential, commercial rooftop, or industrial solar projects in Bangladesh.",
    alternates: {
      canonical: isBn ? `${siteUrl}/bn/quote` : `${siteUrl}/quote`,
      languages: {
        en: `${siteUrl}/quote`,
        bn: `${siteUrl}/bn/quote`,
        "x-default": `${siteUrl}/quote`,
      },
    },
    openGraph: {
      title: isBn
        ? "সোলার কোটেশন রিকোয়েস্ট — নূর সোলার এনার্জি"
        : "Free Solar Quotation — Noor Solar Energy",
      description: isBn
        ? "মাত্র ৪টি সহজ ধাপে আপনার প্রজেক্টের জন্য সেরা সোলার সিস্টেম কোটেশন নিন।"
        : "Get a tailored quotation for high-efficiency solar panels, inverters, and battery storage.",
      url: isBn ? "/bn/quote" : "/quote",
      type: "website",
      locale: isBn ? "bn_BD" : "en_US",
      images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Noor Solar Energy" }],
    },
  };
}

export default async function QuotePage({ params }: QuotePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const settings = await getSiteSettings(locale);
  const isBn = locale === "bn";

  const quoteJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: isBn ? "সোলার সিস্টেম কোটেশন সার্ভিস" : "Solar System Quotation Service",
    provider: {
      "@type": "LocalBusiness",
      name: "Noor Solar Energy",
      telephone: settings.phone,
      email: settings.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: "House-38 (Flat-1A), Road-5/A, Sector-5",
        addressLocality: "Uttara, Dhaka",
        postalCode: "1230",
        addressCountry: "BD",
      },
    },
    areaServed: "BD",
    description: isBn
      ? "বাসাবাড়ি ও বাণিজ্যিক সোলার সলিউশন কোটেশন"
      : "Customized residential and commercial solar quotation",
  };

  return (
    <div className="pt-28 sm:pt-36 pb-20 bg-[#F7F8F5] min-h-screen text-[#17251F]">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(quoteJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* =========================================================================
            1. HERO SECTION (Split: Left Value Props, Right Modern Rooftop Solar Home)
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16">
          {/* Left Column: Heading, Subtitle & 4 Value Prop Chips */}
          <div className="lg:col-span-6 xl:col-span-7">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#DCE4E0] text-[11px] sm:text-xs font-mono text-[#074031] shadow-2xs mb-4">
              <span className="w-2 h-2 rounded-full bg-[#FEBE16]" />
              <span>{isBn ? "বিনামূল্যে কোটেশন নিন" : "Get a Free Quotation"}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[46px] xl:text-[54px] font-bold tracking-tight text-[#074031] leading-[1.12] mb-4">
              {isBn ? (
                <>
                  <span className="text-[#FEBE16]">সৌরশক্তিতে</span> সমৃদ্ধ হোক আপনার ভবিষ্যৎ
                </>
              ) : (
                <>
                  Power Your Future with <span className="text-[#FEBE16]">Solar</span>
                </>
              )}
            </h1>

            {/* Subheadline */}
            <p className="text-sm sm:text-base text-[#62706A] leading-relaxed max-w-xl mb-8">
              {isBn
                ? "আপনার বিদ্যুতের চাহিদা আমাদের জানান, আমরা আপনার প্রজেক্টের জন্য সেরা সোলার সলিউশন ও কাস্টমাইজড কোটেশন প্রদান করব।"
                : "Tell us about your energy needs, and we'll provide a customized quotation for the best solar solution."}
            </p>

            {/* 4 Value Proposition Cards Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Value 1: Save Money */}
              <div className="p-3.5 rounded-2xl bg-white border border-[#DCE4E0] shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-[#FEBE16]/15 text-[#074031] flex items-center justify-center mb-2 font-bold">
                  <Zap className="w-4 h-4 text-[#074031]" />
                </div>
                <h4 className="text-xs font-bold text-[#074031]">
                  {isBn ? "টাকা সাশ্রয়" : "Save Money"}
                </h4>
                <p className="text-[10px] text-[#62706A] mt-0.5 leading-tight">
                  {isBn ? "প্রতি মাসে বিদ্যুৎ বিল কমান" : "Lower electricity bills every month"}
                </p>
              </div>

              {/* Value 2: Clean Energy */}
              <div className="p-3.5 rounded-2xl bg-white border border-[#DCE4E0] shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2 font-bold">
                  <Leaf className="w-4 h-4 text-emerald-700" />
                </div>
                <h4 className="text-xs font-bold text-[#074031]">
                  {isBn ? "সবুজ শক্তি" : "Clean Energy"}
                </h4>
                <p className="text-[10px] text-[#62706A] mt-0.5 leading-tight">
                  {isBn ? "পরিবেশবান্ধব আগামী" : "A greener, healthier planet"}
                </p>
              </div>

              {/* Value 3: Reliable Support */}
              <div className="p-3.5 rounded-2xl bg-white border border-[#DCE4E0] shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-[#FEBE16]/15 text-[#074031] flex items-center justify-center mb-2 font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#074031]" />
                </div>
                <h4 className="text-xs font-bold text-[#074031]">
                  {isBn ? "নির্ভরযোগ্য সাপোর্ট" : "Reliable Support"}
                </h4>
                <p className="text-[10px] text-[#62706A] mt-0.5 leading-tight">
                  {isBn ? "পরামর্শ থেকে ইনস্টলেশন" : "From consultation to installation"}
                </p>
              </div>

              {/* Value 4: Custom Solutions */}
              <div className="p-3.5 rounded-2xl bg-white border border-[#DCE4E0] shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-[#F1F4F1] text-[#074031] flex items-center justify-center mb-2 font-bold">
                  <Settings2 className="w-4 h-4 text-[#074031]" />
                </div>
                <h4 className="text-xs font-bold text-[#074031]">
                  {isBn ? "কাস্টম সমাধান" : "Custom Solutions"}
                </h4>
                <p className="text-[10px] text-[#62706A] mt-0.5 leading-tight">
                  {isBn ? "বাড়ি ও ব্যবসা উভয়ের জন্য" : "For home & business"}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Modern Rooftop Solar Home Photo */}
          <div className="lg:col-span-6 xl:col-span-5 relative">
            <div className="relative aspect-4/3 w-full rounded-3xl overflow-hidden shadow-xl border border-white/60 bg-[#052F25]">
              <Image
                src="/photos/rooftop-solar-home.jpg"
                alt={isBn ? "আধুনিক বাড়ি ও ছাদে স্থাপিত সোলার প্যানেল" : "Modern residential home with rooftop solar panels"}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 550px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* =========================================================================
            2. MAIN SECTION: WHY CHOOSE NOOR SOLAR (Left) & QUOTATION FORM (Right)
            ========================================================================= */}
        <div id="quote-form" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20">
          
          {/* Left Column: Why Choose Noor Solar */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white border border-[#DCE4E0] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-0.5 bg-[#FEBE16] rounded-full" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#62706A] font-bold">
                  {isBn ? "কেন নূর সোলার বেছে নেবেন?" : "WHY CHOOSE NOOR SOLAR?"}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-[#074031] leading-snug mb-3">
                {isBn
                  ? "উজ্জ্বল আগামীর জন্য স্মার্ট সোলার সলিউশন"
                  : "Smart Solar Solutions for a Brighter Tomorrow"}
              </h2>

              <p className="text-xs sm:text-sm text-[#62706A] leading-relaxed mb-8">
                {isBn
                  ? "আমরা প্রফেশনাল পরামর্শ, প্রতিযোগিতামূলক মূল্য এবং বিক্রয়োত্তর নির্ভরযোগ্য সাপোর্টের সাথে উচ্চ মানের সোলার সিস্টেম সরবরাহ করি। আজই আপনার বিনামূল্যে কোটেশন নিন এবং নবায়নযোগ্য জ্বালানির পথে প্রথম পদক্ষেপ ফেলুন।"
                  : "We provide high-quality solar systems with professional consultation, competitive pricing, and dedicated after-sales support. Get your free quotation today and take the first step towards clean, renewable energy."}
              </p>

              {/* 4 Feature Items with Golden Circles */}
              <div className="space-y-4">
                {/* Feature 1 */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#FEBE16] text-[#052F25] flex items-center justify-center shrink-0 font-bold shadow-xs">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#17251F]">
                      {isBn ? "বিদ্যুৎ বিল সাশ্রয়" : "Save on Electricity Bills"}
                    </h4>
                    <p className="text-xs text-[#62706A] mt-0.5 leading-relaxed">
                      {isBn
                        ? "পরিচ্ছন্ন সৌরবিদ্যুতের মাধ্যমে আপনার মাসিক জ্বালানি খরচ নাটকীয়ভাবে কমান।"
                        : "Reduce your monthly energy costs with clean solar power."}
                    </p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#FEBE16] text-[#052F25] flex items-center justify-center shrink-0 font-bold shadow-xs">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#17251F]">
                      {isBn ? "পরিবেশবান্ধব সবুজ জ্বালানি" : "Eco-Friendly Energy"}
                    </h4>
                    <p className="text-xs text-[#62706A] mt-0.5 leading-relaxed">
                      {isBn
                        ? "একটি সবুজ, দূষণমুক্ত ও পরিচ্ছন্ন বাংলাদেশ গড়তে সাহায্য করুন।"
                        : "Help build a greener, cleaner Bangladesh."}
                    </p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#FEBE16] text-[#052F25] flex items-center justify-center shrink-0 font-bold shadow-xs">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#17251F]">
                      {isBn ? "উচ্চমানের ও সার্টিফায়েড পণ্য" : "High-Quality Products"}
                    </h4>
                    <p className="text-xs text-[#62706A] mt-0.5 leading-relaxed">
                      {isBn
                        ? "আমরা শুধুমাত্র আন্তর্জাতিকভাবে স্বীকৃত ও বিশ্বস্ত সোলার কম্পোনেন্ট ব্যবহার করি।"
                        : "We use only trusted and certified solar components."}
                    </p>
                  </div>
                </div>

                {/* Feature 4 */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#FEBE16] text-[#052F25] flex items-center justify-center shrink-0 font-bold shadow-xs">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#17251F]">
                      {isBn ? "প্রফেশনাল ইনস্টলেশন" : "Professional Installation"}
                    </h4>
                    <p className="text-xs text-[#62706A] mt-0.5 leading-relaxed">
                      {isBn
                        ? "নিরাপদ, মানসম্পন্ন ও টেকসই সেটআপের জন্য অভিজ্ঞ দক্ষ টেকনিক্যাল টিম।"
                        : "Skilled engineering team for safe and efficient setup."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Handwritten Leaf Accent */}
            <div className="mt-8 pt-6 border-t border-[#DCE4E0]/80">
              <span className="font-serif italic text-emerald-800 text-base font-bold flex items-center gap-1.5">
                <span>Clean Energy Better Tomorrow</span>
                <Leaf className="w-4 h-4 text-emerald-600" />
              </span>
            </div>
          </div>

          {/* Right Column: Request A Quotation Form */}
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 rounded-3xl bg-white border border-[#DCE4E0] shadow-sm">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-0.5 bg-[#FEBE16] rounded-full" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#62706A] font-bold">
                  {isBn ? "কোটেশন রিকোয়েস্ট" : "REQUEST A QUOTATION"}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-[#074031] leading-snug">
                {isBn ? "আসুন আপনার সোলার সলিউশন তৈরি করি" : "Let's Build Your Solar Solution"}
              </h2>
              <p className="text-xs sm:text-sm text-[#62706A] mt-1.5 leading-relaxed">
                {isBn
                  ? "নিচের ফর্মটি পূরণ করুন, আমাদের টিম দ্রুত আপনার জন্য কাস্টমাইজড কোটেশন নিয়ে যোগাযোগ করবে।"
                  : "Fill out the form below and our team will get back to you with a customized quote as soon as possible."}
              </p>
            </div>

            <QuoteForm isBn={isBn} />
          </div>
        </div>

        {/* =========================================================================
            3. HOW IT WORKS: 4-STEP PROCESS SECTION
            ========================================================================= */}
        <div className="mb-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#074031] mb-2">
            {isBn ? "আমাদের কাজের ধাপসমূহ" : "How It Works"}
          </h2>
          <p className="text-xs sm:text-sm text-[#62706A] mb-12">
            {isBn
              ? "আপনার সোলার সিস্টেম পাওয়া অত্যন্ত সহজ। মাত্র ৪টি সহজ ধাপে!"
              : "Getting your solar system is simple. Just 4 easy steps!"}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-white border border-[#DCE4E0] flex flex-col items-center text-center shadow-2xs relative group hover:border-[#074031]/30 transition-all">
              <div className="w-14 h-14 rounded-full bg-[#FEBE16]/20 text-[#074031] flex items-center justify-center mb-4 relative">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-[#FEBE16] flex items-center justify-center text-[#074031]">
                  <MessageSquare className="w-5 h-5 text-[#074031]" />
                </div>
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FEBE16] text-[#052F25] text-[10px] font-bold flex items-center justify-center">
                  1
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#074031] mb-1">
                {isBn ? "অনুরোধ জমা দিন" : "Submit Your Request"}
              </h4>
              <p className="text-xs text-[#62706A] leading-relaxed">
                {isBn
                  ? "আপনার প্রয়োজনীয় তথ্য দিয়ে কোটেশন ফর্মটি পূরণ করুন।"
                  : "Fill out the quotation form with your details."}
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-white border border-[#DCE4E0] flex flex-col items-center text-center shadow-2xs relative group hover:border-[#074031]/30 transition-all">
              <div className="w-14 h-14 rounded-full bg-[#FEBE16]/20 text-[#074031] flex items-center justify-center mb-4 relative">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-[#FEBE16] flex items-center justify-center text-[#074031]">
                  <FileText className="w-5 h-5 text-[#074031]" />
                </div>
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FEBE16] text-[#052F25] text-[10px] font-bold flex items-center justify-center">
                  2
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#074031] mb-1">
                {isBn ? "কাস্টম কোটেশন পান" : "Get a Custom Quote"}
              </h4>
              <p className="text-xs text-[#62706A] leading-relaxed">
                {isBn
                  ? "আমাদের টিম চাহিদা বিশ্লেষণ করে আপনাকে মানানসই কোটেশন পাঠাবে।"
                  : "Our team will analyze your needs and send you a tailored quotation."}
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-white border border-[#DCE4E0] flex flex-col items-center text-center shadow-2xs relative group hover:border-[#074031]/30 transition-all">
              <div className="w-14 h-14 rounded-full bg-[#FEBE16]/20 text-[#074031] flex items-center justify-center mb-4 relative">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-[#FEBE16] flex items-center justify-center text-[#074031]">
                  <CalendarCheck className="w-5 h-5 text-[#074031]" />
                </div>
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FEBE16] text-[#052F25] text-[10px] font-bold flex items-center justify-center">
                  3
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#074031] mb-1">
                {isBn ? "চূড়ান্ত ও পরিকল্পনা" : "Confirm & Plan"}
              </h4>
              <p className="text-xs text-[#62706A] leading-relaxed">
                {isBn
                  ? "সলিউশন নিশ্চিত করে সরবরাহ ও ইনস্টলেশনের শিডিউল নির্ধারণ করা হবে।"
                  : "We'll finalize the solution and schedule the delivery & installation."}
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-white border border-[#DCE4E0] flex flex-col items-center text-center shadow-2xs relative group hover:border-[#074031]/30 transition-all">
              <div className="w-14 h-14 rounded-full bg-[#FEBE16]/20 text-[#074031] flex items-center justify-center mb-4 relative">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-[#FEBE16] flex items-center justify-center text-[#074031]">
                  <Sun className="w-5 h-5 text-[#074031]" />
                </div>
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FEBE16] text-[#052F25] text-[10px] font-bold flex items-center justify-center">
                  4
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#074031] mb-1">
                {isBn ? "সৌরশক্তির যাত্রা শুরু" : "Go Solar"}
              </h4>
              <p className="text-xs text-[#62706A] leading-relaxed">
                {isBn
                  ? "পরিচ্ছন্ন, নির্ভরযোগ্য ও সাশ্রয়ী বিদ্যুৎ উপভোগ শুরু করুন!"
                  : "Start enjoying clean, reliable and affordable solar energy!"}
              </p>
            </div>
          </div>
        </div>

        {/* =========================================================================
            4. CTA BANNER: READY TO GO SOLAR?
            ========================================================================= */}
        <div className="rounded-[32px] overflow-hidden bg-[#074031] text-white p-8 sm:p-12 relative shadow-xl mb-16">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <Image
              src="/photos/cta-sunset-panels.webp"
              alt="Solar sunset background"
              fill
              className="object-cover"
            />
          </div>

          <div className="relative z-10 max-w-2xl">
            <h3 className="font-serif italic text-2xl sm:text-3xl text-[#FEBE16] font-bold mb-2">
              {isBn ? "সোলার শক্তি ব্যবহারে প্রস্তুত?" : "Ready to Go Solar?"}
            </h3>
            <p className="text-xs sm:text-sm text-white/85 leading-relaxed mb-6">
              {isBn
                ? "আজই আপনার বিনামূল্যে কোটেশন নিন এবং সারাদেশে হাজারো সন্তুষ্ট গ্রাহকদের সাথে যুক্ত হোন।"
                : "Get your free quotation today and join thousands of happy customers across Bangladesh."}
            </p>
            <a
              href="#quote-form"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FEBE16] hover:bg-[#E4A900] text-[#052F25] font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              <span>{isBn ? "কোটেশন রিকোয়েস্ট করুন →" : "Request a Quotation →"}</span>
            </a>
          </div>

          {/* Script Text in top right */}
          <div className="hidden sm:block absolute top-6 right-8 text-right pointer-events-none">
            <span className="font-serif italic text-white/90 text-lg font-bold block -rotate-2">
              Clean Energy Brighter Future ☀️
            </span>
          </div>
        </div>

        {/* =========================================================================
            5. TRUST BAR (3 Stats / Trust Badges)
            ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-t border-[#DCE4E0]/80">
          {/* Badge 1 */}
          <div className="flex items-center justify-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-full bg-[#FEBE16]/15 text-[#074031] flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-[#074031]" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-[#074031]">
                {isBn ? "৫,০০০+ বিশ্বস্ত গ্রাহক" : "Trusted by 5,000+ Customers"}
              </h5>
              <p className="text-[11px] text-[#62706A]">
                {isBn ? "বাসাবাড়ি, ব্যবসা ও শিল্প প্রতিষ্ঠান" : "Homes, businesses & industries"}
              </p>
            </div>
          </div>

          {/* Badge 2 */}
          <div className="flex items-center justify-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-full bg-[#FEBE16]/15 text-[#074031] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#074031]" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-[#074031]">
                {isBn ? "আন্তর্জাতিক সার্টিফায়েড পণ্য" : "Certified Products"}
              </h5>
              <p className="text-[11px] text-[#62706A]">
                {isBn ? "বিশ্বমানের শীর্ষ ব্র্যান্ডসমূহ" : "Top global brands & IDCOL approved"}
              </p>
            </div>
          </div>

          {/* Badge 3 */}
          <div className="flex items-center justify-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-full bg-[#FEBE16]/15 text-[#074031] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-[#074031]" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-[#074031]">
                {isBn ? "সমগ্র বাংলাদেশে সরবরাহ" : "Serving Across Bangladesh"}
              </h5>
              <p className="text-[11px] text-[#62706A]">
                {isBn ? "ঢাকা, চট্টগ্রাম, সিলেট সহ ৬৪ জেলায়" : "Dhaka, Chittagong, Sylhet & all 64 districts"}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
