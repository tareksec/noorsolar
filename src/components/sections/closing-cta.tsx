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
  phoneDisplay = "+880 1884-611888",
  whatsappNumber = "8801884611888",
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
      ? "প্রজেক্টের অর্ডার বা কন্টেইনারের পাইকারি মূল্য জানতে যোগাযোগ করুন"
      : "Ready to Order or Inquire About Container Pricing?");

  const resolvedSubheadline =
    subheadline ||
    (isBn
      ? "নিচে আপনার প্রজেক্টের স্পেসিফিকেশন বা প্রয়োজনীয় ইকুইপমেন্টের পরিমাণ লিখে পাঠান। আমাদের সেলস ইঞ্জিনিয়াররা কার্যদিবসে দ্রুত আনুষ্ঠানিক কোটেশন প্রদান করবেন।"
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
    <section id="quote-section" className="py-24 bg-[#F1F4F1] border-t border-[#DCE4E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Summary & Contact Quick Links */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#DCE4E0] text-xs font-mono text-[#17251F] mb-4">
              <span className="w-2 h-2 rounded-full bg-[#FEBE16]"></span>
              <span>{isBn ? "দ্রুত পাইকারি কোটেশন" : "Fast Wholesale Quotations"}</span>
            </div>

            <h2
              className="closing-headline-anim text-3xl sm:text-4xl font-bold tracking-tight text-[#074031] leading-tight mb-4 will-change-transform"
              data-motion="closing-headline"
            >
              {resolvedHeadline}
            </h2>

            <p className="text-sm sm:text-base text-[#62706A] leading-relaxed mb-8">
              {resolvedSubheadline}
            </p>

            <div className="p-6 rounded-3xl bg-white border border-[#DCE4E0] space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-[#074031] text-[#FEBE16] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase text-[#62706A] block">
                    {isBn ? "সরাসরি সেলস ডেস্ক" : "Direct Sales Desk"}
                  </span>
                  <a href={`tel:${phoneDisplay.replace(/[^0-9+]/g, "")}`} className="inline-flex items-center min-h-[44px] text-sm font-bold font-mono text-[#074031]">
                    {phoneDisplay}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-[#DCE4E0]">
                <div className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-[#FEBE16] text-[#052F25] flex items-center justify-center shrink-0 font-bold">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase text-[#62706A] block">
                    {isBn ? "তাৎক্ষণিক হোয়াটসঅ্যাপ" : "Instant WhatsApp"}
                  </span>
                  <a
                    href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center min-h-[44px] text-sm font-bold font-mono text-[#074031] hover:underline"
                  >
                    {isBn ? "সেলস ইঞ্জিনিয়ারের সাথে কথা বলুন" : "Chat with an Engineer"}
                  </a>
                </div>
              </div>
            </div>

            <PhotoReveal className="relative aspect-16/9 w-full rounded-3xl overflow-hidden border border-[#DCE4E0] mt-6 shadow-sm bg-[#052F25]">
              <Image
                src="/photos/cta-sunset-panels.webp"
                alt={isBn ? "সূর্যাস্তের আলোয় সোলার প্যানেল অ্যারে" : "Solar panel array against sunset sky"}
                fill
                sizes="(max-width: 1024px) 100vw, 450px"
                className="object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#052F25]/90 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3.5 left-4 right-4 text-white pointer-events-none">
                <span className="text-[11px] font-mono text-[#FEBE16] font-semibold block">
                  {isBn ? "বাণিজ্যিক আমদানি ও প্রজেক্ট সরবরাহ" : "Commercial Indents & Supply"}
                </span>
                <span className="text-xs text-white/90 leading-tight block mt-0.5">
                  {isBn ? "বাংলাদেশের ৬৪ জেলায় সরাসরি সাইট ডেলিভারি" : "Reliable dispatch across all 64 districts in Bangladesh"}
                </span>
              </div>
            </PhotoReveal>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-10 rounded-[36px] bg-white border border-[#DCE4E0] shadow-[0_16px_36px_-10px_rgba(7,64,49,0.06)]">
              
              {state.success ? (
                <div className="py-8 flex flex-col items-center text-center space-y-5 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 rounded-full bg-[#FEBE16]/20 flex items-center justify-center text-[#074031]">
                    <CheckCircle className="w-8 h-8 text-[#074031]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#074031] tracking-tight">
                      {isBn ? "কোটেশনের অনুরোধ সফলভাবে জমা হয়েছে!" : "Quotation Request Received!"}
                    </h3>
                    <p className="text-sm text-[#62706A] max-w-md mt-2 leading-relaxed">
                      {state.message}
                    </p>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
                    <a
                      href={whatsappFollowupUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#FEBE16] hover:bg-[#E4A900] text-[#052F25] text-xs font-bold transition-colors shadow-md"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{isBn ? "হোয়াটসঅ্যাপে দ্রুত ফলো-আপ করুন" : "Follow-up on WhatsApp"}</span>
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
                      <label className="block text-xs font-mono font-medium text-[#17251F] mb-1.5">
                        {isBn ? "নাম ও পদবি *" : "Full Name / Contact Person *"}
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        autoComplete="name"
                        placeholder={isBn ? "যেমন: ইঞ্জিনিয়ার রফিকুল ইসলাম" : "e.g. Engr. Rafiqul Islam"}
                        className="w-full px-4 py-3 rounded-2xl bg-[#F1F4F1] border border-transparent focus:border-[#074031] focus:bg-white text-base text-[#17251F] placeholder:text-[#62706A]/70 outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-medium text-[#17251F] mb-1.5">
                        {isBn ? "মোবাইল নম্বর *" : "Phone / Mobile Number *"}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        inputMode="tel"
                        autoComplete="tel"
                        value={phoneVal}
                        onChange={(e) => setPhoneVal(e.target.value)}
                        placeholder={isBn ? "+880 17... অথবা 017..." : "+880 17... or 017..."}
                        className="w-full px-4 py-3 rounded-2xl bg-[#F1F4F1] border border-transparent focus:border-[#074031] focus:bg-white text-base text-[#17251F] placeholder:text-[#62706A]/70 outline-none transition-colors font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-medium text-[#17251F] mb-1.5">
                        {isBn ? "প্রতিষ্ঠান বা প্রজেক্টের নাম" : "Company / Project Name"}
                      </label>
                      <input
                        type="text"
                        name="company"
                        autoComplete="organization"
                        placeholder={isBn ? "যেমন: সানরাইজ এনার্জি লিমিটেড" : "e.g. Dhaka Solar EPC Ltd."}
                        className="w-full px-4 py-3 rounded-2xl bg-[#F1F4F1] border border-transparent focus:border-[#074031] focus:bg-white text-base text-[#17251F] placeholder:text-[#62706A]/70 outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-medium text-[#17251F] mb-1.5">
                        {isBn ? "ব্যবসায়িক ইমেইল" : "Email Address"}
                      </label>
                      <input
                        type="email"
                        name="email"
                        inputMode="email"
                        autoComplete="email"
                        placeholder="procurement@company.com"
                        className="w-full px-4 py-3 rounded-2xl bg-[#F1F4F1] border border-transparent focus:border-[#074031] focus:bg-white text-base text-[#17251F] placeholder:text-[#62706A]/70 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-medium text-[#17251F] mb-1.5">
                        {isBn ? "প্রতিষ্ঠানের ধরন" : "Buyer Classification"}
                      </label>
                      <select
                        name="buyerType"
                        className="w-full px-4 py-3 rounded-2xl bg-[#F1F4F1] border border-transparent focus:border-[#074031] focus:bg-white text-base text-[#17251F] outline-none transition-colors"
                        defaultValue=""
                      >
                        <option value="">{isBn ? "ধরন নির্বাচন করুন..." : "Select buyer type..."}</option>
                        <option value="Solar EPC Contractor">{isBn ? "সোলার EPC ঠিকাদার" : "Solar EPC Contractor"}</option>
                        <option value="Commercial / Industrial Factory">{isBn ? "বাণিজ্যিক বা শিল্প প্রতিষ্ঠান (C&I)" : "Commercial & Industrial (C&I)"}</option>
                        <option value="Regional Solar Dealer">{isBn ? "আঞ্চলিক সোলার ডিলার বা রিসেলার" : "Regional Solar Dealer / Wholesaler"}</option>
                        <option value="Rooftop Project Developer">{isBn ? "রুফটপ প্রজেক্ট ডেভেলপার" : "Rooftop Project Developer"}</option>
                        <option value="Government / NGO">{isBn ? "সরকারি বা প্রাতিষ্ঠানিক প্রজেক্ট" : "Government / Institutional"}</option>
                        <option value="Other">{isBn ? "অন্যান্য" : "Other"}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-medium text-[#17251F] mb-1.5">
                        {isBn ? "প্রয়োজনীয় ইকুইপমেন্ট ক্যাটাগরি" : "Required Equipment / Category"}
                      </label>
                      <select
                        name="category"
                        className="w-full px-4 py-3 rounded-2xl bg-[#F1F4F1] border border-transparent focus:border-[#074031] focus:bg-white text-base text-[#17251F] outline-none transition-colors"
                        defaultValue=""
                      >
                        <option value="">{isBn ? "ক্যাটাগরি নির্বাচন করুন..." : "Select equipment category..."}</option>
                        <option value="Solar Panels">{isBn ? "সোলার প্যানেল (N-Type TOPCon / Bifacial)" : "Solar Panels (TOPCon / Bifacial)"}</option>
                        <option value="Lithium Batteries">{isBn ? "লিথিয়াম ব্যাটারি (LiFePO4 Server Rack / High Voltage)" : "Lithium Batteries (LiFePO4)"}</option>
                        <option value="Solar Inverters">{isBn ? "সোলার ইনভার্টার (Commercial On-Grid / Hybrid)" : "Solar Inverters (Hybrid / On-Grid)"}</option>
                        <option value="Full Container Consignment">{isBn ? "ফুল কন্টেইনার প্যাকেজ (Multi-Item Consignment)" : "Full Container Consignment"}</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-medium text-[#17251F] mb-1.5">
                        {isBn ? "প্রয়োজনীয় পরিমাণ বা ক্ষমতা (kW/MW)" : "Estimated Volume / Quantity"}
                      </label>
                      <input
                        type="text"
                        name="quantity"
                        placeholder={isBn ? "যেমন: ৫০০ পিস বা ১০০ kW প্রজেক্ট" : "e.g. 500 pcs or 100 kW project"}
                        className="w-full px-4 py-3 rounded-2xl bg-[#F1F4F1] border border-transparent focus:border-[#074031] focus:bg-white text-base text-[#17251F] placeholder:text-[#62706A]/70 outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-medium text-[#17251F] mb-1.5">
                        {isBn ? "ডেলিভারি জেলা বা সাইট লোকেশন" : "Delivery District / Site"}
                      </label>
                      <input
                        type="text"
                        name="location"
                        autoComplete="street-address"
                        placeholder={isBn ? "যেমন: গাজীপুর, চট্টগ্রাম, খুলনা" : "e.g. Gazipur, Chittagong, Dhaka"}
                        className="w-full px-4 py-3 rounded-2xl bg-[#F1F4F1] border border-transparent focus:border-[#074031] focus:bg-white text-base text-[#17251F] placeholder:text-[#62706A]/70 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-medium text-[#17251F] mb-1.5">
                      {isBn ? "ডেলিভারি গ্রহণের সম্ভাব্য সময়" : "Target Delivery Date / Timeframe"}
                    </label>
                    <input
                      type="text"
                      name="requiredDate"
                      placeholder={isBn ? "যেমন: অবিলম্বে (রেডি স্টক) অথবা আগামী ১৫-৩০ দিন" : "e.g. Immediate ready-stock, or within 30 days"}
                      className="w-full px-4 py-3 rounded-2xl bg-[#F1F4F1] border border-transparent focus:border-[#074031] focus:bg-white text-base text-[#17251F] placeholder:text-[#62706A]/70 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-medium text-[#17251F] mb-1.5">
                      {isBn ? "প্রজেক্টের বিবরণ বা বিশেষ টেকনিক্যাল নোট" : "Technical Requirements or Message"}
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      placeholder={
                        isBn
                          ? "মডেল নম্বর, কাঙ্ক্ষিত স্পেসিফিকেশন বা প্রজেক্টের চাহিদার বিস্তারিত লিখুন..."
                          : "Specify model numbers, target specs, or project timeline..."
                      }
                      className="w-full px-4 py-3 rounded-2xl bg-[#F1F4F1] border border-transparent focus:border-[#074031] focus:bg-white text-base text-[#17251F] placeholder:text-[#62706A]/70 outline-none transition-colors resize-none"
                    />
                  </div>

                  <MagneticButton dataMotion="magnetic-cta" className="w-full">
                    <button
                      type="submit"
                      id="btn-submit-quote"
                      disabled={isPending}
                      data-motion="button-slide"
                      className="btn-slide-fill w-full min-h-[48px] flex items-center justify-center gap-2 py-4 rounded-full bg-[#FEBE16] hover:bg-[#E4A900] text-[#052F25] font-bold text-sm tracking-tight transition-all duration-200 active:scale-[0.99] disabled:opacity-60 shadow-lg cursor-pointer"
                    >
                      {isPending ? (
                        <span>{isBn ? "কোটেশন পাঠানো হচ্ছে..." : "Submitting Request..."}</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>{isBn ? "কোটেশনের অনুরোধ পাঠান" : "Submit Wholesale Quote Request"}</span>
                        </>
                      )}
                    </button>
                  </MagneticButton>

                  <p className="text-center text-[11px] font-mono text-[#62706A] pt-2">
                    {isBn
                      ? "অফিসিয়াল টেকনিক্যাল ডেটাশিটসহ সরাসরি B2B আমদানিকারক মূল্য"
                      : "Direct B2B importer pricing with complete technical datasheets"}
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