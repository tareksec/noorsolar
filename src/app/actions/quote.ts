"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
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

    const isBn = formData.get("locale") === "bn";

    // Rate limit per IP
    const rateCheck = checkRateLimit(`quote:${ip}`, 5, 10 * 60 * 1000);
    if (!rateCheck.success) {
      return {
        success: false,
        error: isBn
          ? "অতিরিক্ত অনুরোধ পাঠানো হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন অথবা সরাসরি ফোন বা হোয়াটসঅ্যাপে যোগাযোগ করুন।"
          : "Too many quote requests. Please wait a few minutes or contact us directly via WhatsApp/Phone.",
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
        message: isBn
          ? "আপনার কোটেশন রিকোয়েস্ট জমা হয়েছে! আমাদের টিম দ্রুত যোগাযোগ করবে।"
          : "Your inquiry has been received. Our sales engineer will reach out shortly.",
      };
    }

    const validation = quoteRequestSchema.safeParse(rawData);
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      let firstError = Object.values(fieldErrors)[0]?.[0] || (isBn ? "ফর্ম তথ্য সঠিক নয়।" : "Invalid form submission.");
      if (isBn) {
        if (firstError.includes("at least 2")) firstError = "নাম কমপক্ষে ২ অক্ষরের হতে হবে।";
        else if (firstError.includes("Phone number is required")) firstError = "ফোন নম্বর দেওয়া আবশ্যক।";
        else if (firstError.includes("valid phone")) firstError = "অনুগ্রহ করে একটি সঠিক ফোন বা মোবাইল নম্বর দিন।";
        else if (firstError.includes("valid email")) firstError = "অনুগ্রহ করে সঠিক ইমেইল ঠিকানা দিন।";
      }
      return {
        success: false,
        error: firstError,
        errors: fieldErrors as Record<string, string[]>,
      };
    }

    const data = validation.data;

    const extraDetails = [
      data.buyerType ? `Buyer Type: ${data.buyerType}` : null,
      data.category ? `Category: ${data.category}` : null,
      data.requiredDate ? `Target Delivery: ${data.requiredDate}` : null,
    ].filter(Boolean);

    const compiledMessage = extraDetails.length > 0
      ? `${extraDetails.join(" | ")}${data.message ? `\n\nNotes: ${data.message}` : ""}`.trim()
      : (data.message || null);

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
        message: compiledMessage,
        status: "NEW",
      },
    });

    revalidatePath("/admin/quotes");
    revalidatePath("/admin");

    return {
      success: true,
      message: isBn
        ? "আপনার কোটেশন রিকোয়েস্ট জমা হয়েছে! আমাদের টিম দ্রুত পণ্য প্রাপ্যতা ও পাইকারি দর নিয়ে যোগাযোগ করবে।"
        : "Quote request received! Our engineering team will contact you promptly with pricing and availability.",
    };
  } catch (err: unknown) {
    console.error("Quote submission error:", err);
    const isBn = formData.get("locale") === "bn";
    return {
      success: false,
      error: isBn
        ? "অনুরোধ পাঠাতে সমস্যা হয়েছে। অনুগ্রহ করে সরাসরি আমাদের ফোন অথবা হোয়াটসঅ্যাপে যোগাযোগ করুন।"
        : "An unexpected error occurred while submitting your request. Please call or WhatsApp us directly.",
    };
  }
}
