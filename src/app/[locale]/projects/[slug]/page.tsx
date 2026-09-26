import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { routing, Link } from "@/i18n/routing";
import { getProjectBySlug, getPublishedProjects } from "@/lib/data/projects";
import { sampleProjects } from "../../../../../prisma/seed-content";
import { AppImage as Image } from "@/components/ui/app-image";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import {
  MapPin,
  Zap,
  Building2,
  PackageCheck,
  Calendar,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Factory,
  FileText,
  BadgeCheck,
} from "lucide-react";
import { SITE_URL } from "@/lib/site-config";

export const revalidate = 60;

export function generateStaticParams() {
  const locales = routing.locales;
  const slugs = sampleProjects.map((p) => p.slug);
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

interface ProjectDetailPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const isBn = locale === "bn";
  const project = await getProjectBySlug(slug, locale);

  if (!project) {
    return { title: isBn ? "প্রকল্প পাওয়া যায়নি" : "Project Not Found" };
  }

  const siteUrl = SITE_URL;
  const title = isBn
    ? `${project.title} — সরঞ্জাম সরবরাহ রেফারেন্স | নূর সোলার এনার্জি`
    : `${project.title} — Solar Supply Reference | Noor Solar Energy`;
  const description =
    project.summary ||
    (isBn
      ? `${project.title} প্রকল্পে নূর সোলার এনার্জি কর্তৃক সরবরাহকৃত সৌর সরঞ্জামের বিস্তারিত বিবরণ ও স্পেসিফিকেশন।`
      : `Verified equipment supply details and technical specifications for ${project.title} supplied by Noor Solar Energy.`);

  return {
    title,
    description,
    alternates: {
      canonical: isBn ? `${siteUrl}/bn/projects/${slug}` : `${siteUrl}/projects/${slug}`,
      languages: {
        en: `${siteUrl}/projects/${slug}`,
        bn: `${siteUrl}/bn/projects/${slug}`,
        "x-default": `${siteUrl}/projects/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: isBn ? `${siteUrl}/bn/projects/${slug}` : `${siteUrl}/projects/${slug}`,
      type: "article",
      images: project.image ? [{ url: project.image }] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const isBn = locale === "bn";
  const [project, allProjects] = await Promise.all([
    getProjectBySlug(slug, locale),
    getPublishedProjects(locale),
  ]);

  if (!project) {
    notFound();
  }

  const relatedProjects = allProjects.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <div className="bg-[#FAFBF9] min-h-screen text-[#17251F]">
      {/* Top Banner / Hero */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-20 bg-gradient-to-b from-[#0B513E] via-[#074031] to-[#052F25] text-white overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#FEBE16]/10 blur-3xl pointer-events-none"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-300/80 mb-6 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">
              {isBn ? "হোম" : "Home"}
            </Link>
            <span>/</span>
            <Link href="/projects" className="hover:text-white transition-colors">
              {isBn ? "প্রকল্পসমূহ" : "Projects"}
            </Link>
            <span>/</span>
            <span className="text-white truncate max-w-xs">{project.title}</span>
          </div>

          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {project.projectType && (
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 text-xs font-mono font-bold text-[#FEBE16]">
                  {project.projectType}
                </span>
              )}
              {project.capacity && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEBE16] text-[#074031] text-xs font-mono font-bold shadow-xs">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>{project.capacity}</span>
                </span>
              )}
              {project.location && (
                <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-200/90">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{project.location}</span>
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
              {project.title}
            </h1>

            {project.clientName && (
              <div className="flex items-center gap-2 text-sm sm:text-base text-emerald-100 font-medium">
                <Building2 className="w-4 h-4 text-[#FEBE16]" />
                <span>
                  {isBn ? "ক্লায়েন্ট / সুবিধা:" : "Client Facility:"} <strong>{project.clientName}</strong>
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left 7 Columns: Image & Narrative */}
            <div className="lg:col-span-7 space-y-8">
              {/* Featured Project Image */}
              {project.image && (
                <div className="relative aspect-16/10 w-full rounded-[32px] overflow-hidden border border-[#DCE4E0] shadow-md bg-[#F1F4F1]">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover"
                  />
                </div>
              )}

              {/* Case Study Overview */}
              <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-[#DCE4E0] shadow-xs space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-[#074031] flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#FEBE16]" />
                  <span>{isBn ? "প্রকল্প সারসংক্ষেপ ও লক্ষ্য" : "Project Overview & Scope"}</span>
                </h2>
                <p className="text-sm sm:text-base text-[#62706A] leading-relaxed">
                  {project.summary}
                </p>
                <div className="pt-4 border-t border-[#DCE4E0] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="flex items-center gap-2 text-[#17251F]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{isBn ? "অন-সাইট টেকনিক্যাল সাপোর্ট" : "On-site Technical Support"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#17251F]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{isBn ? "আমদানি ও কাস্টমস নথি প্রস্তুত" : "Complete Import Documentation"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#17251F]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{isBn ? "ফ্যাক্টরি টেস্ট ও ডেটাশিট মেলানো" : "Factory Flash Test Verification"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#17251F]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{isBn ? "নির্ধারিত সময়ে সাইট ডেলিভারি" : "On-schedule Logistics Drop"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Technical Equipment Breakdown Card & Quote Box */}
            <div className="lg:col-span-5 space-y-6">
              {/* Supply Details Box */}
              <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-[#DCE4E0] shadow-xs">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#62706A] mb-3">
                  <BadgeCheck className="w-4 h-4 text-[#074031]" />
                  <span>{isBn ? "সরবরাহকৃত সরঞ্জামের বিবরণ" : "Equipment Bill of Materials"}</span>
                </div>
                <h3 className="text-lg font-bold text-[#074031] mb-6">
                  {isBn ? "প্রকৌশল স্পেসিফিকেশন" : "Technical Equipment Specifications"}
                </h3>

                <div className="space-y-4">
                  {project.productsSupplied && (
                    <div className="p-4 rounded-2xl bg-[#F1F4F1] border border-[#DCE4E0]">
                      <div className="text-xs font-mono text-[#62706A] mb-1">
                        {isBn ? "সরবরাহকৃত পণ্য ও মডেল" : "Primary Equipment Supplied"}
                      </div>
                      <div className="text-sm font-bold text-[#17251F]">
                        {project.productsSupplied}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3.5 rounded-xl border border-[#DCE4E0] bg-white">
                      <div className="text-[#62706A] mb-1">{isBn ? "ক্ষমতা" : "Capacity"}</div>
                      <div className="font-bold text-[#074031] text-sm">{project.capacity || "Commercial"}</div>
                    </div>
                    <div className="p-3.5 rounded-xl border border-[#DCE4E0] bg-white">
                      <div className="text-[#62706A] mb-1">{isBn ? "ধরণ" : "Project Type"}</div>
                      <div className="font-bold text-[#074031] text-sm">{project.projectType || "Industrial"}</div>
                    </div>
                    <div className="p-3.5 rounded-xl border border-[#DCE4E0] bg-white">
                      <div className="text-[#62706A] mb-1">{isBn ? "অবস্থান" : "Location"}</div>
                      <div className="font-bold text-[#074031] text-sm truncate">{project.location || "Bangladesh"}</div>
                    </div>
                    <div className="p-3.5 rounded-xl border border-[#DCE4E0] bg-white">
                      <div className="text-[#62706A] mb-1">{isBn ? "সম্পন্ন" : "Timeline"}</div>
                      <div className="font-bold text-[#074031] text-sm">{project.completionDate || "Verified"}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[#DCE4E0]">
                  <div className="text-xs font-mono text-[#62706A] mb-4">
                    {isBn
                      ? "অনুরূপ বাণিজ্যিক প্রকল্পের জন্য সরঞ্জাম প্রয়োজন?"
                      : "Require similar container-scale equipment?"}
                  </div>
                  <Link
                    href="/quote"
                    className="w-full py-3.5 rounded-full bg-[#074031] hover:bg-[#052F25] text-white font-mono text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 group"
                  >
                    <span>{isBn ? "কোটেশন রিকোয়েস্ট করুন" : "Request Equipment Quotation"}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Direct Importer Contact Callout */}
              <div className="rounded-[28px] bg-gradient-to-br from-[#074031] to-[#0B513E] p-6 sm:p-7 text-white shadow-xs">
                <div className="flex items-center gap-2 text-xs font-mono text-[#FEBE16] mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isBn ? "সরাসরি আমদানিকারক সহায়তা" : "Direct Wholesale Assistance"}</span>
                </div>
                <h4 className="font-bold text-base mb-2">
                  {isBn ? "প্রকৌশল ও স্পেসিফিকেশন পরামর্শ" : "Engineering Consultation Desk"}
                </h4>
                <p className="text-xs text-emerald-100/80 leading-relaxed mb-4">
                  {isBn
                    ? "সরাসরি টেকনিক্যাল ডেটাশিট মেলানো, ইনভার্টার কমপ্যাটিবিলিটি ও কন্টেইনার ইনডেন্ট অর্ডার করতে কল করুন।"
                    : "Speak directly with our technical sales engineers for datasheet verification and bulk volume indent rates."}
                </p>
                <div className="flex items-center gap-3">
                  <a
                    href="tel:+8801884611888"
                    className="px-4 py-2 rounded-full bg-white text-[#074031] font-mono text-xs font-bold hover:bg-emerald-50 transition-colors"
                  >
                    +880 1884-611888
                  </a>
                  <Link
                    href="/contact"
                    className="text-xs font-mono text-emerald-200 hover:text-white underline underline-offset-4"
                  >
                    {isBn ? "যোগাযোগ পেজ" : "Contact Desk"}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Related Projects Strip */}
          {relatedProjects.length > 0 && (
            <div className="mt-20 pt-12 border-t border-[#DCE4E0]">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-[#074031]">
                  {isBn ? "অন্যান্য বাস্তবায়িত প্রকল্প রেফারেন্স" : "Other Verified Supply References"}
                </h3>
                <Link
                  href="/projects"
                  className="text-xs font-mono font-bold text-[#074031] hover:underline flex items-center gap-1"
                >
                  <span>{isBn ? "সবগুলো দেখুন" : "View All"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedProjects.map((p) => (
                  <Link
                    key={p.id}
                    href={`/projects/${p.slug}`}
                    className="rounded-[24px] bg-white border border-[#DCE4E0] hover:border-[#074031] p-5 flex gap-4 items-center group transition-all shadow-xs hover:shadow-md"
                  >
                    {p.image && (
                      <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-[#F1F4F1] shrink-0">
                        <Image src={p.image} alt={p.title} fill className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-mono text-[#62706A] mb-1">
                        {p.projectType} · {p.capacity}
                      </div>
                      <h4 className="font-bold text-sm text-[#17251F] group-hover:text-[#074031] transition-colors truncate">
                        {p.title}
                      </h4>
                      <p className="text-xs text-[#62706A] truncate mt-0.5">{p.clientName}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#074031] group-hover:translate-x-1 transition-transform shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
