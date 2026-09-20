"use client";

import React, { useState } from "react";
import { AppImage as Image } from "@/components/ui/app-image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CategoryDockProps {
  categories: Array<{
    id: string;
    slug: string;
    name: string;
    description?: string | null;
    image?: string | null;
    _count?: { products: number };
  }>;
}

const CATEGORY_META: Record<string, { subtitle: string; spec: string; desc: string }> = {
  "solar-panels": {
    subtitle: "Tier-1 Photovoltaic Modules",
    spec: "N-Type TOPCon · Bifacial",
    desc: "Industrial monocrystalline modules engineered for high irradiance and 30-year operational yield.",
  },
  "lithium-batteries": {
    subtitle: "Energy Storage Systems",
    spec: "LiFePO4 · 6000+ Cycles",
    desc: "48V / 51.2V server rack and high-voltage prismatic storage banks for zero-downtime microgrids.",
  },
  "solar-inverters": {
    subtitle: "Power Conversion Units",
    spec: "Hybrid · IP65 Grid-Tie",
    desc: "Three-phase commercial string and hybrid power inverters with sub-10ms UPS transfer.",
  },
};

export function CategoryDock({ categories }: CategoryDockProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (!categories || categories.length === 0) return null;

  const displayCategories = categories.slice(0, 3);

  return (
    <section className="relative z-20 -mt-6 sm:-mt-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div
        className="flex flex-col md:flex-row gap-4 sm:gap-6 w-full items-stretch"
        role="region"
        aria-label="Category showcase"
      >
        {displayCategories.map((cat, idx) => {
          const meta = CATEGORY_META[cat.slug] || {
            subtitle: "Equipment Category",
            spec: "B2B Grade Specs",
            desc: cat.description || "Containerized consignments delivered nationwide.",
          };
          const isExpanded = activeIdx === idx;

          return (
            <div
              key={cat.id}
              data-motion="category-panel"
              onMouseEnter={() => setActiveIdx(idx)}
              onFocus={() => setActiveIdx(idx)}
              onClick={() => setActiveIdx(idx)}
              tabIndex={0}
              role="button"
              aria-expanded={isExpanded}
              aria-label={`${cat.name} panel`}
              className={`relative bg-[#EDEDED] border rounded-[28px] p-5 sm:p-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between overflow-hidden cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#CEF23E] ${
                isExpanded
                  ? "md:flex-[2.2] bg-white border-[#CEF23E]/90 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.08)]"
                  : "md:flex-[1] border-[#DDE1DC] hover:border-[#CEF23E]/50"
              }`}
            >
              <Link href={`/category/${cat.slug}`} className="absolute inset-0 z-10">
                <span className="sr-only">View {cat.name} products</span>
              </Link>

              {/* Header Info */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <span className="text-[11px] font-mono tracking-wider text-[#5C605C] uppercase font-semibold block">
                    {meta.subtitle}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111311] mt-0.5">
                    {cat.name}
                  </h2>
                </div>

                <div
                  className={`w-9 h-9 rounded-full border flex items-center justify-center text-[#111311] transition-colors duration-300 shrink-0 ${
                    isExpanded
                      ? "bg-[#CEF23E] border-[#CEF23E]"
                      : "bg-white border-[#DDE1DC]"
                  }`}
                >
                  <ArrowRight
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isExpanded ? "rotate-0" : "-rotate-45"
                    }`}
                  />
                </div>
              </div>

              {/* Expandable Image & Description */}
              <div className="relative w-full h-36 sm:h-44 rounded-2xl bg-[#F5F7F5] border border-[#E4E7E4] overflow-hidden flex items-center justify-center my-3 transition-all duration-500">
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className={`object-contain p-3 transition-transform duration-700 ease-out ${
                      isExpanded ? "scale-105" : "scale-95 opacity-80"
                    }`}
                    sizes="(max-width: 768px) 100vw, 420px"
                  />
                ) : (
                  <div className="text-xs font-mono text-[#5C605C]">NO PREVIEW</div>
                )}
              </div>

              {/* Expandable description visible on active panel */}
              <div
                className={`overflow-hidden transition-all duration-500 ${
                  isExpanded ? "max-h-24 opacity-100 mb-3" : "max-h-0 md:max-h-0 opacity-0 mb-0"
                }`}
              >
                <p className="text-xs sm:text-sm text-[#5C605C] leading-relaxed">
                  {meta.desc}
                </p>
              </div>

              {/* Bottom Specs and Count */}
              <div className="flex items-center justify-between pt-3 border-t border-[#DDE1DC]/60 text-xs font-mono text-[#5C605C]">
                <span>{meta.spec}</span>
                <span className="font-semibold text-[#111311]">
                  {cat._count?.products ?? 0} Models
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}