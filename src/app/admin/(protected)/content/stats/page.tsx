import React from 'react';
import { db } from '@/lib/db';
import { getLiveSampleContentSummary } from '@/lib/data/content';
import { ContentTabs } from '@/components/admin/content-tabs';
import { StatsClient } from '@/components/admin/content/stats-client';

export default async function AdminStatsPage() {
  const [items, summary] = await Promise.all([
    db.stat.findMany({ orderBy: { sortOrder: 'asc' } }),
    getLiveSampleContentSummary(),
  ]);

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
      <StatsClient items={items} />
    </div>
  );
}