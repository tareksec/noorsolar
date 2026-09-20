"use client";

import React from "react";
import type { Testimonial } from "@prisma/client";

import { CategoryStory } from "@/components/sections/category-story";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { FAQSection } from "@/components/sections/faq-section";

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

      {/* 9. Testimonials */}
      <TestimonialsSection testimonials={testimonials} locale={locale} />

      {/* 10. Frequently Asked Questions */}
      <FAQSection items={faqItems} locale={locale} />
    </>
  );
}