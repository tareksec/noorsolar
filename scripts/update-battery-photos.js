const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const publicDir = path.join(__dirname, '..', 'public');
  const bettryDir = path.join(publicDir, 'bettry');
  const demoProductsDir = path.join(publicDir, 'demo', 'products');

  if (!fs.existsSync(demoProductsDir)) {
    fs.mkdirSync(demoProductsDir, { recursive: true });
  }

  // 1. Copy hero and story photos
  const heroBattery = path.join(bettryDir, '500_F_2090872600_mpL6CKZulRNh7R8OMe31iD00cXQpEpR7.jpg');
  const storyBattery = path.join(bettryDir, '500_F_2090872523_bLZOG1F2Gbz4TsCdhboiXNUezn7dTZZI.jpg');
  const catBatteryTarget = path.join(publicDir, 'photos', 'cat-lithium-batteries.webp');
  const storyBatteryTarget = path.join(publicDir, 'photos', 'story-batteries.webp');

  if (fs.existsSync(heroBattery)) {
    fs.copyFileSync(heroBattery, catBatteryTarget);
    console.log('✓ Updated cat-lithium-batteries.webp');
  }
  if (fs.existsSync(storyBattery)) {
    fs.copyFileSync(storyBattery, storyBatteryTarget);
    console.log('✓ Updated story-batteries.webp');
  }

  // 2. Battery product mappings with uploaded images
  const batteryProducts = [
    {
      slug: '48v-100ah-lifepo4-rack-battery',
      front: '500_F_2090872523_bLZOG1F2Gbz4TsCdhboiXNUezn7dTZZI.jpg',
      angled: '500_F_2090872600_mpL6CKZulRNh7R8OMe31iD00cXQpEpR7.jpg',
      detail: '500_F_1959922101_DnMAj0DnSOxTCTJDTGlSZcTq89gVjX5D.jpg',
    },
    {
      slug: '48v-200ah-lifepo4-rack-battery',
      front: '500_F_2090872600_mpL6CKZulRNh7R8OMe31iD00cXQpEpR7.jpg',
      angled: '500_F_2161942267_Z436AaobAibp5KfpzehSFUwMjb6nS5tI.jpg',
      detail: '360_F_2066620902_kqHF0XwpkaWJkYSFxupHaOCtnJHbn0Sf.jpg',
    },
    {
      slug: '51-2v-280ah-lifepo4-rack-battery',
      front: '500_F_1959922101_DnMAj0DnSOxTCTJDTGlSZcTq89gVjX5D.jpg',
      angled: '500_F_2090872523_bLZOG1F2Gbz4TsCdhboiXNUezn7dTZZI.jpg',
      detail: '500_F_2090872600_mpL6CKZulRNh7R8OMe31iD00cXQpEpR7.jpg',
    },
    {
      slug: '12-8v-200ah-lifepo4-battery',
      front: '500_F_2161942267_Z436AaobAibp5KfpzehSFUwMjb6nS5tI.jpg',
      angled: '360_F_2066620902_kqHF0XwpkaWJkYSFxupHaOCtnJHbn0Sf.jpg',
      detail: '500_F_2090872523_bLZOG1F2Gbz4TsCdhboiXNUezn7dTZZI.jpg',
    },
    {
      slug: '48v-100ah-wall-mount-lifepo4-battery',
      front: '360_F_2066620902_kqHF0XwpkaWJkYSFxupHaOCtnJHbn0Sf.jpg',
      angled: '500_F_2090872600_mpL6CKZulRNh7R8OMe31iD00cXQpEpR7.jpg',
      detail: '500_F_1959922101_DnMAj0DnSOxTCTJDTGlSZcTq89gVjX5D.jpg',
    },
  ];

  // Also copy files to demo/products so cached webp and jpg paths resolve seamlessly
  for (const p of batteryProducts) {
    for (const view of ['front', 'angled', 'detail']) {
      const srcFile = path.join(bettryDir, p[view]);
      if (fs.existsSync(srcFile)) {
        const targetJpg = path.join(demoProductsDir, `${p.slug}-${view}.jpg`);
        const targetWebp = path.join(demoProductsDir, `${p.slug}-${view}.webp`);
        fs.copyFileSync(srcFile, targetJpg);
        fs.copyFileSync(srcFile, targetWebp);
      }
    }
  }

  // 3. Update database product image URLs directly so live page displays them immediately
  for (const p of batteryProducts) {
    const product = await prisma.product.findUnique({
      where: { slug: p.slug },
      include: { images: true },
    });

    if (product) {
      const views = ['front', 'angled', 'detail'];
      for (let i = 0; i < product.images.length; i++) {
        const img = product.images[i];
        const view = views[i] || 'front';
        const newUrl = `/bettry/${p[view]}`;
        await prisma.productImage.update({
          where: { id: img.id },
          data: { url: newUrl },
        });
        console.log(`✓ Updated DB image for ${product.name} (${view}) -> ${newUrl}`);
      }
    }
  }

  // 4. Update Category image for Lithium-ion Batteries in database
  const cat = await prisma.category.findUnique({ where: { slug: 'lithium-batteries' } });
  if (cat) {
    await prisma.category.update({
      where: { id: cat.id },
      data: { image: '/bettry/500_F_2090872600_mpL6CKZulRNh7R8OMe31iD00cXQpEpR7.jpg' },
    });
    console.log('✓ Updated category image for lithium-batteries');
  }

  console.log('\nAll battery images from public/bettry successfully integrated!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
