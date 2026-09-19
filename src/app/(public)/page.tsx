import React from "react";
import { getCategories } from "@/lib/data/categories";
import { getFeaturedProducts, getSpecHighlights } from "@/lib/data/products";
import { getSiteSettings } from "@/lib/data/settings";
import { HeroSection } from "@/components/sections/hero-section";
import { CategoryDock } from "@/components/sections/category-dock";
import { CategoryStory } from "@/components/sections/category-story";
import { FeaturedCarousel } from "@/components/sections/featured-carousel";
import { SpecHighlights } from "@/components/sections/spec-highlights";
import { OrderingSteps } from "@/components/sections/ordering-steps";
import { FAQSection } from "@/components/sections/faq-section";
import { ClosingCTA } from "@/components/sections/closing-cta";

export const revalidate = 60; // On-demand or 60s cache revalidation

export default async function HomePage() {
  const [categories, featuredProducts, specHighlights, settings] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
    getSpecHighlights(),
    getSiteSettings(),
  ]);

  return (
    <>
      {/* 1. Signature Hero Section */}
      <HeroSection
        headline={settings.heroHeadline}
        subheadline={settings.heroSubheadline}
      />

      {/* 2. Category Dock (3 Horizontal Micro-Cards) */}
      <CategoryDock categories={categories} />

      {/* 3. Category Story (Deep Interactive Showcase) */}
      <CategoryStory categories={categories} />

      {/* 4. Featured Products Carousel */}
      <FeaturedCarousel products={featuredProducts} />

      {/* 5. Data-Driven Spec Highlights */}
      <SpecHighlights highlights={specHighlights} />

      {/* 6. Procurement & Ordering Steps */}
      <OrderingSteps />

      {/* 7. FAQ Accordion */}
      <FAQSection items={settings.faq} />

      {/* 8. Closing Call-To-Action & Quote Form */}
      <ClosingCTA
        phoneDisplay={settings.phoneDisplay}
        whatsappNumber={settings.whatsapp}
      />
    </>
  );
}
