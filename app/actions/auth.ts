"use server";

import {
  createAdminSession,
  destroyAdminSession,
  isAdminAuthenticated,
  createClientSession,
  destroyClientSession,
} from "@/lib/auth";
import { getClientByUsername } from "@/lib/db";
import { checkRateLimit } from "@/lib/rateLimit";

export async function loginAdmin(pin: string): Promise<{ success: boolean; error?: string }> {
  const adminPin = process.env.ADMIN_PIN;
  if (!adminPin) {
    console.warn("[auth] ADMIN_PIN is not configured — admin login rejected.");
    return { success: false, error: "Admin PIN is not configured on the server." };
  }
  const rl = await checkRateLimit("admin-login");
  if (!rl.ok) {
    return { success: false, error: `Too many attempts — try again in ${Math.ceil((rl.retryAfterSeconds || 0) / 60)} minutes.` };
  }
  if (!pin || pin !== adminPin) {
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
  password: string
): Promise<{ success: boolean; error?: string }> {
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
  // Accept either: (a) matching password, or (b) matching invite code.
  // The invite code is sent as the password field when the client uses it.
  const passwordOk = account.password === password;
  const inviteOk = account.inviteCode ? account.inviteCode === password : false;
  if (!passwordOk && !inviteOk) {
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
