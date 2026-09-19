import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/data/categories";
import { ProductCard } from "@/components/product/product-card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: "Category Not Found" };
  }

  const desc = category.description || `Explore bulk ${category.name} available for wholesale import in Bangladesh.`;

  return {
    title: `${category.name} Wholesale — Noor Solar Energy`,
    description: desc,
    openGraph: {
      title: `${category.name} Wholesale — Noor Solar Energy`,
      description: desc,
      url: `/category/${category.slug}`,
      type: "website",
      images: category.image ? [{ url: category.image }] : [],
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="pt-28 sm:pt-36 pb-24 bg-[#E4E7E4] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#5C605C] hover:text-[#111311] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Equipment</span>
          </Link>
        </div>

        {/* Category Header Banner */}
        <div className="p-8 sm:p-12 rounded-[36px] bg-[#EDEDED] border border-[#DDE1DC] mb-12 relative overflow-hidden">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-[11px] font-mono text-[#111311] mb-3">
              <span className="w-2 h-2 rounded-full bg-[#CEF23E]"></span>
              <span>Direct Import Line</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#111311]">
              {category.name} .
            </h1>
            {category.description && (
              <p className="text-sm sm:text-base text-[#5C605C] leading-relaxed mt-3">
                {category.description}
              </p>
            )}
          </div>
        </div>

        {/* Category Products Grid */}
        {category.products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {category.products.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  category: { name: category.name, slug: category.slug },
                }}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-white border border-[#DDE1DC]">
            <p className="text-sm text-[#5C605C]">
              No active products currently listed under this category.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
