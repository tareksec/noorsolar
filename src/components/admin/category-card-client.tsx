"use client";

import React, { useState, useActionState } from "react";
import { AppImage as Image } from "@/components/ui/app-image";
import Link from "next/link";
import { updateCategoryAction, CategoryActionResult } from "@/app/admin/actions/categories";
import { ExternalLink, Edit2, Check, X } from "lucide-react";

interface CategoryCardProps {
  category: {
    id: string;
    slug: string;
    name: string;
    description?: string | null;
    image?: string | null;
    sortOrder: number;
    _count: { products: number };
  };
}

const initialState: CategoryActionResult = { success: false };

export function CategoryCardClient({ category }: CategoryCardProps) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, isPending] = useActionState(updateCategoryAction, initialState);
  const isFormOpen = editing && !state.success;

  return (
    <div className="p-6 rounded-3xl bg-white border border-[#DDE1DC] shadow-sm flex flex-col justify-between">
      <div>
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#EDEDED] mb-4 border border-[#DDE1DC]">
          <Image
            src={category.image || "/demo/category-panels.svg"}
            alt={category.name}
            fill
            className="object-cover"
          />
        </div>

        {isFormOpen ? (
          <form action={formAction} className="space-y-3 mb-4">
            <input type="hidden" name="id" value={category.id} />
            <input type="hidden" name="name" value={category.name} />
            <input type="hidden" name="slug" value={category.slug} />

            <div>
              <label className="block text-[10px] font-mono text-[#5C605C] mb-1">
                Display Order
              </label>
              <input
                type="number"
                name="sortOrder"
                defaultValue={category.sortOrder}
                className="w-full px-3 py-1.5 rounded-xl bg-[#EDEDED] text-xs font-mono text-[#111311] outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-[#5C605C] mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                defaultValue={category.description || ""}
                className="w-full px-3 py-1.5 rounded-xl bg-[#EDEDED] text-xs text-[#111311] outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#111311] text-[#CEF23E] text-xs font-mono"
              >
                <Check className="w-3 h-3" />
                <span>Save</span>
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#EDEDED] text-[#5C605C] text-xs font-mono"
              >
                <X className="w-3 h-3" />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-base text-[#111311]">{category.name}</h3>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#EDEDED] text-[#111311]">
                  Order: {category.sortOrder}
                </span>
                <button
                  onClick={() => setEditing(true)}
                  className="p-1 text-[#5C605C] hover:text-[#111311] transition-colors"
                  title="Quick edit description and order"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="text-xs text-[#5C605C] line-clamp-3 leading-relaxed mb-4">
              {category.description}
            </p>
          </>
        )}
      </div>

      <div className="pt-4 border-t border-[#EDEDED] flex items-center justify-between text-xs">
        <span className="font-mono text-[#5C605C]">
          {category._count.products} Products Active
        </span>

        <Link
          href={`/category/${category.slug}`}
          target="_blank"
          className="inline-flex items-center gap-1 font-mono text-[#111311] hover:underline"
        >
          <span>Live Page</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
