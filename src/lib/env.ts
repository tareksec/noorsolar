import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required")
    .default("mysql://root:@localhost:3306/noorsolar"),
  AUTH_SECRET: z
    .string()
    .min(16, "AUTH_SECRET must be at least 16 characters (recommended 32+)")
    .default("temporary_build_secret_at_least_32_chars_long_key_12345"),
  ADMIN_EMAIL: z
    .string()
    .email("ADMIN_EMAIL must be a valid email address")
    .default("admin@noorsolaren.com"),
  ADMIN_PASSWORD: z
    .string()
    .min(8, "ADMIN_PASSWORD must be at least 8 characters")
    .default("admin_default_pass_123"),
  UPLOAD_DIR: z.string().default("./storage/uploads"),
  NEXT_PUBLIC_SITE_URL: z.string().default("http://localhost:3000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  HIDE_SAMPLE_CONTENT: z.string().optional(),
  SEED_DEMO: z.string().optional(),
});

import { sanitizeDatabaseUrl } from "./db";

function validateEnv() {
  if (process.env.DATABASE_URL) {
    process.env.DATABASE_URL = sanitizeDatabaseUrl(process.env.DATABASE_URL);
  }
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.warn("⚠️ Warning: Some environment variables are not set. Using safe fallback defaults for build.");
    result.error.issues.forEach((issue) => {
      console.warn(`  • [${issue.path.join(".")}] ${issue.message}`);
    });
    return envSchema.parse({});
  }
  return result.data;
}

export const env = validateEnv();
