import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/data/products";
import { ProductCard } from "@/components/product/product-card";
import { ProductGallery } from "@/components/product/product-gallery";
import { ArrowUpRight, Box, Clock, Download, ShieldCheck } from "lucide-react";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProductBySlug(slug);

  if (!data || !data.product) {
    return { title: "Product Not Found" };
  }

  const { product } = data;
  return {
    title: `${product.name} — Noor Solar Energy`,
    description:
      product.shortDescription ||
      `Direct importer wholesale specs for ${product.name}. Request quotation and technical datasheets.`,
    openGraph: {
      title: product.name,
      description: product.shortDescription || undefined,
      images: product.images[0]?.url ? [{ url: product.images[0].url }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const data = await getProductBySlug(slug);

  if (!data || !data.product) {
    notFound();
  }

  const { product, related } = data;

  // Product JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.shortDescription,
    image: product.images.map((img) => img.url),
    sku: product.model || product.slug,
    category: product.category.name,
    offers: {
      "@type": "Offer",
      availability:
        product.stockStatus === "IN_STOCK"
          ? "https://schema.org/InStock"
          : product.stockStatus === "INCOMING"
          ? "https://schema.org/PreOrder"
          : "https://schema.org/LimitedAvailability",
      priceCurrency: "BDT",
      price: "0",
      priceValidUntil: "2026-12-31",
      seller: {
        "@type": "Organization",
        name: "Noor Solar Energy BD",
      },
    },
  };

  return (
    <div className="pt-24 pb-20 sm:pb-32 bg-[#E4E7E4] min-h-screen">
      {/* Schema.org Product Metadata */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-mono text-[#5C605C] mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-[#111311] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#111311] transition-colors">
            Products
          </Link>
          <span>/</span>
          <Link
            href={`/category/${product.category.slug}`}
            className="hover:text-[#111311] transition-colors"
          >
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-[#111311] font-semibold truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </div>

        {/* Product Hero Grid */}
        <div className="p-6 sm:p-10 lg:p-12 rounded-[36px] bg-white border border-[#DDE1DC] shadow-sm mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            
            {/* Left: Product Media Gallery */}
            <div className="lg:col-span-6 min-w-0">
              <ProductGallery
                images={product.images}
                productName={product.name}
              />
            </div>

            {/* Right: Commercial Information & Quote CTA */}
            <div className="lg:col-span-6 flex flex-col justify-between min-w-0">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-[#EDEDED] text-[11px] font-mono text-[#111311]">
                    {product.category.name}
                  </span>
                  {product.model && (
                    <span className="text-xs font-mono text-[#5C605C]">
                      Model: {product.model}
                    </span>
                  )}
                </div>

                <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#111311] leading-tight mb-4 break-words min-w-0">
                  {product.name}
                </h1>

                {product.shortDescription && (
                  <p className="text-sm sm:text-base text-[#5C605C] leading-relaxed mb-6">
                    {product.shortDescription}
                  </p>
                )}

                {/* Status & MOQ Metadata */}
                <div className="p-5 rounded-2xl bg-[#EDEDED] border border-[#DDE1DC] space-y-3 mb-8">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#5C605C] font-mono">Stock Availability:</span>
                    <span className="font-mono font-bold text-[#111311] bg-white px-2.5 py-0.5 rounded-full">
                      {product.stockStatus === "IN_STOCK"
                        ? "Dhaka Warehouse In-Stock"
                        : product.stockStatus === "INCOMING"
                        ? "Incoming Shipment"
                        : "On Request / Container Indent"}
                    </span>
                  </div>

                  {product.moq && (
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-[#DDE1DC]">
                      <span className="text-[#5C605C] font-mono flex items-center gap-1.5">
                        <Box className="w-3.5 h-3.5 text-[#111311]" />
                        Minimum Order Quantity:
                      </span>
                      <span className="font-mono font-medium text-[#111311]">
                        {product.moq}
                      </span>
                    </div>
                  )}

                  {product.leadTime && (
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-[#DDE1DC]">
                      <span className="text-[#5C605C] font-mono flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#111311]" />
                        Delivery Lead Time:
                      </span>
                      <span className="font-mono font-medium text-[#111311]">
                        {product.leadTime}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Commercial Quote Action CTAs */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-[#EDEDED]">
                <Link
                  href={`/contact?product=${encodeURIComponent(product.slug)}`}
                  className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 py-4 px-6 rounded-full bg-[#CEF23E] hover:bg-[#bce02b] text-[#111311] font-bold text-sm tracking-tight transition-all duration-200 shadow-sm active:scale-95"
                >
                  <span>Request Wholesale Quotation</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>

                {product.datasheetUrl && (
                  <a
                    href={product.datasheetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[#EDEDED] hover:bg-[#DDE1DC] text-[#111311] text-xs font-semibold font-mono transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Datasheet</span>
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Detailed Description & Technical Specifications Table */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20">
          
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="p-8 rounded-3xl bg-white border border-[#DDE1DC]">
              <h2 className="text-xl font-bold text-[#111311] tracking-tight mb-4">
                Engineering Summary
              </h2>
              <div className="text-xs sm:text-sm text-[#5C605C] leading-relaxed space-y-4">
                <p>
                  {product.description ||
                    "This solar equipment is imported according to strict quality compliance standards, ensuring long-term durability and high energy yield under Bangladesh climatic conditions."}
                </p>
                <div className="pt-4 border-t border-[#EDEDED] flex items-center gap-2 text-xs font-mono text-[#111311]">
                  <ShieldCheck className="w-4 h-4 text-[#111311]" />
                  <span>Supplied with Complete Technical Datasheet</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="p-8 rounded-3xl bg-white border border-[#DDE1DC]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#111311] tracking-tight">
                  Technical Specifications
                </h2>
                <span className="text-xs font-mono text-[#5C605C]">
                  STC Lab Standards
                </span>
              </div>

              {product.specs.length > 0 ? (
                <div className="divide-y divide-[#EDEDED] border-t border-b border-[#EDEDED]">
                  {product.specs.map((spec) => (
                    <div
                      key={spec.id}
                      className="py-3.5 flex items-center justify-between text-xs sm:text-sm"
                    >
                      <span className="text-[#5C605C] font-medium">{spec.label}</span>
                      <span className="font-mono font-bold text-[#111311] text-right">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#5C605C]">
                  Detailed specs available upon formal quote request.
                </p>
              )}
            </div>
          </div>

        </div>

        {/* Related Products from Same Category */}
        {related.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-mono uppercase text-[#5C605C] block mb-1">
                  Matched Recommendations
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#111311]">
                  Related {product.category.name}
                </h2>
              </div>
              <Link
                href={`/category/${product.category.slug}`}
                className="text-xs font-mono text-[#111311] hover:underline"
              >
                View Category →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {related.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

