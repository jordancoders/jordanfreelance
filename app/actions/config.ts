"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { getConfig, saveConfig } from "@/lib/db";
import type { SiteConfig } from "@/lib/types";

export async function fetchConfig(): Promise<SiteConfig | null> {
  return getConfig();
}

export async function updateConfig(config: SiteConfig): Promise<SiteConfig> {
  if (!(await requireAdmin())) throw new Error("Admin session required");
  const saved = await saveConfig(config);
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin");
  return saved;
}
