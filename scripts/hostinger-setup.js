const { execSync } = require("child_process");

console.log("🚀 Running Hostinger deployment setup...");

function runCommand(command, description) {
  try {
    console.log(`⏳ [Hostinger Setup] ${description}...`);
    execSync(command, { stdio: "inherit", env: process.env });
    console.log(`✅ [Hostinger Setup] ${description} succeeded.`);
    return true;
  } catch (err) {
    console.warn(`⚠️ [Hostinger Setup] ${description} notice: ${err.message}`);
    return false;
  }
}

// 1. Always generate Prisma client
runCommand("npx prisma generate", "Generating Prisma Client");

// 2. Database Sync & Seed if DATABASE_URL is configured
if (process.env.DATABASE_URL) {
  let url = process.env.DATABASE_URL.trim();
  while ((url.startsWith('"') && url.endsWith('"')) || (url.startsWith("'") && url.endsWith("'"))) {
    url = url.slice(1, -1).trim();
  }
  process.env.DATABASE_URL = url;
}

const dbUrl = process.env.DATABASE_URL;
if (dbUrl && dbUrl.startsWith("mysql://")) {
  console.log("📦 Valid MySQL DATABASE_URL detected. Synchronizing schema to database...");
  const pushed = runCommand("npx prisma db push --skip-generate", "Syncing database schema (prisma db push)");
  if (pushed) {
    runCommand("npx tsx prisma/seed.ts", "Seeding database with categories, products, and admin");
  }
} else {
  console.log("ℹ️ Skipping db push & seed because DATABASE_URL is not set yet in environment.");
}

console.log("✨ Hostinger setup finished. Proceeding to build...");
