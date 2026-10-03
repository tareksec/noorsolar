import React from "react";
import Image from "next/image";

interface FooterApprovalsProps {
  locale?: string;
  className?: string;
}

export function FooterApprovals({ locale, className = "" }: FooterApprovalsProps) {
  const isBn = locale === "bn";

  return (
    <section
      aria-label={isBn ? "অনুমোদন ও গ্রাহক মূল্যায়ন" : "Approvals & Customer Reviews"}
      className={`w-full rounded-[22px] border border-[#DCE4E0] bg-white px-5 py-4 shadow-[0_4px_20px_rgba(7,64,49,0.03)] sm:px-8 sm:py-5 ${className}`}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Left Column: APPROVALS */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#768E9D]">
            {isBn ? "অনুমোদন ও লাইসেন্স" : "APPROVALS"}
          </span>

          <div className="flex flex-wrap items-center gap-3.5 sm:gap-5">
            {/* 1. SREDA */}
            <a
              href="http://www.sreda.gov.bd"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center transition-all duration-200 hover:opacity-80 hover:scale-102"
              title="Sustainable and Renewable Energy Development Authority (SREDA), Bangladesh"
            >
              <Image
                src="/approvals/badge-sreda@2x.png"
                alt="SREDA - Sustainable and Renewable Energy Development Authority"
                width={132}
                height={50}
                className="h-8 sm:h-9 w-auto object-contain"
                priority
              />
            </a>

            {/* Vertical Divider */}
            <div className="hidden h-7 w-px bg-[#E2E8F0] sm:block" aria-hidden="true" />

            {/* 2. UNGM */}
            <a
              href="https://www.ungm.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center transition-all duration-200 hover:opacity-80 hover:scale-102"
              title="United Nations Global Marketplace (UNGM)"
            >
              <Image
                src="/approvals/badge-ungm@2x.png"
                alt="UNGM - United Nations Global Marketplace"
                width={126}
                height={50}
                className="h-8 sm:h-9 w-auto object-contain"
                priority
              />
            </a>

            {/* Vertical Divider */}
            <div className="hidden h-7 w-px bg-[#E2E8F0] sm:block" aria-hidden="true" />

            {/* 3. DNCC Trade License */}
            <div className="inline-flex items-center gap-2">
              <a
                href="https://dncc.gov.bd"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center transition-all duration-200 hover:opacity-80 hover:scale-105 shrink-0"
                title="Dhaka North City Corporation"
              >
                <Image
                  src="/approvals/badge-dncc@2x.png"
                  alt="Dhaka North City Corporation (DNCC)"
                  width={34}
                  height={50}
                  className="h-8 sm:h-9 w-auto object-contain"
                  priority
                />
              </a>
              <div className="text-xs sm:text-[13px] leading-tight select-all">
                <span className="font-bold text-[#17251F]">
                  {isBn ? "লাইসেন্স নং: " : "License No.: "}
                </span>
                <span className="font-mono font-medium text-[#4A647B] tracking-tight">
                  TRAD/DNCC/003068/2026
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: REVIEW US ON TRUSTPILOT */}
        <div className="flex flex-col gap-2 lg:items-end">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#768E9D]">
            {isBn ? "আমাদের রিভিউ দেখুন" : "REVIEW US ON"}
          </span>

          <a
            href="https://www.trustpilot.com/review/noorsolaren.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-1.5 transition-transform duration-200 hover:scale-102 lg:items-end"
            aria-label="Trustpilot 5 Star Rating"
          >
            {/* Trustpilot Brand & Star */}
            <div className="flex items-center gap-1.5">
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path
                  d="M17.227 16.67l2.19 6.742-7.413-5.388 5.223-1.354z"
                  fill="#005128"
                />
                <path
                  d="M24 9.31h-9.165L12.005.589l-2.84 8.723L0 9.3l7.422 5.397-2.84 8.714 7.422-5.388 4.583-3.326L24 9.311z"
                  fill="#00B67A"
                />
              </svg>
              <span className="font-sans text-xl font-bold tracking-tight text-[#191919] group-hover:text-[#00B67A] transition-colors">
                Trustpilot
              </span>
            </div>

            {/* 5 Green Rating Star Squares */}
            <div className="flex items-center gap-[2.5px]" aria-label="5 out of 5 stars">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-[2px] bg-[#00B67A] transition-colors group-hover:bg-[#009E69]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-white text-white"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                </div>
              ))}
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
