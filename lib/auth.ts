import "server-only";
import { cookies } from "next/headers";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

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

/**
 * Guard for server actions that require an authenticated admin session.
 * Returns true when the session is valid, false otherwise. Server actions
 * should return empty/default data when this returns false so the client
 * never sees an error overlay.
 */
export async function requireAdmin(): Promise<boolean> {
  return isAdminAuthenticated();
}

// ─── Client Portal Auth ───────────────────────────────────────────────────────

export const CLIENT_SESSION_COOKIE = "jordanpeters_client_session";

// The client session cookie holds a signed token (username + HMAC signature)
// rather than the bare username, so it can't be forged by guessing or copying
// a username. The signing key comes from SESSION_SECRET, falling back to the
// admin PIN so the studio works without extra environment setup.
function clientSessionSecret(): string {
  return process.env.SESSION_SECRET || `jp-client-session::${process.env.ADMIN_PIN || "unconfigured"}`;
}

function clientSessionToken(username: string): string {
  return createHmac("sha256", clientSessionSecret())
    .update(`client-session::${username}`)
    .digest("hex")
    .slice(0, 32);
}

export async function createClientSession(username: string): Promise<void> {
  const cookieStore = await cookies();
  const token = `${username}.${clientSessionToken(username)}`;
  cookieStore.set(CLIENT_SESSION_COOKIE, token, {
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

/**
 * Reads and verifies the signed client session cookie.
 * Returns the username only when the HMAC signature checks out, otherwise null
 * (the caller treats it as logged out). Legacy unsigned cookies are rejected.
 */
export async function getClientSessionUsername(): Promise<string | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(CLIENT_SESSION_COOKIE)?.value;
  if (!raw) return null;
  const dot = raw.lastIndexOf(".");
  if (dot <= 0 || dot === raw.length - 1) return null;
  const username = raw.slice(0, dot);
  const signature = raw.slice(dot + 1);
  const expected = Buffer.from(clientSessionToken(username));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length) return null;
  if (!timingSafeEqual(expected, actual)) return null;
  return username;
}
