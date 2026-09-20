import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const UPLOAD_DIR = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : path.join(process.cwd(), "storage", "uploads");

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;
  if (!segments || segments.length === 0) {
    return new NextResponse("File Not Found", { status: 404 });
  }

  const relativePath = segments.join("/");
  const targetPath = path.resolve(UPLOAD_DIR, relativePath);

  // Security: Prevent directory traversal attack
  if (!targetPath.startsWith(UPLOAD_DIR)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  if (!fs.existsSync(targetPath)) {
    return new NextResponse("File Not Found", { status: 404 });
  }

  const stat = fs.statSync(targetPath);
  if (!stat.isFile()) {
    return new NextResponse("Not a file", { status: 400 });
  }

  const fileBuffer = fs.readFileSync(targetPath);
  const ext = path.extname(targetPath).toLowerCase();
  let contentType = "application/octet-stream";
  const headers: Record<string, string> = {
    "Content-Length": stat.size.toString(),
    "Cache-Control": "public, max-age=31536000, immutable",
    "X-Content-Type-Options": "nosniff",
  };

  if (ext === ".pdf") {
    contentType = "application/pdf";
    const filename = path.basename(targetPath);
    headers["Content-Disposition"] = `inline; filename="${filename}"`;
  } else if (ext === ".webp") {
    contentType = "image/webp";
  } else if (ext === ".png") {
    contentType = "image/png";
  } else if (ext === ".jpg" || ext === ".jpeg") {
    contentType = "image/jpeg";
  }

  headers["Content-Type"] = contentType;

  return new NextResponse(fileBuffer, {
    status: 200,
    headers,
  });
}
