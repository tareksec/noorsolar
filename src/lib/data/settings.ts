import { db } from "@/lib/db";
import { defaultSiteConfig, SiteConfig } from "@/lib/site-config";

export async function getSiteSettings(locale?: string): Promise<SiteConfig> {
  try {
    const setting = await db.siteSetting.findUnique({
      where: { key: "site_config" },
    });

    if (!setting || !setting.value) {
      return defaultSiteConfig;
    }

    const parsed = JSON.parse(setting.value);
    const base: SiteConfig = {
      ...defaultSiteConfig,
      ...parsed,
      socials: {
        ...defaultSiteConfig.socials,
        ...(parsed.socials || {}),
      },
    };

    if (locale !== "bn") return base;

    // Localize text fields with <key>.bn fallback
    const textKeys: Array<keyof SiteConfig> = [
      "tagline",
      "description",
      "address",
      "hours",
      "heroHeadline",
      "heroSubheadline",
      "heroPrimaryCta",
      "heroSecondaryCta",
      "processHeadline",
      "processSubheadline",
      "closingCtaHeadline",
      "closingCtaSubheadline",
      "aboutHeadline",
      "aboutBody",
    ];

    const localized = { ...base } as SiteConfig;

    for (const key of textKeys) {
      const bnKeyDot = `${key}.bn`;
      const bnKeyCamel = `${key}Bn`;
      const val = parsed[bnKeyDot]?.trim() || parsed[bnKeyCamel]?.trim();
      if (val) {
        (localized as unknown as Record<string, unknown>)[key] = val;
      }
    }

    if (base.processSteps && Array.isArray(base.processSteps)) {
      localized.processSteps = base.processSteps.map((step) => ({
        title: step.titleBn?.trim() || step.title,
        desc: step.descBn?.trim() || step.desc,
        titleBn: step.titleBn,
        descBn: step.descBn,
      }));
    }

    return localized;
  } catch (error) {
    console.error("Failed to fetch site settings, using fallback defaults:", error);
    return defaultSiteConfig;
  }
}

export async function updateSiteSettings(
  config: Partial<SiteConfig> & Record<string, unknown>
): Promise<SiteConfig> {
  const currentSetting = await db.siteSetting.findUnique({
    where: { key: "site_config" },
  });

  const parsedCurrent = currentSetting?.value ? JSON.parse(currentSetting.value) : defaultSiteConfig;

  const updated = {
    ...parsedCurrent,
    ...config,
    socials: {
      ...(parsedCurrent.socials || {}),
      ...(config.socials || {}),
    },
  };

  await db.siteSetting.upsert({
    where: { key: "site_config" },
    update: { value: JSON.stringify(updated) },
    create: { key: "site_config", value: JSON.stringify(updated) },
  });

  return updated as SiteConfig;
}
