import { db } from "@/lib/db";
import type { Project } from "@prisma/client";
import { sampleProjects } from "../../../prisma/seed-content";

function shouldHideSample(): boolean {
  return process.env.HIDE_SAMPLE_CONTENT === "true";
}

export function getFallbackProjects(locale?: string): Project[] {
  const projects: Project[] = (sampleProjects || []).map((p, idx) => ({
    id: `fallback-project-${idx}`,
    slug: p.slug,
    title: p.title,
    titleBn: p.titleBn ?? null,
    clientName: p.clientName ?? null,
    clientNameBn: p.clientNameBn ?? null,
    location: p.location ?? null,
    locationBn: p.locationBn ?? null,
    projectType: p.projectType ?? null,
    projectTypeBn: p.projectTypeBn ?? null,
    productsSupplied: p.productsSupplied ?? null,
    productsSuppliedBn: p.productsSuppliedBn ?? null,
    capacity: p.capacity ?? null,
    capacityBn: p.capacityBn ?? null,
    completionDate: p.completionDate ?? null,
    summary: p.summary ?? null,
    summaryBn: p.summaryBn ?? null,
    image: p.image ?? null,
    gallery: null,
    clientLogo: null,
    sortOrder: p.sortOrder ?? idx + 1,
    isPublished: true,
    isSample: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

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

    if (projects.length === 0) {
      return getFallbackProjects(locale);
    }

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
    return getFallbackProjects(locale);
  }
}

export async function getProjectBySlug(slug: string, locale?: string): Promise<Project | null> {
  try {
    const project = await db.project.findUnique({
      where: { slug },
    });

    if (project && project.isPublished && !(shouldHideSample() && project.isSample)) {
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
    }
  } catch {
    // Database offline or query failed: check fallback
  }

  const fallbacks = getFallbackProjects(locale);
  return fallbacks.find((p) => p.slug === slug) || null;
}

