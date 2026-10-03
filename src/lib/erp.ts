import crypto from "crypto";
import { db } from "@/lib/db";

// Environment configurations
const ERP_API_BASE_URL = (process.env.ERP_API_BASE_URL || "").replace(/\/+$/, "");
const ERP_API_KEY = process.env.ERP_API_KEY || "";
const ERP_WEBHOOK_SECRET = process.env.ERP_WEBHOOK_SECRET || "";

export interface ErpQuotePayload {
  id: string;
  name: string;
  company?: string | null;
  phone: string;
  email?: string | null;
  quantity?: string | null;
  location?: string | null;
  message?: string | null;
  createdAt: Date;
  productId?: string | null;
  product?: {
    id: string;
    slug?: string;
    name: string;
    model?: string | null;
    erpProductId?: string | null;
  } | null;
}

export interface ErpProductSyncPayload {
  id: string;
  slug: string;
  name: string;
  brand?: string | null;
  model?: string | null;
  priceBdt?: number | null;
  stockStatus: string; // IN_STOCK | INCOMING | ON_REQUEST
  showPrice?: boolean;
  erpProductId?: string | null;
}

/**
 * Check if outgoing ERP integration is configured in .env
 */
export function isErpConfigured(): boolean {
  return Boolean(ERP_API_BASE_URL && ERP_API_KEY);
}

/**
 * Verify Webhook signature received from ERP system (Laravel)
 * Supports HMAC-SHA256 signature in hex or base64 format, or Bearer token
 */
export function verifyErpWebhookSignature(
  rawBody: string,
  signatureHeader: string | null
): boolean {
  if (!ERP_WEBHOOK_SECRET) {
    console.warn("[ERP Webhook] ERP_WEBHOOK_SECRET is not configured in .env.");
    return false;
  }

  if (!signatureHeader) {
    return false;
  }

  try {
    // 1. If transmitted as a Bearer or direct secret token
    const cleanHeader = signatureHeader.replace(/^Bearer\s+/i, "").trim();
    if (cleanHeader === ERP_WEBHOOK_SECRET || (ERP_API_KEY && cleanHeader === ERP_API_KEY)) {
      return true;
    }

    // 2. If transmitted as HMAC-SHA256 (e.g., "sha256=abc..." or "abc...")
    const rawSig = signatureHeader.replace(/^sha256=/i, "").trim().toLowerCase();

    const hmacHex = crypto
      .createHmac("sha256", ERP_WEBHOOK_SECRET)
      .update(rawBody, "utf8")
      .digest("hex")
      .toLowerCase();

    const hmacBase64 = crypto
      .createHmac("sha256", ERP_WEBHOOK_SECRET)
      .update(rawBody, "utf8")
      .digest("base64");

    // Timing-safe buffer comparison
    const sigBuffer = Buffer.from(rawSig);
    const hexBuffer = Buffer.from(hmacHex);
    const base64Buffer = Buffer.from(hmacBase64);

    const matchesHex =
      sigBuffer.length === hexBuffer.length &&
      crypto.timingSafeEqual(sigBuffer, hexBuffer);

    const matchesBase64 =
      sigBuffer.length === base64Buffer.length &&
      crypto.timingSafeEqual(sigBuffer, base64Buffer);

    return matchesHex || matchesBase64;
  } catch (err) {
    console.error("[ERP Webhook] Signature verification error:", err);
    return false;
  }
}

/**
 * Push new quotation request to ERP in real-time
 * Sends to ERP's Quote / Order / Lead endpoint (e.g. POST /quotes or POST /leads)
 */
export async function sendQuoteToERP(quote: ErpQuotePayload): Promise<{
  success: boolean;
  erpQuoteId?: string;
  error?: string;
}> {
  if (!isErpConfigured()) {
    console.info(
      "[ERP Sync] ERP_API_BASE_URL or ERP_API_KEY is not set. Skipping real-time ERP quote sync."
    );
    return { success: false, error: "ERP not configured" };
  }

  const endpoint = `${ERP_API_BASE_URL}/quotes`;

  // Standard Laravel API format
  const payload = {
    website_quote_id: quote.id,
    customer_name: quote.name,
    company_name: quote.company || null,
    phone: quote.phone,
    email: quote.email || null,
    quantity: quote.quantity || null,
    delivery_location: quote.location || null,
    notes: quote.message || null,
    source: "WEBSITE_NOOR_SOLAR",
    created_at: quote.createdAt.toISOString(),
    product: quote.product
      ? {
          id: quote.product.id,
          name: quote.product.name,
          model: quote.product.model || null,
          erp_product_id: quote.product.erpProductId || null,
        }
      : null,
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${ERP_API_KEY}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const responseText = await res.text();
    let responseData: any = {};
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { text: responseText };
    }

    if (!res.ok) {
      const errorMsg =
        responseData?.message ||
        responseData?.error ||
        `HTTP ${res.status}: ${res.statusText}`;

      await logErpSync({
        entity: "QUOTE",
        entityId: quote.id,
        action: "SEND_QUOTE",
        status: "FAILED",
        payload: JSON.stringify(payload),
        response: JSON.stringify(responseData),
      });

      return { success: false, error: errorMsg };
    }

    // Extract reference/order ID returned from ERP
    const erpQuoteId =
      responseData?.id?.toString() ||
      responseData?.data?.id?.toString() ||
      responseData?.data?.quote_id?.toString() ||
      responseData?.reference_id?.toString() ||
      undefined;

    // Log success
    await logErpSync({
      entity: "QUOTE",
      entityId: quote.id,
      action: "SEND_QUOTE",
      status: "SUCCESS",
      payload: JSON.stringify(payload),
      response: JSON.stringify(responseData),
    });

    return {
      success: true,
      erpQuoteId,
    };
  } catch (err: any) {
    const errorMsg = err.name === "AbortError" ? "Request timed out" : err.message;
    console.error("[ERP Sync] Failed to send quote to ERP:", errorMsg);

    await logErpSync({
      entity: "QUOTE",
      entityId: quote.id,
      action: "SEND_QUOTE",
      status: "FAILED",
      payload: JSON.stringify(payload),
      response: JSON.stringify({ error: errorMsg }),
    });

    return { success: false, error: errorMsg };
  }
}

