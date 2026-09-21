"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export type ProjectActionResult = {
  success: boolean;
  error?: string;
};

const ProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  titleBn: z.string().trim().optional().nullable(),
  slug: z.string().min(1, "Slug is required"),
  clientName: z.string().trim().optional().nullable(),
  clientNameBn: z.string().trim().optional().nullable(),
  location: z.string().trim().optional().nullable(),
  locationBn: z.string().trim().optional().nullable(),
  projectType: z.string().trim().optional().nullable(),
  projectTypeBn: z.string().trim().optional().nullable(),
  productsSupplied: z.string().trim().optional().nullable(),
  productsSuppliedBn: z.string().trim().optional().nullable(),
  capacity: z.string().trim().optional().nullable(),
  capacityBn: z.string().trim().optional().nullable(),
  completionDate: z.string().trim().optional().nullable(),
  summary: z.string().trim().optional().nullable(),
  summaryBn: z.string().trim().optional().nullable(),
  image: z.string().trim().optional().nullable(),
  isPublished: z.boolean().default(true),
  sortOrder: z.coerce.number().default(0),
});

export async function createProjectAction(
  _prevState: unknown,
  formData: FormData
): Promise<ProjectActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const title = (formData.get("title") as string) || "";
  let slug = (formData.get("slug") as string) || "";
  if (!slug) {
    slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
  }

  const raw = {
    title,
    titleBn: (formData.get("titleBn") as string) || null,
    slug,
    clientName: (formData.get("clientName") as string) || null,
    clientNameBn: (formData.get("clientNameBn") as string) || null,
    location: (formData.get("location") as string) || null,
    locationBn: (formData.get("locationBn") as string) || null,
    projectType: (formData.get("projectType") as string) || null,
    projectTypeBn: (formData.get("projectTypeBn") as string) || null,
    productsSupplied: (formData.get("productsSupplied") as string) || null,
    productsSuppliedBn: (formData.get("productsSuppliedBn") as string) || null,
    capacity: (formData.get("capacity") as string) || null,
    capacityBn: (formData.get("capacityBn") as string) || null,
    completionDate: (formData.get("completionDate") as string) || null,
    summary: (formData.get("summary") as string) || null,
    summaryBn: (formData.get("summaryBn") as string) || null,
    image: (formData.get("image") as string) || null,
    isPublished: formData.get("isPublished") === "true" || formData.get("isPublished") === "on",
    sortOrder: Number(formData.get("sortOrder")) || 0,
  };

  const parsed = ProjectSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    await db.project.create({
      data: {
        ...parsed.data,
        isSample: false,
      },
    });

    revalidatePath("/");
    revalidatePath("/bn");
    revalidatePath("/admin/content/projects");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to create project" };
  }
}

export async function updateProjectAction(
  id: string,
  _prevState: unknown,
  formData: FormData
): Promise<ProjectActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const raw = {
    title: (formData.get("title") as string) || "",
    titleBn: (formData.get("titleBn") as string) || null,
    slug: (formData.get("slug") as string) || "",
    clientName: (formData.get("clientName") as string) || null,
    clientNameBn: (formData.get("clientNameBn") as string) || null,
    location: (formData.get("location") as string) || null,
    locationBn: (formData.get("locationBn") as string) || null,
    projectType: (formData.get("projectType") as string) || null,
    projectTypeBn: (formData.get("projectTypeBn") as string) || null,
    productsSupplied: (formData.get("productsSupplied") as string) || null,
    productsSuppliedBn: (formData.get("productsSuppliedBn") as string) || null,
    capacity: (formData.get("capacity") as string) || null,
    capacityBn: (formData.get("capacityBn") as string) || null,
    completionDate: (formData.get("completionDate") as string) || null,
    summary: (formData.get("summary") as string) || null,
    summaryBn: (formData.get("summaryBn") as string) || null,
    image: (formData.get("image") as string) || null,
    isPublished: formData.get("isPublished") === "true" || formData.get("isPublished") === "on",
    sortOrder: Number(formData.get("sortOrder")) || 0,
  };

  const parsed = ProjectSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    await db.project.update({
      where: { id },
      data: parsed.data,
    });

    revalidatePath("/");
    revalidatePath("/bn");
    revalidatePath("/admin/content/projects");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to update project" };
  }
}

export async function deleteProjectAction(id: string): Promise<ProjectActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    await db.project.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/bn");
    revalidatePath("/admin/content/projects");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to delete project" };
  }
}

export async function togglePublishProjectAction(id: string, current: boolean): Promise<ProjectActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    await db.project.update({
      where: { id },
      data: { isPublished: !current },
    });
    revalidatePath("/");
    revalidatePath("/bn");
    revalidatePath("/admin/content/projects");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to toggle status" };
  }
}
