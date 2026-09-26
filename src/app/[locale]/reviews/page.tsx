import React from "react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing, Link } from "@/i18n/routing";
import { getTestimonials } from "@/lib/data/content";
import Image from "next/image";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import {
  Star,
  Quote,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Award,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import { SITE_URL } from "@/lib/site-config";

export const revalidate = 60;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface ReviewsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ReviewsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isBn = locale === "bn";
  const siteUrl = SITE_URL;

  return {
    title: isBn
      ? "গ্রাহক মতামত ও বাস্তব পর্যালোচনা | নূর সোলার এনার্জি"
      : "Client Reviews & Verified Testimonials | Noor Solar Energy",
    description: isBn
      ? "বাংলাদেশের শীর্ষস্থানীয় শিল্পপ্রতিষ্ঠান, প্রকল্প পরিচালক ও সোলার ঠিকাদারদের বাস্তব অভিজ্ঞতা ও নির্ভরযোগ্য পর্যালোচনা।"
      : "Read verified feedback, buyer ratings, and commercial project testimonials from industrial plant directors, EPC contractors, and business owners in Bangladesh.",
    alternates: {
      canonical: isBn ? `${siteUrl}/bn/reviews` : `${siteUrl}/reviews`,
      languages: {
        en: `${siteUrl}/reviews`,
        bn: `${siteUrl}/bn/reviews`,
        "x-default": `${siteUrl}/reviews`,
      },
    },
    openGraph: {
      title: isBn
        ? "গ্রাহক মতামত ও বাস্তব পর্যালোচনা — নূর সোলার এনার্জি"
        : "Client Reviews & Verified Testimonials — Noor Solar Energy",
      description: isBn
        ? "বাণিজ্যিক ক্রেতা ও প্রকল্প পরিচালকদের বাস্তব অভিজ্ঞতা ও মূল্যায়ন।"
        : "Direct feedback and verified satisfaction ratings from commercial solar buyers.",
      url: isBn ? `${siteUrl}/bn/reviews` : `${siteUrl}/reviews`,
      type: "website",
    },
  };
}

