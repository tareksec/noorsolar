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
}

function LazySection({
  children,
  placeholderHeight = 450,
}: {
  children: React.ReactNode;
  placeholderHeight?: number;
}) {
  const [visible, setVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {visible ? (
        children
      ) : (
        <div style={{ minHeight: `${placeholderHeight}px` }} className="bg-[#E4E7E4]" aria-hidden="true" />
      )}
    </div>
  );
}

export function DynamicHomeSections({
  categories,
  featuredProducts,
  testimonials,
  faqItems,
}: DynamicHomeSectionsProps) {
  return (
    <>
      {/* 4. Scroll-Linked Category Story */}
      <LazySection placeholderHeight={500}>
        <CategoryStory categories={categories} />
      </LazySection>

      {/* 5. Featured Products Carousel */}
      <LazySection placeholderHeight={450}>
        <FeaturedCarousel products={featuredProducts} />
      </LazySection>

      {/* 9. Testimonials */}
      <LazySection placeholderHeight={380}>
        <TestimonialsSection testimonials={testimonials} />
      </LazySection>

      {/* 10. Frequently Asked Questions */}
      <LazySection placeholderHeight={360}>
        <FAQSection items={faqItems} />
      </LazySection>
    </>
  );
}