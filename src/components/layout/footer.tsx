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
  Sun,
  ArrowRight,
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

const scriptLabel = {
  fontFamily: "'Segoe Script', 'Bradley Hand', 'Comic Sans MS', cursive",
} as const;

export function Footer({ settings, showBlog = false, locale }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const isBn = locale === "bn";

  const phoneRaw = (settings.phone || "+8801884611888").replace(/[^0-9+]/g, "");
  const phoneDisplay = settings.phoneDisplay || "+880 1884-611888";
  const email = settings.email || "info@noorsolaren.com";
  const address =
    settings.address ||
    (isBn
      ? "হাউস-৩৮ (ফ্ল্যাট-১এ), রোড-৫/এ, সেক্টর-৫, উত্তরা, ঢাকা-১২৩০"
      : "House-38 (Flat-1A), Road-5/A, Sector-5, Uttara, Dhaka-1230");
  const hours =
    settings.hours ||
    (isBn ? "শনি – বৃহস্পতি: সকাল ৯টা – সন্ধ্যা ৭টা" : "Sat – Thu: 9:00 AM – 7:00 PM");
  const whatsappNum = (settings.whatsapp || "8801884611888").replace(/[^0-9]/g, "");
  const whatsappDisplay = settings.whatsappDisplay || "+880 1884-611888";

  const socials = [
    isValidSocialUrl(settings.socials?.facebook) && {
      href: settings.socials!.facebook!,
      label: isBn ? "ফেসবুক" : "Facebook",
      Icon: FacebookIcon,
    },
    isValidSocialUrl(settings.socials?.twitter) && {
      href: settings.socials!.twitter!,
      label: isBn ? "এক্স" : "X",
      Icon: TwitterIcon,
    },
    isValidSocialUrl(settings.socials?.linkedin) && {
      href: settings.socials!.linkedin!,
      label: isBn ? "লিংকডইন" : "LinkedIn",
      Icon: LinkedinIcon,
    },
    isValidSocialUrl(settings.socials?.youtube) && {
      href: settings.socials!.youtube!,
      label: isBn ? "ইউটিউব" : "YouTube",
      Icon: YoutubeIcon,
    },
  ].filter(Boolean) as Array<{
    href: string;
    label: string;
    Icon: ({ className }: { className?: string }) => React.JSX.Element;
  }>;

  const catalogLinks = [
    { href: "/products?category=solar-panels", label: isBn ? "সোলার প্যানেল" : "Solar Panels" },
    { href: "/products?category=lithium-batteries", label: isBn ? "লিথিয়াম ব্যাটারি" : "Lithium Batteries" },
    { href: "/products?category=solar-inverters", label: isBn ? "সোলার ইনভার্টার" : "Solar Inverters" },
    { href: "/products", label: isBn ? "সব প্রোডাক্ট" : "All Products" },
    { href: "/quote", label: isBn ? "কোটেশন নিন" : "Request Quote" },
  ];

  const companyLinks = [
    { href: "/projects", label: isBn ? "প্রকল্প রেফারেন্স" : "Projects & Proof" },
    { href: "/reviews", label: isBn ? "গ্রাহক মতামত" : "Client Reviews" },
    { href: "/about", label: isBn ? "আমাদের সম্পর্কে" : "About" },
    { href: "/contact", label: isBn ? "যোগাযোগ" : "Contact" },
    { href: "/certifications", label: isBn ? "সার্টিফিকেশন" : "Certifications" },
    { href: "/#faq", label: "FAQ" },
    ...(showBlog ? [{ href: "/blog", label: isBn ? "ব্লগ" : "Blog" }] : []),
  ];

  return (
    <footer className="relative w-full overflow-hidden px-3 pb-3 pt-8 sm:px-6 sm:pt-10 lg:px-8">
      <div className="relative z-10 mx-auto grid max-w-7xl gap-3 lg:grid-cols-[290px_1fr]">
        {/* Left — brand card */}
        <div className="relative flex min-h-[330px] flex-col justify-between overflow-hidden rounded-[22px] bg-gradient-to-b from-[#0B513E] via-[#074031] to-[#052F25] p-6 text-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#FEBE16]/15 blur-2xl"
          />
          <Link href="/" className="relative inline-flex w-fit items-center" aria-label="Noor Solar Energy — home">
            <Image
              src="/brand/logo-white.png"
              alt="Noor Solar Energy"
              width={168}
              height={42}
              className="h-9 w-auto object-contain"
            />
          </Link>

          <div className="relative">
            <p className="max-w-[220px] text-[15px] font-medium leading-snug text-white">
              {isBn ? "স্মার্টার সোলার ডিস্ট্রিবিউশন," : "Smarter solar distribution,"}
              <span className="block font-normal text-white/60">
                {isBn ? "বাংলাদেশের জন্য তৈরি।" : "built for Bangladesh."}
              </span>
            </p>

            <div className="mt-4 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/25 py-1 pl-2 pr-2.5 text-[11px] text-white/85 w-fit">
              <Image src="/photos/bsrea-logo.png" alt="BSREA" width={18} height={18} className="h-[18px] w-[18px] object-contain" />
              <span className="font-medium">{isBn ? "BSREA নিবন্ধিত সদস্য" : "BSREA Registered Member"}</span>
            </div>

            <div className="mt-5">
              <p style={scriptLabel} className="text-[13px] italic text-white/70">
                {isBn ? "যুক্ত থাকুন!" : "Stay in touch!"}
              </p>
              <div className="mt-2 flex items-center gap-2">
                {socials.map(({ href, label, Icon }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-black/45 text-white transition-colors hover:bg-[#FEBE16] hover:text-[#052F25]"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
                <a
                  href={`https://wa.me/${whatsappNum}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-black/45 text-white transition-colors hover:bg-[#FEBE16] hover:text-[#052F25]"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right — links + contact + CTA card */}
        <div className="relative overflow-hidden rounded-[22px] bg-[#F1F4F1] p-6 sm:p-8">
          {/* Floating badge */}
          <div className="absolute right-6 top-0 hidden flex-col items-center sm:flex">
            <div className="flex h-16 w-16 rotate-6 items-center justify-center rounded-[18px] bg-gradient-to-br from-[#FEBE16] to-[#0B513E] text-white shadow-[0_10px_24px_rgba(7,64,49,0.3)]">
              <Sun className="h-8 w-8" strokeWidth={2.2} />
            </div>
            <span style={scriptLabel} className="mt-1 -rotate-6 text-xs italic text-[#62706A]">
              {isBn ? "রোদে ভরসা?" : "Feeling sunny?"}
            </span>
          </div>

          <div className="grid gap-8 sm:grid-cols-3 sm:pr-24">
            <nav aria-label={isBn ? "ক্যাটালগ" : "Catalog"}>
              <p style={scriptLabel} className="text-sm italic text-[#62706A]">
                {isBn ? "ক্যাটালগ" : "Navigation"}
              </p>
              <ul className="mt-3 space-y-0.5">
                {catalogLinks.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="inline-flex items-center py-1 text-[13px] font-medium text-[#17251F] transition-colors hover:text-[#0B513E]"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label={isBn ? "কোম্পানি" : "Company"}>
              <p style={scriptLabel} className="text-sm italic text-[#62706A]">
                {isBn ? "কোম্পানি" : "Company"}
              </p>
              <ul className="mt-3 space-y-0.5">
                {companyLinks.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="inline-flex items-center py-1 text-[13px] font-medium text-[#17251F] transition-colors hover:text-[#0B513E]"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <a
                    href="https://drive.google.com/file/d/1GR4hILXnDjJblqNmrxRNnWH_M7It4Md2/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 py-1 text-[13px] font-medium text-[#17251F] transition-colors hover:text-[#0B513E]"
                  >
                    {isBn ? "অফিসিয়াল সনদ" : "Official Certificate"}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              </ul>
            </nav>

            <div>
              <p style={scriptLabel} className="text-sm italic text-[#62706A]">
                {isBn ? "যোগাযোগ" : "Contact"}
              </p>
              <ul className="mt-3 space-y-2 text-[13px] text-[#17251F]">
                <li>
                  <a href={`tel:${phoneRaw}`} className="flex items-center gap-2 font-medium hover:text-[#0B513E]">
                    <Phone className="h-3.5 w-3.5 shrink-0 text-[#0B513E]" />
                    {phoneDisplay}
                  </a>
                </li>
                <li>
                  <a
                    href={`https://wa.me/${whatsappNum}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 font-medium hover:text-[#0B513E]"
                  >
                    <MessageCircle className="h-3.5 w-3.5 shrink-0 text-[#0B513E]" />
                    {whatsappDisplay}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${email}`} className="flex items-center gap-2 hover:text-[#0B513E]">
                    <Mail className="h-3.5 w-3.5 shrink-0 text-[#0B513E]" />
                    <span className="break-all">{email}</span>
                  </a>
                </li>
                <li className="flex items-start gap-2 text-[#62706A]">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0B513E]" />
                  <span className="leading-snug">{address}</span>
                </li>
                <li className="flex items-center gap-2 text-xs text-[#62706A]">
                  <Clock className="h-3.5 w-3.5 shrink-0 text-[#0B513E]" />
                  {hours}
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-[#17251F]/8 pt-5 sm:flex-row sm:items-end sm:justify-between">
            <p className="text-xs text-[#62706A]">
              © {currentYear} {isBn ? "নূর সোলার এনার্জি। সর্বস্বত্ব সংরক্ষিত।" : "Noor Solar Energy. All rights reserved."}{" "}
              <span className="text-[#62706A]/60">•</span>{" "}
              <a href="https://artxdev.tech/" target="_blank" rel="noopener noreferrer" className="hover:text-[#0B513E] hover:underline">
                artxdev.tech
              </a>
            </p>

            <div className="sm:text-right">
              <p className="text-[15px] leading-snug text-[#17251F]">
                <span className="block text-[#62706A]">{isBn ? "সোলার এগিয়ে যাচ্ছে।" : "Solar moves fast."}</span>
                <span className="font-semibold">{isBn ? "নূরের সাথে এগিয়ে থাকুন।" : "Stay ahead with Noor."}</span>
              </p>
              <form action="/quote" method="get" className="mt-2.5 flex w-full max-w-[320px] items-center gap-1 rounded-full bg-white p-1 pl-4 shadow-[0_2px_10px_rgba(7,64,49,0.06)] sm:ml-auto">
                <label htmlFor="footer-quote-email" className="sr-only">
                  {isBn ? "ইমেইল ঠিকানা" : "Email address"}
                </label>
                <input
                  id="footer-quote-email"
                  name="email"
                  type="email"
                  required
                  placeholder={isBn ? "ইমেইল ঠিকানা লিখুন" : "Enter email address"}
                  className="w-full bg-transparent text-[13px] text-[#17251F] placeholder:text-[#62706A]/70 focus:outline-none"
                />
                <button
                  type="submit"
                  className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#17251F] px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#0B513E]"
                >
                  {isBn ? "কোটেশন" : "Subscribe"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Giant watermark */}
      <div aria-hidden="true" className="pointer-events-none relative z-0 mx-auto max-w-7xl select-none overflow-hidden">
        <p className="translate-y-[24%] whitespace-nowrap text-center font-display text-[clamp(3.5rem,14.5vw,12rem)] font-bold leading-none tracking-[-0.02em] text-[#17251F]/5">
          Noor Solar
        </p>
      </div>
    </footer>
  );
}
