import React from "react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { AppImage as Image } from "@/components/ui/app-image";
import { getPublishedBlogPosts } from "@/lib/data/blog";
import { Clock, Calendar, ArrowRight, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { SITE_URL } from "@/lib/site-config";

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
  const siteUrl = SITE_URL;

  return {
    title: isBn
      ? "বাণিজ্যিক সোলার প্রকিউরমেন্ট ও কারিগরি গাইড — নূর সোলার এনার্জি"
      : "Commercial Solar Knowledge & Procurement Insights — Noor Solar Energy",
    description: isBn
      ? "বাংলাদেশে বাণিজ্যিক ও শিল্প সোলার প্রকল্প, ইনভার্টার সাইজিং এবং প্রকিউরমেন্ট গাইড।"
      : "Technical guides, equipment selection benchmarks, and procurement insights for commercial solar EPCs and industrial developers in Bangladesh.",
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
        ? "বাণিজ্যিক সোলার প্রকিউরমেন্ট ও কারিগরি গাইড — নূর সোলার এনার্জি"
        : "Commercial Solar Knowledge & Procurement Insights — Noor Solar Energy",
      description: isBn
        ? "বাংলাদেশে বাণিজ্যিক সোলার প্রজেক্টের কারিগরি প্রকাশনা ও প্রকিউরমেন্ট দিকনির্দেশনা।"
        : "Technical guides, equipment selection benchmarks, and procurement insights for commercial solar EPCs and industrial developers in Bangladesh.",
      url: isBn ? "/bn/blog" : "/blog",
      type: "website",
      locale: isBn ? "bn_BD" : "en_US",
      images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Noor Solar Energy" }],
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

  function buildPageUrl(p: number, newTag?: string) {
    const searchParamObj = new URLSearchParams();
    const activeTag = newTag !== undefined ? newTag : tag;
    if (activeTag) searchParamObj.set("tag", activeTag);
    if (q) searchParamObj.set("q", q);
    if (p > 1) searchParamObj.set("page", String(p));
    const qs = searchParamObj.toString();
    return `/blog${qs ? `?${qs}` : ""}`;
  }

  const isBn = locale === "bn";

  const b2bCategories = [
    { label: isBn ? "সব বিষয়" : "All Knowledge", tagValue: "" },
    { label: isBn ? "টেকনিক্যাল গাইড" : "Technical Guides", tagValue: "Engineering" },
    { label: isBn ? "প্রকিউরমেন্ট ইনসাইট" : "Procurement Insights", tagValue: "Procurement" },
    { label: isBn ? "সোলার ইকুইপমেন্ট গাইড" : "Solar Equipment Guides", tagValue: "Inverters" },
    { label: isBn ? "কমার্শিয়াল সোলার জ্ঞান" : "Commercial Solar Knowledge", tagValue: "B2B" },
  ];

  return (
    <div className="pt-8 md:pt-24 pb-20 sm:pb-32 bg-[#F7F8F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-[11px] font-mono text-[#074031] mb-3.5 border border-[#DCE4E0] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#FEBE16]" />
            <span>{isBn ? "বাণিজ্যিক প্রকিউরমেন্ট ও ইঞ্জিনিয়ারিং জ্ঞান" : "B2B Procurement & Engineering Intelligence"}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#074031]">
            {isBn ? "বাণিজ্যিক সোলার প্রকিউরমেন্ট ও কারিগরি গাইড" : "Commercial Solar Knowledge & Procurement Insights"}
          </h1>
          <p className="mt-4 text-sm sm:text-base text-[#62706A] max-w-2xl mx-auto leading-relaxed">
            {isBn
              ? "বাণিজ্যিক ইপিসি, শিল্প কারখানা ও সৌর ডিলারদের জন্য সোলার প্যানেল নির্বাচন, হাই-ভোল্টেজ ব্যাটারি স্টোরেজ ও ইনভার্টার সাইজিংয়ের বিশদ কারিগরি দিকনির্দেশনা।"
              : "Technical guides, equipment selection benchmarks, and wholesale procurement insights for commercial solar EPCs, factory engineers, and solar equipment dealers in Bangladesh."}
          </p>

          {/* B2B Category Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {b2bCategories.map((cat) => {
              const isActive = (tag || "") === cat.tagValue;
              return (
                <Link
                  key={cat.label}
                  href={buildPageUrl(1, cat.tagValue)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
                    isActive
                      ? "bg-[#074031] text-[#FEBE16] shadow-xs font-bold"
                      : "bg-white text-[#62706A] hover:text-[#074031] border border-[#DCE4E0] hover:border-[#074031]/30"
                  }`}
                >
                  {cat.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Blog Post Grid */}
        {posts.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-[#DCE4E0] max-w-md mx-auto">
            <BookOpen className="w-10 h-10 text-[#62706A] mx-auto mb-3 opacity-60" />
            <h2 className="text-base font-bold text-[#074031] mb-1">
              {isBn ? "কোনো আর্টিকেল পাওয়া যায়নি" : "No Articles Found"}
            </h2>
            <p className="text-xs text-[#62706A] mb-4">
              {isBn
                ? "নতুন প্রযুক্তিগত প্রকাশনা ও ক্রয়ের গাইডের জন্য শীঘ্রই আবার দেখুন।"
                : "Check back soon for new technical publications and procurement guides."}
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center min-h-[44px] gap-2 px-5 py-2.5 rounded-full bg-[#FEBE16] text-[#052F25] text-xs font-bold hover:bg-[#E4A900] shadow-sm"
            >
              <span>{isBn ? "হোমে ফিরুন" : "Back to Home"}</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group flex flex-col rounded-[28px] bg-white border border-[#DCE4E0] overflow-hidden shadow-sm hover:shadow-md hover:border-[#074031]/30 transition-all duration-300"
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="relative w-full h-52 bg-[#F1F4F1] overflow-hidden block"
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
                          className="px-2.5 py-0.5 rounded-full bg-[#052F25]/85 text-white text-[10px] font-mono backdrop-blur-xs"
                        >
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>

                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-[11px] font-mono text-[#62706A] mb-2.5">
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
                          : (isBn ? "সাম্প্রতিক" : "Recent")}
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readingTime}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-[#074031] tracking-tight group-hover:text-[#0B513E] transition-colors line-clamp-2 mb-2">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>

                    {post.excerpt && (
                      <p className="text-xs sm:text-sm text-[#62706A] line-clamp-3 leading-relaxed mb-4">
                        {post.excerpt}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[#DCE4E0] flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[#62706A]">
                      {isBn
                        ? `লেখক: ${post.authorName || "ইঞ্জিনিয়ারিং টিম"}`
                        : `By ${post.authorName || "Engineering Team"}`}
                    </span>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#074031] group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>{isBn ? "সম্পূর্ণ পড়ুন" : "Read Article"}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#FEBE16]" />
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
              className={`inline-flex items-center gap-1 px-4 py-2 rounded-full bg-white border border-[#DCE4E0] text-[#074031] ${
                currentPage <= 1
                  ? "opacity-30 pointer-events-none"
                  : "hover:bg-[#F1F4F1] transition-colors"
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>{isBn ? "পূর্ববর্তী" : "Previous"}</span>
            </Link>

            <span className="px-3 py-2 text-[#62706A]">
              {isBn
                ? `পৃষ্ঠা ${currentPage} / ${totalPages} (মোট ${totalCount}টি আর্টিকেল)`
                : `Page ${currentPage} of ${totalPages} (${totalCount} articles)`}
            </span>

            <Link
              href={buildPageUrl(currentPage + 1)}
              className={`inline-flex items-center gap-1 px-4 py-2 rounded-full bg-white border border-[#DCE4E0] text-[#074031] ${
                currentPage >= totalPages
                  ? "opacity-30 pointer-events-none"
                  : "hover:bg-[#F1F4F1] transition-colors"
              }`}
            >
              <span>{isBn ? "পরবর্তী" : "Next"}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
