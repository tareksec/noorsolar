import React from 'react';
import { db } from '@/lib/db';
import { getLiveSampleContentSummary } from '@/lib/data/content';
import { ContentTabs } from '@/components/admin/content-tabs';
import { TestimonialsClient } from '@/components/admin/content/testimonials-client';
import { sampleTestimonials } from '../../../../../../prisma/seed-content';

export default async function AdminTestimonialsPage() {
  const rawItems = await db.testimonial.findMany({ orderBy: { sortOrder: 'asc' } });

  const seenAuthors = new Set<string>();
  const duplicateIds: string[] = [];
  let items: typeof rawItems = [];

  for (const item of rawItems) {
    const key = item.authorName.trim().toLowerCase();
    if (seenAuthors.has(key)) {
      duplicateIds.push(item.id);
    } else {
      seenAuthors.add(key);
      items.push(item);
    }
  }

  if (duplicateIds.length > 0) {
    try {
      await db.testimonial.deleteMany({
        where: { id: { in: duplicateIds } },
      });
      console.log(`[AdminTestimonialsPage] Pruned ${duplicateIds.length} duplicate testimonials.`);
    } catch (err) {
      console.error('[AdminTestimonialsPage] Failed to prune duplicate testimonials:', err);
    }
  }

  if (items.length === 0 && sampleTestimonials.length > 0) {
    try {
      for (const t of sampleTestimonials) {
        await db.testimonial.create({
          data: {
            quote: t.quote,
            quoteBn: t.quoteBn,
            authorName: t.authorName,
            authorNameBn: t.authorNameBn,
            authorRole: t.authorRole,
            authorRoleBn: t.authorRoleBn,
            company: t.company,
            companyBn: t.companyBn,
            photo: t.photo,
            sortOrder: t.sortOrder,
            isActive: true,
            isSample: false,
          },
        });
      }
      items = await db.testimonial.findMany({ orderBy: { sortOrder: 'asc' } });
    } catch (e) {
      console.warn("Failed to auto-seed testimonials in admin:", e);
    }
  }

  const summary = await getLiveSampleContentSummary();

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