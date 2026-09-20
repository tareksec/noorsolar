"use client";

import React, { useActionState, useState } from "react";
import Image from "next/image";
import { submitQuoteRequest, QuoteActionResult } from "@/app/actions/quote";
import { MessageCircle, CheckCircle, Send, AlertCircle, Phone } from "lucide-react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { PhotoReveal } from "@/components/ui/photo-reveal";
import { prefersReducedMotion } from "@/lib/motion";

interface ClosingCTAProps {
  phoneDisplay?: string;
  whatsappNumber?: string;
  selectedProduct?: string;
  headline?: string;
  subheadline?: string;
}

const initialState: QuoteActionResult = {
  success: false,
};

export function ClosingCTA({
  phoneDisplay = "+880 1700-000000",
  whatsappNumber = "8801700000000",
  selectedProduct,
  headline = "Ready to Order or Inquire About Container Pricing?",
  subheadline = "Submit your project specifications or required equipment quantity below. Our commercial sales engineers respond with formal quotations within working hours.",
}: ClosingCTAProps) {
  const [state, formAction, isPending] = useActionState(submitQuoteRequest, initialState);
  const [phoneVal, setPhoneVal] = useState("");

  React.useEffect(() => {
    if (typeof window === "undefined" || prefersReducedMotion()) return;
    let ctx: { revert: () => void } | undefined;
    import("@/lib/gsap").then(({ gsap }) => {
      ctx = gsap.context(() => {
        gsap.from(".closing-headline-anim", {
          y: 28,
          opacity: 0,
          duration: 0.85,
          ease: "expo.out",
          scrollTrigger: {
            trigger: ".closing-headline-anim",
            start: "top 85%",
            once: true,
          },
        });
      });
    });
    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  const whatsappFollowupUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    `Hello Noor Solar Energy, I just submitted a quotation request through your website. My phone number is ${phoneVal}.`
  )}`;

  return (
    <section id="quote-section" className="py-24 bg-[#EDEDED] border-t border-[#DDE1DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Summary & Contact Quick Links */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#DDE1DC] text-xs font-mono text-[#111311] mb-4">
              <span className="w-2 h-2 rounded-full bg-[#CEF23E]"></span>
              <span>Fast Wholesale Quotations</span>
            </div>

            <h2
              className="closing-headline-anim text-3xl sm:text-4xl font-bold tracking-tight text-[#111311] leading-tight mb-4 will-change-transform"
              data-motion="closing-headline"
            >
              {headline}
            </h2>

            <p className="text-sm sm:text-base text-[#5C605C] leading-relaxed mb-8">
              {subheadline}
            </p>

            <div className="p-6 rounded-3xl bg-white border border-[#DDE1DC] space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#111311] text-[#CEF23E] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase text-[#5C605C] block">
                    Direct Sales Desk
                  </span>
                  <a href={`tel:${phoneDisplay}`} className="text-sm font-bold font-mono text-[#111311]">
                    {phoneDisplay}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-[#EDEDED]">
                <div className="w-10 h-10 rounded-full bg-[#CEF23E] text-[#111311] flex items-center justify-center shrink-0 font-bold">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase text-[#5C605C] block">
                    Instant WhatsApp
                  </span>
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-bold font-mono text-[#111311] hover:underline"
                  >
                    Chat with an Engineer
                  </a>
                </div>
              </div>
            </div>

            <PhotoReveal className="relative aspect-16/9 w-full rounded-3xl overflow-hidden border border-[#DDE1DC] mt-6 shadow-sm bg-[#111311]">
              <Image
                src="/photos/cta-sunset-panels.webp"
                alt="Solar panel array against sunset sky"
                fill
                sizes="(max-width: 1024px) 100vw, 450px"
                className="object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111311]/85 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3.5 left-4 right-4 text-white pointer-events-none">
                <span className="text-[11px] font-mono text-[#CEF23E] font-semibold block">Commercial Indents & Supply</span>
                <span className="text-xs text-white/90 leading-tight block mt-0.5">Reliable dispatch across all 64 districts in Bangladesh</span>
              </div>
            </PhotoReveal>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-10 rounded-[36px] bg-white border border-[#DDE1DC] shadow-[0_16px_36px_-10px_rgba(0,0,0,0.05)]">
              
              {state.success ? (
                <div className="py-8 flex flex-col items-center text-center space-y-5 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 rounded-full bg-[#CEF23E]/30 flex items-center justify-center text-[#111311]">
                    <CheckCircle className="w-8 h-8 text-[#111311]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#111311] tracking-tight">
                      Quotation Request Received!
                    </h3>
                    <p className="text-sm text-[#5C605C] max-w-md mt-2 leading-relaxed">
                      {state.message}
                    </p>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
                    <a
                      href={whatsappFollowupUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#111311] text-[#CEF23E] text-xs font-semibold hover:bg-black transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Follow-up on WhatsApp</span>
                    </a>
                  </div>
                </div>
              ) : (
                <form action={formAction} className="space-y-4">
                  {state.error && (
                    <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-xs text-red-800">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                      <span>{state.error}</span>
                    </div>
                  )}

                  {/* Honeypot field hidden from real humans */}
                  <input
                    type="text"
                    name="website_hp"
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    aria-hidden="true"
                  />

                  {selectedProduct && (
                    <input type="hidden" name="productId" value={selectedProduct} />
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
                        Full Name / Contact Person *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="e.g. Engr. Rafiqul Islam"
                        className="w-full px-4 py-3 rounded-2xl bg-[#EDEDED] border border-transparent focus:border-[#111311] focus:bg-white text-xs sm:text-sm text-[#111311] placeholder:text-[#8A8F8A] outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
                        Phone / Mobile Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={phoneVal}
                        onChange={(e) => setPhoneVal(e.target.value)}
                        placeholder="+880 17... or 017..."
                        className="w-full px-4 py-3 rounded-2xl bg-[#EDEDED] border border-transparent focus:border-[#111311] focus:bg-white text-xs sm:text-sm text-[#111311] placeholder:text-[#8A8F8A] outline-none transition-colors font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
                        Company / Project Name
                      </label>
                      <input
                        type="text"
                        name="company"
                        placeholder="e.g. Dhaka Solar EPC Ltd."
                        className="w-full px-4 py-3 rounded-2xl bg-[#EDEDED] border border-transparent focus:border-[#111311] focus:bg-white text-xs sm:text-sm text-[#111311] placeholder:text-[#8A8F8A] outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="procurement@company.com"
                        className="w-full px-4 py-3 rounded-2xl bg-[#EDEDED] border border-transparent focus:border-[#111311] focus:bg-white text-xs sm:text-sm text-[#111311] placeholder:text-[#8A8F8A] outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
                        Estimated Volume / Quantity
                      </label>
                      <input
                        type="text"
                        name="quantity"
                        placeholder="e.g. 500 pcs or 100 kW project"
                        className="w-full px-4 py-3 rounded-2xl bg-[#EDEDED] border border-transparent focus:border-[#111311] focus:bg-white text-xs sm:text-sm text-[#111311] placeholder:text-[#8A8F8A] outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
                        Delivery Site / District
                      </label>
                      <input
                        type="text"
                        name="location"
                        placeholder="e.g. Gazipur, Chittagong, Dhaka"
                        className="w-full px-4 py-3 rounded-2xl bg-[#EDEDED] border border-transparent focus:border-[#111311] focus:bg-white text-xs sm:text-sm text-[#111311] placeholder:text-[#8A8F8A] outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
                      Technical Requirements or Message
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      placeholder="Specify model numbers, target specs, or project timeline..."
                      className="w-full px-4 py-3 rounded-2xl bg-[#EDEDED] border border-transparent focus:border-[#111311] focus:bg-white text-xs sm:text-sm text-[#111311] placeholder:text-[#8A8F8A] outline-none transition-colors resize-none"
                    />
                  </div>

                  <MagneticButton dataMotion="magnetic-cta" className="w-full">
                    <button
                      type="submit"
                      id="btn-submit-quote"
                      disabled={isPending}
                      data-motion="button-slide"
                      className="btn-slide-fill w-full flex items-center justify-center gap-2 py-4 rounded-full bg-[#111311] text-[#CEF23E] font-semibold text-sm tracking-tight transition-all duration-200 active:scale-[0.99] disabled:opacity-60 shadow-lg cursor-pointer"
                    >
                      {isPending ? (
                        <span>Submitting Request...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Wholesale Quote Request</span>
                        </>
                      )}
                    </button>
                  </MagneticButton>

                  <p className="text-center text-[11px] font-mono text-[#5C605C] pt-2">
                    Direct B2B importer pricing with complete technical datasheets
                  </p>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}