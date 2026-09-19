const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PHOTO_MAPPING = [
  // 1. Hero visual background support
  {
    outputName: 'hero-solar-field.webp',
    sourcePath: path.join(__dirname, '..', 'source-images', 'images 2', 'solar-panels-field-sunset_922936-22590.jpg'),
    originalName: 'solar-panels-field-sunset_922936-22590.jpg',
    maxWidth: 1600,
    maxKb: 150,
    quality: 82,
    sourceCredit: "Owner's licensed stock download",
    role: 'Hero section visual background support under layered SVG product composition'
  },
  // 2. Category Dock / Category Cards
  {
    outputName: 'cat-solar-panels.webp',
    sourcePath: 'C:/Users/bird/.gemini/antigravity-ide/brain/0e54e01d-860b-4bf4-9ec1-42531dcf8d4d/studio_solar_panel_1789841347076.jpg',
    originalName: 'studio_solar_panel_1789841347076.jpg',
    maxWidth: 800,
    maxKb: 100,
    quality: 82,
    sourceCredit: 'Clean studio B2B product render on #EDEDED neutral background',
    role: 'Category Dock & Admin Default for Solar Panels'
  },
  {
    outputName: 'cat-lithium-batteries.webp',
    sourcePath: 'C:/Users/bird/.gemini/antigravity-ide/brain/0e54e01d-860b-4bf4-9ec1-42531dcf8d4d/lithium_battery_rack_1789841161588.jpg',
    originalName: 'lithium_battery_rack_1789841161588.jpg',
    maxWidth: 800,
    maxKb: 100,
    quality: 82,
    sourceCredit: 'Clean studio B2B product render on #EDEDED neutral background',
    role: 'Category Dock & Admin Default for Lithium Batteries'
  },
  {
    outputName: 'cat-solar-inverters.webp',
    sourcePath: 'C:/Users/bird/.gemini/antigravity-ide/brain/0e54e01d-860b-4bf4-9ec1-42531dcf8d4d/studio_solar_inverter_1789841328255.jpg',
    originalName: 'studio_solar_inverter_1789841328255.jpg',
    maxWidth: 800,
    maxKb: 100,
    quality: 82,
    sourceCredit: 'Clean studio B2B product render on #EDEDED neutral background',
    role: 'Category Dock & Admin Default for Solar Inverters'
  },
  // 3. Category Story
  {
    outputName: 'story-panels.webp',
    sourcePath: path.join(__dirname, '..', 'source-images', 'images 2', 'solar-panels-roof-solar-cell_335224-1324.jpg'),
    originalName: 'solar-panels-roof-solar-cell_335224-1324.jpg',
    maxWidth: 1200,
    maxKb: 100,
    quality: 80,
    sourceCredit: "Owner's licensed stock download",
    role: 'Category Story: Tier-1 TOPCon Solar Panels in action'
  },
  {
    outputName: 'story-batteries.webp',
    sourcePath: 'C:/Users/bird/.gemini/antigravity-ide/brain/0e54e01d-860b-4bf4-9ec1-42531dcf8d4d/lithium_battery_rack_1789841161588.jpg',
    originalName: 'lithium_battery_rack_1789841161588.jpg',
    maxWidth: 1200,
    maxKb: 100,
    quality: 80,
    sourceCredit: 'Clean studio B2B product render on #EDEDED neutral background',
    role: 'Category Story: Modular LiFePO4 Energy Storage'
  },
  {
    outputName: 'story-inverters.webp',
    sourcePath: path.join(__dirname, '..', 'source-images', 'images 2', 'solar-power-station-with-solar-panels-producing-electric-power-energy-by-green-power-technology-electrical-industrial-power-plant-concept-3d-illustration-rendering_10307-2111.jpg'),
    originalName: 'solar-power-station-with-solar-panels-producing-electric-power-energy-by-green-power-technology-electrical-industrial-power-plant-concept-3d-illustration-rendering_10307-2111.jpg',
    maxWidth: 1200,
    maxKb: 100,
    quality: 80,
    sourceCredit: "Owner's licensed stock download",
    role: 'Category Story: High-Efficiency Commercial Inverters'
  },
  // 4. Ordering Steps
  {
    outputName: 'step-1-consultation.webp',
    sourcePath: path.join(__dirname, '..', 'source-images', 'images 2', 'medium-shot-engineer-drawing-plan-outdoors_23-2149352263.jpg'),
    originalName: 'medium-shot-engineer-drawing-plan-outdoors_23-2149352263.jpg',
    maxWidth: 800,
    maxKb: 100,
    quality: 80,
    sourceCredit: "Owner's licensed stock download",
    role: 'Ordering Steps Step 1: Technical Requirement & Sizing'
  },
  {
    outputName: 'step-2-quotation.webp',
    sourcePath: path.join(__dirname, '..', 'source-images', 'images 2', 'medium-shot-engineers-talking-about-solar-pannels_23-2149352238.jpg'),
    originalName: 'medium-shot-engineers-talking-about-solar-pannels_23-2149352238.jpg',
    maxWidth: 800,
    maxKb: 100,
    quality: 80,
    sourceCredit: "Owner's licensed stock download",
    role: 'Ordering Steps Step 2: Formal Quotation & Tier Pricing'
  },
  {
    outputName: 'step-3-logistics.webp',
    sourcePath: path.join(__dirname, '..', 'source-images', 'images 2', 'top-view-solar-panels-farm-alternative-source-electricity-solar-panels-absorb-sunlight-as-source-energy-generate-electricity-creating-sustainable-energy_620624-4451.jpg'),
    originalName: 'top-view-solar-panels-farm-alternative-source-electricity-solar-panels-absorb-sunlight-as-source-energy-generate-electricity-creating-sustainable-energy_620624-4451.jpg',
    maxWidth: 800,
    maxKb: 100,
    quality: 80,
    sourceCredit: "Owner's licensed stock download",
    role: 'Ordering Steps Step 3: Container Staging & QA Check'
  },
  {
    outputName: 'step-4-delivery.webp',
    sourcePath: path.join(__dirname, '..', 'source-images', 'images 2', 'solar-panel-installation_1041545-49575.jpg'),
    originalName: 'solar-panel-installation_1041545-49575.jpg',
    maxWidth: 800,
    maxKb: 100,
    quality: 80,
    sourceCredit: "Owner's licensed stock download",
    role: 'Ordering Steps Step 4: Dispatch & On-Site Handover'
  },
  // 5. About Page
  {
    outputName: 'about-inspection.webp',
    sourceFile: 'technology-solar-cell-engineer-service-check-installation-solar-cell-roof-factory-morning_1028938-16863.jpg',
    originalName: 'technology-solar-cell-engineer-service-check-installation-solar-cell-roof-factory-morning_1028938-16863.jpg',
    maxWidth: 1200,
    maxKb: 100,
    quality: 80,
    sourceCredit: "Owner's licensed stock download",
    role: 'About Page: Engineering Inspection & Quality Assurance'
  },
  {
    outputName: 'about-operations.webp',
    sourceFile: 'two-engineers-installing-solar-panels-on-roof.jpg',
    originalName: 'two-engineers-installing-solar-panels-on-roof.jpg',
    maxWidth: 1200,
    maxKb: 100,
    quality: 80,
    sourceCredit: "Owner's licensed stock download",
    role: 'About Page: Commercial Rooftop Installation'
  },
  {
    outputName: 'about-commercial-plant.webp',
    sourceFile: 'beautiful-alternative-energy-plant-with-solar-panels_23-2149192692.jpg',
    originalName: 'beautiful-alternative-energy-plant-with-solar-panels_23-2149192692.jpg',
    maxWidth: 1200,
    maxKb: 100,
    quality: 80,
    sourceCredit: "Owner's licensed stock download",
    role: 'About Page: Commercial Scale & Utility Deployment'
  },
  // 6. Closing CTA
  {
    outputName: 'cta-sunset-panels.webp',
    sourceFile: 'solar-panel-cell-dramatic-sunset-sky-clean-alternative-power-energy-concept_29332-1997.jpg',
    originalName: 'solar-panel-cell-dramatic-sunset-sky-clean-alternative-power-energy-concept_29332-1997.jpg',
    maxWidth: 1200,
    maxKb: 100,
    quality: 80,
    sourceCredit: "Owner's licensed stock download",
    role: 'Closing CTA: Sunset Solar Skyline Background'
  },
  // 7. Contact Page
  {
    outputName: 'contact-sales-desk.webp',
    sourceFile: 'young-asian-technician-man-standing-talking-smartphone-long-rows-photovoltaic-solar-panels-copy-space_1150-57281.jpg',
    originalName: 'young-asian-technician-man-standing-talking-smartphone-long-rows-photovoltaic-solar-panels-copy-space_1150-57281.jpg',
    maxWidth: 1200,
    maxKb: 100,
    quality: 80,
    sourceCredit: "Owner's licensed stock download",
    role: 'Contact Page: B2B Support & Field Engineer Assistance'
  }
];

