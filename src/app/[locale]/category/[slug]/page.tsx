import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { db } from "@/lib/db";
import { getCategoryBySlug } from "@/lib/data/categories";
import { ProductCard } from "@/components/product/product-card";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, HelpCircle, ShieldCheck } from "lucide-react";
import { EmptyCatalogIllustration } from "@/components/illustrations/empty-catalog-illustration";
import { SITE_URL } from "@/lib/site-config";

interface CategoryPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  try {
    const categories = await db.category.findMany({
      where: { isActive: true },
      select: { slug: true },
    });
    const standardSlugs = [
      ...categories.map((c) => c.slug),
      "solar-panels",
      "lithium-batteries",
      "solar-inverters",
      "energy-storage",
      "solar-batteries",
    ];
    const uniqueSlugs = Array.from(new Set(standardSlugs));

    return routing.locales.flatMap((locale) =>
      uniqueSlugs.map((slug) => ({ locale, slug }))
    );
  } catch {
    return [
      { locale: "en", slug: "solar-panels" },
      { locale: "bn", slug: "solar-panels" },
      { locale: "en", slug: "lithium-batteries" },
      { locale: "bn", slug: "lithium-batteries" },
      { locale: "en", slug: "solar-inverters" },
      { locale: "bn", slug: "solar-inverters" },
      { locale: "en", slug: "energy-storage" },
      { locale: "bn", slug: "energy-storage" },
    ];
  }
}

function getCategorySeoMeta(slug: string, isBn: boolean, categoryName: string, categoryDesc?: string | null) {
  const s = slug.toLowerCase();
  if (s.includes("panel")) {
    return {
      title: isBn
        ? "সোলার প্যানেল সরবরাহকারী বাংলাদেশ | এন-টাইপ TOPCon সোলার প্যানেল — নূর সোলার এনার্জি"
        : "Solar Panel Supplier Bangladesh | Tier 1 N-Type TOPCon Panels — Noor Solar Energy",
      description: isBn
        ? "বাংলাদেশে উচ্চ-দক্ষতাসম্পন্ন এন-টাইপ TOPCon ও বাইফেসিয়াল মনোক্রিস্টালাইন সোলার প্যানেলের সরাসরি আমদানিকারক ও পাইকারি সরবরাহকারী। ৩০ বছরের লিনিয়ার পারফরম্যান্স ওয়ারেন্টি ও দ্রুত ডেলিভারি।"
        : "Direct importer & wholesale bulk supplier of Tier-1 N-Type TOPCon and bifacial solar panels in Bangladesh. Pallet and container delivery with 30-year performance warranties.",
    };
  }
  if (s.includes("batter") || s.includes("lithium")) {
    return {
      title: isBn
        ? "LiFePO4 ব্যাটারি সরবরাহকারী বাংলাদেশ | সোলার লিথিয়াম ব্যাটারি স্টোরেজ — নূর সোলার এনার্জি"
        : "LiFePO4 Battery Supplier Bangladesh | Solar Lithium Storage — Noor Solar Energy",
      description: isBn
        ? "বাংলাদেশে বাণিজ্যিক ও শিল্প সোলার প্রকল্পে LiFePO4 লিথিয়াম ব্যাটারি সরবরাহকারী। ৬,০০০+ সাইকেল লাইফ, ইন্টেলিজেন্ট BMS সুরক্ষা এবং ৫-১০ বছরের অফিসিয়াল ওয়ারেন্টি।"
        : "Direct bulk supplier of commercial LiFePO4 lithium batteries in Bangladesh. 6,000+ deep cycles, rack-mounted modular storage, and smart BMS battery management.",
    };
  }
  if (s.includes("inverter")) {
    return {
      title: isBn
        ? "সোলার ইনভার্টার সরবরাহকারী বাংলাদেশ | অন-গ্রিড ও হাইব্রিড ইনভার্টার — নূর সোলার এনার্জি"
        : "Solar Inverter Supplier Bangladesh | Hybrid & On-Grid Inverters — Noor Solar Energy",
      description: isBn
        ? "বাংলাদেশে বাণিজ্যিক ও শিল্প কারখানার জন্য অন-গ্রিড ও হাইব্রিড সোলার ইনভার্টার পাইকারি সরবরাহকারী। থ্রি-ফেজ, উচ্চ তাপমাত্রা সহনশীলতা ও নেট-মিটারিং সাপোর্ট।"
        : "Industrial three-phase grid-tied and hybrid solar inverters in Bangladesh. Engineered for tropical ambient temperatures, IP66 protection, and net-metering compliance.",
    };
  }
  if (s.includes("storage") || s.includes("bess")) {
    return {
      title: isBn
        ? "সোলার এনার্জি স্টোরেজ সিস্টেম বাংলাদেশ | বাণিজ্যিক ও শিল্প BESS — নূর সোলার এনার্জি"
        : "Solar Energy Storage System Bangladesh | Commercial BESS — Noor Solar Energy",
      description: isBn
        ? "বাংলাদেশে কারখানার নিরবচ্ছিন্ন ব্যাকআপ ও পিক-শেভিংয়ের জন্য বাণিজ্যিক সোলার এনার্জি স্টোরেজ সিস্টেম (BESS) সরবরাহ। উচ্চ ভোল্টেজ LiFePO4 মডুলার সমাধান।"
        : "Industrial battery energy storage systems (BESS) and commercial solar storage solutions in Bangladesh for peak shaving and reliable factory power backup.",
    };
  }

  return {
    title: isBn
      ? `${categoryName} পাইকারি সরবরাহকারী বাংলাদেশ — নূর সোলার এনার্জি`
      : `${categoryName} Supplier Bangladesh | Wholesale — Noor Solar Energy`,
    description:
      categoryDesc ||
      (isBn
        ? `বাংলাদেশে বাণিজ্যিক ও শিল্প প্রকল্পের জন্য সরাসরি আমদানিকৃত ${categoryName}-এর স্পেসিফিকেশন ও পাইকারি সরবরাহ তালিকা।`
        : `Direct-imported commercial ${categoryName} available for wholesale and container supply in Bangladesh.`),
  };
}

