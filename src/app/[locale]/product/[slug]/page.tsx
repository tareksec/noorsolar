import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getProductBySlug } from "@/lib/data/products";
import { getApprovedReviewsForProduct, isPublicReviewsEnabled } from "@/lib/data/reviews";
import { ProductCard } from "@/components/product/product-card";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductReviewsSection } from "@/components/product/product-reviews-section";
import { ArrowUpRight, Box, Clock, Download, ShieldCheck } from "lucide-react";

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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://noorsolaren.com";
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
      url: isBn ? `/bn/product/${product.slug}` : `/product/${product.slug}`,
      type: "website",
      locale: isBn ? "bn_BD" : "en_US",
      images: product.images[0]?.url ? [{ url: product.images[0].url }] : [],
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
        <div className="flex items-center gap-2 text-xs font-mono text-[#5C605C] mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-[#111311] transition-colors">
            {isBn ? "হোম" : "Home"}
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#111311] transition-colors">
            {isBn ? "পণ্যসমূহ" : "Products"}
          </Link>
          <span>/</span>
          <Link
            href={`/category/${product.category.slug}`}
            className="hover:text-[#111311] transition-colors"
          >
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-[#111311] font-medium truncate max-w-[200px]">
            {product.name}
          </span>
        </div>

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
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-[#EDEDED] text-[11px] font-mono text-[#111311]">
                    {product.category.name}
                  </span>
                  {product.model && (
                    <span className="text-xs font-mono text-[#5C605C]">
                      {isBn ? "মডেল:" : "Model:"} {product.model}
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

                  {product.moq && (
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-[#DDE1DC]">
                      <span className="text-[#5C605C] font-mono flex items-center gap-1.5">
                        <Box className="w-3.5 h-3.5 text-[#111311]" />
                        {isBn ? "ন্যূনতম অর্ডার পরিমাণ:" : "Minimum Order Quantity:"}
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

                {product.datasheetUrl && (
                  <a
                    href={product.datasheetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[#EDEDED] hover:bg-[#DDE1DC] text-[#111311] text-xs font-semibold font-mono transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isBn ? "ডেটাশিট ডাউনলোড করুন" : "Download Datasheet"}</span>
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
                className="text-xs font-mono text-[#111311] hover:underline"
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
    <div className="grid grid-cols-1 lg:grid-cols-[.8fr_1.2fr] gap-8 mb-16">
      <section className="p-6 sm:p-8 rounded-3xl bg-[#EDEDED] self-start"><p className="eyebrow">Product overview</p><h2 className="text-2xl font-semibold tracking-tight mt-3 mb-5">The details that matter.</h2><p className="whitespace-pre-line text-sm text-[#5C605C] leading-relaxed">{product.description || "Contact our sales team to discuss specifications, quantities and documents for this product."}</p><p className="text-xs text-[#5C605C] leading-relaxed border-t border-[#CDD3C8] mt-6 pt-5">Confirm the required specifications and current order terms when requesting your quotation.</p></section>
      <section id="specifications" className="p-5 sm:p-8 rounded-3xl bg-white border border-[#DDE1DC] min-w-0"><h2 className="text-2xl font-semibold tracking-tight mb-6">Technical specifications</h2>
        {product.specs.length ? <table className="w-full text-sm border-collapse"><caption className="sr-only">Specifications for {product.name}</caption><tbody>{product.specs.map(spec => <tr key={spec.id} className="border-t border-[#E4E7E4]"><th scope="row" className="py-4 pr-5 text-left font-normal text-[#5C605C] w-1/2 align-top">{spec.label}</th><td className="py-4 text-right font-mono text-xs font-medium break-words">{spec.value}</td></tr>)}</tbody></table> : <p className="text-sm text-[#5C605C]">Ask for specifications in your quote request.</p>}
      </section>
    </div>
    {related.length > 0 && <section><div className="section-heading"><div><p className="eyebrow">Compare your options</p><h2>Also in {product.category.name.toLowerCase()}.</h2></div><Link href={"/category/" + product.category.slug} className="text-link shrink-0">View category ↗</Link></div><div className="catalog-grid">{related.map(item => <ProductCard key={item.id} product={item} />)}</div></section>}
  </div></div>;
}

