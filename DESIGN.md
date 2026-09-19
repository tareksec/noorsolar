# Design Specification: Next-Gen Vehicle Charger Dashboard

## 1. Design Philosophy & Overview
* **Design Style:** Eco-Futuristic Minimalism with Glassmorphic Overlays.
* **Mood & Tone:** Sustainable, clean, technical, high-performance, and calm.
* **Core Metaphor:** Nature meets High-Tech (Biophilic 3D greenery fused with transparent crystalline cubes).

---

## 2. Color System (Tokens & Variables)

### Primary & Accent Colors
* **Accent Volt Lime:** `#CEF23E` (Brand highlight, Primary CTA, Logo circle, Glow effects)
* **Accent Lime Dark / Hover:** `#B8DC2F`
* **Deep Charcoal (Text / Dark Buttons):** `#111311` (Primary headings, Primary pill buttons)
* **Secondary Text / Muted Gray:** `#5C605C` (Body copy, technical metadata)
* **Subtle Gray / Borders:** `#DDE1DC`

### Surface & Background Colors
* **Canvas / Viewport Background:** `#E4E7E4` (Subtle off-white warm gray)
* **Main Container Card:** `#EDEDED` (Inner rounded dashboard frame)
* **Surface White (Cards & Widgets):** `#FFFFFF` (Bottom cards, action widgets)
* **Glass Surface (Frosted Glass):** `rgba(255, 255, 255, 0.45)`
* **Glass Border:** `rgba(255, 255, 255, 0.65)`

---

## 3. Typography Hierarchy

* **Primary Font Family:** `Inter`, `Neue Haas Grotesk`, or `Roobert` (Sans-Serif)
* **Monospace Font Family:** `JetBrains Mono` or `SF Mono` (Technical specs, metrics, codes)

| Element | Font Family | Size | Weight | Line Height | Tracking / Letter Spacing |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Title (H1)** | Sans-Serif | `56px` – `64px` | SemiBold (600) | `1.05` | `-0.03em` |
| **Sub-headline** | Sans-Serif | `15px` | Regular (400) | `1.4` | `normal` |
| **Category Tag** | Sans-Serif | `14px` | Medium (500) | `1.2` | `normal` |
| **Nav Links** | Sans-Serif | `14px` | Medium (500) | `1.2` | `normal` |
| **Pill Button Text** | Sans-Serif | `13px` – `14px` | Medium (500) | `1.0` | `normal` |
| **Card Title** | Sans-Serif | `13px` | Medium (500) | `1.2` | `normal` |
| **Card Subtitle / Specs** | Monospace | `11px` | Regular (400) | `1.3` | `normal` |
| **Technical Specs Row** | Monospace | `12px` | Medium (500) | `1.2` | `0.02em` |

---

## 4. Spacing, Elevation & Layout Grid

* **Frame Dimensions:** `1440px × 900px` (Desktop Artboard standard)
* **Outer Margin / Padding:** `40px` inside container wrapper
* **Corner Radius (Border Radius):**
  * Dashboard Main Container: `40px`
  * Floating Glass Cards: `24px`
  * Bottom Dock Cards: `9999px` (Full Pill) or `40px`
  * Standard CTA Buttons: `9999px` (Full Pill)
  * Thumbnail Images: `50%` (Circle `rounded-full`)
* **Elevation & Shadows:**
  * Floating Glass Cards: `0 20px 40px -10px rgba(0, 0, 0, 0.08)`
  * Bottom Dock Pill Cards: `0 8px 24px -6px rgba(0, 0, 0, 0.04)`
  * Backdrop Blur: `backdrop-filter: blur(16px) saturate(180%)`

---

## 5. Component Breakdown

### 5.1 Navigation Bar (Top)
* **Left Section:**
  * **Logo Avatar:** `38px × 38px` circle in Volt Lime (`#CEF23E`), lowercase bold `g` in center.
  * **Menu Trigger:** 2-line hamburger icon (`=`) followed by the label `Menu` (`font-size: 14px`, `color: #111311`).
* **Center Section:**
  * **Tab Links:** Horizontal layout with `Charge` (active with bottom underline bar) and `• Optimize`.
* **Right Section:**
  * **Voltage Widget:** Outlined pill toggle (`height: 36px`, `border: 1px solid #111311`) displaying `+8k v` and a dual-slider toggle icon inside.

### 5.2 Hero Left Section (Content & Call To Action)
* **Kicker:** "Power Stations for a Green Planet 🌱" (`font-size: 14px`, `#111311`).
* **Title (H1):**
  * Inclined Arrow: `↗` (Icon positioned top-left of the headline).
  * Headline Text: "Next Generation .<br/>Vehicle Charger ." (Trailing full-stops for design aesthetic).
  * *Visual effect:* Subtle green ambient glow behind "Next Generation".
* **Description:** "Say hello to the next-gen ai-based electric vehicle charging stations".
* **Button Group:**
  * **Primary CTA:** Volt Lime pill (`bg-[#CEF23E]`, `px-6 py-3`, `rounded-full`), text: "↗ Directions".
  * **Secondary Link:** Inline text link "Browse electric grid →" (`color: #111311`, `underline-offset: 4px`).
* **Specs & Certification Footer:**
  * Row 1 (Mono Specs): `gbt 125.000` | `ISO 15118` | `EV - 27.00 °C`.
  * Row 2 (Compliance Icons): Outlined icons for CE, Recyclable, ISO loop, Charging socket, Ground standard.

### 5.3 Hero Right Section (3D Asset & Floating Glass Cards)
* **Hero 3D Illustration:** Transparent refractive isometric glass station with internal circuitry and a lush moss/grass terrain top.
* **Glass Card A (Station Route):**
  * Frosted glass card tilted in perspective.
  * Displays circuit map path nodes.
  * Label: "Station n. 3456" | `(4 km - 12000 v)`.
* **Glass Card B (Battery / Capsule Level):**
  * Vertical capsule battery indicator with multi-color gradient (`#CEF23E` to `#00D2FF` to `#FFB800`).
* **Location Pin Card (Bottom-right of 3D asset):**
  * Circular pin indicator icon (`▲`).
  * Text: **3456 Duffy Street**, Arlington Heights.
  * Link: `Closest station to you` (Subtle underline).

### 5.4 Bottom Dock / Quick Action Cards
Three pill-shaped horizontal micro-cards placed across the bottom:

1. **Card 1 (Power Boost):**
   * Left: Circular photo thumbnail (`48px × 48px`, steering wheel cockpit).
   * Center: "Take more power now" / `(0.95 k at 7300 v)`.
   * Right: Black pill button `Add` (`bg-[#111311]`, text white).
2. **Card 2 (Charger Compatibility):**
   * Left: Circular photo thumbnail (`48px × 48px`, charging plug handle).
   * Center: "Charger for any kind" / `(3840 k at 8800 v)`.
   * Right: Black pill button `Buy` (`bg-[#111311]`, text white).
3. **Card 3 (Upgrade Plan):**
   * Left: Circular photo thumbnail (`48px × 48px`, dashboard cluster).
   * Center: "Upgrade charge level" / `(level . 3846 - 36)`.
   * Right: Black pill button `Get` (`bg-[#111311]`, text white).

---

## 6. CSS & Tailwind Code References

### Glassmorphism Utility Class
```css
.glass-panel {
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.65);
  box-shadow: 0 16px 32px -8px rgba(0, 0, 0, 0.05);
}