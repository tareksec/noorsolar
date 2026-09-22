export interface ProductWarranty {
  productWarranty: string | null;
  performanceWarranty: string | null;
  manufacturerWarranty: string | null;
  localSupportResponsibility: string | null;
  warrantyDocumentUrl: string | null;
  claimProcess: string | null;
  hasData: boolean;
}

export function extractProductWarranty(
  product: {
    specs?: Array<{ label: string; value: string; labelBn?: string | null; valueBn?: string | null }>;
  },
  docs?: { warranty?: string | null },
  locale?: string
): ProductWarranty {
  const isBn = locale === "bn";

  let productWarranty: string | null = null;
  let performanceWarranty: string | null = null;

  if (product.specs && Array.isArray(product.specs)) {
    for (const spec of product.specs) {
      const lbl = (spec.label || "").trim().toLowerCase();
      const val = isBn ? (spec.valueBn || spec.value || "").trim() : (spec.value || "").trim();
      if (!val) continue;

      if (!productWarranty && (lbl.includes("product warranty") || lbl === "warranty" || lbl.includes("ওয়ারেন্টি সময়") || lbl.includes("প্রোডাক্ট ওয়ারেন্টি"))) {
        productWarranty = val;
      } else if (!performanceWarranty && (lbl.includes("performance warranty") || lbl.includes("linear warranty") || lbl.includes("cycle life") || lbl.includes("পারফরম্যান্স ওয়ারেন্টি") || lbl.includes("লিনিয়ার ওয়ারেন্টি"))) {
        performanceWarranty = val;
      }
    }
  }

  const warrantyDocumentUrl = docs?.warranty?.trim() || null;

  const hasExplicitWarranty = Boolean(productWarranty || performanceWarranty || warrantyDocumentUrl);

  // If there is explicit warranty data, construct factual manufacturer & local supplier responsibility text
  let manufacturerWarranty: string | null = null;
  let localSupportResponsibility: string | null = null;
  let claimProcess: string | null = null;

  if (hasExplicitWarranty) {
    manufacturerWarranty = isBn
      ? "ওয়ারেন্টি সরাসরি মূল সরঞ্জাম প্রস্তুতকারক কর্তৃক প্রদত্ত।"
      : "Standard warranty terms are provided and backed directly by the original equipment manufacturer.";

    localSupportResponsibility = isBn
      ? "নূর সোলার এনার্জি বাংলাদেশে স্থানীয় টেকনিক্যাল পরিদর্শন, ম্যানুফ্যাকচারারের সাথে RMA ক্লেইম সমন্বয় এবং প্রতিস্থাপন প্রক্রিয়ায় সরাসরি সহায়তা প্রদান করে।"
      : "Noor Solar Energy serves as the local technical liaison in Bangladesh, coordinating on-site diagnostics, factory RMA claims, and authorized component replacement with the manufacturer.";

    claimProcess = isBn
      ? "ওয়ারেন্টি বা RMA ক্লেইমের জন্য ক্রয়ের ইনভয়েস, সরঞ্জামের সিরিয়াল নম্বর এবং সমস্যার বিবরণ info@noorsolaren.com বা আমাদের অফিসিয়াল হোয়াটসঅ্যাপে (+880 1884-611888) পাঠান।"
      : "To initiate an RMA support claim, submit the original commercial invoice, serial numbers, and diagnostic logs to info@noorsolaren.com or our WhatsApp desk (+880 1884-611888).";
  }

  return {
    productWarranty,
    performanceWarranty,
    manufacturerWarranty,
    localSupportResponsibility,
    warrantyDocumentUrl,
    claimProcess,
    hasData: hasExplicitWarranty,
  };
}
