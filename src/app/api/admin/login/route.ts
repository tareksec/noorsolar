import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createSessionToken, setSessionCookie } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

    // Rate limit: 5 attempts per 10 minutes
    const rateCheck = checkRateLimit(`login:${ip}`, 5, 10 * 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { success: false, error: "Too many login attempts. Please wait 10 minutes before trying again." },
        { status: 429 }
      );
    }

    let email = "";
    let password = "";

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await request.json();
      email = (body.email || "").trim().toLowerCase();
      password = body.password || "";
    } else {
      const formData = await request.formData();
      email = ((formData.get("email") as string) || "").trim().toLowerCase();
      password = (formData.get("password") as string) || "";
    }

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    let admin = null;
    try {
      admin = await db.adminUser.findUnique({ where: { email } });

      if (!admin) {
        const totalAdmins = await db.adminUser.count();
        if (totalAdmins === 0) {
          const expectedEmail = (process.env.ADMIN_EMAIL || "admin@noorsolaren.com").toLowerCase();
          const expectedPass = process.env.ADMIN_PASSWORD || "AdminPassword2026!";
          if (email === expectedEmail && password === expectedPass) {
            const passwordHash = await bcrypt.hash(expectedPass, 12);
            admin = await db.adminUser.create({
              data: {
                email: expectedEmail,
                passwordHash,
              },
            });
          }
        }
      }
    } catch (dbErr: unknown) {
      console.error("Database error during admin login API:", dbErr);
      const msg = dbErr instanceof Error ? dbErr.message : String(dbErr);
      return NextResponse.json(
        { success: false, error: `Database error: ${msg.slice(0, 160)}` },
        { status: 500 }
      );
    }

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const token = await createSessionToken(admin.id, admin.email);
    const isHttps = process.env.NEXT_PUBLIC_SITE_URL?.startsWith("https://") ?? false;
    const response = NextResponse.json({ success: true });
    response.cookies.set("noor_admin_session", token, {
      httpOnly: true,
      secure: isHttps,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Login route error:", error);
    return NextResponse.json(
      { success: false, error: "Authentication service error. Please try again." },
      { status: 500 }
    );
  }
}
