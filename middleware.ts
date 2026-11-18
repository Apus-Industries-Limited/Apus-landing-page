import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Rate limit the public contact endpoint: 5 submissions / 10 min per IP.
  if (pathname === "/api/contact" && req.method === "POST") {
    if (!rateLimit(`contact:${clientIp(req)}`, 5, 10 * 60 * 1000)) {
      return NextResponse.json({ ok: false, error: "Too many requests. Please try again later." }, { status: 429 });
    }
  }

  // Rate limit auth: 10 attempts / 10 min per IP.
  if (pathname.startsWith("/api/auth") && req.method === "POST") {
    if (!rateLimit(`auth:${clientIp(req)}`, 10, 10 * 60 * 1000)) {
      return NextResponse.json({ ok: false, error: "Too many login attempts. Please try again later." }, { status: 429 });
    }
  }

  // Protect /admin (except the login page itself).
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/contact", "/api/auth/:path*"],
};
