import React from "react";
import { db } from "@/lib/db";
import { getLiveSampleContentSummary } from "@/lib/data/content";
import { ContentTabs } from "@/components/admin/content-tabs";
import { ProjectsClient } from "@/components/admin/content/projects-client";
import { sampleProjects } from "../../../../../../prisma/seed-content";

export default async function AdminProjectsPage() {
  let [items, summary] = await Promise.all([
    db.project.findMany({ orderBy: { sortOrder: "asc" } }).catch(() => []),
    getLiveSampleContentSummary(),
  ]);

  if (items.length === 0 && sampleProjects.length > 0) {
    try {
      for (const p of sampleProjects) {
        await db.project.upsert({
          where: { slug: p.slug },
          update: {
            title: p.title,
            titleBn: p.titleBn,
            clientName: p.clientName,
            clientNameBn: p.clientNameBn,
            location: p.location,
            locationBn: p.locationBn,
            projectType: p.projectType,
            projectTypeBn: p.projectTypeBn,
            productsSupplied: p.productsSupplied,
            productsSuppliedBn: p.productsSuppliedBn,
            capacity: p.capacity,
            capacityBn: p.capacityBn,
            completionDate: p.completionDate,
            summary: p.summary,
            summaryBn: p.summaryBn,
            image: p.image,
            isPublished: true,
            isSample: false,
            sortOrder: p.sortOrder,
          },
          create: {
            slug: p.slug,
            title: p.title,
            titleBn: p.titleBn,
            clientName: p.clientName,
            clientNameBn: p.clientNameBn,
            location: p.location,
            locationBn: p.locationBn,
            projectType: p.projectType,
            projectTypeBn: p.projectTypeBn,
            productsSupplied: p.productsSupplied,
            productsSuppliedBn: p.productsSuppliedBn,
            capacity: p.capacity,
            capacityBn: p.capacityBn,
            completionDate: p.completionDate,
            summary: p.summary,
            summaryBn: p.summaryBn,
            image: p.image,
            isPublished: true,
            isSample: false,
            sortOrder: p.sortOrder,
          },
        });
      }
      items = await db.project.findMany({ orderBy: { sortOrder: "asc" } });
    } catch (e) {
      console.warn("Failed to auto-seed projects in admin:", e);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111311] tracking-tight">
          Project Supply References & Case Studies
        </h1>
        <p className="text-xs text-[#5C605C] mt-1">
          Real completed commercial rooftop, industrial factory, and power plant installations.
        </p>
      </div>
      <ContentTabs sampleCounts={summary} />
      <ProjectsClient items={items} />
    </div>
  );
}
