import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getProductBySlug } from "@/lib/data/products";
import { getApprovedReviewsForProduct, isPublicReviewsEnabled } from "@/lib/data/reviews";
import { ProductCard } from "@/components/product/product-card";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductReviewsSection } from "@/components/product/product-reviews-section";
import { ArrowUpRight, Box, Clock, Download, ShieldCheck, Award, FileText, FileCheck, Package } from "lucide-react";
import { parseProductDocuments } from "@/lib/product-documents";
import { extractProductIdentity } from "@/lib/product-identity";
import { SITE_URL } from "@/lib/site-config";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const isBn = locale === "bn";
  const siteUrl = SITE_URL;
  const data = await getProductBySlug(slug, locale);

  if (!data || !data.product) {
    return { title: isBn ? "পণ্য পাওয়া যায়নি" : "Product Not Found" };
  }

  const { product } = data;
  const title = product.metaTitle || `${product.name} — Noor Solar Energy`;
  const desc =
    product.metaDescription ||
    product.shortDescription ||
    `Direct importer wholesale specs for ${product.name}. Request quotation and technical datasheets.`;

  return {
    title,
    description: desc,
    alternates: {
      canonical: isBn ? `${siteUrl}/bn/product/${product.slug}` : `${siteUrl}/product/${product.slug}`,
      languages: {
        en: `${siteUrl}/product/${product.slug}`,
        bn: `${siteUrl}/bn/product/${product.slug}`,
        "x-default": `${siteUrl}/product/${product.slug}`,
      },
    },
    openGraph: {
      title,
      description: desc,
      url: isBn ? `${siteUrl}/bn/product/${product.slug}` : `${siteUrl}/product/${product.slug}`,
      type: "website",
      locale: isBn ? "bn_BD" : "en_US",
      images: product.images[0]?.url
        ? [{ url: product.images[0].url.startsWith("http") ? product.images[0].url : `${siteUrl}${product.images[0].url}` }]
        : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const data = await getProductBySlug(slug, locale);

  if (!data || !data.product) {
    notFound();
  }

  const { product, related } = data;
  const identity = extractProductIdentity(product);
  const docs = parseProductDocuments(product.datasheetUrl);
  const hasDocs = Boolean(
    docs.datasheet || docs.warranty || docs.certificate || docs.manual || docs.testReport || docs.packingSheet
  );

  const [reviewsData, publicReviewsEnabled] = await Promise.all([
    getApprovedReviewsForProduct(product.id),
    isPublicReviewsEnabled(),
  ]);
  const { reviews, totalReviews, averageRating } = reviewsData;

  // Product JSON-LD structured data (price only if showPrice is true)
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.shortDescription,
    image: product.images.map((img) => img.url),
    sku: identity.noorSku || product.model || product.slug,
    ...(identity.manufacturer ? { brand: { "@type": "Brand", name: identity.manufacturer } } : {}),
    ...(identity.manufacturerModel ? { mpn: identity.manufacturerModel } : {}),
    category: product.category.name,
    offers: {
      "@type": "Offer",
      availability:
        product.stockStatus === "IN_STOCK"
          ? "https://schema.org/InStock"
          : product.stockStatus === "INCOMING"
          ? "https://schema.org/PreOrder"
          : "https://schema.org/LimitedAvailability",
      ...(product.showPrice && product.priceBdt
        ? {
            priceCurrency: "BDT",
            price: product.priceBdt.toString(),
            priceValidUntil: "2026-12-31",
          }
        : {}),
      seller: {
        "@type": "Organization",
        name: "Noor Solar Energy",
      },
    },
    ...(totalReviews > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: averageRating.toString(),
            reviewCount: totalReviews.toString(),
            bestRating: "5",
            worstRating: "1",
          },
          review: reviews.map((r) => ({
            "@type": "Review",
            author: {
              "@type": "Person",
              name: r.authorName,
            },
            datePublished: r.createdAt.toISOString().split("T")[0],
            reviewBody: r.body,
            reviewRating: {
              "@type": "Rating",
              ratingValue: r.rating.toString(),
              bestRating: "5",
              worstRating: "1",
            },
          })),
        }
      : {}),
  };

  const isBn = locale === "bn";

  return (
    <div className="pt-24 pb-20 sm:pb-32 bg-[#E4E7E4] min-h-screen">
      {/* Schema.org Product Metadata */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-[#5C605C] mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] px-1.5 hover:text-[#111311] transition-colors">
            {isBn ? "হোম" : "Home"}
          </Link>
          <span>/</span>
          <Link href="/products" className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] px-1.5 hover:text-[#111311] transition-colors">
            {isBn ? "পণ্যসমূহ" : "Products"}
          </Link>
          <span>/</span>
          <Link
            href={`/category/${product.category.slug}`}
            className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] px-1.5 hover:text-[#111311] transition-colors"
          >
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="inline-flex items-center min-h-[44px] text-[#111311] font-medium truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        {/* Product Details Hero Card */}
        <div className="p-6 sm:p-10 lg:p-14 rounded-[36px] bg-white border border-[#DDE1DC] shadow-sm mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
            
            {/* Left: Product Images / Gallery */}
            <div className="lg:col-span-6 min-w-0">
              <ProductGallery
                images={product.images}
                productName={product.name}
              />
            </div>

            {/* Right: Commercial Information & Quote CTA */}
            <div className="lg:col-span-6 flex flex-col justify-between min-w-0">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-[#EDEDED] text-[11px] font-mono text-[#111311]">
                    {product.category.name}
                  </span>
                  {identity.manufacturer && (
                    <span className="px-3 py-1 rounded-full bg-white border border-[#DDE1DC] text-[11px] font-mono text-[#111311]">
                      <span className="text-[#5C605C]">{isBn ? "প্রস্তুতকারক:" : "Manufacturer:"}</span>{" "}
                      <strong className="font-semibold">{identity.manufacturer}</strong>
                    </span>
                  )}
                  {identity.series && (
                    <span className="px-3 py-1 rounded-full bg-white border border-[#DDE1DC] text-[11px] font-mono text-[#111311]">
                      <span className="text-[#5C605C]">{isBn ? "সিরিজ:" : "Series:"}</span>{" "}
                      <strong className="font-semibold">{identity.series}</strong>
                    </span>
                  )}
                  {identity.manufacturerModel && (
                    <span className="px-3 py-1 rounded-full bg-white border border-[#DDE1DC] text-[11px] font-mono text-[#111311]">
                      <span className="text-[#5C605C]">{isBn ? "মডেল:" : "Model:"}</span>{" "}
                      <span className="font-medium">{identity.manufacturerModel}</span>
                    </span>
                  )}
                  {identity.noorSku && (
                    <span className="px-3 py-1 rounded-full bg-[#EDEDED] text-[11px] font-mono text-[#111311]">
                      <span className="text-[#5C605C]">{isBn ? "নূর এসকেইউ:" : "Noor SKU:"}</span>{" "}
                      <span className="font-medium">{identity.noorSku}</span>
                    </span>
                  )}
                  {identity.originCountry && (
                    <span className="px-3 py-1 rounded-full bg-white border border-[#DDE1DC] text-[11px] font-mono text-[#111311]">
                      <span className="text-[#5C605C]">{isBn ? "উৎস দেশ:" : "Origin:"}</span>{" "}
                      <span className="font-medium">{identity.originCountry}</span>
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
                  {identity.manufacturer && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#5C605C] font-mono">
                        {isBn ? "প্রস্তুতকারক ও ব্র্যান্ড:" : "Manufacturer / Brand:"}
                      </span>
                      <span className="font-mono font-bold text-[#111311] bg-white px-2.5 py-0.5 rounded-full">
                        {identity.manufacturer} {identity.series ? `(${identity.series})` : ""}
                      </span>
                    </div>
                  )}

                  {identity.manufacturerModel && (
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-[#DDE1DC]">
                      <span className="text-[#5C605C] font-mono">
                        {isBn ? "প্রস্তুতকারক মডেল:" : "Manufacturer Model:"}
                      </span>
                      <span className="font-mono font-medium text-[#111311]">
                        {identity.manufacturerModel}
                      </span>
                    </div>
                  )}

                  {identity.noorSku && (
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-[#DDE1DC]">
                      <span className="text-[#5C605C] font-mono">
                        {isBn ? "অভ্যন্তরীণ নূর এসকেইউ (SKU):" : "Internal Noor SKU:"}
                      </span>
                      <span className="font-mono font-bold text-[#111311]">
                        {identity.noorSku}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-[#DDE1DC]">
                    <span className="text-[#5C605C] font-mono">
                      {isBn ? "স্টক প্রাপ্যতা:" : "Stock Availability:"}
                    </span>
                    <span className="font-mono font-bold text-[#111311] bg-white px-2.5 py-0.5 rounded-full">
                      {product.stockStatus === "IN_STOCK"
                        ? (isBn ? "ঢাকা ওয়্যারহাউস রেডি স্টক" : "Dhaka Warehouse In-Stock")
                        : product.stockStatus === "INCOMING"
                        ? (isBn ? "আসন্ন চালান" : "Incoming Shipment")
                        : (isBn ? "অনুরোধ সাপেক্ষে / কনটেইনার অর্ডার" : "On Request / Container Indent")}
                    </span>
                  </div>

                  {product.moq ? (
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-[#DDE1DC]">
                      <span className="text-[#5C605C] font-mono flex items-center gap-1.5">
                        <Box className="w-3.5 h-3.5 text-[#111311]" />
                        {isBn ? "ন্যূনতম অর্ডার পরিমাণ (MOQ):" : "Minimum Order Quantity (MOQ):"}
                      </span>
                      <span className="font-mono font-bold text-[#111311]">
                        {product.moq}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-[#DDE1DC]">
                      <span className="text-[#5C605C] font-mono flex items-center gap-1.5">
                        <Box className="w-3.5 h-3.5 text-[#111311]" />
                        {isBn ? "পাইকারি অর্ডার স্তর:" : "Wholesale Tier:"}
                      </span>
                      <span className="font-mono font-medium text-[#111311]">
                        {isBn ? "১ প্যালেট থেকে পাইকারি অর্ডার" : "Wholesale orders from 1 pallet"}
                      </span>
                    </div>
                  )}

                  {/* B2B Wholesale / Container Pricing Availability */}
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-[#DDE1DC]">
                    <span className="text-[#5C605C] font-mono">
                      {isBn ? "কনটেইনার ক্রয়:" : "Container Inquiries:"}
                    </span>
                    <span className="font-mono font-semibold text-[#111311] bg-white px-2.5 py-0.5 rounded-full">
                      {isBn ? "অনুরোধে কনটেইনার পাইকারি মূল্য" : "Container pricing available on request"}
                    </span>
                  </div>

                  {product.leadTime && (
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-[#DDE1DC]">
                      <span className="text-[#5C605C] font-mono flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#111311]" />
                        {isBn ? "ডেলিভারি সময়সীমা:" : "Delivery Lead Time:"}
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
                  <span>{isBn ? "পাইকারি কোটেশন চান" : "Request Wholesale Quotation"}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>

                {docs.datasheet ? (
                  <a
                    href={docs.datasheet}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[#EDEDED] hover:bg-[#DDE1DC] text-[#111311] text-xs font-semibold font-mono transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isBn ? "ডেটাশিট ডাউনলোড করুন" : "Download Datasheet"}</span>
                  </a>
                ) : docs.warranty ? (
                  <a
                    href={docs.warranty}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[#EDEDED] hover:bg-[#DDE1DC] text-[#111311] text-xs font-semibold font-mono transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isBn ? "ওয়ারেন্টি ডাউনলোড" : "Download Warranty"}</span>
                  </a>
                ) : null}
              </div>

              {/* Wholesale Purchasing Reassurance Note */}
              <div className="mt-4 pt-3 border-t border-[#EDEDED] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#5C605C]">
                <span>
                  {isBn
                    ? "সরাসরি B2B পাইকারি সরবরাহ • ১ প্যালেট থেকে পাইকারি অর্ডার"
                    : "Direct B2B wholesale supply • Wholesale orders from 1 pallet"}
                </span>
                <span className="text-[#111311] font-semibold">
                  {isBn ? "অনুরোধে কনটেইনার মূল্য প্রযোজ্য" : "Container pricing available on request"}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Detailed Description & Technical Specifications Table */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20">
          
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="p-8 rounded-3xl bg-white border border-[#DDE1DC]">
              <h2 className="text-xl font-bold text-[#111311] tracking-tight mb-4">
                {isBn ? "কারিগরি সারসংক্ষেপ" : "Engineering Summary"}
              </h2>
              <div className="text-xs sm:text-sm text-[#5C605C] leading-relaxed space-y-4">
                <p>
                  {product.description ||
                    (isBn
                      ? "বাংলাদেশের আবহাওয়ায় দীর্ঘস্থায়ী স্থায়িত্ব এবং উচ্চ বিদ্যুৎ উৎপাদন নিশ্চিত করতে এই সোলার সরঞ্জামটি কঠোর আন্তর্জাতিক মান মেনে আমদানি করা হয়েছে।"
                      : "This solar equipment is imported according to strict quality compliance standards, ensuring long-term durability and high energy yield under Bangladesh climatic conditions.")}
                </p>
                <div className="pt-4 border-t border-[#EDEDED] flex items-center gap-2 text-xs font-mono text-[#111311]">
                  <ShieldCheck className="w-4 h-4 text-[#111311]" />
                  <span>{isBn ? "সম্পূর্ণ কারিগরি ডেটাশিট সহ সরবরাহকৃত" : "Supplied with Complete Technical Datasheet"}</span>
                </div>
              </div>
            </div>

            {hasDocs && (
              <div className="p-8 rounded-3xl bg-white border border-[#DDE1DC] space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-[#111311] tracking-tight">
                    {isBn ? "কারিগরি ডকুমেন্টস ও ডাউনলোড" : "Technical Documents"}
                  </h2>
                  <span className="text-[11px] font-mono text-[#5C605C] bg-[#EDEDED] px-2 py-0.5 rounded-full">
                    PDF / Docs
                  </span>
                </div>
                <p className="text-xs text-[#5C605C]">
                  {isBn
                    ? "প্রকল্প যাচাই ও ইঞ্জিনিয়ারিং অনুমোদনের জন্য অফিসিয়াল কারিগরি ফাইল ডাউনলোড করুন।"
                    : "Verified technical documents and compliance certificates for project engineering and approval."}
                </p>
                <div className="space-y-2 pt-2">
                  {docs.datasheet && (
                    <a
                      href={docs.datasheet}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-[#EDEDED] hover:bg-[#DDE1DC] transition-colors text-xs font-medium text-[#111311] group"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-[#111311]" />
                        <span>{isBn ? "প্রোডাক্ট ডেটাশিট (Datasheet PDF)" : "Product Datasheet (PDF)"}</span>
                      </div>
                      <Download className="w-4 h-4 text-[#5C605C] group-hover:text-[#111311] transition-colors" />
                    </a>
                  )}
                  {docs.warranty && (
                    <a
                      href={docs.warranty}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-[#EDEDED] hover:bg-[#DDE1DC] transition-colors text-xs font-medium text-[#111311] group"
                    >
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="w-4 h-4 text-[#111311]" />
                        <span>{isBn ? "ওয়ারেন্টি পলিসি ও শর্তাবলী" : "Warranty Document"}</span>
                      </div>
                      <Download className="w-4 h-4 text-[#5C605C] group-hover:text-[#111311] transition-colors" />
                    </a>
                  )}
                  {docs.certificate && (
                    <a
                      href={docs.certificate}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-[#EDEDED] hover:bg-[#DDE1DC] transition-colors text-xs font-medium text-[#111311] group"
                    >
                      <div className="flex items-center gap-3">
                        <Award className="w-4 h-4 text-[#111311]" />
                        <span>{isBn ? "আইইসি / কোয়ালিটি সার্টিফিকেট" : "IEC / Quality Certificate"}</span>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-[#5C605C] group-hover:text-[#111311] transition-colors" />
                    </a>
                  )}
                  {docs.manual && (
                    <a
                      href={docs.manual}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-[#EDEDED] hover:bg-[#DDE1DC] transition-colors text-xs font-medium text-[#111311] group"
                    >
                      <div className="flex items-center gap-3">
                        <FileCheck className="w-4 h-4 text-[#111311]" />
                        <span>{isBn ? "ইনস্টলেশন ও ও&এম ম্যানুয়াল" : "Installation Manual"}</span>
                      </div>
                      <Download className="w-4 h-4 text-[#5C605C] group-hover:text-[#111311] transition-colors" />
                    </a>
                  )}
                  {docs.testReport && (
                    <a
                      href={docs.testReport}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-[#EDEDED] hover:bg-[#DDE1DC] transition-colors text-xs font-medium text-[#111311] group"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-[#111311]" />
                        <span>{isBn ? "ফ্যাক্টরি টেস্ট ও ফ্ল্যাশ রিপোর্ট" : "Factory Test Report"}</span>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-[#5C605C] group-hover:text-[#111311] transition-colors" />
                    </a>
                  )}
                  {docs.packingSheet && (
                    <a
                      href={docs.packingSheet}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-[#EDEDED] hover:bg-[#DDE1DC] transition-colors text-xs font-medium text-[#111311] group"
                    >
                      <div className="flex items-center gap-3">
                        <Package className="w-4 h-4 text-[#111311]" />
                        <span>{isBn ? "প্যাকিং লিস্ট ও ওজনের বিবরণ" : "Packing Sheet / Dimensions"}</span>
                      </div>
                      <Download className="w-4 h-4 text-[#5C605C] group-hover:text-[#111311] transition-colors" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-7">
            <div className="p-8 rounded-3xl bg-white border border-[#DDE1DC]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#111311] tracking-tight">
                  {isBn ? "কারিগরি স্পেসিফিকেশন" : "Technical Specifications"}
                </h2>
                <span className="text-xs font-mono text-[#5C605C]">
                  {isBn ? "STC ল্যাব মানদণ্ড" : "STC Lab Standards"}
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
                  {isBn ? "কোটেশনের অনুরোধ জানালে বিস্তারিত ডেটাশিট সরবরাহ করা হবে।" : "Detailed specs available upon formal quote request."}
                </p>
              )}
            </div>
          </div>

        </div>

        {/* Customer Reviews Section */}
        <ProductReviewsSection
          productId={product.id}
          productName={product.name}
          reviews={reviews}
          totalReviews={totalReviews}
          averageRating={averageRating}
          publicSubmissionEnabled={publicReviewsEnabled}
        />

        {/* Related Products from Same Category */}
        {related.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-mono uppercase text-[#5C605C] block mb-1">
                  {isBn ? "সম্পর্কিত সুপারিশ" : "Matched Recommendations"}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#111311]">
                  {isBn ? `সম্পর্কিত ${product.category.name}` : `Related ${product.category.name}`}
                </h2>
              </div>
              <Link
                href={`/category/${product.category.slug}`}
                className="text-xs font-mono text-[#111311] hover:underline inline-flex items-center min-h-[44px] px-2"
              >
                {isBn ? "ক্যাটাগরি দেখুন" : "View Category"}
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
