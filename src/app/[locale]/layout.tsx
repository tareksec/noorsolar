import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#052F25",
};

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
      canonical: isBn ? "/" : "/en",
      languages: {
        bn: "/",
        en: "/en",
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
      siteName: isBn ? "নূর সোলার এনার্জি" : "Noor Solar Energy",
      images: [
        {
          url: `${siteUrl}/opengraph-image.png`,
          secureUrl: `${siteUrl}/opengraph-image.png`,
          width: 1200,
          height: 630,
          alt: isBn ? "নূর সোলার এনার্জি" : "Noor Solar Energy",
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isBn
        ? "নূর সোলার এনার্জি — সোলার প্যানেল, ব্যাটারি ও ইনভার্টার পাইকারি সরবরাহকারী"
        : "Noor Solar Energy — Solar Panels, Batteries & Inverters Wholesale",
      description: isBn
        ? "বাংলাদেশে বাণিজ্যিক সোলার প্যানেল, LiFePO4 ব্যাটারি স্টোরেজ এবং সোলার ইনভার্টারের সরাসরি আমদানিকারক ও পাইকারি সরবরাহকারী।"
        : "Direct importer and bulk B2B wholesale supplier of commercial solar panels, LiFePO4 battery storage, and solar inverters in Bangladesh.",
      images: [`${siteUrl}/opengraph-image.png`],
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
