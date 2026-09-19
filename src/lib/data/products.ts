import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function getFeaturedProducts() {
  return db.product.findMany({
    where: { isActive: true, isFeatured: true },
    orderBy: { sortOrder: "asc" },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      specs: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function getAllProducts(options?: {
  categorySlug?: string;
  query?: string;
}) {
  const where: Prisma.ProductWhereInput = { isActive: true };

  if (options?.categorySlug && options.categorySlug !== "all") {
    where.category = { slug: options.categorySlug };
  }

  if (options?.query && options.query.trim()) {
    const q = options.query.trim();
    where.OR = [
      { name: { contains: q } },
      { shortDescription: { contains: q } },
      { description: { contains: q } },
      { model: { contains: q } },
    ];
  }

  return db.product.findMany({
    where,
    orderBy: { sortOrder: "asc" },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      specs: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function getProductBySlug(slug: string) {
  const product = await db.product.findUnique({
    where: { slug, isActive: true },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      specs: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!product) return null;

  const related = await db.product.findMany({
    where: {
      categoryId: product.categoryId,
      isActive: true,
      id: { not: product.id },
    },
    take: 3,
    orderBy: { sortOrder: "asc" },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      specs: { orderBy: { sortOrder: "asc" } },
    },
  });

  return { product, related };
}

export async function getProductsByCategory(categorySlug: string) {
  return db.product.findMany({
    where: {
      category: { slug: categorySlug },
      isActive: true,
    },
    orderBy: { sortOrder: "asc" },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      specs: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function getSpecHighlights() {
  const specs = await db.productSpec.findMany({
    where: {
      product: { isActive: true },
    },
    include: {
      product: {
        include: { category: true },
      },
    },
  });

  // Calculate real metrics from specs
  let maxPanelWatt = 700;
  let maxBatteryKwh = 15.36;
  let maxInverterKw = 100;
  let totalCatalogModels = 12;

  const count = await db.product.count({ where: { isActive: true } });
  if (count > 0) totalCatalogModels = count;

  for (const s of specs) {
    if (s.product.category.slug === "solar-panels") {
      const match = s.value.match(/(\d+)\s*W/i);
      if (match && parseInt(match[1]) > maxPanelWatt) {
        maxPanelWatt = parseInt(match[1]);
      }
    } else if (s.product.category.slug === "lithium-batteries") {
      const match = s.value.match(/([\d.]+)\s*kWh/i);
      if (match && parseFloat(match[1]) > maxBatteryKwh) {
        maxBatteryKwh = parseFloat(match[1]);
      }
    } else if (s.product.category.slug === "solar-inverters") {
      const match = s.value.match(/(\d+)\s*kW/i);
      if (match && parseInt(match[1]) > maxInverterKw) {
        maxInverterKw = parseInt(match[1]);
      }
    }
  }

  return {
    maxPanelWatt,
    maxBatteryKwh,
    maxInverterKw,
    totalCatalogModels,
  };
}
