import React from "react";
import Image from "next/image";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { getSiteSettings } from "@/lib/data/settings";
import { CheckCircle2, ArrowUpRight, ShieldCheck, Box, Zap, Award } from "lucide-react";
import { SITE_URL } from "@/lib/site-config";

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
  const siteUrl = SITE_URL;

  return {
    title: isBn ? "আমাদের সম্পর্কে — নূর সোলার এনার্জি" : "About Us — Noor Solar Energy",
    description: isBn
      ? "নূর সোলার এনার্জি সম্পর্কে জানুন — বাংলাদেশে সোলার প্যানেল, LiFePO4 ব্যাটারি এবং ইনভার্টারের সরাসরি আমদানিকারক ও পাইকারি B2B সরবরাহকারী।"
      : "Learn about Noor Solar Energy, direct importer and bulk B2B supplier of solar panels, lithium-ion batteries, and inverters in Bangladesh.",
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
        ? "বাংলাদেশে কমার্শিয়াল ও প্রজেক্ট-গ্রেড সোলার ইকুইপমেন্টের সরাসরি আমদানিকারক ও পাইকারি পরিবেশক।"
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
    <div className="pt-28 sm:pt-36 pb-24 bg-[#F7F8F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* About Hero */}
        <div className="p-8 sm:p-14 rounded-[40px] bg-[#F1F4F1] border border-[#DCE4E0] mb-16 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-xs font-mono text-[#074031] mb-4 border border-[#DCE4E0]">
                <span className="w-2 h-2 rounded-full bg-[#FEBE16]"></span>
                <span>{isBn ? "নূর সোলার এনার্জি সম্পর্কে" : "About Noor Solar Energy"}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#074031] leading-tight mb-6">
                {settings.aboutHeadline || (isBn ? "বাংলাদেশে নির্ভরযোগ্য ও ইঞ্জিনিয়ারিং-গ্রেড সোলার ইকুইপমেন্ট সরবরাহ।" : "Engineering-Grade Solar Equipment for Bangladesh .")}
              </h1>
              <p className="text-base sm:text-lg text-[#62706A] leading-relaxed mb-8">
                {settings.description}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-full bg-[#FEBE16] text-[#052F25] text-xs font-bold hover:bg-[#E4A900] transition-colors shadow-sm"
                >
                  <span>{isBn ? "ইকুইপমেন্ট ক্যাটালগ দেখুন" : "View Equipment Catalog"}</span>
                  <ArrowUpRight className="w-4 h-4 text-[#052F25]" />
                </Link>
                <Link
                  href={isBn ? "/bn/quote" : "/quote"}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-full bg-white text-[#074031] text-xs font-semibold border border-[#DCE4E0] hover:border-[#074031] transition-colors"
                >
                  <span>{isBn ? "পাইকারি কোটেশন নিন" : "Request B2B Quote"}</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative aspect-4/3 w-full rounded-3xl overflow-hidden border border-[#DCE4E0] shadow-md bg-white">
                <Image
                  src={settings.businessPhotos?.productInspection || "/photos/about-inspection.webp"}
                  alt={isBn ? "নূর সোলার এনার্জি ইঞ্জিনিয়ারিং টিম কর্তৃক মান নিয়ন্ত্রণ ও স্পেক যাচাই" : "Noor Solar Energy engineering team conducting QA inspection"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="object-cover"
                />
                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-[#052F25]/90 backdrop-blur-xs text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#FEBE16]" />
                    <span className="text-[11px] font-mono">{isBn ? "ফ্যাক্টরি কোয়ালিটি নিশ্চয়তা" : "Factory Quality Assurance"}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#FEBE16] font-semibold">{isBn ? "IEC ও FAT ভেরিফাইড" : "IEC & FAT Verified"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="p-8 rounded-3xl bg-white border border-[#DCE4E0] shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[#074031]/10 flex items-center justify-center text-[#074031] mb-6">
              <ShieldCheck className="w-5 h-5 text-[#074031]" />
            </div>
            <h3 className="text-lg font-bold text-[#074031] mb-2">
              {isBn ? "সরাসরি প্রস্তুতকারক কারখানা থেকে আমদানি" : "Direct Factory Sourcing"}
            </h3>
            <p className="text-xs sm:text-sm text-[#62706A] leading-relaxed">
              {isBn
                ? "আমরা সরাসরি আন্তর্জাতিক শীর্ষ প্রস্তুতকারক কারখানা থেকে মূল টেকনিক্যাল ডেটাশিট ও ফ্যাক্টরি টেস্ট রিপোর্টসহ জেনুইন সোলার প্যানেল, LiFePO4 ব্যাটারি ও ইনভার্টার আমদানি করি।"
                : "We source directly from recognized manufacturing facilities, supplying authentic solar modules, battery units, and inverters with complete technical specifications and factory acceptance test reports."}
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#DCE4E0] shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[#074031]/10 flex items-center justify-center text-[#074031] mb-6">
              <Box className="w-5 h-5 text-[#074031]" />
            </div>
            <h3 className="text-lg font-bold text-[#074031] mb-2">
              {isBn ? "কন্টেইনার ও বাল্ক পাইকারি সরবরাহ" : "Containerized Wholesale Supply"}
            </h3>
            <p className="text-xs sm:text-sm text-[#62706A] leading-relaxed">
              {isBn
                ? "শিল্প প্রতিষ্ঠান, EPC ঠিকাদার এবং আঞ্চলিক ডিলারদের জন্য ঢাকা সেন্ট্রাল ডিপো থেকে রেডি স্টক এবং সরাসরি বন্দর থেকে ফুল কন্টেইনার চালানের মাধ্যমে পাইকারি সরবরাহ করা হয়।"
                : "Serving industrial factories, EPC contractors, and regional solar dealers with bulk container shipments and buffer stock inventory at our central Dhaka warehouse."}
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#DCE4E0] shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[#074031]/10 flex items-center justify-center text-[#074031] mb-6">
              <Zap className="w-5 h-5 text-[#074031]" />
            </div>
            <h3 className="text-lg font-bold text-[#074031] mb-2">
              {isBn ? "টেকনিক্যাল কমপ্লায়েন্স ও টেস্টিং" : "Technical Verification & Compliance"}
            </h3>
            <p className="text-xs sm:text-sm text-[#62706A] leading-relaxed">
              {isBn
                ? "প্রতিটি চালানের বৈদ্যুতিক প্যারামিটার, ফ্ল্যাশ টেস্ট কার্ভ এবং ব্যাটারির অভ্যন্তরীণ রোধ পুঙ্খানুপুঙ্খ যাচাই করা হয়—যাতে বাংলাদেশের আবহাওয়া ও গ্রিডে দীর্ঘমেয়াদী সর্বোচ্চ পারফরম্যান্স নিশ্চিত থাকে।"
                : "Every consignment is verified against factory flash test curves, insulation metrics, and battery internal resistance to ensure long-term durability in Bangladesh solar installations."}
            </p>
          </div>
        </div>

        {/* Visual Proof & Commercial Deployments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="rounded-[36px] bg-white border border-[#DCE4E0] p-6 sm:p-8 flex flex-col justify-between">
            <div className="relative aspect-16/10 w-full rounded-2xl overflow-hidden mb-6 bg-[#F1F4F1]">
              <Image
                src={settings.businessPhotos?.completedProjects || "/photos/about-commercial-plant.webp"}
                alt={isBn ? "বাংলাদেশে বাণিজ্যিক সোলার বিদ্যুৎ প্রকল্প সরঞ্জাম সরবরাহ" : "Utility-scale commercial solar plant in Bangladesh"}
                fill
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-cover"
              />
            </div>
            <div>
              <span className="text-xs font-mono text-[#62706A] uppercase block mb-1 font-semibold">
                {isBn ? "সরবরাহ সক্ষমতা ও স্কেল" : "Scale & Reliability"}
              </span>
              <h3 className="text-xl font-bold text-[#074031] mb-2">
                {isBn ? "শিল্প ও বাণিজ্যিক মেগাওয়াট প্রজেক্ট" : "Utility & Commercial Megawatt Deployments"}
              </h3>
              <p className="text-xs sm:text-sm text-[#62706A] leading-relaxed">
                {isBn
                  ? "দেশের শীর্ষ টেক্সটাইল, তৈরি পোশাক কারখানা ও বাণিজ্যিক রুফটপ প্রজেক্টের জন্য যাচাইকৃত উচ্চ-দক্ষতাসম্পন্ন সোলার প্যানেল, ইনভার্টার ও স্টোরেজ ইকুইপমেন্ট সরবরাহ।"
                  : "Supplying verified high-efficiency PV arrays and balance-of-system equipment for industrial garment rooftops, manufacturing facilities, and commercial solar projects across Bangladesh."}
              </p>
            </div>
          </div>

          <div className="rounded-[36px] bg-white border border-[#DCE4E0] p-6 sm:p-8 flex flex-col justify-between">
            <div className="relative aspect-16/10 w-full rounded-2xl overflow-hidden mb-6 bg-[#F1F4F1]">
              <Image
                src={settings.businessPhotos?.warehouse || "/photos/about-operations.webp"}
                alt={isBn ? "সেন্ট্রাল ওয়্যারহাউস ও ডিপো লজিস্টিকস" : "Central warehouse inventory and depot logistics"}
                fill
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-cover"
              />
            </div>
            <div>
              <span className="text-xs font-mono text-[#62706A] uppercase block mb-1 font-semibold">
                {isBn ? "ডিপো লজিস্টিকস ও ডিসপ্যাচ" : "Depot Logistics & Dispatch"}
              </span>
              <h3 className="text-xl font-bold text-[#074031] mb-2">
                {isBn ? "সেন্ট্রাল ওয়্যারহাউস ও দেশব্যাপী সাইট ডেলিভারি" : "Central Warehouse & Nationwide Transport"}
              </h3>
              <p className="text-xs sm:text-sm text-[#62706A] leading-relaxed">
                {isBn
                  ? "ঢাকার সেন্ট্রাল ওয়্যারহাউসে প্যালেট বাফার স্টক এবং চট্টগ্রাম ও মোংলা বন্দর থেকে সরাসরি প্রজেক্ট সাইটে কন্টেইনার ইনডেন্ট ডেলিভারি সুবিধা।"
                  : "Central warehouse buffer stock in Dhaka with scheduled dispatch across all 64 districts, plus port-to-site container indenting directly to project installations."}
              </p>
            </div>
          </div>
        </div>

        {/* B2B Credibility & Operations Factsheet */}
        <div className="p-8 sm:p-12 rounded-[36px] bg-white border border-[#DCE4E0] mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-mono text-[#62706A] uppercase block mb-1">
                {isBn ? "B2B পাইকারি কাঠামো ও সক্ষমতা" : "B2B Wholesale Operational Factsheet"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#074031] tracking-tight">
                {isBn ? "বাণিজ্যিক কার্যক্রম ও সরবরাহ সক্ষমতা" : "Commercial Operations & Supply Capabilities"}
              </h2>
            </div>
            <span className="text-xs font-mono text-[#074031] bg-[#F1F4F1] border border-[#DCE4E0] px-3.5 py-1.5 rounded-full self-start sm:self-auto font-medium">
              {isBn ? "B2B আমদানিকারক" : "B2B Equipment Importer"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            <div className="p-5 rounded-2xl bg-[#F1F4F1] border border-[#DCE4E0] space-y-2">
              <span className="font-mono font-bold text-[#074031] uppercase block">
                {isBn ? "মূল ইকুইপমেন্ট লাইনআপ" : "Core Equipment Lineup"}
              </span>
              <p className="text-[#62706A] leading-relaxed">
                {isBn
                  ? "N-Type TOPCon সোলার প্যানেল (৫৫০W–৬২০W+), LiFePO4 ব্যাটারি র্যাক (৫.১২kWh থেকে হাই-ভোল্টেজ ক্যাবিনেট), এবং বাণিজ্যিক ইনভার্টার (৫kW–৫০kW+)।"
                  : "N-Type TOPCon PV Modules (550W–620W+), LiFePO4 Rack Batteries (5.12 kWh to HV cabinets), and Commercial Inverters (5kW–50kW+)."}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F1F4F1] border border-[#DCE4E0] space-y-2">
              <span className="font-mono font-bold text-[#074031] uppercase block">
                {isBn ? "টার্গেট বায়ার নেটওয়ার্ক" : "Target Buyer Network"}
              </span>
              <p className="text-[#62706A] leading-relaxed">
                {isBn
                  ? "সোলার EPC ঠিকাদার, শিল্প কারখানা (RMG ও টেক্সটাইল), বাণিজ্যিক রুফটপ প্রজেক্ট এবং অনুমোদিত আঞ্চলিক সোলার ডিলার।"
                  : "Solar EPC Contractors, Industrial RMG & Textile Factories, Commercial Rooftop Developers, and Certified Regional Solar Dealers."}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F1F4F1] border border-[#DCE4E0] space-y-2">
              <span className="font-mono font-bold text-[#074031] uppercase block">
                {isBn ? "সরবরাহ ব্যবস্থা ও MOQ" : "Procurement Tiers & MOQ"}
              </span>
              <p className="text-[#62706A] leading-relaxed">
                {isBn
                  ? "ঢাকা ডিপো থেকে ন্যূনতম ১ প্যালেট পিকআপ সুবিধা এবং বড় প্রজেক্টের জন্য সরাসরি ২০ ফুট ও ৪০HQ ফুল কন্টেইনার ইনডেন্ট।"
                  : "Minimum Order Quantity starts at 1 pallet for warehouse pickup; container-scale 20ft/40HQ orders delivered direct from port."}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F1F4F1] border border-[#DCE4E0] space-y-2">
              <span className="font-mono font-bold text-[#074031] uppercase block">
                {isBn ? "লজিস্টিকস ও কভারেজ" : "Warehouse & Logistics Coverage"}
              </span>
              <p className="text-[#62706A] leading-relaxed">
                {isBn
                  ? `${settings.addressBn || settings.address}-এ অবস্থিত সেলস ডেস্ক এবং সেন্ট্রাল ডিপো থেকে বাংলাদেশের ৬৪ জেলায় সরাসরি সাইট ডেলিভারি সুবিধা।`
                  : `Commercial sales desk at ${settings.address}, with central warehouse depot coordinating insured dispatch across all 64 districts.`}
              </p>
            </div>
          </div>
        </div>

        {/* Operating Principles */}
        <div className="p-8 sm:p-12 rounded-[36px] bg-white border border-[#DCE4E0]">
          <h2 className="text-2xl font-bold text-[#074031] mb-6 tracking-tight">
            {isBn ? "আমরা যেভাবে EPC ঠিকাদার ও প্রজেক্ট পরিচালকদের সহায়তা করি" : "How We Support Solar Developers & Contractors"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-[#62706A]">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#074031] shrink-0 mt-0.5" />
              <span>
                {isBn
                  ? "বাণিজ্যিক EPC প্রজেক্ট অনুমোদনের জন্য ফ্যাক্টরি ফ্ল্যাশ টেস্ট রিপোর্ট ও প্রস্তুতকারকের অফিসিয়াল ওয়ারেন্টি সনদ প্রদান।"
                  : "Full compliance documentation, factory flash test curves, and manufacturer warranty certificates for commercial EPC approvals."}
              </span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#074031] shrink-0 mt-0.5" />
              <span>
                {isBn
                  ? "প্রজেক্টের চালান ও ডেলিভারি শিডিউলের সার্বক্ষণিক তদারকিতে ডেডিকেটেড সেলস ম্যানেজার।"
                  : "Dedicated commercial account managers for project indent schedules and shipping updates."}
              </span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#074031] shrink-0 mt-0.5" />
              <span>
                {isBn
                  ? "নিয়মিত ঠিকাদার ও রেজিস্টার্ড আঞ্চলিক ডিলারদের জন্য নমনীয় বাণিজ্যিক শর্তাবলি।"
                  : "Flexible payment and commercial terms for repeat contractors and certified regional distributors."}
              </span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#074031] shrink-0 mt-0.5" />
              <span>
                {isBn
                  ? "নিরাপদ পরিবহন ব্যবস্থাপনার মাধ্যমে বাংলাদেশের ৬৪ জেলায় সরাসরি সাইটে নির্ভরযোগ্য ডেলিভারি।"
                  : "Reliable logistics across 64 districts in Bangladesh with insured transport coverage."}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
