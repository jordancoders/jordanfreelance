"use server";

import { timingSafeEqual } from "node:crypto";
import {
  createAdminSession,
  destroyAdminSession,
  isAdminAuthenticated,
  createClientSession,
  destroyClientSession,
} from "@/lib/auth";
import { getClientByUsername } from "@/lib/db";
import { checkRateLimit } from "@/lib/rateLimit";
import { verifyTurnstile } from "@/lib/turnstile";

export async function loginAdmin(pin: string, turnstileToken?: string): Promise<{ success: boolean; error?: string }> {
  // Cloudflare Turnstile verification (skipped if TURNSTILE_SECRET_KEY not set).
  const captcha = await verifyTurnstile(turnstileToken);
  if (!captcha.success) {
    return { success: false, error: captcha.error || "Captcha failed." };
  }

  const adminPin = process.env.ADMIN_PIN;
  if (!adminPin) {
    console.warn("[auth] ADMIN_PIN is not configured — admin login rejected.");
    return { success: false, error: "Admin PIN is not configured on the server." };
  }
  const rl = await checkRateLimit("admin-login");
  if (!rl.ok) {
    return { success: false, error: `Too many attempts — try again in ${Math.ceil((rl.retryAfterSeconds || 0) / 60)} minutes.` };
  }
  // Timing-safe comparison to prevent brute-force timing attacks.
  if (!pin) return { success: false, error: "Invalid passcode." };
  const stored = Buffer.from(adminPin);
  const supplied = Buffer.from(pin);
  if (stored.length !== supplied.length || !timingSafeEqual(stored, supplied)) {
    return { success: false, error: "Invalid passcode." };
  }
  await createAdminSession();
  return { success: true };
}

export async function logoutAdmin(): Promise<void> {
  await destroyAdminSession();
}

export async function checkAdminAuth(): Promise<boolean> {
  return isAdminAuthenticated();
}

export async function loginClient(
  username: string,
  password: string,
  turnstileToken?: string,
): Promise<{ success: boolean; error?: string }> {
  // Cloudflare Turnstile verification (skipped if TURNSTILE_SECRET_KEY not set).
  const captcha = await verifyTurnstile(turnstileToken);
  if (!captcha.success) {
    return { success: false, error: captcha.error || "Captcha failed." };
  }

  if (!username.trim() || !password.trim()) {
    return { success: false, error: "Please enter your username and password." };
  }
  const rl = await checkRateLimit("client-login", 8);
  if (!rl.ok) {
    return { success: false, error: `Too many attempts — try again in ${Math.ceil((rl.retryAfterSeconds || 0) / 60)} minutes.` };
  }
  const account = await getClientByUsername(username.trim());
  if (!account) {
    return { success: false, error: "Invalid username or password." };
  }
  // Timing-safe comparison to prevent brute-force timing attacks.
  const stored = Buffer.from(account.password);
  const supplied = Buffer.from(password);
  if (stored.length !== supplied.length) {
    return { success: false, error: "Invalid username or password." };
  }
  const passwordOk = timingSafeEqual(stored, supplied);
  if (!passwordOk) {
    return { success: false, error: "Invalid username or password." };
  }
  if (account.status !== "approved") {
    return { success: false, error: "Your portal is still pending approval." };
  }
  await createClientSession(account.username);
  return { success: true };
}

export async function logoutClient(): Promise<void> {
  await destroyClientSession();
}
