"use server";

import { headers } from "next/headers";
import { db } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { quoteRequestSchema } from "@/lib/validation";

export type QuoteActionResult = {
  success: boolean;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
};

export async function submitQuoteRequest(
  _prevState: unknown,
  formData: FormData
): Promise<QuoteActionResult> {
  try {
    const headerList = await headers();
    const forwarded = headerList.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

    // Rate limit per IP
    const rateCheck = checkRateLimit(`quote:${ip}`, 5, 10 * 60 * 1000);
    if (!rateCheck.success) {
      return {
        success: false,
        error: "Too many quote requests. Please wait a few minutes or contact us directly via WhatsApp/Phone.",
      };
    }

    const rawData: Record<string, string> = {};
    formData.forEach((value, key) => {
      if (typeof value === "string") {
        rawData[key] = value.trim();
      }
    });

    // Honeypot check for bots
    if (rawData.website_hp && rawData.website_hp.length > 0) {
      // Fake success for spam bots
      return {
        success: true,
        message: "Your enquiry has been received.",
      };
    }

    const validation = quoteRequestSchema.safeParse(rawData);
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      const firstError = Object.values(fieldErrors)[0]?.[0] || "Invalid form submission.";
      return {
        success: false,
        error: firstError,
        errors: fieldErrors as Record<string, string[]>,
      };
    }

    const data = validation.data;

    if (data.productId) {
      const product = await db.product.findFirst({
        where: { id: data.productId, isActive: true, category: { isActive: true } },
        select: { id: true },
      });
      if (!product) return { success: false, error: "This product is no longer available. Please choose another product or send a general enquiry." };
    }

    // Save to database
    await db.quoteRequest.create({
      data: {
        name: data.name,
        phone: data.phone,
        company: data.company || null,
        email: data.email || null,
        productId: data.productId || null,
        quantity: data.quantity || null,
        location: data.location || null,
        message: data.message || null,
        status: "NEW",
      },
    });

    return {
      success: true,
      message: "Your enquiry has been saved. Our sales team will use the details you provided to discuss pricing and availability.",
    };
  } catch (err: unknown) {
    console.error("Quote submission error:", err);
    return {
      success: false,
      error: "An unexpected error occurred while submitting your request. Please call or WhatsApp us directly.",
    };
  }
}
