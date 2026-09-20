export const sampleBlogPosts = [
  {
    title: "How to Size and Select Industrial Solar Inverters for Commercial Rooftops",
    slug: "how-to-size-and-select-industrial-solar-inverters",
    excerpt:
      "A technical engineering guide on DC-to-AC overloading ratios, MPPT configuration, ambient temperature derating, and grid-code compliance for Bangladesh commercial arrays.",
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
    coverImage: "/demo/products/30kw-on-grid-string-inverter-three-phase-angled.jpg",
    coverAlt: "Commercial solar inverter installation",
    tags: "Inverters, Engineering, B2B",
    status: "PUBLISHED",
    authorName: "Engr. Noor Solar Expert",
    metaTitle: "Industrial Solar Inverter Sizing Guide — Noor Solar Energy",
    metaDescription:
      "Engineering insights on DC-to-AC ratios, MPPT configuration, and thermal derating for commercial PV arrays.",
    isSample: true,
    publishedAt: new Date("2026-01-15T09:00:00.000Z"),
  },
  {
    title: "LiFePO4 vs. Traditional Lead-Acid Batteries in Solar Energy Storage Systems",
    slug: "lifepo4-vs-lead-acid-batteries-solar-storage",
    excerpt:
      "Comparing Lithium Iron Phosphate (LiFePO4) and tubular lead-acid deep cycle batteries across cycle life, usable depth of discharge, thermal stability, and levelized cost of storage.",
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
    coverImage: "/demo/products/48v-200ah-lifepo4-rack-battery-front.jpg",
    coverAlt: "LiFePO4 rack mount battery modules",
    tags: "Batteries, LiFePO4, Energy Storage",
    status: "PUBLISHED",
    authorName: "Technical Staff",
    metaTitle: "LiFePO4 vs Lead-Acid Solar Batteries — Technical Guide",
    metaDescription:
      "Comparison of cycle life, efficiency, and levelized cost of storage between LiFePO4 and lead-acid batteries.",
    isSample: true,
    publishedAt: new Date("2026-02-01T10:30:00.000Z"),
  },
  {
    title: "What Technical Specifications to Include in a Bulk Solar Equipment Quote Request",
    slug: "what-to-include-in-bulk-solar-quote-request",
    excerpt:
      "Speed up wholesale procurement and receive accurate BOM estimates by providing complete technical parameters for panels, inverters, and battery storage.",
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
    coverImage: "/demo/products/n-type-topcon-bifacial-module-620w-front.jpg",
    coverAlt: "Bulk solar PV equipment delivery",
    tags: "Procurement, Wholesale, EPC",
    status: "PUBLISHED",
    authorName: "Commercial Operations",
    metaTitle: "How to Request Bulk Solar Equipment Quotes — Noor Solar Energy",
    metaDescription:
      "Checklist of module, inverter, and battery specifications required for fast and accurate wholesale solar quotations.",
    isSample: true,
    publishedAt: new Date("2026-02-20T14:15:00.000Z"),
  },
];
