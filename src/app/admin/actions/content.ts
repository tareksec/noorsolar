"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { processAndSaveImage, deleteUploadedFile } from "@/lib/uploads";

export type ContentActionResult = {
  success: boolean;
  error?: string;
};

// 1. Stats
const StatSchema = z.object({
  label: z.string().min(1, "Label is required"),
  value: z.coerce.number(),
  prefix: z.string().trim().optional().nullable(),
  suffix: z.string().trim().optional().nullable(),
  description: z.string().trim().optional().nullable(),
  sortOrder: z.coerce.number().default(0),
});

export async function createStatAction(
  _prevState: unknown,
  formData: FormData
): Promise<ContentActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const raw = {
    label: formData.get("label"),
    value: formData.get("value"),
    prefix: formData.get("prefix") || null,
    suffix: formData.get("suffix") || null,
    description: formData.get("description") || null,
    sortOrder: formData.get("sortOrder") || 0,
  };

  const parsed = StatSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    await db.stat.create({
      data: {
        ...parsed.data,
        isActive: true,
        isSample: false,
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/content/stats");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to create stat" };
  }
}

export async function updateStatAction(
  _prevState: unknown,
  formData: FormData
): Promise<ContentActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const id = formData.get("id") as string;
  if (!id) return { success: false, error: "Missing id" };

  const raw = {
    label: formData.get("label"),
    value: formData.get("value"),
    prefix: formData.get("prefix") || null,
    suffix: formData.get("suffix") || null,
    description: formData.get("description") || null,
    sortOrder: formData.get("sortOrder") || 0,
  };

  const parsed = StatSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    await db.stat.update({
      where: { id },
      data: {
        ...parsed.data,
        isSample: false,
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/content/stats");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to update stat" };
  }
}

export async function deleteStatAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  const id = formData.get("id") as string;
  if (id) {
    await db.stat.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/content/stats");
    revalidatePath("/admin");
  }
}

export async function toggleStatActiveAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  const id = formData.get("id") as string;
  if (id) {
    const curr = await db.stat.findUnique({ where: { id } });
    if (curr) {
      await db.stat.update({
        where: { id },
        data: { isActive: !curr.isActive },
      });
      revalidatePath("/");
      revalidatePath("/admin/content/stats");
      revalidatePath("/admin");
    }
  }
}

export async function markStatAsRealAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  const id = formData.get("id") as string;
  if (id) {
    await db.stat.update({
      where: { id },
      data: { isSample: false },
    });
    revalidatePath("/");
    revalidatePath("/admin/content/stats");
    revalidatePath("/admin");
  }
}

export async function reorderStatAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  const id = formData.get("id") as string;
  const direction = formData.get("direction") as "up" | "down";
  if (!id || !direction) return;

  const all = await db.stat.findMany({ orderBy: { sortOrder: "asc" } });
  const index = all.findIndex((s) => s.id === id);
  if (index === -1) return;

  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= all.length) return;

  const currentItem = all[index];
  const targetItem = all[targetIndex];

  await db.$transaction([ 
    db.stat.update({ where: { id: currentItem.id }, data: { sortOrder: targetItem.sortOrder } }),
    db.stat.update({ where: { id: targetItem.id }, data: { sortOrder: currentItem.sortOrder } }),
  ]);

  revalidatePath("/");
  revalidatePath("/admin/content/stats");
  revalidatePath("/admin");
}

// 2. Certifications
const CertSchema = z.object({
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string().trim().optional().nullable(),
  description: z.string().trim().optional().nullable(),
  sortOrder: z.coerce.number().default(0),
});

