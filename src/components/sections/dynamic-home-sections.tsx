"use client";

import React from "react";
import dynamic from "next/dynamic";
import type { Testimonial } from "@prisma/client";

const CategoryStory = dynamic(
  () =>
    import("@/components/sections/category-story").then(
      (mod) => mod.CategoryStory
    ),
  {
    ssr: false,
    loading: () => <div className="min-h-[450px] bg-[#E4E7E4]" />,
  }
);

const FeaturedCarousel = dynamic(
  () =>
    import("@/components/sections/featured-carousel").then(
      (mod) => mod.FeaturedCarousel
    ),
  {
    ssr: false,
    loading: () => <div className="min-h-[450px] bg-[#E4E7E4]" />,
  }
);

const TestimonialsSection = dynamic(
  () =>
    import("@/components/sections/testimonials-section").then(
      (mod) => mod.TestimonialsSection
    ),
  {
    ssr: false,
    loading: () => <div className="min-h-[360px] bg-[#E4E7E4]" />,
  }
);

const FAQSection = dynamic(
  () =>
    import("@/components/sections/faq-section").then((mod) => mod.FAQSection),
  {
    ssr: false,
    loading: () => <div className="min-h-[380px] bg-[#E4E7E4]" />,
  }
);

interface DynamicHomeSectionsProps {
  categories: Array<{
    id: string;
    slug: string;
    name: string;
    description?: string | null;
    image?: string | null;
  }>;
  featuredProducts: Array<{
    id: string;
    slug: string;
    name: string;
    brand?: string | null;
    model?: string | null;
    stockStatus: string;
    priceBdt?: number | null;
    showPrice: boolean;
    images: Array<{ url: string; alt: string }>;
    specs: Array<{ label: string; value: string }>;
    category?: { name: string; slug: string } | null;
  }>;
  testimonials: Testimonial[];
  faqItems: Array<{
    id?: string;
    question: string;
    answer: string;
  }>;
  locale?: string;
}

export function DynamicHomeSections({
  categories,
  featuredProducts,
  testimonials,
  faqItems,
  locale,
}: DynamicHomeSectionsProps) {
  return (
    <>
      {/* 4. Scroll-Linked Category Story */}
      <CategoryStory categories={categories} locale={locale} />

      {/* 5. Featured Products Carousel */}
      <FeaturedCarousel products={featuredProducts} locale={locale} />

      {/* 9. Testimonials */}
      <TestimonialsSection testimonials={testimonials} locale={locale} />

      {/* 10. Frequently Asked Questions */}
      <FAQSection items={faqItems} locale={locale} />
    </>
  );
}