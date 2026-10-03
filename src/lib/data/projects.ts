import { db } from "@/lib/db";
import type { Project } from "@prisma/client";

function shouldHideSample(): boolean {
  return process.env.HIDE_SAMPLE_CONTENT === "true";
}

export async function getPublishedProjects(locale?: string): Promise<Project[]> {
  try {
    const projects = await db.project.findMany({
      where: {
        isPublished: true,
        ...(shouldHideSample() ? { isSample: false } : {}),
      },
      orderBy: { sortOrder: "asc" },
    });

    if (locale !== "bn") return projects;

    return projects.map((p) => ({
      ...p,
      title: p.titleBn?.trim() || p.title,
      clientName: p.clientNameBn?.trim() || p.clientName,
      location: p.locationBn?.trim() || p.location,
      projectType: p.projectTypeBn?.trim() || p.projectType,
      productsSupplied: p.productsSuppliedBn?.trim() || p.productsSupplied,
      capacity: p.capacityBn?.trim() || p.capacity,
      summary: p.summaryBn?.trim() || p.summary,
    }));
  } catch {
    // Database offline or empty: return empty array so UI cleanly hides without fake cards
    return [];
  }
}

export async function getProjectBySlug(slug: string, locale?: string): Promise<Project | null> {
  try {
    const project = await db.project.findUnique({
      where: { slug },
    });

    if (!project || !project.isPublished) return null;
    if (shouldHideSample() && project.isSample) return null;

    if (locale !== "bn") return project;

    return {
      ...project,
      title: project.titleBn?.trim() || project.title,
      clientName: project.clientNameBn?.trim() || project.clientName,
      location: project.locationBn?.trim() || project.location,
      projectType: project.projectTypeBn?.trim() || project.projectType,
      productsSupplied: project.productsSuppliedBn?.trim() || project.productsSupplied,
      capacity: project.capacityBn?.trim() || project.capacity,
      summary: project.summaryBn?.trim() || project.summary,
    };
  } catch {
    return null;
  }
}
