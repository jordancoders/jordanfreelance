"use server";

import { revalidatePath } from "next/cache";
import {
  getClients,
  getClient,
  getClientByUsername,
  getClientByInvoiceId,
  createClient,
  updateClient,
  deleteClient,
} from "@/lib/db";
import type { ClientPortalAccount } from "@/lib/types";

export async function fetchClients(): Promise<ClientPortalAccount[]> {
  return getClients();
}

export async function fetchClient(id: string): Promise<ClientPortalAccount | null> {
  return getClient(id);
}

export async function fetchClientByUsername(username: string): Promise<ClientPortalAccount | null> {
  return getClientByUsername(username);
}

export async function addClient(client: ClientPortalAccount): Promise<ClientPortalAccount> {
  const created = await createClient(client);
  revalidatePath("/admin");
  return created;
}

export async function editClient(id: string, patch: Partial<ClientPortalAccount>): Promise<ClientPortalAccount | null> {
  const updated = await updateClient(id, patch);
  revalidatePath("/admin");
  revalidatePath("/client/dashboard");
  return updated;
}

export async function removeClient(id: string): Promise<boolean> {
  const ok = await deleteClient(id);
  if (ok) revalidatePath("/admin");
  return ok;
}

/**
 * Pushes a signed declaration captured in the admin studio onto the client
 * portal linked to that invoice, so the client sees their signature (or an
 * admin-captured one) the next time they open their dashboard.
 */
export async function updateLinkedClientDeclaration(
  invoiceId: string,
  declaration: ClientPortalAccount["declaration"]
): Promise<boolean> {
  const client = await getClientByInvoiceId(invoiceId);
  if (!client || !client.id) return false;
  await updateClient(client.id, { declaration });
  revalidatePath("/admin");
  revalidatePath("/client/dashboard");
  return true;
}
