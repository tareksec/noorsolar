import type { Metadata } from "next";
import { getCategories } from "@/lib/data/categories";
import { getAllProducts } from "@/lib/data/products";
import { ProductCard } from "@/components/product/product-card";
import Link from "next/link";
import { Search, ArrowUpRight } from "lucide-react";
import { EmptyCatalogIllustration } from "@/components/illustrations/empty-catalog-illustration";

export const metadata: Metadata = {
  title: "Solar equipment catalog",
  description: "Compare solar panels, lithium batteries and inverters by specification. Request a quote for your bulk order from Noor Solar Energy.",
  openGraph: { title: "Equipment catalog — Noor Solar Energy", description: "Explore solar panels, lithium batteries and inverters for bulk enquiries.", url: "/products" },
};
export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ category?: string; q?: string }> }) {
  const params = await searchParams;
  const active = params.category || "all";
  const query = params.q?.trim() || "";
  const [categories, products] = await Promise.all([getCategories(), getAllProducts({ categorySlug: active !== "all" ? active : undefined, query })]);
  const total = categories.reduce((sum, c) => sum + c._count.products, 0);
  function filterUrl(category: string) {
    const search = new URLSearchParams();
    if (category !== "all") search.set("category", category);
    if (query) search.set("q", query);
    return "/products" + (search.size ? "?" + search.toString() : "");
  }
  return <div className="pt-28 sm:pt-36 pb-20"><div className="page-shell">
    <div className="catalog-header"><div><p className="eyebrow">The equipment catalog / Bulk enquiries</p><h1>Find your next<br className="hidden sm:block" /> energy essential.</h1><p>Solar panels, lithium batteries and inverters. Compare specifications and request pricing for the quantity you need.</p></div><Link href="/contact#quote-section" className="button button-dark">Discuss a bulk order <ArrowUpRight size={16} /></Link></div>
    <div className="catalog-controls">
      <nav className="catalog-tabs" aria-label="Filter by product category">
        <Link href={filterUrl("all")} aria-current={active === "all" ? "page" : undefined}>All equipment <span className="ml-1 opacity-70">{total}</span></Link>
        {categories.map(cat => <Link key={cat.id} href={filterUrl(cat.slug)} aria-current={active === cat.slug ? "page" : undefined}>{cat.name}</Link>)}
      </nav>
      <form className="catalog-search" method="GET" action="/products" role="search">
        {active !== "all" && <input type="hidden" name="category" value={active} />}
        <label htmlFor="catalog-query" className="sr-only">Search equipment by model or specification</label>
        <input id="catalog-query" name="q" type="search" defaultValue={query} placeholder="Search model or specification" />
        <button aria-label="Search equipment" type="submit"><Search size={17} /></button>
      </form>
    </div>
    <div className="catalog-results"><p>{products.length} {products.length === 1 ? "product" : "products"}{query ? " matching “" + query + "”" : " in this selection"}</p>{(query || active !== "all") && <Link className="underline underline-offset-4 shrink-0" href="/products">Clear filters</Link>}</div>
    {products.length ? <div className="catalog-grid">{products.map((product, index) => <ProductCard key={product.id} product={product} priority={index === 0} />)}</div> :
      <div className="rounded-3xl border border-[#DDE1DC] bg-white p-8 sm:p-12 text-center max-w-xl mx-auto"><EmptyCatalogIllustration className="w-36 h-32 mx-auto" /><h2 className="text-xl font-semibold mt-3">No matching equipment.</h2><p className="text-sm text-[#5C605C] leading-relaxed mt-3 mb-6">Try a model, power rating or product type. You can also send us your requirements.</p><Link href="/products" className="button button-dark">Reset filters</Link><Link href="/contact#quote-section" className="text-link ml-4 mt-4">Ask about equipment ↗</Link></div>}
  </div></div>;
}

