import { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://noorsolarbd.com";
  const hideSample = process.env.HIDE_SAMPLE_CONTENT === "true";

  const staticPaths = [
    "",
    "/products",
    "/about",
    "/contact",
    "/certifications",
  ];

  const now = new Date();

  const entries: MetadataRoute.Sitemap = [];

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

  try {
    const categories = await db.category.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });

    for (const cat of categories) {
      const enUrl = `${siteUrl}/category/${cat.slug}`;
      const bnUrl = `${siteUrl}/bn/category/${cat.slug}`;

      entries.push({
        url: enUrl,
        lastModified: cat.updatedAt,
        changeFrequency: "weekly",
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
        lastModified: cat.updatedAt,
        changeFrequency: "weekly",
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

    const products = await db.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });

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

    // Blog posts
    const blogPosts = await db.blogPost.findMany({
      where: {
        status: "PUBLISHED",
        ...(hideSample ? { isSample: false } : {}),
      },
      select: { slug: true, updatedAt: true, contentBn: true },
    });

    if (blogPosts.length > 0) {
      const enBlog = `${siteUrl}/blog`;
      const bnBlog = `${siteUrl}/bn/blog`;

      entries.push({
        url: enBlog,
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.8,
        alternates: {
          languages: {
            en: enBlog,
            bn: bnBlog,
            "x-default": enBlog,
          },
        },
      });

      entries.push({
        url: bnBlog,
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.8,
        alternates: {
          languages: {
            en: enBlog,
            bn: bnBlog,
            "x-default": enBlog,
          },
        },
      });

      for (const post of blogPosts) {
        const enPost = `${siteUrl}/blog/${post.slug}`;
        const hasBn = !!post.contentBn?.trim();
        const bnPost = hasBn ? `${siteUrl}/bn/blog/${post.slug}` : bnBlog;

        entries.push({
          url: enPost,
          lastModified: post.updatedAt,
          changeFrequency: "weekly",
          priority: 0.7,
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
            priority: 0.7,
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
    }

    return entries;
  } catch (error) {
    console.error("Failed to generate dynamic sitemap routes:", error);
    return entries;
  }
}
