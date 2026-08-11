"use server";

import { revalidatePath } from "next/cache";
import {
  getInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} from "@/lib/db";
import type { Invoice } from "@/lib/types";

export async function fetchInvoices(): Promise<Invoice[]> {
  return getInvoices();
}

export async function fetchInvoice(id: string): Promise<Invoice | null> {
  return getInvoice(id);
}

export async function addInvoice(invoice: Invoice): Promise<Invoice> {
  const created = await createInvoice(invoice);
  revalidatePath("/admin");
  revalidatePath("/invoice-template");
  return created;
}

export async function editInvoice(id: string, patch: Partial<Invoice>): Promise<Invoice | null> {
  const updated = await updateInvoice(id, patch);
  revalidatePath("/admin");
  revalidatePath("/invoice-template");
  revalidatePath(`/invoice-template/${id}`);
  return updated;
}

export async function removeInvoice(id: string): Promise<boolean> {
  const ok = await deleteInvoice(id);
  if (ok) revalidatePath("/admin");
  return ok;
}
