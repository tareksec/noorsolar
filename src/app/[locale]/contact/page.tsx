import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getSiteSettings } from "@/lib/data/settings";
import { getProductBySlug } from "@/lib/data/products";
import { ClosingCTA } from "@/components/sections/closing-cta";
import Link from "next/link";

interface ContactPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isBn = locale === "bn";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://noorsolaren.com";

  return {
    title: isBn
      ? "যোগাযোগ ও ওয়্যারহাউস লজিস্টিকস — নূর সোলার এনার্জি"
      : "Contact & Warehouse Logistics — Noor Solar Energy",
    description: isBn
      ? "কন্টেইনার মূল্য নির্ধারণ, টেন্ডার স্পেসিফিকেশন এবং ওয়্যারহাউস পিকআপের জন্য নূর সোলার এনার্জির সাথে যোগাযোগ করুন।"
      : "Get in touch with Noor Solar Energy sales and logistics team for container pricing, tender specifications, and warehouse pickup.",
    alternates: {
      canonical: isBn ? `${siteUrl}/bn/contact` : `${siteUrl}/contact`,
      languages: {
        en: `${siteUrl}/contact`,
        bn: `${siteUrl}/bn/contact`,
        "x-default": `${siteUrl}/contact`,
      },
    },
    openGraph: {
      title: isBn
        ? "যোগাযোগ ও লজিস্টিকস — নূর সোলার এনার্জি"
        : "Contact & Warehouse Logistics — Noor Solar Energy",
      description: isBn
        ? "সরাসরি যোগাযোগের ঠিকানা, ওয়্যারহাউস পিকআপ লোকেশন এবং বাণিজ্যিক কোটেশন অনুরোধ।"
        : "Direct contact details, warehouse pickup locations, and commercial quotation request form.",
      url: isBn ? "/bn/contact" : "/contact",
      type: "website",
      locale: isBn ? "bn_BD" : "en_US",
    },
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const settings = await getSiteSettings(locale);

  const isBn = locale === "bn";

  return (
    <div className="pt-28 sm:pt-36 pb-24 bg-[#E4E7E4] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Contact Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white border border-[#DDE1DC] text-[11px] sm:text-xs font-mono text-[#111311] mb-3 max-w-full">
            <span className="w-2 h-2 rounded-full bg-[#CEF23E]"></span>
            <span className="truncate">{isBn ? "বাণিজ্যিক বিক্রয় ও সহায়তা" : "Commercial Sales & Support"}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#111311] break-words">
            {isBn ? "আমাদের সেলস ইঞ্জিনিয়ারদের সাথে কথা বলুন" : "Contact Our Sales Engineers"}
          </h1>
          <p className="text-sm sm:text-base text-[#5C605C] max-w-2xl mt-3">
            {isBn
              ? "ইন্ডাস্ট্রিয়াল রুফটপ প্ল্যান্ট, টেলিকম ব্যাটারি ব্যাকআপ বা কন্টেইনার স্কেল সোলার প্যানেল অর্ডার—আপনার প্রকল্পের সঠিক সরঞ্জামে আমরা প্রস্তুত।"
              : "Whether planning an industrial rooftop installation, telecom battery backup, or containerized solar panel order, we are ready to assist."}
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="p-6 rounded-3xl bg-white border border-[#DDE1DC]">
            <div className="w-10 h-10 rounded-full bg-[#EDEDED] flex items-center justify-center text-[#111311] mb-4">
              <Phone className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono text-[#5C605C] uppercase block mb-1">
              {isBn ? "সরাসরি ফোন" : "Direct Sales Phone"}
            </span>
            <a href={`tel:${settings.phone}`} className="text-base font-bold font-mono text-[#111311] hover:underline">
              {settings.phoneDisplay}
            </a>
            <span className="text-[11px] text-[#5C605C] block mt-1">
              {isBn ? "পাইকারি অর্ডারের জন্য সরাসরি কল করুন" : "Direct calls for wholesale orders"}
            </span>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#DDE1DC]">
            <div className="w-10 h-10 rounded-full bg-[#CEF23E] flex items-center justify-center text-[#111311] mb-4">
              <MessageCircle className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono text-[#5C605C] uppercase block mb-1">
              {isBn ? "হোয়াটসঅ্যাপ ডেস্ক" : "WhatsApp Desk"}
            </span>
            <a
              href={`https://wa.me/${settings.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="text-base font-bold font-mono text-[#111311] hover:underline"
            >
              {settings.whatsappDisplay}
            </a>
            <span className="text-[11px] text-[#5C605C] block mt-1">
              {isBn ? "তাৎক্ষণিক ডেটাশিট ও কোটেশন সুবিধা" : "Instant datasheet & quote delivery"}
            </span>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#DDE1DC]">
            <div className="w-10 h-10 rounded-full bg-[#EDEDED] flex items-center justify-center text-[#111311] mb-4">
              <Mail className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono text-[#5C605C] uppercase block mb-1">
              {isBn ? "অফিসিয়াল ইমেইল" : "Commercial Email"}
            </span>
            <a href={`mailto:${settings.email}`} className="text-base font-bold text-[#111311] hover:underline truncate block">
              {settings.email}
            </a>
            <span className="text-[11px] text-[#5C605C] block mt-1">
              {isBn ? "কর্পোরেট RFP ও টেন্ডার প্রস্তাব" : "Corporate RFPs & tenders"}
            </span>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#DDE1DC]">
            <div className="w-10 h-10 rounded-full bg-[#EDEDED] flex items-center justify-center text-[#111311] mb-4">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono text-[#5C605C] uppercase block mb-1">
              {isBn ? "অফিস ও ওয়্যারহাউস" : "Warehouse & Office"}
            </span>
            <p className="text-xs font-bold text-[#111311]">
              {settings.hours}
            </p>
            <span className="text-[11px] text-[#5C605C] block mt-1">
              {isBn ? "অ্যাপয়েন্টমেন্ট নিয়ে দেখা করুন" : "Visits by appointment"}
            </span>
          </div>
        </div>

        {/* Office & Logistics Depot Map Card */}
        <div className="p-8 sm:p-10 rounded-[36px] bg-white border border-[#DDE1DC] mb-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
              <span className="text-xs font-mono text-[#5C605C] uppercase block mb-1">
                {isBn ? "লজিস্টিকস ও সহায়তা" : "Logistics & Assistance"}
              </span>
              <h2 className="text-2xl font-bold text-[#111311]">
                {isBn ? "সেন্ট্রাল বাণিজ্যিক ডিপো ও টেকনিক্যাল অফিস" : "Central Commercial Depot & Technical Liaison"}
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#111311] bg-[#EDEDED] px-4 py-2 rounded-full">
              <MapPin className="w-4 h-4 text-[#111311]" />
              <span>{settings.address}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Interactive Styled Map Container */}
            <div className="lg:col-span-7 h-72 sm:h-80 rounded-2xl bg-[#EDEDED] border border-[#DDE1DC] relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#DDE1DC_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />
              <div className="relative z-10 flex flex-col items-center text-center p-6 glass-card rounded-2xl border border-white max-w-sm">
                <div className="w-10 h-10 rounded-full bg-[#CEF23E] flex items-center justify-center text-[#111311] mb-2 font-bold shadow-xs">
                  <Sun className="w-5 h-5 text-[#111311]" />
                </div>
                <span className="font-bold text-sm text-[#111311]">
                  {isBn ? "নূর সোলার এনার্জি সেন্ট্রাল অফিস" : "Noor Solar Energy Central Office"}
                </span>
                <span className="text-xs text-[#5C605C] mt-1">{settings.address}</span>
                <span className="text-[10px] font-mono text-[#111311] mt-3 px-2.5 py-1 rounded-full bg-[#EDEDED]">
                  {isBn ? "ওয়্যারহাউস লোডিং বে সুবিধা চালু" : "Warehouse Loading Bay Available"}
                </span>
              </div>
            </div>

            {/* Field Engineering Liaison Photo Card */}
            <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl bg-[#EDEDED] border border-[#DDE1DC]">
              <div className="relative aspect-16/10 w-full rounded-xl overflow-hidden mb-4 bg-white">
                <Image
                  src="/photos/contact-sales-desk.webp"
                  alt={isBn ? "নূর সোলার এনার্জির টেকনিক্যাল সেলস ইঞ্জিনিয়ার ফোনে সহায়তা দিচ্ছেন" : "Noor Solar Energy technical sales engineer providing phone consultation"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 400px"
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#111311] font-semibold mb-1">
                  <Headphones className="w-4 h-4 text-[#111311]" />
                  <span>{isBn ? "সরাসরি টেকনিক্যাল ডেস্ক" : "Direct Technical Desk"}</span>
                </div>
                <p className="text-xs text-[#5C605C] leading-relaxed">
                  {isBn
                    ? "স্ট্রিং ক্যালকুলেশন, সিঙ্গেল লাইন ডায়াগ্রাম (SLD) রিভিউ এবং ইনভার্টার ওয়ারেন্টি নথির জন্য আমাদের অভিজ্ঞ ইঞ্জিনিয়ারদের সাথে যোগাযোগ করুন।"
                    : "Connect with our qualified electrical engineers for string calculation, single-line diagram review, and inverter warranty documentation."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quotation / Inquiry Form */}
        <ClosingCTA
          phoneDisplay={settings.phoneDisplay}
          whatsappNumber={settings.whatsapp}
        />

      </div>
      <ClosingCTA key={selected?.product.id || "general"} phoneDisplay={settings.phoneDisplay} whatsappNumber={settings.whatsapp}
        headline={selected ? "Your equipment. Your requirements." : settings.closingCtaHeadline}
        subheadline={settings.closingCtaSubheadline}
        selectedProduct={selected ? { id: selected.product.id, slug: selected.product.slug, name: selected.product.name } : undefined} />
      <div className="page-shell"><div className="contact-methods">
        <div><p className="eyebrow">Email</p><a href={"mailto:" + settings.email}>{settings.email}</a></div>
        <div><p className="eyebrow">Address</p><p className="text-sm mt-3 leading-relaxed">{settings.address}</p></div>
        <div><p className="eyebrow">Opening hours</p><p className="text-sm mt-3 leading-relaxed">{settings.hours}</p></div>
      </div></div>
    </div>
  );
}

