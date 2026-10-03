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
        ? "সোলার প্যানেল সরবরাহকারী বাংলাদেশ | সোলার প্যানেল এর দাম ২০২৬ ও পাইকারি সোলার ইকুইপমেন্ট — নূর সোলার এনার্জি"
        : "Solar Panel Supplier Bangladesh | Solar Battery & Inverter Wholesale — Noor Solar Energy",
      template: isBn
        ? "%s | নূর সোলার এনার্জি"
        : "%s | Noor Solar Energy",
    },
    description: isBn
      ? "বাংলাদেশে বাণিজ্যিক সোলার প্যানেল, সোলার প্যাকেজ ও ফুল সেট, LiFePO4 লিথিয়াম ব্যাটারি ও ইনভার্টারের সরাসরি আমদানিকারক ও পাইকারি সরবরাহকারী।"
      : "Direct importer and bulk B2B wholesale supplier of Tier-1 solar panels, LiFePO4 battery storage, and solar inverters in Bangladesh. Official warranties and container-scale supply.",
    keywords: isBn
      ? [
          "সোলার প্যানেল সরবরাহকারী বাংলাদেশ",
          "সোলার প্যানেল এর দাম 2026",
          "সোলার প্যানেল প্রাইস ইন বাংলাদেশ",
          "সোলার প্যানেল ফুল সেট",
          "সোলার প্যানেল প্যাকেজ",
          "২০০ ওয়াট সোলার প্যানেলের দাম কত",
          "১০০০ ওয়াট সোলার প্যানেলের দাম কত",
          "সোলার ব্যাটারি সরবরাহকারী বাংলাদেশ",
          "সোলার ইনভার্টার সরবরাহকারী বাংলাদেশ",
          "LiFePO4 ব্যাটারি বাংলাদেশ",
          "ইন্ডাস্ট্রিয়াল সোলার সলিউশন বাংলাদেশ",
          "নূর সোলার এনার্জি",
          "Noor Solar Energy",
        ]
      : [
          "solar panel supplier Bangladesh",
          "solar equipment supplier Bangladesh",
          "solar panel wholesale Bangladesh",
          "solar inverter supplier Bangladesh",
          "LiFePO4 battery supplier Bangladesh",
          "solar battery supplier Bangladesh",
          "solar energy solutions Bangladesh",
          "commercial solar supplier Bangladesh",
          "TOPCon solar panel Bangladesh",
          "industrial solar solution Bangladesh",
          "solar solution for factory Bangladesh",
          "solar EPC supplier Bangladesh",
          "solar panel price in Bangladesh 2026",
          "Noor Solar Energy",
        ],
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
        ? "সোলার প্যানেল সরবরাহকারী বাংলাদেশ | সোলার ব্যাটারি ও ইনভার্টার পাইকারি — নূর সোলার এনার্জি"
        : "Solar Panel Supplier Bangladesh | Solar Battery & Inverter Wholesale — Noor Solar Energy",
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
        ? "সোলার প্যানেল সরবরাহকারী বাংলাদেশ | সোলার ব্যাটারি ও ইনভার্টার পাইকারি — নূর সোলার এনার্জি"
        : "Solar Panel Supplier Bangladesh | Solar Battery & Inverter Wholesale — Noor Solar Energy",
      description: isBn
        ? "বাংলাদেশে বাণিজ্যিক সোলার প্যানেল, LiFePO4 ব্যাটারি স্টোরেজ এবং সোলার ইনভার্টারের সরাসরি আমদানিকারক ও পাইকারি সরবরাহকারী।"
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

  const fontClasses = `${scoutieSans.variable} ${tiroBangla.variable} ${inter.variable} ${jetbrainsMono.variable}`;

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${fontClasses} max-w-full overflow-x-clip`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function purgeExtensionInjections() {
                  try {
                    var selectors = [
                      '#rankseo-toolbar',
                      '.rankseo-pos-top',
                      '[id^="rankseo"]',
                      '[class*="rankseo"]',
                      'grammarly-extension',
                      'grammarly-popups'
                    ];
                    for (var s = 0; s < selectors.length; s++) {
                      var found = document.querySelectorAll(selectors[s]);
                      for (var i = 0; i < found.length; i++) {
                        if (found[i] && found[i].parentNode) {
                          found[i].parentNode.removeChild(found[i]);
                        }
                      }
                    }
                    if (document.body && document.body.hasAttribute('cz-shortcut-listen')) {
                      document.body.removeAttribute('cz-shortcut-listen');
                    }
                  } catch (e) {}
                }
                purgeExtensionInjections();
                if (typeof MutationObserver !== 'undefined') {
                  var observer = new MutationObserver(function() {
                    purgeExtensionInjections();
                  });
                  observer.observe(document.documentElement, {
                    childList: true,
                    subtree: true
                  });
                  window.addEventListener('DOMContentLoaded', purgeExtensionInjections);
                  window.addEventListener('load', function() {
                    purgeExtensionInjections();
                    setTimeout(function() {
                      observer.disconnect();
                    }, 4000);
                  });
                }
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-screen bg-[#F7F8F5] text-[#17251F] antialiased selection:bg-[#FEBE16] selection:text-[#052F25] max-w-full overflow-x-clip">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SmoothScrollProvider>
            <div suppressHydrationWarning className="flex flex-col min-h-screen bg-[#F7F8F5] w-full max-w-full overflow-x-clip">
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
              <main className="flex-grow pb-32 lg:pb-0 flex flex-col w-full max-w-full overflow-x-clip">
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
