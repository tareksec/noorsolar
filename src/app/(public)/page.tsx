import React from "react";
import type { Metadata } from "next";
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
import dynamic from "next/dynamic";
import { DynamicHomeSections } from "@/components/sections/dynamic-home-sections";
import { SitePreloader } from "@/components/ui/site-preloader";

const ClosingCTA = dynamic(
  () => import("@/components/sections/closing-cta").then((mod) => mod.ClosingCTA),
  { ssr: true }
);

export const revalidate = 60; // On-demand or 60s cache revalidation

export const metadata: Metadata = {
  title: "Noor Solar Energy — Solar Panels, Batteries & Inverters Wholesale",
  description:
    "Direct importer and bulk supplier of high-efficiency solar panels, Lithium-ion batteries, and hybrid solar inverters in Bangladesh.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Noor Solar Energy — Industrial Solar Panels, Storage & Inverters",
    description:
      "Direct importer and container-scale wholesale supplier of commercial-grade solar panels, LiFePO4 batteries, and inverters in Bangladesh.",
    url: "/",
    type: "website",
  },
};

export default async function HomePage() {
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
    getCategories(),
    getFeaturedProducts(),
    getSiteSettings(),
    getStats(),
    getCertifications(),
    getPartners(),
    getTestimonials(),
    getFaqItems(),
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
      />

      {/* 2. Text Marquee Band */}
      <TextMarquee />

      {/* 3. Category Dock (Server Component - 3 Horizontal Cards) */}
      <CategoryDock categories={categories} />

      {/* 3. Business Statistics Band (Server Component - 4 Counters) */}
      <StatsBand stats={stats} />

      {/* 4. Complete Solar Solutions For Every Project (Design Match) */}
      <ServicesSolutions />

      {/* 5. Trusted Expertise & Key Metrics (Design Match) */}
      <WhyChooseUs />

      {/* 6. Built for Lower Impact & Cost Efficiency (Design Match) */}
      <SustainabilityImpact />

      {/* 7. Video CTA: Container-Scale Solar Supply (Robotic Assembly Video) */}
      <VideoCtaBanner />

      {/* 8. Certifications Grid (Server Component) */}
      <CertificationsSection certifications={certifications} />

      {/* 7. How Ordering Works Sequence (Process Section) */}
      <OrderingSteps
        headline={settings.processHeadline}
        subheadline={settings.processSubheadline}
        steps={settings.processSteps}
      />

      {/* 8. Partners and Clients Strip (Server Component) */}
      <PartnersStrip partners={partners} />

      {/* Below-the-fold Animated Sections (Dynamic Client-Side Only to keep initial JS bundle small) */}
      <DynamicHomeSections
        categories={categories}
        featuredProducts={featuredProducts}
        testimonials={testimonials}
        faqItems={faqItems}
      />

      {/* 11. Closing Call-To-Action & Quote Form (Server Component) */}
      <ClosingCTA
        phoneDisplay={settings.phoneDisplay}
        whatsappNumber={settings.whatsapp}
        headline={settings.closingCtaHeadline}
        subheadline={settings.closingCtaSubheadline}
      />
    </>
  );
}
