import React from 'react';
import { db } from '@/lib/db';
import { getLiveSampleContentSummary } from '@/lib/data/content';
import { ContentTabs } from '@/components/admin/content-tabs';
import { CertificationsClient } from '@/components/admin/content/certifications-client';

export default async function AdminCertificationsPage() {
  const rawItems = await db.certification.findMany({ orderBy: { sortOrder: 'asc' } });

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
      await db.certification.deleteMany({
        where: { id: { in: duplicateIds } },
      });
      console.log(`[AdminCertificationsPage] Pruned ${duplicateIds.length} duplicate certifications.`);
    } catch (err) {
      console.error('[AdminCertificationsPage] Failed to prune duplicate certifications:', err);
    }
  }

  const summary = await getLiveSampleContentSummary();

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold text-[#111311] tracking-tight'>
          Certifications & Standards
        </h1>
        <p className='text-xs text-[#5C605C] mt-1'>
          Manage product testing and commercial safety certificates.
        </p>
      </div>
      <ContentTabs sampleCounts={summary} />
      <CertificationsClient items={uniqueItems} />
    </div>
  );
}