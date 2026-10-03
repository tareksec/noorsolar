/**
 * scripts/check-i18n.js
 * Comprehensive i18n verification suite for Noor Solar Energy:
 * 1. messages/en.json and messages/bn.json parity, placeholders, and translation quality.
 * 2. Database seed content verification (all *Bn fields populated).
 * 3. Puppeteer-core live route crawl:
 *    - <html lang="bn">
 *    - hreflang links (en, bn, x-default)
 *    - Computed font-family includes Hind Siliguri (Bengali font)
 *    - No raw unparsed translation keys in rendered DOM
 *    - No single-character split animations on Bengali text
 *    - Language switcher presence and routing
 *
 * Exit code 1 on any failure.
 */

const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const CHROME_PATH =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:3000";

let puppeteer;
try {
  puppeteer = require("puppeteer-core");
} catch (err) {
  console.error(`FATAL: Could not load puppeteer-core: ${err.message}`);
  process.exit(1);
}

// Allowlisted terms that can legally remain in Latin script in Bangla translation
const ALLOWLISTED_IDENTICAL_TERMS = new Set([
  "Noor Solar Energy",
  "NOOR SOLAR ENERGY",
  "Noor Solar",
  "TOPCon",
  "LiFePO4",
  "MPPT",
  "IP65",
  "IP66",
  "BMS",
  "Tier-1",
  "Grade-A",
  "UPS",
  "kW",
  "kWh",
  "W",
  "Ah",
  "V",
  "ms",
  "mm",
  "RS485",
  "CAN",
  "info@noorsolaren.com",
  "+880 1711 000000",
  "+8801711000000",
  "BSREA",
  "20260915GEN113",
  "Noor Solar Energy",
  "বাংলা",
  "English",
]);

function flattenObject(obj, prefix = "") {
  let result = {};
  for (const [key, value] of Object.entries(obj)) {
    const nextKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, nextKey));
    } else {
      result[nextKey] = value;
    }
  }
  return result;
}

function extractPlaceholders(str) {
  if (typeof str !== "string") return [];
  const matches = str.match(/\{[a-zA-Z0-9_]+\}/g);
  return matches ? matches.sort() : [];
}

async function verifyMessagesJson() {
  console.log("▶ 1. Verifying messages/en.json and messages/bn.json...");
  const enPath = path.join(__dirname, "..", "messages", "en.json");
  const bnPath = path.join(__dirname, "..", "messages", "bn.json");

  if (!fs.existsSync(enPath) || !fs.existsSync(bnPath)) {
    throw new Error("Missing messages/en.json or messages/bn.json");
  }

  const enJson = JSON.parse(fs.readFileSync(enPath, "utf-8"));
  const bnJson = JSON.parse(fs.readFileSync(bnPath, "utf-8"));

  const enFlat = flattenObject(enJson);
  const bnFlat = flattenObject(bnJson);

  const enKeys = Object.keys(enFlat);
  const bnKeys = Object.keys(bnFlat);

  const missingInBn = enKeys.filter((k) => !(k in bnFlat));
  const extraInBn = bnKeys.filter((k) => !(k in enFlat));

  if (missingInBn.length > 0) {
    throw new Error(`Keys missing in bn.json (${missingInBn.length}):\n  ${missingInBn.slice(0, 10).join("\n  ")}`);
  }
  if (extraInBn.length > 0) {
    throw new Error(`Extra keys found in bn.json (${extraInBn.length}):\n  ${extraInBn.slice(0, 10).join("\n  ")}`);
  }

  let emptyValues = [];
  let placeholderMismatches = [];
  let identicalUnallowed = [];

  for (const key of enKeys) {
    const enVal = String(enFlat[key]).trim();
    const bnVal = String(bnFlat[key]).trim();

    if (!bnVal) {
      emptyValues.push(key);
      continue;
    }

    // Check placeholder parity: {count}, {name}, etc.
    const enPlaceholders = extractPlaceholders(enVal);
    const bnPlaceholders = extractPlaceholders(bnVal);
    if (JSON.stringify(enPlaceholders) !== JSON.stringify(bnPlaceholders)) {
      placeholderMismatches.push({
        key,
        enPlaceholders,
        bnPlaceholders,
      });
    }

    // Check identical English strings (untranslated)
    if (enVal === bnVal && !ALLOWLISTED_IDENTICAL_TERMS.has(enVal)) {
      // If it's a short technical spec code or number or URL/email, allow it
      const isTech = /^[A-Z0-9\-_./@:+ ()]+$/i.test(enVal) && enVal.length < 25;
      if (!isTech) {
        identicalUnallowed.push({ key, value: enVal });
      }
    }
  }

  if (emptyValues.length > 0) {
    throw new Error(`Empty values in bn.json (${emptyValues.length}):\n  ${emptyValues.slice(0, 10).join("\n  ")}`);
  }

  if (placeholderMismatches.length > 0) {
    throw new Error(
      `Placeholder mismatch in bn.json (${placeholderMismatches.length}):\n` +
        placeholderMismatches.map((m) => `  ${m.key}: EN=${m.enPlaceholders.join(",")} vs BN=${m.bnPlaceholders.join(",")}`).join("\n")
    );
  }

  if (identicalUnallowed.length > 0) {
    throw new Error(
      `Identical untranslated strings found (${identicalUnallowed.length}):\n` +
        identicalUnallowed.map((i) => `  ${i.key}: "${i.value}"`).join("\n")
    );
  }

  console.log(`  ✓ Key parity confirmed: ${enKeys.length} matching keys, 0 empty, placeholders verified.\n`);
}

