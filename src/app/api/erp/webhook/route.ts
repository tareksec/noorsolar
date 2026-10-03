import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { revalidatePublic } from "@/lib/revalidate";
import { revalidatePath } from "next/cache";
import { verifyErpWebhookSignature } from "@/lib/erp";

/**
 * Normalizes stock status to schema enum values
 */
function normalizeStockStatus(status?: string): "IN_STOCK" | "INCOMING" | "ON_REQUEST" | undefined {
  if (!status) return undefined;
  const s = status.toUpperCase().trim();
  if (s === "IN_STOCK" || s === "INSTOCK" || s === "AVAILABLE") return "IN_STOCK";
  if (s === "INCOMING" || s === "PREORDER" || s === "TRANSIT") return "INCOMING";
  if (s === "ON_REQUEST" || s === "OUT_OF_STOCK" || s === "ONREQUEST") return "ON_REQUEST";
  return undefined;
}

/**
 * Normalizes quote status to schema enum values
 */
function normalizeQuoteStatus(status?: string): "NEW" | "CONTACTED" | "CLOSED" | undefined {
  if (!status) return undefined;
  const s = status.toUpperCase().trim();
  if (s === "NEW" || s === "PENDING" || s === "RECEIVED") return "NEW";
  if (s === "CONTACTED" || s === "PROCESSING" || s === "IN_PROGRESS" || s === "QUOTED") return "CONTACTED";
  if (s === "CLOSED" || s === "COMPLETED" || s === "CANCELLED" || s === "REJECTED") return "CLOSED";
  return undefined;
}

/**
 * GET - Webhook status check
 */
export async function GET() {
  return NextResponse.json({
    status: "active",
    service: "Noor Solar Energy - ERP Webhook Endpoint",
    supported_events: [
      "product.updated",
      "inventory.updated",
      "inventory.bulk_update",
      "quote.status_updated",
      "order.status_updated",
      "ping",
    ],
    timestamp: new Date().toISOString(),
  });
}

/**
 * POST - Webhook receiver for Laravel ERP system
 */
