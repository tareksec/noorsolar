import React from "react";
import type { Certification } from "@prisma/client";
import { AppImage } from "@/components/ui/app-image";
import { ShieldCheck } from "lucide-react";

interface CertificationsSectionProps {
  certifications: Certification[];
}

export function CertificationsSection({ certifications }: CertificationsSectionProps) {
  if (!certifications || certifications.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-[#E4E7E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-[11px] font-mono text-[#111311] mb-3 border border-[#DDE1DC]">
            <span className="w-2 h-2 rounded-full bg-[#CEF23E]"></span>
            <span>Compliance & Testing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111311]">
            Technical Certifications & Standards
          </h2>
          <p className="mt-3 text-sm text-[#5C605C] max-w-2xl mx-auto">
            All equipment batches adhere to standardized manufacturing protocols, electrical inspection criteria, and safety authorizations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="rounded-2xl bg-white border border-[#DDE1DC] p-6 shadow-xs hover:border-[#CEF23E]/80 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-14 h-14 rounded-xl bg-[#EDEDED] flex items-center justify-center mb-5 overflow-hidden relative border border-[#DDE1DC] shrink-0">
                  {cert.image ? (
                    <AppImage
                      src={cert.image}
                      alt={cert.name}
                      width={56}
                      height={56}
                      className="w-full h-full object-contain p-1.5"
                    />
                  ) : (
                    <ShieldCheck className="w-7 h-7 text-[#111311]" />
                  )}
                </div>
                <h3 className="text-base font-bold text-[#111311] group-hover:text-black mb-1">
                  {cert.name}
                </h3>
                {cert.issuer && (
                  <div className="text-xs font-mono text-[#5C605C] mb-3 font-medium">
                    {cert.issuer}
                  </div>
                )}
                {cert.description && (
                  <p className="text-xs text-[#5C605C] leading-relaxed">
                    {cert.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}