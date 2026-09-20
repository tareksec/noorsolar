import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export function calculateReadingTime(text: string, locale?: string): string {
  if (!text) return locale === "bn" ? "1 মিনিট পাঠ" : "1 min read";
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  // Numbers stay in Western digits (0-9) everywhere per prompt instructions
  return locale === "bn" ? `${minutes} min read` : `${minutes} min read`;
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

function localizeBlogPost<
  T extends {
    title: string;
    titleBn?: string | null;
    excerpt?: string | null;
    excerptBn?: string | null;
    content: string;
    contentBn?: string | null;
    tags?: string | null;
    tagsBn?: string | null;
    coverAlt?: string | null;
    coverAltBn?: string | null;
    metaTitle?: string | null;
    metaTitleBn?: string | null;
    metaDescription?: string | null;
    metaDescriptionBn?: string | null;
  }
>(post: T, locale?: string): T {
  if (locale !== "bn") return post;
  return {
    ...post,
    title: post.titleBn?.trim() || post.title,
    excerpt: post.excerptBn?.trim() || post.excerpt,
    content: post.contentBn?.trim() || post.content,
    tags: post.tagsBn?.trim() || post.tags,
    coverAlt: post.coverAltBn?.trim() || post.coverAlt,
    metaTitle: post.metaTitleBn?.trim() || post.metaTitle,
    metaDescription: post.metaDescriptionBn?.trim() || post.metaDescription,
  };
}

export async function getPublishedBlogPosts(options?: {
  page?: number;
  pageSize?: number;
  tag?: string;
  query?: string;
  locale?: string;
}) {
  const page = Math.max(1, options?.page || 1);
  const pageSize = options?.pageSize || 9;
  const hideSample = process.env.HIDE_SAMPLE_CONTENT === "true";

  const where: Prisma.BlogPostWhereInput = {
    status: "PUBLISHED",
    ...(hideSample ? { isSample: false } : {}),
  };

  if (options?.tag) {
    where.OR = [
      { tags: { contains: options.tag } },
      { tagsBn: { contains: options.tag } },
    ];
  }

  if (options?.query && options.query.trim()) {
    const q = options.query.trim();
    where.OR = [
      { title: { contains: q } },
      { excerpt: { contains: q } },
      { content: { contains: q } },
      { tags: { contains: q } },
      { titleBn: { contains: q } },
      { excerptBn: { contains: q } },
      { contentBn: { contains: q } },
      { tagsBn: { contains: q } },
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

  return {
    posts: posts.map((p) => {
      const loc = localizeBlogPost(p, options?.locale);
      return {
        ...loc,
        readingTime: calculateReadingTime(loc.content, options?.locale),
      };
    }),
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
    currentPage: page,
  };
}

export async function getBlogPostBySlug(slug: string, locale?: string) {
  const hideSample = process.env.HIDE_SAMPLE_CONTENT === "true";
  const post = await db.blogPost.findUnique({
    where: { slug, status: "PUBLISHED" },
  });

  if (!post) return null;
  if (hideSample && post.isSample) return null;

  const locPost = localizeBlogPost(post, locale);

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
      ...locPost,
      readingTime: calculateReadingTime(locPost.content, locale),
    },
    related: related.map((r) => {
      const locR = localizeBlogPost(r, locale);
      return {
        ...locR,
        readingTime: calculateReadingTime(locR.content, locale),
      };
    }),
  };
}

export async function hasBanglaPost(slug: string): Promise<boolean> {
  const post = await db.blogPost.findUnique({
    where: { slug, status: "PUBLISHED" },
    select: { titleBn: true, contentBn: true },
  });
  return Boolean(post?.titleBn?.trim() || post?.contentBn?.trim());
}

export async function getRecentBlogPosts(take: number = 3, locale?: string) {
  const hideSample = process.env.HIDE_SAMPLE_CONTENT === "true";
  const posts = await db.blogPost.findMany({
    where: {
      status: "PUBLISHED",
      ...(hideSample ? { isSample: false } : {}),
    },
    take,
    orderBy: { publishedAt: "desc" },
  });

  return posts.map((p) => {
    const loc = localizeBlogPost(p, locale);
    return {
      ...loc,
      readingTime: calculateReadingTime(loc.content, locale),
    };
  });
}
