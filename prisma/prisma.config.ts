// @ts-nocheck
import { defineConfig } from '@prisma/internals';

export default defineConfig({
  seed: 'npx tsx prisma/seed.ts'
});
