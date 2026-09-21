"use client";

import React, { useState, useRef } from "react";
import { AppImage as Image } from "@/components/ui/app-image";
import { Link, useRouter } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ArrowRight, MessageSquare, Clock, CheckCircle2 } from "lucide-react";
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
  const primaryAlt = product.images[0]?.alt || product.name;
  const previewSpecs = product.specs.slice(0, 2);

  const getStockBadge = (status: string) => {
    switch (status) {
      case "IN_STOCK":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-[#CEF23E]/25 text-[#111311] border border-[#CEF23E]/50">
            <span className="w-1.5 h-1.5 rounded-full bg-[#111311]"></span>
            {isBn ? "স্টকে আছে" : "In Stock"}
          </span>
        );
      case "INCOMING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-amber-100 text-amber-900 border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            {isBn ? "আসছে" : "Incoming"}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-[#EDEDED] text-[#5C605C] border border-[#DDE1DC]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#5C605C]" />
            {isBn ? "অনুরোধে প্রাপ্য" : "On Request"}
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
        if (target.closest("button") || target.closest("a[href*='/contact']")) return;
        router.push(`/product/${product.slug}`);
      }}
      className="group relative flex flex-col justify-between p-5 rounded-[28px] bg-white border border-[#DDE1DC] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_16px_36px_-10px_rgba(0,0,0,0.08)] hover:border-[#111311]/25 hover:-translate-y-1 h-full cursor-pointer"
    >
      {/* Top Image Container with 3D Tilt on Pointer Devices */}
      <div
        ref={imageContainerRef}
        onPointerMove={handlePointerMove}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest("button") || target.closest("a[href*='/contact']")) return;
          e.stopPropagation();
          router.push(`/product/${product.slug}`);
        }}
        className="relative w-full aspect-[16/11] rounded-2xl overflow-hidden bg-[#EDEDED] flex items-center justify-center p-3 border border-[#E4E7E4] cursor-pointer group/img"
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
          <div style={imageTransform} className="relative w-full h-full will-change-transform pointer-events-none">
            <Image
              src={primaryImage}
              alt={primaryAlt}
              fill
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover/img:scale-105 pointer-events-auto cursor-pointer"
            />
          </div>
        </Link>

        {/* Stock Status Badge */}
        <div className="absolute top-3 left-3 z-10 pointer-events-none">
          {getStockBadge(product.stockStatus)}
        </div>

        {/* Category Tag */}
        {product.category && (
          <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-mono uppercase tracking-wider text-[#111311] border border-white pointer-events-none">
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
              href={`/contact?product=${product.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="w-full py-2.5 px-4 rounded-full bg-[#111311] hover:bg-black text-[#CEF23E] font-semibold text-xs tracking-tight flex items-center justify-center gap-2 shadow-lg transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{isBn ? "কোটেশন চান" : "Request Quote"}</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </Link>
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
        <h2 className="text-base font-bold leading-snug">
          <Link
            href={`/product/${product.slug}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push(`/product/${product.slug}`);
            }}
            className="text-[#111311] group-hover:text-black line-clamp-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CEF23E] rounded-xs cursor-pointer min-h-[44px] flex items-center"
          >
            {product.name}
          </Link>
        </h2>

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

        {/* Wholesale / MOQ Visibility */}
        <div className="mt-2.5 pt-2.5 border-t border-[#EDEDED] flex items-center justify-between text-[11px] font-mono">
          <span className="text-[#5C605C]">
            {product.moq ? (isBn ? "ন্যূনতম অর্ডার:" : "MOQ:") : (isBn ? "পাইকারি সরবরাহ:" : "Wholesale:")}
          </span>
          <span className="font-semibold text-[#111311] truncate max-w-[170px]">
            {product.moq || (isBn ? "১ প্যালেট থেকে" : "From 1 Pallet")}
          </span>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="pt-3 border-t border-[#EDEDED] flex items-center justify-between gap-2 mt-auto">
        <div>
          {product.showPrice && product.priceBdt ? (
            <div className="flex flex-col">
              <span className="text-[10px] font-mono uppercase text-[#5C605C]">
                {isBn ? "পাইকারি মূল্য" : "Wholesale"}
              </span>
              <span className="text-sm font-mono font-bold text-[#111311]">
                BDT {product.priceBdt.toLocaleString()}
              </span>
              <span className="text-[9px] font-mono text-[#5C605C]">
                {isBn ? "অনুরোধে কনটেইনার মূল্য" : "Container pricing on request"}
              </span>
            </div>
          ) : (
            <div className="flex flex-col">
              <span className="text-xs font-mono font-medium text-[#5C605C]">
                {isBn ? "কোটেশনে পাইকারি মূল্য" : "Bulk Pricing on Quote"}
              </span>
              <span className="text-[9px] font-mono text-[#5C605C]">
                {isBn ? "অনুরোধে কনটেইনার মূল্য" : "Container pricing on request"}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <Link
            href={`/product/${product.slug}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push(`/product/${product.slug}`);
            }}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full text-[#5C605C] hover:text-[#111311] hover:bg-[#EDEDED] transition-colors flex items-center justify-center cursor-pointer"
            title={isBn ? "প্রযুক্তিগত বিবরণ দেখুন" : "View Technical Details"}
            aria-label={isBn ? `${product.name}-এর বিবরণ দেখুন` : `View details for ${product.name}`}
          >
            <span className="btn-arrow-swap">
              <ArrowUpRight className="w-4 h-4 arrow-primary" />
              <ArrowUpRight className="w-4 h-4 arrow-secondary" />
            </span>
          </Link>

          <Link
            href={`/contact?product=${product.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="px-3.5 py-1.5 min-h-[44px] inline-flex items-center justify-center rounded-full bg-[#111311] text-white text-xs font-medium tracking-tight transition-all duration-200 hover:bg-[#CEF23E] hover:text-[#111311] active:scale-95"
          >
            {isBn ? "কোটেশন চান" : "Request Quote"}
          </Link>
        </div>
      </div>
    </div>
  );
}
