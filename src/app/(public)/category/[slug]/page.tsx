import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/data/categories";
import { ProductCard } from "@/components/product/product-card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EmptyCatalogIllustration } from "@/components/illustrations/empty-catalog-illustration";
import { AppImage } from "@/components/ui/app-image";

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
        <div className="p-6 sm:p-10 rounded-[36px] bg-[#EDEDED] border border-white mb-8 grid sm:grid-cols-[1fr_180px] gap-6 items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-[11px] font-mono text-[#111311] mb-3">
              <span className="w-2 h-2 rounded-full bg-[#CEF23E]"></span>
              <span>Direct Import Line</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-[-.04em] text-[#111311]">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-sm sm:text-base text-[#5C605C] leading-relaxed mt-3">
                {category.description}
              </p>
            )}
            <p className="text-xs font-mono text-[#5C605C] mt-5">{category.products.length} models · Specifications & bulk enquiries</p>
          </div>
          {category.image && <AppImage src={category.image} alt={category.name} width={240} height={180} sizes="180px" className="hidden sm:block w-full rounded-3xl mix-blend-multiply" />}
        </div>

        {/* Category Products Grid */}
        {category.products.length > 0 ? (
          <div className="catalog-grid">
            {category.products.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  category: { name: category.name, slug: category.slug },
                }}
                priority={idx === 0}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-white border border-[#DDE1DC] max-w-lg mx-auto">
            <EmptyCatalogIllustration className="w-40 h-36 mx-auto mb-2" />
            <h2 className="text-lg font-bold text-[#111311] mb-2">
              No active products listed yet
            </h2>
            <p className="text-xs text-[#5C605C] mb-6">
              Contact us with your requirements, or explore the other equipment categories.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-5 py-2.5 rounded-full bg-[#111311] text-white text-xs font-medium hover:bg-black transition-colors"
            >
              View Full Catalog
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
