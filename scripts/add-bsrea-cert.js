const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 1. Check existing certs
  const existing = await prisma.certification.findMany();
  console.log('Current certs count:', existing.length);

  // 2. Add or update BSREA Certificate of Membership
  const certData = {
    name: 'BSREA Certificate of Membership',
    issuer: 'Bangladesh Sustainable & Renewable Energy Association (BSREA)',
    description: 'Official General Membership (20260915GEN113) issued to Tasneem Knitting Industry. Valid through Dec 31, 2026. Document: https://drive.google.com/file/d/1GR4hILXnDjJblqNmrxRNnWH_M7It4Md2/view?usp=sharing',
    image: '/photos/bsrea-logo.png',
    sortOrder: 1,
    isActive: true,
    isSample: false,
  };

  // Find if already exists
  const found = await prisma.certification.findFirst({
    where: {
      OR: [
        { name: { contains: 'BSREA' } },
        { issuer: { contains: 'BSREA' } }
      ]
    }
  });

  if (found) {
    await prisma.certification.update({
      where: { id: found.id },
      data: certData,
    });
    console.log('✓ Updated existing BSREA certification:', found.id);
  } else {
    const created = await prisma.certification.create({
      data: certData,
    });
    console.log('✓ Created new BSREA certification:', created.id);
  }

  // Also ensure BSREA is in Partner / Association list with their logo and website
  const partnerFound = await prisma.partner.findFirst({
    where: { name: { contains: 'BSREA' } }
  });

  if (partnerFound) {
    await prisma.partner.update({
      where: { id: partnerFound.id },
      data: {
        name: 'BSREA',
        logo: '/photos/bsrea-logo.png',
        url: 'https://bsreabd.org/',
        isActive: true,
        isSample: false,
      }
    });
    console.log('✓ Updated BSREA partner entry');
  } else {
    await prisma.partner.create({
      data: {
        name: 'BSREA',
        logo: '/photos/bsrea-logo.png',
        url: 'https://bsreabd.org/',
        sortOrder: 1,
        isActive: true,
        isSample: false,
      }
    });
    console.log('✓ Created BSREA partner entry');
  }

  // Also add to seed-content.ts so db resets/seeds preserve it
  console.log('All DB changes complete.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
