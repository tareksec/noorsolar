import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export function calculateReadingTime(text: string): string {
  if (!text) return "1 min read";
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}

export async function hasVisibleBlogPosts(): Promise<boolean> {
  const hideSample = process.env.HIDE_SAMPLE_CONTENT === "true";
  const count = await db.blogPost.count({
    where: {
      status: "PUBLISHED",
      ...(hideSample ? { isSample: false } : {}),
    },
  });
  return count > 0;
}

export async function getPublishedBlogPosts(options?: {
  page?: number;
  pageSize?: number;
  tag?: string;
  query?: string;
}) {
  const page = Math.max(1, options?.page || 1);
  const pageSize = options?.pageSize || 9;
  const hideSample = process.env.HIDE_SAMPLE_CONTENT === "true";

  const where: Prisma.BlogPostWhereInput = {
    status: "PUBLISHED",
    ...(hideSample ? { isSample: false } : {}),
  };

  if (options?.tag) {
    where.tags = { contains: options.tag };
  }

  if (options?.query && options.query.trim()) {
    const q = options.query.trim();
    where.OR = [
      { title: { contains: q } },
      { excerpt: { contains: q } },
      { content: { contains: q } },
      { tags: { contains: q } },
    ];
  }

  const [totalCount, posts] = await Promise.all([
    db.blogPost.count({ where }),
    db.blogPost.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { publishedAt: "desc" },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  return {
    posts: posts.map((p) => ({
      ...p,
      readingTime: calculateReadingTime(p.content),
    })),
    totalCount,
    totalPages,
    currentPage: page,
  };
}

export async function getBlogPostBySlug(slug: string) {
  const hideSample = process.env.HIDE_SAMPLE_CONTENT === "true";
  const post = await db.blogPost.findUnique({
    where: { slug },
  });

  if (!post || post.status !== "PUBLISHED") return null;
  if (hideSample && post.isSample) return null;

  // Find related posts (exclude current)
  const related = await db.blogPost.findMany({
    where: {
      status: "PUBLISHED",
      id: { not: post.id },
      ...(hideSample ? { isSample: false } : {}),
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
  });

  return {
    post: {
      ...post,
      readingTime: calculateReadingTime(post.content),
    },
    related: related.map((r) => ({
      ...r,
      readingTime: calculateReadingTime(r.content),
    })),
  };
}
