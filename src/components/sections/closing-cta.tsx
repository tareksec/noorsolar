"use client";

import React, { useActionState, useState } from "react";
import Image from "next/image";
import { submitQuoteRequest, QuoteActionResult } from "@/app/actions/quote";
import { MessageCircle, CheckCircle, Send, AlertCircle, Phone } from "lucide-react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { PhotoReveal } from "@/components/ui/photo-reveal";
import { prefersReducedMotion } from "@/lib/motion";
import { useLocale } from "next-intl";

interface ClosingCTAProps {
  phoneDisplay: string; whatsappNumber: string; headline?: string; subheadline?: string;
  selectedProduct?: { id: string; name: string; slug: string };
}
const initialState: QuoteActionResult = { success: false };
const fields = [
  { name: "name", label: "Your name", type: "text", placeholder: "Contact person", required: true, autoComplete: "name", max: 100 },
  { name: "phone", label: "Phone number", type: "tel", placeholder: "+880 or local mobile number", required: true, autoComplete: "tel", max: 20 },
  { name: "company", label: "Company", type: "text", placeholder: "Company or project name", autoComplete: "organization", max: 120 },
  { name: "email", label: "Email", type: "email", placeholder: "you@company.com", autoComplete: "email", max: 254 },
  { name: "quantity", label: "Quantity", type: "text", placeholder: "e.g. 100 panels or 50 kW", autoComplete: "off", max: 100 },
  { name: "location", label: "Delivery location", type: "text", placeholder: "City or district", autoComplete: "address-level2", max: 150 },
];

const initialState: QuoteActionResult = {
  success: false,
};

