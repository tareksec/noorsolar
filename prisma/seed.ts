import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { defaultSiteConfig } from "../src/lib/site-config";
import { sampleStats, sampleCertifications, samplePartners, sampleTestimonials, sampleFaqs } from "./seed-content";
import { demoProducts } from "./seed-products";
import { sampleBlogPosts } from "./seed-blog";

const prisma = new PrismaClient();

function getProductImagePath(slug: string, view: "front" | "angled" | "detail", defaultSvg: string): string {
  const photoExts = [".webp", ".jpg", ".jpeg", ".png"];
  for (const ext of photoExts) {
    const relPath = `/demo/products/${slug}-${view}${ext}`;
    const fullPath = path.join(process.cwd(), "public", "demo", "products", `${slug}-${view}${ext}`);
    if (fs.existsSync(fullPath)) {
      return relPath;
    }
  }
  for (const ext of photoExts) {
    const relPath = `/demo/photos/${slug}-${view}${ext}`;
    const fullPath = path.join(process.cwd(), "public", "demo", "photos", `${slug}-${view}${ext}`);
    if (fs.existsSync(fullPath)) {
      return relPath;
    }
  }
  return defaultSvg;
}

async function main() {
  const isProduction = process.env.NODE_ENV === "production";
  const seedDemo = process.env.SEED_DEMO !== "false";
  const isDemoOnly = process.argv.includes("--demo-only");

  console.log(`Starting database seed (NODE_ENV=${process.env.NODE_ENV || "development"}, SEED_DEMO=${seedDemo})...`);

  // 1. Admin User & Site Settings
  if (!isDemoOnly) {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@noorsolaren.com";
    let rawPassword = process.env.ADMIN_PASSWORD;

    if (!rawPassword || rawPassword === "change-me-on-first-login" || rawPassword.length < 8) {
      rawPassword = "AdminPassword2026!";
      console.log("ℹ️ Using initial admin password: AdminPassword2026! (can be customized via ADMIN_PASSWORD)");
    }

    const passwordHash = await bcrypt.hash(rawPassword, 12);

    await prisma.adminUser.upsert({
      where: { email: adminEmail },
      update: { passwordHash },
      create: {
        email: adminEmail,
        passwordHash,
      },
    });
    console.log(`✓ Admin user ensured: ${adminEmail}`);
  }

  // Ensure default site config with Bangla values
  const existingConfigSetting = await prisma.siteSetting.findUnique({
    where: { key: "site_config" },
  });
  let mergedConfig: Record<string, unknown> = { ...defaultSiteConfig };
  if (existingConfigSetting?.value) {
    try {
      const parsed = JSON.parse(existingConfigSetting.value);
      mergedConfig = {
        ...defaultSiteConfig,
        ...parsed,
        socials: {
          ...defaultSiteConfig.socials,
          ...(parsed.socials || {}),
        },
      };
    } catch {
      mergedConfig = { ...defaultSiteConfig };
    }
  }
  await prisma.siteSetting.upsert({
    where: { key: "site_config" },
    update: { value: JSON.stringify(mergedConfig) },
    create: {
      key: "site_config",
      value: JSON.stringify(mergedConfig),
    },
  });
  console.log("✓ Core site settings ensured with Bangla defaults.");

  // 2. Categories
  const categoriesData = [
    {
      slug: "solar-panels",
      name: "Solar Panels",
      nameBn: "সোলার প্যানেল",
      description:
        "Monocrystalline, N-Type TOPCon, and bifacial solar modules for commercial rooftop and industrial utility installations.",
      descriptionBn:
        "বাণিজ্যিক ছাদ ও শিল্প কারখানার জন্য উন্নত মনোক্রিস্টালাইন, এন-টাইপ TOPCon এবং বাইফেসিয়াল সোলার মডিউল।",
      image: "/photos/cat-solar-panels.webp",
      sortOrder: 1,
    },
    {
      slug: "lithium-batteries",
      name: "Lithium-ion Batteries",
      nameBn: "লিথিয়াম-আয়ন ব্যাটারি",
      description:
        "High-density LiFePO4 server rack batteries and modular energy storage systems with smart BMS protocols.",
      descriptionBn:
        "স্মার্ট BMS প্রোটোকল সমৃদ্ধ উচ্চ ঘনত্বের LiFePO4 সার্ভার র্যাক ব্যাটারি এবং মডুলার এনার্জি স্টোরেজ সিস্টেম।",
      image: "/photos/cat-lithium-batteries.webp",
      sortOrder: 2,
    },
    {
      slug: "solar-inverters",
      name: "Inverters",
      nameBn: "ইনভার্টার",
      description:
        "Grid-tied, hybrid three-phase, and off-grid pure sine wave solar inverters engineered for commercial reliability and microgrids.",
      descriptionBn:
        "বাণিজ্যিক নির্ভরযোগ্যতা ও মাইক্রোগ্রিডের জন্য তৈরি গ্রিড-টাইড, হাইব্রিড থ্রি-ফেজ এবং অফ-গ্রিড পিওর সাইন ওয়েভ সোলার ইনভার্টার।",
      image: "/photos/cat-solar-inverters.webp",
      sortOrder: 3,
    },
  ];

  const categories: Record<string, string> = {};

  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categories[cat.slug] = created.id;
  }
  console.log("✓ Core categories ensured.");

  // Check if production mode without SEED_DEMO=true
  if (isProduction && !seedDemo) {
    console.log("ℹ️ Production environment: creating admin user and core settings only. Demo products and sample content skipped (set SEED_DEMO=true to seed demo items).");
    return;
  }

  // 3. Wipe Demo & Sample Rows (preserving real rows where isDemo=false or isSample=false)
  console.log("Wiping existing demo products and sample trust content...");
  
  // Find demo products to delete
  const existingDemoProducts = await prisma.product.findMany({
    where: { isDemo: true },
    select: { id: true },
  });
  const demoProductIds = existingDemoProducts.map((p) => p.id);

  if (demoProductIds.length > 0) {
    await prisma.productImage.deleteMany({
      where: { productId: { in: demoProductIds } },
    });
    await prisma.productSpec.deleteMany({
      where: { productId: { in: demoProductIds } },
    });
    await prisma.product.deleteMany({
      where: { id: { in: demoProductIds } },
    });
  }

  // Wipe sample trust content rows
  await prisma.stat.deleteMany({ where: { isSample: true } });
  await prisma.certification.deleteMany({ where: { isSample: true } });
  await prisma.partner.deleteMany({ where: { isSample: true } });
  await prisma.testimonial.deleteMany({ where: { isSample: true } });
  await prisma.faqItem.deleteMany({ where: { isSample: true } });
  await prisma.blogPost.deleteMany({ where: { isSample: true } });

  // 4. Seed 15 Full Demo Products
  console.log("Creating 15 demo products with 3 views and specs...");
  for (const p of demoProducts) {
    const categoryId = categories[p.categorySlug];
    if (!categoryId) {
      throw new Error(`Unknown category slug: ${p.categorySlug}`);
    }

    const pRec = p as Record<string, unknown>;
    const createdProduct = await prisma.product.create({
      data: {
        slug: p.slug,
        name: p.name,
        nameBn: (pRec.nameBn as string) || null,
        categoryId,
        shortDescription: p.shortDescription,
        shortDescriptionBn: (pRec.shortDescriptionBn as string) || null,
        description: p.description,
        descriptionBn: (pRec.descriptionBn as string) || null,
        brand: p.brand,
        model: p.model,
        stockStatus: p.stockStatus,
        moq: p.moq,
        moqBn: (pRec.moqBn as string) || null,
        leadTime: p.leadTime,
        leadTimeBn: (pRec.leadTimeBn as string) || null,
        priceBdt: null,
        showPrice: false,
        datasheetUrl: null,
        isFeatured: p.isFeatured,
        isActive: true,
        isDemo: true,
        sortOrder: p.sortOrder,
        metaTitle: (pRec.metaTitle as string) || null,
        metaTitleBn: (pRec.metaTitleBn as string) || null,
        metaDescription: (pRec.metaDescription as string) || null,
        metaDescriptionBn: (pRec.metaDescriptionBn as string) || null,
      },
    });

    // Images
    const views = ["front", "angled", "detail"] as const;
    for (let i = 0; i < p.images.length; i++) {
      const img = p.images[i] as { url: string; alt: string; altBn?: string | null; sortOrder: number };
      const view = views[i] || "front";
      const resolvedUrl = getProductImagePath(p.slug, view, img.url);
      await prisma.productImage.create({
        data: {
          productId: createdProduct.id,
          url: resolvedUrl,
          alt: img.alt,
          altBn: img.altBn || null,
          sortOrder: img.sortOrder,
        },
      });
    }

    // Specs
    for (const spec of p.specs) {
      const sp = spec as { label: string; labelBn?: string | null; value: string; valueBn?: string | null; sortOrder: number };
      await prisma.productSpec.create({
        data: {
          productId: createdProduct.id,
          label: sp.label,
          labelBn: sp.labelBn || null,
          value: sp.value,
          valueBn: sp.valueBn || null,
          sortOrder: sp.sortOrder,
        },
      });
    }
  }
  console.log(`✓ Seeded ${demoProducts.length} demo products.`);

  // 5. Seed Sample Trust Content (all isSample=true)
  console.log("Seeding sample trust content (stats, certifications, partners, testimonials, FAQs)...");
  
  for (const stat of sampleStats) {
    await prisma.stat.create({ data: stat });
  }

  for (const cert of sampleCertifications) {
    await prisma.certification.create({ data: cert });
  }

  for (const partner of samplePartners) {
    await prisma.partner.create({ data: partner });
  }

  for (const testimonial of sampleTestimonials) {
    await prisma.testimonial.create({ data: testimonial });
  }

  for (const faq of sampleFaqs) {
    await prisma.faqItem.create({ data: faq });
  }

  // 6. Seed Sample Educational Blog Posts (isSample=true, PUBLISHED)
  console.log("Seeding sample educational blog posts...");
  for (const blog of sampleBlogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: blog.slug },
      update: blog,
      create: blog,
    });
  }

  console.log("✓ Sample trust content and blog posts successfully seeded!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
