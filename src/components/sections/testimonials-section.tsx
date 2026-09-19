import React from "react";
import type { Testimonial } from "@prisma/client";
import { AppImage } from "@/components/ui/app-image";
import { Quote } from "lucide-react";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-[#E4E7E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-[11px] font-mono text-[#111311] mb-3 border border-[#DDE1DC]">
            <span className="w-2 h-2 rounded-full bg-[#CEF23E]"></span>
            <span>Commercial Feedback</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111311]">
            Procurement & Project Verification
          </h2>
          <p className="mt-3 text-sm text-[#5C605C] max-w-2xl mx-auto">
            Direct observations from project engineers, procurement officers, and solar installation contractors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl bg-white border border-[#DDE1DC] p-7 sm:p-8 shadow-xs hover:border-[#CEF23E]/80 transition-all flex flex-col justify-between relative group"
            >
              <div>
                <div className="w-9 h-9 rounded-full bg-[#EDEDED] flex items-center justify-center text-[#111311] mb-6 group-hover:bg-[#CEF23E] transition-colors">
                  <Quote className="w-4 h-4 fill-current" />
                </div>
                <p className="text-sm sm:text-base text-[#111311] font-medium leading-relaxed mb-6">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#EDEDED]">
                {item.photo ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-[#DDE1DC] shrink-0 relative bg-[#EDEDED]">
                    <AppImage
                      src={item.photo}
                      alt={item.authorName}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#EDEDED] border border-[#DDE1DC] flex items-center justify-center text-xs font-bold text-[#111311] shrink-0 font-mono">
                    {item.authorName.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-[#111311] truncate">
                    {item.authorName}
                  </h4>
                  {(item.authorRole || item.company) && (
                    <p className="text-xs font-mono text-[#5C605C] truncate">
                      {[item.authorRole, item.company].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}