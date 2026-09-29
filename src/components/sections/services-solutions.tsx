"use client";

import React from "react";
import { usePathname } from "next/navigation";
import HorizontalFeatureReveal, {
  type FeatureRevealProperty,
} from "@/components/ui/horizontal-feature-reveal";

interface ServicesSolutionsProps {
  locale?: string;
}

const PROPERTIES_BN: FeatureRevealProperty[] = [
  {
    number: "০১",
    no: "1",
    imgClass: "img-1",
    titleClass: "property-title-1",
    contentClass: "property-content-1",
    title: "TOPCon সোলার প্যানেল",
    badge: "৩০ বছরের ওয়ারেন্টি",
    link: "/category/solar-panels",
    ctaText: "ক্যাটালগ ও স্পেসিফিকেশন দেখুন",
    image: "/photos/cat-solar-panels.webp",
    paragraphs: [
      "উচ্চ রূপান্তর দক্ষতা ও দীর্ঘস্থায়ী পারফরম্যান্সের জন্য আধুনিক N-Type TOPCon প্রযুক্তির টায়ার-১ সোলার প্যানেল।",
      "বাণিজ্যিক ও বৃহৎ সোলার প্রকল্পের জন্য ৫৮০–৭২০ Wp পাওয়ার রেঞ্জ এবং ৩০ বছরের নির্ভরযোগ্য পারফরম্যান্স ওয়ারেন্টি।",
    ],
    triggers: {
      img: { start: "-10% top", end: "10% top" },
      no: { start: "-1% top", end: "5% top" },
      title: { start: "-1% top", end: "5% top" },
      content: { start: "-1% top", end: "5% top" },
    },
  },
  {
    number: "০২",
    no: "2",
    imgClass: "img-2",
    titleClass: "property-title-2",
    contentClass: "property-content-2",
    title: "কমার্শিয়াল সোলার ইনভার্টার",
    badge: "৯৮.৬% এফিসিয়েন্সি",
    link: "/category/solar-inverters",
    ctaText: "ক্যাটালগ ও স্পেসিফিকেশন দেখুন",
    image: "/photos/cat-solar-inverters.webp",
    paragraphs: [
      "শিল্প ও বাণিজ্যিক স্থাপনার নিরবচ্ছিন্ন পাওয়ার আউটপুটের জন্য মাল্টি-MPPT গ্রিড-টাইড সোলার ইনভার্টার।",
      "১০ kW থেকে ২৫০ kW আউটপুট রেঞ্জ, IP65/IP66 ওয়াটারপ্রুফ বডি এবং আধুনিক স্ট্রিং মনিটরিং সুবিধা।",
    ],
    triggers: {
      img: { start: "-5% top", end: "35% top" },
      no: { start: "18% top", end: "23% top" },
      title: { start: "18% top", end: "23% top" },
      content: { start: "18% top", end: "23% top" },
    },
  },
  {
    number: "০৩",
    no: "3",
    imgClass: "img-3",
    titleClass: "property-title-3",
    contentClass: "property-content-3",
    title: "LiFePO4 এনার্জি স্টোরেজ (ESS)",
    badge: "৬,০০০+ সাইকেল",
    link: "/category/lithium-batteries",
    ctaText: "ক্যাটালগ ও স্পেসিফিকেশন দেখুন",
    image: "/photos/cat-lithium-batteries.webp",
    paragraphs: [
      "জিরো-ডাউনটাইম শিল্প ও বাণিজ্যিক ব্যাকআপের জন্য নিরাপদ ও দীর্ঘস্থায়ী LiFePO4 ব্যাটারি এনার্জি স্টোরেজ সিস্টেম।",
      "৫০ kWh থেকে ৫ MWh পর্যন্ত মডুলার ক্যাপাসিটি, স্মার্ট বিএমএস কন্ট্রোল এবং ৬,০০০+ ডিপ সাইকেল লাইফ।",
    ],
    triggers: {
      img: { start: "25% top", end: "65% top" },
      no: { start: "45% top", end: "50% top" },
      title: { start: "45% top", end: "50% top" },
      content: { start: "45% top", end: "50% top" },
    },
  },
  {
    number: "০৪",
    no: "4",
    imgClass: "img-4",
    titleClass: "property-title-4",
    contentClass: "property-content-4",
    title: "LiFePO4 পোর্টেবল পাওয়ার স্টেশন",
    badge: "নতুন সংযোজন",
    link: "/category/portable-power-stations",
    ctaText: "ক্যাটালগ ও স্পেসিফিকেশন দেখুন",
    image: "/photos/cat-portable-power-station.jpg",
    paragraphs: [
      "জরুরি ব্যাকআপ, ভ্রাম্যমাণ কাজ ও আউটডোর প্রজেক্টের জন্য ১০০০W পিওর সাইন ওয়েভ পোর্টেবল সোলার পাওয়ার স্টেশন।",
      "১০২৪ Wh LiFePO4 ব্যাটারি, ১.২ ঘণ্টায় দ্রুত ৮০% রিচার্জ এবং ইউপিএস ইনস্ট্যান্ট পাওয়ার সুইচিং সুবিধা।",
    ],
    triggers: {
      img: { start: "45% top", end: "85% top" },
      no: { start: "65% top", end: "70% top" },
      title: { start: "65% top", end: "70% top" },
      content: { start: "65% top", end: "70% top" },
    },
  },
];

