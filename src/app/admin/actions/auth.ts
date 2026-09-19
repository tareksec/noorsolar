"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createSessionToken, setSessionCookie, clearSessionCookie, getSession } from "@/lib/auth";
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

export async function changePasswordAction(
  _prevState: unknown,
  formData: FormData
): Promise<AuthActionResult> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized. Please log in." };
  }

  try {
    const headerList = await headers();
    const forwarded = headerList.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

    // Rate limit: 5 attempts per 15 minutes
    const rateCheck = checkRateLimit(`change-password:${session.userId}:${ip}`, 5, 15 * 60 * 1000);
    if (!rateCheck.success) {
      return {
        success: false,
        error: "Too many password change attempts. Please wait 15 minutes before trying again.",
      };
    }

    const currentPassword = (formData.get("currentPassword") as string) || "";
    const newPassword = (formData.get("newPassword") as string) || "";
    const confirmPassword = (formData.get("confirmPassword") as string) || "";

    if (!currentPassword || !newPassword || !confirmPassword) {
      return { success: false, error: "All password fields are required." };
    }

    if (newPassword.length < 12) {
      return {
        success: false,
        error: "New password must be at least 12 characters long.",
      };
    }

    if (newPassword !== confirmPassword) {
      return {
        success: false,
        error: "New password and confirmation do not match.",
      };
    }

    const admin = await db.adminUser.findUnique({ where: { id: session.userId } });
    if (!admin) {
      return { success: false, error: "Admin user not found." };
    }

    const isCurrentValid = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!isCurrentValid) {
      return { success: false, error: "Current password is incorrect." };
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await db.adminUser.update({
      where: { id: admin.id },
      data: { passwordHash: newHash },
    });

    return { success: true };
  } catch (error) {
    console.error("Change password error:", error);
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}

export async function logoutAdminAction() {
  await clearSessionCookie();
  redirect("/admin/login");
}