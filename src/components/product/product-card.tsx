"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Clock } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    name: string;
    brand?: string | null;
    model?: string | null;
    stockStatus: string;
    priceBdt?: number | null;
    showPrice: boolean;
    images: Array<{ url: string; alt: string }>;
    specs: Array<{ label: string; value: string }>;
    category?: { name: string; slug: string } | null;
  };
}

export function ProductCard({ product }: ProductCardProps) {

  const primaryImage = product.images[0]?.url || "/demo/category-panels.svg";
  const primaryAlt = product.images[0]?.alt || product.name;

  // Key specs preview (first 2-3 specs)
  const previewSpecs = product.specs.slice(0, 2);

  const getStockBadge = (status: string) => {
    switch (status) {
      case "IN_STOCK":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-[#CEF23E]/25 text-[#111311] border border-[#CEF23E]/50">
            <span className="w-1.5 h-1.5 rounded-full bg-[#111311]"></span>
            In Stock
          </span>
        );
      case "INCOMING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-amber-100 text-amber-900 border border-amber-300">
            <Clock className="w-3 h-3 text-amber-700" />
            Incoming Shipment
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-[#EDEDED] text-[#5C605C] border border-[#DDE1DC]">
            <CheckCircle2 className="w-3 h-3 text-[#5C605C]" />
            On Request / Indent
          </span>
        );
    }
  };

  return (
    <div
      className="group relative flex flex-col justify-between p-5 rounded-[28px] bg-white border border-[#DDE1DC] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_16px_36px_-10px_rgba(0,0,0,0.08)] hover:border-[#111311]/20 hover:-translate-y-1"
    >
      {/* Top Image Container */}
      <div className="relative w-full aspect-[16/11] rounded-2xl overflow-hidden bg-[#EDEDED] flex items-center justify-center p-3 border border-[#E4E7E4]">
        <Image
          src={primaryImage}
          alt={primaryAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Stock Status Badge */}
        <div className="absolute top-3 left-3 z-10">{getStockBadge(product.stockStatus)}</div>

        {/* Category Tag */}
        {product.category && (
          <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-white/85 backdrop-blur-md text-[10px] font-mono uppercase tracking-wider text-[#111311] border border-white">
            {product.category.name}
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="flex flex-col flex-grow pt-4 pb-2">
        {product.model && (
          <span className="text-[11px] font-mono text-[#5C605C] mb-1">
            {product.model}
          </span>
        )}
        <Link
          href={`/product/${product.slug}`}
          className="font-bold text-base text-[#111311] leading-snug group-hover:text-black line-clamp-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CEF23E] rounded-sm"
        >
          {product.name}
        </Link>

        {/* Technical Specs Rows */}
        {previewSpecs.length > 0 && (
          <div className="mt-3 pt-3 border-t border-[#EDEDED] flex flex-col gap-1.5">
            {previewSpecs.map((spec, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-[#5C605C] truncate pr-2">{spec.label}</span>
                <span className="font-mono font-medium text-[#111311] shrink-0">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Card Action Footer */}
      <div className="pt-3 border-t border-[#EDEDED] flex items-center justify-between gap-2 mt-auto">
        <div>
          {product.showPrice && product.priceBdt ? (
            <div className="flex flex-col">
              <span className="text-[10px] font-mono uppercase text-[#5C605C]">Wholesale</span>
              <span className="text-sm font-mono font-bold text-[#111311]">
                ৳ {product.priceBdt.toLocaleString()}
              </span>
            </div>
          ) : (
            <span className="text-xs font-mono font-medium text-[#5C605C]">
              Bulk Pricing on Quote
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <Link
            href={`/product/${product.slug}`}
            className="p-2 rounded-full text-[#5C605C] hover:text-[#111311] hover:bg-[#EDEDED] transition-colors"
            title="View Technical Details"
            aria-label={`View details for ${product.name}`}
          >
            <ArrowUpRight className="w-4 h-4" />
          </Link>

          <Link
            href={`/#quote-section?product=${product.slug}`}
            className="px-3.5 py-1.5 rounded-full bg-[#111311] text-white text-xs font-medium tracking-tight transition-all duration-200 hover:bg-[#CEF23E] hover:text-[#111311] active:scale-95"
          >
            Request Quote
          </Link>
        </div>
      </div>
    </div>
  );
}
