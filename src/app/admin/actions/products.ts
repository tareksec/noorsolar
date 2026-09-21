"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { processAndSaveImage, processAndSavePdf, deleteUploadedFile } from "@/lib/uploads";
import { parseProductDocuments, encodeProductDocuments, ProductDocuments } from "@/lib/product-documents";

async function extractAndSaveProductDocuments(
  formData: FormData,
  existingDatasheetUrl?: string | null
): Promise<string | null> {
  const currentDocs = parseProductDocuments(existingDatasheetUrl);
  const docTypes: Array<{ key: keyof ProductDocuments; fileField: string; urlField: string; prefix: string }> = [
    { key: "datasheet", fileField: "doc_datasheet_file", urlField: "doc_datasheet_url", prefix: "datasheet" },
    { key: "warranty", fileField: "doc_warranty_file", urlField: "doc_warranty_url", prefix: "warranty" },
    { key: "certificate", fileField: "doc_certificate_file", urlField: "doc_certificate_url", prefix: "certificate" },
    { key: "manual", fileField: "doc_manual_file", urlField: "doc_manual_url", prefix: "manual" },
    { key: "testReport", fileField: "doc_test_report_file", urlField: "doc_test_report_url", prefix: "test_report" },
    { key: "packingSheet", fileField: "doc_packing_sheet_file", urlField: "doc_packing_sheet_url", prefix: "packing_sheet" },
  ];

  const updatedDocs: ProductDocuments = { ...currentDocs };

  for (const item of docTypes) {
    const file = formData.get(item.fileField) as File | null;
    let url = (formData.get(item.urlField) as string)?.trim();

    // Fallback for legacy datasheet field names
    if (item.key === "datasheet") {
      const legacyFile = formData.get("datasheetFile") as File | null;
      const legacyUrl = (formData.get("datasheetUrl") as string)?.trim();
      if (!file && legacyFile && legacyFile.size > 0 && legacyFile.name) {
        const saved = await processAndSavePdf(legacyFile, item.prefix);
        if (saved) updatedDocs[item.key] = saved.url;
        continue;
      }
      if (!url && legacyUrl !== undefined) {
        url = legacyUrl;
      }
    }

    if (file && file.size > 0 && file.name) {
      const saved = await processAndSavePdf(file, item.prefix);
      if (saved) {
        const old = updatedDocs[item.key];
        if (old && old.startsWith("/uploads/")) {
          deleteUploadedFile(old);
        }
        updatedDocs[item.key] = saved.url;
      }
    } else if (url !== undefined) {
      updatedDocs[item.key] = url || null;
    }
  }

  return encodeProductDocuments(updatedDocs);
}

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
    if (!name || name.length < 2) {
      return { success: false, error: "Product name is required (minimum 2 characters)." };
    }

    let slug = (formData.get("slug") as string)?.trim();
    if (!slug) slug = slugify(name);
    else slug = slugify(slug);

    if (!slug) {
      return { success: false, error: "A valid URL slug is required." };
    }

    // Check slug uniqueness
    const existing = await db.product.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const categoryId = formData.get("categoryId") as string;
    if (!categoryId) return { success: false, error: "Category is required." };

    const nameBn = (formData.get("nameBn") as string)?.trim() || null;
    const shortDescription = (formData.get("shortDescription") as string)?.trim() || null;
    const shortDescriptionBn = (formData.get("shortDescriptionBn") as string)?.trim() || null;
    const description = (formData.get("description") as string)?.trim() || null;
    const descriptionBn = (formData.get("descriptionBn") as string)?.trim() || null;
    const brand = (formData.get("brand") as string)?.trim() || null;
    const model = (formData.get("model") as string)?.trim() || null;
    const series = (formData.get("series") as string)?.trim() || null;
    const manufacturerModel = (formData.get("manufacturerModel") as string)?.trim() || null;
    const originCountry = (formData.get("originCountry") as string)?.trim() || null;
    const stockStatus = (formData.get("stockStatus") as string) || "ON_REQUEST";
    const moq = (formData.get("moq") as string)?.trim() || null;
    const moqBn = (formData.get("moqBn") as string)?.trim() || null;
    const leadTime = (formData.get("leadTime") as string)?.trim() || null;
    const leadTimeBn = (formData.get("leadTimeBn") as string)?.trim() || null;
    const priceStr = formData.get("priceBdt") as string;
    const priceBdt = priceStr ? parseInt(priceStr, 10) : null;
    const showPrice = formData.get("showPrice") === "true";
    const isFeatured = formData.get("isFeatured") === "true";
    const metaTitle = (formData.get("metaTitle") as string)?.trim() || null;
    const metaTitleBn = (formData.get("metaTitleBn") as string)?.trim() || null;
    const metaDescription = (formData.get("metaDescription") as string)?.trim() || null;
    const metaDescriptionBn = (formData.get("metaDescriptionBn") as string)?.trim() || null;

    // Handle Documents (Datasheet, Warranty, Certificate, Manual, Test Report, Packing Sheet)
    let datasheetUrl: string | null = null;
    try {
      datasheetUrl = await extractAndSaveProductDocuments(formData);
    } catch (e: any) {
      return {
        success: false,
        error: e?.message || "Failed to process attached technical documents.",
      };
    }

    // Parse specs from parallel arrays
    const specLabels = formData.getAll("spec_labels[]") as string[];
    const specLabelsBn = formData.getAll("spec_labels_bn[]") as string[];
    const specValues = formData.getAll("spec_values[]") as string[];
    const specValuesBn = formData.getAll("spec_values_bn[]") as string[];
    const specsData = [];
    for (let i = 0; i < specLabels.length; i++) {
      const label = specLabels[i]?.trim();
      const labelBn = specLabelsBn[i]?.trim() || null;
      const value = specValues[i]?.trim();
      const valueBn = specValuesBn[i]?.trim() || null;
      if (label && value) {
        specsData.push({ label, labelBn, value, valueBn, sortOrder: i });
      }
    }

    // Merge identity fields into specs if provided
    if (series && !specsData.some((s) => s.label.toLowerCase() === "series")) {
      specsData.push({ label: "Series", labelBn: "সিরিজ", value: series, valueBn: series, sortOrder: 90 });
    }
    if (manufacturerModel && !specsData.some((s) => s.label.toLowerCase() === "manufacturer model")) {
      specsData.push({
        label: "Manufacturer Model",
        labelBn: "প্রস্তুতকারক মডেল",
        value: manufacturerModel,
        valueBn: manufacturerModel,
        sortOrder: 91,
      });
    }
    if (originCountry && !specsData.some((s) => s.label.toLowerCase() === "country of origin")) {
      specsData.push({
        label: "Country of Origin",
        labelBn: "উৎস দেশ",
        value: originCountry,
        valueBn: originCountry,
        sortOrder: 92,
      });
    }

    // Process image uploads
    const files = formData.getAll("images") as File[];
    const imageAlts = formData.getAll("new_image_alts[]") as string[];
    const imageAltsBn = formData.getAll("new_image_alts_bn[]") as string[];
    const imagesData = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file && file.size > 0 && file.name) {
        const saved = await processAndSaveImage(file, "prod");
        if (saved) {
          const altText: string = imageAlts[i]?.trim() || `${name} - Image ${imagesData.length + 1}`;
          const altBnText = imageAltsBn[i]?.trim() || null;
          imagesData.push({
            url: saved.url,
            alt: altText,
            altBn: altBnText,
            sortOrder: imagesData.length,
          });
        }
      }
    }

    // Default image if none provided
    if (imagesData.length === 0) {
      imagesData.push({
        url: "/demo/category-panels.svg",
        alt: `${name} placeholder`,
        altBn: null,
        sortOrder: 0,
      });
    }

    const created = await db.product.create({
      data: {
        name,
        nameBn,
        slug,
        categoryId,
        shortDescription,
        shortDescriptionBn,
        description,
        descriptionBn,
        brand,
        model,
        stockStatus,
        moq,
        moqBn,
        leadTime,
        leadTimeBn,
        priceBdt,
        showPrice,
        isFeatured,
        isActive: true,
        isDemo: false,
        datasheetUrl,
        metaTitle,
        metaTitleBn,
        metaDescription,
        metaDescriptionBn,
        images: { create: imagesData },
        specs: { create: specsData },
      },
    });

    revalidatePath("/");
    revalidatePath("/bn");
    revalidatePath("/products");
    revalidatePath("/bn/products");
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
    if (!name || name.length < 2) {
      return { success: false, error: "Product name is required (minimum 2 characters)." };
    }

    let slug = (formData.get("slug") as string)?.trim() || slugify(name);
    slug = slugify(slug);

    // Check slug uniqueness against other products
    const existingWithSlug = await db.product.findUnique({ where: { slug } });
    if (existingWithSlug && existingWithSlug.id !== id) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const categoryId = formData.get("categoryId") as string;
    if (!categoryId) return { success: false, error: "Category is required." };

    const nameBn = (formData.get("nameBn") as string)?.trim() || null;
    const shortDescription = (formData.get("shortDescription") as string)?.trim() || null;
    const shortDescriptionBn = (formData.get("shortDescriptionBn") as string)?.trim() || null;
    const description = (formData.get("description") as string)?.trim() || null;
    const descriptionBn = (formData.get("descriptionBn") as string)?.trim() || null;
    const brand = (formData.get("brand") as string)?.trim() || null;
    const model = (formData.get("model") as string)?.trim() || null;
    const series = (formData.get("series") as string)?.trim() || null;
    const manufacturerModel = (formData.get("manufacturerModel") as string)?.trim() || null;
    const originCountry = (formData.get("originCountry") as string)?.trim() || null;
    const stockStatus = (formData.get("stockStatus") as string) || "ON_REQUEST";
    const moq = (formData.get("moq") as string)?.trim() || null;
    const moqBn = (formData.get("moqBn") as string)?.trim() || null;
    const leadTime = (formData.get("leadTime") as string)?.trim() || null;
    const leadTimeBn = (formData.get("leadTimeBn") as string)?.trim() || null;
    const priceStr = formData.get("priceBdt") as string;
    const priceBdt = priceStr ? parseInt(priceStr, 10) : null;
    const showPrice = formData.get("showPrice") === "true";
    const isFeatured = formData.get("isFeatured") === "true";
    const metaTitle = (formData.get("metaTitle") as string)?.trim() || null;
    const metaTitleBn = (formData.get("metaTitleBn") as string)?.trim() || null;
    const metaDescription = (formData.get("metaDescription") as string)?.trim() || null;
    const metaDescriptionBn = (formData.get("metaDescriptionBn") as string)?.trim() || null;

    // Get current product to check old documents
    const currentProduct = await db.product.findUnique({
      where: { id },
      include: { images: true },
    });

    let datasheetUrl: string | null = null;
    try {
      datasheetUrl = await extractAndSaveProductDocuments(formData, currentProduct?.datasheetUrl);
    } catch (e: any) {
      return {
        success: false,
        error: e?.message || "Failed to process attached technical documents.",
      };
    }

    // Parse specs
    const specLabels = formData.getAll("spec_labels[]") as string[];
    const specLabelsBn = formData.getAll("spec_labels_bn[]") as string[];
    const specValues = formData.getAll("spec_values[]") as string[];
    const specValuesBn = formData.getAll("spec_values_bn[]") as string[];
    const specsData = [];
    for (let i = 0; i < specLabels.length; i++) {
      const label = specLabels[i]?.trim();
      const labelBn = specLabelsBn[i]?.trim() || null;
      const value = specValues[i]?.trim();
      const valueBn = specValuesBn[i]?.trim() || null;
      if (label && value) {
        specsData.push({ label, labelBn, value, valueBn, sortOrder: i });
      }
    }

    // Merge identity fields into specs if provided
    if (series && !specsData.some((s) => s.label.toLowerCase() === "series")) {
      specsData.push({ label: "Series", labelBn: "সিরিজ", value: series, valueBn: series, sortOrder: 90 });
    }
    if (manufacturerModel && !specsData.some((s) => s.label.toLowerCase() === "manufacturer model")) {
      specsData.push({
        label: "Manufacturer Model",
        labelBn: "প্রস্তুতকারক মডেল",
        value: manufacturerModel,
        valueBn: manufacturerModel,
        sortOrder: 91,
      });
    }
    if (originCountry && !specsData.some((s) => s.label.toLowerCase() === "country of origin")) {
      specsData.push({
        label: "Country of Origin",
        labelBn: "উৎস দেশ",
        value: originCountry,
        valueBn: originCountry,
        sortOrder: 92,
      });
    }

    // Update existing images alt text
    const existingImageIds = formData.getAll("existing_image_ids[]") as string[];
    const existingImageAlts = formData.getAll("existing_image_alts[]") as string[];
    const existingImageAltsBn = formData.getAll("existing_image_alts_bn[]") as string[];
    for (let i = 0; i < existingImageIds.length; i++) {
      const imgId = existingImageIds[i];
      const alt = existingImageAlts[i]?.trim();
      const altBn = existingImageAltsBn[i]?.trim() || null;
      if (imgId) {
        await db.productImage.update({
          where: { id: imgId },
          data: {
            alt: alt || `${name} - Image ${i + 1}`,
            altBn,
          },
        });
      }
    }

    // Process any new image uploads
    const files = formData.getAll("images") as File[];
    const newImageAltsBn = formData.getAll("new_image_alts_bn[]") as string[];
    const newImages = [];
    const currentImageCount = currentProduct?.images.length || 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file && file.size > 0 && file.name) {
        const saved = await processAndSaveImage(file, "prod");
        if (saved) {
          newImages.push({
            url: saved.url,
            alt: `${name} - Image ${currentImageCount + newImages.length + 1}`,
            altBn: newImageAltsBn[i]?.trim() || null,
            sortOrder: currentImageCount + newImages.length,
            productId: id,
          });
        }
      }
    }

    await db.product.update({
      where: { id },
      data: {
        name,
        nameBn,
        slug,
        categoryId,
        shortDescription,
        shortDescriptionBn,
        description,
        descriptionBn,
        brand,
        model,
        stockStatus,
        moq,
        moqBn,
        leadTime,
        leadTimeBn,
        priceBdt,
        showPrice,
        isFeatured,
        datasheetUrl,
        metaTitle,
        metaTitleBn,
        metaDescription,
        metaDescriptionBn,
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
    revalidatePath("/bn");
    revalidatePath("/products");
    revalidatePath("/bn/products");
    revalidatePath(`/product/${slug}`);
    revalidatePath(`/bn/product/${slug}`);
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
    // Clean up uploaded image files
    for (const img of product.images) {
      deleteUploadedFile(img.url);
    }
    // Clean up uploaded datasheet if stored locally
    if (product.datasheetUrl?.startsWith("/uploads/")) {
      deleteUploadedFile(product.datasheetUrl);
    }
    await db.product.delete({ where: { id } });
  }

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProductImageAction(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const imageId = formData.get("imageId") as string;
  const productId = formData.get("productId") as string;
  if (!imageId) return;

  const image = await db.productImage.findUnique({
    where: { id: imageId },
  });

  if (image) {
    deleteUploadedFile(image.url);
    await db.productImage.delete({ where: { id: imageId } });
  }

  revalidatePath(`/admin/products/${productId}`);
  revalidatePath(`/product/${productId}`);
  revalidatePath("/");
}

export async function duplicateProductAction(formData: FormData) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const id = formData.get("id") as string;
  if (!id) return;

  const original = await db.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      specs: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!original) return;

  const copySuffix = Date.now().toString().slice(-4);
  const newSlug = `${original.slug}-copy-${copySuffix}`;
  const newName = `${original.name} (Copy)`;

  await db.product.create({
    data: {
      name: newName,
      slug: newSlug,
      categoryId: original.categoryId,
      shortDescription: original.shortDescription,
      description: original.description,
      brand: original.brand,
      model: original.model,
      stockStatus: original.stockStatus,
      moq: original.moq,
      leadTime: original.leadTime,
      priceBdt: original.priceBdt,
      showPrice: original.showPrice,
      datasheetUrl: original.datasheetUrl,
      metaTitle: original.metaTitle,
      metaDescription: original.metaDescription,
      isFeatured: false,
      isActive: false, // Inactive by default per Task E!
      isDemo: false,
      sortOrder: original.sortOrder + 1,
      images: {
        create: original.images.map((img, idx) => ({
          url: img.url,
          alt: `${newName} image ${idx + 1}`,
          sortOrder: img.sortOrder,
        })),
      },
      specs: {
        create: original.specs.map((spec) => ({
          label: spec.label,
          value: spec.value,
          sortOrder: spec.sortOrder,
        })),
      },
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
}

export async function reorderProductImageAction(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const imageId = formData.get("imageId") as string;
  const direction = formData.get("direction") as "up" | "down";
  const productId = formData.get("productId") as string;

  const images = await db.productImage.findMany({
    where: { productId },
    orderBy: { sortOrder: "asc" },
  });

  const index = images.findIndex((img) => img.id === imageId);
  if (index === -1) return;

  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= images.length) return;

  const currentImg = images[index];
  const targetImg = images[targetIndex];

  const currentOrder = currentImg.sortOrder;
  const targetOrder = targetImg.sortOrder === currentOrder
    ? (direction === "up" ? currentOrder - 1 : currentOrder + 1)
    : targetImg.sortOrder;

  await db.$transaction([
    db.productImage.update({
      where: { id: currentImg.id },
      data: { sortOrder: targetOrder },
    }),
    db.productImage.update({
      where: { id: targetImg.id },
      data: { sortOrder: currentOrder },
    }),
  ]);

  revalidatePath(`/admin/products/${productId}`);
  revalidatePath(`/product/${productId}`);
  revalidatePath("/");
}

export async function reorderProductSpecAction(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const specId = formData.get("specId") as string;
  const direction = formData.get("direction") as "up" | "down";
  const productId = formData.get("productId") as string;

  const specs = await db.productSpec.findMany({
    where: { productId },
    orderBy: { sortOrder: "asc" },
  });

  const index = specs.findIndex((s) => s.id === specId);
  if (index === -1) return;

  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= specs.length) return;

  const currentSpec = specs[index];
  const targetSpec = specs[targetIndex];

  const currentOrder = currentSpec.sortOrder;
  const targetOrder = targetSpec.sortOrder === currentOrder
    ? (direction === "up" ? currentOrder - 1 : currentOrder + 1)
    : targetSpec.sortOrder;

  await db.$transaction([
    db.productSpec.update({
      where: { id: currentSpec.id },
      data: { sortOrder: targetOrder },
    }),
    db.productSpec.update({
      where: { id: targetSpec.id },
      data: { sortOrder: currentOrder },
    }),
  ]);

  revalidatePath(`/admin/products/${productId}`);
  revalidatePath(`/product/${productId}`);
}

export async function bulkUpdateProductsAction(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const action = formData.get("bulkAction") as "activate" | "deactivate" | "delete";
  const ids = formData.getAll("selectedIds[]") as string[];
  if (!ids.length) return;

  if (action === "activate") {
    await db.product.updateMany({
      where: { id: { in: ids } },
      data: { isActive: true },
    });
  } else if (action === "deactivate") {
    await db.product.updateMany({
      where: { id: { in: ids } },
      data: { isActive: false },
    });
  } else if (action === "delete") {
    for (const id of ids) {
      const p = await db.product.findUnique({
        where: { id },
        include: { images: true },
      });
      if (p) {
        for (const img of p.images) {
          deleteUploadedFile(img.url);
        }
        if (p.datasheetUrl?.startsWith("/uploads/")) {
          deleteUploadedFile(p.datasheetUrl);
        }
        await db.product.delete({ where: { id } });
      }
    }
  }

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");
}

export async function toggleProductFeaturedAction(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  const current = formData.get("current") === "true";

  if (id) {
    await db.product.update({
      where: { id },
      data: { isFeatured: !current },
    });
    revalidatePath("/admin/products");
    revalidatePath("/");
  }
}

export async function toggleProductActiveAction(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  const current = formData.get("current") === "true";

  if (id) {
    await db.product.update({
      where: { id },
      data: { isActive: !current },
    });
    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");
  }
}