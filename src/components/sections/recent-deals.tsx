"use client";

import React, { useState, useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight, CheckCircle2, Clock } from "lucide-react";
import type { Stat } from "@prisma/client";
import { Link } from "@/i18n/routing";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import type { TabProduct } from "@/components/sections/home-products-tabs";

type DealTab = "solar" | "inverter" | "battery" | "other";

interface RecentDealsProps {
  products?: TabProduct[];
  stats?: Stat[];
  locale?: string;
  /** Max rows per tab. Omit for the full page list. */
  limit?: number;
  /** Show the "view all" link (homepage teaser). */
  showViewAll?: boolean;
}

function classify(p: TabProduct): DealTab {
  const slug = p.category?.slug || p.categorySlug || p.categoryId || "";
  if (
    slug === "solar-inverters" ||
    slug.includes("inverter") ||
    p.slug.includes("inverter") ||
    p.slug.includes("hybrid")
  )
    return "inverter";
  if (
    slug === "lithium-batteries" ||
    slug.includes("batter") ||
    slug.includes("lithium") ||
    p.slug.includes("battery") ||
    p.slug.includes("lifepo4") ||
    p.slug.includes("ess")
  )
    return "battery";
  if (
    slug === "solar-panels" ||
    slug.includes("solar-panel") ||
    slug.includes("module") ||
    slug.includes("pv") ||
    p.slug.includes("module") ||
    p.slug.includes("panel") ||
    p.slug.includes("topcon") ||
    p.slug.includes("perc") ||
    p.slug.includes("hjt")
  )
    return "solar";
  return "other";
}

function StockBadge({ status, isBn }: { status: string; isBn: boolean }) {
  if (status === "IN_STOCK") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-[#074031]/10 text-[#074031] border border-[#074031]/20 whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-[#074031]" />
        {isBn ? "স্টকে আছে" : "In Stock"}
      </span>
    );
  }
  if (status === "INCOMING") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-amber-100 text-amber-900 border border-amber-300 whitespace-nowrap">
        <Clock className="w-3.5 h-3.5 text-amber-700" />
        {isBn ? "আসছে" : "Incoming"}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-[#F1F4F1] text-[#62706A] border border-[#DCE4E0] whitespace-nowrap">
      <CheckCircle2 className="w-3.5 h-3.5 text-[#62706A]" />
      {isBn ? "অনুরোধে প্রাপ্য" : "On Request"}
    </span>
  );
}

