"use client";

import React from "react";
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

export function CategoryDock({ categories }: CategoryDockProps) {
  const dockMeta: Record<string, { subtitle: string; spec: string }> = {
    "solar-panels": {
      subtitle: "N-Type TOPCon & Bifacial",
      spec: "Up to 700W Modules",
    },
    "lithium-batteries": {
      subtitle: "LiFePO4 Storage & ESS",
      spec: "6000+ Deep Cycles",
    },
    "solar-inverters": {
      subtitle: "Hybrid & Grid-Tie",
      spec: "Dual/Multi MPPT Tech",
    },
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#CEF23E]"></span>
          <h2 className="text-xs font-mono uppercase tracking-wider text-[#5C605C]">
            Direct Import Categories
          </h2>
        </div>
        <Link
          href="/products"
          className="text-xs font-mono text-[#111311] hover:underline flex items-center gap-1 group"
        >
          <span>View All Equipment</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.slice(0, 3).map((cat) => {
          const meta = dockMeta[cat.slug] || {
            subtitle: "Commercial Wholesale",
            spec: `${cat._count?.products || 4} Available Models`,
          };

          return (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group flex items-center justify-between p-3.5 sm:p-4 rounded-full glass-dock bg-white/80 hover:bg-white border border-white hover:border-[#CEF23E]/60 shadow-[0_8px_24px_-6px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_30px_-6px_rgba(206,242,62,0.2)] transition-all duration-300 active:scale-[0.98]"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Circular Photo Thumbnail */}
                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-[#EDEDED] border border-[#DDE1DC] group-hover:border-[#111311] transition-colors">
                  <Image
                    src={cat.image || "/demo/category-panels.svg"}
                    alt={cat.name}
                    fill
                    sizes="48px"
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                <div className="flex flex-col truncate">
                  <span className="font-bold text-sm text-[#111311] tracking-tight truncate group-hover:text-black">
                    {cat.name}
                  </span>
                  <span className="text-[11px] font-mono text-[#5C605C] truncate">
                    {meta.subtitle} &bull; <span className="text-[#111311] font-medium">{meta.spec}</span>
                  </span>
                </div>
              </div>

              {/* Black Pill Button */}
              <div className="shrink-0 ml-3">
                <span className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#111311] group-hover:bg-[#CEF23E] text-white group-hover:text-[#111311] text-xs font-semibold tracking-tight transition-all duration-200">
                  Explore
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
