import React from 'react';
import { db } from '@/lib/db';
import { getLiveSampleContentSummary } from '@/lib/data/content';
import { ContentTabs } from '@/components/admin/content-tabs';
import { TestimonialsClient } from '@/components/admin/content/testimonials-client';
import { sampleTestimonials } from '../../../../../../prisma/seed-content';

export default async function AdminTestimonialsPage() {
  let [items, summary] = await Promise.all([
    db.testimonial.findMany({ orderBy: { sortOrder: 'asc' } }),
    getLiveSampleContentSummary(),
  ]);

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