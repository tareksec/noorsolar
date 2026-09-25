"use server";

import { redirect } from "next/navigation";
import { revalidatePublic } from "@/lib/revalidate";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { processAndSaveImage, deleteUploadedFile } from "@/lib/uploads";
import { z } from "zod";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

const BlogPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  slug: z.string().min(2, "Slug must be at least 2 characters").max(200),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(10, "Content must be at least 10 characters"),
  authorName: z.string().max(100).optional(),
  tags: z.string().max(200).optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  metaTitle: z.string().max(200).optional(),
  metaDescription: z.string().max(300).optional(),
});

export type BlogActionResult = {
  success: boolean;
  error?: string;
  postId?: string;
  imageUrl?: string;
};

export async function uploadBlogInlineImageAction(
  formData: FormData
): Promise<BlogActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    const file = formData.get("image") as File | null;
    if (!file || file.size === 0) {
      return { success: false, error: "No image file provided" };
    }

    const saved = await processAndSaveImage(file, "blog");
    if (!saved) {
      return { success: false, error: "Failed to process and save image" };
    }

    return { success: true, imageUrl: saved.url };
  } catch (err: unknown) {
    console.error("Upload blog image error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Image upload failed." };
  }
}

export async function createBlogPostAction(
  _prevState: unknown,
  formData: FormData
): Promise<BlogActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    const rawTitle = (formData.get("title") as string)?.trim() || "";
    let rawSlug = (formData.get("slug") as string)?.trim() || slugify(rawTitle);
    rawSlug = slugify(rawSlug);

    const rawStatus = (formData.get("status") as string) || "DRAFT";
    const status = rawStatus === "PUBLISHED" ? "PUBLISHED" : "DRAFT";

    const parsed = BlogPostSchema.safeParse({
      title: rawTitle,
      slug: rawSlug,
      excerpt: (formData.get("excerpt") as string)?.trim() || undefined,
      content: (formData.get("content") as string)?.trim() || "",
      authorName: (formData.get("authorName") as string)?.trim() || undefined,
      tags: (formData.get("tags") as string)?.trim() || undefined,
      status,
      metaTitle: (formData.get("metaTitle") as string)?.trim() || undefined,
      metaDescription: (formData.get("metaDescription") as string)?.trim() || undefined,
    });

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid form data.",
      };
    }

    let slug = parsed.data.slug;
    const existing = await db.blogPost.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    // Handle cover image
    let coverImage = (formData.get("coverImageUrl") as string)?.trim() || null;
    const coverFile = formData.get("coverFile") as File | null;
    if (coverFile && coverFile.size > 0 && coverFile.name) {
      const saved = await processAndSaveImage(coverFile, "blog");
      if (saved) {
        coverImage = saved.url;
      }
    }
    const coverAlt = (formData.get("coverAlt") as string)?.trim() || `${parsed.data.title} cover`;

    const titleBn = (formData.get("titleBn") as string)?.trim() || null;
    const excerptBn = (formData.get("excerptBn") as string)?.trim() || null;
    const contentBn = (formData.get("contentBn") as string)?.trim() || null;
    const coverAltBn = (formData.get("coverAltBn") as string)?.trim() || null;
    const tagsBn = (formData.get("tagsBn") as string)?.trim() || null;
    const metaTitleBn = (formData.get("metaTitleBn") as string)?.trim() || null;
    const metaDescriptionBn = (formData.get("metaDescriptionBn") as string)?.trim() || null;

    const publishedAt = status === "PUBLISHED" ? new Date() : null;

    const created = await db.blogPost.create({
      data: {
        title: parsed.data.title,
        titleBn,
        slug,
        excerpt: parsed.data.excerpt || null,
        excerptBn,
        content: parsed.data.content,
        contentBn,
        authorName: parsed.data.authorName || "Noor Solar Engineering Team",
        tags: parsed.data.tags || null,
        tagsBn,
        status,
        publishedAt,
        coverImage,
        coverAlt,
        coverAltBn,
        metaTitle: parsed.data.metaTitle || null,
        metaTitleBn,
        metaDescription: parsed.data.metaDescription || null,
        metaDescriptionBn,
        isSample: false,
      },
    });

    revalidatePublic("/blog");
    revalidatePublic("/bn/blog");
    revalidatePublic("/admin/blog");
    revalidatePublic("/sitemap.xml");

    return { success: true, postId: created.id };
  } catch (err: unknown) {
    console.error("Create blog post error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create blog post.",
    };
  }
}

