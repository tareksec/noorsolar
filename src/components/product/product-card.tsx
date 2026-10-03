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

/* ─── Spec-row icon picker ─── */
function getSpecIcon(label: string) {
  const lower = label.toLowerCase();
  if (lower.includes("power") || lower.includes("pmax") || lower.includes("watt") || lower.includes("capacity"))
    return <Zap className="w-4 h-4 text-[#074031]" />;
  if (lower.includes("efficiency") || lower.includes("eff"))
    return <TrendingUp className="w-4 h-4 text-[#074031]" />;
  return <Zap className="w-4 h-4 text-[#62706A]" />;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const router = useRouter();
  const pathname = usePathname() || "";
  const isBn = pathname.startsWith("/bn/") || pathname === "/bn";

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
      x: -y * 12, // rotateX
      y: x * 12,  // rotateY
    });
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const primaryImage = product.images[0]?.url || "/demo/category-panels.svg";
  const primaryAlt =
    product.images[0]?.alt ||
    (isBn
      ? `${product.name} — সোলার সরঞ্জাম বাংলাদেশ`
      : `${product.name} — Solar Equipment Bangladesh`);
  const previewSpecs = product.specs.slice(0, 2);

  const getStockBadge = (status: string) => {
    switch (status) {
      case "IN_STOCK":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-[#E8F5E9] text-[#2E7D32] whitespace-nowrap shadow-sm">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#4CAF50] shadow-[0_0_4px_rgba(76,175,80,0.5)]"></span>
            {isBn ? "স্টকে আছে" : "In Stock"}
          </span>
        );
      case "INCOMING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-amber-50 text-amber-800 whitespace-nowrap shadow-sm">
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600" />
            {isBn ? "আসছে" : "Incoming"}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-[#F1F4F1] text-[#62706A] whitespace-nowrap shadow-sm">
            <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#62706A]" />
            {isBn ? "অনুরোধে" : "On Request"}
          </span>
        );
    }
  };

  const imageTransform = isPointerDevice && !checkReducedMotion()
    ? {
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.05 : 1})`,
        transition: isHovered ? "transform 0.1s ease-out" : "transform 0.35s ease-out",
      }
    : {};

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
      className="group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl bg-white border border-[#E2E8E4] shadow-[0_2px_16px_-4px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_16px_40px_-10px_rgba(7,64,49,0.1)] hover:border-[#074031]/25 hover:-translate-y-1 h-full cursor-pointer overflow-hidden"
    >
      {/* ── Image Container ── */}
      <div
        ref={imageContainerRef}
        onPointerMove={handlePointerMove}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest("button") || target.closest("a[href*='/quote']")) return;
          e.stopPropagation();
          router.push(`/product/${product.slug}`);
        }}
        className="relative w-full aspect-[4/3] bg-gradient-to-br from-[#F4F7F5] via-white to-[#EFF3F0] flex items-center justify-center cursor-pointer group/img overflow-hidden"
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
          <div style={imageTransform} className="relative w-full h-full will-change-transform pointer-events-none p-4 sm:p-6">
            <Image
              src={primaryImage}
              alt={primaryAlt}
              fill
              priority={priority}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-contain transition-transform duration-300 group-hover/img:scale-105 pointer-events-auto cursor-pointer"
            />
          </div>
        </Link>

        {/* Stock Status Badge – top left */}
        <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 z-10 pointer-events-none">
          {getStockBadge(product.stockStatus)}
        </div>

        {/* Category Tag – top right */}
        {product.category && (
          <div className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 z-10 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-[#17251F] border border-[#DCE4E0] pointer-events-none shadow-sm">
            {product.category.name}
          </div>
        )}

        {/* Sliding "Request Quote" Affordance on Pointer Devices */}
        {isPointerDevice && !checkReducedMotion() && (
          <div
            className={`absolute bottom-3 inset-x-3 z-20 transition-all duration-200 ${
              isHovered ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-3 pointer-events-none"
            }`}
          >
            <Link
              href={`/quote?product=${product.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="w-full py-2.5 px-4 rounded-full bg-[#FEBE16] hover:bg-[#E4A900] text-[#052F25] font-semibold text-xs tracking-tight flex items-center justify-center gap-2 shadow-lg transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{isBn ? "কোটেশন নিন" : "Request Quote"}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#052F25]" />
            </Link>
          </div>
        )}
      </div>

      {/* ── Product Information ── */}
      <div className="flex flex-col flex-grow px-3 sm:px-5 pt-3 sm:pt-4 pb-0">
        {/* Model Number */}
        {product.model && (
          <span className="text-[10px] sm:text-[11px] font-mono text-[#8A9B93] mb-0.5 sm:mb-1 truncate tracking-wide">
            {product.model}
          </span>
        )}

        {/* Product Name */}
        <h2 className="text-[13px] sm:text-base lg:text-lg font-bold leading-snug mb-2 sm:mb-3">
          <Link
            href={`/product/${product.slug}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push(`/product/${product.slug}`);
            }}
            className="text-[#17251F] group-hover:text-[#074031] line-clamp-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FEBE16] rounded-xs cursor-pointer"
          >
            {product.name}
          </Link>
        </h2>

        {/* ── Technical Spec Rows with Icons ── */}
        {previewSpecs.length > 0 && (
          <div className="flex flex-col gap-1.5 sm:gap-2.5 mb-2 sm:mb-3">
            {previewSpecs.map((spec, i) => (
              <div key={i} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-[#62706A] min-w-0">
                  <span className="shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg bg-[#F1F6F3] flex items-center justify-center">
                    {getSpecIcon(spec.label)}
                  </span>
                  <span className="truncate leading-tight">{spec.label}</span>
                </div>
                <span className="font-mono font-semibold text-[11px] sm:text-xs text-[#17251F] shrink-0 text-right">
                  {spec.value}
                </span>
              </div>
            ))}

            {/* MOQ Row */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-[#62706A] min-w-0">
                <span className="shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg bg-[#F1F6F3] flex items-center justify-center">
                  <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#62706A]" />
                </span>
                <span className="truncate leading-tight">MOQ</span>
              </div>
              <span className="font-mono font-semibold text-[11px] sm:text-xs text-[#17251F] shrink-0 text-right truncate max-w-[120px] sm:max-w-[180px]">
                {product.moq || (isBn ? "১ প্যালেট" : "1 Pallet")}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Card Action Footer ── */}
      <div className="px-3 sm:px-5 py-3 sm:py-4 border-t border-[#E8EDE9] flex items-center justify-between gap-3 mt-auto bg-[#FAFCFB]">
        <div className="flex-1 min-w-0">
          {product.showPrice && product.priceBdt ? (
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase text-[#8A9B93] leading-tight">
                {isBn ? "পাইকারি মূল্য" : "Wholesale"}
              </span>
              <span className="text-xs sm:text-sm font-mono font-bold text-[#17251F]">
                BDT {product.priceBdt.toLocaleString()}
              </span>
              <span className="hidden sm:block text-[10px] sm:text-[11px] font-mono text-[#8A9B93] mt-0.5">
                {isBn ? "কন্টেইনার অর্ডারে বিশেষ দর" : "Container pricing on request"}
              </span>
            </div>
          ) : (
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-semibold text-[#17251F] leading-tight">
                {isBn ? "কোটেশনে দর" : "Quote Pricing"}
              </span>
              <span className="hidden sm:block text-[10px] sm:text-[11px] text-[#8A9B93] mt-0.5">
                {isBn ? "কন্টেইনার অর্ডারে বিশেষ দর" : "Container pricing on request"}
              </span>
            </div>
          )}
        </div>

        <div className="shrink-0">
          <Link
            href={`/quote?product=${product.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="px-3.5 sm:px-5 py-2 sm:py-2.5 min-h-[38px] sm:min-h-[44px] inline-flex items-center justify-center gap-1.5 rounded-full bg-[#074031] text-white text-[11px] sm:text-xs font-semibold tracking-tight transition-all duration-200 hover:bg-[#0A5A44] active:scale-95 text-center shadow-sm hover:shadow-md"
          >
            <MessageSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>{isBn ? "কোটেশন" : "Quote"}</span>
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
