"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItemLike {
  id?: string;
  question: string;
  answer: string;
}

interface FAQSectionProps {
  items: FAQItemLike[];
}

export function FAQSection({ items }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!items || items.length === 0) {
    return null;
  }

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-[#E4E7E4]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-[11px] font-mono text-[#111311] mb-3 border border-[#DDE1DC]">
            <span className="w-2 h-2 rounded-full bg-[#CEF23E]"></span>
            <span>Commercial Inquiries</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[#111311]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.id || index}
                className="rounded-2xl bg-white border border-[#DDE1DC] overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-bold text-[#111311] hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CEF23E]"
                  aria-expanded={isOpen}
                >
                  <span className="pr-4">{item.question}</span>
                  <div
                    className={`w-7 h-7 rounded-full bg-[#EDEDED] flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-[#111311] text-white" : "text-[#111311]"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#5C605C] leading-relaxed border-t border-[#EDEDED] pt-3 animate-in fade-in duration-200">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}