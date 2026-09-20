import { PrismaClient } from "@prisma/client";

// Ensure DATABASE_URL is defined even during CI/CD or build phase
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "mysql://root:@localhost:3306/noorsolar";
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
