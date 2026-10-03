import React from 'react';
import { db } from '@/lib/db';
import { getLiveSampleContentSummary } from '@/lib/data/content';
import { ContentTabs } from '@/components/admin/content-tabs';
import { StatsClient } from '@/components/admin/content/stats-client';

export default async function AdminStatsPage() {
  const rawItems = await db.stat.findMany({ orderBy: { sortOrder: 'asc' } });

  // Auto-deduplicate stats by label if any duplicate rows exist in database
  const seenLabels = new Set<string>();
  const duplicateIds: string[] = [];
  const uniqueItems: typeof rawItems = [];

  for (const item of rawItems) {
    const key = item.label.trim().toLowerCase();
    if (seenLabels.has(key)) {
      duplicateIds.push(item.id);
    } else {
      seenLabels.add(key);
      uniqueItems.push(item);
    }
  }

  if (duplicateIds.length > 0) {
    try {
      await db.stat.deleteMany({
        where: { id: { in: duplicateIds } },
      });
      console.log(`[AdminStatsPage] Automatically pruned ${duplicateIds.length} duplicate stat rows.`);
    } catch (err) {
      console.error('[AdminStatsPage] Failed to prune duplicate stats:', err);
    }
  }

  const summary = await getLiveSampleContentSummary();

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold text-[#111311] tracking-tight'>
          Business Statistics
        </h1>
        <p className='text-xs text-[#5C605C] mt-1'>
          Configure metrics displayed in the homepage statistics band.
        </p>
      </div>
      <ContentTabs sampleCounts={summary} />
      <StatsClient items={uniqueItems} />
    </div>
  );
}