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

interface FooterProps {
  settings: SiteConfig;
  showBlog?: boolean;
  locale?: string;
}

function isValidSocialUrl(url?: string | null): boolean {
  if (!url) return false;
  const trimmed = url.trim().toLowerCase();
  if (
    trimmed === "" ||
    trimmed === "https://facebook.com" ||
    trimmed === "https://facebook.com/" ||
    trimmed === "https://www.facebook.com" ||
    trimmed === "https://www.facebook.com/" ||
    trimmed === "https://linkedin.com" ||
    trimmed === "https://linkedin.com/" ||
    trimmed === "https://www.linkedin.com" ||
    trimmed === "https://www.linkedin.com/" ||
    trimmed === "https://youtube.com" ||
    trimmed === "https://youtube.com/" ||
    trimmed === "https://www.youtube.com" ||
    trimmed === "https://www.youtube.com/" ||
    trimmed === "https://twitter.com" ||
    trimmed === "https://twitter.com/" ||
    trimmed === "https://x.com" ||
    trimmed === "https://x.com/"
  ) {
    return false;
  }
  return true;
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

  const phoneRaw = (settings.phone || "+8801884611888").replace(/[^0-9+]/g, "");
  const phoneDisplay = settings.phoneDisplay || "+880 1884-611888";
  const email = settings.email || "info@noorsolaren.com";
  const address = settings.address || (isBn ? "হাউস-৩৮ (ফ্ল্যাট-১এ), রোড-৫/এ, সেক্টর-৫, উত্তরা, ঢাকা-১২৩০, বাংলাদেশ" : "House-38 (Flat-1A), Road-5/A, Sector-5, Uttara, Dhaka-1230, Bangladesh");
  const hours = settings.hours || (isBn ? "শনি - বৃহস্পতি: সকাল ৯:০০ - সন্ধ্যা ৭:০০ (শুক্রবার বন্ধ)" : "Sat - Thu: 9:00 AM - 7:00 PM (Friday Closed)");
  const whatsappNum = (settings.whatsapp || "8801884611888").replace(/[^0-9]/g, "");
  const whatsappDisplay = settings.whatsappDisplay || "+880 1884-611888";

  return (
    <footer className="w-full px-3 sm:px-6 lg:px-8 pb-4 sm:pb-6 pt-8 relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto rounded-[36px] sm:rounded-[44px] bg-[#074031] border border-[#0B513E] shadow-[0_16px_40px_rgba(7,64,49,0.25)] overflow-hidden pt-12 sm:pt-16 px-6 sm:px-12 lg:px-16 flex flex-col justify-between text-white">
        
        {/* Top Navigation & Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 sm:pb-16 text-left">
          
          {/* Col 1: Brand & Contact Info (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              {/* Brand Logo */}
              <div className="mb-5">
                <Link href="/" className="inline-flex items-center min-h-[44px] group">
                  <Image
                    src="/brand/logo-white.png"
                    alt="Noor Solar Energy"
                    width={200}
                    height={50}
                    className="h-11 w-auto object-contain group-hover:opacity-95 transition-opacity"
                  />
                </Link>
              </div>
              <p className="text-xs sm:text-[13px] text-white/80 leading-relaxed mb-6 max-w-sm">
                {isBn
                  ? "সরাসরি কন্টেইনার স্কেল আমদানিকারক এবং বাংলাদেশে উচ্চ-দক্ষতাসম্পন্ন সোলার প্যানেল, LiFePO4 ব্যাটারি ও হাইব্রিড ইনভার্টারের পাইকারি B2B সরবরাহকারী।"
                  : "Direct container-scale importer and bulk B2B wholesale distributor of high-performance solar panels, LiFePO4 batteries, and hybrid inverters across Bangladesh."}
              </p>

              {/* Contact Information List with Icons */}
              <div className="space-y-3 text-xs sm:text-[13px] text-white/90">
                
                {/* Address */}
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#052F25] border border-white/15 flex items-center justify-center shrink-0 mt-0.5 text-[#FEBE16]">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <span className="leading-tight text-white/80">{address}</span>
                </div>

                {/* Direct Phone */}
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#052F25] border border-white/15 flex items-center justify-center shrink-0 text-[#FEBE16]">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <a
                    href={`tel:${phoneRaw}`}
                    className="inline-flex items-center min-h-[44px] font-medium text-white hover:text-[#FEBE16] transition-colors"
                  >
                    {phoneDisplay}
                  </a>
                </div>

                {/* WhatsApp Support */}
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#052F25] border border-white/15 flex items-center justify-center shrink-0 text-[#FEBE16]">
                    <MessageCircle className="w-3.5 h-3.5" />
                  </div>
                  <a
                    href={`https://wa.me/${whatsappNum}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center min-h-[44px] font-medium text-white hover:text-[#FEBE16] transition-colors"
                  >
                    {whatsappDisplay} <span className="text-xs font-mono text-[#FEBE16]/80">{isBn ? "(হোয়াটসঅ্যাপ ডেস্ক)" : "(WhatsApp Desk)"}</span>
                  </a>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#052F25] border border-white/15 flex items-center justify-center shrink-0 text-[#FEBE16]">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex items-center min-h-[44px] font-medium text-white hover:text-[#FEBE16] transition-colors"
                  >
                    {email}
                  </a>
                </div>

                {/* Hours */}
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#052F25] border border-white/15 flex items-center justify-center shrink-0 text-[#FEBE16]">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs text-white/70 font-mono">{hours}</span>
                </div>

              </div>
            </div>
          </div>

          {/* Col 2: Products & Catalog (2.5 cols) */}
          <div className="lg:col-span-3">
            <h2 className="font-bold text-sm text-white tracking-tight mb-4">
              {isBn ? "সরঞ্জাম ক্যাটালগ" : "Equipment Catalog"}
            </h2>
            <ul className="space-y-1 text-xs sm:text-sm text-white/75">
              <li>
                <Link
                  href="/products?category=solar-panels"
                  className="hover:text-[#FEBE16] hover:translate-x-1 inline-flex items-center gap-1.5 min-h-[44px] transition-all"
                >
                  <span>{isBn ? "এন-টাইপ TOPCon প্যানেল (585W–620W)" : "N-Type TOPCon Panels (585W–620W)"}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=lithium-batteries"
                  className="hover:text-[#FEBE16] hover:translate-x-1 inline-flex items-center gap-1.5 min-h-[44px] transition-all"
                >
                  <span>{isBn ? "LiFePO4 স্টোরেজ ব্যাংক (48V / 51.2V)" : "LiFePO4 Storage Banks (48V / 51.2V)"}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=solar-inverters"
                  className="hover:text-[#FEBE16] hover:translate-x-1 inline-flex items-center gap-1.5 min-h-[44px] transition-all"
                >
                  <span>{isBn ? "হাইব্রিড ও থ্রি-ফেজ ইনভার্টার" : "Hybrid & Three-Phase Inverters"}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-[#FEBE16] hover:translate-x-1 inline-flex items-center gap-1.5 min-h-[44px] transition-all"
                >
                  <span>{isBn ? "সম্পূর্ণ পাইকারি ইনভেন্টরি দেখুন" : "Browse Full Wholesale Inventory"}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/quote"
                  className="hover:text-[#E4A900] hover:translate-x-1 inline-flex items-center gap-1.5 min-h-[44px] transition-all font-semibold text-[#FEBE16]"
                >
                  <span>{isBn ? "অনলাইন কোটেশন নিন →" : "Request a Solar Quote →"}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Company & Information (2.5 cols) */}
          <div className="lg:col-span-2">
            <h2 className="font-bold text-sm text-white tracking-tight mb-4">
              {isBn ? "কোম্পানি" : "Company"}
            </h2>
            <ul className="space-y-1 text-xs sm:text-sm text-white/75">
              <li>
                <Link href="/about" className="hover:text-[#FEBE16] inline-flex items-center min-h-[44px] transition-colors">
                  {isBn ? "নূর সোলার এনার্জি পরিচিতি" : "About Noor Solar Energy"}
                </Link>
              </li>
              <li>
                <Link href="/#process" className="hover:text-[#FEBE16] inline-flex items-center min-h-[44px] transition-colors">
                  {isBn ? "অর্ডার প্রক্রিয়া" : "Ordering Process"}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#FEBE16] inline-flex items-center min-h-[44px] transition-colors">
                  {isBn ? "সেলস ডেস্কে যোগাযোগ" : "Contact Sales Desk"}
                </Link>
              </li>
              <li>
                <Link href="/quote" className="hover:text-[#FEBE16] inline-flex items-center min-h-[44px] transition-colors">
                  {isBn ? "অনলাইন কোটেশন" : "Online Quotation"}
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-[#FEBE16] inline-flex items-center min-h-[44px] transition-colors">
                  {isBn ? "প্রশ্নোত্তর ও সহায়তা" : "FAQ & Support"}
                </Link>
              </li>
              <li>
                <Link href="/certifications" className="hover:text-[#FEBE16] inline-flex items-center min-h-[44px] transition-colors font-medium">
                  {isBn ? "সার্টিফিকেশন ও মানদণ্ড" : "Certifications & Standards"}
                </Link>
              </li>
              {showBlog && (
                <li>
                  <Link href="/blog" className="hover:text-[#FEBE16] inline-flex items-center min-h-[44px] transition-colors font-medium">
                    {isBn ? "কারিগরি ব্লগ" : "Technical Blog"}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Col 4: Industry Certification & Membership (3 cols) */}
          <div className="lg:col-span-3">
            <h2 className="font-bold text-sm text-white tracking-tight mb-4">
              {isBn ? "শিল্প সমিতি সদস্যপদ" : "Industry Membership"}
            </h2>

            {/* BSREA Member Badge Card */}
            <div className="p-4 rounded-2xl bg-[#052F25] border border-white/15 mb-6 shadow-2xs">
              <div className="flex items-center gap-3 mb-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#074031] border border-white/10 flex items-center justify-center shrink-0">
                  <Image
                    src="/photos/bsrea-logo.png"
                    alt={isBn ? "বিএসআরইএ লোগো" : "BSREA Logo"}
                    width={36}
                    height={36}
                    className="object-contain"
                  />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block leading-tight">
                    {isBn ? "BSREA নিবন্ধিত সদস্য" : "BSREA Registered Member"}
                  </span>
                  <span className="text-xs font-mono text-white/60">
                    No. 20260915GEN113
                  </span>
                </div>
              </div>

              <a
                href="https://drive.google.com/file/d/1GR4hILXnDjJblqNmrxRNnWH_M7It4Md2/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FEBE16] hover:text-[#E4A900] transition-colors underline underline-offset-2 min-h-[44px]"
              >
                <span>{isBn ? "অফিসিয়াল সনদ দেখুন" : "View Official Certificate"}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

              {/* Social Channels with Verified Profile Icon Buttons */}
              <h3 className="text-xs font-mono font-semibold text-white mb-2.5">
                {isBn ? "যুক্ত থাকুন" : "Connect With Us"}
              </h3>
              <div className="flex items-center gap-2.5 flex-wrap">
                {isValidSocialUrl(settings.socials?.facebook) && (
                  <a
                    href={settings.socials!.facebook!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={isBn ? "ফেসবুকে নূর সোলার এনার্জি অনুসরণ করুন" : "Follow Noor Solar Energy on Facebook"}
                    className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-[#052F25] hover:bg-[#FEBE16] hover:text-[#052F25] border border-white/15 text-white flex items-center justify-center transition-all hover:scale-105 shadow-2xs"
                  >
                    <FacebookIcon className="w-5 h-5" />
                  </a>
                )}

                {isValidSocialUrl(settings.socials?.linkedin) && (
                  <a
                    href={settings.socials!.linkedin!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={isBn ? "লিংকডইনে নূর সোলার এনার্জির সাথে যুক্ত হন" : "Connect with Noor Solar Energy on LinkedIn"}
                    className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-[#052F25] hover:bg-[#FEBE16] hover:text-[#052F25] border border-white/15 text-white flex items-center justify-center transition-all hover:scale-105 shadow-2xs"
                  >
                    <LinkedinIcon className="w-5 h-5" />
                  </a>
                )}

                <a
                  href={`https://wa.me/${whatsappNum}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={isBn ? "হোয়াটসঅ্যাপে নূর সোলার এনার্জির সাথে চ্যাট করুন" : "Chat with Noor Solar Energy on WhatsApp"}
                  className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-[#052F25] hover:bg-[#FEBE16] hover:text-[#052F25] border border-white/15 text-white flex items-center justify-center transition-all hover:scale-105 shadow-2xs"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>

                {isValidSocialUrl(settings.socials?.youtube) && (
                  <a
                    href={settings.socials!.youtube!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={isBn ? "ইউটিউবে নূর সোলার এনার্জির ভিডিও দেখুন" : "Watch Noor Solar Energy on YouTube"}
                    className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-[#052F25] hover:bg-[#FEBE16] hover:text-[#052F25] border border-white/15 text-white flex items-center justify-center transition-all hover:scale-105 shadow-2xs"
                  >
                    <YoutubeIcon className="w-5 h-5" />
                  </a>
                )}

                {isValidSocialUrl(settings.socials?.twitter) && (
                  <a
                    href={settings.socials!.twitter!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={isBn ? "এক্সে নূর সোলার এনার্জি অনুসরণ করুন" : "Follow Noor Solar Energy on X"}
                    className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-[#052F25] hover:bg-[#FEBE16] hover:text-[#052F25] border border-white/15 text-white flex items-center justify-center transition-all hover:scale-105 shadow-2xs"
                  >
                    <TwitterIcon className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>

          </div>

        {/* Sub-Footer Copyright, Legal & Developer Credits */}
        <div className="py-4 sm:py-5 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] font-mono text-white/60">
          <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
            <span>&copy; {currentYear} {isBn ? "নূর সোলার এনার্জি। সর্বস্বত্ব সংরক্ষিত।" : "Noor Solar Energy. All rights reserved."}</span>
          </div>

          {/* Developer Credit */}
          <div className="flex items-center gap-2 text-white/70 flex-wrap justify-center">
            <span>{isBn ? "ডেভেলপমেন্ট:" : "Developed by:"}</span>
            <a
              href="https://artxdev.tech/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FEBE16] hover:underline font-semibold transition-colors"
            >
              artxdev.tech
            </a>
            <span className="text-white/30">•</span>
            <a
              href="https://www.linkedin.com/in/mdtarek404/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-white hover:text-[#FEBE16] transition-colors"
              title="MD Tarek | LinkedIn"
            >
              <LinkedinIcon className="w-3.5 h-3.5 text-[#0A66C2] bg-white rounded-[2px]" />
              <span className="font-medium underline decoration-white/30 hover:decoration-[#FEBE16]">MD Tarek</span>
            </a>
          </div>

          <nav aria-label="Legal" className="flex items-center gap-4 flex-wrap justify-center md:justify-end">
            <Link href="/contact" className="hover:text-[#FEBE16] inline-flex items-center justify-center px-1 min-h-[36px] transition-colors">
              {isBn ? "বাণিজ্যিক শর্তাবলী" : "Wholesale Terms"}
            </Link>
            <span>&bull;</span>
            <span className="inline-flex items-center min-h-[36px]">{isBn ? "বাংলাদেশের B2B শিল্পের জন্য নিবেদিত" : "Made for B2B Bangladesh"}</span>
          </nav>
        </div>

        {/* Bottom Brand Watermark — theme-matched to Noor Solar emerald green */}
        <div className="relative w-[calc(100%+3rem)] sm:w-[calc(100%+6rem)] lg:w-[calc(100%+8rem)] -mx-6 sm:-mx-12 lg:-mx-16 bg-[#052F25] border-t border-[#0B513E]/40 select-none pointer-events-none pt-6 sm:pt-10 lg:pt-12 overflow-hidden">
          <div className="flex items-center justify-start gap-2 sm:gap-4 lg:gap-5 px-6 sm:px-12 lg:px-16 translate-y-[28%] sm:translate-y-[30%]">
            {/* 4-Point Star */}
            <svg
              viewBox="0 0 100 100"
              fill="currentColor"
              className="w-[0.65em] h-[0.65em] text-[#0A5E48] shrink-0"
              style={{ fontSize: "clamp(4rem, 16vw, 14rem)" }}
              aria-hidden="true"
            >
              <path d="M50 0C50 27.614 27.614 50 0 50C27.614 50 50 72.386 50 100C50 72.386 72.386 50 100 50C72.386 50 50 27.614 50 0Z" />
            </svg>

            {/* Brand Name */}
            <span
              className="font-semibold whitespace-nowrap select-none leading-none text-[clamp(4rem,16vw,14rem)] tracking-[-0.02em] text-[#0A5E48]"
              style={{
                fontFamily: "'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif",
              }}
            >
              Noor Solar
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