export async function updateBlogPostAction(
  _prevState: unknown,
  formData: FormData
): Promise<BlogActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    const id = formData.get("id") as string;
    if (!id) return { success: false, error: "Missing post ID." };

    const currentPost = await db.blogPost.findUnique({ where: { id } });
    if (!currentPost) return { success: false, error: "Post not found." };

    const rawTitle = (formData.get("title") as string)?.trim() || "";
    let rawSlug = (formData.get("slug") as string)?.trim() || slugify(rawTitle);
    rawSlug = slugify(rawSlug);

    const rawStatus = (formData.get("status") as string) || currentPost.status;
    const status = rawStatus === "PUBLISHED" ? "PUBLISHED" : "DRAFT";

    const parsed = BlogPostSchema.safeParse({
      title: rawTitle,
      slug: rawSlug,
      excerpt: (formData.get("excerpt") as string)?.trim() || undefined,
      content: (formData.get("content") as string)?.trim() || "",
      authorName: (formData.get("authorName") as string)?.trim() || undefined,
      tags: (formData.get("tags") as string)?.trim() || undefined,
      status,
      metaTitle: (formData.get("metaTitle") as string)?.trim() || undefined,
      metaDescription: (formData.get("metaDescription") as string)?.trim() || undefined,
    });

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid form data.",
      };
    }

    let slug = parsed.data.slug;
    const existing = await db.blogPost.findUnique({ where: { slug } });
    if (existing && existing.id !== id) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const titleBn = (formData.get("titleBn") as string)?.trim() || null;
    const excerptBn = (formData.get("excerptBn") as string)?.trim() || null;
    const contentBn = (formData.get("contentBn") as string)?.trim() || null;
    const coverAltBn = (formData.get("coverAltBn") as string)?.trim() || null;
    const tagsBn = (formData.get("tagsBn") as string)?.trim() || null;
    const metaTitleBn = (formData.get("metaTitleBn") as string)?.trim() || null;
    const metaDescriptionBn = (formData.get("metaDescriptionBn") as string)?.trim() || null;

    // Cover image
    let coverImage = (formData.get("coverImageUrl") as string)?.trim() || currentPost.coverImage;
    const coverFile = formData.get("coverFile") as File | null;
    if (coverFile && coverFile.size > 0 && coverFile.name) {
      const saved = await processAndSaveImage(coverFile, "blog");
      if (saved) {
        if (currentPost.coverImage?.startsWith("/uploads/")) {
          deleteUploadedFile(currentPost.coverImage);
        }
        coverImage = saved.url;
      }
    }
    const coverAlt = (formData.get("coverAlt") as string)?.trim() || `${parsed.data.title} cover`;

    let publishedAt = currentPost.publishedAt;
    if (status === "PUBLISHED" && !publishedAt) {
      publishedAt = new Date();
    } else if (status === "DRAFT") {
      publishedAt = null;
    }

    await db.blogPost.update({
      where: { id },
      data: {
        title: parsed.data.title,
        titleBn,
        slug,
        excerpt: parsed.data.excerpt || null,
        excerptBn,
        content: parsed.data.content,
        contentBn,
        authorName: parsed.data.authorName || "Noor Solar Engineering Team",
        tags: parsed.data.tags || null,
        tagsBn,
        status,
        publishedAt,
        coverImage,
        coverAlt,
        coverAltBn,
        metaTitle: parsed.data.metaTitle || null,
        metaTitleBn,
        metaDescription: parsed.data.metaDescription || null,
        metaDescriptionBn,
      },
    });

    revalidatePublic("/blog");
    revalidatePublic("/bn/blog");
    revalidatePublic(`/blog/${slug}`);
    revalidatePublic(`/bn/blog/${slug}`);
    if (currentPost.slug !== slug) {
      revalidatePublic(`/blog/${currentPost.slug}`);
      revalidatePublic(`/bn/blog/${currentPost.slug}`);
    }
    revalidatePublic("/admin/blog");
    revalidatePublic("/sitemap.xml");

    return { success: true, postId: id };
  } catch (err: unknown) {
    console.error("Update blog post error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update blog post.",
    };
  }
}

export async function deleteBlogPostAction(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  if (!id) return;

  const post = await db.blogPost.findUnique({ where: { id } });
  if (post) {
    if (post.coverImage?.startsWith("/uploads/")) {
      deleteUploadedFile(post.coverImage);
    }
    await db.blogPost.delete({ where: { id } });
  }

  revalidatePublic("/blog");
  revalidatePublic("/admin/blog");
  revalidatePublic("/sitemap.xml");
  redirect("/admin/blog");
}

export async function toggleBlogPostStatusAction(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  const currentStatus = formData.get("currentStatus") as string;
  if (!id) return;

  const newStatus = currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
  const post = await db.blogPost.findUnique({ where: { id } });
  if (!post) return;

  const publishedAt = newStatus === "PUBLISHED" ? post.publishedAt || new Date() : null;

  await db.blogPost.update({
    where: { id },
    data: {
      status: newStatus,
      publishedAt,
    },
  });

  revalidatePublic("/blog");
  revalidatePublic(`/blog/${post.slug}`);
  revalidatePublic("/admin/blog");
  revalidatePublic("/sitemap.xml");
}
