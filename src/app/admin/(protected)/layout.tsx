import React from "react";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
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
} from "lucide-react";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Quote Inbox", href: "/admin/quotes", icon: MessageSquare },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Categories", href: "/admin/categories", icon: Layers },
    { label: "Blog", href: "/admin/blog", icon: BookOpen },
    { label: "Reviews", href: "/admin/reviews", icon: Star },
    { label: "Content", href: "/admin/content", icon: FileText },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#E4E7E4] flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-[#111311] text-white p-6 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand */}
          <Link href="/admin" className="flex items-center gap-3 mb-8">
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

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-[#A0A4A0] hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer controls */}
        <div className="pt-6 border-t border-white/10 mt-6 flex flex-col gap-3">
          <Link
            href="/"
            target="_blank"
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
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow p-4 sm:p-10 overflow-y-auto min-w-0 max-w-full">
        <div className="max-w-6xl mx-auto min-w-0 w-full">{children}</div>
      </div>
    </div>
  );
}
