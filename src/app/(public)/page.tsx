import React from "react";
import dynamic from "next/dynamic";
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
import { ClosingCTA } from "@/components/sections/closing-cta";

// Below-the-fold animated components loaded dynamically to reduce initial JS bundle size
const CategoryStory = dynamic(
  () =>
    import("@/components/sections/category-story").then(
      (mod) => mod.CategoryStory
    ),
  {
    loading: () => <div className="min-h-[450px] bg-[#E4E7E4]" />,
  }
);

const FeaturedCarousel = dynamic(
  () =>
    import("@/components/sections/featured-carousel").then(
      (mod) => mod.FeaturedCarousel
    ),
  {
    loading: () => <div className="min-h-[450px] bg-[#E4E7E4]" />,
  }
);

const PartnersStrip = dynamic(
  () =>
    import("@/components/sections/partners-strip").then(
      (mod) => mod.PartnersStrip
    ),
  {
    loading: () => <div className="min-h-[120px] bg-[#E4E7E4]" />,
  }
);

const TestimonialsSection = dynamic(
  () =>
    import("@/components/sections/testimonials-section").then(
      (mod) => mod.TestimonialsSection
    ),
  {
    loading: () => <div className="min-h-[360px] bg-[#E4E7E4]" />,
  }
);

const FAQSection = dynamic(
  () =>
    import("@/components/sections/faq-section").then((mod) => mod.FAQSection),
  {
    loading: () => <div className="min-h-[380px] bg-[#E4E7E4]" />,
  }
);

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
