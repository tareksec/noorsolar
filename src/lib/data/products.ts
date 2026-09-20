import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

function localizeProduct<
  T extends {
    name: string;
    nameBn?: string | null;
    shortDescription?: string | null;
    shortDescriptionBn?: string | null;
    description?: string | null;
    descriptionBn?: string | null;
    moq?: string | null;
    moqBn?: string | null;
    leadTime?: string | null;
    leadTimeBn?: string | null;
    metaTitle?: string | null;
    metaTitleBn?: string | null;
    metaDescription?: string | null;
    metaDescriptionBn?: string | null;
    images?: Array<{ alt: string; altBn?: string | null; [key: string]: unknown }>;
    specs?: Array<{ label: string; labelBn?: string | null; value: string; valueBn?: string | null; [key: string]: unknown }>;
    category?: { name: string; nameBn?: string | null; description?: string | null; descriptionBn?: string | null; [key: string]: unknown } | null;
  }
>(product: T, locale?: string): T {
  if (locale !== "bn") return product;
  return {
    ...product,
    name: product.nameBn?.trim() || product.name,
    shortDescription: product.shortDescriptionBn?.trim() || product.shortDescription,
    description: product.descriptionBn?.trim() || product.description,
    moq: product.moqBn?.trim() || product.moq,
    leadTime: product.leadTimeBn?.trim() || product.leadTime,
    metaTitle: product.metaTitleBn?.trim() || product.metaTitle,
    metaDescription: product.metaDescriptionBn?.trim() || product.metaDescription,
    category: product.category
      ? {
          ...product.category,
          name: product.category.nameBn?.trim() || product.category.name,
          description: product.category.descriptionBn?.trim() || product.category.description,
        }
      : product.category,
    images: product.images?.map((img) => ({
      ...img,
      alt: img.altBn?.trim() || img.alt,
    })),
    specs: product.specs?.map((s) => ({
      ...s,
      label: s.labelBn?.trim() || s.label,
      value: s.valueBn?.trim() || s.value,
    })),
  };
}

export async function getFeaturedProducts(locale?: string) {
  try {
    let products = await db.product.findMany({
      where: { isActive: true, isFeatured: true },
      orderBy: { sortOrder: "asc" },
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
        specs: { orderBy: { sortOrder: "asc" } },
      },
    });

    // Ensure Shop Solar carousel always has a rich variety of at least 12 products
    if (products.length < 12) {
      const additional = await db.product.findMany({
        where: {
          isActive: true,
          id: { notIn: products.map((p) => p.id) },
        },
        orderBy: { sortOrder: "asc" },
        take: 12 - products.length,
        include: {
          category: true,
          images: { orderBy: { sortOrder: "asc" } },
          specs: { orderBy: { sortOrder: "asc" } },
        },
      });
      products = [...products, ...additional];
    }

    return products.map((p) => localizeProduct(p, locale));
  } catch (error) {
    console.warn("getFeaturedProducts: database not available, returning empty list", error);
    return [];
  }
}

export async function getAllProducts(options?: {
  categorySlug?: string;
  query?: string;
  locale?: string;
}) {
  try {
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
        { nameBn: { contains: q } },
        { shortDescriptionBn: { contains: q } },
        { descriptionBn: { contains: q } },
      ];
    }

    const products = await db.product.findMany({
      where,
      orderBy: { sortOrder: "asc" },
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
        specs: { orderBy: { sortOrder: "asc" } },
      },
    });

    return products.map((p) => localizeProduct(p, options?.locale));
  } catch (error) {
    console.warn("getAllProducts: database not available, returning empty list", error);
    return [];
  }
}

export async function getProductBySlug(slug: string, locale?: string) {
  try {
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

    return {
      product: localizeProduct(product, locale),
      related: related.map((p) => localizeProduct(p, locale)),
    };
  } catch (error) {
    console.warn(`getProductBySlug: failed to fetch slug ${slug}`, error);
    return null;
  }
}

export async function getProductsByCategory(categorySlug: string, locale?: string) {
  try {
    const products = await db.product.findMany({
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

    return products.map((p) => localizeProduct(p, locale));
  } catch (error) {
    console.warn(`getProductsByCategory: failed to fetch category ${categorySlug}`, error);
    return [];
  }
}

export async function getSpecHighlights() {
  let maxPanelWatt = 700;
  let maxBatteryKwh = 15.36;
  let maxInverterKw = 100;
  let totalCatalogModels = 12;

  try {
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
  } catch (error) {
    console.warn("getSpecHighlights: database not available, using default highlights", error);
  }

  return {
    maxPanelWatt,
    maxBatteryKwh,
    maxInverterKw,
    totalCatalogModels,
  };
}

