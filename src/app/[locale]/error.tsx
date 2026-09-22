"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { RefreshCw, ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errorPage");

  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

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

        <span className="text-xs font-mono font-bold text-[#FEBE16] bg-[#052F25] px-3 py-1 rounded-full">
          ERROR
        </span>

        <h1 className="text-2xl font-bold text-[#074031] mt-4 mb-2">
          {t("title")}
        </h1>

        <p className="text-xs sm:text-sm text-[#62706A] leading-relaxed mb-8">
          {t("description")}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-full bg-[#FEBE16] text-[#052F25] text-xs font-bold hover:bg-[#E4A900] transition-colors shadow-sm cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t("tryAgain")}</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-full bg-[#F1F4F1] text-[#074031] text-xs font-semibold hover:bg-[#DCE4E0] transition-colors border border-[#DCE4E0]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t("backHome")}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
