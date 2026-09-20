import { db } from "@/lib/db";

export async function getCategories(locale?: string) {
  try {
    const categories = await db.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: {
            products: {
              where: { isActive: true },
            },
          },
        },
      },
    });

    if (locale !== "bn") return categories;

    return categories.map((cat) => ({
      ...cat,
      name: cat.nameBn?.trim() || cat.name,
      description: cat.descriptionBn?.trim() || cat.description,
    }));
  } catch (error) {
    console.warn("getCategories: database not available, returning empty list", error);
    return [];
  }
}

export async function getCategoryBySlug(slug: string, locale?: string) {
  try {
    const category = await db.category.findUnique({
      where: { slug, isActive: true },
      include: {
        products: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
          include: {
            images: { orderBy: { sortOrder: "asc" } },
            specs: { orderBy: { sortOrder: "asc" } },
          },
        },
      },
    });

    if (!category || locale !== "bn") return category;

    return {
      ...category,
      name: category.nameBn?.trim() || category.name,
      description: category.descriptionBn?.trim() || category.description,
      products: category.products.map((p) => ({
        ...p,
        name: p.nameBn?.trim() || p.name,
        shortDescription: p.shortDescriptionBn?.trim() || p.shortDescription,
        description: p.descriptionBn?.trim() || p.description,
        moq: p.moqBn?.trim() || p.moq,
        leadTime: p.leadTimeBn?.trim() || p.leadTime,
        metaTitle: p.metaTitleBn?.trim() || p.metaTitle,
        metaDescription: p.metaDescriptionBn?.trim() || p.metaDescription,
        images: p.images.map((img) => ({
          ...img,
          alt: img.altBn?.trim() || img.alt,
        })),
        specs: p.specs.map((s) => ({
          ...s,
          label: s.labelBn?.trim() || s.label,
          value: s.valueBn?.trim() || s.value,
        })),
      })),
    };
  } catch (error) {
    console.warn(`getCategoryBySlug: failed to fetch slug ${slug}`, error);
    return null;
  }
}

