/**
 * Centralized production site URL configuration.
 * Guarantees public SEO metadata, canonicals, og:url, Open Graph images,
 * sitemaps, robots, and structured data use the official production domain
 * https://noorsolaren.com and ignores preview/staging domains.
 */
export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (
    !envUrl ||
    envUrl.includes("hostingersite.com") ||
    envUrl.includes("preview-domain") ||
    envUrl.includes("noorsolarbd.com") ||
    envUrl.includes("localhost")
  ) {
    return "https://noorsolaren.com";
  }
  return envUrl.replace(/\/+$/, "");
}

export const SITE_URL = getSiteUrl();

export interface BusinessPhotos {
  warehouse?: string;
  palletStock?: string;
  containerUnloading?: string;
  delivery?: string;
  inverterInventory?: string;
  batteryRacks?: string;
  productInspection?: string;
  team?: string;
  completedProjects?: string;
}

export interface SiteConfig {
  companyName: string;
  tagline: string;
  taglineBn?: string;
  description: string;
  descriptionBn?: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  whatsappDisplay: string;
  email: string;
  address: string;
  addressBn?: string;
  hours: string;
  hoursBn?: string;
  heroHeadline: string;
  heroHeadlineBn?: string;
  heroSubheadline: string;
  heroSubheadlineBn?: string;
  heroPrimaryCta: string;
  heroPrimaryCtaBn?: string;
  heroSecondaryCta: string;
  heroSecondaryCtaBn?: string;
  processHeadline?: string;
  processHeadlineBn?: string;
  processSubheadline?: string;
  processSubheadlineBn?: string;
  processSteps?: Array<{
    title: string;
    desc: string;
    titleBn?: string;
    descBn?: string;
  }>;
  closingCtaHeadline: string;
  closingCtaHeadlineBn?: string;
  closingCtaSubheadline: string;
  closingCtaSubheadlineBn?: string;
  aboutHeadline: string;
  aboutHeadlineBn?: string;
  aboutBody: string;
  aboutBodyBn?: string;
  businessPhotos?: BusinessPhotos;
  socials: {
    facebook?: string;
    linkedin?: string;
    youtube?: string;
    twitter?: string;
  };
  faq: Array<
    { question: string; answer: string; questionBn?: string; answerBn?: string }
  >;
  [key: string]: unknown;
}

