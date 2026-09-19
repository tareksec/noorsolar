"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createSessionToken, setSessionCookie, clearSessionCookie } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export type AuthActionResult = {
  success: boolean;
  error?: string;
};

export async function loginAdminAction(
  _prevState: unknown,
  formData: FormData
): Promise<AuthActionResult> {
  try {
    const headerList = await headers();
    const forwarded = headerList.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

    // Rate limit: 5 attempts per 10 minutes
    const rateCheck = checkRateLimit(`login:${ip}`, 5, 10 * 60 * 1000);
    if (!rateCheck.success) {
      return {
        success: false,
        error: "Too many login attempts. Please wait 10 minutes before trying again.",
      };
    }

    const email = (formData.get("email") as string)?.trim().toLowerCase();
    const password = (formData.get("password") as string) || "";

    if (!email || !password) {
      return { success: false, error: "Email and password are required." };
    }

    const admin = await db.adminUser.findUnique({ where: { email } });
    if (!admin) {
      return { success: false, error: "Invalid email or password." };
    }

    const isValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isValid) {
      return { success: false, error: "Invalid email or password." };
    }

    const token = await createSessionToken(admin.id, admin.email);
    await setSessionCookie(token);

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}

export async function logoutAdminAction() {
  await clearSessionCookie();
  redirect("/admin/login");
}
