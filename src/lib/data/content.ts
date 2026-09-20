import { db } from "@/lib/db";
import type { Stat, Certification, Partner, Testimonial, FaqItem } from "@prisma/client";

function shouldHideSample(): boolean {
  return process.env.HIDE_SAMPLE_CONTENT === "true";
}

// 1. Stats
export async function getStats(locale?: string): Promise<Stat[]> {
  try {
    const stats = await db.stat.findMany({
      where: {
        isActive: true,
        ...(shouldHideSample() ? { isSample: false } : {}),
      },
      orderBy: { sortOrder: "asc" },
    });

    if (locale !== "bn") return stats;

    return stats.map((s) => ({
      ...s,
      label: s.labelBn?.trim() || s.label,
      description: s.descriptionBn?.trim() || s.description,
    }));
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
export async function getCertifications(locale?: string): Promise<Certification[]> {
  try {
    const certifications = await db.certification.findMany({
      where: {
        isActive: true,
        ...(shouldHideSample() ? { isSample: false } : {}),
      },
      orderBy: { sortOrder: "asc" },
    });

    if (locale !== "bn") return certifications;

    return certifications.map((c) => ({
      ...c,
      name: c.nameBn?.trim() || c.name,
      issuer: c.issuerBn?.trim() || c.issuer,
      description: c.descriptionBn?.trim() || c.description,
    }));
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

// 3. Partners (Partner names stay as entered, no Bangla columns)
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
export async function getTestimonials(locale?: string): Promise<Testimonial[]> {
  try {
    const testimonials = await db.testimonial.findMany({
      where: {
        isActive: true,
        ...(shouldHideSample() ? { isSample: false } : {}),
      },
      orderBy: { sortOrder: "asc" },
    });

    if (locale !== "bn") return testimonials;

    return testimonials.map((t) => ({
      ...t,
      quote: t.quoteBn?.trim() || t.quote,
      authorName: t.authorNameBn?.trim() || t.authorName,
      authorRole: t.authorRoleBn?.trim() || t.authorRole,
      company: t.companyBn?.trim() || t.company,
    }));
  } catch (error) {
    console.error("Failed to fetch testimonials:", error);
    return [];
  }
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  try {
    return await db.testimonial.findMany({
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch all testimonials:", error);
    return [];
  }
}

// 5. FAQ Items
export async function getFaqItems(locale?: string): Promise<FaqItem[]> {
  try {
    const items = await db.faqItem.findMany({
      where: {
        isActive: true,
        ...(shouldHideSample() ? { isSample: false } : {}),
      },
      orderBy: { sortOrder: "asc" },
    });

    if (locale !== "bn") return items;

    return items.map((f) => ({
      ...f,
      question: f.questionBn?.trim() || f.question,
      answer: f.answerBn?.trim() || f.answer,
    }));
  } catch (error) {
    console.error("Failed to fetch FAQ items:", error);
    return [];
  }
}

export async function getAllFaqItems(): Promise<FaqItem[]> {
  try {
    return await db.faqItem.findMany({
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch all FAQ items:", error);
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

