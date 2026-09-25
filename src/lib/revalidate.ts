import { revalidatePath } from "next/cache";

/**
 * Revalidate a path after an admin write, covering locale variants.
 *
 * Public routes live under /[locale] and next-intl serves English without a
 * URL prefix, so a statically rendered page may be cached under an explicit
 * locale key (for example `/en/certifications`) while the public URL has no
 * prefix (`/certifications`). Purging only the public path can therefore miss
 * the cache entry and the edit never appears until a time-based revalidation.
 *
 * This helper purges the path as written plus its `/en` and `/bn` variants.
 * Paths that match nothing are harmless no-ops. Admin paths pass straight
 * through (admin routes render dynamically, the purge is just hygiene).
 */
export function revalidatePublic(path: string): void {
  revalidatePath(path);

  if (
    path.startsWith("/admin") ||
    path.startsWith("/api/") ||
    path.startsWith("/uploads")
  ) {
    return;
  }

  if (path === "/" || path === "/bn" || path === "/en") {
    revalidatePath("/");
    revalidatePath("/en");
    revalidatePath("/bn");
    return;
  }

  if (!path.startsWith("/en/") && !path.startsWith("/bn/")) {
    revalidatePath(`/en${path}`);
    revalidatePath(`/bn${path}`);
  }
}
