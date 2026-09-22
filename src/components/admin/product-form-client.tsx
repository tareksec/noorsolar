"use client";

import React, { useState, useActionState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AppImage as Image } from "@/components/ui/app-image";
import {
  createProductAction,
  updateProductAction,
  deleteProductAction,
  reorderProductImageAction,
  deleteProductImageAction,
  ProductActionResult,
} from "@/app/admin/actions/products";
import {
  Plus,
  Trash2,
  Upload,
  AlertCircle,
  Save,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  FileText,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Award,
  FileCheck,
  Package,
} from "lucide-react";
import { extractProductIdentity } from "@/lib/product-identity";
import { parseProductDocuments } from "@/lib/product-documents";

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

interface ProductSpecItem {
  id?: string;
  label: string;
  labelBn?: string | null;
  value: string;
  valueBn?: string | null;
}

interface ProductImageItem {
  id: string;
  url: string;
  alt: string;
  altBn?: string | null;
}

interface ProductFormClientProps {
  categories: CategoryOption[];
  initialProduct?: {
    id: string;
    name: string;
    nameBn?: string | null;
    slug: string;
    categoryId: string;
    shortDescription?: string | null;
    shortDescriptionBn?: string | null;
    description?: string | null;
    descriptionBn?: string | null;
    brand?: string | null;
    model?: string | null;
    stockStatus: string;
    moq?: string | null;
    moqBn?: string | null;
    leadTime?: string | null;
    leadTimeBn?: string | null;
    priceBdt?: number | null;
    showPrice: boolean;
    isFeatured: boolean;
    datasheetUrl?: string | null;
    metaTitle?: string | null;
    metaTitleBn?: string | null;
    metaDescription?: string | null;
    metaDescriptionBn?: string | null;
    specs: ProductSpecItem[];
    images: ProductImageItem[];
  };
}

const SPEC_SUGGESTIONS: Record<string, string[]> = {
  "solar-panels": [
    "Nominal Power (Wp)",
    "Module Efficiency (%)",
    "Cell Technology",
    "Dimensions (mm)",
    "Units Per Pallet",
    "Pallet Dimensions (mm)",
    "Pallet Weight (kg)",
    "40ft HQ Container",
    "Product Warranty",
    "Performance Warranty",
  ],
  "lithium-batteries": [
    "Nominal Capacity (kWh)",
    "Nominal Voltage (V)",
    "Usable Energy (kWh)",
    "Chemistry",
    "Cycle Life (@80% DoD)",
    "Max Discharge Rate (C)",
    "Units Per Pallet",
    "Pallet Weight (kg)",
    "20ft Container Loading",
    "Product Warranty",
  ],
  "solar-inverters": [
    "Rated AC Power (kW)",
    "Max DC Input Voltage (V)",
    "MPPT Voltage Range (V)",
    "Number of MPPT Trackers",
    "Max Efficiency (%)",
    "Grid Phase",
    "Packaging Details",
    "Product Warranty",
  ],
  mounting: [
    "Material & Grade",
    "Wind Load Resistance (m/s)",
    "Snow Load Resistance (kN/m²)",
    "Tilt Angle Range",
    "Applicable Roof Type",
  ],
};

const initialState: ProductActionResult = {
  success: false,
};

