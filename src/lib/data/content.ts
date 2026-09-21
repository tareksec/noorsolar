import { db } from "@/lib/db";
import type { Stat, Certification, Partner, Testimonial, FaqItem } from "@prisma/client";
import {
  sampleStats,
  sampleCertifications,
  samplePartners,
  sampleTestimonials,
  sampleFaqs,
} from "../../../prisma/seed-content";

function shouldHideSample(): boolean {
  return process.env.HIDE_SAMPLE_CONTENT === "true";
}

function isUnverifiedExperienceClaim(label: string, description?: string | null): boolean {
  const text = `${label} ${description || ""}`.toLowerCase();
  return (
    text.includes("years in business") ||
    text.includes("years of experience") ||
    text.includes("year in business") ||
    text.includes("established since") ||
    text.includes("founding year") ||
    text.includes("ব্যবসার অভিজ্ঞতা") ||
    text.includes("প্রতিষ্ঠিত")
  );
}

function getFallbackStats(locale?: string): Stat[] {
  const stats: Stat[] = sampleStats
    .filter((s) => s.isActive && !isUnverifiedExperienceClaim(s.label, s.description))
    .map((s, idx) => ({
      id: `fallback-stat-${idx}`,
      label: s.label,
      labelBn: s.labelBn ?? null,
      value: s.value,
      prefix: s.prefix ?? null,
      suffix: s.suffix ?? null,
      description: s.description ?? null,
      descriptionBn: s.descriptionBn ?? null,
      sortOrder: s.sortOrder ?? idx + 1,
      isActive: s.isActive ?? true,
      isSample: s.isSample ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

  if (locale !== "bn") return stats;

  return stats.map((s) => ({
    ...s,
    label: s.labelBn?.trim() || s.label,
    description: s.descriptionBn?.trim() || s.description,
  }));
}

function getFallbackCertifications(locale?: string): Certification[] {
  const certs: Certification[] = sampleCertifications
    .filter((c) => c.isActive)
    .map((c, idx) => ({
      id: `fallback-cert-${idx}`,
      name: c.name,
      nameBn: c.nameBn ?? null,
      issuer: c.issuer ?? null,
      issuerBn: c.issuerBn ?? null,
      description: c.description ?? null,
      descriptionBn: c.descriptionBn ?? null,
      image: c.image ?? null,
      sortOrder: c.sortOrder ?? idx + 1,
      isActive: c.isActive ?? true,
      isSample: c.isSample ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

  if (locale !== "bn") return certs;

  return certs.map((c) => ({
    ...c,
    name: c.nameBn?.trim() || c.name,
    issuer: c.issuerBn?.trim() || c.issuer,
    description: c.descriptionBn?.trim() || c.description,
  }));
}

function getFallbackPartners(): Partner[] {
  return samplePartners.map((p, idx) => ({
    id: `fallback-partner-${idx}`,
    name: p.name,
    logo: p.logo ?? null,
    url: p.url ?? null,
    sortOrder: p.sortOrder ?? idx + 1,
    isActive: p.isActive ?? true,
    isSample: p.isSample ?? true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
}

function getFallbackTestimonials(locale?: string): Testimonial[] {
  const testimonials: Testimonial[] = sampleTestimonials
    .filter((t) => t.isActive)
    .map((t, idx) => ({
      id: `fallback-testimonial-${idx}`,
      quote: t.quote,
      quoteBn: t.quoteBn ?? null,
      authorName: t.authorName,
      authorNameBn: t.authorNameBn ?? null,
      authorRole: t.authorRole ?? null,
      authorRoleBn: t.authorRoleBn ?? null,
      company: t.company ?? null,
      companyBn: t.companyBn ?? null,
      photo: t.photo ?? null,
      sortOrder: t.sortOrder ?? idx + 1,
      isActive: t.isActive ?? true,
      isSample: t.isSample ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

  if (locale !== "bn") return testimonials;

  return testimonials.map((t) => ({
    ...t,
    quote: t.quoteBn?.trim() || t.quote,
    authorName: t.authorNameBn?.trim() || t.authorName,
    authorRole: t.authorRoleBn?.trim() || t.authorRole,
    company: t.companyBn?.trim() || t.company,
  }));
}

function getFallbackFaqs(locale?: string): FaqItem[] {
  const faqs: FaqItem[] = sampleFaqs.map((f, idx) => ({
    id: `fallback-faq-${idx}`,
    question: f.question,
    questionBn: f.questionBn ?? null,
    answer: f.answer,
    answerBn: f.answerBn ?? null,
    sortOrder: f.sortOrder ?? idx + 1,
    isActive: f.isActive ?? true,
    isSample: f.isSample ?? true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  if (locale !== "bn") return faqs;

  return faqs.map((f) => ({
    ...f,
    question: f.questionBn?.trim() || f.question,
    answer: f.answerBn?.trim() || f.answer,
  }));
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

    const validStats = stats.filter(
      (s) => !isUnverifiedExperienceClaim(s.label, s.description)
    );

    if (validStats.length === 0 && !shouldHideSample()) {
      return getFallbackStats(locale);
    }

    if (locale !== "bn") return validStats;

    return validStats.map((s) => ({
      ...s,
      label: s.labelBn?.trim() || s.label,
      description: s.descriptionBn?.trim() || s.description,
    }));
  } catch (error) {
    console.warn("getStats: database not available, returning fallback stats");
    return getFallbackStats(locale);
  }
}

export async function getAllStats(): Promise<Stat[]> {
  try {
    const stats = await db.stat.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return stats.length > 0 ? stats : getFallbackStats();
  } catch (error) {
    console.warn("getAllStats: database not available, returning fallback stats");
    return getFallbackStats();
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

    if (certifications.length === 0 && !shouldHideSample()) {
      return getFallbackCertifications(locale);
    }

    if (locale !== "bn") return certifications;

    return certifications.map((c) => ({
      ...c,
      name: c.nameBn?.trim() || c.name,
      issuer: c.issuerBn?.trim() || c.issuer,
      description: c.descriptionBn?.trim() || c.description,
    }));
  } catch (error) {
    console.warn("getCertifications: database not available, returning fallback certifications");
    return getFallbackCertifications(locale);
  }
}

export async function getAllCertifications(): Promise<Certification[]> {
  try {
    const certs = await db.certification.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return certs.length > 0 ? certs : getFallbackCertifications();
  } catch (error) {
    console.warn("getAllCertifications: database not available, returning fallback certifications");
    return getFallbackCertifications();
  }
}

// 3. Partners (Partner names stay as entered, no Bangla columns)
export async function getPartners(): Promise<Partner[]> {
  try {
    const partners = await db.partner.findMany({
      where: {
        isActive: true,
        ...(shouldHideSample() ? { isSample: false } : {}),
      },
      orderBy: { sortOrder: "asc" },
    });

    if (partners.length === 0 && !shouldHideSample()) {
      return getFallbackPartners();
    }

    return partners;
  } catch (error) {
    console.warn("getPartners: database not available, returning fallback partners");
    return getFallbackPartners();
  }
}

export async function getAllPartners(): Promise<Partner[]> {
  try {
    const partners = await db.partner.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return partners.length > 0 ? partners : getFallbackPartners();
  } catch (error) {
    console.warn("getAllPartners: database not available, returning fallback partners");
    return getFallbackPartners();
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

    if (testimonials.length === 0 && !shouldHideSample()) {
      return getFallbackTestimonials(locale);
    }

    if (locale !== "bn") return testimonials;

    return testimonials.map((t) => ({
      ...t,
      quote: t.quoteBn?.trim() || t.quote,
      authorName: t.authorNameBn?.trim() || t.authorName,
      authorRole: t.authorRoleBn?.trim() || t.authorRole,
      company: t.companyBn?.trim() || t.company,
    }));
  } catch (error) {
    console.warn("getTestimonials: database not available, returning fallback testimonials");
    return getFallbackTestimonials(locale);
  }
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  try {
    const testimonials = await db.testimonial.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return testimonials.length > 0 ? testimonials : getFallbackTestimonials();
  } catch (error) {
    console.warn("getAllTestimonials: database not available, returning fallback testimonials");
    return getFallbackTestimonials();
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

    if (items.length === 0 && !shouldHideSample()) {
      return getFallbackFaqs(locale);
    }

    if (locale !== "bn") return items;

    return items.map((f) => ({
      ...f,
      question: f.questionBn?.trim() || f.question,
      answer: f.answerBn?.trim() || f.answer,
    }));
  } catch (error) {
    console.warn("getFaqItems: database not available, returning fallback FAQs");
    return getFallbackFaqs(locale);
  }
}

export async function getAllFaqItems(): Promise<FaqItem[]> {
  try {
    const items = await db.faqItem.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return items.length > 0 ? items : getFallbackFaqs();
  } catch (error) {
    console.warn("getAllFaqItems: database not available, returning fallback FAQs");
    return getFallbackFaqs();
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
    console.warn("getLiveSampleContentSummary: database not available, returning fallback counts");
    return {
      totalLiveSamples:
        sampleStats.length +
        sampleCertifications.length +
        samplePartners.length +
        sampleTestimonials.length +
        sampleFaqs.length,
      statsCount: sampleStats.length,
      certificationsCount: sampleCertifications.length,
      partnersCount: samplePartners.length,
      testimonialsCount: sampleTestimonials.length,
      faqCount: sampleFaqs.length,
    };
  }
}
