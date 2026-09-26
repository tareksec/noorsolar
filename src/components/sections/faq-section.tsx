"use client";

import React, { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";

interface FAQItemLike {
  id?: string;
  question: string;
  answer: string;
}

interface FAQSectionProps {
  items: FAQItemLike[];
  locale?: string;
}

export function FAQSection({ items, locale }: FAQSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const isBn = locale === "bn" || (items?.[0]?.question ? /[\u0980-\u09FF]/.test(items[0].question) : false);

  if (!items || items.length === 0) {
    return null;
  }

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = (index + 1) % items.length;
      buttonRefs.current[nextIndex]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = (index - 1 + items.length) % items.length;
      buttonRefs.current[prevIndex]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      buttonRefs.current[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      buttonRefs.current[items.length - 1]?.focus();
    }
  };

  return (
    <section id="faq" className="py-20 bg-[#F1F4F1]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal y={20} duration={0.6}>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-[11px] font-mono text-[#17251F] mb-3 border border-[#DCE4E0]">
              <span className="w-2 h-2 rounded-full bg-[#FEBE16]"></span>
              <span>{isBn ? "সাধারণ প্রশ্নোত্তর" : "Commercial Inquiries"}</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-[#074031]">
              {isBn ? "সচরাচর জিজ্ঞাসিত প্রশ্ন" : "Frequently Asked Questions"}
            </h2>
          </div>
        </Reveal>

        <div data-motion="faq-accordion">
          <RevealGroup stagger={0.06} delay={0.1} className="space-y-3">
            {items.map((item, index) => {
              const isOpen = openIndex === index;
              const buttonId = `faq-btn-${index}`;
              const panelId = `faq-panel-${index}`;

              return (
                <RevealItem key={item.id || index} y={18}>
                  <div
                    className="rounded-2xl bg-white border border-[#DCE4E0] overflow-hidden transition-all duration-200 shadow-xs"
                  >
                    <button
                      ref={(el) => {
                        buttonRefs.current[index] = el;
                      }}
                      id={buttonId}
                      onClick={() => toggle(index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className="faq-item-button w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-bold text-[#17251F] hover:text-[#074031] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FEBE16] cursor-pointer"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                    >
                      <span className="pr-4">{item.question}</span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                          isOpen ? "bg-[#074031] text-white" : "bg-[#F1F4F1] text-[#074031]"
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={panelId}
                          role="region"
                          aria-labelledby={buttonId}
                          initial={shouldReduceMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                          transition={{
                            duration: shouldReduceMotion ? 0 : 0.28,
                            ease: [0.04, 0.62, 0.23, 0.98],
                          }}
                          className="faq-item-panel overflow-hidden"
                        >
                          <div className="px-5 pb-5 text-xs sm:text-sm text-[#62706A] leading-relaxed border-t border-[#DCE4E0] pt-3">
                            {item.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
