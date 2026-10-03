import React from "react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getCategories } from "@/lib/data/categories";
import { getFeaturedProducts, getAllProducts } from "@/lib/data/products";
import { getSiteSettings } from "@/lib/data/settings";
import {
  getStats,
  getCertifications,
  getPartners,
  getTestimonials,
  getFaqItems,
} from "@/lib/data/content";
import { getPublishedProjects } from "@/lib/data/projects";
import { ProjectsShowcase } from "@/components/sections/projects-showcase";

import { HeroSection } from "@/components/sections/hero-section";
import { StatsBand } from "@/components/sections/stats-band";
import { CertificationsSection } from "@/components/sections/certifications-section";
import { OrderingSteps } from "@/components/sections/ordering-steps";
import { PartnersStrip } from "@/components/sections/partners-strip";
import { TextMarquee } from "@/components/sections/text-marquee";
import { ServicesSolutions } from "@/components/sections/services-solutions";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { SustainabilityImpact } from "@/components/sections/sustainability-impact";
import { VideoCtaBanner } from "@/components/sections/video-cta-banner";
import { DynamicHomeSections } from "@/components/sections/dynamic-home-sections";
import { HomeProductsTabs } from "@/components/sections/home-products-tabs";
import { FeaturedProducts } from "@/components/sections/featured-products";
import { RecentDeals } from "@/components/sections/recent-deals";
import { BuyerSegmentation } from "@/components/sections/buyer-segmentation";
import { HomeContactBanner } from "@/components/sections/home-contact-banner";
import { HomepageSeoContent } from "@/components/sections/homepage-seo-content";
import { SITE_URL } from "@/lib/site-config";

