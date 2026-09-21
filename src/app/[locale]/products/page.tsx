import React from "react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getCategories } from "@/lib/data/categories";
import { getAllProducts } from "@/lib/data/products";
import { ShopPageClient } from "@/components/shop/shop-page-client";
import { SITE_URL } from "@/lib/site-config";

interface ProductsPageProps {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    category?: string;
    q?: string;
  }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isBn = locale === "bn";
  const siteUrl = SITE_URL;

  return {
    title: isBn
      ? "সোলার ইকুইপমেন্ট ক্যাটালগ — প্যানেল, ব্যাটারি ও ইনভার্টার"
      : "Equipment Catalog — Solar Panels, Batteries & Inverters",
    description: isBn
      ? "বাংলাদেশে পাইকারি আমদানিকৃত সোলার প্যানেল, লিথিয়াম-আয়ন স্টোরেজ ব্যাটারি এবং ইন্ডাস্ট্রিয়াল ইনভার্টারের সম্পূর্ণ ক্যাটালগ।"
      : "Explore our complete inventory of Solar Panels, Lithium-ion Storage Batteries, and Industrial Inverters available for bulk wholesale in Bangladesh.",
    alternates: {
      canonical: isBn ? `${siteUrl}/bn/products` : `${siteUrl}/products`,
      languages: {
        en: `${siteUrl}/products`,
        bn: `${siteUrl}/bn/products`,
        "x-default": `${siteUrl}/products`,
      },
    },
    openGraph: {
      title: isBn
        ? "সোলার ইকুইপমেন্ট ক্যাটালগ — নূর সোলার এনার্জি"
        : "Solar Equipment Catalog — Noor Solar Energy",
      description: isBn
        ? "বাংলাদেশে পাইকারি আমদানিকৃত সোলার প্যানেল, LiFePO4 ব্যাটারি এবং ইন্ডাস্ট্রিয়াল ইনভার্টার।"
        : "Explore bulk wholesale inventory of high-efficiency solar panels, LiFePO4 batteries, and industrial inverters in Bangladesh.",
      url: isBn ? `${siteUrl}/bn/products` : `${siteUrl}/products`,
      type: "website",
      locale: isBn ? "bn_BD" : "en_US",
    },
  };
}

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const queryParams = await searchParams;
  const activeCategorySlug = queryParams.category || "all";
  const searchQuery = queryParams.q || "";

  const [categories, products] = await Promise.all([
    getCategories(locale),
    getAllProducts({
      locale,
    }),
  ]);

  return (
    <ShopPageClient
      categories={categories}
      products={products}
      currentLocale={locale}
      initialCategory={activeCategorySlug}
      initialSearchQuery={searchQuery}
    />
  );
}