export function ClosingCTA({
  phoneDisplay = "+880 1700-000000",
  whatsappNumber = "8801700000000",
  selectedProduct,
  headline,
  subheadline,
}: ClosingCTAProps) {
  let locale = "en";
  try {
    const l = useLocale();
    if (l) locale = l;
  } catch {
    // fallback if outside NextIntlClientProvider
  }
  const isBn = locale === "bn";

  const resolvedHeadline =
    headline ||
    (isBn
      ? "অর্ডার দিতে অথবা কনটেইনার পাইকারি মূল্য জানতে চান?"
      : "Ready to Order or Inquire About Container Pricing?");

  const resolvedSubheadline =
    subheadline ||
    (isBn
      ? "নিচে আপনার প্রকল্পের বিবরণ অথবা কাঙ্ক্ষিত পণ্যের সংখ্যা লিখে পাঠান। আমাদের সেলস ইঞ্জিনিয়াররা অফিস চলাকালীন দ্রুত আনুষ্ঠানিক কোটেশন পাঠাবেন।"
      : "Submit your project specifications or required equipment quantity below. Our commercial sales engineers respond with formal quotations within working hours.");

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
    isBn
      ? `নূর সোলার এনার্জি, আমি আপনাদের ওয়েবসাইটে একটি কোটেশন রিকোয়েস্ট পাঠিয়েছি। আমার ফোন নম্বর: ${phoneVal}।`
      : `Hello Noor Solar Energy, I just submitted a quotation request through your website. My phone number is ${phoneVal}.`
  )}`;

  return (
    <section id="quote-section" className="py-24 bg-[#EDEDED] border-t border-[#DDE1DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Summary & Contact Quick Links */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#DDE1DC] text-xs font-mono text-[#111311] mb-4">
              <span className="w-2 h-2 rounded-full bg-[#CEF23E]"></span>
              <span>{isBn ? "দ্রুত পাইকারি কোটেশন" : "Fast Wholesale Quotations"}</span>
            </div>

            <h2
              className="closing-headline-anim text-3xl sm:text-4xl font-bold tracking-tight text-[#111311] leading-tight mb-4 will-change-transform"
              data-motion="closing-headline"
            >
              {resolvedHeadline}
            </h2>

            <p className="text-sm sm:text-base text-[#5C605C] leading-relaxed mb-8">
              {resolvedSubheadline}
            </p>

            <div className="p-6 rounded-3xl bg-white border border-[#DDE1DC] space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#111311] text-[#CEF23E] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase text-[#5C605C] block">
                    {isBn ? "সরাসরি সেলস ডেস্ক" : "Direct Sales Desk"}
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
                    {isBn ? "তাৎক্ষণিক হোয়াটসঅ্যাপ" : "Instant WhatsApp"}
                  </span>
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-bold font-mono text-[#111311] hover:underline"
                  >
                    {isBn ? "ইঞ্জিনিয়ারের সাথে কথা বলুন" : "Chat with an Engineer"}
                  </a>
                </div>
              </div>
            </div>

            <PhotoReveal className="relative aspect-16/9 w-full rounded-3xl overflow-hidden border border-[#DDE1DC] mt-6 shadow-sm bg-[#111311]">
              <Image
                src="/photos/cta-sunset-panels.webp"
                alt={isBn ? "সূর্যাস্তের আলোয় সোলার প্যানেল অ্যারে" : "Solar panel array against sunset sky"}
                fill
                sizes="(max-width: 1024px) 100vw, 450px"
                className="object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111311]/85 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3.5 left-4 right-4 text-white pointer-events-none">
                <span className="text-[11px] font-mono text-[#CEF23E] font-semibold block">
                  {isBn ? "বাণিজ্যিক আমদানি ও সরবরাহ" : "Commercial Indents & Supply"}
                </span>
                <span className="text-xs text-white/90 leading-tight block mt-0.5">
                  {isBn ? "বাংলাদেশের ৬৪টি জেলায় নির্ভরযোগ্য ডেলিভারি" : "Reliable dispatch across all 64 districts in Bangladesh"}
                </span>
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
                      {isBn ? "কোটেশন রিকোয়েস্ট জমা হয়েছে!" : "Quotation Request Received!"}
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
                      <span>{isBn ? "হোয়াটসঅ্যাপে যোগাযোগ করুন" : "Follow-up on WhatsApp"}</span>
                    </a>
                  </div>
                </div>
              ) : (
                <form action={formAction} className="space-y-4">
                  <input type="hidden" name="locale" value={locale} />
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
                        {isBn ? "পূর্ণ নাম / যোগাযোগকারীর নাম *" : "Full Name / Contact Person *"}
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder={isBn ? "যেমন: প্রকৌশলী রফিকুল ইসলাম" : "e.g. Engr. Rafiqul Islam"}
                        className="w-full px-4 py-3 rounded-2xl bg-[#EDEDED] border border-transparent focus:border-[#111311] focus:bg-white text-xs sm:text-sm text-[#111311] placeholder:text-[#8A8F8A] outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
                        {isBn ? "ফোন / মোবাইল নম্বর *" : "Phone / Mobile Number *"}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={phoneVal}
                        onChange={(e) => setPhoneVal(e.target.value)}
                        placeholder={isBn ? "+880 17... অথবা 017..." : "+880 17... or 017..."}
                        className="w-full px-4 py-3 rounded-2xl bg-[#EDEDED] border border-transparent focus:border-[#111311] focus:bg-white text-xs sm:text-sm text-[#111311] placeholder:text-[#8A8F8A] outline-none transition-colors font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
                        {isBn ? "প্রতিষ্ঠান / প্রকল্পের নাম" : "Company / Project Name"}
                      </label>
                      <input
                        type="text"
                        name="company"
                        placeholder={isBn ? "যেমন: ঢাকা সোলার ইপিসি লিমিটেড" : "e.g. Dhaka Solar EPC Ltd."}
                        className="w-full px-4 py-3 rounded-2xl bg-[#EDEDED] border border-transparent focus:border-[#111311] focus:bg-white text-xs sm:text-sm text-[#111311] placeholder:text-[#8A8F8A] outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
                        {isBn ? "ইমেইল অ্যাড্রেস" : "Email Address"}
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
                        {isBn ? "আনুমানিক পরিমাণ বা ক্ষমতা" : "Estimated Volume / Quantity"}
                      </label>
                      <input
                        type="text"
                        name="quantity"
                        placeholder={isBn ? "যেমন: ৫০০ পিস বা ১০০ kW প্রজেক্ট" : "e.g. 500 pcs or 100 kW project"}
                        className="w-full px-4 py-3 rounded-2xl bg-[#EDEDED] border border-transparent focus:border-[#111311] focus:bg-white text-xs sm:text-sm text-[#111311] placeholder:text-[#8A8F8A] outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
                        {isBn ? "ডেলিভারি লোকেশন / জেলা" : "Delivery Site / District"}
                      </label>
                      <input
                        type="text"
                        name="location"
                        placeholder={isBn ? "যেমন: গাজীপুর, চট্টগ্রাম, ঢাকা" : "e.g. Gazipur, Chittagong, Dhaka"}
                        className="w-full px-4 py-3 rounded-2xl bg-[#EDEDED] border border-transparent focus:border-[#111311] focus:bg-white text-xs sm:text-sm text-[#111311] placeholder:text-[#8A8F8A] outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
                      {isBn ? "প্রয়োজনীয় বিবরণ বা বিশেষ নোট" : "Technical Requirements or Message"}
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      placeholder={
                        isBn
                          ? "মডেল নম্বর, কাঙ্ক্ষিত স্পেসিফিকেশন বা প্রকল্পের সময়সীমা উল্লেখ করুন..."
                          : "Specify model numbers, target specs, or project timeline..."
                      }
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
                        <span>{isBn ? "কোটেশন পাঠানো হচ্ছে..." : "Submitting Request..."}</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>{isBn ? "পাইকারি কোটেশন চান" : "Submit Wholesale Quote Request"}</span>
                        </>
                      )}
                    </button>
                  </MagneticButton>

                  <p className="text-center text-[11px] font-mono text-[#5C605C] pt-2">
                    {isBn
                      ? "সম্পূর্ণ কারিগরি ডেটাশিট সহ সরাসরি B2B আমদানিকারক মূল্য"
                      : "Direct B2B importer pricing with complete technical datasheets"}
                  </p>
                </form>
              )}

            </div>
          </div>

        </div>
        <div className="quote-card">
          {state.success ? (
            <div className="quote-success" ref={resultRef} tabIndex={-1} role="status">
              <span className="inline-flex rounded-full bg-[#CEF23E] p-4"><Check size={28} /></span>
              <h3>Request received.</h3><p>{state.message}</p>
              <a href={whatsapp + "?text=" + encodeURIComponent("Hello, I submitted a quote request on your website. My phone number is " + phone + ".")} target="_blank" rel="noreferrer" className="button button-dark">Follow up on WhatsApp <ArrowUpRight size={16} /></a>
            </div>
          ) : (
            <form action={action} aria-label="Request a quote" aria-busy={pending}>
              <div className="flex items-center justify-between gap-3 mb-6"><h3 className="text-xl font-semibold tracking-tight">Request a quote</h3><span className="text-xs text-[#5C605C]">* Required</span></div>
              {selectedProduct && <div className="quote-selected"><span>You're enquiring about</span><strong>{selectedProduct.name}</strong><Link href={"/product/" + selectedProduct.slug}>View specifications</Link><input type="hidden" name="productId" value={selectedProduct.id} /></div>}
              {state.error && <div ref={resultRef} tabIndex={-1} role="alert" className="p-4 mb-5 rounded-xl bg-red-50 text-red-800 text-sm">{state.error}</div>}
              <input type="text" name="website_hp" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
              <div className="quote-fields">{fields.map(field => {
                const error = state.errors?.[field.name]?.[0];
                return <label key={field.name} className="quote-field" htmlFor={prefix + field.name}>
                  <span>{field.label}{field.required ? " *" : ""}</span>
                  <input id={prefix + field.name} name={field.name} type={field.type} required={field.required} maxLength={field.max}
                    autoComplete={field.autoComplete} placeholder={field.placeholder} aria-invalid={!!error} aria-describedby={error ? prefix + field.name + "-error" : undefined}
                    onChange={field.name === "phone" ? e => setPhone(e.target.value) : undefined} />
                  {error && <span id={prefix + field.name + "-error"} className="field-error">{error}</span>}
                </label>;
              })}</div>
              <label className="quote-field mt-5" htmlFor={prefix + "message"}><span>Equipment or project requirements</span><textarea id={prefix + "message"} name="message" rows={3} maxLength={1000} placeholder="Models, quantities, target specifications or questions…" aria-invalid={!!state.errors?.message} />{state.errors?.message && <span className="field-error">{state.errors.message[0]}</span>}</label>
              <button type="submit" disabled={pending} className="button button-lime w-full mt-6">{pending ? "Sending your request…" : "Send quote request"}<ArrowUpRight size={17} /></button>
              <p className="text-center text-xs text-[#5C605C] leading-relaxed mt-4">An enquiry only. Pricing and order terms are confirmed with you.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

