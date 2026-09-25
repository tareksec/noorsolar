"use server";

import { revalidatePublic } from "@/lib/revalidate";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const AdminReviewSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  authorName: z.string().min(2, "Author name is required").max(100),
  authorRole: z.string().max(100).optional(),
  company: z.string().max(100).optional(),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().max(150).optional(),
  body: z.string().min(5, "Review text is required").max(2000),
  createdAt: z.string().optional(),
});

export type AdminReviewActionResult = {
  success: boolean;
  error?: string;
  reviewId?: string;
};

export async function createAdminReviewAction(
  _prevState: unknown,
  formData: FormData
): Promise<AdminReviewActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    const parsed = AdminReviewSchema.safeParse({
      productId: formData.get("productId"),
      authorName: (formData.get("authorName") as string)?.trim(),
      authorRole: (formData.get("authorRole") as string)?.trim() || undefined,
      company: (formData.get("company") as string)?.trim() || undefined,
      rating: formData.get("rating"),
      title: (formData.get("title") as string)?.trim() || undefined,
      body: (formData.get("body") as string)?.trim(),
      createdAt: (formData.get("createdAt") as string)?.trim() || undefined,
    });

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid review data.",
      };
    }

    const product = await db.product.findUnique({
      where: { id: parsed.data.productId },
      select: { id: true, slug: true },
    });
    if (!product) return { success: false, error: "Product not found." };

    const reviewDate = parsed.data.createdAt ? new Date(parsed.data.createdAt) : new Date();

    const created = await db.productReview.create({
      data: {
        productId: parsed.data.productId,
        authorName: parsed.data.authorName,
        authorRole: parsed.data.authorRole || null,
        company: parsed.data.company || null,
        rating: parsed.data.rating,
        title: parsed.data.title || null,
        body: parsed.data.body,
        status: "APPROVED", // Admin-created reviews are approved immediately!
        source: "ADMIN",
        createdAt: reviewDate,
      },
    });

    revalidatePublic(`/product/${product.slug}`);
    revalidatePublic("/admin/reviews");

    return { success: true, reviewId: created.id };
  } catch (err: unknown) {
    console.error("Create admin review error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create review.",
    };
  }
}

export async function updateReviewAction(
  _prevState: unknown,
  formData: FormData
): Promise<AdminReviewActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    const id = formData.get("id") as string;
    if (!id) return { success: false, error: "Missing review ID." };

    const authorName = (formData.get("authorName") as string)?.trim();
    if (!authorName) return { success: false, error: "Author name is required." };

    const rating = parseInt(formData.get("rating") as string, 10) || 5;
    const authorRole = (formData.get("authorRole") as string)?.trim() || null;
    const company = (formData.get("company") as string)?.trim() || null;
    const title = (formData.get("title") as string)?.trim() || null;
    const body = (formData.get("body") as string)?.trim();
    if (!body) return { success: false, error: "Review body is required." };

    const status = (formData.get("status") as string) || "PENDING";

    const updated = await db.productReview.update({
      where: { id },
      data: {
        authorName,
        authorRole,
        company,
        rating,
        title,
        body,
        status,
      },
      include: { product: { select: { slug: true } } },
    });

    revalidatePublic(`/product/${updated.product.slug}`);
    revalidatePublic("/admin/reviews");

    return { success: true, reviewId: id };
  } catch (err: unknown) {
    console.error("Update review error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update review.",
    };
  }
}

export async function setReviewStatusAction(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  const status = formData.get("status") as "APPROVED" | "REJECTED" | "PENDING";
  if (!id || !status) return;

  const review = await db.productReview.update({
    where: { id },
    data: { status },
    include: { product: { select: { slug: true } } },
  });

  revalidatePublic(`/product/${review.product.slug}`);
  revalidatePublic("/admin/reviews");
}

export async function deleteReviewAction(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  if (!id) return;

  const review = await db.productReview.delete({
    where: { id },
    include: { product: { select: { slug: true } } },
  });

  revalidatePublic(`/product/${review.product.slug}`);
  revalidatePublic("/admin/reviews");
}

export async function bulkApproveReviewsAction(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const ids = formData.getAll("selectedIds[]") as string[];
  if (!ids.length) return;

  await db.productReview.updateMany({
    where: { id: { in: ids } },
    data: { status: "APPROVED" },
  });

  revalidatePublic("/products");
  revalidatePublic("/admin/reviews");
}