export async function createCertificationAction(
  _prevState: unknown,
  formData: FormData
): Promise<ContentActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const raw = {
    name: formData.get("name"),
    issuer: formData.get("issuer") || null,
    description: formData.get("description") || null,
    sortOrder: formData.get("sortOrder") || 0,
  };

  const parsed = CertSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  let image = "/demo/cert-quality.svg";
  const file = formData.get("image") as File;
  if (file && file.size > 0 && file.name) {
    const saved = await processAndSaveImage(file, "cert");
    if (saved) image = saved.url;
  }

  try {
    await db.certification.create({
      data: {
        ...parsed.data,
        image,
        isActive: true,
        isSample: false,
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/content/certifications");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to create certification" };
  }
}

export async function updateCertificationAction(
  _prevState: unknown,
  formData: FormData
): Promise<ContentActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const id = formData.get("id") as string;
  if (!id) return { success: false, error: "Missing id" };

  const raw = {
    name: formData.get("name"),
    issuer: formData.get("issuer") || null,
    description: formData.get("description") || null,
    sortOrder: formData.get("sortOrder") || 0,
  };

  const parsed = CertSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  let newImageUrl: string | undefined = undefined;
  const file = formData.get("image") as File;
  if (file && file.size > 0 && file.name) {
    const saved = await processAndSaveImage(file, "cert");
    if (saved) newImageUrl = saved.url;
  }

  try {
    await db.certification.update({
      where: { id },
      data: {
        ...parsed.data,
        ...(newImageUrl ? { image: newImageUrl } : {}),
        isSample: false,
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/content/certifications");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to update certification" };
  }
}

export async function deleteCertificationAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  const id = formData.get("id") as string;
  if (id) {
    const cert = await db.certification.findUnique({ where: { id } });
    if (cert && cert.image && cert.image.startsWith("/uploads/")) {
      deleteUploadedFile(cert.image);
    }
    await db.certification.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/content/certifications");
    revalidatePath("/admin");
  }
}

export async function toggleCertificationActiveAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  const id = formData.get("id") as string;
  if (id) {
    const curr = await db.certification.findUnique({ where: { id } });
    if (curr) {
      await db.certification.update({
        where: { id },
        data: { isActive: !curr.isActive },
      });
      revalidatePath("/");
      revalidatePath("/admin/content/certifications");
      revalidatePath("/admin");
    }
  }
}

export async function markCertificationAsRealAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  const id = formData.get("id") as string;
  if (id) {
    await db.certification.update({
      where: { id },
      data: { isSample: false },
    });
    revalidatePath("/");
    revalidatePath("/admin/content/certifications");
    revalidatePath("/admin");
  }
}

export async function reorderCertificationAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  const id = formData.get("id") as string;
  const direction = formData.get("direction") as "up" | "down";
  if (!id || !direction) return;

  const all = await db.certification.findMany({ orderBy: { sortOrder: "asc" } });
  const index = all.findIndex((s) => s.id === id);
  if (index === -1) return;

  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= all.length) return;

  const currentItem = all[index];
  const targetItem = all[targetIndex];

  await db.$transaction([ 
    db.certification.update({ where: { id: currentItem.id }, data: { sortOrder: targetItem.sortOrder } }),
    db.certification.update({ where: { id: targetItem.id }, data: { sortOrder: currentItem.sortOrder } }),
  ]);

  revalidatePath("/");
  revalidatePath("/admin/content/certifications");
  revalidatePath("/admin");
}

// 3. Partners
const PartnerSchema = z.object({
  name: z.string().min(1, "Partner name is required"),
  url: z.string().trim().optional().nullable(),
  sortOrder: z.coerce.number().default(0),
});

export async function createPartnerAction(
  _prevState: unknown,
  formData: FormData
): Promise<ContentActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const raw = {
    name: formData.get("name"),
    url: formData.get("url") || null,
    sortOrder: formData.get("sortOrder") || 0,
  };

  const parsed = PartnerSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  let logo = "/demo/partner-1.svg";
  const file = formData.get("logo") as File;
  if (file && file.size > 0 && file.name) {
    const saved = await processAndSaveImage(file, "partner");
    if (saved) logo = saved.url;
  }


  try {
    await db.partner.create({
      data: {
        ...parsed.data,
        logo,
        isActive: true,
        isSample: false,
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/content/partners");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to create partner" };
  }
}

export async function updatePartnerAction(
  _prevState: unknown,
  formData: FormData
): Promise<ContentActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const id = formData.get("id") as string;
  if (!id) return { success: false, error: "Missing id" };

  const raw = {
    name: formData.get("name"),
    url: formData.get("url") || null,
    sortOrder: formData.get("sortOrder") || 0,
  };

  const parsed = PartnerSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  let newLogoUrl: string | undefined = undefined;
  const file = formData.get("logo") as File;
  if (file && file.size > 0 && file.name) {
    const saved = await processAndSaveImage(file, "partner");
    if (saved) newLogoUrl = saved.url;
  }

  try {
    await db.partner.update({
      where: { id },
      data: {
        ...parsed.data,
        ...(newLogoUrl ? { logo: newLogoUrl } : {}),
        isSample: false,
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/content/partners");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to update partner" };
  }
}

export async function deletePartnerAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  const id = formData.get("id") as string;
  if (id) {
    const p = await db.partner.findUnique({ where: { id } });
    if (p && p.logo && p.logo.startsWith("/uploads/")) {
      deleteUploadedFile(p.logo);
    }
    await db.partner.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/content/partners");
    revalidatePath("/admin");
  }
}

export async function togglePartnerActiveAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  const id = formData.get("id") as string;
  if (id) {
    const curr = await db.partner.findUnique({ where: { id } });
    if (curr) {
      await db.partner.update({
        where: { id },
        data: { isActive: !curr.isActive },
      });
      revalidatePath("/");
      revalidatePath("/admin/content/partners");
      revalidatePath("/admin");
    }
  }
}

