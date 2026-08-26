"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import {
  getInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  getClientByInvoiceId,
  updateClient,
} from "@/lib/db";
import { buildDocumentSnapshot } from "@/lib/clientPortal";
import type { Invoice } from "@/lib/types";

export async function fetchInvoices(): Promise<Invoice[]> {
  if (!(await requireAdmin())) return [];
  return getInvoices();
}

export async function fetchInvoice(id: string): Promise<Invoice | null> {
  if (!(await requireAdmin())) return null;
  return getInvoice(id);
}

export async function addInvoice(invoice: Invoice): Promise<Invoice> {
  if (!(await requireAdmin())) throw new Error("Admin session required");
  const created = await createInvoice(invoice);
  revalidatePath("/admin");
  revalidatePath("/invoice-template");
  return created;
}

export async function editInvoice(id: string, patch: Partial<Invoice>): Promise<Invoice | null> {
  if (!(await requireAdmin())) return null;
  const updated = await updateInvoice(id, patch);
  if (updated) {
    // Live-sync: any invoice/quote edit (items, totals, status, dates, notes)
    // rebuilds the linked client portal's document snapshot so the client
    // always sees the latest version — no card round-trip, no stale numbers.
    const linked = await getClientByInvoiceId(id);
    if (linked?.id) {
      await updateClient(linked.id, { document: buildDocumentSnapshot(updated) });
    }
  }
  revalidatePath("/admin");
  revalidatePath("/invoice-template");
  revalidatePath(`/invoice-template/${id}`);
  return updated;
}

export async function removeInvoice(id: string): Promise<boolean> {
  if (!(await requireAdmin())) return false;
  const ok = await deleteInvoice(id);
  if (ok) revalidatePath("/admin");
  return ok;
}