export async function POST(req: NextRequest) {
  let rawBody = "";
  try {
    rawBody = await req.text();
  } catch (err) {
    return NextResponse.json(
      { error: "Unable to read request body" },
      { status: 400 }
    );
  }

  // 1. Signature Verification
  const signatureHeader =
    req.headers.get("x-erp-signature") ||
    req.headers.get("x-signature") ||
    req.headers.get("x-signature-sha256") ||
    req.headers.get("x-webhook-signature") ||
    req.headers.get("x-hub-signature-256") ||
    req.headers.get("authorization") ||
    req.headers.get("x-api-key");

  const isValid = verifyErpWebhookSignature(rawBody, signatureHeader);
  if (!isValid) {
    console.warn("[ERP Webhook] Unauthorized request received - Invalid or missing signature header.");
    return NextResponse.json(
      { error: "Unauthorized: Invalid webhook signature or token" },
      { status: 401 }
    );
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid JSON format" },
      { status: 400 }
    );
  }

  const eventType: string = (
    payload.event ||
    payload.type ||
    payload.action ||
    ""
  ).toLowerCase();

  // Log incoming webhook for audit and debugging
  try {
    await db.erpSyncLog.create({
      data: {
        entity: "WEBHOOK",
        action: eventType || "GENERIC_RECEIVE",
        status: "SUCCESS",
        payload: rawBody.slice(0, 5000), // Protect against massive payloads
      },
    });
  } catch (e) {
    console.warn("[ERP Webhook Log Error]:", e);
  }

  // 2. Ping / Connection test event
  if (eventType === "ping" || eventType === "test") {
    return NextResponse.json({
      success: true,
      message: "Pong! Noor Solar ERP Webhook is successfully connected.",
      timestamp: new Date().toISOString(),
    });
  }

  // 3. Product / Inventory / Price Update Event
  if (
    eventType.includes("product") ||
    eventType.includes("inventory") ||
    eventType.includes("stock") ||
    eventType.includes("price")
  ) {
    const items = Array.isArray(payload.data)
      ? payload.data
      : Array.isArray(payload.items)
      ? payload.items
      : [payload.data || payload];

    const results = [];

    for (const item of items) {
      const identifier = item.product_id || item.id || item.erp_product_id || item.sku || item.slug || item.model;
      if (!identifier) continue;

      // SQLite search by ID, erpProductId, slug, or model
      const product = await db.product.findFirst({
        where: {
          OR: [
            { id: String(identifier) },
            { erpProductId: String(identifier) },
            { slug: String(identifier) },
            { model: String(item.model || identifier) },
            ...(item.erp_product_id ? [{ erpProductId: String(item.erp_product_id) }] : []),
          ],
        },
      });

      if (!product) {
        results.push({ identifier, status: "not_found" });
        continue;
      }

      const updateData: any = {
        erpSyncedAt: new Date(),
      };

      if (item.erp_product_id) {
        updateData.erpProductId = String(item.erp_product_id);
      }

      // Update price if provided (in BDT)
      if (item.price_bdt !== undefined && item.price_bdt !== null) {
        const parsedPrice = parseInt(String(item.price_bdt), 10);
        if (!isNaN(parsedPrice)) {
          updateData.priceBdt = parsedPrice;
        }
      } else if (item.price !== undefined && item.price !== null) {
        const parsedPrice = parseInt(String(item.price), 10);
        if (!isNaN(parsedPrice)) {
          updateData.priceBdt = parsedPrice;
        }
      }

      // Update stock status
      let stockStatus = normalizeStockStatus(
        item.stock_status || item.stockStatus || item.status || item.inventory_status
      );

      // Support numeric quantity if passed by ERP
      if (!stockStatus && (item.stock_qty !== undefined || item.quantity !== undefined || item.stock !== undefined)) {
        const qty = Number(item.stock_qty ?? item.quantity ?? item.stock);
        if (!isNaN(qty)) {
          stockStatus = qty > 0 ? "IN_STOCK" : "ON_REQUEST";
        }
      }

      if (stockStatus) {
        updateData.stockStatus = stockStatus;
      }

      // Update show price toggle if provided
      if (typeof item.show_price === "boolean") {
        updateData.showPrice = item.show_price;
      }

      // Execute SQLite update
      const updatedProduct = await db.product.update({
        where: { id: product.id },
        data: updateData,
      });

      // Purge Next.js static / ISR caches
      revalidatePublic("/");
      revalidatePublic("/products");
      revalidatePublic(`/product/${updatedProduct.slug}`);
      revalidatePublic("/admin/products");

      results.push({
        id: updatedProduct.id,
        slug: updatedProduct.slug,
        priceBdt: updatedProduct.priceBdt,
        stockStatus: updatedProduct.stockStatus,
        status: "updated",
      });
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${results.length} product(s)`,
      results,
    });
  }

  // 4. Quote / Order Status Update Event
  if (
    eventType.includes("quote") ||
    eventType.includes("order") ||
    eventType.includes("lead")
  ) {
    const data = payload.data || payload;
    const quoteId = data.quote_id || data.website_quote_id || data.id;
    const erpQuoteId = data.erp_quote_id || data.order_id || data.erp_id;

    if (!quoteId && !erpQuoteId) {
      return NextResponse.json(
        { error: "Missing quote_id or erp_quote_id in payload" },
        { status: 422 }
      );
    }

    // Lookup quote in SQLite
    const quote = await db.quoteRequest.findFirst({
      where: {
        OR: [
          ...(quoteId ? [{ id: String(quoteId) }] : []),
          ...(erpQuoteId ? [{ erpQuoteId: String(erpQuoteId) }] : []),
        ],
      },
    });

    if (!quote) {
      return NextResponse.json(
        { error: "Quote request not found in database" },
        { status: 404 }
      );
    }

    const updateData: any = {
      erpSyncedAt: new Date(),
    };

    if (erpQuoteId) {
      updateData.erpQuoteId = String(erpQuoteId);
      updateData.erpSyncStatus = "SYNCED";
    }

    const newStatus = normalizeQuoteStatus(data.status);
    if (newStatus) {
      updateData.status = newStatus;
    }

    if (data.tracking_status) {
      updateData.erpTrackingStatus = String(data.tracking_status);
    }

    if (data.tracking_number) {
      updateData.trackingNumber = String(data.tracking_number);
    }

    if (data.note || data.erp_note) {
      const addedNote = `[ERP ${new Date().toLocaleDateString("en-GB")}]: ${data.note || data.erp_note}`;
      updateData.note = quote.note ? `${quote.note}\n${addedNote}` : addedNote;
    }

    const updatedQuote = await db.quoteRequest.update({
      where: { id: quote.id },
      data: updateData,
    });

    // Invalidate Admin paths
    revalidatePath("/admin/quotes");
    revalidatePath("/admin");

    return NextResponse.json({
      success: true,
      message: "Quote status successfully updated from ERP",
      quote: {
        id: updatedQuote.id,
        status: updatedQuote.status,
        erpQuoteId: updatedQuote.erpQuoteId,
        erpTrackingStatus: updatedQuote.erpTrackingStatus,
        trackingNumber: updatedQuote.trackingNumber,
      },
    });
  }

  // Unhandled event fallback
  return NextResponse.json(
    {
      success: true,
      message: `Event '${eventType}' acknowledged (no action configured)`,
    },
    { status: 200 }
  );
}
