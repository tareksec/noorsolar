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

interface DockCardProps {
  cat: {
    id: string;
    slug: string;
    name: string;
    image?: string | null;
    _count?: { products: number };
  };
  meta: {
    subtitle: string;
    spec: string;
  };
}

function DockCard({ cat, meta }: DockCardProps) {
  return (
    <div
      className="group relative bg-[#EDEDED] border border-[#DDE1DC] rounded-[28px] p-5 sm:p-6 transition-all duration-300 ease-out hover:scale-[1.025] hover:border-[#CEF23E]/80 hover:shadow-[0_16px_36px_-8px_rgba(206,242,62,0.3)] flex flex-col justify-between overflow-hidden cursor-pointer"
    >
      <Link href={`/category/${cat.slug}`} className="absolute inset-0 z-10">
        <span className="sr-only">View {cat.name} products</span>
      </Link>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex flex-col">
          <span className="text-[11px] font-mono tracking-wider text-[#5C605C] uppercase font-semibold">
            {meta.subtitle}
          </span>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111311] group-hover:text-black transition-colors mt-0.5">
            {cat.name}
          </h3>
        </div>

        <div className="w-9 h-9 rounded-full bg-white border border-[#DDE1DC] flex items-center justify-center text-[#111311] group-hover:bg-[#CEF23E] group-hover:border-[#CEF23E] transition-all duration-300 shrink-0 shadow-xs">
          <ArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
        </div>
      </div>

      <div className="relative w-full h-32 sm:h-36 rounded-2xl bg-white/70 border border-[#E4E7E4] overflow-hidden flex items-center justify-center mb-4 group-hover:bg-white transition-colors">
        {cat.image ? (
          <Image
            src={cat.image}
            alt={cat.name}
            fill
            className="object-contain p-3 group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 380px"
          />
        ) : (
          <div className="w-full h-full bg-[#DDE1DC]/30 flex items-center justify-center text-xs font-mono text-[#5C605C]">
            NO PREVIEW
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-[#DDE1DC]/60 text-xs font-mono text-[#5C605C]">
        <span>{meta.spec}</span>
        <span className="font-semibold text-[#111311] group-hover:text-black">
          {cat._count?.products ?? 0} Models Available
        </span>
      </div>
    </div>
  );
}

const CATEGORY_META: Record<string, { subtitle: string; spec: string }> = {
  "solar-panels": {
    subtitle: "Tier-1 Photovoltaic Modules",
    spec: "N-Type TOPCon · Bifacial",
  },
  "lithium-batteries": {
    subtitle: "Energy Storage Systems",
    spec: "LiFePO4 · 6000+ Cycles",
  },
  "solar-inverters": {
    subtitle: "Power Conversion Units",
    spec: "Hybrid · IP65 Grid-Tie",
  },
};

export function CategoryDock({ categories }: CategoryDockProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="relative z-20 -mt-6 sm:-mt-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {categories.slice(0, 3).map((cat) => {
          const meta = CATEGORY_META[cat.slug] || {
            subtitle: "Equipment Category",
            spec: "B2B Grade Specs",
          };
          return <DockCard key={cat.id} cat={cat} meta={meta} />;
        })}
      </div>
    </section>
  );
}