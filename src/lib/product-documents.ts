export interface ProductDocuments {
  datasheet?: string | null;
  warranty?: string | null;
  certificate?: string | null;
  manual?: string | null;
  testReport?: string | null;
  packingSheet?: string | null;
}

export function isValidDocumentUrl(url?: string | null): string | null {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed || trimmed === "#" || trimmed === "/#" || trimmed === "/" || trimmed.toLowerCase().includes("example.com")) {
    return null;
  }
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://") && !trimmed.startsWith("/")) {
    return null;
  }
  return trimmed;
}

/**
 * Parses the raw datasheetUrl field from a Product.
 * Backwards-compatible: if it's a plain URL, treats it as { datasheet: raw }.
 * If it's a JSON string, extracts all attached documents.
 */
export function parseProductDocuments(raw?: string | null): ProductDocuments {
  if (!raw || typeof raw !== "string") return {};

  const trimmed = raw.trim();
  if (!trimmed) return {};

  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    try {
      const parsed = JSON.parse(trimmed);
      return {
        datasheet: isValidDocumentUrl(parsed.datasheet),
        warranty: isValidDocumentUrl(parsed.warranty),
        certificate: isValidDocumentUrl(parsed.certificate),
        manual: isValidDocumentUrl(parsed.manual),
        testReport: isValidDocumentUrl(parsed.testReport),
        packingSheet: isValidDocumentUrl(parsed.packingSheet),
      };
    } catch {
      // If parsing fails, treat as a single datasheet URL
      return { datasheet: isValidDocumentUrl(trimmed) };
    }
  }

  return { datasheet: isValidDocumentUrl(trimmed) };
}

/**
 * Encodes ProductDocuments into a string for storage in product.datasheetUrl.
 */
export function encodeProductDocuments(docs: ProductDocuments): string | null {
  const cleaned: Record<string, string> = {};
  if (docs.datasheet?.trim()) cleaned.datasheet = docs.datasheet.trim();
  if (docs.warranty?.trim()) cleaned.warranty = docs.warranty.trim();
  if (docs.certificate?.trim()) cleaned.certificate = docs.certificate.trim();
  if (docs.manual?.trim()) cleaned.manual = docs.manual.trim();
  if (docs.testReport?.trim()) cleaned.testReport = docs.testReport.trim();
  if (docs.packingSheet?.trim()) cleaned.packingSheet = docs.packingSheet.trim();

  const keys = Object.keys(cleaned);
  if (keys.length === 0) return null;
  if (keys.length === 1 && cleaned.datasheet) {
    return cleaned.datasheet;
  }
  return JSON.stringify(cleaned);
}
