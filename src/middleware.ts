import { NextResponse, type NextRequest } from "next/server";
import {
  detectLocale,
  LOCALE_COOKIE,
  LOCALE_MAX_AGE,
  isLocale,
} from "@/i18n/config";

export function middleware(request: NextRequest) {
  const existing = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(existing)) {
    return NextResponse.next();
  }

  const locale = detectLocale(request.headers.get("accept-language"));
  const response = NextResponse.next();
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: LOCALE_MAX_AGE,
    sameSite: "lax",
  });
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
