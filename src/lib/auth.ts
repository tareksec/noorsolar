import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const PLACEHOLDER_AUTH_SECRET = "change-me-long-random-string-at-least-32-chars-super-secret";
const DEV_FALLBACK_SECRET = "dev-insecure-secret-key-for-local-testing-purposes-only-32";

function getEncodedKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (process.env.NODE_ENV === "production") {
    if (!secret || secret.length < 32 || secret === PLACEHOLDER_AUTH_SECRET) {
      throw new Error(
        "FATAL: In production, AUTH_SECRET must be set, at least 32 characters long, and different from the placeholder in .env.example."
      );
    }
    return new TextEncoder().encode(secret);
  }
  return new TextEncoder().encode(secret || DEV_FALLBACK_SECRET);
}

const COOKIE_NAME = "noor_admin_session";

export interface SessionPayload {
  userId: string;
  email: string;
  expiresAt: number;
}

export async function createSessionToken(userId: string, email: string): Promise<string> {
  const encodedKey = getEncodedKey();
  return new SignJWT({ userId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const encodedKey = getEncodedKey();
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });

    return {
      userId: payload.userId as string,
      email: payload.email as string,
      expiresAt: (payload.exp || 0) * 1000,
    };
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;
  return verifySessionToken(token);
}