export const defaultSiteConfig: SiteConfig = {
  companyName: "Noor Solar Energy",
  tagline: "Direct Importer & Bulk B2B Supplier",
  taglineBn: "সরাসরি আমদানিকারক ও পাইকারি B2B সরবরাহকারী",
  description:
    "Supplying Solar Panels, High-Capacity Lithium-ion Batteries, and Industrial/Commercial Inverters across Bangladesh.",
  descriptionBn:
    "সারা বাংলাদেশে সোলার প্যানেল, উচ্চ ক্ষমতার লিথিয়াম-আয়ন ব্যাটারি এবং বাণিজ্যিক ও শিল্প গ্রেড ইনভার্টার সরবরাহকারী।",
  phone: "+8801884611888",
  phoneDisplay: "+880 1884-611888",
  whatsapp: "8801884611888",
  whatsappDisplay: "+880 1884-611888",
  email: "info@noorsolaren.com",
  address: "House-38 (Flat-1A), Road-5/A, Sector-5, Uttara, Dhaka-1230, Bangladesh",
  addressBn: "হাউস-৩৮ (ফ্ল্যাট-১এ), রোড-৫/এ, সেক্টর-৫, উত্তরা, ঢাকা-১২৩০, বাংলাদেশ",
  hours: "Sat - Thu: 9:00 AM - 7:00 PM (Friday Closed)",
  hoursBn: "শনি - বৃহস্পতি: সকাল ৯:০০ - সন্ধ্যা ৭:০০ (শুক্রবার বন্ধ)",
  heroHeadline: "Solar Equipment. Imported Direct. Supplied at Project Scale.",
  heroHeadlineBn: "সরাসরি আমদানিকৃত সেরা সোলার ইকুইপমেন্ট — আপনার প্রজেক্টের বিশ্বস্ত সমাধান",
  heroSubheadline:
    "N-Type PV modules, LiFePO4 storage and commercial inverters for EPCs, industrial facilities and solar dealers across Bangladesh.",
  heroSubheadlineBn:
    "EPC কন্ট্রাক্টর, কারখানা ও সোলার ডিলারদের জন্য টিয়ার-১ N-Type সোলার প্যানেল, নিরাপদ LiFePO4 ব্যাটারি ও স্মার্ট ইনভার্টারের নির্ভরযোগ্য পাইকারি সরবরাহ — সরাসরি চট্টগ্রাম পোর্ট ও ঢাকা ওয়্যারহাউস থেকে দ্রুত ডেলিভারি।",
  heroPrimaryCta: "Request Wholesale Quote",
  heroPrimaryCtaBn: "সহজেই কোটেশন নিন",
  heroSecondaryCta: "View Available Stock",
  heroSecondaryCtaBn: "আমাদের রেডি স্টক দেখুন",
  processHeadline: "Order in four simple steps",
  processHeadlineBn: "চারটি সহজ ধাপে অর্ডার প্রক্রিয়া",
  processSubheadline: "A straightforward procurement workflow engineered for commercial contractors, installers, and B2B buyers across Bangladesh.",
  processSubheadlineBn: "বাণিজ্যিক ঠিকাদার, ইনস্টলার ও পাইকারি ক্রেতাদের জন্য একটি সহজ ও স্বচ্ছ সরবরাহ প্রক্রিয়া।",
  processSteps: [
    {
      title: "Request a quote",
      titleBn: "কোটেশনের অনুরোধ করুন",
      desc: "Tell us the products and quantity you need. Send the form, call us or message us on WhatsApp.",
      descBn: "আপনার প্রয়োজনীয় ইকুইপমেন্ট ও পরিমাণের তালিকা দিন—ওয়েবসাইট ফর্ম, ফোন কল কিংবা সরাসরি হোয়াটসঅ্যাপের মাধ্যমে।",
    },
    {
      title: "Confirm specifications",
      titleBn: "স্পেসিফিকেশন যাচাই",
      desc: "Our team checks the datasheets and matches the right models and quantities to your project.",
      descBn: "আমাদের টেকনিক্যাল টিম ডেটাশিট পর্যালোচনা করে আপনার প্রজেক্টের চাহিদামতো সঠিক মডেল ও পরিমাণ নিশ্চিত করবে।",
    },
    {
      title: "Receive your quotation",
      titleBn: "আনুষ্ঠানিক কোটেশন গ্রহণ",
      desc: "Get a formal quotation with pricing and terms for your order.",
      descBn: "মূল্যতালিকা, পেমেন্টের শর্তাবলি ও ডেলিভারির সময় উল্লেখসহ লিখিত আনুষ্ঠানিক কোটেশন বুঝে নিন।",
    },
    {
      title: "Confirm and arrange delivery",
      titleBn: "অর্ডার নিশ্চিতকরণ ও ডেলিভারি",
      desc: "Confirm the order and we coordinate delivery. Contact sales for current schedules.",
      descBn: "অর্ডার চূড়ান্ত হলে আমরা নির্ধারিত সময়ে সরাসরি ডিপো বা সাইটে নিরাপদ ডেলিভারির সমন্বয় করব।",
    },
  ],
  closingCtaHeadline: "Ready to Order or Inquire About Container Pricing?",
  closingCtaHeadlineBn: "প্রজেক্টের অর্ডার বা কন্টেইনারের পাইকারি মূল্য জানতে চান?",
  closingCtaSubheadline:
    "Submit your project specifications or required equipment quantity below. Our commercial sales engineers respond with formal quotations within working hours.",
  closingCtaSubheadlineBn:
    "নিচে আপনার প্রজেক্টের স্পেসিফিকেশন বা প্রয়োজনীয় ইকুইপমেন্টের পরিমাণ লিখে পাঠান। আমাদের সেলস ইঞ্জিনিয়াররা কার্যদিবসে দ্রুত আনুষ্ঠানিক কোটেশন প্রদান করবেন।",
  aboutHeadline: "Engineering-Grade Solar Equipment for Bangladesh .",
  aboutHeadlineBn: "বাংলাদেশে নির্ভরযোগ্য ও ইঞ্জিনিয়ারিং-গ্রেড সোলার ইকুইপমেন্ট সরবরাহ।",
  aboutBody:
    "Supplying Solar Panels, High-Capacity Lithium-ion Batteries, and Industrial/Commercial Inverters across Bangladesh.",
  aboutBodyBn:
    "সারা দেশে বাণিজ্যিক রুফটপ, শিল্প কারখানা ও সোলার প্রজেক্টের জন্য উন্নত প্রযুক্তির সোলার প্যানেল, LiFePO4 ব্যাটারি ও ইনভার্টার পাইকারি সরবরাহ করছি।",
  businessPhotos: {
    warehouse: "/photos/step-3-logistics.webp",
    palletStock: "/photos/cat-solar-panels.webp",
    containerUnloading: "/photos/step-3-logistics.webp",
    delivery: "/photos/step-4-delivery.webp",
    inverterInventory: "/photos/cat-solar-inverters.webp",
    batteryRacks: "/photos/cat-lithium-batteries.webp",
    productInspection: "/photos/about-inspection.webp",
    team: "/photos/contact-sales-desk.webp",
    completedProjects: "/photos/about-commercial-plant.webp",
  },
  socials: {},
  faq: [
    {
      question: "How do I request a bulk quote?",
      questionBn: "পাইকারি কোটেশন কীভাবে পাওয়া যাবে?",
      answer:
        "Select your required products or categories, specify your estimated quantity, and submit our quotation form. You can also reach our technical sales team directly via WhatsApp or phone for immediate pricing.",
      answerBn:
        "আপনার প্রয়োজনীয় পণ্য ও পরিমাণ উল্লেখ করে কোটেশন ফর্ম জমা দিন। তাৎক্ষণিক মূল্যের জন্য সরাসরি আমাদের ফোন বা হোয়াটসঅ্যাপেও যোগাযোগ করতে পারেন।",
    },
    {
      question: "Do you supply engineering datasheets and factory specifications?",
      questionBn: "আপনারা কি টেকনিক্যাল ডেটাশিট ও ফ্যাক্টরি স্পেসিফিকেশন প্রদান করেন?",
      answer:
        "Yes, all solar panels, lithium batteries, and inverters include technical datasheets and factory specifications.",
      answerBn:
        "হ্যাঁ, আমাদের প্রতিটি সোলার প্যানেল, LiFePO4 ব্যাটারি ও ইনভার্টারের সাথে প্রস্তুতকারকের অফিসিয়াল টেকনিক্যাল ডেটাশিট ও স্পেসিফিকেশন সরবরাহ করা হয়।",
    },
    {
      question: "What is your typical delivery lead time in Bangladesh?",
      questionBn: "বাংলাদেশে পণ্য ডেলিভারির সময়সীমা কেমন?",
      answer:
        "Contact our sales team for current delivery schedules and stock availability for container and pallet orders.",
      answerBn:
        "ডিপোতে প্রস্তুত স্টকের জন্য দ্রুত ডেলিভারি নিশ্চিত করা হয়। কন্টেইনার বা বড় প্যালেট অর্ডারের বর্তমান ডেলিভারি শিডিউল জানতে সেলস টিমের সাথে যোগাযোগ করুন।",
    },
    {
      question: "Do you offer installation or EPC services?",
      questionBn: "আপনারা কি সরাসরি ইনস্টলেশন বা EPC সেবা দেন?",
      answer:
        "We are an equipment importer and wholesale supplier. We partner with and supply certified EPC contractors, factories, and solar dealers nationwide.",
      answerBn:
        "আমরা সরাসরি সোলার ইকুইপমেন্ট আমদানিকারক ও পাইকারি সরবরাহকারী। আমরা সারা দেশের নিবন্ধিত EPC ঠিকাদার, শিল্পপ্রতিষ্ঠান ও অনুমোদিত সোলার ডিলারদের ইকুইপমেন্ট সরবরাহ করে থাকি।",
    },
  ],
};
