import type { NextRequest } from "next/server";

/**
 * CSRF defence for state-changing client API routes.
 *
 * SameSite=strict cookies already blunt most cross-site attacks; this adds an
 * explicit same-origin check on the Origin (or, failing that, Referer) header
 * so a request from a different origin is rejected outright. Requests with no
 * origin header are refused too — the browser always sends Origin on
 * cross-origin and same-origin POST/PATCH requests.
 */
export function isSameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin") || req.headers.get("referer");
  if (!origin) return false;
  try {
    return new URL(origin).origin === req.nextUrl.origin;
  } catch {
    return false;
  }
}
