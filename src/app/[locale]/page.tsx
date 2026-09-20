import React from "react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getCategories } from "@/lib/data/categories";
import { getFeaturedProducts } from "@/lib/data/products";
import { getSiteSettings } from "@/lib/data/settings";
import {
  getStats,
  getCertifications,
  getPartners,
  getTestimonials,
  getFaqItems,
} from "@/lib/data/content";

import { HeroSection } from "@/components/sections/hero-section";
import { CategoryDock } from "@/components/sections/category-dock";
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
import { SitePreloader } from "@/components/ui/site-preloader";
import { HomeContactBanner } from "@/components/sections/home-contact-banner";

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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://noorsolaren.com";

  return {
    title: isBn
      ? "নূর সোলার এনার্জি — সোলার প্যানেল, ব্যাটারি ও ইনভার্টার পাইকারি সরবরাহকারী"
      : "Noor Solar Energy — Solar Panels, Batteries & Inverters Wholesale",
    description: isBn
      ? "বাংলাদেশে উচ্চ-দক্ষতাসম্পন্ন সোলার প্যানেল, লিথিয়াম-আয়ন ব্যাটারি এবং হাইব্রিড সোলার ইনভার্টারের সরাসরি আমদানিকারক ও পাইকারি সরবরাহকারী।"
      : "Direct importer and bulk supplier of high-efficiency solar panels, Lithium-ion batteries, and hybrid solar inverters in Bangladesh.",
    alternates: {
      canonical: isBn ? `${siteUrl}/bn` : siteUrl,
      languages: {
        en: `${siteUrl}/`,
        bn: `${siteUrl}/bn`,
        "x-default": `${siteUrl}/`,
      },
    },
    openGraph: {
      title: isBn
        ? "নূর সোলার এনার্জি — ইন্ডাস্ট্রিয়াল সোলার প্যানেল, ব্যাটারি ও ইনভার্টার"
        : "Noor Solar Energy — Industrial Solar Panels, Storage & Inverters",
      description: isBn
        ? "বাংলাদেশে কন্টেইনার-স্কেল পাইকারি সরবরাহকারী: কমার্শিয়াল সোলার প্যানেল, LiFePO4 ব্যাটারি ও ইনভার্টার।"
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
    settings,
    stats,
    certifications,
    partners,
    testimonials,
    faqItems,
  ] = await Promise.all([
    getCategories(locale),
    getFeaturedProducts(locale),
    getSiteSettings(locale),
    getStats(locale),
    getCertifications(locale),
    getPartners(),
    getTestimonials(locale),
    getFaqItems(locale),
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://noorsolaren.com";

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Noor Solar Energy",
    url: siteUrl,
    logo: `${siteUrl}/brand/logo-default.png`,
    description:
      settings.description ||
      "Direct importer and bulk wholesale supplier of solar equipment in Bangladesh.",
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address || "Dhaka, Bangladesh",
      addressLocality: "Dhaka",
      addressCountry: "BD",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: settings.phone || "+8801700000000",
      contactType: "customer service",
      areaServed: "BD",
    },
  };

  return (
    <>
      <SitePreloader />
      {/* Schema.org Organization Structured Data */}
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

      {/* 2. Text Marquee Band */}
      <TextMarquee locale={locale} />

      {/* 3. Category Dock (Server Component - 3 Horizontal Cards) */}
      <CategoryDock categories={categories} locale={locale} />

      {/* 3. Business Statistics Band (Server Component - 4 Counters) */}
      <StatsBand stats={stats} />

      {/* 4. Complete Solar Solutions For Every Project (Design Match) */}
      <ServicesSolutions locale={locale} />

      {/* 5. Trusted Expertise & Key Metrics (Design Match) */}
      <WhyChooseUs locale={locale} />

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
