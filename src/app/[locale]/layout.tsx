import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { routing, Locale } from "@/i18n/routing";
import { inter, jetbrainsMono, hindSiliguri } from "@/lib/fonts";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { RouteTransition } from "@/components/providers/route-transition";
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    title: {
      default: isBn
        ? "নূর সোলার এনার্জি — সোলার প্যানেল, ব্যাটারি ও ইনভার্টার"
        : "Noor Solar Energy — Solar Panels, Batteries & Inverters",
      template: isBn
        ? "%s | নূর সোলার এনার্জি"
        : "%s | Noor Solar Energy",
    },
    description: isBn
      ? "বাংলাদেশে উচ্চ-দক্ষতাসম্পন্ন সোলার প্যানেল, লিথিয়াম-আয়ন ব্যাটারি এবং সোলার ইনভার্টারের সরাসরি আমদানিকারক ও পাইকারি সরবরাহকারী।"
      : "Direct importer and bulk supplier of solar panels, Lithium-ion Batteries, and Solar Inverters in Bangladesh.",
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
      icon: "/icon.png",
      shortcut: "/icon.png",
      apple: "/apple-icon.png",
    },
    openGraph: {
      title: isBn
        ? "নূর সোলার এনার্জি — সোলার প্যানেল, ব্যাটারি ও ইনভার্টার"
        : "Noor Solar Energy — Solar Panels, Batteries & Inverters",
      description: isBn
        ? "বাংলাদেশে উচ্চ-দক্ষতাসম্পন্ন সোলার প্যানেল, লিথিয়াম-আয়ন ব্যাটারি এবং সোলার ইনভার্টারের সরাসরি আমদানিকারক ও পাইকারি সরবরাহকারী।"
        : "Direct importer and bulk supplier of solar panels, Lithium-ion Batteries, and Solar Inverters in Bangladesh.",
      type: "website",
      locale: isBn ? "bn_BD" : "en_US",
      images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Noor Solar Energy" }],
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
  const fontClasses = `${inter.variable} ${jetbrainsMono.variable} ${isBn ? hindSiliguri.variable : ""}`;

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={fontClasses}
    >
      <head>
        <noscript>
          <style dangerouslySetInnerHTML={{ __html: "#preloader{display:none!important}" }} />
        </noscript>
        <script
          dangerouslySetInnerHTML={{
            __html: `try { if (sessionStorage.getItem("noor-preloader-seen") === "1" || new URLSearchParams(location.search).get("preloader") === "off") document.documentElement.dataset.preloader = "skip"; } catch (_) {}`,
          }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-screen bg-[#E4E7E4] text-[#111311] antialiased selection:bg-[#CEF23E] selection:text-[#111311]">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SmoothScrollProvider>
            <div className="flex flex-col min-h-screen bg-[#E4E7E4]">
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
            </div>
          </SmoothScrollProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
