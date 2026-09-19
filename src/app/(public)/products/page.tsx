import React from "react";
import type { Metadata } from "next";
import { getCategories } from "@/lib/data/categories";
import { getAllProducts } from "@/lib/data/products";
import { ProductCard } from "@/components/product/product-card";
import Link from "next/link";
import { Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Equipment Catalog — Solar Panels, Batteries & Inverters",
  description:
    "Explore our complete inventory of Solar Panels, Lithium-ion Storage Batteries, and Industrial Inverters available for bulk wholesale in Bangladesh.",
};

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const activeCategorySlug = params.category || "all";
  const searchQuery = params.q || "";

  const [categories, products] = await Promise.all([
    getCategories(),
    getAllProducts({
      categorySlug: activeCategorySlug !== "all" ? activeCategorySlug : undefined,
      query: searchQuery || undefined,
    }),
  ]);

  return (
    <div className="pt-28 sm:pt-36 pb-24 bg-[#E4E7E4] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#DDE1DC] text-xs font-mono text-[#111311] mb-3">
            <span className="w-2 h-2 rounded-full bg-[#CEF23E]"></span>
            <span>Wholesale Inventory Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#111311]">
            Solar Equipment Catalog .
          </h1>
          <p className="text-sm sm:text-base text-[#5C605C] max-w-2xl mt-3">
            Directly imported solar modules, high-capacity LiFePO4 batteries, and industrial solar inverters with complete specifications.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#DDE1DC] shadow-sm mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            <Link
              href="/products"
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-tight transition-colors whitespace-nowrap ${
                activeCategorySlug === "all"
                  ? "bg-[#111311] text-[#CEF23E]"
                  : "bg-[#EDEDED] text-[#5C605C] hover:text-[#111311]"
              }`}
            >
              All Products ({products.length})
            </Link>

            {categories.map((cat) => {
              const isSelected = activeCategorySlug === cat.slug;
              return (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-tight transition-colors whitespace-nowrap ${
                    isSelected
                      ? "bg-[#111311] text-[#CEF23E]"
                      : "bg-[#EDEDED] text-[#5C605C] hover:text-[#111311]"
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>

          {/* Search Input Box */}
          <form method="GET" action="/products" className="relative w-full md:w-72">
            {activeCategorySlug !== "all" && (
              <input type="hidden" name="category" value={activeCategorySlug} />
            )}
            <input
              type="text"
              name="q"
              defaultValue={searchQuery}
              placeholder="Search model or spec..."
              className="w-full pl-9 pr-4 py-2 rounded-full bg-[#EDEDED] text-xs sm:text-sm text-[#111311] placeholder:text-[#8A8F8A] outline-none focus:bg-white focus:ring-1 focus:ring-[#111311] transition-all"
            />
            <Search className="w-4 h-4 text-[#5C605C] absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-white border border-[#DDE1DC]">
            <h3 className="text-lg font-bold text-[#111311] mb-2">
              No products found matching your search
            </h3>
            <p className="text-xs text-[#5C605C] mb-6">
              Try adjusting your search terms or view our complete category catalog.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-5 py-2.5 rounded-full bg-[#111311] text-white text-xs font-medium"
            >
              Reset Filters
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