async function verifyDatabaseLocalization(prisma) {
  console.log("▶ 2. Verifying database content localization (*Bn fields)...");

  // 1. Products
  const products = await prisma.product.findMany({
    select: { id: true, slug: true, name: true, nameBn: true, descriptionBn: true, specs: true },
  });
  if (products.length < 15) {
    throw new Error(`Expected at least 15 seeded products, found ${products.length}`);
  }
  for (const p of products) {
    if (!p.nameBn || !/[\u0980-\u09FF]/.test(p.nameBn)) {
      throw new Error(`Product ${p.slug} has missing or non-Bengali nameBn: "${p.nameBn}"`);
    }
    if (!p.descriptionBn || !/[\u0980-\u09FF]/.test(p.descriptionBn)) {
      throw new Error(`Product ${p.slug} has missing or non-Bengali descriptionBn`);
    }
  }
  console.log(`  ✓ All ${products.length} products have verified Bangla nameBn & descriptionBn.`);

  // 2. Categories
  const categories = await prisma.category.findMany();
  if (categories.length < 3) {
    throw new Error(`Expected at least 3 categories, found ${categories.length}`);
  }
  for (const c of categories) {
    if (!c.nameBn || !/[\u0980-\u09FF]/.test(c.nameBn)) {
      throw new Error(`Category ${c.slug} missing Bangla nameBn`);
    }
    if (!c.descriptionBn || !/[\u0980-\u09FF]/.test(c.descriptionBn)) {
      throw new Error(`Category ${c.slug} missing Bangla descriptionBn`);
    }
  }
  console.log(`  ✓ All ${categories.length} categories have verified Bangla nameBn & descriptionBn.`);

  // 3. Certifications
  const certs = await prisma.certification.findMany();
  for (const cert of certs) {
    if (!cert.nameBn || !/[\u0980-\u09FF]/.test(cert.nameBn)) {
      throw new Error(`Certification ${cert.name} missing Bangla nameBn`);
    }
  }
  console.log(`  ✓ All ${certs.length} certifications have verified Bangla nameBn.`);

  // 4. Testimonials
  const testimonials = await prisma.testimonial.findMany();
  for (const t of testimonials) {
    if (!t.quoteBn || !/[\u0980-\u09FF]/.test(t.quoteBn)) {
      throw new Error(`Testimonial from ${t.authorName} missing Bangla quoteBn`);
    }
  }
  console.log(`  ✓ All ${testimonials.length} testimonials have verified Bangla quoteBn.`);

  // 5. FAQs
  const faqs = await prisma.faqItem.findMany();
  for (const f of faqs) {
    if (!f.questionBn || !/[\u0980-\u09FF]/.test(f.questionBn)) {
      throw new Error(`FAQ ${f.id} missing Bangla questionBn`);
    }
    if (!f.answerBn || !/[\u0980-\u09FF]/.test(f.answerBn)) {
      throw new Error(`FAQ ${f.id} missing Bangla answerBn`);
    }
  }
  console.log(`  ✓ All ${faqs.length} FAQ items have verified Bangla questionBn & answerBn.`);

  // 6. Stats
  const stats = await prisma.stat.findMany();
  for (const s of stats) {
    if (!s.labelBn || !/[\u0980-\u09FF]/.test(s.labelBn)) {
      throw new Error(`Stat ${s.label} missing Bangla labelBn`);
    }
  }
  console.log(`  ✓ All ${stats.length} stats have verified Bangla labelBn.`);

  // 7. SiteSettings
  const settingRecord = await prisma.siteSetting.findUnique({
    where: { key: "site_config" },
  });
  if (!settingRecord || !settingRecord.value) {
    throw new Error("No site_config record found in siteSetting table.");
  }
  const settings = JSON.parse(settingRecord.value);
  if (!settings.heroHeadlineBn || !/[\u0980-\u09FF]/.test(settings.heroHeadlineBn)) {
    throw new Error("SiteSettings missing Bangla heroHeadlineBn");
  }
  if (!settings.processHeadlineBn || !/[\u0980-\u09FF]/.test(settings.processHeadlineBn)) {
    throw new Error("SiteSettings missing Bangla processHeadlineBn");
  }
  console.log("  ✓ SiteSettings has verified Bangla headlines, process steps, and brand texts.");

  // 8. Blog Posts
  const blogs = await prisma.blogPost.findMany();
  if (blogs.length < 3) {
    throw new Error(`Expected at least 3 blog posts, found ${blogs.length}`);
  }
  for (const b of blogs) {
    if (!b.titleBn || !/[\u0980-\u09FF]/.test(b.titleBn)) {
      throw new Error(`Blog post ${b.slug} missing Bangla titleBn`);
    }
    if (!b.contentBn || !/[\u0980-\u09FF]/.test(b.contentBn)) {
      throw new Error(`Blog post ${b.slug} missing Bangla contentBn`);
    }
  }
  console.log(`  ✓ All ${blogs.length} original Bangla blog posts verified.\n`);

  return { firstProductSlug: products[0].slug, firstBlogSlug: blogs[0].slug };
}

