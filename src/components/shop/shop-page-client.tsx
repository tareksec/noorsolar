"use client";

import React, { useState, useMemo } from "react";
import { AppImage as Image } from "@/components/ui/app-image";
import { Link } from "@/i18n/routing";
import {
  Search,
  SlidersHorizontal,
  ShoppingBag,
  Heart,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Send,
  Zap,
} from "lucide-react";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

export interface ShopProduct {
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
}

export interface ShopCategory {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  image?: string | null;
  _count?: { products: number };
}

interface ShopPageClientProps {
  categories: ShopCategory[];
  products: ShopProduct[];
  currentLocale: string;
  initialCategory?: string;
  initialSearchQuery?: string;
}

export function ShopPageClient({
  categories,
  products,
  currentLocale,
  initialCategory = "all",
  initialSearchQuery = "",
}: ShopPageClientProps) {
  const isBn = currentLocale === "bn";
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [savedCount, setSavedCount] = useState(3);
  const cartCount = 4;

  // Filter products by selected category and search query
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category?.slug === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.model?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const popularCategoryCards = [
    {
      id: "solar-panels",
      slug: "solar-panels",
      badge: "-30%",
      badgeColor: "bg-slate-500 text-white",
      title: isBn ? "সোলার প্যানেল" : "Solar Panels",
      image: "/solar-images/solar-panel-3d-isolated.webp",
      alt: "Solar Panels",
    },
    {
      id: "solar-inverters",
      slug: "solar-inverters",
      badge: "New",
      badgeColor: "bg-[#1E232A] text-white",
      title: isBn ? "সোলার ইনভার্টার" : "Solar Inverters",
      image: "/demo/inverter-10kw-hybrid-front.svg",
      alt: "Hybrid Inverter",
    },
    {
      id: "lithium-batteries",
      slug: "lithium-batteries",
      badge: isBn ? "স্টক আছে" : "In Stock",
      badgeColor: "bg-emerald-600 text-white",
      title: isBn ? "লিথিয়াম ব্যাটারি" : "Lithium Batteries",
      image: "/demo/battery-51v-200ah-powerwall.svg",
      alt: "Lithium Battery",
    },
    {
      id: "accessories",
      slug: "solar-inverters",
      badge: "Tier-1",
      badgeColor: "bg-amber-600 text-white",
      title: isBn ? "কন্ট্রোলার ও সরঞ্জাম" : "Controllers & Accessories",
      image: "/demo/inverter-30kw-ongrid-front.svg",
      alt: "Solar Accessories",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#F5F8FB] via-[#EEF3F8] to-[#E9EFF6] pt-28 sm:pt-36 pb-20 px-3 sm:px-6 lg:px-8">
      {/* Outer App Window / Canvas matching mockup */}
      <div className="max-w-[1380px] mx-auto bg-white rounded-[32px] sm:rounded-[40px] shadow-[0_20px_70px_rgba(0,0,0,0.06)] border border-slate-100/90 overflow-hidden p-5 sm:p-8 lg:p-10">
        
        {/* Main 2-Column Grid: Left Sidebar + Right Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* ================= LEFT SIDEBAR ================= */}
          <aside className="lg:col-span-3 xl:col-span-2 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-100 pb-6 lg:pb-0 lg:pr-6">
            <div>
              {/* Brand Logo & Dot Symbol */}
              <div className="flex items-center gap-3 mb-8">
                <div className="relative w-8 h-8 rounded-xl bg-[#111311] flex items-center justify-center text-[#CEF23E] font-bold text-sm shadow-sm">
                  <Zap className="w-4 h-4 fill-[#CEF23E]" />
                </div>
                <div>
                  <span className="font-extrabold text-sm tracking-tight text-[#111311] block uppercase">
                    NOOR SOLAR
                  </span>
                  <span className="text-[9px] font-mono text-[#5C605C] uppercase tracking-widest block">
                    EQUIPMENT SHOP
                  </span>
                </div>
              </div>

              {/* "Categories" Heading */}
              <h2 className="text-xl font-bold tracking-tight text-[#111311] mb-4">
                {isBn ? "ক্যাটেগরি" : "Categories"}
              </h2>

              {/* Vertical Category Nav Links */}
              <nav className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 no-scrollbar">
                {/* "All" Item */}
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all text-left whitespace-nowrap flex items-center justify-between ${
                    selectedCategory === "all"
                      ? "bg-[#111311] text-white shadow-sm"
                      : "text-slate-600 hover:text-[#111311] hover:bg-slate-100"
                  }`}
                >
                  <span>{isBn ? "সকল সরঞ্জাম" : "All Equipment"}</span>
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full ml-2 ${
                    selectedCategory === "all" ? "bg-white/20 text-white" : "text-slate-400"
                  }`}>
                    {products.length}
                  </span>
                </button>

                {/* Individual Categories */}
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.slug;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all text-left whitespace-nowrap flex items-center justify-between ${
                        isSelected
                          ? "bg-[#111311] text-white shadow-sm"
                          : "text-slate-600 hover:text-[#111311] hover:bg-slate-100"
                      }`}
                    >
                      <span>{cat.name}</span>
                      {cat._count?.products !== undefined && (
                        <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full ml-2 ${
                          isSelected ? "bg-white/20 text-white" : "text-slate-400"
                        }`}>
                          {cat._count.products}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Support Badge in Sidebar */}
            <div className="hidden lg:block mt-10 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
              <div className="flex items-center gap-2 text-slate-900 font-bold mb-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>B2B Fast Dispatch</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Nationwide container delivery across Bangladesh.
              </p>
            </div>
          </aside>

          {/* ================= RIGHT MAIN CONTENT AREA ================= */}
          <div className="lg:col-span-9 xl:col-span-10 space-y-7 sm:space-y-9">
            
            {/* 1. TOP HEADER BAR: Search Pill + Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Search Pill Input with Sliders Icon */}
              <div className="relative w-full sm:max-w-md lg:max-w-lg">
                <div className="flex items-center bg-[#F3F4F6] rounded-full px-4 py-2.5 transition-all focus-within:ring-2 focus-within:ring-[#111311]/20">
                  <Search className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      isBn
                        ? "পণ্য বা মডেল খুঁজুন..."
                        : "Search equipment, solar panels, inverters..."
                    }
                    className="w-full bg-transparent border-none text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    aria-label="Filter"
                    className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right Quick Action Icons & Language Toggle */}
              <div className="flex items-center gap-3 sm:gap-4 shrink-0 self-end sm:self-auto">
                
                {/* Cart / Bag Icon with Red Badge */}
                <Link
                  href="/contact"
                  className="relative p-2.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
                  title="Quote Bag"
                >
                  <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#FF4500] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                </Link>

                {/* Heart / Saved Wishlist Icon */}
                <button
                  type="button"
                  onClick={() => setSavedCount((c) => c + 1)}
                  className="relative p-2.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
                  title="Saved items"
                >
                  <Heart className="w-5 h-5 stroke-[1.8]" />
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-slate-800 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {savedCount}
                  </span>
                </button>

                {/* Avatar */}
                <div className="relative w-9 h-9 rounded-full overflow-hidden bg-slate-200 ring-2 ring-slate-100 shrink-0">
                  <Image
                    src="/logo/icon.png"
                    alt="Commercial Member"
                    fill
                    className="object-contain p-0.5"
                  />
                </div>

                {/* Language Switcher */}
                <LanguageSwitcher currentLocale={currentLocale} idPrefix="shop" />
              </div>
            </div>

            {/* 2. PROMO BANNER GRID (Matching Mockup 2-Column Split) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
              
              {/* Large Featured Card (Left ~60-65%): BIG SALE with 3D product visual */}
              <div className="lg:col-span-8 rounded-[28px] sm:rounded-[32px] bg-gradient-to-br from-[#FFF5ED] via-[#FCEEE3] to-[#EBF3FF] p-6 sm:p-8 lg:p-10 relative overflow-hidden flex flex-col sm:flex-row justify-between items-center shadow-xs border border-orange-100/60 min-h-[260px]">
                
                {/* Left Text & CTA */}
                <div className="relative z-10 max-w-sm mb-6 sm:mb-0 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 text-[11px] font-bold tracking-wide uppercase mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isBn ? "বিশেষ অফার" : "Special Wholesale"}</span>
                  </div>

                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111311] tracking-tight leading-tight mb-2 uppercase">
                    BIG SALE!
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-medium">
                    {isBn
                      ? "উচ্চ-দক্ষতাসম্পন্ন এন-টাইপ টপকন সোলার প্যানেল সরাসরি কন্টেইনার রেটে।"
                      : "Tier-1 N-Type TOPCon bifacial modules with genuine factory warranty."}
                  </p>

                  <button
                    type="button"
                    onClick={() => setSelectedCategory("solar-panels")}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FF5500] hover:bg-[#E04B00] text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.03] active:scale-[0.98]"
                  >
                    <span>{isBn ? "প্যানেল দেখুন" : "Solar Panels"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Right 3D Visual Popout */}
                <div className="relative w-56 sm:w-64 lg:w-72 h-44 sm:h-52 shrink-0 flex items-center justify-center">
                  <Image
                    src="/solar-images/solar-panel-3d-isolated.webp"
                    alt="Solar Panel 3D Model"
                    fill
                    className="object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.15)] hover:scale-105 transition-transform duration-500"
                    priority
                  />
                </div>
              </div>

              {/* Stacked Right Cards (Right ~35-40%) */}
              <div className="lg:col-span-4 flex flex-col gap-5 justify-between">
                
                {/* Top Card: 20% OFF */}
                <div className="flex-1 rounded-[24px] sm:rounded-[28px] bg-gradient-to-r from-[#FDE8DF] via-[#FEEFE9] to-[#EAF4FE] p-5 sm:p-6 flex flex-col justify-center border border-rose-100/60 shadow-2xs">
                  <span className="text-xs font-mono font-bold text-rose-500 uppercase tracking-wider mb-1">
                    {isBn ? "সীমিত অফার" : "Limited Promotion"}
                  </span>
                  <h4 className="text-xl sm:text-2xl font-black text-[#111311] leading-snug">
                    {isBn ? "প্যাকেজে ২০% পর্যন্ত ছাড়" : "Get up to 20% OFF"}
                    <span className="block text-rose-600 font-extrabold text-sm sm:text-base mt-0.5">
                      {isBn ? "সোলার ইনভার্টার ও ব্যাটারি" : "Inverters & Storage"}
                    </span>
                  </h4>
                </div>

                {/* Bottom Card: Product Feature & Shop Now button */}
                <div className="flex-1 rounded-[24px] sm:rounded-[28px] bg-gradient-to-r from-[#EFF6FD] to-[#E3EDFD] p-5 sm:p-6 flex items-center justify-between border border-blue-100/60 shadow-2xs">
                  <div className="max-w-[160px]">
                    <span className="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-widest block mb-1">
                      Telecom Grade
                    </span>
                    <h5 className="text-base sm:text-lg font-bold text-[#111311] leading-tight mb-3">
                      Hybrid Inverter 10kW
                    </h5>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory("solar-inverters")}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1E232A] hover:bg-black text-white text-xs font-bold transition-transform hover:scale-105"
                    >
                      <span>{isBn ? "এখন কিনুন" : "Shop now"}</span>
                    </button>
                  </div>

                  <div className="relative w-24 sm:w-28 h-24 sm:h-28 shrink-0">
                    <Image
                      src="/demo/inverter-10kw-hybrid-front.svg"
                      alt="Hybrid Inverter"
                      fill
                      className="object-contain drop-shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. "Explore popular categories" SECTION (Matching Mockup 4 Square Cards) */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111311]">
                  {isBn ? "জনপ্রিয় ক্যাটেগরি" : "Explore popular categories"}
                </h3>
                <Link
                  href="/products"
                  className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#111311] flex items-center gap-1 transition-colors"
                >
                  <span>{isBn ? "সব দেখুন" : "See all"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* 4 Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {popularCategoryCards.map((card) => {
                  return (
                    <div
                      key={card.id}
                      onClick={() => setSelectedCategory(card.slug)}
                      className="group cursor-pointer rounded-[24px] bg-[#F7F8FA] hover:bg-[#F0F2F6] border border-slate-200/60 p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-1 min-h-[190px] sm:min-h-[220px]"
                    >
                      {/* Top Badge */}
                      <div className="flex items-center justify-start">
                        <span
                          className={`text-[10px] sm:text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${card.badgeColor} shadow-2xs`}
                        >
                          {card.badge}
                        </span>
                      </div>

                      {/* Center Cutout Product Image */}
                      <div className="relative w-full h-24 sm:h-28 my-auto flex items-center justify-center">
                        <Image
                          src={card.image}
                          alt={card.alt}
                          fill
                          className="object-contain p-2 group-hover:scale-110 transition-transform duration-500 ease-out"
                        />
                      </div>

                      {/* Bottom Label */}
                      <span className="text-xs sm:text-sm font-bold text-center text-[#111311] group-hover:text-black mt-2">
                        {card.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. PRODUCT CATALOG GRID */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg sm:text-xl font-bold text-[#111311]">
                  {isBn ? "সরঞ্জাম তালিকা" : "Equipment Catalog"}
                  <span className="text-xs font-mono font-normal text-slate-500 ml-2">
                    ({filteredProducts.length} {isBn ? "টি পণ্য" : "items"})
                  </span>
                </h3>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-100">
                  <p className="text-sm font-semibold text-slate-600 mb-2">
                    {isBn ? "কোনো পণ্য পাওয়া যায়নি" : "No products found"}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("all");
                      setSearchQuery("");
                    }}
                    className="text-xs font-bold text-[#FF5500] hover:underline"
                  >
                    {isBn ? "ফিল্টার রিসেট করুন" : "Reset filters"}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
                  {filteredProducts.map((product) => {
                    const primaryImg =
                      product.images[0]?.url || "/demo/category-panels.svg";

                    return (
                      <div
                        key={product.id}
                        className="group rounded-[24px] bg-white border border-slate-200/80 p-5 flex flex-col justify-between hover:shadow-lg hover:border-slate-300 transition-all duration-300"
                      >
                        {/* Top Info & Image */}
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                              {product.category?.name || "Equipment"}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 font-semibold">
                              <CheckCircle2 className="w-3 h-3" />
                              {product.stockStatus === "IN_STOCK"
                                ? isBn
                                  ? "স্টকে আছে"
                                  : "In Stock"
                                : isBn
                                ? "অনুরোধে"
                                : "On Request"}
                            </span>
                          </div>

                          {/* Image Canvas */}
                          <div className="relative w-full h-44 rounded-2xl bg-[#F8FAFC] border border-slate-100 mb-4 flex items-center justify-center overflow-hidden">
                            <Image
                              src={primaryImg}
                              alt={product.name}
                              fill
                              sizes="(max-width: 640px) 100vw, 360px"
                              className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>

                          {/* Title */}
                          <Link href={`/product/${product.slug}`}>
                            <h4 className="text-sm sm:text-base font-bold text-[#111311] hover:text-[#FF5500] transition-colors line-clamp-2 mb-2">
                              {product.name}
                            </h4>
                          </Link>

                          {/* Specs Pills */}
                          {product.specs && product.specs.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {product.specs.slice(0, 2).map((spec, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                                >
                                  {spec.label}: {spec.value}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Bottom Actions */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 mt-3">
                          <div>
                            {product.showPrice && product.priceBdt ? (
                              <span className="text-sm font-extrabold text-[#111311]">
                                ৳{product.priceBdt.toLocaleString()}
                              </span>
                            ) : (
                              <span className="text-xs font-mono text-slate-500">
                                {isBn ? "কন্টেইনার রেট" : "Wholesale Rates"}
                              </span>
                            )}
                          </div>

                          <Link
                            href={`/contact?product=${encodeURIComponent(product.slug)}`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#111311] hover:bg-[#222622] text-[#CEF23E] font-bold text-xs shadow-xs transition-transform hover:scale-105"
                          >
                            <span>{isBn ? "কোটেশন" : "Quote"}</span>
                            <Send className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