export async function markPartnerAsRealAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  const id = formData.get("id") as string;
  if (id) {
    await db.partner.update({
      where: { id },
      data: { isSample: false },
    });
    revalidatePath("/");
    revalidatePath("/admin/content/partners");
    revalidatePath("/admin");
  }
}

export async function reorderPartnerAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  const id = formData.get("id") as string;
  const direction = formData.get("direction") as "up" | "down";
  if (!id || !direction) return;

  const all = await db.partner.findMany({ orderBy: { sortOrder: "asc" } });
  const index = all.findIndex((s) => s.id === id);
  if (index === -1) return;

  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= all.length) return;

  const currentItem = all[index];
  const targetItem = all[targetIndex];

  await db.$transaction([ 
    db.partner.update({ where: { id: currentItem.id }, data: { sortOrder: targetItem.sortOrder } }),
    db.partner.update({ where: { id: targetItem.id }, data: { sortOrder: currentItem.sortOrder } }),
  ]);

  revalidatePath("/");
  revalidatePath("/admin/content/partners");
  revalidatePath("/admin");
}

// 4. Testimonials
const TestimonialSchema = z.object({
  quote: z.string().min(1, "Quote is required"),
  authorName: z.string().min(1, "Author name is required"),
  authorRole: z.string().trim().optional().nullable(),
  company: z.string().trim().optional().nullable(),
  sortOrder: z.coerce.number().default(0),
});

export async function createTestimonialAction(
  _prevState: unknown,
  formData: FormData
): Promise<ContentActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const raw = {
    quote: formData.get("quote"),
    authorName: formData.get("authorName"),
    authorRole: formData.get("authorRole") || null,
    company: formData.get("company") || null,
    sortOrder: formData.get("sortOrder") || 0,
  };

  const parsed = TestimonialSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  let photo = "/demo/avatar-1.svg";
  const file = formData.get("photo") as File;
  if (file && file.size > 0 && file.name) {
    const saved = await processAndSaveImage(file, "testimonial");
    if (saved) photo = saved.url;
  }

  try {
    await db.testimonial.create({
      data: {
        ...parsed.data,
        photo,
        isActive: true,
        isSample: false,
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/content/testimonials");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to create testimonial" };
  }
}

export async function updateTestimonialAction(
  _prevState: unknown,
  formData: FormData
): Promise<ContentActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const id = formData.get("id") as string;
  if (!id) return { success: false, error: "Missing id" };

  const raw = {
    quote: formData.get("quote"),
    authorName: formData.get("authorName"),
    authorRole: formData.get("authorRole") || null,
    company: formData.get("company") || null,
    sortOrder: formData.get("sortOrder") || 0,
  };

  const parsed = TestimonialSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  let newPhotoUrl: string | undefined = undefined;
  const file = formData.get("photo") as File;
  if (file && file.size > 0 && file.name) {
    const saved = await processAndSaveImage(file, "testimonial");
    if (saved) newPhotoUrl = saved.url;
  }

  try {
    await db.testimonial.update({
      where: { id },
      data: {
        ...parsed.data,
        ...(newPhotoUrl ? { photo: newPhotoUrl } : {}),
        isSample: false,
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/content/testimonials");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to update testimonial" };
  }
}

export async function deleteTestimonialAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  const id = formData.get("id") as string;
  if (id) {
    const t = await db.testimonial.findUnique({ where: { id } });
    if (t && t.photo && t.photo.startsWith("/uploads/")) {
      deleteUploadedFile(t.photo);
    }
    await db.testimonial.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/content/testimonials");
    revalidatePath("/admin");
  }
}

export async function toggleTestimonialActiveAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  const id = formData.get("id") as string;
  if (id) {
    const curr = await db.testimonial.findUnique({ where: { id } });
    if (curr) {
      await db.testimonial.update({
        where: { id },
        data: { isActive: !curr.isActive },
      });
      revalidatePath("/");
      revalidatePath("/admin/content/testimonials");
      revalidatePath("/admin");
    }
  }
}

