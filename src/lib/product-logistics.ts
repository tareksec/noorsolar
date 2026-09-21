export interface ProductLogistics {
  unitsPerPallet: string | null;
  palletDimensions: string | null;
  palletWeight: string | null;
  container20ft: string | null;
  container40ft: string | null;
  warehouseAvailability: string | null;
  leadTime: string | null;
  hasData: boolean;
}

export function extractProductLogistics(
  product: {
    stockStatus?: string | null;
    leadTime?: string | null;
    moq?: string | null;
    specs?: Array<{ label: string; value: string; labelBn?: string | null; valueBn?: string | null }>;
  },
  locale?: string
): ProductLogistics {
  const isBn = locale === "bn";

  let unitsPerPallet: string | null = null;
  let palletDimensions: string | null = null;
  let palletWeight: string | null = null;
  let container20ft: string | null = null;
  let container40ft: string | null = null;

  // Scan specs for product-specific packaging & logistics entries
  if (product.specs && Array.isArray(product.specs)) {
    for (const spec of product.specs) {
      const lbl = (spec.label || "").trim().toLowerCase();
      const val = isBn ? (spec.valueBn || spec.value || "").trim() : (spec.value || "").trim();
      if (!val) continue;

      if (!unitsPerPallet && (lbl.includes("units per pallet") || lbl.includes("pallet packing") || lbl.includes("pcs / pallet") || lbl.includes("প্যালেট প্রতি") || lbl.includes("প্যাকেজিং"))) {
        unitsPerPallet = val;
      } else if (!palletDimensions && (lbl.includes("pallet dimension") || lbl.includes("package dimension") || lbl.includes("packing dimension") || lbl.includes("প্যালেট সাইজ") || lbl.includes("প্যালেট পরিমাপ"))) {
        palletDimensions = val;
      } else if (!palletWeight && (lbl.includes("pallet weight") || lbl.includes("package weight") || lbl.includes("gross weight") || lbl.includes("প্যালেট ওজন"))) {
        palletWeight = val;
      } else if (!container20ft && (lbl.includes("20ft") || lbl.includes("20' container") || lbl.includes("২০ ফুট"))) {
        container20ft = val;
      } else if (!container40ft && (lbl.includes("40ft") || lbl.includes("40hq") || lbl.includes("40' hq") || lbl.includes("৪০ ফুট"))) {
        container40ft = val;
      }
    }
  }

  // If unitsPerPallet was not explicitly in specs, check MOQ string for verified pallet count
  if (!unitsPerPallet && product.moq) {
    const moqText = product.moq.toLowerCase();
    if (moqText.includes("pallet") || moqText.includes("প্যালেট")) {
      unitsPerPallet = isBn
        ? (product.moq.includes("৩১") ? "৩১ টি / প্যালেট" : product.moq)
        : product.moq;
    }
  }

  let warehouseAvailability: string | null = null;
  if (product.stockStatus === "IN_STOCK") {
    warehouseAvailability = isBn ? "ঢাকা ওয়্যারহাউস রেডি স্টক" : "Dhaka Warehouse In-Stock";
  } else if (product.stockStatus === "INCOMING") {
    warehouseAvailability = isBn ? "আসন্ন কনটেইনার চালান" : "Incoming Container Consignment";
  } else if (product.stockStatus === "ON_REQUEST") {
    warehouseAvailability = isBn ? "অনুরোধ সাপেক্ষে / কনটেইনার ইন্ডেন্ট" : "On Request / Factory Indent";
  }

  const leadTime = product.leadTime?.trim() || null;

  const hasData = Boolean(
    unitsPerPallet || palletDimensions || palletWeight || container20ft || container40ft
  );

  return {
    unitsPerPallet,
    palletDimensions,
    palletWeight,
    container20ft,
    container40ft,
    warehouseAvailability,
    leadTime,
    hasData,
  };
}
