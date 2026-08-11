"use server";

import { revalidatePath } from "next/cache";
import { getConfig, saveConfig } from "@/lib/db";
import type { SiteConfig } from "@/lib/types";

export async function fetchConfig(): Promise<SiteConfig | null> {
  return getConfig();
}

export async function updateConfig(config: SiteConfig): Promise<SiteConfig> {
  const saved = await saveConfig(config);
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin");
  return saved;
}
