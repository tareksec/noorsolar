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
import { BusinessImpact } from "@/components/sections/business-impact";
import { FeaturedCarousel } from "@/components/sections/featured-carousel";
import { OrderingSteps } from "@/components/sections/ordering-steps";
import { StatsBand } from "@/components/sections/stats-band";
import { CertificationsSection } from "@/components/sections/certifications-section";
import { PartnersStrip } from "@/components/sections/partners-strip";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { FAQSection } from "@/components/sections/faq-section";
import { ClosingCTA } from "@/components/sections/closing-cta";

export const revalidate = 60; // On-demand or 60s cache revalidation

export const metadata: Metadata = {
  title: "Noor Solar Energy — Solar Panels, Batteries & Inverters Wholesale",
  description:
    "Direct importer and bulk supplier of high-efficiency solar panels, Lithium-ion batteries, and hybrid solar inverters in Bangladesh.",
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
    name: settings.companyName,
    url: siteUrl,
    logo: `${siteUrl}/icon`,
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
      {/* Schema.org Organization Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd).replace(/</g, "\\u003c") }}
      />

      {/* 1. Signature Hero Section (Server Component) */}
      <HeroSection
        headline={settings.heroHeadline}
        subheadline={settings.heroSubheadline}
        primaryCta={settings.heroPrimaryCta}
        secondaryCta={settings.heroSecondaryCta}
      />

      {/* 2. Category Dock (Server Component - 3 Horizontal Cards) */}
      <CategoryDock categories={categories} />

      {/* 3. Business Impact & Sustainability (Future Ready & Cost Efficiency Split Story) */}
      <BusinessImpact />

      {/* 4. Featured Products Carousel */}
      <FeaturedCarousel products={featuredProducts} />

      {/* 5. Ordering Steps */}
      <OrderingSteps />

      {/* 6. Business Statistics Band (Animated 4 Counters) */}
      <StatsBand stats={stats} />

      {/* 7. Certifications Grid */}
      <CertificationsSection certifications={certifications} />

      {/* 8. Partners and Clients Strip */}
      <PartnersStrip partners={partners} />

      {/* 9. Testimonials */}
      <TestimonialsSection testimonials={testimonials} />

      {/* 10. FAQ Section */}
      <FAQSection items={faqItems} />

      {/* 11. Closing Call-To-Action & Quote Form */}
      <ClosingCTA
        phoneDisplay={settings.phoneDisplay}
        whatsappNumber={settings.whatsapp}
        headline={settings.closingCtaHeadline}
        subheadline={settings.closingCtaSubheadline}
      />
    </>
  );
}
