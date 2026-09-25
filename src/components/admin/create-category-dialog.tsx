"use client";

import React, { useState, useActionState } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { createCategoryAction, CategoryActionResult } from "@/app/admin/actions/categories";

const initialState: CategoryActionResult = { success: false };

export function CreateCategoryDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(
    async (_prev: CategoryActionResult, fd: FormData) => {
      const res = await createCategoryAction(_prev, fd);
      if (res.success) {
        setIsOpen(false);
      }
      return res;
    },
    initialState
  );

  return (
    <>
      <button
        type="button"
        id="btn-open-create-category"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#111311] hover:bg-[#232723] text-white text-xs font-mono font-medium transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>Add Category</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl border border-[#DDE1DC] space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#111311]">New Category</h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-[#5C605C] hover:text-[#111311]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {state.error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                {state.error}
              </div>
            )}

            <form action={formAction} className="space-y-4" id="create-category-form">
              <div>
                <label className="block text-xs font-mono text-[#5C605C] mb-1">
                  Category Name (English) *
                </label>
                <input
                  type="text"
                  name="name"
                  id="category-name-input"
                  required
                  placeholder="e.g. Solar Cables & Connectors"
                  className="w-full px-3 py-2 rounded-xl bg-[#EDEDED] border border-transparent focus:border-[#111311] text-xs text-[#111311] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#5C605C] mb-1">
                  Category Name (বাংলা)
                </label>
                <input
                  type="text"
                  name="nameBn"
                  lang="bn"
                  id="category-name-bn-input"
                  placeholder="যেমন: সোলার ক্যাবল ও কানেক্টর"
                  className="w-full px-3 py-2 rounded-xl bg-[#EDEDED] border border-transparent focus:border-[#111311] text-xs text-[#111311] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#5C605C] mb-1">
                  Slug (Optional)
                </label>
                <input
                  type="text"
                  name="slug"
                  id="category-slug-input"
                  placeholder="e.g. solar-cables"
                  className="w-full px-3 py-2 rounded-xl bg-[#EDEDED] border border-transparent focus:border-[#111311] text-xs font-mono text-[#111311] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#5C605C] mb-1">
                  Description (English)
                </label>
                <textarea
                  name="description"
                  id="category-desc-input"
                  rows={2}
                  placeholder="Brief summary of this product category"
                  className="w-full px-3 py-2 rounded-xl bg-[#EDEDED] border border-transparent focus:border-[#111311] text-xs text-[#111311] outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#5C605C] mb-1">
                  Description (বাংলা)
                </label>
                <textarea
                  name="descriptionBn"
                  lang="bn"
                  id="category-desc-bn-input"
                  rows={2}
                  placeholder="ক্যাটাগরির সংক্ষিপ্ত বাংলা বিবরণ"
                  className="w-full px-3 py-2 rounded-xl bg-[#EDEDED] border border-transparent focus:border-[#111311] text-xs text-[#111311] outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#5C605C] mb-1">
                  Category Image (JPEG, PNG or WebP, max 5MB)
                </label>
                <input
                  type="file"
                  name="image"
                  id="category-image-input"
                  accept="image/jpeg,image/png,image/webp"
                  className="w-full px-3 py-2 rounded-xl bg-[#EDEDED] text-xs text-[#111311] outline-none file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-mono file:bg-[#111311] file:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#5C605C] mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  name="sortOrder"
                  id="category-sort-input"
                  defaultValue={99}
                  className="w-full px-3 py-2 rounded-xl bg-[#EDEDED] text-xs font-mono text-[#111311] outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#EDEDED] hover:bg-[#DDE1DC] text-xs font-mono text-[#111311]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="category-submit-btn"
                  disabled={isPending}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111311] hover:bg-[#232723] text-white text-xs font-mono disabled:opacity-50"
                >
                  {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Category</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
