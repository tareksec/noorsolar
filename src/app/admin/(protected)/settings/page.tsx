import Link from "next/link";
import { KeyRound } from "lucide-react";
import React from "react";
import { getSiteSettings, updateSiteSettings } from "@/lib/data/settings";
import { isPublicReviewsEnabled, setPublicReviewsEnabled } from "@/lib/data/reviews";
import { revalidatePublic } from "@/lib/revalidate";
import { getSession } from "@/lib/auth";
import { SettingsFormClient } from "@/components/admin/settings-form-client";

async function saveSettingsAction(formData: FormData) {
  "use server";
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const reviewsPublicEnabled = formData.get("reviewsPublicEnabled") === "true";
  await setPublicReviewsEnabled(reviewsPublicEnabled);
  const companyName = formData.get("companyName") as string;
  const phone = formData.get("phone") as string;
  const phoneDisplay = formData.get("phoneDisplay") as string;
  const whatsapp = formData.get("whatsapp") as string;
  const whatsappDisplay = formData.get("whatsappDisplay") as string;
  const email = formData.get("email") as string;
  const address = formData.get("address") as string;
  const addressBn = (formData.get("addressBn") as string) || undefined;
  const hours = formData.get("hours") as string;
  const hoursBn = (formData.get("hoursBn") as string) || undefined;
  const heroHeadline = formData.get("heroHeadline") as string;
  const heroHeadlineBn = (formData.get("heroHeadlineBn") as string) || undefined;
  const heroSubheadline = formData.get("heroSubheadline") as string;
  const heroSubheadlineBn = (formData.get("heroSubheadlineBn") as string) || undefined;
  const heroPrimaryCta = formData.get("heroPrimaryCta") as string;
  const heroPrimaryCtaBn = (formData.get("heroPrimaryCtaBn") as string) || undefined;
  const heroSecondaryCta = formData.get("heroSecondaryCta") as string;
  const heroSecondaryCtaBn = (formData.get("heroSecondaryCtaBn") as string) || undefined;
  const processHeadline = formData.get("processHeadline") as string;
  const processHeadlineBn = (formData.get("processHeadlineBn") as string) || undefined;
  const processSubheadline = formData.get("processSubheadline") as string;
  const processSubheadlineBn = (formData.get("processSubheadlineBn") as string) || undefined;

  const step1Title = formData.get("step1Title") as string;
  const step1Desc = formData.get("step1Desc") as string;
  const step1TitleBn = (formData.get("step1TitleBn") as string) || undefined;
  const step1DescBn = (formData.get("step1DescBn") as string) || undefined;

  const step2Title = formData.get("step2Title") as string;
  const step2Desc = formData.get("step2Desc") as string;
  const step2TitleBn = (formData.get("step2TitleBn") as string) || undefined;
  const step2DescBn = (formData.get("step2DescBn") as string) || undefined;

  const step3Title = formData.get("step3Title") as string;
  const step3Desc = formData.get("step3Desc") as string;
  const step3TitleBn = (formData.get("step3TitleBn") as string) || undefined;
  const step3DescBn = (formData.get("step3DescBn") as string) || undefined;

  const step4Title = formData.get("step4Title") as string;
  const step4Desc = formData.get("step4Desc") as string;
  const step4TitleBn = (formData.get("step4TitleBn") as string) || undefined;
  const step4DescBn = (formData.get("step4DescBn") as string) || undefined;

  const processSteps = (step1Title && step2Title && step3Title && step4Title) ? [
    { title: step1Title, desc: step1Desc, titleBn: step1TitleBn, descBn: step1DescBn },
    { title: step2Title, desc: step2Desc, titleBn: step2TitleBn, descBn: step2DescBn },
    { title: step3Title, desc: step3Desc, titleBn: step3TitleBn, descBn: step3DescBn },
    { title: step4Title, desc: step4Desc, titleBn: step4TitleBn, descBn: step4DescBn },
  ] : undefined;

  const closingCtaHeadline = formData.get("closingCtaHeadline") as string;
  const closingCtaHeadlineBn = (formData.get("closingCtaHeadlineBn") as string) || undefined;
  const closingCtaSubheadline = formData.get("closingCtaSubheadline") as string;
  const closingCtaSubheadlineBn = (formData.get("closingCtaSubheadlineBn") as string) || undefined;
  const aboutHeadline = formData.get("aboutHeadline") as string;
  const aboutHeadlineBn = (formData.get("aboutHeadlineBn") as string) || undefined;
  const aboutBody = formData.get("aboutBody") as string;
  const aboutBodyBn = (formData.get("aboutBodyBn") as string) || undefined;

  await updateSiteSettings({
    companyName,
    phone,
    phoneDisplay,
    whatsapp,
    whatsappDisplay,
    email,
    address,
    addressBn,
    hours,
    hoursBn,
    heroHeadline,
    heroHeadlineBn,
    heroSubheadline,
    heroSubheadlineBn,
    heroPrimaryCta,
    heroPrimaryCtaBn,
    heroSecondaryCta,
    heroSecondaryCtaBn,
    processHeadline,
    processHeadlineBn,
    processSubheadline,
    processSubheadlineBn,
    ...(processSteps ? { processSteps } : {}),
    closingCtaHeadline,
    closingCtaHeadlineBn,
    closingCtaSubheadline,
    closingCtaSubheadlineBn,
    aboutHeadline,
    aboutHeadlineBn,
    aboutBody,
    aboutBodyBn,
  });

  revalidatePublic("/");
  revalidatePublic("/bn");
  revalidatePublic("/admin/settings");
  revalidatePublic("/about");
  revalidatePublic("/bn/about");
  revalidatePublic("/contact");
  revalidatePublic("/bn/contact");
  revalidatePublic("/products");
  revalidatePublic("/bn/products");
}

export default async function AdminSettingsPage() {
  const [settings, publicReviewsEnabled] = await Promise.all([
    getSiteSettings(),
    isPublicReviewsEnabled(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111311] tracking-tight">
            Site & Company Settings
          </h1>
          <p className="text-xs text-[#5C605C]">
            Configure commercial contact channels, marketing copy, and custom CTAs
          </p>
        </div>

        <Link
          href="/admin/settings/password"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#111311] hover:bg-[#222622] text-[#CEF23E] text-xs font-semibold tracking-tight shadow-sm transition-colors w-fit"
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Change Password</span>
        </Link>
      </div>

      <div className="p-8 rounded-[36px] bg-white border border-[#DDE1DC] shadow-sm max-w-4xl">
        <SettingsFormClient
          settings={settings}
          publicReviewsEnabled={publicReviewsEnabled}
          saveAction={saveSettingsAction}
        />
      </div>
    </div>
  );
}
