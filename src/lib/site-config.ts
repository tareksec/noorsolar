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
  socials: {
    facebook?: string;
    linkedin?: string;
  };
  faq: Array<{
    question: string;
    answer: string;
  }>;
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
  heroHeadline: "Solar panels, lithium batteries and inverters, supplied in bulk.",
  heroSubheadline:
    "Direct B2B importer providing engineering-grade solar equipment and wholesale delivery across Bangladesh.",
  socials: {
    facebook: "https://facebook.com",
    linkedin: "https://linkedin.com",
  },
  faq: [
    {
      question: "How do I request a bulk quote?",
      answer:
        "Select your required products or categories, specify your estimated quantity, and submit our quotation form. You can also reach our technical sales team directly via WhatsApp or phone for immediate pricing.",
    },
    {
      question: "Do you supply engineering datasheets and warranties?",
      answer:
        "Yes, all solar panels, lithium batteries, and inverters include official technical datasheets and factory specifications.",
    },
    {
      question: "What is your typical delivery lead time in Bangladesh?",
      answer:
        "Contact our sales team for current delivery schedules and stock availability for container and pallet orders.",
    },
    {
      question: "Do you offer installation or EPC services?",
      answer:
        "We are an equipment importer and wholesale supplier. We partner with and supply certified EPC contractors, factories, and solar dealers nationwide.",
    },
  ],
};
