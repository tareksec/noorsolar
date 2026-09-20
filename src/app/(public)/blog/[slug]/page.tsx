import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppImage as Image } from "@/components/ui/app-image";
import { getBlogPostBySlug } from "@/lib/data/blog";
import { MarkdownRenderer } from "@/components/blog/markdown-renderer";
import { ArrowLeft, Calendar, Clock, User, ArrowUpRight, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getBlogPostBySlug(slug);

  if (!data || !data.post) {
    return { title: "Article Not Found" };
  }

  const { post } = data;
  const title = post.metaTitle || `${post.title} — Noor Solar Energy`;
  const description = post.metaDescription || post.excerpt || `Technical article: ${post.title}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      authors: post.authorName ? [post.authorName] : undefined,
      images: post.coverImage ? [{ url: post.coverImage }] : [],
    },
  };
}

export default async function BlogPostDetailPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const data = await getBlogPostBySlug(slug);

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
      url: "https://noorsolarbd.com",
    },
  };

  return (
    <div className="pt-24 pb-20 sm:pb-32 bg-[#E4E7E4] min-h-screen">
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
            className="inline-flex items-center gap-2 text-xs font-mono text-[#5C605C] hover:text-[#111311] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to all articles</span>
          </Link>
        </div>

        {/* Article Container Card */}
        <article className="p-6 sm:p-10 lg:p-14 rounded-[36px] bg-white border border-[#DDE1DC] shadow-sm mb-12">
          {/* Header Metadata */}
          <div className="mb-8">
            {post.tags && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {post.tags.split(",").map((tag) => (
                  <span
                    key={tag.trim()}
                    className="px-3 py-1 rounded-full bg-[#EDEDED] text-[11px] font-mono text-[#111311]"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#111311] leading-tight mb-6">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#5C605C] pb-6 border-b border-[#EDEDED]">
              <span className="flex items-center gap-1.5 text-[#111311] font-medium">
                <User className="w-3.5 h-3.5 text-[#5C605C]" />
                {post.authorName || "Noor Solar Engineering Team"}
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Recently Published"}
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
            <div className="relative w-full h-64 sm:h-96 md:h-[420px] rounded-3xl overflow-hidden bg-[#EDEDED] border border-[#DDE1DC] mb-10">
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
            <div className="text-base sm:text-lg text-[#525C4F] font-medium leading-relaxed mb-8 pb-6 border-b border-[#EDEDED]">
              {post.excerpt}
            </div>
          )}

          {/* Markdown Body */}
          <div className="mb-12">
            <MarkdownRenderer content={post.content} />
          </div>

          {/* Wholesale Quote Call-to-Action Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#111311] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md mt-12">
            <div>
              <span className="text-[11px] font-mono text-[#CEF23E] uppercase tracking-wider block mb-1">
                Direct B2B Importer
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">
                Need Commercial Equipment for Your Project?
              </h2>
              <p className="text-xs sm:text-sm text-white/70 max-w-xl">
                Get Tier-1 manufacturer direct wholesale pricing, complete compliance documentation, and Dhaka warehouse delivery lead times.
              </p>
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#CEF23E] hover:bg-[#bce02b] text-[#111311] font-bold text-xs font-mono tracking-tight shrink-0 transition-transform active:scale-95 shadow-sm"
            >
              <span>Request A Quote</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </article>

        {/* Related Posts Section */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-[#111311] tracking-tight mb-6">
              Related Technical Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/blog/${rel.slug}`}
                  className="group p-5 rounded-3xl bg-white border border-[#DDE1DC] shadow-xs hover:border-[#111311]/20 transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-mono text-[#5C605C] block mb-1.5">
                      {rel.readingTime}
                    </span>
                    <h3 className="text-sm font-bold text-[#111311] group-hover:text-emerald-800 transition-colors line-clamp-2 mb-2">
                      {rel.title}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-[#EDEDED] flex items-center justify-between text-xs font-mono text-[#111311] mt-3">
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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
