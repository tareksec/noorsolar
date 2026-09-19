import React from 'react';
import { db } from '@/lib/db';
import { getLiveSampleContentSummary } from '@/lib/data/content';
import { ContentTabs } from '@/components/admin/content-tabs';
import { CertificationsClient } from '@/components/admin/content/certifications-client';

export default async function AdminCertificationsPage() {
  const [items, summary] = await Promise.all([
    db.certification.findMany({ orderBy: { sortOrder: 'asc' } }),
    getLiveSampleContentSummary(),
  ]);

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
      <CertificationsClient items={items} />
    </div>
  );
}