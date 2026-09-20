-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN "contentBn" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "coverAltBn" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "excerptBn" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "metaDescriptionBn" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "metaTitleBn" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "tagsBn" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "titleBn" TEXT;

-- AlterTable
ALTER TABLE "Category" ADD COLUMN "descriptionBn" TEXT;
ALTER TABLE "Category" ADD COLUMN "nameBn" TEXT;

-- AlterTable
ALTER TABLE "Certification" ADD COLUMN "descriptionBn" TEXT;
ALTER TABLE "Certification" ADD COLUMN "issuerBn" TEXT;
ALTER TABLE "Certification" ADD COLUMN "nameBn" TEXT;

-- AlterTable
ALTER TABLE "FaqItem" ADD COLUMN "answerBn" TEXT;
ALTER TABLE "FaqItem" ADD COLUMN "questionBn" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN "descriptionBn" TEXT;
ALTER TABLE "Product" ADD COLUMN "leadTimeBn" TEXT;
ALTER TABLE "Product" ADD COLUMN "metaDescriptionBn" TEXT;
ALTER TABLE "Product" ADD COLUMN "metaTitleBn" TEXT;
ALTER TABLE "Product" ADD COLUMN "moqBn" TEXT;
ALTER TABLE "Product" ADD COLUMN "nameBn" TEXT;
ALTER TABLE "Product" ADD COLUMN "shortDescriptionBn" TEXT;

-- AlterTable
ALTER TABLE "ProductImage" ADD COLUMN "altBn" TEXT;

-- AlterTable
ALTER TABLE "ProductSpec" ADD COLUMN "labelBn" TEXT;
ALTER TABLE "ProductSpec" ADD COLUMN "valueBn" TEXT;

-- AlterTable
ALTER TABLE "Stat" ADD COLUMN "descriptionBn" TEXT;
ALTER TABLE "Stat" ADD COLUMN "labelBn" TEXT;

-- AlterTable
ALTER TABLE "Testimonial" ADD COLUMN "authorNameBn" TEXT;
ALTER TABLE "Testimonial" ADD COLUMN "authorRoleBn" TEXT;
ALTER TABLE "Testimonial" ADD COLUMN "companyBn" TEXT;
ALTER TABLE "Testimonial" ADD COLUMN "quoteBn" TEXT;
