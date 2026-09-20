// Idempotent upgrade of known starter text only. Owner-edited values are preserved.
import { PrismaClient } from "@prisma/client";
import { defaultSiteConfig } from "../src/lib/site-config";
process.loadEnvFile(".env");
const db = new PrismaClient();
const previous: Record<string, string> = {
  heroHeadline: "Solar panels, lithium batteries and inverters, supplied in bulk.",
  heroSubheadline: "Direct B2B importer providing engineering-grade solar equipment and wholesale delivery across Bangladesh.",
  heroPrimaryCta: "Request Quote",
  heroSecondaryCta: "Browse Products",
  closingCtaHeadline: "Ready to Order or Inquire About Container Pricing?",
  closingCtaSubheadline: "Submit your project specifications or required equipment quantity below. Our commercial sales engineers respond with formal quotations within working hours.",
  aboutHeadline: "Engineering-Grade Solar Equipment for Bangladesh .",
};
async function main() {
  const setting = await db.siteSetting.findUnique({ where: { key: "site_config" } });
  if (!setting) return;
  const config = JSON.parse(setting.value) as Record<string, unknown>;
  const defaults = defaultSiteConfig as unknown as Record<string, unknown>;
  const changed: string[] = [];
  for (const [key, old] of Object.entries(previous)) {
    if (config[key] === old) { config[key] = defaults[key]; changed.push(key); }
  }
  if (changed.length) await db.siteSetting.update({ where: { key: "site_config" }, data: { value: JSON.stringify(config) } });
  console.log("Starter copy updated:", changed.join(", ") || "already current; owner copy preserved");
}
main().finally(() => db.$disconnect());
