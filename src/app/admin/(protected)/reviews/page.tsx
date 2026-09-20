import React from "react";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { ReviewListClient } from "@/components/admin/review-list-client";

interface AdminReviewsPageProps {
  searchParams: Promise<{
    status?: string;
    productId?: string;
    page?: string;
  }>;
}

export default async function AdminReviewsPage({ searchParams }: AdminReviewsPageProps) {
  const { status = "ALL", productId = "ALL", page = "1" } = await searchParams;

  const pageSize = 15;
  const currentPage = Math.max(1, parseInt(page, 10) || 1);

  const whereClause: Prisma.ProductReviewWhereInput = {};

  if (status !== "ALL" && (status === "PENDING" || status === "APPROVED" || status === "REJECTED")) {
    whereClause.status = status;
  }

  if (productId !== "ALL" && productId) {
    whereClause.productId = productId;
  }

  const [totalCount, filteredCount, pendingCount, products, reviews] = await Promise.all([
    db.productReview.count(),
    db.productReview.count({ where: whereClause }),
    db.productReview.count({ where: { status: "PENDING" } }),
    db.product.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    }),
    db.productReview.findMany({
      where: whereClause,
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        product: {
          select: { id: true, name: true, slug: true, model: true },
        },
      },
    }),
  ]);

  const totalPages = Math.ceil(filteredCount / pageSize) || 1;

  function buildFilterUrl(newPage: number) {
    const params = new URLSearchParams();
    if (status !== "ALL") params.set("status", status);
    if (productId !== "ALL") params.set("productId", productId);
    if (newPage > 1) params.set("page", String(newPage));
    const qs = params.toString();
    return `/admin/reviews${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#111311] tracking-tight">
              Product Reviews & Moderation
            </h1>
            {pendingCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono font-bold text-xs">
                {pendingCount} Pending
              </span>
            )}
          </div>
          <p className="text-xs text-[#5C605C]">
            Approve public customer reviews or enter verified B2B client testimonials ({filteredCount} of {totalCount} items)
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#DDE1DC] shadow-sm">
        <form method="GET" className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 flex-grow sm:flex-grow-0">
            <Filter className="w-4 h-4 text-[#5C605C]" />
            <select
              name="status"
              defaultValue={status}
              className="px-3.5 py-2 rounded-2xl bg-[#EDEDED] text-xs font-mono text-[#111311] outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending Moderation</option>
              <option value="APPROVED">Approved (Visible)</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div className="flex-grow min-w-[200px]">
            <select
              name="productId"
              defaultValue={productId}
              className="w-full px-3.5 py-2 rounded-2xl bg-[#EDEDED] text-xs text-[#111311] outline-none"
            >
              <option value="ALL">All Equipment Products</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-2xl bg-[#111311] hover:bg-[#222622] text-[#CEF23E] text-xs font-mono font-medium shrink-0 transition-colors"
          >
            Apply Filters
          </button>

          {(status !== "ALL" || productId !== "ALL") && (
            <Link
              href="/admin/reviews"
              className="px-3 py-2 rounded-2xl bg-[#EDEDED] text-[#5C605C] hover:text-[#111311] text-xs font-mono shrink-0 transition-colors"
            >
              Reset
            </Link>
          )}
        </form>
      </div>

      {/* Interactive Review Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#DDE1DC] shadow-sm">
        <ReviewListClient reviews={reviews} products={products} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 pt-4 border-t border-[#EDEDED] flex items-center justify-between text-xs font-mono">
            <span className="text-[#5C605C]">
              Page {currentPage} of {totalPages} ({filteredCount} total)
            </span>
            <div className="flex items-center gap-2">
              <Link
                href={buildFilterUrl(currentPage - 1)}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#DDE1DC] text-[#111311] ${
                  currentPage <= 1
                    ? "opacity-30 pointer-events-none"
                    : "hover:bg-[#EDEDED] transition-colors"
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </Link>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                  <Link
                    key={pNum}
                    href={buildFilterUrl(pNum)}
                    className={`w-7 h-7 rounded-full inline-flex items-center justify-center transition-colors ${
                      pNum === currentPage
                        ? "bg-[#111311] text-[#CEF23E] font-bold"
                        : "text-[#5C605C] hover:bg-[#EDEDED]"
                    }`}
                  >
                    {pNum}
                  </Link>
                ))}
              </div>

              <Link
                href={buildFilterUrl(currentPage + 1)}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#DDE1DC] text-[#111311] ${
                  currentPage >= totalPages
                    ? "opacity-30 pointer-events-none"
                    : "hover:bg-[#EDEDED] transition-colors"
                }`}
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