export async function markTestimonialAsRealAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  const id = formData.get("id") as string;
  if (id) {
    await db.testimonial.update({
      where: { id },
      data: { isSample: false },
    });
    revalidatePath("/");
    revalidatePath("/admin/content/testimonials");
    revalidatePath("/admin");
  }
}

export async function reorderTestimonialAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  const id = formData.get("id") as string;
  const direction = formData.get("direction") as "up" | "down";
  if (!id || !direction) return;

  const all = await db.testimonial.findMany({ orderBy: { sortOrder: "asc" } });
  const index = all.findIndex((s) => s.id === id);
  if (index === -1) return;

  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= all.length) return;

  const currentItem = all[index];
  const targetItem = all[targetIndex];

  await db.$transaction([
    db.testimonial.update({ where: { id: currentItem.id }, data: { sortOrder: targetItem.sortOrder } }),
    db.testimonial.update({ where: { id: targetItem.id }, data: { sortOrder: currentItem.sortOrder } }),
  ]);

  revalidatePath("/");
  revalidatePath("/admin/content/testimonials");
  revalidatePath("/admin");
}

// 5. FAQ
const FaqItemSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  sortOrder: z.coerce.number().default(0),
});

export async function createFaqItemAction(
  _prevState: unknown,
  formData: FormData
): Promise<ContentActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const raw = {
    question: formData.get("question"),
    answer: formData.get("answer"),
    sortOrder: formData.get("sortOrder") || 0,
  };

  const parsed = FaqItemSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    await db.faqItem.create({
      data: {
        ...parsed.data,
        isActive: true,
        isSample: false,
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/content/faq");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to create FAQ item" };
  }
}

export async function updateFaqItemAction(
  _prevState: unknown,
  formData: FormData
): Promise<ContentActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const id = formData.get("id") as string;
  if (!id) return { success: false, error: "Missing id" };

  const raw = {
    question: formData.get("question"),
    answer: formData.get("answer"),
    sortOrder: formData.get("sortOrder") || 0,
  };

  const parsed = FaqItemSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    await db.faqItem.update({
      where: { id },
      data: {
        ...parsed.data,
        isSample: false,
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/content/faq");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to update FAQ item" };
  }
}

export async function deleteFaqItemAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  const id = formData.get("id") as string;
  if (id) {
    await db.faqItem.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/content/faq");
    revalidatePath("/admin");
  }
}

export async function toggleFaqItemActiveAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  const id = formData.get("id") as string;
  if (id) {
    const curr = await db.faqItem.findUnique({ where: { id } });
    if (curr) {
      await db.faqItem.update({
        where: { id },
        data: { isActive: !curr.isActive },
      });
      revalidatePath("/");
      revalidatePath("/admin/content/faq");
      revalidatePath("/admin");
    }
  }
}

export async function markFaqItemAsRealAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  const id = formData.get("id") as string;
  if (id) {
    await db.faqItem.update({
      where: { id },
      data: { isSample: false },
    });
    revalidatePath("/");
    revalidatePath("/admin/content/faq");
    revalidatePath("/admin");
  }
}

export async function reorderFaqItemAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  const id = formData.get("id") as string;
  const direction = formData.get("direction") as "up" | "down";
  if (!id || !direction) return;

  const all = await db.faqItem.findMany({ orderBy: { sortOrder: "asc" } });
  const index = all.findIndex((s) => s.id === id);
  if (index === -1) return;

  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= all.length) return;

  const currentItem = all[index];
  const targetItem = all[targetIndex];

  await db.$transaction([
    db.faqItem.update({ where: { id: currentItem.id }, data: { sortOrder: targetItem.sortOrder } }),
    db.faqItem.update({ where: { id: targetItem.id }, data: { sortOrder: currentItem.sortOrder } }),
  ]);

  revalidatePath("/");
  revalidatePath("/admin/content/faq");
  revalidatePath("/admin");
}
