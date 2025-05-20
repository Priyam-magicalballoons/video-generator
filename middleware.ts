import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("user")?.value;

  if (pathname === "/vitiligo-awareness-month/login" && token) {
    return NextResponse.redirect(
      new URL("/vitiligo-awareness-month/dashboard", request.url)
    );
  }

  const protectedRoutes = [
    "/",
    "/doctors",
    "/vitiligo-awareness-month",
    "/vitiligo-awareness-month/i-pledge",
    "/vitiligo-awareness-month/video-module",
    "/vitiligo-awareness-month/dashboard",
    "/vitiligo-awareness-month/i-pledge",
    "/vitiligo-awareness-month/poster",
    "/vitiligo-awareness-month/reports",
  ];
  const isProtected = protectedRoutes.includes(pathname);

  if (isProtected && !token) {
    return NextResponse.redirect(
      new URL("/vitiligo-awareness-month/login", request.url)
    );
  }
  return NextResponse.next();
}
