import React from 'react';
import { db } from '@/lib/db';
import { getLiveSampleContentSummary } from '@/lib/data/content';
import { ContentTabs } from '@/components/admin/content-tabs';
import { PartnersClient } from '@/components/admin/content/partners-client';

export default async function AdminPartnersPage() {
  const rawItems = await db.partner.findMany({ orderBy: { sortOrder: 'asc' } });

  const seenNames = new Set<string>();
  const duplicateIds: string[] = [];
  const uniqueItems: typeof rawItems = [];

  for (const item of rawItems) {
    const key = item.name.trim().toLowerCase();
    if (seenNames.has(key)) {
      duplicateIds.push(item.id);
    } else {
      seenNames.add(key);
      uniqueItems.push(item);
    }
  }

  if (duplicateIds.length > 0) {
    try {
      await db.partner.deleteMany({
        where: { id: { in: duplicateIds } },
      });
      console.log(`[AdminPartnersPage] Pruned ${duplicateIds.length} duplicate partners.`);
    } catch (err) {
      console.error('[AdminPartnersPage] Failed to prune duplicate partners:', err);
    }
  }

  const summary = await getLiveSampleContentSummary();

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold text-[#111311] tracking-tight'>
          Partners & Clients
        </h1>
        <p className='text-xs text-[#5C605C] mt-1'>
          Organizations and contractor logos displayed in the partner strip.
        </p>
      </div>
      <ContentTabs sampleCounts={summary} />
      <PartnersClient items={uniqueItems} />
    </div>
  );
}