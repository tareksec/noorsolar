"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { isPublicReviewsEnabled } from "@/lib/data/reviews";
import { z } from "zod";

const PublicReviewSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  authorName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .regex(/^[^<>]+$/, "Name contains invalid characters"),
  authorRole: z.string().max(100, "Role cannot exceed 100 characters").optional(),
  company: z.string().max(100, "Company cannot exceed 100 characters").optional(),
  rating: z.coerce.number().int().min(1, "Minimum rating is 1").max(5, "Maximum rating is 5"),
  title: z.string().max(150, "Title cannot exceed 150 characters").optional(),
  body: z
    .string()
    .min(10, "Review must be at least 10 characters")
    .max(2000, "Review cannot exceed 2000 characters")
    .regex(/^[^<>]+$/, "HTML tags are not allowed in reviews"),
});

export type ReviewActionResult = {
  success: boolean;
  message?: string;
  error?: string;
};

export async function submitPublicReviewAction(
  _prevState: unknown,
  formData: FormData
): Promise<ReviewActionResult> {
  try {
    const publicEnabled = await isPublicReviewsEnabled();
    if (!publicEnabled) {
      return {
        success: false,
        error: "Public review submission is currently disabled.",
      };
    }

    const headerList = await headers();
    const forwarded = headerList.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

    // Rate limit: max 5 reviews per 10 minutes per IP
    const rateCheck = checkRateLimit(`review:${ip}`, 5, 10 * 60 * 1000);
    if (!rateCheck.success) {
      return {
        success: false,
        error: "Too many submissions. Please wait a few minutes before submitting another review.",
      };
    }

    // Honeypot check
    const honeypot = formData.get("website_hp") as string;
    if (honeypot && honeypot.length > 0) {
      // Return fake success for bot
      return {
        success: true,
        message: "Thank you for your review! It has been submitted for moderation.",
      };
    }

    const parsed = PublicReviewSchema.safeParse({
      productId: formData.get("productId"),
      authorName: (formData.get("authorName") as string)?.trim(),
      authorRole: (formData.get("authorRole") as string)?.trim() || undefined,
      company: (formData.get("company") as string)?.trim() || undefined,
      rating: formData.get("rating"),
      title: (formData.get("title") as string)?.trim() || undefined,
      body: (formData.get("body") as string)?.trim(),
    });

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid review data.",
      };
    }

    // Verify product exists
    const product = await db.product.findUnique({
      where: { id: parsed.data.productId },
      select: { id: true, slug: true },
    });
    if (!product) {
      return { success: false, error: "Product not found." };
    }

    await db.productReview.create({
      data: {
        productId: parsed.data.productId,
        authorName: parsed.data.authorName,
        authorRole: parsed.data.authorRole || null,
        company: parsed.data.company || null,
        rating: parsed.data.rating,
        title: parsed.data.title || null,
        body: parsed.data.body,
        status: "PENDING",
        source: "PUBLIC",
      },
    });

    revalidatePath(`/product/${product.slug}`);
    revalidatePath("/admin/reviews");

    return {
      success: true,
      message: "Thank you! Your review has been submitted for moderation and will appear once verified.",
    };
  } catch (err: unknown) {
    console.error("Submit review error:", err);
    return {
      success: false,
      error: "An unexpected error occurred while saving your review.",
    };
  }
}