/**
 * Push updated product price or stock to ERP when edited via website dashboard
 */
export async function sendProductUpdateToERP(
  product: ErpProductSyncPayload
): Promise<{ success: boolean; error?: string }> {
  if (!isErpConfigured()) {
    return { success: false, error: "ERP not configured" };
  }

  const endpoint = `${ERP_API_BASE_URL}/products/sync`;

  const payload = {
    website_product_id: product.id,
    erp_product_id: product.erpProductId || null,
    slug: product.slug,
    name: product.name,
    brand: product.brand || null,
    model: product.model || null,
    price_bdt: product.priceBdt ?? null,
    stock_status: product.stockStatus,
    show_price: product.showPrice ?? false,
    updated_at: new Date().toISOString(),
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${ERP_API_KEY}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const responseText = await res.text();
    let responseData: any = {};
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { text: responseText };
    }

    if (!res.ok) {
      const errorMsg =
        responseData?.message ||
        responseData?.error ||
        `HTTP ${res.status}: ${res.statusText}`;

      await logErpSync({
        entity: "PRODUCT",
        entityId: product.id,
        action: "UPDATE_PRODUCT",
        status: "FAILED",
        payload: JSON.stringify(payload),
        response: JSON.stringify(responseData),
      });

      return { success: false, error: errorMsg };
    }

    await logErpSync({
      entity: "PRODUCT",
      entityId: product.id,
      action: "UPDATE_PRODUCT",
      status: "SUCCESS",
      payload: JSON.stringify(payload),
      response: JSON.stringify(responseData),
    });

    return { success: true };
  } catch (err: any) {
    const errorMsg = err.name === "AbortError" ? "Request timed out" : err.message;
    console.error("[ERP Sync] Failed to sync product to ERP:", errorMsg);

    await logErpSync({
      entity: "PRODUCT",
      entityId: product.id,
      action: "UPDATE_PRODUCT",
      status: "FAILED",
      payload: JSON.stringify(payload),
      response: JSON.stringify({ error: errorMsg }),
    });

    return { success: false, error: errorMsg };
  }
}

/**
 * Send quote status update to ERP (e.g. when changed from admin dashboard)
 */
export async function sendQuoteStatusUpdateToERP(params: {
  quoteId: string;
  erpQuoteId?: string | null;
  status: string;
  note?: string | null;
}): Promise<{ success: boolean; error?: string }> {
  if (!isErpConfigured()) {
    return { success: false, error: "ERP not configured" };
  }

  const endpoint = `${ERP_API_BASE_URL}/quotes/status`;

  const payload = {
    website_quote_id: params.quoteId,
    erp_quote_id: params.erpQuoteId || null,
    status: params.status,
    note: params.note || null,
    updated_at: new Date().toISOString(),
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${ERP_API_KEY}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const responseText = await res.text();
    let responseData: any = {};
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { text: responseText };
    }

    if (!res.ok) {
      const errorMsg =
        responseData?.message ||
        responseData?.error ||
        `HTTP ${res.status}: ${res.statusText}`;

      await logErpSync({
        entity: "QUOTE",
        entityId: params.quoteId,
        action: "UPDATE_STATUS",
        status: "FAILED",
        payload: JSON.stringify(payload),
        response: JSON.stringify(responseData),
      });

      return { success: false, error: errorMsg };
    }

    await logErpSync({
      entity: "QUOTE",
      entityId: params.quoteId,
      action: "UPDATE_STATUS",
      status: "SUCCESS",
      payload: JSON.stringify(payload),
      response: JSON.stringify(responseData),
    });

    return { success: true };
  } catch (err: any) {
    const errorMsg = err.name === "AbortError" ? "Request timed out" : err.message;
    console.error("[ERP Sync] Failed to update quote status in ERP:", errorMsg);

    await logErpSync({
      entity: "QUOTE",
      entityId: params.quoteId,
      action: "UPDATE_STATUS",
      status: "FAILED",
      payload: JSON.stringify(payload),
      response: JSON.stringify({ error: errorMsg }),
    });

    return { success: false, error: errorMsg };
  }
}

/**
 * Internal helper to record sync activities in SQLite database
 */
async function logErpSync(params: {
  entity: string;
  entityId?: string | null;
  action: string;
  status: string;
  payload?: string | null;
  response?: string | null;
}) {
  try {
    await db.erpSyncLog.create({
      data: {
        entity: params.entity,
        entityId: params.entityId || null,
        action: params.action,
        status: params.status,
        payload: params.payload || null,
        response: params.response || null,
      },
    });
  } catch (logErr) {
    // Non-blocking fallback
    console.warn("[ERP Log] Failed to insert sync log into SQLite:", logErr);
  }
}
