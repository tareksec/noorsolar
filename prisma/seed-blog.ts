export const sampleBlogPosts = [
  {
    title: "How to Size and Select Industrial Solar Inverters for Commercial Rooftops",
    titleBn: "বাণিজ্যিক ছাদের জন্য শিল্প গ্রেড সোলার ইনভার্টার নির্বাচন ও সাইজিং নির্দেশিকা",
    slug: "how-to-size-and-select-industrial-solar-inverters",
    excerpt:
      "A technical engineering guide on DC-to-AC overloading ratios, MPPT configuration, ambient temperature derating, and grid-code compliance for Bangladesh commercial arrays.",
    excerptBn:
      "শিল্প কারখানার ছাদ ও বাণিজ্যিক বিদ্যুৎ প্রকল্পের জন্য DC-to-AC ওভারলোডিং অনুপাত, MPPT বিন্যাস এবং বাংলাদেশের আর্দ্র আবহাওয়ায় ইনভার্টার নির্বাচনের ব্যবহারিক নির্দেশিকা।",
    content: `## Sizing Industrial Solar Inverters

Commercial and industrial solar installations require precise matching between PV array output characteristics and inverter inverter capacity. Choosing the correct inverter ensures optimal yield over the system lifetime.

### 1. DC-to-AC Overloading Ratios (ILR)

Modern commercial string inverters are typically designed with an **Inverter Loading Ratio (ILR)** between **1.15 and 1.30**. In regions like Bangladesh with variable irradiance and high diffuse light during monsoon months:

- Sizing at 1.20x allows the system to operate at peak AC capacity during early morning and late afternoon hours.
- Clipping losses during peak noon irradiance are offset by total daily kWh energy yield gains.

### 2. Maximum Power Point Tracking (MPPT) Layout

Rooftops in industrial clusters (e.g. Gazipur, Narayanganj) often feature multiple roof azimuths, vents, or localized shading:

- Multiple independent MPPT inputs prevent string mismatch losses.
- Maintain string lengths that keep the DC voltage strictly within the inverter's **full-load MPPT voltage window** even under maximum summer module temperatures.

| Consideration | Recommendation | Impact |
|---|---|---|
| String Voltage | 600V - 850V DC | Ensures peak conversion efficiency (>98.5%) |
| Ambient Derating | Check curve at 45°C | Prevents premature thermal power reduction |
| Protection Class | IP65 or IP66 | Shields sensitive power electronics from humidity and dust |

### 3. Grid-Code and Interconnection Standards

Grid-tied inverters must provide anti-islanding protection, low-voltage ride-through (LVRT), and reactive power control per utility guidelines.`,
    contentBn: `## বাণিজ্যিক ছাদের জন্য সোলার ইনভার্টার নির্বাচন ও সাইজিং

শিল্প কারখানা এবং বাণিজ্যিক ভবনে সৌর বিদ্যুৎ ব্যবস্থা স্থাপনের ক্ষেত্রে সোলার প্যানেল অ্যারে এবং ইনভার্টারের ক্ষমতার সঠিক সমন্বয় অত্যন্ত গুরুত্বপূর্ণ। সঠিক সাইজের ইনভার্টার নির্বাচন করলে সিস্টেমের ২৫-৩০ বছরের কার্যকালে সর্বোচ্চ পরিমাণ বিদ্যুৎ উৎপাদন নিশ্চিত করা যায়।

### ১. DC-to-AC ওভারলোডিং অনুপাত (ILR)

বাংলাদেশের আবহাওয়ায় সারা বছর সূর্যের আলো সমান থাকে না। বিশেষ করে বর্ষাকালে ও মেঘলা দিনে আলো বেশ বিক্ষিপ্ত (diffuse) থাকে। এই কারণে আধুনিক বাণিজ্যিক সোলার ডিজাইনে **ইনভার্টার লোডিং রেশিও (ILR)** সাধারণত **১.১৫ থেকে ১.২৫ গুণ** ধরা হয়।

- ১.২০ গুণ ওভারসাইজিং করলে সকাল এবং বিকালের কম আলোতেও ইনভার্টার তার পূর্ণ AC ক্ষমতায় বিদ্যুৎ সরবরাহ করতে পারে।
- দুপুরে কিছুটা ক্লিপিং লস হলেও সারাদিনের মোট উৎপাদিত ইউনিট (kWh) অনেক বৃদ্ধি পায়।

### ২. মাল্টিপল MPPT ও ছাদের শেডিং ব্যবস্থাপনা

গাজীপুর, নারায়ণগঞ্জ বা চট্টগ্রামের শিল্প কারখানার ছাদগুলোতে প্রায়শই ভেন্টিলেটর, টার্বো ফ্যান কিংবা বিভিন্ন ঢাল থাকে:

- একাধিক স্বাধীন MPPT (Maximum Power Point Tracking) চ্যানেল থাকলে ছাদের বিভিন্ন শেডের প্যানেল স্ট্রিং আলাদা রাখা যায়, ফলে একটি অংশের ছায়া অন্য অংশের উৎপাদন কমায় না।
- স্ট্রিং ডিজাইনের সময় খেয়াল রাখতে হবে যেন চরম গরমেও DC ভোল্টেজ ইনভার্টারের ফুল-লোড MPPT রেঞ্জের ভেতরেই থাকে।

| মূল বিবেচ্য বিষয় | প্রকৌশল সুপারিশ | প্রভাব ও ফলাফল |
|---|---|---|
| স্ট্রিং ভোল্টেজ | 600V - 850V DC | সর্বোচ্চ রূপান্তর দক্ষতা (>৯৮.৫%) বজায় রাখে |
| থার্মাল ডিরেটিং | ৪৫°C তাপমাত্রার ডিরেটিং কার্ভ দেখুন | তীব্র গরমে অপ্রয়োজনীয় বিদ্যুৎ হ্রাস রোধ করে |
| সুরক্ষা রেটিং | IP65 অথবা IP66 | কারখানার ধুলাবালি ও আর্দ্রতা থেকে ইলেকট্রনিক্স রক্ষা করে |

### ৩. গ্রিড সুরক্ষা ও নেট মিটারিং নির্দেশিকা

বাণিজ্যিক নেট মিটারিং প্রকল্পের জন্য ইনভার্টারে অ্যান্টি-আইল্যান্ডিং সুরক্ষা, ফল্ট রাইড-থ্রু এবং প্রতিক্রিয়াশীল শক্তি নিয়ন্ত্রণ ব্যবস্থা থাকা বাধ্যতামূলক। ইনভার্টার ক্রয়ের আগে ডিস্ট্রিবিউশন কোম্পানির প্রয়োজনীয় অনুমোদন ও সার্টিফিকেশন যাচাই করে নেওয়া উচিত।`,
    coverImage: "/demo/products/30kw-on-grid-string-inverter-three-phase-angled.jpg",
    coverAlt: "Commercial solar inverter installation",
    coverAltBn: "বাণিজ্যিক কারখানায় শিল্প গ্রেড সোলার ইনভার্টার স্থাপন",
    tags: "Inverters, Engineering, B2B",
    tagsBn: "ইনভার্টার, ইঞ্জিনিয়ারিং, B2B, নেট মিটারিং",
    status: "PUBLISHED",
    authorName: "Engr. Noor Solar Expert",
    metaTitle: "Industrial Solar Inverter Sizing Guide — Noor Solar Energy",
    metaTitleBn: "বাণিজ্যিক ছাদের সোলার ইনভার্টার নির্বাচন ও সাইজিং — নূর সোলার এনার্জি",
    metaDescription:
      "Engineering insights on DC-to-AC ratios, MPPT configuration, and thermal derating for commercial PV arrays.",
    metaDescriptionBn:
      "শিল্প কারখানার জন্য উপযুক্ত সোলার ইনভার্টার নির্বাচন, MPPT কনফিগারেশন এবং বাংলাদেশের আবহাওয়ায় থার্মাল সুরক্ষার কারিগরি গাইড।",
    isSample: true,
    publishedAt: new Date("2026-01-15T09:00:00.000Z"),
  },
  {
    title: "LiFePO4 vs. Traditional Lead-Acid Batteries in Solar Energy Storage Systems",
    titleBn: "সৌর বিদ্যুৎ সঞ্চয়ে LiFePO4 বনাম লেড-অ্যাসিড ব্যাটারি: বাণিজ্যিক তুলনামূলক বিশ্লেষণ",
    slug: "lifepo4-vs-lead-acid-batteries-solar-storage",
    excerpt:
      "Comparing Lithium Iron Phosphate (LiFePO4) and tubular lead-acid deep cycle batteries across cycle life, usable depth of discharge, thermal stability, and levelized cost of storage.",
    excerptBn:
      "সাইকেল লাইফ, ব্যবহারের গভীরতা (DoD), কার্যক্ষমতা এবং দীর্ঘমেয়াদী স্টোরেজ খরচের নিরিখে লিথিয়াম আয়রন ফসফেট ও প্রচলিত লেড-অ্যাসিড ব্যাটারির বাস্তব মূল্যায়ন।",
    content: `## Battery Chemistry Comparison for Solar Energy Storage

Energy storage is crucial for uninterrupted commercial power and hybrid solar architectures. While deep-cycle lead-acid has historical market presence, Lithium Iron Phosphate (LiFePO4) has become the commercial standard.

### Technical Metrics Comparison

| Parameter | Lithium Iron Phosphate (LiFePO4) | Tubular Lead-Acid (Gel / Flooded) |
|---|---|---|
| **Cycle Life (80% DoD)** | 6,000+ Cycles | 1,200 – 1,500 Cycles |
| **Usable Capacity (DoD)** | 90% – 95% | 50% max recommended |
| **Round-Trip Efficiency** | 95% – 98% | 75% – 82% |
| **Operating Temperature** | -10°C to 55°C | 20°C to 30°C optimal |
| **Weight & Footprint** | 1/3 of Lead-Acid weight | Heavy, requires reinforced flooring |
| **Maintenance** | Zero maintenance, integrated BMS | Periodic watering / terminal cleaning |

### Levelized Cost of Storage (LCOS)

Although initial capital expenditure is higher for LiFePO4:
1. **Replacement Frequency**: Lead-acid batteries require complete replacement every 2 to 3 years under heavy daily cyclic use, multiplying procurement and downtime costs.
2. **Space Efficiency**: A 48V 200Ah LiFePO4 server-rack module replaces entire battery rooms, freeing industrial warehouse space.
3. **Smart BMS Telemetry**: Modern lithium units provide RS485/CAN communication directly to hybrid inverters for precise state-of-charge management.`,
    contentBn: `## সোলার এনার্জি স্টোরেজে ব্যাটারি প্রযুক্তির তুলনামূলক বিশ্লেষণ

নিরবচ্ছিন্ন বিদ্যুৎ সরবরাহ নিশ্চিত করতে এবং পিক আওয়ারে বিদ্যুতের খরচ কমাতে বাণিজ্যিক স্থাপনায় এনার্জি স্টোরেজ এখন অপরিহার্য। দীর্ঘকাল ধরে টিউবুলার লেড-অ্যাসিড ব্যাটারি বাজারে প্রচলিত থাকলেও, আধুনিক শিল্প ও বাণিজ্যিক সোলার সিস্টেমে লিথিয়াম আয়রন ফসফেট (LiFePO4) এখন প্রধান পছন্দের প্রযুক্তি।

### কারিগরি বৈশিষ্ট্যের সরাসরি তুলনা

| বৈশিষ্ট্য | লিথিয়াম আয়রন ফসফেট (LiFePO4) | টিউবুলার লেড-অ্যাসিড ব্যাটারি |
|---|---|---|
| **সাইকেল লাইফ (80% DoD)** | ৬,০০০+ সাইকেল (১০-১৫ বছর) | ১,২০০ – ১,৫০০ সাইকেল (২-৩ বছর) |
| **ব্যবহারযোগ্য ক্ষমতা (DoD)** | ৯০% – ৯৫% পর্যন্ত নিরাপদে ব্যবহার্য | সর্বোচ্চ ৫০% ব্যবহারের সুপারিশ |
| **চার্জিং ও ডিসচার্জিং দক্ষতা** | ৯৫% – ৯৮% | ৭৫% – ৮২% |
| **কার্যকর তাপমাত্রা পরিসীমা** | -১০°C থেকে ৫৫°C পর্যন্ত স্বাভাবিক | ২০°C থেকে ৩০°C এর বাইরে দ্রুত ক্ষয় |
| **ওজন ও জায়গার প্রয়োজনীয়তা** | ওজনে ১/৩ ভাগ, কমপ্যাক্ট সার্ভার র্যাক | অত্যন্ত ভারী, মজবুত মেঝে ও আলাদা রুম লাগে |
| **রক্ষণাবেক্ষণ চাহিদা** | সম্পূর্ণ রক্ষণাবেক্ষণমুক্ত, স্মার্ট BMS যুক্ত | নিয়মিত পানি ঢালা ও টার্মিনাল পরিষ্কারের ঝামেলা |

### দীর্ঘমেয়াদী খরচ বা লেভেলাইজড কস্ট (LCOS)

প্রাথমিক ক্রয়ে LiFePO4 ব্যাটারির দাম লেড-অ্যাসিডের চেয়ে বেশি মনে হলেও সামগ্রিক মেয়াদে এটি অনেক সাশ্রয়ী:

১. **ঘন ঘন ব্যাটারি বদলানোর প্রয়োজন নেই**: দৈনিক ব্যবহারে লেড-অ্যাসিড ব্যাটারি প্রতি আড়াই থেকে তিন বছর পর সম্পূর্ণ নষ্ট হয়ে যায়। ফলে বারবার নতুন ব্যাটারি কেনা এবং উৎপাদন বন্ধ থাকার ঝুঁকি তৈরি হয়।
২. **জায়গার সর্বোত্তম ব্যবহার**: একটি 48V 200Ah সার্ভার র্যাক LiFePO4 মডিউল পুরো একটি ব্যাটারি রুমের সমান ব্যাকআপ দেয়, যা আপনার কারখানার মূল্যবান ফ্লোর স্পেস বাঁচায়।
৩. **স্মার্ট BMS যোগাযোগ**: লিথিয়াম ব্যাটারির আধুনিক BMS সরাসরি হাইব্রিড ইনভার্টারের সাথে যোগাযোগ করে প্রতিটি সেলের চার্জ এবং তাপমাত্রা নিয়ন্ত্রণ করে, যা অগ্নিকাণ্ডের ঝুঁকি সম্পূর্ণ দূর করে।`,
    coverImage: "/demo/products/48v-200ah-lifepo4-rack-battery-front.jpg",
    coverAlt: "LiFePO4 rack mount battery modules",
    coverAltBn: "বাণিজ্যিক সার্ভার র্যাক LiFePO4 ব্যাটারি মডিউল",
    tags: "Batteries, LiFePO4, Energy Storage",
    tagsBn: "ব্যাটারি, LiFePO4, এনার্জি স্টোরেজ, লিথিয়াম-আয়ন",
    status: "PUBLISHED",
    authorName: "Technical Staff",
    metaTitle: "LiFePO4 vs Lead-Acid Solar Batteries — Technical Guide",
    metaTitleBn: "LiFePO4 বনাম লেড-অ্যাসিড সোলার ব্যাটারি — প্রযুক্তিগত তুলনা",
    metaDescription:
      "Comparison of cycle life, efficiency, and levelized cost of storage between LiFePO4 and lead-acid batteries.",
    metaDescriptionBn:
      "বাণিজ্যিক সোলার সিস্টেমে LiFePO4 ব্যাটারি ও লেড-অ্যাসিড ব্যাটারির সাইকেল লাইফ, চার্জিং দক্ষতা ও খরচের বিশদ তুলনা।",
    isSample: true,
    publishedAt: new Date("2026-02-01T10:30:00.000Z"),
  },
  {
    title: "What Technical Specifications to Include in a Bulk Solar Equipment Quote Request",
    titleBn: "সোলার যন্ত্রপাতির পাইকারি কোটেশন চাওয়ার সময় যেসব কারিগরি তথ্য উল্লেখ করবেন",
    slug: "what-to-include-in-bulk-solar-quote-request",
    excerpt:
      "Speed up wholesale procurement and receive accurate BOM estimates by providing complete technical parameters for panels, inverters, and battery storage.",
    excerptBn:
      "সোলার প্যানেল, ইনভার্টার ও ব্যাটারির পাইকারি ক্রয়ের ক্ষেত্রে সঠিক স্পেসিফিকেশন ও প্রয়োজনীয় তথ্যের চেকলিস্ট, যা দ্রুত এবং নির্ভুল কোটেশন পেতে সহায়তা করবে।",
    content: `## Preparing a Comprehensive Wholesale Solar Equipment Request

When requesting bulk equipment quotations for EPC projects, commercial factory rooftops, or wholesale distribution, providing detailed engineering specifications eliminates delays and ensures accurate delivery lead times.

### Key Equipment Information to Specify

#### 1. Solar Photovoltaic Modules
- **Cell Technology**: N-Type TOPCon, Heterojunction (HJT), or Mono PERC.
- **Form Factor & Wattage**: e.g., 580W – 620W high-efficiency bifacial modules.
- **Glass Configuration**: Dual-glass bifacial vs. transparent backsheet.
- **Quantity or Target DC Capacity**: Total module units or MWp capacity required.

#### 2. Grid-Tie or Hybrid Inverters
- **AC Output Voltage**: 400V 3-phase, 230V single-phase, or medium-voltage skid.
- **Total Inverter Sizing**: Specific unit ratings (e.g. 5x 100kW string inverters).
- **Communication Protocols**: RS485, Modbus TCP, 4G / Wi-Fi telemetry dongles.

#### 3. Battery Storage (BESS)
- **DC Bus Voltage**: Low-voltage (48V / 51.2V) or High-voltage series strings.
- **Usable Energy**: Total kWh storage capacity needed and maximum discharge C-rate.
- **Form Factor**: Wall-mount, server rack enclosure, or outdoor containerized skid.

### Logistics & Documentation Requirements

State any required testing certifications upfront:
- Flash test reports, EL (Electroluminescence) inspection images, and factory calibration certificates.
- Delivery location (Chittagong port delivery, central warehouse, or direct site logistics).`,
    contentBn: `## সোলার ইকুইপমেন্টের পাইকারি কোটেশন চাওয়ার প্রস্তুতি

বাণিজ্যিক প্রকল্প, কারখানার ছাদ কিংবা পাইকারি পুনঃবিক্রয়ের জন্য যখন আপনি সোলার যন্ত্রপাতির কোটেশন চাইবেন, তখন শুরুতেই স্পষ্ট কারিগরি বিবরণ দিলে সবচেয়ে সঠিক মূল্য এবং দ্রুত ডেলিভারি সময় পাওয়া সম্ভব হয়।

### যেসব প্রয়োজনীয় তথ্য উল্লেখ করবেন

#### ১. সোলার ফটোভোলটাইক প্যানেল
- **সেল প্রযুক্তি**: এন-টাইপ TOPCon, মনো পার্ক নাকি বাইফেসিয়াল মডিউল।
- **প্যানেলের ওয়াটেজ**: যেমন 585W অথবা 620W উচ্চ ক্ষমতার মডিউল।
- **গ্লাসের ধরন**: ডুয়াল গ্লাস (উভয় পিঠে কাঁচ) নাকি সিঙ্গেল গ্লাস ব্যাকশিট।
- **পরিমাণ বা ক্ষমতা**: মোট পিস সংখ্যা অথবা কাঙ্ক্ষিত মোট কিলোওয়াট (kWp) ক্ষমতা।

#### ২. সোলার ইনভার্টার (অন-গ্রিড বা হাইব্রিড)
- **আউটপুট ভোল্টেজ ও ফেজ**: 400V থ্রি-ফেজ নাকি 230V সিঙ্গেল-ফেজ।
- **ইউনিট সংখ্যা ও ক্ষমতা**: প্রতিটি ইউনিটের ওয়াটেজ (যেমন: ৫টি 30kW ইনভার্টার)।
- **গ্রিড সুরক্ষা ও মনিটরিং**: RS485, Wi-Fi বা 4G রিমোট মনিটরিং সুবিধা প্রয়োজন কি না।

#### ৩. লিথিয়াম ব্যাটারি এনার্জি স্টোরেজ
- **ভোল্টেজ সিস্টেম**: লো-ভোল্টেজ (48V / 51.2V) নাকি হাই-ভোল্টেজ র্যাক।
- **সঞ্চয় ক্ষমতা**: প্রয়োজনীয় মোট ব্যাকআপ সময় বা মোট kWh ক্ষমতা।
- **মাউন্টিং ডিজাইন**: সার্ভার র্যাক ক্যাবিনেট নাকি ওয়াল-মাউন্ট স্লিম ডিজাইন।

### লজিস্টিকস ও টেস্ট সার্টিফিকেটের চাহিদা

কোটেশনের অনুরোধ পাঠানোর সময় অতিরিক্ত কিছু শর্ত শুরুতেই উল্লেখ করলে সুবিধা হয়:
- প্রস্তুতকারকের ফ্ল্যাশ টেস্ট রিপোর্ট (Flash Test) এবং EL টেস্টিং ইমেজ প্রয়োজন কি না।
- ডেলিভারির কাঙ্ক্ষিত গন্তব্য (আমাদের ঢাকা ওয়্যারহাউস থেকে সরাসরি পিকআপ নাকি প্রকল্প সাইটে সরাসরি ট্রাক সরবরাহ)।`,
    coverImage: "/demo/products/n-type-topcon-bifacial-module-620w-front.jpg",
    coverAlt: "Bulk solar PV equipment delivery",
    coverAltBn: "পাইকারি সৌর বিদ্যুৎ সামগ্রী পরিবহন ও সরবরাহ",
    tags: "Procurement, Wholesale, EPC",
    tagsBn: "পাইকারি ক্রয়, প্রকিউরমেন্ট, B2B, কোটেশন",
    status: "PUBLISHED",
    authorName: "Commercial Operations",
    metaTitle: "How to Request Bulk Solar Equipment Quotes — Noor Solar Energy",
    metaTitleBn: "পাইকারি সোলার যন্ত্রপাতির কোটেশন নির্দেশিকা — নূর সোলার এনার্জি",
    metaDescription:
      "Checklist of module, inverter, and battery specifications required for fast and accurate wholesale solar quotations.",
    metaDescriptionBn:
      "সোলার প্যানেল, ইনভার্টার ও ব্যাটারির দ্রুত এবং নির্ভুল পাইকারি কোটেশন পেতে প্রয়োজনীয় স্পেসিফিকেশন তালিকা।",
    isSample: true,
    publishedAt: new Date("2026-02-20T14:15:00.000Z"),
  },
];
