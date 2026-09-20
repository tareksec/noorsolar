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
  const seedDemo = process.env.SEED_DEMO === "true";
  const isDemoOnly = process.argv.includes("--demo-only");

  console.log(`Starting database seed (NODE_ENV=${process.env.NODE_ENV || "development"}, SEED_DEMO=${process.env.SEED_DEMO || "false"})...`);

  // 1. Admin User & Site Settings
  if (!isDemoOnly) {
    const adminEmail = process.env.ADMIN_EMAIL || "owner@example.com";
    const rawPassword = process.env.ADMIN_PASSWORD || "change-me-on-first-login";

    if (isProduction) {
      if (
        !process.env.ADMIN_PASSWORD ||
        process.env.ADMIN_PASSWORD === "change-me-on-first-login" ||
        process.env.ADMIN_PASSWORD.length < 12
      ) {
        console.error(
          "FATAL: In production, ADMIN_PASSWORD must be provided via environment variable, cannot be the default placeholder, and must be at least 12 characters long."
        );
        process.exit(1);
      }
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

    // Ensure default site config
    await prisma.siteSetting.upsert({
      where: { key: "site_config" },
      update: {},
      create: {
        key: "site_config",
        value: JSON.stringify(defaultSiteConfig),
      },
    });
    console.log("✓ Core site settings ensured.");
  }

  // 2. Categories
  const categoriesData = [
    {
      slug: "solar-panels",
      name: "Solar Panels",
      description:
        "Monocrystalline, N-Type TOPCon, and bifacial solar modules for commercial rooftop and industrial utility installations.",
      image: "/photos/cat-solar-panels.webp",
      sortOrder: 1,
    },
    {
      slug: "lithium-batteries",
      name: "Lithium-ion Batteries",
      description:
        "High-density LiFePO4 server rack batteries and modular energy storage systems with smart BMS protocols.",
      image: "/photos/cat-lithium-batteries.webp",
      sortOrder: 2,
    },
    {
      slug: "solar-inverters",
      name: "Inverters",
      description:
        "Grid-tied, hybrid three-phase, and off-grid pure sine wave solar inverters engineered for commercial reliability and microgrids.",
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

  // 4. Seed 15 Full Demo Products
  console.log("Creating 15 demo products with 3 views and specs...");
  for (const p of demoProducts) {
    const categoryId = categories[p.categorySlug];
    if (!categoryId) {
      throw new Error(`Unknown category slug: ${p.categorySlug}`);
    }

    const createdProduct = await prisma.product.create({
      data: {
        slug: p.slug,
        name: p.name,
        categoryId,
        shortDescription: p.shortDescription,
        description: p.description,
        brand: p.brand,
        model: p.model,
        stockStatus: p.stockStatus,
        moq: p.moq,
        leadTime: p.leadTime,
        priceBdt: null,
        showPrice: false,
        datasheetUrl: null,
        isFeatured: p.isFeatured,
        isActive: true,
        isDemo: true,
        sortOrder: p.sortOrder,
      },
    });

    // Images
    const views = ["front", "angled", "detail"] as const;
    for (let i = 0; i < p.images.length; i++) {
      const img = p.images[i];
      const view = views[i] || "front";
      const resolvedUrl = getProductImagePath(p.slug, view, img.url);
      await prisma.productImage.create({
        data: {
          productId: createdProduct.id,
          url: resolvedUrl,
          alt: img.alt,
          sortOrder: img.sortOrder,
        },
      });
    }

    // Specs
    for (const spec of p.specs) {
      await prisma.productSpec.create({
        data: {
          productId: createdProduct.id,
          label: spec.label,
          value: spec.value,
          sortOrder: spec.sortOrder,
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
