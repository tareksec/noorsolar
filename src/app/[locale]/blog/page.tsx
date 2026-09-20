import React from "react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { AppImage as Image } from "@/components/ui/app-image";
import { getPublishedBlogPosts } from "@/lib/data/blog";
import { Clock, Calendar, ArrowRight, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";

interface BlogIndexPageProps {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    page?: string;
    tag?: string;
    q?: string;
  }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isBn = locale === "bn";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://noorsolaren.com";

  return {
    title: isBn
      ? "সোলার ইঞ্জিনিয়ারিং ব্লগ ও কারিগরি দিকনির্দেশনা — নূর সোলার এনার্জি"
      : "Solar Engineering Blog & Technical Insights — Noor Solar Energy",
    description: isBn
      ? "বাংলাদেশে বাণিজ্যিক রুফটপ সোলার প্যানেল ইনস্টলেশন এবং সরঞ্জাম নির্বাচনের বিশদ কারিগরি গাইড।"
      : "Expert technical articles, equipment selection guides, and commercial rooftop solar installation best practices in Bangladesh.",
    alternates: {
      canonical: isBn ? `${siteUrl}/bn/blog` : `${siteUrl}/blog`,
      languages: {
        en: `${siteUrl}/blog`,
        bn: `${siteUrl}/bn/blog`,
        "x-default": `${siteUrl}/blog`,
      },
    },
    openGraph: {
      title: isBn
        ? "সোলার ইঞ্জিনিয়ারিং ব্লগ — নূর সোলার এনার্জি"
        : "Solar Engineering Blog & Technical Insights — Noor Solar Energy",
      description: isBn
        ? "বাংলাদেশে বাণিজ্যিক সোলার প্রজেক্টের কারিগরি প্রকাশনা ও দিকনির্দেশনা।"
        : "Expert technical articles, equipment selection guides, and commercial rooftop solar installation best practices in Bangladesh.",
      url: isBn ? "/bn/blog" : "/blog",
      type: "website",
      locale: isBn ? "bn_BD" : "en_US",
    },
  };
}

export default async function BlogIndexPage({ params, searchParams }: BlogIndexPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { page = "1", tag = "", q = "" } = await searchParams;
  const currentPage = Math.max(1, parseInt(page, 10) || 1);

  const { posts, totalPages, totalCount } = await getPublishedBlogPosts({
    page: currentPage,
    pageSize: 9,
    tag: tag || undefined,
    query: q || undefined,
    locale,
  });

  function buildPageUrl(p: number) {
    const searchParamObj = new URLSearchParams();
    if (tag) searchParamObj.set("tag", tag);
    if (q) searchParamObj.set("q", q);
    if (p > 1) searchParamObj.set("page", String(p));
    const qs = searchParamObj.toString();
    return `/blog${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="pt-24 pb-20 sm:pb-32 bg-[#E4E7E4] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-[11px] font-mono text-[#111311] mb-3.5 border border-[#D5DDD2] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#CEF23E]" />
            <span>Technical Knowledge Base</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#111311]">
            Engineering & Industry Insights
          </h1>
          <p className="mt-4 text-sm sm:text-base text-[#525C4F] max-w-2xl mx-auto leading-relaxed">
            In-depth guides on industrial solar modules, high-capacity energy storage, inverter sizing, and compliance standards for commercial installations in Bangladesh.
          </p>
        </div>

        {/* Blog Post Grid */}
        {posts.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-[#DDE1DC] max-w-md mx-auto">
            <BookOpen className="w-10 h-10 text-[#5C605C] mx-auto mb-3 opacity-60" />
            <h2 className="text-base font-bold text-[#111311] mb-1">No Articles Found</h2>
            <p className="text-xs text-[#5C605C] mb-4">
              Check back soon for new technical publications and procurement guides.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#111311] text-[#CEF23E] text-xs font-semibold"
            >
              <span>Back to Home</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group flex flex-col rounded-[28px] bg-white border border-[#DDE1DC] overflow-hidden shadow-sm hover:shadow-md hover:border-[#111311]/20 transition-all duration-300"
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="relative w-full h-52 bg-[#EDEDED] overflow-hidden block"
                >
                  <Image
                    src={post.coverImage || "/photos/hero_commercial_rooftop_solar.jpg"}
                    alt={post.coverAlt || post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {post.tags && (
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                      {post.tags.split(",").slice(0, 2).map((t) => (
                        <span
                          key={t.trim()}
                          className="px-2.5 py-0.5 rounded-full bg-black/70 text-white text-[10px] font-mono backdrop-blur-xs"
                        >
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>

                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-[11px] font-mono text-[#5C605C] mb-2.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString(
                              locale === "bn" ? "bn-BD-u-nu-latn" : "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )
                          : "Recent"}
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readingTime}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-[#111311] tracking-tight group-hover:text-emerald-800 transition-colors line-clamp-2 mb-2">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>

                    {post.excerpt && (
                      <p className="text-xs sm:text-sm text-[#5C605C] line-clamp-3 leading-relaxed mb-4">
                        {post.excerpt}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[#EDEDED] flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[#5C605C]">
                      By {post.authorName || "Engineering Team"}
                    </span>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#111311] group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Read Article</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#111311]" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2 text-xs font-mono">
            <Link
              href={buildPageUrl(currentPage - 1)}
              className={`inline-flex items-center gap-1 px-4 py-2 rounded-full bg-white border border-[#DDE1DC] text-[#111311] ${
                currentPage <= 1
                  ? "opacity-30 pointer-events-none"
                  : "hover:bg-[#EDEDED] transition-colors"
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </Link>

            <span className="px-3 py-2 text-[#5C605C]">
              Page {currentPage} of {totalPages} ({totalCount} articles)
            </span>

            <Link
              href={buildPageUrl(currentPage + 1)}
              className={`inline-flex items-center gap-1 px-4 py-2 rounded-full bg-white border border-[#DDE1DC] text-[#111311] ${
                currentPage >= totalPages
                  ? "opacity-30 pointer-events-none"
                  : "hover:bg-[#EDEDED] transition-colors"
              }`}
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