const PROPERTIES_EN: FeatureRevealProperty[] = [
  {
    number: "01",
    no: "1",
    imgClass: "img-1",
    titleClass: "property-title-1",
    contentClass: "property-content-1",
    title: "TOPCon Solar Panels",
    badge: "30-Year Warranty",
    link: "/category/solar-panels",
    ctaText: "View Specifications & Stock",
    image: "/photos/cat-solar-panels.webp",
    paragraphs: [
      "Engineered with advanced N-Type TOPCon technology for ultra-high conversion efficiency and multi-decade commercial durability.",
      "Tier-1 certified high-efficiency panels delivering 580W-720W power output with 30-year performance warranty for solar farms and industrial rooftops.",
    ],
    triggers: {
      img: { start: "-10% top", end: "10% top" },
      no: { start: "-1% top", end: "5% top" },
      title: { start: "-1% top", end: "5% top" },
      content: { start: "-1% top", end: "5% top" },
    },
  },
  {
    number: "02",
    no: "2",
    imgClass: "img-2",
    titleClass: "property-title-2",
    contentClass: "property-content-2",
    title: "Commercial Solar Inverters",
    badge: "98.6% Efficiency",
    link: "/category/solar-inverters",
    ctaText: "View Specifications & Stock",
    image: "/photos/cat-solar-inverters.webp",
    paragraphs: [
      "High-efficiency commercial multi-MPPT solar inverters engineered for continuous maximum yield and heavy-duty grid stability.",
      "Features IP65/IP66 weatherproof design, 98.6%+ European efficiency, and intelligent string monitoring for commercial and industrial facilities.",
    ],
    triggers: {
      img: { start: "-5% top", end: "35% top" },
      no: { start: "18% top", end: "23% top" },
      title: { start: "18% top", end: "23% top" },
      content: { start: "18% top", end: "23% top" },
    },
  },
  {
    number: "03",
    no: "3",
    imgClass: "img-3",
    titleClass: "property-title-3",
    contentClass: "property-content-3",
    title: "LiFePO4 Energy Storage (ESS)",
    badge: "6,000+ Cycles",
    link: "/category/lithium-batteries",
    ctaText: "View Specifications & Stock",
    image: "/photos/cat-lithium-batteries.webp",
    paragraphs: [
      "Next-generation lithium iron phosphate energy storage systems engineered for continuous zero-downtime industrial backup power.",
      "Offering 6,000+ deep cycles, modular expansion from 50 kWh to 5 MWh, and automotive-grade intelligent battery management system (BMS).",
    ],
    triggers: {
      img: { start: "25% top", end: "65% top" },
      no: { start: "45% top", end: "50% top" },
      title: { start: "45% top", end: "50% top" },
      content: { start: "45% top", end: "50% top" },
    },
  },
  {
    number: "04",
    no: "4",
    imgClass: "img-4",
    titleClass: "property-title-4",
    contentClass: "property-content-4",
    title: "Portable Power Stations",
    badge: "New Release",
    link: "/category/portable-power-stations",
    ctaText: "View Specifications & Stock",
    image: "/photos/cat-portable-power-station.jpg",
    paragraphs: [
      "Plug-and-play portable solar power stations with 1000W AC pure sine wave output and rapid 1.2-hour wall or solar recharging.",
      "Safe, durable LiFePO4 cells with 3000+ cycles, built-in UPS fast transfer, and versatile outputs for field engineering and emergency backup.",
    ],
    triggers: {
      img: { start: "45% top", end: "85% top" },
      no: { start: "65% top", end: "70% top" },
      title: { start: "65% top", end: "70% top" },
      content: { start: "65% top", end: "70% top" },
    },
  },
];

export function ServicesSolutions({ locale }: ServicesSolutionsProps = {}) {
  const pathname = usePathname() || "";
  const isBn =
    locale === "bn" || pathname.startsWith("/bn/") || pathname === "/bn";
  const properties = isBn ? PROPERTIES_BN : PROPERTIES_EN;

  return (
    <HorizontalFeatureReveal
      properties={properties}
      headerBadge={isBn ? "আমাদের সরবরাহ লাইন // লাইনআপ" : "CORE SUPPLY // LINEUP"}
      headerTitle={isBn ? "আমরা যা সরবরাহ করি" : "What We Supply"}
      imageParallaxRange={30}
      cardGap={15}
    />
  );
}

export default ServicesSolutions;
