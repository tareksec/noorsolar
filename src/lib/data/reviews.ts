import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function isPublicReviewsEnabled(): Promise<boolean> {
  try {
    const setting = await db.siteSetting.findUnique({
      where: { key: "reviews.publicEnabled" },
    });
    return setting?.value === "true";
  } catch {
    return false;
  }
}

export async function setPublicReviewsEnabled(enabled: boolean): Promise<void> {
  await db.siteSetting.upsert({
    where: { key: "reviews.publicEnabled" },
    update: { value: enabled ? "true" : "false" },
    create: { key: "reviews.publicEnabled", value: enabled ? "true" : "false" },
  });
}

export async function getPendingReviewsCount(): Promise<number> {
  try {
    return await db.productReview.count({
      where: { status: "PENDING" },
    });
  } catch {
    return 0;
  }
}

export async function getApprovedReviewsForProduct(productId: string) {
  try {
    const reviews = await db.productReview.findMany({
      where: {
        productId,
        status: "APPROVED",
      },
      orderBy: { createdAt: "desc" },
    });

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1))
        : 0;

    return {
      reviews,
      totalReviews,
      averageRating,
    };
  } catch {
    return {
      reviews: [],
      totalReviews: 0,
      averageRating: 0,
    };
  }
}

export async function getAdminReviews(options?: {
  status?: string;
  productId?: string;
  page?: number;
  pageSize?: number;
}) {
  const page = Math.max(1, options?.page || 1);
  const pageSize = options?.pageSize || 15;

  const where: Prisma.ProductReviewWhereInput = {};

  if (options?.status && options.status !== "ALL") {
    where.status = options.status;
  }

  if (options?.productId && options.productId !== "ALL") {
    where.productId = options.productId;
  }

  const [totalCount, reviews] = await Promise.all([
    db.productReview.count({ where }),
    db.productReview.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            model: true,
          },
        },
      },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  return {
    reviews,
    totalCount,
    totalPages,
    currentPage: page,
  };
}
