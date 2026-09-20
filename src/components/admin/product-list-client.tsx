"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { AppImage as Image } from "@/components/ui/app-image";
import { ExternalLink, Edit, Copy, Star, Trash2, CheckCircle, XCircle } from "lucide-react";
import {
  duplicateProductAction,
  bulkUpdateProductsAction,
  toggleProductFeaturedAction,
  toggleProductActiveAction,
} from "@/app/admin/actions/products";

interface ProductItem {
  id: string;
  name: string;
  nameBn?: string | null;
  slug: string;
  model: string | null;
  stockStatus: string;
  isActive: boolean;
  isFeatured: boolean;
  isDemo: boolean;
  priceBdt: number | null;
  category: {
    name: string;
    slug: string;
  };
  images: {
    url: string;
  }[];
  specs: {
    id: string;
  }[];
}

interface ProductListClientProps {
  products: ProductItem[];
  toggleProductActive: (formData: FormData) => Promise<void>;
  toggleProductFeatured: (formData: FormData) => Promise<void>;
}

export function ProductListClient({
  products,
  toggleProductActive,
  toggleProductFeatured,
}: ProductListClientProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const allSelected = products.length > 0 && selectedIds.length === products.length;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map((p) => p.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkAction = (action: "activate" | "deactivate" | "delete") => {
    if (selectedIds.length === 0) return;

    if (
      action === "delete" &&
      !confirm(
        `Are you sure you want to delete ${selectedIds.length} selected product(s)? This will remove them and their uploaded files permanently.`
      )
    ) {
      return;
    }

    startTransition(async () => {
      const fd = new FormData();
      fd.append("bulkAction", action);
      selectedIds.forEach((id) => fd.append("selectedIds[]", id));
      await bulkUpdateProductsAction(fd);
      setSelectedIds([]);
    });
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm font-mono text-[#5C605C] mb-2">No products matched your criteria.</p>
        <Link
          href="/admin/products"
          className="text-xs font-mono text-[#111311] underline hover:text-black"
        >
          Clear filters
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bulk Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-[#EDEDED] border border-[#DDE1DC] text-xs font-mono">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={handleSelectAll}
            className="rounded text-[#111311] cursor-pointer"
            id="selectAllHeader"
          />
          <label htmlFor="selectAllHeader" className="cursor-pointer font-medium text-[#111311]">
            Select all on page ({selectedIds.length} selected)
          </label>
        </div>

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[#5C605C]">Bulk Actions:</span>
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleBulkAction("activate")}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white hover:bg-emerald-50 text-emerald-800 border border-[#DDE1DC] disabled:opacity-50 transition-colors"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Activate</span>
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleBulkAction("deactivate")}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white hover:bg-amber-50 text-amber-800 border border-[#DDE1DC] disabled:opacity-50 transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Deactivate</span>
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleBulkAction("delete")}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      {/* Product List */}
      <div className="divide-y divide-[#EDEDED]">
        {products.map((p) => {
          const isSelected = selectedIds.includes(p.id);
          return (
            <div
              key={p.id}
              className={`py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-colors rounded-xl px-2 ${
                isSelected ? "bg-[#EDEDED]/50" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelectOne(p.id)}
                  className="rounded text-[#111311] cursor-pointer shrink-0"
                />

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
                    {!p.nameBn ? (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-100 text-amber-800 border border-amber-300">
                        BN missing
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-100 text-emerald-800 border border-emerald-300">
                        BN ✓
                      </span>
                    )}

                    {/* Status indicator button */}
                    <form
                      action={(fd) => {
                        startTransition(async () => {
                          if (toggleProductActive) {
                            await toggleProductActive(fd);
                          } else {
                            await toggleProductActiveAction(fd);
                          }
                        });
                      }}
                    >
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="current" value={String(p.isActive)} />
                      <button
                        type="submit"
                        id={`btn-toggle-active-${p.id}`}
                        disabled={isPending}
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

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                        p.stockStatus === "IN_STOCK"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : p.stockStatus === "INCOMING"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-[#EDEDED] text-[#5C605C] border border-[#DDE1DC]"
                      }`}
                    >
                      {p.stockStatus}
                    </span>

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
                <form
                  action={(fd) => {
                    startTransition(async () => {
                      if (toggleProductFeatured) {
                        await toggleProductFeatured(fd);
                      } else {
                        await toggleProductFeaturedAction(fd);
                      }
                    });
                  }}
                >
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="current" value={String(p.isFeatured)} />
                  <button
                    type="submit"
                    id={`btn-toggle-featured-${p.id}`}
                    disabled={isPending}
                    title="Toggle featured status"
                    className={`px-3 py-1.5 rounded-full text-xs font-mono inline-flex items-center gap-1.5 transition-colors ${
                      p.isFeatured
                        ? "bg-[#111311] text-[#CEF23E]"
                        : "bg-[#EDEDED] text-[#5C605C] hover:bg-[#DDE1DC]"
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${p.isFeatured ? "fill-[#CEF23E]" : ""}`} />
                    <span>{p.isFeatured ? "Featured" : "Make Featured"}</span>
                  </button>
                </form>

                {/* Duplicate Product */}
                <form
                  action={(fd) => {
                    startTransition(async () => {
                      await duplicateProductAction(fd);
                    });
                  }}
                >
                  <input type="hidden" name="id" value={p.id} />
                  <button
                    type="submit"
                    disabled={isPending}
                    title="Duplicate product"
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
          );
        })}
      </div>
    </div>
  );
}
