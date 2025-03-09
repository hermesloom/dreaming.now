import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

// This function handles redirects and locale detection
const nextIntlMiddleware = createMiddleware({
  locales: ["en", "de"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});

export default function middleware(request: NextRequest) {
  // Step 1: Check for basic routes that don't need locale handling
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Step 2: For root requests, redirect to default locale
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/en", request.url));
  }

  // Step 3: Handle locale-specific routes
  return nextIntlMiddleware(request);
}

export const config = {
  // Skip all internal paths and API routes
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
