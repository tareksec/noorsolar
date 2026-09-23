import { PrismaClient } from "@prisma/client";

export function sanitizeDatabaseUrl(raw?: string): string {
  if (!raw) return "mysql://root:@127.0.0.1:3306/noorsolar";
  let url = raw.trim();
  // Strip accidental surrounding quotes from Hostinger input form
  while ((url.startsWith('"') && url.endsWith('"')) || (url.startsWith("'") && url.endsWith("'"))) {
    url = url.slice(1, -1).trim();
  }
  // Allow SQLite database URLs
  if (url.startsWith("file:") || url.startsWith("sqlite:")) {
    return url;
  }

  // Enforce mysql protocol for non-sqlite connections
  if (!url.startsWith("mysql://")) {
    url = `mysql://${url}`;
  }

  // Parse and safely URL-encode username and password if special characters exist
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
  } catch {
    // If parsing fails, return original url
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
