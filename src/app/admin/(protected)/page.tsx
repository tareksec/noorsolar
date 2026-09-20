import React from "react";
import { db } from "@/lib/db";
import Link from "next/link";
import {
  Package,
  MessageSquare,
  ArrowUpRight,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Star,
} from "lucide-react";
import { getLiveSampleContentSummary } from "@/lib/data/content";

export default async function AdminDashboardPage() {
  const [
    sampleSummary,
    productCount,
    categoryCount,
    newQuoteCount,
    publishedPostCount,
    draftPostCount,
    pendingReviewCount,
    approvedReviewCount,
    latestQuotes,
  ] = await Promise.all([
    getLiveSampleContentSummary(),
    db.product.count(),
    db.category.count(),
    db.quoteRequest.count({ where: { status: "NEW" } }),
    db.blogPost.count({ where: { status: "PUBLISHED" } }),
    db.blogPost.count({ where: { status: "DRAFT" } }),
    db.productReview.count({ where: { status: "PENDING" } }),
    db.productReview.count({ where: { status: "APPROVED" } }),
    db.quoteRequest.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { product: true },
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#111311] tracking-tight">
          Admin Overview
        </h1>
        <p className="text-xs sm:text-sm text-[#5C605C] mt-1">
          Catalog summary, blog publications, review moderation, and incoming inquiries
        </p>
      </div>

      {/* Warning Card: Live Sample Items */}
      {sampleSummary.totalLiveSamples > 0 && (
        <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-950 space-y-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span className="font-bold text-base font-mono">
              {sampleSummary.totalLiveSamples} sample items are still live
            </span>
          </div>
          <p className="text-xs text-amber-800">
            Placeholder content is currently visible on the public site. Review each list to replace with verified company data or click &apos;Mark as real&apos;:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {sampleSummary.statsCount > 0 && (
              <Link
                href="/admin/content/stats"
                className="px-3 py-1.5 rounded-xl bg-white border border-amber-500/30 text-xs font-mono font-bold text-[#111311] hover:bg-amber-50 flex items-center gap-1"
              >
                <span>Stats ({sampleSummary.statsCount})</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}
            {sampleSummary.certificationsCount > 0 && (
              <Link
                href="/admin/content/certifications"
                className="px-3 py-1.5 rounded-xl bg-white border border-amber-500/30 text-xs font-mono font-bold text-[#111311] hover:bg-amber-50 flex items-center gap-1"
              >
                <span>Certifications ({sampleSummary.certificationsCount})</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}
            {sampleSummary.partnersCount > 0 && (
              <Link
                href="/admin/content/partners"
                className="px-3 py-1.5 rounded-xl bg-white border border-amber-500/30 text-xs font-mono font-bold text-[#111311] hover:bg-amber-50 flex items-center gap-1"
              >
                <span>Partners ({sampleSummary.partnersCount})</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}
            {sampleSummary.testimonialsCount > 0 && (
              <Link
                href="/admin/content/testimonials"
                className="px-3 py-1.5 rounded-xl bg-white border border-amber-500/30 text-xs font-mono font-bold text-[#111311] hover:bg-amber-50 flex items-center gap-1"
              >
                <span>Testimonials ({sampleSummary.testimonialsCount})</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}
            {sampleSummary.faqCount > 0 && (
              <Link
                href="/admin/content/faq"
                className="px-3 py-1.5 rounded-xl bg-white border border-amber-500/30 text-xs font-mono font-bold text-[#111311] hover:bg-amber-50 flex items-center gap-1"
              >
                <span>FAQ ({sampleSummary.faqCount})</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* KPI Dashboard Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Products Card */}
        <Link
          href="/admin/products"
          className="p-6 rounded-3xl bg-white border border-[#DDE1DC] shadow-sm hover:border-[#111311]/30 transition-all block group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-[#5C605C] uppercase">Products</span>
            <div className="w-8 h-8 rounded-full bg-[#EDEDED] group-hover:bg-[#CEF23E]/40 flex items-center justify-center text-[#111311] transition-colors">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-bold font-mono text-[#111311]">
            {productCount}
          </span>
          <span className="text-xs text-[#5C605C] block mt-1">
            Across {categoryCount} categories
          </span>
        </Link>

        {/* Blog Posts Card */}
        <Link
          href="/admin/blog"
          className="p-6 rounded-3xl bg-white border border-[#DDE1DC] shadow-sm hover:border-[#111311]/30 transition-all block group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-[#5C605C] uppercase">Blog Posts</span>
            <div className="w-8 h-8 rounded-full bg-[#EDEDED] group-hover:bg-[#CEF23E]/40 flex items-center justify-center text-[#111311] transition-colors">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-[#111311]">
              {publishedPostCount}
            </span>
            <span className="text-xs font-mono text-emerald-700 font-medium">Published</span>
          </div>
          <span className="text-xs text-[#5C605C] block mt-1">
            {draftPostCount} draft {draftPostCount === 1 ? "article" : "articles"}
          </span>
        </Link>

        {/* Customer Reviews Card */}
        <Link
          href="/admin/reviews"
          className={`p-6 rounded-3xl bg-white border shadow-sm hover:border-[#111311]/30 transition-all block group ${
            pendingReviewCount > 0 ? "border-amber-400 bg-amber-50/20" : "border-[#DDE1DC]"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-[#5C605C] uppercase">Pending Reviews</span>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              pendingReviewCount > 0 ? "bg-amber-200 text-amber-900" : "bg-[#EDEDED] text-[#111311]"
            }`}>
              <Star className={`w-4 h-4 ${pendingReviewCount > 0 ? "fill-amber-500 text-amber-500" : ""}`} />
            </div>
          </div>
          <span className="text-3xl font-bold font-mono text-[#111311]">
            {pendingReviewCount}
          </span>
          <span className="text-xs text-[#5C605C] block mt-1">
            {approvedReviewCount} approved live reviews
          </span>
        </Link>

        {/* New Quotes Card */}
        <Link
          href="/admin/quotes"
          className="p-6 rounded-3xl bg-white border border-[#DDE1DC] shadow-sm hover:border-[#111311]/30 transition-all block group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-[#5C605C] uppercase">New Quotes</span>
            <div className="w-8 h-8 rounded-full bg-[#CEF23E]/30 flex items-center justify-center text-[#111311]">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-bold font-mono text-[#111311]">
            {newQuoteCount}
          </span>
          <span className="text-xs text-[#5C605C] block mt-1">
            Requiring follow-up
          </span>
        </Link>
      </div>

      {/* Latest Quotation Inquiries */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#DDE1DC] shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-[#111311]">
              Recent Wholesale Inquiries
            </h2>
            <p className="text-xs text-[#5C605C]">
              Direct commercial quote submissions from website visitors
            </p>
          </div>
          <Link
            href="/admin/quotes"
            className="text-xs font-mono text-[#111311] hover:underline flex items-center gap-1"
          >
            <span>View all</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {latestQuotes.length === 0 ? (
          <p className="text-xs font-mono text-[#5C605C] py-4 text-center">
            No inquiries received yet.
          </p>
        ) : (
          <div className="divide-y divide-[#EDEDED] overflow-x-auto">
            {latestQuotes.map((q) => (
              <div key={q.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#111311]">{q.name}</span>
                    {q.company && (
                      <span className="text-[#5C605C]">({q.company})</span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                        q.status === "NEW"
                          ? "bg-amber-100 text-amber-800"
                          : q.status === "CONTACTED"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {q.status}
                    </span>
                  </div>
                  <div className="text-[#5C605C] font-mono mt-0.5">
                    {q.phone} {q.location && `• ${q.location}`} {q.product && `• ${q.product.name}`}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] font-mono text-[#5C605C] block">
                    {new Date(q.createdAt).toLocaleDateString()}
                  </span>
                  {q.quantity && (
                    <span className="font-mono text-[#111311] font-semibold block">
                      Qty: {q.quantity}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}