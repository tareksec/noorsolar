import React from "react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getAllProducts } from "@/lib/data/products";
import { getStats } from "@/lib/data/content";
import { RecentDeals } from "@/components/sections/recent-deals";
import { SITE_URL } from "@/lib/site-config";

export const revalidate = 60;

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
    title: isBn ? "লাইভ পাইকারি ডিল — নূর সোলার এনার্জি" : "Live Wholesale Deals — Noor Solar Energy",
    description: isBn
      ? "সোলার প্যানেল, ইনভার্টার ও ব্যাটারির লাইভ পাইকারি ডিল — ব্র্যান্ড, মডেল, MOQ, স্টক ও দামসহ।"
      : "Live wholesale deals on solar panels, inverters and batteries — with brand, model, MOQ, stock and pricing.",
    alternates: {
      canonical: isBn ? `${siteUrl}/bn/deals` : `${siteUrl}/deals`,
      languages: {
        en: `${siteUrl}/deals`,
        bn: `${siteUrl}/bn/deals`,
        "x-default": `${siteUrl}/deals`,
      },
    },
    openGraph: {
      title: isBn ? "লাইভ পাইকারি ডিল — নূর সোলার এনার্জি" : "Live Wholesale Deals — Noor Solar Energy",
      description: isBn
        ? "রেডি স্টক ও কনটেইনার ইনডেন্ট ডিল — সব এক জায়গায়।"
        : "Ready stock and container indent deals — all in one place.",
      url: isBn ? "/bn/deals" : "/deals",
      type: "website",
      locale: isBn ? "bn_BD" : "en_US",
      images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Noor Solar Energy" }],
    },
  };
}

export default async function DealsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [products, stats] = await Promise.all([
    getAllProducts({ locale }),
    getStats(locale),
  ]);

  return (
    <div className="pt-6 md:pt-24">
      <RecentDeals products={products} stats={stats} locale={locale} showViewAll={false} />
    </div>
  );
}
