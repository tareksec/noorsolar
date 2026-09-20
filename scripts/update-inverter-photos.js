const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const publicDir = path.join(__dirname, '..', 'public');
  const inverterDir = path.join(publicDir, 'Inverter');
  const demoProductsDir = path.join(publicDir, 'demo', 'products');

  if (!fs.existsSync(demoProductsDir)) {
    fs.mkdirSync(demoProductsDir, { recursive: true });
  }

  // 1. Copy hero and story photos
  const heroInverter = path.join(inverterDir, 'white-inverter-of-solar-cell-power-generation-system.jpg');
  const storyInverter = path.join(inverterDir, 'solar-inverter-with-battery-storage.jpg');
  const catInverterTarget = path.join(publicDir, 'photos', 'cat-solar-inverters.webp');
  const storyInverterTarget = path.join(publicDir, 'photos', 'story-inverters.webp');

  if (fs.existsSync(heroInverter)) {
    fs.copyFileSync(heroInverter, catInverterTarget);
    console.log('✓ Updated cat-solar-inverters.webp');
  }
  if (fs.existsSync(storyInverter)) {
    fs.copyFileSync(storyInverter, storyInverterTarget);
    console.log('✓ Updated story-inverters.webp');
  }

  // 2. Map product images for demo products
  const productMappings = [
    {
      slug: '3kw-hybrid-inverter-single-phase',
      front: 'solar-power-inverter-mounted-inside-garage-of-a-house-domestic-system.jpg',
      angled: 'electrical-control-cabinet-of-solar-cell-pv-grid-tile-inverter-for-home-system.jpg',
      detail: 'checking-and-measuring-power-cable-lines-in-inverter-solar-panel.jpg'
    },
    {
      slug: '5kw-hybrid-inverter-single-phase',
      front: 'white-inverter-of-solar-cell-power-generation-system.jpg',
      angled: 'check-and-service-instalation-control-of-inverters-solar-panel-on-the-wall.jpg',
      detail: 'checking-and-measuring-power-cable-lines-in-inverter-solar-panel.jpg'
    },
    {
      slug: '8kw-hybrid-inverter-single-phase',
      front: 'solar-inverter-with-battery-storage.jpg',
      angled: 'instalation-control-of-inverters-solar-panel.jpg',
      detail: 'electrician-connecting-a-solar-inverter.jpg'
    },
    {
      slug: '10kw-hybrid-inverter-three-phase',
      front: 'solar-panel-cell-system-with-hybrid-inverter-controller-battery-bank-and-meter-designed.jpg',
      angled: 'technician-engineering-setting-inverter-solar-panel-in-electrical-room-service-engineer.jpg',
      detail: 'electrician-installing-solar-panel-system-wiring-inverter-and-electric-box.jpg'
    },
    {
      slug: '15kw-commercial-string-inverter',
      front: 'solar-photovoltaic-and-transformer-box.jpg',
      angled: 'inverter-behind-the-solar-panels-renewable-energy.jpg',
      detail: 'back-view-of-solar-panel-inverter-to-transform-direct-current-into-alternate.jpg'
    },
    {
      slug: '30kw-on-grid-commercial-inverter',
      front: 'solar-photovoltaic-and-transformer-box.jpg',
      angled: 'inverter-behind-the-solar-panels-renewable-energy.jpg',
      detail: 'back-view-of-solar-panel-inverter-to-transform-direct-current-into-alternate.jpg'
    }
  ];

  for (const p of productMappings) {
    for (const view of ['front', 'angled', 'detail']) {
      const srcFile = path.join(inverterDir, p[view]);
      if (fs.existsSync(srcFile)) {
        // Copy as webp and jpg
        const targetJpg = path.join(demoProductsDir, `${p.slug}-${view}.jpg`);
        const targetWebp = path.join(demoProductsDir, `${p.slug}-${view}.webp`);
        fs.copyFileSync(srcFile, targetJpg);
        fs.copyFileSync(srcFile, targetWebp);
        console.log(`✓ Copied ${p.slug}-${view}`);
      }
    }
  }

  // 3. Update database product image URLs directly so live page displays them immediately
  for (const p of productMappings) {
    const product = await prisma.product.findUnique({
      where: { slug: p.slug },
      include: { images: true }
    });

    if (product) {
      const views = ['front', 'angled', 'detail'];
      for (let i = 0; i < product.images.length; i++) {
        const img = product.images[i];
        const view = views[i] || 'front';
        const newUrl = `/Inverter/${p[view]}`;
        await prisma.productImage.update({
          where: { id: img.id },
          data: { url: newUrl }
        });
        console.log(`✓ Updated DB image for ${product.name} (${view}) -> ${newUrl}`);
      }
    }
  }

  // 4. Update Category image for Inverters in database
  const cat = await prisma.category.findUnique({ where: { slug: 'solar-inverters' } });
  if (cat) {
    await prisma.category.update({
      where: { id: cat.id },
      data: { image: '/Inverter/white-inverter-of-solar-cell-power-generation-system.jpg' }
    });
    console.log('✓ Updated category image for solar-inverters');
  }

  console.log('\nAll inverter images successfully integrated!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
