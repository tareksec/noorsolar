import React from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { getSiteSettings } from "@/lib/data/settings";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <div className="flex flex-col min-h-screen bg-[#E4E7E4]">
      <Header
        phoneDisplay={settings.phoneDisplay}
        phoneRaw={settings.phone}
      />
      <main className="flex-grow pb-10 sm:pb-0">{children}</main>
      <Footer settings={settings} />
      <WhatsAppButton phone={settings.whatsapp} />
    </div>
  );
}
