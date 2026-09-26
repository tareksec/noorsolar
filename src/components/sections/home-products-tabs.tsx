"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sun, BatteryCharging, Cpu, ArrowRight, ShieldCheck, Truck, Award } from "lucide-react";
import { Link } from "@/i18n/routing";
import { ProductCard } from "@/components/product/product-card";
import { Reveal } from "@/components/ui/reveal";

export interface TabProduct {
  id: string;
  slug: string;
  name: string;
  brand?: string | null;
  model?: string | null;
  stockStatus: string;
  moq?: string | null;
  priceBdt?: number | null;
  showPrice: boolean;
  images: Array<{ url: string; alt: string }>;
  specs: Array<{ label: string; value: string }>;
  category?: { name: string; slug: string } | null;
  categoryId?: string | null;
  categorySlug?: string | null;
}

interface HomeProductsTabsProps {
  products: TabProduct[];
  locale?: string;
}

type TabType = "solar" | "battery" | "inverter";

export function HomeProductsTabs({ products = [], locale = "en" }: HomeProductsTabsProps) {
  const isBn = locale === "bn";
  const [activeTab, setActiveTab] = useState<TabType>("solar");

  // Filter products by the 3 specified tabs
  const tabData = useMemo(() => {
    const solarList = products.filter((p) => {
      const slug = p.category?.slug || p.categorySlug || p.categoryId || "";
      if (slug.includes("inverter") || slug.includes("batter")) return false;
      return (
        slug === "solar-panels" ||
        slug.includes("solar-panel") ||
        p.slug.includes("module") ||
        p.slug.includes("panel") ||
        p.slug.includes("topcon") ||
        p.slug.includes("perc") ||
        p.slug.includes("hjt")
      );
    });

    const batteryList = products.filter((p) => {
      const slug = p.category?.slug || p.categorySlug || p.categoryId || "";
      return (
        slug === "lithium-batteries" ||
        slug.includes("batter") ||
        slug.includes("lithium") ||
        p.slug.includes("battery") ||
        p.slug.includes("lifepo4") ||
        p.slug.includes("ess")
      );
    });

    const inverterList = products.filter((p) => {
      const slug = p.category?.slug || p.categorySlug || p.categoryId || "";
      return (
        slug === "solar-inverters" ||
        slug.includes("inverter") ||
        p.slug.includes("inverter") ||
        p.slug.includes("hybrid")
      );
    });

    return {
      solar: solarList,
      battery: batteryList,
      inverter: inverterList,
    };
  }, [products]);

  const tabsConfig = [
    {
      id: "solar" as TabType,
      label: isBn ? "সোলার" : "Solar",
      fullLabel: isBn ? "সোলার প্যানেল" : "Solar Panels",
      icon: Sun,
      categorySlug: "solar-panels",
      count: tabData.solar.length,
    },
    {
      id: "battery" as TabType,
      label: isBn ? "ব্যাটারি" : "Battery",
      fullLabel: isBn ? "লিথিয়াম ব্যাটারি" : "Lithium Batteries",
      icon: BatteryCharging,
      categorySlug: "lithium-batteries",
      count: tabData.battery.length,
    },
    {
      id: "inverter" as TabType,
      label: isBn ? "ইনভার্টার" : "Inverter",
      fullLabel: isBn ? "সোলার ইনভার্টার" : "Solar Inverters",
      icon: Cpu,
      categorySlug: "solar-inverters",
      count: tabData.inverter.length,
    },
  ];

  // Selected tab's items (max 8 for a 4-column x 2-line grid)
  const currentProducts = useMemo(() => {
    return tabData[activeTab].slice(0, 8);
  }, [tabData, activeTab]);

  const currentTabConfig = tabsConfig.find((t) => t.id === activeTab) || tabsConfig[0];

  return (
    <section
      id="products-section"
      className="relative pt-10 sm:pt-14 pb-16 sm:pb-24 bg-[#F8FAF8] border-b border-[#E2E8E4] overflow-hidden"
    >
      {/* Subtle decorative background ambient glow */}
      <div
        className="pointer-events-none absolute -top-40 right-1/4 w-[600px] h-[600px] rounded-full bg-[#074031]/[0.03] blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 left-10 w-[500px] h-[500px] rounded-full bg-[#FEBE16]/[0.04] blur-[100px]"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <Reveal y={20} duration={0.6}>
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-14">
            {/* Kicker badge */}
            <div className="inline-flex items-center justify-center gap-3 text-xs sm:text-sm font-semibold tracking-wider text-[#074031] uppercase mb-3">
              <span className="w-8 sm:w-12 h-[1.5px] bg-[#074031]/40 rounded-full" />
              <span className="px-3 py-1 rounded-full bg-[#074031]/5 border border-[#074031]/15 text-[#074031] font-mono text-[11px] sm:text-xs">
                {isBn ? "পাইকারি ক্যাটালগ" : "OFFICIAL B2B CATALOGUE"}
              </span>
              <span className="w-8 sm:w-12 h-[1.5px] bg-[#074031]/40 rounded-full" />
            </div>

            {/* Section Main Title: "Products" */}
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#17251F] leading-tight">
              {isBn ? "পণ্যসমূহ" : "Products"}
            </h2>

            {/* Subtitle */}
            <p className="mt-2.5 sm:mt-3 text-xs sm:text-base text-[#62706A] max-w-2xl mx-auto leading-relaxed">
              {isBn
                ? "বাণিজ্যিক ও শিল্প প্রকল্পের জন্য উচ্চ-দক্ষতাসম্পন্ন সোলার প্যানেল, লিথিয়াম ব্যাটারি এবং হাইব্রিড ইনভার্টার।"
                : "Directly imported Tier-1 commercial solar modules, high-density LiFePO4 storage, and intelligent solar inverters with official warranty."}
            </p>

            {/* 3 Tabs: Solar, Battery, Inverter */}
            <div className="mt-6 sm:mt-8 flex justify-center overflow-x-auto scrollbar-none px-1">
              <div
                role="tablist"
                aria-label={isBn ? "পণ্য বিভাগ" : "Product Categories"}
                className="inline-flex items-center p-1 sm:p-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#DCE4E0] shadow-[0_4px_20px_rgba(0,0,0,0.04)] max-w-full"
              >
                {tabsConfig.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const IconComponent = tab.icon;

                  return (
                    <button
                      key={tab.id}
                      role="tab"
                      id={`tab-${tab.id}`}
                      aria-selected={isActive}
                      aria-controls={`panel-${tab.id}`}
                      aria-label={isBn ? `${tab.fullLabel} (${tab.count}টি পণ্য)` : `${tab.fullLabel} (${tab.count} products)`}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-7 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#074031] whitespace-nowrap ${
                        isActive ? "text-white" : "text-[#4A5550] hover:text-[#17251F] hover:bg-[#F1F4F1]/60"
                      }`}
                    >
                      {/* Active Tab Animated Pill Indicator */}
                      {isActive && (
                        <motion.span
                          layoutId="activeHomeProductTab"
                          className="absolute inset-0 rounded-full bg-[#074031] shadow-[0_4px_14px_rgba(7,64,49,0.28)]"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}

                      <span className="relative z-10 flex items-center gap-1.5">
                        <IconComponent
                          className={`w-4 h-4 transition-colors ${
                            isActive ? "text-[#FEBE16]" : "text-[#62706A]"
                          }`}
                        />
                        <span>{tab.label}</span>
                        {tab.count > 0 && (
                          <span
                            aria-hidden="true"
                            className={`ml-1.5 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-mono font-bold transition-all shadow-xs ${
                              isActive
                                ? "bg-[#FEBE16] text-[#052F25]"
                                : "bg-[#E2E8E4] text-[#17251F] border border-[#CBD5D0]"
                            }`}
                          >
                            {tab.count}
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Reveal>

        {/* 4-Column Grid across 2 Lines (Up to 8 products per tab) */}
        <Reveal y={24} delay={0.1} duration={0.65}>
          <div
            role="tabpanel"
            id={`panel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
            className="min-h-[420px]"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6"
              >
                {currentProducts.map((product, idx) => (
                  <motion.div
                    key={product.id || product.slug}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.04 }}
                    className="h-full flex"
                  >
                    <div className="w-full h-full">
                      <ProductCard product={product} priority={idx < 4} />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {currentProducts.length === 0 && (
              <div className="text-center py-16 bg-white rounded-3xl border border-[#DCE4E0]">
                <p className="text-[#62706A] text-sm">
                  {isBn ? "এই বিভাগে বর্তমানে কোনো পণ্য নেই।" : "No products available in this category."}
                </p>
              </div>
            )}
          </div>
        </Reveal>

        {/* Bottom Bar: Quick Features & Category Link CTA */}
        <Reveal y={16} delay={0.15} duration={0.6}>
          <div className="mt-12 pt-8 border-t border-[#E2E8E4] flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Trust points */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-8 text-xs sm:text-sm text-[#62706A]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#074031]" />
                <span>{isBn ? "১০০% আসল ও ওয়ারেন্টিযুক্ত" : "100% Genuine & Warrantied"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#074031]" />
                <span>{isBn ? "দেশব্যাপী কনটেইনার ও বাল্ক সরবরাহ" : "Container-scale Wholesale"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#074031]" />
                <span>{isBn ? "টিয়ার-১ সার্টিফাইড ইকুইপমেন্ট" : "Tier-1 Certified Equipment"}</span>
              </div>
            </div>

            {/* Direct CTA button to full category */}
            <div className="flex items-center gap-3">
              <Link
                href={`/products?category=${currentTabConfig.categorySlug}`}
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold bg-white hover:bg-[#074031] text-[#074031] hover:text-white border border-[#074031]/30 hover:border-[#074031] shadow-sm hover:shadow-md transition-all duration-300"
              >
                <span>
                  {isBn
                    ? `সকল ${currentTabConfig.fullLabel} দেখুন`
                    : `View All ${currentTabConfig.fullLabel}`}
                </span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
