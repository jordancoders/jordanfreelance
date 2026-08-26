import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware that adds a layer of bot/script protection:
 *
 * 1. Blocks requests with no User-Agent (curl, scripts, bots).
 * 2. Blocks known bot/crawler user-agents from sensitive routes.
 * 3. Adds security headers to all responses.
 */

const BLOCKED_BOTS = [
  /python/i,
  /go-http/i,
  /curl/i,
  /wget/i,
  /scrapy/i,
  /headless/i,
  /phantom/i,
  /selenium/i,
  /puppeteer/i,
  /playwright/i,
  /node-fetch/i,
  /axios/i,
  /requests\//i,
  /httpx/i,
  /aiohttp/i,
  /bot\b/i,
  /spider/i,
  /crawl/i,
  /scanner/i,
  /nikto/i,
  /sqlmap/i,
  /nmap/i,
];

// Routes that need bot protection (admin, client portal, server actions, API)
const SENSITIVE_PREFIXES = ["/admin", "/client", "/api", "/_next/data"];

function isSensitiveRoute(pathname: string): boolean {
  return SENSITIVE_PREFIXES.some((p) => pathname.startsWith(p));
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ua = req.headers.get("user-agent") || "";

  // --- Bot blocking for sensitive routes ---
  if (isSensitiveRoute(pathname)) {
    // Block requests with no User-Agent at all (scripts, curl, etc.)
    if (!ua) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Block known bot/script user-agents
    for (const pattern of BLOCKED_BOTS) {
      if (pattern.test(ua)) {
        return new NextResponse("Forbidden", { status: 403 });
      }
    }
  }

  // --- Security headers on all responses ---
  const res = NextResponse.next();
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return res;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/client/:path*",
    "/api/:path*",
    "/_next/data/:path*",
  ],
};
