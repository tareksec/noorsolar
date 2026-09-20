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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://noorsolaren.com";

  return {
    title: isBn
      ? "সার্টিফিকেশন ও কমপ্লায়েন্স মানদণ্ড | নূর সোলার এনার্জি"
      : "Certifications & Compliance Standards | Noor Solar Energy",
    description: isBn
      ? "নূর সোলার এনার্জির বাণিজ্যিক সরঞ্জামের অফিসিয়াল BSREA সদস্যপদ, ISO কোয়ালিটি ম্যানেজমেন্ট এবং ফ্যাক্টরি টেস্ট রিপোর্ট।"
      : "Official BSREA membership, ISO quality management, factory electrical test reports, and municipal trade compliance for Noor Solar Energy commercial equipment.",
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
        ? "সার্টিফিকেশন ও কমপ্লায়েন্স — নূর সোলার এনার্জি"
        : "Certifications & Compliance Standards — Noor Solar Energy",
      description: isBn
        ? "নূর সোলার এনার্জির ভেরিফাইড BSREA সদস্যপদ, ISO মানদণ্ড এবং ল্যাবরেটরি টেস্ট সার্টিফিকেট।"
        : "Explore verified BSREA membership, ISO standards, laboratory electrical testing, and safety certifications for Noor Solar Energy.",
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

  return (
    <div className="pt-28 sm:pt-36 pb-24 bg-[#E4E7E4] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-[#5C605C] hover:text-[#111311] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Page Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-xs font-mono text-[#111311] mb-4 border border-[#DDE1DC] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#CEF23E]"></span>
            <span>Compliance & Testing Registry</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#111311] leading-tight mb-4">
            Technical Certifications & Standards
          </h1>
          <p className="text-base text-[#5C605C] leading-relaxed">
            All solar modules, hybrid inverters, and lithium energy storage banks distributed by Noor Solar Energy adhere to rigorous laboratory testing, electrical inspection benchmarks, and national association accreditations.
          </p>
        </div>

        {/* 1. National Association Membership (BSREA Featured Spotlight) */}
        <div className="mb-16">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#5C605C] block">
                Primary Accreditation
              </span>
              <h2 className="text-2xl font-bold text-[#111311]">
                National Association Membership
              </h2>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CEF23E] text-[#111311] text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Official Registered Entity</span>
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
                  <span>Verified Active Member</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-[#111311] leading-snug">
                  Bangladesh Sustainable & Renewable Energy Association
                </h3>
                <p className="text-xs font-mono text-[#5C605C] mt-1">
                  Apex National Renewable Energy Body
                </p>
              </div>

              {/* Specifications & Document Details */}
              <div className="lg:col-span-8 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#DDE1DC]">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[#DDE1DC]">
                  <div>
                    <span className="text-[11px] font-mono text-[#5C605C] uppercase tracking-wider block">
                      Membership Certificate
                    </span>
                    <h4 className="text-lg sm:text-xl font-bold text-[#111311]">
                      BSREA Certificate of Membership
                    </h4>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CEF23E]/30 text-[#111311] text-xs font-semibold border border-[#CEF23E]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#111311]" />
                    <span>General Membership</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-[#F5F7F3] border border-[#E0E5DC]">
                    <span className="text-[11px] font-mono text-[#5C605C] block mb-1">
                      Registered Member Enterprise
                    </span>
                    <span className="text-sm font-bold text-[#111311]">
                      Tasneem Knitting Industry
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F5F7F3] border border-[#E0E5DC]">
                    <span className="text-[11px] font-mono text-[#5C605C] block mb-1">
                      Membership ID
                    </span>
                    <span className="text-sm font-bold font-mono text-[#111311]">
                      20260915GEN113
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F5F7F3] border border-[#E0E5DC]">
                    <span className="text-[11px] font-mono text-[#5C605C] block mb-1">
                      Date of Issue
                    </span>
                    <span className="text-sm font-semibold text-[#111311]">
                      September 15, 2026
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F5F7F3] border border-[#E0E5DC]">
                    <span className="text-[11px] font-mono text-[#5C605C] block mb-1">
                      Validity Period
                    </span>
                    <span className="text-sm font-semibold text-[#111311] flex items-center gap-1.5">
                      <span>December 31, 2026</span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                        Active
                      </span>
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#5C605C] leading-relaxed mb-6">
                  Tasneem Knitting Industry holds an active General Membership (20260915GEN113) issued by the Bangladesh Sustainable & Renewable Energy Association (BSREA). This certification demonstrates compliant enterprise governance, alignment with national renewable energy targets, and authenticated trade standing in Bangladesh.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={bsreaDocUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#111311] text-white text-xs font-semibold hover:bg-black transition-all"
                  >
                    <FileText className="w-4 h-4 text-[#CEF23E]" />
                    <span>View Official Certificate (Google Drive)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href="https://bsreabd.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#EDEDED] hover:bg-[#DDE1DC] text-[#111311] text-xs font-semibold transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5 text-[#5C605C]" />
                    <span>BSREA Official Web Portal</span>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* 2. Technical & Quality Management Standards Library */}
        <div className="mb-16">
          <div className="mb-8">
            <span className="text-xs font-mono uppercase tracking-wider text-[#5C605C] block">
              Inspection & Standards
            </span>
            <h2 className="text-2xl font-bold text-[#111311]">
              Technical Compliance & Quality Testing
            </h2>
            <p className="text-xs sm:text-sm text-[#5C605C] mt-1">
              Factory audit verifications, electrical performance testing, and commercial operating licenses.
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
                      <span>Verified Standard</span>
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
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#111311] hover:text-[#2E3B27] bg-[#EDEDED] hover:bg-[#CEF23E] px-3 py-1.5 rounded-full transition-colors"
                      >
                        <span>View Document</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[11px] font-mono text-[#828B7D] inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Active On Record</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Engineering Quality Assurance Protocols */}
        <div className="rounded-[32px] bg-[#EDEDED] border border-[#DDE1DC] p-8 sm:p-12 mb-16">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-mono uppercase tracking-wider text-[#5C605C] block">
              Quality Assurance
            </span>
            <h2 className="text-2xl font-bold text-[#111311] mt-1">
              Quality Control & Inspection Benchmarks
            </h2>
            <p className="text-sm text-[#5C605C] mt-2">
              Every shipment arriving at Chattogram Port undergoes multi-point inspection prior to warehouse acceptance and container dispatch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-[#DDE1DC]">
              <div className="w-10 h-10 rounded-xl bg-[#F5F7F3] border border-[#E0E5DC] flex items-center justify-center mb-4 text-[#111311]">
                <Zap className="w-5 h-5 text-[#111311]" />
              </div>
              <h3 className="font-bold text-base text-[#111311] mb-2">
                Flash Testing & EL Verification
              </h3>
              <p className="text-xs text-[#5C605C] leading-relaxed">
                Standard Test Condition (STC) flash data verified per pallet. Electroluminescence (EL) crack scanning ensures zero micro-fractures in silicon cells.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#DDE1DC]">
              <div className="w-10 h-10 rounded-xl bg-[#F5F7F3] border border-[#E0E5DC] flex items-center justify-center mb-4 text-[#111311]">
                <Lock className="w-5 h-5 text-[#111311]" />
              </div>
              <h3 className="font-bold text-base text-[#111311] mb-2">
                Dielectric & Insulation Withstand
              </h3>
              <p className="text-xs text-[#5C605C] leading-relaxed">
                Inverters and lithium batteries pass high-voltage isolation resistance tests, overvoltage surge suppression, and ground-fault protection audits.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#DDE1DC]">
              <div className="w-10 h-10 rounded-xl bg-[#F5F7F3] border border-[#E0E5DC] flex items-center justify-center mb-4 text-[#111311]">
                <Layers className="w-5 h-5 text-[#111311]" />
              </div>
              <h3 className="font-bold text-base text-[#111311] mb-2">
                Mechanical Wind & Snow Load
              </h3>
              <p className="text-xs text-[#5C605C] leading-relaxed">
                Solar frames certified to withstand 2400 Pa wind uplift loads and 5400 Pa mechanical downforce, engineered for coastal tropical cyclones.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Request Documentation CTA */}
        <div className="rounded-3xl bg-[#111311] text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center md:text-left">
            <span className="text-xs font-mono text-[#CEF23E] block mb-2 uppercase tracking-wider">
              B2B Verification Desk
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Need Batch-Specific Test Reports or Customs Dossiers?
            </h2>
            <p className="text-xs sm:text-sm text-[#9CA3AF] mt-2 leading-relaxed">
              We provide factory flash reports, customs bill of entry verification, and warranty certificates for container-scale procurement contracts and tenders.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#CEF23E] text-[#111311] text-xs font-bold hover:bg-[#b8da35] transition-colors"
            >
              <span>Contact Sales Desk</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 text-white text-xs font-semibold hover:bg-white/20 border border-white/10 transition-colors"
            >
              <span>Request Quote</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
