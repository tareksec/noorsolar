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

import { demoProducts } from "../../../prisma/seed-products";

function getFallbackDemoProducts() {
  return demoProducts.map((p, idx) => ({
    id: `fallback-${idx}`,
    slug: p.slug,
    name: p.name,
    nameBn: (p as unknown as Record<string, string>).nameBn || null,
    shortDescription: p.shortDescription,
    shortDescriptionBn: (p as unknown as Record<string, string>).shortDescriptionBn || null,
    description: p.description,
    descriptionBn: (p as unknown as Record<string, string>).descriptionBn || null,
    brand: p.brand || null,
    model: p.model || null,
    stockStatus: p.stockStatus,
    moq: p.moq || null,
    moqBn: (p as unknown as Record<string, string>).moqBn || null,
    leadTime: p.leadTime || null,
    leadTimeBn: (p as unknown as Record<string, string>).leadTimeBn || null,
    priceBdt: (p as unknown as Record<string, number>).priceBdt || null,
    showPrice: (p as unknown as Record<string, boolean>).showPrice || false,
    datasheetUrl: null,
    isFeatured: true,
    isActive: true,
    isDemo: true,
    sortOrder: p.sortOrder || idx,
    metaTitle: null,
    metaTitleBn: null,
    metaDescription: null,
    metaDescriptionBn: null,
    categoryId: p.categorySlug,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: {
      id: p.categorySlug,
      slug: p.categorySlug,
      name:
        p.categorySlug === "solar-panels"
          ? "Solar Panels"
          : p.categorySlug === "lithium-batteries"
          ? "Lithium Batteries"
          : "Solar Inverters",
      nameBn:
        p.categorySlug === "solar-panels"
          ? "সোলার প্যানেল"
          : p.categorySlug === "lithium-batteries"
          ? "লিথিয়াম ব্যাটারি"
          : "সোলার ইনভার্টার",
      description: null,
      descriptionBn: null,
      image: null,
      sortOrder: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    images: (p.images || []).map((img, imgIdx) => ({
      id: `fallback-img-${idx}-${imgIdx}`,
      productId: `fallback-${idx}`,
      url: img.url,
      alt: img.alt,
      altBn: (img as unknown as Record<string, string>).altBn || null,
      sortOrder: (img as unknown as Record<string, number>).sortOrder || imgIdx,
    })),
    specs: (p.specs || []).map((s, sIdx) => ({
      id: `fallback-spec-${idx}-${sIdx}`,
      productId: `fallback-${idx}`,
      label: s.label,
      labelBn: (s as unknown as Record<string, string>).labelBn || null,
      value: s.value,
      valueBn: (s as unknown as Record<string, string>).valueBn || null,
      sortOrder: (s as unknown as Record<string, number>).sortOrder || sIdx,
    })),
  }));
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

    if (products.length === 0) {
      const fallbackList = getFallbackDemoProducts();
      return fallbackList.map((p) => localizeProduct(p, locale));
    }

    return products.map((p) => localizeProduct(p, locale));
  } catch (error) {
    console.warn("getFeaturedProducts: database not available, returning fallback list", error);
    const fallbackList = getFallbackDemoProducts();
    return fallbackList.map((p) => localizeProduct(p, locale));
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

    if (products.length === 0) {
      let fallbackList = getFallbackDemoProducts();
      if (options?.categorySlug && options.categorySlug !== "all") {
        fallbackList = fallbackList.filter((p) => p.categoryId === options.categorySlug);
      }
      return fallbackList.map((p) => localizeProduct(p, options?.locale));
    }

    return products.map((p) => localizeProduct(p, options?.locale));
  } catch (error) {
    console.warn("getAllProducts: database not available, returning fallback list", error);
    let fallbackList = getFallbackDemoProducts();
    if (options?.categorySlug && options.categorySlug !== "all") {
      fallbackList = fallbackList.filter((p) => p.categoryId === options.categorySlug);
    }
    return fallbackList.map((p) => localizeProduct(p, options?.locale));
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

    if (!product) {
      const fallback = getFallbackDemoProducts().find((p) => p.slug === slug);
      if (fallback) {
        const related = getFallbackDemoProducts()
          .filter((p) => p.categoryId === fallback.categoryId && p.slug !== slug)
          .slice(0, 3);
        return {
          product: localizeProduct(fallback, locale),
          related: related.map((p) => localizeProduct(p, locale)),
        };
      }
      return null;
    }

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
    const fallback = getFallbackDemoProducts().find((p) => p.slug === slug);
    if (fallback) {
      const related = getFallbackDemoProducts()
        .filter((p) => p.categoryId === fallback.categoryId && p.slug !== slug)
        .slice(0, 3);
      return {
        product: localizeProduct(fallback, locale),
        related: related.map((p) => localizeProduct(p, locale)),
      };
    }
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

    if (products.length === 0) {
      const fallbackList = getFallbackDemoProducts().filter((p) => p.categoryId === categorySlug);
      return fallbackList.map((p) => localizeProduct(p, locale));
    }

    return products.map((p) => localizeProduct(p, locale));
  } catch (error) {
    console.warn(`getProductsByCategory: failed to fetch category ${categorySlug}`, error);
    const fallbackList = getFallbackDemoProducts().filter((p) => p.categoryId === categorySlug);
    return fallbackList.map((p) => localizeProduct(p, locale));
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

