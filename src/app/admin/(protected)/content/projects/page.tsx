import React from "react";
import { db } from "@/lib/db";
import { getLiveSampleContentSummary } from "@/lib/data/content";
import { ContentTabs } from "@/components/admin/content-tabs";
import { ProjectsClient } from "@/components/admin/content/projects-client";

export default async function AdminProjectsPage() {
  const [items, summary] = await Promise.all([
    db.project.findMany({ orderBy: { sortOrder: "asc" } }).catch(() => []),
    getLiveSampleContentSummary(),
  ]);

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
