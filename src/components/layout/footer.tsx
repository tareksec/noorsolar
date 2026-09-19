import React from "react";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone, Sun } from "lucide-react";
import { SiteConfig } from "@/lib/site-config";

interface FooterProps {
  settings: SiteConfig;
}

export function Footer({ settings }: FooterProps) {
  return (
    <footer className="bg-[#EDEDED] border-t border-[#DDE1DC] text-[#111311] pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#DDE1DC]">
          {/* Col 1 & 2: Brand & Philosophy */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#CEF23E] flex items-center justify-center font-bold text-[#111311] shadow-sm">
                <Sun className="w-5 h-5 text-[#111311]" />
              </div>
              <span className="font-bold text-lg tracking-tight text-[#111311]">
                {settings.companyName}
              </span>
            </div>
            <p className="text-sm text-[#5C605C] leading-relaxed max-w-sm">
              {settings.description}
            </p>
            <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-full bg-white border border-[#DDE1DC] text-[12px] font-mono text-[#111311] w-fit">
              <span className="w-2 h-2 rounded-full bg-[#CEF23E]"></span>
              <span>Direct Importer & Wholesale Distributor BD</span>
            </div>
          </div>

          {/* Col 3: Equipment Lines */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#111311] mb-4">
              Products
            </h3>
            <ul className="space-y-2.5 text-sm text-[#5C605C]">
              <li>
                <Link
                  href="/category/solar-panels"
                  className="hover:text-[#111311] transition-colors inline-flex items-center gap-1 group"
                >
                  <span>Solar Panels</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#111311]" />
                </Link>
              </li>
              <li>
                <Link
                  href="/category/lithium-batteries"
                  className="hover:text-[#111311] transition-colors inline-flex items-center gap-1 group"
                >
                  <span>Lithium-ion Batteries</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#111311]" />
                </Link>
              </li>
              <li>
                <Link
                  href="/category/solar-inverters"
                  className="hover:text-[#111311] transition-colors inline-flex items-center gap-1 group"
                >
                  <span>Solar Inverters</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#111311]" />
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-[#111311] transition-colors inline-flex items-center gap-1 group"
                >
                  <span>All Catalog Items</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#111311]" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Quick Navigation */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#111311] mb-4">
              Company
            </h3>
            <ul className="space-y-2.5 text-sm text-[#5C605C]">
              <li>
                <Link href="/about" className="hover:text-[#111311] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#111311] transition-colors">
                  Contact & Warehouse
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-[#111311] transition-colors">
                  B2B Order FAQ
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-[#111311] transition-colors text-xs font-mono">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Contact Block */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#111311] mb-4">
              Contact & Supply
            </h3>
            <ul className="space-y-3 text-xs text-[#5C605C]">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#111311] shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#111311] shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-[#111311] font-mono">
                  {settings.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#111311] shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-[#111311]">
                  {settings.email}
                </a>
              </li>
              <li className="text-[11px] font-mono text-[#5C605C] pt-1">
                {settings.hours}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5C605C]">
          <p>© {new Date().getFullYear()} {settings.companyName}. All rights reserved.</p>
          <p className="font-mono text-[11px]">
            Engineering Grade Solar Distribution &bull; Dhaka, Bangladesh
          </p>
        </div>
      </div>
    </footer>
  );
}
