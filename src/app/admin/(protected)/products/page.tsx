import React from "react";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { AppImage as Image } from "@/components/ui/app-image";
import Link from "next/link";
import { ExternalLink, Plus, Edit, Copy, Search } from "lucide-react";
import { duplicateProductAction } from "@/app/admin/actions/products";

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
    revalidatePath("/admin/products");
    revalidatePath("/");
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
    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");
  }
}

interface AdminProductsPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    status?: string;
  }>;
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const { q = "", category = "", status = "" } = await searchParams;

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

  const products = await db.product.findMany({
    where: whereClause,
    orderBy: [{ categoryId: "asc" }, { sortOrder: "asc" }],
    include: {
      category: true,
      images: { take: 1, orderBy: { sortOrder: "asc" } },
      specs: true,
    },
  });

  const totalCount = await db.product.count();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111311] tracking-tight">
            Product Inventory
          </h1>
          <p className="text-xs text-[#5C605C]">
            Manage models, specifications, and featured catalog items ({products.length} of {totalCount} shown)
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

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              name="category"
              defaultValue={category}
              className="px-3 py-2 rounded-2xl bg-[#EDEDED] text-xs font-mono text-[#111311] outline-none w-full md:w-auto"
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
              className="px-3 py-2 rounded-2xl bg-[#EDEDED] text-xs font-mono text-[#111311] outline-none w-full md:w-auto"
            >
              <option value="">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
              <option value="featured">Featured Only</option>
            </select>

            <button
              type="submit"
              className="px-4 py-2 rounded-2xl bg-[#111311] hover:bg-[#222622] text-[#CEF23E] text-xs font-mono font-medium shrink-0 transition-colors"
            >
              Filter
            </button>

            {(q || category || status) && (
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

      {/* Product List */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#DDE1DC] shadow-sm">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm font-mono text-[#5C605C] mb-2">No products matched your criteria.</p>
            <Link
              href="/admin/products"
              className="text-xs font-mono text-[#111311] underline hover:text-black"
            >
              Clear filters
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#EDEDED]">
            {products.map((p) => (
              <div
                key={p.id}
                className="py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-[#EDEDED] border border-[#DDE1DC] shrink-0">
                    <Image
                      src={p.images[0]?.url || "/demo/category-panels.svg"}
                      alt={p.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="font-bold text-sm text-[#111311]">{p.name}</span>

                      {/* Status indicator */}
                      <form action={toggleProductActive}>
                        <input type="hidden" name="id" value={p.id} />
                        <input type="hidden" name="current" value={String(p.isActive)} />
                        <button
                          type="submit"
                          title="Click to toggle Active status"
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono cursor-pointer transition-colors ${
                            p.isActive
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                              : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                          }`}
                        >
                          {p.isActive ? "Active" : "Inactive"}
                        </button>
                      </form>

                      {p.isDemo && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#EDEDED] text-[#5C605C] border border-[#DDE1DC]">
                          Demo
                        </span>
                      )}
                      {p.isFeatured && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#CEF23E] text-[#111311]">
                          Featured
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#5C605C] font-mono mt-1">
                      <span>{p.category.name}</span>
                      <span>&bull;</span>
                      <span>{p.model || "No model code"}</span>
                      <span>&bull;</span>
                      <span>{p.specs.length} specs</span>
                      {p.priceBdt && (
                        <>
                          <span>&bull;</span>
                          <span>{p.priceBdt.toLocaleString()} BDT</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end lg:self-auto flex-wrap">
                  {/* Toggle Featured */}
                  <form action={toggleProductFeatured}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="current" value={String(p.isFeatured)} />
                    <button
                      type="submit"
                      title="Toggle featured status"
                      className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors ${
                        p.isFeatured
                          ? "bg-[#111311] text-[#CEF23E]"
                          : "bg-[#EDEDED] text-[#5C605C] hover:bg-[#DDE1DC]"
                      }`}
                    >
                      ★ {p.isFeatured ? "Featured" : "Make Featured"}
                    </button>
                  </form>

                  {/* Duplicate Product */}
                  <form action={duplicateProductAction}>
                    <input type="hidden" name="id" value={p.id} />
                    <button
                      type="submit"
                      title="Duplicate product (copies specs & images, sets inactive)"
                      className="px-3 py-1.5 rounded-full bg-[#EDEDED] hover:bg-[#DDE1DC] text-[#111311] text-xs font-mono inline-flex items-center gap-1 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5 text-[#5C605C]" />
                      <span>Duplicate</span>
                    </button>
                  </form>

                  {/* Edit */}
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="px-3 py-1.5 rounded-full bg-[#EDEDED] hover:bg-[#DDE1DC] text-[#111311] text-xs font-mono inline-flex items-center gap-1 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Link>

                  {/* Live View */}
                  <Link
                    href={`/product/${p.slug}`}
                    target="_blank"
                    className="p-2 rounded-full text-[#5C605C] hover:text-[#111311] hover:bg-[#EDEDED]"
                    title="View live product page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}