"use server";

import { revalidatePath } from "next/cache";
import { exportAll, importAll } from "@/lib/db";
import type { BackupPayload } from "@/lib/types";

export async function exportData(): Promise<BackupPayload> {
  const data = await exportAll();
  return { ...data, exportedAt: new Date().toISOString() };
}

export async function importData(payload: BackupPayload): Promise<void> {
  await importAll(payload);
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/projects");
  revalidatePath("/testimonials");
  revalidatePath("/client/dashboard");
}