export const revalidate = 60; // On-demand or 60s cache revalidation

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isBn = locale === "bn";
  const siteUrl = SITE_URL;

  return {
    title: isBn
      ? "সোলার প্যানেল সরবরাহকারী বাংলাদেশ | সোলার প্যানেল এর দাম ২০২৬ ও পাইকারি ইনভার্টার, ব্যাটারি — নূর সোলার এনার্জি"
      : "Solar Panel Supplier Bangladesh | Solar Battery & Inverter Wholesale — Noor Solar Energy",
    description: isBn
      ? "বাংলাদেশে টিয়ার-১ N-Type TOPCon সোলার প্যানেল, সোলার প্যানেল প্যাকেজ ও ফুল সেট, LiFePO4 লিথিয়াম ব্যাটারি এবং হাইব্রিড ইনভার্টারের বিশ্বস্ত পাইকারি সরবরাহকারী। সোলার প্যানেল এর দাম ২০২৬ ও প্রজেক্ট কোটেশন।"
      : "Direct importer and bulk B2B supplier of Tier-1 N-Type TOPCon solar panels, LiFePO4 batteries, and commercial inverters in Bangladesh. Wholesale pricing, verified warranties & turnkey industrial packages.",
    keywords: isBn
      ? [
          "সোলার প্যানেল সরবরাহকারী বাংলাদেশ",
          "সোলার প্যানেল এর দাম 2026",
          "সোলার প্যানেল প্রাইস ইন বাংলাদেশ",
          "সোলার প্যানেল ফুল সেট",
          "সোলার প্যানেল প্যাকেজ",
          "২০০ ওয়াট সোলার প্যানেলের দাম কত",
          "১০০০ ওয়াট সোলার প্যানেলের দাম কত",
          "সোলার ব্যাটারি সরবরাহকারী বাংলাদেশ",
          "সোলার ইনভার্টার সরবরাহকারী বাংলাদেশ",
          "LiFePO4 ব্যাটারি বাংলাদেশ",
          "ইন্ডাস্ট্রিয়াল সোলার সলিউশন বাংলাদেশ",
          "নূর সোলার এনার্জি",
          "Noor Solar Energy",
        ]
      : [
          "solar panel supplier Bangladesh",
          "solar equipment supplier Bangladesh",
          "solar panel wholesale Bangladesh",
          "solar inverter supplier Bangladesh",
          "LiFePO4 battery supplier Bangladesh",
          "solar battery supplier Bangladesh",
          "solar energy solutions Bangladesh",
          "commercial solar supplier Bangladesh",
          "TOPCon solar panel Bangladesh",
          "industrial solar solution Bangladesh",
          "solar solution for factory Bangladesh",
          "solar EPC supplier Bangladesh",
          "solar panel price in Bangladesh 2026",
          "Noor Solar Energy",
        ],
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: isBn ? "/bn" : "/",
      languages: {
        en: "/",
        bn: "/bn",
        "x-default": "/",
      },
    },
    openGraph: {
      title: isBn
        ? "সোলার প্যানেল সরবরাহকারী বাংলাদেশ | সোলার প্যানেল এর দাম ২০২৬ ও পাইকারি ইনভার্টার — নূর সোলার এনার্জি"
        : "Solar Panel Supplier Bangladesh | Solar Battery & Inverter Wholesale — Noor Solar Energy",
      description: isBn
        ? "বাংলাদেশে কন্টেইনার-স্কেল পাইকারি সরবরাহকারী: কমার্শিয়াল সোলার প্যানেল, সোলার প্যাকেজ ও ফুল সেট, LiFePO4 ব্যাটারি ও ইনভার্টার।"
        : "Direct importer and container-scale wholesale supplier of commercial-grade solar panels, LiFePO4 batteries, and inverters in Bangladesh.",
      url: isBn ? "/bn" : "/",
      type: "website",
      locale: isBn ? "bn_BD" : "en_US",
      images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Noor Solar Energy" }],
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [
    categories,
    featuredProducts,
    allProducts,
    settings,
    stats,
    certifications,
    partners,
    testimonials,
    faqItems,
    projects,
  ] = await Promise.all([
    getCategories(locale),
    getFeaturedProducts(locale),
    getAllProducts({ locale }),
    getSiteSettings(locale),
    getStats(locale),
    getCertifications(locale),
    getPartners(),
    getTestimonials(locale),
    getFaqItems(locale),
    getPublishedProjects(locale),
  ]);

  const siteUrl = SITE_URL;

  // Only include non-empty, verified social profile URLs
  const verifiedSameAs = Object.values(settings.socials || {}).filter(
    (url): url is string =>
      typeof url === "string" &&
      url.trim().length > 0 &&
      !url.includes("example.com")
  );

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Noor Solar Energy",
    alternateName: "নূর সোলার এনার্জি",
    url: siteUrl,
    logo: `${siteUrl}/brand/logo-default.png`,
    image: `${siteUrl}/brand/logo-default.png`,
    description:
      settings.description ||
      "Direct importer and bulk wholesale supplier of solar equipment in Bangladesh.",
    email: settings.email || "info@noorsolaren.com",
    telephone: settings.phone || "+8801884611888",
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address || "House-38 (Flat-1A), Road-5/A, Sector-5, Uttara, Dhaka-1230, Bangladesh",
      addressLocality: "Uttara, Dhaka",
      postalCode: "1230",
      addressCountry: "BD",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: settings.phone || "+8801884611888",
      contactType: "customer service",
      email: settings.email || "info@noorsolaren.com",
      areaServed: "BD",
      availableLanguage: ["English", "Bengali"],
    },
    ...(verifiedSameAs.length > 0 ? { sameAs: verifiedSameAs } : {}),
  };

  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Noor Solar Energy",
    alternateName: "নূর সোলার এনার্জি",
    url: siteUrl,
    description: "Direct importer & wholesale bulk supplier of commercial solar panels, LiFePO4 batteries, and inverters in Bangladesh.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/products?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      {/* Schema.org WebSite & Organization Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />

      {/* 1. Signature Hero Section (Server Component) */}
      <HeroSection
        headline={settings.heroHeadline}
        subheadline={settings.heroSubheadline}
        primaryCta={settings.heroPrimaryCta}
        secondaryCta={settings.heroSecondaryCta}
        locale={locale}
      />

      {/* 2. Complete Services Section (Editorial Poster Deck Design) */}
      {/* 3. Text Marquee Band */}
      <TextMarquee locale={locale} />

      {/* 3. WE PROVIDE (Core Supply Lineup) */}
      <ServicesSolutions locale={locale} />

      {/* 4. Products Tabbed Section (Solar, Battery, Inverter - 4x2 Grid) */}
      <HomeProductsTabs products={allProducts} locale={locale} />

      {/* Recent Deals Section */}
      <RecentDeals products={allProducts} stats={stats} locale={locale} />

      {/* 5. Business Statistics Band (Server Component - 4 Counters) */}
      <StatsBand stats={stats} />

      {/* 6. B2B Buyer Segmentation (EPCs, Industrial & Commercial, Dealers) */}
      <BuyerSegmentation locale={locale} />


      {/* Featured Products (Top In-Stock Equipment) */}
      <FeaturedProducts products={featuredProducts} locale={locale} />

      {/* 5. Trusted Expertise & Key Metrics (Design Match) */}
      <WhyChooseUs locale={locale} stats={stats} />

      {/* 6. Built for Lower Impact & Cost Efficiency (Design Match) */}
      <SustainabilityImpact locale={locale} />

      {/* 7. Video CTA: Container-Scale Solar Supply (Robotic Assembly Video) */}
      <VideoCtaBanner locale={locale} />

      {/* 8. Certifications Grid (Server Component) */}
      <CertificationsSection certifications={certifications} locale={locale} />

      {/* 7. How Ordering Works Sequence (Process Section) */}
      <OrderingSteps
        headline={settings.processHeadline}
        subheadline={settings.processSubheadline}
        steps={settings.processSteps}
        locale={locale}
      />

      {/* 8. Partners and Clients Strip (Server Component) */}
      <PartnersStrip partners={partners} locale={locale} />

      {/* 9. Verified Project Supply References (cleanly hidden if database has no published projects) */}
      <ProjectsShowcase projects={projects} locale={locale} />

      {/* 10. Comprehensive Topical Authority SEO Section: Who We Are, Products We Supply, Who We Serve, FAQ */}
      <HomepageSeoContent locale={locale} />

      {/* Below-the-fold Animated Sections (Dynamic Client-Side Only to keep initial JS bundle small) */}
      <DynamicHomeSections
        categories={categories}
        featuredProducts={featuredProducts}
        testimonials={testimonials}
        faqItems={faqItems}
        locale={locale}
      />

      {/* 11. Closing Call-To-Action Banner (Directs to separate Contact & Quote page) */}
      <HomeContactBanner
        phoneDisplay={settings.phoneDisplay}
        whatsappNumber={settings.whatsapp}
        headline={settings.closingCtaHeadline}
        subheadline={settings.closingCtaSubheadline}
        locale={locale}
      />
    </>
  );
}
