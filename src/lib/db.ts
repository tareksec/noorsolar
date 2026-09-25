import { PrismaClient } from "@prisma/client";

export function sanitizeDatabaseUrl(raw?: string): string {
  // SQLite only: trust DATABASE_URL as-is. No protocol coercion, no MySQL fallback.
  if (!raw) return "";
  let url = raw.trim();
  // Strip accidental surrounding quotes from hosting input forms
  while ((url.startsWith('"') && url.endsWith('"')) || (url.startsWith("'") && url.endsWith("'"))) {
    url = url.slice(1, -1).trim();
  }
  return url;
}

const cleanedUrl = sanitizeDatabaseUrl(process.env.DATABASE_URL);
process.env.DATABASE_URL = cleanedUrl;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: cleanedUrl,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
