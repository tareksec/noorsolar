import React from "react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { CompleteServicesSection } from "@/components/sections/complete-services";
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
    title: isBn
      ? "কোর ইকুইপমেন্ট লাইনআপ — নূর সোলার এনার্জি"
      : "Core Equipment Lineup — Noor Solar Energy",
    description: isBn
      ? "৩টি প্রধান ইকুইপমেন্ট চ্যানেলের বিস্তারিত ও আমাদের কাজের পরিধি এক নজরে দেখুন — সোলার প্যানেল, ইনভার্টার ও LiFePO4 এনার্জি স্টোরেজ।"
      : "Explore our three primary equipment supply channels at a glance — solar panels, inverters and LiFePO4 energy storage.",
    alternates: {
      canonical: isBn ? `${siteUrl}/bn/equipment` : `${siteUrl}/equipment`,
      languages: {
        en: `${siteUrl}/equipment`,
        bn: `${siteUrl}/bn/equipment`,
        "x-default": `${siteUrl}/equipment`,
      },
    },
    openGraph: {
      title: isBn
        ? "কোর ইকুইপমেন্ট লাইনআপ — নূর সোলার এনার্জি"
        : "Core Equipment Lineup — Noor Solar Energy",
      description: isBn
        ? "বাণিজ্যিক প্রজেক্টের জন্য ইঞ্জিনিয়ারিং-গ্রেড ইকুইপমেন্ট — সোলার প্যানেল, ইনভার্টার ও ব্যাটারি স্টোরেজ।"
        : "Engineering-grade equipment for commercial projects — solar panels, inverters and battery storage.",
      url: isBn ? "/bn/equipment" : "/equipment",
      type: "website",
      locale: isBn ? "bn_BD" : "en_US",
      images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Noor Solar Energy" }],
    },
  };
}

export default async function EquipmentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="pt-20 sm:pt-24">
      <CompleteServicesSection locale={locale} />
    </div>
  );
}
