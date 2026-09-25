import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { routing, Locale } from "@/i18n/routing";
import { inter, jetbrainsMono, scoutieSans, tiroBangla } from "@/lib/fonts";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { BackToTop } from "@/components/layout/back-to-top";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { RouteTransition } from "@/components/providers/route-transition";
import { SITE_URL } from "@/lib/site-config";
import { getSiteSettings } from "@/lib/data/settings";
import { hasVisibleBlogPosts } from "@/lib/data/blog";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isBn = locale === "bn";
  const siteUrl = SITE_URL;

  return {
    title: {
      default: isBn
        ? "নূর সোলার এনার্জি — সোলার প্যানেল, ব্যাটারি ও ইনভার্টার পাইকারি সরবরাহকারী"
        : "Noor Solar Energy — Solar Panels, Batteries & Inverters Wholesale",
      template: isBn
        ? "%s | নূর সোলার এনার্জি"
        : "%s | Noor Solar Energy",
    },
    description: isBn
      ? "বাংলাদেশে বাণিজ্যিক সোলার প্যানেল, LiFePO4 ব্যাটারি স্টোরেজ এবং সোলার ইনভার্টারের সরাসরি আমদানিকারক ও পাইকারি সরবরাহকারী।"
      : "Direct importer and bulk B2B wholesale supplier of commercial solar panels, LiFePO4 battery storage, and solar inverters in Bangladesh.",
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: isBn ? "/bn" : "/",
      languages: {
        en: "/",
        bn: "/bn",
        "x-default": "/",
      },
    },
    icons: {
      icon: [
        { url: "/icon.png", sizes: "512x512", type: "image/png" },
        { url: "/icons/favicon.png", sizes: "32x32", type: "image/png" },
      ],
      shortcut: "/icon.png",
      apple: [
        { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
    openGraph: {
      title: isBn
        ? "নূর সোলার এনার্জি — সোলার প্যানেল, ব্যাটারি ও ইনভার্টার পাইকারি সরবরাহকারী"
        : "Noor Solar Energy — Solar Panels, Batteries & Inverters Wholesale",
      description: isBn
        ? "বাংলাদেশে বাণিজ্যিক সোলার প্যানেল, LiFePO4 ব্যাটারি স্টোরেজ এবং সোলার ইনভার্টারের সরাসরি আমদানিকারক ও পাইকারি সরবরাহকারী।"
        : "Direct importer and bulk B2B wholesale supplier of commercial solar panels, LiFePO4 battery storage, and solar inverters in Bangladesh.",
      type: "website",
      locale: isBn ? "bn_BD" : "en_US",
      images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Noor Solar Energy" }],
    },
    twitter: {
      card: "summary_large_image",
      title: isBn
        ? "নূর সোলার এনার্জি — সোলার প্যানেল, ব্যাটারি ও ইনভার্টার পাইকারি সরবরাহকারী"
        : "Noor Solar Energy — Solar Panels, Batteries & Inverters Wholesale",
      description: isBn
        ? "বাংলাদেশে বাণিজ্যিক সোলার প্যানেল, LiFePO4 ব্যাটারি স্টোরেজ এবং সোলার ইনভার্টারের সরাসরি আমদানিকারক ও পাইকারি সরবরাহকারী।"
        : "Direct importer and bulk B2B wholesale supplier of commercial solar panels, LiFePO4 battery storage, and solar inverters in Bangladesh.",
      images: ["/opengraph-image.png"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate that the incoming locale is supported
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Fetch messages for next-intl provider
  const messages = await getMessages();

  const [settings, showBlog] = await Promise.all([
    getSiteSettings(locale),
    hasVisibleBlogPosts(),
  ]);

  const isBn = locale === "bn";
  const fontClasses = `${scoutieSans.variable} ${tiroBangla.variable} ${inter.variable} ${jetbrainsMono.variable}`;

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={fontClasses}
    >
      <head />
      <body suppressHydrationWarning className="min-h-screen bg-[#F7F8F5] text-[#17251F] antialiased selection:bg-[#FEBE16] selection:text-[#052F25]">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SmoothScrollProvider>
            <div className="flex flex-col min-h-screen bg-[#F7F8F5]">
              <Header
                phoneDisplay={settings.phoneDisplay}
                phoneRaw={settings.phone}
                showBlog={showBlog}
                currentLocale={locale}
              />
              <main className="flex-grow pb-10 sm:pb-0 flex flex-col">
                <RouteTransition>{children}</RouteTransition>
              </main>
              <Footer settings={settings} showBlog={showBlog} locale={locale} />
              <WhatsAppButton phone={settings.whatsapp} locale={locale} />
              <BackToTop locale={locale} />
              <MobileBottomNav />
            </div>
          </SmoothScrollProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