function findSourceFile(fileNameOrPath) {
  if (path.isAbsolute(fileNameOrPath) && fs.existsSync(fileNameOrPath)) {
    return fileNameOrPath;
  }
  for (const dir of ['images', 'images 2']) {
    const p = path.join(__dirname, '..', 'source-images', dir, fileNameOrPath);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

async function run() {
  const destDir = path.join(__dirname, '..', 'public', 'photos');
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const creditsRows = [];
  console.log(`Processing ${PHOTO_MAPPING.length} photos...`);

  for (const item of PHOTO_MAPPING) {
    const srcPath = findSourceFile(item.sourcePath || item.sourceFile);
    if (!srcPath || !fs.existsSync(srcPath)) {
      console.error(`ERROR: Source file does not exist: ${item.sourcePath || item.sourceFile}`);
      process.exit(1);
    }

    const targetPath = path.join(destDir, item.outputName);
    let quality = item.quality;
    let buffer;
    let attempts = 0;

    while (attempts < 5) {
      const resizeOpts = item.outputName === 'hero-solar-field.webp'
        ? { width: 1600, kernel: 'lanczos3' }
        : { width: item.maxWidth, withoutEnlargement: true };

      buffer = await sharp(srcPath)
        .resize(resizeOpts)
        .webp({ quality })
        .toBuffer();

      const sizeKb = Math.round(buffer.length / 1024);
      if (sizeKb <= item.maxKb) {
        break;
      }
      quality = Math.max(50, quality - 8);
      attempts++;
    }

    fs.writeFileSync(targetPath, buffer);
    const meta = await sharp(targetPath).metadata();
    const finalKb = Math.round(buffer.length / 1024);

    console.log(`✓ ${item.outputName}: ${meta.width}x${meta.height}, ${finalKb} KB (Target max: ${item.maxKb} KB)`);

    if (finalKb > item.maxKb) {
      console.error(`ERROR: ${item.outputName} exceeded max size ${item.maxKb} KB (actual: ${finalKb} KB)`);
      process.exit(1);
    }

    creditsRows.push({
      file: item.outputName,
      original: item.originalName,
      source: item.sourceCredit,
      role: item.role,
      dimensions: `${meta.width}x${meta.height}`,
      size: `${finalKb} KB`
    });
  }

  // Generate CREDITS.md
  let creditsMd = '# Photo Credits & Licensing\n\n';
  creditsMd += 'All photos served on the public website are optimized WebP assets stored in `public/photos/`.\n';
  creditsMd += 'Original source files reside in `source-images/` (git-ignored) or are studio renders.\n\n';
  creditsMd += '| WebP Filename | Original Source Name | Dimensions | Size | Source / License | Role on Site |\n';
  creditsMd += '|---|---|---|---|---|---|\n';
  for (const c of creditsRows) {
    creditsMd += `| \`${c.file}\` | \`${c.original}\` | ${c.dimensions} | ${c.size} | ${c.source} | ${c.role} |\n`;
  }
  creditsMd += '\n## Licensing Compliance\n';
  creditsMd += '- Stock photographs are from the owner\'s licensed stock asset collection.\n';
  creditsMd += '- No external hotlinking; all assets are served locally under strict Content-Security-Policy.\n';
  creditsMd += '- No identifiable persons are presented as testimonials, endorsements, or real team members.\n';
  creditsMd += '- Studio product visuals are non-branded, clean industrial assets on light neutral #EDEDED background.\n';

  fs.writeFileSync(path.join(destDir, 'CREDITS.md'), creditsMd, 'utf8');
  console.log(`✓ Generated public/photos/CREDITS.md`);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
