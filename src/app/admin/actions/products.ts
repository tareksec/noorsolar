"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
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

export type ProductActionResult = {
  success: boolean;
  error?: string;
  productId?: string;
};

export async function createProductAction(
  _prevState: unknown,
  formData: FormData
): Promise<ProductActionResult> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized. Please log in." };
  }

  try {
    const name = (formData.get("name") as string)?.trim();
    if (!name) return { success: false, error: "Product name is required." };

    let slug = (formData.get("slug") as string)?.trim();
    if (!slug) slug = slugify(name);

    // Check slug uniqueness
    const existing = await db.product.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const categoryId = formData.get("categoryId") as string;
    if (!categoryId) return { success: false, error: "Category is required." };

    const shortDescription = (formData.get("shortDescription") as string)?.trim() || null;
    const description = (formData.get("description") as string)?.trim() || null;
    const brand = (formData.get("brand") as string)?.trim() || null;
    const model = (formData.get("model") as string)?.trim() || null;
    const stockStatus = (formData.get("stockStatus") as string) || "ON_REQUEST";
    const moq = (formData.get("moq") as string)?.trim() || null;
    const leadTime = (formData.get("leadTime") as string)?.trim() || null;
    const priceStr = formData.get("priceBdt") as string;
    const priceBdt = priceStr ? parseInt(priceStr, 10) : null;
    const showPrice = formData.get("showPrice") === "true";
    const isFeatured = formData.get("isFeatured") === "true";
    const datasheetUrl = (formData.get("datasheetUrl") as string)?.trim() || null;

    // Parse specs from parallel arrays
    const specLabels = formData.getAll("spec_labels[]") as string[];
    const specValues = formData.getAll("spec_values[]") as string[];
    const specsData = [];
    for (let i = 0; i < specLabels.length; i++) {
      const label = specLabels[i]?.trim();
      const value = specValues[i]?.trim();
      if (label && value) {
        specsData.push({ label, value, sortOrder: i });
      }
    }

    // Process image uploads
    const files = formData.getAll("images") as File[];
    const imagesData = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file && file.size > 0 && file.name) {
        const saved = await processAndSaveImage(file, "prod");
        if (saved) {
          imagesData.push({
            url: saved.url,
            alt: `${name} - Image ${i + 1}`,
            sortOrder: i,
          });
        }
      }
    }

    // Default image if none provided
    if (imagesData.length === 0) {
      imagesData.push({
        url: "/demo/category-panels.svg",
        alt: `${name} placeholder`,
        sortOrder: 0,
      });
    }

    const created = await db.product.create({
      data: {
        name,
        slug,
        categoryId,
        shortDescription,
        description,
        brand,
        model,
        stockStatus,
        moq,
        leadTime,
        priceBdt,
        showPrice,
        isFeatured,
        isActive: true,
        isDemo: false,
        datasheetUrl,
        images: { create: imagesData },
        specs: { create: specsData },
      },
    });

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin/products");
    return { success: true, productId: created.id };
  } catch (err: unknown) {
    console.error("Create product error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create product.",
    };
  }
}

export async function updateProductAction(
  _prevState: unknown,
  formData: FormData
): Promise<ProductActionResult> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized. Please log in." };
  }

  try {
    const id = formData.get("id") as string;
    if (!id) return { success: false, error: "Missing product ID." };

    const name = (formData.get("name") as string)?.trim();
    if (!name) return { success: false, error: "Product name is required." };

    const slug = (formData.get("slug") as string)?.trim() || slugify(name);
    const categoryId = formData.get("categoryId") as string;
    const shortDescription = (formData.get("shortDescription") as string)?.trim() || null;
    const description = (formData.get("description") as string)?.trim() || null;
    const brand = (formData.get("brand") as string)?.trim() || null;
    const model = (formData.get("model") as string)?.trim() || null;
    const stockStatus = (formData.get("stockStatus") as string) || "ON_REQUEST";
    const moq = (formData.get("moq") as string)?.trim() || null;
    const leadTime = (formData.get("leadTime") as string)?.trim() || null;
    const priceStr = formData.get("priceBdt") as string;
    const priceBdt = priceStr ? parseInt(priceStr, 10) : null;
    const showPrice = formData.get("showPrice") === "true";
    const isFeatured = formData.get("isFeatured") === "true";
    const datasheetUrl = (formData.get("datasheetUrl") as string)?.trim() || null;

    // Parse specs
    const specLabels = formData.getAll("spec_labels[]") as string[];
    const specValues = formData.getAll("spec_values[]") as string[];
    const specsData = [];
    for (let i = 0; i < specLabels.length; i++) {
      const label = specLabels[i]?.trim();
      const value = specValues[i]?.trim();
      if (label && value) {
        specsData.push({ label, value, sortOrder: i });
      }
    }

    // Process any new image uploads
    const files = formData.getAll("images") as File[];
    const newImages = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file && file.size > 0 && file.name) {
        const saved = await processAndSaveImage(file, "prod");
        if (saved) {
          newImages.push({
            url: saved.url,
            alt: `${name} - Image ${i + 1}`,
            sortOrder: i,
            productId: id,
          });
        }
      }
    }

    await db.product.update({
      where: { id },
      data: {
        name,
        slug,
        categoryId,
        shortDescription,
        description,
        brand,
        model,
        stockStatus,
        moq,
        leadTime,
        priceBdt,
        showPrice,
        isFeatured,
        datasheetUrl,
      },
    });

    // Update specs: delete existing and recreate
    await db.productSpec.deleteMany({ where: { productId: id } });
    if (specsData.length > 0) {
      await db.productSpec.createMany({
        data: specsData.map((s) => ({ ...s, productId: id })),
      });
    }

    // Add new images if any
    if (newImages.length > 0) {
      await db.productImage.createMany({ data: newImages });
    }

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/product/${slug}`);
    revalidatePath("/admin/products");

    return { success: true, productId: id };
  } catch (err: unknown) {
    console.error("Update product error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update product.",
    };
  }
}

export async function deleteProductAction(formData: FormData) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const id = formData.get("id") as string;
  if (!id) return;

  const product = await db.product.findUnique({
    where: { id },
    include: { images: true },
  });

  if (product) {
    // Clean up uploaded files
    for (const img of product.images) {
      deleteUploadedFile(img.url);
    }
    await db.product.delete({ where: { id } });
  }

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}
