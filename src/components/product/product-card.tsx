"use client";

import React, { useState, useRef } from "react";
import { AppImage as Image } from "@/components/ui/app-image";
import { Link, useRouter } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  MessageSquare,
  Clock,
  CheckCircle2,
  Zap,
  TrendingUp,
  Package,
} from "lucide-react";
import { isPointerFine, prefersReducedMotion as checkReducedMotion } from "@/lib/motion";

interface ProductCardProps {
  product: {
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
  };
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const router = useRouter();
  const pathname = usePathname() || "";
  const isBn = !pathname.startsWith("/en/") && pathname !== "/en";

  const [isPointerDevice, setIsPointerDevice] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" || isPointerFine()) {
      setIsPointerDevice(true);
      setIsHovered(true);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerFine() || checkReducedMotion() || !imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      x: -y * 10,
      y: x * 10,
    });
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const getProductImage = () => {
    const slug = (product.slug || product.model || "").toLowerCase();
    if (slug.includes("620")) return "/solar-images/panel-620w.jpg";
    if (slug.includes("585")) return "/solar-images/panel-585w.jpg";
    if (slug.includes("550")) return "/solar-images/panel-550w.jpg";
    if (slug.includes("450")) return "/solar-images/panel-450w.jpg";

    const rawUrl = product.images[0]?.url;
    if (rawUrl && !rawUrl.endsWith(".svg")) return rawUrl;
    return "/solar-images/panel-585w.jpg";
  };

  const primaryImage = getProductImage();
  const primaryAlt = product.images[0]?.alt || product.name;
  const previewSpecs = product.specs.slice(0, 2);

  const getStockBadge = (status: string) => {
    switch (status) {
      case "IN_STOCK":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold text-slate-800 bg-white/95 backdrop-blur-md shadow-xs border border-white/70 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
            {isBn ? "স্টকে আছে" : "In Stock"}
          </span>
        );
      case "INCOMING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold text-[#8A5B00] bg-[#FEF9E7]/95 backdrop-blur-md shadow-xs border border-[#FDE68A]/60 whitespace-nowrap">
            <Clock className="w-3 h-3 text-[#B47800] shrink-0" />
            {isBn ? "আসছে" : "Incoming"}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold text-slate-700 bg-white/95 backdrop-blur-md shadow-xs border border-white/70 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></span>
            {isBn ? "অনুরোধে" : "On Request"}
          </span>
        );
    }
  };

  const imageTransform =
    isPointerDevice && !checkReducedMotion()
      ? {
          transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${
            isHovered ? 1.04 : 1
          })`,
          transition: isHovered ? "transform 0.1s ease-out" : "transform 0.35s ease-out",
        }
      : {};

  const categoryName = product.category?.name || "SOLAR PANELS";

  return (
    <div
      data-motion="product-card"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest("button") || target.closest("a[href*='/quote']")) return;
        router.push(`/product/${product.slug}`);
      }}
      className="group relative flex flex-col justify-between p-3.5 sm:p-4 rounded-[22px] sm:rounded-[24px] bg-white border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_14px_32px_-4px_rgba(6,51,40,0.08)] hover:-translate-y-1 h-full cursor-pointer"
    >
      {/* Top Image Container */}
      <div
        ref={imageContainerRef}
        onPointerMove={handlePointerMove}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest("button") || target.closest("a[href*='/quote']")) return;
          e.stopPropagation();
          router.push(`/product/${product.slug}`);
        }}
        className="relative w-full aspect-[16/11] rounded-[18px] overflow-hidden bg-slate-50 flex items-center justify-center border border-slate-100/80 cursor-pointer group/img"
      >
        <Link
          href={`/product/${product.slug}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            router.push(`/product/${product.slug}`);
          }}
          className="absolute inset-0 z-0 block cursor-pointer"
          aria-label={product.name}
        >
          <div
            style={imageTransform}
            className="relative w-full h-full will-change-transform pointer-events-none"
          >
            <Image
              src={primaryImage}
              alt={primaryAlt}
              fill
              priority={priority}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover/img:scale-105 pointer-events-auto cursor-pointer"
            />
          </div>
        </Link>

        {/* Stock Status Badge (Top-Left Pill) */}
        <div className="absolute top-3 left-3 z-10 pointer-events-none">
          {getStockBadge(product.stockStatus)}
        </div>

        {/* Category Tag (Top-Right Pill) */}
        <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-600 shadow-xs border border-white/70 pointer-events-none">
          {categoryName}
        </div>
      </div>

      {/* Product Information */}
      <div className="flex flex-col flex-grow pt-3.5 pb-1">
        {/* Model Code */}
        <span className="text-[11px] font-mono font-medium tracking-wider text-slate-400 uppercase mb-1 block">
          {product.model || product.brand || "NS-SERIES"}
        </span>

        {/* Title */}
        <h2 className="text-[15px] sm:text-[17px] font-bold leading-snug tracking-tight text-slate-900 group-hover:text-[#063328] transition-colors line-clamp-2 min-h-[42px] sm:min-h-[46px] flex items-start">
          <Link
            href={`/product/${product.slug}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push(`/product/${product.slug}`);
            }}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#063328] rounded-xs cursor-pointer"
          >
            {product.name}
          </Link>
        </h2>

        {/* Technical Specs & MOQ Rows */}
        <div className="mt-3.5 mb-2 flex flex-col gap-2">
          {previewSpecs.map((spec, i) => {
            const isPower = /power|pmax|watt|w\b/i.test(spec.label) || i === 0;
            const isEfficiency =
              /efficiency|eff|%/i.test(spec.label) ||
              (!isPower && i === 1);
            const SpecIcon = isPower
              ? Zap
              : isEfficiency
              ? TrendingUp
              : CheckCircle2;

            return (
              <div
                key={i}
                className="flex items-center justify-between text-xs sm:text-[13px] gap-2"
              >
                <div className="flex items-center gap-1.5 text-slate-500 min-w-0 pr-1">
                  <SpecIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[2.2]" />
                  <span className="leading-tight font-normal whitespace-nowrap">
                    {spec.label}
                  </span>
                </div>
                <span className="font-bold text-slate-900 shrink-0 text-right font-mono sm:font-sans">
                  {spec.value}
                </span>
              </div>
            );
          })}

          {/* MOQ Row */}
          <div className="flex items-center justify-between text-xs sm:text-[13px] gap-2 pt-0.5">
            <div className="flex items-center gap-1.5 text-slate-500 min-w-0 pr-1">
              <Package className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[2.2]" />
              <span className="leading-tight font-normal">
                {isBn ? "ন্যূনতম অর্ডার" : "MOQ"}
              </span>
            </div>
            <span className="font-bold text-slate-900 shrink-0 text-right font-mono sm:font-sans truncate max-w-[150px] sm:max-w-[190px]">
              {product.moq || (isBn ? "৩৬ পিস (১ প্যালেট)" : "36 pcs (1 Pallet)")}
            </span>
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
        <div className="flex-1 min-w-0">
          {product.showPrice && product.priceBdt ? (
            <div className="flex flex-col">
              <span className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight">
                BDT {product.priceBdt.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-400 leading-tight mt-0.5 truncate block">
                {isBn ? "কন্টেইনার অর্ডারে বিশেষ দর" : "Container pricing on request"}
              </span>
            </div>
          ) : (
            <div className="flex flex-col">
              <span className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight">
                {isBn ? "কোটেশন মূল্য" : "Quote Pricing"}
              </span>
              <span className="text-[11px] text-slate-400 leading-tight mt-0.5 truncate block">
                {isBn ? "কন্টেইনার অর্ডারে বিশেষ দর" : "Container pricing on request"}
              </span>
            </div>
          )}
        </div>

        <div className="shrink-0">
          <Link
            href={`/quote?product=${product.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#063328] hover:bg-[#04241C] text-white text-xs font-medium inline-flex items-center gap-1.5 transition-all duration-200 active:scale-95 shadow-xs"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{isBn ? "কোটেশন" : "Quote"}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
