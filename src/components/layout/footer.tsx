import React from "react";
import Link from "next/link";
import { SiteConfig } from "@/lib/site-config";

interface FooterProps {
  settings: SiteConfig;
}

export function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full px-3 sm:px-6 lg:px-8 pb-6 sm:pb-8 pt-4">
      <div className="max-w-7xl mx-auto rounded-[32px] sm:rounded-[40px] bg-[#f7f8f7] border border-white/80 shadow-[0_4px_30px_rgba(0,0,0,0.03)] overflow-hidden pt-12 sm:pt-16 px-6 sm:px-12 lg:px-16 flex flex-col justify-between">
        {/* Top Navigation Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 lg:gap-12 pb-12 sm:pb-16 text-left">
          {/* Col 1: Info & Address */}
          <div>
            <h3 className="font-semibold text-sm sm:text-base text-[#111311] mb-5">
              Info & Address
            </h3>
            <p className="text-sm text-[#4B5563] leading-relaxed mb-6 max-w-[240px]">
              {settings.address || "1330 Disk Rd, Anchorage, Alaska, United States"}
            </p>
            <div className="space-y-1.5 text-sm">
              <a
                href={`tel:${settings.phone || "+66105856978"}`}
                className="block text-[#4B5563] hover:text-[#111311] transition-colors"
              >
                {settings.phoneDisplay || "+661 058 56978"}
              </a>
              <a
                href={`mailto:${settings.email || "Hello@energy.com"}`}
                className="block text-[#4B5563] hover:text-[#111311] transition-colors"
              >
                {settings.email || "Hello@energy.com"}
              </a>
            </div>
          </div>

          {/* Col 2: Main Pages */}
          <div>
            <h3 className="font-semibold text-sm sm:text-base text-[#111311] mb-5">
              Main Pages
            </h3>
            <ul className="space-y-3 text-sm text-[#4B5563]">
              <li>
                <Link href="/" className="hover:text-[#111311] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-[#111311] transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-[#111311] transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-[#111311] transition-colors">
                  Packages
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Inner Pages */}
          <div>
            <h3 className="font-semibold text-sm sm:text-base text-[#111311] mb-5">
              Inner Pages
            </h3>
            <ul className="space-y-3 text-sm text-[#4B5563]">
              <li>
                <Link href="/about" className="hover:text-[#111311] transition-colors">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-[#111311] transition-colors">
                  Blogs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#111311] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Social Link */}
          <div>
            <h3 className="font-semibold text-sm sm:text-base text-[#111311] mb-5">
              Social Link
            </h3>
            <ul className="space-y-3 text-sm text-[#4B5563]">
              <li>
                <a
                  href={settings.socials?.facebook || "https://facebook.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#111311] transition-colors"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#111311] transition-colors"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#111311] transition-colors"
                >
                  Youtube
                </a>
              </li>
              <li>
                <a
                  href={settings.socials?.linkedin || "https://linkedin.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#111311] transition-colors"
                >
                  Linkedin
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Legal */}
          <div>
            <h3 className="font-semibold text-sm sm:text-base text-[#111311] mb-5">
              Legal
            </h3>
            <ul className="space-y-3 text-sm text-[#4B5563]">
              <li>
                <Link href="/privacy" className="hover:text-[#111311] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li className="text-[#4B5563]">
                ©{currentYear} Energy
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Giant ENERGY Brand Watermark */}
        <div className="w-full select-none pointer-events-none pt-4 pb-0 overflow-hidden flex items-end justify-center">
          <span className="font-extrabold tracking-[0.06em] text-center uppercase leading-[0.82] text-[clamp(4.8rem,18.5vw,17rem)] text-transparent bg-clip-text bg-gradient-to-b from-[#8FA8A0]/50 via-[#8FA8A0]/25 to-transparent">
            ENERGY
          </span>
        </div>
      </div>
    </footer>
  );
}
