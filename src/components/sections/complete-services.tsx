"use client";

import React from "react";
import { StickyFeatureSection } from "@/components/ui/sticky-scroll-cards-section";

interface CompleteServicesSectionProps {
  locale?: string;
}

export function CompleteServicesSection({ locale }: CompleteServicesSectionProps) {
  const isBn = locale === "bn";

  return (
    <section id="we-provide-section" className="relative w-full">
      <StickyFeatureSection
        locale={locale}
        title={isBn ? "আমরা যা সরবরাহ করি" : "WE PROVIDE"}
        subtitle={
          isBn
            ? "বাণিজ্যিক ও শিল্প প্রকল্পের জন্য টায়ার-১ সোলার প্যানেল, ইনভার্টার ও ব্যাটারি স্টোরেজ"
            : "Engineered Tier-1 Solar Panels, Commercial Inverters & Industrial Energy Storage for Commercial & EPC Projects"
        }
        badge={isBn ? "নূর সোলার / মূল সরবরাহ লাইনআপ" : "NOOR SOLAR / CORE SUPPLY"}
      />
    </section>
  );
}
