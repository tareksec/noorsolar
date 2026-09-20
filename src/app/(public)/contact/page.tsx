import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data/settings";
import { getProductBySlug } from "@/lib/data/products";
import { ClosingCTA } from "@/components/sections/closing-cta";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact & request a quote",
  description: "Discuss solar panels, lithium batteries and inverters for your next bulk order. Send your requirements to Noor Solar Energy.",
  openGraph: { title: "Contact Noor Solar Energy", description: "Get in touch about solar equipment and bulk quotations.", url: "/contact" },
};
export default async function ContactPage({ searchParams }: { searchParams: Promise<{ product?: string }> }) {
  const { product: slug } = await searchParams;
  const [settings, selected] = await Promise.all([getSiteSettings(), slug ? getProductBySlug(slug) : null]);
  return (
    <div className="pt-28 sm:pt-36 pb-10">
      <div className="page-shell contact-heading">
        <p className="eyebrow">Contact / Commercial enquiries</p>
        <h1>Good projects start<br />with a conversation.</h1>
        <p>Tell us what you're sourcing. Use the form below to request pricing, check availability or discuss specifications.</p>
        {slug && !selected && <p role="status" className="mt-4">That product is no longer available. You can still send a general enquiry or <Link className="underline" href="/products">browse the catalog</Link>.</p>}
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

