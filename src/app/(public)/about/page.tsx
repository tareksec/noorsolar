import Image from "next/image";
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data/settings";
import { getCategories } from "@/lib/data/categories";
import { CategoryDock } from "@/components/sections/category-dock";
import { OrderingSteps } from "@/components/sections/ordering-steps";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
export const metadata: Metadata = {
  title: "About Noor Solar Energy",
  description: "Solar panels, lithium batteries and inverters for B2B buyers in Bangladesh. Learn about Noor Solar Energy and start your equipment enquiry.",
  openGraph: { title: "About Noor Solar Energy", description: "A focused catalog for solar equipment procurement.", url: "/about" },
};
export default async function AboutPage() {
  const [settings, categories] = await Promise.all([getSiteSettings(), getCategories()]);
  return <div className="pt-28 sm:pt-36 pb-20">
    <section className="page-shell mb-14"><div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
      <div className="contact-heading"><p className="eyebrow">About / {settings.companyName}</p><h1>{settings.aboutHeadline}</h1><p>{settings.aboutBody || settings.description}</p><div className="flex flex-wrap gap-3 mt-7"><Link href="/products" className="button button-lime">Explore the equipment<ArrowUpRight size={17} /></Link><Link href="/contact#quote-section" className="button button-outline">Talk to us</Link></div></div>
      <figure className="relative rounded-[32px] overflow-hidden bg-[#EDEDED]"><Image src="/photos/about-commercial-plant.webp" width={740} height={493} sizes="(max-width: 1023px) 90vw, 580px" className="w-full h-auto" alt="Solar panel arrays across a green landscape" loading="eager" /><figcaption className="absolute bottom-4 left-4 right-4 glass-card p-4 rounded-2xl text-xs">Solar generation, energy storage and power conversion.</figcaption></figure>
    </div></section>
    <section className="page-shell mb-7"><p className="eyebrow">Our focus</p><h2 className="text-3xl font-semibold tracking-tight mt-3">Three product lines. One clear process.</h2><p className="text-sm text-[#5C605C] max-w-2xl leading-relaxed mt-4">Browse the equipment, review model specifications and discuss the requirements of your project. Each enquiry starts with the products and quantities you need.</p></section>
    <CategoryDock categories={categories} />
    <OrderingSteps />
  </div>;
}

