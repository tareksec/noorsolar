import Link from "next/link";
import { KeyRound } from "lucide-react";
import React from "react";
import { getSiteSettings, updateSiteSettings } from "@/lib/data/settings";
import { isPublicReviewsEnabled, setPublicReviewsEnabled } from "@/lib/data/reviews";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";

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
  const hours = formData.get("hours") as string;
  const heroHeadline = formData.get("heroHeadline") as string;
  const heroSubheadline = formData.get("heroSubheadline") as string;
  const heroPrimaryCta = formData.get("heroPrimaryCta") as string;
  const heroSecondaryCta = formData.get("heroSecondaryCta") as string;
  const processHeadline = formData.get("processHeadline") as string;
  const processSubheadline = formData.get("processSubheadline") as string;
  const step1Title = formData.get("step1Title") as string;
  const step1Desc = formData.get("step1Desc") as string;
  const step2Title = formData.get("step2Title") as string;
  const step2Desc = formData.get("step2Desc") as string;
  const step3Title = formData.get("step3Title") as string;
  const step3Desc = formData.get("step3Desc") as string;
  const step4Title = formData.get("step4Title") as string;
  const step4Desc = formData.get("step4Desc") as string;

  const processSteps = (step1Title && step2Title && step3Title && step4Title) ? [
    { title: step1Title, desc: step1Desc },
    { title: step2Title, desc: step2Desc },
    { title: step3Title, desc: step3Desc },
    { title: step4Title, desc: step4Desc },
  ] : undefined;

  const closingCtaHeadline = formData.get("closingCtaHeadline") as string;
  const closingCtaSubheadline = formData.get("closingCtaSubheadline") as string;
  const aboutHeadline = formData.get("aboutHeadline") as string;
  const aboutBody = formData.get("aboutBody") as string;

  await updateSiteSettings({
    companyName,
    phone,
    phoneDisplay,
    whatsapp,
    whatsappDisplay,
    email,
    address,
    hours,
    heroHeadline,
    heroSubheadline,
    heroPrimaryCta,
    heroSecondaryCta,
    processHeadline,
    processSubheadline,
    ...(processSteps ? { processSteps } : {}),
    closingCtaHeadline,
    closingCtaSubheadline,
    aboutHeadline,
    aboutBody,
  });

  revalidatePath("/");
  revalidatePath("/admin/settings");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/products");
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
        <form action={saveSettingsAction} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
                Company Display Name
              </label>
              <input
                type="text"
                name="companyName"
                defaultValue={settings.companyName}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
                Commercial Email
              </label>
              <input
                type="email"
                name="email"
                defaultValue={settings.email}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
                Sales Phone (Display)
              </label>
              <input
                type="text"
                name="phoneDisplay"
                defaultValue={settings.phoneDisplay}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
                Phone (Tel Link raw)
              </label>
              <input
                type="text"
                name="phone"
                defaultValue={settings.phone}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
                WhatsApp (Display)
              </label>
              <input
                type="text"
                name="whatsappDisplay"
                defaultValue={settings.whatsappDisplay}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
                WhatsApp (Digits Only)
              </label>
              <input
                type="text"
                name="whatsapp"
                defaultValue={settings.whatsapp}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
                Commercial Office / Warehouse Address
              </label>
              <input
                type="text"
                name="address"
                defaultValue={settings.address}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
                Operating / Delivery Hours
              </label>
              <input
                type="text"
                name="hours"
                defaultValue={settings.hours}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#EDEDED]">
            <h2 className="text-mg font-bold text-[#111311] mb-4">Hero Section Configuration</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
                  Hero Headline
                </label>
                <input
                  type="text"
                  name="heroHeadline"
                  defaultValue={settings.heroHeadline}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
                  Hero Sub-headline
                </label>
                <textarea
                  name="heroSubheadline"
                  rows={2}
                  defaultValue={settings.heroSubheadline}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
                    Primary CTA Label
                  </label>
                  <input
                    type="text"
                    name="heroPrimaryCta"
                    defaultValue={settings.heroPrimaryCta || "Request Quote"}
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
                    Secondary CTA Label
                  </label>
                  <input
                    type="text"
                    name="heroSecondaryCta"
                    defaultValue={settings.heroSecondaryCta || "Browse Products"}
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#EDEDED]">
            <h2 className="text-mg font-bold text-[#111311] mb-4">Process Section Configuration (How Ordering Works)</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
                  Process Headline
                </label>
                <input
                  type="text"
                  name="processHeadline"
                  defaultValue={settings.processHeadline || "Order in four simple steps"}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
                  Process Sub-headline
                </label>
                <textarea
                  name="processSubheadline"
                  defaultValue={settings.processSubheadline || "A straightforward procurement workflow engineered for commercial contractors, installers, and B2B buyers across Bangladesh."}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
                />
              </div>

              {/* 4 Process Steps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {[
                  { num: 1, defTitle: "Request a quote", defDesc: "Tell us the products and quantity you need. Send the form, call us or message us on WhatsApp." },
                  { num: 2, defTitle: "Confirm specifications", defDesc: "Our team checks the datasheets and matches the right models and quantities to your project." },
                  { num: 3, defTitle: "Receive your quotation", defDesc: "Get a formal quotation with pricing and terms for your order." },
                  { num: 4, defTitle: "Confirm and arrange delivery", defDesc: "Confirm the order and we coordinate delivery. Contact sales for current schedules." },
                ].map(({ num, defTitle, defDesc }) => {
                  const stepData = settings.processSteps?.[num - 1];
                  return (
                    <div key={num} className="p-3.5 rounded-2xl bg-white border border-[#DDE1DC] space-y-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#111311] text-[#CEF23E] font-mono text-xs font-bold flex items-center justify-center">
                          0{num}
                        </span>
                        <span className="text-xs font-mono font-bold text-[#111311]">Step {num}</span>
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-[#5C605C] mb-1">Title</label>
                        <input
                          type="text"
                          name={`step${num}Title`}
                          defaultValue={stepData?.title || defTitle}
                          className="w-full px-3 py-1.5 rounded-xl bg-[#EDEDED] text-xs text-[#111311] outline-none font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-[#5C605C] mb-1">Description</label>
                        <textarea
                          name={`step${num}Desc`}
                          defaultValue={stepData?.desc || defDesc}
                          rows={2}
                          className="w-full px-3 py-1.5 rounded-xl bg-[#EDEDED] text-xs text-[#111311] outline-none"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#EDEDED]">
            <h2 className="text-mg font-bold text-[#111311] mb-4">Closing CTA  Configuration</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
                  Closing CTA Headline
                </label>
                <input
                  type="text"
                  name="closingCtaHeadline"
                  defaultValue={settings.closingCtaHeadline || "Ready to Order or Inquire About Container Pricing?"}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
                  Closing CTA Sub-headline
                </label>
                <textarea
                  name="closingCtaSubheadline"
                  rows={2}
                  defaultValue={settings.closingCtaSubheadline || "Submit your project specifications or required equipment quantity below. Our commercial sales engineers respond with formal quotations within working hours."}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#EDEDED]">
            <h2 className="text-mg font-bold text-[#111311] mb-4">About Page Copy</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
                  About Page Headline
                </label>
                <input
                  type="text"
                  name="aboutHeadline"
                  defaultValue={settings.aboutHeadline || "Engineering-Grade Solar Equipment for Bangladesh ."}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
                  About Page Company Summary
                </label>
                <textarea
                  name="aboutBody"
                  rows={3}
                  defaultValue={settings.aboutBody || settings.description}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#EDEDED]">
            <h2 className="text-base font-bold text-[#111311] mb-2">Customer Reviews Moderation</h2>
            <p className="text-xs text-[#5C605C] mb-4">
              Control whether public visitors can submit product reviews on the catalog pages.
            </p>
            <label className="flex items-center gap-3 p-4 rounded-2xl bg-[#EDEDED]/50 border border-[#DDE1DC] cursor-pointer">
              <input
                type="checkbox"
                name="reviewsPublicEnabled"
                value="true"
                defaultChecked={publicReviewsEnabled}
                className="rounded text-[#111311] w-4 h-4 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-[#111311] block">
                  Enable Public Product Reviews Submission
                </span>
                <span className="text-[11px] text-[#5C605C] block">
                  When checked, visitors can submit ratings and reviews. Submissions are always held as PENDING until approved in the Admin Reviews panel.
                </span>
              </div>
            </label>
          </div>

          <div className="pt-4 border-t border-[#EDEDED]">
            <button
              type="submit"
              className="px-8 py-3.5 rounded-full bg-[#111311] hover:bg-[#222622] text-[#CEF23E] font-semibold text-xs tracking-tight transition-colors shadow-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
