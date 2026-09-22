const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const NEW_FOLDER = path.join(__dirname, '..', 'public', 'New folder');
const BRAND_DIR = path.join(__dirname, '..', 'public', 'brand');
const LOGO_DIR = path.join(__dirname, '..', 'public', 'logo');
const ROOT_PUBLIC = path.join(__dirname, '..', 'public');

// Colors
const FOREST_GREEN = '#074031';
const SOLAR_GOLD = '#FEBE16';

async function run() {
  console.log('Generating brand assets from official final logo files...');

  const lightLogoSrc = path.join(NEW_FOLDER, 'PNG-03.png');
  const darkLogoSrc = path.join(NEW_FOLDER, 'Noor Solar Energy Logo & Branding', 'Noor Solar', 'PNG', 'PNG-01.png');

  if (!fs.existsSync(lightLogoSrc) || !fs.existsSync(darkLogoSrc)) {
    throw new Error('Source logo files not found in New folder');
  }

  // 1. Process default logo (dark green wordmark + gold mark) for light backgrounds
  console.log('1. Processing default logo for light backgrounds...');
  const lightImg = sharp(lightLogoSrc).trim();
  const lightMeta = await lightImg.metadata();
  console.log('   Light logo trimmed size:', lightMeta.width, 'x', lightMeta.height);

  // Resize to standard display dimensions: ~300px width (1x) and ~600px width (2x)
  const targetHeight1x = 72;
  const targetWidth1x = Math.round((lightMeta.width / lightMeta.height) * targetHeight1x);
  const targetHeight2x = 144;
  const targetWidth2x = Math.round((lightMeta.width / lightMeta.height) * targetHeight2x);

  await sharp(lightLogoSrc).trim().resize(targetWidth1x, targetHeight1x, { fit: 'inside' })
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(BRAND_DIR, 'logo-default.png'));

  await sharp(lightLogoSrc).trim().resize(targetWidth2x, targetHeight2x, { fit: 'inside' })
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(BRAND_DIR, 'logo-default@2x.png'));

  await sharp(lightLogoSrc).trim().resize(targetWidth1x, targetHeight1x, { fit: 'inside' })
    .webp({ quality: 90 })
    .toFile(path.join(BRAND_DIR, 'logo-default.webp'));

  await sharp(lightLogoSrc).trim().resize(targetWidth2x, targetHeight2x, { fit: 'inside' })
    .webp({ quality: 90 })
    .toFile(path.join(BRAND_DIR, 'logo-default@2x.webp'));

  // Also copy high-res to public/logo/
  await sharp(lightLogoSrc).trim()
    .png({ compressionLevel: 9 })
    .toFile(path.join(LOGO_DIR, 'logo.png'));
  await sharp(lightLogoSrc).trim()
    .png({ compressionLevel: 9 })
    .toFile(path.join(LOGO_DIR, 'defullt-logo.png'));

  // 2. Process white logo (white wordmark + gold mark) for dark backgrounds
  console.log('2. Processing white logo for dark backgrounds...');
  const darkImg = sharp(darkLogoSrc).trim();
  const darkMeta = await darkImg.metadata();
  console.log('   Dark logo trimmed size:', darkMeta.width, 'x', darkMeta.height);

  await sharp(darkLogoSrc).trim().resize(targetWidth1x, targetHeight1x, { fit: 'inside' })
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(BRAND_DIR, 'logo-white.png'));

  await sharp(darkLogoSrc).trim().resize(targetWidth2x, targetHeight2x, { fit: 'inside' })
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(BRAND_DIR, 'logo-white@2x.png'));

  await sharp(darkLogoSrc).trim().resize(targetWidth1x, targetHeight1x, { fit: 'inside' })
    .webp({ quality: 90 })
    .toFile(path.join(BRAND_DIR, 'logo-white.webp'));

  await sharp(darkLogoSrc).trim().resize(targetWidth2x, targetHeight2x, { fit: 'inside' })
    .webp({ quality: 90 })
    .toFile(path.join(BRAND_DIR, 'logo-white@2x.webp'));

  await sharp(darkLogoSrc).trim()
    .png({ compressionLevel: 9 })
    .toFile(path.join(LOGO_DIR, 'logo-white.png'));

  // 3. Extract the standalone Solar Gold symbol mark
  console.log('3. Extracting Solar Gold symbol icon...');
  // From our bbox analysis:
  // minX: 68, minY: 18, maxX: 734, maxY: 687 (width 667, height 670)
  const iconRaw = sharp(darkLogoSrc).extract({
    left: 68,
    top: 18,
    width: 667,
    height: 670,
  });

  await iconRaw.clone().resize(128, 128, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(BRAND_DIR, 'logo-icon.png'));

  await iconRaw.clone().resize(256, 256, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(BRAND_DIR, 'logo-icon@2x.png'));

  await iconRaw.clone().resize(438, 438, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(LOGO_DIR, 'icon.png'));

  // 4. Favicons and app icons
  console.log('4. Generating favicons and touch icons...');
  await iconRaw.clone().resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(BRAND_DIR, 'favicon-32.png'));

  await iconRaw.clone().resize(48, 48, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFormat('png')
    .toFile(path.join(ROOT_PUBLIC, 'favicon.ico'));

  await iconRaw.clone().resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(BRAND_DIR, 'apple-icon.png'));

  await iconRaw.clone().resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(ROOT_PUBLIC, 'apple-icon.png'));

  await iconRaw.clone().resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(BRAND_DIR, 'icon-512.png'));

  await iconRaw.clone().resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(ROOT_PUBLIC, 'icon.png'));

  // App icon with Noor Forest Green background (#074031)
  const greenBg = { create: { width: 512, height: 512, channels: 4, background: FOREST_GREEN } };
  const symbol340 = await iconRaw.clone().resize(340, 340, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();

  await sharp(greenBg)
    .composite([{ input: symbol340, gravity: 'center' }])
    .png()
    .toFile(path.join(BRAND_DIR, 'icon-512-dark.png'));

  const greenBg180 = { create: { width: 180, height: 180, channels: 4, background: FOREST_GREEN } };
  const symbol120 = await iconRaw.clone().resize(120, 120, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();

  await sharp(greenBg180)
    .composite([{ input: symbol120, gravity: 'center' }])
    .png()
    .toFile(path.join(BRAND_DIR, 'apple-icon-dark.png'));

  // 5. OpenGraph Image (1200x630) on brand forest green background (#074031)
  console.log('5. Generating OpenGraph image...');
  const ogBg = { create: { width: 1200, height: 630, channels: 4, background: FOREST_GREEN } };
  const ogLogo = await sharp(darkLogoSrc).trim().resize(800, null, { fit: 'inside' }).toBuffer();

  await sharp(ogBg)
    .composite([{ input: ogLogo, gravity: 'center' }])
    .png()
    .toFile(path.join(BRAND_DIR, 'og-image.png'));

  await sharp(ogBg)
    .composite([{ input: ogLogo, gravity: 'center' }])
    .webp({ quality: 90 })
    .toFile(path.join(BRAND_DIR, 'og-image.webp'));

  await sharp(ogBg)
    .composite([{ input: ogLogo, gravity: 'center' }])
    .png()
    .toFile(path.join(ROOT_PUBLIC, 'opengraph-image.png'));

  console.log('All brand logo assets successfully created and synchronized!');
}

run().catch(err => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
