import React from "react";
import { getSiteSettings, updateSiteSettings } from "@/lib/data/settings";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";

async function saveSettingsAction(formData: FormData) {
  "use server";
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
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
    closingCtaHeadline,
    closingCtaSubheadline,
    aboutHeadline,
    aboutBody,
  });

  revalidatePath("/");
  revalidatePath("/admin/settings");
  revalidatePath("/about");
  revalidatePath("/contact");
}

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2l-font-bold text-[#111311] tracking-tight">
          Site & Company Settings
        </h1>
        <p className="text-xs text-[#5C605C]">
          Configure commercial contact channels, marketing copy, and custom CTAs
        </p>
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
