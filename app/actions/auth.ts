"use server";

import {
  createAdminSession,
  destroyAdminSession,
  isAdminAuthenticated,
  createClientSession,
  destroyClientSession,
} from "@/lib/auth";
import { getClientByUsername } from "@/lib/db";

export async function loginAdmin(pin: string): Promise<{ success: boolean; error?: string }> {
  const adminPin = process.env.ADMIN_PIN;
  if (!adminPin) {
    console.warn("[auth] ADMIN_PIN is not configured — admin login rejected.");
    return { success: false, error: "Admin PIN is not configured on the server." };
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
  const account = await getClientByUsername(username.trim());
  if (!account || account.password !== password) {
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
