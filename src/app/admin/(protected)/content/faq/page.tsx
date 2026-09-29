import React from 'react';
import { db } from '@/lib/db';
import { getLiveSampleContentSummary } from '@/lib/data/content';
import { ContentTabs } from '@/components/admin/content-tabs';
import { FaqClient } from '@/components/admin/content/faq-client';

export default async function AdminFaqPage() {
  const rawItems = await db.faqItem.findMany({ orderBy: { sortOrder: 'asc' } });

  const seenQuestions = new Set<string>();
  const duplicateIds: string[] = [];
  const uniqueItems: typeof rawItems = [];

  for (const item of rawItems) {
    const key = item.question.trim().toLowerCase();
    if (seenQuestions.has(key)) {
      duplicateIds.push(item.id);
    } else {
      seenQuestions.add(key);
      uniqueItems.push(item);
    }
  }

  if (duplicateIds.length > 0) {
    try {
      await db.faqItem.deleteMany({
        where: { id: { in: duplicateIds } },
      });
      console.log(`[AdminFaqPage] Pruned ${duplicateIds.length} duplicate FAQs.`);
    } catch (err) {
      console.error('[AdminFaqPage] Failed to prune duplicate FAQs:', err);
    }
  }

  const summary = await getLiveSampleContentSummary();

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
      <FaqClient items={uniqueItems} />
    </div>
  );
}