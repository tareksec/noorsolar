import { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { SITE_URL } from "@/lib/site-config";
import { demoProducts } from "../../prisma/seed-products";
import { sampleBlogPosts } from "../../prisma/seed-blog";
import { sampleProjects } from "../../prisma/seed-content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = SITE_URL;
  const hideSample = process.env.HIDE_SAMPLE_CONTENT === "true";

  const staticPaths = [
    "",
    "/products",
    "/about",
    "/contact",
    "/certifications",
    "/quote",
    "/blog",
    "/deals",
    "/equipment",
    "/projects",
    "/reviews",
  ];

  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // Static Pages
  for (const path of staticPaths) {
    const enUrl = `${siteUrl}${path}`;
    const bnUrl = `${siteUrl}/bn${path}`;
    const priority = path === "" ? 1.0 : 0.8;

    entries.push({
      url: enUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority,
      alternates: {
        languages: {
          en: enUrl,
          bn: bnUrl,
          "x-default": enUrl,
        },
      },
    });

    entries.push({
      url: bnUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority,
      alternates: {
        languages: {
          en: enUrl,
          bn: bnUrl,
          "x-default": enUrl,
        },
      },
    });
  }

  // Categories
  try {
    let categories: Array<{ slug: string; updatedAt: Date }> = [];
    try {
      categories = await db.category.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      });
    } catch {
      // DB offline fallback
    }

    if (categories.length === 0) {
      categories = [
        { slug: "solar-panels", updatedAt: now },
        { slug: "lithium-batteries", updatedAt: now },
        { slug: "solar-inverters", updatedAt: now },
        { slug: "energy-storage", updatedAt: now },
      ];
    }

    for (const cat of categories) {
      const enUrl = `${siteUrl}/category/${cat.slug}`;
      const bnUrl = `${siteUrl}/bn/category/${cat.slug}`;

      entries.push({
        url: enUrl,
        lastModified: cat.updatedAt,
        changeFrequency: "weekly",
        priority: 0.85,
        alternates: {
          languages: {
            en: enUrl,
            bn: bnUrl,
            "x-default": enUrl,
          },
        },
      });

      entries.push({
        url: bnUrl,
        lastModified: cat.updatedAt,
        changeFrequency: "weekly",
        priority: 0.85,
        alternates: {
          languages: {
            en: enUrl,
            bn: bnUrl,
            "x-default": enUrl,
          },
        },
      });
    }

    // Products
    let products: Array<{ slug: string; updatedAt: Date }> = [];
    try {
      products = await db.product.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      });
    } catch {
      // DB offline fallback
    }

    if (products.length === 0) {
      products = demoProducts.map((p) => ({
        slug: p.slug,
        updatedAt: now,
      }));
    }

    for (const prod of products) {
      const enUrl = `${siteUrl}/product/${prod.slug}`;
      const bnUrl = `${siteUrl}/bn/product/${prod.slug}`;

      entries.push({
        url: enUrl,
        lastModified: prod.updatedAt,
        changeFrequency: "daily",
        priority: 0.9,
        alternates: {
          languages: {
            en: enUrl,
            bn: bnUrl,
            "x-default": enUrl,
          },
        },
      });

      entries.push({
        url: bnUrl,
        lastModified: prod.updatedAt,
        changeFrequency: "daily",
        priority: 0.9,
        alternates: {
          languages: {
            en: enUrl,
            bn: bnUrl,
            "x-default": enUrl,
          },
        },
      });
    }

    // Blog Posts
    let blogPosts: Array<{ slug: string; updatedAt: Date; contentBn?: string | null }> = [];
    try {
      blogPosts = await db.blogPost.findMany({
        where: {
          status: "PUBLISHED",
          ...(hideSample ? { isSample: false } : {}),
        },
        select: { slug: true, updatedAt: true, contentBn: true },
      });
    } catch {
      // DB offline fallback
    }

    if (blogPosts.length === 0) {
      blogPosts = sampleBlogPosts
        .filter((p) => p.status === "PUBLISHED")
        .map((p) => ({
          slug: p.slug,
          updatedAt: (p as unknown as { publishedAt?: Date }).publishedAt || now,
          contentBn: p.contentBn,
        }));
    }

    for (const post of blogPosts) {
      const enPost = `${siteUrl}/blog/${post.slug}`;
      const hasBn = !!post.contentBn?.trim();
      const bnPost = `${siteUrl}/bn/blog/${post.slug}`;

      entries.push({
        url: enPost,
        lastModified: post.updatedAt,
        changeFrequency: "weekly",
        priority: 0.75,
        alternates: {
          languages: {
            en: enPost,
            ...(hasBn ? { bn: bnPost } : {}),
            "x-default": enPost,
          },
        },
      });

      if (hasBn) {
        entries.push({
          url: bnPost,
          lastModified: post.updatedAt,
          changeFrequency: "weekly",
          priority: 0.75,
          alternates: {
            languages: {
              en: enPost,
              bn: bnPost,
              "x-default": enPost,
            },
          },
        });
      }
    }

    // Projects
    let projects: Array<{ slug: string; updatedAt: Date }> = [];
    try {
      projects = await db.project.findMany({
        where: {
          isPublished: true,
          ...(hideSample ? { isSample: false } : {}),
        },
        select: { slug: true, updatedAt: true },
      });
    } catch {
      // DB offline fallback
    }

    if (projects.length === 0) {
      projects = sampleProjects.map((p) => ({
        slug: p.slug,
        updatedAt: now,
      }));
    }

    for (const proj of projects) {
      const enUrl = `${siteUrl}/projects/${proj.slug}`;
      const bnUrl = `${siteUrl}/bn/projects/${proj.slug}`;

      entries.push({
        url: enUrl,
        lastModified: proj.updatedAt,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: {
          languages: {
            en: enUrl,
            bn: bnUrl,
            "x-default": enUrl,
          },
        },
      });

      entries.push({
        url: bnUrl,
        lastModified: proj.updatedAt,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: {
          languages: {
            en: enUrl,
            bn: bnUrl,
            "x-default": enUrl,
          },
        },
      });
    }

    return entries;
  } catch (error) {
    console.error("Failed to generate dynamic sitemap routes:", error);
    return entries;
  }
}
