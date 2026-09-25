"use server";

import { revalidatePublic } from "@/lib/revalidate";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { processAndSaveImage, deleteUploadedFile } from "@/lib/uploads";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

export type CategoryActionResult = {
  success: boolean;
  error?: string;
};

export async function createCategoryAction(
  _prevState: unknown,
  formData: FormData
): Promise<CategoryActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    const name = (formData.get("name") as string)?.trim();
    if (!name) return { success: false, error: "Category name is required" };

    let slug = (formData.get("slug") as string)?.trim() || slugify(name);
    const nameBn = (formData.get("nameBn") as string)?.trim() || null;
    const description = (formData.get("description") as string)?.trim() || null;
    const descriptionBn = (formData.get("descriptionBn") as string)?.trim() || null;
    const sortOrderStr = formData.get("sortOrder") as string;
    const sortOrder = sortOrderStr ? parseInt(sortOrderStr, 10) : 0;

    const existing = await db.category.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    let image = "/demo/category-panels.svg";
    const file = formData.get("image") as File;
    if (file && file.size > 0 && file.name) {
      const saved = await processAndSaveImage(file, "cat");
      if (saved) image = saved.url;
    }

    await db.category.create({
      data: {
        name,
        nameBn,
        slug,
        description,
        descriptionBn,
        sortOrder,
        image,
        isActive: true,
      },
    });

    revalidatePublic("/");
    revalidatePublic("/bn");
    revalidatePublic("/products");
    revalidatePublic("/bn/products");
    revalidatePublic("/admin/categories");
    revalidatePublic("/admin/products");
    revalidatePublic("/admin/products/new");
    return { success: true };
  } catch (err: unknown) {
    console.error("Create category error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create category",
    };
  }
}

export async function updateCategoryAction(
  _prevState: unknown,
  formData: FormData
): Promise<CategoryActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    const id = formData.get("id") as string;
    if (!id) return { success: false, error: "Missing category ID" };

    const name = (formData.get("name") as string)?.trim();
    if (!name) return { success: false, error: "Category name is required" };

    const nameBn = (formData.get("nameBn") as string)?.trim() || null;
    const slug = (formData.get("slug") as string)?.trim() || slugify(name);
    const description = (formData.get("description") as string)?.trim() || null;
    const descriptionBn = (formData.get("descriptionBn") as string)?.trim() || null;
    const sortOrderStr = formData.get("sortOrder") as string;
    const sortOrder = sortOrderStr ? parseInt(sortOrderStr, 10) : 0;

    const file = formData.get("image") as File;
    let newImageUrl: string | undefined = undefined;
    if (file && file.size > 0 && file.name) {
      const saved = await processAndSaveImage(file, "cat");
      if (saved) {
        newImageUrl = saved.url;
        const current = await db.category.findUnique({ where: { id } });
        if (current?.image && current.image.startsWith("/uploads/")) {
          deleteUploadedFile(current.image);
        }
      }
    }

    await db.category.update({
      where: { id },
      data: {
        name,
        nameBn,
        slug,
        description,
        descriptionBn,
        sortOrder,
        ...(newImageUrl ? { image: newImageUrl } : {}),
      },
    });

    revalidatePublic("/");
    revalidatePublic("/bn");
    revalidatePublic("/products");
    revalidatePublic("/bn/products");
    revalidatePublic(`/category/${slug}`);
    revalidatePublic(`/bn/category/${slug}`);
    revalidatePublic("/admin/categories");
    return { success: true };
  } catch (err: unknown) {
    console.error("Update category error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update category",
    };
  }
}

export async function reorderCategoryAction(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  const direction = formData.get("direction") as "up" | "down";

  const categories = await db.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) return;

  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= categories.length) return;

  const currentCat = categories[index];
  const targetCat = categories[targetIndex];

  // If both have same sortOrder, ensure distinct order
  const currentOrder = currentCat.sortOrder;
  const targetOrder = targetCat.sortOrder === currentOrder 
    ? (direction === "up" ? currentOrder - 1 : currentOrder + 1)
    : targetCat.sortOrder;

  await db.$transaction([
    db.category.update({
      where: { id: currentCat.id },
      data: { sortOrder: targetOrder },
    }),
    db.category.update({
      where: { id: targetCat.id },
      data: { sortOrder: currentOrder },
    }),
  ]);

  revalidatePublic("/admin/categories");
  revalidatePublic("/");
  revalidatePublic("/products");
}

export async function toggleCategoryActiveAction(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  if (!id) return;

  const curr = await db.category.findUnique({ where: { id } });
  if (!curr) return;

  await db.category.update({
    where: { id },
    data: { isActive: !curr.isActive },
  });

  revalidatePublic("/admin/categories");
  revalidatePublic("/admin/products");
  revalidatePublic("/admin/products/new");
  revalidatePublic("/");
  revalidatePublic("/bn");
  revalidatePublic("/products");
  revalidatePublic("/bn/products");
}

export type CategoryDeleteResult = {
  success: boolean;
  error?: string;
};

export async function deleteCategoryAction(
  _prevState: unknown,
  formData: FormData
): Promise<CategoryDeleteResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const id = formData.get("id") as string;
  if (!id) return { success: false, error: "Missing category ID." };

  const productCount = await db.product.count({ where: { categoryId: id } });
  if (productCount > 0) {
    return {
      success: false,
      error: `Cannot delete: ${productCount} product(s) still use this category. Move or delete them first.`,
    };
  }

  const cat = await db.category.findUnique({ where: { id } });
  if (!cat) return { success: false, error: "Category not found." };

  await db.category.delete({ where: { id } });

  if (cat.image && cat.image.startsWith("/uploads/")) {
    deleteUploadedFile(cat.image);
  }

  revalidatePublic("/admin/categories");
  revalidatePublic("/admin/products");
  revalidatePublic("/admin/products/new");
  revalidatePublic("/");
  revalidatePublic("/bn");
  revalidatePublic("/products");
  revalidatePublic("/bn/products");
  return { success: true };
}