function getCategoryFaqs(slug: string, isBn: boolean) {
  const s = slug.toLowerCase();
  if (s.includes("panel")) {
    return [
      {
        q: isBn
          ? "বাংলাদেশে TOPCon সোলার প্যানেলের লাইফস্প্যান ও ওয়ারেন্টি কত বছর?"
          : "What is the lifespan and warranty of TOPCon solar panels in Bangladesh?",
        a: isBn
          ? "N-Type TOPCon সোলার প্যানেল সাধারণত ২৫ থেকে ৩০ বছরেরও বেশি সময় কার্যকরভাবে বিদ্যুৎ উৎপাদন করে। নূর সোলার এনার্জি প্রতিটি প্যানেলে ১২ বছরের প্রোডাক্ট ওয়ারেন্টি এবং ৩০ বছরের লিনিয়ার পারফরম্যান্স ওয়ারেন্টি প্রদান করে।"
          : "TOPCon solar panels have an expected operational lifespan of 30+ years. Noor Solar Energy provides a 12-year product materials warranty along with a 30-year linear power output performance warranty.",
      },
      {
        q: isBn
          ? "সোলার প্যানেলের পাইকারি ক্রয়ে ন্যূনতম পরিমাণ (MOQ) কত?"
          : "Do you supply wholesale solar panels in pallet and container quantities?",
        a: isBn
          ? "হ্যাঁ, আমরা পাইকারি অর্ডারে ১টি পূর্ণ প্যালেট (৩১ থেকে ৩৬ পিস) থেকে শুরু করে পূর্ণ ২০ ফুট ও ৪০ ফুট কন্টেইনার সরাসরি সরবরাহ করি। বাণিজ্যিক প্রজেক্টে বিশেষ ভলিউম ডিসকাউন্ট প্রযোজ্য।"
          : "Yes. Wholesale orders start from 1 standard pallet (31–36 modules) up to full 20ft and 40HQ container loads dispatched directly to project sites or collected from our warehouse.",
      },
      {
        q: isBn
          ? "বাইফেসিয়াল (Bifacial) সোলার প্যানেল কারখানার ছাদে কীভাবে বেশি বিদ্যুৎ দেয়?"
          : "How do bifacial solar panels generate extra energy on rooftops?",
        a: isBn
          ? "বাইফেসিয়াল প্যানেলের পেছনের কাঁচ প্রতিফলিত সূর্যালোক (Albedo) গ্রহণ করে অতিরিক্ত ১০% থেকে ২৫% পর্যন্ত বিদ্যুৎ উৎপাদন করতে পারে, যা কারখানার ছাদ ও মাটিতে ইনস্টল করলে উৎপাদন বহুগুণ বাড়ায়।"
          : "Bifacial dual-glass modules absorb sunlight from both the front and rear faces. Utilizing rooftop or ground albedo reflection, rear-side gain yields an additional 10% to 25% energy output.",
      },
    ];
  }
  if (s.includes("batter") || s.includes("lithium") || s.includes("storage")) {
    return [
      {
        q: isBn
          ? "LiFePO4 ব্যাটারি কেন সাধারণ লেড-অ্যাসিড ব্যাটারির চেয়ে উত্তম?"
          : "Why is LiFePO4 battery superior to tubular lead-acid batteries?",
        a: isBn
          ? "LiFePO4 ব্যাটারির সাইকেল লাইফ ৬,০০০+ যা লেড-অ্যাসিডের (১,২০০ সাইকেল) চেয়ে ৫ গুণ বেশি। এতে ৯০% পর্যন্ত ডিসচার্জ নিরাপদে করা যায় এবং কোনো ক্ষতিকর এসিড ধোঁয়া বা রক্ষণাবেক্ষণের প্রয়োজন হয় না।"
          : "LiFePO4 offers 6,000+ deep cycles compared to 1,200 for lead-acid, safely discharges up to 90% DoD, requires zero maintenance, and operates cleanly without acid fumes or thermal runaway risks.",
      },
      {
        q: isBn
          ? "ব্যাটারিতে কি BMS (Battery Management System) অন্তর্ভুক্ত থাকে?"
          : "Is intelligent BMS protection built into the batteries?",
        a: isBn
          ? "হ্যাঁ, প্রতিটি লিথিয়াম মডিউলে ইন্ডাস্ট্রি-গ্রেড স্মার্ট BMS থাকে যা ওভারচার্জ, ওভার-ডিসচার্জ, শর্ট সার্কিট এবং উচ্চ তাপমাত্রা থেকে সেলগুলোকে সম্পূর্ণ নিরাপদ রাখে।"
          : "Yes. Every module features integrated smart Battery Management System (BMS) with RS485/CAN bus communication for automated cell balancing, temperature cutoffs, and inverter telemetry.",
      },
    ];
  }
  return [
    {
      q: isBn
        ? "ইনভার্টারগুলো কি বাংলাদেশের নেট-মিটারিং বিধিমালার সাথে সামঞ্জস্যপূর্ণ?"
        : "Are these inverters compliant with Bangladesh net-metering regulations?",
      a: isBn
        ? "হ্যাঁ, আমাদের সব অন-গ্রিড ও হাইব্রিড ইনভার্টার BPDB, BREB ও DPDC-এর নেট মিটারিং নির্দেশিকা এবং গ্রিড কোড কমপ্লায়েন্স সার্টিফিকেশন মেনে চলে।"
      : "Yes, our commercial string and hybrid inverters comply with utility grid interconnection codes and anti-islanding standards mandated across Bangladesh.",
    },
    {
      q: isBn
        ? "অর্ডারের পর ডেলিভারি পেতে কতদিন সময় লাগে?"
        : "What is the typical dispatch and delivery lead time?",
      a: isBn
        ? "স্টকে থাকা পণ্যের ক্ষেত্রে ঢাকা ডিপো থেকে ২৪ থেকে ৪৮ ঘণ্টার মধ্যে ডেলিভারি সমন্বয় করা হয়। পোর্ট কনটেইনার চালানের ক্ষেত্রে নির্ধারিত শিডিউল জানানো হয়।"
        : "In-stock models are dispatched from our central warehouse within 24–48 hours nationwide. Port-arrival container dispatches follow scheduled customs clearing timelines.",
    },
  ];
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const isBn = locale === "bn";
  const siteUrl = SITE_URL;
  const category = await getCategoryBySlug(slug, locale);

  if (!category) {
    return { title: isBn ? "ক্যাটাগরি পাওয়া যায়নি" : "Category Not Found" };
  }

  const seo = getCategorySeoMeta(category.slug, isBn, category.name, category.description);

  return {
    title: seo.title,
    description: seo.description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: isBn ? `${siteUrl}/bn/category/${category.slug}` : `${siteUrl}/category/${category.slug}`,
      languages: {
        en: `${siteUrl}/category/${category.slug}`,
        bn: `${siteUrl}/bn/category/${category.slug}`,
        "x-default": `${siteUrl}/category/${category.slug}`,
      },
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: isBn ? `/bn/category/${category.slug}` : `/category/${category.slug}`,
      type: "website",
      locale: isBn ? "bn_BD" : "en_US",
      images: category.image
        ? [{ url: category.image }]
        : [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Noor Solar Energy" }],
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const category = await getCategoryBySlug(slug, locale);

  if (!category) {
    notFound();
  }

  const isBn = locale === "bn";
  const siteUrl = SITE_URL;
  const faqs = getCategoryFaqs(category.slug, isBn);

  // Breadcrumb Structured Data
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: isBn ? "হোম" : "Home",
        item: `${siteUrl}${isBn ? "/bn" : ""}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: isBn ? "পণ্যসমূহ" : "Products",
        item: `${siteUrl}${isBn ? "/bn" : ""}/products`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category.name,
        item: `${siteUrl}${isBn ? "/bn" : ""}/category/${category.slug}`,
      },
    ],
  };

  // FAQ Structured Data
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <div className="pt-28 sm:pt-36 pb-24 bg-[#F7F8F5] min-h-screen">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-[#62706A] mb-6 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-[#074031] transition-colors">
            {isBn ? "হোম" : "Home"}
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#074031] transition-colors">
            {isBn ? "পণ্যসমূহ" : "Products"}
          </Link>
          <span>/</span>
          <span className="text-[#074031] font-semibold">{category.name}</span>
        </nav>

        {/* Category Header Banner */}
        <div className="p-8 sm:p-12 rounded-[36px] bg-[#F1F4F1] border border-[#DCE4E0] mb-12 relative overflow-hidden">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-[11px] font-mono text-[#074031] mb-3 border border-[#DCE4E0]">
              <span className="w-2 h-2 rounded-full bg-[#FEBE16]"></span>
              <span>{isBn ? "সরাসরি আমদানি ও পাইকারি সরবরাহ" : "Direct Import Wholesale Line"}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#074031]">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-sm sm:text-base text-[#62706A] leading-relaxed mt-3">
                {category.description}
              </p>
            )}

            <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-[#DCE4E0]">
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#074031]">
                <ShieldCheck className="w-4 h-4 text-[#FEBE16]" />
                <span>{isBn ? "১০০% জেনুইন প্রস্তুতকারক ওয়ারেন্টি" : "100% Genuine Factory Warranty"}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#074031]">
                <CheckCircle2 className="w-4 h-4 text-[#FEBE16]" />
                <span>{isBn ? "প্যালেট ও কন্টেইনার সরবরাহ" : "Pallet & Container Supply"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Products Grid */}
        {category.products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
            {category.products.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  category: { name: category.name, slug: category.slug },
                }}
                priority={idx < 2}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-white border border-[#DCE4E0] max-w-lg mx-auto mb-16">
            <EmptyCatalogIllustration className="w-40 h-36 mx-auto mb-2" />
            <h3 className="text-lg font-bold text-[#074031] mb-2">
              {isBn ? "এই ক্যাটাগরিতে নতুন চালান যুক্ত হচ্ছে" : "Inventory being staged"}
            </h3>
            <p className="text-xs text-[#62706A] mb-6">
              {isBn
                ? "নতুন কন্টেইনার চালান ঢাকা ডিপোতে যুক্ত হওয়ার প্রক্রিয়ায় রয়েছে।"
                : "New container inventory for this category is currently being staged in our warehouse."}
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-5 py-2.5 min-h-[44px] rounded-full bg-[#FEBE16] text-[#052F25] text-xs font-bold hover:bg-[#E4A900] transition-colors shadow-sm"
            >
              {isBn ? "পূর্ণাঙ্গ ক্যাটালগ দেখুন" : "View Full Catalog"}
            </Link>
          </div>
        )}

        {/* Related Educational Guides & Internal Links */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#DCE4E0] mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-[11px] font-mono text-[#62706A] uppercase tracking-wider block mb-1">
                {isBn ? "গাইড ও কারিগরি সহায়িকা" : "Technical & Buying Knowledge"}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#074031]">
                {isBn ? "সঠিক সোলার ইকুইপমেন্ট নির্বাচনের পরামর্শ" : "Engineering Guides & Market Insights"}
              </h3>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#074031] hover:underline"
            >
              <BookOpen className="w-4 h-4" />
              <span>{isBn ? "সকল ব্লগ আর্টিকেল" : "Explore All Guides"}</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/blog/solar-panel-buying-guide-bangladesh"
              className="p-4 rounded-2xl bg-[#F7F8F5] border border-[#DCE4E0] hover:border-[#074031]/30 transition-all flex items-center justify-between group"
            >
              <div>
                <h4 className="text-sm font-bold text-[#074031] group-hover:text-[#0B513E] mb-1">
                  {isBn ? "সোলার প্যানেল ক্রয়ের সম্পূর্ণ গাইড ২০২৬" : "Solar Panel Buying Guide Bangladesh 2026"}
                </h4>
                <p className="text-xs text-[#62706A]">
                  {isBn ? "কীভাবে সেরা ওয়াটেজ ও ব্র্যান্ড নির্বাচন করবেন" : "How to choose top wattage and cell technology"}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#62706A] group-hover:text-[#074031] group-hover:translate-x-1 transition-all shrink-0 ml-3" />
            </Link>

            <Link
              href="/blog/topcon-vs-perc-solar-panels-bangladesh"
              className="p-4 rounded-2xl bg-[#F7F8F5] border border-[#DCE4E0] hover:border-[#074031]/30 transition-all flex items-center justify-between group"
            >
              <div>
                <h4 className="text-sm font-bold text-[#074031] group-hover:text-[#0B513E] mb-1">
                  {isBn ? "TOPCon বনাম PERC সোলার প্যানেল বিশ্লেষণ" : "TOPCon vs PERC Solar Panels: Bangladesh Climate"}
                </h4>
                <p className="text-xs text-[#62706A]">
                  {isBn ? "উচ্চ তাপমাত্রায় বিদ্যুৎ উৎপাদন ক্ষমতার তুলনামূলক চিত্র" : "Efficiency, heat degradation, and ROI comparison"}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#62706A] group-hover:text-[#074031] group-hover:translate-x-1 transition-all shrink-0 ml-3" />
            </Link>
          </div>
        </div>

        {/* Category FAQ Accordion */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F1F4F1] border border-[#DCE4E0] text-xs font-mono text-[#074031] mb-2">
              <HelpCircle className="w-3.5 h-3.5 text-[#FEBE16]" />
              <span className="font-semibold">{isBn ? "জিজ্ঞাসিত প্রশ্নাবলি" : "Category FAQ"}</span>
            </div>
            <h3 className="text-2xl font-bold text-[#074031]">
              {isBn
                ? `${category.name} সম্পর্কিত সাধারণ প্রশ্ন`
                : `Frequently Asked Questions About ${category.name}`}
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group p-5 rounded-2xl bg-white border border-[#DCE4E0] open:shadow-xs transition-colors"
              >
                <summary className="flex items-center justify-between cursor-pointer font-bold text-sm text-[#074031] list-none select-none">
                  <span>{faq.q}</span>
                  <span className="w-6 h-6 rounded-full bg-[#F1F4F1] group-open:bg-[#074031] group-open:text-white border border-[#DCE4E0] flex items-center justify-center text-xs font-mono shrink-0 ml-3 transition-colors">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-xs sm:text-sm text-[#62706A] leading-relaxed pt-2 border-t border-[#DCE4E0]">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FEBE16] text-[#052F25] text-xs sm:text-sm font-bold hover:bg-[#E4A900] transition-colors shadow-sm"
            >
              <span>{isBn ? "ক্যাটাগরির পাইকারি কোটেশন চান?" : "Request Wholesale Pricing & Availability"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
