"use client";

import React, { useState, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppImage as Image } from "@/components/ui/app-image";
import {
  createProductAction,
  updateProductAction,
  deleteProductAction,
  ProductActionResult,
} from "@/app/admin/actions/products";
import { Plus, Trash2, Upload, AlertCircle, Save } from "lucide-react";

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

interface ProductSpecItem {
  id?: string;
  label: string;
  value: string;
}

interface ProductImageItem {
  id: string;
  url: string;
  alt: string;
}

interface ProductFormClientProps {
  categories: CategoryOption[];
  initialProduct?: {
    id: string;
    name: string;
    slug: string;
    categoryId: string;
    shortDescription?: string | null;
    description?: string | null;
    brand?: string | null;
    model?: string | null;
    stockStatus: string;
    moq?: string | null;
    leadTime?: string | null;
    priceBdt?: number | null;
    showPrice: boolean;
    isFeatured: boolean;
    datasheetUrl?: string | null;
    specs: ProductSpecItem[];
    images: ProductImageItem[];
  };
}

const initialState: ProductActionResult = {
  success: false,
};

export function ProductFormClient({
  categories,
  initialProduct,
}: ProductFormClientProps) {
  const router = useRouter();
  const isEditing = Boolean(initialProduct);

  const actionFn = isEditing ? updateProductAction : createProductAction;
  const [state, formAction, isPending] = useActionState(actionFn, initialState);

  const [specs, setSpecs] = useState<ProductSpecItem[]>(
    initialProduct?.specs || [
      { label: "Nominal Power / Capacity", value: "" },
      { label: "Efficiency / Voltage", value: "" },
    ]
  );

  const [nameVal, setNameVal] = useState(initialProduct?.name || "");
  const [slugVal, setSlugVal] = useState(initialProduct?.slug || "");

  useEffect(() => {
    if (state.success) {
      router.push("/admin/products");
      router.refresh();
    }
  }, [state.success, router]);

  const addSpecRow = () => {
    setSpecs([...specs, { label: "", value: "" }]);
  };

  const removeSpecRow = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index: number, field: "label" | "value", val: string) => {
    const next = [...specs];
    next[index][field] = val;
    setSpecs(next);
  };

  const handleNameChange = (val: string) => {
    setNameVal(val);
    if (!isEditing && !slugVal) {
      const generated = val
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");
      setSlugVal(generated);
    }
  };

  return (
    <form action={formAction} className="space-y-8">
      {state.error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-xs text-red-800">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
          <span>{state.error}</span>
        </div>
      )}

      {isEditing && (
        <input type="hidden" name="id" value={initialProduct?.id} />
      )}

      {/* Basic Info */}
      <div className="space-y-4">
        <h2 className="text-sm font-mono font-bold uppercase text-[#111311] pb-2 border-b border-[#EDEDED]">
          1. General Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={nameVal}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. N-Type TOPCon 620W Bifacial Module"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
              URL Slug *
            </label>
            <input
              type="text"
              name="slug"
              required
              value={slugVal}
              onChange={(e) => setSlugVal(e.target.value)}
              placeholder="n-type-topcon-620w-bifacial"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] font-mono outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
              Category *
            </label>
            <select
              name="categoryId"
              required
              defaultValue={initialProduct?.categoryId || categories[0]?.id}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
              Model Code / Number
            </label>
            <input
              type="text"
              name="model"
              defaultValue={initialProduct?.model || ""}
              placeholder="e.g. NS-620TOP-BF"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] font-mono outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
              Brand / Specification Partner
            </label>
            <input
              type="text"
              name="brand"
              defaultValue={initialProduct?.brand || ""}
              placeholder="e.g. Partner Series"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
            Short Description (Catalog Preview)
          </label>
          <input
            type="text"
            name="shortDescription"
            defaultValue={initialProduct?.shortDescription || ""}
            placeholder="High-efficiency dual glass module designed for industrial commercial rooftops."
            className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
            Full Engineering Description
          </label>
          <textarea
            name="description"
            rows={3}
            defaultValue={initialProduct?.description || ""}
            placeholder="Detailed overview of cells, structure, temperature coefficients, and durability..."
            className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
          />
        </div>
      </div>

      {/* Commercial & Stock Settings */}
      <div className="space-y-4">
        <h2 className="text-sm font-mono font-bold uppercase text-[#111311] pb-2 border-b border-[#EDEDED]">
          2. Wholesale & Commercial Parameters
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
              Stock Status
            </label>
            <select
              name="stockStatus"
              defaultValue={initialProduct?.stockStatus || "IN_STOCK"}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none font-mono"
            >
              <option value="IN_STOCK">IN_STOCK (Dhaka Warehouse)</option>
              <option value="INCOMING">INCOMING (On Shipping Vessel)</option>
              <option value="ON_REQUEST">ON_REQUEST (Container Indent)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
              Minimum Order Quantity (MOQ)
            </label>
            <input
              type="text"
              name="moq"
              defaultValue={initialProduct?.moq || ""}
              placeholder="e.g. 50 pcs or 1 Pallet"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
              Delivery Lead Time
            </label>
            <input
              type="text"
              name="leadTime"
              defaultValue={initialProduct?.leadTime || ""}
              placeholder="e.g. Immediate dispatch from Dhaka"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
              Unit Price (BDT, Optional)
            </label>
            <input
              type="number"
              name="priceBdt"
              defaultValue={initialProduct?.priceBdt || ""}
              placeholder="e.g. 14500"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] font-mono outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
              Datasheet Link (PDF or URL)
            </label>
            <input
              type="text"
              name="datasheetUrl"
              defaultValue={initialProduct?.datasheetUrl || ""}
              placeholder="https://.../datasheet.pdf"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
            />
          </div>

          <div className="flex flex-col justify-end gap-2 pt-2">
            <label className="flex items-center gap-2 text-xs font-mono text-[#111311] cursor-pointer">
              <input
                type="checkbox"
                name="showPrice"
                value="true"
                defaultChecked={initialProduct?.showPrice}
                className="rounded text-[#111311]"
              />
              <span>Display Price on Public Site</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-mono text-[#111311] cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                value="true"
                defaultChecked={initialProduct?.isFeatured}
                className="rounded text-[#111311]"
              />
              <span>Show in Home Featured Carousel</span>
            </label>
          </div>
        </div>
      </div>

      {/* Dynamic Technical Specifications */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#EDEDED]">
          <h2 className="text-sm font-mono font-bold uppercase text-[#111311]">
            3. Technical Specifications Table
          </h2>
          <button
            type="button"
            onClick={addSpecRow}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111311] text-[#CEF23E] text-xs font-mono hover:bg-[#222622]"
          >
            <Plus className="w-3 h-3" />
            <span>Add Row</span>
          </button>
        </div>

        <div className="space-y-2">
          {specs.map((spec, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                type="text"
                name="spec_labels[]"
                value={spec.label}
                onChange={(e) => handleSpecChange(index, "label", e.target.value)}
                placeholder="Spec Name (e.g. Module Efficiency)"
                className="w-1/2 px-4 py-2 rounded-2xl bg-[#EDEDED] text-xs text-[#111311] outline-none"
              />
              <input
                type="text"
                name="spec_values[]"
                value={spec.value}
                onChange={(e) => handleSpecChange(index, "value", e.target.value)}
                placeholder="Value (e.g. 22.6%)"
                className="w-1/2 px-4 py-2 rounded-2xl bg-[#EDEDED] text-xs font-mono text-[#111311] outline-none"
              />
              <button
                type="button"
                onClick={() => removeSpecRow(index)}
                className="p-2 text-[#5C605C] hover:text-red-600 transition-colors"
                title="Remove specification row"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Image Uploads */}
      <div className="space-y-4">
        <h2 className="text-sm font-mono font-bold uppercase text-[#111311] pb-2 border-b border-[#EDEDED]">
          4. Product Images (Sharp Processing)
        </h2>

        {/* Existing Images Display if Editing */}
        {initialProduct?.images && initialProduct.images.length > 0 && (
          <div className="mb-4">
            <span className="text-xs font-mono text-[#5C605C] block mb-2">
              Existing Images:
            </span>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {initialProduct.images.map((img) => (
                <div
                  key={img.id}
                  className="relative w-24 h-24 rounded-2xl overflow-hidden bg-[#EDEDED] border border-[#DDE1DC] shrink-0"
                >
                  <Image src={img.url} alt={img.alt} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-6 rounded-3xl bg-[#EDEDED] border border-dashed border-[#5C605C]/40 text-center">
          <Upload className="w-6 h-6 text-[#5C605C] mx-auto mb-2" />
          <label className="cursor-pointer">
            <span className="text-xs font-bold text-[#111311] underline">
              Click to select photos
            </span>
            <span className="text-xs text-[#5C605C] block mt-1">
              Supports JPEG, PNG, WebP up to 5MB (auto-converted to WebP + thumbnail)
            </span>
            <input
              type="file"
              name="images"
              multiple
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-6 border-t border-[#EDEDED] flex items-center justify-between gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#111311] hover:bg-[#222622] text-[#CEF23E] font-semibold text-xs tracking-tight transition-all disabled:opacity-60 shadow-lg"
        >
          <Save className="w-4 h-4" />
          <span>{isPending ? "Saving Product..." : isEditing ? "Update Product" : "Save New Product"}</span>
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={() => {
              if (confirm("Are you sure you want to delete this product? This cannot be undone.")) {
                const form = new FormData();
                form.append("id", initialProduct!.id);
                deleteProductAction(form);
              }
            }}
            className="px-5 py-3 rounded-full text-xs font-mono text-red-600 hover:bg-red-50 transition-colors"
          >
            Delete Product
          </button>
        )}
      </div>
    </form>
  );
}
