import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "node:crypto";

// ─── Admin Auth ───────────────────────────────────────────────────────────────

export const ADMIN_SESSION_COOKIE = "jordanpeters_admin_session";

function sessionToken(pin: string): string {
  return createHash("sha256").update(`jordanpeters-admin-session::${pin}`).digest("hex");
}

export async function createAdminSession(): Promise<void> {
  const adminPin = process.env.ADMIN_PIN;
  if (!adminPin) {
    console.warn("[auth] ADMIN_PIN is not set — cannot create an admin session.");
    return;
  }
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, sessionToken(adminPin), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const adminPin = process.env.ADMIN_PIN;
  if (!adminPin) return false;
  const cookieStore = await cookies();
  const stored = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!stored) return false;
  const expected = Buffer.from(sessionToken(adminPin));
  const actual = Buffer.from(stored);
  if (expected.length !== actual.length) return false;
  return timingSafeEqual(expected, actual);
}

// ─── Client Portal Auth ───────────────────────────────────────────────────────

export const CLIENT_SESSION_COOKIE = "jordanpeters_client_session";

export async function createClientSession(username: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(CLIENT_SESSION_COOKIE, username, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroyClientSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CLIENT_SESSION_COOKIE);
}

export async function getClientSessionUsername(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(CLIENT_SESSION_COOKIE)?.value ?? null;
}
