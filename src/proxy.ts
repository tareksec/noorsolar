import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const secretKey =
  process.env.AUTH_SECRET ||
  "dev-insecure-secret-key-for-local-testing-purposes-only-32";
const encodedKey = new TextEncoder().encode(secretKey);

const handleI18nRouting = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Protect /admin routes (except /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const sessionCookie = request.cookies.get("noor_admin_session")?.value;

    if (!sessionCookie) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      await jwtVerify(sessionCookie, encodedKey, {
        algorithms: ["HS256"],
      });
      return NextResponse.next();
    } catch {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Pass non-localized routes directly through
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/uploads") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  // 3. Internationalized public routes
  return handleI18nRouting(request);
}

// Next.js 16 supports either named export proxy or default export
export default proxy;

export const config = {
  // Match all request paths except:
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - _vercel (Vercel specific files)
  // - Static files with extensions (e.g. /favicon.ico, /icon.png, etc.)
  // - /uploads (file uploads)
  // - /api (API routes)
  matcher: [
    "/((?!api|uploads|_next|_vercel|.*\\..*).*)",
    "/admin/:path*",
  ],
};
