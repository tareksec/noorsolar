import React from 'react';
import { db } from '@/lib/db';
import { getLiveSampleContentSummary } from '@/lib/data/content';
import { ContentTabs } from '@/components/admin/content-tabs';
import { PartnersClient } from '@/components/admin/content/partners-client';

export default async function AdminPartnersPage() {
  const [items, summary] = await Promise.all([
    db.partner.findMany({ orderBy: { sortOrder: 'asc' } }),
    getLiveSampleContentSummary(),
  ]);

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
      <PartnersClient items={items} />
    </div>
  );
}