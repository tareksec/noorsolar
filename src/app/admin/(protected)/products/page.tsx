import React from "react";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { revalidatePublic } from "@/lib/revalidate";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductListClient } from "@/components/admin/product-list-client";

async function toggleProductFeatured(formData: FormData) {
  "use server";
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const id = formData.get("id") as string;
  const current = formData.get("current") === "true";

  if (id) {
    await db.product.update({
      where: { id },
      data: { isFeatured: !current },
    });
    revalidatePublic("/admin/products");
    revalidatePublic("/");
  }
}

async function toggleProductActive(formData: FormData) {
  "use server";
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const id = formData.get("id") as string;
  const current = formData.get("current") === "true";

  if (id) {
    await db.product.update({
      where: { id },
      data: { isActive: !current },
    });
    revalidatePublic("/admin/products");
    revalidatePublic("/products");
    revalidatePublic("/");
  }
}

interface AdminProductsPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    status?: string;
    stock?: string;
    page?: string;
  }>;
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const { q = "", category = "", status = "", stock = "", page = "1" } = await searchParams;

  const pageSize = 10;
  const currentPage = Math.max(1, parseInt(page, 10) || 1);

  const categories = await db.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const whereClause: Prisma.ProductWhereInput = {};

  if (q.trim()) {
    const query = q.trim();
    whereClause.OR = [
      { name: { contains: query } },
      { model: { contains: query } },
      { brand: { contains: query } },
    ];
  }

  if (category) {
    whereClause.categoryId = category;
  }

  if (status === "active") {
    whereClause.isActive = true;
  } else if (status === "inactive") {
    whereClause.isActive = false;
  } else if (status === "featured") {
    whereClause.isFeatured = true;
  }

  if (stock) {
    whereClause.stockStatus = stock;
  }

  const [totalCount, filteredCount, products] = await Promise.all([
    db.product.count(),
    db.product.count({ where: whereClause }),
    db.product.findMany({
      where: whereClause,
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
      orderBy: [{ categoryId: "asc" }, { sortOrder: "asc" }],
      include: {
        category: true,
        images: { take: 1, orderBy: { sortOrder: "asc" } },
        specs: true,
      },
    }),
  ]);

  const totalPages = Math.ceil(filteredCount / pageSize) || 1;

  function buildFilterUrl(newPage: number) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    if (status) params.set("status", status);
    if (stock) params.set("stock", stock);
    if (newPage > 1) params.set("page", String(newPage));
    const qs = params.toString();
    return `/admin/products${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111311] tracking-tight">
            Product Inventory
          </h1>
          <p className="text-xs text-[#5C605C]">
            Manage models, specifications, and featured catalog items ({filteredCount} of {totalCount} items)
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#111311] hover:bg-[#222622] text-[#CEF23E] text-xs font-semibold tracking-tight transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#DDE1DC] shadow-sm">
        <form method="GET" className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-grow w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5C605C]" />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search products by title, model code, or brand..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#EDEDED] text-xs text-[#111311] outline-none placeholder:text-[#5C605C] focus:ring-1 focus:ring-[#111311]"
            />
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full md:w-auto">
            <select
              name="category"
              defaultValue={category}
              className="px-3 py-2 rounded-2xl bg-[#EDEDED] text-xs font-mono text-[#111311] outline-none w-full sm:w-auto"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              name="status"
              defaultValue={status}
              className="px-3 py-2 rounded-2xl bg-[#EDEDED] text-xs font-mono text-[#111311] outline-none w-full sm:w-auto"
            >
              <option value="">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
              <option value="featured">Featured Only</option>
            </select>

            <select
              name="stock"
              defaultValue={stock}
              className="px-3 py-2 rounded-2xl bg-[#EDEDED] text-xs font-mono text-[#111311] outline-none w-full sm:w-auto"
            >
              <option value="">All Stock</option>
              <option value="IN_STOCK">In Stock</option>
              <option value="INCOMING">Incoming</option>
              <option value="ON_REQUEST">On Request</option>
            </select>

            <button
              type="submit"
              className="px-4 py-2 rounded-2xl bg-[#111311] hover:bg-[#222622] text-[#CEF23E] text-xs font-mono font-medium shrink-0 transition-colors"
            >
              Filter
            </button>

            {(q || category || status || stock) && (
              <Link
                href="/admin/products"
                className="px-3 py-2 rounded-2xl bg-[#EDEDED] text-[#5C605C] hover:text-[#111311] text-xs font-mono shrink-0 transition-colors"
              >
                Reset
              </Link>
            )}
          </div>
        </form>
      </div>

      {/* Product List Table / Cards */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#DDE1DC] shadow-sm">
        <ProductListClient
          products={products}
          toggleProductActive={toggleProductActive}
          toggleProductFeatured={toggleProductFeatured}
        />

        {/* Pagination Controls */}
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