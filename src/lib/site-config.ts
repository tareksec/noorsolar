export interface SiteConfig {
  companyName: string;
  tagline: string;
  description: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  whatsappDisplay: string;
  email: string;
  address: string;
  hours: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  closingCtaHeadline: string;
  closingCtaSubheadline: string;
  aboutHeadline: string;
  aboutBody: string;
  socials: {
    facebook?: string;
    linkedin?: string;
  };
  faq: Array<
    { question: string; answer: string }
  >;
}

export const defaultSiteConfig: SiteConfig = {
  companyName: "Noor Solar Energy",
  tagline: "Direct Importer & Bulk B2B Supplier",
  description:
    "Supplying Solar Panels, High-Capacity Lithium-ion Batteries, and Industrial/Commercial Inverters across Bangladesh.",
  phone: "+8801700000000",
  phoneDisplay: "+880 1700-000000",
  whatsapp: "8801700000000",
  whatsappDisplay: "+880 1700-000000",
  email: "info@noorsolaren.com",
  address: "Motijheel Commercial Area, Dhaka-1000, Bangladesh",
  hours: "Sat - Thu: 9:00 AM - 7:00 PM (Friday Closed)",
  heroHeadline: "Solar equipment.\nFor your next\nbig project.",
  heroSubheadline:
    "Solar panels, lithium batteries and inverters for bulk buyers in Bangladesh. Find your equipment. Let's talk specifications and supply.",
  heroPrimaryCta: "Request a quote",
  heroSecondaryCta: "Browse equipment",
  closingCtaHeadline: "Let's talk about your next order.",
  closingCtaSubheadline:
    "Share the equipment, quantity and delivery location you have in mind. We'll discuss the details with you.",
  aboutHeadline: "Solar equipment. A focused approach.",
  aboutBody:
    "Supplying Solar Panels, High-Capacity Lithium-ion Batteries, and Industrial/Commercial Inverters across Bangladesh.",
  socials: {
    facebook: "https://facebook.com",
    linkedin: "https://linkedin.com",
  },
  faq: [
    {
      question: "How do I request a bulk quote?",
      answer:
        "Choose equipment, specify the quantity and send a quote request. You can also discuss your requirements by phone or WhatsApp.",
    },
    {
      question: "Do you supply engineering datasheets and factory specifications?",
      answer:
        "Download the datasheet when one is listed on the product page, or ask our sales team about documents for your chosen model.",
    },
    {
      question: "What is your typical delivery lead time in Bangladesh?",
      answer:
        "Contact our sales team for current delivery schedules and stock availability for container and pallet orders.",
    },
    {
      question: "Do you offer installation or EPC services?",
      answer:
        "Our focus is equipment import and bulk supply. Contact us to clarify the scope of support for your project.",
    },
  ],
};
