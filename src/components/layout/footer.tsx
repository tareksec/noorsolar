import React from "react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { SiteConfig } from "@/lib/site-config";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

interface FooterProps {
  settings: SiteConfig;
  showBlog?: boolean;
  locale?: string;
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function Footer({ settings, showBlog = false, locale }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const isBn = locale === "bn";

  const phoneRaw = settings.phone || "+8801700000000";
  const phoneDisplay = settings.phoneDisplay || "+880 1700-000000";
  const email = settings.email || "info@noorsolaren.com";
  const address = settings.address || "Motijheel Commercial Area, Dhaka-1000, Bangladesh";
  const hours = settings.hours || "Sat - Thu: 9:00 AM - 7:00 PM (Friday Closed)";
  const whatsappNum = settings.whatsapp || "8801700000000";
  const whatsappDisplay = settings.whatsappDisplay || "+880 1700-000000";

  return (
    <footer className="w-full px-3 sm:px-6 lg:px-8 pb-6 sm:pb-8 pt-8">
      <div className="max-w-7xl mx-auto rounded-[36px] sm:rounded-[44px] bg-[#F5F7F3] border border-[#DCE2D8] shadow-[0_10px_35px_rgba(0,0,0,0.04)] overflow-hidden pt-12 sm:pt-16 px-6 sm:px-12 lg:px-16 flex flex-col justify-between">
        
        {/* Top Navigation & Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 sm:pb-16 text-left">
          
          {/* Col 1: Brand & Contact Info (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              {/* Brand Logo */}
              <div className="mb-5">
                <Link href="/" className="inline-block group">
                  <Image
                    src="/brand/logo-default.png"
                    alt="Noor Solar Energy"
                    width={200}
                    height={50}
                    className="h-10 sm:h-11 w-auto object-contain group-hover:opacity-90 transition-opacity"
                  />
                </Link>
              </div>
              <p className="text-xs sm:text-[13px] text-[#5C6457] leading-relaxed mb-6 max-w-sm">
                {isBn
                  ? "সরাসরি কন্টেইনার স্কেল আমদানিকারক এবং বাংলাদেশে টায়ার-১ সোলার প্যানেল, LiFePO4 ব্যাটারি ও হাইব্রিড ইনভার্টারের পাইকারি B2B সরবরাহকারী।"
                  : "Direct container-scale importer and bulk B2B wholesale distributor of Tier-1 solar panels, LiFePO4 batteries, and hybrid inverters across Bangladesh."}
              </p>

              {/* Contact Information List with Icons */}
              <div className="space-y-3 text-xs sm:text-[13px] text-[#333C2F]">
                
                {/* Address */}
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white border border-[#D5DAD0] flex items-center justify-center shrink-0 mt-0.5 text-[#111311]">
                    <MapPin className="w-3.5 h-3.5 text-[#111311]" />
                  </div>
                  <span className="leading-tight text-[#4F574A]">{address}</span>
                </div>

                {/* Direct Phone */}
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white border border-[#D5DAD0] flex items-center justify-center shrink-0 text-[#111311]">
                    <Phone className="w-3.5 h-3.5 text-[#111311]" />
                  </div>
                  <a
                    href={`tel:${phoneRaw}`}
                    className="font-medium text-[#111311] hover:text-[#426B1F] transition-colors"
                  >
                    {phoneDisplay}
                  </a>
                </div>

                {/* WhatsApp Support */}
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#25D366]/15 border border-[#25D366]/40 flex items-center justify-center shrink-0 text-[#128C7E]">
                    <MessageCircle className="w-3.5 h-3.5 text-[#128C7E] fill-current" />
                  </div>
                  <a
                    href={`https://wa.me/${whatsappNum}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#111311] hover:text-[#128C7E] transition-colors"
                  >
                    {whatsappDisplay} <span className="text-[11px] font-mono text-[#62705C]">{isBn ? "(হোয়াটসঅ্যাপ ডেস্ক)" : "(WhatsApp Desk)"}</span>
                  </a>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white border border-[#D5DAD0] flex items-center justify-center shrink-0 text-[#111311]">
                    <Mail className="w-3.5 h-3.5 text-[#111311]" />
                  </div>
                  <a
                    href={`mailto:${email}`}
                    className="font-medium text-[#111311] hover:text-[#426B1F] transition-colors"
                  >
                    {email}
                  </a>
                </div>

                {/* Hours */}
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white border border-[#D5DAD0] flex items-center justify-center shrink-0 text-[#111311]">
                    <Clock className="w-3.5 h-3.5 text-[#111311]" />
                  </div>
                  <span className="text-[11px] text-[#62705C] font-mono">{hours}</span>
                </div>

              </div>
            </div>
          </div>

          {/* Col 2: Products & Catalog (2.5 cols) */}
          <div className="lg:col-span-3">
            <h2 className="font-bold text-sm text-[#111311] tracking-tight mb-4">
              {isBn ? "সরঞ্জাম ক্যাটালগ" : "Equipment Catalog"}
            </h2>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#4F574A]">
              <li>
                <Link
                  href="/products?category=solar-panels"
                  className="hover:text-[#111311] hover:translate-x-1 inline-flex items-center gap-1.5 transition-all"
                >
                  <span>{isBn ? "এন-টাইপ TOPCon প্যানেল (585W–620W)" : "N-Type TOPCon Panels (585W–620W)"}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=lithium-batteries"
                  className="hover:text-[#111311] hover:translate-x-1 inline-flex items-center gap-1.5 transition-all"
                >
                  <span>{isBn ? "LiFePO4 স্টোরেজ ব্যাংক (48V / 51.2V)" : "LiFePO4 Storage Banks (48V / 51.2V)"}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=solar-inverters"
                  className="hover:text-[#111311] hover:translate-x-1 inline-flex items-center gap-1.5 transition-all"
                >
                  <span>{isBn ? "হাইব্রিড ও থ্রি-ফেজ ইনভার্টার" : "Hybrid & Three-Phase Inverters"}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-[#111311] hover:translate-x-1 inline-flex items-center gap-1.5 transition-all font-semibold text-[#111311]"
                >
                  <span>{isBn ? "সম্পূর্ণ পাইকারি ইনভেন্টরি দেখুন →" : "Browse Full Wholesale Inventory →"}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-[#111311] hover:translate-x-1 inline-flex items-center gap-1.5 transition-all"
                >
                  <span>{isBn ? "কন্টেইনার ক্রয়ের কোটেশন চান" : "Request Container Procurement Quote"}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Company & Information (2.5 cols) */}
          <div className="lg:col-span-2">
            <h2 className="font-bold text-sm text-[#111311] tracking-tight mb-4">
              {isBn ? "কোম্পানি" : "Company"}
            </h2>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#4F574A]">
              <li>
                <Link href="/about" className="hover:text-[#111311] transition-colors">
                  {isBn ? "নূর সোলার পরিচিতি" : "About Noor Solar"}
                </Link>
              </li>
              <li>
                <Link href="/#process" className="hover:text-[#111311] transition-colors">
                  {isBn ? "অর্ডার প্রক্রিয়া" : "Ordering Process"}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#111311] transition-colors">
                  {isBn ? "সেলস ডেস্কে যোগাযোগ" : "Contact Sales Desk"}
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-[#111311] transition-colors">
                  {isBn ? "প্রশ্নোত্তর ও সহায়তা" : "FAQ & Support"}
                </Link>
              </li>
              <li>
                <Link href="/certifications" className="hover:text-[#111311] transition-colors font-medium">
                  {isBn ? "সার্টিফিকেশন ও মানদণ্ড" : "Certifications & Standards"}
                </Link>
              </li>
              {showBlog && (
                <li>
                  <Link href="/blog" className="hover:text-[#111311] transition-colors font-medium">
                    {isBn ? "কারিগরি ব্লগ" : "Technical Blog"}
                  </Link>
                </li>
              )}
              <li>
                <Link href="/admin/login" className="hover:text-[#111311] transition-colors text-[11px] font-mono text-[#4A5445]">
                  {isBn ? "স্টাফ পোর্টাল" : "B2B Staff Portal"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Affiliations & Social Icons (3 cols) */}
          <div className="lg:col-span-3 flex flex-col justify-between">
            <div>
              <h2 className="font-bold text-sm text-[#111311] tracking-tight mb-4">
                {isBn ? "স্বীকৃতি ও কমপ্লায়েন্স" : "Affiliation & Compliance"}
              </h2>

              {/* BSREA Membership Verified Badge Card */}
              <div className="p-3.5 rounded-2xl bg-white border border-[#D5DAD0] shadow-2xs mb-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-white border border-[#E0E5DC] shrink-0 flex items-center justify-center p-0.5">
                    <Image
                      src="/photos/bsrea-logo.png"
                      alt="BSREA Logo"
                      width={32}
                      height={32}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-[#111311] block leading-tight">
                      {isBn ? "BSREA নিবন্ধিত সদস্য" : "BSREA Registered Member"}
                    </span>
                    <span className="text-[10px] font-mono text-[#6A7465]">
                      No. 20260915GEN113
                    </span>
                  </div>
                </div>
                <a
                  href="https://drive.google.com/file/d/1GR4hILXnDjJblqNmrxRNnWH_M7It4Md2/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#111311] hover:text-[#426B1F] transition-colors underline underline-offset-2"
                >
                  <span>{isBn ? "অফিসিয়াল সনদ দেখুন" : "View Official Certificate"}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Social Channels with Modern Icon Buttons */}
              <h3 className="text-xs font-mono font-semibold text-[#111311] mb-2.5">
                {isBn ? "যুক্ত থাকুন" : "Connect With Us"}
              </h3>
              <div className="flex items-center gap-2">
                <a
                  href={settings.socials?.facebook || "https://facebook.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={isBn ? "ফেসবুকে নূর সোলার অনুসরণ করুন" : "Follow Noor Solar on Facebook"}
                  className="w-8 h-8 rounded-full bg-white hover:bg-[#CEF23E] border border-[#D5DAD0] text-[#111311] flex items-center justify-center transition-all hover:scale-110 shadow-2xs"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>

                <a
                  href={settings.socials?.linkedin || "https://linkedin.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={isBn ? "লিংকডইনে নূর সোলারের সাথে যুক্ত হন" : "Connect with Noor Solar on LinkedIn"}
                  className="w-8 h-8 rounded-full bg-white hover:bg-[#CEF23E] border border-[#D5DAD0] text-[#111311] flex items-center justify-center transition-all hover:scale-110 shadow-2xs"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>

                <a
                  href={`https://wa.me/${whatsappNum}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={isBn ? "হোয়াটসঅ্যাপে নূর সোলারের সাথে চ্যাট করুন" : "Chat with Noor Solar on WhatsApp"}
                  className="w-8 h-8 rounded-full bg-white hover:bg-[#CEF23E] border border-[#D5DAD0] text-[#111311] flex items-center justify-center transition-all hover:scale-110 shadow-2xs"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>

                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={isBn ? "ইউটিউবে নূর সোলারের ভিডিও দেখুন" : "Watch Noor Solar on YouTube"}
                  className="w-8 h-8 rounded-full bg-white hover:bg-[#CEF23E] border border-[#D5DAD0] text-[#111311] flex items-center justify-center transition-all hover:scale-110 shadow-2xs"
                >
                  <YoutubeIcon className="w-4 h-4" />
                </a>

                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={isBn ? "এক্সে নূর সোলার অনুসরণ করুন" : "Follow Noor Solar on X"}
                  className="w-8 h-8 rounded-full bg-white hover:bg-[#CEF23E] border border-[#D5DAD0] text-[#111311] flex items-center justify-center transition-all hover:scale-110 shadow-2xs"
                >
                  <TwitterIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Giant Brand Watermark */}
        <div className="w-full select-none pointer-events-none pt-2 pb-0 overflow-hidden flex items-end justify-center border-t border-[#DCE2D8]">
          <span className="font-extrabold tracking-[0.05em] text-center uppercase leading-[0.8] text-[clamp(3.8rem,15vw,14rem)] text-transparent bg-clip-text bg-gradient-to-b from-[#8FA89A]/45 via-[#8FA89A]/20 to-transparent">
            NOOR SOLAR
          </span>
        </div>

        {/* Sub-Footer Copyright & Disclaimer */}
        <div className="py-4 border-t border-[#DCE2D8] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-[#6A7365]">
          <div className="flex items-center gap-4 flex-wrap">
            <span>&copy; {currentYear} {isBn ? "নূর সোলার এনার্জি। সর্বস্বত্ব সংরক্ষিত।" : "Noor Solar Energy. All rights reserved."}</span>
            <LanguageSwitcher idPrefix="ftr" currentLocale={locale} />
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-[#111311] transition-colors">
              {isBn ? "প্রাইভেসি পলিসি" : "Privacy Policy"}
            </Link>
            <span>&bull;</span>
            <Link href="/contact" className="hover:text-[#111311] transition-colors">
              {isBn ? "বাণিজ্যিক শর্তাবলী" : "Wholesale Terms"}
            </Link>
            <span>&bull;</span>
            <span>{isBn ? "বাংলাদেশের B2B শিল্পের জন্য নিবেদিত" : "Made for B2B Bangladesh"}</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
