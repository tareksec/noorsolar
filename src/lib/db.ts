import { PrismaClient } from "@prisma/client";

function sanitizeDatabaseUrl(raw?: string): string {
  if (!raw) return "mysql://root:@127.0.0.1:3306/noorsolar";
  let url = raw.trim();
  // Strip accidental surrounding quotes from Hostinger input form
  while ((url.startsWith('"') && url.endsWith('"')) || (url.startsWith("'") && url.endsWith("'"))) {
    url = url.slice(1, -1).trim();
  }
  // Enforce mysql protocol
  if (!url.startsWith("mysql://")) {
    if (url.startsWith("file:") || url.startsWith("sqlite:")) {
      return "mysql://root:@127.0.0.1:3306/noorsolar";
    }
    url = `mysql://${url}`;
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
