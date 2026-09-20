"use client";

import React, { useState } from "react";
import { SiteConfig } from "@/lib/site-config";

interface SettingsFormClientProps {
  settings: SiteConfig;
  publicReviewsEnabled: boolean;
  saveAction: (formData: FormData) => Promise<void>;
}

export function SettingsFormClient({
  settings,
  publicReviewsEnabled,
  saveAction,
}: SettingsFormClientProps) {
  const [langTab, setLangTab] = useState<"en" | "bn">("en");

  const bnMissing = !(
    settings.heroHeadlineBn?.trim() &&
    settings.processHeadlineBn?.trim() &&
    settings.closingCtaHeadlineBn?.trim() &&
    settings.aboutHeadlineBn?.trim()
  );

  return (
    <form action={saveAction} className="space-y-6">
      {/* General Company & Contact Details */}
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

      {/* Language Toggle Bar */}
      <div className="pt-4 border-t border-[#EDEDED] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-medium text-[#5C605C]">
            Content Language:
          </span>
          <div className="inline-flex items-center p-1 rounded-2xl bg-[#EDEDED] border border-[#DDE1DC] text-xs font-semibold">
            <button
              type="button"
              onClick={() => setLangTab("en")}
              className={`px-3.5 py-1.5 rounded-xl transition-colors ${
                langTab === "en"
                  ? "bg-white text-[#111311] shadow-xs"
                  : "text-[#5C605C] hover:text-[#111311]"
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLangTab("bn")}
              className={`px-3.5 py-1.5 rounded-xl transition-colors ${
                langTab === "bn"
                  ? "bg-[#111311] text-[#CEF23E] shadow-xs"
                  : "text-[#5C605C] hover:text-[#111311]"
              }`}
            >
              বাংলা
            </button>
          </div>
        </div>

        <div>
          {bnMissing ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-amber-50 text-amber-700 border border-amber-200">
              BN missing
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              BN ✓
            </span>
          )}
        </div>
      </div>

      {/* Address and Hours */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
            Commercial Office / Warehouse Address {langTab === "bn" ? "(বাংলা)" : "(EN)"}
          </label>
          <div className={langTab === "en" ? "" : "hidden"}>
            <input
              type="text"
              name="address"
              defaultValue={settings.address}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
            />
          </div>
          <div className={langTab === "bn" ? "" : "hidden"}>
            <input
              type="text"
              name="addressBn"
              lang="bn"
              defaultValue={settings.addressBn || ""}
              placeholder="বাণিজ্যিক কার্যালয়ের ঠিকানা (বাংলা)"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
            Operating / Delivery Hours {langTab === "bn" ? "(বাংলা)" : "(EN)"}
          </label>
          <div className={langTab === "en" ? "" : "hidden"}>
            <input
              type="text"
              name="hours"
              defaultValue={settings.hours}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
            />
          </div>
          <div className={langTab === "bn" ? "" : "hidden"}>
            <input
              type="text"
              name="hoursBn"
              lang="bn"
              defaultValue={settings.hoursBn || ""}
              placeholder="কার্যসময় ও ডেলিভারি সময় (বাংলা)"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="pt-4 border-t border-[#EDEDED]">
        <h2 className="text-mg font-bold text-[#111311] mb-4">Hero Section Configuration</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
              Hero Headline {langTab === "bn" ? "(বাংলা)" : "(EN)"}
            </label>
            <div className={langTab === "en" ? "" : "hidden"}>
              <input
                type="text"
                name="heroHeadline"
                defaultValue={settings.heroHeadline}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none font-bold"
              />
            </div>
            <div className={langTab === "bn" ? "" : "hidden"}>
              <input
                type="text"
                name="heroHeadlineBn"
                lang="bn"
                defaultValue={settings.heroHeadlineBn || ""}
                placeholder="হিরো শিরোনাম (বাংলা)"
                className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
              Hero Sub-headline {langTab === "bn" ? "(বাংলা)" : "(EN)"}
            </label>
            <div className={langTab === "en" ? "" : "hidden"}>
              <textarea
                name="heroSubheadline"
                rows={2}
                defaultValue={settings.heroSubheadline}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
              />
            </div>
            <div className={langTab === "bn" ? "" : "hidden"}>
              <textarea
                name="heroSubheadlineBn"
                lang="bn"
                rows={2}
                defaultValue={settings.heroSubheadlineBn || ""}
                placeholder="হিরো উপ-শিরোনাম (বাংলা)"
                className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
                Primary CTA Label {langTab === "bn" ? "(বাংলা)" : "(EN)"}
              </label>
              <div className={langTab === "en" ? "" : "hidden"}>
                <input
                  type="text"
                  name="heroPrimaryCta"
                  defaultValue={settings.heroPrimaryCta || "Request Quote"}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
                />
              </div>
              <div className={langTab === "bn" ? "" : "hidden"}>
                <input
                  type="text"
                  name="heroPrimaryCtaBn"
                  lang="bn"
                  defaultValue={settings.heroPrimaryCtaBn || ""}
                  placeholder="উদ্ধৃতি অনুরোধ করুন"
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
                Secondary CTA Label {langTab === "bn" ? "(বাংলা)" : "(EN)"}
              </label>
              <div className={langTab === "en" ? "" : "hidden"}>
                <input
                  type="text"
                  name="heroSecondaryCta"
                  defaultValue={settings.heroSecondaryCta || "Browse Products"}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
                />
              </div>
              <div className={langTab === "bn" ? "" : "hidden"}>
                <input
                  type="text"
                  name="heroSecondaryCtaBn"
                  lang="bn"
                  defaultValue={settings.heroSecondaryCtaBn || ""}
                  placeholder="পণ্য ব্রাউজ করুন"
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="pt-4 border-t border-[#EDEDED]">
        <h2 className="text-mg font-bold text-[#111311] mb-4">
          Process Section Configuration (How Ordering Works)
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
              Process Headline {langTab === "bn" ? "(বাংলা)" : "(EN)"}
            </label>
            <div className={langTab === "en" ? "" : "hidden"}>
              <input
                type="text"
                name="processHeadline"
                defaultValue={settings.processHeadline || "Order in four simple steps"}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none font-bold"
              />
            </div>
            <div className={langTab === "bn" ? "" : "hidden"}>
              <input
                type="text"
                name="processHeadlineBn"
                lang="bn"
                defaultValue={settings.processHeadlineBn || ""}
                placeholder="চারটি সহজ ধাপে অর্ডার করুন"
                className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
              Process Sub-headline {langTab === "bn" ? "(বাংলা)" : "(EN)"}
            </label>
            <div className={langTab === "en" ? "" : "hidden"}>
              <textarea
                name="processSubheadline"
                defaultValue={
                  settings.processSubheadline ||
                  "A straightforward procurement workflow engineered for commercial contractors, installers, and B2B buyers across Bangladesh."
                }
                rows={2}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
              />
            </div>
            <div className={langTab === "bn" ? "" : "hidden"}>
              <textarea
                name="processSubheadlineBn"
                lang="bn"
                defaultValue={settings.processSubheadlineBn || ""}
                placeholder="প্রক্রিয়ার বিবরণ (বাংলা)"
                rows={2}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
              />
            </div>
          </div>

          {/* 4 Process Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {[
              {
                num: 1,
                defTitle: "Request a quote",
                defDesc:
                  "Tell us the products and quantity you need. Send the form, call us or message us on WhatsApp.",
              },
              {
                num: 2,
                defTitle: "Confirm specifications",
                defDesc:
                  "Our team checks the datasheets and matches the right models and quantities to your project.",
              },
              {
                num: 3,
                defTitle: "Receive your quotation",
                defDesc:
                  "Get a formal quotation with pricing and terms for your order.",
              },
              {
                num: 4,
                defTitle: "Confirm and arrange delivery",
                defDesc:
                  "Confirm the order and we coordinate delivery. Contact sales for current schedules.",
              },
            ].map(({ num, defTitle, defDesc }) => {
              const stepData = settings.processSteps?.[num - 1];
              return (
                <div
                  key={num}
                  className="p-3.5 rounded-2xl bg-white border border-[#DDE1DC] space-y-2.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#111311] text-[#CEF23E] font-mono text-xs font-bold flex items-center justify-center">
                      0{num}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#111311]">
                      Step {num} {langTab === "bn" ? "(বাংলা)" : "(EN)"}
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-[#5C605C] mb-1">
                      Title
                    </label>
                    <div className={langTab === "en" ? "" : "hidden"}>
                      <input
                        type="text"
                        name={`step${num}Title`}
                        defaultValue={stepData?.title || defTitle}
                        className="w-full px-3 py-1.5 rounded-xl bg-[#EDEDED] text-xs text-[#111311] outline-none font-semibold"
                      />
                    </div>
                    <div className={langTab === "bn" ? "" : "hidden"}>
                      <input
                        type="text"
                        name={`step${num}TitleBn`}
                        lang="bn"
                        defaultValue={stepData?.titleBn || ""}
                        placeholder={`ধাপ ${num} শিরোনাম`}
                        className="w-full px-3 py-1.5 rounded-xl bg-[#EDEDED] text-xs text-[#111311] outline-none font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-[#5C605C] mb-1">
                      Description
                    </label>
                    <div className={langTab === "en" ? "" : "hidden"}>
                      <textarea
                        name={`step${num}Desc`}
                        defaultValue={stepData?.desc || defDesc}
                        rows={2}
                        className="w-full px-3 py-1.5 rounded-xl bg-[#EDEDED] text-xs text-[#111311] outline-none"
                      />
                    </div>
                    <div className={langTab === "bn" ? "" : "hidden"}>
                      <textarea
                        name={`step${num}DescBn`}
                        lang="bn"
                        defaultValue={stepData?.descBn || ""}
                        placeholder={`ধাপ ${num} বিবরণ`}
                        rows={2}
                        className="w-full px-3 py-1.5 rounded-xl bg-[#EDEDED] text-xs text-[#111311] outline-none"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Closing CTA */}
      <div className="pt-4 border-t border-[#EDEDED]">
        <h2 className="text-mg font-bold text-[#111311] mb-4">Closing CTA Configuration</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
              Closing CTA Headline {langTab === "bn" ? "(বাংলা)" : "(EN)"}
            </label>
            <div className={langTab === "en" ? "" : "hidden"}>
              <input
                type="text"
                name="closingCtaHeadline"
                defaultValue={
                  settings.closingCtaHeadline ||
                  "Ready to Order or Inquire About Container Pricing?"
                }
                className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none font-bold"
              />
            </div>
            <div className={langTab === "bn" ? "" : "hidden"}>
              <input
                type="text"
                name="closingCtaHeadlineBn"
                lang="bn"
                defaultValue={settings.closingCtaHeadlineBn || ""}
                placeholder="ক্লোজিং শিরোনাম (বাংলা)"
                className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
              Closing CTA Sub-headline {langTab === "bn" ? "(বাংলা)" : "(EN)"}
            </label>
            <div className={langTab === "en" ? "" : "hidden"}>
              <textarea
                name="closingCtaSubheadline"
                rows={2}
                defaultValue={
                  settings.closingCtaSubheadline ||
                  "Submit your project specifications or required equipment quantity below. Our commercial sales engineers respond with formal quotations within working hours."
                }
                className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
              />
            </div>
            <div className={langTab === "bn" ? "" : "hidden"}>
              <textarea
                name="closingCtaSubheadlineBn"
                lang="bn"
                rows={2}
                defaultValue={settings.closingCtaSubheadlineBn || ""}
                placeholder="ক্লোজিং উপ-শিরোনাম (বাংলা)"
                className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* About Page Copy */}
      <div className="pt-4 border-t border-[#EDEDED]">
        <h2 className="text-mg font-bold text-[#111311] mb-4">About Page Copy</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
              About Page Headline {langTab === "bn" ? "(বাংলা)" : "(EN)"}
            </label>
            <div className={langTab === "en" ? "" : "hidden"}>
              <input
                type="text"
                name="aboutHeadline"
                defaultValue={
                  settings.aboutHeadline || "Engineering-Grade Solar Equipment for Bangladesh ."
                }
                className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none font-bold"
              />
            </div>
            <div className={langTab === "bn" ? "" : "hidden"}>
              <input
                type="text"
                name="aboutHeadlineBn"
                lang="bn"
                defaultValue={settings.aboutHeadlineBn || ""}
                placeholder="আমাদের সম্পর্কে শিরোনাম (বাংলা)"
                className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
              About Page Company Summary {langTab === "bn" ? "(বাংলা)" : "(EN)"}
            </label>
            <div className={langTab === "en" ? "" : "hidden"}>
              <textarea
                name="aboutBody"
                rows={3}
                defaultValue={settings.aboutBody || settings.description}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
              />
            </div>
            <div className={langTab === "bn" ? "" : "hidden"}>
              <textarea
                name="aboutBodyBn"
                lang="bn"
                rows={3}
                defaultValue={settings.aboutBodyBn || ""}
                placeholder="আমাদের সম্পর্কে বিবরণ (বাংলা)"
                className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Moderation */}
      <div className="pt-4 border-t border-[#EDEDED]">
        <h2 className="text-base font-bold text-[#111311] mb-2">
          Customer Reviews Moderation
        </h2>
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
  );
}
