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
  socials: {
    facebook?: string;
    linkedin?: string;
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
  phone: "+8801700000000",
  phoneDisplay: "+880 1700-000000",
  whatsapp: "8801700000000",
  whatsappDisplay: "+880 1700-000000",
  email: "info@noorsolaren.com",
  address: "Motijheel Commercial Area, Dhaka-1000, Bangladesh",
  addressBn: "মতিঝিল বাণিজ্যিক এলাকা, ঢাকা-১০০০, বাংলাদেশ",
  hours: "Sat - Thu: 9:00 AM - 7:00 PM (Friday Closed)",
  hoursBn: "শনি - বৃহস্পতি: সকাল ৯:০০ - সন্ধ্যা ৭:০০ (শুক্রবার বন্ধ)",
  heroHeadline: "Solar panels, lithium batteries and inverters, supplied in bulk.",
  heroHeadlineBn: "সোলার প্যানেল, লিথিয়াম ব্যাটারি ও ইনভার্টার—পাইকারি সরবরাহ।",
  heroSubheadline:
    "Direct B2B importer providing engineering-grade solar equipment and wholesale delivery across Bangladesh.",
  heroSubheadlineBn:
    "সরাসরি B2B আমদানিকারক: বাংলাদেশে উন্নত প্রযুক্তির সোলার যন্ত্রপাতি ও দেশব্যাপী পাইকারি সরবরাহ।",
  heroPrimaryCta: "Request Quote",
  heroPrimaryCtaBn: "কোটেশন চান",
  heroSecondaryCta: "Browse Products",
  heroSecondaryCtaBn: "পণ্য দেখুন",
  processHeadline: "Order in four simple steps",
  processHeadlineBn: "চারটি সহজ ধাপে অর্ডার করুন",
  processSubheadline: "A straightforward procurement workflow engineered for commercial contractors, installers, and B2B buyers across Bangladesh.",
  processSubheadlineBn: "বাণিজ্যিক ঠিকাদার, ইনস্টলার এবং পাইকারি ক্রেতাদের জন্য একটি সহজ ও স্বচ্ছ সরবরাহ প্রক্রিয়া।",
  processSteps: [
    {
      title: "Request a quote",
      titleBn: "কোটেশন চান",
      desc: "Tell us the products and quantity you need. Send the form, call us or message us on WhatsApp.",
      descBn: "আপনার প্রয়োজনীয় পণ্য ও পরিমাণের বিবরণ দিন। ওয়েব ফরম পূরণ করুন, ফোন করুন অথবা হোয়াটসঅ্যাপে মেসেজ পাঠান।",
    },
    {
      title: "Confirm specifications",
      titleBn: "স্পেসিফিকেশন মিলিয়ে নিন",
      desc: "Our team checks the datasheets and matches the right models and quantities to your project.",
      descBn: "আমাদের কারিগরি দল ডেটাশিট পর্যালোচনা করে আপনার প্রকল্পের জন্য সবচেয়ে উপযুক্ত মডেল ও সংখ্যা নির্ধারণ করবে।",
    },
    {
      title: "Receive your quotation",
      titleBn: "আনুষ্ঠানিক কোটেশন পান",
      desc: "Get a formal quotation with pricing and terms for your order.",
      descBn: "মূল্যতালিকা, পেমেন্টের শর্তাবলি ও ডেলিভারি বিবরণসহ আনুষ্ঠানিক লিখিত কোটেশন বুঝে নিন।",
    },
    {
      title: "Confirm and arrange delivery",
      titleBn: "অর্ডার নিশ্চিত ও ডেলিভারি গ্রহণ",
      desc: "Confirm the order and we coordinate delivery. Contact sales for current schedules.",
      descBn: "অর্ডার নিশ্চিত করার পর আমরা ডেলিভারির ব্যবস্থা করব। বর্তমান সময়সূচি জানতে আমাদের সেলস ডেস্কে কথা বলুন।",
    },
  ],
  closingCtaHeadline: "Ready to Order or Inquire About Container Pricing?",
  closingCtaHeadlineBn: "অর্ডার দিতে অথবা কনটেইনার পাইকারি মূল্য জানতে চান?",
  closingCtaSubheadline:
    "Submit your project specifications or required equipment quantity below. Our commercial sales engineers respond with formal quotations within working hours.",
  closingCtaSubheadlineBn:
    "নিচে আপনার প্রকল্পের বিবরণ অথবা কাঙ্ক্ষিত পণ্যের সংখ্যা লিখে পাঠান। আমাদের সেলস ইঞ্জিনিয়াররা অফিস চলাকালীন দ্রুত আনুষ্ঠানিক কোটেশন পাঠাবেন।",
  aboutHeadline: "Engineering-Grade Solar Equipment for Bangladesh .",
  aboutHeadlineBn: "বাংলাদেশে উন্নত কারিগরি মানের সোলার সরঞ্জাম।",
  aboutBody:
    "Supplying Solar Panels, High-Capacity Lithium-ion Batteries, and Industrial/Commercial Inverters across Bangladesh.",
  aboutBodyBn:
    "সারা দেশে বাণিজ্যিক ছাদ, শিল্প কারখানা ও সৌর বিদ্যুৎ প্রকল্পের জন্য উন্নত প্রযুক্তির সোলার প্যানেল, লিথিয়াম ব্যাটারি ও ইনভার্টার পাইকারি সরবরাহ করছি।",
  socials: {
    facebook: "https://facebook.com",
    linkedin: "https://linkedin.com",
  },
  faq: [
    {
      question: "How do I request a bulk quote?",
      questionBn: "পাইকারি কোটেশন কীভাবে চাইবেন?",
      answer:
        "Select your required products or categories, specify your estimated quantity, and submit our quotation form. You can also reach our technical sales team directly via WhatsApp or phone for immediate pricing.",
      answerBn:
        "পণ্য নির্বাচন করে কাঙ্ক্ষিত পরিমাণ উল্লেখ করে আমাদের কোটেশন ফরম জমা দিন। দ্রুত মূল্যের জন্য সরাসরি আমাদের ফোন বা হোয়াটসঅ্যাপেও যোগাযোগ করতে পারেন।",
    },
    {
      question: "Do you supply engineering datasheets and factory specifications?",
      questionBn: "আপনারা কি কারিগরি ডেটাশিট ও ফ্যাক্টরি স্পেসিফিকেশন প্রদান করেন?",
      answer:
        "Yes, all solar panels, lithium batteries, and inverters include technical datasheets and factory specifications.",
      answerBn:
        "হ্যাঁ, আমাদের প্রতিটি সোলার প্যানেল, লিথিয়াম ব্যাটারি ও ইনভার্টারের সাথে প্রস্তুতকারকের পূর্ণাঙ্গ কারিগরি ডেটাশিট ও স্পেসিফিকেশন দেওয়া হয়।",
    },
    {
      question: "What is your typical delivery lead time in Bangladesh?",
      questionBn: "বাংলাদেশে পণ্য ডেলিভারির সময়সীমা কেমন?",
      answer:
        "Contact our sales team for current delivery schedules and stock availability for container and pallet orders.",
      answerBn:
        "স্টক প্রাপ্যতা ও কনটেইনার বা প্যালেট অর্ডারের বর্তমান ডেলিভারি সময়সূচি জানতে আমাদের সেলস টিমের সাথে যোগাযোগ করুন।",
    },
    {
      question: "Do you offer installation or EPC services?",
      questionBn: "আপনারা কি ইনস্টলেশন বা EPC সেবা দেন?",
      answer:
        "We are an equipment importer and wholesale supplier. We partner with and supply certified EPC contractors, factories, and solar dealers nationwide.",
      answerBn:
        "আমরা মূলত পাইকারি সরঞ্জাম আমদানিকারক ও পরিবেশক। আমরা সারা দেশের অনুমোদিত EPC ঠিকাদার, কারখানা ও সোলার ডিলারদের সরঞ্জাম সরবরাহ করে থাকি।",
    },
  ],
};
