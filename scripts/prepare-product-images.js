const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PRODUCTS_DIR = path.join(__dirname, '..', 'public', 'demo', 'products');

async function processProductImages() {
  if (!fs.existsSync(PRODUCTS_DIR)) {
    fs.mkdirSync(PRODUCTS_DIR, { recursive: true });
  }

  // Source high-res studio renders generated in brain session
  const panelSrc = 'C:/Users/bird/.gemini/antigravity-ide/brain/0e54e01d-860b-4bf4-9ec1-42531dcf8d4d/studio_solar_panel_1789841347076.jpg';
  const batterySrc = 'C:/Users/bird/.gemini/antigravity-ide/brain/0e54e01d-860b-4bf4-9ec1-42531dcf8d4d/lithium_battery_rack_1789841161588.jpg';
  const inverterSrc = 'C:/Users/bird/.gemini/antigravity-ide/brain/0e54e01d-860b-4bf4-9ec1-42531dcf8d4d/studio_solar_inverter_1789841328255.jpg';

  console.log('Generating studio product views in public/demo/products/...');

  // 1. Flagship Panel (n-type-topcon-bifacial-module-620w)
  if (fs.existsSync(panelSrc)) {
    // Front View
    await sharp(panelSrc)
      .resize(800, 600, { fit: 'contain', background: '#EDEDED' })
      .webp({ quality: 84 })
      .toFile(path.join(PRODUCTS_DIR, 'n-type-topcon-bifacial-module-620w-front.webp'));

    // Angled View
    await sharp(panelSrc)
      .extract({ left: 100, top: 50, width: 950, height: 750 })
      .resize(800, 600, { fit: 'contain', background: '#EDEDED' })
      .webp({ quality: 84 })
      .toFile(path.join(PRODUCTS_DIR, 'n-type-topcon-bifacial-module-620w-angled.webp'));

    // Detail View: cell busbars and glass reflection
    await sharp(panelSrc)
      .extract({ left: 300, top: 150, width: 600, height: 450 })
      .resize(800, 600, { fit: 'cover' })
      .webp({ quality: 84 })
      .toFile(path.join(PRODUCTS_DIR, 'n-type-topcon-bifacial-module-620w-detail.webp'));

    console.log('✓ Created 3 views for n-type-topcon-bifacial-module-620w');
  }

  // 2. Flagship Battery (48v-100ah-lifepo4-rack-battery)
  if (fs.existsSync(batterySrc)) {
    // Front View
    await sharp(batterySrc)
      .resize(800, 600, { fit: 'contain', background: '#EDEDED' })
      .webp({ quality: 84 })
      .toFile(path.join(PRODUCTS_DIR, '48v-100ah-lifepo4-rack-battery-front.webp'));

    // Angled View
    await sharp(batterySrc)
      .extract({ left: 80, top: 40, width: 1000, height: 750 })
      .resize(800, 600, { fit: 'contain', background: '#EDEDED' })
      .webp({ quality: 84 })
      .toFile(path.join(PRODUCTS_DIR, '48v-100ah-lifepo4-rack-battery-angled.webp'));

    // Detail View: terminal connectors and digital meter
    await sharp(batterySrc)
      .extract({ left: 350, top: 250, width: 500, height: 400 })
      .resize(800, 600, { fit: 'cover' })
      .webp({ quality: 84 })
      .toFile(path.join(PRODUCTS_DIR, '48v-100ah-lifepo4-rack-battery-detail.webp'));

    console.log('✓ Created 3 views for 48v-100ah-lifepo4-rack-battery');
  }

  // 3. Flagship Inverter (10kw-hybrid-inverter-three-phase)
  if (fs.existsSync(inverterSrc)) {
    // Front View
    await sharp(inverterSrc)
      .resize(800, 600, { fit: 'contain', background: '#EDEDED' })
      .webp({ quality: 84 })
      .toFile(path.join(PRODUCTS_DIR, '10kw-hybrid-inverter-three-phase-front.webp'));

    // Angled View
    await sharp(inverterSrc)
      .extract({ left: 200, top: 80, width: 800, height: 700 })
      .resize(800, 600, { fit: 'contain', background: '#EDEDED' })
      .webp({ quality: 84 })
      .toFile(path.join(PRODUCTS_DIR, '10kw-hybrid-inverter-three-phase-angled.webp'));

    // Detail View: LCD status display & lower terminals
    await sharp(inverterSrc)
      .extract({ left: 350, top: 300, width: 500, height: 420 })
      .resize(800, 600, { fit: 'cover' })
      .webp({ quality: 84 })
      .toFile(path.join(PRODUCTS_DIR, '10kw-hybrid-inverter-three-phase-detail.webp'));

    console.log('✓ Created 3 views for 10kw-hybrid-inverter-three-phase');
  }
}

processProductImages().catch(console.error);
