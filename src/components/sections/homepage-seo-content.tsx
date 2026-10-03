import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import {
  Sun,
  BatteryCharging,
  Cpu,
  Boxes,
  Factory,
  Building2,
  Tractor,
  ShieldCheck,
  CheckCircle2,
  Truck,
  ArrowRight,
  HelpCircle,
  Award,
  Zap,
  Calculator,
  Tag,
} from "lucide-react";

interface HomepageSeoContentProps {
  locale?: string;
}

export function HomepageSeoContent({ locale }: HomepageSeoContentProps) {
  const isBn = locale === "bn";

  const productsList = [
    {
      title: isBn ? "N-Type TOPCon সোলার প্যানেল" : "N-Type TOPCon Solar Panels",
      desc: isBn
        ? "উচ্চ-দক্ষতাসম্পন্ন বাইফেসিয়াল সেল, ২২.৬%+ পর্যন্ত কার্যক্ষমতা, ৩০ বছরের লিনিয়ার পারফরম্যান্স ওয়ারেন্টি এবং চরম গরমেও স্থিতিশীল উৎপাদন।"
        : "Ultra-high efficiency dual-glass bifacial modules with up to 22.6%+ efficiency, 30-year performance warranty, and low temperature coefficient.",
      icon: Sun,
      href: "/category/solar-panels",
      badge: isBn ? "টিয়ার-১ প্রযুক্তি" : "Tier-1 Tech",
    },
    {
      title: isBn ? "LiFePO4 লিথিয়াম ব্যাটারি" : "LiFePO4 Lithium Batteries",
      desc: isBn
        ? "৬,০০০+ সাইকেল লাইফ, ৯০% ব্যবহারযোগ্য DoD, ইন্টেলিজেন্ট BMS সুরক্ষা এবং বাণিজ্যিক র্যাক ও ওয়াল-মাউন্ট স্লিম ডিজাইন।"
        : "6,000+ deep cycles, 90% usable DoD, intelligent BMS safety, available in server rack and wall-mount enclosures.",
      icon: BatteryCharging,
      href: "/category/lithium-batteries",
      badge: isBn ? "দীর্ঘস্থায়ী স্টোরেজ" : "6,000+ Cycles",
    },
    {
      title: isBn ? "অন-গ্রিড ও হাইব্রিড সোলার ইনভার্টার" : "On-Grid & Hybrid Inverters",
      desc: isBn
        ? "থ্রি-ফেজ ইন্ডাস্ট্রিয়াল স্ট্রিং ইনভার্টার, মাল্টিপল MPPT ট্র্যাকিং, IP66 ওয়াটারপ্রুফ রেটিং এবং নেট-মিটারিং কমপ্লায়েন্ট।"
        : "Commercial 3-phase string and hybrid inverters with multiple MPPTs, IP66 protection, and full net-metering compatibility.",
      icon: Cpu,
      href: "/category/solar-inverters",
      badge: isBn ? "নেট মিটারিং রেডি" : "Net-Metering",
    },
    {
      title: isBn ? "বাণিজ্যিক এনার্জি স্টোরেজ (BESS)" : "Commercial Energy Storage (BESS)",
      desc: isBn
        ? "শিল্প কারখানার পিক শেভিং এবং নিরবচ্ছিন্ন ব্যাকআপের জন্য কাস্টম স্কেলেবল হাই-ভোল্টেজ ব্যাটারি সমাধান।"
        : "Scalable high-voltage containerized battery systems for industrial peak-shaving and critical manufacturing backup.",
      icon: Boxes,
      href: "/category/energy-storage",
      badge: isBn ? "প্রজেক্ট সমাধান" : "Turnkey BESS",
    },
  ];

  const industriesList = [
    {
      name: isBn ? "গার্মেন্টস ও টেক্সটাইল শিল্প (RMG)" : "Garments & Textiles (RMG)",
      desc: isBn
        ? "কারখানার সুবিশাল শেডে নেট-মিটারিং সোলার প্যানেল বসিয়ে পিক আওয়ারে গ্রিড বিদ্যুতের খরচ ৩০-৪০% কমিয়ে আনা।"
        : "Deploy rooftop solar to lower peak grid tariff expenses by 30-40% while achieving green building certifications.",
      icon: Factory,
    },
    {
      name: isBn ? "বাণিজ্যিক ভবন ও রিয়েল এস্টেট" : "Commercial Real Estate & Malls",
      desc: isBn
        ? "হসপিটাল, কর্পোরেট হেডকোয়ার্টার ও শপিং মলে হাইব্রিড সোলার সিস্টেমের মাধ্যমে নিরবচ্ছিন্ন পাওয়ার ব্যাকআপ।"
        : "Hybrid solar and battery setups providing uninterrupted daylight power and silent emergency backup.",
      icon: Building2,
    },
    {
      name: isBn ? "কৃষি, ডেইরি ও পোল্ট্রি খামার" : "Agro, Dairy & Solar Irrigation",
      desc: isBn
        ? "লোডশেডিংমুক্ত সোলার পাম্প ও খামারে পরিবেশবান্ধব বিদ্যুৎ উৎপাদন, যা ব্যয়বহুল ডিজেল জেনারেটরের নির্ভরতা দূর করে।"
        : "Off-grid solar pumping and ventilation systems eliminating expensive diesel generator run-time.",
      icon: Tractor,
    },
    {
      name: isBn ? "সোলার EPC ঠিকাদার ও ইনস্টলার" : "EPC Contractors & Installers",
      desc: isBn
        ? "কন্টেইনার-স্কেল পাইকারি সরবরাহ, ফ্যাক্টরি টেস্ট রিপোর্ট, ডেটাশিট ও দ্রুত ঢাকা ডিপো বা সরাসরি সাইট ডেলিভারি।"
        : "Direct container-load procurement, factory flash-test documentation, and verified warehouse dispatch.",
      icon: Truck,
    },
  ];

  const packagesList = [
    {
      capacity: isBn ? "২০০ ওয়াট সোলার প্যানেল" : "200 Watt Solar Panel Setup",
      subtitle: isBn ? "মৌলিক ডিসি লোড ও ছোট ব্যাকআপ" : "Basic DC Lighting & Rural Backup",
      priceEst: isBn ? "৳১৫,০০০ – ৳২২,০০০ (আনুমানিক সেট)" : "~15,000 – 22,000 BDT (Est.)",
      specs: isBn
        ? ["২০০W মনো/পলিক্রিস্টালাইন প্যানেল", "১২V সোলার চার্জ কন্ট্রোলার", "ছোট ডিসি ব্যাটারি ও ওয়্যারিং কিট", "লাইট ও ডিসি ফ্যান চালানোর উপযোগী"]
        : ["200W Mono/Poly PV module", "12V PWM solar charge controller", "Small DC battery & wiring kit", "Runs 2-3 DC lights and 1 DC fan"],
      note: isBn ? "বাসাবাড়ির ছোট লোডের জন্য জনপ্রিয়" : "Ideal for small rural home lighting",
      badge: isBn ? "ছোট লোড" : "Small DC Kit",
    },
    {
      capacity: isBn ? "১০০০ ওয়াট (১kW) সোলার ফুল সেট" : "1000 Watt (1 kW) Solar Full Set",
      subtitle: isBn ? "বাসাবাড়ি ও দোকানের সম্পূর্ণ সিস্টেম" : "Complete Off-Grid / Hybrid Home System",
      priceEst: isBn ? "৳৭৫,০০০ – ৳১,১৫,০০০ (সম্পূর্ণ প্যাকেজ)" : "~75,000 – 115,000 BDT (Turnkey)",
      specs: isBn
        ? ["১০০০W N-Type / মনো প্যানেল সেট", "১kW – ১.৫kVA পিউর সাইন ওয়েভ ইনভার্টার", "১০০Ah-২০০Ah লিথিয়াম বা টিউবুলার ব্যাটারি", "টিভি, ফ্যান, লাইট ও রাউটার ব্যাকআপ"]
        : ["1000W N-Type / Mono module array", "1kW - 1.5kVA Pure Sine Wave Inverter", "100Ah-200Ah Lithium / Tubular battery", "Runs lights, fans, TV, computer & WiFi"],
      note: isBn ? "লোডশেডিংমুক্ত নির্ভরযোগ্য বিদ্যুৎ" : "Uninterrupted daily power backup",
      badge: isBn ? "সর্বাধিক জনপ্রিয়" : "Best Seller",
    },
    {
      capacity: isBn ? "৩kW থেকে ৫kW বাণিজ্যিক প্যাকেজ" : "3 kW to 5 kW Commercial Hybrid Set",
      subtitle: isBn ? "অফিস, ক্লিনিক ও বাণিজ্যিক ফ্লোর" : "Offices, Clinics & Duplex Residences",
      priceEst: isBn ? "৳২,৮০,০০০ – ৳৪,৫০,০০০ (হাইব্রিড স্টোরেজ)" : "~280,000 – 450,000 BDT (Hybrid)",
      specs: isBn
        ? ["৫kW N-Type TOPCon হাই-এফিশিয়েন্সি প্যানেল", "৫kW থ্রি-ফেজ/সিঙ্গেল-ফেজ হাইব্রিড ইনভার্টার", "৫.১২kWh LiFePO4 লিথিয়াম ব্যাটারি মডিউল", "এসি, ফ্রিজ ও মোটর চালানোর সক্ষমতা"]
        : ["5kW N-Type TOPCon high-yield array", "5kW Hybrid Inverter with Net-Metering", "5.12kWh LiFePO4 rack battery", "Powers AC, refrigerators, pumps & lights"],
      note: isBn ? "নেট-মিটারিং ও ব্যাটারি ব্যাকআপ সমন্বয়" : "Net-metering + battery storage",
      badge: isBn ? "হাইব্রিড প্রিমিয়াম" : "Hybrid Storage",
    },
    {
      capacity: isBn ? "১০kW থেকে ৫০০+ kW শিল্প কারখানা সলিউশন" : "10 kW to 500+ kW Industrial Rooftop",
      subtitle: isBn ? "গার্মেন্টস, টেক্সটাইল ও কোল্ড স্টোরেজ" : "Textile, RMG Factories & Warehouses",
      priceEst: isBn ? "৳৩৬ – ৳৪৪ / ওয়াট (পাইকারি কন্টেইনার রেট)" : "~36 – 44 BDT/Watt (Bulk Container Rate)",
      specs: isBn
        ? ["টিয়ার-১ ৫৮০W-৬২০W বাইফেসিয়াল প্যানেল", "৫০kW-১০০kW থ্রি-ফেজ অন-গ্রিড ইনভার্টার", "অ্যালুমিনিয়াম সাইক্লোন-রেটেড স্ট্রাকচার", "নেট মিটারিং অনুমোদন ও ৩-৪ বছরে ROI"]
        : ["Tier-1 580W-620W Bifacial modules", "50kW-100kW 3-Phase On-Grid Inverters", "Heavy-duty aluminum mounting rails", "Full Net-metering approval & 3-4 yr ROI"],
      note: isBn ? "বিদ্যুৎ বিল ৩০-৪০% সাশ্রয়" : "Saves 30-40% on grid power bill",
      badge: isBn ? "শিল্প গ্রেড B2B" : "Industrial B2B",
    },
  ];

  const faqs = [
    {
      q: isBn
        ? "সোলার প্যানেল এর দাম ২০২৬ সালে বাংলাদেশে কেমন (Solar Panel Price in Bangladesh 2026)?"
        : "What is the expected solar panel price in Bangladesh in 2026?",
      a: isBn
        ? "২০২৬ সালে বাংলাদেশে আন্তর্জাতিক টিয়ার-১ N-Type TOPCon সোলার প্যানেলের পাইকারি মূল্য প্রতি ওয়াট সাধারণত ৩৬ থেকে ৪৪ টাকার মধ্যে (আমদানি শুল্ক, ডলারের বিনিময় হার এবং ক্রয়ের ভলিউমের ওপর নির্ভরশীল)। রিটেইলে ছোট সাইজের প্যানেল প্রতি ওয়াট ৪৫-৫৫ টাকা হতে পারে, তবে বাণিজ্যিক ছাদ ও মেগাওয়াট স্কেল শিল্প প্রজেক্টে নূর সোলার সরাসরি কারখানা ও কন্টেইনার রেটে ইকুইপমেন্ট সরবরাহ করে।"
        : "In 2026, wholesale commercial Tier-1 N-Type TOPCon solar panels in Bangladesh typically range from 36 to 44 BDT per watt depending on import tariffs, foreign exchange rates, and order volume. Retail small panels may sell higher, but commercial and industrial buyers access bulk container-level pricing through Noor Solar.",
    },
    {
      q: isBn
        ? "১০০০ ওয়াট এবং ২০০ ওয়াট সোলার প্যানেল ফুল সেট প্যাকেজের আনুমানিক খরচ কত?"
        : "What is the estimated cost of a 1000W or 200W solar panel full set package?",
      a: isBn
        ? "২০০ ওয়াট সাধারণ সেটআপে একটি ২০০W প্যানেল, চার্জ কন্ট্রোলার ও ছোট ব্যাটারি মিলিয়ে আনুমানিক ১৫,০০০ থেকে ২২,০০০ টাকার মধ্যে হতে পারে। অপরদিকে ১০০০ ওয়াট (১ কিলোওয়াট) সোলার প্যানেল ফুল সেট প্যাকেজে উচ্চ-দক্ষতাসম্পন্ন প্যানেল, লিথিয়াম ব্যাটারি (বা টিউবুলার ব্যাটারি), পিউর সাইন ওয়েভ ইনভার্টার ও স্ট্রাকচার সহ আনুমানিক ৭৫,০০০ থেকে ১,১৫,০০০ টাকার মতো খরচ হয়।"
        : "A basic 200W solar kit (panel, charge controller, small battery) typically ranges between 15,000 to 22,000 BDT for small DC loads. A complete 1000W (1 kWp) solar full-set package with high-efficiency modules, LiFePO4 battery storage, pure sine wave inverter, and mounting hardware costs approximately 75,000 to 115,000 BDT depending on battery chemistry and backup capacity.",
    },
    {
      q: isBn
        ? "ওয়ালটন বা সুপার স্টার সোলার প্যানেলের সাথে আন্তর্জাতিক টিয়ার-১ TOPCon প্যানেলের পার্থক্য কী?"
        : "How do local retail brands like Walton or Super Star compare with international Tier-1 TOPCon modules?",
      a: isBn
        ? "ওয়ালটন বা সুপার স্টার প্যানেলগুলো সাধারণত স্থানীয় গৃহস্থালী ছোটখাটো চাহিদা (যেমন লাইট, ফ্যান বা ছোট ব্যাটারি চার্জিং)-র জন্য রিটেইল মার্কেটে পাওয়া যায়। কিন্তু বড় বাণিজ্যিক ছাদ, গার্মেন্টস ফ্যাক্টরি, রাইস মিল বা অন-গ্রিড নেট মিটারিং প্রজেক্টে প্রয়োজন আন্তর্জাতিকভাবে স্বীকৃত BloombergNEF টিয়ার-১ N-Type TOPCon বাইফেসিয়াল প্যানেল (যেমন Jinko, JA, Longi বা Trina গ্রেড)। এতে সেল এফিশিয়েন্সি ২২.৬%+ এবং ৩০ বছরের লিনিয়ার পাওয়ার গ্যারান্টি পাওয়া যায়, যা সিস্টেমের বিদ্যুৎ উৎপাদন সর্বোচ্চ রাখে এবং বাণিজ্যিক বিনিয়োগ ৩-৪ বছরে ফেরত আনে।"
        : "Domestic brands cater primarily to small household DC lighting and fan systems. For industrial rooftops, factories, commercial buildings, and net-metered EPC projects, BloombergNEF Tier-1 N-Type TOPCon bifacial modules are standard worldwide. They deliver over 22.6% cell efficiency, certified 30-year performance warranties, and significantly higher kWh generation under extreme tropical heat.",
    },
    {
      q: isBn
        ? "সোলার প্যানেল ফুল সেট বা প্যাকেজে কী কী যন্ত্রপাতি থাকা আবশ্যক?"
        : "What components are included in a complete turnkey solar panel package?",
      a: isBn
        ? "একটি পরিপূর্ণ সোলার প্যাকেজে থাকে: ১) টিয়ার-১ মনো বাইফেসিয়াল সোলার প্যানেল, ২) অন-গ্রিড বা হাইব্রিড স্মার্ট ইনভার্টার, ৩) এনার্জি স্টোরেজের জন্য LiFePO4 লিথিয়াম ব্যাটারি, ৪) ১৪০+ কিমি/ঘণ্টা ঝড় সহনশীল অ্যালুমিনিয়াম মাউন্টিং স্ট্রাকচার, ৫) TÜV সার্টিফায়েড ডিসি/এসি ক্যাবল, এবং ৬) সার্জ প্রোটেক্টর, ডিসি এমসিবি ও আর্থিং কিট।"
        : "A comprehensive solar package includes: 1) Tier-1 Mono Bifacial PV modules, 2) On-Grid or Hybrid Smart Inverter, 3) Optional LiFePO4 battery storage, 4) Cyclone-rated aluminum mounting rails and clamps, 5) Certified solar DC/AC cables, and 6) DC breaker switchgear, lightning surge protection, and earthing system.",
    },
    {
      q: isBn
        ? "TOPCon এবং সাধারণ PERC সোলার প্যানেলের মধ্যে পার্থক্য কী?"
        : "What is the difference between TOPCon and standard Mono PERC solar panels?",
      a: isBn
        ? "N-Type TOPCon সেল প্রযুক্তিতে পি-টাইপ PERC-এর চেয়ে উচ্চ কার্যক্ষমতা (২২.৬%+ বনাম ২১%), কম অবক্ষয় (প্রথম বছরে ১% বনাম ২%) এবং উচ্চ পরিবেষ্টিত তাপমাত্রায় অনেক উন্নত পারফরম্যান্স পাওয়া যায়। বাংলাদেশের গরম আবহাওয়ায় TOPCon প্যানেল বছরে ৩-৫% বেশি ইউনিট বিদ্যুৎ উৎপাদন করে।"
        : "N-Type TOPCon cells provide higher electrical efficiency (>22.6% vs ~21%), lower first-year degradation (1% vs 2%), and a superior temperature coefficient (-0.30%/°C). In Bangladesh's hot and humid climate, TOPCon modules generate 3% to 5% more annual kWh yield than PERC.",
    },
    {
      q: isBn
        ? "বাংলাদেশের আবহাওয়ায় LiFePO4 লিথিয়াম ব্যাটারি কত বছর টেকে?"
        : "How long do LiFePO4 lithium batteries last in Bangladesh?",
      a: isBn
        ? "LiFePO4 (লিথিয়াম আয়রন ফসফেট) ব্যাটারি দৈনিক ৮০% ডিসচার্জে ৬,০০০ থেকে ৮,০০০ সাইকেল সার্ভিস দেয়, যা প্রায় ১০ থেকে ১৫ বছর কার্যকর থাকে। ঐতিহ্যবাহী লেড-অ্যাসিড ব্যাটারি যেখানে প্রতি আড়াই বছরে বদলাতে হয়, সেখানে LiFePO4 দীর্ঘমেয়াদে অনেক বেশি লাভজনক।"
        : "LiFePO4 batteries deliver 6,000 to 8,000 charge cycles at 80% Depth of Discharge, translating to 10–15 years of daily service. Unlike tubular lead-acid batteries that fail within 2–3 years, LiFePO4 offers far lower levelized lifetime storage cost.",
    },
    {
      q: isBn
        ? "নূর সোলার এনার্জি থেকে পাইকারি ক্রয়ে ন্যূনতম পরিমাণ (MOQ) কত?"
        : "What is the minimum order quantity (MOQ) for wholesale purchase?",
      a: isBn
        ? "ইনভার্টার এবং সার্ভার-র্যাক ব্যাটারির ক্ষেত্রে ১টি ইউনিট থেকেও পাইকারি বুকিং দেওয়া যায়। সোলার প্যানেলের ক্ষেত্রে সাধারণত ১টি পূর্ণ প্যালেট (৩১ থেকে ৩৬ পিস) অথবা বড় প্রজেক্টের জন্য ফুল কন্টেইনার (৪০০+ পিস) সরবরাহ করা হয়।"
        : "Core inverters and rack-mounted batteries can be ordered as single units for commercial buyers. For solar panels, the minimum order is typically 1 standard pallet (31–36 modules) or full 20ft/40ft containers for utility and industrial projects.",
    },
    {
      q: isBn
        ? "পণ্যগুলোর অফিসিয়াল প্রস্তুতকারক ওয়ারেন্টি ও লোকাল সাপোর্ট কীভাবে দেওয়া হয়?"
        : "How is manufacturer warranty and local RMA handled?",
      a: isBn
        ? "নূর সোলার এনার্জি সরাসরি উৎপাদকদের অনুমোদিত ডিস্ট্রিবিউশন পার্টনার। সোলার প্যানেলে ১২ বছরের প্রোডাক্ট ও ৩০ বছরের পারফরম্যান্স ওয়ারেন্টি এবং ইনভার্টার ও ব্যাটারিতে ৫ থেকে ১০ বছরের অফিসিয়াল ম্যানুফ্যাকচারার ওয়ারেন্টি থাকে। যেকোনো প্রয়োজনে আমাদের ঢাকা সার্ভিস ডেস্ক থেকে সরাসরি RMA সমন্বয় করা হয়।"
        : "Noor Solar Energy operates as a direct authorized supplier. All solar panels carry 12-year product and 30-year linear performance warranties. Inverters and batteries carry 5 to 10-year factory warranties with direct local RMA coordination from our Dhaka technical center.",
    },
    {
      q: isBn
        ? "সারা বাংলাদেশে ডেলিভারি ও পরিবহন ব্যবস্থা কেমন?"
        : "What are the transport and logistics options across Bangladesh?",
      a: isBn
        ? "চট্টগ্রাম ও মোংলা বন্দর থেকে সরাসরি প্রজেক্ট সাইটে কন্টেইনার আনলোডিং অথবা আমাদের উত্তরা/ঢাকা ডিপো থেকে যেকোনো জেলায় সুরক্ষিত ট্রাকে ২৪ থেকে ৪৮ ঘণ্টার মধ্যে ডেলিভারি সমন্বয় করা হয়।"
        : "We facilitate nationwide delivery including direct port-to-site container haulage from Chittagong/Mongla ports and pallet freight dispatch within 24–48 hours from our central Dhaka warehouse.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-[#DCE4E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================= PART 1: WHO WE ARE & DIRECT IMPORTER AUTHORITY ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-20 sm:mb-28">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F1F4F1] border border-[#DCE4E0] text-xs font-mono text-[#074031]">
              <span className="w-2 h-2 rounded-full bg-[#FEBE16]" />
              <span className="font-semibold">
                {isBn ? "আমরা কে — নূর সোলার এনার্জি" : "Who We Are — Noor Solar Energy"}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#074031] leading-tight">
              {isBn
                ? "বাংলাদেশে নির্ভরযোগ্য সোলার ইকুইপমেন্ট আমদানিকারক ও পাইকারি সরবরাহকারী"
                : "Leading Solar Equipment Importer & Bulk Supplier in Bangladesh"}
            </h2>

            <p className="text-sm sm:text-base text-[#62706A] leading-relaxed">
              {isBn
                ? "নূর সোলার এনার্জি (Noor Solar Energy) বাংলাদেশে বাণিজ্যিক ছাদ, শিল্পপ্রতিষ্ঠান, ইউটিলিটি স্কেল এবং ডিলার নেটওয়ার্কের জন্য বিশ্বমানের সৌর বিদ্যুৎ সরঞ্জাম সরাসরি আমদানি করে। আমরা কোনো মধ্যস্বত্বভোগী ছাড়াই আন্তর্জাতিক টিয়ার-১ প্রস্তুতকারকদের কাছ থেকে কন্টেইনার-স্কেলে ইকুইপমেন্ট সংগ্রহ করি।"
                : "Noor Solar Energy is a premier direct importer and wholesale distributor of commercial-grade solar power equipment across Bangladesh. By eliminating intermediate trading layers, we supply genuine Tier-1 PV modules, advanced LiFePO4 batteries, and industrial inverters at competitive container-scale pricing."}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#F7F8F5] border border-[#DCE4E0]">
                <div className="flex items-center gap-2 text-[#074031] font-bold text-sm mb-1">
                  <Award className="w-4 h-4 text-[#FEBE16]" />
                  <span>{isBn ? "BSREA নিবন্ধিত" : "BSREA Member"}</span>
                </div>
                <p className="text-xs text-[#62706A]">
                  {isBn ? "বাংলাদেশ টেকসই ও নবায়নযোগ্য শক্তি সমিতির সদস্য।" : "Official General Member of BSREA Bangladesh."}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F7F8F5] border border-[#DCE4E0]">
                <div className="flex items-center gap-2 text-[#074031] font-bold text-sm mb-1">
                  <ShieldCheck className="w-4 h-4 text-[#FEBE16]" />
                  <span>{isBn ? "১০০% জেনুইন ওয়ারেন্টি" : "Verified Warranty"}</span>
                </div>
                <p className="text-xs text-[#62706A]">
                  {isBn ? "অফিসিয়াল প্রস্তুতকারক টেস্ট রিপোর্ট ও লোকাল RMA ব্যাকআপ।" : "Official laboratory flash reports and local RMA coordination."}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#074031] hover:underline"
              >
                <span>{isBn ? "আমাদের পটভূমি ও সক্ষমতা সম্পর্কে জানুন" : "Learn more about our company profile"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative w-full h-[340px] sm:h-[420px] rounded-3xl overflow-hidden border border-[#DCE4E0] shadow-sm bg-[#F1F4F1]">
              <Image
                src="/photos/about-commercial-plant.webp"
                alt={isBn ? "বাংলাদেশে বাণিজ্যিক সোলার প্যানেল প্রকল্প" : "Commercial rooftop solar installation project in Bangladesh"}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#052F25]/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-white/80 shadow-md">
                <span className="text-[11px] font-mono text-[#62706A] uppercase tracking-wider block mb-1">
                  {isBn ? "সরাসরি আমদানি লজিস্টিকস" : "Direct Import Logistics"}
                </span>
                <p className="text-sm font-bold text-[#074031]">
                  {isBn
                    ? "চট্টগ্রাম ও মোংলা বন্দর থেকে সরাসরি কারখানা ও প্রজেক্ট সাইটে দ্রুত ডেলিভারি"
                    : "Container-scale direct dispatch from Chittagong & Mongla ports to your project"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= PART 2: WHAT PRODUCTS WE SUPPLY ================= */}
        <div className="mb-20 sm:mb-28">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F1F4F1] border border-[#DCE4E0] text-xs font-mono text-[#074031] mb-3">
              <span className="w-2 h-2 rounded-full bg-[#FEBE16]" />
              <span className="font-semibold">
                {isBn ? "আমাদের সরবরাহকৃত যন্ত্রপাতি" : "What Products We Supply"}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#074031]">
              {isBn
                ? "বাণিজ্যিক ও শিল্প প্রকল্পের পূর্ণাঙ্গ সোলার সলিউশন"
                : "Commercial & Industrial Solar Equipment Portfolio"}
            </h2>
            <p className="text-sm sm:text-base text-[#62706A] mt-3">
              {isBn
                ? "সর্বোচ্চ দক্ষতা ও দীর্ঘায়ু নিশ্চিত করতে বিশ্বস্ত ব্র্যান্ডের আন্তর্জাতিক মানসম্পন্ন সরঞ্জাম।"
                : "Engineered for maximum reliability and lifetime energy yield in demanding tropical environments."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productsList.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-[#F7F8F5] border border-[#DCE4E0] hover:border-[#074031]/30 transition-all flex flex-col justify-between group shadow-2xs hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-[#DCE4E0] flex items-center justify-center text-[#074031] group-hover:bg-[#074031] group-hover:text-white transition-colors">
                        <Icon className="w-6 h-6 stroke-[1.8]" />
                      </div>
                      <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-white border border-[#DCE4E0] text-[#074031]">
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#074031] mb-2 group-hover:text-[#0B513E] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#62706A] leading-relaxed mb-6">
                      {item.desc}
                    </p>
                  </div>

                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#074031] group-hover:translate-x-1 transition-transform"
                  >
                    <span>{isBn ? "ক্যাটাগরি দেখুন" : "Explore Range"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= PART 3: WHO WE SERVE & INDUSTRIES ================= */}
        <div className="p-8 sm:p-12 lg:p-16 rounded-[36px] bg-[#F1F4F1] border border-[#DCE4E0] mb-20 sm:mb-28">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono text-[#62706A] uppercase tracking-wider block mb-2 font-semibold">
              {isBn ? "আমরা কাদের সেবা দিই" : "Who We Serve & Target Sectors"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#074031]">
              {isBn
                ? "বাংলাদেশের প্রধান প্রধান শিল্প ও বাণিজ্যিক সেক্টরের বিদ্যুৎ সাশ্রয়"
                : "Powering Bangladesh's Key Economic & Industrial Sectors"}
            </h2>
            <p className="text-sm text-[#62706A] mt-3 leading-relaxed">
              {isBn
                ? "আমাদের টেকনিক্যাল টিম প্রতিটি শিল্পের নির্দিষ্ট লোড প্রোফাইল, ছাদের গঠন এবং বিদ্যুৎ খরচের প্যাটার্ন পর্যালোচনা করে উপযুক্ত সরঞ্জাম নির্বাচনের পরামর্শ দেয়।"
                : "Our engineering consultants evaluate specific load profiles, roof geometries, and grid interconnects to tailor the optimum equipment bill of materials."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {industriesList.map((ind, idx) => {
              const Icon = ind.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white border border-[#DCE4E0] shadow-2xs hover:shadow-sm transition-shadow"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#F1F4F1] flex items-center justify-center text-[#074031] mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-[#074031] mb-2">
                    {ind.name}
                  </h4>
                  <p className="text-xs text-[#62706A] leading-relaxed">
                    {ind.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 pt-8 border-t border-[#DCE4E0] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#074031] shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-[#17251F]">
                {isBn
                  ? "আপনার প্রজেক্টের জন্য উপযুক্ত ক্যাপাসিটি ও স্পেসিফিকেশন জানতে আমাদের ইঞ্জিনিয়ারিং ডেস্কে কথা বলুন।"
                  : "Need assistance matching modules, inverters, and battery capacities for your project?"}
              </span>
            </div>
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#074031] text-white text-xs font-bold hover:bg-[#0B513E] transition-colors"
            >
              <span>{isBn ? "প্রজেক্ট কোটেশন পাঠান" : "Request Project Consultation"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* ================= PART 3.5: SOLAR PACKAGES, FULL SET & 2026 PRICE OVERVIEW ================= */}
        <div className="mb-20 sm:mb-28">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F1F4F1] border border-[#DCE4E0] text-xs font-mono text-[#074031] mb-3">
              <Tag className="w-3.5 h-3.5 text-[#FEBE16]" />
              <span className="font-semibold">
                {isBn ? "সোলার প্যানেল প্যাকেজ ও প্রাইস ইন বাংলাদেশ ২০২৬" : "Solar Packages & 2026 Price Guide"}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#074031]">
              {isBn
                ? "সোলার প্যানেল এর দাম ২০২৬ ও ফুল সেট প্যাকেজ নির্দেশিকা"
                : "Solar Panel Price in Bangladesh 2026: Full Set & Capacity Breakdown"}
            </h2>
            <p className="text-sm sm:text-base text-[#62706A] mt-3">
              {isBn
                ? "২০০ ওয়াট মৌলিক ডিসি সেটআপ থেকে শুরু করে ১০০০ ওয়াট (১kW) হোম সিস্টেম এবং শিল্প কারখানার মেগাওয়াট স্কেল প্রজেক্ট—প্রয়োজন অনুযায়ী সঠিক ক্যাপাসিটি ও আনুমানিক খরচের ধারণা।"
                : "From 200W DC emergency kits to 1000W residential turnkey setups and megawatt-scale industrial rooftops—transparent capacity and pricing insights."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {packagesList.map((pkg, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-[#F7F8F5] border border-[#DCE4E0] hover:border-[#074031]/30 flex flex-col justify-between transition-all group shadow-2xs hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-white border border-[#DCE4E0] text-[#074031]">
                      {pkg.badge}
                    </span>
                    <Zap className="w-4 h-4 text-[#FEBE16]" />
                  </div>

                  <h3 className="text-base font-bold text-[#074031] mb-1">
                    {pkg.capacity}
                  </h3>
                  <p className="text-xs text-[#62706A] mb-4">
                    {pkg.subtitle}
                  </p>

                  <div className="p-3 rounded-2xl bg-white border border-[#DCE4E0] mb-4">
                    <span className="text-[10px] font-mono text-[#62706A] uppercase tracking-wider block">
                      {isBn ? "বাজেট / মূল্যসীমা" : "Estimated Cost"}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#074031]">
                      {pkg.priceEst}
                    </span>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {pkg.specs.map((spec, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-2 text-xs text-[#62706A]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#074031] shrink-0 mt-0.5" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-[#DCE4E0]/80">
                  <p className="text-[11px] font-medium text-[#17251F] mb-3">
                    {pkg.note}
                  </p>
                  <Link
                    href="/quote"
                    className="inline-flex items-center justify-center w-full gap-2 px-4 py-2 rounded-xl bg-white hover:bg-[#074031] hover:text-white border border-[#DCE4E0] text-xs font-mono font-bold text-[#074031] transition-colors"
                  >
                    <span>{isBn ? "কোটেশন রিকোয়েস্ট" : "Request Pricing"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Educational Brand Comparison & Commercial Importer Value Proposition */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#F7F8F5] border border-[#DCE4E0] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#074031]">
                <Calculator className="w-4 h-4 text-[#FEBE16]" />
                <span>
                  {isBn
                    ? "লোকাল রিটেইল প্যানেল বনাম টিয়ার-১ N-Type TOPCon প্যানেলের বিশ্লেষণ"
                    : "Domestic Retail Modules vs. Tier-1 N-Type TOPCon Comparison"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#62706A] leading-relaxed">
                {isBn
                  ? "ওয়ালটন বা সুপার স্টারের মতো স্থানীয় ব্র্যান্ডগুলো ছোট গৃহস্থালী লাইটিংয়ে ব্যবহার হলেও কারখানা ও বাণিজ্যিক প্রকল্পে আন্তর্জাতিক টিয়ার-১ (BloombergNEF) বাইফেসিয়াল TOPCon প্যানেল অপরিহার্য। নূর সোলার সরাসরি আমদানি করায় কোনো মধ্যস্বত্বভোগী কমিশন ছাড়া সর্বনিম্ন পাইকারি মূল্যে ৩০ বছরের লিনিয়ার পারফরম্যান্স ওয়ারেন্টি নিশ্চিত করা সম্ভব হয়।"
                  : "While local domestic brands serve standard household DC light loads, commercial rooftops, textile mills, and utility-scale projects strictly mandate BloombergNEF Tier-1 N-Type TOPCon bifacial modules. Noor Solar imports directly from global manufacturers to supply certified high-yield modules at direct container wholesale rates with 30-year linear performance warranties."}
              </p>
            </div>
            <Link
              href="/blog/solar-panel-buying-guide-bangladesh"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#074031] text-white text-xs font-bold hover:bg-[#0B513E] transition-colors shadow-xs"
            >
              <span>{isBn ? "সোলার বায়িং গাইড পড়ুন" : "Read Solar Buying Guide"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* ================= PART 4: FAQ SECTION (RICH TOPICAL AUTHORITY) ================= */}
        <div id="faq" className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F1F4F1] border border-[#DCE4E0] text-xs font-mono text-[#074031] mb-3">
              <HelpCircle className="w-3.5 h-3.5 text-[#FEBE16]" />
              <span className="font-semibold">
                {isBn ? "সাধারণ প্রশ্নোত্তর" : "Frequently Asked Questions"}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#074031]">
              {isBn
                ? "সোলার ইকুইপমেন্ট ও সরবরাহ সম্পর্কিত সাধারণ জিজ্ঞাসা"
                : "Everything You Need to Know About Solar Procurement in Bangladesh"}
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group p-6 rounded-2xl bg-[#F7F8F5] border border-[#DCE4E0] open:bg-white open:shadow-xs transition-colors"
              >
                <summary className="flex items-center justify-between cursor-pointer font-bold text-sm sm:text-base text-[#074031] list-none select-none">
                  <span>{faq.q}</span>
                  <span className="w-7 h-7 rounded-full bg-white group-open:bg-[#074031] group-open:text-white border border-[#DCE4E0] flex items-center justify-center text-xs font-mono shrink-0 ml-4 transition-colors">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-xs sm:text-sm text-[#62706A] leading-relaxed pt-2 border-t border-[#DCE4E0]">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>

          {/* FAQ Structured Data Script */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: faqs.map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: f.a,
                  },
                })),
              }),
            }}
          />
        </div>

      </div>
    </section>
  );
}
