import React from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { RouteTransition } from "@/components/providers/route-transition";
import { getSiteSettings } from "@/lib/data/settings";
import { hasVisibleBlogPosts } from "@/lib/data/blog";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, showBlog] = await Promise.all([
    getSiteSettings(),
    hasVisibleBlogPosts(),
  ]);

  return (
    <SmoothScrollProvider>
      <div className="flex flex-col min-h-screen bg-[#E4E7E4]">
        <Header
          phoneDisplay={settings.phoneDisplay}
          phoneRaw={settings.phone}
          showBlog={showBlog}
        />
        <main className="flex-grow pb-10 sm:pb-0 flex flex-col">
          <RouteTransition>{children}</RouteTransition>
        </main>
        <Footer settings={settings} showBlog={showBlog} />
        <WhatsAppButton phone={settings.whatsapp} />
      </div>
    </SmoothScrollProvider>
  );
}
