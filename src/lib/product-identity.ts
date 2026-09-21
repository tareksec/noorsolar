export interface ProductIdentity {
  manufacturer: string | null;
  manufacturerModel: string | null;
  series: string | null;
  noorSku: string | null;
  originCountry: string | null;
}

export function extractProductIdentity(product: {
  model?: string | null;
  brand?: string | null;
  specs?: Array<{ label: string; value: string; labelBn?: string | null; valueBn?: string | null }>;
}): ProductIdentity {
  let manufacturer: string | null = product.brand?.trim() || null;
  let manufacturerModel: string | null = null;
  let series: string | null = null;
  let noorSku: string | null = null;
  let originCountry: string | null = null;

  // Check model string
  if (product.model) {
    const trimmed = product.model.trim();
    if (trimmed.toUpperCase().startsWith("NS-") || trimmed.toUpperCase().startsWith("NOOR-")) {
      noorSku = trimmed;
    } else if (manufacturer) {
      manufacturerModel = trimmed;
    } else {
      noorSku = trimmed;
    }
  }

  // Scan specs for explicit metadata if provided
  if (product.specs && Array.isArray(product.specs)) {
    for (const spec of product.specs) {
      const lbl = (spec.label || "").trim().toLowerCase();
      const val = (spec.value || "").trim();
      if (!val) continue;

      if (!manufacturer && (lbl === "manufacturer" || lbl === "brand" || lbl.includes("প্রস্তুতকারক"))) {
        manufacturer = val;
      } else if (!manufacturerModel && (lbl === "manufacturer model" || lbl === "factory model" || lbl.includes("প্রস্তুতকারক মডেল"))) {
        manufacturerModel = val;
      } else if (!series && (lbl === "series" || lbl.includes("সিরিজ"))) {
        series = val;
      } else if (lbl === "noor sku" || lbl === "internal sku" || lbl === "sku" || lbl.includes("এসকেইউ") || lbl.includes("ক্যাটালগ কোড")) {
        noorSku = val;
      } else if (!originCountry && (lbl === "country of origin" || lbl === "origin" || lbl.includes("উৎস দেশ") || lbl.includes("উৎপাদনকারী দেশ"))) {
        originCountry = val;
      }
    }
  }

  return {
    manufacturer,
    manufacturerModel,
    series,
    noorSku,
    originCountry,
  };
}
