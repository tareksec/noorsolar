import React from "react";
import Image from "next/image";
import type { Metadata } from "next";
import { getCertifications } from "@/lib/data/content";
import { AppImage } from "@/components/ui/app-image";
import {
  ShieldCheck,
  ExternalLink,
  CheckCircle2,
  FileText,
  Globe,
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  Layers,
  Zap,
  Lock,
} from "lucide-react";

import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site-config";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface CertificationsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: CertificationsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isBn = locale === "bn";
  const siteUrl = SITE_URL;

  return {
    title: isBn
      ? "শিল্প সমিতি সদস্যপদ ও নথি | নূর সোলার এনার্জি"
      : "Industry Membership & Compliance Documents | Noor Solar Energy",
    description: isBn
      ? "বাংলাদেশ সাসটেইনেবল অ্যান্ড রিনিউয়েবল এনার্জি অ্যাসোসিয়েশন (BSREA) সদস্যপদ ও বাণিজ্যিক মানদণ্ড নথি।"
      : "Official BSREA industry association membership and commercial compliance documentation for Noor Solar Energy.",
    alternates: {
      canonical: isBn ? `${siteUrl}/bn/certifications` : `${siteUrl}/certifications`,
      languages: {
        en: `${siteUrl}/certifications`,
        bn: `${siteUrl}/bn/certifications`,
        "x-default": `${siteUrl}/certifications`,
      },
    },
    openGraph: {
      title: isBn
        ? "শিল্প সমিতি সদস্যপদ ও নথি — নূর সোলার এনার্জি"
        : "Industry Membership & Compliance Documents — Noor Solar Energy",
      description: isBn
        ? "BSREA সদস্যপদ ও বাণিজ্যিক সোলার সরঞ্জামের কোয়ালিটি কন্ট্রোল মানদণ্ড।"
        : "Explore official BSREA membership and commercial solar quality benchmarks for Noor Solar Energy.",
      url: isBn ? "/bn/certifications" : "/certifications",
      type: "website",
      locale: isBn ? "bn_BD" : "en_US",
    },
  };
}

