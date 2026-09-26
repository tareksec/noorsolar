import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { routing, Locale } from "@/i18n/routing";
import { inter, jetbrainsMono, scoutieSans, tiroBangla } from "@/lib/fonts";
import { Header, MobileTopBar } from "@/components/layout/header";
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
        ? "à¦¨à§‚à¦° à¦¸à§‹à¦²à¦¾à¦° à¦à¦¨à¦¾à¦°à§à¦œà¦¿ â€” à¦¸à§‹à¦²à¦¾à¦° à¦ªà§à¦¯à¦¾à¦¨à§‡à¦², à¦¬à§à¦¯à¦¾à¦Ÿà¦¾à¦°à¦¿ à¦“ à¦‡à¦¨à¦­à¦¾à¦°à§à¦Ÿà¦¾à¦° à¦ªà¦¾à¦‡à¦•à¦¾à¦°à¦¿ à¦¸à¦°à¦¬à¦°à¦¾à¦¹à¦•à¦¾à¦°à§€"
        : "Noor Solar Energy â€” Solar Panels, Batteries & Inverters Wholesale",
      template: isBn
        ? "%s | à¦¨à§‚à¦° à¦¸à§‹à¦²à¦¾à¦° à¦à¦¨à¦¾à¦°à§à¦œà¦¿"
        : "%s | Noor Solar Energy",
    },
    description: isBn
      ? "à¦¬à¦¾à¦‚à¦²à¦¾à¦¦à§‡à¦¶à§‡ à¦¬à¦¾à¦£à¦¿à¦œà§à¦¯à¦¿à¦• à¦¸à§‹à¦²à¦¾à¦° à¦ªà§à¦¯à¦¾à¦¨à§‡à¦², LiFePO4 à¦¬à§à¦¯à¦¾à¦Ÿà¦¾à¦°à¦¿ à¦¸à§à¦Ÿà§‹à¦°à§‡à¦œ à¦à¦¬à¦‚ à¦¸à§‹à¦²à¦¾à¦° à¦‡à¦¨à¦­à¦¾à¦°à§à¦Ÿà¦¾à¦°à§‡à¦° à¦¸à¦°à¦¾à¦¸à¦°à¦¿ à¦†à¦®à¦¦à¦¾à¦¨à¦¿à¦•à¦¾à¦°à¦• à¦“ à¦ªà¦¾à¦‡à¦•à¦¾à¦°à¦¿ à¦¸à¦°à¦¬à¦°à¦¾à¦¹à¦•à¦¾à¦°à§€à¥¤"
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
        ? "à¦¨à§‚à¦° à¦¸à§‹à¦²à¦¾à¦° à¦à¦¨à¦¾à¦°à§à¦œà¦¿ â€” à¦¸à§‹à¦²à¦¾à¦° à¦ªà§à¦¯à¦¾à¦¨à§‡à¦², à¦¬à§à¦¯à¦¾à¦Ÿà¦¾à¦°à¦¿ à¦“ à¦‡à¦¨à¦­à¦¾à¦°à§à¦Ÿà¦¾à¦° à¦ªà¦¾à¦‡à¦•à¦¾à¦°à¦¿ à¦¸à¦°à¦¬à¦°à¦¾à¦¹à¦•à¦¾à¦°à§€"
        : "Noor Solar Energy â€” Solar Panels, Batteries & Inverters Wholesale",
      description: isBn
        ? "à¦¬à¦¾à¦‚à¦²à¦¾à¦¦à§‡à¦¶à§‡ à¦¬à¦¾à¦£à¦¿à¦œà§à¦¯à¦¿à¦• à¦¸à§‹à¦²à¦¾à¦° à¦ªà§à¦¯à¦¾à¦¨à§‡à¦², LiFePO4 à¦¬à§à¦¯à¦¾à¦Ÿà¦¾à¦°à¦¿ à¦¸à§à¦Ÿà§‹à¦°à§‡à¦œ à¦à¦¬à¦‚ à¦¸à§‹à¦²à¦¾à¦° à¦‡à¦¨à¦­à¦¾à¦°à§à¦Ÿà¦¾à¦°à§‡à¦° à¦¸à¦°à¦¾à¦¸à¦°à¦¿ à¦†à¦®à¦¦à¦¾à¦¨à¦¿à¦•à¦¾à¦°à¦• à¦“ à¦ªà¦¾à¦‡à¦•à¦¾à¦°à¦¿ à¦¸à¦°à¦¬à¦°à¦¾à¦¹à¦•à¦¾à¦°à§€à¥¤"
        : "Direct importer and bulk B2B wholesale supplier of commercial solar panels, LiFePO4 battery storage, and solar inverters in Bangladesh.",
      type: "website",
      locale: isBn ? "bn_BD" : "en_US",
      images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Noor Solar Energy" }],
    },
    twitter: {
      card: "summary_large_image",
      title: isBn
        ? "à¦¨à§‚à¦° à¦¸à§‹à¦²à¦¾à¦° à¦à¦¨à¦¾à¦°à§à¦œà¦¿ â€” à¦¸à§‹à¦²à¦¾à¦° à¦ªà§à¦¯à¦¾à¦¨à§‡à¦², à¦¬à§à¦¯à¦¾à¦Ÿà¦¾à¦°à¦¿ à¦“ à¦‡à¦¨à¦­à¦¾à¦°à§à¦Ÿà¦¾à¦° à¦ªà¦¾à¦‡à¦•à¦¾à¦°à¦¿ à¦¸à¦°à¦¬à¦°à¦¾à¦¹à¦•à¦¾à¦°à§€"
        : "Noor Solar Energy â€” Solar Panels, Batteries & Inverters Wholesale",
      description: isBn
        ? "à¦¬à¦¾à¦‚à¦²à¦¾à¦¦à§‡à¦¶à§‡ à¦¬à¦¾à¦£à¦¿à¦œà§à¦¯à¦¿à¦• à¦¸à§‹à¦²à¦¾à¦° à¦ªà§à¦¯à¦¾à¦¨à§‡à¦², LiFePO4 à¦¬à§à¦¯à¦¾à¦Ÿà¦¾à¦°à¦¿ à¦¸à§à¦Ÿà§‹à¦°à§‡à¦œ à¦à¦¬à¦‚ à¦¸à§‹à¦²à¦¾à¦° à¦‡à¦¨à¦­à¦¾à¦°à§à¦Ÿà¦¾à¦°à§‡à¦° à¦¸à¦°à¦¾à¦¸à¦°à¦¿ à¦†à¦®à¦¦à¦¾à¦¨à¦¿à¦•à¦¾à¦°à¦• à¦“ à¦ªà¦¾à¦‡à¦•à¦¾à¦°à¦¿ à¦¸à¦°à¦¬à¦°à¦¾à¦¹à¦•à¦¾à¦°à§€à¥¤"
        : "Direct importer and bulk B2B wholesale supplier of commercial solar panels, LiFePO4 battery storage, and solar inverters in Bangladesh.",
      images: ["/opengraph-image.png"],
    },
    verification: {
      google:
        process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
        "qS2IKKiYU2nQx3bcf-bO0zBW-Ql-6-IXm4t_bBBQYck",
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
              <div className="hidden md:block">
              <Header
                phoneDisplay={settings.phoneDisplay}
                phoneRaw={settings.phone}
                showBlog={showBlog}
                currentLocale={locale}
              />
              </div>
              <div className="md:hidden">
                <MobileTopBar />
              </div>
              <main className="flex-grow pb-32 lg:pb-0 flex flex-col">
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
