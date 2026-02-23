import { NextResponse } from "next/server";

export function middleware(request) {
  const role = request.cookies.get("user_role")?.value;
  const { pathname } = request.nextUrl;

  // 🔹 Allow public routes
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  // 🔹 Admin protection
  if (pathname.startsWith("/admin")) {
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 🔹 Doctor protection
  if (pathname.startsWith("/doctor")) {
    if (role !== "doctor") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/doctor/:path*"],
};
