"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#E4E7E4] flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 sm:p-10 rounded-[36px] bg-white border border-[#DDE1DC] text-center shadow-xl">
        <Image
          src="/brand/logo-icon.png"
          alt="Noor Solar Energy"
          width={48}
          height={48}
          className="mx-auto mb-5 h-12 w-12 object-contain"
        />
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6 text-red-600">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <h1 className="text-2xl font-bold text-[#111311] mb-2">
          Something went wrong
        </h1>

        <p className="text-xs sm:text-sm text-[#5C605C] leading-relaxed mb-8">
          An unexpected error occurred while loading this view. Please try again or return home.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#111311] text-white text-xs font-semibold hover:bg-black transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#EDEDED] text-[#111311] text-xs font-semibold hover:bg-[#DDE1DC] transition-colors"
          >
            Home Page
          </Link>
        </div>
      </div>
    </div>
  );
}
