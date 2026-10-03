import React from 'react';
import { db } from '@/lib/db';
import { getLiveSampleContentSummary } from '@/lib/data/content';
import { ContentTabs } from '@/components/admin/content-tabs';
import { FaqClient } from '@/components/admin/content/faq-client';

export default async function AdminFaqPage() {
  const [items, summary] = await Promise.all([
    db.faqItem.findMany({ orderBy: { sortOrder: 'asc' } }),
    getLiveSampleContentSummary(),
  ]);

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold text-[#111311] tracking-tight'>
          FAQ Items
        </h1>
        <p className='text-xs text-[#5C605C] mt-1'>
          Manage frequently asked questions displayed in the public accordion.
        </p>
      </div>
      <ContentTabs sampleCounts={summary} />
      <FaqClient items={items} />
    </div>
  );
}