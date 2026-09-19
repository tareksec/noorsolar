const fs = require('fs');
const path = require('path');

const demoDir = path.join(__dirname, '..', 'public', 'demo');
if (!fs.existsSync(demoDir)) {
  fs.mkdirSync(demoDir, { recursive: true });
}

function createSVG({ title, category, spec1, spec2, accentColor = '#CEF23E', iconType = 'panel' }) {
  let illustration = '';
  
  if (iconType === 'panel') {
    illustration = `
      <g transform="translate(200, 110)">
        <!-- Solar Panel Grid in 3D Isometric View -->
        <polygon points="100,20 300,50 200,210 0,180" fill="#111311" stroke="${accentColor}" stroke-width="2.5" />
        <!-- Internal Grid Lines -->
        <line x1="100" y1="20" x2="0" y2="180" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" />
        <line x1="150" y1="28" x2="50" y2="188" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" />
        <line x1="200" y1="35" x2="100" y2="195" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" />
        <line x1="250" y1="42" x2="150" y2="202" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" />

        <line x1="33" y1="73" x2="233" y2="103" stroke="rgba(206,242,62,0.6)" stroke-width="1.5" />
        <line x1="66" y1="126" x2="266" y2="156" stroke="rgba(206,242,62,0.6)" stroke-width="1.5" />
        
        <!-- Glass reflections -->
        <polygon points="20,160 160,40 180,43 40,163" fill="rgba(255,255,255,0.18)" />
      </g>
    `;
  } else if (iconType === 'battery') {
    illustration = `
      <g transform="translate(210, 110)">
        <!-- Battery Enclosure -->
        <rect x="30" y="20" width="220" height="190" rx="16" fill="#111311" stroke="#333833" stroke-width="2" />
        <!-- Front Rack Faceplate -->
        <rect x="45" y="35" width="190" height="160" rx="8" fill="#1A1D1A" stroke="rgba(255,255,255,0.1)" />
        <!-- Battery Level Capsule -->
        <rect x="65" y="60" width="150" height="24" rx="12" fill="#0D0F0D" />
        <rect x="68" y="63" width="120" height="18" rx="9" fill="url(#limeGradient)" />
        <!-- LED Status Indicator -->
        <circle cx="75" cy="115" r="5" fill="${accentColor}" />
        <circle cx="95" cy="115" r="5" fill="#5C605C" />
        <circle cx="115" cy="115" r="5" fill="#5C605C" />
        <!-- Terminals / Handles -->
        <rect x="15" y="90" width="15" height="50" rx="4" fill="#333833" />
        <rect x="250" y="90" width="15" height="50" rx="4" fill="#333833" />
        <!-- Battery Cells Lines -->
        <line x1="65" y1="150" x2="215" y2="150" stroke="#333833" stroke-width="2" />
        <line x1="65" y1="165" x2="215" y2="165" stroke="#333833" stroke-width="2" />
      </g>
    `;
  } else if (iconType === 'inverter') {
    illustration = `
      <g transform="translate(210, 100)">
        <!-- Inverter Unit Chassis -->
        <rect x="30" y="20" width="220" height="200" rx="20" fill="#111311" stroke="#333833" stroke-width="2" />
        <!-- Heat Sink Top Fins -->
        <rect x="50" y="10" width="180" height="10" rx="2" fill="#222622" />
        <line x1="70" y1="10" x2="70" y2="20" stroke="#111311" stroke-width="3" />
        <line x1="100" y1="10" x2="100" y2="20" stroke="#111311" stroke-width="3" />
        <line x1="130" y1="10" x2="130" y2="20" stroke="#111311" stroke-width="3" />
        <line x1="160" y1="10" x2="160" y2="20" stroke="#111311" stroke-width="3" />
        <line x1="190" y1="10" x2="190" y2="20" stroke="#111311" stroke-width="3" />
        <!-- Digital Display Screen -->
        <rect x="60" y="55" width="160" height="70" rx="10" fill="#0D0F0D" stroke="rgba(255,255,255,0.08)" />
        <text x="75" y="85" fill="${accentColor}" font-family="monospace" font-size="14" font-weight="bold">50.0 Hz | 230V</text>
        <text x="75" y="108" fill="#FFFFFF" font-family="monospace" font-size="11" opacity="0.8">PURE SINE WAVE</text>
        <!-- Dial & Navigation Pill -->
        <circle cx="140" cy="165" r="18" fill="#1E231E" stroke="${accentColor}" stroke-width="1.5" />
        <circle cx="140" cy="165" r="6" fill="${accentColor}" />
      </g>
    `;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 450" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#EDEDED" />
      <stop offset="100%" stop-color="#E4E7E4" />
    </linearGradient>
    <linearGradient id="limeGradient" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#CEF23E" />
      <stop offset="100%" stop-color="#B8DC2F" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="45%" r="45%">
      <stop offset="0%" stop-color="#CEF23E" stop-opacity="0.22" />
      <stop offset="100%" stop-color="#CEF23E" stop-opacity="0" />
    </radialGradient>
    <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(0,0,0,0.03)" stroke-width="1"/>
    </pattern>
  </defs>

  <!-- Background Base -->
  <rect width="700" height="450" rx="32" fill="url(#bgGrad)" />
  <rect width="700" height="450" rx="32" fill="url(#grid)" />

  <!-- Ambient Glow -->
  <circle cx="350" cy="210" r="180" fill="url(#glow)" />

  <!-- Dynamic Illustration -->
  ${illustration}

  <!-- Meta Badge -->
  <g transform="translate(40, 42)">
    <rect width="140" height="32" rx="16" fill="rgba(255,255,255,0.75)" stroke="rgba(255,255,255,0.9)" />
    <circle cx="16" cy="16" r="5" fill="${accentColor}" />
    <text x="28" y="21" fill="#111311" font-family="sans-serif" font-size="11" font-weight="600" letter-spacing="0.05em">${category.toUpperCase()}</text>
  </g>

  <!-- Title & Specs Glass Footer -->
  <g transform="translate(40, 350)">
    <rect width="620" height="66" rx="20" fill="rgba(255,255,255,0.65)" stroke="rgba(255,255,255,0.8)" style="backdrop-filter: blur(12px);" />
    <text x="24" y="28" fill="#111311" font-family="sans-serif" font-size="16" font-weight="700">${title}</text>
    <text x="24" y="50" fill="#5C605C" font-family="monospace" font-size="12">${spec1} &bull; ${spec2}</text>
    
    <g transform="translate(520, 16)">
      <rect width="80" height="34" rx="17" fill="#111311" />
      <text x="40" y="22" fill="#CEF23E" font-family="sans-serif" font-size="12" font-weight="600" text-anchor="middle">SPEC</text>
    </g>
  </g>
</svg>`;
}

const items = [
  // Categories
  { file: 'category-panels.svg', title: 'Solar Panels', category: 'Category', spec1: 'N-Type TOPCon & Bifacial', spec2: 'Up to 700W+', iconType: 'panel' },
  { file: 'category-batteries.svg', title: 'Lithium-ion Batteries', category: 'Category', spec1: 'LiFePO4 Chemistry', spec2: '6000+ Cycles', iconType: 'battery' },
  { file: 'category-inverters.svg', title: 'Solar Inverters', category: 'Category', spec1: 'Hybrid, On-Grid & Off-Grid', spec2: 'Pure Sine Wave', iconType: 'inverter' },

  // Panels
  { file: 'panel-620w-topcon.svg', title: 'N-Type TOPCon 620W Bifacial Module', category: 'Solar Panels', spec1: '620W Max Power', spec2: '22.6% Efficiency', iconType: 'panel' },
  { file: 'panel-580w-bifacial.svg', title: 'Bifacial Dual-Glass 580W Module', category: 'Solar Panels', spec1: '580W Output', spec2: 'Dual Glass 30-Yr', iconType: 'panel' },
  { file: 'panel-450w-mono.svg', title: 'High-Density Mono PERC 450W Panel', category: 'Solar Panels', spec1: '450W Rooftop Fit', spec2: '20.9% Efficiency', iconType: 'panel' },
  { file: 'panel-700w-hjt.svg', title: 'Utility-Scale 700W HJT High-Output Panel', category: 'Solar Panels', spec1: '700W Industrial', spec2: '23.1% Efficiency', iconType: 'panel' },

  // Batteries
  { file: 'battery-51v-100ah-rack.svg', title: '51.2V 100Ah LiFePO4 Server Rack Battery', category: 'Li-ion Batteries', spec1: '5.12 kWh Capacity', spec2: '6000 Cycles @ 80% DoD', iconType: 'battery' },
  { file: 'battery-51v-200ah-powerwall.svg', title: '51.2V 200Ah Wall-Mount Energy Storage', category: 'Li-ion Batteries', spec1: '10.24 kWh Capacity', spec2: 'Smart BMS Protocol', iconType: 'battery' },
  { file: 'battery-10kwh-highvoltage.svg', title: 'High-Voltage 15kWh Modular Battery Stack', category: 'Li-ion Batteries', spec1: '307V Nominal', spec2: 'Industrial ESS', iconType: 'battery' },
  { file: 'battery-100ah-gel-backup.svg', title: 'Deep Cycle 12V 200Ah Backup Battery', category: 'Li-ion Batteries', spec1: '12V 200Ah Sealed', spec2: 'Telecom Grade', iconType: 'battery' },

  // Inverters
  { file: 'inverter-10kw-hybrid.svg', title: '10kW Three-Phase Hybrid Solar Inverter', category: 'Inverters', spec1: '10kW Rated AC', spec2: 'Dual MPPT 150-800V', iconType: 'inverter' },
  { file: 'inverter-50kw-commercial.svg', title: '50kW Commercial Grid-Tied Inverter', category: 'Inverters', spec1: '50kW 380V/400V', spec2: '4 MPPT String Tech', iconType: 'inverter' },
  { file: 'inverter-5kw-offgrid.svg', title: '5kW 48V Off-Grid Pure Sine Inverter', category: 'Inverters', spec1: '5000W Output', spec2: '80A MPPT Charger', iconType: 'inverter' },
  { file: 'inverter-100kw-utility.svg', title: '100kW Industrial Utility Grid Inverter', category: 'Inverters', spec1: '100kW Central', spec2: '98.8% Max Efficiency', iconType: 'inverter' }
];

items.forEach(item => {
  const svg = createSVG(item);
  fs.writeFileSync(path.join(demoDir, item.file), svg, 'utf-8');
  console.log(`Generated: ${item.file}`);
});
console.log('All procedural SVG demo assets successfully generated.');