export default async function CertificationsPage({ params }: CertificationsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const certifications = await getCertifications(locale);

  // Find BSREA Certificate
  const bsreaCert = certifications.find(
    (c) =>
      c.name.toLowerCase().includes("bsrea") ||
      (c.issuer && c.issuer.toLowerCase().includes("bsrea"))
  );

  // Filter others
  const otherCerts = certifications.filter(
    (c) => c.id !== bsreaCert?.id
  );

  const bsreaDocUrl =
    "https://drive.google.com/file/d/1GR4hILXnDjJblqNmrxRNnWH_M7It4Md2/view?usp=sharing";

  const isBn = locale === "bn";

  return (
    <div className="pt-28 sm:pt-36 pb-24 bg-[#E4E7E4] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center min-h-[44px] gap-2 text-xs font-mono text-[#5C605C] hover:text-[#111311] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isBn ? "হোমে ফিরুন" : "Back to Home"}</span>
          </Link>
        </div>

        {/* Page Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-xs font-mono text-[#111311] mb-4 border border-[#DDE1DC] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#CEF23E]"></span>
            <span>{isBn ? "সদস্যপদ ও কমপ্লায়েন্স রেজিস্ট্রি" : "Membership & Compliance Registry"}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#111311] leading-tight mb-4">
            {isBn ? "শিল্প সমিতি সদস্যপদ ও কমপ্লায়েন্স" : "Industry Membership & Compliance Documents"}
          </h1>
          <p className="text-base text-[#5C605C] leading-relaxed">
            {isBn
              ? "নবায়নযোগ্য জ্বালানি খাতের প্রাতিষ্ঠানিক সমিতি সদস্যপদ এবং প্রকল্প পর্যায়ে সরবরাহকৃত সরঞ্জামের কারিগরি মানদণ্ড সংক্রান্ত তথ্যাবলি।"
              : "Official industry association membership records and technical quality standards for commercial solar equipment supplied across Bangladesh."}
          </p>
        </div>

        {/* 1. National Association Membership (BSREA Featured Spotlight) */}
        <div className="mb-16">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#5C605C] block">
                {isBn ? "শিল্প সমিতি সদস্যপদ" : "Industry Membership"}
              </span>
              <h2 className="text-2xl font-bold text-[#111311]">
                {isBn ? "জাতীয় সমিতি সদস্যপদ" : "National Association Membership"}
              </h2>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CEF23E] text-[#111311] text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isBn ? "অফিসিয়াল নিবন্ধিত সদস্য" : "Official Registered Member"}</span>
            </span>
          </div>

          <div className="rounded-[32px] sm:rounded-[40px] bg-[#EDEDED] border border-[#DDE1DC] p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-xs">
            {/* Background image overlay */}
            <div className="absolute inset-0 z-0 opacity-25 pointer-events-none">
              <Image
                src="/photos/bsrea-compliance-bg.webp"
                alt="BSREA Solar Background"
                fill
                className="object-cover object-center"
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
              
              {/* Crest & Identity */}
              <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white p-3 border border-[#DDE1DC] shadow-xs flex items-center justify-center mb-5 shrink-0">
                  <Image
                    src={bsreaCert?.image || "/photos/bsrea-logo.png"}
                    alt="BSREA Logo"
                    width={100}
                    height={100}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111311] text-[#CEF23E] text-xs font-mono mb-3">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#CEF23E]" />
                  <span>{isBn ? "সক্রিয় সাধারণ সদস্য" : "Active General Member"}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-[#111311] leading-snug">
                  {isBn ? "বাংলাদেশ সাসটেইনেবল অ্যান্ড রিনিউয়েবল এনার্জি অ্যাসোসিয়েশন" : "Bangladesh Sustainable & Renewable Energy Association"}
                </h3>
                <p className="text-xs font-mono text-[#5C605C] mt-1">
                  {isBn ? "জাতীয় শীর্ষ নবায়নযোগ্য জ্বালানি সংস্থা" : "Apex National Renewable Energy Body"}
                </p>
              </div>

              {/* Specifications & Document Details */}
              <div className="lg:col-span-8 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#DDE1DC]">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[#DDE1DC]">
                  <div>
                    <span className="text-[11px] font-mono text-[#5C605C] uppercase tracking-wider block">
                      {isBn ? "সদস্যপদ সনদ" : "Membership Certificate"}
                    </span>
                    <h4 className="text-lg sm:text-xl font-bold text-[#111311]">
                      {isBn ? "BSREA সদস্যপদ সনদপত্র" : "BSREA Certificate of Membership"}
                    </h4>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CEF23E]/30 text-[#111311] text-xs font-semibold border border-[#CEF23E]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#111311]" />
                    <span>{isBn ? "সাধারণ সদস্যপদ" : "General Membership"}</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-[#F5F7F3] border border-[#E0E5DC]">
                    <span className="text-[11px] font-mono text-[#5C605C] block mb-1">
                      {isBn ? "সনদধারী নিবন্ধিত প্রতিষ্ঠান" : "Certificate Holder / Registered Entity"}
                    </span>
                    <span className="text-sm font-bold text-[#111311]">
                      Tasneem Knitting Industry
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F5F7F3] border border-[#E0E5DC]">
                    <span className="text-[11px] font-mono text-[#5C605C] block mb-1">
                      {isBn ? "মেম্বারশিপ নম্বর" : "Membership ID"}
                    </span>
                    <span className="text-sm font-bold font-mono text-[#111311]">
                      20260915GEN113
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F5F7F3] border border-[#E0E5DC]">
                    <span className="text-[11px] font-mono text-[#5C605C] block mb-1">
                      {isBn ? "ডকুমেন্ট টাইপ" : "Document Type"}
                    </span>
                    <span className="text-sm font-semibold text-[#111311]">
                      {isBn ? "সাধারণ সদস্যপদ সনদ" : "General Membership Certificate"}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F5F7F3] border border-[#E0E5DC]">
                    <span className="text-[11px] font-mono text-[#5C605C] block mb-1">
                      {isBn ? "মেয়াদ" : "Validity Period"}
                    </span>
                    <span className="text-sm font-semibold text-[#111311] flex items-center gap-1.5">
                      <span>{isBn ? "৩১ ডিসেম্বর, ২০২৬" : "December 31, 2026"}</span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                        {isBn ? "সক্রিয়" : "Active"}
                      </span>
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#5C605C] leading-relaxed mb-6">
                  {isBn
                    ? "বিএসআরইএ (BSREA) সাধারণ সদস্যপদ সনদপত্রটি (২০২৬০৯১৫GEN১১৩) সনদধারী নিবন্ধিত প্রতিষ্ঠান তাসনিম নিটিং ইন্ডাস্ট্রির অনুকূলে ইস্যুকৃত, যা বাংলাদেশে নূর সোলার এনার্জির বাণিজ্যিক নবায়নযোগ্য শক্তি কার্যক্রমের প্রাতিষ্ঠানিক সমিতি সদস্যপদ নিশ্চিত করে।"
                    : "The official BSREA General Membership (20260915GEN113) is held under registered entity Tasneem Knitting Industry, serving as the trade association membership documentation for Noor Solar Energy operations in Bangladesh."}
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={bsreaDocUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-full bg-[#111311] text-white text-xs font-semibold hover:bg-black transition-all"
                  >
                    <FileText className="w-4 h-4 text-[#CEF23E]" />
                    <span>{isBn ? "অফিসিয়াল সনদ দেখুন (Google Drive)" : "View Official Certificate (Google Drive)"}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href="https://bsreabd.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-full bg-[#EDEDED] hover:bg-[#DDE1DC] text-[#111311] text-xs font-semibold transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5 text-[#5C605C]" />
                    <span>{isBn ? "BSREA অফিসিয়াল পোর্টাল" : "BSREA Official Web Portal"}</span>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* 2. Technical & Quality Management Standards Library (Rendered only when real verified documents exist) */}
        {otherCerts.length > 0 && (
          <div className="mb-16">
            <div className="mb-8">
              <span className="text-xs font-mono uppercase tracking-wider text-[#5C605C] block">
                {isBn ? "পরিদর্শন ও মানদণ্ড" : "Inspection & Standards"}
              </span>
              <h2 className="text-2xl font-bold text-[#111311]">
                {isBn ? "প্রযুক্তিগত কমপ্লায়েন্স ও মান নিয়ন্ত্রণ পরীক্ষা" : "Technical Compliance & Quality Testing"}
              </h2>
              <p className="text-xs sm:text-sm text-[#5C605C] mt-1">
                {isBn
                  ? "ফ্যাক্টরি অডিট যাচাই, বৈদ্যুতিক সক্ষমতা পরীক্ষা এবং বাণিজ্যিক পরিচালনা অনুমোদন।"
                  : "Factory audit verifications, electrical performance testing, and commercial operating licenses."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherCerts.map((cert) => {
              const urlMatch = cert.description?.match(/https?:\/\/[^\s]+/i);
              const docUrl = urlMatch ? urlMatch[0] : null;
              const cleanDesc = cert.description
                ? cert.description.replace(/Document:\s*https?:\/\/[^\s]+/i, "").trim()
                : "";

              return (
                <div
                  key={cert.id}
                  className="rounded-2xl bg-white border border-[#DDE1DC] p-6 shadow-xs hover:border-[#111311] transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-14 h-14 rounded-xl bg-[#EDEDED] flex items-center justify-center mb-5 overflow-hidden relative border border-[#DDE1DC] shrink-0">
                      {cert.image ? (
                        <AppImage
                          src={cert.image}
                          alt={cert.name}
                          width={56}
                          height={56}
                          className="w-full h-full object-contain p-1.5"
                        />
                      ) : (
                        <ShieldCheck className="w-7 h-7 text-[#111311]" />
                      )}
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F5F7F3] text-[10px] font-mono text-[#5C605C] mb-2 border border-[#E0E5DC]">
                      <BadgeCheck className="w-3 h-3 text-[#111311]" />
                      <span>{isBn ? "যাচাইকৃত মানদণ্ড" : "Verified Standard"}</span>
                    </div>
                    <h3 className="text-base font-bold text-[#111311] group-hover:text-black mb-1">
                      {cert.name}
                    </h3>
                    {cert.issuer && (
                      <div className="text-xs font-mono text-[#5C605C] mb-3 font-medium">
                        {cert.issuer}
                      </div>
                    )}
                    {cleanDesc && (
                      <p className="text-xs text-[#5C605C] leading-relaxed">
                        {cleanDesc}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#DDE1DC]/70">
                    {docUrl ? (
                      <a
                        href={docUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#111311] hover:text-[#2E3B27] bg-[#EDEDED] hover:bg-[#CEF23E] px-3.5 py-2 rounded-full min-h-[44px] transition-colors"
                      >
                        <span>{isBn ? "নথি দেখুন" : "View Document"}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[11px] font-mono text-[#828B7D] inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{isBn ? "নথিতে সক্রিয়" : "Active On Record"}</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

        {/* 3. Engineering Quality Assurance Protocols */}
        <div className="rounded-[32px] bg-[#EDEDED] border border-[#DDE1DC] p-8 sm:p-12 mb-16">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-mono uppercase tracking-wider text-[#5C605C] block">
              {isBn ? "কোয়ালিটি অ্যাসিউরেন্স" : "Quality Assurance"}
            </span>
            <h2 className="text-2xl font-bold text-[#111311] mt-1">
              {isBn ? "কোয়ালিটি কন্ট্রোল ও পরিদর্শন নীতিমালা" : "Quality Control & Inspection Benchmarks"}
            </h2>
            <p className="text-sm text-[#5C605C] mt-2">
              {isBn
                ? "চট্টগ্রাম বন্দরে আসা প্রতিটি চালান গুদামে প্রবেশ এবং কন্টেইনার ডেলিভারির আগে বহুস্তরীয় কঠোর পরীক্ষার মধ্য দিয়ে যায়।"
                : "Every shipment arriving at Chattogram Port undergoes multi-point inspection prior to warehouse acceptance and container dispatch."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-[#DDE1DC]">
              <div className="w-10 h-10 rounded-xl bg-[#F5F7F3] border border-[#E0E5DC] flex items-center justify-center mb-4 text-[#111311]">
                <Zap className="w-5 h-5 text-[#111311]" />
              </div>
              <h3 className="font-bold text-base text-[#111311] mb-2">
                {isBn ? "ফ্ল্যাশ টেস্টিং ও EL ভেরিফিকেশন" : "Flash Testing & EL Verification"}
              </h3>
              <p className="text-xs text-[#5C605C] leading-relaxed">
                {isBn
                  ? "প্রতিটি প্যালেটের জন্য STC ফ্ল্যাশ টেস্ট ডাটা যাচাই করা হয়। কোনো মাইক্রো-ফাটল নেই তা নিশ্চিত করতে হয় ইলেক্ট্রোলুমিনেসেন্স (EL) স্ক্যানিং।"
                  : "Standard Test Condition (STC) flash data verified per pallet. Electroluminescence (EL) crack scanning ensures zero micro-fractures in silicon cells."}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#DDE1DC]">
              <div className="w-10 h-10 rounded-xl bg-[#F5F7F3] border border-[#E0E5DC] flex items-center justify-center mb-4 text-[#111311]">
                <Lock className="w-5 h-5 text-[#111311]" />
              </div>
              <h3 className="font-bold text-base text-[#111311] mb-2">
                {isBn ? "ডাইইলেকট্রিক ও ইনসুলেশন সহনশীলতা" : "Dielectric & Insulation Withstand"}
              </h3>
              <p className="text-xs text-[#5C605C] leading-relaxed">
                {isBn
                  ? "ইনভার্টার ও লিথিয়াম ব্যাটারি উচ্চ ভোল্টেজ আইসোলেশন রেজিস্ট্যান্স, ওভারভোল্টেজ সার্জ সুরক্ষা এবং গ্রাউন্ড-ফল্ট অডিট পাস করে।"
                  : "Inverters and lithium batteries pass high-voltage isolation resistance tests, overvoltage surge suppression, and ground-fault protection audits."}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#DDE1DC]">
              <div className="w-10 h-10 rounded-xl bg-[#F5F7F3] border border-[#E0E5DC] flex items-center justify-center mb-4 text-[#111311]">
                <Layers className="w-5 h-5 text-[#111311]" />
              </div>
              <h3 className="font-bold text-base text-[#111311] mb-2">
                {isBn ? "বাতাস ও কাঠামোগত লোড সহনশীলতা" : "Mechanical Wind & Snow Load"}
              </h3>
              <p className="text-xs text-[#5C605C] leading-relaxed">
                {isBn
                  ? "প্যানেল ফ্রেম ২৪০০ Pa আপলিফট উইন্ড লোড এবং ৫৪০০ Pa মেকানিক্যাল প্রেসার সহ্য করতে সক্ষম, যা দেশের উপকূলীয় ঘূর্ণিঝড়ের জন্য উপযুক্ত।"
                  : "Solar frames certified to withstand 2400 Pa wind uplift loads and 5400 Pa mechanical downforce, engineered for coastal tropical cyclones."}
              </p>
            </div>
          </div>
        </div>

        {/* 4. Request Documentation CTA */}
        <div className="rounded-3xl bg-[#111311] text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center md:text-left">
            <span className="text-xs font-mono text-[#CEF23E] block mb-2 uppercase tracking-wider">
              {isBn ? "B2B ভেরিফিকেশন ডেস্ক" : "B2B Verification Desk"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {isBn ? "ব্যাচ-নির্দিষ্ট টেস্ট রিপোর্ট বা কাস্টমস নথি প্রয়োজন?" : "Need Batch-Specific Test Reports or Customs Dossiers?"}
            </h2>
            <p className="text-xs sm:text-sm text-[#9CA3AF] mt-2 leading-relaxed">
              {isBn
                ? "কন্টেইনার স্কেল ক্রয় চুক্তি ও টেন্ডারের জন্য আমরা ফ্যাক্টরি ফ্ল্যাশ রিপোর্ট, বিল অব এন্ট্রি ভেরিফিকেশন এবং ওয়ারেন্টি সনদ সরবরাহ করি।"
                : "We provide factory flash reports, customs bill of entry verification, and warranty certificates for container-scale procurement contracts and tenders."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-full bg-[#CEF23E] text-[#111311] text-xs font-bold hover:bg-[#b8da35] transition-colors"
            >
              <span>{isBn ? "সেলস ডেস্কে যোগাযোগ করুন" : "Contact Sales Desk"}</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-full bg-white/10 text-white text-xs font-semibold hover:bg-white/20 border border-white/10 transition-colors"
            >
              <span>{isBn ? "কোটেশন চান" : "Request Quote"}</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
