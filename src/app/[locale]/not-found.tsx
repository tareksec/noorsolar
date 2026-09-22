import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { NotFoundIllustration } from "@/components/illustrations/not-found-illustration";
import { getTranslations } from "next-intl/server";

export default async function LocaleNotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 py-16">
      <div className="max-w-md w-full p-8 sm:p-10 rounded-[36px] bg-white border border-[#DCE4E0] text-center shadow-xl">
        <Image
          src="/brand/logo-icon.png"
          alt="Noor Solar Energy"
          width={48}
          height={48}
          className="mx-auto mb-5 h-12 w-12 object-contain"
        />
        <NotFoundIllustration className="w-48 h-40 mx-auto mb-4" />

        <span className="text-xs font-mono font-bold text-[#052F25] bg-[#FEBE16] px-3 py-1 rounded-full">
          ERROR 404
        </span>

        <h1 className="text-2xl font-bold text-[#074031] mt-4 mb-2">
          {t("title")}
        </h1>

        <p className="text-xs sm:text-sm text-[#62706A] leading-relaxed mb-8">
          {t("description")}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-full bg-[#074031] text-white text-xs font-semibold hover:bg-[#0B513E] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t("backHome")}</span>
          </Link>

          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-full bg-[#FEBE16] hover:bg-[#E4A900] text-[#052F25] text-xs font-semibold transition-colors"
          >
            <span>{t("browseProducts")}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
