import React from "react";
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
import { CategoryStory } from "@/components/sections/category-story";
import { FeaturedCarousel } from "@/components/sections/featured-carousel";
import { CertificationsSection } from "@/components/sections/certifications-section";
import { OrderingSteps } from "@/components/sections/ordering-steps";
import { PartnersStrip } from "@/components/sections/partners-strip";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { FAQSection } from "@/components/sections/faq-section";
import { ClosingCTA } from "@/components/sections/closing-cta";

export const revalidate = 60; // On-demand or 60s cache revalidation

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

  return (
    <>
      {/* 1. Signature Hero Section */}
      <HeroSection
        headline={settings.heroHeadline}
        subheadline={settings.heroSubheadline}
        primaryCta={settings.heroPrimaryCta}
        secondaryCta={settings.heroSecondaryCta}
      />

      {/* 2. Category Dock (3 Horizontal Micro-Cards) */}
      <CategoryDock categories={categories} />

      {/* 3. Business Statistics Band (4 Counters) */}
      <StatsBand stats={stats} />

      {/* 4. Scroll-Linked Category Story (with Live Product-Data Spec Counters) */}
      <CategoryStory categories={categories} />

      {/* 5. Featured Products Carousel */}
      <FeaturedCarousel products={featuredProducts} />

      {/* 6. Certifications Grid */}
      <CertificationsSection certifications={certifications} />

      {/* 7. How Ordering Works Sequence */}
      <OrderingSteps />

      {/* 8. Partners and Clients Strip */}
      <PartnersStrip partners={partners} />

      {/* 9. Testimonials */}
      <TestimonialsSection testimonials={testimonials} />

      {/* 10. Frequently Asked Questions (from DB) */}
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