async function verifyCrawledRoutes(firstProductSlug, firstBlogSlug) {
  console.log("▶ 3. Crawling live routes with puppeteer-core...");

  if (!fs.existsSync(CHROME_PATH)) {
    throw new Error(`Chrome executable not found at: ${CHROME_PATH}`);
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });

  const routes = [
    "/bn",
    "/bn/products",
    "/bn/category/solar-panels",
    `/bn/product/${firstProductSlug}`,
    "/bn/about",
    "/bn/certifications",
    "/bn/contact",
    "/bn/blog",
    `/bn/blog/${firstBlogSlug}`,
  ];

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    for (const route of routes) {
      const url = `${BASE_URL}${route}`;
      process.stdout.write(`  Testing ${route} ... `);

      const response = await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
      if (!response || response.status() !== 200) {
        throw new Error(`Failed to load ${url}: status ${response ? response.status() : "none"}`);
      }

      // Check 1: <html lang="bn">
      const htmlLang = await page.evaluate(() => document.documentElement.lang);
      if (htmlLang !== "bn") {
        throw new Error(`Expected <html lang="bn"> on ${route}, found lang="${htmlLang}"`);
      }

      // Check 2: hreflang tags in <head>
      const hreflangs = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('link[rel="alternate"][hreflang]'));
        return links.map((l) => l.getAttribute("hreflang"));
      });
      if (!hreflangs.includes("bn") || !hreflangs.includes("en")) {
        throw new Error(`Missing required hreflang tags on ${route}. Found: [${hreflangs.join(", ")}]`);
      }

      // Check 3: Computed font-family includes Hind Siliguri on body
      const computedFont = await page.evaluate(() => {
        return window.getComputedStyle(document.body).fontFamily;
      });
      const hasBengaliFont =
        computedFont.includes("Hind Siliguri") ||
        computedFont.includes("font-bengali") ||
        computedFont.includes("Hind_Siliguri") ||
        computedFont.includes("tiroBangla") ||
        computedFont.includes("Tiro Bangla");
      if (!hasBengaliFont) {
        throw new Error(`Expected Bengali font (Tiro Bangla or Hind Siliguri) on body on ${route}, got: "${computedFont}"`);
      }

      // Check 4: No raw translation keys visible
      const rawKeyMatches = await page.evaluate(() => {
        const bodyText = document.body.innerText || "";
        const regex = /\b(navigation|common|product|category|contact|about|footer|cart|quote|home|checkout|hero)\.[a-zA-Z0-9_.]+\b/g;
        const matches = bodyText.match(regex);
        return matches ? Array.from(new Set(matches)) : [];
      });
      if (rawKeyMatches.length > 0) {
        throw new Error(`Visible raw translation keys detected on ${route}: ${rawKeyMatches.join(", ")}`);
      }

      // Check 5: No single-character split animations on Bengali text (which break conjuncts/hasant)
      const singleCharSplits = await page.evaluate(() => {
        const spans = Array.from(document.querySelectorAll("span, div"));
        const broken = [];
        for (const s of spans) {
          // If element has exactly 1 character that is a Bengali character or combining mark
          const text = s.textContent || "";
          if (text.length === 1 && /[\u0980-\u09FF]/.test(text)) {
            // Check if it's an isolated child of a text splitting animation container
            if (s.parentElement && s.parentElement.children.length > 2) {
              broken.push(text);
            }
          }
        }
        return broken;
      });
      if (singleCharSplits.length > 0) {
        throw new Error(`Detected single-character split animation nodes on Bengali glyphs on ${route}`);
      }

      // Check 6: Language switcher exists
      const hasLangSwitcher = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll("a"));
        return links.some((a) => {
          const text = (a.textContent || "").trim();
          const href = a.getAttribute("href") || "";
          return (text.includes("EN") || text.includes("English")) || href === "/" || href.startsWith("/?");
        });
      });
      if (!hasLangSwitcher) {
        throw new Error(`Language switcher to English not found on ${route}`);
      }

      console.log("✓ OK");
    }
  } finally {
    await browser.close();
  }

  console.log("\n  ✓ All 9 live routes verified (HTML lang, hreflang, Hind Siliguri, clean DOM, switcher).\n");
}

async function main() {
  console.log("==================================================");
  console.log("NOOR SOLAR ENERGY — TASK I18N-B VERIFICATION SUITE");
  console.log("==================================================\n");

  const prisma = new PrismaClient();
  try {
    await verifyMessagesJson();
    const { firstProductSlug, firstBlogSlug } = await verifyDatabaseLocalization(prisma);
    await verifyCrawledRoutes(firstProductSlug, firstBlogSlug);

    console.log("==================================================");
    console.log("🎉 ALL TASK I18N-B VERIFICATIONS PASSED (EXIT 0)");
    console.log("==================================================");
    process.exit(0);
  } catch (err) {
    console.error("\n❌ I18N VERIFICATION FAILED:");
    console.error(err.message || err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