export default async function ReviewsPage({ params }: ReviewsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isBn = locale === "bn";
  const testimonials = await getTestimonials(locale);

  return (
    <div className="bg-[#FAFBF9] min-h-screen text-[#17251F]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 bg-gradient-to-b from-[#0B513E] via-[#074031] to-[#052F25] text-white overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#FEBE16]/10 blur-3xl pointer-events-none"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-300/80 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              {isBn ? "হোম" : "Home"}
            </Link>
            <span>/</span>
            <span className="text-white">{isBn ? "গ্রাহক মতামত" : "Client Reviews"}</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 text-xs font-mono text-[#FEBE16] mb-4">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{isBn ? "যাচাইকৃত গ্রাহক অভিজ্ঞতা" : "Verified Buyer Feedback"}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
              {isBn ? "গ্রাহক মতামত ও বাণিজ্যিক পর্যালোচনা" : "Client Reviews & Verified Testimonials"}
            </h1>
            <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed font-light">
              {isBn
                ? "বাংলাদেশের শীর্ষস্থানীয় বাণিজ্যিক প্রকল্প পরিচালক, শিল্প কারখানার উদ্যোক্তা ও সোলার ঠিকাদারদের বাস্তব অভিজ্ঞতা এবং সরঞ্জাম মূল্যায়নের সারসংক্ষেপ।"
                : "Real feedback from industrial facility managers, property developers, and commercial EPC partners who rely on Noor Solar Energy for bulk container supplies and engineering compliance."}
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/15">
              <div>
                <div className="flex items-center gap-1.5 text-2xl sm:text-3xl font-extrabold font-mono text-[#FEBE16]">
                  <span>4.9</span>
                  <div className="flex text-[#FEBE16]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current text-[#FEBE16]" />
                    ))}
                  </div>
                </div>
                <div className="text-xs text-emerald-200/80 mt-1">
                  {isBn ? "গড় গ্রাহক রেটিং" : "Average Client Rating"}
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                  100%
                </div>
                <div className="text-xs text-emerald-200/80 mt-1">
                  {isBn ? "যাচাইকৃত বাণিজ্যিক ক্রেতা" : "Verified Commercial Buyers"}
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-300">
                  99%
                </div>
                <div className="text-xs text-emerald-200/80 mt-1">
                  {isBn ? "অন-টাইম ডেলিভারি হার" : "Fulfillment Accuracy"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Cards Grid */}
      <section className="py-16 sm:py-24 bg-[#FAFBF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-[#DCE4E0]">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#074031]">
                {isBn ? "সর্বশেষ বাণিজ্যিক পর্যালোচনা" : "All Client Testimonials"}
              </h2>
              <p className="text-xs sm:text-sm text-[#62706A] mt-1">
                {isBn
                  ? "সরাসরি কারখানা ও বাণিজ্যিক প্রকল্প থেকে প্রাপ্ত প্রতিক্রিয়া।"
                  : "Authentic quotes and satisfaction records from commercial installations."}
              </p>
            </div>
            <div className="text-xs font-mono text-[#074031] bg-white px-3.5 py-1.5 rounded-full border border-[#DCE4E0] w-fit">
              {testimonials.length} {isBn ? "টি সক্রিয় মন্তব্য" : "Verified Quotes"}
            </div>
          </div>

          <RevealGroup staggerDelay={0.08} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <RevealItem key={t.id || idx} className="h-full">
                <div className="h-full rounded-[28px] bg-white border border-[#DCE4E0] hover:border-[#074031] p-7 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all duration-300 relative group overflow-hidden">
                  {/* Subtle quote watermark */}
                  <Quote className="absolute top-4 right-4 w-16 h-16 text-[#FEBE16]/10 pointer-events-none -rotate-12" />

                  <div>
                    {/* Stars and Verification Badge */}
                    <div className="flex items-center justify-between gap-2 mb-5">
                      <div className="flex items-center gap-1 text-[#FEBE16]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current text-[#FEBE16]" />
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{isBn ? "ভেরিফাইড ক্রেতা" : "Verified Buyer"}</span>
                      </span>
                    </div>

                    {/* Quote Text */}
                    <p className="text-sm sm:text-base text-[#17251F] font-medium leading-relaxed mb-6">
                      {t.quote}
                    </p>
                  </div>

                  {/* Author Profile */}
                  <div className="pt-6 border-t border-[#DCE4E0] flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#F1F4F1] border border-[#DCE4E0] shrink-0 flex items-center justify-center">
                      {t.photo ? (
                        <Image
                          src={t.photo}
                          alt={t.authorName}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : (
                        <span className="font-bold font-mono text-sm text-[#074031]">
                          {t.authorName.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-[#074031] leading-snug">
                        {t.authorName}
                      </h3>
                      <div className="text-xs font-mono text-[#62706A] mt-0.5">
                        {[t.authorRole, t.company].filter(Boolean).join(" · ")}
                      </div>
                    </div>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Trust Callout */}
      <section className="py-16 bg-[#F1F4F1] border-y border-[#DCE4E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#074031] uppercase tracking-wider font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#FEBE16]" />
              <span>{isBn ? "আমাদের প্রতিশ্রুতি" : "Our Procurement Commitment"}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#074031]">
              {isBn
                ? "প্রতিটি সরঞ্জামের গুণগত মান ও ওয়্যারেন্টির নিশ্চয়তা"
                : "Engineered Reliability with Full Documentation"}
            </h3>
            <p className="text-sm text-[#62706A] leading-relaxed">
              {isBn
                ? "আমরা শুধু সোলার সরঞ্জাম বিক্রি করি না; প্রতিটি পণ্যের জন্য কারখানা টেস্ট রিপোর্ট, অরিজিনাল প্রস্তুতকারক ওয়ারেন্টি ও ইঞ্জিনিয়ারিং সহযোগিতা নিশ্চিত করি।"
                : "Every batch of solar panels and inverters is supplied with original factory flash test results, customs import documentation, and direct manufacturer warranty backoff."}
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F1F4F1] border border-[#DCE4E0] text-xs font-mono text-[#074031] mb-4">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{isBn ? "কোটেশন ও পরামর্শ" : "Talk With Sales Engineering"}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#074031] mb-4">
            {isBn ? "আপনার প্রকল্পের জন্য সোলার সরঞ্জাম আলোচনা করুন" : "Ready to Discuss Your Project Requirements?"}
          </h2>
          <p className="text-sm sm:text-base text-[#62706A] max-w-2xl mx-auto mb-8">
            {isBn
              ? "সরাসরি অফিসিয়াল কোটেশন পেতে আপনার পণ্যের তালিকা ও পরিমাণ জানান।"
              : "Contact our wholesale sales team to check active warehouse inventory, container indent terms, and wholesale pricing."}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/quote"
              className="px-6 py-3 rounded-full bg-[#074031] hover:bg-[#052F25] text-white font-mono text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              <span>{isBn ? "কোটেশন নিন" : "Request Quote"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/projects"
              className="px-6 py-3 rounded-full bg-white hover:bg-[#F1F4F1] text-[#074031] border border-[#DCE4E0] font-mono text-xs font-bold transition-all shadow-xs"
            >
              {isBn ? "বাস্তবায়িত প্রকল্পসমূহ দেখুন" : "View Project References"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
