export { default } from "next-auth/middleware"
 
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Redirect if not authenticated and trying to access any protected route
  if (
    ["/admin", "/users", "/dashboard", "/profile"].some((route) =>
      pathname.startsWith(route)
    ) &&
    !token
  ) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // Admin-only routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/users")) {
    if (token?.role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  //  Manager + Admin routes
  if (pathname.startsWith("/dashboard")) {
    if (!["admin", "manager"].includes(token?.role || "")) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  // User + Manager + Admin routes
  if (pathname.startsWith("/profile")) {
    if (!["admin", "manager", "user"].includes(token?.role || "")) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }
  
export const config = {
  matcher: [
    "/admin/:path*",
    "/users/:path*",
    "/dashboard/:path*",
    "/profile/:path*"
  ],
};