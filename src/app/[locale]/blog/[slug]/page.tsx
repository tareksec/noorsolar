import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { AppImage as Image } from "@/components/ui/app-image";
import { getBlogPostBySlug } from "@/lib/data/blog";
import { MarkdownRenderer } from "@/components/blog/markdown-renderer";
import { ArrowLeft, Calendar, Clock, User, ArrowUpRight, ArrowRight } from "lucide-react";
import { SITE_URL } from "@/lib/site-config";

export const dynamic = "force-dynamic";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const isBn = locale === "bn";
  const siteUrl = SITE_URL;
  const data = await getBlogPostBySlug(slug, locale);

  if (!data || !data.post) {
    return { title: isBn ? "নিবন্ধটি পাওয়া যায়নি" : "Article Not Found" };
  }

  const { post } = data;
  const title =
    post.metaTitle ||
    (isBn ? `${post.title} — নূর সোলার এনার্জি` : `${post.title} — Noor Solar Energy`);
  const description =
    post.metaDescription ||
    post.excerpt ||
    (isBn ? `${post.title} সম্পর্কে বিস্তারিত কারিগরি নিবন্ধ।` : `Technical article: ${post.title}`);
  const hasBn = !!post.contentBn?.trim();

  return {
    title,
    description,
    alternates: {
      canonical: isBn ? `${siteUrl}/bn/blog/${post.slug}` : `${siteUrl}/blog/${post.slug}`,
      languages: {
        en: `${siteUrl}/blog/${post.slug}`,
        bn: hasBn ? `${siteUrl}/bn/blog/${post.slug}` : `${siteUrl}/bn/blog`,
        "x-default": `${siteUrl}/blog/${post.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: isBn ? `/bn/blog/${post.slug}` : `/blog/${post.slug}`,
      type: "article",
      locale: isBn ? "bn_BD" : "en_US",
      publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      authors: post.authorName ? [post.authorName] : undefined,
      images: post.coverImage ? [{ url: post.coverImage }] : [],
    },
  };
}

export default async function BlogPostDetailPage({ params }: BlogPostPageProps) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const data = await getBlogPostBySlug(slug, locale);

  if (!data || !data.post) {
    notFound();
  }

  const { post, related } = data;

  // Schema.org Article JSON-LD
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || post.title,
    image: post.coverImage ? [post.coverImage] : [],
    datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
    dateModified: new Date(post.updatedAt).toISOString(),
    author: {
      "@type": "Person",
      name: post.authorName || "Noor Solar Engineering Team",
    },
    publisher: {
      "@type": "Organization",
      name: "Noor Solar Energy",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/brand/logo-default.png`,
      },
    },
  };

  const isBn = locale === "bn";

  return (
    <div className="pt-24 pb-20 sm:pb-32 bg-[#F7F8F5] min-h-screen">
      {/* Schema.org Article structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-mono text-[#62706A] hover:text-[#074031] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isBn ? "সকল আর্টিকেলে ফিরুন" : "Back to all articles"}</span>
          </Link>
        </div>

        {/* Article Container Card */}
        <article className="p-6 sm:p-10 lg:p-14 rounded-[36px] bg-white border border-[#DCE4E0] shadow-sm mb-12">
          {/* Header Metadata */}
          <div className="mb-8">
            {post.tags && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {post.tags.split(",").map((tag: string) => (
                  <span
                    key={tag.trim()}
                    className="px-3 py-1 rounded-full bg-[#F1F4F1] border border-[#DCE4E0] text-[11px] font-mono text-[#074031]"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#074031] leading-tight mb-6">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#62706A] pb-6 border-b border-[#DCE4E0]">
              <span className="flex items-center gap-1.5 text-[#074031] font-medium">
                <User className="w-3.5 h-3.5 text-[#62706A]" />
                {post.authorName || (isBn ? "নূর সোলার ইঞ্জিনিয়ারিং টিম" : "Noor Solar Engineering Team")}
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString(
                      locale === "bn" ? "bn-BD-u-nu-latn" : "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }
                    )
                  : (isBn ? "সম্প্রতি প্রকাশিত" : "Recently Published")}
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {post.readingTime}
              </span>
            </div>
          </div>

          {/* Cover Hero Image */}
          {post.coverImage && (
            <div className="relative w-full h-64 sm:h-96 md:h-[420px] rounded-3xl overflow-hidden bg-[#F1F4F1] border border-[#DCE4E0] mb-10">
              <Image
                src={post.coverImage}
                alt={post.coverAlt || post.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-cover"
              />
            </div>
          )}

          {/* Excerpt Lead */}
          {post.excerpt && (
            <div className="text-base sm:text-lg text-[#62706A] font-medium leading-relaxed mb-8 pb-6 border-b border-[#DCE4E0]">
              {post.excerpt}
            </div>
          )}

          {/* Markdown Body */}
          <div className="mb-12">
            <MarkdownRenderer content={post.content} />
          </div>

          {/* Wholesale Quote Call-to-Action Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#074031] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md mt-12">
            <div>
              <span className="text-[11px] font-mono text-[#FEBE16] uppercase tracking-wider block mb-1 font-semibold">
                {isBn ? "সরাসরি B2B আমদানিকারক" : "Direct B2B Importer"}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">
                {isBn ? "আপনার প্রকল্পের জন্য বাণিজ্যিক সোলার সরঞ্জাম প্রয়োজন?" : "Need Commercial Equipment for Your Project?"}
              </h2>
              <p className="text-xs sm:text-sm text-white/80 max-w-xl">
                {isBn
                  ? "সরাসরি প্রস্তুতকারক থেকে পাইকারি মূল্য, শতভাগ কমপ্লায়েন্স ডকুমেন্টস এবং ঢাকা ডিপো থেকে দ্রুত ডেলিভারি সুবিধা নিন।"
                  : "Get manufacturer-direct wholesale pricing, complete compliance documentation, and Dhaka warehouse delivery lead times."}
              </p>
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#FEBE16] hover:bg-[#E4A900] text-[#052F25] font-bold text-xs font-mono tracking-tight shrink-0 transition-transform active:scale-95 shadow-sm"
            >
              <span>{isBn ? "কোটেশনের অনুরোধ পাঠান" : "Request A Quote"}</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </article>

        {/* Related Posts Section */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-[#074031] tracking-tight mb-6">
              {isBn ? "সম্পর্কিত কারিগরি আর্টিকেল" : "Related Technical Articles"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/blog/${rel.slug}`}
                  className="group p-5 rounded-3xl bg-white border border-[#DCE4E0] shadow-xs hover:border-[#074031]/30 transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-mono text-[#62706A] block mb-1.5">
                      {rel.readingTime}
                    </span>
                    <h3 className="text-sm font-bold text-[#074031] group-hover:text-[#0B513E] transition-colors line-clamp-2 mb-2">
                      {rel.title}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-[#DCE4E0] flex items-center justify-between text-xs font-mono text-[#074031] mt-3">
                    <span>{isBn ? "পড়ুন" : "Read"}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#FEBE16] group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
