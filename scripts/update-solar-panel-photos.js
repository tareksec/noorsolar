const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const publicDir = path.join(__dirname, '..', 'public');
  const sourceSolarDir = path.join(publicDir, 'Solar images');
  const targetSolarDir = path.join(publicDir, 'solar-images');
  const demoProductsDir = path.join(publicDir, 'demo', 'products');
  const photosDir = path.join(publicDir, 'photos');

  if (!fs.existsSync(targetSolarDir)) {
    fs.mkdirSync(targetSolarDir, { recursive: true });
  }
  if (!fs.existsSync(demoProductsDir)) {
    fs.mkdirSync(demoProductsDir, { recursive: true });
  }

  console.log('1. Copying and optimizing images to /solar-images/ ...');

  // Copy all files to web-safe /solar-images/ directory
  const files = fs.readdirSync(sourceSolarDir);
  for (const f of files) {
    const src = path.join(sourceSolarDir, f);
    const dest = path.join(targetSolarDir, f);
    if (f !== '3d-rendered-solar-panel-isolated-white-background.jpg') {
      fs.copyFileSync(src, dest);
    }
  }

  // Optimize the 15MB 3d rendered solar panel to a crisp 1600px WebP and JPG
  const huge3dSrc = path.join(sourceSolarDir, '3d-rendered-solar-panel-isolated-white-background.jpg');
  const optimized3dWebp = path.join(targetSolarDir, 'solar-panel-3d-isolated.webp');
  const optimized3dJpg = path.join(targetSolarDir, 'solar-panel-3d-isolated.jpg');

  if (fs.existsSync(huge3dSrc)) {
    await sharp(huge3dSrc)
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 88 })
      .toFile(optimized3dWebp);

    await sharp(huge3dSrc)
      .resize({ width: 1600, withoutEnlargement: true })
      .jpeg({ quality: 88 })
      .toFile(optimized3dJpg);

    console.log('✓ Optimized 15MB 3D solar panel to solar-panel-3d-isolated.webp & .jpg');

    // Update cat-solar-panels.webp and story-panels.webp in public/photos
    fs.copyFileSync(optimized3dWebp, path.join(photosDir, 'cat-solar-panels.webp'));
    console.log('✓ Updated public/photos/cat-solar-panels.webp');
  }

  // Also copy grid pattern photo for story-panels
  const gridPanels = path.join(sourceSolarDir, 'solar-panels-arranged-in-a-grid-pattern-on-a-clean-surface-under-bright-lighting-photo.jpeg');
  if (fs.existsSync(gridPanels)) {
    await sharp(gridPanels)
      .webp({ quality: 90 })
      .toFile(path.join(photosDir, 'story-panels.webp'));
    console.log('✓ Updated public/photos/story-panels.webp');
  }

  // 2. Map 5 Solar Panel products with authentic uploaded images
  const panelProducts = [
    {
      slug: 'n-type-topcon-bifacial-module-620w',
      front: 'solar-panel-3d-isolated.webp',
      angled: 'ab33377ba821863f2f57068795eba843.jpg',
      detail: 'solar-panels-arranged-in-a-grid-pattern-on-a-clean-surface-under-bright-lighting-photo.jpeg',
    },
    {
      slug: 'n-type-topcon-bifacial-module-585w',
      front: 'ab33377ba821863f2f57068795eba843.jpg',
      angled: '96f880d10fb85ce847bbfef30da87f51.jpg',
      detail: 'a0adb18072d40f8a1d06482854302ee6.jpg',
    },
    {
      slug: 'mono-perc-half-cut-module-550w',
      front: '96f880d10fb85ce847bbfef30da87f51.jpg',
      angled: '14fe9d15f236481f728f78f9519fd861.jpg',
      detail: '7d19d34ace4529cb46f15b93741a8b9e.png',
    },
    {
      slug: 'mono-perc-half-cut-module-450w',
      front: 'a0adb18072d40f8a1d06482854302ee6.jpg',
      angled: '9064fce3cd5630a582c6d96335a3ac22.jpg',
      detail: '6737184c958c83dc6274334ac4e26a8d.jpg',
    },
    {
      slug: 'mono-perc-module-400w',
      front: '9a6e958b3f5868c9a2abd5e7b7c5a97f.jpg',
      angled: '14fe9d15f236481f728f78f9519fd861.jpg',
      detail: 'ab33377ba821863f2f57068795eba843.jpg',
    },
  ];

  // Also sync demo/products files
  for (const p of panelProducts) {
    for (const view of ['front', 'angled', 'detail']) {
      const srcFile = path.join(targetSolarDir, p[view]);
      if (fs.existsSync(srcFile)) {
        const targetFile = path.join(demoProductsDir, `${p.slug}-${view}.webp`);
        if (p[view].endsWith('.webp')) {
          fs.copyFileSync(srcFile, targetFile);
        } else {
          await sharp(srcFile).webp({ quality: 88 }).toFile(targetFile);
        }
      }
    }
  }

  // 3. Update database product image URLs
  console.log('\n2. Updating database product images...');
  for (const p of panelProducts) {
    const product = await prisma.product.findUnique({
      where: { slug: p.slug },
      include: { images: true },
    });

    if (product) {
      const views = ['front', 'angled', 'detail'];
      for (let i = 0; i < product.images.length; i++) {
        const img = product.images[i];
        const view = views[i] || 'front';
        const newUrl = `/solar-images/${p[view]}`;
        await prisma.productImage.update({
          where: { id: img.id },
          data: { url: newUrl },
        });
        console.log(`✓ Updated DB image for ${product.name} (${view}) -> ${newUrl}`);
      }
    }
  }

  // 4. Update Category image for Solar Panels in database
  const cat = await prisma.category.findUnique({ where: { slug: 'solar-panels' } });
  if (cat) {
    await prisma.category.update({
      where: { id: cat.id },
      data: { image: '/solar-images/solar-panel-3d-isolated.webp' },
    });
    console.log('✓ Updated category image for solar-panels in DB');
  }

  console.log('\nAll solar panel images successfully processed and integrated!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
