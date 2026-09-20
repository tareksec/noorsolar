import React from "react";
import Image from "next/image";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { getSiteSettings } from "@/lib/data/settings";
import { CheckCircle2, ArrowUpRight, ShieldCheck, Box, Zap, Award } from "lucide-react";

interface AboutPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isBn = locale === "bn";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://noorsolaren.com";

  return {
    title: isBn ? "আমাদের সম্পর্কে — নূর সোলার এনার্জি" : "About Us — Noor Solar Energy",
    description: isBn
      ? "নূর সোলার এনার্জি সম্পর্কে জানুন — বাংলাদেশে সোলার প্যানেল, লিথিয়াম-আয়ন ব্যাটারি এবং ইনভার্টারের সরাসরি আমদানিকারক ও পাইকারি সরবরাহকারী।"
      : "Learn about Noor Solar Energy, premier direct importer and bulk B2B supplier of solar panels, lithium-ion batteries, and inverters in Bangladesh.",
    alternates: {
      canonical: isBn ? `${siteUrl}/bn/about` : `${siteUrl}/about`,
      languages: {
        en: `${siteUrl}/about`,
        bn: `${siteUrl}/bn/about`,
        "x-default": `${siteUrl}/about`,
      },
    },
    openGraph: {
      title: isBn ? "আমাদের সম্পর্কে — নূর সোলার এনার্জি" : "About Us — Noor Solar Energy",
      description: isBn
        ? "বাংলাদেশে নবায়নযোগ্য শক্তি সরঞ্জামের সরাসরি আমদানিকারক ও পাইকারি পরিবেশক।"
        : "Direct importer and container-scale wholesale distributor of renewable energy systems in Bangladesh.",
      url: isBn ? "/bn/about" : "/about",
      type: "website",
      locale: isBn ? "bn_BD" : "en_US",
      images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Noor Solar Energy" }],
    },
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const settings = await getSiteSettings(locale);
  const isBn = locale === "bn";

  return (
    <div className="pt-28 sm:pt-36 pb-24 bg-[#E4E7E4] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* About Hero */}
        <div className="p-8 sm:p-14 rounded-[40px] bg-[#EDEDED] border border-[#DDE1DC] mb-16 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-xs font-mono text-[#111311] mb-4 border border-[#DDE1DC]">
                <span className="w-2 h-2 rounded-full bg-[#CEF23E]"></span>
                <span>{isBn ? "নূর সোলার এনার্জি সম্পর্কে" : "About Noor Solar Energy"}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#111311] leading-tight mb-6">
                {settings.aboutHeadline || (isBn ? "বাংলাদেশে উন্নত কারিগরি মানের সোলার সরঞ্জাম।" : "Engineering-Grade Solar Equipment for Bangladesh .")}
              </h1>
              <p className="text-base sm:text-lg text-[#5C605C] leading-relaxed mb-8">
                {settings.description}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#111311] text-white text-xs font-semibold hover:bg-black transition-colors"
                >
                  <span>{isBn ? "ক্যাটালগ দেখুন" : "Explore Catalog"}</span>
                  <ArrowUpRight className="w-4 h-4 text-[#CEF23E]" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#111311] text-xs font-semibold border border-[#DDE1DC] hover:border-[#111311] transition-colors"
                >
                  <span>{isBn ? "B2B কোটেশন চান" : "Request B2B Quote"}</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative aspect-4/3 w-full rounded-3xl overflow-hidden border border-[#DDE1DC] shadow-md bg-white">
                <Image
                  src="/photos/about-inspection.webp"
                  alt={isBn ? "নূর সোলার এনার্জির প্রকৌশলী দ্বারা সাইট পরিদর্শন ও মান নিয়ন্ত্রণ" : "Noor Solar Energy field engineers conducting on-site QA inspection"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="object-cover"
                />
                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-[#111311]/90 backdrop-blur-xs text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#CEF23E]" />
                    <span className="text-[11px] font-mono">{isBn ? "কারখানার গুণগত মান নিশ্চয়তা" : "Factory Quality Assurance"}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#CEF23E]">{isBn ? "IEC ও UL স্বীকৃত" : "IEC & UL Verified"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="p-8 rounded-3xl bg-white border border-[#DDE1DC] shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[#CEF23E]/30 flex items-center justify-center text-[#111311] mb-6">
              <ShieldCheck className="w-5 h-5 text-[#111311]" />
            </div>
            <h3 className="text-lg font-bold text-[#111311] mb-2">
              {isBn ? "সরাসরি প্রস্তুতকারক পার্টনারশিপ" : "Direct Factory Partnerships"}
            </h3>
            <p className="text-xs sm:text-sm text-[#5C605C] leading-relaxed">
              {isBn
                ? "আমরা সরাসরি আন্তর্জাতিক শীর্ষ প্রস্তুতকারকদের থেকে পূর্ণাঙ্গ টেকনিক্যাল ডেটাশিট সহ আসল সোলার প্যানেল, ব্যাটারি ও ইনভার্টার আমদানি করি।"
                : "We source directly from international manufacturers, supplying authentic solar modules, battery units, and inverters with complete technical specifications."}
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#DDE1DC] shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[#CEF23E]/30 flex items-center justify-center text-[#111311] mb-6">
              <Box className="w-5 h-5 text-[#111311]" />
            </div>
            <h3 className="text-lg font-bold text-[#111311] mb-2">
              {isBn ? "কনটেইনার ও বাল্ক পাইকারি সরবরাহ" : "Containerized Wholesale Supply"}
            </h3>
            <p className="text-xs sm:text-sm text-[#5C605C] leading-relaxed">
              {isBn
                ? "শিল্প কারখানা, ইপিসি ঠিকাদার এবং স্থানীয় ডিলারদের জন্য কেন্দ্রীয় ওয়্যারহাউস থেকে রেডি স্টক ও কনটেইনার চালানের মাধ্যমে পাইকারি সরবরাহ করি।"
                : "Serving industrial factories, EPC contractors, and regional solar dealers with bulk consignments, container shipments, and ready inventory at our central warehouse."}
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#DDE1DC] shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[#CEF23E]/30 flex items-center justify-center text-[#111311] mb-6">
              <Zap className="w-5 h-5 text-[#111311]" />
            </div>
            <h3 className="text-lg font-bold text-[#111311] mb-2">
              {isBn ? "কারিগরি যাচাই ও টেস্টিং" : "Technical Verification"}
            </h3>
            <p className="text-xs sm:text-sm text-[#5C605C] leading-relaxed">
              {isBn
                ? "প্রতিটি চালানের বৈদ্যুতিক প্যারামিটার, ফ্ল্যাশ টেস্ট এবং ব্যাটারির অভ্যন্তরীণ রোধ পরীক্ষা করা হয় যেন বাংলাদেশের গ্রিডে তা সেরা পারফরম্যান্স দেয়।"
                : "Every shipment is inspected for electrical parameters, flash test results, and battery internal resistance to ensure flawless integration into Bangladesh solar grids."}
            </p>
          </div>
        </div>

        {/* Visual Proof & Commercial Deployments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="rounded-[36px] bg-white border border-[#DDE1DC] p-6 sm:p-8 flex flex-col justify-between">
            <div className="relative aspect-16/10 w-full rounded-2xl overflow-hidden mb-6 bg-[#EDEDED]">
              <Image
                src="/photos/about-commercial-plant.webp"
                alt={isBn ? "বাংলাদেশে বাণিজ্যিক সোলার বিদ্যুৎ প্রকল্প" : "Utility-scale commercial solar plant in Bangladesh"}
                fill
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-cover"
              />
            </div>
            <div>
              <span className="text-xs font-mono text-[#5C605C] uppercase block mb-1 font-semibold">
                {isBn ? "ক্ষমতা ও নির্ভরযোগ্যতা" : "Scale & Reliability"}
              </span>
              <h3 className="text-xl font-bold text-[#111311] mb-2">
                {isBn ? "শিল্প ও বাণিজ্যিক মেগাওয়াট প্রকল্প" : "Utility & Commercial Megawatt Deployments"}
              </h3>
              <p className="text-xs sm:text-sm text-[#5C605C] leading-relaxed">
                {isBn
                  ? "দেশের বিভিন্ন তৈরি পোশাক কারখানা, শিল্প প্রতিষ্ঠান ও টেলিকম হাবের জন্য উচ্চ দক্ষতাসম্পন্ন সোলার সরঞ্জাম সরবরাহ করা হয়েছে।"
                  : "Supplying verified high-efficiency PV arrays and balance-of-system equipment for industrial garment rooftops, manufacturing facilities, and off-grid telecom hubs across the country."}
              </p>
            </div>
          </div>

          <div className="rounded-[36px] bg-white border border-[#DDE1DC] p-6 sm:p-8 flex flex-col justify-between">
            <div className="relative aspect-16/10 w-full rounded-2xl overflow-hidden mb-6 bg-[#EDEDED]">
              <Image
                src="/photos/about-operations.webp"
                alt={isBn ? "ছাদে সোলার প্যানেল ইনস্টলেশন কাজ" : "Solar technicians mounting solar modules on rooftop"}
                fill
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-cover"
              />
            </div>
            <div>
              <span className="text-xs font-mono text-[#5C605C] uppercase block mb-1 font-semibold">
                {isBn ? "মাঠপর্যায়ের সহায়তা" : "Field Support"}
              </span>
              <h3 className="text-xl font-bold text-[#111311] mb-2">
                {isBn ? "প্রকৌশল পরামর্শ ও ডিপো ডেলিভারি" : "Engineering Guidance & Depot Handover"}
              </h3>
              <p className="text-xs sm:text-sm text-[#5C605C] leading-relaxed">
                {isBn
                  ? "যান্ত্রিক সামঞ্জস্য, সঠিক স্ট্রিং সাইজিং এবং নির্বিঘ্ন ডেলিভারি নিশ্চিত করতে আমাদের বিশেষজ্ঞ দল আপনার প্রকৌশলীদের সাথে ঘনিষ্ঠভাবে কাজ করে।"
                  : "Direct coordination between our equipment specialists and your engineering contractors to ensure mechanical compatibility, correct string sizing, and seamless depot dispatch."}
              </p>
            </div>
          </div>
        </div>

        {/* Operating Principles */}
        <div className="p-8 sm:p-12 rounded-[36px] bg-white border border-[#DDE1DC]">
          <h2 className="text-2xl font-bold text-[#111311] mb-6 tracking-tight">
            {isBn ? "আমরা যেভাবে সোলার ডেভেলপার ও ঠিকাদারদের সহায়তা করি" : "How We Support Solar Developers & Contractors"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-[#5C605C]">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#111311] shrink-0 mt-0.5" />
              <span>
                {isBn
                  ? "বাণিজ্যিক EPC অনুমোদনের জন্য পূর্ণাঙ্গ কমপ্লায়েন্স ডকুমেন্টেশন ও ফ্যাক্টরি ফ্ল্যাশ টেস্ট ডেটাশিট প্রদান।"
                  : "Full compliance documentation and factory flash test datasheets for commercial EPC approvals."}
              </span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#111311] shrink-0 mt-0.5" />
              <span>
                {isBn
                  ? "প্রজেক্টের চালান ও ডেলিভারি আপডেটের জন্য ডেডিকেটেড সেলস ম্যানেজার।"
                  : "Dedicated commercial account managers for project indent schedules and shipping updates."}
              </span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#111311] shrink-0 mt-0.5" />
              <span>
                {isBn
                  ? "নিয়মিত ঠিকাদার ও আঞ্চলিক পরিবেশকদের জন্য নমনীয় বাণিজ্যিক শর্তাবলি।"
                  : "Flexible payment and commercial terms for repeat contractors and certified regional distributors."}
              </span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#111311] shrink-0 mt-0.5" />
              <span>
                {isBn
                  ? "বীমাকৃত নিরাপদ পরিবহন সুবিধার মাধ্যমে বাংলাদেশের ৬৪টি জেলায় নির্ভরযোগ্য লজিস্টিকস।"
                  : "Reliable logistics across 64 districts in Bangladesh with insured transport coverage."}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
