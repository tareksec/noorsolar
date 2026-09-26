"use client";

import React, { useState, useRef } from "react";
import { AppImage as Image } from "@/components/ui/app-image";
import { Link, useRouter } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import { ArrowRight, MessageSquare, Clock, CheckCircle2 } from "lucide-react";
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
          <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-medium bg-[#074031]/10 text-[#074031] border border-[#074031]/20 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-[#074031]"></span>
            {isBn ? "স্টকে আছে" : "In Stock"}
          </span>
        );
      case "INCOMING":
        return (
          <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-medium bg-amber-100 text-amber-900 border border-amber-300 whitespace-nowrap">
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-700" />
            {isBn ? "আসছে" : "Incoming"}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-medium bg-[#F1F4F1] text-[#62706A] border border-[#DCE4E0] whitespace-nowrap">
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
      className="group relative flex flex-col justify-between p-3 sm:p-5 rounded-2xl sm:rounded-[28px] bg-white border border-[#DCE4E0] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_16px_36px_-10px_rgba(7,64,49,0.08)] hover:border-[#074031]/30 hover:-translate-y-1 h-full cursor-pointer"
    >
      {/* Top Image Container with 3D Tilt on Pointer Devices */}
      <div
        ref={imageContainerRef}
        onPointerMove={handlePointerMove}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest("button") || target.closest("a[href*='/quote']")) return;
          e.stopPropagation();
          router.push(`/product/${product.slug}`);
        }}
        className="relative w-full aspect-[16/11] rounded-xl sm:rounded-2xl overflow-hidden bg-[#F1F4F1] flex items-center justify-center p-2 sm:p-3 border border-[#DCE4E0] cursor-pointer group/img"
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
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover/img:scale-105 pointer-events-auto cursor-pointer"
            />
          </div>
        </Link>

        {/* Stock Status Badge */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 pointer-events-none">
          {getStockBadge(product.stockStatus)}
        </div>

        {/* Category Tag */}
        {product.category && (
          <div className="hidden sm:block absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-mono uppercase tracking-wider text-[#17251F] border border-[#DCE4E0] pointer-events-none">
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

      {/* Product Information */}
      <div className="flex flex-col flex-grow pt-2.5 sm:pt-4 pb-1 sm:pb-2">
        {product.model && (
          <span className="text-[10px] sm:text-[11px] font-mono text-[#62706A] mb-0.5 sm:mb-1 truncate">
            {product.model}
          </span>
        )}
        <h2 className="text-xs sm:text-base font-bold leading-snug">
          <Link
            href={`/product/${product.slug}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push(`/product/${product.slug}`);
            }}
            className="text-[#17251F] group-hover:text-[#074031] line-clamp-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FEBE16] rounded-xs cursor-pointer min-h-[32px] sm:min-h-[44px] flex items-center"
          >
            {product.name}
          </Link>
        </h2>

        {/* Technical Specs Rows */}
        {previewSpecs.length > 0 && (
          <div className="mt-2 pt-2 sm:mt-3 sm:pt-3 border-t border-[#DCE4E0] flex flex-col gap-1 sm:gap-1.5">
            {previewSpecs.map((spec, i) => (
              <div key={i} className="flex items-center justify-between text-xs gap-2">
                <span className="text-[#62706A] pr-1 sm:pr-2 line-clamp-1 leading-tight flex-1">{spec.label}</span>
                <span className="font-mono font-medium text-[#17251F] shrink-0 text-right">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Wholesale / MOQ Visibility */}
        <div className="mt-1.5 pt-1.5 sm:mt-2.5 sm:pt-2.5 border-t border-[#DCE4E0] flex items-center justify-between text-xs font-mono">
          <span className="text-[#62706A]">
            MOQ:
          </span>
          <span className="font-semibold text-[#17251F] truncate max-w-[120px] sm:max-w-[180px]">
            {product.moq || (isBn ? "১ প্যালেট" : "1 Pallet")}
          </span>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="pt-2.5 sm:pt-3 border-t border-[#DCE4E0] flex items-center justify-between gap-3 mt-auto">
        <div className="flex-1 min-w-0">
          {product.showPrice && product.priceBdt ? (
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-xs font-mono uppercase text-[#62706A]">
                {isBn ? "পাইকারি মূল্য" : "Wholesale"}
              </span>
              <span className="text-xs sm:text-sm font-mono font-bold text-[#17251F]">
                BDT {product.priceBdt.toLocaleString()}
              </span>
              <span className="hidden sm:block text-xs font-mono text-[#62706A]">
                {isBn ? "কন্টেইনার অর্ডারে বিশেষ দর" : "Container pricing on request"}
              </span>
            </div>
          ) : (
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-mono font-medium text-[#17251F]">
                {isBn ? "কোটেশনে দর" : "Quote Pricing"}
              </span>
              <span className="hidden sm:block text-xs font-mono text-[#62706A]">
                {isBn ? "কন্টেইনার অর্ডারে বিশেষ দর" : "Container pricing on request"}
              </span>
            </div>
          )}
        </div>

        <div className="shrink-0">
          <Link
            href={`/quote?product=${product.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="px-4 py-2 min-h-[40px] sm:min-h-[44px] inline-flex items-center justify-center gap-1.5 rounded-full bg-[#074031] text-white text-xs sm:text-sm font-semibold tracking-tight transition-all duration-200 hover:bg-[#FEBE16] hover:text-[#052F25] active:scale-95 text-center shadow-xs"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{isBn ? "কোটেশন" : "Quote"}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
