import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/data/products";
import { ProductCard } from "@/components/product/product-card";
import { ProductGallery } from "@/components/product/product-gallery";
import { ArrowUpRight, Download, ArrowRight } from "lucide-react";
interface ProductPageProps { params: Promise<{ slug: string }> }
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProductBySlug(slug);
  if (!data) return { title: "Product not found" };
  const product = data.product;
  const description = product.shortDescription || "Review specifications and request bulk pricing for " + product.name + ".";
  return { title: product.name, description, alternates: { canonical: "/product/" + product.slug }, openGraph: { title: product.name, description, url: "/product/" + product.slug, images: product.images[0] ? [{ url: product.images[0].url }] : [] } };
}
export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const data = await getProductBySlug(slug);
  if (!data) notFound();
  const { product, related } = data;
  const stock = product.stockStatus === "IN_STOCK" ? "In stock" : product.stockStatus === "INCOMING" ? "Incoming" : "On request";
  const jsonLd = {
    "@context": "https://schema.org", "@type": "Product", name: product.name,
    description: product.description || product.shortDescription, image: product.images.map(i => i.url),
    sku: product.model || product.slug, category: product.category.name,
    ...(product.showPrice && product.priceBdt != null ? { offers: { "@type": "Offer", priceCurrency: "BDT", price: product.priceBdt, availability: product.stockStatus === "IN_STOCK" ? "https://schema.org/InStock" : "https://schema.org/PreOrder" } } : {}),
  };
  return <div className="pt-28 pb-20"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} /><div className="page-shell">
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-[#5C605C] mb-7"><Link href="/products" className="hover:underline">Equipment</Link><span aria-hidden="true">/</span><Link href={"/category/" + product.category.slug} className="hover:underline">{product.category.name}</Link><span aria-hidden="true">/</span><span className="text-[#111311]">{product.model || product.name}</span></nav>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start p-5 sm:p-9 rounded-[32px] sm:rounded-[40px] border border-white bg-white mb-12">
      <div className="min-w-0 order-2 lg:order-1"><ProductGallery images={product.images} productName={product.name} /></div>
      <div className="min-w-0 order-1 lg:order-2">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-5"><p className="eyebrow">{product.category.name}</p><span className="text-xs bg-[#EFF3E5] rounded-full px-3 py-1.5">{stock}</span></div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-[-.04em] leading-[1.12] break-words">{product.name}</h1>
        {product.shortDescription && <p className="text-sm text-[#5C605C] leading-relaxed mt-5">{product.shortDescription}</p>}
        <dl className="grid grid-cols-2 gap-5 border-y border-[#DDE1DC] py-5 my-6">{product.specs.slice(0,2).map(spec => <div key={spec.id}><dt className="text-xs text-[#5C605C] mb-2">{spec.label}</dt><dd className="text-xl sm:text-2xl font-semibold tracking-tight">{spec.value}</dd></div>)}</dl>
        <dl className="space-y-3 text-xs">
          {product.model && <div className="flex flex-wrap justify-between gap-3"><dt className="text-[#5C605C]">Model</dt><dd className="font-mono">{product.model}</dd></div>}
          {product.moq && <div className="flex flex-wrap justify-between gap-3"><dt className="text-[#5C605C]">Minimum order</dt><dd className="font-medium">{product.moq}</dd></div>}
          {product.leadTime && <div className="flex flex-wrap justify-between gap-3"><dt className="text-[#5C605C]">Lead time</dt><dd className="font-medium">{product.leadTime}</dd></div>}
        </dl>
        {product.showPrice && product.priceBdt != null && <p className="text-xl font-semibold mt-5">BDT {product.priceBdt.toLocaleString()}</p>}
        <Link href={"/contact?product=" + encodeURIComponent(product.slug) + "#quote-section"} className="button button-lime w-full mt-7">Request a quote for this product <ArrowUpRight size={17} /></Link>
        <p className="text-xs text-center text-[#5C605C] leading-relaxed mt-3">Share your quantity to discuss pricing and availability.</p>
        <div className="flex flex-wrap gap-5 mt-5">
          <a href="#specifications" className="text-link text-xs">All specifications <ArrowRight size={14} /></a>
          {product.datasheetUrl && <a href={product.datasheetUrl} target="_blank" rel="noreferrer" className="text-link text-xs"><Download size={15} />Download datasheet</a>}
        </div>
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-[.8fr_1.2fr] gap-8 mb-16">
      <section className="p-6 sm:p-8 rounded-3xl bg-[#EDEDED] self-start"><p className="eyebrow">Product overview</p><h2 className="text-2xl font-semibold tracking-tight mt-3 mb-5">The details that matter.</h2><p className="whitespace-pre-line text-sm text-[#5C605C] leading-relaxed">{product.description || "Contact our sales team to discuss specifications, quantities and documents for this product."}</p><p className="text-xs text-[#5C605C] leading-relaxed border-t border-[#CDD3C8] mt-6 pt-5">Confirm the required specifications and current order terms when requesting your quotation.</p></section>
      <section id="specifications" className="p-5 sm:p-8 rounded-3xl bg-white border border-[#DDE1DC] min-w-0"><h2 className="text-2xl font-semibold tracking-tight mb-6">Technical specifications</h2>
        {product.specs.length ? <table className="w-full text-sm border-collapse"><caption className="sr-only">Specifications for {product.name}</caption><tbody>{product.specs.map(spec => <tr key={spec.id} className="border-t border-[#E4E7E4]"><th scope="row" className="py-4 pr-5 text-left font-normal text-[#5C605C] w-1/2 align-top">{spec.label}</th><td className="py-4 text-right font-mono text-xs font-medium break-words">{spec.value}</td></tr>)}</tbody></table> : <p className="text-sm text-[#5C605C]">Ask for specifications in your quote request.</p>}
      </section>
    </div>
    {related.length > 0 && <section><div className="section-heading"><div><p className="eyebrow">Compare your options</p><h2>Also in {product.category.name.toLowerCase()}.</h2></div><Link href={"/category/" + product.category.slug} className="text-link shrink-0">View category ↗</Link></div><div className="catalog-grid">{related.map(item => <ProductCard key={item.id} product={item} />)}</div></section>}
  </div></div>;
}