export function ProductFormClient({
  categories,
  initialProduct,
}: ProductFormClientProps) {
  const router = useRouter();
  const isEditing = Boolean(initialProduct);
  const initialIdentity = initialProduct ? extractProductIdentity(initialProduct) : null;
  const initialDocs = initialProduct ? parseProductDocuments(initialProduct.datasheetUrl) : {};
  const [, startTransition] = useTransition();

  const actionFn = isEditing ? updateProductAction : createProductAction;
  const [state, formAction, isPending] = useActionState(actionFn, initialState);

  const [isDirty, setIsDirty] = useState(false);

  const [specs, setSpecs] = useState<ProductSpecItem[]>(
    initialProduct?.specs || [
      { label: "Nominal Power / Capacity", value: "" },
      { label: "Efficiency / Voltage", value: "" },
    ]
  );

  const [selectedCategory, setSelectedCategory] = useState(
    initialProduct?.categoryId || categories[0]?.id || ""
  );

  const [langTab, setLangTab] = useState<"en" | "bn">("en");
  const [nameVal, setNameVal] = useState(initialProduct?.name || "");
  const [nameBnVal, setNameBnVal] = useState(initialProduct?.nameBn || "");
  const [slugVal, setSlugVal] = useState(initialProduct?.slug || "");
  const [metaTitleVal, setMetaTitleVal] = useState(initialProduct?.metaTitle || "");
  const [metaTitleBnVal, setMetaTitleBnVal] = useState(initialProduct?.metaTitleBn || "");
  const [metaDescVal, setMetaDescVal] = useState(initialProduct?.metaDescription || "");
  const [metaDescBnVal, setMetaDescBnVal] = useState(initialProduct?.metaDescriptionBn || "");

  const saveSuccess = state.success;

  // Unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && !saveSuccess) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, saveSuccess]);

  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        router.push("/admin/products");
        router.refresh();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [state.success, router]);

  const markDirty = () => {
    if (!isDirty) setIsDirty(true);
  };

  const handleNameChange = (val: string) => {
    setNameVal(val);
    markDirty();
    if (!isEditing && (!slugVal || slugVal === nameVal.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, ""))) {
      const generated = val
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-");
      setSlugVal(generated);
    }
  };

  const addSpecRow = () => {
    setSpecs([...specs, { label: "", value: "" }]);
    markDirty();
  };

  const addSuggestedSpec = (label: string) => {
    markDirty();
    // If an existing row is empty, fill it
    const emptyIdx = specs.findIndex((s) => !s.label && !s.value);
    if (emptyIdx !== -1) {
      const next = [...specs];
      next[emptyIdx].label = label;
      setSpecs(next);
    } else {
      setSpecs([...specs, { label, value: "" }]);
    }
  };

  const removeSpecRow = (index: number) => {
    markDirty();
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const moveSpecRow = (index: number, direction: "up" | "down") => {
    markDirty();
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= specs.length) return;
    const next = [...specs];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    setSpecs(next);
  };

  const handleSpecChange = (
    index: number,
    field: "label" | "value" | "labelBn" | "valueBn",
    val: string
  ) => {
    markDirty();
    const next = [...specs];
    next[index] = { ...next[index], [field]: val };
    setSpecs(next);
  };

  const currentCategorySlug = categories.find((c) => c.id === selectedCategory)?.slug || "";
  const suggestions = SPEC_SUGGESTIONS[currentCategorySlug] || [
    "Nominal Power",
    "Efficiency",
    "Warranty",
    "Dimensions",
  ];

  return (
    <form
      action={(fd) => {
        setIsDirty(false);
        formAction(fd);
      }}
      encType="multipart/form-data"
      className="space-y-8"
      onChange={markDirty}
    >
      {state.error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-xs text-red-800">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
          <div>
            <p className="font-bold">Validation Error</p>
            <p>{state.error}</p>
          </div>
        </div>
      )}

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span className="font-medium">Product saved successfully. Redirecting to inventory...</span>
        </div>
      )}

      {isDirty && !isPending && (
        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
          <span>You have unsaved changes in this form.</span>
          <span className="font-mono text-[10px] text-amber-700 uppercase tracking-wider">Unsaved</span>
        </div>
      )}

      {isEditing && (
        <input type="hidden" name="id" value={initialProduct?.id} />
      )}

      {/* Language Tabs Selector */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-[#EDEDED] border border-[#DDE1DC]">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold uppercase text-[#111311]">
            Editing Language:
          </span>
          <div className="inline-flex p-1 rounded-xl bg-white border border-[#DDE1DC]">
            <button
              type="button"
              onClick={() => setLangTab("en")}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
                langTab === "en"
                  ? "bg-[#111311] text-[#CEF23E] font-bold"
                  : "text-[#5C605C] hover:text-[#111311]"
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLangTab("bn")}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                langTab === "bn"
                  ? "bg-[#111311] text-[#CEF23E] font-bold"
                  : "text-[#5C605C] hover:text-[#111311]"
              }`}
            >
              <span>বাংলা</span>
              {isEditing && !initialProduct?.nameBn && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              )}
            </button>
          </div>
        </div>
        {isEditing && !initialProduct?.nameBn && (
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
            BN missing
          </span>
        )}
      </div>

      {/* 1. General Information */}
      <div className="space-y-4">
        <h2 className="text-sm font-mono font-bold uppercase text-[#111311] pb-2 border-b border-[#EDEDED]">
          1. General Information ({langTab === "en" ? "English" : "বাংলা"})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className={langTab === "en" ? "" : "hidden"}>
            <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
              Product Name (English) *
            </label>
            <input
              type="text"
              name="name"
              required
              minLength={2}
              value={nameVal}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. N-Type TOPCon 620W Bifacial Module"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none focus:ring-1 focus:ring-[#111311]"
            />
          </div>

          <div className={langTab === "bn" ? "" : "hidden"}>
            <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
              Product Name (বাংলা)
            </label>
            <input
              type="text"
              name="nameBn"
              lang="bn"
              value={nameBnVal}
              onChange={(e) => {
                setNameBnVal(e.target.value);
                markDirty();
              }}
              placeholder="যেমন: এন-টাইপ টপকন ৬২০ ওয়াট বাইফেসিয়াল মডিউল"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none focus:ring-1 focus:ring-[#111311]"
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
              onChange={(e) => {
                setSlugVal(e.target.value);
                markDirty();
              }}
              placeholder="n-type-topcon-620w-bifacial"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] font-mono outline-none focus:ring-1 focus:ring-[#111311]"
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
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                markDirty();
              }}
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
              Noor Internal SKU / Model Code
            </label>
            <input
              type="text"
              name="model"
              defaultValue={initialIdentity?.noorSku || initialProduct?.model || ""}
              placeholder="e.g. NS-620TOP-BF"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] font-mono outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
              Manufacturer / Brand (Verified Only)
            </label>
            <input
              type="text"
              name="brand"
              defaultValue={initialIdentity?.manufacturer || initialProduct?.brand || ""}
              placeholder="e.g. JinkoSolar, LONGi (leave blank if OEM)"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
            />
          </div>
        </div>

        {/* Product Identity Detail Sub-Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#EDEDED]/50 border border-[#DDE1DC]">
          <div>
            <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
              Manufacturer Series (Optional)
            </label>
            <input
              type="text"
              name="series"
              defaultValue={initialIdentity?.series || ""}
              placeholder="e.g. Tiger Neo, Hi-MO X6"
              className="w-full px-4 py-2.5 rounded-2xl bg-white text-xs sm:text-sm text-[#111311] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
              Manufacturer Model (Factory Code)
            </label>
            <input
              type="text"
              name="manufacturerModel"
              defaultValue={initialIdentity?.manufacturerModel || ""}
              placeholder="e.g. JKMxxxN-72HL4"
              className="w-full px-4 py-2.5 rounded-2xl bg-white text-xs sm:text-sm text-[#111311] font-mono outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
              Country of Origin (Optional)
            </label>
            <input
              type="text"
              name="originCountry"
              defaultValue={initialIdentity?.originCountry || ""}
              placeholder="e.g. China, Germany"
              className="w-full px-4 py-2.5 rounded-2xl bg-white text-xs sm:text-sm text-[#111311] outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
            Short Description (Catalog Preview) {langTab === "en" ? "(English)" : "(বাংলা)"}
          </label>
          <div className={langTab === "en" ? "" : "hidden"}>
            <input
              type="text"
              name="shortDescription"
              defaultValue={initialProduct?.shortDescription || ""}
              placeholder="High-efficiency dual glass module designed for industrial commercial rooftops."
              className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
            />
          </div>
          <div className={langTab === "bn" ? "" : "hidden"}>
            <input
              type="text"
              name="shortDescriptionBn"
              lang="bn"
              defaultValue={initialProduct?.shortDescriptionBn || ""}
              placeholder="বাণিজ্যিক ও শিল্প কারখানার জন্য উচ্চ-দক্ষতাসম্পন্ন ডুয়াল গ্লাস মডিউল।"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
            Full Engineering Description {langTab === "en" ? "(English)" : "(বাংলা)"}
          </label>
          <div className={langTab === "en" ? "" : "hidden"}>
            <textarea
              name="description"
              rows={3}
              defaultValue={initialProduct?.description || ""}
              placeholder="Detailed overview of cells, structure, temperature coefficients, and durability..."
              className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
            />
          </div>
          <div className={langTab === "bn" ? "" : "hidden"}>
            <textarea
              name="descriptionBn"
              lang="bn"
              rows={3}
              defaultValue={initialProduct?.descriptionBn || ""}
              placeholder="সেল, কাঠামো, তাপমাত্রা সহগ এবং স্থায়িত্বের বিস্তারিত প্রযুক্তিগত বিবরণ..."
              className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
            />
          </div>
        </div>
      </div>

      {/* 2. Commercial & Stock Parameters */}
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
              Minimum Order Quantity (MOQ) {langTab === "en" ? "(English)" : "(বাংলা)"}
            </label>
            <div className={langTab === "en" ? "" : "hidden"}>
              <input
                type="text"
                name="moq"
                defaultValue={initialProduct?.moq || ""}
                placeholder="e.g. 50 pcs or 1 Pallet"
                className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
              />
            </div>
            <div className={langTab === "bn" ? "" : "hidden"}>
              <input
                type="text"
                name="moqBn"
                lang="bn"
                defaultValue={initialProduct?.moqBn || ""}
                placeholder="যেমন: ৫০ টি বা ১ প্যালেট"
                className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
              Delivery Lead Time {langTab === "en" ? "(English)" : "(বাংলা)"}
            </label>
            <div className={langTab === "en" ? "" : "hidden"}>
              <input
                type="text"
                name="leadTime"
                defaultValue={initialProduct?.leadTime || ""}
                placeholder="e.g. Immediate delivery from Dhaka"
                className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
              />
            </div>
            <div className={langTab === "bn" ? "" : "hidden"}>
              <input
                type="text"
                name="leadTimeBn"
                lang="bn"
                defaultValue={initialProduct?.leadTimeBn || ""}
                placeholder="যেমন: ঢাকা গুদাম থেকে তাৎক্ষণিক ডেলিভারি"
                className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

      {/* 3. Technical Documents & Downloads */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#EDEDED]">
          <h2 className="text-sm font-mono font-bold uppercase text-[#111311]">
            3. Technical Documents & Downloads
          </h2>
          <span className="text-[11px] font-mono text-[#5C605C]">
            Datasheet, Warranty, IEC Certificate, Manual, Test Report, Packing Sheet
          </span>
        </div>

        <div className="space-y-4">
          {/* Document 1: Datasheet */}
          <div className="p-5 rounded-3xl bg-[#EDEDED]/60 border border-[#DDE1DC] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold text-[#111311] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>1. Product Datasheet (PDF Upload or URL)</span>
              </label>
              {initialDocs.datasheet && (
                <a
                  href={initialDocs.datasheet}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono text-[#111311] underline inline-flex items-center gap-1 font-medium"
                >
                  <span>Current File</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input
                  type="file"
                  name="doc_datasheet_file"
                  accept="application/pdf,.pdf"
                  className="w-full text-xs font-mono file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#111311] file:text-[#CEF23E] hover:file:bg-[#222622] file:cursor-pointer"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="doc_datasheet_url"
                  defaultValue={initialDocs.datasheet || ""}
                  placeholder="Or enter external datasheet URL (https://...)"
                  className="w-full px-4 py-2 rounded-2xl bg-white text-xs text-[#111311] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Document 2: Warranty */}
          <div className="p-5 rounded-3xl bg-[#EDEDED]/60 border border-[#DDE1DC] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold text-[#111311] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>2. Warranty Policy Document</span>
              </label>
              {initialDocs.warranty && (
                <a
                  href={initialDocs.warranty}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono text-[#111311] underline inline-flex items-center gap-1 font-medium"
                >
                  <span>Current File</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input
                  type="file"
                  name="doc_warranty_file"
                  accept="application/pdf,.pdf"
                  className="w-full text-xs font-mono file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#111311] file:text-[#CEF23E] hover:file:bg-[#222622] file:cursor-pointer"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="doc_warranty_url"
                  defaultValue={initialDocs.warranty || ""}
                  placeholder="Or enter warranty document URL (https://...)"
                  className="w-full px-4 py-2 rounded-2xl bg-white text-xs text-[#111311] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Document 3: IEC / Quality Certificate */}
          <div className="p-5 rounded-3xl bg-[#EDEDED]/60 border border-[#DDE1DC] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold text-[#111311] flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>3. IEC / Product Quality Certificate</span>
              </label>
              {initialDocs.certificate && (
                <a
                  href={initialDocs.certificate}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono text-[#111311] underline inline-flex items-center gap-1 font-medium"
                >
                  <span>Current File</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input
                  type="file"
                  name="doc_certificate_file"
                  accept="application/pdf,.pdf"
                  className="w-full text-xs font-mono file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#111311] file:text-[#CEF23E] hover:file:bg-[#222622] file:cursor-pointer"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="doc_certificate_url"
                  defaultValue={initialDocs.certificate || ""}
                  placeholder="Or enter certificate URL (https://...)"
                  className="w-full px-4 py-2 rounded-2xl bg-white text-xs text-[#111311] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Document 4: Installation Manual */}
          <div className="p-5 rounded-3xl bg-[#EDEDED]/60 border border-[#DDE1DC] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold text-[#111311] flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5" />
                <span>4. Installation & O&M Manual</span>
              </label>
              {initialDocs.manual && (
                <a
                  href={initialDocs.manual}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono text-[#111311] underline inline-flex items-center gap-1 font-medium"
                >
                  <span>Current File</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input
                  type="file"
                  name="doc_manual_file"
                  accept="application/pdf,.pdf"
                  className="w-full text-xs font-mono file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#111311] file:text-[#CEF23E] hover:file:bg-[#222622] file:cursor-pointer"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="doc_manual_url"
                  defaultValue={initialDocs.manual || ""}
                  placeholder="Or enter installation manual URL (https://...)"
                  className="w-full px-4 py-2 rounded-2xl bg-white text-xs text-[#111311] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Document 5: Factory Test Report */}
          <div className="p-5 rounded-3xl bg-[#EDEDED]/60 border border-[#DDE1DC] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold text-[#111311] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>5. Factory Test / Flash Test Report</span>
              </label>
              {initialDocs.testReport && (
                <a
                  href={initialDocs.testReport}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono text-[#111311] underline inline-flex items-center gap-1 font-medium"
                >
                  <span>Current File</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input
                  type="file"
                  name="doc_test_report_file"
                  accept="application/pdf,.pdf"
                  className="w-full text-xs font-mono file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#111311] file:text-[#CEF23E] hover:file:bg-[#222622] file:cursor-pointer"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="doc_test_report_url"
                  defaultValue={initialDocs.testReport || ""}
                  placeholder="Or enter test report URL (https://...)"
                  className="w-full px-4 py-2 rounded-2xl bg-white text-xs text-[#111311] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Document 6: Packing Sheet */}
          <div className="p-5 rounded-3xl bg-[#EDEDED]/60 border border-[#DDE1DC] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold text-[#111311] flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" />
                <span>6. Packing Sheet / Dimension Details</span>
              </label>
              {initialDocs.packingSheet && (
                <a
                  href={initialDocs.packingSheet}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono text-[#111311] underline inline-flex items-center gap-1 font-medium"
                >
                  <span>Current File</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input
                  type="file"
                  name="doc_packing_sheet_file"
                  accept="application/pdf,.pdf"
                  className="w-full text-xs font-mono file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#111311] file:text-[#CEF23E] hover:file:bg-[#222622] file:cursor-pointer"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="doc_packing_sheet_url"
                  defaultValue={initialDocs.packingSheet || ""}
                  placeholder="Or enter packing sheet URL (https://...)"
                  className="w-full px-4 py-2 rounded-2xl bg-white text-xs text-[#111311] outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Dynamic Technical Specifications */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#EDEDED]">
          <div>
            <h2 className="text-sm font-mono font-bold uppercase text-[#111311]">
              4. Technical Specifications Table
            </h2>
            <p className="text-[11px] text-[#5C605C]">
              Click suggestions below to quick-add common category parameters
            </p>
          </div>
          <button
            type="button"
            onClick={addSpecRow}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111311] text-[#CEF23E] text-xs font-mono hover:bg-[#222622] self-start sm:self-auto"
          >
            <Plus className="w-3 h-3" />
            <span>Add Row</span>
          </button>
        </div>

        {/* Category Spec Suggestions */}
        <div className="flex flex-wrap items-center gap-1.5 p-3 rounded-2xl bg-[#EDEDED]/50 border border-[#DDE1DC]">
          <span className="text-[10px] font-mono uppercase text-[#5C605C] mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#111311]" /> Suggestions:
          </span>
          {suggestions.map((sug) => (
            <button
              key={sug}
              type="button"
              onClick={() => addSuggestedSpec(sug)}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-[#111311] hover:text-[#CEF23E] text-[#111311] text-[11px] font-mono border border-[#DDE1DC] transition-colors"
            >
              + {sug}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {specs.map((spec, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={`flex items-center gap-3 flex-1 ${langTab === "en" ? "" : "hidden"}`}>
                <input
                  type="text"
                  name="spec_labels[]"
                  value={spec.label}
                  onChange={(e) => handleSpecChange(index, "label", e.target.value)}
                  placeholder="Spec Name (e.g. Nominal Power)"
                  className="w-1/2 px-4 py-2 rounded-2xl bg-[#EDEDED] text-xs text-[#111311] outline-none"
                />
                <input
                  type="text"
                  name="spec_values[]"
                  value={spec.value}
                  onChange={(e) => handleSpecChange(index, "value", e.target.value)}
                  placeholder="Value (e.g. 620W)"
                  className="w-1/2 px-4 py-2 rounded-2xl bg-[#EDEDED] text-xs font-mono text-[#111311] outline-none"
                />
              </div>
              <div className={`flex items-center gap-3 flex-1 ${langTab === "bn" ? "" : "hidden"}`}>
                <input
                  type="text"
                  name="spec_labels_bn[]"
                  lang="bn"
                  value={spec.labelBn || ""}
                  onChange={(e) => handleSpecChange(index, "labelBn", e.target.value)}
                  placeholder={`বাংলা নাম (যেমন: ${spec.label || "নমিনাল পাওয়ার"})`}
                  className="w-1/2 px-4 py-2 rounded-2xl bg-[#EDEDED] text-xs text-[#111311] outline-none"
                />
                <input
                  type="text"
                  name="spec_values_bn[]"
                  lang="bn"
                  value={spec.valueBn || ""}
                  onChange={(e) => handleSpecChange(index, "valueBn", e.target.value)}
                  placeholder={`বাংলা মান (যেমন: ${spec.value || "৬২০W"})`}
                  className="w-1/2 px-4 py-2 rounded-2xl bg-[#EDEDED] text-xs font-mono text-[#111311] outline-none"
                />
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveSpecRow(index, "up")}
                  className="p-1.5 rounded-lg text-[#5C605C] hover:text-[#111311] hover:bg-white disabled:opacity-25 transition-colors"
                  title="Move Spec Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={index === specs.length - 1}
                  onClick={() => moveSpecRow(index, "down")}
                  className="p-1.5 rounded-lg text-[#5C605C] hover:text-[#111311] hover:bg-white disabled:opacity-25 transition-colors"
                  title="Move Spec Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => removeSpecRow(index)}
                  className="p-1.5 rounded-lg text-[#5C605C] hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Remove specification row"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Product Images */}
      <div className="space-y-4">
        <h2 className="text-sm font-mono font-bold uppercase text-[#111311] pb-2 border-b border-[#EDEDED]">
          5. Product Images (First Image is Primary)
        </h2>

        {/* Existing Images Display */}
        {initialProduct?.images && initialProduct.images.length > 0 && (
          <div className="mb-4 space-y-2">
            <span className="text-xs font-mono text-[#5C605C] block">
              Manage Existing Images (Alt Text, Order & Deletion):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {initialProduct.images.map((img, idx) => (
                <div
                  key={img.id}
                  className="p-3 rounded-2xl bg-[#EDEDED] border border-[#DDE1DC] space-y-2"
                >
                  <input type="hidden" name="existing_image_ids[]" value={img.id} />
                  <div className="relative w-full h-32 rounded-xl overflow-hidden bg-white border border-[#DDE1DC]">
                    <Image src={img.url} alt={img.alt} fill className="object-cover" />
                    {idx === 0 ? (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#111311] text-[#CEF23E] text-[10px] font-mono font-bold shadow-xs">
                        #1 Primary Image
                      </span>
                    ) : (
                      <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono">
                        #{idx + 1}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-[#5C605C] mb-1">
                      Image Alt Text ({langTab === "en" ? "English" : "বাংলা"})
                    </label>
                    <div className={langTab === "en" ? "" : "hidden"}>
                      <input
                        type="text"
                        name="existing_image_alts[]"
                        defaultValue={img.alt}
                        placeholder="Alt description for SEO"
                        className="w-full px-2.5 py-1.5 rounded-xl bg-white text-xs text-[#111311] outline-none"
                      />
                    </div>
                    <div className={langTab === "bn" ? "" : "hidden"}>
                      <input
                        type="text"
                        name="existing_image_alts_bn[]"
                        lang="bn"
                        defaultValue={img.altBn || ""}
                        placeholder="ছবির বিবরণ (বাংলা)"
                        className="w-full px-2.5 py-1.5 rounded-xl bg-white text-xs text-[#111311] outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => {
                          startTransition(async () => {
                            const fd = new FormData();
                            fd.append("imageId", img.id);
                            fd.append("direction", "up");
                            fd.append("productId", initialProduct.id);
                            await reorderProductImageAction(fd);
                            router.refresh();
                          });
                        }}
                        title="Move Left"
                        className="p-1 rounded-lg bg-white hover:bg-[#DDE1DC] disabled:opacity-25 text-[#111311] border border-[#DDE1DC]"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === initialProduct.images.length - 1}
                        onClick={() => {
                          startTransition(async () => {
                            const fd = new FormData();
                            fd.append("imageId", img.id);
                            fd.append("direction", "down");
                            fd.append("productId", initialProduct.id);
                            await reorderProductImageAction(fd);
                            router.refresh();
                          });
                        }}
                        title="Move Right"
                        className="p-1 rounded-lg bg-white hover:bg-[#DDE1DC] disabled:opacity-25 text-[#111311] border border-[#DDE1DC]"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (
                          confirm(
                            "Delete this image? The uploaded file will be permanently removed from disk."
                          )
                        ) {
                          startTransition(async () => {
                            const fd = new FormData();
                            fd.append("imageId", img.id);
                            fd.append("productId", initialProduct.id);
                            await deleteProductImageAction(fd);
                            router.refresh();
                          });
                        }
                      }}
                      className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload new images */}
        <div className="p-6 rounded-3xl bg-[#EDEDED] border border-dashed border-[#5C605C]/40 text-center">
          <Upload className="w-6 h-6 text-[#5C605C] mx-auto mb-2" />
          <label className="cursor-pointer">
            <span className="text-xs font-bold text-[#111311] underline">
              Click to select photos
            </span>
            <span className="text-xs text-[#5C605C] block mt-1">
              Supports JPEG, PNG, WebP up to 5MB (auto-converted to WebP + responsive thumbnail)
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

      {/* 6. SEO Meta Fields */}
      <div className="space-y-4">
        <h2 className="text-sm font-mono font-bold uppercase text-[#111311] pb-2 border-b border-[#EDEDED]">
          6. Search Engine Optimization (SEO) — {langTab === "en" ? "English" : "বাংলা"}
        </h2>

        <div className={langTab === "en" ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "hidden"}>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-mono font-medium text-[#111311]">
                Custom Meta Title (English)
              </label>
              <span className="text-[10px] font-mono text-[#5C605C]">
                {metaTitleVal.length}/60
              </span>
            </div>
            <input
              type="text"
              name="metaTitle"
              value={metaTitleVal}
              onChange={(e) => {
                setMetaTitleVal(e.target.value);
                markDirty();
              }}
              placeholder={nameVal ? `${nameVal} — Noor Solar Energy` : "Title for search engines"}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-mono font-medium text-[#111311]">
                Meta Description (English)
              </label>
              <span className="text-[10px] font-mono text-[#5C605C]">
                {metaDescVal.length}/160
              </span>
            </div>
            <textarea
              name="metaDescription"
              rows={2}
              value={metaDescVal}
              onChange={(e) => {
                setMetaDescVal(e.target.value);
                markDirty();
              }}
              placeholder="Concise summary for Google search snippets..."
              className="w-full px-4 py-2 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
            />
          </div>
        </div>

        <div className={langTab === "bn" ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "hidden"}>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-mono font-medium text-[#111311]">
                Custom Meta Title (বাংলা)
              </label>
              <span className="text-[10px] font-mono text-[#5C605C]">
                {metaTitleBnVal.length}/60
              </span>
            </div>
            <input
              type="text"
              name="metaTitleBn"
              lang="bn"
              value={metaTitleBnVal}
              onChange={(e) => {
                setMetaTitleBnVal(e.target.value);
                markDirty();
              }}
              placeholder={nameBnVal ? `${nameBnVal} — নূর সোলার এনার্জি` : "গুগল সার্চ ফলাফলের শিরোনাম"}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-mono font-medium text-[#111311]">
                Meta Description (বাংলা)
              </label>
              <span className="text-[10px] font-mono text-[#5C605C]">
                {metaDescBnVal.length}/160
              </span>
            </div>
            <textarea
              name="metaDescriptionBn"
              lang="bn"
              rows={2}
              value={metaDescBnVal}
              onChange={(e) => {
                setMetaDescBnVal(e.target.value);
                markDirty();
              }}
              placeholder="গুগল সার্চ ফলাফলের জন্য সংক্ষিপ্ত বাংলা বিবরণ..."
              className="w-full px-4 py-2 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-6 border-t border-[#EDEDED] flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="submit"
          id="btn-save-product"
          disabled={isPending}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#111311] hover:bg-[#222622] text-[#CEF23E] font-semibold text-xs tracking-tight transition-all disabled:opacity-60 shadow-lg cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isPending ? "Saving Product..." : isEditing ? "Update Product" : "Save New Product"}</span>
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={() => {
              if (
                confirm(
                  `Are you sure you want to permanently delete "${initialProduct?.name}"? All associated images and datasheet files will be removed from disk.`
                )
              ) {
                const form = new FormData();
                form.append("id", initialProduct!.id);
                deleteProductAction(form);
              }
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-full text-xs font-mono text-red-600 hover:bg-red-50 transition-colors text-center"
          >
            Delete Product
          </button>
        )}
      </div>
    </form>
  );
}
