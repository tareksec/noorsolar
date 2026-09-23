"use client";

import React, { useActionState } from "react";
import { submitQuoteRequest, QuoteActionResult } from "@/app/actions/quote";
import {
  User,
  Phone,
  Mail,
  FileText,
  MapPin,
  Building,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  Lock,
} from "lucide-react";

const initialState: QuoteActionResult = {
  success: false,
};

interface ContactFormProps {
  isBn?: boolean;
}

export function ContactForm({ isBn = false }: ContactFormProps) {
  const [state, formAction, isPending] = useActionState(submitQuoteRequest, initialState);

  if (state.success) {
    return (
      <div className="py-12 px-6 flex flex-col items-center text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-[#074031]">
          {isBn ? "আপনার তথ্য সফলভাবে জমা হয়েছে!" : "Your Message Has Been Sent!"}
        </h3>
        <p className="text-sm text-[#62706A] max-w-md leading-relaxed">
          {state.message ||
            (isBn
              ? "ধন্যবাদ! আমাদের সেলস ইঞ্জিনিয়ার শীঘ্রই আপনার সাথে সরাসরি যোগাযোগ করবেন।"
              : "Thank you! Our sales engineer will review your inquiry and get back to you shortly.")}
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2.5 rounded-full bg-[#074031] text-white text-xs font-semibold hover:bg-[#0B513E] transition-colors"
        >
          {isBn ? "আরেকটি বার্তা পাঠান" : "Send Another Message"}
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

      {/* Row 1: Name & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-[#17251F] mb-1.5">
            {isBn ? "আপনার নাম *" : "Your Name *"}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#62706A]">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              name="name"
              required
              placeholder={isBn ? "আপনার নাম লিখুন" : "e.g. Engr. Rafiqul Islam"}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F7F8F5] border border-[#DCE4E0] text-sm text-[#17251F] placeholder:text-[#62706A]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#074031]/20 focus:border-[#074031] transition-all"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-semibold text-[#17251F] mb-1.5">
            {isBn ? "হোয়াটসঅ্যাপ / মোবাইল নম্বর *" : "Phone / WhatsApp *"}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#62706A]">
              <Phone className="w-4 h-4" />
            </div>
            <input
              type="tel"
              name="phone"
              required
              placeholder={isBn ? "+880 17... অথবা 017..." : "+880 17... or 017..."}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F7F8F5] border border-[#DCE4E0] text-sm text-[#17251F] placeholder:text-[#62706A]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#074031]/20 focus:border-[#074031] transition-all"
            />
          </div>
        </div>
      </div>

      {/* Row 2: Company & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Company */}
        <div>
          <label className="block text-xs font-semibold text-[#17251F] mb-1.5">
            {isBn ? "কোম্পানি বা প্রতিষ্ঠানের নাম" : "Company / Project Name"}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#62706A]">
              <Building className="w-4 h-4" />
            </div>
            <input
              type="text"
              name="company"
              autoComplete="organization"
              placeholder={isBn ? "যেমন: সানরাইজ এনার্জি লিমিটেড" : "e.g. Dhaka Solar EPC Ltd."}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F7F8F5] border border-[#DCE4E0] text-sm text-[#17251F] placeholder:text-[#62706A]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#074031]/20 focus:border-[#074031] transition-all"
            />
          </div>
        </div>

        {/* Email */}
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
              placeholder="name@domain.com"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F7F8F5] border border-[#DCE4E0] text-sm text-[#17251F] placeholder:text-[#62706A]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#074031]/20 focus:border-[#074031] transition-all"
            />
          </div>
        </div>
      </div>

      {/* Row 3: Category / Subject */}
      <div>
        <label className="block text-xs font-semibold text-[#17251F] mb-1.5">
          {isBn ? "বিষয় নির্বাচন করুন *" : "Select Topic *"}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#62706A]">
            <FileText className="w-4 h-4" />
          </div>
          <select
            name="category"
            defaultValue={isBn ? "পণ্য সম্পর্কে জানতে চাই" : "Inquire About Products"}
            className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-[#F7F8F5] border border-[#DCE4E0] text-sm text-[#17251F] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#074031]/20 focus:border-[#074031] transition-all appearance-none cursor-pointer"
          >
            <option value={isBn ? "পণ্য সম্পর্কে জানতে চাই" : "Inquire About Products"}>
              {isBn ? "পণ্য সম্পর্কে জানতে চাই" : "Inquire About Products"}
            </option>
            <option value={isBn ? "পাইকারি কোটেশন (Wholesale Quote)" : "Wholesale Quotation"}>
              {isBn ? "পাইকারি কোটেশন (Wholesale Quote)" : "Wholesale Quotation"}
            </option>
            <option value={isBn ? "সোলার প্যানেল কন্টেইনার অর্ডার" : "Solar Panels Container Order"}>
              {isBn ? "সোলার প্যানেল কন্টেইনার অর্ডার" : "Solar Panels Container Order"}
            </option>
            <option value={isBn ? "ইনভার্টার ও লিথিয়াম ব্যাটারি" : "Inverters & Lithium Batteries"}>
              {isBn ? "ইনভার্টার ও লিথিয়াম ব্যাটারি" : "Inverters & Lithium Batteries"}
            </option>
            <option value={isBn ? "টেকনিক্যাল সাপোর্ট ও SLD রিভিউ" : "Technical Support & SLD Review"}>
              {isBn ? "টেকনিক্যাল সাপোর্ট ও SLD রিভিউ" : "Technical Support & SLD Review"}
            </option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#62706A]">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Row 3: Location & Project Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Location / Division */}
        <div>
          <label className="block text-xs font-semibold text-[#17251F] mb-1.5">
            {isBn ? "আপনার অবস্থান *" : "Your Location *"}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#62706A]">
              <MapPin className="w-4 h-4" />
            </div>
            <select
              name="location"
              defaultValue={isBn ? "ঢাকা" : "Dhaka"}
              className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-[#F7F8F5] border border-[#DCE4E0] text-sm text-[#17251F] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#074031]/20 focus:border-[#074031] transition-all appearance-none cursor-pointer"
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

        {/* Project Type */}
        <div>
          <label className="block text-xs font-semibold text-[#17251F] mb-1.5">
            {isBn ? "প্রজেক্টের ধরন" : "Project Type"}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#62706A]">
              <Building className="w-4 h-4" />
            </div>
            <select
              name="buyerType"
              defaultValue={isBn ? "বাসা/বাড়ি" : "Residential"}
              className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-[#F7F8F5] border border-[#DCE4E0] text-sm text-[#17251F] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#074031]/20 focus:border-[#074031] transition-all appearance-none cursor-pointer"
            >
              <option value={isBn ? "বাসা/বাড়ি" : "Residential"}>{isBn ? "বাসা/বাড়ি" : "Residential"}</option>
              <option value={isBn ? "শিল্প প্রতিষ্ঠান / কারখানা" : "Industrial Factory"}>
                {isBn ? "শিল্প প্রতিষ্ঠান / কারখানা" : "Industrial Factory"}
              </option>
              <option value={isBn ? "বাণিজ্যিক ভবন / অফিস" : "Commercial Building"}>
                {isBn ? "বাণিজ্যিক ভবন / অফিস" : "Commercial Building"}
              </option>
              <option value={isBn ? "সোলার পাম্প / কৃষি" : "Solar Pump / Agri"}>
                {isBn ? "সোলার পাম্প / কৃষি" : "Solar Pump / Agri"}
              </option>
              <option value={isBn ? "EPC কন্ট্রাক্টর / ডিলার" : "EPC Contractor / Dealer"}>
                {isBn ? "EPC কন্ট্রাক্টর / ডিলার" : "EPC Contractor / Dealer"}
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

      {/* Row 4: Message */}
      <div>
        <label className="block text-xs font-semibold text-[#17251F] mb-1.5">
          {isBn ? "আপনার মেসেজ লিখুন *" : "Your Message *"}
        </label>
        <div className="relative">
          <div className="absolute top-3 left-3.5 pointer-events-none text-[#62706A]">
            <MessageSquare className="w-4 h-4" />
          </div>
          <textarea
            name="message"
            required
            rows={4}
            placeholder={
              isBn
                ? "আপনার প্রয়োজনীয় তথ্য, প্রশ্ন বা যে কোনো বার্তা এখানে লিখুন..."
                : "Describe your project requirements, quantities, or specific questions here..."
            }
            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F7F8F5] border border-[#DCE4E0] text-sm text-[#17251F] placeholder:text-[#62706A]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#074031]/20 focus:border-[#074031] transition-all resize-none"
          />
        </div>
      </div>

      {/* Submit Button in Brand Solar Gold */}
      <button
        id="btn-submit-quote"
        type="submit"
        disabled={isPending}
        className="w-full py-3.5 px-6 rounded-2xl bg-[#FEBE16] hover:bg-[#E4A900] active:scale-[0.99] text-[#052F25] font-bold text-base transition-all shadow-[0_4px_16px_rgba(254,190,22,0.35)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <Send className="w-4 h-4" />
        <span>{isPending ? (isBn ? "পাঠানো হচ্ছে..." : "Sending...") : (isBn ? "যোগাযোগ করুন" : "Submit Inquiry")}</span>
      </button>

      {/* Security note */}
      <p className="flex items-center justify-center gap-1.5 text-[11px] text-[#62706A] text-center pt-1">
        <Lock className="w-3.5 h-3.5 text-[#62706A]" />
        <span>
          {isBn
            ? "আপনার তথ্য নিরাপদে সংরক্ষিত থাকবে। আমরা কখনোই আপনার তথ্য শেয়ার করব না।"
            : "Your information is securely encrypted and will never be shared."}
        </span>
      </p>
    </form>
  );
}
