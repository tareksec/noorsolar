import React from 'react';
import { db } from '@/lib/db';
import { getLiveSampleContentSummary } from '@/lib/data/content';
import { ContentTabs } from '@/components/admin/content-tabs';
import { TestimonialsClient } from '@/components/admin/content/testimonials-client';

export default async function AdminTestimonialsPage() {
  const [items, summary] = await Promise.all([
    db.testimonial.findMany({ orderBy: { sortOrder: 'asc' } }),
    getLiveSampleContentSummary(),
  ]);

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold text-[#111311] tracking-tight'>
          Customer Testimonials
        </h1>
        <p className='text-xs text-[#5C605C] mt-1'>
          Manage quotes and buyer reviews displayed on the public site.
        </p>
      </div>
      <ContentTabs sampleCounts={summary} />
      <TestimonialsClient items={items} />
    </div>
  );
}