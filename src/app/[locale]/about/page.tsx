import React from "react";
import Image from "next/image";
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data/settings";
import Link from "next/link";
import { CheckCircle2, ArrowUpRight, ShieldCheck, Box, Zap, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us — Noor Solar Energy",
  description:
    "Learn about Noor Solar Energy, premier direct importer and bulk B2B supplier of solar panels, lithium-ion batteries, and inverters in Bangladesh.",
  openGraph: {
    title: "About Us — Noor Solar Energy",
    description:
      "Direct importer and container-scale wholesale distributor of renewable energy systems in Bangladesh.",
    url: "/about",
    type: "website",
  },
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <div className="pt-28 sm:pt-36 pb-24 bg-[#E4E7E4] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* About Hero */}
        <div className="p-8 sm:p-14 rounded-[40px] bg-[#EDEDED] border border-[#DDE1DC] mb-16 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-xs font-mono text-[#111311] mb-4 border border-[#DDE1DC]">
                <span className="w-2 h-2 rounded-full bg-[#CEF23E]"></span>
                <span>About Noor Solar Energy</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#111311] leading-tight mb-6">
                Engineering-Grade Solar Equipment for Bangladesh .
              </h1>
              <p className="text-base sm:text-lg text-[#5C605C] leading-relaxed mb-8">
                {settings.description}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#111311] text-white text-xs font-semibold hover:bg-black transition-colors"
                >
                  <span>Explore Catalog</span>
                  <ArrowUpRight className="w-4 h-4 text-[#CEF23E]" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#111311] text-xs font-semibold border border-[#DDE1DC] hover:border-[#111311] transition-colors"
                >
                  <span>Request B2B Quote</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative aspect-4/3 w-full rounded-3xl overflow-hidden border border-[#DDE1DC] shadow-md bg-white">
                <Image
                  src="/photos/about-inspection.webp"
                  alt="Noor Solar Energy field engineers conducting on-site QA inspection"
                  fill
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="object-cover"
                />
                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-[#111311]/90 backdrop-blur-xs text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#CEF23E]" />
                    <span className="text-[11px] font-mono">Factory Quality Assurance</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#CEF23E]">IEC & UL Verified</span>
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
              Direct Factory Partnerships
            </h3>
            <p className="text-xs sm:text-sm text-[#5C605C] leading-relaxed">
              We source directly from international manufacturers, supplying authentic solar modules, battery units, and inverters with complete technical specifications.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#DDE1DC] shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[#CEF23E]/30 flex items-center justify-center text-[#111311] mb-6">
              <Box className="w-5 h-5 text-[#111311]" />
            </div>
            <h3 className="text-lg font-bold text-[#111311] mb-2">
              Containerized Wholesale Supply
            </h3>
            <p className="text-xs sm:text-sm text-[#5C605C] leading-relaxed">
              Serving industrial factories, EPC contractors, and regional solar dealers with bulk consignments, container shipments, and ready inventory at our central warehouse.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#DDE1DC] shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[#CEF23E]/30 flex items-center justify-center text-[#111311] mb-6">
              <Zap className="w-5 h-5 text-[#111311]" />
            </div>
            <h3 className="text-lg font-bold text-[#111311] mb-2">
              Technical Verification
            </h3>
            <p className="text-xs sm:text-sm text-[#5C605C] leading-relaxed">
              Every shipment is inspected for electrical parameters, flash test results, and battery internal resistance to ensure flawless integration into Bangladesh solar grids.
            </p>
          </div>
        </div>

        {/* Visual Proof & Commercial Deployments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="rounded-[36px] bg-white border border-[#DDE1DC] p-6 sm:p-8 flex flex-col justify-between">
            <div className="relative aspect-16/10 w-full rounded-2xl overflow-hidden mb-6 bg-[#EDEDED]">
              <Image
                src="/photos/about-commercial-plant.webp"
                alt="Utility-scale commercial solar plant in Bangladesh"
                fill
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-cover"
              />
            </div>
            <div>
              <span className="text-xs font-mono text-[#5C605C] uppercase block mb-1 font-semibold">Scale & Reliability</span>
              <h3 className="text-xl font-bold text-[#111311] mb-2">Utility & Commercial Megawatt Deployments</h3>
              <p className="text-xs sm:text-sm text-[#5C605C] leading-relaxed">
                Supplying verified high-efficiency PV arrays and balance-of-system equipment for industrial garment rooftops, manufacturing facilities, and off-grid telecom hubs across the country.
              </p>
            </div>
          </div>

          <div className="rounded-[36px] bg-white border border-[#DDE1DC] p-6 sm:p-8 flex flex-col justify-between">
            <div className="relative aspect-16/10 w-full rounded-2xl overflow-hidden mb-6 bg-[#EDEDED]">
              <Image
                src="/photos/about-operations.webp"
                alt="Solar technicians mounting solar modules on rooftop"
                fill
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-cover"
              />
            </div>
            <div>
              <span className="text-xs font-mono text-[#5C605C] uppercase block mb-1 font-semibold">Field Support</span>
              <h3 className="text-xl font-bold text-[#111311] mb-2">Engineering Guidance & Depot Handover</h3>
              <p className="text-xs sm:text-sm text-[#5C605C] leading-relaxed">
                Direct coordination between our equipment specialists and your engineering contractors to ensure mechanical compatibility, correct string sizing, and seamless depot dispatch.
              </p>
            </div>
          </div>
        </div>

        {/* Operating Principles */}
        <div className="p-8 sm:p-12 rounded-[36px] bg-white border border-[#DDE1DC]">
          <h2 className="text-2xl font-bold text-[#111311] mb-6 tracking-tight">
            How We Support Solar Developers & Contractors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-[#5C605C]">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#111311] shrink-0 mt-0.5" />
              <span>Full compliance documentation and factory flash test datasheets for commercial EPC approvals.</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#111311] shrink-0 mt-0.5" />
              <span>Dedicated commercial account managers for project indent schedules and shipping updates.</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#111311] shrink-0 mt-0.5" />
              <span>Flexible payment and commercial terms for repeat contractors and certified regional distributors.</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#111311] shrink-0 mt-0.5" />
              <span>Reliable logistics across 64 districts in Bangladesh with insured transport coverage.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
