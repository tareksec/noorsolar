import { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://noorsolarbd.com";
  const hideSample = process.env.HIDE_SAMPLE_CONTENT === "true";

  const staticRoutes = [
    "",
    "/products",
    "/about",
    "/contact",
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  try {
    const categories = await db.category.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });

    const categoryRoutes = categories.map((cat) => ({
      url: `${siteUrl}/category/${cat.slug}`,
      lastModified: cat.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    const products = await db.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });

    const productRoutes = products.map((prod) => ({
      url: `${siteUrl}/product/${prod.slug}`,
      lastModified: prod.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.9,
    }));

    // Blog posts
    const blogPosts = await db.blogPost.findMany({
      where: {
        status: "PUBLISHED",
        ...(hideSample ? { isSample: false } : {}),
      },
      select: { slug: true, updatedAt: true },
    });

    const blogRoutes = blogPosts.length > 0 ? [
      {
        url: `${siteUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.8,
      },
      ...blogPosts.map((post) => ({
        url: `${siteUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    ] : [];

    return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...blogRoutes];
  } catch (error) {
    console.error("Failed to generate dynamic sitemap routes:", error);
    return staticRoutes;
  }
}
