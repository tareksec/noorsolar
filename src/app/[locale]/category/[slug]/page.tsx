import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { db } from "@/lib/db";
import { getCategoryBySlug } from "@/lib/data/categories";
import { ProductCard } from "@/components/product/product-card";
import { ArrowLeft } from "lucide-react";
import { EmptyCatalogIllustration } from "@/components/illustrations/empty-catalog-illustration";
import { SITE_URL } from "@/lib/site-config";

interface CategoryPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  try {
    const categories = await db.category.findMany({
      where: { isActive: true },
      select: { slug: true },
    });
    return routing.locales.flatMap((locale) =>
      categories.map((c) => ({ locale, slug: c.slug }))
    );
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const isBn = locale === "bn";
  const siteUrl = SITE_URL;
  const category = await getCategoryBySlug(slug, locale);

  if (!category) {
    return { title: isBn ? "ক্যাটাগরি পাওয়া যায়নি" : "Category Not Found" };
  }

  const desc =
    category.description ||
    (isBn
      ? `বাংলাদেশে বাণিজ্যিক ও শিল্প প্রকল্পের জন্য সরাসরি আমদানিকৃত ${category.name}-এর স্পেসিফিকেশন ও পাইকারি সরবরাহ তালিকা।`
      : `Direct-imported commercial ${category.name} available for wholesale and container supply in Bangladesh.`);

  const pageTitle = isBn
    ? `${category.name} পাইকারি সরবরাহ — নূর সোলার এনার্জি`
    : `${category.name} Wholesale — Noor Solar Energy`;

  return {
    title: pageTitle,
    description: desc,
    alternates: {
      canonical: isBn ? `${siteUrl}/bn/category/${category.slug}` : `${siteUrl}/category/${category.slug}`,
      languages: {
        en: `${siteUrl}/category/${category.slug}`,
        bn: `${siteUrl}/bn/category/${category.slug}`,
        "x-default": `${siteUrl}/category/${category.slug}`,
      },
    },
    openGraph: {
      title: pageTitle,
      description: desc,
      url: isBn ? `/bn/category/${category.slug}` : `/category/${category.slug}`,
      type: "website",
      locale: isBn ? "bn_BD" : "en_US",
      images: category.image ? [{ url: category.image }] : [],
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const category = await getCategoryBySlug(slug, locale);

  if (!category) {
    notFound();
  }

  const isBn = locale === "bn";

  return (
    <div className="pt-28 sm:pt-36 pb-24 bg-[#E4E7E4] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#5C605C] hover:text-[#111311] transition-colors min-h-[44px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isBn ? "সকল পণ্যে ফিরে যান" : "Back to All Equipment"}</span>
          </Link>
        </div>

        {/* Category Header Banner */}
        <div className="p-8 sm:p-12 rounded-[36px] bg-[#EDEDED] border border-[#DDE1DC] mb-12 relative overflow-hidden">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-[11px] font-mono text-[#111311] mb-3">
              <span className="w-2 h-2 rounded-full bg-[#CEF23E]"></span>
              <span>{isBn ? "সরাসরি আমদানি লাইন" : "Direct Import Line"}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#111311]">
              {category.name}
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
            {category.products.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  category: { name: category.name, slug: category.slug },
                }}
                priority={idx < 2}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-white border border-[#DDE1DC] max-w-lg mx-auto">
            <EmptyCatalogIllustration className="w-40 h-36 mx-auto mb-2" />
            <h3 className="text-lg font-bold text-[#111311] mb-2">
              {isBn ? "এই ক্যাটাগরিতে এখনও কোনো পণ্য নেই" : "No active products listed yet"}
            </h3>
            <p className="text-xs text-[#5C605C] mb-6">
              {isBn
                ? "এই ক্যাটাগরির জন্য নতুন কনটেইনারের পণ্য ওয়্যারহাউসে যুক্ত হওয়ার প্রক্রিয়ায় রয়েছে।"
                : "New container inventory for this category is currently being staged in our warehouse."}
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-5 py-2.5 min-h-[44px] rounded-full bg-[#111311] text-white text-xs font-medium hover:bg-black transition-colors"
            >
              {isBn ? "পূর্ণাঙ্গ ক্যাটালগ দেখুন" : "View Full Catalog"}
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