export function RecentDeals({
  products = [],
  stats = [],
  locale = "en",
  limit = 5,
  showViewAll = true,
}: RecentDealsProps) {
  const isBn = locale === "bn";
  const reduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<DealTab>("solar");

  const tabData = useMemo(() => {
    const groups: Record<DealTab, TabProduct[]> = {
      solar: [],
      inverter: [],
      battery: [],
      other: [],
    };
    for (const p of products) groups[classify(p)].push(p);
    return groups;
  }, [products]);

  const tabs = useMemo(() => {
    const all: Array<{ id: DealTab; label: string }> = [
      { id: "solar", label: isBn ? "সোলার প্যানেল" : "Solar Panels" },
      { id: "inverter", label: isBn ? "সোলার ইনভার্টার" : "Solar Inverters" },
      { id: "battery", label: isBn ? "সোলার ব্যাটারি" : "Solar Batteries" },
    ];
    if (tabData.other.length > 0) {
      all.push({ id: "other", label: isBn ? "অন্যান্য যন্ত্রাংশ" : "Other Components" });
    }
    return all;
  }, [isBn, tabData.other.length]);

  const visibleTab = tabs.some((t) => t.id === activeTab) ? activeTab : "solar";
  const rows = limit ? tabData[visibleTab].slice(0, limit) : tabData[visibleTab];
  const totalCount = products.length;

  const columns = [
    isBn ? "পণ্য" : "Product",
    isBn ? "ব্র্যান্ড" : "Brand",
    isBn ? "SKU / মডেল নং" : "SKU / Model No.",
    isBn ? "MOQ" : "MOQ",
    isBn ? "প্রাপ্যতা" : "Availability",
    isBn ? "দাম" : "Asking Price",
  ];

  return (
    <section className="relative w-full bg-white py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dark stats banner — CSS only, zero image bytes */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[24px] bg-[#0B1F17] px-6 py-10 sm:px-10 sm:py-12"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(#CEF23E_1px,transparent_1px)] [background-size:26px_26px] opacity-[0.07]"
            aria-hidden="true"
          />
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="font-mono text-[11px] sm:text-xs font-bold tracking-widest uppercase text-[#FEBE16] mb-3">
                {isBn ? "টেকসই ভবিষ্যতের জন্য শক্তি" : "Powering a sustainable future"}
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
                {isBn ? (
                  <>আপনার ব্যবসার জন্য লাইভ পাইকারি ডিল</>
                ) : (
                  <>Live wholesale deals for your business</>
                )}
              </h2>
              <p className="mt-3 text-sm sm:text-base text-white/70 leading-relaxed max-w-md">
                {isBn
                  ? "রেডি স্টক, কনটেইনার ইনডেন্ট ও প্রজেক্ট-গ্রেড সরবরাহ — সব এক জায়গায়।"
                  : "Ready stock, container indent and project-grade supply — all in one place."}
              </p>
            </div>
            {stats.length > 0 && (
              <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-6">
                {stats.slice(0, 6).map((s) => (
                  <div key={s.id} className="border-l border-white/15 pl-4">
                    <dd className="text-2xl sm:text-3xl font-black font-mono text-[#FEBE16]">
                      <AnimatedCounter
                        value={s.value}
                        prefix={s.prefix ?? ""}
                        suffix={s.suffix ?? ""}
                        decimals={Number.isInteger(s.value) ? 0 : 1}
                      />
                    </dd>
                    <dt className="mt-1 text-[11px] sm:text-xs text-white/60 leading-snug">
                      {isBn ? s.labelBn || s.label : s.label}
                    </dt>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </motion.div>

        {/* Deals header + tabs */}
        <div className="mt-12 sm:mt-14 flex flex-col md:flex-row md:items-end md:justify-between gap-5">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900">
              {limit
                ? isBn
                  ? `সাম্প্রতিক ${limit}টি ডিল`
                  : `Recent ${limit} Deals List`
                : isBn
                  ? "সব লাইভ ডিল"
                  : "All Live Deals"}
            </h2>
            <p className="mt-2 text-sm text-neutral-500">
              {isBn
                ? `${totalCount}টি সক্রিয় পণ্য থেকে সরাসরি`
                : `Pulled live from ${totalCount} active products`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label={isBn ? "ডিল বিভাগ" : "Deal categories"}>
            {tabs.map((t) => {
              const active = t.id === visibleTab;
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTab(t.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border transition-colors min-h-[40px] ${
                    active
                      ? "bg-[#E8590C] border-[#E8590C] text-white shadow-sm"
                      : "bg-white border-neutral-200 text-neutral-600 hover:border-[#074031]/40 hover:text-[#074031]"
                  }`}
                >
                  {t.label}
                  <span
                    className={`font-mono text-[11px] px-1.5 py-0.5 rounded-md ${
                      active ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {tabData[t.id].length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Table */}
        <motion.div
          key={visibleTab}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="mt-6 overflow-x-auto rounded-2xl border border-neutral-200"
        >
          <table className="w-full min-w-[900px] border-collapse bg-white text-sm">
            <thead>
              <tr className="bg-[#F7F8F5] text-left">
                {columns.map((c) => (
                  <th
                    key={c}
                    scope="col"
                    className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-neutral-500 border-b border-neutral-200 whitespace-nowrap"
                  >
                    {c}
                  </th>
                ))}
                <th scope="col" className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-neutral-500 border-b border-neutral-200 text-right">
                  {isBn ? "অ্যাকশন" : "Action"}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="border-b border-neutral-100 last:border-0 hover:bg-[#F7F8F5]/70 transition-colors">
                  <td className="px-4 py-3.5 font-semibold text-neutral-900 max-w-[260px]">
                    <Link href={`/product/${p.slug}`} className="hover:text-[#074031] hover:underline line-clamp-2">
                      {p.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 text-neutral-600 whitespace-nowrap">{p.brand || "—"}</td>
                  <td className="px-4 py-3.5 font-mono text-[13px] text-neutral-600 whitespace-nowrap">
                    {p.model || "—"}
                  </td>
                  <td className="px-4 py-3.5 text-neutral-600 whitespace-nowrap">{p.moq || "—"}</td>
                  <td className="px-4 py-3.5">
                    <StockBadge status={p.stockStatus} isBn={isBn} />
                  </td>
                  <td className="px-4 py-3.5 font-bold text-neutral-900 whitespace-nowrap">
                    {p.showPrice && p.priceBdt ? (
                      <>BDT {p.priceBdt.toLocaleString()}</>
                    ) : (
                      <span className="font-medium text-neutral-400">
                        {isBn ? "দাম জানতে চান" : "Ask for price"}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <Link
                      href={`/product/${p.slug}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#E8590C] text-[#E8590C] text-[13px] font-bold hover:bg-[#E8590C] hover:text-white transition-colors whitespace-nowrap min-h-[40px]"
                    >
                      {isBn ? "ডিল দেখুন" : "Shop Deal"}
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-neutral-400">
                    {isBn ? "এই বিভাগে এখনো কোনো ডিল নেই।" : "No deals in this category yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>

        {showViewAll && (
          <div className="mt-6 flex justify-center">
            <Link
              href="/deals"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#074031] text-white text-sm font-bold hover:bg-[#0B3D2E] transition-colors min-h-[48px]"
            >
              {isBn ? "সব ডিল দেখুন" : "View All Deals"}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
