import { db } from "@/lib/db";
import { defaultSiteConfig, SiteConfig } from "@/lib/site-config";

export async function getSiteSettings(): Promise<SiteConfig> {
  try {
    const setting = await db.siteSetting.findUnique({
      where: { key: "site_config" },
    });

    if (!setting || !setting.value) {
      return defaultSiteConfig;
    }

    const parsed = JSON.parse(setting.value);
    return {
      ...defaultSiteConfig,
      ...parsed,
      socials: {
        ...defaultSiteConfig.socials,
        ...(parsed.socials || {}),
      },
    };
  } catch (error) {
    console.error("Failed to fetch site settings, using fallback defaults:", error);
    return defaultSiteConfig;
  }
}

export async function updateSiteSettings(config: Partial<SiteConfig>): Promise<SiteConfig> {
  const current = await getSiteSettings();
  const updated = {
    ...current,
    ...config,
    socials: {
      ...current.socials,
      ...(config.socials || {}),
    },
  };

  await db.siteSetting.upsert({
    where: { key: "site_config" },
    update: { value: JSON.stringify(updated) },
    create: { key: "site_config", value: JSON.stringify(updated) },
  });

  return updated;
}
