import React from "react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing, Link } from "@/i18n/routing";
import { getPublishedProjects } from "@/lib/data/projects";
import { AppImage as Image } from "@/components/ui/app-image";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import {
  MapPin,
  Zap,
  Building2,
  PackageCheck,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Award,
  Factory,
  CheckCircle2,
} from "lucide-react";
import { SITE_URL } from "@/lib/site-config";

export const revalidate = 60;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface ProjectsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ProjectsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isBn = locale === "bn";
  const siteUrl = SITE_URL;

  return {
    title: isBn
      ? "বাস্তবায়িত সৌর বিদ্যুৎ প্রকল্প ও সরঞ্জাম সরবরাহ রেফারেন্স | নূর সোলার এনার্জি"
      : "Verified Solar Project References & Supply Case Studies | Noor Solar Energy",
    description: isBn
      ? "বাংলাদেশের বিভিন্ন শিল্প কারখানা, বাণিজ্যিক ছাদ ও মেগাওয়াট স্কেল সৌর বিদ্যুৎ প্রকল্পে সরবরাহকৃত ইকুইপমেন্ট ও বাস্তবায়ন রেফারেন্স।"
      : "Explore verified commercial rooftop, factory, and MW supply references completed across Bangladesh with engineering-grade solar equipment.",
    alternates: {
      canonical: isBn ? `${siteUrl}/bn/projects` : `${siteUrl}/projects`,
      languages: {
        en: `${siteUrl}/projects`,
        bn: `${siteUrl}/bn/projects`,
        "x-default": `${siteUrl}/projects`,
      },
    },
    openGraph: {
      title: isBn
        ? "বাস্তবায়িত সৌর বিদ্যুৎ প্রকল্পসমূহ — নূর সোলার এনার্জি"
        : "Verified Project Supply References — Noor Solar Energy",
      description: isBn
        ? "বাংলাদেশে বাণিজ্যিক ছাদ ও শিল্প কারখানায় সরবরাহকৃত আসল সৌর বিদ্যুৎ প্রকল্পের প্রমাণ ও স্পেসিফিকেশন।"
        : "Real commercial rooftop, industrial facility, and utility arrays supplied with engineering-grade equipment.",
      url: isBn ? `${siteUrl}/bn/projects` : `${siteUrl}/projects`,
      type: "website",
    },
  };
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isBn = locale === "bn";
  const projects = await getPublishedProjects(locale);

  return (
    <div className="bg-[#FAFBF9] min-h-screen text-[#17251F]">
      {/* Header / Hero Section */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 bg-gradient-to-b from-[#0B513E] via-[#074031] to-[#052F25] text-white overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#FEBE16]/10 blur-3xl pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-300/80 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              {isBn ? "হোম" : "Home"}
            </Link>
            <span>/</span>
            <span className="text-white">{isBn ? "প্রকল্প রেফারেন্স" : "Projects & Proof"}</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 text-xs font-mono text-[#FEBE16] mb-4">
              <span className="w-2 h-2 rounded-full bg-[#FEBE16] animate-pulse" />
              <span>{isBn ? "প্রমাণিত বাস্তব অভিজ্ঞতা" : "Verified Field References"}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
              {isBn ? "বাস্তবায়িত সৌর প্রকল্প ও সরবরাহ রেফারেন্স" : "Verified Project Supply References"}
            </h1>
            <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed font-light">
              {isBn
                ? "বাংলাদেশের শীর্ষস্থানীয় টেক্সটাইল, শিল্প কারখানা, বাণিজ্যিক কমপ্লেক্স ও কোল্ড স্টোরেজ প্রকল্পে সরবরাহকৃত প্রকৌশল-গ্রেড সোলার মডিউল, ইনভার্টার ও লিথিয়াম ব্যাটারি ব্যাংকের আসল রেফারেন্স।"
                : "Real commercial rooftop, industrial manufacturing facility, and utility arrays supplied with container-scale Tier-1 solar modules, string inverters, and high-voltage energy storage systems."}
            </p>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/15">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#FEBE16]">
                  2.5+ MW
                </div>
                <div className="text-xs text-emerald-200/80 mt-1">
                  {isBn ? "মোট ইনস্টলেশন ক্ষমতা" : "Total Capacity Supplied"}
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                  100%
                </div>
                <div className="text-xs text-emerald-200/80 mt-1">
                  {isBn ? "টায়ার-১ মূল প্রস্তুতকারক" : "Verified Tier-1 Brands"}
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-300">
                  BSREA
                </div>
                <div className="text-xs text-emerald-200/80 mt-1">
                  {isBn ? "নিবন্ধিত সাধারণ সদস্য" : "Certified Member"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid Section */}
      <section className="py-16 sm:py-24 bg-[#FAFBF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-[#DCE4E0]">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#074031]">
                {isBn ? "বাণিজ্যিক ও শিল্প প্রকল্পসমূহ" : "Commercial & Industrial Installations"}
              </h2>
              <p className="text-xs sm:text-sm text-[#62706A] mt-1">
                {isBn
                  ? "বিস্তারিত দেখতে এবং সরবরাহকৃত সরঞ্জামের স্পেসিফিকেশন জানতে কার্ডে ক্লিক করুন।"
                  : "Click on any project reference to inspect supplied bill of materials and technical specifications."}
              </p>
            </div>
            <div className="text-xs font-mono text-[#074031] bg-white px-3 py-1.5 rounded-full border border-[#DCE4E0] w-fit">
              {projects.length} {isBn ? "টি রেফারেন্স" : "Verified References"}
            </div>
          </div>

          <RevealGroup staggerDelay={0.08} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <RevealItem key={project.id} className="h-full">
                <Link
                  href={`/projects/${project.slug}`}
                  className="h-full rounded-[28px] bg-white border border-[#DCE4E0] hover:border-[#074031] overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-300 group cursor-pointer"
                >
                  {/* Image Container */}
                  <div className="relative aspect-16/10 w-full bg-[#F1F4F1] overflow-hidden">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#62706A]">
                        <Factory className="w-12 h-12 stroke-[1.5]" />
                      </div>
                    )}
                    {project.capacity && (
                      <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#052F25]/90 backdrop-blur-xs text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-xs">
                        <Zap className="w-3.5 h-3.5 text-[#FEBE16]" />
                        <span>{project.capacity}</span>
                      </div>
                    )}
                    {project.projectType && (
                      <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-xs text-[#074031] text-[11px] font-mono font-bold shadow-xs">
                        {project.projectType}
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                    <div>
                      {project.location && (
                        <div className="flex items-center gap-1 text-[11px] font-mono text-[#62706A] mb-2">
                          <MapPin className="w-3 h-3 text-[#074031]" />
                          <span>{project.location}</span>
                        </div>
                      )}

                      <h3 className="text-lg sm:text-xl font-bold text-[#17251F] group-hover:text-[#074031] transition-colors mb-2 leading-snug">
                        {project.title}
                      </h3>

                      {project.clientName && (
                        <div className="flex items-center gap-1.5 text-xs text-[#62706A] mb-3">
                          <Building2 className="w-3.5 h-3.5 text-[#074031]" />
                          <span>{project.clientName}</span>
                        </div>
                      )}

                      {project.summary && (
                        <p className="text-xs sm:text-sm text-[#62706A] leading-relaxed line-clamp-3 mb-4">
                          {project.summary}
                        </p>
                      )}
                    </div>

                    {/* Footer Metadata */}
                    <div className="pt-4 border-t border-[#DCE4E0] flex items-center justify-between text-xs font-mono">
                      {project.productsSupplied ? (
                        <div className="flex items-center gap-1.5 text-[#17251F] truncate max-w-[70%]">
                          <PackageCheck className="w-3.5 h-3.5 shrink-0 text-[#074031]" />
                          <span className="truncate">{project.productsSupplied}</span>
                        </div>
                      ) : (
                        <span />
                      )}
                      <div className="flex items-center gap-1 text-[#074031] font-bold group-hover:translate-x-1 transition-transform">
                        <span>{isBn ? "বিস্তারিত" : "Details"}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Trust & Procurement Assurance Band */}
      <section className="py-16 bg-[#F1F4F1] border-y border-[#DCE4E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#DCE4E0] flex items-center justify-center shrink-0 text-[#074031]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-base text-[#17251F] mb-1">
                  {isBn ? "অরিজিনাল প্রস্তুতকারক ওয়ারেন্টি" : "Direct Manufacturer Warranty"}
                </h4>
                <p className="text-xs text-[#62706A] leading-relaxed">
                  {isBn
                    ? "সোলার প্যানেলে ২৫-৩০ বছরের পারফরম্যান্স ওয়ারেন্টি এবং ইনভার্টারে ৫-১০ বছরের অফিসিয়াল গ্যারান্টি।"
                    : "Direct factory replacement support and 25-year linear power warranty on all supplied Tier-1 modules."}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#DCE4E0] flex items-center justify-center shrink-0 text-[#074031]">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-base text-[#17251F] mb-1">
                  {isBn ? "BSREA নিবন্ধিত সরবরাহকারী" : "BSREA Certified Importer"}
                </h4>
                <p className="text-xs text-[#62706A] leading-relaxed">
                  {isBn
                    ? "জাতীয় মান ও নীতি মেনে বৈধ এলসি ও শুল্কায়নের মাধ্যমে আমদানি করা সরঞ্জাম সরবরাহ।"
                    : "Full compliance with Bangladesh Renewable Energy Association standards and verified customs documentation."}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#DCE4E0] flex items-center justify-center shrink-0 text-[#074031]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-base text-[#17251F] mb-1">
                  {isBn ? "সাইটে সরাসরি কন্টেইনার ডেলিভারি" : "Direct Project Site Logistics"}
                </h4>
                <p className="text-xs text-[#62706A] leading-relaxed">
                  {isBn
                    ? "সারা বাংলাদেশের যেকোনো প্রান্তে সরাসরি সাইটে বা ওয়্যারহাউসে নিরাপদ ট্র্যাকিং ডেলিভারি।"
                    : "Dedicated heavy transport coordination directly from port or central warehouse to your installation site."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F1F4F1] border border-[#DCE4E0] text-xs font-mono text-[#074031] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#FEBE16]" />
            <span>{isBn ? "বাণিজ্যিক ও শিল্প সোলার সরবরাহ" : "Custom Project Inquiry"}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#074031] mb-4">
            {isBn ? "আপনার প্রকল্পের জন্য সোলার সরঞ্জাম প্রয়োজন?" : "Planning a Commercial Solar Installation?"}
          </h2>
          <p className="text-sm sm:text-base text-[#62706A] max-w-2xl mx-auto mb-8">
            {isBn
              ? "আমাদের সেলস ইঞ্জিনিয়ারিং দলের সাথে কথা বলুন। আপনার স্পেসিফিকেশন অনুযায়ী আমরা দ্রুত আনুষ্ঠানিক কোটেশন এবং প্রাপ্যতা জানিয়ে দেব।"
              : "Share your product requirements and project sizing with our commercial team for a formal engineering quotation within business hours."}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/quote"
              className="px-6 py-3 rounded-full bg-[#074031] hover:bg-[#052F25] text-white font-mono text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <span>{isBn ? "আনুষ্ঠানিক কোটেশন নিন" : "Request Equipment Quotation"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-full bg-white hover:bg-[#F1F4F1] text-[#074031] border border-[#DCE4E0] font-mono text-xs font-bold transition-all shadow-xs"
            >
              {isBn ? "ইঞ্জিনিয়ারিং ডেস্কে যোগাযোগ" : "Contact Engineering Desk"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
