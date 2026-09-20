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
function sanitizeDbUrl(raw) {
  if (!raw) return "";
  let url = raw.trim();
  while ((url.startsWith('"') && url.endsWith('"')) || (url.startsWith("'") && url.endsWith("'"))) {
    url = url.slice(1, -1).trim();
  }
  if (!url.startsWith("mysql://")) {
    if (url.startsWith("file:") || url.startsWith("sqlite:")) return "";
    url = `mysql://${url}`;
  }
  try {
    const withoutProtocol = url.slice("mysql://".length);
    const lastAt = withoutProtocol.lastIndexOf("@");
    if (lastAt !== -1) {
      const userInfo = withoutProtocol.slice(0, lastAt);
      const hostAndDb = withoutProtocol.slice(lastAt + 1);
      const firstColon = userInfo.indexOf(":");
      let user = userInfo;
      let pass = "";
      if (firstColon !== -1) {
        user = userInfo.slice(0, firstColon);
        pass = userInfo.slice(firstColon + 1);
      }
      const safeUser = encodeURIComponent(decodeURIComponent(user));
      const safePass = encodeURIComponent(decodeURIComponent(pass));
      return `mysql://${safeUser}:${safePass}@${hostAndDb}`;
    }
  } catch {}
  return url;
}

if (process.env.DATABASE_URL) {
  process.env.DATABASE_URL = sanitizeDbUrl(process.env.DATABASE_URL);
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
