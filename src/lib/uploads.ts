import fs from "fs";
import path from "path";
import crypto from "crypto";
import sharp from "sharp";

const UPLOAD_DIR = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : path.join(process.cwd(), "storage", "uploads");

// Ensure upload directories exist
function ensureDirs() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
  const thumbDir = path.join(UPLOAD_DIR, "thumbs");
  if (!fs.existsSync(thumbDir)) {
    fs.mkdirSync(thumbDir, { recursive: true });
  }
}

// Validate binary file signature (magic bytes)
function isValidImageSignature(buffer: Buffer): boolean {
  if (buffer.length < 12) return false;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return true;
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return true;
  }

  // WebP: RIFF .... WEBP
  const riff = buffer.subarray(0, 4).toString("ascii");
  const webp = buffer.subarray(8, 12).toString("ascii");
  if (riff === "RIFF" && webp === "WEBP") {
    return true;
  }

  return false;
}

export interface ProcessedUpload {
  url: string;
  thumbUrl: string;
  filename: string;
}

export async function processAndSaveImage(
  file: File | Blob,
  prefix = "prod"
): Promise<ProcessedUpload | null> {
  ensureDirs();

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // 1. Check size: max 5 MB (5 * 1024 * 1024)
  if (buffer.length > 5 * 1024 * 1024) {
    throw new Error("File size exceeds 5MB limit.");
  }

  // 2. Validate magic signature
  if (!isValidImageSignature(buffer)) {
    throw new Error("Invalid image format. Only JPEG, PNG, and WebP are allowed.");
  }

  const hash = crypto.randomBytes(8).toString("hex");
  const baseName = `${prefix}_${Date.now()}_${hash}`;
  const filename = `${baseName}.webp`;
  const thumbFilename = `thumbs/${baseName}_thumb.webp`;

  const fullPath = path.join(UPLOAD_DIR, filename);
  const thumbPath = path.join(UPLOAD_DIR, thumbFilename);

  // Process main image: auto-rotate, strip metadata, max 1600px long side, WebP quality 85
  await sharp(buffer)
    .rotate()
    .resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(fullPath);

  // Process 480px thumbnail
  await sharp(buffer)
    .rotate()
    .resize(480, 480, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(thumbPath);

  return {
    url: `/uploads/${filename}`,
    thumbUrl: `/uploads/${thumbFilename}`,
    filename,
  };
}

// Validate PDF signature (%PDF = 0x25 0x50 0x44 0x46)
function isValidPdfSignature(buffer: Buffer): boolean {
  if (buffer.length < 4) return false;
  return (
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46
  );
}

export async function processAndSavePdf(
  file: File | Blob,
  prefix = "datasheet"
): Promise<{ url: string; filename: string }> {
  ensureDirs();

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Max 10 MB limit
  if (buffer.length > 10 * 1024 * 1024) {
    throw new Error("PDF datasheet exceeds 10MB limit.");
  }

  // Validate magic bytes (%PDF)
  if (!isValidPdfSignature(buffer)) {
    throw new Error("Invalid PDF file format. Header must match %PDF.");
  }

  const hash = crypto.randomBytes(8).toString("hex");
  const filename = `${prefix}_${Date.now()}_${hash}.pdf`;
  const fullPath = path.join(UPLOAD_DIR, filename);

  fs.writeFileSync(fullPath, buffer);

  return {
    url: `/uploads/${filename}`,
    filename,
  };
}

export function deleteUploadedFile(relativeUrl: string) {
  if (!relativeUrl.startsWith("/uploads/")) return;

  const cleanPath = relativeUrl.replace("/uploads/", "");
  const targetPath = path.resolve(UPLOAD_DIR, cleanPath);

  // Path traversal guard
  if (!targetPath.startsWith(UPLOAD_DIR)) {
    console.error("Path traversal attempt detected:", targetPath);
    return;
  }

  if (fs.existsSync(targetPath)) {
    try {
      fs.unlinkSync(targetPath);
    } catch (e) {
      console.error(`Failed to delete upload ${targetPath}:`, e);
    }
  }

  // Also remove thumbnail if exists
  const parsed = path.parse(cleanPath);
  const thumbPath = path.resolve(UPLOAD_DIR, "thumbs", `${parsed.name}_thumb.webp`);
  if (fs.existsSync(thumbPath)) {
    try {
      fs.unlinkSync(thumbPath);
    } catch (e) {
      console.error(`Failed to delete thumbnail ${thumbPath}:`, e);
    }
  }
}

/**
 * Duplicate an uploaded file so a copied record owns independent files.
 * Copies the file (plus its thumbnail for product images) under a new unique
 * name and returns the new `/uploads/...` URL. Returns the original URL when
 * the source is not a local upload or cannot be copied.
 */
export function duplicateUploadedFile(relativeUrl: string, prefix = "copy"): string {
  if (!relativeUrl.startsWith("/uploads/")) return relativeUrl;

  ensureDirs();

  const cleanPath = relativeUrl.replace("/uploads/", "");
  const srcPath = path.resolve(UPLOAD_DIR, cleanPath);

  // Path traversal guard + source must exist
  if (!srcPath.startsWith(UPLOAD_DIR)) return relativeUrl;
  if (!fs.existsSync(srcPath)) return relativeUrl;

  try {
    const stat = fs.statSync(srcPath);
    if (!stat.isFile()) return relativeUrl;

    const parsed = path.parse(cleanPath);
    // Only duplicate root-level uploads with thumbnail handling; nested
    // files (e.g. existing thumbs) are copied as plain files.
    const hash = crypto.randomBytes(8).toString("hex");
    const newBase = `${prefix}_${Date.now()}_${hash}`;
    const destPath =
      parsed.dir && parsed.dir !== "."
        ? path.resolve(UPLOAD_DIR, parsed.dir, `${newBase}${parsed.ext}`)
        : path.join(UPLOAD_DIR, `${newBase}${parsed.ext}`);
    if (!destPath.startsWith(UPLOAD_DIR)) return relativeUrl;

    fs.copyFileSync(srcPath, destPath);

    // Product images have a companion thumbnail derived from the base name
    if (!parsed.dir || parsed.dir === ".") {
      const thumbSrc = path.resolve(UPLOAD_DIR, "thumbs", `${parsed.name}_thumb.webp`);
      if (fs.existsSync(thumbSrc)) {
        fs.copyFileSync(
          thumbSrc,
          path.resolve(UPLOAD_DIR, "thumbs", `${newBase}_thumb.webp`)
        );
      }
    }

    const newRel = path.relative(UPLOAD_DIR, destPath).split(path.sep).join("/");
    return `/uploads/${newRel}`;
  } catch (e) {
    console.error(`Failed to duplicate upload ${relativeUrl}:`, e);
    return relativeUrl;
  }
}
