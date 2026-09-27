"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { logoutAdminAction } from "@/app/admin/actions/auth";
import {
  LayoutDashboard,
  Layers,
  Package,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  FileText,
  BookOpen,
  Star,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Quote Inbox", href: "/admin/quotes", icon: MessageSquare },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Layers },
  { label: "Blog", href: "/admin/blog", icon: BookOpen },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Content", href: "/admin/content", icon: FileText },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <aside className="w-full md:w-64 bg-[#111311] text-white p-4 md:p-6 shrink-0 md:min-h-screen md:sticky md:top-0 md:h-screen flex flex-col justify-between">
      {/* Brand & Mobile Toggle Header */}
      <div className="flex items-center justify-between md:mb-8">
        <Link
          href="/admin"
          className="flex items-center gap-3"
          onClick={() => setIsOpen(false)}
        >
          <Image
            src="/brand/logo-white.png"
            alt="Noor Solar Energy"
            width={140}
            height={36}
            className="h-8 w-auto object-contain"
          />
          <div>
            <span className="text-[9px] font-mono text-[#A0A4A0] uppercase">Admin Shell</span>
          </div>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close admin menu" : "Open admin menu"}
          className="md:hidden p-2 rounded-xl text-[#A0A4A0] hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#CEF23E]/50 cursor-pointer"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Navigation & Controls: Collapsible on mobile, flex column on desktop */}
      <div
        className={`${
          isOpen ? "flex flex-col mt-4 pt-4 border-t border-white/10" : "hidden"
        } md:flex md:flex-col md:flex-grow md:justify-between md:mt-0 md:border-0`}
      >
        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                  isActive
                    ? "text-[#CEF23E] bg-white/10 font-semibold"
                    : "text-[#A0A4A0] hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer controls */}
        <div className="pt-6 border-t border-white/10 mt-6 flex flex-col gap-3">
          <Link
            href="/"
            target="_blank"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between text-xs text-[#A0A4A0] hover:text-white transition-colors"
          >
            <span>Live Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <form action={logoutAdminAction}>
            <button
              type="submit"
              id="btn-admin-logout"
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
