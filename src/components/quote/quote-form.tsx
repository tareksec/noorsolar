"use client";

import React, { useActionState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { submitQuoteRequest, QuoteActionResult } from "@/app/actions/quote";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Building,
  Send,
  CheckCircle2,
  AlertCircle,
  Lock,
} from "lucide-react";

const initialState: QuoteActionResult = {
  success: false,
};

interface QuoteFormProps {
  isBn?: boolean;
}

function QuoteFormContent({ isBn = false }: QuoteFormProps) {
  const searchParams = useSearchParams();
  const productParam = searchParams.get("product") || "";
  const segmentParam = searchParams.get("segment") || "";
  const emailParam = searchParams.get("email") || "";
  const phoneParam = searchParams.get("phone") || "";

  const initialMessage = productParam
    ? (isBn ? `আমি "${productParam}" পণ্যের জন্য কোটেশন ও টেকনিক্যাল স্পেসিফিকেশন জানতে আগ্রহী।` : `I am inquiring about a quotation and technical specifications for product: ${productParam}.`)
    : segmentParam
    ? (isBn ? `আমি ${segmentParam} সম্পর্কিত পাইকারি সরঞ্জাম সরবরাহের কোটেশন চাই।` : `I am interested in procurement options for segment: ${segmentParam}.`)
    : "";

  const [state, formAction, isPending] = useActionState(submitQuoteRequest, initialState);

  if (state.success) {
    return (
      <div className="py-12 px-6 flex flex-col items-center text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-[#074031]">
          {isBn ? "কোটেশন অনুরোধ সফলভাবে জমা হয়েছে!" : "Quotation Request Received!"}
        </h3>
        <p className="text-sm text-[#62706A] max-w-md leading-relaxed">
          {state.message ||
            (isBn
              ? "ধন্যবাদ! আমাদের সেলস ইঞ্জিনিয়ার শীঘ্রই আপনার দেওয়া তথ্যের ভিত্তিতে কাস্টমাইজড কোটেশন নিয়ে যোগাযোগ করবেন।"
              : "Thank you! Our engineering team will analyze your requirements and reach out with a tailored quotation shortly.")}
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2.5 rounded-full bg-[#074031] text-white text-xs font-semibold hover:bg-[#0B513E] transition-colors"
        >
          {isBn ? "আরেকটি কোটেশন চান?" : "Request Another Quote"}
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="locale" value={isBn ? "bn" : "en"} />
      <input
        type="text"
        name="website_hp"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      {state.error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Row 1: Full Name & Phone Number */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-[#17251F] mb-1.5">
            {isBn ? "আপনার পুরো নাম *" : "Full Name *"}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#62706A]">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              name="name"
              required
              placeholder={isBn ? "আপনার পুরো নাম লিখুন" : "Enter your full name"}
              className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-[#F7F8F5] border border-[#DCE4E0] text-sm text-[#17251F] placeholder:text-[#62706A]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#074031]/20 focus:border-[#074031] transition-all"
            />
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-xs font-semibold text-[#17251F] mb-1.5">
            {isBn ? "মোবাইল / হোয়াটসঅ্যাপ নম্বর *" : "Phone Number *"}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#62706A]">
              <Phone className="w-4 h-4" />
            </div>
            <input
              type="tel"
              name="phone"
              required
              defaultValue={phoneParam}
              placeholder={isBn ? "+880 1XXX-XXXXXX" : "+880 1XXX-XXXXXX"}
              className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-[#F7F8F5] border border-[#DCE4E0] text-sm text-[#17251F] placeholder:text-[#62706A]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#074031]/20 focus:border-[#074031] transition-all"
            />
          </div>
        </div>
      </div>

      {/* Row 2: Email Address */}
      <div>
        <label className="block text-xs font-semibold text-[#17251F] mb-1.5">
          {isBn ? "ইমেইল ঠিকানা" : "Email Address"}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#62706A]">
            <Mail className="w-4 h-4" />
          </div>
          <input
            type="email"
            name="email"
            defaultValue={emailParam}
            placeholder="example@yourmail.com"
            className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-[#F7F8F5] border border-[#DCE4E0] text-sm text-[#17251F] placeholder:text-[#62706A]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#074031]/20 focus:border-[#074031] transition-all"
          />
        </div>
      </div>

      {/* Row 3: Location & Type of Solution */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Location */}
        <div>
          <label className="block text-xs font-semibold text-[#17251F] mb-1.5">
            {isBn ? "আপনার অবস্থান *" : "Location *"}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#62706A]">
              <MapPin className="w-4 h-4" />
            </div>
            <select
              name="location"
              defaultValue={isBn ? "ঢাকা" : "Dhaka"}
              className="w-full pl-10 pr-8 py-3 rounded-xl bg-[#F7F8F5] border border-[#DCE4E0] text-sm text-[#17251F] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#074031]/20 focus:border-[#074031] transition-all appearance-none cursor-pointer"
            >
              <option value={isBn ? "ঢাকা" : "Dhaka"}>{isBn ? "ঢাকা" : "Dhaka"}</option>
              <option value={isBn ? "চট্টগ্রাম" : "Chittagong"}>{isBn ? "চট্টগ্রাম" : "Chittagong"}</option>
              <option value={isBn ? "রাজশাহী" : "Rajshahi"}>{isBn ? "রাজশাহী" : "Rajshahi"}</option>
              <option value={isBn ? "খুলনা" : "Khulna"}>{isBn ? "খুলনা" : "Khulna"}</option>
              <option value={isBn ? "বরিশাল" : "Barishal"}>{isBn ? "বরিশাল" : "Barishal"}</option>
              <option value={isBn ? "সিলেট" : "Sylhet"}>{isBn ? "সিলেট" : "Sylhet"}</option>
              <option value={isBn ? "রংপুর" : "Rangpur"}>{isBn ? "রংপুর" : "Rangpur"}</option>
              <option value={isBn ? "ময়মনসিংহ" : "Mymensingh"}>{isBn ? "ময়মনসিংহ" : "Mymensingh"}</option>
              <option value={isBn ? "অন্যান্য জেলা" : "Other District"}>
                {isBn ? "অন্যান্য জেলা" : "Other District"}
              </option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#62706A]">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Type of Solution */}
        <div>
          <label className="block text-xs font-semibold text-[#17251F] mb-1.5">
            {isBn ? "সলিউশনের ধরন *" : "Type of Solution *"}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#62706A]">
              <Building className="w-4 h-4" />
            </div>
            <select
              name="category"
              defaultValue={
                segmentParam === "epc" || segmentParam === "commercial"
                  ? (isBn ? "শিল্প কারখানার সোলার প্ল্যান্ট" : "Industrial Factory Plant")
                  : (isBn ? "বাসা-বাড়ির সোলার সিস্টেম" : "Residential Solar Solution")
              }
              className="w-full pl-10 pr-8 py-3 rounded-xl bg-[#F7F8F5] border border-[#DCE4E0] text-sm text-[#17251F] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#074031]/20 focus:border-[#074031] transition-all appearance-none cursor-pointer"
            >
              <option value={isBn ? "বাসা-বাড়ির সোলার সিস্টেম" : "Residential Solar Solution"}>
                {isBn ? "বাসা-বাড়ির সোলার সিস্টেম" : "Residential Solar Solution"}
              </option>
              <option value={isBn ? "কমার্শিয়াল রুফটপ সোলার" : "Commercial Rooftop Solar"}>
                {isBn ? "কমার্শিয়াল রুফটপ সোলার" : "Commercial Rooftop Solar"}
              </option>
              <option value={isBn ? "শিল্প কারখানার সোলার প্ল্যান্ট" : "Industrial Factory Plant"}>
                {isBn ? "শিল্প কারখানার সোলার প্ল্যান্ট" : "Industrial Factory Plant"}
              </option>
              <option value={isBn ? "সোলার প্যানেল পাইকারি কন্টেইনার" : "Wholesale Container Panels"}>
                {isBn ? "সোলার প্যানেল পাইকারি কন্টেইনার" : "Wholesale Container Panels"}
              </option>
              <option value={isBn ? "হাইব্রিড ইনভার্টার ও ব্যাটারি স্টোরেজ" : "Hybrid Inverters & Battery Storage"}>
                {isBn ? "হাইব্রিড ইনভার্টার ও ব্যাটারি স্টোরেজ" : "Hybrid Inverters & Battery Storage"}
              </option>
              <option value={isBn ? "সোলার পাম্প ও কৃষি সমাধান" : "Solar Pump & Agri Solution"}>
                {isBn ? "সোলার পাম্প ও কৃষি সমাধান" : "Solar Pump & Agri Solution"}
              </option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#62706A]">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Message / Requirements */}
      <div>
        <label className="block text-xs font-semibold text-[#17251F] mb-1.5">
          {isBn ? "আপনার মেসেজ / প্রজেক্ট বিবরণ" : "Your Message / Requirements"}
        </label>
        <textarea
          name="message"
          rows={3}
          defaultValue={initialMessage}
          placeholder={
            isBn
              ? "আপনার প্রয়োজনীয় সিস্টেম সাইজ, মাসিক বিদ্যুৎ খরচ বা বিশেষ বিবরণ লিখুন..."
              : "Tell us about your needs (e.g., home, business, system size, electricity bills, etc.)"
          }
          className="w-full p-3.5 rounded-xl bg-[#F7F8F5] border border-[#DCE4E0] text-sm text-[#17251F] placeholder:text-[#62706A]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#074031]/20 focus:border-[#074031] transition-all resize-none"
        />
      </div>

      {/* Submit Button in Vibrant Solar Gold */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full py-4 px-6 rounded-xl sm:rounded-2xl bg-[#FEBE16] hover:bg-[#E4A900] active:scale-[0.99] text-[#052F25] font-bold text-base transition-all shadow-[0_6px_20px_rgba(254,190,22,0.35)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <Send className="w-4 h-4" />
        <span>{isPending ? (isBn ? "পাঠানো হচ্ছে..." : "Sending...") : (isBn ? "কোটেশন রিকোয়েস্ট পাঠান →" : "Send Request →")}</span>
      </button>

      {/* Privacy note */}
      <p className="flex items-center justify-center gap-1.5 text-[11px] text-[#62706A] text-center pt-1">
        <Lock className="w-3.5 h-3.5 text-[#62706A]" />
        <span>
          {isBn
            ? "আপনার তথ্য নিরাপদে সংরক্ষিত থাকবে। আমরা কখনোই আপনার তথ্য শেয়ার করব না।"
            : "Your information is safe with us. We respect your privacy."}
        </span>
      </p>
    </form>
  );
}

export function QuoteForm(props: QuoteFormProps) {
  return (
    <Suspense fallback={<div className="py-12 text-center text-sm text-[#62706A]">Loading quote form...</div>}>
      <QuoteFormContent {...props} />
    </Suspense>
  );
}
