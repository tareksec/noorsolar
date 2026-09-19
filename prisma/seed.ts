import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { defaultSiteConfig } from "../src/lib/site-config";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Admin User
  const isProduction = process.env.NODE_ENV === "production";
  const adminEmail = process.env.ADMIN_EMAIL || "owner@example.com";
  const rawPassword = process.env.ADMIN_PASSWORD || "change-me-on-first-login";

  if (isProduction) {
    if (
      !process.env.ADMIN_PASSWORD ||
      process.env.ADMIN_PASSWORD === "change-me-on-first-login" ||
      process.env.ADMIN_PASSWORD.length < 12
    ) {
      console.error(
        "FATAL: In production, ADMIN_PASSWORD must be provided via environment variable, cannot be the default placeholder, and must be at least 12 characters long."
      );
      process.exit(1);
    }
  }

  const passwordHash = await bcrypt.hash(rawPassword, 12);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      email: adminEmail,
      passwordHash,
    },
  });
  console.log(`Admin user ensured: ${adminEmail}`);

  // 2. Site Settings
  await prisma.siteSetting.upsert({
    where: { key: "site_config" },
    update: { value: JSON.stringify(defaultSiteConfig) },
    create: {
      key: "site_config",
      value: JSON.stringify(defaultSiteConfig),
    },
  });
  console.log("Site settings seeded.");

  // 3. Categories
  const categoriesData = [
    {
      slug: "solar-panels",
      name: "Solar Panels",
      description:
        "Monocrystalline, N-Type TOPCon, and bifacial solar modules for commercial rooftop and industrial utility installations.",
      image: "/demo/category-panels.svg",
      sortOrder: 1,
    },
    {
      slug: "lithium-batteries",
      name: "Lithium-ion Batteries",
      description:
        "High-density LiFePO4 server rack batteries and high-voltage modular energy storage systems with smart BMS protocols.",
      image: "/demo/category-batteries.svg",
      sortOrder: 2,
    },
    {
      slug: "solar-inverters",
      name: "Solar Inverters",
      description:
        "Grid-tied, hybrid three-phase, and off-grid pure sine wave solar inverters engineered for industrial and microgrid reliability.",
      image: "/demo/category-inverters.svg",
      sortOrder: 3,
    },
  ];

  const categories: Record<string, string> = {};

  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categories[cat.slug] = created.id;
  }
  console.log("Categories seeded.");

  // 4. Products & Specifications
  const products = [
    // --- Solar Panels ---
    {
      slug: "n-type-topcon-620w-bifacial",
      name: "N-Type TOPCon 620W Bifacial Module",
      categoryId: categories["solar-panels"],
      shortDescription: "Ultra-high power dual-glass module with up to 25% bifacial gain for commercial projects.",
      description:
        "Engineered with advanced 16BB N-Type TOPCon cell technology. Demonstrates superior low-light performance, lower temperature coefficient (-0.30%/°C), and 30-year linear performance warranty. Ideal for factory roofs, commercial sheds, and ground-mounted solar farms in Bangladesh.",
      brand: null,
      model: "NS-620TOP-BF",
      stockStatus: "IN_STOCK",
      moq: "1 Container / 620 pcs (Pallet orders on inquiry)",
      leadTime: "Immediate dispatch from Dhaka",
      isFeatured: true,
      sortOrder: 1,
      images: [
        { url: "/demo/panel-620w-topcon.svg", alt: "N-Type TOPCon 620W Bifacial Solar Panel", sortOrder: 0 },
      ],
      specs: [
        { label: "Nominal Max Power (Pmax)", value: "620 W", sortOrder: 1 },
        { label: "Module Efficiency", value: "22.6%", sortOrder: 2 },
        { label: "Optimum Operating Voltage (Vmp)", value: "43.20 V", sortOrder: 3 },
        { label: "Optimum Operating Current (Imp)", value: "14.36 A", sortOrder: 4 },
        { label: "Open Circuit Voltage (Voc)", value: "51.80 V", sortOrder: 5 },
        { label: "Short Circuit Current (Isc)", value: "15.18 A", sortOrder: 6 },
        { label: "Cell Type & Dimensions", value: "132 Half-cells N-Type TOPCon (2384 × 1134 × 35 mm)", sortOrder: 7 },
        { label: "Weight", value: "33.5 kg (Dual Glass 2.0+2.0mm)", sortOrder: 8 },
      ],
    },
    {
      slug: "bifacial-dual-glass-580w-module",
      name: "Bifacial Dual-Glass 580W Module",
      categoryId: categories["solar-panels"],
      shortDescription: "Heavy-duty commercial panel designed for high humidity and industrial roof temperatures.",
      description:
        "Featuring robust 2.0mm dual-glass structure with PID resistance and exceptional wind/snow load rating. Delivers consistent yield throughout operation with minimal degradation.",
      brand: null,
      model: "NS-580DG-BF",
      stockStatus: "IN_STOCK",
      moq: "50 pcs",
      leadTime: "Immediate warehouse dispatch",
      isFeatured: false,
      sortOrder: 2,
      images: [
        { url: "/demo/panel-580w-bifacial.svg", alt: "Bifacial Dual Glass 580W Solar Panel", sortOrder: 0 },
      ],
      specs: [
        { label: "Nominal Max Power (Pmax)", value: "580 W", sortOrder: 1 },
        { label: "Module Efficiency", value: "21.9%", sortOrder: 2 },
        { label: "Operating Voltage (Vmp)", value: "41.60 V", sortOrder: 3 },
        { label: "Operating Current (Imp)", value: "13.95 A", sortOrder: 4 },
        { label: "Dimensions", value: "2278 × 1134 × 30 mm", sortOrder: 5 },
        { label: "Junction Box & Connectors", value: "IP68 Rated, MC4 Compatible", sortOrder: 6 },
      ],
    },
    {
      slug: "utility-scale-700w-hjt-panel",
      name: "Utility-Scale 700W HJT High-Output Panel",
      categoryId: categories["solar-panels"],
      shortDescription: "Heterojunction (HJT) technology for maximum power density in MW-scale utility power plants.",
      description:
        "High-efficiency HJT cells with ultra-low degradation and 90% bifaciality factor. Engineered for EPC developers seeking minimal balance-of-system (BOS) costs and maximum kWh generation per square meter.",
      brand: null,
      model: "NS-700HJT-UT",
      stockStatus: "ON_REQUEST",
      moq: "1 MW Project Consignment",
      leadTime: "25-35 Days Shipping Indent",
      isFeatured: true,
      sortOrder: 3,
      images: [
        { url: "/demo/panel-700w-hjt.svg", alt: "Utility Scale 700W HJT Solar Panel", sortOrder: 0 },
      ],
      specs: [
        { label: "Nominal Max Power (Pmax)", value: "700 W", sortOrder: 1 },
        { label: "Module Efficiency", value: "23.1%", sortOrder: 2 },
        { label: "Bifaciality", value: "85% - 90%", sortOrder: 3 },
        { label: "Temperature Coefficient (Pmax)", value: "-0.26%/°C", sortOrder: 4 },
        { label: "Cell Format", value: "G12 210mm HJT Cells", sortOrder: 5 },
      ],
    },
    {
      slug: "high-density-mono-perc-450w",
      name: "High-Density Mono PERC 450W Panel",
      categoryId: categories["solar-panels"],
      shortDescription: "Compact form-factor monocrystalline panel for residential and small commercial roofs.",
      description:
        "High space utilization and easy handling for space-constrained rooftops. Standard black frame with anti-reflective high-transmittance tempered glass.",
      brand: null,
      model: "NS-450PERC-C",
      stockStatus: "INCOMING",
      moq: "20 pcs",
      leadTime: "7 Days Delivery",
      isFeatured: false,
      sortOrder: 4,
      images: [
        { url: "/demo/panel-450w-mono.svg", alt: "Mono PERC 450W Solar Panel", sortOrder: 0 },
      ],
      specs: [
        { label: "Nominal Max Power (Pmax)", value: "450 W", sortOrder: 1 },
        { label: "Module Efficiency", value: "20.9%", sortOrder: 2 },
        { label: "Voltage at Pmax (Vmp)", value: "34.80 V", sortOrder: 3 },
        { label: "Dimensions", value: "1903 × 1134 × 30 mm", sortOrder: 4 },
      ],
    },

    // --- Lithium-ion Batteries ---
    {
      slug: "51v-100ah-lifepo4-server-rack-battery",
      name: "51.2V 100Ah LiFePO4 Server Rack Battery",
      categoryId: categories["lithium-batteries"],
      shortDescription: "Standard 3U server rack lithium iron phosphate module with CAN/RS485 smart inverter communication.",
      description:
        "High safety Grade-A prismatic LiFePO4 cells. Features integrated intelligent BMS with over-charge, over-discharge, short-circuit, and thermal protection. Supports up to 15 modules parallel connection for 76.8kWh system scale.",
      brand: "Industrial ESS Spec",
      model: "NS-ESS-51100R",
      stockStatus: "IN_STOCK",
      moq: "2 units",
      leadTime: "Immediate stock dispatch",
      isFeatured: true,
      sortOrder: 1,
      images: [
        { url: "/demo/battery-51v-100ah-rack.svg", alt: "51.2V 100Ah LiFePO4 Rack Battery", sortOrder: 0 },
      ],
      specs: [
        { label: "Nominal Voltage", value: "51.2 V", sortOrder: 1 },
        { label: "Nominal Capacity", value: "100 Ah (5.12 kWh)", sortOrder: 2 },
        { label: "Cell Chemistry", value: "Lithium Iron Phosphate (LiFePO4)", sortOrder: 3 },
        { label: "Cycle Life", value: "> 6000 Cycles @ 80% DoD, 25°C", sortOrder: 4 },
        { label: "Max Continuous Charge Current", value: "100 A", sortOrder: 5 },
        { label: "Max Continuous Discharge Current", value: "100 A", sortOrder: 6 },
        { label: "Communication Protocols", value: "CAN 2.0 / RS485 / RS232", sortOrder: 7 },
        { label: "Dimensions & Weight", value: "442 × 480 × 133 mm (3U) / 44 kg", sortOrder: 8 },
      ],
    },
    {
      slug: "51v-200ah-wall-mount-energy-storage",
      name: "51.2V 200Ah Wall-Mount Energy Storage",
      categoryId: categories["lithium-batteries"],
      shortDescription: "10.24kWh slimline wall-mountable lithium battery with LCD display and multi-brand inverter matching.",
      description:
        "All-in-one residential and light commercial battery station. Sleek aesthetic enclosure with front LCD monitor showing cell voltages, SoC percentage, temperature, and alarms.",
      brand: "Industrial ESS Spec",
      model: "NS-WALL-51200",
      stockStatus: "IN_STOCK",
      moq: "1 unit",
      leadTime: "Immediate dispatch",
      isFeatured: true,
      sortOrder: 2,
      images: [
        { url: "/demo/battery-51v-200ah-powerwall.svg", alt: "51.2V 200Ah Wall Mount Battery", sortOrder: 0 },
      ],
      specs: [
        { label: "Nominal Voltage", value: "51.2 V", sortOrder: 1 },
        { label: "Rated Energy", value: "10.24 kWh", sortOrder: 2 },
        { label: "Discharge Cut-off Voltage", value: "43.2 V", sortOrder: 3 },
        { label: "Charge Cut-off Voltage", value: "58.4 V", sortOrder: 4 },
        { label: "Display", value: "Multi-functional LCD + LED Indicator", sortOrder: 5 },
        { label: "IP Protection", value: "IP54 Indoor Enclosure", sortOrder: 6 },
      ],
    },
    {
      slug: "high-voltage-15kwh-modular-battery-stack",
      name: "High-Voltage 15kWh Modular Battery Stack",
      categoryId: categories["lithium-batteries"],
      shortDescription: "Stackable high-voltage lithium system for three-phase commercial hybrid installations.",
      description:
        "Modular stack design allowing expansion from 10kWh to 40kWh without external cables. Operating at 200V-500V DC for superior round-trip conversion efficiency when coupled with three-phase inverters.",
      brand: "Industrial ESS Spec",
      model: "NS-HV-STACK15",
      stockStatus: "ON_REQUEST",
      moq: "1 system",
      leadTime: "2-3 weeks order shipment",
      isFeatured: false,
      sortOrder: 3,
      images: [
        { url: "/demo/battery-10kwh-highvoltage.svg", alt: "High Voltage Modular Battery Stack", sortOrder: 0 },
      ],
      specs: [
        { label: "Nominal System Voltage", value: "307.2 V", sortOrder: 1 },
        { label: "Energy Capacity", value: "15.36 kWh (3 Stack Modules)", sortOrder: 2 },
        { label: "Round-Trip Efficiency", value: ">= 96.5%", sortOrder: 3 },
        { label: "BMS Protection Level", value: "Class-A Master Controller", sortOrder: 4 },
      ],
    },
    {
      slug: "deep-cycle-12v-200ah-backup-battery",
      name: "Deep Cycle 12V 200Ah Sealed Backup Unit",
      categoryId: categories["lithium-batteries"],
      shortDescription: "Heavy-duty deep cycle unit for telecom towers, UPS systems, and remote off-grid shelters.",
      description:
        "Maintenance-free deep-cycle storage unit built for extreme ambient temperatures and continuous cycling duty in rural substations and cell sites.",
      brand: "Telecom Power Spec",
      model: "NS-DC-12200",
      stockStatus: "IN_STOCK",
      moq: "4 units",
      leadTime: "Immediate dispatch",
      isFeatured: false,
      sortOrder: 4,
      images: [
        { url: "/demo/battery-100ah-gel-backup.svg", alt: "Deep Cycle 12V 200Ah Backup Battery", sortOrder: 0 },
      ],
      specs: [
        { label: "Voltage", value: "12.8 V", sortOrder: 1 },
        { label: "Capacity", value: "200 Ah (2.56 kWh)", sortOrder: 2 },
        { label: "Terminal Type", value: "M8 Brass Insert", sortOrder: 3 },
      ],
    },

    // --- Solar Inverters ---
    {
      slug: "10kw-three-phase-hybrid-solar-inverter",
      name: "10kW Three-Phase Hybrid Solar Inverter",
      categoryId: categories["solar-inverters"],
      shortDescription: "Dual MPPT hybrid inverter supporting DC coupling, emergency backup power (EPS), and battery charging.",
      description:
        "High-performance three-phase hybrid inverter with 150V-800V wide battery input. Provides seamless microsecond transfer to backup power during grid blackouts. Supports unbalanced phase loading and export power limitation for commercial factories.",
      brand: "Industrial Power Spec",
      model: "NS-HYB-10K3P",
      stockStatus: "IN_STOCK",
      moq: "1 unit",
      leadTime: "Immediate dispatch",
      isFeatured: true,
      sortOrder: 1,
      images: [
        { url: "/demo/inverter-10kw-hybrid.svg", alt: "10kW Three Phase Hybrid Solar Inverter", sortOrder: 0 },
      ],
      specs: [
        { label: "Max DC Input Power", value: "15,000 W", sortOrder: 1 },
        { label: "Rated AC Output Power", value: "10,000 W (10 kW)", sortOrder: 2 },
        { label: "AC Grid Voltage / Phase", value: "380V / 400V Three Phase", sortOrder: 3 },
        { label: "MPPT Channels / Strings", value: "2 MPPT / 2 Strings", sortOrder: 4 },
        { label: "MPPT Voltage Range", value: "180 V - 850 V", sortOrder: 5 },
        { label: "Max Efficiency", value: "98.2%", sortOrder: 6 },
        { label: "Battery Compatibility", value: "High Voltage Lithium (160V - 650V)", sortOrder: 7 },
        { label: "Switch Time to Backup", value: "< 10 ms (UPS Class)", sortOrder: 8 },
      ],
    },
    {
      slug: "50kw-commercial-grid-tied-inverter",
      name: "50kW Commercial Grid-Tied Inverter",
      categoryId: categories["solar-inverters"],
      shortDescription: "Utility string inverter with 4 MPPTs, smart I-V curve scanning, and AFCI arc fault protection.",
      description:
        "Designed for industrial rooftop solar projects. Features fanless natural cooling and aluminum enclosure. Built-in Type II DC & AC surge protection and real-time remote monitoring via Wi-Fi/4G.",
      brand: "Industrial Power Spec",
      model: "NS-GRID-50KT",
      stockStatus: "IN_STOCK",
      moq: "1 unit",
      leadTime: "Immediate dispatch",
      isFeatured: true,
      sortOrder: 2,
      images: [
        { url: "/demo/inverter-50kw-commercial.svg", alt: "50kW Commercial Grid-Tied Inverter", sortOrder: 0 },
      ],
      specs: [
        { label: "Rated Output Power", value: "50,000 W (50 kW)", sortOrder: 1 },
        { label: "Max PV Voltage", value: "1100 V", sortOrder: 2 },
        { label: "Number of MPPTs", value: "4 Independent MPPTs (8 Strings)", sortOrder: 3 },
        { label: "Euro Efficiency", value: "98.4%", sortOrder: 4 },
        { label: "Cooling Method", value: "Smart Forced Air Cooling", sortOrder: 5 },
        { label: "Protection Degree", value: "IP66 Outdoor Rated", sortOrder: 6 },
      ],
    },
    {
      slug: "5kw-48v-off-grid-pure-sine-inverter",
      name: "5kW 48V Off-Grid Pure Sine Inverter",
      categoryId: categories["solar-inverters"],
      shortDescription: "Integrated 80A MPPT solar charge controller with clean pure sine wave output for remote installations.",
      description:
        "Compact all-in-one solar inverter charger for off-grid homes, rural branches, and telecom base stations. Compatible with both Lithium-ion and Lead-Acid batteries with customizable charging curves.",
      brand: "Power Systems Spec",
      model: "NS-OFF-5K48",
      stockStatus: "IN_STOCK",
      moq: "2 units",
      leadTime: "Immediate dispatch",
      isFeatured: false,
      sortOrder: 3,
      images: [
        { url: "/demo/inverter-5kw-offgrid.svg", alt: "5kW 48V Off Grid Inverter", sortOrder: 0 },
      ],
      specs: [
        { label: "Rated Power", value: "5000 W / 5000 VA", sortOrder: 1 },
        { label: "Surge Power", value: "10,000 VA (Peak)", sortOrder: 2 },
        { label: "Battery Nominal Voltage", value: "48 V DC", sortOrder: 3 },
        { label: "Max Solar Charge Current", value: "80 A MPPT", sortOrder: 4 },
        { label: "Waveform", value: "Pure Sine Wave", sortOrder: 5 },
      ],
    },
    {
      slug: "100kw-industrial-utility-grid-inverter",
      name: "100kW Industrial Utility Grid Inverter",
      categoryId: categories["solar-inverters"],
      shortDescription: "High-capacity 100kW central string unit with 9 MPPTs for large factory complexes and solar plants.",
      description:
        "Industrial powerhouse inverter capable of handling 150% DC oversizing. Certified anti-islanding and smart reactive power compensation for grid stability compliance in Bangladesh.",
      brand: "Industrial Power Spec",
      model: "NS-IND-100K",
      stockStatus: "ON_REQUEST",
      moq: "1 unit",
      leadTime: "2 weeks project dispatch",
      isFeatured: false,
      sortOrder: 4,
      images: [
        { url: "/demo/inverter-100kw-utility.svg", alt: "100kW Industrial Utility Inverter", sortOrder: 0 },
      ],
      specs: [
        { label: "Nominal AC Power", value: "100 kW @ 400V", sortOrder: 1 },
        { label: "Max Efficiency", value: "98.8%", sortOrder: 2 },
        { label: "MPPT Inputs", value: "9 MPPTs with 18 String Connectors", sortOrder: 3 },
        { label: "String Current", value: "32 A per MPPT (High-current module ready)", sortOrder: 4 },
      ],
    },
  ];

  for (const prod of products) {
    const { images, specs, ...prodData } = prod;
    const existing = await prisma.product.findUnique({ where: { slug: prod.slug } });

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: prodData,
      });
      // Replace specs and images
      await prisma.productImage.deleteMany({ where: { productId: existing.id } });
      await prisma.productImage.createMany({
        data: images.map((img) => ({ ...img, productId: existing.id })),
      });
      await prisma.productSpec.deleteMany({ where: { productId: existing.id } });
      await prisma.productSpec.createMany({
        data: specs.map((sp) => ({ ...sp, productId: existing.id })),
      });
    } else {
      await prisma.product.create({
        data: {
          ...prodData,
          images: { create: images },
          specs: { create: specs },
        },
      });
    }
  }

  console.log("Products seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
