"use client";

import React, { useState, useMemo, useEffect, useSyncExternalStore } from "react";
import { AppImage as Image } from "@/components/ui/app-image";
import { Link, useRouter } from "@/i18n/routing";
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
  Plus,
  Minus,
  Trash2,
  X,
  Check,
  ShoppingBasket,
} from "lucide-react";

export interface ShopProduct {
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
}

export interface ShopCategory {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  image?: string | null;
  _count?: { products: number };
}

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  brand?: string | null;
  model?: string | null;
  imageUrl: string;
  categoryName?: string;
  quantity: number;
}

interface ShopPageClientProps {
  categories: ShopCategory[];
  products: ShopProduct[];
  currentLocale: string;
  initialCategory?: string;
  initialSearchQuery?: string;
}

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function ShopPageClient({
  categories,
  products,
  currentLocale,
  initialCategory = "all",
  initialSearchQuery = "",
}: ShopPageClientProps) {
  const isBn = currentLocale === "bn";
  const router = useRouter();
  const isMounted = useMounted();
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [savedProductIds, setSavedProductIds] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  // Load saved favorites & cart items from localStorage after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const savedRaw = localStorage.getItem("noor_saved_product_ids");
        if (savedRaw) {
          setSavedProductIds(JSON.parse(savedRaw));
        }
        const cartRaw = localStorage.getItem("noor_quote_cart");
        if (cartRaw) {
          setCartItems(JSON.parse(cartRaw));
        }
      } catch {
        // ignore JSON parse errors
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Save/Unsave product toggle
  const toggleSaveProduct = (productId: string) => {
    setSavedProductIds((prev) => {
      const next = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      try {
        localStorage.setItem("noor_saved_product_ids", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Add product to quote bag
  const addToCart = (product: ShopProduct) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      let next: CartItem[];
      if (existing) {
        next = prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        const primaryImg = product.images[0]?.url || "/demo/category-panels.svg";
        next = [
          ...prev,
          {
            id: product.id,
            slug: product.slug,
            name: product.name,
            brand: product.brand,
            model: product.model,
            imageUrl: primaryImg,
            categoryName: product.category?.name,
            quantity: 1,
          },
        ];
      }
      try {
        localStorage.setItem("noor_quote_cart", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Update item quantity in cart
  const updateCartQuantity = (productId: string, delta: number) => {
    setCartItems((prev) => {
      const next = prev
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
      try {
        localStorage.setItem("noor_quote_cart", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Remove item from cart
  const removeFromCart = (productId: string) => {
    setCartItems((prev) => {
      const next = prev.filter((item) => item.id !== productId);
      try {
        localStorage.setItem("noor_quote_cart", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Clear all items in cart
  const clearCart = () => {
    setCartItems([]);
    try {
      localStorage.removeItem("noor_quote_cart");
    } catch {
      // ignore
    }
  };

  const totalCartCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const totalSavedCount = savedProductIds.length;

  // Filter products by selected category, search query, and saved filter
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      if (showSavedOnly && !savedProductIds.includes(item.id)) {
        return false;
      }
      const matchesCategory =
        selectedCategory === "all" || item.category?.slug === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.model?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery, showSavedOnly, savedProductIds]);

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
      badge: "TOPCon",
      badgeColor: "bg-amber-600 text-white",
      title: isBn ? "কন্ট্রোলার ও সরঞ্জাম" : "Controllers & Accessories",
      image: "/demo/inverter-30kw-ongrid-front.svg",
      alt: "Solar Accessories",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#F5F8FB] via-[#EEF3F8] to-[#E9EFF6] pt-28 sm:pt-36 pb-20 px-3 sm:px-6 lg:px-8">
      {/* Outer App Window / Canvas matching mockup */}
      <div className="max-w-[1380px] mx-auto bg-white rounded-[32px] sm:rounded-[40px] shadow-[0_20px_70px_rgba(0,0,0,0.06)] border border-slate-100/90 relative p-5 sm:p-8 lg:p-10">
        
        {/* Main 2-Column Grid: Left Sidebar + Right Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* ================= LEFT SIDEBAR (Frozen / Sticky on Desktop) ================= */}
          <aside className="lg:col-span-3 xl:col-span-2 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-100 pb-6 lg:pb-0 lg:pr-6 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto no-scrollbar">
            <div>
              {/* Brand Logo & Mark */}
              <div className="flex items-center gap-2.5 mb-7">
                <div className="relative w-8 h-8 rounded-xl bg-[#111311] flex items-center justify-center text-[#CEF23E] font-bold text-sm shadow-sm shrink-0">
                  <Zap className="w-4 h-4 fill-[#CEF23E]" />
                </div>
                <div>
                  <span className="font-extrabold text-sm tracking-tight text-[#111311] block uppercase">
                    {isBn ? "নূর সোলার এনার্জি" : "NOOR SOLAR ENERGY"}
                  </span>
                  <span className="text-[9px] font-mono text-[#5C605C] uppercase tracking-widest block">
                    {isBn ? "সরঞ্জাম ক্যাটালগ" : "EQUIPMENT CATALOG"}
                  </span>
                </div>
              </div>

              {/* "Categories" Heading - Matching mockup styling */}
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#111311] mb-5">
                {isBn ? "ক্যাটাগরি" : "Categories"}
              </h2>

              {/* Vertical Category Nav Links - Clean text list matching mockup */}
              <nav className="flex flex-row lg:flex-col gap-1 sm:gap-1.5 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 no-scrollbar">
                {/* "All" Item */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("all");
                    setShowSavedOnly(false);
                  }}
                  className={`text-left whitespace-nowrap transition-all duration-200 flex items-center justify-between text-xs sm:text-[14px] min-h-[44px] ${
                    selectedCategory === "all" && !showSavedOnly
                      ? "px-3 py-2 rounded-xl bg-[#111311] lg:bg-transparent text-white lg:text-[#111311] font-bold lg:font-extrabold lg:translate-x-1"
                      : "px-3 py-2 rounded-xl bg-slate-100 lg:bg-transparent text-slate-600 hover:text-[#111311] hover:bg-slate-100/60 lg:hover:bg-transparent font-medium lg:hover:translate-x-1"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {selectedCategory === "all" && !showSavedOnly && (
                      <span className="hidden lg:inline-block w-1.5 h-1.5 rounded-full bg-[#111311]" />
                    )}
                    {isBn ? "সকল সরঞ্জাম" : "All Equipment"}
                  </span>
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full ml-2 ${
                    selectedCategory === "all" && !showSavedOnly
                      ? "bg-white/20 lg:bg-slate-100 text-white lg:text-slate-800 font-bold"
                      : "text-slate-400"
                  }`}>
                    {products.length}
                  </span>
                </button>

                {/* Individual Categories */}
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.slug && !showSavedOnly;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat.slug);
                        setShowSavedOnly(false);
                      }}
                      className={`text-left whitespace-nowrap transition-all duration-200 flex items-center justify-between text-xs sm:text-[14px] min-h-[44px] ${
                        isSelected
                          ? "px-3 py-2 rounded-xl bg-[#111311] lg:bg-transparent text-white lg:text-[#111311] font-bold lg:font-extrabold lg:translate-x-1"
                          : "px-3 py-2 rounded-xl bg-slate-100 lg:bg-transparent text-slate-600 hover:text-[#111311] hover:bg-slate-100/60 lg:hover:bg-transparent font-medium lg:hover:translate-x-1"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {isSelected && (
                          <span className="hidden lg:inline-block w-1.5 h-1.5 rounded-full bg-[#FF5500]" />
                        )}
                        {cat.name}
                      </span>
                      {cat._count?.products !== undefined && (
                        <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full ml-2 ${
                          isSelected
                            ? "bg-white/20 lg:bg-slate-100 text-white lg:text-slate-800 font-bold"
                            : "text-slate-400"
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
            <div className="hidden lg:block mt-8 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
              <div className="flex items-center gap-2 text-slate-900 font-bold mb-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{isBn ? "বি২বি দ্রুত ডেলিভারি" : "B2B Fast Dispatch"}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {isBn
                  ? "সারা বাংলাদেশে অনুমোদিত সরাসরি সাপ্লাই।"
                  : "Nationwide container delivery across Bangladesh."}
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
                    className="w-full h-11 min-h-[44px] py-2 bg-transparent border-none text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    aria-label="Filter"
                    className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right Quick Action Icons & Language Toggle */}
              <div className="flex items-center gap-3 sm:gap-4 shrink-0 self-end sm:self-auto">
                
                {/* Cart / Quote Bag Icon with Real Dynamic Count */}
                <button
                  type="button"
                  onClick={() => setIsCartOpen(true)}
                  className="relative w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
                  title={isBn ? "কোটেশন ব্যাগ" : "Quote Bag"}
                  aria-label={isBn ? "কোটেশন ব্যাগ" : "Quote Bag"}
                >
                  <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
                  {isMounted && totalCartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[19px] h-[19px] px-1 rounded-full bg-[#FF4500] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                      {totalCartCount}
                    </span>
                  )}
                </button>

                {/* Heart / Saved Wishlist Icon with Real Dynamic Filter Toggle */}
                <button
                  type="button"
                  onClick={() => setShowSavedOnly((prev) => !prev)}
                  className={`relative w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full transition-all ${
                    showSavedOnly
                      ? "bg-rose-50 text-rose-600 ring-2 ring-rose-200"
                      : "hover:bg-slate-100 text-slate-700"
                  }`}
                  title={
                    showSavedOnly
                      ? isBn
                        ? "সকল পণ্য দেখুন"
                        : "Show all products"
                      : isBn
                      ? "সংরক্ষিত পণ্য দেখুন"
                      : "View saved items"
                  }
                  aria-label={
                    showSavedOnly
                      ? isBn
                        ? "সকল পণ্য দেখুন"
                        : "Show all products"
                      : isBn
                      ? "সংরক্ষিত পণ্য দেখুন"
                      : "View saved items"
                  }
                >
                  <Heart
                    className={`w-5 h-5 stroke-[1.8] ${
                      showSavedOnly ? "fill-rose-500 text-rose-500" : ""
                    }`}
                  />
                  {isMounted && totalSavedCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[19px] h-[19px] px-1 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                      {totalSavedCount}
                    </span>
                  )}
                </button>

                {/* B2B Wholesale Indicator */}
                <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200/80 text-[11px] font-mono text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#111311]"></span>
                  <span>{isBn ? "১ প্যালেট থেকে পাইকারি অর্ডার" : "Wholesale from 1 Pallet"}</span>
                </div>
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
                      : "N-Type TOPCon bifacial modules with genuine factory warranty."}
                  </p>

                  <button
                    type="button"
                    onClick={() => setSelectedCategory("solar-panels")}
                    className="inline-flex items-center justify-center min-h-[44px] gap-2 px-6 py-2.5 rounded-full bg-[#FF5500] hover:bg-[#E04B00] text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.03] active:scale-[0.98]"
                  >
                    <span>{isBn ? "প্যানেল দেখুন" : "Solar Panels"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Right 3D Visual Popout */}
                {(() => {
                  const panel = products.find((p) => p.category?.slug === "solar-panels" || p.slug.includes("panel")) || products[0];
                  const panelSlug = panel ? panel.slug : "n-type-topcon-bifacial-module-620w";
                  return (
                    <Link
                      href={`/product/${panelSlug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        router.push(`/product/${panelSlug}`);
                      }}
                      className="relative w-56 sm:w-64 lg:w-72 h-44 sm:h-52 shrink-0 flex items-center justify-center cursor-pointer"
                      title={isBn ? "পণ্য বিস্তারিত দেখুন" : "View Product Details"}
                    >
                      <Image
                        src="/solar-images/solar-panel-3d-isolated.webp"
                        alt="Solar Panel 3D Model"
                        fill
                        className="object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.15)] hover:scale-105 transition-transform duration-500 cursor-pointer"
                        priority
                      />
                    </Link>
                  );
                })()}
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
                {(() => {
                  const inverter = products.find((p) => p.category?.slug === "inverters" || p.category?.slug === "solar-inverters" || p.slug.includes("inverter")) || products[1] || products[0];
                  const inverterSlug = inverter ? inverter.slug : "10kw-hybrid-inverter-three-phase";
                  return (
                    <div className="flex-1 rounded-[24px] sm:rounded-[28px] bg-gradient-to-r from-[#EFF6FD] to-[#E3EDFD] p-5 sm:p-6 flex items-center justify-between border border-blue-100/60 shadow-2xs">
                      <div className="max-w-[160px]">
                        <span className="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-widest block mb-1">
                          Telecom Grade
                        </span>
                        <h5 className="text-base sm:text-lg font-bold text-[#111311] leading-tight mb-3">
                          Hybrid Inverter 10kW
                        </h5>
                        <Link
                          href={`/product/${inverterSlug}`}
                          onClick={(e) => {
                            e.preventDefault();
                            router.push(`/product/${inverterSlug}`);
                          }}
                          className="inline-flex items-center justify-center min-h-[44px] gap-1.5 px-4 py-2 rounded-full bg-[#1E232A] hover:bg-black text-white text-xs font-bold transition-transform hover:scale-105"
                        >
                          <span>{isBn ? "পণ্য দেখুন" : "View specs"}</span>
                        </Link>
                      </div>

                      <Link
                        href={`/product/${inverterSlug}`}
                        onClick={(e) => {
                          e.preventDefault();
                          router.push(`/product/${inverterSlug}`);
                        }}
                        className="relative w-24 sm:w-28 h-24 sm:h-28 shrink-0 cursor-pointer"
                        title={isBn ? "পণ্য বিস্তারিত দেখুন" : "View Product Details"}
                      >
                        <Image
                          src="/demo/inverter-10kw-hybrid-front.svg"
                          alt="Hybrid Inverter"
                          fill
                          className="object-contain drop-shadow-sm hover:scale-105 transition-transform duration-300 cursor-pointer"
                        />
                      </Link>
                    </div>
                  );
                })()}
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
                  className="inline-flex items-center min-h-[44px] px-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#111311] gap-1 transition-colors"
                >
                  <span>{isBn ? "সব দেখুন" : "See all"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* 4 Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {popularCategoryCards.map((card) => {
                  const matchProduct = products.find(
                    (p) =>
                      p.category?.slug === card.slug ||
                      p.slug.includes(card.slug.replace("solar-", ""))
                  );

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

                      {/* Center Cutout Product Image - Clicking image opens details page */}
                      <div
                        onClick={(e) => {
                          if (matchProduct) {
                            e.stopPropagation();
                            router.push(`/product/${matchProduct.slug}`);
                          }
                        }}
                        className="relative w-full h-24 sm:h-28 my-auto flex items-center justify-center cursor-pointer"
                        title={matchProduct ? (isBn ? `${matchProduct.name} বিস্তারিত দেখুন` : `View ${matchProduct.name}`) : card.title}
                      >
                        <Image
                          src={card.image}
                          alt={card.alt}
                          fill
                          className="object-contain p-2 group-hover:scale-110 transition-transform duration-500 ease-out cursor-pointer"
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
              {/* Active Saved Products Banner */}
              {showSavedOnly && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-rose-900 font-bold">
                    <Heart className="w-4 h-4 fill-rose-500 text-rose-500 shrink-0" />
                    <span>
                      {isBn
                        ? `আপনার সংরক্ষিত সরঞ্জামসমূহ (${filteredProducts.length}টি)`
                        : `Showing your saved equipment (${filteredProducts.length} items)`}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSavedOnly(false)}
                    className="text-xs font-bold text-rose-700 hover:text-rose-900 underline shrink-0"
                  >
                    {isBn ? "সকল সরঞ্জাম দেখুন" : "Show all equipment"}
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg sm:text-xl font-bold text-[#111311]">
                  {showSavedOnly
                    ? isBn
                      ? "সংরক্ষিত সরঞ্জাম তালিকা"
                      : "Saved Equipment List"
                    : isBn
                    ? "সরঞ্জাম তালিকা"
                    : "Equipment Catalog"}
                  <span className="text-xs font-mono font-normal text-slate-500 ml-2">
                    ({filteredProducts.length} {isBn ? "টি পণ্য" : "items"})
                  </span>
                </h3>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-100">
                  <p className="text-sm font-semibold text-slate-600 mb-2">
                    {showSavedOnly
                      ? isBn
                        ? "আপনার কোনো সংরক্ষিত সরঞ্জাম নেই"
                        : "You haven't saved any equipment yet"
                      : isBn
                      ? "কোনো পণ্য পাওয়া যায়নি"
                      : "No products found"}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("all");
                      setSearchQuery("");
                      setShowSavedOnly(false);
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
                    const isSaved = savedProductIds.includes(product.id);
                    const inCartItem = cartItems.find((i) => i.id === product.id);

                    return (
                      <div
                        key={product.id}
                        data-motion="product-card"
                        onClick={(e) => {
                          const target = e.target as HTMLElement;
                          if (target.closest("button") || target.closest("[data-quote-link]")) return;
                          router.push(`/product/${product.slug}`);
                        }}
                        className="group rounded-[24px] bg-white border border-slate-200/80 p-5 flex flex-col justify-between hover:shadow-lg hover:border-slate-300 transition-all duration-300 cursor-pointer"
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

                          {/* Image Canvas with Real Favorite Heart Toggle */}
                          <div
                            onClick={(e) => {
                              const target = e.target as HTMLElement;
                              if (target.closest("button")) return;
                              e.stopPropagation();
                              router.push(`/product/${product.slug}`);
                            }}
                            className="relative w-full h-44 rounded-2xl bg-[#F8FAFC] border border-slate-100 mb-4 flex items-center justify-center overflow-hidden cursor-pointer"
                          >
                            <Link
                              href={`/product/${product.slug}`}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                router.push(`/product/${product.slug}`);
                              }}
                              className="absolute inset-0 flex items-center justify-center p-3 z-0 cursor-pointer"
                              aria-label={product.name}
                            >
                              <Image
                                src={primaryImg}
                                alt={product.name}
                                fill
                                sizes="(max-width: 640px) 100vw, 360px"
                                className="object-contain p-3 group-hover:scale-105 transition-transform duration-300 cursor-pointer pointer-events-auto"
                              />
                            </Link>

                            {/* Real Favorite Heart Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleSaveProduct(product.id);
                              }}
                              className="absolute top-2.5 right-2.5 z-10 w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/95 shadow-sm hover:bg-white text-slate-400 hover:text-rose-500 transition-all hover:scale-110 active:scale-95"
                              title={
                                isSaved
                                ? isBn
                                  ? "সংরক্ষণ থেকে সরান"
                                  : "Remove from saved"
                                : isBn
                                ? "পণ্যটি সংরক্ষণ করুন"
                                : "Save product"
                              }
                              aria-label={
                                isSaved
                                ? isBn
                                  ? "সংরক্ষণ থেকে সরান"
                                  : "Remove from saved"
                                : isBn
                                ? "পণ্যটি সংরক্ষণ করুন"
                                : "Save product"
                              }
                            >
                              <Heart
                                className={`w-4 h-4 transition-colors ${
                                  isSaved
                                    ? "fill-rose-500 text-rose-500"
                                    : "text-slate-400 hover:text-rose-500"
                                }`}
                              />
                            </button>
                          </div>

                          {/* Title */}
                          <Link
                            href={`/product/${product.slug}`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              router.push(`/product/${product.slug}`);
                            }}
                            className="cursor-pointer min-h-[44px] flex items-center"
                          >
                            <h4 className="text-sm sm:text-base font-bold text-[#111311] group-hover:text-[#FF5500] transition-colors line-clamp-2 mb-2">
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

                          {/* MOQ / Wholesale Visibility */}
                          <div className="flex items-center justify-between text-[11px] font-mono mb-2 text-slate-500">
                            <span>{product.moq ? (isBn ? "ন্যূনতম অর্ডার:" : "MOQ:") : (isBn ? "সরবরাহ:" : "Supply:")}</span>
                            <span className="font-semibold text-slate-800 truncate max-w-[150px]">
                              {product.moq || (isBn ? "১ প্যালেট থেকে" : "From 1 Pallet")}
                            </span>
                          </div>
                        </div>

                        {/* Bottom Actions */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-3">
                          <div>
                            {product.showPrice && product.priceBdt ? (
                              <div className="flex flex-col">
                                <span className="text-sm font-extrabold text-[#111311]">
                                  ৳{product.priceBdt.toLocaleString()}
                                </span>
                                <span className="text-[10px] font-mono text-slate-500">
                                  {isBn ? "অনুরোধে কনটেইনার মূল্য" : "Container pricing on request"}
                                </span>
                              </div>
                            ) : (
                              <div className="flex flex-col">
                                <span className="text-xs font-mono font-bold text-slate-700">
                                  {isBn ? "কন্টেইনার / বাল্ক রেট" : "Bulk Wholesale Rate"}
                                </span>
                                <span className="text-[10px] font-mono text-slate-500">
                                  {isBn ? "অনুরোধে কনটেইনার মূল্য" : "Container pricing on request"}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Real Add to Bag Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addToCart(product);
                              }}
                              className={`inline-flex items-center justify-center min-h-[44px] gap-1 px-3.5 py-2 rounded-full text-xs font-semibold transition-all active:scale-95 ${
                                inCartItem
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                              }`}
                              title={isBn ? "কোটেশন ব্যাগে যোগ করুন" : "Add to quote bag"}
                              aria-label={isBn ? "কোটেশন ব্যাগে যোগ করুন" : "Add to quote bag"}
                            >
                              {inCartItem ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>{inCartItem.quantity}</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>{isBn ? "ব্যাগ" : "Add"}</span>
                                </>
                              )}
                            </button>

                            {/* Direct Quote link */}
                            <Link
                              href={`/contact?product=${encodeURIComponent(product.slug)}`}
                              data-quote-link="true"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center justify-center min-h-[44px] gap-1.5 px-3.5 py-2 rounded-full bg-[#111311] hover:bg-[#222622] text-[#CEF23E] font-bold text-xs shadow-xs transition-transform hover:scale-105"
                            >
                              <span>{isBn ? "কোটেশন" : "Quote"}</span>
                              <Send className="w-3 h-3" />
                            </Link>
                          </div>
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

      {/* ================= REAL QUOTE BAG SLIDE-OVER DRAWER ================= */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
          />

          {/* Drawer Container */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-slate-100">
              
              {/* Drawer Header */}
              <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#111311] flex items-center justify-center text-[#CEF23E]">
                    <ShoppingBasket className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#111311]">
                      {isBn ? "কোটেশন ব্যাগ" : "Quote Inquiries Bag"}
                    </h3>
                    <span className="text-xs text-slate-500 font-mono">
                      {totalCartCount} {isBn ? "টি পণ্য যুক্ত" : "items selected"}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
                  aria-label={isBn ? "কোটেশন ব্যাগ বন্ধ করুন" : "Close quote bag"}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body - Items List */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                      <ShoppingBag className="w-7 h-7 stroke-[1.5]" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 mb-1">
                      {isBn ? "আপনার কোটেশন ব্যাগ খালি" : "Your quote bag is empty"}
                    </h4>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto mb-6">
                      {isBn
                        ? "ক্যাটালগ থেকে যেকোনো সোলার প্যানেল, ব্যাটারি বা ইনভার্টার ব্যাগে যোগ করুন।"
                        : "Browse our equipment catalog and click 'Add' to bundle your wholesale quote request."}
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsCartOpen(false)}
                      className="inline-flex items-center px-5 py-2 rounded-full bg-[#111311] text-[#CEF23E] text-xs font-bold"
                    >
                      {isBn ? "পণ্য দেখুন" : "Explore Catalog"}
                    </button>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/70 flex items-center gap-3.5"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-14 h-14 rounded-xl bg-white border border-slate-100 shrink-0 overflow-hidden flex items-center justify-center">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-contain p-1"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {item.name}
                        </h5>
                        <p className="text-[11px] text-slate-500 font-mono truncate">
                          {item.brand || item.categoryName || "Solar Equipment"}
                        </p>

                        {/* Quantity Stepper */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.id, -1)}
                            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center justify-center text-xs"
                            aria-label={isBn ? "পরিমাণ কমান" : "Decrease quantity"}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-mono font-bold w-6 text-center text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.id, 1)}
                            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center justify-center text-xs"
                            aria-label={isBn ? "পরিমাণ বাড়ান" : "Increase quantity"}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-rose-600 transition-colors"
                        title="Remove item"
                        aria-label={isBn ? "ব্যাগ থেকে সরান" : "Remove item"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer */}
              {cartItems.length > 0 && (
                <div className="p-5 sm:p-6 border-t border-slate-100 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>{isBn ? "মোট সরঞ্জাম মডেল:" : "Selected Models:"}</span>
                    <span className="font-mono font-bold text-slate-900">
                      {cartItems.length} ({totalCartCount} {isBn ? "পিস" : "units"})
                    </span>
                  </div>

                  {/* Request Quote Button */}
                  <Link
                    href={`/contact?products=${encodeURIComponent(
                      cartItems
                        .map((i) => `${i.name} (Qty: ${i.quantity})`)
                        .join(", ")
                    )}`}
                    onClick={() => setIsCartOpen(false)}
                    className="w-full min-h-[48px] py-3 px-4 rounded-full bg-[#111311] hover:bg-black text-[#CEF23E] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-transform hover:scale-[1.02]"
                  >
                    <span>{isBn ? "কোটেশনের অনুরোধ পাঠান" : "Proceed to Commercial Quote"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={clearCart}
                    className="w-full min-h-[44px] flex items-center justify-center text-center text-[11px] font-semibold text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    {isBn ? "ব্যাগ খালি করুন" : "Clear all items"}
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </main>
  );
}
