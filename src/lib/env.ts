import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  AUTH_SECRET: z.string().min(16, "AUTH_SECRET must be at least 16 characters (recommended 32+)"),
  ADMIN_EMAIL: z.string().email("ADMIN_EMAIL must be a valid email address"),
  ADMIN_PASSWORD: z.string().min(8, "ADMIN_PASSWORD must be at least 8 characters"),
  UPLOAD_DIR: z.string().default("./storage/uploads"),
  NEXT_PUBLIC_SITE_URL: z.string().default("http://localhost:3000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  HIDE_SAMPLE_CONTENT: z.string().optional(),
  SEED_DEMO: z.string().optional(),
});

function validateEnv() {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error("❌ CRITICAL: Environment variable validation failed at startup:");
    result.error.issues.forEach((issue) => {
      console.error(`  • [${issue.path.join(".")}] ${issue.message}`);
    });
    throw new Error(
      `Invalid environment configuration: ${result.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join(", ")}`
    );
  }
  return result.data;
}

export const env = validateEnv();
