import { db } from "@/lib/db";

const fallbackCategories = [
  {
    id: "cat-panels",
    slug: "solar-panels",
    name: "Solar Panels",
    nameBn: "সোলার প্যানেল",
    description: "High-efficiency N-Type TOPCon & Bifacial monocrystalline modules for commercial & utility projects.",
    descriptionBn: "বাণিজ্যিক ও ইউটিলিটি প্রকল্পের জন্য উচ্চ-দক্ষতাসম্পন্ন এন-টাইপ TOPCon এবং বাইফেসিয়াল মনোক্রিস্টালাইন মডিউল।",
    image: "/photos/cat-solar-panels.webp",
    sortOrder: 0,
    isActive: true,
    _count: { products: 6 },
  },
  {
    id: "cat-batteries",
    slug: "lithium-batteries",
    name: "Lithium Batteries",
    nameBn: "লিথিয়াম ব্যাটারি",
    description: "High-voltage LiFePO4 energy storage systems with long lifecycle and intelligent BMS protection.",
    descriptionBn: "দীর্ঘ সাইকেল লাইফ ও ইন্টেলিজেন্ট বিএমএস সুরক্ষা সম্বলিত হাই-ভোল্টেজ LiFePO4 শক্তি সঞ্চয় ব্যবস্থা।",
    image: "/photos/cat-lithium-batteries.webp",
    sortOrder: 1,
    isActive: true,
    _count: { products: 4 },
  },
  {
    id: "cat-inverters",
    slug: "solar-inverters",
    name: "Solar Inverters",
    nameBn: "সোলার ইনভার্টার",
    description: "Industrial three-phase grid-tied and hybrid inverters engineered for high ambient temperatures.",
    descriptionBn: "উচ্চ পরিবেষ্টিত তাপমাত্রার জন্য ডিজাইন করা ইন্ডাস্ট্রিয়াল থ্রি-ফেজ অন-গ্রিড এবং হাইব্রিড ইনভার্টার।",
    image: "/photos/cat-solar-inverters.webp",
    sortOrder: 2,
    isActive: true,
    _count: { products: 5 },
  },
];

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

    const activeCategories = categories.length > 0 ? categories : fallbackCategories;

    if (locale !== "bn") return activeCategories;

    return activeCategories.map((cat) => ({
      ...cat,
      name: cat.nameBn?.trim() || cat.name,
      description: cat.descriptionBn?.trim() || cat.description,
    }));
  } catch (error) {
    console.warn("getCategories: database not available, returning fallback list", error);
    if (locale !== "bn") return fallbackCategories;
    return fallbackCategories.map((cat) => ({
      ...cat,
      name: cat.nameBn?.trim() || cat.name,
      description: cat.descriptionBn?.trim() || cat.description,
    }));
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

