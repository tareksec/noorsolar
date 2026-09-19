import { db } from "@/lib/db";
import type { Stat, Certification, Partner, Testimonial, FaqItem } from "@prisma/client";

function shouldHideSample(): boolean {
  return process.env.HIDE_SAMPLE_CONTENT === "true";
}

// 1. Stats
export async function getStats(): Promise<Stat[]> {
  try {
    return await db.stat.findMany({
      where: {
        isActive: true,
        ...(shouldHideSample() ? { isSample: false } : {}),
      },
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return [];
  }
}

export async function getAllStats(): Promise<Stat[]> {
  try {
    return await db.stat.findMany({
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch all stats:", error);
    return [];
  }
}

// 2. Certifications
export async function getCertifications(): Promise<Certification[]> {
  try {
    return await db.certification.findMany({
      where: {
        isActive: true,
        ...(shouldHideSample() ? { isSample: false } : {}),
      },
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch certifications:", error);
    return [];
  }
}

export async function getAllCertifications(): Promise<Certification[]> {
  try {
    return await db.certification.findMany({
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch all certifications:", error);
    return [];
  }
}

// 3. Partners
export async function getPartners(): Promise<Partner[]> {
  try {
    return await db.partner.findMany({
      where: {
        isActive: true,
        ...(shouldHideSample() ? { isSample: false } : {}),
      },
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch partners:", error);
    return [];
  }
}

export async function getAllPartners(): Promise<Partner[]> {
  try {
    return await db.partner.findMany({
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch all partners:", error);
    return [];
  }
}

// 4. Testimonials
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    return await db.testimonial.findMany({
      where: {
        isActive: true,
        ...(shouldHideSample() ? { isSample: false } : {}),
      },
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch testimonials:", error);
    return [];
  }
}

// 5. FAQ
export async function getFaqItems(): Promise<FaqItem[]> {
  try {
    return await db.faqItem.findMany({
      where: {
        isActive: true,
        ...(shouldHideSample() ? { isSample: false } : {}),
      },
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch FAQ items:", error);
    return [];
  }
}

// Live sample counts for admin dashboard
export interface SampleContentSummary {
  totalLiveSamples: number;
  statsCount: number;
  certificationsCount: number;
  partnersCount: number;
  testimonialsCount: number;
  faqCount: number;
}

export async function getLiveSampleContentSummary(): Promise<SampleContentSummary> {
  try {
    const [statsCount, certificationsCount, partnersCount, testimonialsCount, faqCount] =
      await Promise.all([ 
        db.stat.count({ where: { isActive: true, isSample: true } }),
        db.certification.count({ where: { isActive: true, isSample: true } }),
        db.partner.count({ where: { isActive: true, isSample: true } }),
        db.testimonial.count({ where: { isActive: true, isSample: true } }),
        db.faqItem.count({ where: { isActive: true, isSample: true } }),
      ]);

    return {
      totalLiveSamples:
        statsCount + certificationsCount + partnersCount + testimonialsCount + faqCount,
      statsCount,
      certificationsCount,
      partnersCount,
      testimonialsCount,
      faqCount,
    };
  } catch (error) {
    console.error("Failed to fetch live sample content summary:", error);
    return {
      totalLiveSamples: 0,
      statsCount: 0,
      certificationsCount: 0,
      partnersCount: 0,
      testimonialsCount: 0,
      faqCount: 0,
    };
  }
}
